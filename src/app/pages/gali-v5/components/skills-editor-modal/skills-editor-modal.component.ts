import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type WizardStep = 1 | 2 | 3;

interface Trigger {
  id: string;
  label: string;
  unidad: string | null;
  agente: string;
}

interface Accion {
  id: string;
  label: string;
  agente: string;
  requiereAprobacion: boolean;
}

interface ReglaExistente {
  id: string;
  nombre: string;
  agente: string;
  estado: 'activa' | 'pausada';
  trigger: string;
  accion: string;
  ejecuciones: number;
  ultimaEjecucion: string;
}

@Component({
  selector: 'app-skills-editor-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills-editor-modal.component.html',
  styleUrl: './skills-editor-modal.component.scss',
})
export class SkillsEditorModalComponent {
  @Input() agenteNombre = 'Roax';
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<string>();

  step = signal<WizardStep>(1);
  saved$ = signal(false);

  // Step 1 — Trigger
  selectedTrigger = signal<string>('roas_bajo');
  triggerValue = signal<number>(1.5);
  triggerDuration = signal<number>(12);

  // Step 2 — Acción
  selectedAccion = signal<string>('notificar_usuario');
  presupuestoPct = signal<number>(20);
  requiereAprobacion = signal(false);

  // Step 3 — Notificación
  nombreRegla = signal('Mi nueva regla');
  notificacion = signal<string>('notificar_usuario');
  activarAhora = signal(true);

  // Dry run result
  dryRunResult = { activaciones: 3, periodo: 'el mes pasado', impacto: 'Ahorro estimado: $240.000' };

  readonly triggers: Trigger[] = [
    { id: 'roas_bajo', label: 'ROAS cae por debajo de', unidad: 'x', agente: 'Roax' },
    { id: 'roas_alto', label: 'ROAS supera', unidad: 'x', agente: 'Roax' },
    { id: 'ctr_bajo', label: 'CTR cae por debajo de', unidad: '%', agente: 'Roax' },
    { id: 'frecuencia_alta', label: 'Frecuencia supera', unidad: 'x', agente: 'Roax' },
    { id: 'novedad_pct', label: 'Tasa de novedad supera', unidad: '%', agente: 'Vigilante' },
    { id: 'zona_rural', label: 'Municipio en lista rural', unidad: null, agente: 'Chatea Pro' },
    { id: 'pedido_sin_confirmar', label: 'Pedido sin confirmar por más de', unidad: 'h', agente: 'Chatea Pro' },
  ];

  readonly acciones: Accion[] = [
    { id: 'pausar_campaña', label: 'Pausar campaña', agente: 'Roax', requiereAprobacion: false },
    { id: 'escalar_presupuesto', label: 'Aumentar presupuesto', agente: 'Roax', requiereAprobacion: false },
    { id: 'activar_creative', label: 'Activar creative alternativo', agente: 'Roax', requiereAprobacion: false },
    { id: 'solicitar_anticipo', label: 'Solicitar anticipo al cliente', agente: 'Chatea Pro', requiereAprobacion: false },
    { id: 'reasignar_transportadora', label: 'Reasignar transportadora', agente: 'Vigilante', requiereAprobacion: false },
    { id: 'notificar_usuario', label: 'Notificarme con diagnóstico', agente: 'Gali', requiereAprobacion: false },
    { id: 'pedir_aprobacion', label: 'Pedir mi aprobación antes de actuar', agente: 'Gali', requiereAprobacion: true },
  ];

  readonly reglas: ReglaExistente[] = [
    { id: 'r1', nombre: 'Anti-Baneo Meta', agente: 'Roax', estado: 'activa', trigger: 'CTR < 0.8% por 48h', accion: 'Pausar campaña', ejecuciones: 4, ultimaEjecucion: 'hace 2 días' },
    { id: 'r2', nombre: 'Prepago zona rural', agente: 'Chatea Pro', estado: 'activa', trigger: 'Municipio en lista_rural', accion: 'Solicitar anticipo 50%', ejecuciones: 12, ultimaEjecucion: 'hace 3h' },
    { id: 'r3', nombre: 'Cambio transportadora Cali', agente: 'Vigilante', estado: 'activa', trigger: 'Tasa novedad Cali > 10%', accion: 'Reasignar a Servientrega', ejecuciones: 7, ultimaEjecucion: 'hoy' },
  ];

  get currentTrigger(): Trigger | undefined {
    return this.triggers.find(t => t.id === this.selectedTrigger());
  }

  get currentAccion(): Accion | undefined {
    return this.acciones.find(a => a.id === this.selectedAccion());
  }

  get triggerPreview(): string {
    const t = this.currentTrigger;
    if (!t) return '';
    if (t.unidad === null) return `Cuando: ${t.label}`;
    return `Cuando ${t.label.toLowerCase()} ${this.triggerValue()}${t.unidad} por más de ${this.triggerDuration()}h`;
  }

  get accionPreview(): string {
    const a = this.currentAccion;
    if (!a) return '';
    const extra = this.selectedAccion() === 'escalar_presupuesto' ? ` (+${this.presupuestoPct()}%)` : '';
    return `${a.label}${extra}${this.requiereAprobacion() ? ' — pide tu aprobación primero' : ''}`;
  }

  nextStep(): void {
    if (this.step() < 3) this.step.update(s => (s + 1) as WizardStep);
  }

  prevStep(): void {
    if (this.step() > 1) this.step.update(s => (s - 1) as WizardStep);
  }

  guardar(): void {
    this.saved$.set(true);
    setTimeout(() => {
      this.saved.emit(this.nombreRegla());
      this.closed.emit();
    }, 800);
  }

  cerrar(): void {
    this.closed.emit();
  }
}
