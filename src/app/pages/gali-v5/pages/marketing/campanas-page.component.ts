import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiTagComponent,
  DropiPaginatorComponent,
  DropiTagVariant,
} from '../../components/shared';
import campanasData from '../../../../../../mocks/gali-v5/marketing-campanas.json';
import { DropiGaliBarComponent, GaliBarStat } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliNewSkillOverlayComponent } from '../../components/gali-new-skill-overlay/gali-new-skill-overlay.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliInsightDirective } from '../../directives/gali-insight.directive';

interface CampanaRow {
  id: string;
  nombre: string;
  estado: string;
  fecha: string;
  canal: string;
}

@Component({
  selector: 'app-campanas-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiTagComponent,
    DropiPaginatorComponent,
    DropiGaliBarComponent,
    GaliNewSkillOverlayComponent,
    GaliInsightDirective,
  ],
  templateUrl: './campanas-page.component.html',
  styleUrl: './campanas-page.component.scss',
})
export class CampanasPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  readonly showNewSkill = signal(false);
  activeChannel: 'sms' | 'email' = 'sms';
  readonly breadcrumbs = ['Marketing', 'SMS y Correo', 'Campañas masivas'];

  readonly galiStats: GaliBarStat[] = [
    { value: 2, label: 'campañas escalando', variant: 'ok' },
    { value: 1, label: 'pausada por CTR bajo', variant: 'warn' },
    { value: '$66k/día', label: 'pauta total' },
  ];
  readonly campaigns: CampanaRow[] = campanasData.campaigns;

  get filteredRows(): CampanaRow[] {
    return this.campaigns.filter(row => row.canal === this.activeChannel);
  }

  estadoVariant(estado: string): DropiTagVariant {
    switch (estado) {
      case 'Error': return 'error';
      case 'Activa': return 'success';
      case 'Programada': return 'info';
      case 'Pausada': return 'warning';
      default: return 'neutral';
    }
  }

  goToSkillEditor(): void {
    this.router.navigate(['/gali-v5/skills/nueva'], {
      queryParams: { agente: 'roax', contexto: 'campana', metrica: 'CTR' },
    });
  }
}
