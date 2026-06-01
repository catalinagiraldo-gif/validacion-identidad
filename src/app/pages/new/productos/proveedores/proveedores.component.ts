import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Proveedor {
  name: string;
  count: number;
  categories: string;
  avatar: string;
  badge: 'verified' | 'star' | null;
  isFavorite: boolean;
}

@Component({
  selector: 'app-proveedores-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="proveedores-page">
      <!-- Breadcrumb -->
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb-icon"><i class="pi pi-home"></i></span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item">Productos</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item">Cat&aacute;logo</span>
        <span class="breadcrumb-separator"><i class="pi pi-chevron-right"></i></span>
        <span class="breadcrumb-item active">Proveedores</span>
      </nav>

      <!-- Page Title -->
      <h1 class="page-title">Proveedores</h1>

      <!-- Filter Section -->
      <section class="filtros-section">
        <div class="filtros-card">
          <div class="filtros-row">
            <!-- Filter Dropdowns -->
            <div class="filtros-dropdowns">
              <div class="select-group select-tipo">
                <label class="select-label">Tipo de proveedor</label>
                <div class="select-wrapper">
                  <select [(ngModel)]="tipoProveedor">
                    <option value="">Seleccione un tipo</option>
                    <option *ngFor="let t of tiposProveedor" [value]="t">{{ t }}</option>
                  </select>
                  <i class="pi pi-chevron-down select-icon"></i>
                </div>
              </div>

              <div class="select-group select-ciudad">
                <label class="select-label">Ciudad</label>
                <div class="select-wrapper">
                  <select [(ngModel)]="ciudad">
                    <option value="">Seleccione una ciudad</option>
                    <option *ngFor="let c of ciudades" [value]="c">{{ c }}</option>
                  </select>
                  <i class="pi pi-chevron-down select-icon"></i>
                </div>
              </div>

              <div class="select-group select-categoria">
                <label class="select-label">Categor&iacute;as</label>
                <div class="select-wrapper">
                  <select [(ngModel)]="categoria">
                    <option value="Todas">Todas</option>
                    <option *ngFor="let c of categorias" [value]="c">{{ c }}</option>
                  </select>
                  <i class="pi pi-chevron-down select-icon"></i>
                </div>
              </div>

              <button class="btn-submit-filter" (click)="aplicarFiltros()" aria-label="Aplicar filtros">
                <i class="pi pi-arrow-right"></i>
              </button>
            </div>

            <!-- Search Input -->
            <div class="search-input">
              <input
                type="text"
                placeholder="Buscar proveedor"
                [(ngModel)]="searchQuery"
              />
              <i class="pi pi-search search-icon"></i>
            </div>
          </div>
        </div>
      </section>

      <!-- Favorites Toggle -->
      <div class="favoritos-row">
        <div class="favoritos-toggle">
          <img src="assets/images/proveedores/favorite-filled.svg" alt="" class="fav-icon" />
          <span class="toggle-label">Favoritos</span>
          <label class="switch">
            <input type="checkbox" [(ngModel)]="favoritos" />
            <span class="slider"></span>
          </label>
        </div>
      </div>

      <!-- Provider Grid -->
      <section class="proveedores-grid">
        <div
          class="proveedor-card"
          *ngFor="let prov of filteredProveedores; let i = index"
          [style.animation-delay]="i * 40 + 'ms'"
        >
          <!-- Favorite button -->
          <button class="card-favorite" (click)="toggleFavorite(prov)" [attr.aria-label]="'Marcar ' + prov.name + ' como favorito'">
            <img
              [src]="prov.isFavorite ? 'assets/images/proveedores/favorite-filled.svg' : 'assets/images/proveedores/favorite-outline.svg'"
              alt=""
            />
          </button>

          <!-- Avatar -->
          <div class="card-avatar-area">
            <div class="card-avatar">
              <img [src]="prov.avatar" [alt]="prov.name" class="avatar-img" />
            </div>
            <!-- Badge -->
            <div class="badge-icon badge-verified" *ngIf="prov.badge === 'verified'">
              <img src="assets/images/home/badge-verified.png" alt="Verificado" />
            </div>
            <div class="badge-icon badge-star" *ngIf="prov.badge === 'star'">
              <img src="assets/images/home/badge-star.png" alt="Destacado" />
            </div>
          </div>

          <!-- Info -->
          <div class="card-info">
            <p class="card-name">{{ prov.name }}</p>
            <p class="card-count">{{ prov.count }} Productos</p>
            <p class="card-categories">{{ prov.categories }}</p>
          </div>
        </div>
      </section>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="filteredProveedores.length === 0">
        <i class="pi pi-search"></i>
        <p>No se encontraron proveedores con los filtros seleccionados.</p>
      </div>
    </div>
  `,
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresNewComponent {
  searchQuery = '';
  favoritos = false;
  tipoProveedor = '';
  ciudad = '';
  categoria = 'Todas';

  tiposProveedor = ['Premium', 'Verificado', 'Estandar'];
  ciudades = ['Bogota', 'Medellin', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena'];
  categorias = ['Moda', 'Deporte', 'Hogar', 'Salud', 'Belleza', 'Tecnologia', 'Cocina', 'Aseo', 'Bebe', 'Mascotas'];

  proveedores: Proveedor[] = [
    { name: 'Alejandro', count: 1, categories: 'Moda', avatar: 'assets/images/home/avatar-prendas.png', badge: 'star', isFavorite: false },
    { name: 'Astrid Carolina', count: 33, categories: 'Aseo, Bebé, Belleza, Camp...', avatar: 'assets/images/home/avatar-faka.png', badge: 'verified', isFavorite: true },
    { name: 'Harold Hg', count: 2, categories: 'Moda', avatar: 'assets/images/home/avatar-dsg.png', badge: 'star', isFavorite: false },
    { name: 'Malu Express', count: 22, categories: 'Belleza, Cocina, Deportes, ...', avatar: 'assets/images/home/avatar-cachy.png', badge: null, isFavorite: false },
    { name: 'Bioaqua Colombia', count: 263, categories: 'Belleza', avatar: 'assets/images/productos/avatar-suppli.png', badge: 'verified', isFavorite: true },
    { name: 'Skorpius Centro Comercial', count: 157, categories: 'Moda, Otro', avatar: 'assets/images/productos/avatar-adma.png', badge: null, isFavorite: false },
    { name: 'Juan', count: 22, categories: 'Aseo, Bebé, Belleza, Biene...', avatar: 'assets/images/productos/avatar-shopi.png', badge: 'star', isFavorite: false },
    { name: 'Casa Andina', count: 95, categories: 'Herramientas', avatar: 'assets/images/home/avatar-prendas.png', badge: null, isFavorite: false },
    { name: 'Agrogar Distribuciones', count: 206, categories: 'Aseo, Belleza, Bienestar, Bi...', avatar: 'assets/images/home/avatar-faka.png', badge: 'verified', isFavorite: true },
    { name: 'Procell Cali', count: 12, categories: 'Hogar, Jugueteria, Moda, ...', avatar: 'assets/images/home/avatar-dsg.png', badge: null, isFavorite: false },
    { name: 'La Valeriana', count: 69, categories: 'Aseo, Bebé, Belleza, Biene...', avatar: 'assets/images/home/avatar-cachy.png', badge: null, isFavorite: false },
    { name: 'Dywen Cosmetics', count: 4, categories: 'Belleza, Moda, Salud', avatar: 'assets/images/productos/avatar-suppli.png', badge: 'verified', isFavorite: false },
  ];

  get filteredProveedores(): Proveedor[] {
    let result = this.proveedores;

    if (this.favoritos) {
      result = result.filter(p => p.isFavorite);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.categories.toLowerCase().includes(q)
      );
    }

    if (this.categoria !== 'Todas') {
      result = result.filter(p => p.categories.toLowerCase().includes(this.categoria.toLowerCase()));
    }

    return result;
  }

  toggleFavorite(proveedor: Proveedor): void {
    proveedor.isFavorite = !proveedor.isFavorite;
  }

  aplicarFiltros(): void {
    // Filters are reactive via getter, button is for UX affordance
  }
}
