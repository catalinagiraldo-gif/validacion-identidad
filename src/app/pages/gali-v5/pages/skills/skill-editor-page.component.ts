import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GaliWorkspaceModeBarComponent } from '../../components/gali-workspace-mode-bar/gali-workspace-mode-bar.component';

export type TriggerType = 'tiempo' | 'evento' | 'umbral';

interface Condition {
  metric: string;
  operator: string;
  value: string;
  duration: string;
  conjunction?: 'AND' | 'OR';
}

interface SkillDraft {
  nombre: string;
  agente: string;
  triggerType: TriggerType;
  triggerInterval: string;
  triggerEvent: string;
  conditions: Condition[];
  action: string;
  actionDetail: string;
  notification: string;
}

const AGENT_OPTIONS = [
  { id: 'roax', label: 'Roax', sublabel: 'Media Buyer', color: '#f97316' },
  { id: 'vigilante', label: 'Vigilante', sublabel: 'Logística', color: '#fbbf24' },
  { id: 'chatea', label: 'Chatea Pro', sublabel: 'CAS & Cierre', color: '#34d399' },
  { id: 'ada', label: 'ADA Spy', sublabel: 'Research', color: '#818cf8' },
];

const TIME_INTERVALS = ['cada 30 min', 'cada 1h', 'cada 2h', 'cada 4h', 'cada 6h', 'cada 12h', 'cada 24h'];

const EVENT_TRIGGERS: Record<string, string[]> = {
  roax: ['Cuando una campaña cambia estado', 'Cuando CTR supera umbral', 'Al crear nueva campaña', 'Al modificar presupuesto'],
  vigilante: ['Cuando se crea un pedido', 'Cuando se detecta una novedad', 'Cuando hay cambio de transportadora', 'Al actualizar estado de entrega'],
  chatea: ['Cuando llega un ticket nuevo', 'Cuando cliente responde', 'Al detectar patrón PQR', 'Cuando un pedido necesita confirmación'],
  ada: ['Al detectar tendencia nueva', 'Cuando un competidor cambia precio', 'Al actualizar score de producto', 'Cuando nicho alcanza saturación'],
};

const METRICS: Record<string, string[]> = {
  roax: ['CTR', 'ROAS', 'CPC', 'CPM', 'Conversión', 'Impresiones', 'Frecuencia'],
  vigilante: ['Novedad %', 'Tiempo entrega', 'Pedidos en riesgo', 'Tasa devolución', 'Pedidos pendientes'],
  chatea: ['Tickets abiertos', 'Tiempo respuesta', 'Satisfacción', 'Tasa resolución', 'Tickets PQR'],
  ada: ['Score oportunidad', 'Saturación nicho', 'Precio competencia', 'Demanda índice'],
};

const ACTIONS: Record<string, { id: string; label: string }[]> = {
  roax: [
    { id: 'pause_creative', label: 'Pausar creativo activo + activar alternativo' },
    { id: 'increase_budget', label: 'Aumentar presupuesto +15%' },
    { id: 'decrease_budget', label: 'Reducir presupuesto -20%' },
    { id: 'switch_audience', label: 'Cambiar audiencia objetivo' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  vigilante: [
    { id: 'reroute', label: 'Reasignar pedidos a otra transportadora' },
    { id: 'pause_orders', label: 'Pausar nuevos pedidos en zona afectada' },
    { id: 'alert_provider', label: 'Alertar al proveedor' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  chatea: [
    { id: 'auto_resolve', label: 'Resolver automáticamente con plantilla' },
    { id: 'escalate', label: 'Escalar a agente humano' },
    { id: 'send_template', label: 'Enviar mensaje de seguimiento' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
  ada: [
    { id: 'add_watchlist', label: 'Agregar a watchlist de oportunidades' },
    { id: 'alert_saturacion', label: 'Alertar si el nicho satura' },
    { id: 'score_update', label: 'Actualizar score y notificar' },
    { id: 'notify', label: 'Notificarme para decidir' },
  ],
};

@Component({
  selector: 'app-skill-editor-page',
  standalone: true,
  imports: [CommonModule, FormsModule, GaliWorkspaceModeBarComponent],
  templateUrl: './skill-editor-page.component.html',
  styleUrl: './skill-editor-page.component.scss',
})
export class SkillEditorPageComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly agentOptions = AGENT_OPTIONS;
  readonly timeIntervals = TIME_INTERVALS;

  readonly draft = signal<SkillDraft>({
    nombre: '',
    agente: 'roax',
    triggerType: 'tiempo',
    triggerInterval: 'cada 4h',
    triggerEvent: '',
    conditions: [{ metric: 'CTR', operator: '<', value: '0.8', duration: '48h' }],
    action: 'pause_creative',
    actionDetail: 'Pausar creativo activo + activar alternativo',
    notification: 'Ejecuté la skill automáticamente',
  });

  readonly saved = signal(false);

  readonly eventOptions = computed(() => EVENT_TRIGGERS[this.draft().agente] ?? []);
  readonly metrics = computed(() => METRICS[this.draft().agente] ?? []);
  readonly actions = computed(() => ACTIONS[this.draft().agente] ?? []);
  readonly agentColor = computed(() => AGENT_OPTIONS.find(a => a.id === this.draft().agente)?.color ?? '#9898a8');
  readonly agentLabel = computed(() => {
    const a = AGENT_OPTIONS.find(ag => ag.id === this.draft().agente);
    return a ? `${a.label} — ${a.sublabel}` : '';
  });

  readonly pipelineSummary = computed(() => {
    const d = this.draft();
    const triggerText = d.triggerType === 'tiempo'
      ? `${d.agente.toUpperCase()} · ${d.triggerInterval}`
      : d.triggerEvent || 'Evento pendiente';
    const condText = d.conditions.map(c => `${c.metric} ${c.operator} ${c.value}${c.duration ? ' por ' + c.duration : ''}`).join(' / ');
    return { trigger: triggerText, condition: condText, action: d.actionDetail, notification: d.notification };
  });

  ngOnInit(): void {
    // Pre-fill from query params (e.g., from signal "Crear skill")
    this.route.queryParams.subscribe(params => {
      if (params['agente']) {
        this.updateField('agente', params['agente']);
        const firstMetric = METRICS[params['agente']]?.[0] ?? 'CTR';
        const firstAction = ACTIONS[params['agente']]?.[0];
        this.draft.update(d => ({
          ...d,
          conditions: [{ ...d.conditions[0], metric: params['metrica'] ?? firstMetric }],
          action: firstAction?.id ?? 'notify',
          actionDetail: firstAction?.label ?? 'Notificarme',
        }));
      }
    });
  }

  updateField(field: keyof SkillDraft, value: string): void {
    this.draft.update(d => {
      const updated = { ...d, [field]: value };
      if (field === 'agente') {
        updated.triggerEvent = EVENT_TRIGGERS[value]?.[0] ?? '';
        updated.conditions = [{ metric: METRICS[value]?.[0] ?? 'CTR', operator: '<', value: '1.0', duration: '48h' }];
        const firstAction = ACTIONS[value]?.[0];
        updated.action = firstAction?.id ?? 'notify';
        updated.actionDetail = firstAction?.label ?? 'Notificarme';
      }
      if (field === 'action') {
        updated.actionDetail = ACTIONS[d.agente]?.find(a => a.id === value)?.label ?? value;
      }
      return updated;
    });
  }

  addCondition(): void {
    this.draft.update(d => ({
      ...d,
      conditions: [...d.conditions, { metric: METRICS[d.agente]?.[0] ?? 'CTR', operator: '>', value: '0', duration: '', conjunction: 'AND' }],
    }));
  }

  removeCondition(i: number): void {
    this.draft.update(d => ({ ...d, conditions: d.conditions.filter((_, idx) => idx !== i) }));
  }

  updateCondition(i: number, field: keyof Condition, value: string): void {
    this.draft.update(d => {
      const conds = [...d.conditions];
      conds[i] = { ...conds[i], [field]: value };
      return { ...d, conditions: conds };
    });
  }

  activateSkill(): void {
    this.saved.set(true);
    setTimeout(() => this.router.navigate(['/gali-v5/skills']), 1600);
  }

  cancel(): void {
    this.router.navigate(['/gali-v5/skills']);
  }

  onNombreInput(e: Event): void { this.updateField('nombre', (e.target as HTMLInputElement).value); }
  onAgenteChange(e: Event): void { this.updateField('agente', (e.target as HTMLSelectElement).value); }
  onTriggerTypeChange(type: TriggerType): void { this.updateField('triggerType', type); }
  onIntervalChange(e: Event): void { this.updateField('triggerInterval', (e.target as HTMLSelectElement).value); }
  onEventChange(e: Event): void { this.updateField('triggerEvent', (e.target as HTMLSelectElement).value); }
  onActionChange(e: Event): void { this.updateField('action', (e.target as HTMLSelectElement).value); }
  onNotificationInput(e: Event): void { this.updateField('notification', (e.target as HTMLInputElement).value); }
  onCondOperatorChange(i: number, e: Event): void { this.updateCondition(i, 'operator', (e.target as HTMLSelectElement).value); }
  onCondValueInput(i: number, e: Event): void { this.updateCondition(i, 'value', (e.target as HTMLInputElement).value); }
  onCondDurationInput(i: number, e: Event): void { this.updateCondition(i, 'duration', (e.target as HTMLInputElement).value); }
  onCondConjChange(i: number, e: Event): void { this.updateCondition(i, 'conjunction', (e.target as HTMLSelectElement).value as 'AND' | 'OR'); }
  onCondMetricChange(i: number, e: Event): void { this.updateCondition(i, 'metric', (e.target as HTMLSelectElement).value); }
}
