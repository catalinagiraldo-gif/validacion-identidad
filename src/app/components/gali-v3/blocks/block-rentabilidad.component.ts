import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import pnlData from '../../../../../mocks/gali-v3/rentabilidad-collar-gps.json';
import { CanvasHighlightService } from '../../../services/gali-v3/canvas-highlight.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';

@Component({
  selector: 'block-rentabilidad',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  template: `
    <div class="br">
      <header class="br__head">
        <h4>💰 Rentabilidad Real — {{ data.producto }} ({{ data.periodo }})</h4>
      </header>

      <dl class="br__lines">
        <div class="br__line">
          <dt>Ventas brutas</dt>
          <dd>{{ format(data.ventas_brutas) }}</dd>
        </div>
        <div class="br__line br__line--deduct">
          <dt>− Costo proveedor ({{ data.costo_proveedor.unidades }} × {{ format(data.costo_proveedor.unitario) }})</dt>
          <dd>− {{ format(data.costo_proveedor.total) }} <em>({{ data.costo_proveedor.pct }}%)</em></dd>
        </div>
        <div class="br__line br__line--deduct">
          <dt>− Inversión en pauta</dt>
          <dd>− {{ format(data.inversion_pauta.total) }} <em>({{ data.inversion_pauta.pct }}%)</em></dd>
        </div>
        <div class="br__line br__line--deduct">
          <dt>− Novedades/devoluciones ({{ data.novedades.unidades }} und)</dt>
          <dd>− {{ format(data.novedades.total) }} <em>({{ data.novedades.pct }}%)</em></dd>
        </div>
        <div class="br__line br__line--deduct">
          <dt>− Logística</dt>
          <dd>− {{ format(data.logistica.total) }} <em>({{ data.logistica.pct }}%)</em></dd>
        </div>
      </dl>

      <div class="br__net">
        <span>GANANCIA NETA</span>
        <strong>{{ format(data.ganancia_neta.total) }} <em>({{ data.ganancia_neta.margen_pct }}%)</em></strong>
      </div>

      <div class="br__roas">
        <div>
          <span>ROAS mostrado</span>
          <strong>{{ data.roas_mostrado }}x</strong>
        </div>
        <div class="br__roas-real">
          <span>ROAS real (descontando todo)</span>
          <strong>{{ data.roas_real }}x</strong>
        </div>
      </div>

      <p class="br__insight">
        <span class="br__insight-mark">✦</span> Gali: "{{ data.insight_gali }}"
        <span class="br__delta" [class.br__delta--down]="data.delta_vs_semana_anterior < 0">
          {{ data.delta_vs_semana_anterior > 0 ? '+' : '' }}{{ data.delta_vs_semana_anterior }} pts vs sem. ant.
        </span>
      </p>

      <div class="br__actions">
        <button type="button" class="br__btn" (click)="analizarCali()">Analizar Cali</button>
        <a routerLink="/gali-v3/builder" class="br__btn br__btn--ghost">Ver receta de protección</a>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .br { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .br__head h4 { margin: 0; font-size: $gv3-text-sm; font-weight: 600; color: $gv3-text-primary; }
    .br__lines { margin: 0; display: flex; flex-direction: column; gap: 4px; }
    .br__line {
      display: flex; justify-content: space-between; align-items: baseline; gap: $gv3-space-2;
      font-size: $gv3-text-sm; padding: 2px 0;
      dt { color: $gv3-text-secondary; margin: 0; }
      dd { margin: 0; font-family: $gv3-font-mono; font-size: $gv3-text-xs; color: $gv3-text-primary; text-align: right;
        em { color: $gv3-text-tertiary; font-style: normal; margin-left: 4px; }
      }
      &--deduct dd { color: $gv3-rust; }
    }
    .br__net {
      display: flex; justify-content: space-between; align-items: center;
      padding: $gv3-space-3; border-radius: $gv3-radius-md;
      background: $gv3-sage-tint; border: 1px solid rgba(95, 112, 88, 0.2);
      span { font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.1em; color: $gv3-sage; }
      strong { font-size: $gv3-text-lg; color: $gv3-text-primary;
        em { font-size: $gv3-text-sm; color: $gv3-sage; font-style: normal; }
      }
    }
    .br__roas {
      display: grid; grid-template-columns: 1fr 1fr; gap: $gv3-space-3;
      div { padding: $gv3-space-2; background: $gv3-bg-cream; border-radius: $gv3-radius-sm;
        span { display: block; font-size: $gv3-text-xs; color: $gv3-text-tertiary; }
        strong { font-family: $gv3-font-display; font-size: $gv3-text-lg; color: $gv3-text-primary; }
      }
      &-real { border-left: 3px solid $gv3-terracota; background: $gv3-terracota-tint !important; }
    }
    .br__insight {
      font-size: $gv3-text-sm; color: $gv3-text-secondary; line-height: 1.5; margin: 0;
      padding: $gv3-space-3; background: $gv3-bg-warm; border-radius: $gv3-radius-sm;
      border-left: 3px solid $gv3-terracota;
    }
    .br__insight-mark { color: $gv3-terracota; }
    .br__delta {
      display: block; margin-top: 4px; font-family: $gv3-font-mono; font-size: 10px;
      &--down { color: $gv3-rust; }
    }
    .br__actions { display: flex; flex-wrap: wrap; gap: $gv3-space-2; margin-top: auto; }
    .br__btn {
      font-family: $gv3-font-mono; font-size: 11px; padding: 6px 12px;
      border-radius: $gv3-radius-sm; border: 1px solid $gv3-border-default;
      background: $gv3-orange; color: $gv3-text-onAccent; cursor: pointer; text-decoration: none;
      &--ghost { background: transparent; color: $gv3-text-secondary; }
      &:hover { opacity: 0.9; }
    }
  `],
})
export class BlockRentabilidadComponent {
  private highlightSvc = inject(CanvasHighlightService);
  private chatSvc = inject(GaliChatService);

  data = pnlData as {
    producto: string;
    periodo: string;
    ventas_brutas: number;
    costo_proveedor: { total: number; unidades: number; unitario: number; pct: number };
    inversion_pauta: { total: number; pct: number };
    novedades: { total: number; unidades: number; pct: number };
    logistica: { total: number; pct: number };
    ganancia_neta: { total: number; margen_pct: number };
    roas_mostrado: number;
    roas_real: number;
    delta_vs_semana_anterior: number;
    insight_gali: string;
  };

  format(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }

  analizarCali() {
    this.highlightSvc.highlight('metricas', 'active');
    this.chatSvc.send('¿Cómo va mi campaña de Cali? Muéstrame el impacto en margen.');
  }
}
