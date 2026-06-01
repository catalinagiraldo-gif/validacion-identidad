import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface PageTemplate {
  id: number;
  name: string;
  category: string;
  preview: string;
  uses: number;
}

@Component({
  selector: 'app-creador-paginas-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./creador-paginas.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Marketing</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Creador de paginas</span>
      </nav>

      <!-- Page title + actions -->
      <div class="page-header">
        <h1 class="page-title">Creador de paginas</h1>
        <button class="btn-primary">
          <i class="pi pi-plus"></i>
          <span>Crear pagina en blanco</span>
        </button>
      </div>

      <!-- Category filter -->
      <div class="category-bar">
        <button
          *ngFor="let cat of categories"
          class="category-chip"
          [class.category-chip--active]="selectedCategory === cat"
          (click)="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Search -->
      <div class="search-row">
        <div class="search-input-wrapper">
          <i class="pi pi-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar plantilla..."
            [(ngModel)]="searchQuery"
          />
        </div>
      </div>

      <!-- Templates grid -->
      <div class="templates-grid">
        <div
          *ngFor="let tpl of filteredTemplates; let i = index"
          class="template-card"
          [style.animation-delay]="i * 50 + 'ms'"
        >
          <div class="template-card__preview">
            <div class="template-card__placeholder" [style.background]="tpl.preview">
              <i class="pi pi-image"></i>
            </div>
            <div class="template-card__overlay">
              <button class="btn-use">
                <i class="pi pi-eye"></i>
                <span>Vista previa</span>
              </button>
              <button class="btn-use btn-use--primary">
                <i class="pi pi-copy"></i>
                <span>Usar plantilla</span>
              </button>
            </div>
          </div>
          <div class="template-card__info">
            <span class="template-card__name">{{ tpl.name }}</span>
            <div class="template-card__meta">
              <span class="template-card__category">{{ tpl.category }}</span>
              <span class="template-card__uses">{{ tpl.uses }} usos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CreadorPaginasNewComponent {
  searchQuery = '';
  selectedCategory = 'Todas';

  categories = ['Todas', 'Producto', 'Promocion', 'Evento', 'Marca', 'Testimonio'];

  templates: PageTemplate[] = [
    { id: 1, name: 'Producto estrella', category: 'Producto', preview: 'linear-gradient(135deg, #FF6102 0%, #F8B76D 100%)', uses: 1240 },
    { id: 2, name: 'Flash Sale', category: 'Promocion', preview: 'linear-gradient(135deg, #F46A6B 0%, #F9A9A9 100%)', uses: 890 },
    { id: 3, name: 'Lanzamiento', category: 'Evento', preview: 'linear-gradient(135deg, #008DBF 0%, #55C3E1 100%)', uses: 654 },
    { id: 4, name: 'Catalogo completo', category: 'Producto', preview: 'linear-gradient(135deg, #0ABB87 0%, #8DDBBC 100%)', uses: 2100 },
    { id: 5, name: 'Descuento temporada', category: 'Promocion', preview: 'linear-gradient(135deg, #F1B44C 0%, #F9DA95 100%)', uses: 760 },
    { id: 6, name: 'Nuestra historia', category: 'Marca', preview: 'linear-gradient(135deg, #475066 0%, #858EA6 100%)', uses: 320 },
    { id: 7, name: 'Resenas de clientes', category: 'Testimonio', preview: 'linear-gradient(135deg, #50A5F1 0%, #9AC7F4 100%)', uses: 540 },
    { id: 8, name: 'Combo especial', category: 'Producto', preview: 'linear-gradient(135deg, #D98432 0%, #FDE8D0 100%)', uses: 430 },
    { id: 9, name: 'Black Friday', category: 'Evento', preview: 'linear-gradient(135deg, #0E111A 0%, #333B4D 100%)', uses: 1870 },
    { id: 10, name: 'Envio gratis', category: 'Promocion', preview: 'linear-gradient(135deg, #077E5B 0%, #57C99A 100%)', uses: 980 },
    { id: 11, name: 'Quienes somos', category: 'Marca', preview: 'linear-gradient(135deg, #005B7A 0%, #8ED7EB 100%)', uses: 215 },
    { id: 12, name: 'Caso de exito', category: 'Testimonio', preview: 'linear-gradient(135deg, #A66427 0%, #FBCF9E 100%)', uses: 178 },
  ];

  get filteredTemplates(): PageTemplate[] {
    let result = this.templates;
    if (this.selectedCategory !== 'Todas') {
      result = result.filter(t => t.category === this.selectedCategory);
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    return result;
  }
}
