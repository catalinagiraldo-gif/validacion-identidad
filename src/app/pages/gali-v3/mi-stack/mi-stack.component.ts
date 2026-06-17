import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  GaliMiStackService,
  StackCategoria,
  StackPlataforma,
} from '../../../services/gali-v3/mi-stack.service';

@Component({
  selector: 'app-gali-v3-mi-stack',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mi-stack.component.html',
  styleUrls: ['./mi-stack.component.scss'],
})
export class GaliV3MiStackComponent {
  private svc = inject(GaliMiStackService);
  private router = inject(Router);

  plataformas = this.svc.plataformas;
  categorias = this.svc.categorias;
  conectadas = this.svc.conectadas;
  intelligenceActual = this.svc.intelligenceActual;
  intelligenceMax = this.svc.intelligenceMax;
  intelligencePct = this.svc.intelligencePct;
  recomendadas = this.svc.recomendadas;
  insightsTotal = this.svc.insightsTotal;

  plataformaExpandida = signal<string | null>(null);
  modalAbierto = signal<StackPlataforma | null>(null);
  pasoConexion = signal<1 | 2 | 3>(1);

  porCategoria(cat: StackCategoria): StackPlataforma[] {
    return this.svc.porCategoria(cat.id);
  }

  togglePlataforma(p: StackPlataforma) {
    this.plataformaExpandida.update(curr => (curr === p.id ? null : p.id));
  }

  abrirConexion(p: StackPlataforma) {
    if (p.estado === 'conectada') return;
    this.modalAbierto.set(p);
    this.pasoConexion.set(1);
  }

  cerrarModal() {
    this.modalAbierto.set(null);
  }

  avanzarConexion() {
    if (this.pasoConexion() === 3) {
      const p = this.modalAbierto();
      if (p) this.svc.toggleConexion(p.id);
      this.cerrarModal();
      return;
    }
    this.pasoConexion.update(p => (p + 1) as 1 | 2 | 3);
  }

  desconectar(p: StackPlataforma) {
    if (p.estado === 'conectada') this.svc.toggleConexion(p.id);
  }

  // Mapea una plataforma del stack a la fuente del Constructor más cercana.
  // Si no hay match limpio, devuelve null y dejamos que Gali infiera desde el prompt.
  private fuenteParaPlataforma(p: StackPlataforma): string | null {
    if (p.categoria === 'ads') return 'campanas';
    if (p.categoria === 'finanzas') return 'cartera';
    if (p.categoria === 'ecommerce') return 'productos';
    return null;
  }

  construirBloqueDesdeStack(p: StackPlataforma) {
    const fuente = this.fuenteParaPlataforma(p);
    const prompt = `Construye un bloque que use datos de ${p.nombre} para mi negocio`;
    this.router.navigate(['/gali-v3/bloque-builder'], {
      queryParams: {
        ...(fuente ? { fuente } : {}),
        prompt,
        origen: 'mi-stack',
      },
    });
  }

  scoreColor(score: number) {
    return this.svc.scoreColor(score);
  }

  scoreTexto(score: number): string {
    if (score >= 12) return 'Alto';
    if (score >= 7) return 'Medio';
    return 'Bajo';
  }
}
