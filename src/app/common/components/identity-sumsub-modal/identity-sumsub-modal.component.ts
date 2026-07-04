import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityModalService } from '../../services/identity-modal.service';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { PAIS_BILLING_FIELDS } from '../../models/identity-flow-v2.models';

// Reordenado según Plan2.md (docs/validacion/Plan2.md, Parte 2 / Fase 3,
// líneas 700-913): el KYC del dueño de cuenta corre completo — email, OTP
// email, documento (autodetección, sin selector manual), prueba de vida,
// celular + OTP — ANTES de preguntar nada de facturación. La pregunta de
// facturación de 3 vías (Parte 3) y el formulario fiscal por país (Parte 4)
// se implementan en un paso posterior de este plan; este modal termina en
// el resultado del KYC (aprobado / en revisión / rechazado).

type Screen = 'screen0' | 'screen1' | 'screen2' | 'screen3';
type SubStep =
  | 'email'
  | 'otp-email'
  | 'doc-frente'
  | 'doc-reverso'
  | 'liveness'
  | 'telefono'
  | 'otp-telefono'
  | 'procesando';

const STEPS: SubStep[] = ['email', 'otp-email', 'doc-frente', 'doc-reverso', 'liveness', 'telefono', 'otp-telefono', 'procesando'];

const OTP_MAX_INTENTOS = 3;
const OTP_RESEND_SECONDS = 60;
/** Código "incorrecto" reservado para poder demostrar el estado de error en el prototipo. */
const OTP_CODE_WRONG_DEMO = '000000';

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
      }
    }, { allowSignalWrites: true });
  }

  readonly screenIndex = computed(() => {
    const map: Record<Screen, number> = { screen0: 0, screen1: 1, screen2: 2, screen3: 3 };
    return map[this.currentScreen()];
  });

  readonly subStepIndex = computed(() => STEPS.indexOf(this.currentSubStep()));

  readonly subStepLabel = computed(() => `${this.subStepIndex() + 1} / ${STEPS.length}`);

  readonly nextButtonLabel = computed(() => {
    switch (this.currentSubStep()) {
      case 'email': return 'Enviar código';
      case 'telefono': return 'Enviar código';
      case 'otp-email':
      case 'otp-telefono': return 'Verificar código';
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
      const i = STEPS.indexOf(this.currentSubStep());
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

    const i = STEPS.indexOf(current);
    if (i < STEPS.length - 1) {
      const next = STEPS[i + 1];
      this.currentSubStep.set(next);
      if (next === 'otp-email') this.startResendCountdown('email');
      if (next === 'otp-telefono') this.startResendCountdown('telefono');
      if (next === 'procesando') this.startProcesando();
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

  private startResendCountdown(kind: 'email' | 'telefono'): void {
    this.stopResendCountdown(kind);
    const resendSignal = kind === 'email' ? this.otpEmailResendIn : this.otpTelefonoResendIn;
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
    else this.otpTelefonoTimer = timer;
  }

  private stopResendCountdown(kind: 'email' | 'telefono'): void {
    const timer = kind === 'email' ? this.otpEmailTimer : this.otpTelefonoTimer;
    if (timer) clearInterval(timer);
  }

  reenviarCodigo(kind: 'email' | 'telefono'): void {
    const resendSignal = kind === 'email' ? this.otpEmailResendIn : this.otpTelefonoResendIn;
    if (resendSignal() > 0) return;
    if (kind === 'email') { this.otpEmailError.set(false); this.otpEmailCode.set(''); }
    else { this.otpTelefonoError.set(false); this.otpTelefonoCode.set(''); }
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

  private startProcesando(): void {
    this.procesandoProgress.set(0);
    const interval = setInterval(() => {
      const v = this.procesandoProgress() + 12;
      if (v >= 100) {
        this.procesandoProgress.set(100);
        clearInterval(interval);
        setTimeout(() => this.currentScreen.set('screen3'), 800);
      } else {
        this.procesandoProgress.set(v);
      }
    }, 220);
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
    return false;
  }

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
