import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliBusinessService } from '../../../services/gali-v3/business.service';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { GaliMemoryService } from '../../../services/gali-v3/memory.service';
import { GaliProjectService } from '../../../services/gali-v3/project.service';

@Component({
  selector: 'gali-business-context',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali-business-context.component.html',
  styleUrls: ['./gali-business-context.component.scss'],
})
export class GaliBusinessContextComponent {
  private businessSvc = inject(GaliBusinessService);
  private signalsSvc = inject(GaliSignalsService);
  private memorySvc = inject(GaliMemoryService);
  private projectSvc = inject(GaliProjectService);

  snapshot = this.businessSvc.snapshot;
  signals = this.signalsSvc.active;
  memory = this.memorySvc.memory;
  proyectosActivos = this.projectSvc.proyectosActivos;

  editingAprendizaje = signal<number | null>(null);
  newAprendizaje = signal('');

  formatMoney(n: number): string {
    return this.businessSvc.formatCurrency(n);
  }

  removeAprendizaje(idx: number) {
    this.memorySvc.removeAprendizaje(idx);
  }

  addAprendizaje() {
    const txt = this.newAprendizaje().trim();
    if (!txt) return;
    this.memorySvc.addAprendizaje(txt);
    this.newAprendizaje.set('');
  }

  dismissSignal(id: string) {
    this.signalsSvc.dismiss(id);
  }
}
