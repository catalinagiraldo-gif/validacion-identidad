import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
        <span class="breadcrumb-item">Configuraciones</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Tienda</span>
      </nav>

      <h1 class="page-title">Configuracion de tienda</h1>

      <div class="tienda-layout">
        <!-- Logo Upload Section -->
        <div class="logo-section">
          <div class="logo-card">
            <h3 class="logo-card-title">Logo de tu tienda</h3>
            <div class="logo-preview" (click)="logoInput.click()">
              <img
                *ngIf="logoUrl"
                [src]="logoUrl"
                alt="Logo"
                class="logo-img"
              />
              <div *ngIf="!logoUrl" class="logo-placeholder">
                <i class="pi pi-image"></i>
                <span>Sube tu logo</span>
              </div>
              <div class="logo-overlay">
                <i class="pi pi-camera"></i>
              </div>
            </div>
            <input
              #logoInput
              type="file"
              accept="image/*"
              class="file-input-hidden"
              (change)="onLogoSelected($event)"
            />
            <p class="logo-hint">Recomendado: 512x512px, PNG o JPG</p>

            <div class="store-preview">
              <span class="preview-label">Vista previa de tu URL</span>
              <div class="preview-url">
                <i class="pi pi-globe"></i>
                <span>dropi.co/tienda/{{ form.urlPersonalizada || 'tu-tienda' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="form-section">
          <div class="form-card">
            <div class="form-stack">
              <div class="form-group">
                <label class="form-label">Nombre de la tienda</label>
                <input
                  type="text"
                  class="form-input"
                  [(ngModel)]="form.nombre"
                  placeholder="Ej: Mi Tienda Online"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Descripcion</label>
                <textarea
                  class="form-textarea"
                  [(ngModel)]="form.descripcion"
                  placeholder="Describe tu tienda en pocas palabras..."
                  rows="4"
                ></textarea>
                <span class="char-counter">{{ form.descripcion.length }}/500</span>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Categoria principal</label>
                  <select class="form-select" [(ngModel)]="form.categoria">
                    <option value="">Seleccionar categoria</option>
                    <option *ngFor="let cat of categorias" [value]="cat">{{ cat }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">URL personalizada</label>
                  <div class="url-input-wrapper">
                    <span class="url-prefix">dropi.co/tienda/</span>
                    <input
                      type="text"
                      class="form-input url-input"
                      [(ngModel)]="form.urlPersonalizada"
                      placeholder="mi-tienda"
                    />
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Moneda</label>
                  <select class="form-select" [(ngModel)]="form.moneda">
                    <option value="COP">COP - Peso colombiano</option>
                    <option value="MXN">MXN - Peso mexicano</option>
                    <option value="USD">USD - Dolar americano</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Zona horaria</label>
                  <select class="form-select" [(ngModel)]="form.timezone">
                    <option value="America/Bogota">America/Bogota (GMT-5)</option>
                    <option value="America/Mexico_City">America/Mexico_City (GMT-6)</option>
                    <option value="America/Santiago">America/Santiago (GMT-4)</option>
                  </select>
                </div>
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
export class TiendaNewComponent {
  logoUrl: string | null = null;

  form = {
    nombre: 'Tienda Alejandra',
    descripcion: 'Tu tienda online con los mejores productos de dropshipping en Colombia. Envios rapidos y seguros a todo el pais.',
    categoria: 'Moda',
    urlPersonalizada: 'tienda-alejandra',
    moneda: 'COP',
    timezone: 'America/Bogota',
  };

  categorias = [
    'Moda',
    'Tecnologia',
    'Hogar',
    'Cocina',
    'Belleza',
    'Salud',
    'Deportes',
    'Accesorios',
    'Mascotas',
    'Juguetes',
  ];

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.logoUrl = e.target?.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
