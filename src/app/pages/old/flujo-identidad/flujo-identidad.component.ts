import { Component, signal, OnDestroy, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../common/services/toast.service';
import { DropiToastComponent } from '../../../common/components/dropi-toast/dropi-toast.component';
import { IdentidadTourService, TourStep } from '../../../common/services/identidad-tour.service';
import { IdentidadTourComponent } from '../../../common/components/identidad-tour/identidad-tour.component';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type OrigenValidacion = 'configuraciones' | 'retiro' | 'dropicard';
type UserType = 'nuevo-sin-datos' | 'antiguo-completo' | 'antiguo-campos-nuevos' | 'cross-country';
type EstadoId =
  | 'inicial'
  | 'guardado-sin-comenzar'
  | 'incompleta'
  | 'en-revision'
  | 'aprobada'
  | 'recien-aprobada'
  | 'aprobado-bloqueado'
  | 'aprobado-listo-editar'
  | 'rechazada-espera'
  | 'rechazada-reintentar'
  | 'baneada'
  | 'email-baneado';
type PaisPersona = 'co-natural' | 'co-juridica' | 'mx-natural' | 'mx-juridica' | 'ar-natural' | 'ar-juridica' | 'cl' | 'ec';
type Pais = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';
type TipoPersona = 'natural' | 'juridica';
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
  | 'm-seleccionar-campos'
  | 'm-mfa'
  | 'm-confirmacion-pre-sumsub'
  | 'm-sumsub'
  | 'm-apelacion'
  | 'm-documento'
  | 'm-salir-sin-guardar';

// -----------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------

interface SelectorOption<T> {
  id: T;
  label: string;
  color: 'neutral' | 'success' | 'warning' | 'error';
}

interface GrupoActualizacion {
  id: string;
  label: string;
  desc: string;
  requiresRevalidation: boolean;
}

// Form fields as plain objects for ngModel compatibility
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
  razonSocial: string;
}

interface FormFiscal {
  // Colombia
  co_tipoRegimen: string;
  co_tipoResponsabilidad: string;
  co_impuesto: string;
  // México
  mx_codigoPostal: string;
  mx_regimenFiscal: string;
  mx_sujetoImpuestos: boolean;
  // Argentina
  ar_condicionIVA: string;
  ar_provincia: string;
}

// -----------------------------------------------------------------------
// Mock data — 8 users, one per PaisPersona
// -----------------------------------------------------------------------

interface MockUserData {
  pais: Pais;
  tipoPersona: TipoPersona;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  tipoDocumento: string;
  numeroDocumento: string;
  razonSocial: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  // Fiscal
  co_tipoRegimen: string;
  co_tipoResponsabilidad: string;
  co_impuesto: string;
  mx_codigoPostal: string;
  mx_regimenFiscal: string;
  mx_sujetoImpuestos: boolean;
  ar_condicionIVA: string;
  ar_provincia: string;
  // New fields marker
  camposNuevos: string[];
  paisAnterior: Pais;
}

const MOCK_USERS: Record<PaisPersona, MockUserData> = {
  'co-natural': {
    pais: 'CO', tipoPersona: 'natural',
    primerNombre: 'Laura', segundoNombre: 'Isabel',
    primerApellido: 'Martínez', segundoApellido: 'Suárez',
    fechaNacimiento: '1992-04-15', nacionalidad: 'Colombiana',
    tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '1.023.456.789',
    razonSocial: '',
    email: 'laura.martinez@gmail.com', telefono: '+57 300 123 4567',
    direccion: 'Calle 45 # 32-10, Apto 502', ciudad: 'Bogotá D.C.',
    co_tipoRegimen: 'Simplificado', co_tipoResponsabilidad: 'No responsable de IVA', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['co_impuesto'],
    paisAnterior: 'MX',
  },
  'co-juridica': {
    pais: 'CO', tipoPersona: 'juridica',
    primerNombre: 'Carlos', segundoNombre: 'Andrés',
    primerApellido: 'Gómez', segundoApellido: 'Ríos',
    fechaNacimiento: '1985-07-22', nacionalidad: 'Colombiana',
    tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '80.234.567',
    razonSocial: 'TechStore SAS',
    email: 'admin@techstore.co', telefono: '+57 311 456 7890',
    direccion: 'Carrera 7 # 71-21, Piso 3', ciudad: 'Bogotá D.C.',
    co_tipoRegimen: 'Gran contribuyente', co_tipoResponsabilidad: 'Agente retenedor IVA', co_impuesto: 'IVA',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['co_tipoResponsabilidad'],
    paisAnterior: 'EC',
  },
  'mx-natural': {
    pais: 'MX', tipoPersona: 'natural',
    primerNombre: 'Sofía', segundoNombre: 'Valentina',
    primerApellido: 'Hernández', segundoApellido: 'Torres',
    fechaNacimiento: '1995-11-03', nacionalidad: 'Mexicana',
    tipoDocumento: 'INE', numeroDocumento: 'HETS951103MDFRRN09',
    razonSocial: '',
    email: 'sofia.hernandez@gmail.com', telefono: '+52 55 1234 5678',
    direccion: 'Av. Insurgentes Sur 1234, Col. Del Valle', ciudad: 'Ciudad de México',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '03100', mx_regimenFiscal: 'Régimen simplificado de confianza', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['mx_codigoPostal'],
    paisAnterior: 'CO',
  },
  'mx-juridica': {
    pais: 'MX', tipoPersona: 'juridica',
    primerNombre: 'Miguel', segundoNombre: 'Ángel',
    primerApellido: 'López', segundoApellido: 'Mendoza',
    fechaNacimiento: '1980-03-15', nacionalidad: 'Mexicana',
    tipoDocumento: 'INE', numeroDocumento: 'LOMM800315HDFPDN07',
    razonSocial: 'Inversiones XYZ SA de CV',
    email: 'miguel.lopez@inversionesxyz.mx', telefono: '+52 33 9876 5432',
    direccion: 'Blvd. Manuel Ávila Camacho 88, Lomas de Chapultepec', ciudad: 'Ciudad de México',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '11000', mx_regimenFiscal: 'General de ley personas morales', mx_sujetoImpuestos: true,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: ['mx_regimenFiscal'],
    paisAnterior: 'AR',
  },
  'ar-natural': {
    pais: 'AR', tipoPersona: 'natural',
    primerNombre: 'Nicolás', segundoNombre: 'Rodrigo',
    primerApellido: 'Fernández', segundoApellido: 'Díaz',
    fechaNacimiento: '1990-08-28', nacionalidad: 'Argentina',
    tipoDocumento: 'DNI', numeroDocumento: '32.456.789',
    razonSocial: '',
    email: 'nico.fernandez@hotmail.com', telefono: '+54 11 3456 7890',
    direccion: 'Av. Corrientes 1234, Piso 2', ciudad: 'Buenos Aires',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: 'Responsable Monotributo', ar_provincia: 'Buenos Aires',
    camposNuevos: ['ar_provincia'],
    paisAnterior: 'CL',
  },
  'ar-juridica': {
    pais: 'AR', tipoPersona: 'juridica',
    primerNombre: 'María', segundoNombre: 'José',
    primerApellido: 'Rodríguez', segundoApellido: 'Pereyra',
    fechaNacimiento: '1978-12-05', nacionalidad: 'Argentina',
    tipoDocumento: 'DNI', numeroDocumento: '26.789.012',
    razonSocial: 'E-Commerce Argentina SRL',
    email: 'mrodriguez@ecommerce-ar.com', telefono: '+54 11 5678 9012',
    direccion: 'Calle Florida 234, Piso 5', ciudad: 'Buenos Aires',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: 'IVA Responsable Inscripto', ar_provincia: 'CABA',
    camposNuevos: ['ar_condicionIVA'],
    paisAnterior: 'EC',
  },
  'cl': {
    pais: 'CL', tipoPersona: 'natural',
    primerNombre: 'Javiera', segundoNombre: 'Alejandra',
    primerApellido: 'Pino', segundoApellido: 'Araya',
    fechaNacimiento: '1993-02-14', nacionalidad: 'Chilena',
    tipoDocumento: 'Cédula de identidad', numeroDocumento: '18.234.567-K',
    razonSocial: '',
    email: 'javiera.pino@gmail.com', telefono: '+56 9 8765 4321',
    direccion: 'Av. Providencia 2345, Depto 104', ciudad: 'Santiago, Región Metropolitana',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: [],
    paisAnterior: 'CO',
  },
  'ec': {
    pais: 'EC', tipoPersona: 'natural',
    primerNombre: 'Andrés', segundoNombre: 'Felipe',
    primerApellido: 'Vega', segundoApellido: 'Castillo',
    fechaNacimiento: '1997-06-19', nacionalidad: 'Ecuatoriana',
    tipoDocumento: 'Cédula de identidad', numeroDocumento: '1705345678',
    razonSocial: '',
    email: 'andres.vega@gmail.com', telefono: '+593 99 123 4567',
    direccion: 'Av. 6 de Diciembre N25-12 y Foch, Of. 301', ciudad: 'Quito, Pichincha',
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
    camposNuevos: [],
    paisAnterior: 'MX',
  },
};

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

@Component({
  selector: 'app-flujo-identidad',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiToastComponent, IdentidadTourComponent],
  templateUrl: './flujo-identidad.component.html',
  styleUrls: ['./flujo-identidad.component.scss'],
})
export class FlujoIdentidadComponent implements OnDestroy {

  private toast = inject(ToastService);
  private tour = inject(IdentidadTourService);
  private router = inject(Router);

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
        body: 'Este es el flujo KYC/KYB con el que un usuario verifica su identidad para desbloquear Dropi. Recorre los 9 pasos para ver cada estado del proceso. Usa la barra superior para explorar combinaciones por tu cuenta.',
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
        title: 'Los 3 pasos del proceso',
        body: 'Tus datos · Verificación · Resultado. El formulario se divide en 2 pasos (datos personales + fiscal) antes de la verificación biométrica Sumsub.',
        target: '[data-tour="fid-stepper"]',
        placement: 'bottom',
        onEnter: () => { this.setEstado('inicial'); this.navTo('v-nueva-formulario'); this.formStep.set(1); },
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
        body: 'Si algo falla, el usuario ve el motivo claro, sus intentos restantes y puede reintentar o contactar a soporte. Con esto cierras el recorrido — explora el resto desde la barra superior.',
        placement: 'center',
        onEnter: () => this.setEstado('rechazada-reintentar'),
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
    { id: 'aprobada',             label: 'Aprobada · estado estable',     color: 'success' },
    { id: 'rechazada-espera',     label: 'Rechazada · espera 10 min',    color: 'error'   },
    { id: 'rechazada-reintentar', label: 'Rechazada · puede reintentar', color: 'error'   },
    { id: 'baneada',              label: 'Baneada (3 rechazos)',          color: 'error'   },
    { id: 'email-baneado',        label: 'Email baneado cross-country',  color: 'error'   },
    { id: 'aprobado-bloqueado',    label: 'Aprobada · bloqueo 6 meses',  color: 'warning' },
    { id: 'aprobado-listo-editar', label: 'Aprobada · puede actualizar', color: 'success' },
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

  formNucleo: FormNucleo = {
    primerNombre: '', segundoNombre: '',
    primerApellido: '', segundoApellido: '',
    fechaNacimiento: '', nacionalidad: '',
    tipoPersona: 'natural', tipoDocumento: '', numeroDocumento: '',
    email: '', telefono: '',
    direccion: '', ciudad: '',
    razonSocial: '',
  };

  formFiscal: FormFiscal = {
    co_tipoRegimen: '', co_tipoResponsabilidad: '', co_impuesto: '',
    mx_codigoPostal: '', mx_regimenFiscal: '', mx_sujetoImpuestos: false,
    ar_condicionIVA: '', ar_provincia: '',
  };

  // ── MFA / OTP ─────────────────────────────────────────────────────────

  otpDigits: string[] = ['', '', '', '', '', ''];
  otpError = signal<string>('');

  // ── Sumsub mock ───────────────────────────────────────────────────────

  sumsubStep = signal<number>(0);
  sumsubLoading = signal<boolean>(false);
  readonly sumsubSteps = [
    'Seleccionar documento',
    'Captura frontal',
    'Captura trasera',
    'Selfie / Verificación',
  ];

  // ── Countdown (rechazada-espera) ──────────────────────────────────────

  countdownSeconds = signal<number>(600);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  // ── Other state ───────────────────────────────────────────────────────

  intentosRestantes = signal<number>(2);
  apelacionTexto = '';
  apelacionEnviada = signal<boolean>(false);
  isEditMode = signal<boolean>(false);
  reasonsExpanded = signal<boolean>(false);
  gruposSeleccionados = signal<string[]>([]);

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

  readonly gruposActualizacion: GrupoActualizacion[] = [
    { id: 'nombre',      label: 'Nombre completo',        desc: 'Primer nombre, segundo nombre, apellidos',          requiresRevalidation: true  },
    { id: 'documento',   label: 'Documento de identidad', desc: 'Tipo y número de documento',                       requiresRevalidation: true  },
    { id: 'contacto',    label: 'Datos de contacto',      desc: 'Teléfono, email de contacto',                      requiresRevalidation: false },
    { id: 'direccion',   label: 'Dirección',              desc: 'Dirección, ciudad, municipio',                     requiresRevalidation: false },
    { id: 'fiscal',      label: 'Datos fiscales',         desc: 'Régimen, responsabilidad tributaria',              requiresRevalidation: false },
    { id: 'empresa',     label: 'Datos de empresa',       desc: 'Razón social (solo personas jurídicas)',            requiresRevalidation: false },
  ];

  // -----------------------------------------------------------------------
  // Computed getters
  // -----------------------------------------------------------------------

  get globalStepLabel(): string {
    const labels: Record<1 | 2 | 3, string> = {
      1: 'Tus datos',
      2: 'Verificación',
      3: 'Resultado',
    };
    const paso = this.pasoGlobal;
    return `Paso ${paso} de 3 · ${labels[paso]}`;
  }

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
        descripcion: 'Verificamos quién eres en menos de 5 minutos, una sola vez. Lo que se activa:',
      },
      retiro: {
        titulo: 'Verifica tu identidad para retirar',
        descripcion: 'En menos de 5 minutos confirmamos quién eres. Tus retiros quedan habilitados de forma permanente.',
      },
      dropicard: {
        titulo: 'Activa tu Dropicard en minutos',
        descripcion: 'Verificamos tu identidad en menos de 5 minutos, una sola vez. Lo que se activa:',
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
    };
    return map[this.selectorOrigen()];
  }

  get beneficioDesbloqueado(): string {
    const map: Record<OrigenValidacion, string> = {
      configuraciones: 'usar todas las funciones de tu cuenta',
      retiro: 'procesar retiros de saldo',
      dropicard: 'solicitar tu Dropicard',
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
      'v-incompleta':           'Quedó pendiente la sesión biométrica',
      'v-en-revision':          `Te avisaremos a ${this.mockUser.email} en menos de 24 h hábiles`,
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

  get requiresRevalidation(): boolean {
    return this.gruposSeleccionados().some(id => {
      return this.gruposActualizacion.find(g => g.id === id)?.requiresRevalidation ?? false;
    });
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

  // ── Global stepper (3 pasos: Tus datos · Verificación · Resultado) ────────

  get mostrarStepper(): boolean {
    const v = this.vistaActiva();
    return v !== 'v-baneada'
      && v !== 'v-email-baneado'
      && v !== 'v-nueva-formulario'
      && v !== 'v-nueva-onboarding'
      && v !== 'v-exitosa'
      && v !== 'v-rechazada'
      && v !== 'v-validado-datos'
      && v !== 'v-validado-campos-nuevos';
  }

  get canEditData(): boolean {
    const es = this.selectorEstado();
    return es === 'aprobada' || es === 'recien-aprobada' || es === 'aprobado-listo-editar';
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

  get mostrarStepMobile(): boolean {
    return this.mostrarStepper;
  }

  get pasoGlobal(): 1 | 2 | 3 {
    switch (this.vistaActiva()) {
      case 'v-en-revision':
      case 'v-rechazada':
        return 2;
      case 'v-exitosa':
      case 'v-validado-datos':
      case 'v-validado-campos-nuevos':
        return 3;
      default:
        return 1;
    }
  }

  stepState(n: 1 | 2 | 3): 'pending' | 'focus' | 'completed' | 'error' {
    const current = this.pasoGlobal;
    if (n < current) return 'completed';
    if (n === current) {
      if (n === 2 && this.vistaActiva() === 'v-rechazada') return 'error';
      if (n === 3) return 'completed';
      return 'focus';
    }
    return 'pending';
  }

  // -----------------------------------------------------------------------
  // Selector change handlers
  // -----------------------------------------------------------------------

  setUserType(type: UserType): void {
    this.selectorUsuario.set(type);
    this.modalActivo.set(null);
    this.resolveVista();
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
  }

  setPais(pais: PaisPersona): void {
    this.selectorPais.set(pais);
    this.modalActivo.set(null);
    this.resolveVista();
  }

  setOrigen(origen: OrigenValidacion): void {
    this.selectorOrigen.set(origen);
  }

  resolveVista(): void {
    const ut = this.selectorUsuario();
    const es = this.selectorEstado();

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
    if (es === 'aprobada' || es === 'aprobado-bloqueado' || es === 'aprobado-listo-editar') {
      this.vistaActiva.set(ut === 'antiguo-campos-nuevos' ? 'v-validado-campos-nuevos' : 'v-validado-datos');
      return;
    }
    if (es === 'guardado-sin-comenzar' || (ut !== 'nuevo-sin-datos' && es === 'inicial')) {
      this.vistaActiva.set('v-guardada-sin-comenzar'); return;
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
    this.onboardingStep.set(1);
    this.onboardingTipoPersona = this.tipoPersona;
    this.navTo('v-nueva-onboarding');
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
    this.selectorEstado.set('aprobada');
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
    this.syncPaisFromOnboarding();
    this.initFormData();
    this.formNucleo.tipoPersona = this.onboardingTipoPersona;
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
      case 'direccion':       return n.direccion.trim() ? '' : 'Ingresa tu dirección';
      case 'ciudad':          return n.ciudad.trim() ? '' : `Ingresa tu ${this.campoGeografico.toLowerCase()}`;
      case 'razonSocial':     return this.tipoPersona !== 'juridica' || n.razonSocial.trim() ? '' : 'Ingresa la razón social';
      case 'co_tipoRegimen':        return f.co_tipoRegimen ? '' : 'Selecciona el tipo de régimen';
      case 'co_tipoResponsabilidad': return f.co_tipoResponsabilidad ? '' : 'Selecciona la responsabilidad tributaria';
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
    const fields = [
      'primerNombre', 'primerApellido', 'fechaNacimiento', 'nacionalidad',
      'tipoDocumento', 'numeroDocumento', 'direccion', 'ciudad',
    ];
    if (this.tipoPersona === 'juridica') fields.push('razonSocial');
    return this.validateFields(fields);
  }

  validateStep2(): boolean {
    if (!this.paisConFiscal) return true;
    const fields: string[] = [];
    if (this.pais === 'CO') fields.push('co_tipoRegimen', 'co_tipoResponsabilidad');
    if (this.pais === 'MX') fields.push('mx_codigoPostal', 'mx_regimenFiscal');
    if (this.pais === 'AR') fields.push('ar_condicionIVA', 'ar_provincia');
    return this.validateFields(fields);
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
      fechaNacimiento: isNew ? '' : u.fechaNacimiento,
      nacionalidad:    isNew ? '' : u.nacionalidad,
      tipoPersona: u.tipoPersona,
      tipoDocumento:  isNew ? '' : u.tipoDocumento,
      numeroDocumento: isNew ? '' : u.numeroDocumento,
      email:    u.email,
      telefono: u.telefono,
      direccion: isNew ? '' : u.direccion,
      ciudad:    isNew ? '' : u.ciudad,
      razonSocial: isNew ? '' : u.razonSocial,
    };
    this.formFiscal = {
      co_tipoRegimen:        isNew ? '' : u.co_tipoRegimen,
      co_tipoResponsabilidad: isNew ? '' : u.co_tipoResponsabilidad,
      co_impuesto:           isNew ? '' : u.co_impuesto,
      mx_codigoPostal:       isNew ? '' : u.mx_codigoPostal,
      mx_regimenFiscal:      isNew ? '' : u.mx_regimenFiscal,
      mx_sujetoImpuestos:    isNew ? false : u.mx_sujetoImpuestos,
      ar_condicionIVA:       isNew ? '' : u.ar_condicionIVA,
      ar_provincia:          isNew ? '' : u.ar_provincia,
    };
  }

  siguienteFormPaso(): void {
    if (!this.validateStep1()) return;
    if (this.paisConFiscal) {
      this.formStep.set(2);
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
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
  }

  reanudarValidacion(): void {
    this.sumsubStep.set(this.sumsubStepGuardado());
    this.openModal('m-sumsub');
  }

  empezarDeNuevo(): void {
    this.sumsubStep.set(0);
    this.sumsubStepGuardado.set(0);
    this.openModal('m-sumsub');
  }

  verDatosEnviados(): void {
    this.selectorEstado.set('aprobada');
    this.resolveVista();
  }

  // -----------------------------------------------------------------------
  // v-validado-datos
  // -----------------------------------------------------------------------

  solicitarActualizacion(): void {
    this.gruposSeleccionados.set(this.gruposActualizacion.map(g => g.id));
    this.isEditMode.set(false);
    this.otpDigits = ['', '', '', '', '', ''];
    this.otpError.set('');
    this.openModal('m-mfa');
  }

  verDocumento(): void {
    this.openModal('m-documento');
  }

  // -----------------------------------------------------------------------
  // v-validado-campos-nuevos
  // -----------------------------------------------------------------------

  completarCamposNuevos(): void {
    const mappedGrupos = this.camposNuevos.map(c => {
      if (['co_tipoRegimen','co_tipoResponsabilidad','co_impuesto','mx_codigoPostal','mx_regimenFiscal','mx_sujetoImpuestos','ar_condicionIVA','ar_provincia'].includes(c)) return 'fiscal';
      if (['primerNombre','segundoNombre','primerApellido','segundoApellido'].includes(c)) return 'nombre';
      if (['tipoDocumento','numeroDocumento'].includes(c)) return 'documento';
      if (['email','telefono'].includes(c)) return 'contacto';
      if (['direccion','ciudad'].includes(c)) return 'direccion';
      return 'empresa';
    });
    this.gruposSeleccionados.set([...new Set(mappedGrupos)]);
    this.openModal('m-seleccionar-campos');
  }

  isCampoNuevo(campo: string): boolean {
    return this.camposNuevos.includes(campo);
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
    this.onboardingStep.set(1);
    this.navTo('v-nueva-onboarding');
  }

  private initFormDataFromMock(): void {
    const u = this.mockUser;
    this.formNucleo = {
      primerNombre: u.primerNombre, segundoNombre: u.segundoNombre,
      primerApellido: u.primerApellido, segundoApellido: u.segundoApellido,
      fechaNacimiento: u.fechaNacimiento, nacionalidad: u.nacionalidad,
      tipoPersona: u.tipoPersona, tipoDocumento: u.tipoDocumento,
      numeroDocumento: u.numeroDocumento, email: u.email, telefono: u.telefono,
      direccion: u.direccion, ciudad: u.ciudad, razonSocial: u.razonSocial,
    };
    this.formFiscal = {
      co_tipoRegimen: u.co_tipoRegimen, co_tipoResponsabilidad: u.co_tipoResponsabilidad,
      co_impuesto: u.co_impuesto, mx_codigoPostal: u.mx_codigoPostal,
      mx_regimenFiscal: u.mx_regimenFiscal, mx_sujetoImpuestos: u.mx_sujetoImpuestos,
      ar_condicionIVA: u.ar_condicionIVA, ar_provincia: u.ar_provincia,
    };
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
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
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
  // Modal: m-seleccionar-campos
  // -----------------------------------------------------------------------

  toggleGrupo(id: string): void {
    const curr = this.gruposSeleccionados();
    if (curr.includes(id)) {
      this.gruposSeleccionados.set(curr.filter(g => g !== id));
    } else {
      this.gruposSeleccionados.set([...curr, id]);
    }
  }

  isGrupoSelected(id: string): boolean {
    return this.gruposSeleccionados().includes(id);
  }

  continuarConGrupos(): void {
    if (this.gruposSeleccionados().length > 0) {
      this.otpDigits = ['', '', '', '', '', ''];
      this.otpError.set('');
      this.openModal('m-mfa');
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
    this.openModal('m-sumsub');
  }

  // -----------------------------------------------------------------------
  // Modal: m-sumsub
  // -----------------------------------------------------------------------

  avanzarSumsub(): void {
    const next = this.sumsubStep() + 1;
    if (next < this.sumsubSteps.length) {
      this.sumsubLoading.set(true);
      setTimeout(() => {
        this.sumsubLoading.set(false);
        this.sumsubStep.set(next);
        this.sumsubStepGuardado.set(next);
      }, 800);
    } else {
      this.closeModal(true);
      this.selectorEstado.set('en-revision');
      this.vistaActiva.set('v-en-revision');
      this.toast.success('Documentos enviados. Te avisaremos por correo cuando termine la revisión.', 'Verificación enviada');
    }
  }

  cerrarSumsub(): void {
    if (!this.confirmModalClose()) return;
    this.sumsubStepGuardado.set(this.sumsubStep());
    this.modalActivo.set(null);
    this.modalFocusReturn?.focus();
    this.modalFocusReturn = null;
    this.selectorEstado.set('incompleta');
    this.vistaActiva.set('v-incompleta');
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
