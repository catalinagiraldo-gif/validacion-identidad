import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import informesData from '../../../../../../mocks/gali-v5/marketing-roax-informes.json';
import { GALI_V5_DROPI_LOGO } from '../../gali-v5.constants';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

@Component({
  selector: 'app-roax-informes-page',
  standalone: true,
  imports: [CommonModule, DropiTitulosComponent, DropiButtonNewComponent],
  templateUrl: './roax-informes-page.component.html',
  styleUrl: './roax-informes-page.component.scss',
})
export class RoaxInformesPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  readonly dropiLogo = GALI_V5_DROPI_LOGO;
  readonly breadcrumbs = ['Marketing', 'ROAX', 'Informes'];
  readonly dateRange = informesData.dateRange;
  readonly kpis = informesData.kpis;
  readonly weeklyTrend = informesData.weeklyTrend;
  readonly creativos = informesData.creativos;
  readonly costoWaterfall = informesData.costoWaterfall;
  readonly skillImpact = informesData.skillImpact;

  readonly galiRoasInsight = {
    roasDeclarado: '5.0x',
    roasReal: '2.9x',
    gap: '-2.1x',
    causa: '54% del gap = atribución inflada de Meta (ventas orgánicas atribuidas a pauta)',
    presupuesto: '$462k',
    gananciaReal: '$411k',
  };

  readonly reglaActivas = [
    { icono: '⚙', nombre: 'Escalado ROAS automático', estado: 'activa', ultimaEjecucion: 'hace 4h', ejecuciones: 3 },
    { icono: '⚙', nombre: 'Auto-pausa CTR bajo', estado: 'activa', ultimaEjecucion: 'hace 2h', ejecuciones: 7 },
    { icono: '🌙', nombre: 'Pausa nocturna 11pm–6am', estado: 'activa', ultimaEjecucion: 'anoche', ejecuciones: 14 },
    { icono: '⏳', nombre: 'Anti-Baneo Meta', estado: 'en_espera', ultimaEjecucion: 'hace 2 días', ejecuciones: 4 },
  ];

  readonly healthIndicators = [
    { label: 'Collar GPS — Video B', roas: 3.1, ctr: 1.8, frecuencia: 2.1, status: 'ok' },
    { label: 'Skincare K-Beauty — Carrusel', roas: 2.1, ctr: 1.1, frecuencia: 2.8, status: 'warning' },
    { label: 'Collar GPS — Video A', roas: 0, ctr: 0.7, frecuencia: 0, status: 'paused' },
  ];

  maxRoas(): number {
    return Math.max(...this.weeklyTrend.map(d => d.roas_meta));
  }

  roas_bar_pct(roas: number): number {
    return Math.min(100, Math.round((roas / this.maxRoas()) * 100));
  }

  getHealthClass(status: string): string {
    return { ok: 'health--ok', warning: 'health--warning', paused: 'health--paused', danger: 'health--danger' }[status] ?? '';
  }

  goToSkillEditor(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], { queryParams: { agente: 'roax', contexto: 'informe' } });
  }

  goToMedir(): void {
    this.ws.setMode('medir');
    this.router.navigate(['/gali-v5']);
  }
}
