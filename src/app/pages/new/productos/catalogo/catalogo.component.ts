import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  name: string;
  category: string;
  stock: number;
  stockColor: string;
  provPrice: number;
  sugPrice: number;
  tag: string;
  tagColor?: string;
  flag: string | null;
  image: string;
  favorite?: boolean;
}

interface Provider {
  name: string;
  count: string;
  categories: string;
  avatar: string;
}

@Component({
  selector: 'app-catalogo-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./catalogo.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Productos</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Catalogo</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Productos</span>
      </nav>

      <!-- AI Search Banner -->
      <section class="ai-banner">
        <img
          src="assets/images/productos/banner-ia.png"
          alt="Busqueda IA"
          class="ai-banner__bg"
        />
        <button class="ai-banner__close" aria-label="Cerrar banner">
          <i class="pi pi-times"></i>
        </button>
      </section>

      <!-- Proveedores -->
      <section class="proveedores-section">
        <div class="proveedores-header">
          <span class="proveedores-title">Proveedores</span>
          <a class="proveedores-ver-todos" href="javascript:void(0)">Ver todos</a>
        </div>
        <div class="proveedores-carousel">
          <div
            class="proveedor-card"
            *ngFor="let p of providers; let i = index"
            [style.animation-delay]="i * 80 + 'ms'"
          >
            <img
              [src]="p.avatar"
              [alt]="p.name"
              class="proveedor-avatar"
            />
            <div class="proveedor-info">
              <span class="proveedor-name">{{ p.name }}</span>
              <span class="proveedor-count">{{ p.count }}</span>
              <span class="proveedor-categories">{{ p.categories }}</span>
            </div>
          </div>
          <button class="carousel-float-btn" aria-label="Ver mas proveedores">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>
      </section>

      <!-- Catalogo de productos -->
      <section class="catalogo-section">
        <div class="catalogo-card">
          <!-- Title -->
          <div class="catalogo-header">
            <h3 class="catalogo-titulo">Catálogo de productos</h3>
          </div>

          <!-- Filter toggles + Search -->
          <div class="filter-toggles-row">
            <div class="toggle-group">
              <div class="toggle-item">
                <i class="pi pi-heart-fill toggle-icon"></i>
                <span class="toggle-label">Favoritos</span>
                <label class="switch">
                  <input type="checkbox" [(ngModel)]="filterToggles.favoritos" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-item">
                <i class="pi pi-lock toggle-icon"></i>
                <span class="toggle-label">Privados</span>
                <label class="switch">
                  <input type="checkbox" [(ngModel)]="filterToggles.privados" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="toggle-item">
                <i class="pi pi-shopping-cart toggle-icon"></i>
                <span class="toggle-label">Con ordenes</span>
                <label class="switch">
                  <input type="checkbox" [(ngModel)]="filterToggles.conOrdenes" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="search-group">
              <div class="search-input-wrapper">
                <i class="pi pi-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Buscar"
                  [(ngModel)]="searchQuery"
                />
              </div>
              <button class="btn-buscar-imagen">
                <i class="pi pi-image"></i>
                <span>Buscar por imagen</span>
              </button>
            </div>
          </div>

          <!-- Filter dropdowns -->
          <div class="filter-dropdowns-row">
            <div class="filter-dropdown">
              <span class="filter-label">Tipo de proveedor</span>
              <select>
                <option value="">Proveedor</option>
                <option>Suppli</option>
                <option>ADMA</option>
                <option>Shopi Pauta</option>
              </select>
            </div>
            <div class="filter-price-range">
              <span class="filter-label">Rango de precio proveedor</span>
              <div class="price-inputs">
                <input type="text" placeholder="0" class="price-input" />
                <span class="price-separator">-</span>
                <input type="text" placeholder="0" class="price-input" />
              </div>
            </div>
            <div class="filter-dropdown">
              <span class="filter-label">Stock</span>
              <select>
                <option value="">Cantidad</option>
                <option>Con stock</option>
                <option>Sin stock</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <span class="filter-label">Categorías</span>
              <select>
                <option value="">Categorías</option>
                <option>Moda</option>
                <option>Tecnologia</option>
                <option>Hogar</option>
                <option>Cocina</option>
                <option>Ropa deportiva</option>
              </select>
            </div>
            <div class="filter-dropdown">
              <span class="filter-label">Ciudad</span>
              <select>
                <option value="">Ciudad</option>
                <option>Bogota</option>
                <option>Medellin</option>
                <option>Cali</option>
              </select>
            </div>
            <button class="btn-aplicar-filtros">
              <i class="pi pi-filter"></i>
              <span>Aplicar filtros</span>
            </button>
          </div>
        </div>

        <!-- Results bar -->
        <div class="results-bar">
          <div class="results-count">
            <span class="count-text">Más de</span>
            <span class="count-number">60.000</span>
            <span class="count-text">productos</span>
          </div>
          <div class="results-controls">
            <div class="sort-control">
              <span class="sort-label">Ordenar por:</span>
              <button class="sort-dropdown">
                <span>{{ sortBy }}</span>
                <i class="pi pi-chevron-down"></i>
              </button>
            </div>
            <div class="view-control">
              <span class="view-label">Vista:</span>
              <div class="view-segmented">
                <button
                  class="view-btn left"
                  [class.active]="viewMode === 'grid'"
                  (click)="viewMode = 'grid'"
                >
                  <i class="pi pi-th-large"></i>
                </button>
                <button
                  class="view-btn right"
                  [class.active]="viewMode === 'list'"
                  (click)="viewMode = 'list'"
                >
                  <i class="pi pi-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Product Grid -->
      <section class="products-grid">
        <div
          class="product-card"
          *ngFor="let product of filteredProducts; let i = index"
          [style.animation-delay]="i * 30 + 'ms'"
        >
          <!-- Image area -->
          <div class="card-image-area">
            <img
              [src]="product.image"
              [alt]="product.name"
              class="card-image"
            />
            <!-- Tag pill -->
            <span
              class="card-tag"
              [ngClass]="{
                'card-tag--info': product.tagColor === 'info',
                'card-tag--default': product.tagColor !== 'info'
              }"
            >
              {{ product.tag }}
            </span>
            <!-- Flag badge (gradient pill) -->
            <span *ngIf="product.flag" class="card-flag-badge">
              <span class="card-flag-pill">{{ product.flag }}</span>
            </span>
            <!-- Favorite heart -->
            <button
              class="card-fav-btn"
              (click)="product.favorite = !product.favorite"
              [class.active]="product.favorite"
              aria-label="Favorito"
            >
              <i [class]="product.favorite ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
            </button>
          </div>

          <!-- Info -->
          <div class="card-info">
            <div class="card-meta-row">
              <span class="card-category">{{ product.category }}</span>
              <span class="card-stock">
                <span class="stock-label">Stock: </span>
                <span class="stock-value" [style.color]="product.stockColor">{{ product.stock }}</span>
              </span>
            </div>
            <p class="card-name">{{ product.name }}</p>
            <span class="card-provider">
              <span class="provider-label">Proveedor: </span>
              <span class="provider-name">Tienda Proveedor</span>
            </span>
            <div class="card-prices">
              <div class="card-price-item">
                <span class="card-price-label">Precio proveedor</span>
                <span class="card-price-value">{{ formatPrice(product.provPrice) }}</span>
              </div>
              <div class="card-price-item">
                <span class="card-price-label">Precio sugerido</span>
                <span class="card-price-value">{{ formatPrice(product.sugPrice) }}</span>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <a class="card-cta" href="javascript:void(0)">
            <i class="pi pi-shopping-cart"></i>
            <span>Enviar a cliente</span>
          </a>
        </div>
      </section>
    </div>
  `,
})
export class CatalogoNewComponent {
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'Aleatorio';

  filterToggles = {
    favoritos: false,
    privados: false,
    conOrdenes: false,
  };

  providers: Provider[] = [
    {
      name: 'Suppli',
      count: '545 productos',
      categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tec...',
      avatar: 'assets/images/productos/avatar-suppli.png',
    },
    {
      name: 'ADMA',
      count: '545 productos',
      categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tec...',
      avatar: 'assets/images/productos/avatar-adma.png',
    },
    {
      name: 'Shopi Pauta',
      count: '545 productos',
      categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tec...',
      avatar: 'assets/images/productos/avatar-shopi.png',
    },
  ];

  products: Product[] = [
    { name: 'Organizador de closet- OR84', category: 'Hogar', stock: 126, stockColor: '#0ABB87', provPrice: 62000, sugPrice: 120000, tag: 'Variable', flag: 'Exclusivo', image: 'assets/images/productos/product-01.png' },
    { name: 'Y68 Reloj Inteligente Gps Pulso Cardiaco', category: 'Tecnologia', stock: 996, stockColor: '#0ABB87', provPrice: 62000, sugPrice: 120000, tag: 'Variable', flag: 'Premium', image: 'assets/images/productos/product-02.png' },
    { name: 'Ropa deportiva de 2 piezas para mujer', category: 'Ropa deportiva', stock: 96, stockColor: '#0ABB87', provPrice: 62000, sugPrice: 120000, tag: 'Variable', flag: null, image: 'assets/images/productos/product-03.png' },
    { name: 'Crispetera De Silicona Para Microonda', category: 'Cocina', stock: 9, stockColor: '#0ABB87', provPrice: 62000, sugPrice: 120000, tag: 'Combo', tagColor: 'info', flag: 'Verificado', image: 'assets/images/productos/product-04.png' },
    { name: 'Adidas Suela Liviana Rosado Dama', category: 'Moda', stock: 0, stockColor: '#F46A6B', provPrice: 62000, sugPrice: 120000, tag: 'Variable', flag: 'Exclusivo', image: 'assets/images/productos/product-05.png' },
    { name: 'Organizador de closet- OR84', category: 'Hogar', stock: 54, stockColor: '#0ABB87', provPrice: 45000, sugPrice: 89000, tag: 'Variable', flag: null, image: 'assets/images/productos/product-01.png' },
    { name: 'Y68 Reloj Inteligente Gps Pulso Cardiaco', category: 'Tecnologia', stock: 230, stockColor: '#0ABB87', provPrice: 78000, sugPrice: 145000, tag: 'Variable', flag: 'Verificado', image: 'assets/images/productos/product-02.png' },
    { name: 'Ropa deportiva de 2 piezas para mujer', category: 'Ropa deportiva', stock: 42, stockColor: '#0ABB87', provPrice: 55000, sugPrice: 105000, tag: 'Combo', tagColor: 'info', flag: 'Premium', image: 'assets/images/productos/product-03.png' },
    { name: 'Crispetera De Silicona Para Microonda', category: 'Cocina', stock: 0, stockColor: '#F46A6B', provPrice: 38000, sugPrice: 72000, tag: 'Variable', flag: 'Exclusivo', image: 'assets/images/productos/product-04.png' },
    { name: 'Adidas Suela Liviana Rosado Dama', category: 'Moda', stock: 187, stockColor: '#0ABB87', provPrice: 95000, sugPrice: 180000, tag: 'Variable', flag: null, image: 'assets/images/productos/product-05.png' },
  ];

  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) return this.products;
    const q = this.searchQuery.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  formatPrice(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }
}
