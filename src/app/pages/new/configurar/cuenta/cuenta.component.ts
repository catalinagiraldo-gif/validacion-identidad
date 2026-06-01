import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cuenta-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./cuenta.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Cuenta</span>
      </nav>

      <h1 class="page-title">Informacion de cuenta</h1>

      <div class="cuenta-layout">
        <!-- Avatar Section -->
        <div class="avatar-section">
          <div class="avatar-card">
            <div class="avatar-circle">
              <img
                *ngIf="avatarUrl"
                [src]="avatarUrl"
                alt="Avatar"
                class="avatar-img"
              />
              <span *ngIf="!avatarUrl" class="avatar-initials">{{ getInitials() }}</span>
            </div>
            <button class="btn-upload" (click)="fileInput.click()">
              <i class="pi pi-camera"></i>
              <span>Cambiar foto</span>
            </button>
            <input
              #fileInput
              type="file"
              accept="image/*"
              class="file-input-hidden"
              (change)="onFileSelected($event)"
            />
            <p class="avatar-hint">JPG o PNG. Max 2MB</p>
          </div>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <div class="form-card">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nombre</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="form.nombre"
                  placeholder="Ingresa tu nombre"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Apellido</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="form.apellido"
                  placeholder="Ingresa tu apellido"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  type="email"
                  class="form-input"
                  [(ngModel)]="form.email"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Telefono</label>
                <div class="phone-input-row">
                  <select class="form-select phone-code" [(ngModel)]="form.phoneCode">
                    <option value="+57">+57</option>
                    <option value="+52">+52</option>
                    <option value="+56">+56</option>
                    <option value="+51">+51</option>
                    <option value="+1">+1</option>
                  </select>
                  <input
                    type="tel"
                    class="form-input"
                    [(ngModel)]="form.telefono"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Pais</label>
                <select class="form-select" [(ngModel)]="form.pais">
                  <option value="">Seleccionar pais</option>
                  <option *ngFor="let p of paises" [value]="p">{{ p }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ciudad</label>
                <select class="form-select" [(ngModel)]="form.ciudad">
                  <option value="">Seleccionar ciudad</option>
                  <option *ngFor="let c of ciudades" [value]="c">{{ c }}</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button class="btn-secondary">Descartar</button>
              <button class="btn-primary">Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CuentaNewComponent {
  avatarUrl: string | null = null;

  form = {
    nombre: 'Alejandra',
    apellido: 'Martinez',
    email: 'alejandra.martinez@dropi.co',
    phoneCode: '+57',
    telefono: '300 123 4567',
    pais: 'Colombia',
    ciudad: 'Bogota',
  };

  paises = ['Colombia', 'Mexico', 'Chile', 'Peru', 'Ecuador', 'Argentina'];
  ciudades = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Cartagena', 'Bucaramanga'];

  getInitials(): string {
    const n = this.form.nombre?.[0] || '';
    const a = this.form.apellido?.[0] || '';
    return (n + a).toUpperCase();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
