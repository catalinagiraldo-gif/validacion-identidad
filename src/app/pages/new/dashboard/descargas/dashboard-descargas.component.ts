import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DownloadItem {
  id: number;
  name: string;
  type: string;
  size: string;
  date: string;
  status: 'listo' | 'procesando' | 'error';
}

interface DownloadStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-dashboard-descargas-new',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./dashboard-descargas.component.scss'],
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
        <span class="breadcrumb-item">Descargas</span>
      </nav>

      <!-- Title -->
      <h1 class="page-title">Descargas</h1>

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

      <!-- Downloads Table -->
      <section class="table-section">
        <div class="section-header">
          <h2 class="section-title">Historial de Descargas</h2>
          <span class="section-subtitle">Ultimos 30 dias</span>
        </div>

        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Tamano</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of downloads; let i = index"
                  [style.animation-delay]="i * 0.04 + 's'"
                  class="table-row">
                <td class="id-cell">#{{ item.id }}</td>
                <td class="name-cell">
                  <i class="pi pi-file"></i>
                  {{ item.name }}
                </td>
                <td>
                  <span class="type-badge">{{ item.type }}</span>
                </td>
                <td>{{ item.size }}</td>
                <td class="date-cell">{{ item.date }}</td>
                <td>
                  <span class="status-badge"
                        [class.listo]="item.status === 'listo'"
                        [class.procesando]="item.status === 'procesando'"
                        [class.error]="item.status === 'error'">
                    {{ item.status === 'listo' ? 'Listo' : item.status === 'procesando' ? 'Procesando' : 'Error' }}
                  </span>
                </td>
                <td>
                  <button class="btn-download"
                          [disabled]="item.status !== 'listo'"
                          (click)="onDownload(item)">
                    <i class="pi pi-download"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `,
})
export class DashboardDescargasNewComponent {
  stats: DownloadStat[] = [
    { label: 'Archivos listos', value: '12', icon: 'pi-check-circle', color: '#0ABB87' },
    { label: 'En proceso', value: '3', icon: 'pi-spin pi-spinner', color: '#F1B44C' },
    { label: 'Total este mes', value: '47', icon: 'pi-download', color: '#008DBF' },
  ];

  downloads: DownloadItem[] = [
    { id: 4521, name: 'Reporte_Ventas_Mayo_2026.xlsx', type: 'Excel', size: '2.4 MB', date: '31/05/2026', status: 'listo' },
    { id: 4520, name: 'Inventario_General_Mayo.xlsx', type: 'Excel', size: '5.1 MB', date: '31/05/2026', status: 'procesando' },
    { id: 4519, name: 'Guias_Semana_22.pdf', type: 'PDF', size: '8.7 MB', date: '30/05/2026', status: 'listo' },
    { id: 4518, name: 'Clientes_Activos_Mayo.csv', type: 'CSV', size: '1.2 MB', date: '30/05/2026', status: 'listo' },
    { id: 4517, name: 'Novedades_Mayo_2026.xlsx', type: 'Excel', size: '3.3 MB', date: '29/05/2026', status: 'listo' },
    { id: 4516, name: 'Facturacion_Mayo_Parcial.pdf', type: 'PDF', size: '12.5 MB', date: '28/05/2026', status: 'error' },
    { id: 4515, name: 'Productos_Mas_Vendidos.xlsx', type: 'Excel', size: '890 KB', date: '27/05/2026', status: 'listo' },
    { id: 4514, name: 'Reporte_Transportadoras.pdf', type: 'PDF', size: '4.6 MB', date: '26/05/2026', status: 'listo' },
    { id: 4513, name: 'Historial_Cartera_S21.xlsx', type: 'Excel', size: '2.1 MB', date: '25/05/2026', status: 'listo' },
    { id: 4512, name: 'Ordenes_Devueltas_Mayo.csv', type: 'CSV', size: '780 KB', date: '24/05/2026', status: 'procesando' },
    { id: 4511, name: 'Etiquetas_Lote_4500.pdf', type: 'PDF', size: '15.2 MB', date: '23/05/2026', status: 'listo' },
    { id: 4510, name: 'Balance_Semanal_S20.xlsx', type: 'Excel', size: '1.8 MB', date: '22/05/2026', status: 'listo' },
  ];

  onDownload(item: DownloadItem): void {
    // placeholder
  }
}
