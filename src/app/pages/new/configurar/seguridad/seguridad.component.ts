import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../common/services/toast.service';
import { OtpVerificationModalComponent } from '../../../../common/components/otp-verification-modal/otp-verification-modal.component';

type SeguridadTab = 'registro' | 'autenticacion' | 'sesiones';

@Component({
  selector: 'app-seguridad-new',
  standalone: true,
  imports: [CommonModule, FormsModule, OtpVerificationModalComponent],
  styleUrls: ['./seguridad.component.scss'],
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
        <span class="breadcrumb-item active">Seguridad</span>
      </nav>

      <h1 class="page-title">Seguridad</h1>

      <div class="tabs-card">
        <!-- Tabs -->
        <div class="tabs-row">
          <button
            class="tab"
            [class.active]="activeTab === 'registro'"
            (click)="activeTab = 'registro'"
            type="button"
          >
            Datos de registro
          </button>
          <button
            class="tab"
            [class.active]="activeTab === 'autenticacion'"
            (click)="activeTab = 'autenticacion'"
            type="button"
          >
            Datos de autenticación
          </button>
          <button
            class="tab"
            [class.active]="activeTab === 'sesiones'"
            (click)="activeTab = 'sesiones'"
            type="button"
          >
            Mis sesiones
          </button>
          <div class="tab tab-filler"></div>
        </div>

        <!-- Tab content: Datos de registro -->
        <div class="tab-panel" *ngIf="activeTab === 'registro'">
          <div class="panel-header">
            <h2 class="panel-title">Datos de registro</h2>
            <button class="link-button" type="button">¿Por qué es importante validar tu número telefónico?</button>
          </div>

          <div class="registro-fields">
            <div class="field-block">
              <div class="form-group">
                <label class="form-label">Email de registro</label>
                <input
                  type="email"
                  class="form-input"
                  [class.form-input-disabled]="!editingEmail"
                  [(ngModel)]="registro.email"
                  [disabled]="!editingEmail"
                />
              </div>
              <button class="link-edit-btn" type="button" (click)="editingEmail = !editingEmail">
                {{ editingEmail ? 'Cancelar' : 'Cambiar' }}
              </button>
              @if (!editingEmail) {
                <span class="status-tag status-tag-success">
                  <i class="pi pi-check-circle"></i>
                  Verificado
                </span>
              }
            </div>

            <div class="field-block">
              <div class="form-group">
                <label class="form-label">Número de registro</label>
                <div class="phone-input-row">
                  <div class="phone-code">
                    <img src="assets/images/configurar/flag-colombia.svg" alt="Colombia" class="phone-flag" />
                    <span>57</span>
                  </div>
                  <input type="tel" class="form-input" [(ngModel)]="registro.telefono" [disabled]="!editingTelefono" />
                </div>
              </div>
              <button class="link-edit-btn" type="button" (click)="editingTelefono = !editingTelefono">
                {{ editingTelefono ? 'Cancelar' : 'Cambiar' }}
              </button>
              @if (!editingTelefono) {
                <span class="status-tag status-tag-success">
                  <i class="pi pi-check-circle"></i>
                  Verificado
                </span>
              }
            </div>
          </div>

          <button class="btn-save-registro" type="button" (click)="onSaveRegistro()" [disabled]="!editingEmail && !editingTelefono">
            Guardar datos de registro
          </button>
        </div>

        <!-- Tab content: Datos de autenticación -->
        <div class="tab-panel" *ngIf="activeTab === 'autenticacion'">
          <div class="panel-header">
            <h2 class="panel-title">Datos de autenticación</h2>
          </div>
          <p class="panel-empty-text">Próximamente podrás administrar tu contraseña y verificación en dos pasos desde aquí.</p>
        </div>

        <!-- Tab content: Mis sesiones -->
        <div class="tab-panel" *ngIf="activeTab === 'sesiones'">
          <div class="panel-header">
            <h2 class="panel-title">Mis sesiones</h2>
          </div>
          <p class="panel-empty-text">Próximamente podrás ver y cerrar las sesiones activas de tu cuenta desde aquí.</p>
        </div>
      </div>
    </div>

    <app-otp-verification-modal
      [visible]="otpModalVisible"
      [medio]="otpMedioActual"
      (visibleChange)="otpModalVisible = $event"
      (verified)="onOtpVerificado()"
      (cancelled)="onOtpCancelado()"
    ></app-otp-verification-modal>
  `,
})
export class SeguridadNewComponent {
  private toast = inject(ToastService);

  activeTab: SeguridadTab = 'registro';

  registro = {
    email: 'marisama0209@gmail.com',
    telefono: '3017393262',
  };

  private registroOriginal = { ...this.registro };

  editingEmail = false;
  editingTelefono = false;

  otpModalVisible = false;
  otpMedioActual = '';
  private pendingRegistro = { ...this.registro };

  onSaveRegistro(): void {
    const emailCambio = this.registro.email !== this.registroOriginal.email;
    const telefonoCambio = this.registro.telefono !== this.registroOriginal.telefono;

    if (!emailCambio && !telefonoCambio) {
      this.editingEmail = false;
      this.editingTelefono = false;
      return;
    }

    // Regla: OTP enviado al medio ACTUAL (ya verificado), no al nuevo — patrón antifraude.
    this.otpMedioActual = emailCambio ? this.registroOriginal.email : this.formatTelefono(this.registroOriginal.telefono);
    this.pendingRegistro = { ...this.registro };
    this.otpModalVisible = true;
  }

  onOtpVerificado(): void {
    this.registro = { ...this.pendingRegistro };
    this.registroOriginal = { ...this.registro };
    this.editingEmail = false;
    this.editingTelefono = false;
    this.toast.success('Datos de registro actualizados.');
  }

  onOtpCancelado(): void {
    this.registro = { ...this.registroOriginal };
    this.toast.info('Cambios descartados.');
  }

  private formatTelefono(telefono: string): string {
    return `+57 ${telefono}`;
  }
}
