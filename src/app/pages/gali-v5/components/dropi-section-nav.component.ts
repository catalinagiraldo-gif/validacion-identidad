import { Component, computed, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DROPI_ICON_RAIL, SectionNavItem, SectionPanel } from '../dropi-sections.config';
import { GaliStateService } from '../services/gali-state.service';

// Mapeo de route patterns → agent data para el prototipo
const ROUTE_AGENT_MAP: Array<{ pattern: string; name: string; color: string }> = [
  { pattern: 'pedidos',    name: 'Vigilante', color: '#fbbf24' },
  { pattern: 'novedades',  name: 'Vigilante', color: '#fbbf24' },
  { pattern: 'logistica',  name: 'Vigilante', color: '#fbbf24' },
  { pattern: 'marketing',  name: 'Roax',      color: '#f97316' },
  { pattern: 'roax',       name: 'Roax',      color: '#f97316' },
];

const ROUTE_PENDING_MAP: Record<string, number> = {
  pedidos: 3,
  novedades: 3,
};

@Component({
  selector: 'dropi-section-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav
      class="section-nav"
      [class.section-nav--collapsed]="collapsed()"
      [class.section-nav--ai]="isAiSection()"
      [attr.aria-label]="panel().title">
      <div class="section-nav__head" [class.section-nav__head--ai]="isAiSection()">
        @if (!collapsed()) {
          <h2 class="section-nav__title">
            <span *ngIf="isAiSection()" class="section-nav__ai-spark" aria-hidden="true">✦</span>
            {{ panel().title }}
          </h2>
        }
        <button
          type="button"
          class="section-nav__collapse"
          data-proto-skip
          [title]="collapsed() ? 'Expandir menú' : 'Colapsar menú'"
          [attr.aria-label]="collapsed() ? 'Expandir menú' : 'Colapsar menú'"
          (click)="collapsed() ? expandRequested.emit() : collapseRequested.emit()">
          <i class="pi" [class.pi-angle-double-right]="collapsed()" [class.pi-angle-double-left]="!collapsed()"></i>
        </button>
      </div>

      <ul class="section-nav__list">
        <li *ngFor="let item of panel().items" class="section-nav__item">
          <span *ngIf="item.type === 'header' && !collapsed()" class="section-nav__group-label">{{ item.label }}</span>
          <ng-container *ngIf="item.type !== 'header' && item.children?.length; else flatItem">
            <a
              *ngIf="collapsed() && item.children?.[0]?.route as firstRoute"
              [routerLink]="firstRoute"
              routerLinkActive="section-nav__row--active"
              class="section-nav__row section-nav__row--icon-only"
              [class.section-nav__row--child-active]="isChildRouteActive(item)"
              [title]="item.label"
              [attr.aria-label]="item.label">
              <span
                *ngIf="item.icon"
                class="section-nav__icon"
                [style.--icon-url]="'url(' + item.icon + ')'"
                aria-hidden="true"></span>
            </a>
            <button
              *ngIf="!collapsed()"
              type="button"
              class="section-nav__row section-nav__row--parent"
              data-proto-skip
              [class.section-nav__row--expanded]="isExpanded(item.id)"
              [class.section-nav__row--child-active]="isChildRouteActive(item)"
              (click)="toggleExpand(item.id)">
              <span
                *ngIf="item.icon"
                class="section-nav__icon"
                [style.--icon-url]="'url(' + item.icon + ')'"
                aria-hidden="true"></span>
              <span class="section-nav__label">{{ item.label }}</span>
              <i
                class="pi section-nav__chevron"
                [class.pi-chevron-up]="isExpanded(item.id)"
                [class.pi-chevron-down]="!isExpanded(item.id)"
                [class.section-nav__chevron--active]="isChildRouteActive(item)"></i>
            </button>
            <ul *ngIf="!collapsed() && isExpanded(item.id)" class="section-nav__tree">
              <li *ngFor="let child of item.children">
                <a
                  [routerLink]="child.route"
                  routerLinkActive="section-nav__tree-link--active"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="section-nav__tree-link">
                  <span class="section-nav__tree-line" aria-hidden="true"></span>
                  <span class="section-nav__tree-label">{{ child.label }}</span>
                </a>
              </li>
            </ul>
          </ng-container>

          <ng-template #flatItem>
            <a
              *ngIf="item.type !== 'header' && item.route"
              [routerLink]="item.route!"
              routerLinkActive="section-nav__row--active"
              [routerLinkActiveOptions]="linkActiveOptions(item.route!)"
              class="section-nav__row"
              [class.section-nav__row--icon-only]="collapsed()"
              [title]="collapsed() ? item.label : null"
              [attr.aria-label]="collapsed() ? item.label : null">
              <span
                *ngIf="item.icon"
                class="section-nav__icon"
                [style.--icon-url]="'url(' + item.icon + ')'"
                aria-hidden="true"></span>
              <span *ngIf="!collapsed()" class="section-nav__label">{{ item.label }}</span>
              <span *ngIf="!collapsed() && item.badge === 'nuevo'" class="section-nav__badge section-nav__badge--nuevo">Nuevo</span>
              <span *ngIf="!collapsed() && item.badge === 'beta'" class="section-nav__badge section-nav__badge--beta">Beta</span>
              <!-- Indicador de agente activo -->
              <ng-container *ngIf="!collapsed() && agentForItem(item); let ag">
                <span class="section-nav__agent-dot" [style.background]="ag.color" [title]="ag.name + ' activo'"></span>
                <span *ngIf="pendingForItem(item) > 0" class="section-nav__agent-badge">{{ pendingForItem(item) }}</span>
              </ng-container>
            </a>
          </ng-template>
        </li>
      </ul>

      @if (!collapsed() && panel().agentFooter; as af) {
        <div class="section-nav__agent-footer" [style.--af-color]="af.color">
          <span class="section-nav__af-dot" aria-hidden="true"></span>
          <div class="section-nav__af-info">
            <span class="section-nav__af-label">{{ af.label }}</span>
            <span class="section-nav__af-status">{{ af.statusLabel }}</span>
          </div>
          <button type="button" class="section-nav__af-btn" title="Abrir agente" aria-label="Abrir agente">
            <i class="pi pi-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      }
    </nav>
  `,
  styleUrl: './dropi-section-nav.component.scss',
})
export class DropiSectionNavComponent {
  panel = input.required<SectionPanel>();
  collapsed = input(false);
  collapseRequested = output<void>();
  expandRequested = output<void>();

  private router = inject(Router);
  private galiState = inject(GaliStateService);
  currentUrl = signal(this.router.url);

  readonly isAiSection = computed(() => {
    const url = this.currentUrl();
    // Exclude 'home' — its prefix /gali-v5 matches all routes in this shell
    return DROPI_ICON_RAIL.some(i =>
      i.group === 'ai' && i.key !== 'home' && i.matchPrefixes.some(p => url.startsWith(p))
    );
  });

  // User-toggled overrides — separate from panel defaults
  private readonly userOverrides = signal<Record<string, boolean>>({});
  // Panel defaults derived reactively via computed (no effect needed)
  private readonly panelDefaults = computed<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {};
    this.panel().items.forEach((item: SectionNavItem) => {
      if (item.defaultExpanded) defaults[item.id] = true;
    });
    return defaults;
  });

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl.set(e.urlAfterRedirects));
  }

  isExpanded(id: string): boolean {
    const override = this.userOverrides()[id];
    if (override !== undefined) return override;
    return this.panelDefaults()[id] ?? true;
  }

  toggleExpand(id: string): void {
    this.userOverrides.update(m => ({ ...m, [id]: !this.isExpanded(id) }));
  }

  isChildRouteActive(item: SectionNavItem): boolean {
    if (!item.children?.length) return false;
    const path = this.currentUrl().split('?')[0];
    return item.children.some(
      child => path === child.route || path.startsWith(`${child.route}/`),
    );
  }

  agentForItem(item: SectionNavItem): { name: string; color: string } | null {
    const route = item.route ?? '';
    const match = ROUTE_AGENT_MAP.find(m => route.includes(m.pattern));
    if (!match) return null;
    // Solo mostrar si el agente está activo
    const isActive = this.galiState.agents().some(a => a.name === match.name && a.status === 'activo');
    return isActive ? { name: match.name, color: match.color } : null;
  }

  pendingForItem(item: SectionNavItem): number {
    const route = item.route ?? '';
    const key = Object.keys(ROUTE_PENDING_MAP).find(k => route.includes(k));
    return key ? ROUTE_PENDING_MAP[key] : 0;
  }

  // Objetos estáticos para evitar cambios de referencia en cada ciclo de change detection
  // (nuevo objeto en cada llamada hace que RouterLinkActive dispare update() continuamente)
  private static readonly EXACT_OPTS = { exact: true } as const;
  private static readonly INEXACT_OPTS = { exact: false } as const;

  /** Hub y rutas con query deben ser exactas para no marcar todo el árbol como activo */
  linkActiveOptions(route: string): { exact: boolean } {
    const path = route.split('?')[0];
    if (path === '/gali-v5' || path === '/gali-v5/' || route.includes('?')) {
      return DropiSectionNavComponent.EXACT_OPTS;
    }
    return DropiSectionNavComponent.INEXACT_OPTS;
  }
}
