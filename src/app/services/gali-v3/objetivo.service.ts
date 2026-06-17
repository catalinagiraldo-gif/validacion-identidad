import { Injectable, signal, computed } from '@angular/core';
import objetivosData from '../../../../mocks/gali-v3/objetivos.json';
import {
  GaliObjetivo,
  ObjetivoHistorico,
  ObjetivoPaso,
  ObjetivoPreguntaOnboarding,
  ObjetivoSemana,
  PasoEstado,
} from './types';

const STORAGE_KEY = 'gali_v3_objetivo_activo';
const ONBOARDING_KEY = 'gali_v3_objetivo_onboarding_done';

interface ObjetivosFile {
  objetivo_activo: GaliObjetivo;
  objetivos_historicos: ObjetivoHistorico[];
  preguntas_onboarding: ObjetivoPreguntaOnboarding[];
}

@Injectable({ providedIn: 'root' })
export class GaliObjetivoService {
  private data = objetivosData as ObjetivosFile;

  readonly objetivoActivo = signal<GaliObjetivo | null>(this.loadActivo());
  readonly onboardingDone = signal<boolean>(this.loadOnboarding());

  readonly objetivosHistoricos = signal<ObjetivoHistorico[]>(
    this.data.objetivos_historicos,
  );
  readonly preguntasOnboarding = signal<ObjetivoPreguntaOnboarding[]>(
    this.data.preguntas_onboarding,
  );

  readonly tieneObjetivo = computed(() => this.objetivoActivo() !== null);

  readonly progresoActual = computed(() => {
    const o = this.objetivoActivo();
    if (!o) return 0;
    return Math.round(o.porcentaje_completado);
  });

  readonly proyeccionGali = computed(() => {
    const o = this.objetivoActivo();
    if (!o) return 0;
    return Math.round(o.porcentaje_proyectado_gali);
  });

  readonly semanaActiva = computed<ObjetivoSemana | null>(() => {
    const o = this.objetivoActivo();
    if (!o) return null;
    return o.semanas.find(s => s.estado === 'activa') ?? null;
  });

  readonly pasosCompletadosTotal = computed(() => {
    const o = this.objetivoActivo();
    if (!o) return 0;
    return o.semanas.flatMap(s => s.pasos).filter(p => p.estado === 'completado').length;
  });

  readonly pasosTotal = computed(() => {
    const o = this.objetivoActivo();
    if (!o) return 0;
    return o.semanas.flatMap(s => s.pasos).length;
  });

  activarObjetivoMock() {
    this.objetivoActivo.set(this.data.objetivo_activo);
    this.persist();
  }

  cerrarOnboarding() {
    this.onboardingDone.set(true);
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {}
  }

  togglePaso(pasoId: string) {
    const o = this.objetivoActivo();
    if (!o) return;
    const next: GaliObjetivo = {
      ...o,
      semanas: o.semanas.map(s => ({
        ...s,
        pasos: s.pasos.map(p =>
          p.id === pasoId ? { ...p, estado: this.nextEstado(p.estado) } : p,
        ),
      })),
    };
    this.recalcular(next);
    this.objetivoActivo.set(next);
    this.persist();
  }

  ajustarObjetivo(nuevoValor: number) {
    const o = this.objetivoActivo();
    if (!o) return;
    const next: GaliObjetivo = {
      ...o,
      metrica: { ...o.metrica, valor_objetivo: nuevoValor },
    };
    this.objetivoActivo.set(next);
    this.persist();
  }

  reiniciar() {
    this.objetivoActivo.set(null);
    this.onboardingDone.set(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(ONBOARDING_KEY);
    } catch {}
  }

  private nextEstado(estado: PasoEstado): PasoEstado {
    if (estado === 'pendiente') return 'en_progreso';
    if (estado === 'en_progreso') return 'completado';
    return 'pendiente';
  }

  private recalcular(o: GaliObjetivo) {
    const todos = o.semanas.flatMap(s => s.pasos);
    const done = todos.filter(p => p.estado === 'completado').length;
    if (todos.length > 0) {
      const ratio = done / todos.length;
      o.porcentaje_completado = Math.round(ratio * 100);
    }
    o.semanas.forEach(s => {
      const done = s.pasos.filter(p => p.estado === 'completado').length;
      s.porcentaje_real =
        s.pasos.length > 0 ? Math.round((done / s.pasos.length) * 100) : 0;
    });
  }

  private loadActivo(): GaliObjetivo | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }

  private loadOnboarding(): boolean {
    try {
      return localStorage.getItem(ONBOARDING_KEY) === '1';
    } catch {
      return false;
    }
  }

  private persist() {
    try {
      const o = this.objetivoActivo();
      if (o) localStorage.setItem(STORAGE_KEY, JSON.stringify(o));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}
