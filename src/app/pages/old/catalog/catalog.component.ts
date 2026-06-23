import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrdersManualComponent } from '../orders-manual/orders-manual.component';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';

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
  showBlockModal = false;
  selectedProduct: Product | null = null;

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  setDemoIdentityStatus(status: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(status);
  }

  readonly identityStatusOptions: IdentitySatelliteStatus[] = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'crear órdenes';

  readonly identityAlerts: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: {
      type: 'warning', icon: 'pi-shield', step: 1, stateLabel: 'Sin validar',
      text: 'Para crear órdenes, verifica tu identidad primero. Es un proceso rápido que activa todas tus operaciones.',
      cta: 'Verificar mi identidad',
    },
    pendiente: {
      type: 'warning', icon: 'pi-exclamation-triangle', step: 2, stateLabel: 'Verificación incompleta',
      text: 'Tu verificación está incompleta. Ya guardaste tus datos — solo falta el paso biométrico para terminar.',
      cta: 'Continuar verificación',
    },
    en_revision: {
      type: 'info', icon: 'pi-clock', step: 3, stateLabel: 'En revisión',
      text: 'Tu identidad está en revisión. Mientras tanto algunas funciones están pausadas — te avisamos cuando esté aprobada.',
      cta: 'Ver estado',
    },
    rechazado: {
      type: 'error', icon: 'pi-times-circle', step: 2, stateLabel: 'Verificación rechazada',
      text: 'Tu verificación fue rechazada. Puedes intentarlo de nuevo — revisa la guía para asegurarte el éxito esta vez.',
      cta: 'Reintentar verificación',
    },
  };

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

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.identityAlerts[this.demoIdentityStatus] : null;
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
