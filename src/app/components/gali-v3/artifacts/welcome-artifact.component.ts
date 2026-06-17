import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliMemoryService } from '../../../services/gali-v3/memory.service';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliSignalsService } from '../../../services/gali-v3/signals.service';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { ProximosPasosComponent } from '../shared/proximos-pasos.component';

@Component({
  selector: 'welcome-artifact',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './welcome-artifact.component.html',
  styleUrls: ['./welcome-artifact.component.scss'],
})
export class WelcomeArtifactComponent {
  private memorySvc = inject(GaliMemoryService);
  private projectSvc = inject(GaliProjectService);
  private signalsSvc = inject(GaliSignalsService);
  private marketSvc = inject(GaliMarketplaceService);
  private bloqueBuilderSvc = inject(GaliBloqueBuilderService);

  memoria = this.memorySvc.memory;
  proyectosActivos = this.projectSvc.proyectosActivos;
  signalsCount = this.signalsSvc.count;
  plantillasDestacadas = computed(() =>
    this.marketSvc.plantillas().slice(0, 3),
  );
  bloquesCustom = this.bloqueBuilderSvc.bloquesGuardados;
  bloquesCustomTop = computed(() => this.bloquesCustom().slice(-3).reverse());

  ultimoProyecto = computed(() => this.proyectosActivos()[0] ?? null);

  nivelTagline = computed(() => {
    const n = this.memoria().perfil.nivel;
    if (n === 'aprendiz') return 'Empezando. Vamos paso a paso.';
    if (n === 'operador') return 'Operando con consistencia. Hora de optimizar.';
    return 'Centro de mando. Tú decides, Gali ejecuta.';
  });
}
