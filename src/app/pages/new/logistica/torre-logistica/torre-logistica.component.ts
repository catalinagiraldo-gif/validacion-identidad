import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Carrier {
  id: number;
  nombre: string;
  avatar: string;
  miOperacionEfectividad: number;
  miOperacionFlete: string;
  miOperacionTiempo: string;
  dropiEfectividad: number;
  dropiFlete: string;
  dropiTiempo: string;
}

type SortOption = 'Mayor Efectividad' | 'Menor Efectividad' | 'Menor Flete' | 'Menor Tiempo de entrega';
type ViewMode = 'mi-operacion' | 'dropi';

@Component({
  selector: 'app-torre-logistica-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./torre-logistica.component.scss'],
  template: `
    <div class="page-wrapper">
      <!-- Breadcrumb -->
      <nav class="breadcrumb">
        <span class="breadcrumb-item breadcrumb-home"><i class="pi pi-home"></i></span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item">Logistica</span>
        <i class="pi pi-chevron-right breadcrumb-chevron"></i>
        <span class="breadcrumb-item active">Torre logistica</span>
      </nav>

      <h1 class="page-title">Torre de logistica</h1>

      <!-- Filter bar -->
      <div class="filter-bar">
        <div class="filter-field">
          <label>Rango de fecha</label>
          <div class="filter-input">
            <i class="pi pi-calendar"></i>
            <span>{{ rangoFecha }}</span>
          </div>
        </div>
        <div class="filter-field">
          <label>Departamento</label>
          <div class="filter-select" (click)="toggleDropdown('departamento')">
            <span>{{ departamentoSeleccionado }}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <div class="filter-dropdown" *ngIf="openDropdown === 'departamento'">
            <button *ngFor="let dep of departamentos" class="filter-dropdown__item" (click)="selectDepartamento(dep)">{{ dep }}</button>
          </div>
        </div>
        <div class="filter-field">
          <label>Ciudad</label>
          <div class="filter-select" (click)="toggleDropdown('ciudad')">
            <span>{{ ciudadSeleccionada }}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <div class="filter-dropdown" *ngIf="openDropdown === 'ciudad'">
            <button *ngFor="let c of ciudades" class="filter-dropdown__item" (click)="selectCiudad(c)">{{ c }}</button>
          </div>
        </div>
        <div class="filter-field">
          <label>Transportadoras</label>
          <div class="filter-select" (click)="toggleDropdown('transportadora')">
            <span>{{ transportadoraSeleccionada }}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <div class="filter-dropdown" *ngIf="openDropdown === 'transportadora'">
            <button *ngFor="let t of transportadoras" class="filter-dropdown__item" (click)="selectTransportadora(t)">{{ t }}</button>
          </div>
        </div>
        <button class="btn-apply-filter" (click)="onApplyFilters()" aria-label="Aplicar filtros">
          <i class="pi pi-arrow-right"></i>
        </button>
      </div>

      <!-- Toggle + sort row -->
      <div class="controls-row">
        <div class="toggle-group">
          <div class="toggle-item">
            <button
              class="toggle-switch"
              [class.active]="viewMode === 'mi-operacion'"
              (click)="setViewMode('mi-operacion')"
              role="switch"
              [attr.aria-checked]="viewMode === 'mi-operacion'"
            >
              <span class="toggle-switch__indicator"></span>
            </button>
            <span class="toggle-label">Mi operacion</span>
          </div>
          <div class="toggle-item">
            <button
              class="toggle-switch"
              [class.active]="viewMode === 'dropi'"
              (click)="setViewMode('dropi')"
              role="switch"
              [attr.aria-checked]="viewMode === 'dropi'"
            >
              <span class="toggle-switch__indicator"></span>
            </button>
            <span class="toggle-label">Dropi</span>
          </div>
        </div>

        <div class="sort-group">
          <span class="sort-label">Ordenar por:</span>
          <div class="sort-select" (click)="toggleDropdown('sort')">
            <span>{{ sortOption }}</span>
            <i class="pi pi-angle-down"></i>
          </div>
          <div class="filter-dropdown filter-dropdown--right" *ngIf="openDropdown === 'sort'">
            <button *ngFor="let s of sortOptions" class="filter-dropdown__item" (click)="selectSort(s)">{{ s }}</button>
          </div>
        </div>
      </div>

      <!-- Content: carrier list + map -->
      <div class="content-grid">
        <div class="carrier-list">
          <div class="carrier-card" *ngFor="let carrier of sortedCarriers">
            <div class="carrier-card__header">
              <img [src]="carrier.avatar" [alt]="carrier.nombre" class="carrier-avatar" />
              <span class="carrier-name">{{ carrier.nombre }}</span>
            </div>

            <div class="carrier-block">
              <div class="carrier-block__row">
                <span class="carrier-block__label">Mi operacion</span>
                <span class="carrier-block__sublabel">Efectividad</span>
              </div>
              <div class="carrier-block__bar-row">
                <img src="assets/images/logistica/icon-reporte.svg" alt="" class="bar-icon" />
                <div class="bar-track">
                  <div class="bar-fill bar-fill--success" [style.width.%]="carrier.miOperacionEfectividad"></div>
                </div>
                <span class="bar-value">{{ carrier.miOperacionEfectividad }}%</span>
              </div>
              <div class="carrier-block__stats">
                <div class="stat">
                  <span class="stat-label">Flete promedio</span>
                  <span class="stat-value">{{ carrier.miOperacionFlete }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Tiempo de entrega</span>
                  <span class="stat-value">{{ carrier.miOperacionTiempo }}</span>
                </div>
              </div>
            </div>

            <div class="carrier-divider"></div>

            <div class="carrier-block">
              <div class="carrier-block__row">
                <span class="carrier-block__label">Dropi</span>
                <span class="carrier-block__sublabel">Efectividad</span>
              </div>
              <div class="carrier-block__bar-row">
                <img src="assets/images/logistica/icon-union.svg" alt="" class="bar-icon bar-icon--dropi" />
                <div class="bar-track">
                  <div class="bar-fill bar-fill--warning" [style.width.%]="carrier.dropiEfectividad"></div>
                </div>
                <span class="bar-value">{{ carrier.dropiEfectividad }}%</span>
              </div>
              <div class="carrier-block__stats">
                <div class="stat">
                  <span class="stat-label">Flete promedio</span>
                  <span class="stat-value">{{ carrier.dropiFlete }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Tiempo de entrega</span>
                  <span class="stat-value">{{ carrier.dropiTiempo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="map-panel">
          <div class="map-zoom-controls">
            <button class="map-zoom-btn map-zoom-btn--primary" (click)="zoomIn()" aria-label="Acercar mapa">
              <i class="pi pi-plus"></i>
            </button>
            <button class="map-zoom-btn" (click)="zoomOut()" aria-label="Alejar mapa">
              <i class="pi pi-minus"></i>
            </button>
          </div>
          <div class="map-wrapper">
            <img
              src="assets/images/logistica/colombia-map.svg"
              alt="Mapa de cobertura Colombia"
              class="colombia-map"
              [style.transform]="'scale(' + mapZoom + ')'"
            />
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TorreLogisticaNewComponent {
  rangoFecha = '12/09/2024';
  departamentoSeleccionado = 'Todos';
  ciudadSeleccionada = 'Todas';
  transportadoraSeleccionada = 'Todas';
  sortOption: SortOption = 'Mayor Efectividad';
  viewMode: ViewMode = 'mi-operacion';
  openDropdown: 'departamento' | 'ciudad' | 'transportadora' | 'sort' | null = null;
  mapZoom = 1;

  departamentos = ['Todos', 'Antioquia', 'Cundinamarca', 'Valle del Cauca', 'Atlantico', 'Santander'];
  ciudades = ['Todas', 'Medellin', 'Bogota', 'Cali', 'Barranquilla', 'Bucaramanga'];
  transportadoras = ['Todas', 'Veloces', 'Servientrega', 'Coordinadora', 'Interrapidisimo', 'Envia'];
  sortOptions: SortOption[] = ['Mayor Efectividad', 'Menor Efectividad', 'Menor Flete', 'Menor Tiempo de entrega'];

  carriers: Carrier[] = [
    { id: 1, nombre: 'Veloces', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 60, miOperacionFlete: '$15.800', miOperacionTiempo: '4,5 dias', dropiEfectividad: 40, dropiFlete: '$15.800', dropiTiempo: '4,5 dias' },
    { id: 2, nombre: 'Servientrega', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 20, miOperacionFlete: '$15.800', miOperacionTiempo: '5 dias', dropiEfectividad: 40, dropiFlete: '$15.800', dropiTiempo: '5 dias' },
    { id: 3, nombre: 'Coordinadora', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 75, miOperacionFlete: '$14.200', miOperacionTiempo: '3,8 dias', dropiEfectividad: 55, dropiFlete: '$14.900', dropiTiempo: '4 dias' },
    { id: 4, nombre: 'Interrapidisimo', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 82, miOperacionFlete: '$13.500', miOperacionTiempo: '3,2 dias', dropiEfectividad: 68, dropiFlete: '$13.900', dropiTiempo: '3,5 dias' },
    { id: 5, nombre: 'Envia', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 48, miOperacionFlete: '$16.100', miOperacionTiempo: '5,2 dias', dropiEfectividad: 35, dropiFlete: '$16.500', dropiTiempo: '5,5 dias' },
    { id: 6, nombre: 'TCC', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 67, miOperacionFlete: '$15.000', miOperacionTiempo: '4 dias', dropiEfectividad: 50, dropiFlete: '$15.300', dropiTiempo: '4,2 dias' },
    { id: 7, nombre: 'Deprisa', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 71, miOperacionFlete: '$14.700', miOperacionTiempo: '3,9 dias', dropiEfectividad: 58, dropiFlete: '$15.100', dropiTiempo: '4,1 dias' },
    { id: 8, nombre: 'Coltrans', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 39, miOperacionFlete: '$16.800', miOperacionTiempo: '5,8 dias', dropiEfectividad: 28, dropiFlete: '$17.000', dropiTiempo: '6 dias' },
    { id: 9, nombre: 'Envia Colvanes', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 55, miOperacionFlete: '$15.400', miOperacionTiempo: '4,3 dias', dropiEfectividad: 44, dropiFlete: '$15.700', dropiTiempo: '4,6 dias' },
    { id: 10, nombre: 'Inter Rapidisimo Plus', avatar: 'assets/images/logistica/carrier-avatar.png', miOperacionEfectividad: 90, miOperacionFlete: '$12.900', miOperacionTiempo: '2,9 dias', dropiEfectividad: 76, dropiFlete: '$13.200', dropiTiempo: '3,1 dias' },
  ];

  get sortedCarriers(): Carrier[] {
    const list = [...this.carriers];
    switch (this.sortOption) {
      case 'Mayor Efectividad':
        return list.sort((a, b) => this.effectivenessOf(b) - this.effectivenessOf(a));
      case 'Menor Efectividad':
        return list.sort((a, b) => this.effectivenessOf(a) - this.effectivenessOf(b));
      case 'Menor Flete':
        return list.sort((a, b) => this.fleteOf(a) - this.fleteOf(b));
      case 'Menor Tiempo de entrega':
        return list.sort((a, b) => this.tiempoOf(a) - this.tiempoOf(b));
      default:
        return list;
    }
  }

  private effectivenessOf(c: Carrier): number {
    return this.viewMode === 'mi-operacion' ? c.miOperacionEfectividad : c.dropiEfectividad;
  }

  private fleteOf(c: Carrier): number {
    const raw = this.viewMode === 'mi-operacion' ? c.miOperacionFlete : c.dropiFlete;
    return Number(raw.replace(/[^0-9]/g, ''));
  }

  private tiempoOf(c: Carrier): number {
    const raw = this.viewMode === 'mi-operacion' ? c.miOperacionTiempo : c.dropiTiempo;
    return parseFloat(raw.replace(',', '.'));
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
  }

  toggleDropdown(name: 'departamento' | 'ciudad' | 'transportadora' | 'sort'): void {
    this.openDropdown = this.openDropdown === name ? null : name;
  }

  selectDepartamento(dep: string): void {
    this.departamentoSeleccionado = dep;
    this.openDropdown = null;
  }

  selectCiudad(c: string): void {
    this.ciudadSeleccionada = c;
    this.openDropdown = null;
  }

  selectTransportadora(t: string): void {
    this.transportadoraSeleccionada = t;
    this.openDropdown = null;
  }

  selectSort(s: SortOption): void {
    this.sortOption = s;
    this.openDropdown = null;
  }

  onApplyFilters(): void {
    this.openDropdown = null;
  }

  zoomIn(): void {
    this.mapZoom = Math.min(2, +(this.mapZoom + 0.2).toFixed(2));
  }

  zoomOut(): void {
    this.mapZoom = Math.max(0.6, +(this.mapZoom - 0.2).toFixed(2));
  }
}
