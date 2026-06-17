import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  BuyerPersona,
  PersonaChannel,
  PersonaTone,
} from '../../../gali-descubrimiento/models/gali.models';

@Component({
  selector: 'buyer-persona-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="bp"
      [class.bp--selected]="selected"
      [class.bp--expanded]="expanded()"
      [class.bp--modified]="persona.modified"
      [style.animation-delay.ms]="animDelay"
    >
      <header class="bp__header">
        <div class="bp__index">{{ index + 1 }}</div>
        <div class="bp__title-wrap">
          <h3 class="bp__title">{{ persona.title }}</h3>
          <div class="bp__meta">
            <span>{{ persona.age }}</span>
            <span>·</span>
            <span>{{ persona.location }}</span>
          </div>
        </div>
        <div class="bp__modified-badge" *ngIf="persona.modified">Editado ✏️</div>
      </header>

      <div class="bp__pain">
        <span class="bp__pain-label">DOLOR PRINCIPAL</span>
        <p class="bp__pain-text">"{{ persona.pain }}"</p>
      </div>

      <div class="bp__fields">
        <div class="bp__field">
          <label class="bp__field-label">Tono</label>
          <select
            class="bp__select"
            [ngModel]="persona.tone"
            (ngModelChange)="onFieldChange('tone', $event)"
            [disabled]="selected"
          >
            <option *ngFor="let t of toneOptions" [value]="t">{{ t }}</option>
          </select>
        </div>
        <div class="bp__field">
          <label class="bp__field-label">Canal</label>
          <select
            class="bp__select"
            [ngModel]="persona.channel"
            (ngModelChange)="onFieldChange('channel', $event)"
            [disabled]="selected"
          >
            <option *ngFor="let c of channelOptions" [value]="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="bp__copy">
        <label class="bp__field-label">ÁNGULO DE COPY</label>
        <input
          type="text"
          class="bp__copy-input"
          [ngModel]="persona.copyAngle"
          (ngModelChange)="onFieldChange('copyAngle', $event)"
          [disabled]="selected"
          [attr.aria-label]="'Ángulo de copy'"
        />
      </div>

      <div class="bp__stats">
        <div class="bp__share">
          <span class="bp__share-num">{{ persona.salesShare }}%</span>
          <span class="bp__share-text">de ventas en productos similares</span>
        </div>
        <div class="bp__confidence" [attr.data-tier]="confidenceTier">
          <span class="bp__conf-pct">{{ persona.confidence }}%</span>
          <span class="bp__conf-label">confianza</span>
        </div>
      </div>

      <div class="bp__actions">
        <button
          type="button"
          class="bp__btn bp__btn--ghost"
          (click)="toggleExpand()"
        >
          {{ expanded() ? 'Ver menos ↑' : 'Ver más datos ↓' }}
        </button>
        <button
          type="button"
          class="bp__btn bp__btn--primary"
          (click)="choose.emit(persona)"
          [disabled]="selected"
        >
          {{ selected ? '✓ Seleccionado' : 'Elegir este perfil' }}
        </button>
      </div>

      <div class="bp__expanded" *ngIf="expanded()">
        <div class="bp__reasoning-label">RAZONAMIENTO</div>
        <p class="bp__reasoning-text">{{ persona.reasoning }}</p>
      </div>
    </article>
  `,
  styleUrl: './buyer-persona-card.component.scss',
})
export class BuyerPersonaCardComponent {
  @Input({ required: true }) persona!: BuyerPersona;
  @Input() index = 0;
  @Input() selected = false;
  @Input() animDelay = 0;
  @Output() choose = new EventEmitter<BuyerPersona>();
  @Output() fieldChanged = new EventEmitter<{
    id: string;
    field: 'tone' | 'channel' | 'copyAngle';
    value: string;
  }>();

  expanded = signal(false);

  toneOptions: PersonaTone[] = ['Emocional', 'Racional', 'Urgente', 'Aspiracional', 'Educativo'];
  channelOptions: PersonaChannel[] = ['Instagram', 'TikTok', 'Facebook', 'WhatsApp'];

  toggleExpand(): void {
    this.expanded.set(!this.expanded());
  }

  onFieldChange(field: 'tone' | 'channel' | 'copyAngle', value: string): void {
    this.fieldChanged.emit({ id: this.persona.id, field, value });
  }

  get confidenceTier(): 'high' | 'mid' | 'low' {
    if (this.persona.confidence >= 80) return 'high';
    if (this.persona.confidence >= 60) return 'mid';
    return 'low';
  }
}
