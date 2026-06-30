import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CuentaBancaria {
  id: number;
  pais: string;
  banco: string;
  numeroCuenta: string;
  numeroCuentaMasked: string;
  tipoCuenta: string;
  identificacion: string;
}

@Component({
  selector: 'app-datos-bancarios-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./datos-bancarios.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item muted">Financiero</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item muted">Wallet</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item">Datos bancarios</span>
      </nav>

      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Datos bancarios</h1>
        <button class="btn-primary" (click)="onAgregar()">
          <i class="pi pi-plus"></i>
          <span>Agregar</span>
        </button>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="data-table">
          <thead>
            <tr>
              <th>País</th>
              <th>Banco</th>
              <th>Número de cuenta</th>
              <th>Tipo de cuenta</th>
              <th>Identificación</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="table-row"
              *ngFor="let cuenta of pagedCuentas; let i = index"
              [style.animation-delay]="i * 30 + 'ms'"
            >
              <td>{{ cuenta.pais }}</td>
              <td>{{ cuenta.banco }}</td>
              <td>
                <span class="account-tag">{{ cuenta.numeroCuentaMasked }}</span>
              </td>
              <td>{{ cuenta.tipoCuenta }}</td>
              <td>{{ cuenta.identificacion }}</td>
              <td class="col-actions">
                <div class="action-icons">
                  <button class="action-icon-btn" aria-label="Editar cuenta" (click)="onEdit(cuenta)">
                    <img src="assets/images/financiero/pencil.svg" alt="" />
                  </button>
                  <button class="action-icon-btn" aria-label="Eliminar cuenta" (click)="onDelete(cuenta)">
                    <img src="assets/images/financiero/trash.svg" alt="" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="empty-state" *ngIf="!pagedCuentas.length">
          <i class="pi pi-credit-card"></i>
          <p>No tienes cuentas bancarias registradas.</p>
        </div>
      </div>

      <!-- Paginator -->
      <div class="paginator" *ngIf="totalPages > 1">
        <div class="paginator-track">
          <div class="paginator-bar" [style.width.%]="progressPct"></div>
        </div>
        <div class="paginator-controls">
          <button class="page-arrow" [disabled]="currentPage === 1" (click)="goToPage(1)" aria-label="Primera pagina">
            <i class="pi pi-angle-double-left"></i>
          </button>
          <button class="page-arrow" [disabled]="currentPage === 1" (click)="goToPage(currentPage - 1)" aria-label="Pagina anterior">
            <i class="pi pi-angle-left"></i>
          </button>
          <span class="page-number">{{ currentPage }}</span>
          <button class="page-arrow" [disabled]="currentPage === totalPages" (click)="goToPage(currentPage + 1)" aria-label="Pagina siguiente">
            <i class="pi pi-angle-right"></i>
          </button>
          <button class="page-arrow" [disabled]="currentPage === totalPages" (click)="goToPage(totalPages)" aria-label="Ultima pagina">
            <i class="pi pi-angle-double-right"></i>
          </button>
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
export class DatosBancariosNewComponent {
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'info' = 'success';

  pageSize = 8;
  currentPage = 1;

  cuentas: CuentaBancaria[] = [
    { id: 1, pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '1234567893031', numeroCuentaMasked: '*****3031', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 2, pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '1234567893012', numeroCuentaMasked: '*****3012', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 3, pais: 'Colombia', banco: 'Davivienda', numeroCuenta: '9988776653367', numeroCuentaMasked: '*****3367', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 4, pais: 'Colombia', banco: 'Banco de Bogota', numeroCuenta: '4455667780045', numeroCuentaMasked: '*****0045', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 5, pais: 'Colombia', banco: 'BBVA Colombia', numeroCuenta: '7766554421189', numeroCuentaMasked: '*****1189', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 6, pais: 'Colombia', banco: 'Banco Agrario', numeroCuenta: '3322114478821', numeroCuentaMasked: '*****8821', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 7, pais: 'Colombia', banco: 'Banco Caja Social', numeroCuenta: '6677889903345', numeroCuentaMasked: '*****3345', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 8, pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '1122334407812', numeroCuentaMasked: '*****7812', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 9, pais: 'Colombia', banco: 'Nequi', numeroCuenta: '3001122339984', numeroCuentaMasked: '*****9984', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 10, pais: 'Colombia', banco: 'Davivienda', numeroCuenta: '5566778821456', numeroCuentaMasked: '*****1456', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 11, pais: 'Colombia', banco: 'Banco Popular', numeroCuenta: '8899001122678', numeroCuentaMasked: '*****2678', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 12, pais: 'Colombia', banco: 'Banco de Occidente', numeroCuenta: '2233445567990', numeroCuentaMasked: '*****7990', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 13, pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '6655443321034', numeroCuentaMasked: '*****1034', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 14, pais: 'Colombia', banco: 'BBVA Colombia', numeroCuenta: '9900112234567', numeroCuentaMasked: '*****4567', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 15, pais: 'Colombia', banco: 'Davivienda', numeroCuenta: '1144556678901', numeroCuentaMasked: '*****8901', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 16, pais: 'Colombia', banco: 'Banco Agrario', numeroCuenta: '7788990012345', numeroCuentaMasked: '*****2345', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 17, pais: 'Colombia', banco: 'Banco Caja Social', numeroCuenta: '3344556678123', numeroCuentaMasked: '*****8123', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 18, pais: 'Colombia', banco: 'Nequi', numeroCuenta: '3109988774512', numeroCuentaMasked: '*****4512', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 19, pais: 'Colombia', banco: 'Banco de Bogota', numeroCuenta: '5544332267890', numeroCuentaMasked: '*****7890', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
    { id: 20, pais: 'Colombia', banco: 'Bancolombia', numeroCuenta: '8877665543210', numeroCuentaMasked: '*****3210', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 21, pais: 'Colombia', banco: 'Banco Popular', numeroCuenta: '6655778899001', numeroCuentaMasked: '*****9001', tipoCuenta: 'Ahorro', identificacion: 'CC: 11142536363' },
    { id: 22, pais: 'Colombia', banco: 'BBVA Colombia', numeroCuenta: '2211334455667', numeroCuentaMasked: '*****5667', tipoCuenta: 'Corriente', identificacion: 'CC: 11142536363' },
  ];

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.cuentas.length / this.pageSize));
  }

  get pagedCuentas(): CuentaBancaria[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.cuentas.slice(start, start + this.pageSize);
  }

  get progressPct(): number {
    return (this.currentPage / this.totalPages) * 100;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
  }

  onAgregar(): void {
    this.notify('Funcionalidad de agregar cuenta bancaria proximamente disponible', 'info');
  }

  onEdit(cuenta: CuentaBancaria): void {
    this.notify(`Editando cuenta ${cuenta.numeroCuentaMasked}`, 'info');
  }

  onDelete(cuenta: CuentaBancaria): void {
    this.cuentas = this.cuentas.filter(c => c.id !== cuenta.id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.notify('Cuenta bancaria eliminada correctamente', 'success');
  }

  private notify(msg: string, type: 'success' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }
}
