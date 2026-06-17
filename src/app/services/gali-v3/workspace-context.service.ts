import { Injectable, computed, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

export type WorkspaceModo = 'operar' | 'lanzar' | 'medir' | 'construir' | 'comunidad';

export interface ModoPreset {
  id: WorkspaceModo;
  emoji: string;
  label: string;
  route: string;
}

export const WORKSPACE_MODOS: ModoPreset[] = [
  { id: 'operar', emoji: '⚡', label: 'Operar', route: '/gali-v3/vista/operacion-hoy' },
  { id: 'lanzar', emoji: '🚀', label: 'Lanzar', route: '/gali-v3/proyecto/collar-gps-2026' },
  { id: 'medir', emoji: '📊', label: 'Medir', route: '/gali-v3/vista/rentabilidad-semana' },
  { id: 'construir', emoji: '🔧', label: 'Construir', route: '/gali-v3/builder' },
  { id: 'comunidad', emoji: '🌐', label: 'Comunidad', route: '/gali-v3/comunidad' },
];

@Injectable({ providedIn: 'root' })
export class WorkspaceContextService {
  private url = signal(this.router.url);

  readonly modeHeader = computed(() => {
    const u = this.url();
    if (u.includes('/builder')) return '🔧 Construyendo · Recetas';
    if (u.includes('/proyecto/collar-gps')) return '🚀 Lanzando · Collar GPS';
    if (u.includes('/proyecto/nuevo')) return '🚀 Lanzando · Nuevo proyecto';
    if (u.includes('/vista/rentabilidad-semana')) return '📊 Midiendo · Semana';
    if (u.includes('/comunidad')) return '🌐 Comunidad · Aprendiendo';
    if (u.includes('/bloque-builder')) return '🔧 Construyendo · Tableros';
    if (u.includes('/vista/operacion-hoy') || u === '/gali-v3' || u === '/gali-v3/') {
      return '⚡ Operando · Hoy';
    }
    if (u.includes('/objetivo')) return '🎯 Objetivo · Roadmap';
    if (u.includes('/mi-stack')) return '🔌 Mis apps conectadas';
    return '⚡ Operando · Hoy';
  });

  readonly modoActivo = computed((): WorkspaceModo => {
    const u = this.url();
    if (u.includes('/builder') || u.includes('/bloque-builder')) return 'construir';
    if (u.includes('/proyecto')) return 'lanzar';
    if (u.includes('/vista/rentabilidad')) return 'medir';
    if (u.includes('/comunidad')) return 'comunidad';
    return 'operar';
  });

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.url.set(e.urlAfterRedirects));
  }

  navigateModo(modo: WorkspaceModo) {
    const preset = WORKSPACE_MODOS.find(m => m.id === modo);
    if (preset) this.router.navigateByUrl(preset.route);
  }
}
