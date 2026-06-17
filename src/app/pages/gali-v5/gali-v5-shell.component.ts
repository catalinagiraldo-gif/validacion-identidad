import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { DropiHeaderIa2Component } from './components/dropi-header-ia2.component';
import { DropiIconRailComponent } from './components/dropi-icon-rail.component';
import { DropiMenuActionComponent } from './components/dropi-menu-action.component';
import { DropiSectionNavComponent } from './components/dropi-section-nav.component';
import { GaliRightPanelComponent } from './components/gali-right-panel/gali-right-panel.component';
import { DropiPanelSplitterComponent } from './components/dropi-panel-splitter/dropi-panel-splitter.component';
import { GaliContextStripComponent, ContextKey } from './components/gali-context-strip/gali-context-strip.component';
import { GaliIntentBarComponent } from './components/gali-intent-bar/gali-intent-bar.component';
import {
  GALI_MISSION_PANEL,
  resolveActiveRailKey,
  resolveSectionPanel,
  SectionPanel,
} from './dropi-sections.config';
import { DropiPrototypeFeedbackService } from './services/dropi-prototype-feedback.service';
import { GaliStateService } from './services/gali-state.service';
import { GaliWorkspaceService } from './services/gali-workspace.service';

@Component({
  selector: 'app-gali-v5-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DropiHeaderIa2Component,
    DropiIconRailComponent,
    DropiMenuActionComponent,
    DropiSectionNavComponent,
    GaliRightPanelComponent,
    DropiPanelSplitterComponent,
    GaliContextStripComponent,
    GaliIntentBarComponent,
  ],
  templateUrl: './gali-v5-shell.component.html',
  styleUrl: './gali-v5-shell.component.scss',
})
export class GaliV5ShellComponent {
  auth = inject(AuthService);
  private router = inject(Router);
  readonly feedback = inject(DropiPrototypeFeedbackService);
  readonly galiState = inject(GaliStateService);
  readonly ws = inject(GaliWorkspaceService);

  private readonly agentColors: Record<string, string> = {
    'Roax': '#f97316', 'roax': '#f97316',
    'Vigilante': '#fbbf24', 'vigilante': '#fbbf24',
    'Chatea Pro': '#34d399', 'chatea': '#34d399',
    'ADA Spy': '#818cf8', 'ada': '#818cf8',
    'Gali': '#ff6102',
  };

  agentColor(name: string): string {
    return this.agentColors[name] ?? '#9898a8';
  }

  sectionPanel = signal<SectionPanel>(GALI_MISSION_PANEL);
  sectionNavCollapsed = signal(localStorage.getItem('dropi-section-collapsed') === 'true');
  hasSectionPanel = signal(true);
  isCompactNav = signal(false);
  sectionWidth = signal(parseInt(localStorage.getItem('dropi-section-width') ?? '200', 10));
  currentContextKey = signal<ContextKey>(null);

  constructor() {
    this.syncNav(this.router.url);
    this.updateViewport();
    this.galiState.setPanelWidth(this.galiState.panelWidth());

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncNav(e.urlAfterRedirects));
  }

  /** Feedback en botones sin handler — evita sensación de "salir" del prototipo */
  @HostListener('click', ['$event'])
  onPrototypeClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.closest('a[routerLink], a[href]')) return;

    const btn = target.closest('button');
    if (!btn || btn.hasAttribute('data-proto-skip') || btn.disabled) return;

    const skipHost = btn.closest(
      'dropi-icon-rail, dropi-section-nav, dropi-header-ia2, dropi-menu-action, gali-right-panel',
    );
    if (skipHost) return;

    const label =
      btn.getAttribute('aria-label')
      || btn.getAttribute('title')
      || btn.textContent?.replace(/\s+/g, ' ').trim().slice(0, 48)
      || 'Acción';

    this.feedback.action(label);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewport();
  }

  toggleSectionNav(): void {
    const next = !this.sectionNavCollapsed();
    this.sectionNavCollapsed.set(next);
    localStorage.setItem('dropi-section-collapsed', String(next));
  }

  collapseSectionNav(): void {
    this.sectionNavCollapsed.set(true);
    localStorage.setItem('dropi-section-collapsed', 'true');
  }

  /** True when the active route is the Gali OS workspace (home, no section panel) */
  readonly isOsWorkspace = signal(false);

  private syncNav(url: string): void {
    const panel = resolveSectionPanel(url);
    if (panel) {
      this.sectionPanel.set(panel);
      this.hasSectionPanel.set(true);
      // Preserve user-set collapsed state — only restore from localStorage
      this.isOsWorkspace.set(false);
    } else {
      this.hasSectionPanel.set(false);
      this.isOsWorkspace.set(false);
    }
    this.currentContextKey.set(this.resolveContextKey(url));
  }

  private resolveContextKey(url: string): ContextKey {
    const railKey = resolveActiveRailKey(url);
    const map: Record<string, ContextKey> = {
      pedidos: 'pedidos',
      marketing: 'marketing',
      productos: 'productos',
      financiero: 'financiero',
      logistica: 'logistica',
      reportes: 'reportes',
      proyectos: 'proyectos',
      home: 'home',
      agentes: 'home',
      skills: 'home',
      reglas: 'home',
      marketplace: 'home',
      conexiones: 'home',
    };
    return map[railKey] ?? null;
  }

  private updateViewport(): void {
    this.isCompactNav.set(window.innerWidth < 1024);
  }

  panelMaxWidth(): number {
    return Math.floor(window.innerWidth * 0.78);
  }

  onGaliPanelWidthChange(w: number): void {
    this.galiState.setPanelWidth(w);
  }

  onSplitterWidthChange(w: number): void {
    this.sectionWidth.set(w);
    document.documentElement.style.setProperty('--dropi-section-col', `${w}px`);
    localStorage.setItem('dropi-section-width', String(w));
  }

  onSplitterDragStart(): void {
    // disable transition during drag for performance
    document.documentElement.style.setProperty('--section-transition', 'none');
  }

  onSplitterDragEnd(): void {
    document.documentElement.style.removeProperty('--section-transition');
  }
}
