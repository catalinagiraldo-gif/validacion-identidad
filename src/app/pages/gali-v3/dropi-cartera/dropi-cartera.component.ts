import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import carteraData from '../../../../../mocks/gali-v3/cartera-insights.json';
import { GaliBusinessService } from '../../../services/gali-v3/business.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface Mov {
  fecha: string;
  tipo: 'ingreso' | 'gasto' | 'retiro';
  concepto: string;
  monto: number;
  categoria: string;
}

@Component({
  selector: 'app-gali-v3-dropi-cartera',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './dropi-cartera.component.html',
  styleUrls: ['./dropi-cartera.component.scss'],
})
export class GaliV3DropiCarteraComponent {
  private bizSvc = inject(GaliBusinessService);
  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  data = signal(carteraData);

  // Para gráfica SVG mock: convertir movimientos a serie
  series = computed(() => {
    const movs = this.data().movimientos as Mov[];
    // Acumulado por fecha
    const byDate: Record<string, number> = {};
    const sorted = [...movs].reverse(); // oldest first
    let acc = 0;
    sorted.forEach(m => {
      acc += m.monto;
      byDate[m.fecha] = acc;
    });
    const entries = Object.entries(byDate).map(([fecha, valor]) => ({ fecha, valor }));
    return entries;
  });

  // Coordenadas para sparkline 600×120
  sparkline = computed(() => {
    const s = this.series();
    if (s.length < 2) return '';
    const max = Math.max(...s.map(p => p.valor));
    const min = Math.min(...s.map(p => p.valor), 0);
    const range = max - min || 1;
    const w = 600;
    const h = 120;
    return s.map((p, i) => {
      const x = (i / (s.length - 1)) * w;
      const y = h - ((p.valor - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');
  });

  format(n: number) { return this.bizSvc.formatCurrency(Math.abs(n)); }
  formatPositive(n: number) { return n >= 0 ? `+${this.format(n)}` : `−${this.format(n)}`; }

  ejecutarSugerencia(s: { cta: string; route: string }) {
    this.chatSvc.send(`Aplicar sugerencia Gali: ${s.cta}`);
    this.router.navigateByUrl(s.route);
  }
}
