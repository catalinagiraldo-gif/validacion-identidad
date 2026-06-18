import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

type VistaId =
  | 'v1-entrada'
  | 'v2-datos'
  | 'v3-solicitud-modal'
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

type EstadoValidacion = 'sin_iniciar' | 'pendiente' | 'rechazado' | 'baneado' | 'validado' | 'incompleta';
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
export class FlujoIdentidadComponent {

  // --- Demo switcher ---
  readonly perfiles: MockPerfil[] = [
    { id: 'p1', label: 'Sin iniciar — CO Natural',    estado: 'sin_iniciar', tipo_persona: 'natural',   pais: 'CO', nombre: 'Laura Martínez',    documento: '1.023.456.789' },
    { id: 'p2', label: 'Pendiente — MX Jurídica',     estado: 'pendiente',   tipo_persona: 'juridica',  pais: 'MX', nombre: 'Inversiones XYZ',   documento: 'ABC200501XY3' },
    { id: 'p3', label: 'Rechazado — AR Natural',      estado: 'rechazado',   tipo_persona: 'natural',   pais: 'AR', nombre: 'Nicolás Fernández', documento: '32.456.789' },
    { id: 'p4', label: 'Baneado — CL Natural',        estado: 'baneado',     tipo_persona: 'natural',   pais: 'CL', nombre: 'Javiera Pino',      documento: '18.234.567-K' },
    { id: 'p5', label: 'Validado — CO Jurídica',      estado: 'validado',    tipo_persona: 'juridica',  pais: 'CO', nombre: 'TechStore SAS',     documento: '900.123.456-1' },
    { id: 'p6', label: 'Incompleta — EC Natural',     estado: 'incompleta',  tipo_persona: 'natural',   pais: 'EC', nombre: 'Andrés Vega',       documento: '1705345678' },
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
  sumsubSteps = ['Seleccionar documento', 'Captura frontal', 'Captura trasera', 'Selfie / Verificación'];
  sumsubLoading = signal<boolean>(false);

  // --- Rechazo mock ---
  motivoRechazo = 'La foto de tu documento no se ve con suficiente claridad. Asegúrate de que el documento esté bien iluminado y sin reflejos.';
  intentosRestantes = signal<number>(2);

  // --- Campo selección para actualización ---
  gruposSeleccionados = signal<string[]>([]);
  gruposActualizacion = [
    { id: 'contacto', label: 'Datos de contacto', desc: 'Teléfono, email de contacto' },
    { id: 'direccion', label: 'Dirección', desc: 'Dirección, ciudad, municipio' },
    { id: 'documento', label: 'Documento de identidad', desc: 'Tipo y número de documento' },
    { id: 'fiscal',   label: 'Datos fiscales',     desc: 'Régimen, responsabilidad tributaria' },
    { id: 'empresa',  label: 'Datos de empresa',   desc: 'Razón social, tipo de empresa (solo jurídica)' },
    { id: 'facturacion', label: 'Email de facturación', desc: 'Email usado para facturas electrónicas' },
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
    return {
      sin_iniciar: 'badge--neutral',
      pendiente:   'badge--warning',
      rechazado:   'badge--error',
      baneado:     'badge--error',
      validado:    'badge--success',
      incompleta:  'badge--warning',
    }[e] ?? 'badge--neutral';
  });

  readonly estadoLabel = computed<string>(() => {
    const map: Record<EstadoValidacion, string> = {
      sin_iniciar: 'Sin iniciar',
      pendiente:   'En revisión',
      rechazado:   'Rechazado',
      baneado:     'Cuenta restringida',
      validado:    'Identidad validada',
      incompleta:  'Validación incompleta',
    };
    return map[this.perfilActivo().estado];
  });

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
    const routes: Record<EstadoValidacion, VistaId> = {
      sin_iniciar: 'v1-entrada',
      pendiente:   'v9-pendiente',
      rechazado:   'v10-rechazado',
      baneado:     'v11-baneado',
      validado:    'v2-datos',
      incompleta:  'v13-incompleta',
    };
    this.navTo(routes[p.estado]);
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
    this.gruposSeleccionados.set([]);
    this.openModal('v3-solicitud-modal');
  }

  // -----------------------------------------------------------------------
  // Vista 3 — Solicitud de actualización
  // -----------------------------------------------------------------------

  toggleGrupo(id: string): void {
    const current = this.gruposSeleccionados();
    if (current.includes(id)) {
      this.gruposSeleccionados.set(current.filter(g => g !== id));
    } else {
      this.gruposSeleccionados.set([...current, id]);
    }
  }

  isGrupoSelected(id: string): boolean {
    return this.gruposSeleccionados().includes(id);
  }

  continuarActualizacion(): void {
    if (this.gruposSeleccionados().length > 0) {
      this.openModal('v4-mfa-modal');
    }
  }

  // -----------------------------------------------------------------------
  // Vista 4 — MFA
  // -----------------------------------------------------------------------

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
      this.closeModal();
      this.navTo('v5-formulario-nucleo');
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

  revisarAntesDeEnviar(): void {
    this.openModal('v7-confirmacion-modal');
  }

  // -----------------------------------------------------------------------
  // Vista 7 — Confirmación
  // -----------------------------------------------------------------------

  confirmarYValidar(): void {
    this.closeModal();
    this.sumsubStep.set(0);
    this.openModal('v8-sumsub-modal');
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
