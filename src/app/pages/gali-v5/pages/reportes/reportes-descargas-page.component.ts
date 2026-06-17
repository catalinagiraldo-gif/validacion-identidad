import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DropiTitulosComponent,
  DropiSearchOficialComponent,
  DropiTagComponent,
  DropiPaginatorComponent,
} from '../../components/shared';

interface DownloadRow {
  reporte: string;
  periodo: string;
  formato: string;
  generado: string;
  estado: string;
}

const REPORTS = ['Ventas por producto', 'Novedades logísticas', 'Comisiones', 'Productos vendidos', 'Clientes activos', 'Guías generadas'];
const PERIODS = ['Mayo 2026', 'Abril 2026', 'Q1 2026'];
const FORMATS = ['Excel', 'CSV', 'PDF'];
const STATES = ['Listo', 'Procesando', 'Expirado'];

@Component({
  selector: 'app-reportes-descargas-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiSearchOficialComponent,
    DropiTagComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './reportes-descargas-page.component.html',
  styleUrl: './reportes-descargas-page.component.scss',
})
export class ReportesDescargasPageComponent {
  searchQuery = '';
  readonly breadcrumbs = ['Reportes', 'Descargas'];
  readonly rows: DownloadRow[] = Array.from({ length: 20 }, (_, i) => ({
    reporte: REPORTS[i % REPORTS.length],
    periodo: PERIODS[i % PERIODS.length],
    formato: FORMATS[i % FORMATS.length],
    generado: `27/05/2026 ${10 + (i % 12)}:${String(i * 3 % 60).padStart(2, '0')}`,
    estado: STATES[i % STATES.length],
  }));

  estadoVariant(estado: string): 'success' | 'warning' | 'neutral' {
    if (estado === 'Listo') return 'success';
    if (estado === 'Procesando') return 'warning';
    return 'neutral';
  }
}
