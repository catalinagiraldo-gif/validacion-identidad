import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Order {
  id: number;
  product: string;
  date: string;
  address: string;
  customer: string;
  phone: string;
  selected: boolean;
}

@Component({
  selector: 'app-ordenes-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./ordenes.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Pedidos</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Catalogo</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Ordenes</span>
      </nav>

      <!-- Page title -->
      <h1 class="page-title">Ordenes</h1>

      <!-- Action bar -->
      <div class="action-bar">
        <div class="action-bar__left">
          <button
            class="btn-acciones"
            (click)="showActionsDropdown = !showActionsDropdown"
          >
            <span>Acciones</span>
            <i class="pi pi-chevron-down"></i>
          </button>
          <div class="actions-dropdown" *ngIf="showActionsDropdown">
            <button class="actions-dropdown__item">Exportar seleccion</button>
            <button class="actions-dropdown__item">Eliminar seleccion</button>
            <button class="actions-dropdown__item">Cambiar estado</button>
          </div>
        </div>
        <div class="action-bar__right">
          <div class="search-input-wrapper">
            <i class="pi pi-search search-icon"></i>
            <input
              type="text"
              placeholder="Buscar"
              [(ngModel)]="searchQuery"
            />
          </div>
          <button class="btn-filter">
            <i class="pi pi-filter"></i>
          </button>
        </div>
      </div>

      <!-- Edit row -->
      <div class="edit-row">
        <button class="btn-edit" aria-label="Edicion masiva">
          <i class="pi pi-pencil"></i>
        </button>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="orders-table">
          <thead>
            <tr>
              <th class="col-check">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [checked]="allSelected"
                    (change)="toggleSelectAll($event)"
                  />
                  <span class="checkmark"></span>
                </label>
              </th>
              <th class="col-id">#</th>
              <th class="col-product">Nombre del producto</th>
              <th class="col-date">Fecha de la orden</th>
              <th class="col-details">Detalles</th>
              <th class="col-actions"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let order of filteredOrders; let i = index"
              [style.animation-delay]="i * 40 + 'ms'"
              class="order-row"
            >
              <td class="col-check">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    [(ngModel)]="order.selected"
                  />
                  <span class="checkmark"></span>
                </label>
              </td>
              <td class="col-id">
                <span class="order-id">{{ order.id }}</span>
              </td>
              <td class="col-product">
                <span class="order-product">{{ order.product }}</span>
              </td>
              <td class="col-date">
                <span class="order-date">{{ order.date }}</span>
              </td>
              <td class="col-details">
                <div class="details-cell">
                  <span class="details-address">{{ order.address }}</span>
                  <span class="details-customer">{{ order.customer }}</span>
                  <span class="details-phone">{{ order.phone }}</span>
                </div>
              </td>
              <td class="col-actions">
                <div class="action-icons">
                  <button class="action-icon-btn" aria-label="Confirmar">
                    <i class="pi pi-check"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Buscar">
                    <i class="pi pi-search"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Cliente">
                    <i class="pi pi-user"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Copiar">
                    <i class="pi pi-copy"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Envio">
                    <i class="pi pi-truck"></i>
                  </button>
                  <button class="action-icon-btn" aria-label="Ver detalle">
                    <i class="pi pi-eye"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- FAB buttons -->
      <div class="fab-group">
        <button class="fab-btn fab-btn--secondary" aria-label="Accion rapida 1">
          <i class="pi pi-plus"></i>
        </button>
        <button class="fab-btn fab-btn--secondary" aria-label="Accion rapida 2">
          <i class="pi pi-upload"></i>
        </button>
        <button class="fab-btn fab-btn--primary" aria-label="Nueva orden">
          <i class="pi pi-plus"></i>
        </button>
      </div>
    </div>
  `,
})
export class OrdenesNewComponent {
  searchQuery = '';
  showActionsDropdown = false;

  orders: Order[] = [
    { id: 38298635, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Manzana A Casa 17 Barrio Caicedoni', customer: 'Maria paola...', phone: 'Tel: 3...', selected: false },
    { id: 38298636, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 45 #12-30 Barrio Laureles', customer: 'Carlos Andres...', phone: 'Tel: 3...', selected: false },
    { id: 38298637, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Carrera 7 #82-15 Chapinero', customer: 'Laura Sofia...', phone: 'Tel: 3...', selected: false },
    { id: 38298638, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Transversal 22 #45-10 Poblado', customer: 'Juan Felipe...', phone: 'Tel: 3...', selected: false },
    { id: 38298639, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Avenida 68 #23-45 Kennedy', customer: 'Diana Marcela...', phone: 'Tel: 3...', selected: false },
    { id: 38298640, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 100 #15-20 Usaquen', customer: 'Andres Felipe...', phone: 'Tel: 3...', selected: false },
    { id: 38298641, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Carrera 30 #10-50 Teusaquillo', customer: 'Valentina...', phone: 'Tel: 3...', selected: false },
    { id: 38298642, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Diagonal 85 #30-12 Suba', customer: 'Santiago...', phone: 'Tel: 3...', selected: false },
    { id: 38298643, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 72 #8-25 Chapinero Alto', customer: 'Camila Andrea...', phone: 'Tel: 3...', selected: false },
    { id: 38298644, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Manzana B Casa 5 Villa del Prado', customer: 'Sebastian...', phone: 'Tel: 3...', selected: false },
    { id: 38298645, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Carrera 50 #32-18 Belen', customer: 'Daniela...', phone: 'Tel: 3...', selected: false },
    { id: 38298646, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 10 #4-69 La Candelaria', customer: 'Nicolas...', phone: 'Tel: 3...', selected: false },
    { id: 38298647, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Transversal 6 #27-10 Cedritos', customer: 'Isabela...', phone: 'Tel: 3...', selected: false },
    { id: 38298648, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Avenida Boyaca #64-20 Modelia', customer: 'Mateo...', phone: 'Tel: 3...', selected: false },
    { id: 38298649, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 53 #14-55 Galerias', customer: 'Juliana...', phone: 'Tel: 3...', selected: false },
    { id: 38298650, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Carrera 15 #93-47 Chico Norte', customer: 'Alejandro...', phone: 'Tel: 3...', selected: false },
    { id: 38298651, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Diagonal 48 #28-30 Floresta', customer: 'Natalia...', phone: 'Tel: 3...', selected: false },
    { id: 38298652, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 80 #69-70 Minuto de Dios', customer: 'David...', phone: 'Tel: 3...', selected: false },
    { id: 38298653, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Carrera 9 #116-20 Santa Barbara', customer: 'Mariana...', phone: 'Tel: 3...', selected: false },
    { id: 38298654, product: 'Extractor De Puntos Negros y espinillas', date: '08/03/2024 17:45 pm', address: 'Calle 26 #57-83 Centro Intern.', customer: 'Felipe...', phone: 'Tel: 3...', selected: false },
  ];

  get allSelected(): boolean {
    return this.orders.length > 0 && this.orders.every(o => o.selected);
  }

  get filteredOrders(): Order[] {
    if (!this.searchQuery.trim()) return this.orders;
    const q = this.searchQuery.toLowerCase();
    return this.orders.filter(
      o =>
        o.id.toString().includes(q) ||
        o.product.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
    );
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.orders.forEach(o => (o.selected = checked));
  }
}
