import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ProductStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  trend: string;
  trendUp: boolean;
}

interface TopProduct {
  rank: number;
  name: string;
  sku: string;
  sales: number;
  revenue: string;
  margin: string;
}

@Component({
  selector: 'app-dashboard-productos-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-productos.component.scss'],
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
        <span class="breadcrumb-item">Dashboard Productos</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Dashboard Productos</h1>

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

      <!-- Top Products Table -->
      <section class="table-section">
        <div class="section-header">
          <h2 class="section-title">Top Productos</h2>
          <span class="section-subtitle">Ultimos 30 dias</span>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>SKU</th>
                <th>Ventas</th>
                <th>Ingresos</th>
                <th>Margen</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let product of topProducts; let i = index"
                  [style.animation-delay]="i * 0.04 + 's'"
                  class="table-row">
                <td class="rank-cell">
                  <span class="rank-badge" [class.top3]="product.rank <= 3">
                    {{ product.rank }}
                  </span>
                </td>
                <td class="product-name">{{ product.name }}</td>
                <td class="sku-cell">{{ product.sku }}</td>
                <td>{{ product.sales | number }}</td>
                <td class="revenue-cell">{{ product.revenue }}</td>
                <td>
                  <span class="margin-badge">{{ product.margin }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class DashboardProductosNewComponent {
  stats: ProductStat[] = [
    { label: 'Productos activos', value: '1,247', icon: 'pi-box', color: '#008DBF', trend: '+12%', trendUp: true },
    { label: 'Nuevos este mes', value: '89', icon: 'pi-plus-circle', color: '#0ABB87', trend: '+23%', trendUp: true },
    { label: 'Sin stock', value: '34', icon: 'pi-exclamation-triangle', color: '#F46A6B', trend: '-5%', trendUp: false },
  ];

  topProducts: TopProduct[] = [
    { rank: 1, name: 'Serum Facial Vitamina C 30ml', sku: 'SKU-001', sales: 487, revenue: '$14.610.000', margin: '42%' },
    { rank: 2, name: 'Faja Colombiana Reductora Talla M', sku: 'SKU-015', sales: 412, revenue: '$20.600.000', margin: '38%' },
    { rank: 3, name: 'Kit Cuidado Capilar Keratina', sku: 'SKU-008', sales: 356, revenue: '$10.680.000', margin: '45%' },
    { rank: 4, name: 'Reloj Inteligente Sport GT', sku: 'SKU-022', sales: 298, revenue: '$17.880.000', margin: '35%' },
    { rank: 5, name: 'Zapatillas Running Air Pro', sku: 'SKU-031', sales: 267, revenue: '$13.350.000', margin: '40%' },
    { rank: 6, name: 'Crema Corporal Hidratante 500ml', sku: 'SKU-004', sales: 234, revenue: '$4.680.000', margin: '48%' },
    { rank: 7, name: 'Audifonos Bluetooth TWS', sku: 'SKU-019', sales: 201, revenue: '$6.030.000', margin: '52%' },
    { rank: 8, name: 'Billetera Cuero Genuino', sku: 'SKU-027', sales: 189, revenue: '$7.560.000', margin: '44%' },
    { rank: 9, name: 'Perfume Inspiracion Premium 100ml', sku: 'SKU-012', sales: 176, revenue: '$8.800.000', margin: '55%' },
    { rank: 10, name: 'Gafas Sol Polarizadas UV400', sku: 'SKU-035', sales: 154, revenue: '$4.620.000', margin: '50%' },
  ];
}
