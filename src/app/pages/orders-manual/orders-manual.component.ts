import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Carrier {
  id: string;
  name: string;
  initials: string;
  color: string;
  basePrices: Record<string, number>;
}

interface Product {
  id: number;
  name: string;
  image: string;
  supplier: string;
  supplierPrice: number;
  salePrice: number;
  quantity: number;
  suggestedPrice: number;
  stock: number;
}

@Component({
  selector: 'app-orders-manual',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders-manual.component.html',
  styleUrls: ['./orders-manual.component.scss'],
})
export class OrdersManualComponent {
  @Output() closeModal = new EventEmitter<void>();
  submitted = false;

  // Client info
  client = {
    nombre: 'Paola',
    apellido: 'Angulo',
    countryCode: '57',
    phone: '3004456789',
    departamento: 'Valle del cauca',
    ciudad: 'Cali',
    direccion: 'Carrera 45 # 33',
    email: 'paola32@gmail.com',
    tienda: 'Variedades Pao',
    addNotes: false,
    notes: '',
  };

  // Products in order (supports multiple)
  orderProducts: Product[] = [
    {
      id: 290966,
      name: 'Organizador de closet-OR84',
      image: '',
      supplier: 'Brand',
      supplierPrice: 59000,
      salePrice: 59000,
      quantity: 1,
      suggestedPrice: 59000,
      stock: 168,
    },
  ];

  // Product search
  showProductSearch = false;
  productSearchQuery = '';
  filteredProducts: Product[] = [];

  // Available products catalog (mock)
  availableProducts: Product[] = [
    { id: 290966, name: 'Organizador de closet-OR84', image: '', supplier: 'Brand', supplierPrice: 59000, salePrice: 59000, quantity: 1, suggestedPrice: 59000, stock: 168 },
    { id: 310445, name: 'Faja reductora colombiana', image: '', supplier: 'FajasCo', supplierPrice: 35000, salePrice: 65000, quantity: 1, suggestedPrice: 65000, stock: 52 },
    { id: 285120, name: 'Kit de brochas maquillaje x12', image: '', supplier: 'BeautyPro', supplierPrice: 18000, salePrice: 39900, quantity: 1, suggestedPrice: 39900, stock: 300 },
    { id: 298001, name: 'Reloj deportivo inteligente', image: '', supplier: 'TechDrop', supplierPrice: 42000, salePrice: 79900, quantity: 1, suggestedPrice: 79900, stock: 85 },
    { id: 305672, name: 'Camiseta oversize estampada', image: '', supplier: 'UrbanWear', supplierPrice: 22000, salePrice: 45000, quantity: 1, suggestedPrice: 45000, stock: 210 },
  ];

  // Carriers with city-based pricing
  collectionType: 'con_recaudo' | 'sin_recaudo' = 'con_recaudo';
  selectedCarrierId = 'envia';

  carriers: Carrier[] = [
    { id: 'veloces', name: 'Veloces', initials: 'VE', color: '#1a73e8', basePrices: { 'Cali': 12000, 'Palmira': 14000, 'Buenaventura': 18000, default: 15000 } },
    { id: 'envia', name: 'Envía', initials: 'EN', color: '#e53935', basePrices: { 'Cali': 11000, 'Palmira': 13500, 'Buenaventura': 17000, default: 15000 } },
    { id: 'domina', name: 'Domina', initials: 'DO', color: '#6a1b9a', basePrices: { 'Cali': 13000, 'Palmira': 15000, 'Buenaventura': 19000, default: 15000 } },
    { id: 'coordinadora', name: 'Coordinadora', initials: 'CO', color: '#00897b', basePrices: { 'Cali': 12500, 'Palmira': 14500, 'Buenaventura': 17500, default: 15000 } },
    { id: 'interrapidisimo', name: 'Interrapidísimo', initials: 'IR', color: '#f57c00', basePrices: { 'Cali': 10500, 'Palmira': 13000, 'Buenaventura': 16500, default: 15000 } },
    { id: '99minutos', name: '99 MINUTOS', initials: '99', color: '#212121', basePrices: { 'Cali': 9800, 'Palmira': 12000, 'Buenaventura': 0, default: 15000 } },
  ];

  // Location data
  departamentos = ['Valle del cauca', 'Antioquia', 'Cundinamarca', 'Santander', 'Bolívar'];
  ciudadesPorDepto: Record<string, string[]> = {
    'Valle del cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'],
    'Antioquia': ['Medellín', 'Envigado', 'Bello', 'Rionegro', 'Itagüí'],
    'Cundinamarca': ['Bogotá', 'Soacha', 'Zipaquirá', 'Chía', 'Facatativá'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco'],
  };
  ciudades: string[] = ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago'];
  tiendas = ['Variedades Pao', 'Mi tienda online', 'Shop Express'];

  // Phone validation rules per country
  phoneDigits: Record<string, number> = { '57': 10, '52': 10, '51': 9, '593': 9 };

  // --- Computed values ---

  get isCompoundOrder(): boolean {
    return this.orderProducts.length > 1;
  }

  get totalRecaudar(): number {
    return this.orderProducts.reduce((sum, p) => sum + p.salePrice * p.quantity, 0);
  }

  get totalSupplierPrice(): number {
    return this.orderProducts.reduce((sum, p) => sum + p.supplierPrice * p.quantity, 0);
  }

  get precioEnvio(): number {
    const carrier = this.carriers.find(c => c.id === this.selectedCarrierId);
    if (!carrier) return 0;
    return this.getCarrierPrice(carrier);
  }

  get comisionPlataforma(): number {
    return 0;
  }

  get ganancia(): number {
    return this.totalRecaudar - this.totalSupplierPrice - this.precioEnvio - this.comisionPlataforma;
  }

  // --- Methods ---

  formatCurrency(value: number): string {
    return '$ ' + value.toLocaleString('es-CO');
  }

  selectCarrier(id: string): void {
    this.selectedCarrierId = id;
  }

  getCarrierPrice(carrier: Carrier): number {
    const city = this.client.ciudad;
    return carrier.basePrices[city] ?? carrier.basePrices['default'] ?? 15000;
  }

  onDepartamentoChange(): void {
    this.ciudades = this.ciudadesPorDepto[this.client.departamento] || [];
    this.client.ciudad = this.ciudades[0] || '';
    this.recalculateShipping();
  }

  recalculateShipping(): void {
    // Shipping recalculates reactively via getCarrierPrice + precioEnvio getter
    // This method exists as a hook for the template (ngModelChange)
  }

  // Phone validation
  isPhoneValid(): boolean {
    if (!this.client.phone) return false;
    const expected = this.phoneDigits[this.client.countryCode] || 10;
    return this.client.phone.replace(/\D/g, '').length === expected;
  }

  // Sale price validation: 80% for simple, 50% for compound
  getMinPrice(product: Product): number {
    const factor = this.isCompoundOrder ? 0.5 : 0.8;
    return Math.round(product.supplierPrice * factor);
  }

  isSalePriceValid(product: Product): boolean {
    return product.salePrice >= this.getMinPrice(product);
  }

  // Product search
  filterProducts(): void {
    const q = this.productSearchQuery.toLowerCase().trim();
    if (!q) {
      this.filteredProducts = [];
      return;
    }
    const addedIds = new Set(this.orderProducts.map(p => p.id));
    this.filteredProducts = this.availableProducts.filter(
      p => !addedIds.has(p.id) && (p.name.toLowerCase().includes(q) || p.id.toString().includes(q))
    );
  }

  addProduct(product: Product): void {
    this.orderProducts.push({ ...product });
    this.productSearchQuery = '';
    this.filteredProducts = [];
    this.showProductSearch = false;
  }

  removeProduct(index: number): void {
    this.orderProducts.splice(index, 1);
  }

  // Submit with validation
  submitOrder(): void {
    this.submitted = true;

    const hasEmptyRequired = !this.client.nombre || !this.client.apellido || !this.client.phone || !this.client.direccion;
    const hasInvalidPhone = !this.isPhoneValid();
    const hasInvalidPrices = this.orderProducts.some(p => !this.isSalePriceValid(p));
    const hasInvalidStock = this.orderProducts.some(p => p.quantity < 1 || p.quantity > p.stock);

    if (hasEmptyRequired || hasInvalidPhone || hasInvalidPrices || hasInvalidStock) {
      return;
    }

    // Wireframe: show success feedback
    alert('Orden creada exitosamente (wireframe demo)');
  }
}
