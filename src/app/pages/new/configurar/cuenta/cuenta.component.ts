import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        <span class="tag-pendiente">Validación Pendiente</span>
      </div>

      <!-- Top alert -->
      <div class="alert-top">
        <i class="pi pi-exclamation-circle alert-icon"></i>
        <p class="alert-text">
          <span class="alert-bold">Faltan tus datos personales. </span>
          <span>Complétalos para continuar con la validación.</span>
        </p>
      </div>

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
                <label class="field-label">Primer nombre</label>
                <input type="text" class="field-input" placeholder="" [(ngModel)]="primerNombre" />
              </div>
              <div class="field-group">
                <label class="field-label">Segundo nombre (Opcional)</label>
                <input type="text" class="field-input" placeholder="" [(ngModel)]="segundoNombre" />
              </div>
            </div>
            <div class="form-row">
              <div class="field-group">
                <label class="field-label">Primer apellido</label>
                <input type="text" class="field-input" placeholder="" [(ngModel)]="primerApellido" />
              </div>
              <div class="field-group">
                <label class="field-label">Segundo apellido (Opcional)</label>
                <input type="text" class="field-input" placeholder="" [(ngModel)]="segundoApellido" />
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
  readonly avatarIcon = AVATAR_ICON;
  readonly iconCalendar = ICON_CALENDAR;
  readonly flagCo = FLAG_CO;
  readonly iconChevron = ICON_CHEVRON;

  primerNombre = '';
  segundoNombre = '';
  primerApellido = '';
  segundoApellido = '';
  fechaNacimiento = '';
  nacionalidad = '';
  tipoDocumento = '';
  documento = '';
  emailContacto = '';
  telefono = '';
  direccion = '';

  onGuardar(): void {}
}
