import { Injectable, signal, computed } from '@angular/core';
import miStackData from '../../../../mocks/gali-v3/mi-stack.json';

export type StackEstado = 'conectada' | 'desconectada' | 'pendiente';

export interface StackCategoria {
  id: string;
  label: string;
  descripcion: string;
  icon: string;
}

export interface StackPlataforma {
  id: string;
  nombre: string;
  glyph: string;
  color: string;
  categoria: string;
  descripcion: string;
  estado: StackEstado;
  ultimaSync?: string;
  intelligence_score: number;
  datosCompartidos: string[];
  insights_generados: number;
  ejemplos_insights: string[];
  permisos_requeridos: string[];
  tiempo_conexion_min: number;
  recomendado?: boolean;
  recomendado_razon?: string;
  alerta_compliance?: string;
  alerta_privacidad?: string;
}

export interface IntelligenceSummary {
  conectadas: number;
  total: number;
  intelligence_score_actual: number;
  intelligence_score_max: number;
  siguiente_recomendacion: string;
  siguiente_ganancia_intelligence: number;
}

interface MiStackFile {
  intelligence_summary: IntelligenceSummary;
  categorias: StackCategoria[];
  plataformas: StackPlataforma[];
}

const STORAGE_KEY = 'gali_v3_mi_stack';

@Injectable({ providedIn: 'root' })
export class GaliMiStackService {
  private data = miStackData as MiStackFile;

  readonly plataformas = signal<StackPlataforma[]>(this.load());
  readonly categorias = signal<StackCategoria[]>(this.data.categorias);

  readonly conectadas = computed(() =>
    this.plataformas().filter(p => p.estado === 'conectada').length,
  );

  readonly intelligenceActual = computed(() =>
    this.plataformas()
      .filter(p => p.estado === 'conectada')
      .reduce((acc, p) => acc + p.intelligence_score, 0),
  );

  readonly intelligenceMax = computed(() =>
    this.plataformas().reduce((acc, p) => acc + p.intelligence_score, 0),
  );

  readonly intelligencePct = computed(() => {
    const max = this.intelligenceMax();
    return max > 0 ? Math.round((this.intelligenceActual() / max) * 100) : 0;
  });

  readonly recomendadas = computed(() =>
    this.plataformas().filter(p => p.recomendado && p.estado !== 'conectada'),
  );

  readonly insightsTotal = computed(() =>
    this.plataformas()
      .filter(p => p.estado === 'conectada')
      .reduce((acc, p) => acc + p.insights_generados, 0),
  );

  porCategoria(cat: string): StackPlataforma[] {
    return this.plataformas().filter(p => p.categoria === cat);
  }

  toggleConexion(id: string) {
    const p = this.plataformas().find(x => x.id === id);
    if (!p) return;
    const nuevoEstado: StackEstado =
      p.estado === 'conectada' ? 'desconectada' : 'conectada';
    this.plataformas.set(
      this.plataformas().map(x =>
        x.id === id
          ? {
              ...x,
              estado: nuevoEstado,
              ultimaSync: nuevoEstado === 'conectada' ? 'hace un momento' : undefined,
              insights_generados:
                nuevoEstado === 'desconectada' ? 0 : x.insights_generados,
            }
          : x,
      ),
    );
    this.persist();
  }

  scoreColor(score: number): 'sage' | 'amber' | 'rust' {
    if (score >= 12) return 'sage';
    if (score >= 7) return 'amber';
    return 'rust';
  }

  private load(): StackPlataforma[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return this.data.plataformas;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.plataformas()));
    } catch {}
  }
}
