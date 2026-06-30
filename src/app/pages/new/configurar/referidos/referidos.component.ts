import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Referral {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}

@Component({
  selector: 'app-referidos-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./referidos.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Configurar</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Referidos</span>
      </nav>

      <div class="page-header">
        <h1 class="page-title">Referidos</h1>
        <button class="btn-export" (click)="onExport()">
          <i class="pi pi-download"></i>
          Exportar
        </button>
      </div>

      <!-- Affiliate Link Bar -->
      <div class="affiliate-bar">
        <div class="affiliate-text">
          <span class="affiliate-label">Link de afiliados:</span>
          <span class="affiliate-url">{{ affiliateLink }}</span>
        </div>
        <button class="btn-copy" (click)="copyLink()" [title]="copied ? 'Copiado' : 'Copiar'">
          <i [class]="copied ? 'pi pi-check' : 'pi pi-copy'"></i>
        </button>
      </div>

      <!-- Filters Row -->
      <div class="filters-row">
        <div class="date-filter">
          <label class="filter-label">Rango de fecha</label>
          <div class="date-filter-row">
            <div class="date-input">
              <i class="pi pi-calendar"></i>
              <span>{{ dateRange }}</span>
            </div>
            <button class="btn-go" (click)="onFilterDate()" aria-label="Aplicar filtro de fecha">
              <i class="pi pi-arrow-right"></i>
            </button>
          </div>
        </div>

        <div class="search-box">
          <i class="pi pi-search"></i>
          <input type="text" placeholder="Buscar" [(ngModel)]="searchTerm" name="search" />
        </div>
      </div>

      <!-- Table Card -->
      <div class="table-card">
        <div class="table-meta">
          <span class="total-count">Total Ordenes Referidos : {{ referrals.length }}</span>
          <div class="sort-dropdown">
            <span class="sort-label">Ordenar por:</span>
            <button class="sort-button" type="button">
              Orden Ascende
              <i class="pi pi-chevron-down"></i>
            </button>
          </div>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let ref of referrals">
                <td>{{ ref.id }}</td>
                <td>{{ ref.nombre }}</td>
                <td>{{ ref.correo }}</td>
                <td>{{ ref.telefono }}</td>
                <td>
                  <span class="status-tag" [class.activo]="ref.estado === 'Activo'" [class.inactivo]="ref.estado === 'Inactivo'">
                    {{ ref.estado }}
                  </span>
                </td>
                <td>
                  <i class="pi pi-search action-icon" title="Ver detalles" (click)="onViewDetails(ref)"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginator -->
        <div class="paginator">
          <button class="page-arrow" type="button" aria-label="Primera página">
            <i class="pi pi-angle-double-left"></i>
          </button>
          <button class="page-arrow" type="button" aria-label="Página anterior">
            <i class="pi pi-angle-left"></i>
          </button>
          <button class="page-number active" type="button">1</button>
          <button class="page-arrow" type="button" aria-label="Página siguiente">
            <i class="pi pi-angle-right"></i>
          </button>
          <button class="page-arrow" type="button" aria-label="Última página">
            <i class="pi pi-angle-double-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ReferidosNewComponent {
  affiliateLink = 'https://app.dropi.co/auth/register?afl=74525';
  dateRange = '09/10/2025 - 15/10/2025';
  searchTerm = '';
  copied = false;

  referrals: Referral[] = [
    { id: 176293, nombre: 'Dream Shop', correo: 'diana@gmail.com', telefono: '3145256365', estado: 'Activo' },
    { id: 59296, nombre: 'Magic Shop', correo: 'paola@gmail.com', telefono: '3002568965', estado: 'Activo' },
    { id: 84721, nombre: 'Urban Style Co', correo: 'carlos.mendez@gmail.com', telefono: '3114567890', estado: 'Activo' },
    { id: 93582, nombre: 'Bella Boutique', correo: 'maria.lopez@outlook.com', telefono: '3201239876', estado: 'Inactivo' },
    { id: 67234, nombre: 'TechZone Store', correo: 'juan.perez@gmail.com', telefono: '3056781234', estado: 'Activo' },
    { id: 41985, nombre: 'Casa Hogar', correo: 'ana.garcia@hotmail.com', telefono: '3187654321', estado: 'Activo' },
    { id: 75310, nombre: 'Deportes Max', correo: 'diego.martinez@gmail.com', telefono: '3009876543', estado: 'Inactivo' },
    { id: 28461, nombre: 'Joyeria Luna', correo: 'laura.sanchez@outlook.com', telefono: '3145678901', estado: 'Activo' },
    { id: 53197, nombre: 'Mascotas Felices', correo: 'pedro.gomez@gmail.com', telefono: '3223456789', estado: 'Activo' },
    { id: 86420, nombre: 'Belleza Natural', correo: 'sofia.torres@hotmail.com', telefono: '3098761234', estado: 'Activo' },
    { id: 19753, nombre: 'Hogar y Decor', correo: 'andres.ramirez@gmail.com', telefono: '3156789012', estado: 'Inactivo' },
    { id: 64218, nombre: 'Moda Express', correo: 'camila.herrera@outlook.com', telefono: '3012345678', estado: 'Activo' },
    { id: 37589, nombre: 'Electro Hogar', correo: 'ricardo.morales@gmail.com', telefono: '3134567890', estado: 'Activo' },
    { id: 92146, nombre: 'Juguetes Felices', correo: 'valentina.diaz@gmail.com', telefono: '3245678901', estado: 'Activo' },
    { id: 58723, nombre: 'Cocina Total', correo: 'fernando.castro@outlook.com', telefono: '3067891234', estado: 'Inactivo' },
    { id: 71649, nombre: 'Fit Sport', correo: 'isabella.vargas@hotmail.com', telefono: '3178901234', estado: 'Activo' },
    { id: 26385, nombre: 'Libreria Central', correo: 'alejandro.ruiz@gmail.com', telefono: '3089012345', estado: 'Activo' },
    { id: 49217, nombre: 'Accesorios Plus', correo: 'daniela.ortiz@gmail.com', telefono: '3190123456', estado: 'Activo' },
    { id: 83642, nombre: 'Tienda Verde', correo: 'sebastian.jimenez@outlook.com', telefono: '3001234567', estado: 'Inactivo' },
    { id: 15974, nombre: 'Mundo Infantil', correo: 'natalia.mendoza@gmail.com', telefono: '3212345678', estado: 'Activo' },
    { id: 68352, nombre: 'Auto Repuestos JC', correo: 'gabriel.rojas@hotmail.com', telefono: '3123456789', estado: 'Activo' },
    { id: 31870, nombre: 'Papeleria Punto', correo: 'paula.restrepo@gmail.com', telefono: '3234567890', estado: 'Activo' },
  ];

  copyLink(): void {
    navigator.clipboard.writeText(this.affiliateLink);
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  onExport(): void {
    // Placeholder for export action
  }

  onFilterDate(): void {
    // Placeholder for date filter action
  }

  onViewDetails(ref: Referral): void {
    // Placeholder for view-details action
  }
}
