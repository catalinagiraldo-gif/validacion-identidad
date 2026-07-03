import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IdentityModalService } from '../../services/identity-modal.service';
import { IdentityDemoStateService, ResultadoModal } from '../../services/identity-demo-state.service';
import { ACTIVIDAD_ECONOMICA_OPTIONS } from '../../models/identity-flow.models';

type Screen = 'screen0' | 'screen1' | 'screen2' | 'screen3';
type SubStep = 'bienvenida' | 'doc-tipo' | 'doc-frente' | 'doc-reverso' | 'selfie' | 'empresa' | 'cuestionario-fiscal' | 'procesando';
type TipoFacturacion = 'personal' | 'empresa';

const DOC_TYPES: Record<string, string[]> = {
  CO: ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte'],
  MX: ['INE / IFE', 'Pasaporte', 'Cédula profesional'],
  AR: ['DNI', 'Pasaporte', 'LC / LE'],
  CL: ['RUT', 'Pasaporte'],
  EC: ['Cédula de identidad', 'Pasaporte', 'RUC'],
};

const EMPRESAS_MOCK: Record<string, string[]> = {
  CO: ['TechStore SAS', 'Distribuidora Sur SAS', 'Comercial Norte Ltda.'],
  MX: ['Comercial MX SA de CV', 'Distribuidora Bajío SA', 'Tech Solutions SAPI'],
  AR: ['Distribuidora Sur S.A.', 'Importadora Norte SRL', 'Comercial Delta SA'],
  CL: ['Distribuciones Santiago SpA', 'Comercial Pacífico Ltda.'],
  EC: ['Distribuidora Quito Cía. Ltda.', 'Comercial Guayas S.A.'],
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
  private router    = inject(Router);

  readonly isOpen   = this.modalSvc.isOpen;
  readonly config   = this.modalSvc.config;
  readonly resultado = this.stateSvc.resultadoModal;
  readonly paisCode  = this.stateSvc.pais;

  currentScreen = signal<Screen>('screen0');
  currentSubStep = signal<SubStep>('bienvenida');
  tipoFacturacion = signal<TipoFacturacion>('personal');
  selectedDocType = signal('');
  docFrenteCapturado = signal(false);
  docReversoCapturado = signal(false);
  selfieCapturada = signal(false);
  empresaBusqueda = signal('');
  empresasFiltradas = signal<string[]>([]);
  empresaSeleccionada = signal('');
  procesandoProgress = signal(0);
  exitConfirm = signal(false);
  checklistItems = signal([false, false, false, false, false]);

  // Cuestionario fiscal
  emailFacturacion = signal('');
  municipio = signal('');
  tipoRegimen = signal('');
  actividadEconomica = signal('');
  regimenFiscalMX = signal('');
  codigoPostalMX = signal('');
  condicionIVA_AR = signal('');
  provinciaAR = signal('');

  readonly actividadesEconomicas = ACTIVIDAD_ECONOMICA_OPTIONS;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        const start = this.config().startScreen;
        this.currentScreen.set(start);
        this.currentSubStep.set('bienvenida');
        this.exitConfirm.set(false);
        this.docFrenteCapturado.set(false);
        this.docReversoCapturado.set(false);
        this.selfieCapturada.set(false);
        this.empresaBusqueda.set('');
        this.empresaSeleccionada.set('');
        this.checklistItems.set([false, false, false, false, false]);
        this.emailFacturacion.set('');
        this.municipio.set('');
        this.tipoRegimen.set('');
        this.actividadEconomica.set('');
        this.regimenFiscalMX.set('');
        this.codigoPostalMX.set('');
        this.condicionIVA_AR.set('');
        this.provinciaAR.set('');
      }
    }, { allowSignalWrites: true });
  }

  readonly screenIndex = computed(() => {
    const map: Record<Screen, number> = { screen0: 0, screen1: 1, screen2: 2, screen3: 3 };
    return map[this.currentScreen()];
  });

  readonly subStepIndex = computed(() => {
    const steps = this.subStepsForPersona();
    return steps.indexOf(this.currentSubStep());
  });

  readonly subStepLabel = computed(() => {
    const i = this.subStepIndex();
    const total = this.subStepsForPersona().length;
    return `${i + 1} / ${total}`;
  });

  readonly docTypes = computed(() => DOC_TYPES[this.paisCode()] ?? DOC_TYPES['CO']);

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

  readonly facturaPreview = computed(() =>
    this.tipoFacturacion() === 'personal'
      ? 'Tus facturas dirán: LAURA MARTÍNEZ'
      : 'Tus facturas dirán: NOMBRE DE TU EMPRESA'
  );

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

  subStepsForPersona(): SubStep[] {
    if (this.tipoFacturacion() === 'empresa') {
      return ['bienvenida', 'doc-tipo', 'doc-frente', 'doc-reverso', 'selfie', 'empresa', 'cuestionario-fiscal', 'procesando'];
    }
    return ['bienvenida', 'doc-tipo', 'doc-frente', 'doc-reverso', 'selfie', 'cuestionario-fiscal', 'procesando'];
  }

  readonly checklistLabels = [
    'Documento de identidad vigente y original (no fotocopias)',
    'Buena iluminación y cámara disponible',
    'Espacio tranquilo sin interrupciones (~5-10 min)',
    'Conexión estable a internet',
    'Para empresa: nombre de tu compañía listo para buscar',
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
    if (s === 'screen1') { this.currentScreen.set('screen2'); this.currentSubStep.set('bienvenida'); return; }
    if (s === 'screen2') { this.advanceSubStep(); return; }
  }

  goBack(): void {
    const s = this.currentScreen();
    if (s === 'screen1') { this.currentScreen.set('screen0'); return; }
    if (s === 'screen2') {
      const steps = this.subStepsForPersona();
      const i = steps.indexOf(this.currentSubStep());
      if (i === 0) { this.currentScreen.set('screen1'); return; }
      this.currentSubStep.set(steps[i - 1]);
      return;
    }
  }

  private advanceSubStep(): void {
    const steps = this.subStepsForPersona();
    const i = steps.indexOf(this.currentSubStep());
    if (i < steps.length - 1) {
      const next = steps[i + 1];
      this.currentSubStep.set(next);
      if (next === 'procesando') this.startProcesando();
    }
  }

  private startProcesando(): void {
    this.stateSvc.setDatosFiscales({
      emailFacturacion: this.emailFacturacion(),
      municipio:        this.municipio(),
      tipoRegimen:      this.tipoRegimen()        || undefined,
      actividadEconomica: this.actividadEconomica() || undefined,
      regimenFiscal:    this.regimenFiscalMX()    || undefined,
      codigoPostal:     this.codigoPostalMX()     || undefined,
      condicionIVA:     this.condicionIVA_AR()    || undefined,
      provincia:        this.provinciaAR()        || undefined,
    });
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

  buscarEmpresa(): void {
    const q = this.empresaBusqueda().toLowerCase();
    if (!q) { this.empresasFiltradas.set([]); return; }
    const opts = EMPRESAS_MOCK[this.paisCode()] ?? EMPRESAS_MOCK['CO'];
    this.empresasFiltradas.set(opts.filter(e => e.toLowerCase().includes(q)));
  }

  selectEmpresa(e: string): void {
    this.empresaSeleccionada.set(e);
    this.empresaBusqueda.set(e);
    this.empresasFiltradas.set([]);
  }

  get canNextScreen0(): boolean { return true; }
  get canNextScreen1(): boolean { return this.allChecked; }
  get canNextSubStep(): boolean {
    const s = this.currentSubStep();
    if (s === 'bienvenida') return true;
    if (s === 'doc-tipo') return !!this.selectedDocType();
    if (s === 'doc-frente') return this.docFrenteCapturado();
    if (s === 'doc-reverso') return this.docReversoCapturado();
    if (s === 'selfie') return this.selfieCapturada();
    if (s === 'empresa') return !!this.empresaSeleccionada();
    if (s === 'cuestionario-fiscal') {
      if (!this.emailFacturacion() || !this.municipio()) return false;
      const p = this.paisCode();
      if (p === 'CO') return !!this.tipoRegimen() && !!this.actividadEconomica();
      if (p === 'MX') return !!this.regimenFiscalMX();
      if (p === 'AR') return !!this.condicionIVA_AR();
      return true;
    }
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
    this.currentSubStep.set('bienvenida');
    this.docFrenteCapturado.set(false);
    this.docReversoCapturado.set(false);
    this.selfieCapturada.set(false);
  }
}
