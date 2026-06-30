import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TiendaForm {
  nombre: string;
  email: string;
  estadoDefecto: string;
  telefono: string;
  storeUrl: string;
}

@Component({
  selector: 'app-tienda-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./tienda.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Configuración de tienda</span>
      </nav>

      <h1 class="page-title">Configuración de tienda</h1>

      <div class="form-card">
        <div class="form-stack">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Nombre de la tienda</label>
              <input
                type="text"
                class="form-input"
                [(ngModel)]="form.nombre"
              />
            </div>

            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                type="email"
                class="form-input"
                [(ngModel)]="form.email"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Estado por defecto de nueva orden:</label>
              <select class="form-select" [(ngModel)]="form.estadoDefecto">
                <option value="">Placeholder</option>
                <option *ngFor="let estado of estadosOrden" [value]="estado">{{ estado }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Teléfono de la tienda</label>
              <div class="phone-input-wrapper">
                <div class="phone-prefix">
                  <img src="/assets/images/configurar/flag-colombia.svg" alt="" class="flag-icon" />
                  <span>57</span>
                </div>
                <input
                  type="tel"
                  class="form-input phone-input"
                  [(ngModel)]="form.telefono"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Store Url</label>
            <input
              type="text"
              class="form-input"
              [(ngModel)]="form.storeUrl"
            />
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" (click)="onSave()">Guardar configuración</button>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast">
        <i class="pi pi-check-circle"></i>
        <span>Configuración de tienda guardada correctamente</span>
      </div>
    </div>
  `,
})
export class TiendaNewComponent {
  showToast = false;

  form: TiendaForm = {
    nombre: 'Tienda Alejandra',
    email: 'alejandra@tienda.co',
    estadoDefecto: '',
    telefono: '3152362535',
    storeUrl: 'tienda-alejandra',
  };

  estadosOrden = [
    'Pendiente',
    'Confirmado',
    'En preparación',
    'Enviado',
  ];

  onSave(): void {
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
