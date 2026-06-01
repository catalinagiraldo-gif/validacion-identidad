import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface OrderStat {
  icon: string;
  count: number;
  label: string;
  color: string;
}

interface ReportButton {
  label: string;
  icon: string;
}

interface ChartPoint {
  hour: string;
  value: number;
}

@Component({
  selector: 'app-dashboard-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item">Home</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item">Reportes</span>
        <span class="breadcrumb-separator">></span>
        <span class="breadcrumb-item breadcrumb-active">Dashboard</span>
      </nav>

      <!-- Two-column layout -->
      <div class="dashboard-layout">
        <!-- LEFT: Profile Card -->
        <aside class="profile-card">
          <div class="profile-card__watermark">
            <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="30" font-family="Inter, sans-serif" font-size="28" font-weight="700"
                    fill="rgba(255,255,255,0.12)">dropi</text>
            </svg>
          </div>

          <!-- Period selector -->
          <div class="profile-card__header">
            <div class="period-selector">
              <i class="pi pi-calendar"></i>
              <span>Ultimos 30 dias</span>
              <i class="pi pi-chevron-down"></i>
            </div>
            <button class="btn-download">
              <i class="pi pi-download"></i>
            </button>
          </div>

          <!-- Avatar -->
          <div class="profile-card__avatar">
            <div class="avatar-circle">
              <span class="avatar-initials">MC</span>
            </div>
          </div>

          <!-- Name -->
          <h2 class="profile-card__name">Maria Carolina<br>Hernandez Rodriguez</h2>

          <!-- Date range -->
          <p class="profile-card__date">Tus ventas en Dropi 07/01/2026 - 07/02/2026</p>

          <!-- Sales highlight -->
          <div class="profile-card__sales">
            <span class="sales-amount">\$27.983.700</span>
            <span class="sales-separator">/</span>
            <span class="sales-orders">1.654 ordenes</span>
          </div>

          <!-- Effectiveness gauge -->
          <div class="profile-card__gauge">
            <svg class="gauge-svg" viewBox="0 0 120 120">
              <!-- Background circle -->
              <circle cx="60" cy="60" r="50" fill="none"
                      stroke="rgba(255,255,255,0.2)" stroke-width="8"/>
              <!-- Progress arc (92%) -->
              <circle cx="60" cy="60" r="50" fill="none"
                      stroke="#ffffff" stroke-width="8"
                      stroke-linecap="round"
                      stroke-dasharray="289.03"
                      [attr.stroke-dashoffset]="289.03 * (1 - 0.92)"
                      transform="rotate(-90 60 60)"/>
            </svg>
            <div class="gauge-label">
              <span class="gauge-value">92%</span>
              <span class="gauge-text">de efectividad</span>
            </div>
          </div>
        </aside>

        <!-- RIGHT: Stats & Charts -->
        <main class="dashboard-content">
          <!-- Tus ordenes -->
          <section class="orders-section">
            <div class="section-header">
              <h2 class="section-title">Tus ordenes</h2>
              <a class="link-more" href="javascript:void(0)">Mas informacion</a>
            </div>

            <div class="stats-grid">
              <div class="stat-card" *ngFor="let stat of orderStats"
                   [style.--stat-color]="stat.color">
                <div class="stat-card__icon">
                  <i [class]="'pi ' + stat.icon"></i>
                </div>
                <span class="stat-card__count">{{ stat.count | number }}</span>
                <span class="stat-card__label">{{ stat.label }}</span>
              </div>
            </div>
          </section>

          <!-- Tendencia de Ventas chart -->
          <section class="chart-section">
            <div class="section-header">
              <h2 class="section-title">Tendencia de Ventas</h2>
              <div class="chart-legend">
                <span class="legend-item legend-item--today">
                  <span class="legend-dot"></span> Hoy
                </span>
                <span class="legend-item legend-item--yesterday">
                  <span class="legend-dot"></span> Ayer
                </span>
              </div>
            </div>

            <div class="chart-stats">
              <div class="chart-stat">
                <span class="chart-stat__value">23</span>
                <span class="chart-stat__label">Ordenes</span>
              </div>
              <div class="chart-stat">
                <span class="chart-stat__value">18</span>
                <span class="chart-stat__label">Productos</span>
              </div>
            </div>

            <div class="chart-container">
              <!-- SVG Line Chart -->
              <svg class="line-chart" viewBox="0 0 700 200" preserveAspectRatio="xMidYMid meet">
                <!-- Grid lines -->
                <line *ngFor="let y of gridLines" x1="40" [attr.y1]="y" x2="680" [attr.y2]="y"
                      stroke="#EEF0F4" stroke-width="1"/>

                <!-- Y-axis labels -->
                <text x="35" y="180" text-anchor="end" class="chart-label">\$0</text>
                <text x="35" y="140" text-anchor="end" class="chart-label">\$10k</text>
                <text x="35" y="100" text-anchor="end" class="chart-label">\$20k</text>
                <text x="35" y="60" text-anchor="end" class="chart-label">\$30k</text>

                <!-- X-axis labels -->
                <text *ngFor="let label of xLabels; let i = index"
                      [attr.x]="55 + i * 83" y="198" text-anchor="middle" class="chart-label">
                  {{ label }}
                </text>

                <!-- Yesterday line (gray) -->
                <polyline [attr.points]="yesterdayPath" fill="none"
                          stroke="#C3C9D9" stroke-width="2" stroke-linecap="round"
                          stroke-linejoin="round"/>

                <!-- Today line (orange) -->
                <polyline [attr.points]="todayPath" fill="none"
                          stroke="#FF6102" stroke-width="2.5" stroke-linecap="round"
                          stroke-linejoin="round"/>

                <!-- Today area fill -->
                <polygon [attr.points]="todayAreaPath"
                         fill="url(#orangeGradient)" opacity="0.15"/>

                <!-- Gradient definition -->
                <defs>
                  <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#FF6102" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#FF6102" stop-opacity="0"/>
                  </linearGradient>
                </defs>
              </svg>

              <!-- Tooltip -->
              <div class="chart-tooltip">
                <div class="tooltip-row tooltip-row--today">
                  <span class="tooltip-dot"></span>
                  <span>Hoy: 32 ordenes <strong>\$932,300</strong></span>
                </div>
                <div class="tooltip-row tooltip-row--yesterday">
                  <span class="tooltip-dot"></span>
                  <span>Ayer: 8 ordenes <strong>\$863,630</strong></span>
                </div>
              </div>
            </div>
          </section>

          <!-- Tus reportes -->
          <section class="reports-section">
            <h2 class="section-title">Tus reportes</h2>
            <div class="reports-grid">
              <button class="report-btn" *ngFor="let report of reports">
                <i [class]="'pi ' + report.icon"></i>
                <span>{{ report.label }}</span>
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  `,
})
export class DashboardNewComponent {
  orderStats: OrderStat[] = [
    { icon: 'pi-check-circle', count: 12, label: 'Por confirmar', color: '#50A5F1' },
    { icon: 'pi-clock', count: 25, label: 'Pendientes', color: '#F1B44C' },
    { icon: 'pi-file', count: 46, label: 'Guias generadas', color: '#0ABB87' },
    { icon: 'pi-truck', count: 31, label: 'En curso', color: '#008DBF' },
    { icon: 'pi-exclamation-triangle', count: 3, label: 'Con novedad', color: '#F46A6B' },
    { icon: 'pi-box', count: 1534, label: 'Entregadas', color: '#0ABB87' },
  ];

  reports: ReportButton[] = [
    { label: 'Productos', icon: 'pi-box' },
    { label: 'Torre logistica', icon: 'pi-building' },
    { label: 'Roax', icon: 'pi-chart-bar' },
    { label: 'Calendario', icon: 'pi-calendar' },
  ];

  // Chart data
  xLabels = ['08', '10', '12', '14', '16', '18', '20', '22'];

  gridLines = [60, 100, 140, 180];

  // Today's data points (mapped to SVG coordinates)
  todayData: ChartPoint[] = [
    { hour: '08', value: 170 },
    { hour: '10', value: 145 },
    { hour: '12', value: 110 },
    { hour: '14', value: 80 },
    { hour: '16', value: 95 },
    { hour: '18', value: 70 },
    { hour: '20', value: 100 },
    { hour: '22', value: 130 },
  ];

  // Yesterday's data points
  yesterdayData: ChartPoint[] = [
    { hour: '08', value: 165 },
    { hour: '10', value: 155 },
    { hour: '12', value: 140 },
    { hour: '14', value: 130 },
    { hour: '16', value: 145 },
    { hour: '18', value: 135 },
    { hour: '20', value: 150 },
    { hour: '22', value: 160 },
  ];

  get todayPath(): string {
    return this.todayData
      .map((p, i) => `${55 + i * 83},${p.value}`)
      .join(' ');
  }

  get yesterdayPath(): string {
    return this.yesterdayData
      .map((p, i) => `${55 + i * 83},${p.value}`)
      .join(' ');
  }

  get todayAreaPath(): string {
    const points = this.todayData.map((p, i) => `${55 + i * 83},${p.value}`);
    const lastX = 55 + (this.todayData.length - 1) * 83;
    const firstX = 55;
    return `${points.join(' ')} ${lastX},180 ${firstX},180`;
  }
}
