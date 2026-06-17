import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'demo-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dn" [class.dn--expanded]="expanded()">
      <button
        class="dn__toggle"
        (click)="toggle()"
        [attr.aria-label]="expanded() ? 'Cerrar navegación demo' : 'Saltar entre pantallas'"
        [title]="expanded() ? 'Cerrar' : 'Saltar entre pantallas (demo)'"
      >
        <span class="dn__toggle-icon" *ngIf="!expanded()">⇄</span>
        <span class="dn__toggle-icon" *ngIf="expanded()">✕</span>
      </button>

      <div class="dn__menu" *ngIf="expanded()">
        <header class="dn__header">
          <span class="dn__title">SALTAR A</span>
          <span class="dn__sub">Demo navigation</span>
        </header>

        <a
          *ngFor="let item of items; let i = index"
          class="dn__item"
          [routerLink]="item.route"
          routerLinkActive="dn__item--active"
          [routerLinkActiveOptions]="{ exact: true }"
          [style.animation-delay.ms]="i * 60"
          (click)="close()"
        >
          <span class="dn__item-num">{{ i + 1 }}</span>
          <span class="dn__item-icon">{{ item.icon }}</span>
          <div class="dn__item-body">
            <span class="dn__item-label">{{ item.label }}</span>
            <span class="dn__item-sub">{{ item.sub }}</span>
          </div>
        </a>

        <footer class="dn__footer">
          <button class="dn__reset" (click)="resetDemo()">
            ↺ Resetear demo
          </button>
        </footer>
      </div>
    </div>
  `,
  styleUrl: './demo-nav.component.scss',
})
export class DemoNavComponent {
  expanded = signal(false);

  items = [
    { route: '/gali', icon: '🏠', label: 'Dashboard', sub: 'Pantalla 1 · home' },
    { route: '/gali/onboarding', icon: '👋', label: 'Onboarding', sub: 'Pantalla 0 · 3 preguntas' },
    { route: '/gali/descubrimiento', icon: '🔍', label: 'Descubrimiento', sub: 'Pantalla 2 · buscar producto' },
    { route: '/gali/estrategia', icon: '🎯', label: 'Estrategia', sub: 'Pantalla 3 · buyer persona' },
    { route: '/gali/creacion', icon: '🎨', label: 'Creación', sub: 'Pantalla 4 · landing + creatives' },
    { route: '/gali/lanzamiento', icon: '🚀', label: 'Lanzamiento', sub: 'Pantalla 5 · campaña + ROAS' },
  ];

  constructor(private router: Router) {}

  toggle(): void {
    this.expanded.set(!this.expanded());
  }

  close(): void {
    this.expanded.set(false);
  }

  resetDemo(): void {
    sessionStorage.clear();
    this.close();
    this.router.navigate(['/gali/onboarding']);
  }
}
