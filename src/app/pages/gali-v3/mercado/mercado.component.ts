import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { GaliMarketplaceService } from '../../../services/gali-v3/marketplace.service';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import { BloqueComunidad } from '../../../services/gali-v3/types';

type Tab = 'plantillas' | 'agentes' | 'conexiones' | 'bloques';

@Component({
  selector: 'app-gali-v3-mercado',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mercado.component.html',
  styleUrls: ['./mercado.component.scss'],
})
export class GaliV3MercadoComponent {
  private marketSvc = inject(GaliMarketplaceService);
  private bloqueSvc = inject(GaliBloqueBuilderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  plantillas = this.marketSvc.plantillas;
  agentes = this.marketSvc.agentes;
  conexiones = this.marketSvc.conexiones;

  // Marketplace de bloques (Fase 3)
  bloquesComunidad = this.bloqueSvc.bloquesComunidad;
  comunidadMeta = this.bloqueSvc.comunidadMeta;
  comunidadCategorias = this.bloqueSvc.comunidadCategorias;
  bloqueFilter = signal<string>('todos');
  installToastId = signal<string | null>(null);

  initialTab = toSignal(
    this.route.queryParams.pipe(map(q => (q['tab'] as Tab) || 'plantillas')),
    { initialValue: (this.route.snapshot.queryParams['tab'] as Tab) || 'plantillas' },
  );

  activeTab = signal<Tab>('plantillas');
  search = signal('');

  constructor() {
    queueMicrotask(() => this.activeTab.set(this.initialTab()));
  }

  setTab(t: Tab) {
    this.activeTab.set(t);
  }

  plantillasFiltered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.plantillas();
    return this.plantillas().filter(p =>
      p.name.toLowerCase().includes(q) || p.descripcion.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q)),
    );
  });

  agentesFiltered = computed(() => {
    const q = this.search().toLowerCase();
    if (!q) return this.agentes();
    return this.agentes().filter(a =>
      a.name.toLowerCase().includes(q) || a.tagline.toLowerCase().includes(q),
    );
  });

  toggleAgente(id: string) {
    this.marketSvc.toggleAgenteInstalado(id);
  }

  toggleConexion(id: string) {
    this.marketSvc.toggleConexion(id);
  }

  // ---------- Marketplace de bloques (Fase 3) ----------
  bloquesFiltered = computed<BloqueComunidad[]>(() => {
    const q = this.search().toLowerCase();
    const cat = this.bloqueFilter();
    return this.bloquesComunidad().filter(b => {
      const matchCat = cat === 'todos' || b.categoria === cat;
      const matchQ = !q ||
        b.titulo.toLowerCase().includes(q) ||
        b.descripcion.toLowerCase().includes(q) ||
        b.tags.some(t => t.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  });

  bloquesDestacados = computed(() => this.bloquesFiltered().filter(b => b.destacado));
  bloquesResto = computed(() => this.bloquesFiltered().filter(b => !b.destacado));

  setBloqueFilter(cat: string) {
    this.bloqueFilter.set(cat);
  }

  estaInstalado(id: string): boolean {
    return this.bloqueSvc.estaInstalado(id);
  }

  instalarBloque(b: BloqueComunidad) {
    if (this.estaInstalado(b.id)) {
      this.bloqueSvc.desinstalarBloqueComunidad(b.id);
      return;
    }
    const saved = this.bloqueSvc.instalarBloqueComunidad(b);
    if (saved) {
      this.installToastId.set(b.id);
      setTimeout(() => this.installToastId.set(null), 4000);
    }
  }

  irAlConstructor() {
    this.router.navigateByUrl('/gali-v3/bloque-builder');
  }

  ratingStars(r: number): string {
    const full = Math.floor(r);
    return '★'.repeat(full) + (r % 1 >= 0.5 ? '☆' : '');
  }
}
