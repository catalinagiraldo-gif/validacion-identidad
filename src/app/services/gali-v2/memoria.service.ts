import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// =========================================================================
// SCHEMAS — basados en PlanGali2.MD §3.1 (líneas 534–573)
// =========================================================================

export type ProjectStatus = 'activo' | 'pausado' | 'completado' | 'archivado';

export interface Decision {
  id: string;
  texto: string;
  razonamiento: string;
  timestamp: number;
}

export interface Aprendizaje {
  id: string;
  texto: string;
  origen: string;
  confianza: 'alta' | 'media' | 'baja';
  timestamp: number;
  obsoleto?: boolean;
}

export interface Conversacion {
  id: string;
  resumen: string;
  timestamp: number;
}

export interface AssetRef {
  id: string;
  tipo: 'landing' | 'creative' | 'campaign';
  nombre: string;
  status: string;
}

export interface GaliProject {
  id: string;
  name: string;
  status: ProjectStatus;
  created_at: number;
  last_activity: number;

  product?: {
    id: string;
    nombre: string;
    anguloElegido: string;
    ciudadPrincipal: string;
  };

  assets: AssetRef[];

  galiMemory: {
    decisiones: Decision[];
    aprendizajes: Aprendizaje[];
    siguienteAccion: string;
    siguienteAccionRazon?: string;
    conversaciones: Conversacion[];
  };

  metrics: {
    roasActual: number;
    ventasTotales: number;
    novedadesRelacionadas: number;
    diasActivo: number;
    diasAntesSaturacion?: number;
  };
}

export interface BusinessMemoryFact {
  id: string;
  clave: string;
  valor: string;
  origen: string;
  timestamp: number;
  editable: boolean;
}

// =========================================================================
// SEED — datos demo realistas
// =========================================================================

const SEED_PROJECT: GaliProject = {
  id: 'proj-collar-bog',
  name: 'Lanzamiento Collar GPS — Bogotá',
  status: 'activo',
  created_at: Date.now() - 1000 * 60 * 60 * 24 * 5,
  last_activity: Date.now() - 1000 * 60 * 60 * 2,
  product: {
    id: 'p-collar',
    nombre: 'Collar GPS para mascotas',
    anguloElegido: 'Mamá / seguridad emocional',
    ciudadPrincipal: 'Bogotá',
  },
  assets: [
    { id: 'a-1', tipo: 'landing', nombre: 'Landing v2 — mamás', status: 'publicada' },
    { id: 'a-2', tipo: 'creative', nombre: 'Video B — testimonio', status: 'activo' },
    { id: 'a-3', tipo: 'creative', nombre: 'Video A — features', status: 'pausado' },
    { id: 'a-4', tipo: 'campaign', nombre: 'Meta Ads — Collar BOG', status: 'activa' },
  ],
  galiMemory: {
    decisiones: [
      {
        id: 'd-1',
        texto: 'Elegimos el ángulo "Mamá / seguridad emocional"',
        razonamiento: 'Mejor desempeño en el perfil similar (3.2x ROAS vs 2.1x del ángulo features).',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
      },
      {
        id: 'd-2',
        texto: 'Pausamos el creative A',
        razonamiento: 'CTR 0.9% vs 2.1% del Video B. Redirigimos el presupuesto.',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
      },
    ],
    aprendizajes: [
      {
        id: 'ap-1',
        texto: 'El Video B (testimonio) tiene 2x más CTR que el A (features) para este producto',
        origen: 'Comparativa de campañas, día 2',
        confianza: 'alta',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
      },
      {
        id: 'ap-2',
        texto: 'Tienes 14 días antes de saturación en Bogotá',
        origen: 'Curva de entrada calculada con vendedores similares',
        confianza: 'media',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
      },
      {
        id: 'ap-3',
        texto: 'La audiencia 25–34 femenina convierte 1.6x más que la 35–44',
        origen: 'Segmentación de campaña, día 3',
        confianza: 'alta',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1.5,
      },
    ],
    siguienteAccion: 'Expandir a Medellín — hay demanda sin competencia activa',
    siguienteAccionRazon:
      'Estimo +$200/día con el mismo creative y ángulo, basado en el desempeño actual en Bogotá.',
    conversaciones: [
      {
        id: 'c-1',
        resumen: 'Conversación de elección de ángulo — 5 alternativas evaluadas',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
      },
      {
        id: 'c-2',
        resumen: 'Análisis del primer día de campaña — recomendación de pause',
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1,
      },
    ],
  },
  metrics: {
    roasActual: 2.8,
    ventasTotales: 184,
    novedadesRelacionadas: 7,
    diasActivo: 5,
    diasAntesSaturacion: 14,
  },
};

const SEED_PROJECTS_EXTRA: GaliProject[] = [
  {
    id: 'proj-fitness',
    name: 'Nicho fitness — exploración',
    status: 'pausado',
    created_at: Date.now() - 1000 * 60 * 60 * 24 * 18,
    last_activity: Date.now() - 1000 * 60 * 60 * 24 * 6,
    product: undefined,
    assets: [],
    galiMemory: {
      decisiones: [],
      aprendizajes: [
        {
          id: 'ap-f1',
          texto: 'En fitness, los productos con video unboxing convierten 40% mejor',
          origen: 'Investigación de competencia',
          confianza: 'media',
          timestamp: Date.now() - 1000 * 60 * 60 * 24 * 18,
        },
      ],
      siguienteAccion: 'Definir si seguimos o cerramos el proyecto',
      conversaciones: [],
    },
    metrics: { roasActual: 0, ventasTotales: 0, novedadesRelacionadas: 0, diasActivo: 18 },
  },
];

const SEED_BUSINESS_FACTS: BusinessMemoryFact[] = [
  {
    id: 'bf-1',
    clave: 'Nivel del dropshipper',
    valor: 'Operador (8 meses en Dropi)',
    origen: 'Onboarding inicial + comportamiento detectado',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60,
    editable: true,
  },
  {
    id: 'bf-2',
    clave: 'Ciudad principal de operación',
    valor: 'Bogotá',
    origen: 'Onboarding inicial',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60,
    editable: true,
  },
  {
    id: 'bf-3',
    clave: 'Mayor dolor actual',
    valor: 'Campañas no dan el ROAS esperado',
    origen: 'Onboarding pregunta 3',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 60,
    editable: true,
  },
  {
    id: 'bf-4',
    clave: 'Categorías exploradas',
    valor: 'Mascotas, Hogar, Tecnología',
    origen: 'Historial de navegación en catálogo',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30,
    editable: true,
  },
];

// =========================================================================
// SERVICE
// =========================================================================

const KEY_PROJECTS = 'gali_v2_projects';
const KEY_BUSINESS = 'gali_v2_business_facts';

@Injectable({ providedIn: 'root' })
export class MemoriaService {
  private projectsSubject: BehaviorSubject<GaliProject[]>;
  private businessSubject: BehaviorSubject<BusinessMemoryFact[]>;

  readonly projects$: Observable<GaliProject[]>;
  readonly business$: Observable<BusinessMemoryFact[]>;

  constructor() {
    this.projectsSubject = new BehaviorSubject<GaliProject[]>(this.loadProjects());
    this.businessSubject = new BehaviorSubject<BusinessMemoryFact[]>(this.loadBusiness());
    this.projects$ = this.projectsSubject.asObservable();
    this.business$ = this.businessSubject.asObservable();
  }

  get projects(): GaliProject[] { return this.projectsSubject.value; }
  get businessFacts(): BusinessMemoryFact[] { return this.businessSubject.value; }

  getProject(id: string): GaliProject | undefined {
    return this.projects.find(p => p.id === id);
  }

  proyectosActivos(): GaliProject[] {
    return this.projects.filter(p => p.status === 'activo');
  }

  crearProyecto(name: string, productoNombre?: string): GaliProject {
    const nuevo: GaliProject = {
      id: `proj-${Date.now()}`,
      name,
      status: 'activo',
      created_at: Date.now(),
      last_activity: Date.now(),
      product: productoNombre
        ? {
            id: `p-${Date.now()}`,
            nombre: productoNombre,
            anguloElegido: 'por definir',
            ciudadPrincipal: 'por definir',
          }
        : undefined,
      assets: [],
      galiMemory: {
        decisiones: [],
        aprendizajes: [],
        siguienteAccion: 'Definir el ángulo de venta',
        conversaciones: [],
      },
      metrics: { roasActual: 0, ventasTotales: 0, novedadesRelacionadas: 0, diasActivo: 0 },
    };
    this.update([nuevo, ...this.projects]);
    return nuevo;
  }

  actualizarProyecto(p: GaliProject) {
    this.update(this.projects.map(x => (x.id === p.id ? { ...p, last_activity: Date.now() } : x)));
  }

  archivarProyecto(id: string) {
    const target = this.getProject(id);
    if (!target) return;
    this.actualizarProyecto({ ...target, status: 'archivado' });
  }

  // --- Aprendizajes editables ---
  marcarAprendizajeObsoleto(projectId: string, apId: string) {
    const proj = this.getProject(projectId);
    if (!proj) return;
    const next = {
      ...proj,
      galiMemory: {
        ...proj.galiMemory,
        aprendizajes: proj.galiMemory.aprendizajes.map(a =>
          a.id === apId ? { ...a, obsoleto: true } : a,
        ),
      },
    };
    this.actualizarProyecto(next);
  }

  editarAprendizaje(projectId: string, apId: string, nuevoTexto: string) {
    const proj = this.getProject(projectId);
    if (!proj) return;
    const next = {
      ...proj,
      galiMemory: {
        ...proj.galiMemory,
        aprendizajes: proj.galiMemory.aprendizajes.map(a =>
          a.id === apId ? { ...a, texto: nuevoTexto } : a,
        ),
      },
    };
    this.actualizarProyecto(next);
  }

  borrarAprendizaje(projectId: string, apId: string) {
    const proj = this.getProject(projectId);
    if (!proj) return;
    const next = {
      ...proj,
      galiMemory: {
        ...proj.galiMemory,
        aprendizajes: proj.galiMemory.aprendizajes.filter(a => a.id !== apId),
      },
    };
    this.actualizarProyecto(next);
  }

  // --- Business facts ---
  editarBusinessFact(id: string, nuevoValor: string) {
    const next = this.businessFacts.map(f =>
      f.id === id ? { ...f, valor: nuevoValor, timestamp: Date.now() } : f,
    );
    this.businessSubject.next(next);
    this.persistBusiness(next);
  }

  borrarBusinessFact(id: string) {
    const next = this.businessFacts.filter(f => f.id !== id);
    this.businessSubject.next(next);
    this.persistBusiness(next);
  }

  resetSeed() {
    const all = [SEED_PROJECT, ...SEED_PROJECTS_EXTRA];
    this.update(all);
    this.businessSubject.next(SEED_BUSINESS_FACTS);
    this.persistBusiness(SEED_BUSINESS_FACTS);
  }

  // ---
  private update(next: GaliProject[]) {
    this.projectsSubject.next(next);
    try { localStorage.setItem(KEY_PROJECTS, JSON.stringify(next)); } catch {}
  }

  private persistBusiness(next: BusinessMemoryFact[]) {
    try { localStorage.setItem(KEY_BUSINESS, JSON.stringify(next)); } catch {}
  }

  private loadProjects(): GaliProject[] {
    try {
      const raw = localStorage.getItem(KEY_PROJECTS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return [SEED_PROJECT, ...SEED_PROJECTS_EXTRA];
  }

  private loadBusiness(): BusinessMemoryFact[] {
    try {
      const raw = localStorage.getItem(KEY_BUSINESS);
      if (raw) return JSON.parse(raw);
    } catch {}
    return SEED_BUSINESS_FACTS;
  }
}
