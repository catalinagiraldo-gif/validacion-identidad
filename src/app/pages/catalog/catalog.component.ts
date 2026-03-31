import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { OrdersManualComponent } from '../orders-manual/orders-manual.component';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  suggestedPrice: number;
  currency: string;
  stock: number;
  category: string;
  tags: string[];
  badge: string | null;
  imageUrl: string;
  description: string;
  isActive: boolean;
  supplierId: string;
  supplierName: string;
}

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, OrdersManualComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'Aleatorio';
  showOrderModal = false;
  selectedProduct: Product | null = null;

  filterToggles = {
    favoritos: false,
    privados: false,
    conOrdenes: false,
    combos: false,
  };

  suppliers = [
    { name: 'Suppli', initials: 'S', productsCount: 545, categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología', color: '#6366f1' },
    { name: 'Shopi Pauta', initials: 'SP', productsCount: 545, categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología', color: '#ec4899' },
    { name: 'Primos', initials: 'P', productsCount: 545, categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología', color: '#0ea5e9' },
    { name: 'ADMA', initials: 'A', productsCount: 545, categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología', color: '#f59e0b' },
    { name: 'Punto barato', initials: 'PB', productsCount: 545, categories: 'Moda, Deporte, Hogar, Salud, Belleza, Tecnología', color: '#14b8a6' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Product[]>('/api/products').subscribe((data) => {
      this.products = data.filter((p) => p.isActive);
    });
  }

  get filteredProducts(): Product[] {
    if (!this.searchQuery.trim()) return this.products;
    const q = this.searchQuery.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplierName.toLowerCase().includes(q)
    );
  }

  formatPrice(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  enviarACliente(product: Product): void {
    this.selectedProduct = product;
    this.showOrderModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }
}
