import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { CrearProyectoModalComponent } from '../../components/crear-proyecto-modal/crear-proyecto-modal.component';
import { DiagnosticoModalComponent } from '../../components/diagnostico-modal/diagnostico-modal.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

type ProyectoEstado = 'en_escala' | 'activo' | 'pausado' | 'borrador';
type GaliStatusType = 'warn' | 'ok' | 'info' | 'neutral';

interface Proyecto {
  id: string;
  icono: string;
  nombre: string;
  estado: ProyectoEstado;
  roas: string;
  pedidos: number;
  ganancia: string;
  galiStatus: GaliStatusType;
  galiMsg: string;
  agentes: string[];
}

@Component({
  selector: 'app-proyectos-list-page',
  standalone: true,
  imports: [CommonModule, RouterModule, DropiGaliBarComponent, CrearProyectoModalComponent, DiagnosticoModalComponent],
  templateUrl: './proyectos-list-page.component.html',
  styleUrl: './proyectos-list-page.component.scss',
})
export class ProyectosListPageComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ws = inject(GaliWorkspaceService);

  readonly breadcrumbs = ['Gali Hub'];
  activeFilter = signal<'todos' | 'activos' | 'pausados' | 'borradores'>('todos');
  showCrearModal = signal(false);

  constructor() {
    this.route.queryParamMap.subscribe(p => {
      if (p.get('nuevo') === 'true') this.showCrearModal.set(true);
    });
  }

  readonly proyectos: Proyecto[] = [
    {
      id: 'collar-gps-2026',
      icono: '🐕',
      nombre: 'Collar GPS para mascotas',
      estado: 'en_escala',
      roas: '2.9x',
      pedidos: 47,
      ganancia: '$411k/sem',
      galiStatus: 'warn',
      galiMsg: 'Novedad en Cali afecta margen · Acción recomendada',
      agentes: ['Roax', 'Vigilante', 'Chatea Pro'],
    },
    {
      id: 'skincare-kbeauty',
      icono: '✨',
      nombre: 'Skincare K-Beauty',
      estado: 'activo',
      roas: '2.1x',
      pedidos: 23,
      ganancia: '$198k/sem',
      galiStatus: 'ok',
      galiMsg: 'Todo normal · 3 agentes activos',
      agentes: ['Roax', 'Chatea Pro'],
    },
    {
      id: 'proyector-portatil',
      icono: '📺',
      nombre: 'Proyector Portátil',
      estado: 'pausado',
      roas: '—',
      pedidos: 0,
      ganancia: '—',
      galiStatus: 'info',
      galiMsg: 'CTR se recuperó. ¿Reanudamos la campaña?',
      agentes: ['Roax'],
    },
    {
      id: 'reloj-smartwatch',
      icono: '⌚',
      nombre: 'Reloj Smartwatch Pro',
      estado: 'borrador',
      roas: '—',
      pedidos: 0,
      ganancia: '—',
      galiStatus: 'neutral',
      galiMsg: 'Sin lanzar · ADA Spy tiene análisis listo',
      agentes: ['ADA Spy'],
    },
  ];

  get filteredProyectos(): Proyecto[] {
    const f = this.activeFilter();
    if (f === 'todos') return this.proyectos;
    if (f === 'activos') return this.proyectos.filter(p => p.estado === 'activo' || p.estado === 'en_escala');
    if (f === 'pausados') return this.proyectos.filter(p => p.estado === 'pausado');
    if (f === 'borradores') return this.proyectos.filter(p => p.estado === 'borrador');
    return this.proyectos;
  }

  estadoLabel(estado: ProyectoEstado): string {
    const map: Record<ProyectoEstado, string> = {
      en_escala: 'En escala',
      activo: 'Activo',
      pausado: 'Pausado',
      borrador: 'Borrador',
    };
    return map[estado];
  }

  goToProject(id: string): void {
    this.router.navigate(['/gali-v5/proyecto', id]);
  }

  newProject(): void {
    this.router.navigate(['/gali-v5/proyectos/nuevo']);
  }

  get activeCount(): number {
    return this.proyectos.filter(p => p.estado === 'activo' || p.estado === 'en_escala').length;
  }

  readonly showDiagnostico = signal(false);

  openDiagnostico(): void {
    this.showDiagnostico.set(true);
  }

  goToHub(): void {
    this.router.navigate(['/gali-v5']);
  }
}
