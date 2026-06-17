import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DROPI_ICON_RAIL, resolveActiveRailKey } from '../../dropi-sections.config';

@Component({
  selector: 'dropi-ia-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="ia-rail" aria-label="Gali IA — navegación">

      <!-- Header mark -->
      <div class="ia-rail__header">
        <span class="ia-rail__logo" aria-hidden="true">✦</span>
      </div>

      <div class="ia-rail__items">
        @for (item of aiItems; track item.key) {
          <a
            [routerLink]="item.route"
            class="ia-rail__item"
            [class.ia-rail__item--active]="activeKey() === item.key"
            [attr.aria-label]="item.label"
            [attr.aria-current]="activeKey() === item.key ? 'page' : null"
            [title]="item.label">
            <span
              class="ia-rail__icon"
              [style.--icon-url]="'url(' + item.icon + ')'"
              aria-hidden="true"></span>
            <span class="ia-rail__tooltip">{{ item.label }}</span>
          </a>
        }
      </div>

    </nav>
  `,
  styleUrl: './dropi-ia-rail.component.scss',
})
export class DropiIaRailComponent {
  private readonly router = inject(Router);

  readonly activeKey = signal(resolveActiveRailKey(inject(Router).url));

  readonly aiItems = DROPI_ICON_RAIL.filter(i => i.group === 'ai');

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.activeKey.set(resolveActiveRailKey(e.urlAfterRedirects)));
  }
}
