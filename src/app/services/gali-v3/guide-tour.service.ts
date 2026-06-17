import { Injectable, signal } from '@angular/core';

export type GuideTourPlacement = 'center' | 'bottom' | 'right' | 'left' | 'top';

export interface GuideTourStep {
  id: string;
  title: string;
  body: string;
  /** CSS selector for spotlight target; omit for centered modal step */
  target?: string;
  placement?: GuideTourPlacement;
  /** Run before showing this step (e.g. open right panel) */
  onEnter?: () => void;
}

const STORAGE_KEY = 'gali-v4-guide-tour-done';

@Injectable({ providedIn: 'root' })
export class GaliGuideTourService {
  readonly active = signal(false);
  readonly stepIndex = signal(0);

  readonly steps: GuideTourStep[] = [
    {
      id: 'welcome',
      title: 'Bienvenido a Gali V4',
      body: 'Gali es tu socio de operación en Dropi. Este tour te muestra dónde está cada cosa para que no te pierdas — son 8 pasos, menos de 2 minutos.',
      placement: 'center',
    },
    {
      id: 'topbar-nav',
      title: 'Navegación principal',
      body: 'Inicio es tu lienzo del día. Builder arma automatizaciones. Mercado trae plantillas y agentes. Catálogo es tu inventario despertado con Gali.',
      target: '[data-tour="topbar-nav"]',
      placement: 'bottom',
    },
    {
      id: 'signals',
      title: 'Señales de Gali',
      body: 'Las señales ⚡ son cosas que Gali detectó sola: CTR cayó, novedades logísticas, oportunidades. No tienes que ir a buscarlas — ella te avisa.',
      target: '[data-tour="topbar-signals"]',
      placement: 'bottom',
    },
    {
      id: 'navigator',
      title: 'Navigator — tu negocio en vivo',
      body: 'Pedidos, catálogo, campañas y wallet con datos reales. Abajo están tus proyectos activos y accesos al builder y mercado.',
      target: '[data-tour="shell-nav"]',
      placement: 'right',
    },
    {
      id: 'canvas',
      title: 'Tu lienzo personalizable',
      body: 'Aquí ves bloques de tu operación: pedidos, métricas, novedades… Reordénalos con “Editar lienzo” o pídele a Gali que arme tu día con ⌘K.',
      target: '[data-tour="shell-canvas"]',
      placement: 'left',
    },
    {
      id: 'rpanel',
      title: 'Panel Gali',
      body: 'Chatea con Gali, revisa tu negocio en vivo y accede a tus bloques custom. Abre o cierra con el botón “Gali” o el atajo ⌘J.',
      target: '[data-tour="shell-rpanel"]',
      placement: 'left',
    },
    {
      id: 'cmdk',
      title: 'Atajo ⌘K — ir a cualquier lado',
      body: 'Presiona ⌘K (o Ctrl+K) desde cualquier pantalla para buscar rutas, ejecutar acciones o pedirle a Gali que arme una vista.',
      target: '[data-tour="topbar-cmdk"]',
      placement: 'bottom',
    },
    {
      id: 'mapa',
      title: 'Mapa del negocio ⌘M',
      body: 'Visualiza cómo se conectan productos, campañas, proveedores y transportadoras. Los nodos rojos son donde Gali necesita tu atención hoy.',
      target: '[data-tour="nav-mapa"]',
      placement: 'right',
    },
    {
      id: 'done',
      title: 'Listo — ya sabes dónde estás',
      body: 'Vuelve a este tour cuando quieras desde el botón “?” en la barra superior. Empieza por revisar tus señales o escribe en el chat de Gali.',
      placement: 'center',
    },
  ];

  currentStep = () => this.steps[this.stepIndex()] ?? this.steps[0];

  shouldAutoStart(forceTour = false): boolean {
    if (forceTour) return true;
    try {
      return localStorage.getItem(STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  }

  start(force = false): void {
    if (!force && this.active()) return;
    this.stepIndex.set(0);
    this.active.set(true);
    this.runStepHook(0);
  }

  next(): void {
    const i = this.stepIndex();
    if (i < this.steps.length - 1) {
      const next = i + 1;
      this.stepIndex.set(next);
      this.runStepHook(next);
    } else {
      this.finish();
    }
  }

  prev(): void {
    const i = this.stepIndex();
    if (i > 0) {
      const prev = i - 1;
      this.stepIndex.set(prev);
      this.runStepHook(prev);
    }
  }

  skip(): void {
    this.finish();
  }

  finish(): void {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // no-op
    }
    this.active.set(false);
  }

  restart(): void {
    this.start(true);
  }

  registerStepHook(stepId: string, hook: () => void): void {
    this.stepHooks.set(stepId, hook);
  }

  private stepHooks = new Map<string, () => void>();

  private runStepHook(index: number): void {
    const step = this.steps[index];
    step.onEnter?.();
    this.stepHooks.get(step.id)?.();
  }
}
