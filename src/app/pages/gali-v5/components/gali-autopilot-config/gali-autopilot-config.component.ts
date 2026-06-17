import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

export interface AutopilotScope {
  budgetMax: number;
  changeTransportadora: boolean;
  whatsappConfirm: boolean;
  whatsappRecuperar: boolean;
  savedAt?: string;
}

const AUTOPILOT_SCOPE_KEY = 'gali_autopilot_scope';

export function loadAutopilotScope(): AutopilotScope {
  try {
    const raw = localStorage.getItem(AUTOPILOT_SCOPE_KEY);
    if (raw) return JSON.parse(raw) as AutopilotScope;
  } catch { /* ignore */ }
  return { budgetMax: 50000, changeTransportadora: true, whatsappConfirm: true, whatsappRecuperar: false };
}

@Component({
  selector: 'gali-autopilot-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-autopilot-config.component.html',
  styleUrl: './gali-autopilot-config.component.scss',
})
export class GaliAutopilotConfigComponent {
  private readonly ws = inject(GaliWorkspaceService);

  readonly closed = output<void>();

  readonly scope = signal<AutopilotScope>(loadAutopilotScope());

  get budgetFormatted(): string {
    return `$${this.scope().budgetMax.toLocaleString('es-CO')}`;
  }

  get budgetRisk(): string {
    if (this.scope().budgetMax <= 25000) return 'BAJO';
    if (this.scope().budgetMax <= 75000) return 'MEDIO';
    return 'ALTO';
  }

  get budgetRiskColor(): string {
    if (this.scope().budgetMax <= 25000) return '#22c55e';
    if (this.scope().budgetMax <= 75000) return '#f59e0b';
    return '#ef4444';
  }

  toggleBudget(val: number): void {
    this.scope.update(s => ({ ...s, budgetMax: val }));
  }

  toggleTransportadora(): void {
    this.scope.update(s => ({ ...s, changeTransportadora: !s.changeTransportadora }));
  }

  toggleWhatsappConfirm(): void {
    this.scope.update(s => ({ ...s, whatsappConfirm: !s.whatsappConfirm }));
  }

  toggleWhatsappRecuperar(): void {
    this.scope.update(s => ({ ...s, whatsappRecuperar: !s.whatsappRecuperar }));
  }

  activate(): void {
    const scopeToSave: AutopilotScope = { ...this.scope(), savedAt: new Date().toISOString() };
    try {
      localStorage.setItem(AUTOPILOT_SCOPE_KEY, JSON.stringify(scopeToSave));
    } catch { /* ignore */ }
    this.ws.toggleAutopilot();
    this.closed.emit();
  }

  cancel(): void {
    this.closed.emit();
  }
}
