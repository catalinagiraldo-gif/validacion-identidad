import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import { GaliHeaderInputComponent } from '../../../components/gali-v2/gali-header-input/gali-header-input.component';
import { GaliResponseOverlayComponent } from '../../../components/gali-v2/gali-response-overlay/gali-response-overlay.component';
import { MemoriaService, GaliProject } from '../../../services/gali-v2/memoria.service';

@Component({
  selector: 'app-proyectos-lista',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    GaliMarkComponent,
    GaliHeaderInputComponent,
    GaliResponseOverlayComponent,
  ],
  templateUrl: './proyectos-lista.component.html',
  styleUrls: ['./proyectos-lista.component.scss'],
})
export class ProyectosListaComponent {
  private memoria = inject(MemoriaService);

  readonly proyectos$ = this.memoria.projects$;

  trackById(_i: number, p: GaliProject) { return p.id; }

  diasDesde(ts: number): number {
    return Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24));
  }

  resetSeed() { this.memoria.resetSeed(); }

  crearVacio() {
    this.memoria.crearProyecto('Proyecto sin nombre — ' + new Date().toLocaleDateString());
  }
}
