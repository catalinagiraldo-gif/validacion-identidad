import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-validador-direcciones-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./validador-direcciones.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Pedidos</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Preferencias</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Validador de direcciones</span>
      </nav>

      <!-- Page Title -->
      <h1 class="page-title">Validador de direcciones</h1>

      <!-- Section Header -->
      <div class="section-header">
        <span class="section-header__label">Activar normalizaci&oacute;n de direcciones</span>
      </div>

      <!-- Toggle Row -->
      <div class="toggle-row">
        <label class="toggle-switch" [class.active]="normalizacionActiva">
          <input
            type="checkbox"
            [(ngModel)]="normalizacionActiva"
            class="toggle-switch__input"
          />
          <span class="toggle-switch__slider"></span>
        </label>
        <span class="toggle-row__label">Normalizaci&oacute;n de direcciones</span>
      </div>

      <!-- Description -->
      <p class="toggle-description">
        Permitir la normalizaci&oacute;n de direcciones te ayudara a estandarizarlas para la transportadora
      </p>

      <!-- Save Button -->
      <div class="action-row">
        <button class="btn-guardar" (click)="guardar()">Guardar</button>
      </div>
    </div>
  `,
})
export class ValidadorDireccionesNewComponent {
  normalizacionActiva = false;

  guardar(): void {
    // Prototype only: no-op save
  }
}
