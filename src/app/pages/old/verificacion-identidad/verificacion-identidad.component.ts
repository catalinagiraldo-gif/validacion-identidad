import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import verificacionData from '../../../../../mocks/verificacion-identidad.json';

type Journey = 'global_nuevo' | 'colombia_nuevo' | 'edicion_datos';
type GlobalPhase =
  | 'entry_disabled'
  | 'wizard_tipo'
  | 'wizard_checklist'
  | 'wizard_post_msg'
  | 'sdk_active'
  | 'approved_readonly';
type ColombiaPhase =
  | 'entry_disabled'
  | 'form_editable'
  | 'mfa_gate'
  | 'form_saved'
  | 'wizard_checklist'
  | 'wizard_post_msg'
  | 'sdk_active'
  | 'approved_readonly';
type EdicionPhase =
  | 'readonly_blocked'
  | 'form_editable'
  | 'mfa_gate'
  | 'diff_result'
  | 'revalid_pending'
  | 'sdk_active'
  | 'saved_readonly';
type Phase = 'hub_journeys' | GlobalPhase | ColombiaPhase | EdicionPhase;
type EstadoVerificacion =
  | 'draft'
  | 'pending_validation'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'rejected_field'
  | 'email_baneado'
  | 'legacy';
type TipoPersona = 'natural' | 'juridica';
type Proveedor = 'truora' | 'sumsub';
type ModalStep = 'document' | 'capture' | 'selfie' | 'verifying' | 'kyb-empresa' | 'kyb-docs' | 'kyb-rep';
type MfaPurpose = 'colombia_save' | 'edicion_save' | 'cross_country' | 'mfa_setup';

interface PerfilVerificacion {
  id: string;
  label: string;
  journey: Journey;
  email: string;
  telefono: string;
  paisOrigen: string;
  paisOperacion: string;
  tipoPersona: TipoPersona;
  proveedorKYC: Proveedor;
  proveedorKYB: Proveedor;
  estadoVerificacion: EstadoVerificacion;
  intentosRestantes: number;
  minutosParaReintento: number;
  codigoRechazo: string | null;
  rejectLabel: string | null;
  documentoObtenidoAPI: boolean;
  esLegacy: boolean;
  mfaActivo: boolean;
  validadoOtroPais: boolean;
  fechaBloqueoEdicion: string | null;
  camposPrecargados: Record<string, string>;
  camposTributariosPorPais: Record<string, string>;
}

interface VerificacionIdentidadData {
  perfiles: PerfilVerificacion[];
  rejectLabels: Record<string, string>;
  checklistNatural: string[];
  checklistJuridica: string[];
  camposCriticosRevalidacion: string[];
  camposPorPais: Record<string, string[]>;
  camposGeoPorPais: Record<string, string[]>;
  geoLabels: Record<string, string>;
}

interface StepItem {
  label: string;
  state: 'pending' | 'focus' | 'completed' | 'error';
}

interface JourneyCard {
  journey: Journey;
  title: string;
  figjamNode: string;
  perfilId: string;
  provider: string;
  steps: string[];
}

@Component({
  selector: 'app-verificacion-identidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verificacion-identidad.component.html',
  styleUrls: ['./verificacion-identidad.component.scss'],
})
export class VerificacionIdentidadComponent implements OnInit {
  perfiles: PerfilVerificacion[] = [];
  rejectLabels: Record<string, string> = {};
  checklistNatural: string[] = [];
  checklistJuridica: string[] = [];
  camposCriticosRevalidacion: string[] = [];
  camposPorPais: Record<string, string[]> = {};
  camposGeoPorPais: Record<string, string[]> = {};
  geoLabels: Record<string, string> = {};

  selectedPerfilId = '';
  perfil!: PerfilVerificacion;
  inFlow = false;
  phase: Phase = 'hub_journeys';
  wizardStep = 1;
  demoBarExpanded = false;
  dataReady = false;

  cachedGeoFields: { key: string; label: string }[] = [];
  cachedTributariaFields: { key: string; label: string }[] = [];
  cachedSteps: StepItem[] = [];

  tipoPersonaSeleccionado: TipoPersona | null = null;
  crossCountryChoice: 'si' | 'no' | null = null;
  aceptaTyC = false;
  simulateTimeout = false;
  sessionInterrupted = false;

  showSdkModal = false;
  showMfaModal = false;
  mfaPurpose: MfaPurpose = 'colombia_save';
  mfaCode = '';
  modalStep: ModalStep = 'document';
  modalProvider: Proveedor = 'sumsub';
  sdkDemoExpanded = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  formData: Record<string, string> = {};
  editSnapshot: Record<string, string> = {};
  formErrors: Record<string, string> = {};
  criticalFieldsChanged = false;
  diffMessage = '';

  readonly paises = [
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  ];

  readonly journeys: { id: Journey; label: string }[] = [
    { id: 'global_nuevo', label: 'Global · Países Dropi' },
    { id: 'colombia_nuevo', label: 'Colombia · Usuario nuevo' },
    { id: 'edicion_datos', label: 'Edición post 6 meses' },
  ];

  readonly journeyCards: JourneyCard[] = [
    {
      journey: 'global_nuevo',
      title: 'Usuario nuevo · Países Dropi',
      figjamNode: '85:1189',
      perfilId: 'global-mx-natural-draft',
      provider: 'Sumsub',
      steps: [
        'Formulario deshabilitado hasta validar',
        'Wizard 3 pasos (tipo → checklist → instrucciones)',
        'WebSDK Sumsub → precarga readonly vía API',
      ],
    },
    {
      journey: 'colombia_nuevo',
      title: 'Usuario nuevo · Colombia',
      figjamNode: '96:6712',
      perfilId: 'co-natural-draft',
      provider: 'Truora KYC · Sumsub KYB',
      steps: [
        'Diligencia formulario unificado',
        'MFA → guardar datos',
        'Checklist 2 pasos → Truora / Sumsub',
      ],
    },
    {
      journey: 'edicion_datos',
      title: 'Información editada (post 6 meses)',
      figjamNode: '99:9408',
      perfilId: 'edicion-approved-6m',
      provider: 'Sumsub (revalidación condicional)',
      steps: [
        'Solicitar actualización de datos',
        'Editar → Guardar → MFA',
        'Revalidación solo si campos críticos cambiaron',
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {
    const data = verificacionData as unknown as VerificacionIdentidadData;
    this.perfiles = data.perfiles ?? [];
    this.rejectLabels = data.rejectLabels ?? {};
    this.checklistNatural = data.checklistNatural ?? [];
    this.checklistJuridica = data.checklistJuridica ?? [];
    this.camposCriticosRevalidacion = data.camposCriticosRevalidacion ?? [];
    this.camposPorPais = data.camposPorPais ?? {};
    this.camposGeoPorPais = data.camposGeoPorPais ?? {};
    this.geoLabels = data.geoLabels ?? {};
    this.dataReady = true;
  }

  explorarFlujo(journey: Journey): void {
    const card = this.journeyCards.find((c) => c.journey === journey);
    if (!card) return;
    if (!this.dataReady || this.perfiles.length === 0) {
      this.toast('Datos del prototipo no disponibles', 'error');
      return;
    }
    this.loadPerfil(card.perfilId);
  }

  volverAlHub(): void {
    this.inFlow = false;
    this.phase = 'hub_journeys';
    this.showSdkModal = false;
    this.showMfaModal = false;
    document.body.style.overflow = '';
  }

  toggleDemoBar(): void {
    this.demoBarExpanded = !this.demoBarExpanded;
  }

  trackByFieldKey(_index: number, item: { key: string }): string {
    return item.key;
  }

  // ── Demo controls ──────────────────────────────────────────────

  onPerfilChange(id: string): void {
    this.loadPerfil(id);
  }

  onJourneyFilter(journey: Journey | ''): void {
    if (!journey) return;
    const first = this.perfiles.find((p) => p.journey === journey);
    if (first) this.loadPerfil(first.id);
  }

  onPaisChange(code: string): void {
    if (!this.inFlow) return;
    this.perfil.paisOperacion = code;
    this.perfil.proveedorKYC = code === 'CO' ? 'truora' : 'sumsub';
    this.resetToEntry();
    this.refreshDerivedState();
  }

  toggleSimulateTimeout(): void {
    if (!this.inFlow) return;
    this.simulateTimeout = !this.simulateTimeout;
    if (this.simulateTimeout) {
      this.perfil.estadoVerificacion = 'pending_validation';
      this.sessionInterrupted = true;
      if (this.perfil.journey === 'global_nuevo') {
        this.phase = 'wizard_post_msg';
        this.wizardStep = 3;
      } else if (this.perfil.journey === 'colombia_nuevo') {
        this.phase = 'wizard_post_msg';
        this.wizardStep = 2;
      }
    } else {
      this.sessionInterrupted = false;
    }
  }

  // ── Computed ───────────────────────────────────────────────────

  get showHubLanding(): boolean {
    return this.phase === 'hub_journeys';
  }

  get showFlowContent(): boolean {
    return this.inFlow;
  }

  get retryHint(): string | null {
    if (!this.inFlow) return null;
    if (this.perfil.intentosRestantes <= 0) {
      return 'Agotaste los 3 intentos. Contacta a soporte para continuar.';
    }
    const intento = 4 - this.perfil.intentosRestantes;
    if (this.perfil.minutosParaReintento > 0) {
      return `Intento ${intento} de 3. Podrás reintentar en ${this.perfil.minutosParaReintento} minutos.`;
    }
    if (this.perfil.intentosRestantes < 3) {
      return `Intento ${intento} de 3.`;
    }
    return null;
  }

  get filteredPerfiles(): PerfilVerificacion[] {
    return this.perfiles.filter((p) => p.journey === this.perfil?.journey);
  }

  get isEmailBaneado(): boolean {
    return this.perfil?.estadoVerificacion === 'email_baneado';
  }

  get isJuridica(): boolean {
    return this.tipoPersonaSeleccionado === 'juridica' || this.perfil?.tipoPersona === 'juridica';
  }

  get activeProvider(): Proveedor {
    if (this.isJuridica) return 'sumsub';
    return this.perfil?.paisOperacion === 'CO' ? 'truora' : 'sumsub';
  }

  get providerLabel(): string {
    return this.activeProvider === 'truora' ? 'Truora' : 'Sumsub';
  }

  get paisNombre(): string {
    return this.paises.find((p) => p.code === this.perfil?.paisOperacion)?.name || this.perfil?.paisOperacion || '';
  }

  get formEditable(): boolean {
    if (!this.inFlow) return false;
    if (this.perfil.journey === 'colombia_nuevo') {
      return this.phase === 'form_editable';
    }
    if (this.perfil.journey === 'edicion_datos') {
      return this.phase === 'form_editable';
    }
    return false;
  }

  get formReadonly(): boolean {
    if (!this.inFlow) return true;
    if (this.perfil.journey === 'global_nuevo') {
      return ['entry_disabled', 'wizard_tipo', 'wizard_checklist', 'wizard_post_msg', 'sdk_active'].includes(
        this.phase,
      ) || (this.phase === 'approved_readonly');
    }
    if (this.perfil.journey === 'colombia_nuevo') {
      return ['entry_disabled', 'form_saved', 'wizard_checklist', 'wizard_post_msg', 'sdk_active', 'approved_readonly'].includes(
        this.phase,
      );
    }
    return ['readonly_blocked', 'diff_result', 'revalid_pending', 'sdk_active', 'saved_readonly'].includes(this.phase);
  }

  get showWizardPanel(): boolean {
    if (!this.inFlow) return false;
    if (this.perfil.journey === 'global_nuevo') {
      return ['wizard_tipo', 'wizard_checklist', 'wizard_post_msg'].includes(this.phase);
    }
    if (this.perfil.journey === 'colombia_nuevo') {
      return ['wizard_checklist', 'wizard_post_msg'].includes(this.phase);
    }
    return false;
  }

  get showEntryCta(): boolean {
    if (!this.inFlow) return false;
    return (
      (this.perfil.journey === 'global_nuevo' || this.perfil.journey === 'colombia_nuevo') &&
      this.phase === 'entry_disabled' &&
      !this.isEmailBaneado
    );
  }

  get showSolicitarActualizacion(): boolean {
    return this.inFlow && this.perfil.journey === 'edicion_datos' && this.phase === 'readonly_blocked';
  }

  get showGuardarForm(): boolean {
    return this.formEditable;
  }

  get showComenzarValidacion(): boolean {
    if (!this.inFlow) return false;
    return (
      (this.perfil.journey === 'global_nuevo' && this.phase === 'wizard_post_msg') ||
      (this.perfil.journey === 'colombia_nuevo' && this.phase === 'wizard_post_msg') ||
      (this.perfil.journey === 'edicion_datos' && this.phase === 'revalid_pending')
    );
  }

  get showLegacyBanner(): boolean {
    return this.perfil?.esLegacy || this.perfil?.estadoVerificacion === 'legacy';
  }

  get wizardStepCount(): number {
    if (!this.inFlow) return 0;
    return this.perfil.journey === 'global_nuevo' ? 3 : 2;
  }

  get activeChecklist(): string[] {
    return this.isJuridica ? this.checklistJuridica : this.checklistNatural;
  }

  get showTributariaColombiaOnly(): boolean {
    if (!this.inFlow) return false;
    if (this.perfil.journey === 'colombia_nuevo') {
      return this.perfil.paisOperacion === 'CO';
    }
    return this.showTributaria;
  }

  get showTributaria(): boolean {
    const pais = this.perfil?.paisOperacion;
    return !!pais && !!this.camposPorPais[pais]?.length;
  }

  get headerBadgeText(): string {
    switch (this.perfil?.estadoVerificacion) {
      case 'approved':
        return 'Verificado';
      case 'in_review':
        return 'En revisión';
      case 'rejected':
      case 'rejected_field':
        return 'Rechazado';
      case 'email_baneado':
        return 'Bloqueado';
      default:
        return 'Sin verificar';
    }
  }

  get headerBadgeStyle(): string {
    switch (this.perfil?.estadoVerificacion) {
      case 'approved':
        return 'success';
      case 'in_review':
        return 'info';
      case 'rejected':
      case 'rejected_field':
      case 'email_baneado':
        return 'error';
      default:
        return 'warning';
    }
  }

  get canRetry(): boolean {
    if (!this.inFlow) return false;
    return this.perfil.intentosRestantes > 0 && this.perfil.minutosParaReintento === 0;
  }

  get verificationCtaText(): string {
    if (!this.inFlow) return 'Comenzar validación';
    if (this.perfil.estadoVerificacion === 'rejected' || this.perfil.estadoVerificacion === 'rejected_field') {
      return 'Reintentar validación';
    }
    if (this.sessionInterrupted || this.perfil.estadoVerificacion === 'pending_validation') {
      return 'Reanudar validación';
    }
    return 'Comenzar validación';
  }

  get mfaModalTitle(): string {
    if (this.mfaPurpose === 'mfa_setup') return 'Configura tu autenticación MFA';
    if (this.mfaPurpose === 'cross_country') return 'Confirma tu identidad para reutilizar datos';
    if (this.mfaPurpose === 'edicion_save') return 'Verificación de seguridad';
    return 'Verificación de seguridad';
  }

  get sdkProgress(): string {
    const flow = this.getModalFlow();
    const idx = flow.indexOf(this.modalStep);
    return `${idx + 1} / ${flow.length}`;
  }

  // ── Entry actions ──────────────────────────────────────────────

  iniciarValidacion(): void {
    if (!this.inFlow) return;
    if (this.perfil.journey === 'global_nuevo') {
      if (this.perfil.validadoOtroPais) {
        this.phase = 'wizard_tipo';
        this.wizardStep = 1;
        return;
      }
      this.phase = 'wizard_tipo';
      this.wizardStep = 1;
      this.tipoPersonaSeleccionado = this.perfil.tipoPersona;
      this.refreshDerivedState();
    } else if (this.perfil.journey === 'colombia_nuevo') {
      this.phase = 'form_editable';
      this.initEditableForm();
      this.refreshDerivedState();
    }
  }

  solicitarActualizacion(): void {
    if (!this.inFlow) return;
    this.phase = 'form_editable';
    this.formData = { ...this.perfil.camposPrecargados };
    this.editSnapshot = { ...this.perfil.camposPrecargados };
    this.formErrors = {};
    this.refreshDerivedState();
  }

  // ── Global wizard ──────────────────────────────────────────────

  selectTipoPersona(tipo: TipoPersona): void {
    if (!this.inFlow) return;
    this.tipoPersonaSeleccionado = tipo;
    this.perfil.tipoPersona = tipo;
  }

  selectCrossCountry(choice: 'si' | 'no'): void {
    this.crossCountryChoice = choice;
    if (choice === 'no') this.tipoPersonaSeleccionado = null;
  }

  continuarWizard(): void {
    if (!this.inFlow) return;
    if (this.perfil.journey === 'global_nuevo') {
      if (this.phase === 'wizard_tipo') {
        if (!this.tipoPersonaSeleccionado) return;
        if (this.perfil.validadoOtroPais && !this.crossCountryChoice) return;
        if (this.crossCountryChoice === 'si') {
          this.mfaPurpose = 'cross_country';
          this.openMfa();
          return;
        }
        this.phase = 'wizard_checklist';
        this.wizardStep = 2;
      } else if (this.phase === 'wizard_checklist') {
        if (!this.aceptaTyC) {
          this.toast('Debes aceptar los Términos y Condiciones', 'error');
          return;
        }
        this.phase = 'wizard_post_msg';
        this.wizardStep = 3;
      }
    } else if (this.perfil.journey === 'colombia_nuevo') {
      if (this.phase === 'wizard_checklist') {
        if (!this.aceptaTyC) {
          this.toast('Debes aceptar los Términos y Condiciones', 'error');
          return;
        }
        this.phase = 'wizard_post_msg';
        this.wizardStep = 2;
      }
    }
    this.refreshDerivedState();
  }

  retrocederWizard(): void {
    if (!this.inFlow) return;
    if (this.perfil.journey === 'global_nuevo') {
      if (this.phase === 'wizard_checklist') {
        this.phase = 'wizard_tipo';
        this.wizardStep = 1;
      } else if (this.phase === 'wizard_post_msg') {
        this.phase = 'wizard_checklist';
        this.wizardStep = 2;
      }
    } else if (this.perfil.journey === 'colombia_nuevo') {
      if (this.phase === 'wizard_post_msg') {
        this.phase = 'wizard_checklist';
        this.wizardStep = 1;
      }
    }
    this.refreshDerivedState();
  }

  comenzarValidacionSdk(): void {
    if (!this.inFlow) return;
    if (!this.canRetry && this.perfil.estadoVerificacion === 'rejected') return;
    this.abrirModalSdk();
  }

  // ── Colombia form ──────────────────────────────────────────────

  guardarFormulario(): void {
    if (!this.validateForm()) return;
    this.mfaPurpose = this.perfil.journey === 'edicion_datos' ? 'edicion_save' : 'colombia_save';
    if (!this.perfil.mfaActivo) {
      this.mfaPurpose = 'mfa_setup';
    }
    this.openMfa();
  }

  // ── MFA ────────────────────────────────────────────────────────

  openMfa(): void {
    this.showMfaModal = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarMfaModal(): void {
    this.showMfaModal = false;
    this.mfaCode = '';
    document.body.style.overflow = '';
  }

  verificarMfa(): void {
    if (this.mfaCode.length < 6) {
      this.toast('Ingresa el código de 6 dígitos', 'error');
      return;
    }
    this.cerrarMfaModal();
    this.perfil.mfaActivo = true;

    if (this.mfaPurpose === 'cross_country') {
      this.precargarCrossCountry();
      this.phase = 'approved_readonly';
      this.perfil.estadoVerificacion = 'approved';
      this.perfil.documentoObtenidoAPI = true;
      this.toast('Datos precargados desde tu cuenta en otro país.', 'info');
      return;
    }

    if (this.perfil.journey === 'colombia_nuevo') {
      this.phase = 'form_saved';
      this.perfil.estadoVerificacion = 'pending_validation';
      this.toast('Visualiza guardada la información', 'success');
      setTimeout(() => {
        this.phase = 'wizard_checklist';
        this.wizardStep = 1;
      }, 800);
      return;
    }

    if (this.perfil.journey === 'edicion_datos') {
      this.evaluateFieldDiff();
      return;
    }
  }

  private evaluateFieldDiff(): void {
    this.criticalFieldsChanged = this.camposCriticosRevalidacion.some((key) => {
      const before = (this.editSnapshot[key] || '').trim();
      const after = (this.formData[key] || '').trim();
      return before !== after;
    });

    if (this.criticalFieldsChanged) {
      this.phase = 'diff_result';
      this.diffMessage =
        'Tu validación de identidad está pendiente. Comienza ahora y accede a todos los beneficios.';
      this.toast('Campos críticos modificados. Se requiere revalidación.', 'info');
      setTimeout(() => {
        this.phase = 'revalid_pending';
        this.perfil.estadoVerificacion = 'pending_validation';
      }, 1200);
    } else {
      this.phase = 'saved_readonly';
      this.perfil.camposPrecargados = { ...this.formData };
      this.perfil.fechaBloqueoEdicion = this.addMonths(new Date(), 6);
      this.toast('Visualiza guardada la información sin ninguna acción adicional', 'success');
    }
  }

  // ── SDK Modal ──────────────────────────────────────────────────

  abrirModalSdk(): void {
    this.modalProvider = this.activeProvider;
    this.showSdkModal = true;
    this.phase = 'sdk_active';
    this.modalStep = this.isJuridica ? 'kyb-empresa' : 'document';
    document.body.style.overflow = 'hidden';
  }

  cerrarModalSdk(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    if (this.perfil.journey === 'global_nuevo') {
      this.phase = 'wizard_post_msg';
    } else if (this.perfil.journey === 'colombia_nuevo') {
      this.phase = 'wizard_post_msg';
    } else if (this.perfil.journey === 'edicion_datos') {
      this.phase = 'revalid_pending';
    }
    if (['draft', 'legacy'].includes(this.perfil.estadoVerificacion)) {
      this.perfil.estadoVerificacion = 'pending_validation';
    }
    this.toast('Puedes continuar después', 'info');
  }

  avanzarModal(): void {
    const flow = this.getModalFlow();
    const idx = flow.indexOf(this.modalStep);
    if (idx < flow.length - 1) this.modalStep = flow[idx + 1];
  }

  simularExito(): void {
    this.modalStep = 'verifying';
    setTimeout(() => this.completarVerificacion(), 1500);
  }

  simularRechazoBorroso(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    this.perfil.estadoVerificacion = 'rejected';
    this.perfil.rejectLabel = 'DOCUMENT_BLURRY';
    this.perfil.codigoRechazo = 'SUP-' + Math.floor(10000 + Math.random() * 90000);
    this.perfil.intentosRestantes = Math.max(0, this.perfil.intentosRestantes - 1);
    this.perfil.minutosParaReintento = this.perfil.intentosRestantes > 0 ? 10 : 0;
    if (this.perfil.journey === 'global_nuevo') {
      this.phase = 'entry_disabled';
      this.formData = {};
      this.perfil.documentoObtenidoAPI = false;
      this.perfil.camposPrecargados = {};
    } else if (this.perfil.journey === 'colombia_nuevo') {
      this.phase = 'wizard_post_msg';
    } else {
      this.phase = 'revalid_pending';
    }
    this.toast('Validación rechazada', 'error');
  }

  simularRevisionManual(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    this.precargarCamposVerificados();
    this.perfil.estadoVerificacion = 'in_review';
    this.perfil.documentoObtenidoAPI = true;
    this.phase = 'approved_readonly';
    this.toast('Tu verificación fue enviada a revisión manual', 'info');
  }

  simularCancelar(): void {
    this.cerrarModalSdk();
  }

  contactarSoporte(): void {
    this.toast('Abriendo chat de soporte (mock Intercom)…', 'info');
  }

  getModalStepLabel(): string {
    const labels: Record<ModalStep, string> = {
      document: 'Selecciona tu documento',
      capture: 'Captura tu documento',
      selfie: 'Toma una selfie',
      verifying: 'Verificando datos…',
      'kyb-empresa': 'Datos de la empresa',
      'kyb-docs': 'Documentos de la empresa',
      'kyb-rep': 'Verificación del representante legal',
    };
    return labels[this.modalStep];
  }

  // ── Private ────────────────────────────────────────────────────

  private getModalFlow(): ModalStep[] {
    return this.isJuridica
      ? ['kyb-empresa', 'kyb-docs', 'kyb-rep', 'document', 'capture', 'selfie', 'verifying']
      : ['document', 'capture', 'selfie', 'verifying'];
  }

  private completarVerificacion(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    this.sessionInterrupted = false;
    this.simulateTimeout = false;
    this.precargarCamposVerificados();
    this.perfil.documentoObtenidoAPI = true;
    this.perfil.estadoVerificacion = 'approved';
    this.perfil.fechaBloqueoEdicion = this.addMonths(new Date(), 6);
    this.phase = 'approved_readonly';
    this.toast('Se precarga la información validada en el formulario deshabilitado', 'success');
  }

  private precargarCamposVerificados(): void {
    const pais = this.perfil.paisOperacion;
    const isJur = this.isJuridica;

    if (this.perfil.journey === 'colombia_nuevo' && Object.keys(this.formData).length > 0) {
      // Colombia: data from user form
    } else if (isJur) {
      this.formData = {
        razonSocial: this.formData['razonSocial'] || 'Comercial ' + this.paisNombre + ' S.A.S.',
        nit: pais === 'CO' ? '900123456-7' : '',
        rfc: pais === 'MX' ? 'COM900123ABC' : '',
        cuit: pais === 'AR' ? '30-71234567-8' : '',
        emailFacturacion: this.perfil.email,
        emailContacto: this.perfil.email,
        telefonoCelular: this.perfil.telefono,
        representanteLegal: 'Representante Legal Verificado',
        tipoPersona: 'Persona jurídica',
        tipoDocEmpresa: pais === 'CO' ? 'NIT' : pais === 'MX' ? 'RFC' : 'CUIT',
        numeroDocEmpresa: pais === 'CO' ? '900123456-7' : '',
        documentoAdjunto: 'certificado-existencia.pdf',
        ...this.perfil.camposPrecargados,
        ...this.formData,
      };
    } else {
      this.formData = {
        primerNombre: this.formData['primerNombre'] || 'Usuario',
        segundoNombre: this.formData['segundoNombre'] || '',
        primerApellido: this.formData['primerApellido'] || 'Verificado',
        segundoApellido: this.formData['segundoApellido'] || '',
        fechaNacimiento: this.formData['fechaNacimiento'] || '01/01/1990',
        nacionalidad: this.formData['nacionalidad'] || this.paisNombre,
        tipoDocIdentidad:
          this.formData['tipoDocIdentidad'] ||
          (pais === 'CO' ? 'Cédula de ciudadanía' : pais === 'MX' ? 'INE' : 'DNI'),
        documento: this.formData['documento'] || '1234567890',
        emailContacto: this.perfil.email,
        telefonoCelular: this.perfil.telefono,
        direccionPersonal: this.formData['direccionPersonal'] || 'Dirección verificada por ' + this.providerLabel,
        emailFacturacion: this.perfil.email,
        nombreRazonSocial: this.formData['nombreRazonSocial'] ||
          `${this.formData['primerNombre'] || 'Usuario'} ${this.formData['primerApellido'] || 'Verificado'}`,
        tipoPersona: 'Persona natural',
        tipoDocEmpresa: pais === 'CO' ? 'Cédula de ciudadanía' : pais === 'MX' ? 'INE' : 'DNI',
        numeroDocEmpresa: this.formData['documento'] || '1234567890',
        documentoAdjunto: 'documento-validado.pdf',
        ...this.perfil.camposPrecargados,
      };
    }

    const geoKeys = this.camposGeoPorPais[pais] || [];
    const geoDefaults: Record<string, string> = {
      municipio: 'Bogotá D.C.',
      region: 'Metropolitana',
      comuna: 'Providencia',
      ciudad: 'Ciudad de México',
      codigoPostal: '06600',
      provincia: 'Buenos Aires',
      ciudadLocalidad: 'CABA',
    };
    geoKeys.forEach((key) => {
      if (!this.formData[key]) this.formData[key] = geoDefaults[key] || '';
    });

    const tribKeys = this.camposPorPais[pais] || [];
    const tribDefaults: Record<string, Record<string, string>> = {
      CO: { regimen: 'Régimen común', responsabilidad: 'Responsable de IVA', impuesto: 'IVA' },
      MX: { regimenFiscal: 'Régimen de Sueldos y Salarios', rfc: 'XAXX010101000', sujetoImpuestos: 'Sí' },
      AR: { condicionIVA: 'Consumidor Final', cuit: '20-12345678-9' },
      CL: { rut: '12.345.678-9', giro: 'Comercio al por menor' },
      EC: { ruc: '1791234567001', tipoContribuyente: 'Persona natural' },
    };
    tribKeys.forEach((key) => {
      if (!this.formData[key]) this.formData[key] = tribDefaults[pais]?.[key] || '';
    });

    this.perfil.camposPrecargados = { ...this.formData };
  }

  private precargarCrossCountry(): void {
    this.formData = {
      primerNombre: 'María',
      primerApellido: 'García',
      documento: '1098765432',
      emailContacto: this.perfil.email,
      telefonoCelular: this.perfil.telefono,
      emailFacturacion: this.perfil.email,
      nombreRazonSocial: 'María García',
      tipoPersona: 'Persona natural',
      direccionPersonal: 'Dirección verificada en otro país Dropi',
      tipoDocIdentidad: 'Cédula de ciudadanía',
      tipoDocEmpresa: 'Cédula de ciudadanía',
      numeroDocEmpresa: '1098765432',
    };
  }

  private initEditableForm(): void {
    this.formData = {
      emailContacto: this.perfil.email,
      telefonoCelular: this.perfil.telefono,
      emailFacturacion: this.perfil.email,
      nacionalidad: this.perfil.paisOperacion === 'CO' ? 'Colombia' : this.paisNombre,
      tipoPersona: this.isJuridica ? 'Persona jurídica' : 'Persona natural',
      tipoDocIdentidad: this.isJuridica ? 'NIT' : 'Cédula de ciudadanía',
      tipoDocEmpresa: this.isJuridica ? 'NIT' : 'Cédula de ciudadanía',
      primerNombre: '',
      primerApellido: '',
      documento: '',
      direccionPersonal: '',
      razonSocial: '',
      nit: '',
      documentoAdjunto: '',
      ...this.perfil.camposPrecargados,
    };
    this.formErrors = {};
    this.aceptaTyC = false;
  }

  private validateForm(): boolean {
    if (!this.inFlow) return false;
    this.formErrors = {};
    const required = this.isJuridica
      ? ['razonSocial', 'nit', 'direccionPersonal', 'emailFacturacion']
      : ['primerNombre', 'primerApellido', 'documento', 'direccionPersonal', 'tipoDocIdentidad'];

    this.cachedGeoFields.forEach((g) => required.push(g.key));
    if (this.showTributariaColombiaOnly) {
      this.cachedTributariaFields.forEach((t) => required.push(t.key));
    }

    required.forEach((field) => {
      if (!this.formData[field]?.trim()) this.formErrors[field] = 'Campo obligatorio';
    });

    if (this.perfil.journey === 'colombia_nuevo' && !this.aceptaTyC) {
      this.toast('Debes aceptar los Términos y Condiciones', 'error');
      return false;
    }

    return Object.keys(this.formErrors).length === 0;
  }

  private loadPerfil(id: string): void {
    const found = this.perfiles.find((p) => p.id === id);
    if (!found) {
      this.toast('Perfil de demo no encontrado. Recarga la página.', 'error');
      return;
    }
    this.perfil = { ...found, camposPrecargados: { ...found.camposPrecargados } };
    this.inFlow = true;
    this.selectedPerfilId = id;
    this.tipoPersonaSeleccionado = found.tipoPersona;
    this.crossCountryChoice = null;
    this.aceptaTyC = false;
    this.sessionInterrupted = false;
    this.simulateTimeout = false;
    this.showSdkModal = false;
    this.showMfaModal = false;
    this.criticalFieldsChanged = false;
    this.diffMessage = '';

    if (found.journey === 'edicion_datos') {
      this.formData = { ...found.camposPrecargados };
      this.editSnapshot = { ...found.camposPrecargados };
      this.phase = found.estadoVerificacion === 'approved' ? 'readonly_blocked' : 'saved_readonly';
    } else if (found.estadoVerificacion === 'approved') {
      this.formData = { ...found.camposPrecargados };
      this.phase = 'approved_readonly';
    } else if (found.estadoVerificacion === 'in_review' && Object.keys(found.camposPrecargados).length > 0) {
      this.formData = { ...found.camposPrecargados };
      this.phase = 'approved_readonly';
    } else if (found.estadoVerificacion === 'email_baneado') {
      this.phase = 'entry_disabled';
      this.formData = {};
    } else {
      this.resetToEntry();
      if (['pending_validation', 'rejected', 'rejected_field'].includes(found.estadoVerificacion)) {
        if (found.journey === 'colombia_nuevo') {
          this.phase = 'wizard_post_msg';
          this.wizardStep = 2;
        } else {
          this.phase = 'wizard_post_msg';
          this.wizardStep = 3;
        }
        this.aceptaTyC = true;
      }
    }
    this.refreshDerivedState();
  }

  private refreshDerivedState(): void {
    if (!this.inFlow) {
      this.cachedGeoFields = [];
      this.cachedTributariaFields = [];
      this.cachedSteps = [];
      return;
    }

    const pais = this.perfil.paisOperacion;
    const geoKeys = this.camposGeoPorPais[pais] || [];
    this.cachedGeoFields = geoKeys.map((key) => ({
      key,
      label: this.geoLabels[key] || key,
    }));

    const tributariaLabels: Record<string, string> = {
      regimen: 'Tipo de régimen',
      responsabilidad: 'Tipo de responsabilidad',
      impuesto: 'Impuesto',
      regimenFiscal: 'Régimen fiscal',
      rfc: 'RFC',
      sujetoImpuestos: 'Sujeto a impuestos',
      condicionIVA: 'Condición frente al IVA / Régimen fiscal',
      cuit: 'CUIT',
      rut: 'RUT',
      giro: 'Giro comercial',
      ruc: 'RUC',
      tipoContribuyente: 'Tipo de contribuyente',
    };

    if (this.showTributariaColombiaOnly) {
      const tribKeys = this.camposPorPais[pais] || [];
      this.cachedTributariaFields = tribKeys.map((key) => ({
        key,
        label: tributariaLabels[key] || key,
      }));
    } else {
      this.cachedTributariaFields = [];
    }

    const stepLabels =
      this.perfil.journey === 'global_nuevo'
        ? ['Tipo de cuenta', 'Preparación', 'Instrucciones']
        : ['Preparación', 'Instrucciones'];

    this.cachedSteps = stepLabels.map((label, i) => {
      const n = i + 1;
      let state: StepItem['state'] = 'pending';
      if (n < this.wizardStep) state = 'completed';
      else if (n === this.wizardStep) state = 'focus';
      return { label, state };
    });
  }

  private resetToEntry(): void {
    this.phase = 'entry_disabled';
    this.wizardStep = 1;
    this.formData = {};
    this.formErrors = {};
    this.aceptaTyC = false;
    if (this.perfil) this.tipoPersonaSeleccionado = this.perfil.tipoPersona;
    this.refreshDerivedState();
  }

  private addMonths(date: Date, months: number): string {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
  }

  private toast(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3200);
  }
}
