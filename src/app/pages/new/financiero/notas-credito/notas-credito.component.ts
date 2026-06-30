import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NotaCredito {
  id: number;
  numero: string;
  fecha: string;
  facturaRelacionada: string;
  monto: number;
  motivo: string;
}

@Component({
  selector: 'app-notas-credito-new',
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
        <span class="breadcrumb-item">Notas crédito</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Notas crédito</h1>

      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th># Nota</th>
              <th>Fecha</th>
              <th>Factura relacionada</th>
              <th class="col-amount">Monto</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let nota of notasCredito; let i = index"
              class="table-row"
              [style.animation-delay]="i * 0.05 + 's'"
            >
              <td class="factura-number">{{ nota.numero }}</td>
              <td>{{ nota.fecha }}</td>
              <td>{{ nota.facturaRelacionada }}</td>
              <td class="col-amount">{{ formatCurrency(nota.monto) }}</td>
              <td>{{ nota.motivo }}</td>
            </tr>
            <tr *ngIf="notasCredito.length === 0">
              <td colspan="5" class="empty-state">
                <i class="pi pi-inbox"></i>
                <p>No hay notas credito registradas</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class NotasCreditoNewComponent {
  notasCredito: NotaCredito[] = [
    { id: 1, numero: 'NC-2026-000045', fecha: '15/04/2026', facturaRelacionada: 'FV-2026-001432', monto: 350000, motivo: 'Devolucion parcial de mercancia' },
    { id: 2, numero: 'NC-2026-000032', fecha: '20/02/2026', facturaRelacionada: 'FV-2026-001145', monto: 125000, motivo: 'Ajuste por diferencia en tarifa de envio' },
  ];

  formatCurrency(amount: number): string {
    return '$ ' + amount.toLocaleString('es-CO');
  }
}
