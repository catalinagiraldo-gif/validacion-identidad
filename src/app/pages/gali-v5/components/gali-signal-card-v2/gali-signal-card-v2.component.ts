import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export type SignalState =
  | 'pending_decision'
  | 'executing'
  | 'completed'
  | 'archived';

export type SignalTipo =
  | 'critica'
  | 'completada'
  | 'decision'
  | 'oportunidad'
  | 'info';

export interface SignalOpcion {
  id: string;
  label: string;
  sublabel?: string;
}

export interface SignalTablaItem {
  id: string;
  cliente: string;
  ciudad: string;
  transportadora?: string;
  estado: string;
}

export interface GaliSignalData {
  id: string;
  agente: string;
  agente_id: string;
  tipo: SignalTipo;
  estado: SignalState;
  titulo: string;
  contexto: string;
  timestamp: string;
  urgencia: 'alta' | 'media' | 'baja';
  afectados?: number;
  metrica_label?: string;
  metrica_valor?: string;
  umbral?: string;
  opciones?: SignalOpcion[];
  tabla_label?: string;
  tabla_items?: SignalTablaItem[];
  resultado_antes?: string;
  resultado_despues?: string;
  cta_followup?: string;
  cta_followup_label?: string;
}

@Component({
  selector: 'gali-signal-card-v2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-signal-card-v2.component.html',
  styleUrl: './gali-signal-card-v2.component.scss',
})
export class GaliSignalCardV2Component {
  private router = inject(Router);
  @Input({ required: true }) signal_data!: GaliSignalData;
  @Output() actionTaken = new EventEmitter<{ signalId: string; opcionId: string }>();

  readonly expanded = signal(false);
  readonly executing = signal(false);
  readonly localState = signal<SignalState | null>(null);

  readonly currentState = computed(
    () => this.localState() ?? this.signal_data.estado,
  );

  readonly agentColor: Record<string, string> = {
    vigilante: '#fbbf24',
    roax: '#f97316',
    chatea: '#34d399',
    ada: '#818cf8',
    financiero: '#a78bfa',
  };

  getAgentColor(): string {
    return this.agentColor[this.signal_data.agente_id] ?? '#9b9ba8';
  }

  toggleExpand(): void {
    this.expanded.update(v => !v);
  }

  executeOpcion(opcion: SignalOpcion): void {
    this.executing.set(true);
    this.localState.set('executing');

    setTimeout(() => {
      this.executing.set(false);
      this.localState.set('completed');
      this.actionTaken.emit({ signalId: this.signal_data.id, opcionId: opcion.id });
    }, 1800);
  }

  goToSkillEditor(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: {
        agente: this.signal_data.agente_id,
        contexto: this.signal_data.tipo,
      },
    });
  }

  get tipoIcon(): string {
    const icons: Record<SignalTipo, string> = {
      critica: '⚠',
      completada: '✓',
      decision: '?',
      oportunidad: '💡',
      info: 'ℹ',
    };
    return icons[this.signal_data.tipo] ?? '●';
  }

  get cardClass(): string {
    const state = this.currentState();
    const tipo = this.signal_data.tipo;
    if (state === 'completed') return 'signal-v2--completed';
    if (state === 'executing') return 'signal-v2--executing';
    if (tipo === 'critica') return 'signal-v2--critica';
    if (tipo === 'decision') return 'signal-v2--decision';
    if (tipo === 'oportunidad') return 'signal-v2--oportunidad';
    return 'signal-v2--info';
  }
}
