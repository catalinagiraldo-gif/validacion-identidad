import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

interface CarrierRow {
  rank: number;
  name: string;
  insureDefault?: boolean;
}

interface DeptAccordion {
  name: string;
  expanded: boolean;
  cities: string[];
  carriers: string[];
}

@Component({
  selector: 'app-carrier-preferences-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DropiGaliBarComponent],
  templateUrl: './carrier-preferences-page.component.html',
  styleUrl: './carrier-preferences-page.component.scss',
})
export class CarrierPreferencesPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);
  readonly breadcrumbs = ['Logística', 'Transportadoras'];

  goToSignals(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }

  readonly favorites: CarrierRow[] = [
    { rank: 1, name: 'ENVIA', insureDefault: true },
    { rank: 2, name: 'INTERRAPIDISIMO' },
    { rank: 3, name: 'DOMINA' },
    { rank: 4, name: 'COORDINADORA' },
    { rank: 5, name: 'VELOCES' },
    { rank: 6, name: '99MINUTOS' },
    { rank: 7, name: 'TCC' },
    { rank: 9, name: 'JAMV-DRIVE' },
    { rank: 10, name: 'WIILOG' },
  ];

  departments = signal<DeptAccordion[]>([
    {
      name: 'AMAZONAS',
      expanded: true,
      cities: ['LETICIA', 'PUERTO NARIÑO', 'LA CHORRERA'],
      carriers: ['ENVIA', 'COORDINADORA', 'SERVIENTREGA', 'INTERRAPIDISIMO', 'TCC'],
    },
    { name: 'ANTIOQUIA', expanded: false, cities: [], carriers: [] },
    { name: 'ARAUCA', expanded: false, cities: [], carriers: [] },
    { name: 'ATLANTICO', expanded: false, cities: [], carriers: [] },
    { name: 'BOLIVAR', expanded: false, cities: [], carriers: [] },
  ]);

  toggleDept(name: string): void {
    this.departments.update(list =>
      list.map(d => (d.name === name ? { ...d, expanded: !d.expanded } : d)),
    );
  }
}
