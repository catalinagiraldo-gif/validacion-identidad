import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'block-proyecto-activo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bpa">
      <div class="bpa__hero">
        <span class="bpa__crumb">proyecto activo</span>
        <h3 class="bpa__titulo">Collar GPS — Bogotá</h3>
        <p class="bpa__resumen">
          Llevas 9 días. ROAS 2.4x. Margen 58%.
          Estás en la fase de <em>escalar campaña ganadora</em>.
        </p>
      </div>

      <div class="bpa__next">
        <span class="bpa__next-tag">siguiente acción</span>
        <p class="bpa__next-texto">
          Subir CBO al 30% en el ad set "dolor mascota" y duplicar el ángulo "trail running".
        </p>
        <div class="bpa__next-meta">
          <span>vence hoy 7pm</span>
          <span>·</span>
          <span>te toma ~15 min</span>
        </div>
      </div>

      <div class="bpa__mem">
        <span class="bpa__mem-tag">gali recuerda</span>
        <p>"Decidiste no escalar más de 30% diario para no quemar el creative."</p>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bpa {
      height: 100%;
      display: flex; flex-direction: column;
      gap: $gv3-space-3;
      min-height: 0;
      overflow-y: auto;
    }
    .bpa__hero {
      padding: $gv3-space-4;
      border-radius: $gv3-radius-md;
      background: linear-gradient(180deg, $gv3-orange-soft 0%, $gv3-bg-warm 100%);
    }
    .bpa__crumb {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: $gv3-orange-hover;
    }
    .bpa__titulo {
      @include gv3-display-tight;
      font-size: $gv3-text-xl;
      margin: $gv3-space-2 0 $gv3-space-2;
      color: $gv3-text-primary;
    }
    .bpa__resumen {
      margin: 0;
      font-size: $gv3-text-sm; line-height: 1.5;
      color: $gv3-text-secondary;
      em { color: $gv3-orange-hover; font-style: italic; font-weight: 500; }
    }
    .bpa__next {
      padding: $gv3-space-4;
      border-radius: $gv3-radius-md;
      border-left: 3px solid $gv3-terracota;
      background: $gv3-bg-surface;
    }
    .bpa__next-tag {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: $gv3-terracota;
    }
    .bpa__next-texto {
      margin: $gv3-space-2 0;
      font-size: $gv3-text-sm; line-height: 1.5;
      color: $gv3-text-primary;
    }
    .bpa__next-meta {
      display: flex; gap: $gv3-space-2;
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.08em;
      color: $gv3-text-tertiary; text-transform: uppercase;
    }
    .bpa__mem {
      padding: $gv3-space-3;
      border-radius: $gv3-radius-md;
      background: $gv3-sage-tint;
      p {
        margin: 4px 0 0;
        font-family: $gv3-font-display;
        font-style: italic;
        font-variation-settings: 'opsz' 14, 'SOFT' 30;
        font-size: $gv3-text-sm;
        color: $gv3-text-secondary;
        line-height: 1.5;
      }
    }
    .bpa__mem-tag {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: $gv3-sage;
    }
  `],
})
export class BlockProyectoActivoComponent {}
