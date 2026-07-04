import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityModalService } from '../../services/identity-modal.service';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { PAIS_BILLING_FIELDS, Pais9, ViaFacturacion } from '../../models/identity-flow-v2.models';

// Reordenado según Plan2.md (docs/validacion/Plan2.md, Fase 3, líneas 700-913):
// el KYC del dueño de cuenta corre completo — email, OTP email, documento
// (autodetección, sin selector manual), prueba de vida, celular + OTP — ANTES
// de preguntar nada de facturación. Recién con el KYC aprobado se pregunta la
// rama de 3 vías (líneas 806-817): usar mis datos / otra persona natural /
// persona jurídica (KYB con RN-20 y RN-23). El formulario fiscal por país
// (Parte 4 del plan) se implementa en un paso posterior.

type Screen = 'screen0' | 'screen1' | 'screen2' | 'screen3';

type SubStep =
  | 'email' | 'otp-email' | 'doc-frente' | 'doc-reverso' | 'liveness' | 'telefono' | 'otp-telefono' | 'procesando'
  | 'via-facturacion'
  | 'via-confirmar-mis-datos'
  | 'via-tercero-email' | 'via-tercero-otp-email' | 'via-tercero-doc-frente' | 'via-tercero-doc-reverso' | 'via-tercero-liveness' | 'via-tercero-procesando' | 'via-tercero-resultado'
  | 'via-kyb-buscar' | 'via-kyb-confirmar' | 'via-kyb-representante-info' | 'via-kyb-procesando' | 'via-kyb-pendiente';

/** Pasos del KYC del dueño de cuenta — únicos que cuentan para la barra de progreso "N / 8". */
const STEPS: SubStep[] = ['email', 'otp-email', 'doc-frente', 'doc-reverso', 'liveness', 'telefono', 'otp-telefono', 'procesando'];

/** Pasos del KYC modular de un tercero (otra persona natural, o representante legal — RN-20). */
const TERCERO_STEPS: SubStep[] = ['via-tercero-email', 'via-tercero-otp-email', 'via-tercero-doc-frente', 'via-tercero-doc-reverso', 'via-tercero-liveness', 'via-tercero-procesando'];

const OTP_MAX_INTENTOS = 3;
const OTP_RESEND_SECONDS = 60;
/** Código "incorrecto" reservado para poder demostrar el estado de error en el prototipo. */
const OTP_CODE_WRONG_DEMO = '000000';

/** Empresas mock por país (9 países del Excel) para el buscador KYB sin digitar NIT. */
const EMPRESAS_MOCK_V2: Record<Pais9, string[]> = {
  CO: ['TechStore SAS', 'Distribuidora Sur SAS', 'Comercial Norte Ltda.'],
  MX: ['Comercial MX SA de CV', 'Distribuidora Bajío SA', 'Tech Solutions SAPI'],
  AR: ['Distribuidora Sur S.A.', 'Importadora Norte SRL', 'Comercial Delta SA'],
  PE: ['Distribuidora Lima SAC', 'Comercial Andina EIRL', 'Importadora Perú SA'],
  GT: ['Distribuidora Guatemala S.A.', 'Comercial Quetzal Ltda.'],
  CR: ['Distribuidora Costa Rica S.A.', 'Comercial Tica Ltda.'],
  EC: ['Distribuidora Quito Cía. Ltda.', 'Comercial Guayas S.A.'],
  CL: ['Distribuciones Santiago SpA', 'Comercial Pacífico Ltda.'],
  PY: ['Distribuidora Asunción S.A.', 'Comercial Guaraní SRL'],
};

@Component({
  selector: 'app-identity-sumsub-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './identity-sumsub-modal.component.html',
  styleUrls: ['./identity-sumsub-modal.component.scss'],
})
export class IdentitySumsubModalComponent {
  private modalSvc  = inject(IdentityModalService);
  private stateSvc  = inject(IdentityDemoStateService);
  private stateV2   = inject(IdentityDemoStateV2Service);
  private router    = inject(Router);

  readonly isOpen    = this.modalSvc.isOpen;
  readonly config    = this.modalSvc.config;
  readonly resultado = this.stateSvc.resultadoModal;

  /** Motor de validación: Truora solo con CO + Natural desde Fase 2; Sumsub el resto desde Fase 3. */
  readonly motorLabel = computed(() => (this.stateV2.motorValidacion() === 'truora' ? 'Truora' : 'Sumsub'));
  readonly esTruora    = computed(() => this.stateV2.motorValidacion() === 'truora');

  readonly documentoPrincipalLabel = computed(() =>
    PAIS_BILLING_FIELDS[this.stateV2.pais()]?.documentoPrincipal ?? 'documento de identidad'
  );

  currentScreen  = signal<Screen>('screen0');
  currentSubStep = signal<SubStep>('email');
  exitConfirm    = signal(false);
  checklistItems = signal([false, false, false, false, false]);

  /** true mientras el paso actual pertenece al KYC principal (barra de progreso "N / 8"). */
  readonly isMainKycStep = computed(() => STEPS.includes(this.currentSubStep()));

  // Paso 1/2 — Email + OTP
  emailCorreo       = signal('');
  otpEmailCode      = signal('');
  otpEmailError     = signal(false);
  otpEmailIntentos  = signal(OTP_MAX_INTENTOS);
  otpEmailBloqueado = signal(false);
  otpEmailResendIn  = signal(OTP_RESEND_SECONDS);
  private otpEmailTimer?: ReturnType<typeof setInterval>;

  // Paso 3 — Documento (autodetección, sin selector manual — anti-hallucination rule)
  docFrenteCapturado  = signal(false);
  docReversoCapturado = signal(false);

  // Paso 4 — Prueba de vida
  livenessCapturada = signal(false);

  // Paso 5 — Teléfono + OTP
  telefono            = signal('');
  otpTelefonoCode     = signal('');
  otpTelefonoError    = signal(false);
  otpTelefonoIntentos = signal(OTP_MAX_INTENTOS);
  otpTelefonoBloqueado = signal(false);
  otpTelefonoResendIn = signal(OTP_RESEND_SECONDS);
  private otpTelefonoTimer?: ReturnType<typeof setInterval>;

  procesandoProgress = signal(0);

  // Paso 6 — Facturación: rama de 3 vías (Plan2.md líneas 806-817)
  viaFacturacion = signal<ViaFacturacion | null>(null);

  // Vía (b): KYC modular de un tercero (otra persona natural, o representante legal)
  terceroModo         = signal<'otra-persona-natural' | 'representante-legal'>('otra-persona-natural');
  terceroLabel        = computed(() => (this.terceroModo() === 'representante-legal' ? 'el representante legal' : 'esa persona'));
  terceroEmail        = signal('');
  terceroOtpCode      = signal('');
  terceroOtpError     = signal(false);
  terceroOtpIntentos  = signal(OTP_MAX_INTENTOS);
  terceroOtpBloqueado = signal(false);
  terceroOtpResendIn  = signal(OTP_RESEND_SECONDS);
  private terceroOtpTimer?: ReturnType<typeof setInterval>;
  terceroDocFrenteCapturado  = signal(false);
  terceroDocReversoCapturado = signal(false);
  terceroLivenessCapturada   = signal(false);
  terceroProcesandoProgress  = signal(0);

  // Vía (c): KYB — búsqueda de empresa sin digitar NIT (Plan2.md líneas 772-817)
  kybPais                = signal<Pais9>(this.stateV2.pais());
  kybNombreEmpresa       = signal('');
  kybBuscado             = signal(false);
  kybResultados          = signal<string[]>([]);
  kybEmpresaSeleccionada = signal<string | null>(null);

  readonly representanteYaValidado = computed(() => this.stateV2.representanteLegalValidado());

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.currentScreen.set(this.config().startScreen);
        this.currentSubStep.set('email');
        this.exitConfirm.set(false);
        this.checklistItems.set([false, false, false, false, false]);
        this.emailCorreo.set('');
        this.resetOtp('email');
        this.docFrenteCapturado.set(false);
        this.docReversoCapturado.set(false);
        this.livenessCapturada.set(false);
        this.telefono.set('');
        this.resetOtp('telefono');
        this.viaFacturacion.set(null);
        this.resetTercero();
        this.kybPais.set(this.stateV2.pais());
        this.kybNombreEmpresa.set('');
        this.kybBuscado.set(false);
        this.kybResultados.set([]);
        this.kybEmpresaSeleccionada.set(null);
      }
    }, { allowSignalWrites: true });
  }

  readonly screenIndex = computed(() => {
    const map: Record<Screen, number> = { screen0: 0, screen1: 1, screen2: 2, screen3: 3 };
    return map[this.currentScreen()];
  });

  readonly subStepIndex = computed(() => STEPS.indexOf(this.currentSubStep()));
  readonly subStepLabel = computed(() => `${this.subStepIndex() + 1} / ${STEPS.length}`);

  readonly terceroSubStepIndex = computed(() => TERCERO_STEPS.indexOf(this.currentSubStep()));
  readonly terceroSubStepLabel = computed(() => `${this.terceroSubStepIndex() + 1} / ${TERCERO_STEPS.length}`);

  readonly nextButtonLabel = computed(() => {
    switch (this.currentSubStep()) {
      case 'email':
      case 'telefono':
      case 'via-tercero-email': return 'Enviar código';
      case 'otp-email':
      case 'otp-telefono':
      case 'via-tercero-otp-email': return 'Verificar código';
      case 'via-facturacion': return 'Continuar';
      case 'via-confirmar-mis-datos': return 'Confirmar y continuar';
      case 'via-kyb-buscar': return 'Continuar';
      case 'via-kyb-confirmar': return 'Esta es mi empresa';
      case 'via-kyb-representante-info': return 'Continuar';
      default: return 'Siguiente';
    }
  });

  readonly origenTexto = computed(() => {
    const o = this.config().origen;
    const map: Record<string, string> = {
      retiro: 'Para activar tus retiros, necesitamos verificar tu identidad',
      dropicard: 'Para usar tu DropiCard, necesitamos verificar tu identidad',
      wallet: 'Para transferir saldo, necesitamos verificar tu identidad',
      pedidos: 'Ya tienes una venta — valida tu identidad para retirar las ganancias',
      home: 'Configura tu identidad para desbloquear retiros y más',
      facturacion: 'Valida tu identidad para completar tus datos de facturación',
      cuenta: 'Valida tu identidad para proteger tu cuenta',
    };
    return map[o] ?? 'Necesitamos verificar tu identidad';
  });

  readonly returnLabel = computed(() => {
    const o = this.config().origen;
    const map: Record<string, string> = {
      retiro:    'Volver a Retiros de saldo',
      dropicard: 'Volver a mi DropiCard',
      wallet:    'Volver a mi Wallet',
      pedidos:   'Volver a mis Pedidos',
      home:      'Ir al inicio',
      facturacion: 'Volver a Facturación',
      cuenta:    'Volver a mi Cuenta',
    };
    return map[o] ?? 'Volver';
  });

  readonly checklistLabels = [
    'Documento de identidad vigente y original (no fotocopias)',
    'Buena iluminación y cámara disponible',
    'Espacio tranquilo sin interrupciones (~5-10 min)',
    'Conexión estable a internet',
    'Tu celular a la mano para recibir un código',
  ];

  get allChecked(): boolean { return this.checklistItems().every(Boolean); }

  toggleChecklist(i: number): void {
    const arr = [...this.checklistItems()];
    arr[i] = !arr[i];
    this.checklistItems.set(arr);
  }

  goNext(): void {
    const s = this.currentScreen();
    if (s === 'screen0') { this.currentScreen.set('screen1'); return; }
    if (s === 'screen1') { this.currentScreen.set('screen2'); this.currentSubStep.set('email'); this.startResendCountdown('email'); return; }
    if (s === 'screen2') { this.advanceSubStep(); return; }
  }

  goBack(): void {
    const s = this.currentScreen();
    if (s === 'screen1') { this.currentScreen.set('screen0'); return; }
    if (s === 'screen2') {
      const current = this.currentSubStep();

      if (TERCERO_STEPS.includes(current)) {
        const i = TERCERO_STEPS.indexOf(current);
        if (i === 0) { this.currentSubStep.set('via-facturacion'); return; }
        this.currentSubStep.set(TERCERO_STEPS[i - 1]);
        return;
      }
      if (current === 'via-confirmar-mis-datos' || current === 'via-kyb-buscar') {
        this.currentSubStep.set('via-facturacion');
        return;
      }
      if (current === 'via-kyb-confirmar') { this.currentSubStep.set('via-kyb-buscar'); return; }
      if (current === 'via-facturacion') { this.currentSubStep.set('procesando'); return; }

      const i = STEPS.indexOf(current);
      if (i === 0) { this.currentScreen.set('screen1'); return; }
      this.currentSubStep.set(STEPS[i - 1]);
      return;
    }
  }

  private advanceSubStep(): void {
    const current = this.currentSubStep();

    if (current === 'otp-email') {
      if (!this.validateOtp('email')) return;
      this.stopResendCountdown('email');
    }
    if (current === 'otp-telefono') {
      if (!this.validateOtp('telefono')) return;
      this.stopResendCountdown('telefono');
    }
    if (current === 'via-tercero-otp-email') {
      if (!this.validateTerceroOtp()) return;
      this.stopResendCountdown('tercero');
    }

    // Pasos del KYC principal — avanza linealmente hasta 'procesando'.
    if (STEPS.includes(current)) {
      const i = STEPS.indexOf(current);
      if (i < STEPS.length - 1) {
        const next = STEPS[i + 1];
        this.currentSubStep.set(next);
        if (next === 'otp-email') this.startResendCountdown('email');
        if (next === 'otp-telefono') this.startResendCountdown('telefono');
        if (next === 'procesando') this.startProcesando();
      }
      return;
    }

    // Pregunta de facturación (Plan2.md líneas 806-817).
    if (current === 'via-facturacion') {
      const via = this.viaFacturacion();
      if (via === 'mis-datos') { this.currentSubStep.set('via-confirmar-mis-datos'); return; }
      if (via === 'otra-persona-natural') {
        this.terceroModo.set('otra-persona-natural');
        this.resetTercero();
        this.currentSubStep.set('via-tercero-email');
        return;
      }
      if (via === 'persona-juridica') { this.currentSubStep.set('via-kyb-buscar'); return; }
      return;
    }

    if (current === 'via-confirmar-mis-datos') {
      this.stateV2.setEstadoKyb('aprobado');
      this.currentScreen.set('screen3');
      return;
    }

    // KYC modular de tercero (otra persona natural o representante legal — RN-20).
    if (TERCERO_STEPS.includes(current)) {
      const i = TERCERO_STEPS.indexOf(current);
      if (i < TERCERO_STEPS.length - 1) {
        const next = TERCERO_STEPS[i + 1];
        this.currentSubStep.set(next);
        if (next === 'via-tercero-otp-email') this.startResendCountdown('tercero');
        if (next === 'via-tercero-procesando') this.startTerceroProcesando();
      }
      return;
    }

    if (current === 'via-tercero-resultado') {
      if (this.terceroModo() === 'otra-persona-natural') {
        this.stateV2.setEstadoKyb('aprobado');
        this.currentScreen.set('screen3');
      } else {
        this.currentSubStep.set('via-kyb-procesando');
        this.startKybProcesando();
      }
      return;
    }

    // KYB — búsqueda de empresa (Plan2.md líneas 772-786).
    if (current === 'via-kyb-buscar') {
      this.currentSubStep.set('via-kyb-confirmar');
      return;
    }

    if (current === 'via-kyb-confirmar') {
      // RN-20: si el representante legal ya está validado en Dropi, se reutiliza su verificación.
      this.currentSubStep.set('via-kyb-representante-info');
      return;
    }

    if (current === 'via-kyb-representante-info') {
      if (this.representanteYaValidado()) {
        this.currentSubStep.set('via-kyb-procesando');
        this.startKybProcesando();
      } else {
        this.terceroModo.set('representante-legal');
        this.resetTercero();
        this.currentSubStep.set('via-tercero-email');
      }
      return;
    }
  }

  private validateOtp(kind: 'email' | 'telefono'): boolean {
    const code = kind === 'email' ? this.otpEmailCode() : this.otpTelefonoCode();
    if (code === OTP_CODE_WRONG_DEMO) {
      const intentosSignal = kind === 'email' ? this.otpEmailIntentos : this.otpTelefonoIntentos;
      const errorSignal = kind === 'email' ? this.otpEmailError : this.otpTelefonoError;
      const bloqueadoSignal = kind === 'email' ? this.otpEmailBloqueado : this.otpTelefonoBloqueado;
      const restantes = intentosSignal() - 1;
      intentosSignal.set(restantes);
      errorSignal.set(true);
      if (restantes <= 0) bloqueadoSignal.set(true);
      return false;
    }
    return true;
  }

  private validateTerceroOtp(): boolean {
    if (this.terceroOtpCode() === OTP_CODE_WRONG_DEMO) {
      const restantes = this.terceroOtpIntentos() - 1;
      this.terceroOtpIntentos.set(restantes);
      this.terceroOtpError.set(true);
      if (restantes <= 0) this.terceroOtpBloqueado.set(true);
      return false;
    }
    return true;
  }

  private resetOtp(kind: 'email' | 'telefono'): void {
    this.stopResendCountdown(kind);
    if (kind === 'email') {
      this.otpEmailCode.set('');
      this.otpEmailError.set(false);
      this.otpEmailIntentos.set(OTP_MAX_INTENTOS);
      this.otpEmailBloqueado.set(false);
      this.otpEmailResendIn.set(OTP_RESEND_SECONDS);
    } else {
      this.otpTelefonoCode.set('');
      this.otpTelefonoError.set(false);
      this.otpTelefonoIntentos.set(OTP_MAX_INTENTOS);
      this.otpTelefonoBloqueado.set(false);
      this.otpTelefonoResendIn.set(OTP_RESEND_SECONDS);
    }
  }

  private resetTercero(): void {
    this.stopResendCountdown('tercero');
    this.terceroEmail.set('');
    this.terceroOtpCode.set('');
    this.terceroOtpError.set(false);
    this.terceroOtpIntentos.set(OTP_MAX_INTENTOS);
    this.terceroOtpBloqueado.set(false);
    this.terceroOtpResendIn.set(OTP_RESEND_SECONDS);
    this.terceroDocFrenteCapturado.set(false);
    this.terceroDocReversoCapturado.set(false);
    this.terceroLivenessCapturada.set(false);
    this.terceroProcesandoProgress.set(0);
  }

  private startResendCountdown(kind: 'email' | 'telefono' | 'tercero'): void {
    this.stopResendCountdown(kind);
    const resendSignal = kind === 'email' ? this.otpEmailResendIn : kind === 'telefono' ? this.otpTelefonoResendIn : this.terceroOtpResendIn;
    resendSignal.set(OTP_RESEND_SECONDS);
    const timer = setInterval(() => {
      const v = resendSignal() - 1;
      if (v <= 0) {
        resendSignal.set(0);
        clearInterval(timer);
      } else {
        resendSignal.set(v);
      }
    }, 1000);
    if (kind === 'email') this.otpEmailTimer = timer;
    else if (kind === 'telefono') this.otpTelefonoTimer = timer;
    else this.terceroOtpTimer = timer;
  }

  private stopResendCountdown(kind: 'email' | 'telefono' | 'tercero'): void {
    const timer = kind === 'email' ? this.otpEmailTimer : kind === 'telefono' ? this.otpTelefonoTimer : this.terceroOtpTimer;
    if (timer) clearInterval(timer);
  }

  reenviarCodigo(kind: 'email' | 'telefono' | 'tercero'): void {
    const resendSignal = kind === 'email' ? this.otpEmailResendIn : kind === 'telefono' ? this.otpTelefonoResendIn : this.terceroOtpResendIn;
    if (resendSignal() > 0) return;
    if (kind === 'email') { this.otpEmailError.set(false); this.otpEmailCode.set(''); }
    else if (kind === 'telefono') { this.otpTelefonoError.set(false); this.otpTelefonoCode.set(''); }
    else { this.terceroOtpError.set(false); this.terceroOtpCode.set(''); }
    this.startResendCountdown(kind);
  }

  reiniciarVerificacion(): void {
    this.currentSubStep.set('email');
    this.emailCorreo.set('');
    this.resetOtp('email');
    this.docFrenteCapturado.set(false);
    this.docReversoCapturado.set(false);
    this.livenessCapturada.set(false);
    this.telefono.set('');
    this.resetOtp('telefono');
  }

  reiniciarVerificacionTercero(): void {
    this.resetTercero();
    this.currentSubStep.set('via-tercero-email');
  }

  private startProcesando(): void {
    this.procesandoProgress.set(0);
    const interval = setInterval(() => {
      const v = this.procesandoProgress() + 12;
      if (v >= 100) {
        this.procesandoProgress.set(100);
        clearInterval(interval);
        setTimeout(() => {
          if (this.resultado() === 'aprobado') this.currentSubStep.set('via-facturacion');
          else this.currentScreen.set('screen3');
        }, 800);
      } else {
        this.procesandoProgress.set(v);
      }
    }, 220);
  }

  private startTerceroProcesando(): void {
    this.terceroProcesandoProgress.set(0);
    const interval = setInterval(() => {
      const v = this.terceroProcesandoProgress() + 15;
      if (v >= 100) {
        this.terceroProcesandoProgress.set(100);
        clearInterval(interval);
        setTimeout(() => this.currentSubStep.set('via-tercero-resultado'), 600);
      } else {
        this.terceroProcesandoProgress.set(v);
      }
    }, 200);
  }

  private startKybProcesando(): void {
    setTimeout(() => {
      this.stateV2.setEstadoKyb('aprobado');
      this.currentScreen.set('screen3');
    }, 1200);
  }

  buscarEmpresa(): void {
    this.kybBuscado.set(true);
    const q = this.kybNombreEmpresa().trim().toLowerCase();
    if (!q) { this.kybResultados.set([]); return; }
    const opts = EMPRESAS_MOCK_V2[this.kybPais()] ?? [];
    this.kybResultados.set(opts.filter(e => e.toLowerCase().includes(q)));
  }

  seleccionarEmpresa(nombre: string): void {
    this.kybEmpresaSeleccionada.set(nombre);
  }

  /** RN-23: si no se encuentra la empresa, el estado queda pj_pendiente sin perder los datos. */
  marcarEmpresaNoEncontrada(): void {
    this.stateV2.setEstadoKyb('pj_pendiente');
    this.currentSubStep.set('via-kyb-pendiente');
  }

  reintentarKyb(): void {
    this.kybNombreEmpresa.set('');
    this.kybBuscado.set(false);
    this.kybResultados.set([]);
    this.kybEmpresaSeleccionada.set(null);
    this.currentSubStep.set('via-kyb-buscar');
  }

  cambiarViaFacturacion(): void {
    this.viaFacturacion.set(null);
    this.currentSubStep.set('via-facturacion');
  }

  get canNextScreen0(): boolean { return true; }
  get canNextScreen1(): boolean { return this.allChecked; }
  get canNextSubStep(): boolean {
    const s = this.currentSubStep();
    if (s === 'email') return /\S+@\S+\.\S+/.test(this.emailCorreo());
    if (s === 'otp-email') return this.otpEmailCode().length === 6 && !this.otpEmailBloqueado();
    if (s === 'doc-frente') return this.docFrenteCapturado();
    if (s === 'doc-reverso') return this.docReversoCapturado();
    if (s === 'liveness') return this.livenessCapturada();
    if (s === 'telefono') return this.telefono().length >= 7;
    if (s === 'otp-telefono') return this.otpTelefonoCode().length === 6 && !this.otpTelefonoBloqueado();
    if (s === 'via-facturacion') return this.viaFacturacion() !== null;
    if (s === 'via-confirmar-mis-datos') return true;
    if (s === 'via-tercero-email') return /\S+@\S+\.\S+/.test(this.terceroEmail());
    if (s === 'via-tercero-otp-email') return this.terceroOtpCode().length === 6 && !this.terceroOtpBloqueado();
    if (s === 'via-tercero-doc-frente') return this.terceroDocFrenteCapturado();
    if (s === 'via-tercero-doc-reverso') return this.terceroDocReversoCapturado();
    if (s === 'via-tercero-liveness') return this.terceroLivenessCapturada();
    if (s === 'via-kyb-buscar') return !!this.kybEmpresaSeleccionada();
    if (s === 'via-kyb-confirmar') return true;
    if (s === 'via-kyb-representante-info') return true;
    return false;
  }

  /** Pasos con footer estándar (Atrás / Siguiente) — el resto usa botones dedicados en su propio template. */
  readonly hasStandardFooter = computed(() => {
    const s = this.currentSubStep();
    return s !== 'procesando' && s !== 'via-tercero-procesando' && s !== 'via-tercero-resultado' && s !== 'via-kyb-procesando' && s !== 'via-kyb-pendiente';
  });

  tryClose(): void {
    if (this.currentScreen() === 'screen2') {
      this.exitConfirm.set(true);
    } else {
      this.modalSvc.close();
    }
  }

  confirmExit(): void { this.exitConfirm.set(false); this.modalSvc.close(); }
  cancelExit(): void { this.exitConfirm.set(false); }

  onAprobadoFacturacion(): void {
    this.stateSvc.setStatus('aprobado');
    this.modalSvc.close();
    this.router.navigate(['/new/financiero/datos-facturacion']);
  }

  onAprobadoReturn(): void {
    this.stateSvc.setStatus('aprobado');
    this.modalSvc.close();
    const o = this.config().origen;
    const routes: Record<string, string> = {
      retiro: '/new/financiero/retiros-de-saldo',
      dropicard: '/new/dropi-card/cards',
      wallet: '/new/historial-de-cartera',
      pedidos: '/new/pedidos/ordenes',
      home: '/new/home',
      facturacion: '/new/financiero/datos-facturacion',
      cuenta: '/new/configuraciones/cuenta',
    };
    this.router.navigate([routes[o] ?? '/new/home']);
  }

  onEnRevisionReturn(): void {
    this.stateSvc.setStatus('en_revision');
    this.modalSvc.close();
  }

  onReintentar(): void {
    this.currentScreen.set('screen2');
    this.reiniciarVerificacion();
  }
}
