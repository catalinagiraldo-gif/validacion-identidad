import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CalendarEvent {
  day: number;
  orders: number;
  revenue: string;
  hasNovedad: boolean;
}

interface CalendarStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-calendario-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-calendario.component.scss'],
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
        <span class="breadcrumb-item">Calendario</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Calendario</h1>

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
        </div>
      </div>

      <!-- Calendar Grid -->
      <section class="calendar-section">
        <div class="calendar-header">
          <button class="nav-btn" (click)="prevMonth()">
            <i class="pi pi-chevron-left"></i>
          </button>
          <h2 class="calendar-month">{{ monthLabel }}</h2>
          <button class="nav-btn" (click)="nextMonth()">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>

        <div class="calendar-weekdays">
          <span *ngFor="let day of weekdays" class="weekday">{{ day }}</span>
        </div>

        <div class="calendar-grid">
          <!-- Empty cells for offset -->
          <div *ngFor="let _ of offsetDays" class="calendar-cell calendar-cell--empty"></div>

          <!-- Day cells -->
          <div *ngFor="let event of calendarEvents"
               class="calendar-cell"
               [class.has-orders]="event.orders > 0"
               [class.has-novedad]="event.hasNovedad"
               [class.today]="event.day === todayDay">
            <span class="cell-day">{{ event.day }}</span>
            <div class="cell-info" *ngIf="event.orders > 0">
              <span class="cell-orders">{{ event.orders }} ord.</span>
              <span class="cell-revenue">{{ event.revenue }}</span>
            </div>
            <span class="novedad-dot" *ngIf="event.hasNovedad"></span>
          </div>
        </div>

        <div class="calendar-legend">
          <span class="legend-item">
            <span class="legend-dot legend-dot--orders"></span> Con ordenes
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-dot--novedad"></span> Con novedades
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-dot--today"></span> Hoy
          </span>
        </div>
      </section>
    </div>
  `,
})
export class DashboardCalendarioNewComponent {
  weekdays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
  monthLabel = 'Mayo 2026';
  todayDay = 31;

  // May 2026 starts on Friday (offset = 4 empty cells for Mon-Thu)
  offsetDays = new Array(4);

  stats: CalendarStat[] = [
    { label: 'Ordenes del mes', value: '1,247', icon: 'pi-shopping-cart', color: '#008DBF' },
    { label: 'Dias con ventas', value: '28/31', icon: 'pi-calendar', color: '#0ABB87' },
    { label: 'Promedio diario', value: '44.5', icon: 'pi-chart-line', color: '#F1B44C' },
  ];

  calendarEvents: CalendarEvent[] = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const orders = day <= 30 ? Math.floor(Math.random() * 60) + 10 : Math.floor(Math.random() * 30) + 5;
    return {
      day,
      orders,
      revenue: `$${(orders * 45000).toLocaleString('es-CO')}`,
      hasNovedad: [3, 7, 12, 18, 23, 28].includes(day),
    };
  });

  prevMonth(): void {
    // placeholder navigation
  }

  nextMonth(): void {
    // placeholder navigation
  }
}
