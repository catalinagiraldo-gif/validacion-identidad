import { Injectable, signal, computed } from '@angular/core';
import projectsData from '../../../../mocks/gali-v3/proyectos.json';
import { GaliProject } from './types';

const STORAGE_KEY = 'gali_v3_projects';
const ACTIVE_KEY = 'gali_v3_active_project';

@Injectable({ providedIn: 'root' })
export class GaliProjectService {
  readonly projects = signal<GaliProject[]>(this.load());
  readonly activeProjectId = signal<string | null>(this.loadActive());

  readonly activeProject = computed(() => {
    const id = this.activeProjectId();
    return id ? this.projects().find(p => p.id === id) ?? null : null;
  });

  readonly proyectosActivos = computed(() =>
    this.projects().filter(p => p.status === 'activo'),
  );

  readonly proyectosPausados = computed(() =>
    this.projects().filter(p => p.status === 'pausado'),
  );

  readonly proyectosCompletados = computed(() =>
    this.projects().filter(p => p.status === 'completado'),
  );

  getById(id: string): GaliProject | undefined {
    return this.projects().find(p => p.id === id);
  }

  setActive(id: string | null) {
    this.activeProjectId.set(id);
    try {
      if (id) localStorage.setItem(ACTIVE_KEY, id);
      else localStorage.removeItem(ACTIVE_KEY);
    } catch {}
  }

  create(name: string, icon = '✨'): GaliProject {
    const id = `proj-${Date.now()}`;
    const nuevo: GaliProject = {
      id,
      name,
      icon,
      status: 'activo',
      created_at: new Date().toISOString().slice(0, 10),
      last_activity: 'hace un momento',
      days_active: 0,
      product: {
        id: '',
        name: '',
        image: '',
        costo: 0,
        precio_sugerido: 0,
        margen: 0,
        angulo_elegido: '',
        ciudad_principal: '',
      },
      pipeline: [
        { stage: 'Producto', status: 'pendiente', label: 'Sin producto' },
        { stage: 'Landing', status: 'pendiente', label: '—' },
        { stage: 'Creatives', status: 'pendiente', label: '—' },
        { stage: 'Campaña', status: 'pendiente', label: '—' },
        { stage: 'ROAS', status: 'pendiente', label: '—' },
      ],
      artifacts: { landings: [], flows: [], vistas: [], agentes: [] },
      memory: {
        decisiones_clave: [],
        aprendizajes: [],
        siguiente_accion: 'Gali necesita conocer tu objetivo para sugerirte el siguiente paso.',
        siguiente_accion_razonamiento: '',
      },
      metrics: {
        roas_actual: 0,
        ventas_totales: 0,
        ventas_semana: 0,
        presupuesto_diario: 0,
        ctr_actual: 0,
        dias_antes_saturacion: null,
      },
    };
    this.projects.set([nuevo, ...this.projects()]);
    this.persist();
    return nuevo;
  }

  pause(id: string) {
    this.update(id, p => ({ ...p, status: 'pausado' }));
  }

  resume(id: string) {
    this.update(id, p => ({ ...p, status: 'activo' }));
  }

  private update(id: string, fn: (p: GaliProject) => GaliProject) {
    this.projects.set(this.projects().map(p => (p.id === id ? fn(p) : p)));
    this.persist();
  }

  private load(): GaliProject[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return (projectsData as { proyectos: GaliProject[] }).proyectos;
  }

  private loadActive(): string | null {
    try {
      return localStorage.getItem(ACTIVE_KEY);
    } catch {
      return null;
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.projects()));
    } catch {}
  }
}
