import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type NegociacionStatus = 'Pendiente' | 'Aprobada' | 'Rechazada' | 'Cancelada';

interface Negociacion {
  id: number;
  date: string;
  provider: string;
  providerAvatar: string;
  products: number;
  productType: string;
  comisionType: string;
  comisionAmount: number;
  desempenoCant: string;
  desempenoVentas: string;
  status: NegociacionStatus;
  deadline: string | null;
}

@Component({
  selector: 'app-negociaciones-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./negociaciones.component.scss'],
  template: `
    <div class="negociaciones-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Productos</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Negociaciones</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Negociaciones</h1>

      <!-- ID Comunidad -->
      <div class="id-comunidad">
        <span class="id-label">ID Comunidad:</span>
        <span class="id-value" (click)="copyToClipboard('12345')">12345</span>
        <button class="copy-btn" (click)="copyToClipboard('12345')" title="Copiar ID">
          <i class="pi pi-copy"></i>
        </button>
      </div>

      <!-- Filter row -->
      <div class="filter-row">
        <div class="filter-left">
          <div class="select-group">
            <label class="select-label">Tipo de negociacion</label>
            <div class="select-wrapper">
              <select [(ngModel)]="tipoNegociacion">
                <option value="Todas">Todas</option>
                <option value="Fija">Fija</option>
                <option value="Variable">Variable</option>
              </select>
              <i class="pi pi-chevron-down select-icon"></i>
            </div>
          </div>
          <button class="btn-filter-arrow" (click)="aplicarFiltros()">
            <i class="pi pi-arrow-right"></i>
          </button>
        </div>
        <div class="filter-right">
          <div class="search-input">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar por ID de negociacion"
              [(ngModel)]="searchQuery"
            />
            <div class="search-dropdown">
              <select [(ngModel)]="searchField">
                <option value="id">ID negociacion</option>
                <option value="proveedor">Proveedor</option>
              </select>
              <i class="pi pi-chevron-down"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          *ngFor="let tab of tabs; let i = index"
          class="tab"
          [class.active]="activeTab === i"
          (click)="setActiveTab(i)"
        >
          {{ tab.label }}
          <span class="tab-count" *ngIf="tab.count !== undefined">({{ tab.count }})</span>
        </button>
      </div>

      <!-- Negotiation cards -->
      <div class="cards-container">
        <div
          class="negociacion-card"
          *ngFor="let neg of filteredNegociaciones; let i = index"
          [style.animation-delay]="i * 0.05 + 's'"
        >
          <!-- Card header -->
          <div class="card-header">
            <div class="card-header-left">
              <span class="card-id-label">ID negociacion:</span>
              <span class="card-id-value">{{ neg.id }}</span>
              <button class="copy-btn-sm" (click)="copyToClipboard(neg.id.toString())" title="Copiar ID">
                <i class="pi pi-copy"></i>
              </button>
            </div>
            <div class="card-header-right">
              <span class="card-date-label">Fecha de creacion:</span>
              <span class="card-date-value">{{ neg.date }}</span>
            </div>
          </div>

          <!-- Card body - 4 column grid -->
          <div class="card-body">
            <div class="card-col col-proveedor">
              <span class="col-label">Proveedor</span>
              <div class="proveedor-info">
                <div class="proveedor-avatar">
                  <img [src]="neg.providerAvatar" [alt]="neg.provider" />
                </div>
                <span class="proveedor-name">{{ neg.provider }}</span>
              </div>
            </div>
            <div class="card-col col-productos">
              <span class="col-label">Productos</span>
              <div class="col-value">
                <span class="value-primary">{{ neg.products }}</span>
                <span class="value-secondary">{{ neg.productType }}</span>
              </div>
            </div>
            <div class="card-col col-comision">
              <span class="col-label">Comision</span>
              <div class="col-value">
                <span class="value-label">Tipo:</span>
                <span class="value-primary">{{ neg.comisionType }}</span>
              </div>
              <div class="col-value">
                <span class="value-label">Monto:</span>
                <span class="value-primary">{{ formatCurrency(neg.comisionAmount) }}</span>
              </div>
            </div>
            <div class="card-col col-desempeno">
              <span class="col-label">Desempeno</span>
              <div class="col-value">
                <span class="value-secondary">Ultimos 90 dias</span>
              </div>
              <div class="col-value">
                <span class="value-label">Cantidad:</span>
                <span class="value-primary">{{ neg.desempenoCant }}</span>
              </div>
              <div class="col-value">
                <span class="value-label">Valor ventas:</span>
                <span class="value-primary">{{ neg.desempenoVentas }}</span>
              </div>
            </div>
          </div>

          <!-- Card footer -->
          <div class="card-footer">
            <div class="card-footer-left">
              <span
                class="status-badge"
                [ngClass]="getStatusClass(neg.status)"
              >
                {{ neg.status }}
              </span>
              <span class="warning-text" *ngIf="neg.status === 'Pendiente' && neg.deadline">
                <i class="pi pi-exclamation-triangle"></i>
                Debes responder antes de {{ neg.deadline }}
              </span>
            </div>
            <div class="card-footer-right">
              <button
                class="btn-rechazar"
                *ngIf="neg.status === 'Pendiente'"
                (click)="rechazar(neg)"
              >
                Rechazar
              </button>
              <button
                class="btn-aprobar"
                *ngIf="neg.status === 'Pendiente'"
                (click)="aprobar(neg)"
              >
                Aprobar
              </button>
              <button class="btn-ver-detalles" (click)="verDetalles(neg)">
                Ver detalles
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="filteredNegociaciones.length === 0">
          <i class="pi pi-inbox"></i>
          <p>No se encontraron negociaciones</p>
        </div>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i class="pi" [ngClass]="{
          'pi-check-circle': toastType === 'success',
          'pi-info-circle': toastType === 'info',
          'pi-times-circle': toastType === 'error'
        }"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
})
export class NegociacionesNewComponent {
  // Filter state
  tipoNegociacion = 'Todas';
  searchQuery = '';
  searchField = 'id';
  activeTab = 0;

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  tabs = [
    { label: 'Todas', count: undefined as number | undefined },
    { label: 'Aprobadas', count: undefined as number | undefined },
    { label: 'Pendientes', count: undefined as number | undefined },
    { label: 'Canceladas', count: undefined as number | undefined },
    { label: 'Rechazadas', count: undefined as number | undefined },
  ];

  negociaciones: Negociacion[] = [
    {
      id: 243678,
      date: '30/04/2025',
      provider: 'Almacenes Denuevo',
      providerAvatar: 'assets/images/productos/avatar-adma.png',
      products: 5,
      productType: 'Productos especificos',
      comisionType: 'Fija',
      comisionAmount: 1000,
      desempenoCant: '-',
      desempenoVentas: '-',
      status: 'Pendiente',
      deadline: '29/08/2025',
    },
    {
      id: 243678,
      date: '30/04/2025',
      provider: 'Suppli',
      providerAvatar: 'assets/images/productos/avatar-suppli.png',
      products: 5,
      productType: 'Productos especificos',
      comisionType: 'Fija',
      comisionAmount: 1000,
      desempenoCant: '-',
      desempenoVentas: '-',
      status: 'Rechazada',
      deadline: null,
    },
    {
      id: 243678,
      date: '30/04/2025',
      provider: 'Faka Store',
      providerAvatar: 'assets/images/home/avatar-faka.png',
      products: 12,
      productType: 'Todo el catalogo',
      comisionType: 'Variable',
      comisionAmount: 2500,
      desempenoCant: '45',
      desempenoVentas: '$1.250.000',
      status: 'Aprobada',
      deadline: null,
    },
    {
      id: 243679,
      date: '01/05/2025',
      provider: 'Prendas Control',
      providerAvatar: 'assets/images/home/avatar-prendas.png',
      products: 3,
      productType: 'Productos especificos',
      comisionType: 'Fija',
      comisionAmount: 800,
      desempenoCant: '-',
      desempenoVentas: '-',
      status: 'Cancelada',
      deadline: null,
    },
  ];

  constructor() {
    this.updateTabCounts();
  }

  get filteredNegociaciones(): Negociacion[] {
    let result = this.negociaciones;

    // Filter by tab
    const tabStatus = this.getTabStatus();
    if (tabStatus) {
      result = result.filter(n => n.status === tabStatus);
    }

    // Filter by type
    if (this.tipoNegociacion !== 'Todas') {
      result = result.filter(n => n.comisionType === this.tipoNegociacion);
    }

    // Filter by search
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      if (this.searchField === 'id') {
        result = result.filter(n => n.id.toString().includes(q));
      } else {
        result = result.filter(n => n.provider.toLowerCase().includes(q));
      }
    }

    return result;
  }

  private getTabStatus(): NegociacionStatus | null {
    switch (this.activeTab) {
      case 1: return 'Aprobada';
      case 2: return 'Pendiente';
      case 3: return 'Cancelada';
      case 4: return 'Rechazada';
      default: return null;
    }
  }

  setActiveTab(index: number): void {
    this.activeTab = index;
  }

  getStatusClass(status: NegociacionStatus): string {
    switch (status) {
      case 'Pendiente': return 'status-pendiente';
      case 'Aprobada': return 'status-aprobada';
      case 'Rechazada': return 'status-rechazada';
      case 'Cancelada': return 'status-cancelada';
    }
  }

  formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('es-CO');
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notify('ID copiado al portapapeles', 'success');
    });
  }

  rechazar(neg: Negociacion): void {
    neg.status = 'Rechazada';
    this.updateTabCounts();
    this.notify(`Negociacion ${neg.id} rechazada`, 'error');
  }

  aprobar(neg: Negociacion): void {
    neg.status = 'Aprobada';
    this.updateTabCounts();
    this.notify(`Negociacion ${neg.id} aprobada`, 'success');
  }

  verDetalles(neg: Negociacion): void {
    this.notify(`Abriendo detalles de negociacion ${neg.id}`, 'info');
  }

  aplicarFiltros(): void {
    this.notify('Filtros aplicados', 'success');
  }

  private updateTabCounts(): void {
    this.tabs[0].count = this.negociaciones.length;
    this.tabs[1].count = this.negociaciones.filter(n => n.status === 'Aprobada').length;
    this.tabs[2].count = this.negociaciones.filter(n => n.status === 'Pendiente').length;
    this.tabs[3].count = this.negociaciones.filter(n => n.status === 'Cancelada').length;
    this.tabs[4].count = this.negociaciones.filter(n => n.status === 'Rechazada').length;
  }

  private notify(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
