import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Fuente {
  nombre: string;
  estado: 'ok' | 'procesando' | 'error';
  icono: string;
}

interface Hipotesis {
  id: string;
  titulo: string;
  probabilidad: number;
  evidencias: string[];
  impacto: string;
  nivel: 'alto' | 'medio' | 'bajo';
  expanded?: boolean;
}

interface AccionPropuesta {
  id: string;
  prioridad: number;
  titulo: string;
  descripcion: string;
  agente: string;
  autonoma: boolean;
  impactoEstimado: string;
  icono: string;
  selected: boolean;
}

@Component({
  selector: 'app-diagnostico-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diagnostico-modal.component.html',
  styleUrl: './diagnostico-modal.component.scss',
})
export class DiagnosticoModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() actionExecuted = new EventEmitter<string[]>();

  executing = signal(false);

  readonly titulo = '¿Por qué cayó tu ROAS de 2.9x a 1.8x?';
  readonly proyecto = 'Collar GPS para mascotas';
  readonly generadoHace = 'hace 2 min';

  readonly fuentes: Fuente[] = [
    { nombre: 'Meta Ads', estado: 'ok', icono: '📊' },
    { nombre: 'Dropi LATAM', estado: 'ok', icono: '📦' },
    { nombre: 'ADA Spy', estado: 'ok', icono: '🔍' },
    { nombre: 'Chatea Pro', estado: 'procesando', icono: '💬' },
  ];

  hipotesis: Hipotesis[] = [
    {
      id: 'h1', titulo: 'Presión competitiva de precio', probabilidad: 68,
      evidencias: [
        'CPM subió 50% ($18k → $27k) — más anunciantes compitiendo',
        '3 nuevos vendedores de Collar GPS entraron esta semana en Colombia',
        'Ángulo "regalo mamá" saturándose en Meta LATAM',
      ],
      impacto: 'ROAS -0.9x estimado', nivel: 'alto', expanded: true,
    },
    {
      id: 'h2', titulo: 'Saturación de audiencia (Video A)', probabilidad: 57,
      evidencias: [
        'Frecuencia de Video A: 3.4x (umbral de fatiga: 2.8x)',
        'CTR Video A cayó de 1.8% a 0.9% en 48h',
        'Audiencia Lookalike 1% agotada en Bogotá',
      ],
      impacto: 'CTR -50% en Video A', nivel: 'alto', expanded: false,
    },
    {
      id: 'h3', titulo: 'Novedades logísticas en Cali (+10pts)', probabilidad: 43,
      evidencias: [
        'Tasa de novedad Cali subió de 4% a 14% esta semana',
        '3 de 47 pedidos devueltos = $85.500 descontados del margen',
      ],
      impacto: 'Margen -7% esta semana', nivel: 'medio', expanded: false,
    },
    {
      id: 'h4', titulo: 'Caída en tasa de confirmación', probabilidad: 28,
      evidencias: [
        'Confirmaciones: 91% → 68%',
        '3 pedidos de zona rural sin anticipo pendientes',
      ],
      impacto: '4 pedidos perdidos estimados', nivel: 'bajo', expanded: false,
    },
  ];

  acciones: AccionPropuesta[] = [
    {
      id: 'a1', prioridad: 1,
      titulo: 'Activar ángulo B (Seguridad nocturna)',
      descripcion: 'Pausar Video A y activar el creative con ángulo diferenciador.',
      agente: 'Roax', autonoma: true,
      impactoEstimado: 'CTR +40-60% · ROAS +0.5x estimado', icono: '⚡', selected: true,
    },
    {
      id: 'a2', prioridad: 2,
      titulo: 'Excluir Cali de la campaña',
      descripcion: 'Hasta que la novedad baje del 10%, excluir Cali de la segmentación.',
      agente: 'Roax', autonoma: true,
      impactoEstimado: 'Margen +4pts', icono: '🗺️', selected: true,
    },
    {
      id: 'a3', prioridad: 3,
      titulo: 'Actualizar guión Chatea Pro',
      descripcion: 'Script actualizado para manejar objeción de precio vs competencia.',
      agente: 'Chatea Pro', autonoma: false,
      impactoEstimado: 'Confirmación +10-15pp', icono: '💬', selected: false,
    },
    {
      id: 'a4', prioridad: 4,
      titulo: 'Expandir a Lookalike 3-5%',
      descripcion: 'La audiencia 1% está saturada. Expandir para reducir CPM.',
      agente: 'Roax', autonoma: false,
      impactoEstimado: 'Alcance +300% · CPM menor', icono: '🎯', selected: false,
    },
  ];

  get selectedActions(): AccionPropuesta[] {
    return this.acciones.filter(a => a.selected);
  }

  toggleHipotesis(h: Hipotesis): void {
    h.expanded = !h.expanded;
  }

  toggleAccion(a: AccionPropuesta): void {
    a.selected = !a.selected;
  }

  getNivelClass(nivel: string): string {
    return { alto: 'hipotesis--alto', medio: 'hipotesis--medio', bajo: 'hipotesis--bajo' }[nivel] ?? '';
  }

  getProbBarWidth(prob: number): string {
    return `${prob}%`;
  }

  ejecutarSeleccionadas(): void {
    this.executing.set(true);
    setTimeout(() => {
      const ids = this.selectedActions.map(a => a.id);
      this.actionExecuted.emit(ids);
      this.closed.emit();
    }, 800);
  }

  cerrar(): void {
    this.closed.emit();
  }
}
