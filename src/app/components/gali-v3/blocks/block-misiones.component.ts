import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'block-misiones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bm">
      <div class="bm__row">
        <span class="bm__mark" aria-hidden="true">✦</span>
        <span class="bm__tag">Misión activa</span>
      </div>
      <h4 class="bm__title">{{ titulo }}</h4>
      <p class="bm__desc">{{ desc }}</p>
      <div class="bm__progress">
        <div class="bm__progress-fill" [style.width.%]="progreso"></div>
      </div>
      <span class="bm__progress-label">{{ progreso }}% completado</span>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bm { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-2; }
    .bm__row { display: flex; align-items: center; gap: 6px; }
    .bm__mark { color: $gv3-terracota; font-family: $gv3-font-display; font-weight: 700; }
    .bm__tag { font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: $gv3-terracota; }
    .bm__title {
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 28, 'SOFT' 50;
      font-size: $gv3-text-base;
      font-weight: 600;
      color: $gv3-text-primary;
      margin: 0;
      line-height: 1.25;
    }
    .bm__desc { font-size: $gv3-text-xs; color: $gv3-text-secondary; line-height: 1.45; margin: 0; }
    .bm__progress {
      margin-top: auto;
      height: 6px;
      background: $gv3-bg-cream;
      border-radius: $gv3-radius-pill;
      overflow: hidden;
    }
    .bm__progress-fill {
      height: 100%;
      background: linear-gradient(90deg, $gv3-orange 0%, $gv3-terracota 100%);
      border-radius: $gv3-radius-pill;
      transition: width $gv3-dur-slow $gv3-ease-out;
    }
    .bm__progress-label { font-family: $gv3-font-mono; font-size: 10px; color: $gv3-text-tertiary; }
  `],
})
export class BlockMisionesComponent {
  titulo = 'Optimiza tu primera campaña';
  desc = 'Revisa el ROAS del Video B vs A y pausa el de menor desempeño.';
  progreso = 60;
}
