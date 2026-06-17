import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DROPI_SCREENS, DropiScreen } from '../dropi-sections.config';

@Component({
  selector: 'app-dropi-section-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="placeholder">
      <div class="placeholder__card">
        <span class="placeholder__badge">Dropi baseline · Gali V5</span>
        <h1>{{ title }}</h1>
        <p>
          Pantalla pendiente de implementación pixel-perfect según Figma
          <em>Re-arquitectura — UI Oficial</em>.
        </p>
        <div class="placeholder__meta" *ngIf="figmaNode">
          <span>Figma node: {{ figmaNode }}</span>
        </div>
        <a routerLink="/gali-v5" class="placeholder__back">← Volver a Inicio</a>
      </div>

      <aside class="placeholder__nav">
        <h2>Mapa de secciones Dropi</h2>
        <ul>
          <li *ngFor="let s of screens">
            <a
              [routerLink]="s.route"
              [class.placeholder__nav-link--active]="s.route === currentRoute"
              [class.placeholder__nav-link--ready]="s.status === 'ready'"
              class="placeholder__nav-link">
              <span class="placeholder__nav-rail">{{ s.railKey }}</span>
              {{ s.label }}
              <span class="placeholder__status" [attr.data-status]="s.status">
                {{ s.status === 'ready' ? 'listo' : 'pendiente' }}
              </span>
            </a>
          </li>
        </ul>
      </aside>
    </div>
  `,
  styleUrl: './section-placeholder.component.scss',
})
export class DropiSectionPlaceholderComponent {
  private route = inject(ActivatedRoute);

  title = 'Sección';
  figmaNode = '';
  currentRoute = '';
  screens: DropiScreen[] = DROPI_SCREENS;

  constructor() {
    this.route.data.subscribe(data => {
      this.title = data['title'] ?? 'Sección';
      this.figmaNode = data['figmaNode'] ?? '';
    });
    this.route.url.subscribe(() => {
      this.currentRoute = '/' + this.route.snapshot.pathFromRoot
        .flatMap(r => r.url.map(u => u.path))
        .filter(Boolean)
        .join('/');
    });
  }
}
