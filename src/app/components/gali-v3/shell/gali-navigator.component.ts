import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliProjectService } from '../../../services/gali-v3/project.service';
import { GaliBusinessService } from '../../../services/gali-v3/business.service';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';

@Component({
  selector: 'gali-navigator',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gali-navigator.component.html',
  styleUrls: ['./gali-navigator.component.scss'],
})
export class GaliNavigatorComponent {
  private projectSvc = inject(GaliProjectService);
  private businessSvc = inject(GaliBusinessService);
  private marketSvc = inject(GaliMarketplaceService);

  proyectosActivos = this.projectSvc.proyectosActivos;
  proyectosPausados = this.projectSvc.proyectosPausados;
  proyectosCompletados = this.projectSvc.proyectosCompletados;

  snapshot = this.businessSvc.snapshot;
  agentesInstalados = this.marketSvc.agentesInstalados;
  conexionesActivas = this.marketSvc.conexionesActivas;

  format(n: number) {
    return this.businessSvc.formatCurrency(n);
  }
}
