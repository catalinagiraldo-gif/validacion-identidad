import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import { GaliHeaderInputComponent } from '../../../components/gali-v2/gali-header-input/gali-header-input.component';
import { GaliResponseOverlayComponent } from '../../../components/gali-v2/gali-response-overlay/gali-response-overlay.component';
import { GaliMemoryInspectorComponent } from '../../../components/gali-v2/gali-memory-inspector/gali-memory-inspector.component';
import { Aprendizaje, MemoriaService } from '../../../services/gali-v2/memoria.service';

type Tab = 'conversaciones' | 'decisiones' | 'assets' | 'resultados';

@Component({
  selector: 'app-proyecto-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    GaliMarkComponent,
    GaliHeaderInputComponent,
    GaliResponseOverlayComponent,
    GaliMemoryInspectorComponent,
  ],
  templateUrl: './proyecto-detalle.component.html',
  styleUrls: ['./proyecto-detalle.component.scss'],
})
export class ProyectoDetalleComponent {
  private route = inject(ActivatedRoute);
  private memoria = inject(MemoriaService);

  readonly projectId = toSignal(this.route.paramMap.pipe(map(p => p.get('id') ?? '')), {
    initialValue: '',
  });

  readonly proyectos = toSignal(this.memoria.projects$, { initialValue: this.memoria.projects });
  readonly proyecto = computed(() => this.proyectos().find(p => p.id === this.projectId()));

  tab = signal<Tab>('decisiones');
  inspeccionando = signal<Aprendizaje | null>(null);

  setTab(t: Tab) { this.tab.set(t); }
  abrirInspector(a: Aprendizaje) { this.inspeccionando.set(a); }
  cerrarInspector() { this.inspeccionando.set(null); }

  onGuardarAprendizaje(nuevoTexto: string) {
    const proj = this.proyecto();
    const insp = this.inspeccionando();
    if (proj && insp) {
      this.memoria.editarAprendizaje(proj.id, insp.id, nuevoTexto);
      this.cerrarInspector();
    }
  }

  onObsoleto() {
    const proj = this.proyecto();
    const insp = this.inspeccionando();
    if (proj && insp) {
      this.memoria.marcarAprendizajeObsoleto(proj.id, insp.id);
      this.cerrarInspector();
    }
  }

  onBorrar() {
    const proj = this.proyecto();
    const insp = this.inspeccionando();
    if (proj && insp) {
      this.memoria.borrarAprendizaje(proj.id, insp.id);
      this.cerrarInspector();
    }
  }
}
