import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';
import { SignalHighlightDirective } from '../../../components/gali-v3/shared/signal-highlight.directive';

@Component({
  selector: 'app-gali-v3-proyecto',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent, SignalHighlightDirective],
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.scss'],
})
export class GaliV3ProyectoComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectSvc = inject(GaliProjectService);
  private chatSvc = inject(GaliChatService);

  routeId = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  tab = signal<'memoria' | 'historial' | 'artifacts'>('memoria');
  newProjectName = signal('');

  project = computed(() => {
    const id = this.routeId().get('id');
    if (!id || id === 'nuevo') return null;
    return this.projectSvc.getById(id);
  });

  isCreating = computed(() => this.routeId().get('id') === 'nuevo');

  setTab(t: 'memoria' | 'historial' | 'artifacts') {
    this.tab.set(t);
  }

  ejecutarSiguienteAccion() {
    const p = this.project();
    if (!p) return;
    this.chatSvc.send(`Ejecuta la siguiente acción del proyecto ${p.name}: ${p.memory.siguiente_accion}`, {
      projectId: p.id,
    });
  }

  contarMe() {
    const p = this.project();
    if (!p) return;
    this.chatSvc.send(`Cuéntame más sobre esta sugerencia y cómo ejecutarla`, { projectId: p.id });
  }

  masTarde() {
    // no-op visual
  }

  createNew() {
    const name = this.newProjectName().trim() || 'Nuevo proyecto';
    const p = this.projectSvc.create(name);
    this.router.navigate(['/gali-v3/proyecto', p.id]);
  }
}
