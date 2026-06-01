import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ClientStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend: string;
  trendUp: boolean;
}

interface TopClient {
  rank: number;
  name: string;
  city: string;
  orders: number;
  totalSpent: string;
  lastOrder: string;
}

@Component({
  selector: 'app-dashboard-clientes-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-clientes.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">
          <i class="pi pi-home"></i>
        </span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item muted">Reportes</span>
        <span class="breadcrumb-separator">
          <i class="pi pi-chevron-down"></i>
        </span>
        <span class="breadcrumb-item">Dashboard Clientes</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Dashboard Clientes</h1>

      <!-- Stat Cards -->
      <div class="stats-grid">
        <div class="stat-card" *ngFor="let stat of stats; let i = index"
             [style.animation-delay]="i * 0.08 + 's'">
          <div class="stat-card__icon" [style.background]="stat.color + '15'"
               [style.color]="stat.color">
            <i [class]="'pi ' + stat.icon"></i>
          </div>
          <div class="stat-card__info">
            <span class="stat-card__value">{{ stat.value }}</span>
            <span class="stat-card__label">{{ stat.label }}</span>
          </div>
          <span class="stat-card__trend"
                [class.up]="stat.trendUp"
                [class.down]="!stat.trendUp">
            <i [class]="stat.trendUp ? 'pi pi-arrow-up' : 'pi pi-arrow-down'"></i>
            {{ stat.trend }}
          </span>
        </div>
      </div>

      <!-- Top Clients Table -->
      <section class="table-section">
        <div class="section-header">
          <h2 class="section-title">Top Clientes</h2>
          <span class="section-subtitle">Por volumen de compra</span>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Ciudad</th>
                <th>Pedidos</th>
                <th>Total gastado</th>
                <th>Ultimo pedido</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let client of topClients; let i = index"
                  [style.animation-delay]="i * 0.04 + 's'"
                  class="table-row">
                <td class="rank-cell">
                  <span class="rank-badge" [class.top3]="client.rank <= 3">
                    {{ client.rank }}
                  </span>
                </td>
                <td class="client-name">{{ client.name }}</td>
                <td>{{ client.city }}</td>
                <td>{{ client.orders | number }}</td>
                <td class="spent-cell">{{ client.totalSpent }}</td>
                <td class="date-cell">{{ client.lastOrder }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class DashboardClientesNewComponent {
  stats: ClientStat[] = [
    { label: 'Clientes totales', value: '3,842', icon: 'pi-users', color: '#008DBF', trend: '+8%', trendUp: true },
    { label: 'Nuevos este mes', value: '214', icon: 'pi-user-plus', color: '#0ABB87', trend: '+15%', trendUp: true },
    { label: 'Tasa de recompra', value: '34%', icon: 'pi-replay', color: '#F1B44C', trend: '+3%', trendUp: true },
  ];

  topClients: TopClient[] = [
    { rank: 1, name: 'Paola Angulo Martinez', city: 'Bogota', orders: 47, totalSpent: '$4.230.000', lastOrder: '28/05/2026' },
    { rank: 2, name: 'Carlos Eduardo Ramirez', city: 'Medellin', orders: 38, totalSpent: '$3.810.000', lastOrder: '30/05/2026' },
    { rank: 3, name: 'Andrea Lopez Gutierrez', city: 'Cali', orders: 35, totalSpent: '$3.150.000', lastOrder: '27/05/2026' },
    { rank: 4, name: 'Juan Pablo Perez', city: 'Barranquilla', orders: 29, totalSpent: '$2.610.000', lastOrder: '25/05/2026' },
    { rank: 5, name: 'Sofia Hernandez Rios', city: 'Bucaramanga', orders: 26, totalSpent: '$2.340.000', lastOrder: '29/05/2026' },
    { rank: 6, name: 'Miguel Angel Torres', city: 'Cartagena', orders: 24, totalSpent: '$2.160.000', lastOrder: '26/05/2026' },
    { rank: 7, name: 'Valentina Castro Munoz', city: 'Pereira', orders: 21, totalSpent: '$1.890.000', lastOrder: '24/05/2026' },
    { rank: 8, name: 'Andres Felipe Morales', city: 'Manizales', orders: 19, totalSpent: '$1.710.000', lastOrder: '23/05/2026' },
    { rank: 9, name: 'Isabella Ruiz Cardona', city: 'Ibague', orders: 17, totalSpent: '$1.530.000', lastOrder: '22/05/2026' },
    { rank: 10, name: 'Sebastian Diaz Londono', city: 'Cucuta', orders: 15, totalSpent: '$1.350.000', lastOrder: '20/05/2026' },
  ];
}
