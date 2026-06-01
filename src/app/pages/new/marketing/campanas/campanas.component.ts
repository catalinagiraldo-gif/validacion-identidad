import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Campaign {
  id: number;
  nombre: string;
  tipo: 'SMS' | 'Email';
  fecha: string;
  estado: 'Activa' | 'Pausada' | 'Finalizada';
  destinatarios: number;
}

@Component({
  selector: 'app-campanas-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./campanas.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Marketing</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">SMS y Correo</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Campanas masivas</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">Campanas masivas</h1>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--sent">
            <i class="pi pi-send"></i>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__value">{{ totalEnviadas | number }}</span>
            <span class="stat-card__label">Enviadas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--opened">
            <i class="pi pi-envelope"></i>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__value">{{ totalAbiertas | number }}</span>
            <span class="stat-card__label">Abiertas</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--clicks">
            <i class="pi pi-link"></i>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__value">{{ totalClicks | number }}</span>
            <span class="stat-card__label">Clicks</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card__icon stat-card__icon--bounced">
            <i class="pi pi-exclamation-triangle"></i>
          </div>
          <div class="stat-card__content">
            <span class="stat-card__value">{{ totalRebotes | number }}</span>
            <span class="stat-card__label">Rebotes</span>
          </div>
        </div>
      </div>

      <!-- Action bar -->
      <div class="action-bar">
        <div class="action-bar__left">
          <h2 class="section-title">Listado de campanas</h2>
        </div>
        <div class="action-bar__right">
          <div class="search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar campana..."
              [(ngModel)]="searchQuery"
            />
          </div>
          <button class="btn-primary">
            <i class="pi pi-plus"></i>
            <span>Nueva campana</span>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="campaigns-table">
          <thead>
            <tr>
              <th class="col-nombre">Nombre</th>
              <th class="col-tipo">Tipo</th>
              <th class="col-fecha">Fecha</th>
              <th class="col-estado">Estado</th>
              <th class="col-dest">Destinatarios</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let campaign of filteredCampaigns; let i = index"
              [style.animation-delay]="i * 40 + 'ms'"
              class="campaign-row"
            >
              <td class="col-nombre">
                <span class="campaign-name">{{ campaign.nombre }}</span>
              </td>
              <td class="col-tipo">
                <span class="tipo-badge" [ngClass]="'tipo-badge--' + campaign.tipo.toLowerCase()">
                  <i [class]="campaign.tipo === 'SMS' ? 'pi pi-mobile' : 'pi pi-envelope'"></i>
                  {{ campaign.tipo }}
                </span>
              </td>
              <td class="col-fecha">
                <span class="campaign-fecha">{{ campaign.fecha }}</span>
              </td>
              <td class="col-estado">
                <span class="estado-badge" [ngClass]="getEstadoClass(campaign.estado)">
                  {{ campaign.estado }}
                </span>
              </td>
              <td class="col-dest">
                <span class="campaign-dest">{{ campaign.destinatarios | number }}</span>
              </td>
              <td class="col-actions">
                <div class="action-icons">
                  <button class="action-icon-btn" aria-label="Ver detalle">
                    <i class="pi pi-eye"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Editar">
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Duplicar">
                    <i class="pi pi-copy"></i>
                  </button>
                  <button class="action-icon-btn action-icon-btn--danger" aria-label="Eliminar">
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class CampanasNewComponent {
  searchQuery = '';

  totalEnviadas = 12450;
  totalAbiertas = 8320;
  totalClicks = 3150;
  totalRebotes = 245;

  campaigns: Campaign[] = [
    { id: 1, nombre: 'Promo Black Friday 2024', tipo: 'Email', fecha: '15/11/2024 09:00', estado: 'Finalizada', destinatarios: 4500 },
    { id: 2, nombre: 'Bienvenida nuevos usuarios', tipo: 'Email', fecha: '01/12/2024 08:00', estado: 'Activa', destinatarios: 1200 },
    { id: 3, nombre: 'Recordatorio carrito abandonado', tipo: 'SMS', fecha: '10/12/2024 14:30', estado: 'Activa', destinatarios: 890 },
    { id: 4, nombre: 'Ofertas de fin de ano', tipo: 'Email', fecha: '20/12/2024 10:00', estado: 'Pausada', destinatarios: 3200 },
    { id: 5, nombre: 'Flash Sale Enero', tipo: 'SMS', fecha: '05/01/2025 12:00', estado: 'Finalizada', destinatarios: 2660 },
  ];

  get filteredCampaigns(): Campaign[] {
    if (!this.searchQuery.trim()) return this.campaigns;
    const q = this.searchQuery.toLowerCase();
    return this.campaigns.filter(
      c =>
        c.nombre.toLowerCase().includes(q) ||
        c.tipo.toLowerCase().includes(q) ||
        c.estado.toLowerCase().includes(q)
    );
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Activa': return 'estado-badge--activa';
      case 'Pausada': return 'estado-badge--pausada';
      case 'Finalizada': return 'estado-badge--finalizada';
      default: return '';
    }
  }
}
