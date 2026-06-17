import { CommonModule } from '@angular/common';
import { Component, Input, computed, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ProximosPasosService, RutaContexto } from '../../../services/gali-v3/proximos-pasos.service';

@Component({
  selector: 'proximos-pasos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proximos-pasos.component.html',
  styleUrls: ['./proximos-pasos.component.scss'],
})
export class ProximosPasosComponent {
  private svc = inject(ProximosPasosService);
  private router = inject(Router);

  @Input() set contexto(ctx: RutaContexto | undefined) {
    this._ctx.set(ctx);
  }
  @Input() titulo: string = 'Lo que sigue';

  private _ctx = signal<RutaContexto | undefined>(undefined);

  pasos = computed(() => {
    const ctx = this._ctx() ?? this.svc.rutaActual(this.router.url);
    return this.svc.pasosFor(ctx);
  });

  go(route: string, queryParams?: Record<string, string>) {
    this.router.navigate([route], queryParams ? { queryParams } : undefined);
  }
}
