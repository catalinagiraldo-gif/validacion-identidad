import { Injectable, computed, signal } from '@angular/core';
import retosData from '../../../../mocks/gali-v3/retos.json';

export interface RetoDiario {
  id: string;
  titulo: string;
  descripcion: string;
  puntos: number;
  completado: boolean;
  deadline: string;
  ruta?: string;
}

export interface RetoSemanal {
  id: string;
  titulo: string;
  descripcion: string;
  puntos: number;
  progreso: number;
  completado?: boolean;
  deadline: string;
  ruta?: string;
  cohorte_completaron: number;
}

export interface MisionLarga {
  id: string;
  titulo: string;
  descripcion: string;
  puntos: number;
  progreso: number;
  deadline: string;
  checkpoints: { label: string; done: boolean }[];
  razon_gali: string;
}

interface RetosData {
  perfilJugador: any;
  insignias_ganadas: any[];
  insignias_proximas: any[];
  retos_diarios: RetoDiario[];
  retos_semanales: RetoSemanal[];
  misiones_largas: MisionLarga[];
  lider_comunidad: any;
  cohorte_top: any[];
}

const STORAGE_KEY = 'gali_v3_retos_state';

@Injectable({ providedIn: 'root' })
export class GaliRetosService {
  readonly data = signal<RetosData>(this.load());

  readonly retosDiarios = computed(() => this.data().retos_diarios);
  readonly retosSemanales = computed(() => this.data().retos_semanales);
  readonly misionesLargas = computed(() => this.data().misiones_largas);
  readonly perfilJugador = computed(() => this.data().perfilJugador);
  readonly insigniasGanadas = computed(() => this.data().insignias_ganadas);
  readonly insigniasProximas = computed(() => this.data().insignias_proximas);
  readonly liderComunidad = computed(() => this.data().lider_comunidad);
  readonly cohorteTop = computed(() => this.data().cohorte_top);

  readonly diariosCompletados = computed(() => this.retosDiarios().filter(r => r.completado).length);
  readonly diariosTotal = computed(() => this.retosDiarios().length);
  readonly progresoDiario = computed(() =>
    this.diariosTotal() > 0 ? (this.diariosCompletados() / this.diariosTotal()) * 100 : 0,
  );

  readonly puntosHoy = computed(() =>
    this.retosDiarios().filter(r => r.completado).reduce((s, r) => s + r.puntos, 0),
  );

  completarReto(id: string) {
    const next: RetosData = { ...this.data() };
    next.retos_diarios = next.retos_diarios.map(r =>
      r.id === id ? { ...r, completado: !r.completado } : r,
    );
    this.data.set(next);
    this.persist();
  }

  completarSemanal(id: string) {
    const next: RetosData = { ...this.data() };
    next.retos_semanales = next.retos_semanales.map(r => {
      if (r.id !== id) return r;
      const newCompletado = !r.completado;
      return { ...r, completado: newCompletado, progreso: newCompletado ? 100 : r.progreso };
    });
    this.data.set(next);
    this.persist();
  }

  activarLider() {
    const next: RetosData = { ...this.data() };
    next.lider_comunidad = { ...next.lider_comunidad, activo: !next.lider_comunidad.activo };
    this.data.set(next);
    this.persist();
  }

  private load(): RetosData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as RetosData;
    } catch {}
    return retosData as unknown as RetosData;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data()));
    } catch {}
  }
}
