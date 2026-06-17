import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

interface RecuerdoSlot {
  etiqueta: string;
  texto: string;
}

const SLOTS: RecuerdoSlot[] = [
  { etiqueta: 'mi nicho',     texto: 'Mascotas + hogar; evito moda y belleza.' },
  { etiqueta: 'mi tono',      texto: 'Directo y cálido; sin tecnicismos.' },
  { etiqueta: 'mi ritmo',     texto: 'Reviso operación temprano, opero campañas en la tarde.' },
];

@Component({
  selector: 'block-memoria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bm">
      <p class="bm__intro">Esto es lo que sé de ti. Edítalo si quiero recordar diferente.</p>
      <ul class="bm__list">
        <li *ngFor="let s of slots" class="bm__row">
          <span class="bm__tag">{{ s.etiqueta }}</span>
          <p class="bm__texto" contenteditable="true">{{ s.texto }}</p>
        </li>
      </ul>
      <button type="button" class="bm__inspect" (click)="abrirInspector.emit()">abrir inspector de memoria →</button>
    </div>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; font-family: $gv3-font-body; }
    .bm { height: 100%; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .bm__intro {
      margin: 0;
      font-family: $gv3-font-display;
      font-variation-settings: 'opsz' 18, 'SOFT' 30;
      font-style: italic;
      font-size: $gv3-text-base;
      color: $gv3-text-secondary;
      line-height: 1.4;
    }
    .bm__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: $gv3-space-2; flex: 1; min-height: 0; overflow-y: auto; }
    .bm__row {
      padding: $gv3-space-3;
      background: $gv3-bg-warm;
      border-left: 3px solid $gv3-sage;
      border-radius: $gv3-radius-md;
    }
    .bm__tag {
      display: inline-block;
      font-family: $gv3-font-mono; font-size: 10px; letter-spacing: 0.12em;
      text-transform: uppercase; color: $gv3-sage;
      margin-bottom: 4px;
    }
    .bm__texto {
      margin: 0;
      font-size: $gv3-text-sm; line-height: 1.5;
      color: $gv3-text-primary;
      outline: 0;
      transition: background $gv3-dur-fast ease;
      &:focus { background: $gv3-bg-surface; border-radius: $gv3-radius-sm; padding: 2px 4px; margin: -2px -4px; }
    }
    .bm__inspect {
      appearance: none; cursor: pointer;
      background: transparent; color: $gv3-sage;
      border: 0;
      font-family: $gv3-font-mono; font-size: $gv3-text-xs;
      letter-spacing: 0.08em; text-align: left; padding: 4px 0;
      &:hover { color: darken(#5F7058, 8%); }
    }
  `],
})
export class BlockMemoriaComponent {
  slots = SLOTS;
  @Output() abrirInspector = new EventEmitter<void>();
}
