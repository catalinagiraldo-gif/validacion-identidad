import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GaliInterventionOverlayComponent,
  InterventionContext,
} from '../gali-intervention-overlay/gali-intervention-overlay.component';

export type ProjectEstado = 'en_escala' | 'activo' | 'pausado' | 'borrador';

export interface ProjectAgent {
  nombre: string;
  id: string;
  activo: boolean;
}

export interface ProjectSkill {
  nombre: string;
  activa: boolean;
}

export interface ProjectPanelData {
  id: string;
  nombre: string;
  estado: ProjectEstado;
  roas: string;
  pedidos: string;
  ganancia: string;
  alertaActiva: boolean;
  alertaMensaje?: string;
  galiMensaje: string;
  agentes: ProjectAgent[];
  skills: ProjectSkill[];
}

@Component({
  selector: 'gali-project-panel',
  standalone: true,
  imports: [CommonModule, GaliInterventionOverlayComponent],
  templateUrl: './gali-project-panel.component.html',
  styleUrl: './gali-project-panel.component.scss',
})
export class GaliProjectPanelComponent {
  @Input({ required: true }) project!: ProjectPanelData;
  @Output() viewProject = new EventEmitter<string>();

  readonly interventionCtx = signal<InterventionContext | null>(null);

  readonly agentColors: Record<string, string> = {
    roax: '#f97316',
    vigilante: '#fbbf24',
    chatea: '#34d399',
    ada: '#818cf8',
  };

  get estadoLabel(): string {
    return {
      en_escala: 'En escala',
      activo: 'Activo',
      pausado: 'Pausado',
      borrador: 'Borrador',
    }[this.project.estado] ?? this.project.estado;
  }

  get estadoClass(): string {
    return `project-panel__badge--${this.project.estado.replace('_', '-')}`;
  }

  openIntervention(tipo: string): void {
    const ctxs: Record<string, InterventionContext> = {
      novedad: {
        titulo: 'Novedad alta — Coordinadora',
        proyecto: this.project.nombre,
        modulo: 'Logística',
        descripcion: `Coordinadora lleva 3 días con 12%+ novedad en Bogotá. Tus pedidos afectados: 8 de hoy + 4 programados.`,
        detalle: 'Servientrega tiene tasa actual de 3.8% en la misma zona.',
        opciones: [
          { id: 'a', label: 'Cambiar todos a Servientrega', sublabel: 'Tasa actual: 3.8%', isPrimary: true },
          { id: 'b', label: 'Cambiar solo los de hoy', sublabel: 'Esperar datos de mañana' },
          { id: 'c', label: 'Crear regla automática', sublabel: 'Para futuros picos de novedad' },
        ],
      },
      pausar: {
        titulo: '¿Reanudar proyecto?',
        proyecto: this.project.nombre,
        descripcion: 'El CTR se recuperó al 1.4% después de pausar. Condiciones de mercado similares a cuando lo lanzaste.',
        opciones: [
          { id: 'a', label: 'Reanudar con presupuesto original', sublabel: '$45.000/día', isPrimary: true },
          { id: 'b', label: 'Reanudar con presupuesto reducido', sublabel: '$25.000/día para testear' },
          { id: 'c', label: 'Mantener pausado', sublabel: 'Revisar de nuevo en 7 días' },
        ],
      },
    };
    this.interventionCtx.set(ctxs[tipo] ?? null);
  }

  closeIntervention(): void {
    this.interventionCtx.set(null);
  }
}
