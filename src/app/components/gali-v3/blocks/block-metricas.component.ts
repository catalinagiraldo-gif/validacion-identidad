import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Metric {
  label: string;
  valor: string;
  delta: string;
  tone: 'ok' | 'warn' | 'neutral';
  spark: number[];
}

const METRICS: Metric[] = [
  { label: 'ROAS', valor: '2.4x', delta: '+0.3', tone: 'ok',      spark: [1.8, 2.0, 1.9, 2.1, 2.3, 2.2, 2.4] },
  { label: 'Ventas semana', valor: '$8.4M', delta: '+12%', tone: 'ok', spark: [4, 5, 4, 6, 7, 6, 8] },
  { label: 'Conversión', valor: '2.8%', delta: '-0.4', tone: 'warn',   spark: [3.2, 3.0, 3.1, 2.9, 2.7, 2.9, 2.8] },
];

function sparkPath(values: number[], w = 80, h = 24): string {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

@Component({
  selector: 'block-metricas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bmt">
      <div *ngFor="let m of metrics" class="bmt__card" [attr.data-tone]="m.tone">
        <div class="bmt__head">
          <span class="bmt__label">{{ m.label }}</span>
          <span class="bmt__delta">{{ m.delta }}</span>
        </div>
        <strong class="bmt__valor">{{ m.valor }}</strong>
        <svg class="bmt__spark" viewBox="0 0 80 24" preserveAspectRatio="none" aria-hidden="true">
          <path [attr.d]="sparkOf(m)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bmt {
      height: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: $gv3-space-3;
    }
    .bmt__card {
      padding: $gv3-space-3;
      background: $gv3-bg-cream;
      border-radius: $gv3-radius-md;
      display: flex; flex-direction: column; gap: $gv3-space-2;
      color: $gv3-text-secondary;
      &[data-tone="ok"]   { color: $gv3-sage; }
      &[data-tone="warn"] { color: $gv3-rust; }
    }
    .bmt__head { display: flex; justify-content: space-between; align-items: center; }
    .bmt__label {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.12em;
      text-transform: uppercase; color: $gv3-text-tertiary;
    }
    .bmt__delta {
      font-family: $gv3-font-mono; font-size: $gv3-text-xs;
      font-weight: 600;
    }
    .bmt__valor {
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 48, 'SOFT' 40;
      font-size: clamp(22px, 2.4vw, 28px);
      font-weight: 600;
      color: $gv3-text-primary; line-height: 1;
    }
    .bmt__spark { width: 100%; height: 24px; }
  `],
})
export class BlockMetricasComponent {
  metrics = METRICS;
  sparkOf(m: Metric): string { return sparkPath(m.spark); }
}
