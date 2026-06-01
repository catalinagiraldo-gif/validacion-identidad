import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface OrdenDespacho {
  id: number;
  product: string;
  hasWarrantyOrder: boolean;
  hasNote: boolean;
  date: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  type: string;
  carrier: string;
  selected: boolean;
}

@Component({
  selector: 'app-ordenes-despacho-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./ordenes-despacho.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Pedidos</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Garant&iacute;as</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">&Oacute;rdenes de despacho</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">&Oacute;rdenes de despacho</h1>

      <!-- Action bar -->
      <div class="action-bar">
        <div class="action-bar__left">
          <button
            class="btn-acciones"
            (click)="showActionsDropdown = !showActionsDropdown"
          >
            <span>Acciones</span>
            <i class="pi pi-chevron-down"></i>
          </button>
          <div class="actions-dropdown" *ngIf="showActionsDropdown">
            <button class="actions-dropdown__item" (click)="onAction('exportar')">Exportar selecci&oacute;n</button>
            <button class="actions-dropdown__item" (click)="onAction('eliminar')">Eliminar selecci&oacute;n</button>
            <button class="actions-dropdown__item" (click)="onAction('cambiar')">Cambiar estado</button>
          </div>
        </div>
        <div class="action-bar__right">
          <button class="btn-filter" (click)="onFilterClick()">
            <i class="pi pi-filter"></i>
          </button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="despacho-table">
          <thead>
            <tr>
              <th class="col-check">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [checked]="allSelected"
                    (change)="toggleSelectAll($event)"
                  />
                  <span class="checkmark"></span>
                </label>
              </th>
              <th class="col-edit"></th>
              <th class="col-id">Id</th>
              <th class="col-product">Nombre del producto</th>
              <th class="col-date">Fecha de la orden</th>
              <th class="col-client">Cliente</th>
              <th class="col-type">Tipo</th>
              <th class="col-status">Estatus de env&iacute;o</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let orden of ordenesDespacho; let i = index"
              [style.animation-delay]="i * 40 + 'ms'"
              class="despacho-row"
            >
              <td class="col-check">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [(ngModel)]="orden.selected"
                  />
                  <span class="checkmark"></span>
                </label>
              </td>
              <td class="col-edit">
                <button class="btn-edit-row" aria-label="Editar orden">
                  <i class="pi pi-pencil"></i>
                </button>
              </td>
              <td class="col-id">
                <span class="orden-id">{{ orden.id }}</span>
              </td>
              <td class="col-product">
                <div class="product-cell">
                  <span class="product-name">{{ orden.product }}</span>
                  <div class="product-links">
                    <a
                      *ngIf="orden.hasWarrantyOrder"
                      class="product-link"
                      href="javascript:void(0)"
                      (click)="onWarrantyOrderClick(orden)"
                    >Orden de garant&iacute;a</a>
                    <a
                      *ngIf="orden.hasNote"
                      class="product-link"
                      href="javascript:void(0)"
                      (click)="onNoteClick(orden)"
                    >Tiene Nota</a>
                  </div>
                </div>
              </td>
              <td class="col-date">
                <span class="orden-date">{{ orden.date }}</span>
              </td>
              <td class="col-client">
                <div class="client-cell">
                  <span class="client-name">{{ orden.clientName }}</span>
                  <span class="client-address">{{ orden.clientAddress }}</span>
                  <span class="client-phone">Tel: {{ orden.clientPhone }}</span>
                </div>
              </td>
              <td class="col-type">
                <a
                  class="type-link"
                  href="javascript:void(0)"
                  (click)="onTypeClick(orden)"
                >{{ orden.type }}</a>
              </td>
              <td class="col-status">
                <div class="carrier-badge">
                  <img
                    *ngIf="getCarrierImage(orden.carrier)"
                    [src]="getCarrierImage(orden.carrier)"
                    [alt]="orden.carrier"
                    class="carrier-logo"
                  />
                  <span
                    *ngIf="!getCarrierImage(orden.carrier)"
                    class="carrier-text"
                  >{{ orden.carrier }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-wrapper">
        <div class="pagination-bar">
          <div class="pagination-progress">
            <div class="progress-track">
              <div
                class="progress-fill"
                [style.width]="paginationProgress + '%'"
              ></div>
            </div>
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              (click)="goToFirstPage()"
              [disabled]="currentPage === 1"
              aria-label="Primera p&aacute;gina"
            >
              <i class="pi pi-angle-double-left"></i>
            </button>
            <button
              class="pagination-btn"
              (click)="goToPreviousPage()"
              [disabled]="currentPage === 1"
              aria-label="P&aacute;gina anterior"
            >
              <i class="pi pi-angle-left"></i>
            </button>
            <span class="pagination-current">{{ currentPage }}</span>
            <button
              class="pagination-btn"
              (click)="goToNextPage()"
              [disabled]="currentPage === totalPages"
              aria-label="P&aacute;gina siguiente"
            >
              <i class="pi pi-angle-right"></i>
            </button>
            <button
              class="pagination-btn"
              (click)="goToLastPage()"
              [disabled]="currentPage === totalPages"
              aria-label="&Uacute;ltima p&aacute;gina"
            >
              <i class="pi pi-angle-double-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrdenesDespachoNewComponent {
  showActionsDropdown = false;
  currentPage = 1;
  totalPages = 1;

  /** Map of carrier codes to image paths */
  private carrierImages: Record<string, string> = {
    ENVIA: 'assets/images/carriers/envia.png',
    SERVIENTREGA: 'assets/images/carriers/servientrega.png',
    COORDINADORA: 'assets/images/carriers/coordinadora.png',
    INTERRAPIDISIMO: 'assets/images/carriers/interrapidisimo.png',
    TCC: 'assets/images/carriers/tcc.png',
    DOMINA: 'assets/images/carriers/domina.png',
  };

  ordenesDespacho: OrdenDespacho[] = [
    {
      id: 50028,
      product: 'Termos Motivacionales x 4 piezas',
      hasWarrantyOrder: true,
      hasNote: true,
      date: '26/03/2026 12:04 p.m.',
      clientName: 'Diana',
      clientAddress: 'calle 16, CALI-VALLE',
      clientPhone: '3203203203',
      type: 'RECOLECCIÓN',
      carrier: 'GUA',
      selected: false,
    },
    {
      id: 50029,
      product: 'Organizador Multi-uso Premium',
      hasWarrantyOrder: true,
      hasNote: false,
      date: '27/03/2026 09:30 a.m.',
      clientName: 'Carlos',
      clientAddress: 'Cra 5 #12-34, BOGOTÁ',
      clientPhone: '3115554444',
      type: 'RECOLECCIÓN',
      carrier: 'ENVIA',
      selected: false,
    },
  ];

  get allSelected(): boolean {
    return (
      this.ordenesDespacho.length > 0 &&
      this.ordenesDespacho.every(o => o.selected)
    );
  }

  get paginationProgress(): number {
    if (this.totalPages <= 1) return 100;
    return (this.currentPage / this.totalPages) * 100;
  }

  getCarrierImage(carrier: string): string | null {
    return this.carrierImages[carrier] || null;
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.ordenesDespacho.forEach(o => (o.selected = checked));
  }

  onAction(action: string): void {
    this.showActionsDropdown = false;
  }

  onFilterClick(): void {}

  onWarrantyOrderClick(orden: OrdenDespacho): void {}

  onNoteClick(orden: OrdenDespacho): void {}

  onTypeClick(orden: OrdenDespacho): void {}

  goToFirstPage(): void {
    this.currentPage = 1;
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
  }
}
