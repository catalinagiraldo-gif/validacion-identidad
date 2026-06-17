import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  DROPI_ICON_RAIL,
  IconRailItem,
  resolveActiveRailKey,
} from '../dropi-sections.config';

@Component({
  selector: 'dropi-icon-rail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="icon-rail" aria-label="Navegación principal">
      <!-- ✦ Gali Hub logo -->
      <a routerLink="/gali-v5" class="icon-rail__logo-btn"
         [class.icon-rail__logo-btn--active]="activeKey() === 'home'"
         title="Gali Hub" aria-label="Gali Hub">
        <span class="icon-rail__spark" aria-hidden="true">✦</span>
      </a>

      <div class="icon-rail__main">

        <!-- Módulos operativos -->
        <div class="icon-rail__group">
          @for (item of mainItems; track item.key) {
            <a
              [routerLink]="item.route"
              class="icon-rail__item"
              [class.icon-rail__item--active]="activeKey() === item.key"
              [title]="item.label"
              [attr.aria-label]="item.label"
              [attr.aria-current]="activeKey() === item.key ? 'page' : null">
              <span class="icon-rail__item-inner">
                <span
                  class="icon-rail__svg"
                  [style.--icon-url]="'url(' + item.icon + ')'"
                  aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>

        <div class="icon-rail__divider" aria-hidden="true"></div>

        <!-- Utilidades -->
        <div class="icon-rail__group">
          @for (item of utilityItems; track item.key) {
            <a
              [routerLink]="item.route"
              class="icon-rail__item"
              [class.icon-rail__item--active]="activeKey() === item.key"
              [title]="item.label"
              [attr.aria-label]="item.label"
              [attr.aria-current]="activeKey() === item.key ? 'page' : null">
              <span class="icon-rail__item-inner">
                <span
                  class="icon-rail__svg"
                  [style.--icon-url]="'url(' + item.icon + ')'"
                  aria-hidden="true"></span>
              </span>
            </a>
          }
        </div>

      </div>

      <div class="icon-rail__footer">
        <button type="button" class="icon-rail__item icon-rail__item--heart" title="Creado con Dropi">
          <span class="icon-rail__item-inner">
            <i class="pi pi-heart-fill" aria-hidden="true"></i>
          </span>
        </button>
      </div>
    </nav>
  `,
  styleUrl: './dropi-icon-rail.component.scss',
})
export class DropiIconRailComponent {
  private router = inject(Router);

  activeKey = signal(resolveActiveRailKey(inject(Router).url));
  mainItems: IconRailItem[] = DROPI_ICON_RAIL.filter(i => i.group === 'main');
  utilityItems: IconRailItem[] = DROPI_ICON_RAIL.filter(i => i.group === 'utility');

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.activeKey.set(resolveActiveRailKey(e.urlAfterRedirects)));
  }
}
