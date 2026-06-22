import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastSeverity } from '../../services/toast.service';

@Component({
  selector: 'app-dropi-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropi-toast.component.html',
  styleUrls: ['./dropi-toast.component.scss'],
})
export class DropiToastComponent {
  private toast = inject(ToastService);
  readonly toasts = this.toast.toasts;

  private readonly icons: Record<ToastSeverity, string> = {
    success: 'pi-check-circle',
    error: 'pi-times-circle',
    warning: 'pi-exclamation-triangle',
    info: 'pi-info-circle',
  };

  iconFor(severity: ToastSeverity): string {
    return this.icons[severity];
  }

  dismiss(id: number): void {
    this.toast.dismiss(id);
  }
}
