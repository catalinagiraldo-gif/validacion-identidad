import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IdentityProfileService } from '../../../../common/services/identity-profile.service';
import { IdentityBlockBannerComponent } from '../../../../common/components/identity-block-banner/identity-block-banner.component';
import { ToastService } from '../../../../common/services/toast.service';

interface Transaction {
  date: string;
  motivo: string;
  estadoBanco: string;
  amount: number;
  info: string;
  carrier: string;
  carrierType: 'Enviar' | 'Recoger';
  tipo: 'Retiro' | 'Abono';
  status: 'Cancelado' | 'Aprobado' | 'Pendiente';
  expanded: boolean;
}

@Component({
  selector: 'app-wallet-new',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityBlockBannerComponent],
  styleUrls: ['./wallet.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Financiero</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Wallet</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Historial de wallet</span>
      </nav>

      <!-- Page header -->
      <div class="page-header">
        <h1 class="page-title">Historial de wallet</h1>
        <div class="page-header__actions">
          <button class="btn-secondary" (click)="onTransferir()">
            <i class="pi pi-arrows-h"></i>
            <span>Transferir entre cuentas</span>
          </button>
          <button class="btn-primary">
            <i class="pi pi-download"></i>
            <span>Retirar</span>
          </button>
          <button class="btn-tertiary">
            <i class="pi pi-file-export"></i>
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <app-identity-block-banner [motivo]="identity.bloqueoMotivo()" contexto="transferencia"></app-identity-block-banner>

      <!-- Info banner -->
      <div class="info-banner">
        <div class="info-banner__icon">
          <i class="pi pi-info-circle"></i>
        </div>
        <p class="info-banner__text">
          Tu saldo disponible es <strong>&#36;{{ saldoDisponible | number }}</strong>.
          El monto minimo de retiro es <strong>&#36;{{ montoMinRetiro | number }}</strong>.
          Los retiros se procesan en un plazo de 1 a 3 dias habiles dependiendo de tu entidad bancaria.
        </p>
      </div>

      <!-- Main tabs -->
      <div class="tabs-main">
        <button
          *ngFor="let tab of mainTabs; let i = index"
          class="tab-main"
          [class.tab-main--active]="activeMainTab === i"
          (click)="activeMainTab = i"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-bar__left">
          <div class="select-wrapper">
            <select [(ngModel)]="tipoTransaccion">
              <option value="">Tipo de transaccion</option>
              <option value="Retiro">Retiro</option>
              <option value="Abono">Abono</option>
              <option value="Transferencia">Transferencia</option>
            </select>
            <i class="pi pi-chevron-down select-icon"></i>
          </div>
          <div class="date-range">
            <div class="date-input-wrapper">
              <i class="pi pi-calendar date-icon"></i>
              <input type="text" placeholder="Fecha inicio" [(ngModel)]="fechaInicio" />
            </div>
            <span class="date-separator">-</span>
            <div class="date-input-wrapper">
              <i class="pi pi-calendar date-icon"></i>
              <input type="text" placeholder="Fecha fin" [(ngModel)]="fechaFin" />
            </div>
          </div>
        </div>
        <div class="filter-bar__right">
          <div class="search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar por Id transaccion"
              [(ngModel)]="searchQuery"
            />
          </div>
        </div>
      </div>

      <!-- Expand checkbox -->
      <div class="expand-row">
        <label class="custom-checkbox">
          <input type="checkbox" [(ngModel)]="expandAll" (change)="toggleExpandAll()" />
          <span class="checkmark"></span>
        </label>
        <span class="expand-label">Expandir</span>
      </div>

      <!-- Sub-tabs -->
      <div class="tabs-sub">
        <button
          *ngFor="let tab of subTabs; let i = index"
          class="tab-sub"
          [class.tab-sub--active]="activeSubTab === i"
          (click)="activeSubTab = i"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="wallet-table">
          <thead>
            <tr>
              <th class="col-date">Fecha de transaccion</th>
              <th class="col-motivo">Motivo</th>
              <th class="col-estado-banco">Estado banco</th>
              <th class="col-valor">Valor</th>
              <th class="col-info">Informacion</th>
              <th class="col-carrier">Transportadora</th>
              <th class="col-tipo">Tipo</th>
              <th class="col-status">Estado</th>
              <th class="col-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let tx of filteredTransactions; let i = index">
              <tr
                class="tx-row"
                [style.animation-delay]="i * 40 + 'ms'"
              >
                <td class="col-date">
                  <span class="tx-date">{{ tx.date }}</span>
                </td>
                <td class="col-motivo">
                  <span class="tx-motivo">{{ tx.motivo }}</span>
                </td>
                <td class="col-estado-banco">
                  <span class="tx-estado-banco">{{ tx.estadoBanco }}</span>
                </td>
                <td class="col-valor">
                  <span class="tx-amount" [class.tx-amount--negative]="tx.tipo === 'Retiro'">
                    {{ tx.tipo === 'Retiro' ? '-' : '+' }}&#36;{{ tx.amount | number }}
                  </span>
                </td>
                <td class="col-info">
                  <span class="tx-info">{{ tx.info }}</span>
                </td>
                <td class="col-carrier">
                  <div class="carrier-cell">
                    <span class="carrier-badge" [class.carrier-badge--enviar]="tx.carrierType === 'Enviar'" [class.carrier-badge--recoger]="tx.carrierType === 'Recoger'">
                      <i class="pi" [class.pi-send]="tx.carrierType === 'Enviar'" [class.pi-box]="tx.carrierType === 'Recoger'"></i>
                      {{ tx.carrierType }}
                    </span>
                    <span class="carrier-name">{{ tx.carrier }}</span>
                  </div>
                </td>
                <td class="col-tipo">
                  <span class="tx-tipo">{{ tx.tipo }}</span>
                </td>
                <td class="col-status">
                  <span
                    class="status-badge"
                    [class.status-badge--cancelado]="tx.status === 'Cancelado'"
                    [class.status-badge--aprobado]="tx.status === 'Aprobado'"
                    [class.status-badge--pendiente]="tx.status === 'Pendiente'"
                  >
                    {{ tx.status }}
                  </span>
                </td>
                <td class="col-actions">
                  <div class="action-icons">
                    <button class="action-icon-btn" aria-label="Ver detalle" (click)="tx.expanded = !tx.expanded">
                      <i class="pi" [class.pi-chevron-down]="!tx.expanded" [class.pi-chevron-up]="tx.expanded"></i>
                    </button>
                    <button class="action-icon-btn" aria-label="Ver">
                      <i class="pi pi-eye"></i>
                    </button>
                    <button class="action-icon-btn" aria-label="Mas opciones">
                      <i class="pi pi-ellipsis-v"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Expanded row -->
              <tr class="tx-expanded-row" *ngIf="tx.expanded">
                <td colspan="9">
                  <div class="tx-expanded-content">
                    <div class="tx-expanded-detail">
                      <span class="detail-label">Fecha:</span>
                      <span class="detail-value">{{ tx.date }}</span>
                    </div>
                    <div class="tx-expanded-detail">
                      <span class="detail-label">Motivo:</span>
                      <span class="detail-value">{{ tx.motivo }}</span>
                    </div>
                    <div class="tx-expanded-detail">
                      <span class="detail-label">Informacion:</span>
                      <span class="detail-value">{{ tx.info }}</span>
                    </div>
                    <div class="tx-expanded-detail">
                      <span class="detail-label">Transportadora:</span>
                      <span class="detail-value">{{ tx.carrier }} ({{ tx.carrierType }})</span>
                    </div>
                    <div class="tx-expanded-detail">
                      <span class="detail-label">Valor:</span>
                      <span class="detail-value">&#36;{{ tx.amount | number }}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
    </div>
  `,
})
export class WalletNewComponent {
  readonly identity = inject(IdentityProfileService);
  private toast = inject(ToastService);

  saldoDisponible = 245800;
  montoMinRetiro = 50000;

  mainTabs = ['Historial de Wallet', 'Depositos manuales', 'Transacciones en billetera'];
  activeMainTab = 0;

  subTabs = ['Transacciones en wallet', 'Bandejas de retiro'];
  activeSubTab = 0;

  tipoTransaccion = '';
  fechaInicio = '';
  fechaFin = '';
  searchQuery = '';
  expandAll = false;

  transactions: Transaction[] = [
    {
      date: '08/12/26 at 09 a.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Procesado',
      amount: 18000,
      info: 'DE FALTA POR UN DATO CALI LA FRIDA (VMD) ENVIO NACIONAL',
      carrier: 'CC 1045...',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Cancelado',
      expanded: false,
    },
    {
      date: '08/12/26 at 09 a.m.',
      motivo: 'Abono garantia',
      estadoBanco: 'Aprobado',
      amount: 81805,
      info: 'DE FALTA POR GARANTIA EN LA FRIDA (VMD) ENVIO NACIONAL',
      carrier: 'RAPIDEX',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '08/12/26 at 09 a.m.',
      motivo: 'Transferencia saliente',
      estadoBanco: 'Procesado',
      amount: 45000,
      info: 'PAGO POR TRANSFERENCIA EN LA FRIDA (VMD) ENVIO NACIONAL',
      carrier: 'EXPRESS',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '07/12/26 at 02 p.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Pendiente',
      amount: 32500,
      info: 'PEDIDO #38291 BOGOTA CENTRO MAYOR',
      carrier: 'SERVIENTREGA',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Pendiente',
      expanded: false,
    },
    {
      date: '07/12/26 at 11 a.m.',
      motivo: 'Abono por venta',
      estadoBanco: 'Aprobado',
      amount: 125000,
      info: 'VENTA PRODUCTO SKU-4521 MEDELLIN LAURELES',
      carrier: 'INTERRAPIDISIMO',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '06/12/26 at 04 p.m.',
      motivo: 'Retiro bancario',
      estadoBanco: 'Procesado',
      amount: 200000,
      info: 'RETIRO A CUENTA BANCOLOMBIA ****4589',
      carrier: 'N/A',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '06/12/26 at 10 a.m.',
      motivo: 'Abono garantia',
      estadoBanco: 'Aprobado',
      amount: 55200,
      info: 'GARANTIA APROBADA PEDIDO #38102 CALI NORTE',
      carrier: 'COORDINADORA',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '05/12/26 at 08 a.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Procesado',
      amount: 67800,
      info: 'DESPACHO PRODUCTO ELECTRONICO BARRANQUILLA',
      carrier: 'TCC',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Cancelado',
      expanded: false,
    },
    {
      date: '05/12/26 at 03 p.m.',
      motivo: 'Transferencia entrante',
      estadoBanco: 'Aprobado',
      amount: 350000,
      info: 'TRANSFERENCIA DESDE WALLET SECUNDARIA',
      carrier: 'N/A',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '04/12/26 at 09 a.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Procesado',
      amount: 28900,
      info: 'ENVIO COSMETICOS BUCARAMANGA CABECERA',
      carrier: 'ENVIA',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '04/12/26 at 01 p.m.',
      motivo: 'Abono por venta',
      estadoBanco: 'Aprobado',
      amount: 94500,
      info: 'VENTA MAYORISTA LOTE 12 UNIDADES PEREIRA',
      carrier: 'SERVIENTREGA',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '03/12/26 at 05 p.m.',
      motivo: 'Retiro bancario',
      estadoBanco: 'Rechazado',
      amount: 150000,
      info: 'RETIRO A NEQUI ****7821 FONDOS INSUFICIENTES',
      carrier: 'N/A',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Cancelado',
      expanded: false,
    },
    {
      date: '03/12/26 at 10 a.m.',
      motivo: 'Abono garantia',
      estadoBanco: 'Aprobado',
      amount: 41300,
      info: 'GARANTIA PARCIAL PEDIDO #37998 CARTAGENA',
      carrier: 'RAPIDEX',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '02/12/26 at 02 p.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Procesado',
      amount: 53200,
      info: 'DESPACHO ROPA DEPORTIVA MANIZALES CENTRO',
      carrier: 'COORDINADORA',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '02/12/26 at 08 a.m.',
      motivo: 'Abono por venta',
      estadoBanco: 'Aprobado',
      amount: 178400,
      info: 'VENTA PRODUCTO PREMIUM SKU-8910 BOGOTA USAQUEN',
      carrier: 'TCC',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '01/12/26 at 04 p.m.',
      motivo: 'Transferencia saliente',
      estadoBanco: 'Procesado',
      amount: 80000,
      info: 'TRANSFERENCIA A CUENTA PROVEEDOR #4521',
      carrier: 'N/A',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '01/12/26 at 11 a.m.',
      motivo: 'Abono por venta',
      estadoBanco: 'Aprobado',
      amount: 62700,
      info: 'VENTA ACCESORIOS TECNOLOGICOS IBAGUE',
      carrier: 'INTERRAPIDISIMO',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '30/11/26 at 09 a.m.',
      motivo: 'Pago de pedido',
      estadoBanco: 'Procesado',
      amount: 36100,
      info: 'ENVIO PRODUCTOS BELLEZA SANTA MARTA',
      carrier: 'ENVIA',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Pendiente',
      expanded: false,
    },
    {
      date: '30/11/26 at 03 p.m.',
      motivo: 'Abono garantia',
      estadoBanco: 'Aprobado',
      amount: 29800,
      info: 'GARANTIA COMPLETA PEDIDO #37850 VILLAVICENCIO',
      carrier: 'SERVIENTREGA',
      carrierType: 'Recoger',
      tipo: 'Abono',
      status: 'Aprobado',
      expanded: false,
    },
    {
      date: '29/11/26 at 10 a.m.',
      motivo: 'Retiro bancario',
      estadoBanco: 'Procesado',
      amount: 500000,
      info: 'RETIRO MENSUAL A DAVIVIENDA ****3367',
      carrier: 'N/A',
      carrierType: 'Enviar',
      tipo: 'Retiro',
      status: 'Aprobado',
      expanded: false,
    },
  ];

  get filteredTransactions(): Transaction[] {
    let filtered = this.transactions;

    if (this.tipoTransaccion) {
      filtered = filtered.filter(tx => tx.tipo === this.tipoTransaccion);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(
        tx =>
          tx.info.toLowerCase().includes(q) ||
          tx.carrier.toLowerCase().includes(q) ||
          tx.motivo.toLowerCase().includes(q) ||
          tx.amount.toString().includes(q)
      );
    }

    return filtered;
  }

  toggleExpandAll(): void {
    this.transactions.forEach(tx => (tx.expanded = this.expandAll));
  }

  onTransferir(): void {
    if (this.identity.transferenciasBloqueadas()) {
      this.toast.warning('Completa tu validación de identidad para poder transferir entre cuentas.');
      return;
    }
    this.toast.success('Transferencia entre cuentas iniciada.');
  }
}
