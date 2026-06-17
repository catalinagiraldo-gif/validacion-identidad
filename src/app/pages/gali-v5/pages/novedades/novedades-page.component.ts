import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import {
  DropiTitulosComponent,
  DropiButtonNewComponent,
  DropiSearchOficialComponent,
  DropiPaginatorComponent,
} from '../../components/shared';
import novedadesData from '../../../../../../mocks/gali-v5/novedades.json';

interface NovedadRow {
  num: string;
  fecha: string;
  tienda: string;
  datos: string;
}

type NovedadTipo = 'recuperable' | 'irreversible' | 'cliente' | 'transportadora';

@Component({
  selector: 'app-novedades-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropiTitulosComponent,
    DropiButtonNewComponent,
    DropiSearchOficialComponent,
    DropiPaginatorComponent,
  ],
  templateUrl: './novedades-page.component.html',
  styleUrl: './novedades-page.component.scss',
})
export class NovedadesPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  searchQuery = '';
  readonly breadcrumbs = ['Pedidos', 'Novedades'];

  goToOperar(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }
  readonly rows: NovedadRow[] = novedadesData.novedades;

  resolvedByGali = signal<string[]>([]);

  readonly galiSummary = { recuperables: 8, irreversibles: 3, puedeResolver: 8 };

  // Gali auto-classifies novedades by motivo keyword
  getNovedadTipo(datos: string): NovedadTipo {
    const d = datos.toLowerCase();
    if (d.includes('dirección') || d.includes('direccion')) return 'recuperable';
    if (d.includes('rechazado') || d.includes('devoluci')) return 'irreversible';
    if (d.includes('cliente') || d.includes('ausente')) return 'cliente';
    return 'transportadora';
  }

  getTipoLabel(tipo: NovedadTipo): string {
    return { recuperable: 'Recuperable', irreversible: 'Irreversible', cliente: 'Por cliente', transportadora: 'Transportadora' }[tipo];
  }

  getTipoClass(tipo: NovedadTipo): string {
    return { recuperable: 'nov-tipo--recuperable', irreversible: 'nov-tipo--irreversible', cliente: 'nov-tipo--cliente', transportadora: 'nov-tipo--transportadora' }[tipo];
  }

  isResolved(num: string): boolean { return this.resolvedByGali().includes(num); }

  resolveWithGali(num: string): void {
    this.resolvedByGali.update(list => [...list, num]);
  }
}
