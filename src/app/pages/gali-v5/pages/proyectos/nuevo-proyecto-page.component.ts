import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface ProductSuggestion {
  id: string;
  name: string;
  category: string;
  adaScore: number;
  margin: string;
  stock: string;
  provider: string;
  trendLabel: string;
}

const TRENDING_CATEGORIES = [
  { id: 'salud', label: 'Salud & Bienestar', emoji: '🌿' },
  { id: 'mascotas', label: 'Mascotas', emoji: '🐾' },
  { id: 'belleza', label: 'Belleza', emoji: '💄' },
  { id: 'tecnologia', label: 'Tecnología', emoji: '⚡' },
  { id: 'hogar', label: 'Hogar & Deco', emoji: '🏡' },
  { id: 'fitness', label: 'Fitness', emoji: '💪' },
  { id: 'ninos', label: 'Niños', emoji: '🧸' },
  { id: 'moda', label: 'Moda', emoji: '👗' },
];

const PRODUCT_SUGGESTIONS: ProductSuggestion[] = [
  { id: 'difusor', name: 'Difusor aromaterapia ultrasónico', category: 'Salud', adaScore: 87, margin: '38%', stock: 'Alto', provider: 'ZenAroma Colombia', trendLabel: '↑ Tendencia' },
  { id: 'collar-gps', name: 'Collar GPS para mascotas', category: 'Mascotas', adaScore: 74, margin: '42%', stock: 'Medio', provider: 'TechPet Latam', trendLabel: 'Estable' },
  { id: 'rodillo-jade', name: 'Rodillo de jade para facial', category: 'Belleza', adaScore: 71, margin: '51%', stock: 'Alto', provider: 'BeautyStore SAS', trendLabel: '↑ Creciendo' },
  { id: 'purificador', name: 'Purificador de aire portátil', category: 'Hogar', adaScore: 68, margin: '29%', stock: 'Bajo', provider: 'CleanAir Colombia', trendLabel: 'Estable' },
  { id: 'audifono', name: 'Audífonos inalámbricos sport', category: 'Tecnología', adaScore: 63, margin: '33%', stock: 'Alto', provider: 'GadgetZone', trendLabel: 'Saturando' },
  { id: 'mini-proyector', name: 'Mini proyector HD portátil', category: 'Tecnología', adaScore: 61, margin: '35%', stock: 'Medio', provider: 'TechVision', trendLabel: 'Estable' },
];

type Step = 'discovery' | 'select' | 'estrategia' | 'landing' | 'campana' | 'launch';

interface Angulo {
  id: string;
  titulo: string;
  hook: string;
  guion: string;
}

@Component({
  selector: 'app-nuevo-proyecto-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './nuevo-proyecto-page.component.html',
  styleUrl: './nuevo-proyecto-page.component.scss',
})
export class NuevoProyectoPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly step = signal<Step>('discovery');
  readonly precioVenta = signal(180000);
  readonly cogs = signal(65000);
  readonly fleteUnit = signal(12000);
  readonly searchQuery = signal('');
  readonly selectedCategory = signal('');
  readonly selectedProduct = signal<ProductSuggestion | null>(null);
  readonly projectName = signal('');
  readonly budget = signal(200000);
  readonly isSearching = signal(false);
  readonly products = signal<ProductSuggestion[]>(PRODUCT_SUGGESTIONS);

  readonly trendingCategories = TRENDING_CATEGORIES;

  roasTarget = signal('');
  readonly selectedAngulo = signal<Angulo | null>(null);
  readonly pedidosTarget = signal(15);
  readonly campanaSkill1Active = signal(true);
  readonly campanaSkill2Active = signal(true);
  readonly isLaunching = signal(false);

  get angulos(): Angulo[] {
    const p = this.selectedProduct();
    if (!p) return [];
    return [
      {
        id: 'dolor',
        titulo: 'Ángulo del dolor',
        hook: `¿Cansado de ${p.category === 'Mascotas' ? 'perder a tu mascota de vista' : 'los problemas que ya conoces'}?`,
        guion: `Hook (3s): Pregunta que genera identificación. | Problema (5s): La situación real del cliente. | Solución (10s): Cómo ${p.name} lo resuelve. | CTA (5s): "Ordena hoy y recíbelo en 24h."`,
      },
      {
        id: 'aspiracional',
        titulo: 'Ángulo aspiracional',
        hook: `Las personas exitosas ya usan esto para ${p.category === 'Mascotas' ? 'proteger a sus mascotas' : 'mejorar su vida'}.`,
        guion: `Hook (3s): Mostrar el resultado deseado. | Prueba (5s): Testimonios visuales. | Producto (10s): Presentación clara. | CTA (5s): "Únete a las miles de personas que ya lo usan."`,
      },
      {
        id: 'escasez',
        titulo: 'Ángulo de urgencia',
        hook: `Solo quedan ${p.stock === 'Alto' ? '50' : '12'} unidades. Precio especial termina hoy.`,
        guion: `Hook (3s): Número de unidades disponibles. | Valor (5s): Por qué vale la pena ahora. | Producto (7s): Beneficio principal. | Countdown (8s): "Oferta termina en 2 horas." | CTA (3s): "Haz tu pedido."`,
      },
    ];
  }

  get budgetFormatted(): string {
    return `$${this.budget().toLocaleString('es-CO')}`;
  }

  get roasCalculated(): string {
    const b = this.budget();
    if (b < 100000) return '2.2x';
    if (b < 300000) return '2.5x';
    if (b < 600000) return '2.8x';
    return '3.1x';
  }

  /** Break-even ROAS = precio venta / (precio - COGS - flete) */
  get breakEvenRoas(): number {
    const pv = this.precioVenta();
    const cost = pv - this.cogs() - this.fleteUnit();
    if (cost <= 0) return 99;
    return Math.round((pv / cost) * 10) / 10;
  }

  constructor() {
    this.route.queryParams.subscribe(params => {
      const productoId = params['producto'] as string | undefined;
      if (productoId) {
        const p = PRODUCT_SUGGESTIONS.find(x => x.id === productoId);
        if (p) {
          this.selectedProduct.set(p);
          this.projectName.set(p.name);
          this.step.set('estrategia');
        }
      }
    });
  }

  searchWithADA(): void {
    if (!this.searchQuery().trim()) return;
    this.isSearching.set(true);
    setTimeout(() => {
      this.isSearching.set(false);
      this.products.set(PRODUCT_SUGGESTIONS);
      this.step.set('select');
    }, 900);
  }

  selectCategory(catId: string): void {
    this.selectedCategory.set(catId);
    this.isSearching.set(true);
    setTimeout(() => {
      this.isSearching.set(false);
      this.products.set(PRODUCT_SUGGESTIONS.filter(p => {
        const cat = TRENDING_CATEGORIES.find(c => c.id === catId);
        return cat ? p.category.toLowerCase().includes(cat.label.split('&')[0].trim().toLowerCase().slice(0, 5)) : true;
      }).length > 0
        ? PRODUCT_SUGGESTIONS.filter(p => {
            const cat = TRENDING_CATEGORIES.find(c => c.id === catId);
            return cat ? p.category.toLowerCase().includes(cat.label.split('&')[0].trim().toLowerCase().slice(0, 5)) : true;
          })
        : PRODUCT_SUGGESTIONS
      );
      this.step.set('select');
    }, 700);
  }

  selectProduct(product: ProductSuggestion): void {
    this.selectedProduct.set(product);
    if (!this.projectName()) {
      this.projectName.set(product.name);
    }
  }

  goToEstrategia(): void {
    if (!this.selectedProduct()) return;
    this.step.set('estrategia');
  }

  goToLanding(): void {
    if (!this.selectedAngulo() && this.angulos.length) {
      this.selectedAngulo.set(this.angulos[0]);
    }
    this.step.set('landing');
  }

  goToCampana(): void {
    this.step.set('campana');
  }

  goToLaunch(): void {
    if (!this.selectedProduct()) return;
    this.step.set('estrategia');
  }

  getScoreClass(score: number): string {
    if (score >= 80) return 'hot';
    if (score >= 65) return 'warm';
    return 'cool';
  }

  launchProject(): void {
    this.isLaunching.set(true);
    setTimeout(() => {
      this.isLaunching.set(false);
      this.step.set('launch');
    }, 1800);
  }

  goBack(): void {
    window.history.back();
  }

  saveDraft(): void {
    window.history.back();
  }
}
