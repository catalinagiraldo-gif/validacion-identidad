import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ProximosPasosService } from '../../../services/gali-v3/proximos-pasos.service';

@Component({
  selector: 'gali-breadcrumb',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-breadcrumb.component.html',
  styleUrls: ['./gali-breadcrumb.component.scss'],
})
export class GaliBreadcrumbComponent {
  private router = inject(Router);
  private svc = inject(ProximosPasosService);

  private url = signal<string>(this.router.url);

  ctx = computed(() => this.svc.rutaActual(this.url()));
  bread = computed(() => this.svc.breadcrumbFor(this.ctx()));
  icon = computed(() => this.svc.iconFor(this.ctx()));

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.url.set(e.urlAfterRedirects));
  }
}
