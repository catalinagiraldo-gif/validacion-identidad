import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Integracion {
  id: string;
  nombre: string;
  glyph: string;
  estado: 'conectada' | 'pendiente' | 'desconectada';
}

const ITEMS: Integracion[] = [
  { id: 'tn',  nombre: 'Tienda Nube',  glyph: 'TN', estado: 'conectada' },
  { id: 'sh',  nombre: 'Shopify',      glyph: 'SH', estado: 'conectada' },
  { id: 'meta',nombre: 'Meta Ads',     glyph: 'META', estado: 'conectada' },
  { id: 'wa',  nombre: 'WhatsApp Biz', glyph: 'WA', estado: 'pendiente' },
];

@Component({
  selector: 'block-integraciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bi">
      <ul class="bi__list">
        <li *ngFor="let it of items" class="bi__row" [attr.data-estado]="it.estado">
          <span class="bi__glyph">{{ it.glyph }}</span>
          <div class="bi__row-main">
            <strong>{{ it.nombre }}</strong>
            <span>{{ labelEstado(it.estado) }}</span>
          </div>
          <span class="bi__dot" aria-hidden="true"></span>
        </li>
      </ul>
      <button type="button" class="bi__cta">+ conectar tienda</button>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bi { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bi__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; flex: 1; min-height: 0; overflow-y: auto; }
    .bi__row {
      display: grid; grid-template-columns: 36px 1fr 10px;
      gap: $gv3-space-3; align-items: center;
      padding: 8px 10px; border-radius: $gv3-radius-md;
      &:hover { background: $gv3-bg-cream; }
    }
    .bi__glyph {
      width: 32px; height: 32px;
      display: grid; place-items: center;
      border-radius: $gv3-radius-sm;
      background: $gv3-orange-soft; color: $gv3-orange-hover;
      font-family: $gv3-font-mono; font-size: 10px; font-weight: 700;
      letter-spacing: 0.04em;
    }
    .bi__row-main strong {
      display: block; font-size: $gv3-text-sm; font-weight: 500; color: $gv3-text-primary;
    }
    .bi__row-main span {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.08em;
      color: $gv3-text-tertiary; text-transform: uppercase;
    }
    .bi__dot { width: 10px; height: 10px; border-radius: 50%; background: $gv3-text-muted; }
    .bi__row[data-estado="conectada"] .bi__dot { background: $gv3-sage; box-shadow: 0 0 0 3px $gv3-sage-tint; }
    .bi__row[data-estado="pendiente"] .bi__dot { background: $gv3-amber; box-shadow: 0 0 0 3px $gv3-amber-tint; }
    .bi__row[data-estado="desconectada"] .bi__dot { background: $gv3-text-muted; }
    .bi__cta {
      appearance: none; cursor: pointer;
      background: transparent; color: $gv3-orange-hover;
      border: 1px dashed $gv3-border-warm;
      border-radius: $gv3-radius-md;
      padding: 10px;
      font-family: $gv3-font-mono; font-size: $gv3-text-xs;
      letter-spacing: 0.12em; text-transform: uppercase;
      transition: all $gv3-dur-fast $gv3-ease-out;
      &:hover { background: $gv3-orange-tint; border-color: $gv3-orange; }
    }
  `],
})
export class BlockIntegracionesComponent {
  items = ITEMS;
  labelEstado(e: Integracion['estado']) {
    return e === 'conectada' ? 'conectada' : e === 'pendiente' ? 'falta configurar' : 'sin conectar';
  }
}
