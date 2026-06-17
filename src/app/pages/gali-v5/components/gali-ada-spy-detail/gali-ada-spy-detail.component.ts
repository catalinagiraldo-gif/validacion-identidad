import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';

export interface AdaProductDetail {
  id: string;
  nombre: string;
  categoria: string;
  adaScore: number;
  ventanaLabel: string;
  imagenPlaceholder: string;
  precioMercado: string;
  cogsEstimado: string;
  margenBruto: string;
  competidoresActivos: number;
  ciudades: Array<{ nombre: string; pct: number }>;
  roiTable: Array<{ inversion: string; pedidosSem: number; gananciaNeta: string }>;
  saturacion: 'baja' | 'media' | 'alta';
  dropshippersVendiendo: number;
  proveedorSugerido: string;
  tendencia: 'up' | 'stable' | 'down';
  tendenciaLabel: string;
}

export const ADA_PRODUCTS: AdaProductDetail[] = [
  {
    id: 'difusor',
    nombre: 'Difusor de aromaterapia ultrasónico',
    categoria: 'Salud & Bienestar',
    adaScore: 87,
    ventanaLabel: '12 días',
    imagenPlaceholder: '🌿',
    precioMercado: '$180.000–$220.000',
    cogsEstimado: '$65.000',
    margenBruto: '65%',
    competidoresActivos: 3,
    ciudades: [
      { nombre: 'Bogotá', pct: 38 },
      { nombre: 'Medellín', pct: 22 },
      { nombre: 'Cali', pct: 15 },
      { nombre: 'Barranquilla', pct: 12 },
      { nombre: 'Otras', pct: 13 },
    ],
    roiTable: [
      { inversion: '$25.000/día', pedidosSem: 8, gananciaNeta: '$480.000/sem' },
      { inversion: '$50.000/día', pedidosSem: 18, gananciaNeta: '$1.080.000/sem' },
      { inversion: '$80.000/día', pedidosSem: 30, gananciaNeta: '$1.800.000/sem' },
    ],
    saturacion: 'baja',
    dropshippersVendiendo: 3,
    proveedorSugerido: 'ZenAroma Colombia',
    tendencia: 'up',
    tendenciaLabel: '↑ Tendencia activa',
  },
  {
    id: 'collar-gps',
    nombre: 'Collar GPS para mascotas',
    categoria: 'Mascotas',
    adaScore: 74,
    ventanaLabel: 'Estable',
    imagenPlaceholder: '🐾',
    precioMercado: '$120.000–$160.000',
    cogsEstimado: '$55.000',
    margenBruto: '42%',
    competidoresActivos: 7,
    ciudades: [
      { nombre: 'Bogotá', pct: 45 },
      { nombre: 'Medellín', pct: 28 },
      { nombre: 'Cali', pct: 14 },
      { nombre: 'Otras', pct: 13 },
    ],
    roiTable: [
      { inversion: '$20.000/día', pedidosSem: 6, gananciaNeta: '$264.000/sem' },
      { inversion: '$40.000/día', pedidosSem: 14, gananciaNeta: '$616.000/sem' },
      { inversion: '$70.000/día', pedidosSem: 26, gananciaNeta: '$1.144.000/sem' },
    ],
    saturacion: 'media',
    dropshippersVendiendo: 7,
    proveedorSugerido: 'TechPet Latam',
    tendencia: 'stable',
    tendenciaLabel: 'Mercado estable',
  },
  {
    id: 'rodillo-jade',
    nombre: 'Rodillo de jade para facial',
    categoria: 'Belleza',
    adaScore: 71,
    ventanaLabel: '8 días',
    imagenPlaceholder: '💆‍♀️',
    precioMercado: '$80.000–$120.000',
    cogsEstimado: '$28.000',
    margenBruto: '51%',
    competidoresActivos: 5,
    ciudades: [
      { nombre: 'Bogotá', pct: 52 },
      { nombre: 'Medellín', pct: 25 },
      { nombre: 'Otras', pct: 23 },
    ],
    roiTable: [
      { inversion: '$15.000/día', pedidosSem: 10, gananciaNeta: '$520.000/sem' },
      { inversion: '$30.000/día', pedidosSem: 22, gananciaNeta: '$1.144.000/sem' },
      { inversion: '$50.000/día', pedidosSem: 38, gananciaNeta: '$1.976.000/sem' },
    ],
    saturacion: 'media',
    dropshippersVendiendo: 5,
    proveedorSugerido: 'BeautyStore SAS',
    tendencia: 'up',
    tendenciaLabel: '↑ Creciendo',
  },
];

@Component({
  selector: 'gali-ada-spy-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-ada-spy-detail.component.html',
  styleUrl: './gali-ada-spy-detail.component.scss',
})
export class GaliAdaSpyDetailComponent {
  private readonly router = inject(Router);
  private readonly ws = inject(GaliWorkspaceService);

  readonly productId = input.required<string>();
  readonly closed = output<void>();

  get product(): AdaProductDetail | null {
    return ADA_PRODUCTS.find(p => p.id === this.productId()) ?? null;
  }

  get saturacionLabel(): string {
    const s = this.product?.saturacion;
    if (s === 'baja') return 'Baja saturación ✓';
    if (s === 'media') return 'Saturación media';
    return 'Alta saturación — mercado lleno';
  }

  get saturacionColor(): string {
    const s = this.product?.saturacion;
    if (s === 'baja') return '#22c55e';
    if (s === 'media') return '#f59e0b';
    return '#ef4444';
  }

  get scoreColor(): string {
    const score = this.product?.adaScore ?? 0;
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }

  launchWithGali(): void {
    const p = this.product;
    if (!p) return;
    this.ws.setHubEntryContext({
      source: 'ada-spy',
      productId: p.id,
      productName: p.nombre,
      message: `Venías del análisis de ADA Spy — ¿lanzamos «${p.nombre}» con Roax?`,
      ctaLabel: 'Continuar lanzamiento',
      ctaRoute: `/gali-v5/proyectos/nuevo?producto=${p.id}`,
    });
    this.ws.setMode('lanzar');
    this.router.navigate(['/gali-v5/proyectos/nuevo'], {
      queryParams: { producto: p.id, nombre: p.nombre },
    });
    this.closed.emit();
  }

  save(): void {
    this.closed.emit();
  }
}
