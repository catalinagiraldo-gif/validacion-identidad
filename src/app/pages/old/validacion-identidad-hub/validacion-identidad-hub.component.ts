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
  | 'legacy'
  | 'email_baneado';

type TipoPersona = 'natural' | 'juridica';
type Proveedor = 'truora' | 'sumsub';

interface PerfilHub {
  id: string;
  label: string;
  email: string;
  telefono: string;
  paisOrigen: string;
  paisOperacion: string;
  tipoPersona: TipoPersona;
  proveedorKYC: Proveedor;
  estadoVerificacion: EstadoVerificacion;
  intentosRestantes: number;
  minutosParaReintento?: number;
  codigoRechazo: string | null;
  rejectMensaje: string | null;
  esLegacy: boolean;
  validadoOtroPais: boolean;
  paisValidacion: string | null;
  fechaBloqueoEdicion?: string;
  camposBloqueados: string[];
  camposPrecargados: Record<string, string>;
  camposEditables?: Record<string, string>;
}

interface HubData {
  pasos: string[];
  perfiles: PerfilHub[];
}

interface VistaDatos {
  titulo: string;
  subtitulo: string;
  tagLabel: string;
  tagSeverity: 'success' | 'warning' | 'error' | 'info' | 'secondary';
  bannerSeverity?: 'success' | 'warning' | 'error' | 'info';
  bannerMensaje?: string;
  ctaPrimarioLabel?: string;
  ctaSecundarioLabel?: string;
  mostrarStepper: boolean;
  pasoActivo: number;
  mostrarCrossCountry: boolean;
  mostrarTipoSelector: boolean;
  mostrarForm: boolean;
  mostrarChecklist: boolean;
  formularioReadonly: boolean;
}

@Component({
  selector: 'app-validacion-identidad-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './validacion-identidad-hub.component.html',
  styleUrls: ['./validacion-identidad-hub.component.scss'],
})
export class ValidacionIdentidadHubComponent implements OnInit {
  pasos: string[] = [];
  perfiles: PerfilHub[] = [];

  selectedPerfilId = 'draft-co-natural';
  perfil!: PerfilHub;

  currentStep = 1;
  tipoPersonaSeleccionado: TipoPersona | null = null;
  crossCountryRespondido = false;
  crossCountryElegido: 'si' | 'no' | null = null;

  showSdkModal = false;
  sdkVerificando = false;
  sdkProgreso = 0;
  private sdkInterval: ReturnType<typeof setInterval> | null = null;

  formFields: Record<string, string> = {
    primerNombre: '',
    primerApellido: '',
    documento: '',
    fechaNacimiento: '',
    telefonoCelular: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<HubData>('/api/validacion-identidad-hub').subscribe(data => {
      this.pasos = data.pasos;
      this.perfiles = data.perfiles;
      this.setPerfil(this.selectedPerfilId);
    });
  }

  setPerfil(id: string): void {
    const p = this.perfiles.find(p => p.id === id);
    if (!p) return;
    this.perfil = { ...p };
    this.currentStep = this.getInitialStep(p.estadoVerificacion);
    this.tipoPersonaSeleccionado = null;
    this.crossCountryRespondido = false;
    this.crossCountryElegido = null;
    this.showSdkModal = false;
    this.sdkVerificando = false;
    this.sdkProgreso = 0;
    if (this.sdkInterval) clearInterval(this.sdkInterval);
    this.formFields = p.camposEditables
      ? { ...p.camposEditables }
      : { primerNombre: '', primerApellido: '', documento: '', fechaNacimiento: '', telefonoCelular: '' };
  }

  private getInitialStep(estado: EstadoVerificacion): number {
    switch (estado) {
      case 'draft': return 1;
      case 'pending_validation': return 2;
      case 'in_review': return 3;
      case 'approved': return 4;
      case 'rejected': return 3;
      case 'rejected_field': return 2;
      case 'legacy': return 1;
      case 'email_baneado': return 1;
    }
  }

  get vista(): VistaDatos {
    if (!this.perfil) return this.emptyVista();

    const estado = this.perfil.estadoVerificacion;
    const mostrarCrossCountry =
      !this.crossCountryRespondido &&
      (estado === 'draft' || estado === 'pending_validation') &&
      !this.perfil.esLegacy &&
      this.perfil.validadoOtroPais;

    switch (estado) {
      case 'draft':
        return {
          titulo: 'Verifica tu identidad para operar',
          subtitulo: 'Necesitas validar quién eres para habilitar retiros, transferencias y pagos con Dropi Card.',
          tagLabel: 'Sin verificar',
          tagSeverity: 'secondary',
          ctaPrimarioLabel: 'Continuar',
          mostrarStepper: true,
          pasoActivo: 1,
          mostrarCrossCountry,
          mostrarTipoSelector: true,
          mostrarForm: false,
          mostrarChecklist: false,
          formularioReadonly: false,
        };

      case 'pending_validation':
        return {
          titulo: 'Completa tu información',
          subtitulo: this.currentStep === 2
            ? 'Ingresa tus datos personales antes de iniciar la verificación.'
            : 'Ten tu documento a mano. La verificación toma cerca de 10 minutos.',
          tagLabel: 'En progreso',
          tagSeverity: 'warning',
          ctaPrimarioLabel: this.currentStep === 2 ? 'Continuar' : 'Lanzar verificación',
          ctaSecundarioLabel: 'Guardar y continuar después',
          mostrarStepper: true,
          pasoActivo: this.currentStep,
          mostrarCrossCountry,
          mostrarTipoSelector: false,
          mostrarForm: this.currentStep === 2,
          mostrarChecklist: this.currentStep === 3,
          formularioReadonly: false,
        };

      case 'in_review':
        return {
          titulo: 'Estamos revisando tu información',
          subtitulo: 'Este proceso puede tardar entre 24 y 72 horas hábiles.',
          tagLabel: 'En revisión',
          tagSeverity: 'info',
          bannerSeverity: 'info',
          bannerMensaje: 'Recibimos tu solicitud. Te avisaremos por email cuando tengamos novedades. No necesitas hacer nada más por ahora.',
          mostrarStepper: true,
          pasoActivo: 4,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: false,
          mostrarChecklist: false,
          formularioReadonly: true,
        };

      case 'approved':
        return {
          titulo: '¡Tu identidad está verificada!',
          subtitulo: 'Ya tienes acceso completo a retiros, transferencias y Dropi Card.',
          tagLabel: 'Verificado',
          tagSeverity: 'success',
          bannerSeverity: 'success',
          bannerMensaje: `Tus datos validados no se podrán editar por 6 meses. Cualquier cambio de información requerirá nueva verificación.`,
          mostrarStepper: false,
          pasoActivo: 4,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: false,
          mostrarChecklist: false,
          formularioReadonly: true,
        };

      case 'rejected':
        return {
          titulo: 'No pudimos verificar tu identidad',
          subtitulo: this.perfil.rejectMensaje || 'Hubo un problema con tu documento o foto.',
          tagLabel: 'Rechazado',
          tagSeverity: 'error',
          bannerSeverity: 'error',
          bannerMensaje: this.perfil.rejectMensaje || 'Revisa los detalles y vuelve a intentarlo.',
          ctaPrimarioLabel: this.perfil.intentosRestantes > 0
            ? `Reintentar (${this.perfil.intentosRestantes} ${this.perfil.intentosRestantes === 1 ? 'intento' : 'intentos'} restantes)`
            : undefined,
          ctaSecundarioLabel: 'Contactar soporte',
          mostrarStepper: true,
          pasoActivo: 3,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: false,
          mostrarChecklist: false,
          formularioReadonly: false,
        };

      case 'rejected_field':
        return {
          titulo: 'Corrige un campo para continuar',
          subtitulo: 'Un campo específico no pasó la validación. Corrígelo y vuelve a enviar.',
          tagLabel: 'Corrección requerida',
          tagSeverity: 'error',
          bannerSeverity: 'error',
          bannerMensaje: this.perfil.rejectMensaje || 'Revisa el campo indicado.',
          ctaPrimarioLabel: 'Guardar y reenviar',
          mostrarStepper: true,
          pasoActivo: 2,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: true,
          mostrarChecklist: false,
          formularioReadonly: false,
        };

      case 'legacy':
        return {
          titulo: 'Completa tu verificación de identidad',
          subtitulo: 'Eres un usuario activo. Verifica tu identidad para seguir operando sin interrupciones.',
          tagLabel: 'Pendiente',
          tagSeverity: 'warning',
          ctaPrimarioLabel: 'Iniciar verificación',
          mostrarStepper: true,
          pasoActivo: 1,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: true,
          mostrarChecklist: false,
          formularioReadonly: false,
        };

      case 'email_baneado':
        return {
          titulo: 'Esta cuenta no puede operar',
          subtitulo: 'El email asociado tiene restricciones de seguridad activas.',
          tagLabel: 'Bloqueado',
          tagSeverity: 'error',
          bannerSeverity: 'error',
          bannerMensaje: 'Tu email está marcado con restricciones. Contacta a soporte para revisar tu caso.',
          ctaSecundarioLabel: 'Contactar soporte',
          mostrarStepper: false,
          pasoActivo: 1,
          mostrarCrossCountry: false,
          mostrarTipoSelector: false,
          mostrarForm: false,
          mostrarChecklist: false,
          formularioReadonly: false,
        };
    }
  }

  private emptyVista(): VistaDatos {
    return {
      titulo: '', subtitulo: '', tagLabel: '', tagSeverity: 'secondary',
      mostrarStepper: false, pasoActivo: 1, mostrarCrossCountry: false,
      mostrarTipoSelector: false, mostrarForm: false, mostrarChecklist: false,
      formularioReadonly: false,
    };
  }

  getStepState(stepNum: number): 'pending' | 'focus' | 'completed' | 'error' {
    const estado = this.perfil?.estadoVerificacion;
    const pasoActivo = this.vista.pasoActivo;
    if (estado === 'rejected' && stepNum === 3) return 'error';
    if (estado === 'rejected_field' && stepNum === 3) return 'error';
    if (estado === 'approved') return 'completed';
    if (estado === 'in_review' && stepNum < 4) return 'completed';
    if (stepNum < pasoActivo) return 'completed';
    if (stepNum === pasoActivo) return 'focus';
    return 'pending';
  }

  getPaisEmoji(pais: string): string {
    const flags: Record<string, string> = {
      CO: '🇨🇴', MX: '🇲🇽', AR: '🇦🇷', CL: '🇨🇱', EC: '🇪🇨', PE: '🇵🇪', BR: '🇧🇷',
    };
    return flags[pais] ?? '🌎';
  }

  getProveedorLabel(proveedor: Proveedor): string {
    return proveedor === 'truora' ? 'Truora' : 'Sumsub';
  }

  getFieldPairs(campos: Record<string, string>): Array<{ label: string; value: string }> {
    const labels: Record<string, string> = {
      primerNombre: 'Primer nombre',
      primerApellido: 'Primer apellido',
      documento: 'Documento',
      tipoDocumento: 'Tipo de documento',
      fechaNacimiento: 'Fecha de nacimiento',
      emailContacto: 'Email',
      telefonoCelular: 'Celular',
      ciudad: 'Ciudad',
      region: 'Región',
      provincia: 'Provincia',
      razonSocial: 'Razón social',
      cuit: 'CUIT',
    };
    return Object.entries(campos)
      .filter(([, v]) => v)
      .map(([k, v]) => ({ label: labels[k] ?? k, value: v }));
  }

  isEmptyObject(obj: Record<string, string>): boolean {
    return Object.keys(obj).length === 0;
  }

  onSeleccionarTipoPersona(tipo: TipoPersona): void {
    this.tipoPersonaSeleccionado = tipo;
    this.perfil.tipoPersona = tipo;
  }

  onCrossCountryChoice(choice: 'si' | 'no'): void {
    this.crossCountryElegido = choice;
    this.crossCountryRespondido = true;
    if (choice === 'si') {
      this.perfil.estadoVerificacion = 'approved';
    }
  }

  onCtaPrimario(): void {
    const estado = this.perfil.estadoVerificacion;

    if (estado === 'draft') {
      if (!this.tipoPersonaSeleccionado) return;
      this.perfil.estadoVerificacion = 'pending_validation';
      this.currentStep = 2;
      return;
    }

    if (estado === 'pending_validation') {
      if (this.currentStep === 2) {
        this.currentStep = 3;
      } else if (this.currentStep === 3) {
        this.launchSdk();
      }
      return;
    }

    if (estado === 'rejected' && this.perfil.intentosRestantes > 0) {
      this.launchSdk();
      return;
    }

    if (estado === 'rejected_field') {
      this.perfil.estadoVerificacion = 'in_review';
      this.currentStep = 4;
      return;
    }

    if (estado === 'legacy') {
      this.perfil.estadoVerificacion = 'pending_validation';
      this.currentStep = 2;
    }
  }

  onCtaSecundario(): void {
    // "Guardar y continuar después" — no-op in prototype
  }

  launchSdk(): void {
    this.showSdkModal = true;
    this.sdkVerificando = false;
    this.sdkProgreso = 0;
  }

  onSdkStart(): void {
    this.sdkVerificando = true;
    this.sdkProgreso = 0;
    this.sdkInterval = setInterval(() => {
      this.sdkProgreso += 20;
      if (this.sdkProgreso >= 100) {
        clearInterval(this.sdkInterval!);
        this.sdkInterval = null;
        setTimeout(() => {
          this.showSdkModal = false;
          this.sdkVerificando = false;
          this.sdkProgreso = 0;
          this.perfil.estadoVerificacion = 'in_review';
          this.currentStep = 4;
          if (this.perfil.intentosRestantes > 0) {
            this.perfil.intentosRestantes--;
          }
        }, 600);
      }
    }, 500);
  }

  closeSdkModal(): void {
    if (this.sdkInterval) {
      clearInterval(this.sdkInterval);
      this.sdkInterval = null;
    }
    this.showSdkModal = false;
    this.sdkVerificando = false;
    this.sdkProgreso = 0;
  }
}
