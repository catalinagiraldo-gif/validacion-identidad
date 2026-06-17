import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
} from '../../components/shared';
import { GaliChipComponent } from '../../components/gali-chip/gali-chip.component';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { CrearProyectoModalComponent } from '../../components/crear-proyecto-modal/crear-proyecto-modal.component';
import { GaliAdaSpyDetailComponent } from '../../components/gali-ada-spy-detail/gali-ada-spy-detail.component';
import publicationsData from '../../../../../../mocks/gali-v5/publications.json';
import problemNetworkData from '../../../../../../mocks/gali-v5/problem-network.json';

type CazaMode = 'historial' | 'problemas' | 'publicaciones';

interface PublicationCard {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
  dateRange: string;
  proposals?: number | null;
  expiring?: boolean;
}

interface HistorialProduct {
  id: string;
  nombre: string;
  nicho: string;
  fitScore: number;
  margen: string;
  saturacion: string;
  tendencia: string;
  razon: string;
  adaMsg: string;
}

interface ProblemNode {
  problema: string;
  conexion?: string | null;
  productos: { nombre: string; margen: string; saturacion: string }[];
  angulos: string[];
}

@Component({
  selector: 'app-caza-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    GaliChipComponent,
    DropiGaliBarComponent,
    CrearProyectoModalComponent,
    GaliAdaSpyDetailComponent,
  ],
  templateUrl: './caza-page.component.html',
  styleUrl: './caza-page.component.scss',
})
export class CazaPageComponent {
  private router = inject(Router);

  mode = signal<CazaMode>('historial');
  proposalsOnly = false;
  searchQuery = '';
  problemQuery = '';
  selectedNode = signal<number | null>(0);
  showCrearModal = signal(false);
  showAdaDetail = signal(false);
  adaDetailId = signal<string>('difusor');
  selectedProductForProject: HistorialProduct | null = null;
  readonly breadcrumbs = ['Productos', 'Caza productos'];

  private readonly adaIdMap: Record<string, string> = {
    'ph1': 'difusor',
    'ph2': 'collar-gps',
    'ph3': 'rodillo-jade',
    'ph4': 'collar-gps',
    'ph5': 'rodillo-jade',
  };
  readonly publications: PublicationCard[] = publicationsData.publications;
  readonly userProfile = problemNetworkData.userProfile;
  readonly productosHistorial: HistorialProduct[] = problemNetworkData.productosHistorial;
  readonly problemExample = problemNetworkData.problemSearchExample;
  readonly problemNodes: ProblemNode[] = problemNetworkData.problemSearchExample.nodos;

  setMode(m: CazaMode): void {
    this.mode.set(m);
  }

  abrirCrearProyecto(p: HistorialProduct): void {
    this.selectedProductForProject = p;
    this.showCrearModal.set(true);
  }

  verAnalisis(p: HistorialProduct): void {
    this.adaDetailId.set(this.adaIdMap[p.id] ?? 'difusor');
    this.showAdaDetail.set(true);
  }

  onProyectoCreated(id: string): void {
    this.router.navigate(['/gali-v5/proyecto', id]);
  }

  fitScoreClass(score: number): string {
    if (score >= 85) return 'fit--high';
    if (score >= 70) return 'fit--mid';
    return 'fit--low';
  }

  buscarProblema(): void {
    if (!this.problemQuery.trim()) {
      this.problemQuery = this.problemExample.query;
    }
    this.selectedNode.set(0);
  }

  selectNode(index: number): void {
    this.selectedNode.set(index);
  }

  readonly semanticQuery = signal('');

  goToCatalogo(): void {
    this.router.navigate(['/gali-v5/productos/catalogo']);
  }

  buscarSemantico(): void {
    const q = this.semanticQuery().trim();
    if (!q) return;
    this.problemQuery = q;
    this.mode.set('problemas');
    this.buscarProblema();
  }

  publicarConAda(p: HistorialProduct): void {
    const slug = p.id || 'difusor';
    this.router.navigate(['/gali-v5/proyectos/nuevo'], {
      queryParams: { producto: slug, nombre: p.nombre, desde: 'caza' },
    });
  }

  crearProyecto(p: HistorialProduct | string): void {
    if (typeof p === 'string') {
      this.publicarConAda(this.productosHistorial.find(x => x.nombre === p) ?? this.productosHistorial[0]);
      return;
    }
    this.publicarConAda(p);
  }
}
