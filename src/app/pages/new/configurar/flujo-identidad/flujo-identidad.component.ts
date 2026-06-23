import { Component, signal, computed, HostListener, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SUMSUB_CAPTURE_STEPS,
  DEFAULT_SUMSUB_CUSTOMIZATION,
  SumsubCustomizationConfig,
  SumsubScreenPhase,
  ACTIVIDAD_ECONOMICA_OPTIONS,
} from '../../../../common/models/identity-flow.models';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type VistaId =
  | 'v1-entrada'
  | 'v2-datos'
  | 'v4-mfa-modal'
  | 'v5-formulario-nucleo'
  | 'v6-formulario-fiscal'
  | 'v7-confirmacion-modal'
  | 'v8-sumsub-modal'
  | 'v9-pendiente'
  | 'v10-rechazado'
  | 'v11-baneado'
  | 'v12-apelacion-modal'
  | 'v13-incompleta'
  | 'v14-exitosa'
  | 'v15-documento-modal';

type EstadoValidacion = 'sin_iniciar' | 'pendiente' | 'rechazado' | 'baneado' | 'validado' | 'incompleta' | 'aprobado-bloqueado' | 'aprobado-listo-editar';
type TipoPersona = 'natural' | 'juridica';
type Pais = 'CO' | 'CL' | 'MX' | 'AR' | 'EC';

interface MockPerfil {
  id: string;
  label: string;
  estado: EstadoValidacion;
  tipo_persona: TipoPersona;
  pais: Pais;
  nombre: string;
  documento: string;
}

interface FormNucleo {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  tipoPersona: TipoPersona;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: Pais;
  razonSocial?: string;
}

interface FormFiscal {
  // Colombia
  tipoRegimen?: string;
  tipoResponsabilidad?: string;
  impuesto?: string;
  // Mexico
  codigoPostal?: string;
  regimenFiscal?: string;
  sujetoImpuestos?: boolean;
  // Argentina
  condicionIVA?: string;
  provincia?: string;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

@Component({
  selector: 'app-flujo-identidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './flujo-identidad.component.html',
  styleUrls: ['./flujo-identidad.component.scss'],
})
export class FlujoIdentidadComponent implements OnInit {

  // --- Demo switcher ---
  readonly perfiles: MockPerfil[] = [
    { id: 'p1', label: 'Sin iniciar — CO Natural',    estado: 'sin_iniciar', tipo_persona: 'natural',   pais: 'CO', nombre: 'Laura Martínez',    documento: '1.023.456.789' },
    { id: 'p2', label: 'Pendiente — MX Jurídica',     estado: 'pendiente',   tipo_persona: 'juridica',  pais: 'MX', nombre: 'Inversiones XYZ',   documento: 'ABC200501XY3' },
    { id: 'p3', label: 'Rechazado — AR Natural',      estado: 'rechazado',   tipo_persona: 'natural',   pais: 'AR', nombre: 'Nicolás Fernández', documento: '32.456.789' },
    { id: 'p4', label: 'Baneado — CL Natural',        estado: 'baneado',     tipo_persona: 'natural',   pais: 'CL', nombre: 'Javiera Pino',      documento: '18.234.567-K' },
    { id: 'p5', label: 'Validado — CO Jurídica',              estado: 'validado',            tipo_persona: 'juridica',  pais: 'CO', nombre: 'TechStore SAS',     documento: '900.123.456-1' },
    { id: 'p6', label: 'Incompleta — EC Natural',             estado: 'incompleta',          tipo_persona: 'natural',   pais: 'EC', nombre: 'Andrés Vega',       documento: '1705345678' },
    { id: 'p7', label: 'Aprobado · bloqueo 6 meses — CO',    estado: 'aprobado-bloqueado',  tipo_persona: 'natural',   pais: 'CO', nombre: 'Laura Martínez',    documento: '1.023.456.789' },
    { id: 'p8', label: 'Aprobado · puede actualizar — CO',   estado: 'aprobado-listo-editar', tipo_persona: 'natural', pais: 'CO', nombre: 'Laura Martínez',    documento: '1.023.456.789' },
  ];

  perfilActivo = signal<MockPerfil>(this.perfiles[0]);

  // --- Vista navigation ---
  vistaActiva = signal<VistaId>('v1-entrada');
  modalActivo = signal<VistaId | null>(null);

  // --- Form state (plain objects — compatible with ngModel) ---
  formNucleo: FormNucleo = {
    primerNombre: 'Laura',
    segundoNombre: 'Isabel',
    primerApellido: 'Martínez',
    segundoApellido: 'Suárez',
    fechaNacimiento: '1992-04-15',
    nacionalidad: 'Colombiana',
    tipoPersona: 'natural',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '1.023.456.789',
    email: 'laura.martinez@email.com',
    telefono: '+57 300 123 4567',
    direccion: 'Calle 45 # 32-10, Apto 502',
    ciudad: 'Bogotá D.C.',
    pais: 'CO',
  };

  formFiscal: FormFiscal = {
    tipoRegimen: 'Simplificado',
    tipoResponsabilidad: 'No responsable de IVA',
    impuesto: '',
  };

  // --- OTP state ---
  otpDigits = signal<string[]>(['', '', '', '', '', '']);
  otpError = signal<string>('');
  otpTimer = signal<number>(60);
  otpBlocked = signal<boolean>(false);

  // --- Sumsub mock state ---
  sumsubStep = signal<number>(0);
  sumsubSteps = SUMSUB_CAPTURE_STEPS;
  sumsubLoading = signal<boolean>(false);
  confirmacionAceptada = signal<boolean>(false);
  sumsubPhase = signal<SumsubScreenPhase>('warning');
  sumsubCustomization = signal<SumsubCustomizationConfig>({ ...DEFAULT_SUMSUB_CUSTOMIZATION });
  sumsubDemoExpanded = signal(false);
  readonly actividadEconomicaOptions = ACTIVIDAD_ECONOMICA_OPTIONS;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // --- Rechazo mock ---
  motivoRechazo = 'La foto de tu documento no se ve con suficiente claridad. Asegúrate de que el documento esté bien iluminado y sin reflejos.';
  intentosRestantes = signal<number>(2);

  // --- Edit mode & rejection reasons ---
  isEditMode = signal<boolean>(false);
  showSalirModal = signal<boolean>(false);
  reasonsExpanded = signal<boolean>(false);

  readonly rejectionReasonsList = [
    { code: 'DOCUMENT_BLURRY',       label: 'Documento borroso',           description: 'La imagen del documento no es legible. Ubícate en un lugar bien iluminado y sin reflejos.' },
    { code: 'FACE_NOT_VISIBLE',      label: 'Rostro no visible',           description: 'Tu rostro no aparece claramente en la selfie o está cubierto parcialmente.' },
    { code: 'DOCUMENT_EXPIRED',      label: 'Documento vencido',           description: 'El documento que usaste ya no está vigente. Solo aceptamos documentos en vigencia.' },
    { code: 'DOCUMENT_COPY',         label: 'No se aceptan copias',        description: 'Solo documentos originales. No fotocopias ni capturas de pantalla del documento.' },
    { code: 'FACE_COVERED',          label: 'Rostro cubierto',             description: 'Retira gafas de sol, gorras o cualquier elemento que cubra tu cara.' },
    { code: 'SELFIE_MISMATCH',       label: 'Selfie no coincide',          description: 'La selfie no corresponde a la persona en el documento de identidad.' },
    { code: 'DOCUMENT_NOT_READABLE', label: 'Datos ilegibles',             description: 'La información en el documento no se puede leer con claridad.' },
    { code: 'LIGHTING_ISSUE',        label: 'Mala iluminación',            description: 'Ubícate donde haya luz directa, sin sombras sobre el documento o tu rostro.' },
    { code: 'DOCUMENT_FRONT_MISSING',label: 'Falta cara frontal',          description: 'No se cargó la parte delantera del documento.' },
    { code: 'DOCUMENT_BACK_MISSING', label: 'Falta reverso del documento', description: 'No se cargó el reverso del documento.' },
    { code: 'MULTIPLE_FACES',        label: 'Más de un rostro',            description: 'En la selfie solo debe aparecer la persona que se está validando.' },
    { code: 'DOCUMENT_INVALID',      label: 'Tipo de documento inválido',  description: 'El tipo de documento seleccionado no es válido para tu país de residencia.' },
  ];

  // --- Apelación ---
  apelacionTexto = '';
  apelacionEnviada = signal<boolean>(false);

  // --- Documento adjunto ---
  documentoDesactualizado = signal<boolean>(false);

  // --- Computed (getters on plain properties) ---
  get paisConFiscal(): boolean {
    return this.formNucleo.pais === 'CO' || this.formNucleo.pais === 'MX' || this.formNucleo.pais === 'AR';
  }

  get paisLabel(): string {
    const map: Record<Pais, string> = { CO: 'Colombia', CL: 'Chile', MX: 'México', AR: 'Argentina', EC: 'Ecuador' };
    return map[this.formNucleo.pais];
  }

  get camposGeograficos(): string {
    const map: Record<Pais, string> = { CO: 'Municipio', CL: 'Región / Comuna', MX: 'Ciudad', AR: 'Provincia / Ciudad', EC: 'Cantón' };
    return map[this.formNucleo.pais];
  }

  get opcionesFiscales(): string[] {
    const p = this.formNucleo.pais;
    const tp = this.formNucleo.tipoPersona;
    if (p === 'CO') return ['Gran contribuyente', 'Autorretenedor', 'Agente retenedor IVA', 'Simplificado', 'No responsable de IVA'];
    if (p === 'MX') return tp === 'natural'
      ? ['Sueldos y salarios', 'Actividades empresariales', 'Régimen simplificado de confianza']
      : ['General de ley personas morales', 'Personas morales con fines no lucrativos'];
    if (p === 'AR') return tp === 'natural'
      ? ['Consumidor Final', 'IVA Responsable Inscripto', 'Responsable Monotributo']
      : ['IVA Responsable Inscripto', 'IVA Exento'];
    return [];
  }

  readonly estadoClase = computed<string>(() => {
    const e = this.perfilActivo().estado;
    return ({
      sin_iniciar:          'badge--neutral',
      pendiente:            'badge--warning',
      rechazado:            'badge--error',
      baneado:              'badge--error',
      validado:             'badge--success',
      incompleta:           'badge--warning',
      'aprobado-bloqueado':    'badge--warning',
      'aprobado-listo-editar': 'badge--success',
    } as Record<string, string>)[e] ?? 'badge--neutral';
  });

  readonly estadoLabel = computed<string>(() => {
    const map: Record<string, string> = {
      sin_iniciar:          'Sin iniciar',
      pendiente:            'En revisión',
      rechazado:            'Rechazado',
      baneado:              'Cuenta restringida',
      validado:             'Identidad validada',
      incompleta:           'Validación incompleta',
      'aprobado-bloqueado':    'Validada · en espera',
      'aprobado-listo-editar': 'Validada',
    };
    return map[this.perfilActivo().estado] ?? '';
  });

  readonly canEditData = computed<boolean>(() => {
    const e = this.perfilActivo().estado;
    return e === 'validado' || e === 'aprobado-listo-editar';
  });

  /** En v2-datos con banner de estado, ocultar badge duplicado en header */
  readonly showHeaderEstadoBadge = computed<boolean>(() => {
    if (this.vistaActiva() !== 'v2-datos') return true;
    const e = this.perfilActivo().estado;
    return e === 'validado' || e === 'aprobado-listo-editar';
  });

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

  // -----------------------------------------------------------------------
  // Navigation helpers
  // -----------------------------------------------------------------------

  navTo(v: VistaId): void {
    this.vistaActiva.set(v);
    this.modalActivo.set(null);
  }

  openModal(m: VistaId): void {
    this.modalActivo.set(m);
  }

  closeModal(): void {
    this.modalActivo.set(null);
  }

  isVista(v: VistaId): boolean {
    return this.vistaActiva() === v;
  }

  isModal(m: VistaId): boolean {
    return this.modalActivo() === m;
  }

  // -----------------------------------------------------------------------
  // Demo profile switcher
  // -----------------------------------------------------------------------

  seleccionarPerfil(p: MockPerfil): void {
    this.perfilActivo.set(p);
    this.modalActivo.set(null);
    // Route to the appropriate start view based on estado
    const routes: Record<string, VistaId> = {
      sin_iniciar:          'v1-entrada',
      pendiente:            'v9-pendiente',
      rechazado:            'v10-rechazado',
      baneado:              'v11-baneado',
      validado:             'v2-datos',
      incompleta:           'v13-incompleta',
      'aprobado-bloqueado':    'v2-datos',
      'aprobado-listo-editar': 'v2-datos',
    };
    this.navTo(routes[p.estado] ?? 'v1-entrada');
  }

  // -----------------------------------------------------------------------
  // Vista 1 — Entrada
  // -----------------------------------------------------------------------

  comenzarValidacion(): void {
    this.navTo('v2-datos');
  }

  // -----------------------------------------------------------------------
  // Vista 2 — Datos
  // -----------------------------------------------------------------------

  continuarValidacion(): void {
    if (this.perfilActivo().estado === 'incompleta') {
      this.openModal('v8-sumsub-modal');
    } else {
      this.openModal('v8-sumsub-modal');
    }
  }

  reintentar(): void {
    if (this.perfilActivo().estado === 'rechazado') {
      this.navTo('v10-rechazado');
    }
  }

  solicitarRevision(): void {
    this.openModal('v12-apelacion-modal');
  }

  verDocumento(): void {
    this.openModal('v15-documento-modal');
  }

  abrirActualizacion(): void {
    this.isEditMode.set(false);
    this.otpDigits.set(['', '', '', '', '', '']);
    this.otpError.set('');
    this.openModal('v4-mfa-modal');
  }

  openSalirSinGuardar(): void {
    this.showSalirModal.set(true);
  }

  confirmarSalir(): void {
    const wasEditing = this.isEditMode();
    this.isEditMode.set(false);
    this.showSalirModal.set(false);
    if (wasEditing) {
      this.navTo('v2-datos');
    } else {
      this.navTo('v1-entrada');
    }
  }

  toggleReasonsExpanded(): void {
    this.reasonsExpanded.set(!this.reasonsExpanded());
  }

  @HostListener('window:popstate')
  onPopstate(): void {
    const v = this.vistaActiva();
    if (v === 'v5-formulario-nucleo' || v === 'v6-formulario-fiscal') {
      history.pushState(null, '', window.location.href);
      this.openSalirSinGuardar();
    }
  }

  onOtpInput(index: number, event: Event): void {
    const val = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(-1);
    const digits = [...this.otpDigits()];
    digits[index] = val;
    this.otpDigits.set(digits);
    if (val && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
    if (digits.every(d => d !== '')) {
      this.verificarOtp(digits.join(''));
    }
  }

  verificarOtp(code: string): void {
    if (code === '123456') {
      this.otpError.set('');
      this.isEditMode.set(true);
      this.closeModal();
      this.navTo('v5-formulario-nucleo');
      history.pushState(null, '', window.location.href);
    } else {
      this.otpError.set('Código incorrecto. Verifica e intenta de nuevo.');
      this.otpDigits.set(['', '', '', '', '', '']);
    }
  }

  // -----------------------------------------------------------------------
  // Vista 5 — Formulario núcleo
  // -----------------------------------------------------------------------

  continuarFormulario(): void {
    if (this.paisConFiscal) {
      this.navTo('v6-formulario-fiscal');
    } else {
      this.openModal('v7-confirmacion-modal');
    }
  }

  // -----------------------------------------------------------------------
  // Vista 6 — Formulario fiscal
  // -----------------------------------------------------------------------

  ngOnInit(): void {
    const p = this.route.snapshot.queryParamMap.get('perfil');
    if (p) {
      const found = this.perfiles.find(x => x.id === p);
      if (found) this.seleccionarPerfil(found);
    }
  }

  copyDemoLink(): void {
    const url = `${window.location.origin}${window.location.pathname}?perfil=${this.perfilActivo().id}`;
    navigator.clipboard?.writeText(url);
  }

  revisarAntesDeEnviar(): void {
    this.confirmacionAceptada.set(false);
    this.openModal('v7-confirmacion-modal');
  }

  // -----------------------------------------------------------------------
  // Vista 7 — Confirmación
  // -----------------------------------------------------------------------

  confirmarYValidar(): void {
    if (!this.confirmacionAceptada()) return;
    this.closeModal();
    this.sumsubStep.set(0);
    this.sumsubPhase.set('warning');
    this.openModal('v8-sumsub-modal');
  }

  avanzarSumsubPhase(): void {
    const phase = this.sumsubPhase();
    const c = this.sumsubCustomization();
    if (phase === 'warning') {
      this.sumsubPhase.set(c.skipWelcome ? (c.skipInstructions ? 'document' : 'instructions') : 'welcome');
    } else if (phase === 'welcome') {
      this.sumsubPhase.set(c.skipInstructions ? 'document' : 'instructions');
    } else if (phase === 'instructions') {
      this.sumsubPhase.set('document');
    } else if (phase === 'document') {
      this.sumsubPhase.set('capture-front');
    } else if (phase === 'capture-front') {
      this.sumsubPhase.set('capture-back');
    } else if (phase === 'capture-back') {
      this.sumsubPhase.set('selfie');
    } else if (phase === 'selfie') {
      this.sumsubLoading.set(true);
      setTimeout(() => {
        this.sumsubLoading.set(false);
        this.closeModal();
        this.vistaActiva.set('v9-pendiente');
        this.perfilActivo.update(p => ({ ...p, estado: 'pendiente' }));
      }, 1000);
    }
  }

  toggleSumsubCustomization(key: keyof SumsubCustomizationConfig): void {
    this.sumsubCustomization.update(cfg => ({ ...cfg, [key]: !cfg[key] }));
  }

  // -----------------------------------------------------------------------
  // Vista 8 — Sumsub mock
  // -----------------------------------------------------------------------

  avanzarSumsub(): void {
    const next = this.sumsubStep() + 1;
    if (next < this.sumsubSteps.length) {
      this.sumsubLoading.set(true);
      setTimeout(() => {
        this.sumsubLoading.set(false);
        this.sumsubStep.set(next);
      }, 800);
    } else {
      this.closeModal();
      this.navTo('v9-pendiente');
    }
  }

  cerrarSumsub(): void {
    this.closeModal();
    this.navTo('v13-incompleta');
  }

  // -----------------------------------------------------------------------
  // Vista 10 — Rechazado
  // -----------------------------------------------------------------------

  reintentarDesdePerfil(): void {
    this.openModal('v8-sumsub-modal');
    this.sumsubStep.set(0);
  }

  // -----------------------------------------------------------------------
  // Vista 12 — Apelación
  // -----------------------------------------------------------------------

  enviarApelacion(): void {
    if (this.apelacionTexto.trim().length > 0) {
      this.apelacionEnviada.set(true);
      setTimeout(() => this.closeModal(), 300);
    }
  }

  // -----------------------------------------------------------------------
  // Vista 15 — Documento
  // -----------------------------------------------------------------------

  marcarDesactualizado(): void {
    this.documentoDesactualizado.set(true);
    setTimeout(() => this.closeModal(), 400);
  }

  // -----------------------------------------------------------------------
  // Util
  // -----------------------------------------------------------------------

  trackById(index: number, item: MockPerfil): string {
    return item.id;
  }
}
