import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Novedad {
  titulo: string;
  pedido: string;
  zona: 'critica' | 'gestionando' | 'resuelta';
}

const ITEMS: Novedad[] = [
  { titulo: 'Dirección incorrecta',          pedido: 'DRP-48232', zona: 'critica' },
  { titulo: 'Cliente no responde',           pedido: 'DRP-48221', zona: 'critica' },
  { titulo: 'Reagendar entrega',             pedido: 'DRP-48215', zona: 'critica' },
  { titulo: 'Contacto al cliente — 2/3',     pedido: 'DRP-48204', zona: 'gestionando' },
  { titulo: 'Coordinando con courier',       pedido: 'DRP-48198', zona: 'gestionando' },
];

@Component({
  selector: 'block-novedades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bn">
      <div class="bn__stats">
        <div class="bn__stat" data-tone="warn">
          <span class="bn__stat-num">{{ count('critica') }}</span>
          <span class="bn__stat-label">críticas</span>
        </div>
        <div class="bn__stat">
          <span class="bn__stat-num">{{ count('gestionando') }}</span>
          <span class="bn__stat-label">gestionando</span>
        </div>
        <div class="bn__stat" data-tone="ok">
          <span class="bn__stat-num">12</span>
          <span class="bn__stat-label">resueltas hoy</span>
        </div>
      </div>
      <ul class="bn__list">
        <li *ngFor="let n of items" class="bn__row" [attr.data-zona]="n.zona">
          <span class="bn__row-dot" aria-hidden="true"></span>
          <div class="bn__row-main">
            <strong>{{ n.titulo }}</strong>
            <span>{{ n.pedido }}</span>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bn { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bn__stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: $gv3-space-2; }
    .bn__stat {
      padding: $gv3-space-3;
      border-radius: $gv3-radius-md;
      background: $gv3-bg-cream;
      border-left: 3px solid $gv3-border-default;
      display: flex; flex-direction: column; gap: 2px;
      &[data-tone="warn"] { border-left-color: $gv3-rust; background: $gv3-rust-tint; }
      &[data-tone="ok"] { border-left-color: $gv3-sage; background: $gv3-sage-tint; }
    }
    .bn__stat-num {
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 36, 'SOFT' 40;
      font-size: clamp(18px, 2vw, 24px);
      font-weight: 600;
      color: $gv3-text-primary;
      line-height: 1;
    }
    .bn__stat-label {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.1em;
      color: $gv3-text-tertiary; text-transform: lowercase;
    }
    .bn__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; flex: 1; min-height: 0; overflow-y: auto; }
    .bn__row {
      display: grid; grid-template-columns: 10px 1fr;
      gap: $gv3-space-3; align-items: center;
      padding: 6px 8px; border-radius: $gv3-radius-sm;
      &:hover { background: $gv3-bg-cream; }
    }
    .bn__row-dot { width: 8px; height: 8px; border-radius: 50%; background: $gv3-text-muted; }
    .bn__row[data-zona="critica"]     .bn__row-dot { background: $gv3-rust; }
    .bn__row[data-zona="gestionando"] .bn__row-dot { background: $gv3-amber; }
    .bn__row[data-zona="resuelta"]    .bn__row-dot { background: $gv3-sage; }
    .bn__row-main strong { display: block; font-size: $gv3-text-sm; font-weight: 500; color: $gv3-text-primary; }
    .bn__row-main span { font-family: $gv3-font-mono; font-size: 10px; color: $gv3-text-tertiary; }
  `],
})
export class BlockNovedadesComponent {
  items = ITEMS;
  count(zona: Novedad['zona']): number {
    return this.items.filter(n => n.zona === zona).length;
  }
}
