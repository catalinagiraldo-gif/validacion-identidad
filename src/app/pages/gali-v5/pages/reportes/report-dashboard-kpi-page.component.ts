import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { DropiTitulosComponent } from '../../components/shared';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';

@Component({
  selector: 'app-report-dashboard-kpi-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DropiTitulosComponent, DropiGaliBarComponent],
  templateUrl: './report-dashboard-kpi-page.component.html',
  styleUrl: './report-dashboard-kpi-page.component.scss',
})
export class ReportDashboardKpiPageComponent {
  readonly router = inject(Router);
  private ws = inject(GaliWorkspaceService);
  readonly breadcrumbs = ['Reportes', 'Dashboard'];

  goToMedir(): void {
    this.ws.setMode('medir');
    this.router.navigate(['/gali-v5']);
  }

  readonly profile = {
    name: 'María Carolina Hernández Rodríguez',
    period: '07/01/2026 - 07/02/2026',
    revenue: '$27.983.700',
    orders: '1.654',
    effectiveness: '92%',
  };

  readonly orderKpis = [
    { key: 'confirm', label: 'Por confirmar', value: 12 },
    { key: 'pending', label: 'Pendientes', value: 25 },
    { key: 'guides', label: 'Guías generadas', value: 46 },
    { key: 'transit', label: 'En curso', value: 31 },
    { key: 'delivered', label: 'Entregadas', value: 1534 },
    { key: 'issues', label: 'Con novedad', value: 3 },
  ];

  readonly trendPoints = [
    { label: 'Lun', today: 45, yesterday: 38 },
    { label: 'Mar', today: 62, yesterday: 55 },
    { label: 'Mié', today: 48, yesterday: 52 },
    { label: 'Jue', today: 78, yesterday: 65 },
    { label: 'Vie', today: 85, yesterday: 72 },
    { label: 'Sáb', today: 92, yesterday: 80 },
    { label: 'Dom', today: 70, yesterday: 68 },
  ];

  readonly quickReports = [
    { label: 'Productos', route: '/gali-v5/reportes/productos-vendidos' },
    { label: 'Torre logística', route: '/gali-v5/logistica/torre-logistica' },
    { label: 'Roax', route: '/gali-v5/marketing/roax-informes' },
    { label: 'Calendario', route: '/gali-v5/reportes/calendario' },
  ];

  // Gali P&L intelligence
  readonly galiPl = {
    gananciaDeclarada: '$27.983.700',
    gananciaReal: '$18.940.000',
    gapPct: 32,
    causa: 'Novedades Cali +10pts · Pauta real vs Meta: diferencia $3.2M',
    anomalias: 3,
    semanaTendencia: -4,
    accion: 'Ver diagnóstico',
    accionRoute: '/gali-v5/marketing/roax-informes',
  };
}
