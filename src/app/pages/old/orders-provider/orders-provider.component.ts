import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface OrderProvider {
  id: number;
  producto: string;
  fechaOrden: string;
  direccion: string;
  estado: string;
  estadoColor: string;
  dropshipper: string;
  dropshipperId: string;
  transportadora: string;
  bodega: string;
  tipoEnvio: string;
}

interface BillingDropshipper {
  id: string;
  nombre: string;
  apellido: string;
  razonSocial: string | null;
  tipoDocumento: string;
  numeroDocumento: string;
  digitoVerificacion: string | null;
  email: string | null;
  telefono: string | null;
  ciudad: string | null;
  departamento: string | null;
  direccion: string | null;
  regimenTributario: string | null;
  actividadEconomica: string | null;
  codigoActividadEconomica: string | null;
  responsableIVA: boolean;
  totalOrdenes: number;
  totalVentas: number;
  completitud: number;
  ultimaOrdenEntregada: string;
  estado: string;
  pais: string;
}

type CountryCode = 'ALL' | 'CO' | 'CL' | 'MX' | 'EC' | 'AR';

interface CountryConfig {
  code: CountryCode;
  name: string;
  flag: string;
  taxIdLabel: string;
  currencyCode: string;
  currencyLocale: string;
}

const HABEAS_STORAGE_KEY = 'dropi.billing.habeasDataAccepted';

const COUNTRY_CONFIGS: Record<CountryCode, CountryConfig> = {
  ALL: { code: 'ALL', name: 'Todos los países', flag: '🌎', taxIdLabel: 'Documento', currencyCode: 'USD', currencyLocale: 'en-US' },
  CO: { code: 'CO', name: 'Colombia', flag: '🇨🇴', taxIdLabel: 'NIT / CC', currencyCode: 'COP', currencyLocale: 'es-CO' },
  CL: { code: 'CL', name: 'Chile', flag: '🇨🇱', taxIdLabel: 'RUT', currencyCode: 'CLP', currencyLocale: 'es-CL' },
  MX: { code: 'MX', name: 'México', flag: '🇲🇽', taxIdLabel: 'RFC', currencyCode: 'MXN', currencyLocale: 'es-MX' },
  EC: { code: 'EC', name: 'Ecuador', flag: '🇪🇨', taxIdLabel: 'RUC / Cédula', currencyCode: 'USD', currencyLocale: 'es-EC' },
  AR: { code: 'AR', name: 'Argentina', flag: '🇦🇷', taxIdLabel: 'CUIT', currencyCode: 'ARS', currencyLocale: 'es-AR' },
};

@Component({
  selector: 'app-orders-provider',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './orders-provider.component.html',
  styleUrls: ['./orders-provider.component.scss'],
})
export class OrdersProviderComponent implements OnInit {
  // ===== Tab state =====
  activeTab = 0;

  // ===== Tab 1: Orders =====
  orders: OrderProvider[] = [];
  searchQuery = '';
  pageSize = 10;
  currentPage = 1;
  selectedOrders = new Set<number>();
  showActionsDropdown = false;

  // Tab 1 filters (applied)
  filtersTab1 = {
    estado: '',
    transportadora: '',
    bodega: '',
    tipoEnvio: '',
    dateFrom: '',
    dateTo: '',
    searchField: 'ORDEN ID',
    searchValue: '',
  };
  // Tab 1 filters (draft, while modal open)
  draftFiltersTab1 = { ...this.filtersTab1 };
  showFiltersTab1 = false;

  // ===== Tab 2: Billing =====
  dropshippers: BillingDropshipper[] = [];
  billingSearch = '';
  selectedCountry: CountryCode = 'ALL';
  billingPageSize = 10;
  billingCurrentPage = 1;

  filtersTab2 = {
    pais: 'ALL' as CountryCode,
    estado: 'Todos',
    completitudMin: 0,
    regimen: '',
    dateFrom: '',
    dateTo: '',
  };
  draftFiltersTab2 = { ...this.filtersTab2 };
  showFiltersTab2 = false;

  // Drawer state
  selectedDropshipper: BillingDropshipper | null = null;

  // ===== Habeas Data =====
  habeasDataAccepted = false;
  showHabeasModal = false;
  habeasCheckbox = false;

  // ===== Toast =====
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'info' = 'success';

  readonly countryOptions: CountryConfig[] = Object.values(COUNTRY_CONFIGS);

  constructor(private http: HttpClient) {}

  private route = inject(ActivatedRoute);
  highlightBillingId = '';

  ngOnInit(): void {
    this.habeasDataAccepted = localStorage.getItem(HABEAS_STORAGE_KEY) === 'true';
    this.http.get<OrderProvider[]>('/api/orders-provider').subscribe(data => {
      this.orders = data;
    });

    const params = this.route.snapshot.queryParamMap;
    if (params.get('tab') === 'facturacion') {
      if (this.habeasDataAccepted) {
        this.activeTab = 1;
        this.loadBillingData();
      } else {
        this.showHabeasModal = true;
      }
    }
    const pais = params.get('pais');
    if (pais && pais in COUNTRY_CONFIGS) {
      this.filtersTab2 = { ...this.filtersTab2, pais: pais as CountryCode };
      this.selectedCountry = pais as CountryCode;
    }
    this.highlightBillingId = params.get('billingId') ?? '';
    if (this.highlightBillingId && this.dropshippers.length === 0 && this.habeasDataAccepted) {
      this.loadBillingData();
    }
  }

  // ===== Tab switching =====
  switchTab(index: number): void {
    if (index === 1 && !this.habeasDataAccepted) {
      this.showHabeasModal = true;
      return;
    }
    this.activeTab = index;
    if (index === 1 && this.dropshippers.length === 0) {
      this.loadBillingData();
    }
  }

  acceptHabeasData(): void {
    this.habeasDataAccepted = true;
    this.showHabeasModal = false;
    this.habeasCheckbox = false;
    localStorage.setItem(HABEAS_STORAGE_KEY, 'true');
    this.activeTab = 1;
    this.loadBillingData();
  }

  cancelHabeasData(): void {
    this.showHabeasModal = false;
    this.habeasCheckbox = false;
  }

  private loadBillingData(): void {
    this.http.get<BillingDropshipper[]>('/api/billing-dropshippers').subscribe(data => {
      this.dropshippers = data;
    });
  }

  // ===== Tab 1: Orders =====
  get filteredOrders(): OrderProvider[] {
    let result = this.orders;
    const f = this.filtersTab1;
    if (f.estado) result = result.filter(o => o.estado === f.estado);
    if (f.transportadora) result = result.filter(o => o.transportadora === f.transportadora);
    if (f.bodega) result = result.filter(o => o.bodega === f.bodega);
    if (f.tipoEnvio) result = result.filter(o => o.tipoEnvio === f.tipoEnvio);
    if (f.dateFrom) result = result.filter(o => o.fechaOrden >= f.dateFrom);
    if (f.dateTo) result = result.filter(o => o.fechaOrden <= f.dateTo);

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(o =>
        String(o.id).includes(q) ||
        o.producto.toLowerCase().includes(q) ||
        o.dropshipper.toLowerCase().includes(q) ||
        o.direccion.toLowerCase().includes(q)
      );
    }
    return result;
  }

  get paginatedOrders(): OrderProvider[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  get totalPagesOrders(): number {
    return Math.max(1, Math.ceil(this.filteredOrders.length / this.pageSize));
  }

  goToPageOrders(page: number): void {
    if (page >= 1 && page <= this.totalPagesOrders) this.currentPage = page;
  }

  get allSelected(): boolean {
    return this.paginatedOrders.length > 0 &&
      this.paginatedOrders.every(o => this.selectedOrders.has(o.id));
  }

  toggleSelectAll(): void {
    if (this.allSelected) {
      this.paginatedOrders.forEach(o => this.selectedOrders.delete(o.id));
    } else {
      this.paginatedOrders.forEach(o => this.selectedOrders.add(o.id));
    }
  }

  toggleSelectOrder(id: number): void {
    if (this.selectedOrders.has(id)) this.selectedOrders.delete(id);
    else this.selectedOrders.add(id);
  }

  isOrderSelected(id: number): boolean {
    return this.selectedOrders.has(id);
  }

  toggleActionsDropdown(): void {
    this.showActionsDropdown = !this.showActionsDropdown;
  }

  closeActionsDropdown(): void {
    this.showActionsDropdown = false;
  }

  bulkGenerarGuias(): void {
    this.closeActionsDropdown();
    if (this.selectedOrders.size === 0) {
      this.notify('Selecciona al menos un pedido', 'error');
      return;
    }
    this.notify(`Generando ${this.selectedOrders.size} guía(s)…`, 'info');
  }

  bulkImprimir(): void {
    this.closeActionsDropdown();
    if (this.selectedOrders.size === 0) {
      this.notify('Selecciona al menos un pedido', 'error');
      return;
    }
    this.notify(`Imprimiendo ${this.selectedOrders.size} pedido(s)…`, 'info');
  }

  bulkExportarOrdenes(): void {
    this.closeActionsDropdown();
    const rows = this.selectedOrders.size
      ? this.orders.filter(o => this.selectedOrders.has(o.id))
      : this.filteredOrders;
    if (rows.length === 0) {
      this.notify('Sin pedidos para exportar', 'error');
      return;
    }
    const ws = XLSX.utils.json_to_sheet(rows.map(o => ({
      'ID': o.id,
      'Producto': o.producto,
      'Fecha': o.fechaOrden,
      'Dirección': o.direccion,
      'Estado': o.estado,
      'Dropshipper': o.dropshipper,
      'Transportadora': o.transportadora,
      'Bodega': o.bodega,
      'Tipo de envío': o.tipoEnvio,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([out], { type: 'application/octet-stream' }), `pedidos-proveedor-${this.today()}.xlsx`);
    this.notify(`${rows.length} pedido(s) exportados`, 'success');
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'Entregada': return 'estado-entregada';
      case 'Guía generada': return 'estado-guia';
      case 'Pendiente': return 'estado-pendiente';
      case 'En tránsito': return 'estado-transito';
      case 'Devuelta': return 'estado-devuelta';
      default: return '';
    }
  }

  // ===== Tab 1 filter modal =====
  openFiltersTab1(): void {
    this.draftFiltersTab1 = { ...this.filtersTab1 };
    this.showFiltersTab1 = true;
  }

  closeFiltersTab1(): void {
    this.showFiltersTab1 = false;
  }

  applyFiltersTab1(): void {
    this.filtersTab1 = { ...this.draftFiltersTab1 };
    this.currentPage = 1;
    this.showFiltersTab1 = false;
    this.notify('Filtros aplicados', 'success');
  }

  clearFiltersTab1(): void {
    this.draftFiltersTab1 = {
      estado: '',
      transportadora: '',
      bodega: '',
      tipoEnvio: '',
      dateFrom: '',
      dateTo: '',
      searchField: 'ORDEN ID',
      searchValue: '',
    };
  }

  // Unique values derived from orders
  get estadosDisponibles(): string[] {
    return Array.from(new Set(this.orders.map(o => o.estado))).sort();
  }
  get transportadorasDisponibles(): string[] {
    return Array.from(new Set(this.orders.map(o => o.transportadora))).sort();
  }
  get bodegasDisponibles(): string[] {
    return Array.from(new Set(this.orders.map(o => o.bodega))).sort();
  }
  get tiposEnvioDisponibles(): string[] {
    return Array.from(new Set(this.orders.map(o => o.tipoEnvio))).sort();
  }

  // ===== Tab 2: Billing =====
  get filteredDropshippers(): BillingDropshipper[] {
    let result = this.dropshippers;
    const f = this.filtersTab2;

    if (f.pais !== 'ALL') result = result.filter(d => d.pais === f.pais);
    if (f.estado !== 'Todos') result = result.filter(d => d.estado === f.estado);
    if (f.completitudMin > 0) result = result.filter(d => d.completitud >= f.completitudMin);
    if (f.regimen) result = result.filter(d => d.regimenTributario === f.regimen);
    if (f.dateFrom) result = result.filter(d => d.ultimaOrdenEntregada >= f.dateFrom);
    if (f.dateTo) result = result.filter(d => d.ultimaOrdenEntregada <= f.dateTo);

    if (this.billingSearch.trim()) {
      const q = this.billingSearch.toLowerCase();
      result = result.filter(d =>
        d.nombre.toLowerCase().includes(q) ||
        d.apellido.toLowerCase().includes(q) ||
        d.numeroDocumento.includes(q) ||
        (d.razonSocial && d.razonSocial.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q))
      );
    }
    return result;
  }

  get paginatedDropshippers(): BillingDropshipper[] {
    const start = (this.billingCurrentPage - 1) * this.billingPageSize;
    return this.filteredDropshippers.slice(start, start + this.billingPageSize);
  }

  get totalPagesBilling(): number {
    return Math.max(1, Math.ceil(this.filteredDropshippers.length / this.billingPageSize));
  }

  goToPageBilling(page: number): void {
    if (page >= 1 && page <= this.totalPagesBilling) this.billingCurrentPage = page;
  }

  get totalDropshippers(): number {
    return this.filteredDropshippers.length;
  }

  get datosCompletos(): number {
    return this.filteredDropshippers.filter(d => d.completitud >= 100).length;
  }

  get datosIncompletos(): number {
    return this.filteredDropshippers.filter(d => d.completitud < 100).length;
  }

  get totalVentas(): number {
    return this.filteredDropshippers.reduce((sum, d) => sum + d.totalVentas, 0);
  }

  get currentCountryConfig(): CountryConfig {
    return COUNTRY_CONFIGS[this.filtersTab2.pais];
  }

  formatCurrency(value: number, country?: CountryCode): string {
    const cfg = COUNTRY_CONFIGS[country || this.filtersTab2.pais];
    return new Intl.NumberFormat(cfg.currencyLocale, {
      style: 'currency',
      currency: cfg.currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  getCompletitudClass(value: number): string {
    if (value >= 100) return 'complete';
    if (value >= 50) return 'partial';
    return 'incomplete';
  }

  regimenesDisponibles(): string[] {
    const pool = this.filtersTab2.pais === 'ALL'
      ? this.dropshippers
      : this.dropshippers.filter(d => d.pais === this.filtersTab2.pais);
    return Array.from(new Set(pool.map(d => d.regimenTributario).filter((r): r is string => !!r))).sort();
  }

  // ===== Tab 2 filter modal =====
  openFiltersTab2(): void {
    this.draftFiltersTab2 = { ...this.filtersTab2 };
    this.showFiltersTab2 = true;
  }

  closeFiltersTab2(): void {
    this.showFiltersTab2 = false;
  }

  applyFiltersTab2(): void {
    this.filtersTab2 = { ...this.draftFiltersTab2 };
    this.selectedCountry = this.filtersTab2.pais;
    this.billingCurrentPage = 1;
    this.showFiltersTab2 = false;
    this.notify('Filtros aplicados', 'success');
  }

  clearFiltersTab2(): void {
    this.draftFiltersTab2 = {
      pais: 'ALL',
      estado: 'Todos',
      completitudMin: 0,
      regimen: '',
      dateFrom: '',
      dateTo: '',
    };
  }

  setCountryQuick(code: CountryCode): void {
    this.filtersTab2 = { ...this.filtersTab2, pais: code };
    this.selectedCountry = code;
    this.billingCurrentPage = 1;
  }

  // ===== Drawer =====
  openDrawer(d: BillingDropshipper): void {
    this.selectedDropshipper = d;
  }

  closeDrawer(): void {
    this.selectedDropshipper = null;
  }

  getMissingFields(d: BillingDropshipper): string[] {
    const missing: string[] = [];
    if (!d.email) missing.push('Email');
    if (!d.telefono) missing.push('Teléfono');
    if (!d.direccion) missing.push('Dirección');
    if (!d.regimenTributario) missing.push('Régimen tributario');
    if (!d.actividadEconomica) missing.push('Actividad económica');
    if (!d.codigoActividadEconomica) missing.push('Código actividad');
    return missing;
  }

  // ===== Excel export =====
  downloadExcel(): void {
    const rows = this.filteredDropshippers;
    if (rows.length === 0) {
      this.notify('Sin datos para exportar', 'error');
      return;
    }
    const countryCode = this.filtersTab2.pais;
    const cfg = COUNTRY_CONFIGS[countryCode];

    const data = rows.map(d => this.buildExportRow(d, countryCode));
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto column widths
    const cols = Object.keys(data[0] || {});
    ws['!cols'] = cols.map(k => ({ wch: Math.max(k.length, 18) }));

    const wb = XLSX.utils.book_new();
    const sheetName = countryCode === 'ALL' ? 'Facturación (Todos)' : `Facturación ${cfg.code}`;
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
    const fileName = `datos-facturacion-${countryCode.toLowerCase()}-${this.today()}.xlsx`;
    saveAs(new Blob([out], { type: 'application/octet-stream' }), fileName);
    this.notify(`Excel descargado: ${rows.length} registro(s)`, 'success');
  }

  private buildExportRow(d: BillingDropshipper, country: CountryCode): Record<string, any> {
    const base: Record<string, any> = {
      'ID': d.id,
      'País': d.pais,
      'Nombre': d.nombre,
      'Apellido': d.apellido,
      'Razón social': d.razonSocial || '',
      'Tipo documento': d.tipoDocumento,
      'Número documento': d.numeroDocumento + (d.digitoVerificacion ? `-${d.digitoVerificacion}` : ''),
      'Email': d.email || '',
      'Teléfono': d.telefono || '',
      'Ciudad': d.ciudad || '',
      'Departamento/Estado': d.departamento || '',
      'Dirección': d.direccion || '',
      'Régimen tributario': d.regimenTributario || '',
      'Actividad económica': d.actividadEconomica || '',
      'Código actividad': d.codigoActividadEconomica || '',
      'Responsable IVA': d.responsableIVA ? 'Sí' : 'No',
      'Total órdenes': d.totalOrdenes,
      'Total ventas': d.totalVentas,
      'Completitud %': d.completitud,
      'Última orden entregada': d.ultimaOrdenEntregada,
      'Estado': d.estado,
    };
    return base;
  }

  // ===== Helpers =====
  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private notify(msg: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toastMessage = msg;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 2800);
  }

  getCountryFlag(code: string): string {
    return COUNTRY_CONFIGS[(code as CountryCode)]?.flag || '🌎';
  }

  getCountryName(code: string): string {
    return COUNTRY_CONFIGS[(code as CountryCode)]?.name || code;
  }

  get activeFiltersCountTab1(): number {
    const f = this.filtersTab1;
    let n = 0;
    if (f.estado) n++;
    if (f.transportadora) n++;
    if (f.bodega) n++;
    if (f.tipoEnvio) n++;
    if (f.dateFrom || f.dateTo) n++;
    return n;
  }

  get activeFiltersCountTab2(): number {
    const f = this.filtersTab2;
    let n = 0;
    if (f.pais !== 'ALL') n++;
    if (f.estado !== 'Todos') n++;
    if (f.completitudMin > 0) n++;
    if (f.regimen) n++;
    if (f.dateFrom || f.dateTo) n++;
    return n;
  }
}
