import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ToastService } from '../../../../common/services/toast.service';

type SeguridadTab = 'registro' | 'autenticacion' | 'sesiones';

@Component({
  selector: 'app-seguridad-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  onSaveRegistro(): void {
    const emailCambio = this.registro.email !== this.registroOriginal.email;
    const telefonoCambio = this.registro.telefono !== this.registroOriginal.telefono;

    if (!emailCambio && !telefonoCambio) return;

    this.registroOriginal = { ...this.registro };
    this.editingEmail = false;
    this.editingTelefono = false;
    this.toast.success('Datos de registro actualizados.');
  }
}
