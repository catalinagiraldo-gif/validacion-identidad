import { Component, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SkillDraft {
  nombre: string;
  trigger: { agent: string; interval: string };
  condition: { metric: string; operator: string; value: string; duration: string };
  action: { type: string; detail: string };
  notification: string;
}

const AGENT_OPTIONS = [
  { id: 'roax', label: 'Roax — Media Buyer', color: '#f97316' },
  { id: 'vigilante', label: 'Vigilante — Logística', color: '#fbbf24' },
  { id: 'chatea', label: 'Chatea Pro — CAS', color: '#34d399' },
  { id: 'ada', label: 'ADA Spy — Research', color: '#818cf8' },
];

const METRIC_OPTIONS: Record<string, string[]> = {
  roax: ['CTR', 'ROAS', 'CPC', 'CPM', 'Conversión'],
  vigilante: ['Novedad %', 'Tiempo entrega', 'Pedidos en riesgo'],
  chatea: ['Tickets abiertos', 'Tiempo respuesta', 'Satisfacción'],
  ada: ['Score oportunidad', 'Saturación nicho', 'Precio competencia'],
};

const ACTION_OPTIONS: Record<string, { id: string; label: string }[]> = {
  roax: [
    { id: 'pause_creative', label: 'Pausar creativo activo + activar alternativo' },
    { id: 'increase_budget', label: 'Aumentar presupuesto +15%' },
    { id: 'decrease_budget', label: 'Reducir presupuesto -20%' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  vigilante: [
    { id: 'reroute', label: 'Reasignar pedidos a otra transportadora' },
    { id: 'pause_orders', label: 'Pausar nuevos pedidos en zona' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  chatea: [
    { id: 'auto_resolve', label: 'Resolver automáticamente con plantilla' },
    { id: 'escalate', label: 'Escalar a agente humano' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  ada: [
    { id: 'add_watchlist', label: 'Agregar a watchlist de oportunidades' },
    { id: 'alert_saturacion', label: 'Alertar si el nicho satura' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
};

const MARKETPLACE_TEMPLATES = [
  { id: 't1', nombre: 'Auto-pausa CTR bajo', agente: 'roax', uses: '7.2k',
    trigger: { agent: 'roax', interval: 'cada 4h' },
    condition: { metric: 'CTR', operator: '<', value: '0.8', duration: '48h' },
    action: { type: 'pause_creative', detail: 'Pausar + activar alternativo' },
    notification: 'Cambié el creativo por CTR bajo',
  },
  { id: 't2', nombre: 'Escalado ROAS automático', agente: 'roax', uses: '4.5k',
    trigger: { agent: 'roax', interval: 'cada 6h' },
    condition: { metric: 'ROAS', operator: '≥', value: '2.8', duration: '48h' },
    action: { type: 'increase_budget', detail: 'Budget +15%' },
    notification: 'Escalé presupuesto por ROAS alto',
  },
  { id: 't3', nombre: 'Smart routing novedad', agente: 'vigilante', uses: '3.1k',
    trigger: { agent: 'vigilante', interval: 'cada 2h' },
    condition: { metric: 'Novedad %', operator: '>', value: '8', duration: '' },
    action: { type: 'reroute', detail: 'Reasignar a Servientrega' },
    notification: 'Reasigné pedidos por novedad alta',
  },
];

@Component({
  selector: 'gali-new-skill-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gali-new-skill-overlay.component.html',
  styleUrl: './gali-new-skill-overlay.component.scss',
})
export class GaliNewSkillOverlayComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<SkillDraft>();

  readonly step = signal<'template' | 'build' | 'confirm'>('template');
  readonly selectedAgent = signal<string>('roax');

  readonly draft = signal<SkillDraft>({
    nombre: '',
    trigger: { agent: 'roax', interval: 'cada 4h' },
    condition: { metric: 'CTR', operator: '<', value: '0.8', duration: '48h' },
    action: { type: 'pause_creative', detail: 'Pausar + activar alternativo' },
    notification: 'Ejecuté la acción según la condición',
  });

  readonly agentOptions = AGENT_OPTIONS;
  readonly marketplaceTemplates = MARKETPLACE_TEMPLATES;

  readonly metrics = computed(() => METRIC_OPTIONS[this.selectedAgent()] ?? []);
  readonly actions = computed(() => ACTION_OPTIONS[this.selectedAgent()] ?? []);

  useTemplate(template: (typeof MARKETPLACE_TEMPLATES)[0]): void {
    this.draft.update(() => ({
      nombre: template.nombre,
      trigger: { ...template.trigger },
      condition: { ...template.condition },
      action: { ...template.action },
      notification: template.notification,
    }));
    this.selectedAgent.set(template.agente);
    this.step.set('build');
  }

  startFromScratch(): void {
    this.step.set('build');
  }

  updateDraftNombre(val: string): void {
    this.draft.update(d => ({ ...d, nombre: val }));
  }

  updateTriggerAgent(agent: string): void {
    this.selectedAgent.set(agent);
    this.draft.update(d => ({
      ...d,
      trigger: { ...d.trigger, agent },
      condition: { ...d.condition, metric: METRIC_OPTIONS[agent]?.[0] ?? '' },
      action: { type: ACTION_OPTIONS[agent]?.[0]?.id ?? 'notify', detail: ACTION_OPTIONS[agent]?.[0]?.label ?? '' },
    }));
  }

  updateConditionMetric(metric: string): void {
    this.draft.update(d => ({ ...d, condition: { ...d.condition, metric } }));
  }

  updateActionType(type: string): void {
    const label = ACTION_OPTIONS[this.selectedAgent()]?.find(a => a.id === type)?.label ?? type;
    this.draft.update(d => ({ ...d, action: { type, detail: label } }));
  }

  goToConfirm(): void {
    const d = this.draft();
    if (!d.nombre) {
      this.draft.update(d2 => ({ ...d2, nombre: `${d.action.detail} cuando ${d.condition.metric} ${d.condition.operator} ${d.condition.value}` }));
    }
    this.step.set('confirm');
  }

  confirm(): void {
    this.created.emit(this.draft());
    this.closed.emit();
  }

  close(): void {
    this.closed.emit();
  }

  agentLabel(id: string): string {
    return this.agentOptions.find(a => a.id === id)?.label ?? id;
  }

  // ── Event helpers (Angular templates can't cast $event.target) ────────
  onNombreChange(event: Event): void {
    this.updateDraftNombre((event.target as HTMLInputElement).value);
  }

  onTriggerAgentChange(event: Event): void {
    this.updateTriggerAgent((event.target as HTMLSelectElement).value);
  }

  onTriggerIntervalChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.draft.update(d => ({ ...d, trigger: { ...d.trigger, interval: val } }));
  }

  onConditionMetricChange(event: Event): void {
    this.updateConditionMetric((event.target as HTMLSelectElement).value);
  }

  onConditionOperatorChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.draft.update(d => ({ ...d, condition: { ...d.condition, operator: val } }));
  }

  onConditionValueChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.draft.update(d => ({ ...d, condition: { ...d.condition, value: val } }));
  }

  onConditionDurationChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.draft.update(d => ({ ...d, condition: { ...d.condition, duration: val } }));
  }

  onActionTypeChange(event: Event): void {
    this.updateActionType((event.target as HTMLSelectElement).value);
  }

  onNotificationChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.draft.update(d => ({ ...d, notification: val }));
  }
}
