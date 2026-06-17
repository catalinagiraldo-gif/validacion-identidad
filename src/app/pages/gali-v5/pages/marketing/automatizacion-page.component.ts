import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import flowsData from '../../../../../../mocks/gali-v5/marketing-automatizacion.json';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

interface AutomatizacionRow {
  id: string;
  nombre: string;
  activo: boolean;
  skill_gali?: string;
}

@Component({
  selector: 'app-automatizacion-page',
  standalone: true,
  imports: [
    CommonModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './automatizacion-page.component.html',
  styleUrl: './automatizacion-page.component.scss',
})
export class AutomatizacionPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  readonly breadcrumbs = ['Marketing', 'SMS y Correo', 'Automatización'];
  readonly flows: AutomatizacionRow[] = flowsData.flows.map(flow => ({ ...flow }));

  toggleActivo(row: AutomatizacionRow): void {
    row.activo = !row.activo;
  }

  createSkillForFlow(flow: AutomatizacionRow): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { agente: 'chatea', contexto: 'automatizacion', nombre: flow.nombre },
    });
  }

  goToSkills(): void {
    this.router.navigate(['/gali-v5/skills']);
  }
}
