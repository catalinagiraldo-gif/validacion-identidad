import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import cazaData from '../../../../../mocks/gali-v3/dropi-caza.json';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { ProximosPasosComponent } from '../../../components/gali-v3/shared/proximos-pasos.component';

interface TrendProduct {
  id: string; nombre: string; categoria: string;
  tendencia_pct: number; ventas_semana: number; ventana_dias: number;
  margen: number; precio: number; fit_perfil: number;
  recomendacion: 'lanzar' | 'esperar' | 'pasar';
  razon: string;
}

@Component({
  selector: 'app-gali-v3-dropi-caza',
  standalone: true,
  imports: [CommonModule, RouterModule, ProximosPasosComponent],
  templateUrl: './dropi-caza.component.html',
  styleUrls: ['./dropi-caza.component.scss'],
})
export class GaliV3DropiCazaComponent {
  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  trending = signal<TrendProduct[]>(cazaData.trending as TrendProduct[]);
  filterReco = signal<'todos' | 'lanzar' | 'esperar' | 'pasar'>('todos');

  filtered = computed(() => {
    const f = this.filterReco();
    if (f === 'todos') return this.trending();
    return this.trending().filter(p => p.recomendacion === f);
  });

  lanzar = computed(() => this.trending().filter(p => p.recomendacion === 'lanzar').length);
  esperar = computed(() => this.trending().filter(p => p.recomendacion === 'esperar').length);
  pasar = computed(() => this.trending().filter(p => p.recomendacion === 'pasar').length);

  format(n: number): string { return `$${n.toLocaleString('es-CO')}`; }

  crearProyecto(p: TrendProduct) {
    this.chatSvc.send(`Crea proyecto para lanzar ${p.nombre} con ángulo principal`);
    this.router.navigateByUrl('/gali-v3/proyecto/nuevo');
  }

  analizar(p: TrendProduct) {
    this.chatSvc.send(`Analiza el producto en alza ${p.nombre}`);
  }
}
