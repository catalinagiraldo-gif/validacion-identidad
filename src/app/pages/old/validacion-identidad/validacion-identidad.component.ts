import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
type JourneyPhase = 'wizard' | 'summary' | 'readonly';
type ModalStep = 'document' | 'capture' | 'selfie' | 'verifying' | 'kyb-empresa' | 'kyb-docs' | 'kyb-rep';
type MfaPurpose = 'cross_country';

interface PerfilVerificacion {
  id: string;
  label: string;
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
  fechaBloqueoEdicion: string | null;
  camposBloqueados: string[];
  camposPrecargados: Record<string, string>;
  camposTributariosPorPais: Record<string, string>;
}

interface AlertConfig {
  severity: 'warning' | 'error' | 'info' | 'success';
  message: string;
  boldSegment?: string;
  link?: string;
  cta?: string;
  ctaAction?: () => void;
  ctaDisabled?: boolean;
}

interface StepItem {
  label: string;
  state: 'pending' | 'focus' | 'completed' | 'error';
}

interface ValidacionIdentidadData {
  perfiles: PerfilVerificacion[];
  rejectLabels: Record<string, string>;
  checklistCompleto: string[];
  camposPorPais: Record<string, string[]>;
  camposGeoPorPais: Record<string, string[]>;
  geoLabels: Record<string, string>;
}

@Component({
  selector: 'app-validacion-identidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validacion-identidad.component.html',
  styleUrls: ['./validacion-identidad.component.scss'],
})
export class ValidacionIdentidadComponent implements OnInit {
  perfiles: PerfilVerificacion[] = [];
  rejectLabels: Record<string, string> = {};
  checklistCompleto: string[] = [];
  camposPorPais: Record<string, string[]> = {};
  camposGeoPorPais: Record<string, string[]> = {};
  geoLabels: Record<string, string> = {};

  selectedPerfilId = 'co-truora-natural-draft';
  perfil!: PerfilVerificacion;

  currentStep = 1;
  journeyPhase: JourneyPhase = 'wizard';
  acknowledgedSummary = false;
  tipoPersonaSeleccionado: TipoPersona | null = null;
  aceptaTyC = false;
  checklistExpanded = false;
  crossCountryValidated = false;
  crossCountryChoice: 'si' | 'no' | null = null;
  sessionInterrupted = false;
  simulateTimeout = false;

  showSdkModal = false;
  showMfaModal = false;
  mfaPurpose: MfaPurpose = 'cross_country';
  mfaCode = '';
  sdkDemoExpanded = false;
  modalStep: ModalStep = 'document';
  modalProvider: Proveedor = 'sumsub';

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  formData: Record<string, string> = {};
  modalCancelled = false;

  readonly paises = [
    { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  ];

  readonly estados: EstadoVerificacion[] = [
    'draft',
    'pending_validation',
    'in_review',
    'approved',
    'rejected',
    'rejected_field',
    'email_baneado',
    'legacy',
  ];

  readonly checklistVisible = [
    { icon: 'document', text: 'Documento original a mano (no capturas ni fotocopias)' },
    { icon: 'camera', text: 'Dispositivo con cámara y buena iluminación' },
    { icon: 'lock', text: 'Datos validados no se podrán editar por 6 meses (facturación con estos datos)' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<ValidacionIdentidadData>('/api/validacion-identidad').subscribe((data) => {
      this.perfiles = data.perfiles;
      this.rejectLabels = data.rejectLabels;
      this.checklistCompleto = data.checklistCompleto;
      this.camposPorPais = data.camposPorPais;
      this.camposGeoPorPais = data.camposGeoPorPais ?? {};
      this.geoLabels = data.geoLabels ?? {};
      this.loadPerfil(this.selectedPerfilId);
    });
  }

  // ── Demo controls ──────────────────────────────────────────────

  onPerfilChange(id: string): void {
    this.loadPerfil(id);
  }

  onPaisChange(code: string): void {
    this.perfil.paisOperacion = code;
    this.perfil.proveedorKYC = code === 'CO' ? 'truora' : 'sumsub';
    this.resetWizard();
  }

  onTipoPersonaDemoChange(tipo: TipoPersona): void {
    this.perfil.tipoPersona = tipo;
    this.tipoPersonaSeleccionado = tipo;
    this.resetWizard();
  }

  onEstadoDemoChange(estado: EstadoVerificacion): void {
    this.perfil.estadoVerificacion = estado;
    this.perfil.esLegacy = estado === 'legacy';
    this.applyEstadoDefaults(estado);
  }

  toggleCrossCountry(): void {
    this.crossCountryValidated = !this.crossCountryValidated;
    if (this.crossCountryValidated) {
      this.crossCountryChoice = null;
      this.currentStep = 1;
    }
  }

  toggleSimulateTimeout(): void {
    this.simulateTimeout = !this.simulateTimeout;
    if (this.simulateTimeout) {
      this.perfil.estadoVerificacion = 'pending_validation';
      this.sessionInterrupted = true;
      this.currentStep = 3;
    } else {
      this.sessionInterrupted = false;
    }
  }

  // ── Flow helpers ───────────────────────────────────────────────

  get isEmailBaneado(): boolean {
    return this.perfil?.estadoVerificacion === 'email_baneado';
  }

  get isApproved(): boolean {
    return this.perfil?.estadoVerificacion === 'approved' && this.journeyPhase === 'readonly';
  }

  get showWizard(): boolean {
    return !this.isEmailBaneado && !this.isApproved;
  }

  get showReadonlyView(): boolean {
    return this.isApproved;
  }

  get showPartialSummary(): boolean {
    return this.perfil?.estadoVerificacion === 'in_review' && Object.keys(this.formData).length > 0;
  }

  get showLegacyBanner(): boolean {
    return this.perfil?.esLegacy || this.perfil?.estadoVerificacion === 'legacy';
  }

  get showVerificationCenter(): boolean {
    return ['draft', 'pending_validation', 'in_review', 'rejected', 'rejected_field', 'legacy'].includes(
      this.perfil?.estadoVerificacion,
    );
  }

  get hideVerificationCta(): boolean {
    return this.perfil?.estadoVerificacion === 'in_review';
  }

  get isSummaryStep(): boolean {
    return this.currentStep === 4 && this.journeyPhase === 'summary';
  }

  get headerBadgeText(): string {
    switch (this.perfil?.estadoVerificacion) {
      case 'draft':
      case 'pending_validation':
      case 'legacy':
        return 'Sin verificar';
      case 'in_review':
        return 'En revisión';
      case 'approved':
        return 'Verificado';
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
      case 'in_review':
        return 'info';
      case 'approved':
        return 'success';
      case 'rejected':
      case 'rejected_field':
      case 'email_baneado':
        return 'error';
      default:
        return 'warning';
    }
  }

  get stepLabels(): string[] {
    return ['Tipo de cuenta', 'Preparación', 'Verificación de identidad', 'Datos verificados'];
  }

  get steps(): StepItem[] {
    return this.stepLabels.map((label, i) => {
      const stepNum = i + 1;
      let state: StepItem['state'] = 'pending';
      if (this.journeyPhase === 'summary' && stepNum <= 4) {
        state = stepNum < 4 ? 'completed' : 'focus';
      } else if (stepNum < this.currentStep) {
        state = 'completed';
      } else if (stepNum === this.currentStep) {
        state = 'focus';
      }
      return { label, state };
    });
  }

  get alert(): AlertConfig | null {
    const e = this.perfil?.estadoVerificacion;
    if (!e) return null;

    if (this.modalCancelled && this.currentStep === 3) {
      return {
        severity: 'warning',
        message: 'Puedes continuar después.',
        cta: 'Reanudar validación',
        ctaAction: () => this.abrirModalSdk(),
      };
    }

    if (this.sessionInterrupted || (this.simulateTimeout && e === 'pending_validation')) {
      if (this.currentStep !== 3) return null;
      return {
        severity: 'warning',
        message: 'No terminaste tu validación. Puedes retomarla ahora.',
        cta: 'Reanudar validación',
        ctaAction: () => this.abrirModalSdk(),
      };
    }

    if (this.currentStep === 4 && this.journeyPhase === 'summary') {
      return {
        severity: 'warning',
        message:
          'Revisa tus datos. Tras confirmar, no podrás cambiarlos por 6 meses. ¿Dudas?',
        link: 'Escríbenos a soporte.',
      };
    }

    switch (e) {
      case 'draft':
      case 'legacy':
        if (this.currentStep === 1) {
          return {
            severity: 'warning',
            message: 'Verificación de identidad pendiente. Completa los pasos para habilitar retiros y transferencias.',
          };
        }
        return null;
      case 'pending_validation':
        if (this.currentStep === 3) {
          return {
            severity: 'warning',
            message: 'Verificación de identidad pendiente. Usa el botón de la tarjeta para continuar.',
          };
        }
        return null;
      case 'in_review':
        return {
          severity: 'info',
          message:
            'Tu verificación está en revisión manual. Tiempo estimado: 24–48 horas hábiles. Si tienes dudas escribe a soporte.',
          link: 'Escribir a Soporte',
        };
      case 'approved':
        return {
          severity: 'success',
          message:
            'Tus datos han sido verificados exitosamente. No podrás modificarlos hasta dentro de 6 meses.',
        };
      case 'rejected':
        if (this.currentStep !== 3) return null;
        return {
          severity: 'error',
          message: `${this.rejectMessage} Si necesitas ayuda, contacta a soporte con el código [${this.perfil.codigoRechazo}].`,
        };
      case 'rejected_field':
        if (this.currentStep !== 3) return null;
        return {
          severity: 'error',
          message: this.rejectMessage,
        };
      default:
        return null;
    }
  }

  get rejectMessage(): string {
    if (this.perfil?.rejectLabel && this.rejectLabels[this.perfil.rejectLabel]) {
      return this.rejectLabels[this.perfil.rejectLabel];
    }
    return 'La validación no fue exitosa.';
  }

  get verificationCtaText(): string {
    if (this.perfil?.estadoVerificacion === 'rejected' || this.perfil?.estadoVerificacion === 'rejected_field') {
      return 'Reintentar validación';
    }
    if (this.sessionInterrupted || this.perfil?.estadoVerificacion === 'pending_validation') {
      return 'Reanudar validación';
    }
    return 'Comenzar validación';
  }

  get canRetry(): boolean {
    return this.perfil.intentosRestantes > 0 && this.perfil.minutosParaReintento === 0;
  }

  get retryHint(): string | null {
    if (this.perfil.intentosRestantes <= 0) {
      return 'Agotaste los 3 intentos. Contacta a soporte para continuar.';
    }
    const intento = 4 - this.perfil.intentosRestantes;
    if (this.perfil.minutosParaReintento > 0) {
      return `Intento ${intento} de 3. Podrás reintentar en ${this.perfil.minutosParaReintento} minutos.`;
    }
    if (this.perfil.intentosRestantes < 3) {
      return `Intento ${intento} de 3. Podrás reintentar en 10 minutos.`;
    }
    return null;
  }

  get step1Complete(): boolean {
    return !!this.tipoPersonaSeleccionado && (!this.crossCountryValidated || !!this.crossCountryChoice);
  }

  get step2Enabled(): boolean {
    return this.step1Complete && this.aceptaTyC;
  }

  get isJuridica(): boolean {
    return this.tipoPersonaSeleccionado === 'juridica' || this.perfil?.tipoPersona === 'juridica';
  }

  get activeProvider(): Proveedor {
    if (this.isJuridica) return 'sumsub';
    return this.perfil.paisOperacion === 'CO' ? 'truora' : 'sumsub';
  }

  get providerLabel(): string {
    return this.activeProvider === 'truora' ? 'Truora' : 'Sumsub';
  }

  get showTributaria(): boolean {
    const pais = this.perfil?.paisOperacion;
    return !!pais && !!this.camposPorPais[pais]?.length;
  }

  get geoFields(): { key: string; label: string; value: string }[] {
    const pais = this.perfil.paisOperacion;
    const keys = this.camposGeoPorPais[pais] || [];
    return keys.map((key) => ({
      key,
      label: this.geoLabels[key] || key,
      value: this.formData[key] || '',
    }));
  }

  get tributariaFields(): { key: string; label: string; value: string }[] {
    const pais = this.perfil.paisOperacion;
    const keys = this.camposPorPais[pais] || [];
    const labels: Record<string, string> = {
      regimen: 'Tipo de régimen',
      responsabilidad: 'Tipo de responsabilidad',
      impuesto: 'Impuesto',
      regimenFiscal: 'Régimen fiscal',
      rfc: 'RFC',
      condicionIVA: 'Condición frente al IVA',
      cuit: 'CUIT',
      rut: 'RUT',
      giro: 'Giro comercial',
      ruc: 'RUC',
      tipoContribuyente: 'Tipo de contribuyente',
    };
    return keys.map((key) => ({
      key,
      label: labels[key] || key,
      value: this.formData[key] || this.perfil.camposTributariosPorPais[key] || '',
    }));
  }

  get tributariaFieldRows(): { key: string; label: string; value: string }[][] {
    const rows: { key: string; label: string; value: string }[][] = [];
    const fields = this.tributariaFields;
    for (let i = 0; i < fields.length; i += 2) {
      rows.push(fields.slice(i, i + 2));
    }
    return rows;
  }

  get verificadoBadge(): string {
    const provider = this.perfil.paisOperacion === 'CO' && !this.isJuridica ? 'Truora' : 'Sumsub';
    return `Verificado por ${provider}`;
  }

  get paisNombre(): string {
    return this.paises.find((p) => p.code === this.perfil?.paisOperacion)?.name || this.perfil?.paisOperacion;
  }

  get mfaModalTitle(): string {
    return this.mfaPurpose === 'cross_country'
      ? 'Confirma tu identidad para reutilizar datos'
      : 'Verificación de seguridad';
  }

  get sdkProgress(): string {
    const flow = this.getModalFlow();
    const idx = flow.indexOf(this.modalStep);
    return `${idx + 1} / ${flow.length}`;
  }

  // ── Wizard navigation ──────────────────────────────────────────

  selectTipoPersona(tipo: TipoPersona): void {
    this.tipoPersonaSeleccionado = tipo;
    this.perfil.tipoPersona = tipo;
  }

  continuarPaso1(): void {
    if (!this.step1Complete) return;
    if (this.crossCountryChoice === 'si') {
      this.mfaPurpose = 'cross_country';
      this.showMfaModal = true;
      document.body.style.overflow = 'hidden';
      return;
    }
    this.currentStep = 2;
  }

  selectCrossCountry(choice: 'si' | 'no'): void {
    this.crossCountryChoice = choice;
    if (choice === 'no') {
      this.tipoPersonaSeleccionado = null;
    }
  }

  continuarPreparacion(): void {
    if (this.step2Enabled) {
      this.currentStep = 3;
    }
  }

  irAPaso(paso: number): void {
    if (paso <= this.currentStep && this.journeyPhase === 'wizard') {
      this.currentStep = paso;
    }
  }

  confirmarResumen(): void {
    this.perfil.estadoVerificacion = 'approved';
    this.journeyPhase = 'readonly';
    this.acknowledgedSummary = true;
    this.perfil.fechaBloqueoEdicion = this.perfil.fechaBloqueoEdicion || this.addMonths(new Date(), 6);
    this.perfil.camposBloqueados = Object.keys(this.formData);
    this.toast('Validación exitosa');
  }

  // ── MFA Modal ──────────────────────────────────────────────────

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
    this.showMfaModal = false;
    this.mfaCode = '';
    document.body.style.overflow = '';

    this.precargarCrossCountry();
    this.currentStep = 4;
    this.journeyPhase = 'summary';
    this.toast('Datos precargados desde tu cuenta en otro país.', 'info');
  }

  // ── SDK Modal ──────────────────────────────────────────────────

  abrirModalSdk(): void {
    if (this.hideVerificationCta && !this.sessionInterrupted && !this.modalCancelled) return;
    if (!this.canRetry && (this.perfil.estadoVerificacion === 'rejected' || this.perfil.estadoVerificacion === 'rejected_field')) return;

    this.modalCancelled = false;
    this.modalProvider = this.activeProvider;
    this.showSdkModal = true;
    this.modalStep = this.isJuridica ? 'kyb-empresa' : 'document';
    document.body.style.overflow = 'hidden';
  }

  cerrarModalSdk(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    if (['draft', 'legacy'].includes(this.perfil.estadoVerificacion)) {
      this.perfil.estadoVerificacion = 'pending_validation';
    }
    this.modalCancelled = true;
    this.currentStep = 3;
  }

  avanzarModal(): void {
    const flow = this.getModalFlow();
    const idx = flow.indexOf(this.modalStep);
    if (idx < flow.length - 1) {
      this.modalStep = flow[idx + 1];
    }
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
    this.currentStep = 3;
    this.journeyPhase = 'wizard';
    this.toast('Validación rechazada', 'error');
  }

  simularRevisionManual(): void {
    this.showSdkModal = false;
    document.body.style.overflow = '';
    this.precargarCamposVerificados();
    this.perfil.estadoVerificacion = 'in_review';
    this.currentStep = 4;
    this.journeyPhase = 'wizard';
    this.toast('Tu verificación fue enviada a revisión manual', 'info');
  }

  simularCancelar(): void {
    this.cerrarModalSdk();
  }

  contactarSoporte(): void {
    this.toast('Abriendo chat de soporte (mock Intercom)…', 'info');
  }

  // ── Private helpers ────────────────────────────────────────────

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
    this.modalCancelled = false;
    this.precargarCamposVerificados();
    this.perfil.documentoObtenidoAPI = true;
    this.currentStep = 4;
    this.journeyPhase = 'summary';
    this.toast('Verificación completada. Revisa tus datos.');
  }

  private precargarCamposVerificados(): void {
    const isJur = this.isJuridica;
    const pais = this.perfil.paisOperacion;

    if (isJur) {
      this.formData = {
        razonSocial: 'Comercial ' + this.paisNombre + ' S.A.S.',
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
        ...this.perfil.camposPrecargados,
      };
    } else {
      this.formData = {
        primerNombre: 'Usuario',
        segundoNombre: '',
        primerApellido: 'Verificado',
        segundoApellido: '',
        fechaNacimiento: '01/01/1990',
        nacionalidad: this.paisNombre,
        tipoDocIdentidad: pais === 'CO' ? 'Cédula de ciudadanía' : pais === 'MX' ? 'INE' : 'DNI',
        documento: pais === 'CO' ? '1098765432' : '1234567890',
        emailContacto: this.perfil.email,
        telefonoCelular: this.perfil.telefono,
        direccionPersonal: 'Dirección verificada por ' + this.providerLabel,
        emailFacturacion: this.perfil.email,
        nombreRazonSocial: 'Usuario Verificado',
        tipoPersona: 'Persona natural',
        tipoDocEmpresa: pais === 'CO' ? 'Cédula de ciudadanía' : pais === 'MX' ? 'INE' : 'DNI',
        numeroDocEmpresa: pais === 'CO' ? '1098765432' : '1234567890',
        ...this.perfil.camposPrecargados,
      };
    }

    const geoKeys = this.camposGeoPorPais[pais] || [];
    geoKeys.forEach((key) => {
      if (!this.formData[key]) {
        const defaults: Record<string, string> = {
          municipio: 'Bogotá D.C.',
          region: 'Metropolitana',
          comuna: 'Providencia',
          ciudad: 'Ciudad de México',
          codigoPostal: '06600',
          provincia: 'Buenos Aires',
          ciudadLocalidad: 'CABA',
        };
        this.formData[key] = defaults[key] || '';
      }
    });

    if (pais === 'CO') {
      this.formData['regimen'] = 'Régimen común';
      this.formData['responsabilidad'] = 'Responsable de IVA';
      this.formData['impuesto'] = 'IVA';
    } else if (pais === 'MX') {
      this.formData['regimenFiscal'] = 'Régimen de Sueldos y Salarios';
      this.formData['rfc'] = 'XAXX010101000';
    } else if (pais === 'AR') {
      this.formData['condicionIVA'] = 'Consumidor Final';
      this.formData['cuit'] = '20-12345678-9';
    } else if (pais === 'CL') {
      this.formData['rut'] = '12.345.678-9';
      this.formData['giro'] = 'Comercio al por menor';
    } else if (pais === 'EC') {
      this.formData['ruc'] = '1791234567001';
      this.formData['tipoContribuyente'] = 'Persona natural';
    }
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
    };
    this.perfil.documentoObtenidoAPI = true;
    this.journeyPhase = 'summary';
  }

  private loadPerfil(id: string): void {
    const found = this.perfiles.find((p) => p.id === id);
    if (!found) return;
    this.perfil = { ...found, camposPrecargados: { ...found.camposPrecargados } };
    this.selectedPerfilId = id;
    this.tipoPersonaSeleccionado = found.tipoPersona;
    this.aceptaTyC = false;
    this.checklistExpanded = false;
    this.sessionInterrupted = false;
    this.simulateTimeout = false;
    this.crossCountryChoice = null;
    this.showSdkModal = false;
    this.showMfaModal = false;
    this.modalCancelled = false;
    this.acknowledgedSummary = false;

    if (found.estadoVerificacion === 'approved') {
      this.formData = { ...found.camposPrecargados };
      this.journeyPhase = 'readonly';
      this.currentStep = 4;
    } else if (found.estadoVerificacion === 'email_baneado') {
      this.journeyPhase = 'wizard';
      this.currentStep = 1;
      this.formData = {};
    } else if (found.estadoVerificacion === 'in_review' && Object.keys(found.camposPrecargados).length > 0) {
      this.formData = { ...found.camposPrecargados };
      this.currentStep = 4;
      this.journeyPhase = 'wizard';
      this.aceptaTyC = true;
    } else {
      this.resetWizard();
      if (['pending_validation', 'rejected', 'rejected_field'].includes(found.estadoVerificacion)) {
        this.currentStep = 3;
        this.aceptaTyC = true;
      }
    }

  }

  private resetWizard(): void {
    this.currentStep = 1;
    this.journeyPhase = 'wizard';
    this.aceptaTyC = false;
    this.formData = {};
    if (this.perfil) {
      this.tipoPersonaSeleccionado = this.perfil.tipoPersona;
    }
  }

  private applyEstadoDefaults(estado: EstadoVerificacion): void {
    this.acknowledgedSummary = false;
    if (estado === 'approved') {
      this.precargarCamposVerificados();
      if (Object.keys(this.perfil.camposPrecargados).length > 0) {
        this.formData = { ...this.perfil.camposPrecargados };
      }
      this.journeyPhase = 'readonly';
      this.currentStep = 4;
    } else if (estado === 'email_baneado') {
      this.journeyPhase = 'wizard';
      this.currentStep = 1;
      this.formData = {};
    } else if (estado === 'in_review') {
      if (Object.keys(this.perfil.camposPrecargados).length > 0) {
        this.formData = { ...this.perfil.camposPrecargados };
        this.currentStep = 4;
      } else {
        this.currentStep = 3;
      }
      this.journeyPhase = 'wizard';
      this.aceptaTyC = true;
    } else if (['pending_validation', 'rejected', 'rejected_field'].includes(estado)) {
      this.currentStep = 3;
      this.journeyPhase = 'wizard';
      this.aceptaTyC = true;
    } else {
      this.resetWizard();
    }
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
}
