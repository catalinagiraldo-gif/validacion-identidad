import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StrategySummary } from '../../../gali-descubrimiento/models/gali.models';
import { ConfidenceMeterComponent } from '../../../gali-descubrimiento/components/confidence-meter/confidence-meter.component';

@Component({
  selector: 'approval-ui',
  standalone: true,
  imports: [CommonModule, ConfidenceMeterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ap" *ngIf="summary" role="region" aria-labelledby="ap-title">
      <header class="ap__header">
        <span class="ap__chip">📋 RESUMEN DE TU ESTRATEGIA</span>
        <h2 class="ap__title" id="ap-title">Confirma antes de generar</h2>
      </header>

      <div class="ap__grid">
        <div class="ap__row">
          <span class="ap__label">Producto</span>
          <span class="ap__value">{{ summary.product.name }}</span>
        </div>
        <div class="ap__row">
          <span class="ap__label">Perfil</span>
          <span class="ap__value">{{ summary.persona.title }}</span>
        </div>
        <div class="ap__row">
          <span class="ap__label">Tono</span>
          <span class="ap__value ap__value--accent">{{ summary.tone }}</span>
        </div>
        <div class="ap__row">
          <span class="ap__label">Canal</span>
          <span class="ap__value ap__value--accent">{{ summary.channel }}</span>
        </div>
        <div class="ap__row ap__row--copy">
          <span class="ap__label">Ángulo</span>
          <span class="ap__value ap__value--italic">"{{ summary.copyAngle }}"</span>
        </div>
      </div>

      <div class="ap__prediction">
        <div class="ap__pred-icon">📊</div>
        <div class="ap__pred-content">
          <p class="ap__pred-text">
            Con esta estrategia, estimo que tu landing debería convertir entre
            <strong>{{ summary.conversionRangeMin }}%</strong> y
            <strong>{{ summary.conversionRangeMax }}%</strong>
            basada en {{ summary.basedOnCases }} casos similares en los últimos 90 días.
          </p>
          <confidence-meter
            [value]="summary.persona.confidence"
            [details]="[
              'Basado en ' + summary.basedOnCases + ' casos similares LATAM',
              'Tono ' + summary.tone + ' + canal ' + summary.channel,
              'Match con perfil: alto'
            ]"
          ></confidence-meter>
        </div>
      </div>

      <div class="ap__actions">
        <button class="ap__btn ap__btn--ghost" (click)="changeRequested.emit()">
          ✏️ Cambiar algo
        </button>
        <button class="ap__btn ap__btn--primary" (click)="confirmed.emit()">
          ✅ Confirmar y crear →
        </button>
      </div>
    </section>
  `,
  styleUrl: './approval-ui.component.scss',
})
export class ApprovalUIComponent {
  @Input() summary: StrategySummary | null = null;
  @Output() confirmed = new EventEmitter<void>();
  @Output() changeRequested = new EventEmitter<void>();
}
