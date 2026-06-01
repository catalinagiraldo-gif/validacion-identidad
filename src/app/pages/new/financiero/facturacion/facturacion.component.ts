import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DatosFacturacion {
  nit: string;
  razonSocial: string;
  direccion: string;
  ciudad: string;
  telefono: string;
  email: string;
}

interface Factura {
  id: number;
  numero: string;
  fecha: string;
  periodo: string;
  monto: number;
  estado: 'Pagada' | 'Pendiente';
}

interface NotaCredito {
  id: number;
  numero: string;
  fecha: string;
  facturaRelacionada: string;
  monto: number;
  motivo: string;
}

@Component({
  selector: 'app-facturacion-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./facturacion.component.scss'],
  template: `
    <div class="facturacion-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Facturacion</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Facturacion</h1>

      <!-- Tabs -->
      <div class="tabs-bar">
        <button
          *ngFor="let tab of tabs; let i = index"
          class="tab-btn"
          [class.active]="activeTab === i"
          (click)="activeTab = i"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab: Datos de facturacion -->
      <div class="tab-content" *ngIf="activeTab === 0">
        <div class="form-card">
          <h2 class="section-title">Datos de facturacion</h2>
          <p class="section-description">Configura los datos fiscales para la generacion de tus facturas.</p>

          <div class="form-grid">
            <div class="form-group">
              <label for="nit">NIT</label>
              <input
                type="text"
                id="nit"
                [(ngModel)]="datos.nit"
                placeholder="Ej: 900.123.456-7"
              />
            </div>
            <div class="form-group">
              <label for="razonSocial">Razon Social</label>
              <input
                type="text"
                id="razonSocial"
                [(ngModel)]="datos.razonSocial"
                placeholder="Nombre de la empresa"
              />
            </div>
            <div class="form-group">
              <label for="direccion">Direccion</label>
              <input
                type="text"
                id="direccion"
                [(ngModel)]="datos.direccion"
                placeholder="Direccion fiscal"
              />
            </div>
            <div class="form-group">
              <label for="ciudad">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                [(ngModel)]="datos.ciudad"
                placeholder="Ciudad"
              />
            </div>
            <div class="form-group">
              <label for="telefono">Telefono</label>
              <input
                type="text"
                id="telefono"
                [(ngModel)]="datos.telefono"
                placeholder="Numero de telefono"
              />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="datos.email"
                placeholder="correo&#64;empresa.com"
              />
            </div>
          </div>

          <div class="form-actions">
            <button class="btn-secondary" (click)="onDiscard()">Descartar</button>
            <button class="btn-primary" (click)="onSaveDatos()">Guardar</button>
          </div>
        </div>
      </div>

      <!-- Tab: Facturas -->
      <div class="tab-content" *ngIf="activeTab === 1">
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
                    [ngClass]="{
                      'paid': factura.estado === 'Pagada',
                      'pending': factura.estado === 'Pendiente'
                    }"
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
      </div>

      <!-- Tab: Notas credito -->
      <div class="tab-content" *ngIf="activeTab === 2">
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
export class FacturacionNewComponent {
  activeTab = 0;
  tabs = ['Datos de facturacion', 'Facturas', 'Notas credito'];

  // Toast
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  datos: DatosFacturacion = {
    nit: '900.456.789-3',
    razonSocial: 'Comercializadora Digital S.A.S',
    direccion: 'Cra 43A #1-50 Torre Sur Ofc 1204',
    ciudad: 'Medellin',
    telefono: '(604) 444 5566',
    email: 'facturacion@comercializadoradigital.co',
  };

  facturas: Factura[] = [
    {
      id: 1,
      numero: 'FV-2026-001587',
      fecha: '01/05/2026',
      periodo: 'Abril 2026',
      monto: 3450000,
      estado: 'Pagada',
    },
    {
      id: 2,
      numero: 'FV-2026-001432',
      fecha: '01/04/2026',
      periodo: 'Marzo 2026',
      monto: 2890500,
      estado: 'Pagada',
    },
    {
      id: 3,
      numero: 'FV-2026-001298',
      fecha: '01/03/2026',
      periodo: 'Febrero 2026',
      monto: 4125000,
      estado: 'Pagada',
    },
    {
      id: 4,
      numero: 'FV-2026-001145',
      fecha: '01/02/2026',
      periodo: 'Enero 2026',
      monto: 1975300,
      estado: 'Pendiente',
    },
    {
      id: 5,
      numero: 'FV-2025-000987',
      fecha: '01/01/2026',
      periodo: 'Diciembre 2025',
      monto: 5230000,
      estado: 'Pagada',
    },
  ];

  notasCredito: NotaCredito[] = [
    {
      id: 1,
      numero: 'NC-2026-000045',
      fecha: '15/04/2026',
      facturaRelacionada: 'FV-2026-001432',
      monto: 350000,
      motivo: 'Devolucion parcial de mercancia',
    },
    {
      id: 2,
      numero: 'NC-2026-000032',
      fecha: '20/02/2026',
      facturaRelacionada: 'FV-2026-001145',
      monto: 125000,
      motivo: 'Ajuste por diferencia en tarifa de envio',
    },
  ];

  onSaveDatos(): void {
    this.notify('Datos de facturacion guardados correctamente', 'success');
  }

  onDiscard(): void {
    this.datos = {
      nit: '900.456.789-3',
      razonSocial: 'Comercializadora Digital S.A.S',
      direccion: 'Cra 43A #1-50 Torre Sur Ofc 1204',
      ciudad: 'Medellin',
      telefono: '(604) 444 5566',
      email: 'facturacion@comercializadoradigital.co',
    };
    this.notify('Cambios descartados', 'info');
  }

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
