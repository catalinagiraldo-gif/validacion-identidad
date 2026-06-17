import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export type AlertVariant = 'decision' | 'monitoring' | 'opportunity' | 'completed';
export type AgentId = 'roax' | 'vigilante' | 'chatea' | 'ada' | 'gali';

const AGENT_COLORS: Record<AgentId, string> = {
  roax:     '#f97316',
  vigilante:'#fbbf24',
  chatea:   '#34d399',
  ada:      '#818cf8',
  gali:     '#ff6102',
};

const AGENT_LABELS: Record<AgentId, string> = {
  roax:     'Roax',
  vigilante:'Vigilante',
  chatea:   'Chatea Pro',
  ada:      'ADA Spy',
  gali:     'Gali',
};

@Component({
  selector: 'gali-agent-alert',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="gali-alert"
      [class.gali-alert--decision]="variant === 'decision'"
      [class.gali-alert--monitoring]="variant === 'monitoring'"
      [class.gali-alert--opportunity]="variant === 'opportunity'"
      [class.gali-alert--completed]="variant === 'completed'"
      [style.--alert-agent-color]="agentColor"
      role="status">

      <div class="gali-alert__left">
        <span class="gali-alert__dot" [class.gali-alert__dot--pulse]="variant !== 'completed'"></span>
        <div class="gali-alert__body">
          <span class="gali-alert__agent">{{ agentLabel }}</span>
          <span class="gali-alert__message">{{ message }}</span>
        </div>
      </div>

      <div class="gali-alert__actions">
        @if (primaryCta && primaryRoute) {
          <a [routerLink]="primaryRoute" class="gali-alert__cta gali-alert__cta--primary">
            {{ primaryCta }} →
          </a>
        } @else if (primaryCta) {
          <button type="button" class="gali-alert__cta gali-alert__cta--primary" data-proto-skip>
            {{ primaryCta }} →
          </button>
        }
        @if (secondaryCta && secondaryRoute) {
          <a [routerLink]="secondaryRoute" class="gali-alert__cta gali-alert__cta--secondary">
            {{ secondaryCta }}
          </a>
        } @else if (secondaryCta) {
          <button type="button" class="gali-alert__cta gali-alert__cta--secondary" data-proto-skip>
            {{ secondaryCta }}
          </button>
        }
      </div>
    </div>
  `,
  styleUrl: './gali-agent-alert.component.scss',
})
export class GaliAgentAlertComponent {
  @Input() agent: AgentId = 'gali';
  @Input() variant: AlertVariant = 'monitoring';
  @Input() message = '';
  @Input() primaryCta = '';
  @Input() primaryRoute = '';
  @Input() secondaryCta = '';
  @Input() secondaryRoute = '';

  get agentColor(): string { return AGENT_COLORS[this.agent]; }
  get agentLabel(): string { return AGENT_LABELS[this.agent]; }
}
