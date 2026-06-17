import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mission } from '../../models/gali.models';

@Component({
  selector: 'mission-ribbon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mr" *ngIf="mission" [attr.aria-label]="'Misión: ' + mission.title + ' al ' + mission.progressPct + '%'">
      <span class="mr__icon">🎯</span>
      <div class="mr__content">
        <div class="mr__row">
          <span class="mr__label">Tu misión:</span>
          <span class="mr__title">{{ mission.title }}</span>
        </div>
        <div class="mr__bar">
          <div
            class="mr__bar-fill"
            [style.width.%]="mission.progressPct"
          ></div>
        </div>
      </div>
      <span class="mr__pct">{{ mission.progressPct }}%</span>
      <span class="mr__step">{{ mission.currentStep }}/{{ mission.totalSteps }}</span>
    </div>
  `,
  styleUrl: './mission-ribbon.component.scss',
})
export class MissionRibbonComponent {
  @Input() mission: Mission | null = null;
}
