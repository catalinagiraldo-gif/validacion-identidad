import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type UserType = 'nuevo-sin-datos' | 'antiguo-completo' | 'antiguo-campos-nuevos' | 'cross-country';
type EstadoId =
  | 'inicial'
  | 'guardado-sin-comenzar'
  | 'incompleta'
  | 'en-revision'
  | 'aprobada'
  | 'recien-aprobada'
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
  | 'm-documento';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './flujo-identidad.component.html',
  styleUrls: ['./flujo-identidad.component.scss'],
})
export class FlujoIdentidadComponent implements OnDestroy {

  // ── Selector options ──────────────────────────────────────────────────

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
    { id: 'aprobada',             label: 'Aprobada ✓',                   color: 'success' },
    { id: 'recien-aprobada',      label: 'Recién aprobada ✓',            color: 'success' },
    { id: 'rechazada-espera',     label: 'Rechazada · espera 10 min',    color: 'error'   },
    { id: 'rechazada-reintentar', label: 'Rechazada · puede reintentar', color: 'error'   },
    { id: 'baneada',              label: 'Baneada (3 rechazos)',          color: 'error'   },
    { id: 'email-baneado',        label: 'Email baneado cross-country',  color: 'error'   },
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

  // ── Navigation state ─────────────────────────────────────────────────

  vistaActiva = signal<VistaId>('v-nueva-bloqueada');
  modalActivo = signal<ModalId | null>(null);

  // ── Demo guide ───────────────────────────────────────────────────────

  demoGuideVisible = signal(false);

  // ── Onboarding state ─────────────────────────────────────────────────

  onboardingStep = signal<1 | 2 | 3>(1);

  // ── Form step (2-step form) ───────────────────────────────────────────

  formStep = signal<1 | 2>(1);
  onboardingTipoPersona: TipoPersona = 'natural';

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
  gruposSeleccionados = signal<string[]>([]);
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

  get vistaSubtitle(): string {
    if (this.vistaActiva() === 'v-nueva-formulario') {
      return this.formStep() === 1
        ? 'Paso 1 de 2 · Datos personales y de contacto'
        : 'Paso 2 de 2 · Información tributaria';
    }
    const map: Partial<Record<VistaId, string>> = {
      'v-nueva-bloqueada':      'Completa tu verificación para acceder a todas las funciones',
      'v-nueva-onboarding':     'Paso previo — revisa lo que necesitas antes de comenzar',
      'v-validado-datos':       'Tus datos están verificados y protegidos',
      'v-validado-campos-nuevos': 'Hay campos nuevos que necesitas completar',
      'v-guardada-sin-comenzar': 'Guardaste tus datos — aún no enviaste la verificación',
      'v-incompleta':           'Dejaste el proceso a medias — puedes retomarlo ahora',
      'v-en-revision':          'Tu información está siendo validada por nuestro equipo',
      'v-rechazada':            'Hubo un problema con tu verificación',
      'v-baneada':              'Tu cuenta ha sido restringida permanentemente',
      'v-email-baneado':        'Este correo no puede ser utilizado en Dropi',
      'v-cross-country':        'Ya tienes actividad en otro país de Dropi',
      'v-exitosa':              'Tu identidad ha sido verificada exitosamente',
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

  // -----------------------------------------------------------------------
  // Selector change handlers
  // -----------------------------------------------------------------------

  toggleDemoGuide(): void { this.demoGuideVisible.update(v => !v); }

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
    this.resolveVista();
  }

  setPais(pais: PaisPersona): void {
    this.selectorPais.set(pais);
    this.modalActivo.set(null);
    this.resolveVista();
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
    if (es === 'aprobada') {
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
  navTo(v: VistaId): void       { this.vistaActiva.set(v); this.modalActivo.set(null); }
  openModal(m: ModalId): void   { this.modalActivo.set(m); }
  closeModal(): void            { this.modalActivo.set(null); }

  // -----------------------------------------------------------------------
  // v-nueva-bloqueada
  // -----------------------------------------------------------------------

  irAValidar(): void {
    this.onboardingStep.set(1);
    this.onboardingTipoPersona = this.tipoPersona;
    this.navTo('v-nueva-onboarding');
  }

  // -----------------------------------------------------------------------
  // v-nueva-onboarding
  // -----------------------------------------------------------------------

  siguienteOnboarding(): void {
    const s = this.onboardingStep();
    if (s < 3) this.onboardingStep.set((s + 1) as 1 | 2 | 3);
  }

  anteriorOnboarding(): void {
    const s = this.onboardingStep();
    if (s > 1) this.onboardingStep.set((s - 1) as 1 | 2 | 3);
  }

  comenzarValidacion(): void {
    this.initFormData();
    this.navTo('v-nueva-formulario');
  }

  // -----------------------------------------------------------------------
  // v-nueva-formulario
  // -----------------------------------------------------------------------

  private initFormData(): void {
    this.formStep.set(1);
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
    if (this.paisConFiscal) {
      this.formStep.set(2);
    } else {
      this.openModal('m-confirmacion-pre-sumsub');
    }
  }

  anteriorFormPaso(): void {
    this.formStep.set(1);
  }

  irAContinuar(): void {
    this.openModal('m-confirmacion-pre-sumsub');
  }

  continuarFormulario(): void {
    this.openModal('m-confirmacion-pre-sumsub');
  }

  // -----------------------------------------------------------------------
  // v-guardada-sin-comenzar / v-incompleta
  // -----------------------------------------------------------------------

  comenzarDesdeGuardado(): void {
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
  }

  reanudarValidacion(): void {
    this.sumsubStep.set(1);
    this.openModal('m-sumsub');
  }

  // -----------------------------------------------------------------------
  // v-validado-datos
  // -----------------------------------------------------------------------

  solicitarActualizacion(): void {
    this.gruposSeleccionados.set([]);
    this.openModal('m-seleccionar-campos');
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
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
  }

  solicitarRevision(): void {
    this.apelacionTexto = '';
    this.apelacionEnviada.set(false);
    this.openModal('m-apelacion');
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

  verificarOtp(code: string): void {
    if (code === '123456') {
      this.otpError.set('');
      this.initFormDataFromMock();
      this.closeModal();
      this.navTo('v-nueva-formulario');
    } else {
      this.otpError.set('Código incorrecto. Verifica e intenta de nuevo.');
      this.otpDigits = ['', '', '', '', '', ''];
    }
  }

  // -----------------------------------------------------------------------
  // Modal: m-confirmacion-pre-sumsub
  // -----------------------------------------------------------------------

  confirmarYValidar(): void {
    this.closeModal();
    this.sumsubStep.set(0);
    this.openModal('m-sumsub');
  }

  // -----------------------------------------------------------------------
  // Modal: m-sumsub
  // -----------------------------------------------------------------------

  avanzarSumsub(): void {
    const next = this.sumsubStep() + 1;
    if (next < this.sumsubSteps.length) {
      this.sumsubLoading.set(true);
      setTimeout(() => { this.sumsubLoading.set(false); this.sumsubStep.set(next); }, 800);
    } else {
      this.closeModal();
      this.selectorEstado.set('en-revision');
      this.vistaActiva.set('v-en-revision');
    }
  }

  cerrarSumsub(): void {
    this.closeModal();
    this.selectorEstado.set('incompleta');
    this.vistaActiva.set('v-incompleta');
  }

  // -----------------------------------------------------------------------
  // Modal: m-apelacion
  // -----------------------------------------------------------------------

  enviarApelacion(): void {
    if (this.apelacionTexto.trim()) {
      this.apelacionEnviada.set(true);
      setTimeout(() => this.closeModal(), 400);
    }
  }
}
