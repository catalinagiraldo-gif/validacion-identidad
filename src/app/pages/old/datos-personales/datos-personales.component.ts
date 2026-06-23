import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type FormState = 'draft' | 'pending_validation' | 'in_review' | 'approved' | 'rejected' | 'rejected_field';

interface DocumentUploadSlot {
  label: string;
  required: boolean;
  fileName: string | null;
}

interface AlertConfig {
  severity: 'warning' | 'error' | 'info' | 'success';
  message: string;
  boldSegment?: string;
  link?: string;
  cta?: string;
  ctaAction?: () => void;
}

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.scss'],
})
export class DatosPersonalesComponent {
  activeTab: 'datos' | 'facturacion' = 'datos';

  constructor(private readonly router: Router) {}

  datosState: FormState = 'draft';
  facturacionState: FormState = 'draft';
  rejectionCode = '123456';
  rejectedFieldName = 'Régimen Fiscal';

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  // ── Tab 1: Datos personales ──
  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  fechaNacimiento = '26/01/1988';
  nacionalidad = '';
  tipoDocIdentidad = '';
  documento = '';
  emailContacto = '';
  telefonoCelular = '';
  direccionPersonal = '';

  // ── Tab 2: Facturación electrónica ──
  pais = '';
  provincia = '';
  ciudadLocalidad = '';
  direccionFacturacion = '';
  emailFacturacion = '';
  telefonoFacturacion = '';
  nombreRazonSocial = '';
  tipoPersona = '';
  condicionIVA = '';
  tipoDocFacturacion = '';
  numeroDocumento = '';
  aceptaTerminos = false;
  aceptaPolitica = false;

  documentSlots: DocumentUploadSlot[] = [];

  // ── Dropdown options ──
  provincias = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán',
  ];

  ciudades = [
    'La Plata', 'Mar del Plata', 'Bahía Blanca', 'Tandil', 'Quilmes',
    'Lanús', 'Avellaneda', 'Lomas de Zamora', 'San Isidro', 'Vicente López',
    'Morón', 'Tres de Febrero', 'San Martín', 'Tigre', 'Pilar',
    'Campana', 'Zárate', 'Pergamino', 'Junín', 'Olavarría',
    'Necochea', 'Azul', 'Dolores', 'Chascomús', 'Mercedes',
  ];

  nacionalidades = [
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia',
    'Ecuador', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela',
  ];

  paises = ['Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'México', 'Paraguay', 'Perú', 'Uruguay', 'Venezuela'];
  tiposDocIdentidad = ['DNI', 'CUIT', 'CUIL', 'Pasaporte', 'Cédula de identidad'];

  // ═══════════════════════════════════
  // Tab status badges
  // ═══════════════════════════════════

  get datosTabStatus(): 'pending' | 'complete' {
    return this.datosState === 'approved' ? 'complete' : 'pending';
  }

  get facturacionTabStatus(): 'pending' | 'complete' {
    return this.facturacionState === 'approved' ? 'complete' : 'pending';
  }

  get datosTagText(): string {
    switch (this.datosState) {
      case 'draft': return 'Validación Pendiente';
      case 'pending_validation': return 'Datos guardados';
      case 'in_review': return 'En revisión';
      case 'approved': return 'Validación exitosa';
      case 'rejected': case 'rejected_field': return 'Validación rechazada';
    }
  }

  get datosTagStyle(): string {
    switch (this.datosState) {
      case 'draft': case 'pending_validation': return 'warning';
      case 'in_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': case 'rejected_field': return 'error';
    }
  }

  get facturacionTagText(): string {
    switch (this.facturacionState) {
      case 'draft': return 'Pendiente';
      case 'pending_validation': return 'Datos guardados';
      case 'in_review': return 'En revisión';
      case 'approved': return 'Aprobado';
      case 'rejected': case 'rejected_field': return 'Requiere corrección';
    }
  }

  get facturacionTagStyle(): string {
    switch (this.facturacionState) {
      case 'draft': case 'pending_validation': return 'neutral';
      case 'in_review': return 'info';
      case 'approved': return 'success';
      case 'rejected': case 'rejected_field': return 'error';
    }
  }

  // ═══════════════════════════════════
  // Alerts per state
  // ═══════════════════════════════════

  get datosAlert(): AlertConfig | null {
    switch (this.datosState) {
      case 'draft':
        return {
          severity: 'warning',
          message: 'Revisa bien tus datos. Tras validarte, no podrás cambiarlos por 6 meses. ¿Dudas?',
          boldSegment: 'Revisa bien tus datos.',
          link: 'Escríbenos a soporte.',
        };
      case 'pending_validation':
        return {
          severity: 'warning',
          message: 'Validación de identidad pendiente.',
          cta: 'Comenzar validación',
          ctaAction: () => this.comenzarValidacionDatos(),
        };
      case 'in_review':
        return {
          severity: 'info',
          message: 'En proceso de validación, pronto te daremos respuesta de la validación. Si tienes dudas escribe a soporte.',
          link: 'Escribir a Soporte',
        };
      case 'approved':
        return {
          severity: 'success',
          message: 'Tus datos personales han sido validados exitosamente.',
        };
      case 'rejected':
        return {
          severity: 'error',
          message: `La validación no fue exitosa. Si necesitas ayuda, contacta a soporte con el código [${this.rejectionCode}].`,
          cta: 'Escribir a Soporte',
        };
      case 'rejected_field':
        return {
          severity: 'error',
          message: 'No logramos validar tus datos: Inténtalo de nuevo.',
          cta: 'Reintentar validación',
          ctaAction: () => this.reintentarValidacionDatos(),
        };
      default:
        return null;
    }
  }

  get facturacionAlert(): AlertConfig | null {
    switch (this.facturacionState) {
      case 'draft':
        return {
          severity: 'warning',
          message: 'Completa los datos de facturación electrónica; de lo contrario, la factura se emitirá a nombre de quien validó la cuenta.',
        };
      case 'pending_validation':
        return {
          severity: 'warning',
          message: 'Datos de facturación pendientes de completar.',
          cta: 'Completar facturación',
          ctaAction: () => this.facturacionState = 'draft',
        };
      case 'in_review':
        return {
          severity: 'info',
          message: 'En proceso de validación, pronto te daremos respuesta de la validación. Si tienes dudas escribe a soporte.',
          link: 'Escribir a Soporte',
        };
      case 'approved':
        return {
          severity: 'success',
          message: 'Tus datos de facturación han sido aprobados.',
        };
      case 'rejected_field':
        return {
          severity: 'error',
          message: `Error en el campo ${this.rejectedFieldName}. Si no lo corriges, no podrás facturar en el futuro.`,
          cta: 'Editar información',
          ctaAction: () => this.editarFacturacion(),
        };
      case 'rejected':
        return {
          severity: 'error',
          message: `La validación no fue exitosa. Si necesitas ayuda, contacta a soporte con el código [${this.rejectionCode}].`,
          cta: 'Escribir a Soporte',
        };
      default:
        return null;
    }
  }

  // ═══════════════════════════════════
  // Fields locked per state
  // ═══════════════════════════════════

  get datosFieldsLocked(): boolean {
    return ['pending_validation', 'in_review', 'approved'].includes(this.datosState);
  }

  get facturacionFieldsLocked(): boolean {
    return ['pending_validation', 'in_review'].includes(this.facturacionState);
  }

  // ═══════════════════════════════════
  // Cascading logic (Facturación)
  // ═══════════════════════════════════

  get isArgentina(): boolean {
    return this.pais === 'Argentina';
  }

  get provinciaLabel(): string {
    return this.isArgentina ? 'Provincia' : 'Departamento / Estado';
  }

  get provinciaPlaceholder(): string {
    return this.isArgentina ? 'Selecciona provincia' : 'Ingresa departamento o estado';
  }

  get isExtranjeroForced(): boolean {
    return this.pais !== '' && this.pais !== 'Argentina';
  }

  get tiposPersonaOptions(): string[] {
    return ['Persona Humana', 'Persona Jurídica', 'Extranjero'];
  }

  get condicionIVADisabled(): boolean {
    return !this.tipoPersona || this.facturacionFieldsLocked;
  }

  get condicionesIVAOptions(): string[] {
    switch (this.tipoPersona) {
      case 'Persona Humana':
        return ['Consumidor Final', 'IVA Responsable Inscripto', 'Responsable Monotributo'];
      case 'Persona Jurídica':
        return ['IVA Responsable Inscripto', 'IVA Exento'];
      case 'Extranjero':
        return ['Consumidor Final (plataforma local)'];
      default:
        return [];
    }
  }

  get tipoDocFacturacionDisabled(): boolean {
    return !this.condicionIVA || this.facturacionFieldsLocked;
  }

  get tiposDocFacturacionOptions(): string[] {
    if (this.tipoPersona === 'Persona Humana') {
      if (this.condicionIVA === 'Consumidor Final') return ['CUIT', 'CUIL', 'DNI'];
      if (this.condicionIVA === 'IVA Responsable Inscripto') return ['CUIT'];
      if (this.condicionIVA === 'Responsable Monotributo') return ['CUIT'];
    }
    if (this.tipoPersona === 'Persona Jurídica') return ['CUIT'];
    if (this.tipoPersona === 'Extranjero') return ['Pasaporte', 'Identificación extranjera'];
    return [];
  }

  get numeroDocumentoDisabled(): boolean {
    return !this.tipoDocFacturacion || this.facturacionFieldsLocked;
  }

  get numeroDocumentoPlaceholder(): string {
    switch (this.tipoDocFacturacion) {
      case 'CUIT': return 'XX-XXXXXXXX-X (11 dígitos)';
      case 'CUIL': return 'XX-XXXXXXXX-X (11 dígitos)';
      case 'DNI': return '7 u 8 dígitos';
      case 'Pasaporte': return '6 a 15 caracteres alfanuméricos';
      case 'Identificación extranjera': return 'Número de identificación';
      default: return 'Ingresa el número de documento';
    }
  }

  get showDocumentUpload(): boolean {
    return !!this.tipoPersona;
  }

  get documentUploadTitle(): string {
    return 'Subir documento que confirme tu situación fiscal';
  }

  // ═══════════════════════════════════
  // Button state
  // ═══════════════════════════════════

  get guardarFacturacionEnabled(): boolean {
    if (this.facturacionFieldsLocked) return false;
    return this.aceptaTerminos
      && this.aceptaPolitica
      && !!this.pais
      && !!this.provincia
      && !!this.ciudadLocalidad
      && !!this.direccionFacturacion
      && !!this.emailFacturacion
      && !!this.telefonoFacturacion
      && !!this.nombreRazonSocial
      && !!this.tipoPersona
      && !!this.condicionIVA
      && !!this.tipoDocFacturacion
      && !!this.numeroDocumento;
  }

  get showGuardarDatos(): boolean {
    return this.datosState === 'draft' || this.datosState === 'rejected' || this.datosState === 'rejected_field';
  }

  get showGuardarFacturacion(): boolean {
    return this.facturacionState === 'draft' || this.facturacionState === 'rejected' || this.facturacionState === 'rejected_field';
  }

  // ═══════════════════════════════════
  // Event handlers
  // ═══════════════════════════════════

  onPaisChange(): void {
    this.provincia = '';
    this.ciudadLocalidad = '';

    if (this.isExtranjeroForced) {
      this.tipoPersona = 'Extranjero';
      this.onTipoPersonaChange();
    } else if (this.tipoPersona === 'Extranjero') {
      this.tipoPersona = '';
      this.onTipoPersonaChange();
    }
  }

  onTipoPersonaChange(): void {
    this.condicionIVA = '';
    this.tipoDocFacturacion = '';
    this.numeroDocumento = '';
    this.updateDocumentSlots();

    if (this.tipoPersona === 'Extranjero' && this.condicionesIVAOptions.length === 1) {
      this.condicionIVA = this.condicionesIVAOptions[0];
      this.onCondicionIVAChange();
    }
  }

  onCondicionIVAChange(): void {
    this.tipoDocFacturacion = '';
    this.numeroDocumento = '';
    this.updateDocumentSlots();

    if (this.tiposDocFacturacionOptions.length === 1) {
      this.tipoDocFacturacion = this.tiposDocFacturacionOptions[0];
    }
  }

  onTipoDocFacturacionChange(): void {
    this.numeroDocumento = '';
  }

  onNumeroDocumentoInput(): void {
    if (!this.tipoDocFacturacion) return;
    if (['CUIT', 'CUIL', 'CDI', 'DNI'].includes(this.tipoDocFacturacion)) {
      this.numeroDocumento = this.numeroDocumento.replace(/[^0-9]/g, '');
    }
  }

  private updateDocumentSlots(): void {
    this.documentSlots = [];

    if (this.tipoPersona === 'Persona Humana') {
      this.documentSlots = [
        { label: 'DNI frente y dorso (en un mismo archivo PDF/imagen)', required: true, fileName: null },
      ];
      if (this.condicionIVA === 'IVA Responsable Inscripto') {
        this.documentSlots.push({
          label: 'Constancia de inscripción ARCA como Responsable Inscripto', required: true, fileName: null,
        });
      } else if (this.condicionIVA === 'Responsable Monotributo') {
        this.documentSlots.push({
          label: 'Constancia de inscripción ARCA — categoría Monotributo vigente', required: true, fileName: null,
        });
      }
    } else if (this.tipoPersona === 'Persona Jurídica') {
      this.documentSlots = [
        { label: 'Constancia de inscripción ARCA (AFIP + Ingresos Brutos)', required: true, fileName: null },
      ];
      if (this.condicionIVA === 'IVA Exento') {
        this.documentSlots.push({
          label: 'Certificado de exención ARCA/AFIP vigente', required: true, fileName: null,
        });
      } else {
        this.documentSlots.push({
          label: 'Estatuto o Contrato Social inscripto en IGJ o Registro Público', required: true, fileName: null,
        });
      }
    } else if (this.tipoPersona === 'Extranjero') {
      this.documentSlots = [
        { label: 'Pasaporte vigente O constancia tributaria del país de origen', required: true, fileName: null },
      ];
    }
  }

  onFileSelected(event: Event, slotIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.documentSlots[slotIndex].fileName = input.files[0].name;
    }
    input.value = '';
  }

  removeFile(slotIndex: number): void {
    this.documentSlots[slotIndex].fileName = null;
  }

  // ═══════════════════════════════════
  // State transitions
  // ═══════════════════════════════════

  private toast(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }

  guardarDatos(): void {
    this.datosState = 'pending_validation';
    this.toast('Datos personales guardados correctamente');
  }

  comenzarValidacionDatos(): void {
    this.datosState = 'in_review';
    this.toast('Validación enviada. Te notificaremos cuando tengamos respuesta.', 'info');
    setTimeout(() => {
      this.datosState = 'approved';
      this.toast('Tus datos personales fueron validados exitosamente');
    }, 3000);
  }

  reintentarValidacionDatos(): void {
    this.datosState = 'draft';
    this.toast('Puedes corregir tus datos y volver a intentar', 'info');
  }

  guardarFacturacion(): void {
    if (!this.guardarFacturacionEnabled) return;
    if (this.facturacionState === 'approved') {
      this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18'], {
        queryParams: {
          tipo: 'antiguo-datos-completos',
          estado: 'aprobada',
          pais: 'co-natural',
          origen: 'configuraciones',
          revalidar: 'facturacion',
        },
      });
      return;
    }
    this.toast('Datos de facturación guardados. Enviando a revisión...');
    setTimeout(() => {
      this.facturacionState = 'in_review';
      this.toast('Facturación en revisión. Te notificaremos cuando tengamos respuesta.', 'info');
    }, 800);
    setTimeout(() => {
      this.facturacionState = 'approved';
      this.toast('Tus datos de facturación fueron aprobados');
    }, 3800);
  }

  editarFacturacion(): void {
    this.facturacionState = 'draft';
    this.toast('Puedes corregir la información y guardar nuevamente', 'info');
  }

  // ── Demo controls ──
  simulateDatosRejection(): void {
    this.datosState = 'rejected';
  }

  simulateDatosFieldRejection(): void {
    this.datosState = 'rejected_field';
  }

  simulateFacturacionFieldRejection(): void {
    this.facturacionState = 'rejected_field';
  }

  simulateFacturacionRejection(): void {
    this.facturacionState = 'rejected';
  }

  resetState(): void {
    this.datosState = 'draft';
    this.facturacionState = 'draft';
  }
}
