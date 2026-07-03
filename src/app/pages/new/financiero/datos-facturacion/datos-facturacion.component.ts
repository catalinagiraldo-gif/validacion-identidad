import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../../common/services/identity-demo-state.service';
import { IdentityModalService } from '../../../../common/services/identity-modal.service';
import { ACTIVIDAD_ECONOMICA_OPTIONS } from '../../../../common/models/identity-flow.models';

const FLAG_CO = 'https://www.figma.com/api/mcp/asset/0aabaf73-3af0-43f5-94f6-6db627b8f389';
const ICON_TOOLTIP = 'https://www.figma.com/api/mcp/asset/1ce765f3-b9db-4f9a-83b1-be1c7989342b';
const ICON_CHEVRON = 'https://www.figma.com/api/mcp/asset/438517bd-cdef-4d02-8e77-91725eda6ace';

@Component({
  selector: 'app-datos-facturacion-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./datos-facturacion.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="bc-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Financiero</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Wallet</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item bc-active">Datos de facturación</span>
      </nav>

      <!-- Page title -->
      <div class="page-header">
        <h1 class="page-title">Datos de facturación</h1>
        @if (isAprobado()) {
          <span class="tag-completo"><i class="pi pi-check-circle"></i> Completado por Sumsub</span>
        } @else {
          <span class="tag-pendiente">Pendiente</span>
        }
        <button class="link-tutorial" type="button">Ver tutorial</button>
      </div>

      <!-- Banner según estado -->
      @if (isAprobado()) {
        <div class="alert-sumsub">
          <i class="pi pi-check-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Sumsub completó tu información de entidad automáticamente. </span>
              <span>Los campos de entidad están bloqueados. Completa los datos fiscales y guarda.</span>
            </p>
          </div>
        </div>
      } @else {
        <div class="alert-warning">
          <i class="pi pi-info-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Para que tus facturas sean válidas, primero valida tu identidad. </span>
              <span>Los datos de entidad quedarán completados automáticamente por Sumsub.</span>
            </p>
            <button class="btn-identity-cta" type="button" (click)="abrirModal()">
              <i class="pi pi-shield"></i> Validar identidad ahora
            </button>
          </div>
        </div>
      }

      <!-- Form content -->
      <div class="form-content">

        <!-- Sección 1: Información de Contacto -->
        <section class="form-section">
          <h2 class="section-title">Información de Contacto</h2>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">País</label>
              <div class="select-wrap">
                <select class="field-select" [(ngModel)]="pais">
                  <option value="colombia">Colombia</option>
                  <option value="mexico">México</option>
                  <option value="ecuador">Ecuador</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Municipio</label>
              <div class="select-wrap">
                <select class="field-select" [(ngModel)]="municipio">
                  <option value="">Seleccionar municipio</option>
                  <option value="bogota">Bogotá</option>
                  <option value="medellin">Medellín</option>
                  <option value="cali">Cali</option>
                  <option value="barranquilla">Barranquilla</option>
                  <option value="bucaramanga">Bucaramanga</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Dirección</label>
              <input type="text" class="field-input" placeholder="Escribe la dirección" [(ngModel)]="direccion" />
            </div>
            <div class="field-group">
              <label class="field-label">Email para facturacion</label>
              <input type="email" class="field-input" placeholder="ejemplo@empresa.com" [(ngModel)]="email" />
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Número de télefono</label>
              <div class="phone-row">
                <div class="phone-prefix">
                  <img class="flag" [src]="flagCo" alt="Colombia" />
                  <span class="phone-code-text">57</span>
                </div>
                <input type="tel" class="field-input phone-number" placeholder="310 123 4567" [(ngModel)]="telefono" />
              </div>
            </div>
            <div class="field-group"></div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 2: Entidad de facturación (locked post-Sumsub) -->
        <section class="form-section" [class.form-section--locked]="isAprobado()">
          <div class="section-header-row">
            <h2 class="section-title">Entidad de facturación</h2>
            @if (isAprobado()) {
              <span class="section-lock-badge">🔒 Completado por Sumsub · No editable</span>
            }
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Nombre o razón social</label>
              <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="Nombre de tu empresa" [(ngModel)]="razonSocial" [readonly]="isAprobado()" />
            </div>
            <div class="field-group">
              <label class="field-label">Tipo de persona</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="isAprobado()" [(ngModel)]="tipoPersona" [disabled]="isAprobado()">
                  <option value="">Seleccionar tipo de persona</option>
                  <option value="natural">Persona natural</option>
                  <option value="juridica">Persona jurídica</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">Tipo de documento</label>
              <div class="select-wrap">
                <select class="field-select" [class.field-locked]="isAprobado()" [(ngModel)]="tipoDocumento" [disabled]="isAprobado()">
                  <option value="">Seleccionar documento</option>
                  <option value="cc">Cédula de ciudadanía</option>
                  <option value="nit">NIT</option>
                  <option value="ce">Cédula de extranjería</option>
                  <option value="pasaporte">Pasaporte</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Número de documento</label>
              <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="Escribe el número" [(ngModel)]="numDocumento" [readonly]="isAprobado()" />
            </div>
          </div>
        </section>

        <div class="section-divider"></div>

        <!-- Sección 3: Información Tributaria -->
        <section class="form-section">
          <h2 class="section-title">Información Tributaria</h2>
          <p class="section-body">
            <strong>¡Revisa en tu RUT!</strong>
            En la sección "Responsabilidades, Calidades y Atributos", si aplican las siguientes obligaciones tributarias.
          </p>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">
                Tipo de regimen
                <img class="tooltip-icon" [src]="iconTooltip" alt="Ayuda" />
              </label>
              <div class="select-wrap">
                <select class="field-select" [(ngModel)]="tipoRegimen">
                  <option value="">Seleccionar tipo de régimen</option>
                  <option value="simplificado">Régimen simplificado</option>
                  <option value="comun">Régimen común</option>
                  <option value="especial">Régimen especial</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">
                Tipo de responsabilidad
                <img class="tooltip-icon" [src]="iconTooltip" alt="Ayuda" />
              </label>
              <div class="select-wrap">
                <select class="field-select" [(ngModel)]="tipoResponsabilidad">
                  <option value="">Seleccionar la responsabilidad</option>
                  <option value="r1">Responsable de IVA</option>
                  <option value="r2">No responsable de IVA</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="field-group">
              <label class="field-label">
                Impuesto
                <img class="tooltip-icon" [src]="iconTooltip" alt="Ayuda" />
              </label>
              <div class="select-wrap">
                <select class="field-select" [(ngModel)]="impuesto">
                  <option value="">Seleccionar el impuesto</option>
                  <option value="iva">IVA</option>
                  <option value="ica">ICA</option>
                  <option value="renta">Renta</option>
                </select>
                <img class="chevron-icon" [src]="iconChevron" alt="" />
              </div>
            </div>
            <div class="field-group"></div>
          </div>
        </section>

        <!-- CTA -->
        <div class="form-actions">
          <button class="btn-save" type="button" (click)="onGuardar()">Guardar facturación</button>
        </div>

      </div>
    </div>
  `,
})
export class DatosFacturacionNewComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private modalSvc = inject(IdentityModalService);

  readonly flagCo      = FLAG_CO;
  readonly iconTooltip = ICON_TOOLTIP;
  readonly iconChevron = ICON_CHEVRON;

  readonly isAprobado = this.stateSvc.isApproved;

  pais                = 'colombia';
  municipio           = '';
  direccion           = '';
  email               = '';
  telefono            = '';
  razonSocial         = '';
  tipoPersona         = '';
  tipoDocumento       = '';
  numDocumento        = '';
  tipoRegimen         = '';
  tipoResponsabilidad = '';
  impuesto            = '';

  constructor() {
    effect(() => {
      if (this.isAprobado()) {
        // Identidad bloqueada — capturada por Sumsub según tipo de persona
        const tp = this.stateSvc.tipoPersona();
        if (tp === 'juridica') {
          this.razonSocial   = 'TechStore SAS';
          this.tipoPersona   = 'juridica';
          this.tipoDocumento = 'nit';
          this.numDocumento  = '900.123.456-7';
        } else {
          this.razonSocial   = 'Laura Martínez López';
          this.tipoPersona   = 'natural';
          this.tipoDocumento = 'cc';
          this.numDocumento  = '1.023.456.789';
        }

        // Datos fiscales del cuestionario Sumsub (si el usuario completó el modal)
        const fiscal = this.stateSvc.datosFiscales();
        if (fiscal) {
          this.email         = fiscal.emailFacturacion;
          this.municipio     = fiscal.municipio;
          this.tipoRegimen   = fiscal.tipoRegimen ?? '';
        } else {
          // Fallback si se aprobó vía demo panel sin pasar por el modal
          this.email     = 'facturacion@email.com';
          this.telefono  = '3101234567';
        }
      }
    }, { allowSignalWrites: true });
  }

  abrirModal(): void {
    this.modalSvc.open('facturacion', 'screen0');
  }

  onGuardar(): void {}
}
