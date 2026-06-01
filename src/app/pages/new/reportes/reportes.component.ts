import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ReporteStat {
  label: string;
  value: string;
  icon: string;
  color: string;
  description: string;
}

interface ReporteItem {
  id: number;
  name: string;
  category: string;
  period: string;
  generatedDate: string;
  format: string;
  status: 'disponible' | 'programado' | 'generando';
}

@Component({
  selector: 'app-reportes-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./reportes.component.scss'],
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
        <span class="breadcrumb-item">Reportes</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Reportes</h1>

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
            <span class="stat-card__desc">{{ stat.description }}</span>
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <section class="table-section">
        <div class="section-header">
          <h2 class="section-title">Reportes Disponibles</h2>
          <button class="btn-generate" (click)="onGenerate()">
            <i class="pi pi-plus"></i>
            Generar reporte
          </button>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoria</th>
                <th>Periodo</th>
                <th>Generado</th>
                <th>Formato</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of reportes; let i = index"
                  [style.animation-delay]="i * 0.04 + 's'"
                  class="table-row">
                <td class="id-cell">#{{ item.id }}</td>
                <td class="name-cell">{{ item.name }}</td>
                <td>
                  <span class="category-badge" [attr.data-cat]="item.category">
                    {{ item.category }}
                  </span>
                </td>
                <td>{{ item.period }}</td>
                <td class="date-cell">{{ item.generatedDate }}</td>
                <td>
                  <span class="format-badge">{{ item.format }}</span>
                </td>
                <td>
                  <span class="status-badge"
                        [class.disponible]="item.status === 'disponible'"
                        [class.programado]="item.status === 'programado'"
                        [class.generando]="item.status === 'generando'">
                    {{ item.status === 'disponible' ? 'Disponible' : item.status === 'programado' ? 'Programado' : 'Generando' }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="icon-btn" title="Descargar"
                            [disabled]="item.status !== 'disponible'"
                            (click)="onDownload(item)">
                      <i class="pi pi-download"></i>
                    </button>
                    <button class="icon-btn" title="Ver"
                            (click)="onView(item)">
                      <i class="pi pi-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class ReportesNewComponent {
  stats: ReporteStat[] = [
    { label: 'Reportes generados', value: '156', icon: 'pi-file', color: '#008DBF', description: 'Este mes' },
    { label: 'Reportes programados', value: '8', icon: 'pi-clock', color: '#F1B44C', description: 'Pendientes de generacion' },
    { label: 'Descargas totales', value: '1,203', icon: 'pi-download', color: '#0ABB87', description: 'Ultimos 30 dias' },
  ];

  reportes: ReporteItem[] = [
    { id: 901, name: 'Resumen de Ventas Semanal', category: 'Ventas', period: 'Sem 22 - Mayo 2026', generatedDate: '31/05/2026', format: 'Excel', status: 'disponible' },
    { id: 900, name: 'Inventario por Proveedor', category: 'Inventario', period: 'Mayo 2026', generatedDate: '31/05/2026', format: 'Excel', status: 'generando' },
    { id: 899, name: 'Efectividad de Entregas', category: 'Logistica', period: 'Mayo 2026', generatedDate: '30/05/2026', format: 'PDF', status: 'disponible' },
    { id: 898, name: 'Margen por Categoria', category: 'Finanzas', period: 'Mayo 2026', generatedDate: '30/05/2026', format: 'Excel', status: 'disponible' },
    { id: 897, name: 'Novedades por Transportadora', category: 'Logistica', period: 'Sem 22 - Mayo 2026', generatedDate: '29/05/2026', format: 'PDF', status: 'disponible' },
    { id: 896, name: 'Reporte de Cartera', category: 'Finanzas', period: 'Mayo 2026', generatedDate: '28/05/2026', format: 'Excel', status: 'programado' },
    { id: 895, name: 'Productos Mas Vendidos', category: 'Ventas', period: 'Mayo 2026', generatedDate: '27/05/2026', format: 'PDF', status: 'disponible' },
    { id: 894, name: 'Clientes Nuevos por Ciudad', category: 'Clientes', period: 'Mayo 2026', generatedDate: '26/05/2026', format: 'Excel', status: 'disponible' },
    { id: 893, name: 'Devoluciones y Garantias', category: 'Logistica', period: 'Sem 21 - Mayo 2026', generatedDate: '25/05/2026', format: 'PDF', status: 'disponible' },
    { id: 892, name: 'Comisiones por Dropshipper', category: 'Finanzas', period: 'Mayo 2026', generatedDate: '24/05/2026', format: 'Excel', status: 'programado' },
    { id: 891, name: 'Performance de Proveedores', category: 'Inventario', period: 'Abril 2026', generatedDate: '23/05/2026', format: 'PDF', status: 'disponible' },
    { id: 890, name: 'Resumen Ejecutivo Mensual', category: 'Ventas', period: 'Abril 2026', generatedDate: '01/05/2026', format: 'PDF', status: 'disponible' },
  ];

  onGenerate(): void {
    // placeholder
  }

  onDownload(item: ReporteItem): void {
    // placeholder
  }

  onView(item: ReporteItem): void {
    // placeholder
  }
}
