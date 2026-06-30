import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type DropiAlertSeverity = 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'app-dropi-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropi-alert.component.html',
  styleUrls: ['./dropi-alert.component.scss'],
})
export class DropiAlertComponent {
  @Input({ required: true }) message = '';
  @Input() severity: DropiAlertSeverity = 'info';
  @Input() closable = false;
  @Input() icon?: string;
  @Output() closed = new EventEmitter<void>();

  private readonly defaultIcons: Record<DropiAlertSeverity, string> = {
    success: 'pi-check-circle',
    warning: 'pi-exclamation-circle',
    error: 'pi-times-circle',
    info: 'pi-info-circle',
  };

  get resolvedIcon(): string {
    return this.icon ?? this.defaultIcons[this.severity];
  }

  onClose(): void {
    this.closed.emit();
  }
}
