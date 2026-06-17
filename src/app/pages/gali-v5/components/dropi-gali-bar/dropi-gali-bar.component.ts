import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GaliBarAgent = 'ADA Spy' | 'Roax' | 'Chatea Pro' | 'Vigilante' | 'Agente Financiero' | 'Gali';

export interface GaliBarStat {
  value: string | number;
  label: string;
  variant?: 'ok' | 'warn' | 'critical' | 'neutral';
}

/**
 * Barra de presencia del agente Gali en cada sección.
 * Reemplaza los bloques de HTML inline de agent-bar.
 *
 * @example
 * <dropi-gali-bar
 *   agent="ADA Spy"
 *   status="analizando catálogo"
 *   message="3 oportunidades detectadas · Ventana promedio: 18 días"
 *   ctaLabel="Solo oportunidades"
 *   (ctaClick)="onCta()"
 * />
 */
@Component({
  selector: 'dropi-gali-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="gali-bar" [ngClass]="agentClass">
      <div class="gali-bar__left">
        <span class="gali-bar__dot"></span>
        <div class="gali-bar__identity">
          <span class="gali-bar__name">{{ agent }}</span>
          <span class="gali-bar__status">{{ status }}</span>
        </div>
      </div>

      @if (stats && stats.length > 0) {
        <div class="gali-bar__stats">
          @for (stat of stats; track stat.label; let i = $index) {
            @if (i > 0) {
              <span class="gali-bar__sep" aria-hidden="true">·</span>
            }
            <span class="gali-bar__stat" [ngClass]="stat.variant ? 'gali-bar__stat--' + stat.variant : ''">
              <strong>{{ stat.value }}</strong> {{ stat.label }}
            </span>
          }
        </div>
      } @else {
        <span class="gali-bar__message">{{ message }}</span>
      }

      @if (ctaLabel) {
        <button type="button" class="gali-bar__cta" (click)="ctaClick.emit()" data-proto-skip>
          {{ ctaLabel }} →
        </button>
      }

      @if (secondaryCta) {
        <button type="button" class="gali-bar__secondary" (click)="secondaryClick.emit()" data-proto-skip>
          {{ secondaryCta }}
        </button>
      }
    </div>
  `,
  styleUrl: './dropi-gali-bar.component.scss',
})
export class DropiGaliBarComponent {
  @Input({ required: true }) agent!: GaliBarAgent;
  @Input() status = 'activo';
  @Input() message = '';
  @Input() stats?: GaliBarStat[];
  @Input() ctaLabel?: string;
  @Input() secondaryCta?: string;
  @Output() ctaClick = new EventEmitter<void>();
  @Output() secondaryClick = new EventEmitter<void>();

  get agentClass(): string {
    const map: Record<GaliBarAgent, string> = {
      'ADA Spy': 'gali-bar--ada',
      'Roax': 'gali-bar--roax',
      'Chatea Pro': 'gali-bar--chatea',
      'Vigilante': 'gali-bar--vigilante',
      'Agente Financiero': 'gali-bar--financiero',
      'Gali': 'gali-bar--gali',
    };
    return map[this.agent] ?? '';
  }
}
