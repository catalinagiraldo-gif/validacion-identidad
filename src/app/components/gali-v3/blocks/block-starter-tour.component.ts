import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Mision {
  numero: number;
  titulo: string;
  hint: string;
  done: boolean;
}

const MISIONES: Mision[] = [
  { numero: 1, titulo: 'Conecta tu primera tienda', hint: 'Tienda Nube, Shopify o WooCommerce', done: true },
  { numero: 2, titulo: 'Elige 3 productos para tu perfil', hint: 'Te los sugiero filtrados por curva de entrada', done: false },
  { numero: 3, titulo: 'Lanza tu primera landing', hint: 'Yo te ayudo a armar el copy y el angle', done: false },
];

@Component({
  selector: 'block-starter-tour',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bst">
      <div class="bst__intro">
        <span class="bst__intro-tag">tu primera semana</span>
        <h3 class="bst__intro-titulo">3 misiones para arrancar.</h3>
        <p class="bst__intro-sub">No es un curso. Son los 3 movimientos exactos que necesitas para vender la próxima semana.</p>
      </div>

      <ol class="bst__list">
        <li *ngFor="let m of misiones" class="bst__mision" [class.bst__mision--done]="m.done">
          <span class="bst__num">{{ m.numero }}</span>
          <div class="bst__body">
            <strong>{{ m.titulo }}</strong>
            <span>{{ m.hint }}</span>
          </div>
          <span class="bst__check" *ngIf="m.done" aria-hidden="true">✓</span>
        </li>
      </ol>

      <div class="bst__chat">
        <span class="bst__chat-mark">✦</span>
        <span class="bst__chat-prompt">Pregúntame lo que sea — “qué producto vendo primero” es buen comienzo.</span>
      </div>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bst {
      height: 100%;
      display: flex; flex-direction: column;
      gap: $gv3-space-4;
      overflow-y: auto;
      min-height: 0;
    }
    .bst__intro-tag {
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.14em;
      text-transform: uppercase; color: $gv3-terracota;
    }
    .bst__intro-titulo {
      @include gv3-display-tight;
      font-size: $gv3-text-2xl;
      font-weight: 500;
      margin: $gv3-space-2 0;
      color: $gv3-text-primary;
    }
    .bst__intro-sub {
      margin: 0;
      font-size: $gv3-text-sm; line-height: 1.5;
      color: $gv3-text-secondary;
      max-width: 56ch;
    }
    .bst__list {
      list-style: none; margin: 0; padding: 0;
      display: flex; flex-direction: column; gap: $gv3-space-2;
    }
    .bst__mision {
      display: grid; grid-template-columns: 36px 1fr auto;
      gap: $gv3-space-3; align-items: center;
      padding: $gv3-space-3;
      background: $gv3-bg-surface;
      border: 1px solid $gv3-border-whisper;
      border-radius: $gv3-radius-md;
      box-shadow: $gv3-shadow-xs;
      transition: all $gv3-dur-fast $gv3-ease-out;
      &:hover { border-color: $gv3-border-warm; transform: translateY(-1px); box-shadow: $gv3-shadow-sm; }
    }
    .bst__mision--done {
      opacity: 0.65;
      background: $gv3-sage-tint;
      border-color: $gv3-sage;
    }
    .bst__num {
      width: 36px; height: 36px;
      display: grid; place-items: center;
      border-radius: 50%;
      background: $gv3-orange; color: $gv3-text-onAccent;
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 36, 'SOFT' 40;
      font-weight: 600; font-size: $gv3-text-lg;
    }
    .bst__mision--done .bst__num { background: $gv3-sage; }
    .bst__body strong {
      display: block; font-size: $gv3-text-base; font-weight: 500; color: $gv3-text-primary;
    }
    .bst__body span {
      font-family: $gv3-font-mono; font-size: $gv3-text-xs;
      color: $gv3-text-tertiary; letter-spacing: 0.04em;
    }
    .bst__check { color: $gv3-sage; font-size: $gv3-text-xl; font-weight: 700; }

    .bst__chat {
      display: flex; gap: $gv3-space-3; align-items: center;
      padding: $gv3-space-3 $gv3-space-4;
      background: $gv3-bg-warm;
      border: 1px solid $gv3-orange-tint;
      border-radius: $gv3-radius-md;
    }
    .bst__chat-mark { color: $gv3-terracota; font-size: $gv3-text-xl; }
    .bst__chat-prompt {
      font-family: $gv3-font-display; font-style: italic;
      font-variation-settings: 'opsz' 18, 'SOFT' 30;
      font-size: $gv3-text-base;
      color: $gv3-text-secondary;
    }
  `],
})
export class BlockStarterTourComponent {
  misiones = MISIONES;
}
