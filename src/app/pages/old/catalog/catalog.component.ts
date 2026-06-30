import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrdersManualComponent } from '../orders-manual/orders-manual.component';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentityActivationCardComponent } from '../../../common/components/identity-activation-card/identity-activation-card.component';

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
  imports: [CommonModule, FormsModule, OrdersManualComponent, IdentityActivationCardComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  searchQuery = '';
  viewMode: 'grid' | 'list' = 'grid';
  sortBy = 'Aleatorio';
  showOrderModal = false;
  showBlockModal = false;
  selectedProduct: Product | null = null;

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus() {
    return this.identityDemo.status();
  }

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

  constructor(private http: HttpClient, private router: Router) {}

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
    if (this.demoIdentityStatus !== 'aprobado') {
      this.showBlockModal = true;
      return;
    }
    this.selectedProduct = product;
    this.showOrderModal = true;
    document.body.style.overflow = 'hidden';
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  closeBlockModal(): void {
    this.showBlockModal = false;
  }

  closeOrderModal(): void {
    this.showOrderModal = false;
    this.selectedProduct = null;
    document.body.style.overflow = '';
  }
}
