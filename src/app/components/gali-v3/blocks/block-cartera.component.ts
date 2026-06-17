import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'block-cartera',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bc">
      <div class="bc__main">
        <span class="bc__label">Saldo disponible</span>
        <strong class="bc__amount">{{ formatCOP(saldo) }}</strong>
      </div>
      <div class="bc__proy">
        <span class="bc__proy-label">Proyección a 7 días</span>
        <strong class="bc__proy-amount">+ {{ formatCOP(proyeccion) }}</strong>
      </div>
      <div class="bc__hint">
        <span aria-hidden="true">✦</span> Gali sugiere retirar el viernes.
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bc { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bc__label, .bc__proy-label { font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: $gv3-text-tertiary; display: block; margin-bottom: 4px; }
    .bc__amount {
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 48, 'SOFT' 40;
      font-size: clamp(24px, 2.4vw, 32px);
      color: $gv3-text-primary;
      font-weight: 600;
      letter-spacing: -0.02em;
      display: block;
      line-height: 1;
    }
    .bc__proy {
      padding-top: $gv3-space-3;
      border-top: 1px solid $gv3-border-whisper;
    }
    .bc__proy-amount {
      font-family: $gv3-font-mono;
      font-size: $gv3-text-base;
      color: $gv3-sage;
      font-weight: 600;
    }
    .bc__hint {
      margin-top: auto;
      font-size: $gv3-text-xs;
      color: $gv3-text-secondary;
      padding: $gv3-space-2 $gv3-space-3;
      background: $gv3-terracota-tint;
      border-radius: $gv3-radius-sm;
      span { color: $gv3-terracota; font-weight: 700; margin-right: 4px; }
    }
  `],
})
export class BlockCarteraComponent {
  saldo = 1_245_900;
  proyeccion = 420_000;

  formatCOP(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }
}
