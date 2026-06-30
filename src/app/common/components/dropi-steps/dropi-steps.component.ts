import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DropiStepState = 'pending' | 'focus' | 'completed' | 'error';

export interface DropiStepItem {
  label: string;
  state: DropiStepState;
}

@Component({
  selector: 'app-dropi-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropi-steps.component.html',
  styleUrls: ['./dropi-steps.component.scss'],
})
export class DropiStepsComponent {
  @Input({ required: true }) steps: DropiStepItem[] = [];
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
}
