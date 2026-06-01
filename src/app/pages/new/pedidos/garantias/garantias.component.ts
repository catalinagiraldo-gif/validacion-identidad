import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

type GarantiaStatus = 'FINALIZADO' | 'EN PROCESO' | 'RECHAZADO';

interface Garantia {
  id: number;
  orderId: string;
  guia: string;
  carrier: string;
  productId: number;
  productName: string;
  type: string;
  date: string;
  status: GarantiaStatus;
  newOrder: string | null;
  selected: boolean;
}

@Component({
  selector: 'app-garantias-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./garantias.component.scss'],
  template: `
    <div class="garantias-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Pedidos</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Garantias</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item active">Garantias</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Garantias</h1>

      <!-- Action bar -->
      <div class="action-bar">
        <div class="action-left">
          <button class="btn-acciones" (click)="toggleAcciones()">
            <span>Acciones</span>
            <i class="pi pi-chevron-down"></i>
          </button>
          <div class="acciones-dropdown" *ngIf="showAcciones">
            <button class="dropdown-item" (click)="accion('exportar')">Exportar</button>
            <button class="dropdown-item" (click)="accion('eliminar')">Eliminar seleccionados</button>
          </div>
        </div>
        <div class="action-right">
          <button class="btn-filter" (click)="toggleFilters()">
            <i class="pi pi-filter"></i>
          </button>
        </div>
      </div>

      <!-- Info banner -->
      <div class="info-banner" *ngIf="showInfoBanner">
        <div class="info-banner-content">
          <i class="pi pi-info-circle"></i>
          <span>las garantias pintadas de rojo son las que se han pasado del tiempo de respuesta por parte del proveedor</span>
        </div>
        <button class="info-banner-close" (click)="showInfoBanner = false">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="garantias-table">
          <thead>
            <tr>
              <th class="col-checkbox">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [checked]="allSelected"
                    (change)="toggleSelectAll()"
                  />
                  <span class="checkmark"></span>
                </label>
              </th>
              <th class="col-id">Id</th>
              <th class="col-order">Order Original</th>
              <th class="col-product">Producto</th>
              <th class="col-type">Tipo</th>
              <th class="col-date">Fecha de creacion</th>
              <th class="col-status">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let g of garantias; let i = index"
              [class.row-overdue]="g.status === 'EN PROCESO'"
              [style.animation-delay]="i * 0.04 + 's'"
            >
              <td class="col-checkbox">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [checked]="g.selected"
                    (change)="toggleSelect(g)"
                  />
                  <span class="checkmark"></span>
                </label>
              </td>
              <td class="col-id">{{ g.id }}</td>
              <td class="col-order">
                <span class="order-id">{{ g.orderId }}</span>
                <span class="order-guia"> / Guia: {{ g.guia }} - {{ g.carrier }}</span>
              </td>
              <td class="col-product">{{ g.productId }} - {{ g.productName }}</td>
              <td class="col-type">{{ g.type }}</td>
              <td class="col-date">{{ g.date }}</td>
              <td class="col-status">
                <span class="status-badge" [ngClass]="getStatusClass(g.status)">
                  {{ g.status }}
                </span>
                <span class="new-order" *ngIf="g.newOrder">
                  Nueva orden: {{ g.newOrder }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button class="page-btn" disabled>&laquo;</button>
        <button class="page-btn" disabled>&lsaquo;</button>
        <button class="page-btn active">1</button>
        <button class="page-btn" disabled>&rsaquo;</button>
        <button class="page-btn" disabled>&raquo;</button>
      </div>

      <!-- Toast -->
      <div class="toast" *ngIf="showToast" [ngClass]="toastType">
        <i class="pi" [ngClass]="{
          'pi-check-circle': toastType === 'success',
          'pi-info-circle': toastType === 'info'
        }"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </div>
  `,
})
export class GarantiasNewComponent {
  showInfoBanner = true;
  showAcciones = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  garantias: Garantia[] = [
    {
      id: 50028,
      orderId: '34780209',
      guia: '01414891076',
      carrier: 'ENVIA',
      productId: 241642,
      productName: 'Extractor De Puntos Negros Y Espinillas',
      type: 'Mal funcionamiento',
      date: '13/02/2025 2:25 p.m.',
      status: 'FINALIZADO',
      newOrder: '3513064',
      selected: false,
    },
    {
      id: 50029,
      orderId: '34780210',
      guia: '01414891077',
      carrier: 'ENVIA',
      productId: 241643,
      productName: 'Organizador De Closet OR84',
      type: 'Producto danado',
      date: '14/02/2025 3:10 p.m.',
      status: 'FINALIZADO',
      newOrder: '3513065',
      selected: false,
    },
    {
      id: 50030,
      orderId: '34780211',
      guia: '01414891078',
      carrier: 'INTERRAPIDISIMO',
      productId: 241644,
      productName: 'Reloj Inteligente Y68',
      type: 'Producto equivocado',
      date: '15/02/2025 10:45 a.m.',
      status: 'EN PROCESO',
      newOrder: null,
      selected: false,
    },
  ];

  get allSelected(): boolean {
    return this.garantias.length > 0 && this.garantias.every(g => g.selected);
  }

  toggleSelectAll(): void {
    const newState = !this.allSelected;
    this.garantias.forEach(g => (g.selected = newState));
  }

  toggleSelect(g: Garantia): void {
    g.selected = !g.selected;
  }

  getStatusClass(status: GarantiaStatus): string {
    switch (status) {
      case 'FINALIZADO':
        return 'status-finalizado';
      case 'EN PROCESO':
        return 'status-en-proceso';
      case 'RECHAZADO':
        return 'status-rechazado';
    }
  }

  toggleAcciones(): void {
    this.showAcciones = !this.showAcciones;
  }

  toggleFilters(): void {
    this.notify('Filtros aplicados', 'info');
  }

  accion(type: string): void {
    this.showAcciones = false;
    if (type === 'exportar') {
      this.notify('Exportando garantias...', 'success');
    } else if (type === 'eliminar') {
      const count = this.garantias.filter(g => g.selected).length;
      if (count === 0) {
        this.notify('Selecciona al menos una garantia', 'info');
      } else {
        this.notify(`${count} garantia(s) eliminada(s)`, 'success');
      }
    }
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
