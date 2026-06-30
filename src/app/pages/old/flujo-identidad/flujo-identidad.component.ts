import { Component, signal, OnDestroy, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../common/services/toast.service';
import { DropiToastComponent } from '../../../common/components/dropi-toast/dropi-toast.component';
import { IdentidadTourService, TourStep } from '../../../common/services/identidad-tour.service';
import { IdentidadTourComponent } from '../../../common/components/identidad-tour/identidad-tour.component';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import billingFieldsLatam from '../../../../../mocks/billing-fields-latam.json';
import {
  OrigenValidacion,
  UserType,
  EstadoId,
  PaisPersona,
  Pais,
  TipoPersona,
  SelectorOption,
  FormNucleo,
  FormFiscal,
  FormFacturacion,
  MockUserData,
  MOCK_USERS,
  DEMO_SCENARIO_PRESETS,
  DemoScenarioPreset,
  ACTIVIDAD_ECONOMICA_OPTIONS,
  DEFAULT_SUMSUB_CUSTOMIZATION,
  SumsubCustomizationConfig,
  SumsubScreenPhase,
  SUMSUB_CAPTURE_STEPS,
  emptyFormNucleo,
  emptyFormFiscal,
  emptyFormFacturacion,
  buildNombreCompleto,
  deriveResponsableIVA,
} from '../../../common/models/identity-flow.models';

// -----------------------------------------------------------------------
// Local view types
// -----------------------------------------------------------------------
type VistaId =
  | 'v-nueva-bloqueada'
  | 'v-nueva-onboarding'
  | 'v-nueva-formulario'
  | 'v-validado-datos'
  | 'v-validado-campos-nuevos'
  | 'v-guardada-sin-comenzar'
  | 'v-incompleta'
  | 'v-en-revision'
  | 'v-rechazada'
  | 'v-baneada'
  | 'v-email-baneado'
  | 'v-cross-country'
  | 'v-exitosa';
type ModalId =
  | 'm-mfa'
  | 'm-prefill-billing'
  | 'm-confirmacion-pre-sumsub'
  | 'm-sumsub'
  | 'm-apelacion'
  | 'm-documento'
  | 'm-doc-preview'
  | 'm-salir-sin-guardar';

interface DocumentUploadSlot {
  label: string;
  required: boolean;
  fileName: string | null;
}

@Component({
  selector: 'app-flujo-identidad',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiToastComponent, IdentidadTourComponent],
  templateUrl: './flujo-identidad.component.html',
  styleUrls: ['./flujo-identidad.component.scss'],
})
export class FlujoIdentidadComponent implements OnDestroy, OnInit {

  private toast = inject(ToastService);
  private tour = inject(IdentidadTourService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private identityDemo = inject(IdentityDemoStateService);

  readonly actividadEconomicaOptions = ACTIVIDAD_ECONOMICA_OPTIONS;
  readonly demoPresets = DEMO_SCENARIO_PRESETS;
  readonly vistaMap: { id: VistaId; label: string }[] = [
    { id: 'v-nueva-bloqueada', label: 'Entrada bloqueada' },
    { id: 'v-nueva-onboarding', label: 'Onboarding' },
    { id: 'v-nueva-formulario', label: 'Formulario' },
    { id: 'v-guardada-sin-comenzar', label: 'Guardada sin comenzar' },
    { id: 'v-incompleta', label: 'Incompleta' },
    { id: 'v-en-revision', label: 'En revisión' },
    { id: 'v-rechazada', label: 'Rechazada' },
    { id: 'v-baneada', label: 'Baneada' },
    { id: 'v-email-baneado', label: 'Email baneado' },
    { id: 'v-cross-country', label: 'Cross-country' },
    { id: 'v-exitosa', label: 'Exitosa' },
    { id: 'v-validado-datos', label: 'Validado · datos' },
    { id: 'v-validado-campos-nuevos', label: 'Validado · campos nuevos' },
  ];
  vistaMapOpen = signal(false);
  copyLinkFeedback = signal(false);
  confirmacionAceptada = signal(false);
  sumsubPhase = signal<SumsubScreenPhase>('warning');
  sumsubCustomization = signal<SumsubCustomizationConfig>({ ...DEFAULT_SUMSUB_CUSTOMIZATION });
  sumsubDemoExpanded = signal(false);

  ngOnInit(): void {
    this.applyQueryParams(this.route.snapshot.queryParamMap);
    this.route.queryParamMap.subscribe(params => this.applyQueryParams(params));
    this.syncIdentityDemoState();
  }

  constructor() {
    this.tour.setSteps(this.buildTourSteps());
    const saved = sessionStorage.getItem('fid-demo-mode');
    if (saved === 'open' || saved === 'hidden') {
      this.demoMode.set(saved);
    }
  }

  // ── Stakeholder guided tour ───────────────────────────────────────────

  private buildTourSteps(): TourStep[] {
    return [
      {
        id: 'bienvenida',
        title: 'Prototipo de Validación de Identidad',
        body: 'Este es el flujo KYC/KYB con el que un usuario verifica su identidad para desbloquear Dropi. Recorre los pasos para ver cada estado del proceso. Usa la barra superior para explorar combinaciones por tu cuenta.',
        placement: 'center',
      },
      {
        id: 'selector-usuario',
        title: '1 · Tipo de usuario',
        body: 'Simula distintos perfiles: un usuario nuevo sin datos, uno antiguo con datos completos, uno con campos nuevos pendientes o un caso cross-country (ya activo en otro país).',
        target: '[data-tour="selector-usuario"]',
        placement: 'bottom',
        onEnter: () => this.setUserType('nuevo-sin-datos'),
      },
      {
        id: 'selector-estado',
        title: '2 · Estado de validación',
        body: 'Desde aquí saltamos a cualquier estado del proceso: en revisión, aprobada, rechazada o baneada. Es el control principal para demostrar el flujo completo.',
        target: '[data-tour="selector-estado"]',
        placement: 'bottom',
        onEnter: () => this.setEstado('inicial'),
      },
      {
        id: 'selector-pais',
        title: '3 · País y tipo de persona',
        body: 'Cada país (CO, MX, AR, CL, EC) y tipo de persona (natural o jurídica) cambia los documentos, campos fiscales y la copia. El formulario se adapta automáticamente.',
        target: '[data-tour="selector-pais"]',
        placement: 'bottom',
      },
      {
        id: 'stepper',
        title: 'Qué va a pasar',
        body: 'Completa tus datos, verifica con Sumsub y espera la aprobación. El formulario tiene 2 pasos antes de la verificación biométrica.',
        target: '[data-tour="fid-hero-journey"]',
        placement: 'bottom',
        onEnter: () => { this.setEstado('inicial'); this.navTo('v-nueva-bloqueada'); },
      },
      {
        id: 'formulario-dos-pasos',
        title: 'Formulario en 2 pasos',
        body: 'Paso 1: datos personales y contacto. Paso 2: información tributaria según el país. La validación inline evita enviar campos vacíos.',
        target: '[data-tour="fid-form"]',
        placement: 'bottom',
        onEnter: () => { this.setEstado('inicial'); this.navTo('v-nueva-formulario'); this.formStep.set(1); },
      },
      {
        id: 'formulario-fiscal',
        title: 'Paso 2 · Información tributaria',
        body: 'Colombia, México y Argentina tienen campos fiscales alineados con el Excel de facturación LATAM del proveedor.',
        target: '[data-tour="fid-form"]',
        placement: 'bottom',
        onEnter: () => { this.setEstado('inicial'); this.navTo('v-nueva-formulario'); this.formStep.set(2); this.initFormData(); },
      },
      {
        id: 'confirmacion-pre-sumsub',
        title: 'Confirmación antes de Sumsub',
        body: 'El usuario debe confirmar que sus datos coinciden con el documento antes de la verificación biométrica — evita quemar intentos.',
        placement: 'center',
        onEnter: () => {
          this.setEstado('inicial');
          this.navTo('v-nueva-formulario');
          this.initFormData();
          this.formStep.set(this.paisConFiscal ? 2 : 1);
          this.confirmacionAceptada.set(false);
          this.openModal('m-confirmacion-pre-sumsub');
        },
      },
      {
        id: 'sumsub-mock',
        title: 'Sumsub WebSDK (mock customizado Dropi)',
        body: 'Simula warning, welcome, instrucciones y captura con branding Dropi según la customización del Dashboard Sumsub.',
        placement: 'center',
        onEnter: () => {
          this.confirmacionAceptada.set(true);
          this.openSumsubMock();
        },
      },
      {
        id: 'estado-revision',
        title: 'Así espera el usuario',
        body: 'Tras enviar sus documentos, el usuario ve esta pantalla de espera mientras el equipo valida su identidad. Estado: paso 2 "Verificación".',
        placement: 'center',
        onEnter: () => this.setEstado('en-revision'),
      },
      {
        id: 'estado-aprobada',
        title: 'Activación y beneficios',
        body: 'Cuando la verificación es exitosa, este es el momento de activación: identidad verificada y todo Dropi desbloqueado. Es el resultado que buscamos para cada usuario.',
        placement: 'center',
        onEnter: () => this.setEstado('recien-aprobada'),
      },
      {
        id: 'estado-rechazada',
        title: 'Motivo, reintento y apelación',
        body: 'Si algo falla, el usuario ve el motivo claro, sus intentos restantes y puede reintentar o contactar a soporte.',
        placement: 'center',
        onEnter: () => this.setEstado('rechazada-reintentar'),
      },
      {
        id: 'activacion-modulos',
        title: 'Activación cross-módulo',
        body: 'La ia-card en catálogo, retiros y otros módulos refleja el mismo estado demo. Usa los enlaces del panel para verlo.',
        target: '[data-tour="demo-nav-catalogo"]',
        placement: 'bottom',
      },
      {
        id: 'copiar-enlace',
        title: 'Compartir demo',
        body: 'Copia un enlace con el estado actual para que otro stakeholder vea exactamente la misma pantalla.',
        target: '[data-tour="demo-copy-link"]',
        placement: 'bottom',
      },
    ];
  }

  startTour(): void {
    if (this.demoMode() === 'hidden') this.openDemo();
    this.tour.start();
  }

  // ── Selector options ──────────────────────────────────────────────────

  readonly origenOptions: SelectorOption<OrigenValidacion>[] = [
    { id: 'configuraciones', label: 'Origen: Configuraciones', color: 'neutral' },
    { id: 'retiro',          label: 'Origen: Retiro (bloqueo)', color: 'warning' },
    { id: 'dropicard',       label: 'Origen: Dropicard', color: 'neutral' },
  ];

  readonly userTypeOptions: SelectorOption<UserType>[] = [
    { id: 'nuevo-sin-datos',       label: 'Nuevo sin datos',             color: 'neutral' },
    { id: 'antiguo-completo',      label: 'Antiguo · datos completos',   color: 'neutral' },
    { id: 'antiguo-campos-nuevos', label: 'Antiguo · campos nuevos',     color: 'warning' },
    { id: 'cross-country',         label: 'Cross-country',               color: 'neutral' },
  ];

  readonly estadoOptions: SelectorOption<EstadoId>[] = [
    { id: 'inicial',              label: 'Estado inicial',               color: 'neutral' },
    { id: 'guardado-sin-comenzar',label: 'Datos guardados · sin comenzar', color: 'neutral' },
    { id: 'incompleta',           label: 'Incompleta · puede retomar',   color: 'warning' },
    { id: 'en-revision',          label: 'En revisión',                  color: 'warning' },
    { id: 'recien-aprobada',      label: 'Recién aprobada · celebración', color: 'success' },
    { id: 'aprobado-bloqueado',    label: 'Aprobada · bloqueo 6 meses',  color: 'warning' },
    { id: 'aprobado-listo-editar', label: 'Aprobada · puede actualizar', color: 'success' },
    { id: 'rechazada-espera',     label: 'Rechazada · espera 10 min',    color: 'error'   },
    { id: 'rechazada-reintentar', label: 'Rechazada · puede reintentar', color: 'error'   },
    { id: 'baneada',              label: 'Baneada (3 rechazos)',          color: 'error'   },
    { id: 'email-baneado',        label: 'Email baneado cross-country',  color: 'error'   },
  ];

  readonly heroJourneySteps = [
    { num: 1, label: 'Completa tus datos', desc: 'Datos personales y facturación' },
    { num: 2, label: 'Verifica con Sumsub', desc: 'Documento y selfie biométrica' },
    { num: 3, label: 'Revisión y aprobación', desc: 'Te avisamos cuando esté listo' },
  ];

  readonly paisOptions: SelectorOption<PaisPersona>[] = [
    { id: 'co-natural',  label: 'CO · Natural',  color: 'neutral' },
    { id: 'co-juridica', label: 'CO · Jurídica', color: 'neutral' },
    { id: 'mx-natural',  label: 'MX · Natural',  color: 'neutral' },
    { id: 'mx-juridica', label: 'MX · Jurídica', color: 'neutral' },
    { id: 'ar-natural',  label: 'AR · Natural',  color: 'neutral' },
    { id: 'ar-juridica', label: 'AR · Jurídica', color: 'neutral' },
    { id: 'cl',          label: 'CL',            color: 'neutral' },
    { id: 'ec',          label: 'EC',            color: 'neutral' },
  ];

  // ── 3 selectors ───────────────────────────────────────────────────────

  selectorUsuario = signal<UserType>('nuevo-sin-datos');
  selectorEstado  = signal<EstadoId>('inicial');
  selectorPais    = signal<PaisPersona>('co-natural');
  selectorOrigen  = signal<OrigenValidacion>('configuraciones');

  // ── Navigation state ─────────────────────────────────────────────────

  vistaActiva = signal<VistaId>('v-nueva-bloqueada');
  modalActivo = signal<ModalId | null>(null);

  // ── Onboarding state ─────────────────────────────────────────────────

  onboardingStep = signal<1 | 2>(1);
  demoMode = signal<'hidden' | 'open'>('hidden');
  private demoFabReturn: HTMLElement | null = null;
  private modalFocusReturn: HTMLElement | null = null;

  // ── Form step (2-step form) ───────────────────────────────────────────

  formStep = signal<1 | 2>(1);
  onboardingTipoPersona: TipoPersona = 'natural';
  fieldErrors = signal<Record<string, string>>({});
  sumsubStepGuardado = signal<number>(0);

  // ── Form data (plain objects for ngModel) ────────────────────────────

  formNucleo: FormNucleo = emptyFormNucleo();
  formFiscal: FormFiscal = emptyFormFiscal();
  formFacturacion: FormFacturacion = emptyFormFacturacion();
  documentSlots: DocumentUploadSlot[] = [];
  previewDocName = '';

  readonly billingLatam = billingFieldsLatam;
  validadoTab = signal<'personal' | 'facturacion'>('personal');
  pendingFacturacionRevalidation = signal(false);
  sumsubContext = signal<'initial' | 'facturacion-revalidation'>('initial');

  // ── Sumsub mock ───────────────────────────────────────────────────────

  sumsubStep = signal<number>(0);
  sumsubLoading = signal<boolean>(false);
  readonly sumsubSteps = SUMSUB_CAPTURE_STEPS;

  // ── MFA / OTP ─────────────────────────────────────────────────────────

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpError = signal<string>('');

  // ── Countdown (rechazada-espera) ──────────────────────────────────────

  countdownSeconds = signal<number>(600);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // ── Other state ───────────────────────────────────────────────────────

  intentosRestantes = signal<number>(2);
  apelacionTexto = '';
  apelacionEnviada = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  reasonsExpanded = signal<boolean>(false);

  readonly rejectionReasonsList = [
    { code: 'DOCUMENT_BLURRY',       label: 'Documento borroso',           description: 'La imagen del documento no es legible. Ubícate en un lugar bien iluminado y sin reflejos.' },
    { code: 'FACE_NOT_VISIBLE',      label: 'Rostro no visible',           description: 'Tu rostro no aparece claramente en la selfie o está cubierto parcialmente.' },
    { code: 'DOCUMENT_EXPIRED',      label: 'Documento vencido',           description: 'El documento que usaste ya no está vigente. Solo aceptamos documentos en vigencia.' },
    { code: 'DOCUMENT_COPY',         label: 'No se aceptan copias',        description: 'Solo documentos originales. No fotocopias ni capturas de pantalla del documento.' },
    { code: 'FACE_COVERED',          label: 'Rostro cubierto',             description: 'Retira gafas de sol, gorras o cualquier elemento que cubra tu cara.' },
    { code: 'SELFIE_MISMATCH',       label: 'Selfie no coincide',          description: 'La selfie no corresponde a la persona en el documento de identidad.' },
    { code: 'DOCUMENT_NOT_READABLE', label: 'Datos ilegibles',             description: 'La información en el documento no se puede leer con claridad. Revisa la resolución de la foto.' },
    { code: 'LIGHTING_ISSUE',        label: 'Mala iluminación',            description: 'Ubícate donde haya luz directa, sin sombras sobre el documento o tu rostro.' },
    { code: 'DOCUMENT_FRONT_MISSING',label: 'Falta cara frontal',          description: 'No se cargó la parte delantera del documento.' },
    { code: 'DOCUMENT_BACK_MISSING', label: 'Falta reverso del documento', description: 'No se cargó el reverso del documento.' },
    { code: 'MULTIPLE_FACES',        label: 'Más de un rostro',            description: 'En la selfie solo debe aparecer la persona que se está validando.' },
    { code: 'DOCUMENT_INVALID',      label: 'Tipo de documento inválido',  description: 'El tipo de documento seleccionado no es válido para tu país de residencia.' },
  ];
  camposNuevosEditables = signal<string[]>([]);

  // -----------------------------------------------------------------------
  // Computed getters
  // -----------------------------------------------------------------------

  get estadoBadge(): { label: string; variant: 'neutral' | 'success' | 'warning' | 'error' } | null {
    const es = this.selectorEstado();
    const map: Partial<Record<EstadoId, { label: string; variant: 'neutral' | 'success' | 'warning' | 'error' }>> = {
      'inicial':               { label: 'Sin iniciar', variant: 'neutral' },
      'guardado-sin-comenzar': { label: 'Datos guardados', variant: 'neutral' },
      'incompleta':            { label: 'Incompleta', variant: 'warning' },
      'en-revision':           { label: 'En revisión', variant: 'warning' },
      'recien-aprobada':       { label: 'Recién aprobada', variant: 'success' },
      'aprobada':              { label: 'Validada', variant: 'success' },
      'rechazada-espera':      { label: 'Rechazada', variant: 'error' },
      'rechazada-reintentar':  { label: 'Rechazada', variant: 'error' },
      'baneada':               { label: 'Cuenta restringida', variant: 'error' },
      'email-baneado':         { label: 'Email bloqueado', variant: 'error' },
      'aprobado-bloqueado':    { label: 'Validada · en espera', variant: 'warning' },
      'aprobado-listo-editar': { label: 'Validada', variant: 'success' },
    };
    return map[es] ?? null;
  }

  get sumsubProgresoLabel(): string {
    const step = this.sumsubStepGuardado();
    if (step <= 0) {
      return 'Aún no iniciaste la verificación biométrica.';
    }
    const completado = this.sumsubSteps[step - 1];
    const pendientes = this.sumsubSteps.slice(step);
    if (pendientes.length === 0) {
      return 'Completaste todos los pasos biométricos.';
    }
    return `Completaste "${completado}". Falta: ${pendientes.join(', ')}.`;
  }

  get camposNuevosLabels(): string[] {
    const labelMap: Record<string, string> = {
      co_impuesto: 'Impuesto (Colombia)',
      co_tipoRegimen: 'Tipo de régimen (Colombia)',
      co_tipoResponsabilidad: 'Responsabilidad tributaria (Colombia)',
      mx_codigoPostal: 'Código postal (México)',
      mx_regimenFiscal: 'Régimen fiscal SAT (México)',
      mx_sujetoImpuestos: 'Sujeto a impuestos (México)',
      ar_condicionIVA: 'Condición IVA (Argentina)',
      ar_provincia: 'Provincia (Argentina)',
    };
    return this.camposNuevos.map(c => labelMap[c] ?? c);
  }

  get esBloqueoDuro(): boolean {
    return this.selectorOrigen() === 'retiro';
  }

  get heroEncuadre(): { titulo: string; descripcion: string } {
    const map: Record<OrigenValidacion, { titulo: string; descripcion: string }> = {
      configuraciones: {
        titulo: 'Desbloquea tu cuenta en Dropi',
        descripcion: 'Un proceso rápido que no volverás a repetir. Tu cuenta queda completamente habilitada.',
      },
      retiro: {
        titulo: 'Verifica tu identidad para retirar',
        descripcion: 'Solo una vez. La aprobación es permanente y queda registrada en tu cuenta.',
      },
      dropicard: {
        titulo: 'Activa tu Dropicard',
        descripcion: 'Una verificación rápida para operar tu tarjeta en todos tus mercados sin restricciones.',
      },
      transferencia: {
        titulo: 'Verifica tu identidad para transferir',
        descripcion: 'En menos de 5 minutos confirmamos quién eres. Tus transferencias entre cuentas quedan habilitadas de forma permanente.',
      },
    };
    return map[this.selectorOrigen()];
  }

  get heroBenefits(): { icon: string; label: string; desc: string }[] {
    const all: Record<OrigenValidacion, { icon: string; label: string; desc: string }[]> = {
      configuraciones: [
        { icon: 'assets/icons/sidebar/gali-v5/wallet.svg', label: 'Retiros sin límites',     desc: 'Transfiere tus ganancias a tu cuenta bancaria cuando quieras' },
        { icon: 'assets/icons/sidebar/receipt.svg',         label: 'Facturación habilitada', desc: 'Genera facturas y gestiona tus finanzas con total control' },
        { icon: 'assets/icons/sidebar/card.svg',            label: 'Dropicard lista',         desc: 'Tu tarjeta Dropi disponible para operar en todos los países' },
      ],
      retiro: [
        { icon: 'assets/icons/sidebar/gali-v5/wallet.svg', label: 'Retiro inmediato',  desc: 'Transfiere en cuanto termines la verificación' },
        { icon: 'assets/icons/sidebar/certificated.svg',    label: 'Proceso seguro',   desc: 'Tus datos están cifrados y protegidos en todo momento' },
        { icon: 'assets/icons/sidebar/user-check.svg',      label: 'Solo esta vez',    desc: 'No volverás a pasar por este paso — es permanente' },
      ],
      dropicard: [
        { icon: 'assets/icons/sidebar/card.svg',               label: 'Dropicard activa',         desc: 'Úsala en cualquier país donde operes con Dropi' },
        { icon: 'assets/icons/sidebar/gali-v5/money-coin.svg', label: 'Transferencias libres',    desc: 'Mueve dinero entre tus cuentas Dropi sin restricciones' },
        { icon: 'assets/icons/sidebar/certificated.svg',        label: 'Cuenta verificada',       desc: 'Cumple con las regulaciones de los 12 países de operación' },
      ],
      transferencia: [
        { icon: 'assets/icons/sidebar/gali-v5/money-coin.svg', label: 'Transferencias libres', desc: 'Mueve dinero entre tus cuentas Dropi sin restricciones' },
        { icon: 'assets/icons/sidebar/certificated.svg',        label: 'Proceso seguro',        desc: 'Tus datos están cifrados y protegidos en todo momento' },
        { icon: 'assets/icons/sidebar/user-check.svg',          label: 'Solo esta vez',          desc: 'No volverás a pasar por este paso — es permanente' },
      ],
    };
    return all[this.selectorOrigen()];
  }

  get telefonoEnmascarado(): string {
    const t = this.mockUser.telefono.replace(/\D/g, '');
    return t.length >= 4 ? `***${t.slice(-4)}` : this.mockUser.telefono;
  }

  get origenRetornoLabel(): string {
    const map: Record<OrigenValidacion, string> = {
      configuraciones: 'Volver a Configuraciones',
      retiro: 'Continuar con mi retiro',
      dropicard: 'Volver a Dropicard',
      transferencia: 'Continuar con mi transferencia',
    };
    return map[this.selectorOrigen()];
  }

  get beneficioDesbloqueado(): string {
    const map: Record<OrigenValidacion, string> = {
      configuraciones: 'usar todas las funciones de tu cuenta',
      retiro: 'procesar retiros de saldo',
      dropicard: 'solicitar tu Dropicard',
      transferencia: 'transferir entre tus cuentas',
    };
    return map[this.selectorOrigen()];
  }

  get intentosAgotados(): boolean {
    return this.intentosRestantes() <= 0;
  }

  get vistaSubtitle(): string {
    if (this.vistaActiva() === 'v-nueva-formulario') {
      if (this.paisConFiscal) {
        return this.formStep() === 1
          ? 'Datos personales y de contacto'
          : 'Información tributaria';
      }
      return 'Datos personales y de contacto';
    }
    const map: Partial<Record<VistaId, string>> = {
      'v-nueva-bloqueada':      'Verifica tu identidad para desbloquear tu cuenta',
      'v-nueva-onboarding':     'Revisa lo que necesitas antes de abrir el formulario',
      'v-validado-datos':       'Tus datos están verificados y protegidos',
      'v-validado-campos-nuevos': 'Completa los campos obligatorios por regulación',
      'v-guardada-sin-comenzar': 'Tus datos están guardados — falta la verificación biométrica',
      'v-incompleta':           'Retoma la captura o revisa los datos guardados',
      'v-en-revision':          `Notificación a ${this.mockUser.email} · menos de 24 h hábiles`,
      'v-rechazada':            'Revisa el motivo y vuelve a intentarlo',
      'v-baneada':              'Contacta soporte para revisar tu caso',
      'v-email-baneado':        'Este correo no puede usarse en Dropi',
      'v-cross-country':        'Reutiliza tus datos o ingresa información para este país',
      'v-exitosa':              `Ya puedes ${this.beneficioDesbloqueado}`,
    };
    return map[this.vistaActiva()] ?? '';
  }

  get motivoBaneo(): string {
    return this.selectorEstado() === 'email-baneado'
      ? `El correo ${this.mockUser.email} fue bloqueado por actividad sospechosa en otro país de Dropi.`
      : 'Tu cuenta superó el límite de intentos de verificación fallidos (3 rechazos consecutivos).';
  }

  get mockUser(): MockUserData {
    return MOCK_USERS[this.selectorPais()];
  }

  get pais(): Pais {
    return this.mockUser.pais;
  }

  get tipoPersona(): TipoPersona {
    return this.mockUser.tipoPersona;
  }

  get paisConFiscal(): boolean {
    return this.pais === 'CO' || this.pais === 'MX' || this.pais === 'AR';
  }

  get billingCountryConfig(): Record<string, unknown> | null {
    const countries = this.billingLatam.countries as Record<string, Record<string, unknown>>;
    return countries[this.pais] ?? null;
  }

  get billingPersonConfig(): Record<string, unknown> | null {
    const country = this.billingCountryConfig as { personTypes?: Record<string, Record<string, unknown>> } | null;
    if (!country?.personTypes) return null;
    const key = this.formFacturacion.tipoPersonaFacturacion === 'juridica' ? 'juridica' : 'natural';
    return country.personTypes[key] ?? null;
  }

  get tipoPersonaFacturacionLabel(): string {
    return this.formFacturacion.tipoPersonaFacturacion === 'juridica' ? 'Persona jurídica' : 'Persona natural';
  }

  get sumsubCaptureStepIndex(): number {
    const map: Partial<Record<SumsubScreenPhase, number>> = {
      'capture-front': 0,
      'capture-back': 1,
      selfie: 2,
      processing: 3,
    };
    return map[this.sumsubPhase()] ?? -1;
  }

  get isSumsubCapturePhase(): boolean {
    return ['capture-front', 'capture-back', 'selfie', 'processing'].includes(this.sumsubPhase());
  }

  private get step1RequiredFields(): string[] {
    return [
      'primerNombre', 'primerApellido', 'fechaNacimiento', 'nacionalidad',
      'tipoDocumento', 'numeroDocumento', 'email', 'telefono', 'direccion',
    ];
  }

  private get step2RequiredFields(): string[] {
    if (!this.paisConFiscal) return [];
    const fields = [
      'fact_tipo_persona', 'fact_localidad', 'fact_direccion', 'fact_email', 'fact_telefono',
      'fact_nombre', 'fact_regimen', 'fact_tipo_doc', 'fact_numero_doc',
    ];
    if (this.pais === 'CO') fields.push('co_tipoResponsabilidad', 'actividadEconomica', 'codigoActividadEconomica');
    if (this.pais === 'MX') fields.push('mx_codigoPostal');
    if (this.pais === 'AR') fields.push('ar_provincia');
    return fields;
  }

  private isFieldValid(field: string): boolean {
    return !this.getValidationMessage(field);
  }

  get canContinueStep1(): boolean {
    return this.step1RequiredFields.every(f => this.isFieldValid(f));
  }

  get canContinueStep2(): boolean {
    if (!this.paisConFiscal) return this.canContinueStep1;
    if (!this.formFacturacion.aceptaTerminos || !this.formFacturacion.aceptaPolitica) return false;
    return this.step2RequiredFields.every(f => this.isFieldValid(f));
  }

  get prefillPreviewFields(): { label: string; value: string }[] {
    return [
      { label: 'Nombre', value: buildNombreCompleto(this.formNucleo) },
      { label: 'Email', value: this.formNucleo.email || this.mockUser.email },
      { label: 'Teléfono', value: this.mockUser.telefono },
    ];
  }

  get nombreFacturacionLabel(): string {
    const cfg = this.billingPersonConfig as { nombreFieldLabel?: string } | null;
    return cfg?.nombreFieldLabel ?? (this.tipoPersona === 'juridica' ? 'Razón social' : 'Nombre completo');
  }

  get nombreFacturacionHelper(): string {
    const cfg = this.billingPersonConfig as { nombreFieldHelper?: string } | null;
    return cfg?.nombreFieldHelper ?? 'Tal como figura en el documento a cargar.';
  }

  get billingRegimenOptions(): string[] {
    const cfg = this.billingPersonConfig as { regimenOptions?: string[] } | null;
    return cfg?.regimenOptions ?? [];
  }

  get billingDocumentTypes(): string[] {
    const cfg = this.billingPersonConfig as { documentTypes?: string[] } | null;
    return cfg?.documentTypes ?? [];
  }

  get prefillNombreDisplay(): string {
    if (this.tipoPersona === 'juridica' && this.formNucleo.razonSocial.trim()) {
      return this.formNucleo.razonSocial.trim();
    }
    return buildNombreCompleto(this.formNucleo);
  }

  get canEditFacturacionPostAprobacion(): boolean {
    const e = this.selectorEstado();
    return e === 'aprobado-bloqueado' || e === 'aprobado-listo-editar';
  }

  get paisLabel(): string {
    const map: Record<Pais, string> = { CO: 'Colombia', MX: 'México', AR: 'Argentina', CL: 'Chile', EC: 'Ecuador' };
    return map[this.pais];
  }

  get paisAnteriorLabel(): string {
    const map: Record<Pais, string> = { CO: 'Colombia', MX: 'México', AR: 'Argentina', CL: 'Chile', EC: 'Ecuador' };
    return map[this.mockUser.paisAnterior];
  }

  get campoGeografico(): string {
    const map: Record<Pais, string> = { CO: 'Municipio', CL: 'Región / Comuna', MX: 'Ciudad', AR: 'Provincia / Ciudad', EC: 'Cantón' };
    return map[this.pais];
  }

  get tiposDocumento(): string[] {
    const map: Record<PaisPersona, string[]> = {
      'co-natural':  ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte'],
      'co-juridica': ['Cédula de ciudadanía (rep. legal)', 'Pasaporte (rep. legal)'],
      'mx-natural':  ['INE', 'Pasaporte', 'Cédula profesional'],
      'mx-juridica': ['INE (representante legal)', 'Pasaporte (representante legal)'],
      'ar-natural':  ['DNI', 'Pasaporte'],
      'ar-juridica': ['DNI (representante legal)', 'Pasaporte (representante legal)'],
      'cl':          ['Cédula de identidad', 'Pasaporte'],
      'ec':          ['Cédula de identidad', 'Pasaporte'],
    };
    return map[this.selectorPais()];
  }

  get nacionalidades(): string[] {
    return [
      'Colombiana', 'Mexicana', 'Argentina', 'Chilena', 'Ecuatoriana',
      'Venezolana', 'Peruana', 'Boliviana', 'Brasileña', 'Uruguaya',
      'Paraguaya', 'Panameña', 'Costarricense', 'Guatemalteca', 'Hondureña',
      'Nicaragüense', 'Salvadoreña', 'Dominicana', 'Española', 'Estadounidense',
      'Otra',
    ];
  }

  get opcionesFiscalesCo(): string[] {
    return ['Gran contribuyente', 'Autorretenedor', 'Agente retenedor IVA', 'Simplificado', 'No responsable de IVA'];
  }

  get opcionesFiscalesMx(): string[] {
    return this.tipoPersona === 'natural'
      ? ['Sueldos y salarios', 'Actividades empresariales', 'Régimen simplificado de confianza']
      : ['General de ley personas morales', 'Personas morales con fines no lucrativos'];
  }

  get opcionesFiscalesAr(): string[] {
    return this.tipoPersona === 'natural'
      ? ['Consumidor Final', 'IVA Responsable Inscripto', 'Responsable Monotributo']
      : ['IVA Responsable Inscripto', 'IVA Exento'];
  }

  get camposNuevos(): string[] {
    return this.mockUser.camposNuevos;
  }

  get cantidadCamposNuevos(): number {
    return this.camposNuevos.length;
  }

  get camposNuevosPendienteLabels(): string[] {
    const labels: Record<string, string> = {
      co_impuesto: 'Impuesto',
      co_tipoResponsabilidad: 'Tipo de responsabilidad',
      co_tipoRegimen: 'Tipo de régimen',
      mx_codigoPostal: 'Código postal',
      mx_regimenFiscal: 'Régimen fiscal',
      ar_provincia: 'Provincia',
      ar_condicionIVA: 'Condición frente al IVA',
    };
    return this.camposNuevos
      .filter(c => this.isCampoNuevoPendiente(c))
      .map(c => labels[c] ?? c);
  }

  get showCamposNuevosAlert(): boolean {
    return this.selectorUsuario() === 'antiguo-campos-nuevos' && this.camposNuevosPendienteLabels.length > 0;
  }

  get hasCamposNuevosPendientes(): boolean {
    return this.camposNuevos.some(c => this.isCampoNuevoPendiente(c));
  }

  get countdownLabel(): string {
    const s = this.countdownSeconds();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  get waitPercent(): number {
    return Math.round((this.countdownSeconds() / 600) * 100);
  }

  get rechazadaButtonDisabled(): boolean {
    return this.selectorEstado() === 'rechazada-espera';
  }

  get motivoRechazo(): string {
    const motivos: Record<PaisPersona, string> = {
      'co-natural':  'La foto de tu documento no tiene suficiente claridad. Asegúrate de que esté bien iluminado, sin reflejos y que el texto sea legible.',
      'co-juridica': 'La cámara de representación legal no coincide con los datos registrados. Verifica que el representante legal sea quien aparece en el documento.',
      'mx-natural':  'Tu INE no pudo ser verificado. Asegúrate de que esté vigente y que la fotografía sea nítida.',
      'mx-juridica': 'Los documentos de la empresa (acta constitutiva) no están completos. Verifica que todos los documentos estén vigentes.',
      'ar-natural':  'El DNI presentado está vencido o no corresponde a la persona que realizó la selfie.',
      'ar-juridica': 'La documentación del CUIT no pudo ser validada. Verifica que el representante legal sea el mismo registrado en AFIP.',
      'cl':          'La cédula de identidad presentada tiene datos ilegibles. Vuelve a capturarla en un ambiente bien iluminado.',
      'ec':          'La cédula de identidad no pudo ser verificada en el Registro Civil. Asegúrate de que esté vigente.',
    };
    return motivos[this.selectorPais()];
  }

  get nombreCompleto(): string {
    const u = this.mockUser;
    return `${u.primerNombre} ${u.primerApellido}`;
  }

  // ── Post-approval edit permissions ───────────────────────────────────────

  get canEditData(): boolean {
    return this.selectorEstado() === 'aprobado-listo-editar';
  }

  get fechaAprobacionLabel(): string {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get fechaDesbloqueoLabel(): string {
    const d = new Date();
    d.setMonth(d.getMonth() + 5);
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  get validadoPersonalTagText(): string {
    return 'Validado';
  }

  get validadoFacturacionTagText(): string {
    return this.validadoFacturacionTabComplete ? 'Completo' : 'Pendiente';
  }

  get validadoFacturacionTabComplete(): boolean {
    return !!this.formFacturacion.nombreFacturacion
      && !!this.formFacturacion.regimenFiscal
      && !!this.formFacturacion.tipoDocumentoFacturacion
      && !!this.formFacturacion.numeroDocumentoFacturacion;
  }

  get phonePrefix(): string {
    const map: Record<Pais, string> = { CO: '57', MX: '52', AR: '54', CL: '56', EC: '593' };
    return map[this.pais];
  }

  get formattedFechaNacimiento(): string {
    return this.formatFechaDisplay(this.mockUser.fechaNacimiento);
  }

  parseFechaString(s: string): Date | null {
    if (!s) return null;
    const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const year = parseInt(iso[1], 10);
      const month = parseInt(iso[2], 10) - 1;
      const day = parseInt(iso[3], 10);
      return new Date(year, month, day);
    }
    const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1;
    const year = parseInt(m[3], 10);
    const d = new Date(year, month, day);
    if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) return null;
    return d;
  }

  private formatFechaDisplay(fecha: string): string {
    if (!fecha) return '';
    const iso = fecha.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
    return fecha;
  }

  // -----------------------------------------------------------------------
  // Selector change handlers
  // -----------------------------------------------------------------------

  setUserType(type: UserType): void {
    this.selectorUsuario.set(type);
    if (type === 'antiguo-campos-nuevos' && this.selectorEstado() === 'inicial') {
      this.selectorEstado.set('guardado-sin-comenzar');
    }
    this.modalActivo.set(null);
    this.resolveVista();
    this.syncUrlParams();
    this.syncIdentityDemoState();
  }

  setEstado(estado: EstadoId): void {
    this.selectorEstado.set(estado);
    this.modalActivo.set(null);
    if (estado === 'rechazada-espera') {
      this.startCountdown();
    } else {
      this.stopCountdown();
    }
    if (estado === 'incompleta') {
      if (this.sumsubStepGuardado() === 0) {
        this.sumsubStepGuardado.set(2);
      }
      this.sumsubStep.set(this.sumsubStepGuardado());
    }
    if (estado === 'recien-aprobada') {
      this.toast.success(
        `Tu identidad fue verificada. Ya puedes ${this.beneficioDesbloqueado}.`,
        '¡Verificación exitosa!',
      );
    }
    this.resolveVista();
    this.syncUrlParams();
    this.syncIdentityDemoState();
  }

  setPais(pais: PaisPersona): void {
    this.selectorPais.set(pais);
    this.modalActivo.set(null);
    this.resolveVista();
    this.syncUrlParams();
    this.syncIdentityDemoState();
  }

  setOrigen(origen: OrigenValidacion): void {
    this.selectorOrigen.set(origen);
    this.syncUrlParams();
  }

  applyPreset(preset: DemoScenarioPreset): void {
    if (preset.id === 'excel-proveedor') {
      this.router.navigate(['/old/pedidos-proveedor'], {
        queryParams: { tab: 'facturacion', pais: MOCK_USERS[preset.pais].pais, billingId: MOCK_USERS[preset.pais].billingId },
      });
      return;
    }
    this.setUserType(preset.userType);
    this.setPais(preset.pais);
    this.setOrigen(preset.origen);
    this.setEstado(preset.estado);
    if (preset.vista) {
      this.navTo(preset.vista as VistaId);
    }
  }

  irAVista(vista: VistaId): void {
    this.modalActivo.set(null);
    this.vistaActiva.set(vista);
  }

  toggleVistaMap(): void {
    this.vistaMapOpen.update(v => !v);
  }

  copyDemoLink(): void {
    const q = new URLSearchParams({
      tipo: this.selectorUsuario(),
      estado: this.selectorEstado(),
      pais: this.selectorPais(),
      origen: this.selectorOrigen(),
    });
    const url = `${window.location.origin}${window.location.pathname}?${q.toString()}`;
    navigator.clipboard?.writeText(url).then(() => {
      this.copyLinkFeedback.set(true);
      setTimeout(() => this.copyLinkFeedback.set(false), 2500);
      this.toast.success('Enlace copiado al portapapeles.', 'Listo para compartir');
    }).catch(() => {
      this.toast.info(url, 'Copia este enlace');
    });
  }

  private applyQueryParams(params: { get: (k: string) => string | null }): void {
    const tipo = params.get('tipo') as UserType | null;
    const estado = params.get('estado') as EstadoId | null;
    const pais = params.get('pais') as PaisPersona | null;
    const origen = params.get('origen') as OrigenValidacion | null;
    const revalidar = params.get('revalidar');
    if (tipo && this.userTypeOptions.some(o => o.id === tipo)) this.selectorUsuario.set(tipo);
    if (estado && this.estadoOptions.some(o => o.id === estado)) {
      this.selectorEstado.set(estado);
      if (estado === 'rechazada-espera') this.startCountdown();
    }
    if (pais && this.paisOptions.some(o => o.id === pais)) this.selectorPais.set(pais);
    if (origen && this.origenOptions.some(o => o.id === origen)) this.selectorOrigen.set(origen);
    this.resolveVista();
    this.syncIdentityDemoState();
    if (revalidar === 'facturacion') {
      this.validadoTab.set('facturacion');
      this.vistaActiva.set('v-validado-datos');
      this.pendingFacturacionRevalidation.set(true);
      this.otpDigits = ['', '', '', '', '', ''];
      this.otpError.set('');
      setTimeout(() => this.openModal('m-mfa'), 0);
    }
  }

  private syncUrlParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        tipo: this.selectorUsuario(),
        estado: this.selectorEstado(),
        pais: this.selectorPais(),
        origen: this.selectorOrigen(),
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  private syncIdentityDemoState(): void {
    this.identityDemo.setFromEstado(this.selectorEstado(), this.selectorPais());
  }

  get responsableIVALabel(): string {
    return deriveResponsableIVA({ ...this.formFiscal, pais: this.pais } as MockUserData, this.pais) ? 'Sí' : 'No';
  }

  onActividadEconomicaChange(): void {
    const match = ACTIVIDAD_ECONOMICA_OPTIONS.find(o => o.label === this.formFiscal.actividadEconomica);
    if (match) {
      this.formFiscal.codigoActividadEconomica = match.codigo;
    }
  }

  onBillingRegimenChange(): void {
    const r = this.formFacturacion.regimenFiscal;
    if (this.pais === 'CO') this.formFiscal.co_tipoRegimen = r;
    if (this.pais === 'MX') this.formFiscal.mx_regimenFiscal = r;
    if (this.pais === 'AR') this.formFiscal.ar_condicionIVA = r;
  }

  editarSeccionConfirmacion(seccion: 'personal' | 'contacto' | 'empresa' | 'fiscal' | 'facturacion'): void {
    this.closeModal(true);
    this.navTo('v-nueva-formulario');
    if (seccion === 'fiscal' || seccion === 'facturacion' || seccion === 'contacto') {
      if (this.paisConFiscal) {
        this.formStep.set(2);
        setTimeout(() => document.getElementById('field-fact_email')?.focus(), 0);
      }
    } else {
      this.formStep.set(1);
      const focusMap: Record<string, string> = {
        personal: 'field-primerNombre',
        contacto: 'field-fact_email',
        empresa: 'field-razonSocial',
        fiscal: 'field-fact_regimen',
        facturacion: 'field-fact_email',
      };
      setTimeout(() => document.getElementById(focusMap[seccion])?.focus(), 0);
    }
  }

  openSumsubMock(): void {
    this.sumsubPhase.set(this.getInitialSumsubPhase());
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
  }

  private getInitialSumsubPhase(): SumsubScreenPhase {
    const c = this.sumsubCustomization();
    if (this.sumsubContext() === 'facturacion-revalidation') {
      if (!c.skipInstructions) return 'instructions';
      return 'selfie';
    }
    if (!c.skipWarning) return 'warning';
    if (!c.skipWelcome) return 'welcome';
    if (!c.skipInstructions) return 'instructions';
    if (this.formFacturacion.tipoPersonaFacturacion === 'juridica' || this.tipoPersona === 'juridica') {
      return 'kyb-empresa';
    }
    return 'capture-front';
  }

  get sumsubPhaseLabel(): string {
    const labels: Record<SumsubScreenPhase, string> = {
      warning: 'Confirmación de seguridad',
      welcome: 'Bienvenida',
      instructions: 'Instrucciones',
      'kyb-empresa': 'Datos de empresa',
      'kyb-rep': 'Representante legal',
      document: 'Seleccionar documento',
      'capture-front': 'Captura frontal',
      'capture-back': 'Captura trasera',
      selfie: 'Selfie',
      processing: 'Procesando',
    };
    return labels[this.sumsubPhase()];
  }

  avanzarSumsubPhase(): void {
    const phase = this.sumsubPhase();
    const c = this.sumsubCustomization();
    const goCapture = (): void => {
      if (this.formFacturacion.tipoPersonaFacturacion === 'juridica' || this.tipoPersona === 'juridica') {
        this.sumsubPhase.set('kyb-empresa');
      } else {
        this.sumsubPhase.set('capture-front');
      }
    };

    if (phase === 'warning') {
      this.sumsubPhase.set(c.skipWelcome ? (c.skipInstructions ? (this.tipoPersona === 'juridica' ? 'kyb-empresa' : 'document') : 'instructions') : 'welcome');
      return;
    }
    if (phase === 'welcome') {
      this.sumsubPhase.set(c.skipInstructions ? (this.tipoPersona === 'juridica' ? 'kyb-empresa' : 'document') : 'instructions');
      return;
    }
    if (phase === 'instructions') {
      if (this.sumsubContext() === 'facturacion-revalidation') {
        this.sumsubPhase.set('selfie');
        return;
      }
      goCapture();
      return;
    }
    if (phase === 'kyb-empresa') {
      this.sumsubPhase.set('kyb-rep');
      return;
    }
    if (phase === 'kyb-rep') {
      this.sumsubPhase.set('capture-front');
      return;
    }
    if (phase === 'document') {
      this.sumsubPhase.set('capture-front');
      return;
    }
    if (phase === 'capture-front') {
      this.sumsubPhase.set('capture-back');
      return;
    }
    if (phase === 'capture-back') {
      this.sumsubPhase.set('selfie');
      return;
    }
    if (phase === 'selfie') {
      this.sumsubPhase.set('processing');
      this.sumsubLoading.set(true);
      setTimeout(() => {
        this.sumsubLoading.set(false);
        this.finalizarSumsub();
      }, 1200);
    }
  }

  toggleSumsubCustomization(key: keyof SumsubCustomizationConfig): void {
    this.sumsubCustomization.update(cfg => ({ ...cfg, [key]: !cfg[key] }));
  }

  private finalizarSumsub(): void {
    this.closeModal(true);
    if (this.sumsubContext() === 'facturacion-revalidation') {
      this.sumsubContext.set('initial');
      this.validadoTab.set('facturacion');
      this.vistaActiva.set('v-validado-datos');
      this.toast.info('Revisamos tus datos de facturación. Te avisaremos cuando termine.', 'Facturación en revisión');
      setTimeout(() => {
        this.toast.success('Tus datos de facturación fueron actualizados.', 'Facturación aprobada');
      }, 2500);
      return;
    }
    this.selectorEstado.set('en-revision');
    this.vistaActiva.set('v-en-revision');
    this.syncIdentityDemoState();
    this.toast.success('Documentos enviados. Te avisaremos por correo cuando termine la revisión.', 'Verificación enviada');
  }

  resolveVista(): void {
    const ut = this.selectorUsuario();
    let es = this.selectorEstado();

    if (es === 'aprobada') {
      this.selectorEstado.set('aprobado-bloqueado');
      es = 'aprobado-bloqueado';
    }

    if (es === 'email-baneado') { this.vistaActiva.set('v-email-baneado'); return; }
    if (es === 'baneada')       { this.vistaActiva.set('v-baneada');       return; }
    if (ut === 'cross-country' && (es === 'inicial' || es === 'guardado-sin-comenzar')) {
      this.vistaActiva.set('v-cross-country'); return;
    }
    if (ut === 'nuevo-sin-datos' && es === 'inicial') {
      this.vistaActiva.set('v-nueva-bloqueada'); return;
    }
    if (es === 'recien-aprobada') {
      this.vistaActiva.set('v-exitosa'); return;
    }
    if (es === 'aprobado-bloqueado' || es === 'aprobado-listo-editar') {
      this.vistaActiva.set(ut === 'antiguo-campos-nuevos' ? 'v-validado-campos-nuevos' : 'v-validado-datos');
      this.initFormFacturacionFromMock();
      return;
    }
    if (es === 'guardado-sin-comenzar' || (ut !== 'nuevo-sin-datos' && es === 'inicial')) {
      if (ut === 'antiguo-campos-nuevos') {
        this.initFormDataFromMockPartial();
        this.formStep.set(1);
        this.fieldErrors.set({});
        this.vistaActiva.set('v-nueva-formulario');
        return;
      }
      this.vistaActiva.set('v-guardada-sin-comenzar');
      return;
    }
    if (es === 'incompleta')          { this.vistaActiva.set('v-incompleta');           return; }
    if (es === 'en-revision')         { this.vistaActiva.set('v-en-revision');           return; }
    if (es === 'rechazada-espera' || es === 'rechazada-reintentar') {
      this.vistaActiva.set('v-rechazada'); return;
    }
    this.vistaActiva.set('v-nueva-bloqueada');
  }

  // -----------------------------------------------------------------------
  // Countdown
  // -----------------------------------------------------------------------

  simularEsperaFinalizada(): void {
    this.stopCountdown();
    this.countdownSeconds.set(0);
    this.selectorEstado.set('rechazada-reintentar');
    this.resolveVista();
  }

  private startCountdown(): void {
    this.stopCountdown();
    this.countdownSeconds.set(600);
    this.countdownInterval = setInterval(() => {
      const s = this.countdownSeconds();
      if (s > 0) { this.countdownSeconds.set(s - 1); }
      else { this.stopCountdown(); }
    }, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) { clearInterval(this.countdownInterval); this.countdownInterval = null; }
  }

  ngOnDestroy(): void { this.stopCountdown(); }

  // -----------------------------------------------------------------------
  // Navigation helpers
  // -----------------------------------------------------------------------

  isVista(v: VistaId): boolean  { return this.vistaActiva() === v; }
  isModal(m: ModalId): boolean  { return this.modalActivo() === m; }
  navTo(v: VistaId): void       { this.vistaActiva.set(v); this.closeModal(true); }

  fieldDescId(field: string): string {
    return `err-${field}`;
  }

  navegarAModulo(ruta: string): void {
    this.router.navigate([ruta]);
  }

  openDemo(): void {
    this.demoFabReturn = document.activeElement as HTMLElement;
    this.demoMode.set('open');
    sessionStorage.setItem('fid-demo-mode', 'open');
    setTimeout(() => document.querySelector<HTMLElement>('.fid-demo-top__close')?.focus(), 0);
  }

  closeDemo(): void {
    this.demoMode.set('hidden');
    sessionStorage.setItem('fid-demo-mode', 'hidden');
    setTimeout(() => this.demoFabReturn?.focus(), 0);
    this.demoFabReturn = null;
  }

  openModal(m: ModalId): void {
    this.modalFocusReturn = document.activeElement as HTMLElement;
    this.modalActivo.set(m);
    setTimeout(() => this.focusModalEntry(), 0);
  }

  closeModal(force = false): void {
    if (!force && !this.confirmModalClose()) return;
    this.modalActivo.set(null);
    setTimeout(() => this.modalFocusReturn?.focus(), 0);
    this.modalFocusReturn = null;
  }

  onOverlayClick(): void {
    this.closeModal();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.demoMode() === 'open') {
      this.closeDemo();
      return;
    }
    if (this.modalActivo()) this.closeModal();
  }

  private confirmModalClose(): boolean {
    const m = this.modalActivo();
    if (m === 'm-mfa' && this.otpDigits.some(d => d !== '')) {
      return confirm('¿Salir sin verificar? Perderás el código ingresado.');
    }
    if (m === 'm-sumsub' && this.sumsubStep() > 0) {
      return confirm('¿Salir de la sesión biométrica? Podrás retomarla después.');
    }
    return true;
  }

  private focusModalEntry(): void {
    const root = document.querySelector('.fid-modal[role="dialog"]');
    const focusable = root?.querySelector<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
    );
    focusable?.focus();
  }

  // -----------------------------------------------------------------------
  // v-nueva-bloqueada
  // -----------------------------------------------------------------------

  irAValidar(): void {
    this.initFormData();
    this.isEditMode.set(false);
    this.navTo('v-nueva-formulario');
    history.pushState(null, '', window.location.href);
  }

  masTarde(): void {
    if (this.esBloqueoDuro) return;
    const origen = this.selectorOrigen();
    const msg = origen === 'retiro'
      ? 'Puedes retomar la verificación cuando quieras desde Retiros.'
      : origen === 'dropicard'
        ? 'Puedes retomar la verificación cuando quieras desde Dropicard.'
        : 'Puedes retomar la verificación cuando quieras desde Configuraciones.';
    this.toast.info(msg, 'Verificación pendiente');
  }

  volverAlOrigen(): void {
    this.selectorEstado.set('aprobado-bloqueado');
    this.resolveVista();
    this.toast.success(
      'Retiros, facturación y Dropicard están habilitados en tu cuenta.',
      '¡Identidad verificada!',
    );
  }

  // -----------------------------------------------------------------------
  // v-nueva-onboarding
  // -----------------------------------------------------------------------

  siguienteOnboarding(): void {
    if (this.onboardingStep() === 1) this.onboardingStep.set(2);
  }

  anteriorOnboarding(): void {
    if (this.onboardingStep() === 2) this.onboardingStep.set(1);
  }

  comenzarValidacion(): void {
    this.initFormData();
    this.isEditMode.set(false);
    this.navTo('v-nueva-formulario');
    history.pushState(null, '', window.location.href);
  }

  selectOnboardingPersona(tipo: TipoPersona): void {
    this.onboardingTipoPersona = tipo;
  }

  private syncPaisFromOnboarding(): void {
    const pais = this.mockUser.pais;
    const map: Record<Pais, { natural: PaisPersona; juridica: PaisPersona }> = {
      CO: { natural: 'co-natural', juridica: 'co-juridica' },
      MX: { natural: 'mx-natural', juridica: 'mx-juridica' },
      AR: { natural: 'ar-natural', juridica: 'ar-juridica' },
      CL: { natural: 'cl', juridica: 'cl' },
      EC: { natural: 'ec', juridica: 'ec' },
    };
    this.selectorPais.set(map[pais][this.onboardingTipoPersona]);
  }

  // -----------------------------------------------------------------------
  // v-nueva-formulario
  // -----------------------------------------------------------------------

  onFormFieldInput(field: string): void {
    if (this.fieldErrors()[field]) {
      this.fieldErrors.update(errors => {
        const next = { ...errors };
        delete next[field];
        return next;
      });
    }
  }

  onTipoPersonaFacturacionChange(): void {
    this.formFacturacion.regimenFiscal = '';
    this.formFacturacion.tipoDocumentoFacturacion = '';
    this.formFacturacion.numeroDocumentoFacturacion = '';
    this.formFacturacion.nombreFacturacion = '';
    this.updateDocumentSlots();
  }

  updateDocumentSlots(): void {
    const cfg = this.billingPersonConfig as { uploads?: string[] } | null;
    const uploads = cfg?.uploads ?? [];
    this.documentSlots = uploads.map(label => ({ label, required: true, fileName: null }));
  }

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file && this.documentSlots[index]) {
      this.documentSlots[index].fileName = file.name;
    }
  }

  removeFile(index: number): void {
    if (this.documentSlots[index]) {
      this.documentSlots[index].fileName = null;
    }
  }

  private scrollToFactTipoDoc(): void {
    setTimeout(() => {
      const el = document.getElementById('field-fact_tipo_doc');
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
    }, 150);
  }

  getFieldError(field: string): string {
    return this.fieldErrors()[field] ?? '';
  }

  hasFieldError(field: string): boolean {
    return !!this.fieldErrors()[field];
  }

  validateField(field: string): void {
    const msg = this.getValidationMessage(field);
    this.fieldErrors.update(errors => {
      const next = { ...errors };
      if (msg) {
        next[field] = msg;
      } else {
        delete next[field];
      }
      return next;
    });
  }

  private getValidationMessage(field: string): string {
    const n = this.formNucleo;
    const f = this.formFiscal;
    switch (field) {
      case 'primerNombre':    return n.primerNombre.trim() ? '' : 'Ingresa tu primer nombre';
      case 'primerApellido':  return n.primerApellido.trim() ? '' : 'Ingresa tu primer apellido';
      case 'fechaNacimiento': return n.fechaNacimiento ? '' : 'Selecciona tu fecha de nacimiento';
      case 'nacionalidad':    return n.nacionalidad.trim() ? '' : 'Ingresa tu nacionalidad';
      case 'tipoDocumento':   return n.tipoDocumento ? '' : 'Selecciona el tipo de documento';
      case 'numeroDocumento': return n.numeroDocumento.trim() ? '' : 'Ingresa el número de documento';
      case 'email':           return n.email.trim().includes('@') ? '' : 'Ingresa un email válido';
      case 'telefono':        return n.telefono.trim() ? '' : 'Ingresa tu teléfono';
      case 'direccion':       return n.direccion.trim() ? '' : 'Ingresa tu dirección';
      case 'ciudad':          return n.ciudad.trim() ? '' : `Ingresa tu ${this.campoGeografico.toLowerCase()}`;
      case 'departamento':    return n.departamento.trim() ? '' : 'Ingresa departamento o estado';
      case 'emailFacturacion': return n.emailFacturacion.trim() ? '' : 'Ingresa el email de facturación';
      case 'razonSocial':     return this.tipoPersona !== 'juridica' || n.razonSocial.trim() ? '' : 'Ingresa la razón social';
      case 'fact_tipo_persona': return this.formFacturacion.tipoPersonaFacturacion ? '' : 'Selecciona el tipo de persona';
      case 'fact_localidad': return this.formFacturacion.localidad.trim() ? '' : 'Ingresa la localidad';
      case 'fact_direccion': return this.formFacturacion.direccion.trim() ? '' : 'Ingresa la dirección';
      case 'fact_email': return this.formFacturacion.emailFacturacion.trim() ? '' : 'Ingresa el email de facturación';
      case 'fact_telefono': return this.formFacturacion.telefonoFacturacion.trim() ? '' : 'Ingresa el teléfono';
      case 'fact_nombre': return this.formFacturacion.nombreFacturacion.trim() ? '' : `Ingresa ${this.nombreFacturacionLabel.toLowerCase()}`;
      case 'fact_regimen': return this.formFacturacion.regimenFiscal ? '' : 'Selecciona el régimen fiscal';
      case 'fact_tipo_doc': return this.formFacturacion.tipoDocumentoFacturacion ? '' : 'Selecciona el tipo de documento';
      case 'fact_numero_doc': return this.formFacturacion.numeroDocumentoFacturacion.trim() ? '' : 'Ingresa el número de documento';
      case 'co_tipoRegimen':        return f.co_tipoRegimen ? '' : 'Selecciona el tipo de régimen';
      case 'co_tipoResponsabilidad': return f.co_tipoResponsabilidad ? '' : 'Selecciona la responsabilidad tributaria';
      case 'actividadEconomica':    return f.actividadEconomica ? '' : 'Selecciona la actividad económica';
      case 'codigoActividadEconomica': return f.codigoActividadEconomica ? '' : 'Ingresa el código de actividad';
      case 'mx_codigoPostal':       return f.mx_codigoPostal.trim().length >= 5 ? '' : 'Usa 5 dígitos, sin espacios ni guiones';
      case 'mx_regimenFiscal':      return f.mx_regimenFiscal ? '' : 'Selecciona el régimen fiscal';
      case 'ar_condicionIVA':       return f.ar_condicionIVA ? '' : 'Selecciona la condición frente al IVA';
      case 'ar_provincia':          return f.ar_provincia.trim() ? '' : 'Ingresa la provincia';
      default: return '';
    }
  }

  private validateFields(fields: string[]): boolean {
    const errors: Record<string, string> = { ...this.fieldErrors() };
    let firstInvalid: string | null = null;
    for (const field of fields) {
      const msg = this.getValidationMessage(field);
      if (msg) {
        errors[field] = msg;
        if (!firstInvalid) firstInvalid = field;
      } else {
        delete errors[field];
      }
    }
    this.fieldErrors.set(errors);
    if (firstInvalid) {
      setTimeout(() => document.getElementById(`field-${firstInvalid}`)?.focus(), 0);
      return false;
    }
    return true;
  }

  validateStep1(): boolean {
    return this.validateFields(this.step1RequiredFields);
  }

  validateStep2(): boolean {
    if (!this.paisConFiscal) return true;
    if (!this.formFacturacion.aceptaTerminos || !this.formFacturacion.aceptaPolitica) {
      this.toast.warning('Marca los dos consentimientos para continuar.', 'Consentimiento requerido');
      return false;
    }
    return this.validateFields(this.step2RequiredFields);
  }

  private initFormData(): void {
    this.formStep.set(1);
    this.fieldErrors.set({});
    const u = this.mockUser;
    const isNew = this.selectorUsuario() === 'nuevo-sin-datos';
    this.formNucleo = {
      primerNombre:  isNew ? '' : u.primerNombre,
      segundoNombre: isNew ? '' : u.segundoNombre,
      primerApellido:  isNew ? '' : u.primerApellido,
      segundoApellido: isNew ? '' : u.segundoApellido,
      fechaNacimiento: isNew ? '' : this.formatFechaDisplay(u.fechaNacimiento),
      nacionalidad:    isNew ? '' : u.nacionalidad,
      tipoPersona: u.tipoPersona,
      tipoDocumento:  isNew ? '' : u.tipoDocumento,
      numeroDocumento: isNew ? '' : u.numeroDocumento,
      email:    u.email,
      emailFacturacion: isNew ? '' : u.emailFacturacion,
      telefono: u.telefono,
      direccion: isNew ? '' : u.direccion,
      ciudad:    isNew ? '' : u.ciudad,
      departamento: isNew ? '' : u.departamento,
      razonSocial: isNew ? '' : u.razonSocial,
    };
    this.formFiscal = {
      co_tipoRegimen:        isNew ? '' : u.co_tipoRegimen,
      co_tipoResponsabilidad: isNew ? '' : u.co_tipoResponsabilidad,
      co_impuesto:           isNew ? '' : u.co_impuesto,
      actividadEconomica:    isNew ? '' : u.actividadEconomica,
      codigoActividadEconomica: isNew ? '' : u.codigoActividadEconomica,
      mx_codigoPostal:       isNew ? '' : u.mx_codigoPostal,
      mx_regimenFiscal:      isNew ? '' : u.mx_regimenFiscal,
      mx_sujetoImpuestos:    isNew ? false : u.mx_sujetoImpuestos,
      ar_condicionIVA:       isNew ? '' : u.ar_condicionIVA,
      ar_provincia:          isNew ? '' : u.ar_provincia,
    };
    this.formFacturacion = isNew
      ? emptyFormFacturacion('natural')
      : {
          localidad: u.ciudad,
          direccion: u.direccion,
          emailFacturacion: u.emailFacturacion,
          telefonoFacturacion: u.telefono,
          nombreFacturacion: u.tipoPersona === 'juridica' ? u.razonSocial : buildNombreCompleto({
            ...emptyFormNucleo(),
            primerNombre: u.primerNombre,
            segundoNombre: u.segundoNombre,
            primerApellido: u.primerApellido,
            segundoApellido: u.segundoApellido,
          } as FormNucleo),
          tipoPersonaFacturacion: u.tipoPersona,
          regimenFiscal: u.pais === 'CO' ? u.co_tipoRegimen : u.pais === 'MX' ? u.mx_regimenFiscal : u.ar_condicionIVA,
          tipoDocumentoFacturacion: u.tipoDocumento,
          numeroDocumentoFacturacion: u.numeroDocumento,
          aceptaTerminos: false,
          aceptaPolitica: false,
        };
    this.updateDocumentSlots();
  }

  private prefillFacturacionFromIdentidad(): void {
    const n = this.formNucleo;
    const u = this.mockUser;
    this.formFacturacion.localidad = u.ciudad;
    this.formFacturacion.direccion = u.direccion;
    this.formFacturacion.emailFacturacion = n.email || u.email;
    this.formFacturacion.telefonoFacturacion = n.telefono || u.telefono;
    this.formFacturacion.nombreFacturacion = buildNombreCompleto(n);
  }

  usarDatosIdentidadFacturacion(): void {
    this.prefillFacturacionFromIdentidad();
    this.closeModal(true);
    this.formStep.set(2);
    this.scrollToFactTipoDoc();
  }

  ingresarDatosFacturacionNuevos(): void {
    const tipo = this.formFacturacion.tipoPersonaFacturacion || 'natural';
    this.formFacturacion = emptyFormFacturacion(tipo);
    this.updateDocumentSlots();
    this.closeModal(true);
    this.formStep.set(2);
    this.scrollToFactTipoDoc();
  }

  guardarFacturacionPostAprobacion(): void {
    if (!this.validateStep2()) return;
    this.pendingFacturacionRevalidation.set(true);
    this.isEditMode.set(false);
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError.set('');
    this.openModal('m-mfa');
  }

  siguienteFormPaso(): void {
    if (!this.validateStep1()) return;
    if (this.paisConFiscal) {
      this.openModal('m-prefill-billing');
    } else {
      this.openModal('m-confirmacion-pre-sumsub');
    }
  }

  anteriorFormPaso(): void {
    this.formStep.set(1);
  }

  onFormSubmit(): void {
    if (this.formStep() === 1) {
      this.siguienteFormPaso();
      return;
    }
    if (this.validateStep2()) {
      this.confirmacionAceptada.set(false);
      this.openModal('m-confirmacion-pre-sumsub');
    }
  }

  irAContinuar(): void {
    this.onFormSubmit();
  }

  continuarFormulario(): void {
    this.onFormSubmit();
  }

  // -----------------------------------------------------------------------
  // v-guardada-sin-comenzar / v-incompleta
  // -----------------------------------------------------------------------

  comenzarDesdeGuardado(): void {
    if (this.selectorUsuario() === 'antiguo-campos-nuevos' && this.hasCamposNuevosPendientes) {
      this.initFormDataFromMockPartial();
      this.formStep.set(1);
      this.fieldErrors.set({});
      this.navTo('v-nueva-formulario');
      return;
    }
    this.openSumsubMock();
  }

  editarDatosGuardados(): void {
    this.initFormDataFromMock();
    this.formStep.set(1);
    this.fieldErrors.set({});
    this.navTo('v-nueva-formulario');
  }

  reanudarValidacion(): void {
    this.sumsubStep.set(this.sumsubStepGuardado());
    this.sumsubPhase.set(this.getInitialSumsubPhase());
    this.openModal('m-sumsub');
  }

  empezarDeNuevo(): void {
    this.sumsubStep.set(0);
    this.sumsubStepGuardado.set(0);
    this.openSumsubMock();
  }

  verDatosEnviados(): void {
    this.selectorEstado.set('aprobado-bloqueado');
    this.resolveVista();
  }

  // -----------------------------------------------------------------------
  // v-validado-datos
  // -----------------------------------------------------------------------

  onValidadoFacturacionTab(): void {
    this.validadoTab.set('facturacion');
    this.initFormFacturacionFromMock();
  }

  solicitarActualizacion(): void {
    this.iniciarActualizacionConMfa();
  }

  verDocumento(): void {
    this.previewDocName = this.mockUser.tipoDocumento;
    this.openModal('m-doc-preview');
  }

  openUploadPreview(fileName: string): void {
    this.previewDocName = fileName;
    this.openModal('m-doc-preview');
  }

  // -----------------------------------------------------------------------
  // v-validado-campos-nuevos
  // -----------------------------------------------------------------------

  completarCamposNuevos(): void {
    this.iniciarActualizacionConMfa();
  }

  private iniciarActualizacionConMfa(): void {
    this.isEditMode.set(false);
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError.set('');
    this.openModal('m-mfa');
  }

  isCampoNuevo(campo: string): boolean {
    return this.camposNuevos.includes(campo);
  }

  private isCampoNuevoPendiente(campo: string): boolean {
    const f = this.formFiscal;
    const n = this.formNucleo;
    switch (campo) {
      case 'co_impuesto': return !f.co_impuesto?.trim();
      case 'co_tipoResponsabilidad': return !f.co_tipoResponsabilidad?.trim();
      case 'co_tipoRegimen': return !f.co_tipoRegimen?.trim();
      case 'mx_codigoPostal': return !f.mx_codigoPostal?.trim();
      case 'mx_regimenFiscal': return !f.mx_regimenFiscal?.trim();
      case 'ar_provincia': return !f.ar_provincia?.trim();
      case 'ar_condicionIVA': return !f.ar_condicionIVA?.trim();
      case 'primerNombre': return !n.primerNombre?.trim();
      case 'primerApellido': return !n.primerApellido?.trim();
      case 'numeroDocumento': return !n.numeroDocumento?.trim();
      default: return true;
    }
  }

  private clearCampoNuevoValue(campo: string): void {
    switch (campo) {
      case 'co_impuesto': this.formFiscal.co_impuesto = ''; break;
      case 'co_tipoResponsabilidad': this.formFiscal.co_tipoResponsabilidad = ''; break;
      case 'co_tipoRegimen':
        this.formFiscal.co_tipoRegimen = '';
        this.formFacturacion.regimenFiscal = '';
        break;
      case 'mx_codigoPostal': this.formFiscal.mx_codigoPostal = ''; break;
      case 'mx_regimenFiscal':
        this.formFiscal.mx_regimenFiscal = '';
        this.formFacturacion.regimenFiscal = '';
        break;
      case 'ar_provincia': this.formFiscal.ar_provincia = ''; break;
      case 'ar_condicionIVA':
        this.formFiscal.ar_condicionIVA = '';
        this.formFacturacion.regimenFiscal = '';
        break;
      default: break;
    }
  }

  private initFormDataFromMockPartial(): void {
    this.initFormDataFromMock();
    for (const campo of this.mockUser.camposNuevos) {
      this.clearCampoNuevoValue(campo);
    }
    this.updateDocumentSlots();
  }

  // -----------------------------------------------------------------------
  // v-cross-country
  // -----------------------------------------------------------------------

  usarMismosDatos(): void {
    this.initFormDataFromMock();
    this.formStep.set(1);
    this.fieldErrors.set({});
    this.navTo('v-nueva-formulario');
  }

  ingresarNuevosDatos(): void {
    this.initFormData();
    this.formStep.set(1);
    this.fieldErrors.set({});
    this.navTo('v-nueva-formulario');
  }

  private initFormDataFromMock(): void {
    const u = this.mockUser;
    this.formNucleo = {
      primerNombre: u.primerNombre, segundoNombre: u.segundoNombre,
      primerApellido: u.primerApellido, segundoApellido: u.segundoApellido,
      fechaNacimiento: this.formatFechaDisplay(u.fechaNacimiento), nacionalidad: u.nacionalidad,
      tipoPersona: u.tipoPersona, tipoDocumento: u.tipoDocumento,
      numeroDocumento: u.numeroDocumento, email: u.email,
      emailFacturacion: u.emailFacturacion, telefono: u.telefono,
      direccion: u.direccion, ciudad: u.ciudad, departamento: u.departamento,
      razonSocial: u.razonSocial,
    };
    this.formFiscal = {
      co_tipoRegimen: u.co_tipoRegimen, co_tipoResponsabilidad: u.co_tipoResponsabilidad,
      co_impuesto: u.co_impuesto, actividadEconomica: u.actividadEconomica,
      codigoActividadEconomica: u.codigoActividadEconomica,
      mx_codigoPostal: u.mx_codigoPostal,
      mx_regimenFiscal: u.mx_regimenFiscal, mx_sujetoImpuestos: u.mx_sujetoImpuestos,
      ar_condicionIVA: u.ar_condicionIVA, ar_provincia: u.ar_provincia,
    };
    this.initFormFacturacionFromMock();
  }

  private initFormFacturacionFromMock(): void {
    const u = this.mockUser;
    this.formFacturacion = {
      localidad: u.ciudad,
      direccion: u.direccion,
      emailFacturacion: u.emailFacturacion,
      telefonoFacturacion: u.telefono,
      nombreFacturacion: u.tipoPersona === 'juridica' ? u.razonSocial : buildNombreCompleto({
        ...emptyFormNucleo(),
        primerNombre: u.primerNombre,
        segundoNombre: u.segundoNombre,
        primerApellido: u.primerApellido,
        segundoApellido: u.segundoApellido,
      } as FormNucleo),
      tipoPersonaFacturacion: u.tipoPersona,
      regimenFiscal: u.pais === 'CO' ? u.co_tipoRegimen : u.pais === 'MX' ? u.mx_regimenFiscal : u.ar_condicionIVA,
      tipoDocumentoFacturacion: u.tipoDocumento,
      numeroDocumentoFacturacion: u.numeroDocumento,
      aceptaTerminos: true,
      aceptaPolitica: true,
    };
    this.updateDocumentSlots();
    this.prefillDocumentSlotsFromMock();
  }

  private prefillDocumentSlotsFromMock(): void {
    const es = this.selectorEstado();
    const approved = es === 'aprobada' || es === 'aprobado-bloqueado' || es === 'aprobado-listo-editar';
    if (!approved) return;
    this.documentSlots.forEach((slot, i) => {
      if (!slot.fileName) {
        slot.fileName = `documento-tributario-${i + 1}.pdf`;
      }
    });
  }

  // -----------------------------------------------------------------------
  // v-rechazada
  // -----------------------------------------------------------------------

  reintentar(): void {
    const restantes = this.intentosRestantes();
    if (restantes <= 0) {
      this.toast.error('Alcanzaste el límite de 3 intentos. Contacta soporte para revisión manual.', 'Sin intentos disponibles');
      this.selectorEstado.set('baneada');
      this.resolveVista();
      return;
    }
    this.intentosRestantes.set(restantes - 1);
    this.openSumsubMock();
    const quedan = restantes - 1;
    this.toast.info(
      quedan > 0
        ? `Te quedan ${quedan} intento(s) después de este.`
        : 'Este es tu último intento. Si falla, la cuenta quedará restringida.',
      'Nuevo intento',
    );
  }

  solicitarRevision(): void {
    this.apelacionTexto = '';
    this.apelacionEnviada.set(false);
    this.openModal('m-apelacion');
  }

  toggleReasonsExpanded(): void {
    this.reasonsExpanded.set(!this.reasonsExpanded());
  }

  openSalirSinGuardar(): void {
    this.openModal('m-salir-sin-guardar');
  }

  confirmarSalir(): void {
    const wasEditing = this.isEditMode();
    this.isEditMode.set(false);
    this.closeModal(true);
    if (wasEditing) {
      this.resolveVista();
    } else {
      this.navTo('v-nueva-bloqueada');
    }
  }

  @HostListener('window:popstate')
  onPopstate(): void {
    if (this.vistaActiva() === 'v-nueva-formulario') {
      history.pushState(null, '', window.location.href);
      this.openSalirSinGuardar();
    }
  }

  // -----------------------------------------------------------------------
  // Modal: m-mfa
  // -----------------------------------------------------------------------

  onOtpInput(index: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1);
    this.otpDigits[index] = val;
    if (val && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
    if (this.otpDigits.every(d => d !== '')) {
      this.verificarOtp(this.otpDigits.join(''));
    }
  }

  reenviarCodigo(): void {
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError.set('');
    this.toast.info('Te enviamos un nuevo código por SMS.', 'Código reenviado');
  }

  verificarOtp(code: string): void {
    if (code === '123456') {
      this.otpError.set('');
      if (this.pendingFacturacionRevalidation()) {
        this.pendingFacturacionRevalidation.set(false);
        this.sumsubContext.set('facturacion-revalidation');
        this.closeModal(true);
        this.toast.info('Verificaremos tu rostro con Sumsub antes de guardar.', 'Revalidación biométrica');
        this.openSumsubMock();
        return;
      }
      this.initFormDataFromMock();
      this.isEditMode.set(true);
      this.closeModal(true);
      this.navTo('v-nueva-formulario');
      history.pushState(null, '', window.location.href);
      this.toast.success('Identidad confirmada. Ya puedes actualizar tus datos.', 'Verificación exitosa');
    } else {
      this.otpError.set('Código incorrecto. Verifica e intenta de nuevo.');
      this.otpDigits = ['', '', '', '', '', ''];
    }
  }

  // -----------------------------------------------------------------------
  // Modal: m-confirmacion-pre-sumsub
  // -----------------------------------------------------------------------

  confirmarYValidar(): void {
    this.closeModal(true);
    this.sumsubStep.set(0);
    this.sumsubStepGuardado.set(0);
    this.toast.success('Tus datos quedaron guardados. Continúa con la verificación biométrica.', 'Datos guardados');
    this.openSumsubMock();
  }

  // -----------------------------------------------------------------------
  // Modal: m-sumsub
  // -----------------------------------------------------------------------

  avanzarSumsub(): void {
    this.avanzarSumsubPhase();
  }

  cerrarSumsub(): void {
    if (!this.confirmModalClose()) return;
    const phase = this.sumsubPhase();
    if (['capture-front', 'capture-back', 'selfie', 'document'].includes(phase)) {
      this.sumsubStepGuardado.set(Math.max(1, this.sumsubStep()));
    }
    this.modalActivo.set(null);
    this.modalFocusReturn?.focus();
    this.modalFocusReturn = null;
    this.selectorEstado.set('incompleta');
    this.vistaActiva.set('v-incompleta');
    this.syncIdentityDemoState();
  }

  // -----------------------------------------------------------------------
  // Modal: m-apelacion
  // -----------------------------------------------------------------------

  enviarApelacion(): void {
    if (this.apelacionTexto.trim()) {
      this.apelacionEnviada.set(true);
      this.closeModal(true);
      this.toast.success(
        'Tu solicitud fue enviada a soporte. Te contactaremos en un plazo de 3 a 5 días hábiles.',
        'Solicitud enviada',
      );
    }
  }
}
