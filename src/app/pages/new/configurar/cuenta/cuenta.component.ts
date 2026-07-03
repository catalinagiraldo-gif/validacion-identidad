import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../../common/services/identity-demo-state.service';
import { IdentityModalService } from '../../../../common/services/identity-modal.service';

const AVATAR_ICON = 'https://www.figma.com/api/mcp/asset/7e9163eb-de22-4728-845a-0e2ffbf9b37d';
const ICON_CALENDAR = 'https://www.figma.com/api/mcp/asset/18dc5cd0-37c6-440e-992a-c36bd2132906';
const FLAG_CO = 'https://www.figma.com/api/mcp/asset/634fbf8a-aef1-4fd6-9336-3ddada33124f';
const ICON_CHEVRON = 'https://www.figma.com/api/mcp/asset/438517bd-cdef-4d02-8e77-91725eda6ace';

@Component({
  selector: 'app-cuenta-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./cuenta.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="bc-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Configurar</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item">Cuenta</span>
        <i class="pi pi-chevron-right bc-sep"></i>
        <span class="bc-item bc-active">Información de cuenta</span>
      </nav>

      <!-- Title row -->
      <div class="page-header">
        <h1 class="page-title">Información de cuenta</h1>
        @if (isAprobado()) {
          <span class="tag-aprobado"><i class="pi pi-shield"></i> Identidad verificada</span>
        } @else if (status() === 'en_revision') {
          <span class="tag-revision"><i class="pi pi-clock"></i> En revisión</span>
        } @else {
          <span class="tag-pendiente">Validación Pendiente</span>
        }
      </div>

      <!-- Alert / CTA según estado -->
      @if (isAprobado()) {
        <div class="alert-success">
          <i class="pi pi-check-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Tu identidad fue verificada por Sumsub. </span>
              <span>Los campos marcados con 🔒 no son editables por 6 meses.</span>
            </p>
          </div>
        </div>
      } @else if (status() === 'en_revision') {
        <div class="alert-review">
          <i class="pi pi-clock alert-icon"></i>
          <p class="alert-text">
            <span class="alert-bold">Tu verificación está siendo revisada. </span>
            <span>En 1-3 días hábiles te notificaremos por email.</span>
          </p>
        </div>
      } @else if (status() === 'rechazado') {
        <div class="alert-top alert-top--error">
          <i class="pi pi-times-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Tu verificación fue rechazada. </span>
              <span>El documento no fue legible. Puedes reintentar.</span>
            </p>
            <button class="btn-identity-cta btn-identity-cta--sm" type="button" (click)="abrirModal('screen2')">
              <i class="pi pi-refresh"></i> Reintentar verificación
            </button>
          </div>
        </div>
      } @else {
        <div class="alert-top">
          <i class="pi pi-exclamation-circle alert-icon"></i>
          <div class="alert-body">
            <p class="alert-text">
              <span class="alert-bold">Completa la verificación de identidad. </span>
              <span>Es necesaria para poder retirar tus ganancias. Toma ~5 min.</span>
            </p>
            <button class="btn-identity-cta" type="button" (click)="abrirModal('screen0')">
              <i class="pi pi-shield"></i> Iniciar verificación de identidad
            </button>
          </div>
        </div>
      }

      <!-- Main layout: avatar + form -->
      <div class="cuenta-layout">

        <!-- Avatar column -->
        <div class="avatar-col">
          <div class="avatar-circle">
            <img [src]="avatarIcon" alt="Avatar" class="avatar-icon-img" />
          </div>
          <button class="btn-cambiar-foto" type="button">Cambiar foto</button>
        </div>

        <!-- Form column -->
        <div class="form-col">

          <!-- Inner alert -->
          <div class="alert-inner">
            <i class="pi pi-exclamation-circle alert-icon-sm"></i>
            <p class="alert-text-sm">
              <span class="alert-bold">Revisa bien tus datos. </span>
              <span>Tras validarte, no podrás cambiarlos por 6 meses. ¿Dudas? </span>
              <span class="alert-link">Escríbenos a soporte.</span>
            </p>
          </div>

          <!-- Instruction text -->
          <p class="instruction-text">
            <strong>Si eres persona natural</strong>, ingresa tus datos según tu documento de identidad.
            <strong>Si eres persona jurídica </strong>(empresa), ingresa únicamente los datos personales del representante legal, no los datos de la empresa.
          </p>

          <!-- Datos personales -->
          <div class="form-block">
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">
                  Primer nombre
                  @if (isAprobado()) { <span class="lock-badge">🔒 Validado</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="" [(ngModel)]="primerNombre" [readonly]="isAprobado()" />
              </div>
              <div class="field-group">
                <label class="field-label">
                  Segundo nombre (Opcional)
                  @if (isAprobado()) { <span class="lock-badge">🔒 Validado</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="" [(ngModel)]="segundoNombre" [readonly]="isAprobado()" />
              </div>
            </div>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">
                  Primer apellido
                  @if (isAprobado()) { <span class="lock-badge">🔒 Validado</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="" [(ngModel)]="primerApellido" [readonly]="isAprobado()" />
              </div>
              <div class="field-group">
                <label class="field-label">
                  Segundo apellido (Opcional)
                  @if (isAprobado()) { <span class="lock-badge">🔒 Validado</span> }
                </label>
                <input type="text" class="field-input" [class.field-locked]="isAprobado()" placeholder="" [(ngModel)]="segundoApellido" [readonly]="isAprobado()" />
              </div>
            </div>
            <div class="form-row">
              <div class="field-group field-date">
                <label class="field-label">Fecha de nacimiento</label>
                <div class="date-input-wrap">
                  <img class="cal-icon" [src]="iconCalendar" alt="" />
                  <input type="text" class="field-input" placeholder="DD/MM/AAAA" [(ngModel)]="fechaNacimiento" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Nacionalidad</label>
                <div class="select-wrap">
                  <select class="field-select" [(ngModel)]="nacionalidad">
                    <option value="">Seleccionar</option>
                    <option value="co">Colombiana</option>
                    <option value="mx">Mexicana</option>
                    <option value="ec">Ecuatoriana</option>
                    <option value="ve">Venezolana</option>
                    <option value="pe">Peruana</option>
                  </select>
                  <img class="chevron-icon" [src]="iconChevron" alt="" />
                </div>
              </div>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Identificación -->
          <div class="form-block">
            <h2 class="section-title">Identificación</h2>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">Tipo de documento</label>
                <div class="select-wrap">
                  <select class="field-select field-disabled" [(ngModel)]="tipoDocumento" disabled>
                    <option value="">Seleccionar</option>
                    <option value="cc">Cédula de ciudadanía</option>
                    <option value="nit">NIT</option>
                    <option value="ce">Cédula de extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                  <img class="chevron-icon" [src]="iconChevron" alt="" />
                </div>
              </div>
              <div class="field-group">
                <label class="field-label">Documento</label>
                <input type="text" class="field-input field-disabled" placeholder="" [(ngModel)]="documento" [disabled]="true" />
              </div>
            </div>
          </div>

          <div class="section-divider"></div>

          <!-- Contacto -->
          <div class="form-block">
            <h2 class="section-title">Contacto</h2>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">Email de contacto</label>
                <input type="email" class="field-input" placeholder="" [(ngModel)]="emailContacto" />
              </div>
              <div class="field-group">
                <label class="field-label">Teléfono celular</label>
                <div class="phone-row">
                  <div class="phone-prefix">
                    <img class="flag" [src]="flagCo" alt="Colombia" />
                    <span class="phone-code-text">57</span>
                  </div>
                  <input type="tel" class="field-input phone-number" placeholder="" [(ngModel)]="telefono" />
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="field-group field-full">
                <label class="field-label">Dirección</label>
                <input type="text" class="field-input" placeholder="" [(ngModel)]="direccion" />
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div class="form-actions">
            <button class="btn-save" type="button" (click)="onGuardar()">Guardar información de cuenta</button>
          </div>

        </div>
      </div>
    </div>
  `,
})
export class CuentaNewComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private modalSvc = inject(IdentityModalService);

  readonly avatarIcon = AVATAR_ICON;
  readonly iconCalendar = ICON_CALENDAR;
  readonly flagCo = FLAG_CO;
  readonly iconChevron = ICON_CHEVRON;

  readonly status     = this.stateSvc.status;
  readonly isAprobado = this.stateSvc.isApproved;

  primerNombre    = '';
  segundoNombre   = '';
  primerApellido  = '';
  segundoApellido = '';
  fechaNacimiento = '';
  nacionalidad    = '';
  tipoDocumento   = '';
  documento       = '';
  emailContacto   = '';
  telefono        = '';
  direccion       = '';

  constructor() {
    effect(() => {
      if (this.isAprobado()) {
        this.primerNombre   = 'Laura';
        this.primerApellido = 'Martínez';
        this.segundoApellido = 'López';
        this.tipoDocumento  = 'cc';
        this.documento      = '1.023.456.789';
        this.emailContacto  = 'laura.martinez@email.com';
        this.telefono       = '3101234567';
      }
    }, { allowSignalWrites: true });
  }

  abrirModal(screen: 'screen0' | 'screen2' | 'screen3'): void {
    this.modalSvc.open('cuenta', screen);
  }

  onGuardar(): void {}
}
