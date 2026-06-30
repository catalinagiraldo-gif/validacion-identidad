import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DropiTagSeverity = 'success' | 'warning' | 'error' | 'info' | 'secondary' | 'purple';

@Component({
  selector: 'app-dropi-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropi-tag.component.html',
  styleUrls: ['./dropi-tag.component.scss'],
})
export class DropiTagComponent {
  @Input({ required: true }) label = '';
  @Input() severity: DropiTagSeverity = 'info';
  @Input() rounded = true;
  @Input() icon?: string;
}
