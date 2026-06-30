import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Factura {
  id: number;
  numero: string;
  fecha: string;
  periodo: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
}

@Component({
  selector: 'app-facturas-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['../facturacion/facturacion.component.scss'],
  template: `
    <div class="facturacion-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item muted">Facturación</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-down"></i></span>
        <span class="breadcrumb-item">Facturas</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Facturas</h1>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th># Factura</th>
              <th>Fecha</th>
              <th>Periodo</th>
              <th class="col-amount">Monto</th>
              <th class="col-status">Estado</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let factura of facturas; let i = index"
              class="table-row"
              [style.animation-delay]="i * 0.05 + 's'"
            >
              <td class="factura-number">{{ factura.numero }}</td>
              <td>{{ factura.fecha }}</td>
              <td>{{ factura.periodo }}</td>
              <td class="col-amount">{{ formatCurrency(factura.monto) }}</td>
              <td class="col-status">
                <span
                  class="status-badge"
                  [ngClass]="{ 'paid': factura.estado === 'Pagada', 'pending': factura.estado === 'Pendiente' }"
                >
                  {{ factura.estado }}
                </span>
              </td>
              <td class="col-actions">
                <button class="btn-icon" (click)="onDownloadPdf(factura)" title="Descargar PDF">
                  <i class="pi pi-file-pdf"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
export class FacturasNewComponent {
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  facturas: Factura[] = [
    { id: 1, numero: 'FV-2026-001587', fecha: '01/05/2026', periodo: 'Abril 2026', monto: 3450000, estado: 'Pagada' },
    { id: 2, numero: 'FV-2026-001432', fecha: '01/04/2026', periodo: 'Marzo 2026', monto: 2890500, estado: 'Pagada' },
    { id: 3, numero: 'FV-2026-001298', fecha: '01/03/2026', periodo: 'Febrero 2026', monto: 4125000, estado: 'Pagada' },
    { id: 4, numero: 'FV-2026-001145', fecha: '01/02/2026', periodo: 'Enero 2026', monto: 1975300, estado: 'Pendiente' },
    { id: 5, numero: 'FV-2025-000987', fecha: '01/01/2026', periodo: 'Diciembre 2025', monto: 5230000, estado: 'Pagada' },
  ];

  onDownloadPdf(factura: Factura): void {
    this.notify(`Descargando ${factura.numero}.pdf`, 'info');
  }

  formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('es-CO');
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
