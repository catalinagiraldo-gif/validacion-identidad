import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TipoPersona } from '../../../../common/models/identity-flow.models';
import {
  DatosPersonaNatural,
  DuenoCuentaState,
  IdentityProfileService,
} from '../../../../common/services/identity-profile.service';
import { ToastService } from '../../../../common/services/toast.service';
import { DropiTagComponent, DropiTagSeverity } from '../../../../common/components/dropi-tag/dropi-tag.component';
import { DropiAlertComponent, DropiAlertSeverity } from '../../../../common/components/dropi-alert/dropi-alert.component';
import {
  SumsubModalConfig,
  SumsubResult,
  SumsubVerificationModalComponent,
} from '../../../../common/components/sumsub-verification-modal/sumsub-verification-modal.component';

@Component({
  selector: 'app-cuenta-new',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiTagComponent, DropiAlertComponent, SumsubVerificationModalComponent],
  styleUrls: ['./cuenta.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item breadcrumb-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Cuenta</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Información de cuenta</span>
      </nav>

      <!-- Title + status tag -->
      <div class="title-row">
        <h1 class="page-title">Información de cuenta</h1>
        <app-dropi-tag [label]="statusLabel" [severity]="statusSeverity"></app-dropi-tag>
      </div>

      <!-- Top alert: dynamic per estado real -->
      <app-dropi-alert [message]="topAlertMessage" [severity]="topAlertSeverity" [closable]="false"></app-dropi-alert>

      <div class="cuenta-layout">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-circle">
            <img src="assets/images/configurar/mascot-avatar.svg" alt="Avatar" class="avatar-img" />
          </div>
          <button class="btn-change-photo" (click)="fileInput.click()" type="button">
            <span>Cambiar foto</span>
          </button>
          <input
            #fileInput
            type="file"
            accept="image/*"
            class="file-input-hidden"
            (change)="onFileSelected($event)"
          />
        </div>

        <!-- Form Section -->
        <div class="form-section">
          @if (!validado) {
            <app-dropi-alert
              message="Revisa bien tus datos. Tras validarte, no podrás cambiarlos por 6 meses. ¿Dudas? Escríbenos a soporte@dropi.co"
              severity="warning"
              [closable]="false"
            ></app-dropi-alert>
          }

          <p class="explanation-text">
            <span class="explanation-strong">Si eres persona natural</span>, ingresa tus datos según tu documento de identidad.
            <span class="explanation-strong">Si eres persona jurídica </span>(empresa), ingresa únicamente los datos personales del representante legal, no los datos de la empresa.
          </p>

          <!-- Selector tipo de persona -->
          <div class="tipo-persona-row">
            <button
              type="button"
              class="tipo-persona-btn"
              [class.tipo-persona-btn--active]="tipoPersona === 'natural'"
              [disabled]="formLocked"
              (click)="setTipoPersona('natural')"
            >
              Persona natural
            </button>
            <button
              type="button"
              class="tipo-persona-btn"
              [class.tipo-persona-btn--active]="tipoPersona === 'juridica'"
              [disabled]="formLocked"
              (click)="setTipoPersona('juridica')"
            >
              Persona jurídica (empresa)
            </button>
          </div>

          @if (tipoPersona === 'juridica' && razonSocial) {
            <div class="form-row">
              <div class="form-group form-group-full">
                <label class="form-label form-label-muted">Razón social (validada por Sumsub)</label>
                <input type="text" class="form-input form-input-disabled" [value]="razonSocial" disabled />
              </div>
            </div>
          }

          <form class="account-form">
            <!-- Row: nombres -->
            <div class="form-row form-row-2">
              <div class="form-group">
                <label class="form-label">Primer nombre</label>
                <input type="text" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.primerNombre" name="primerNombre" [readonly]="formLocked" />
              </div>
              <div class="form-group">
                <label class="form-label">Segundo nombre (Opcional)</label>
                <input type="text" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.segundoNombre" name="segundoNombre" [readonly]="formLocked" />
              </div>
            </div>

            <!-- Row: apellidos -->
            <div class="form-row form-row-2">
              <div class="form-group">
                <label class="form-label">Primer apellido</label>
                <input type="text" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.primerApellido" name="primerApellido" [readonly]="formLocked" />
              </div>
              <div class="form-group">
                <label class="form-label">Segundo apellido (Opcional)</label>
                <input type="text" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.segundoApellido" name="segundoApellido" [readonly]="formLocked" />
              </div>
            </div>

            <!-- Row: fecha nacimiento / nacionalidad -->
            <div class="form-row form-row-date-select">
              <div class="form-group form-group-date">
                <label class="form-label">Fecha de nacimiento</label>
                <div class="date-input">
                  <i class="pi pi-calendar date-icon"></i>
                  <input
                    type="text"
                    class="date-input-field"
                    [(ngModel)]="form.fechaNacimiento"
                    name="fechaNacimiento"
                    placeholder="DD/MM/AAAA"
                    [readonly]="formLocked"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Nacionalidad</label>
                <div class="select-input" [class.select-input-disabled]="formLocked">
                  <select class="select-field" [(ngModel)]="form.nacionalidad" name="nacionalidad" [disabled]="formLocked">
                    <option value="" disabled selected>Seleccionar</option>
                    <option *ngFor="let n of nacionalidades" [value]="n">{{ n }}</option>
                  </select>
                </div>
              </div>
            </div>

            <hr class="form-divider" />

            <!-- Identificación -->
            <h2 class="form-section-title">Identificación</h2>
            <div class="form-row form-row-2">
              <div class="form-group">
                <label class="form-label form-label-muted">Tipo de documento</label>
                <div class="select-input select-input-disabled">
                  <select class="select-field" [(ngModel)]="form.tipoDocumento" name="tipoDocumento" disabled>
                    <option value="" disabled selected>Validado por Sumsub</option>
                    <option *ngFor="let t of tiposDocumento" [value]="t">{{ t }}</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label form-label-muted">Documento</label>
                <input type="text" class="form-input form-input-disabled" [(ngModel)]="form.documento" name="documento" disabled placeholder="Validado por Sumsub" />
              </div>
            </div>

            <hr class="form-divider" />

            <!-- Contacto -->
            <h2 class="form-section-title">Contacto</h2>
            <div class="form-row form-row-2">
              <div class="form-group">
                <label class="form-label">Email de contacto</label>
                <input type="email" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.email" name="email" [readonly]="formLocked" />
              </div>
              <div class="form-group">
                <label class="form-label">Teléfono celular</label>
                <div class="phone-input-row">
                  <div class="phone-code">
                    <img src="assets/images/configurar/flag-colombia.svg" alt="Colombia" class="phone-flag" />
                    <span>57</span>
                  </div>
                  <input type="tel" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.telefono" name="telefono" [readonly]="formLocked" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group form-group-full">
                <label class="form-label">Dirección</label>
                <input type="text" class="form-input" [class.form-input--fill]="formLocked" [(ngModel)]="form.direccion" name="direccion" [readonly]="formLocked" />
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Floating action button -->
      @if (!validado) {
        <button class="btn-save-floating" type="button" (click)="iniciarValidacion()">
          Comenzar verificación de identidad
        </button>
      } @else if (!formLocked) {
        <button class="btn-save-floating" type="button" (click)="onSave()">
          Guardar información de cuenta
        </button>
      }
    </div>

    <app-sumsub-verification-modal
      [visible]="modalVisible"
      [config]="modalConfig"
      (visibleChange)="modalVisible = $event"
      (success)="onValidacionExitosa($event)"
      (cancelled)="onValidacionCancelada()"
    ></app-sumsub-verification-modal>
  `,
})
export class CuentaNewComponent {
  private identity = inject(IdentityProfileService);
  private toast = inject(ToastService);

  readonly dueno = this.identity.dueno;

  form = {
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    fechaNacimiento: '',
    nacionalidad: '',
    tipoDocumento: '',
    documento: '',
    email: '',
    telefono: '',
    direccion: '',
  };

  tipoPersona: TipoPersona = 'natural';
  razonSocial = '';

  modalVisible = false;
  modalConfig: SumsubModalConfig = { origen: 'configuraciones', para: 'dueno', tipoPersona: 'natural' };

  nacionalidades = ['Colombiana', 'Mexicana', 'Chilena', 'Peruana', 'Ecuatoriana', 'Argentina'];
  tiposDocumento = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'NIT'];

  constructor() {
    effect(() => {
      this.syncFromService(this.dueno());
    });
  }

  get validado(): boolean {
    return this.identity.duenoValidado();
  }

  get formLocked(): boolean {
    return this.identity.duenoBloqueadoEdicion();
  }

  get statusLabel(): string {
    switch (this.dueno().status) {
      case 'aprobado': return 'Validado';
      case 'pendiente': return 'Validación pendiente';
      case 'en_revision': return 'En revisión';
      case 'rechazado': return 'Validación rechazada';
      default: return 'Sin validar';
    }
  }

  get statusSeverity(): DropiTagSeverity {
    switch (this.dueno().status) {
      case 'aprobado': return 'success';
      case 'pendiente': return 'warning';
      case 'en_revision': return 'info';
      case 'rechazado': return 'error';
      default: return 'secondary';
    }
  }

  get topAlertMessage(): string {
    const d = this.dueno();
    if (d.status === 'aprobado' && this.formLocked) {
      return `Tu cuenta está validada. No podrás editar estos datos hasta el ${this.fechaDesbloqueoLegible}.`;
    }
    if (d.status === 'aprobado') {
      return 'Tu cuenta está validada y tus datos ya se pueden editar nuevamente.';
    }
    if (d.status === 'rechazado') {
      return d.motivoRechazo
        ? `No pudimos validar tu identidad: ${d.motivoRechazo.label}. ${d.motivoRechazo.description}`
        : 'No pudimos validar tu identidad. Inténtalo de nuevo.';
    }
    return 'Faltan tus datos personales. Completa la verificación con Sumsub para continuar.';
  }

  get topAlertSeverity(): DropiAlertSeverity {
    const status = this.dueno().status;
    if (status === 'aprobado') return this.formLocked ? 'warning' : 'info';
    if (status === 'rechazado') return 'error';
    return 'warning';
  }

  get fechaDesbloqueoLegible(): string {
    const f = this.dueno().fechaDesbloqueo;
    if (!f) return '';
    return new Date(f).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  setTipoPersona(tipo: TipoPersona): void {
    if (this.formLocked) return;
    this.tipoPersona = tipo;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      // Photo upload handled here in a future iteration.
    }
  }

  iniciarValidacion(): void {
    this.modalConfig = {
      origen: 'configuraciones',
      para: 'dueno',
      tipoPersona: this.tipoPersona,
      paisSugerido: this.form.nacionalidad || undefined,
    };
    this.modalVisible = true;
  }

  onValidacionExitosa(result: SumsubResult): void {
    this.identity.setDuenoValidado(result.applicantId, result.tipoPersona, result.datos);
    this.toast.success('Tu identidad fue validada correctamente.', 'Validación exitosa');
  }

  onValidacionCancelada(): void {
    this.toast.info('Puedes retomar la validación de identidad cuando quieras.');
  }

  onSave(): void {
    if (this.formLocked) return;
    this.toast.success('Información de cuenta guardada.');
  }

  private syncFromService(d: DuenoCuentaState): void {
    if (d.tipoPersona) this.tipoPersona = d.tipoPersona;

    if (d.tipoPersona === 'natural' && d.natural) {
      this.applyNatural(d.natural);
      this.razonSocial = '';
    } else if (d.tipoPersona === 'juridica' && d.juridica) {
      this.applyNatural(d.juridica.representante);
      this.razonSocial = d.juridica.razonSocial;
      this.form.documento = d.juridica.nit;
      this.form.tipoDocumento = 'NIT';
    }
  }

  private applyNatural(n: DatosPersonaNatural): void {
    this.form.primerNombre = n.primerNombre;
    this.form.segundoNombre = n.segundoNombre;
    this.form.primerApellido = n.primerApellido;
    this.form.segundoApellido = n.segundoApellido;
    this.form.fechaNacimiento = n.fechaNacimiento;
    this.form.nacionalidad = n.nacionalidad;
    this.form.tipoDocumento = n.tipoDocumento;
    this.form.documento = n.numeroDocumento;
    this.form.email = n.email;
    this.form.telefono = n.telefono;
    this.form.direccion = n.direccion;
  }
}
