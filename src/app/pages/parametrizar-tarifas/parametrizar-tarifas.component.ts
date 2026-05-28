import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// ===== Interfaces =====

interface SobrefleteConfig {
  value: number;
  mode: '%' | '$';
}

interface DropiConfig {
  incremento: number;
  sobreflete: SobrefleteConfig;
  seguro: number;
}

interface CarrierConfig {
  sobreflete: SobrefleteConfig;
  seguro: number;
  cod: number;
  devolucion: number;
}

interface Trayecto {
  id: number;
  name: string;
  type: string;
  dropi: DropiConfig;
  carrier: CarrierConfig;
}

interface Carrier {
  id: string;
  name: string;
  country: string;
  code: string;
  iva_enabled: boolean;
  iva_dropi: number;
  iva_carrier: number;
  tipos: string[];
  logo: string;
  trayectos: Trayecto[];
  od?: { origins: string[]; destinations: string[]; prices: number[][] };
  volumen: any[];
}

interface SimResult {
  totalSeller: number;
  totalCosto: number;
  utilidad: number;
  margen: number;
}

interface HeatField {
  key: string;
  label: string;
  group: 'dropi' | 'carrier';
  format: 'currency' | 'pct' | 'sobreflete';
}

@Component({
  selector: 'app-parametrizar-tarifas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametrizar-tarifas.component.html',
  styleUrls: ['./parametrizar-tarifas.component.scss'],
})
export class ParametrizarTarifasComponent implements OnInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  carriers: Carrier[] = [];
  countries: string[] = [];
  selectedCountry = '';
  selectedCarrierIds: Set<string> = new Set();
  loading = true;

  // Single-carrier mode
  activeTrayectoIndex = 0;
  trayectoSnapshots: Record<string, string> = {};
  carrierSnapshots: Record<string, string> = {};

  readonly countryFlags: Record<string, string> = {
    Argentina: 'assets/images/flags/ar.svg',
    Colombia: 'assets/images/flags/co.svg',
    México: 'assets/images/flags/mx.svg',
    Ecuador: 'assets/images/flags/ec.svg',
    Chile: 'assets/images/flags/cl.svg',
    Perú: 'assets/images/flags/pe.svg',
  };

  // Save confirm dialog
  showConfirmDialog = false;
  confirmContext: { carrierId: string; trayectoId: number } | null = null;
  confirmChanges: { campo: string; anterior: string; nuevo: string }[] = [];
  saveSuccessId: string | null = null;

  // Unsaved changes dialog
  showUnsavedDialog = false;
  pendingCarrierToggle: string | null = null;
  pendingCountryChange: string | null = null;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Comparison mode
  selectedComparisonTrayectos: Record<string, Set<number>> = {};
  simValor = 50000;

  readonly heatFields: HeatField[] = [
    { key: 'dropi.incremento', label: 'Incremento Dropi', group: 'dropi', format: 'currency' },
    { key: 'dropi.sobreflete', label: 'Sobreflete Dropi', group: 'dropi', format: 'sobreflete' },
    { key: 'dropi.seguro', label: 'Seguro Dropi', group: 'dropi', format: 'pct' },
    { key: 'carrier.sobreflete', label: 'Sobreflete Carrier', group: 'carrier', format: 'sobreflete' },
    { key: 'carrier.seguro', label: 'Seguro Carrier', group: 'carrier', format: 'pct' },
    { key: 'carrier.cod', label: 'COD', group: 'carrier', format: 'pct' },
    { key: 'carrier.devolucion', label: 'Devolución', group: 'carrier', format: 'currency' },
  ];

  // Simulator accordion sections
  simAccordionOpen: Record<string, boolean> = { seller: true, carrier: false };

  // FAB Simulator
  fabSimValor = 50000;
  fabSimTrayectoId: number | null = null;
  fabSimOrigen = '';
  fabSimDestino = '';

  // O-D inline editing
  editingOdCell: { row: number; col: number } | null = null;
  editingOdValue = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Carrier[]>('/api/carriers-mvp').subscribe(data => {
      this.carriers = data;
      this.countries = [...new Set(data.map(c => c.country))];
      if (this.countries.length > 0) {
        this.selectedCountry = this.countries[0];
      }
      this.loading = false;
    });
  }

  // ===== Filtering =====

  get filteredCarriers(): Carrier[] {
    if (!this.selectedCountry) return this.carriers;
    return this.carriers.filter(c => c.country === this.selectedCountry);
  }

  get selectedCarriers(): Carrier[] {
    return this.carriers.filter(c => this.selectedCarrierIds.has(c.id));
  }

  get isComparisonMode(): boolean {
    return this.selectedCarrierIds.size >= 2;
  }

  get singleSelectedCarrier(): Carrier | null {
    if (this.selectedCarrierIds.size !== 1) return null;
    const id = [...this.selectedCarrierIds][0];
    return this.carriers.find(c => c.id === id) || null;
  }

  get comparisonTitle(): string {
    return this.selectedCarriers.map(c => c.name).join(' vs ');
  }

  clearCountryFilter(): void {
    this.onCountryChange('');
  }

  onCountryChange(country: string): void {
    if (this.hasAnyUnsavedChanges()) {
      this.pendingCountryChange = country;
      this.showUnsavedDialog = true;
      return;
    }
    this.selectedCountry = country;
    this.resetSelection();
  }

  private resetSelection(): void {
    this.selectedCarrierIds.clear();
    this.activeTrayectoIndex = 0;
    this.trayectoSnapshots = {};
    this.carrierSnapshots = {};
    this.selectedComparisonTrayectos = {};
  }

  // ===== Unsaved Changes Guard =====

  hasAnyUnsavedChanges(): boolean {
    if (this.selectedCarrierIds.size !== 1) return false;
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return false;
    // Check carrier-level changes (IVA)
    if (this.hasCarrierLevelChanges(carrier)) return true;
    return carrier.trayectos.some(t => this.hasTrayectoChanges(carrier, t.id));
  }

  hasCarrierLevelChanges(carrier: Carrier): boolean {
    const key = 'carrier-' + carrier.id;
    if (!this.carrierSnapshots[key]) return false;
    const snap = JSON.parse(this.carrierSnapshots[key]);
    return carrier.iva_enabled !== snap.iva_enabled ||
           carrier.iva_dropi !== snap.iva_dropi ||
           carrier.iva_carrier !== snap.iva_carrier;
  }

  getUnsavedTrayectoNames(): string[] {
    if (this.selectedCarrierIds.size !== 1) return [];
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return [];
    const names: string[] = [];
    if (this.hasCarrierLevelChanges(carrier)) names.push('IVA');
    carrier.trayectos
      .filter(t => this.hasTrayectoChanges(carrier, t.id))
      .forEach(t => names.push(t.name));
    return names;
  }

  private restoreAllSnapshots(): void {
    if (this.selectedCarrierIds.size !== 1) return;
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return;
    // Restore carrier-level
    const carrierKey = 'carrier-' + carrier.id;
    if (this.carrierSnapshots[carrierKey]) {
      const snap = JSON.parse(this.carrierSnapshots[carrierKey]);
      carrier.iva_enabled = snap.iva_enabled;
      carrier.iva_dropi = snap.iva_dropi;
      carrier.iva_carrier = snap.iva_carrier;
    }
    for (const t of carrier.trayectos) {
      this.discardTrayecto(carrier, t.id);
    }
  }

  // ===== Carousel =====

  toggleCarrier(carrierId: string): void {
    if (this.hasAnyUnsavedChanges()) {
      this.pendingCarrierToggle = carrierId;
      this.pendingCountryChange = null;
      this.showUnsavedDialog = true;
      return;
    }
    this.executeToggleCarrier(carrierId);
  }

  executeToggleCarrier(carrierId: string): void {
    if (this.selectedCarrierIds.has(carrierId)) {
      this.selectedCarrierIds.delete(carrierId);
    } else {
      this.selectedCarrierIds.add(carrierId);
    }
    this.activeTrayectoIndex = 0;
    this.trayectoSnapshots = {};
    this.carrierSnapshots = {};

    if (this.singleSelectedCarrier) {
      this.takeSnapshots(this.singleSelectedCarrier);
      this.initSimPanel();
    }

    if (this.isComparisonMode) {
      this.initComparisonTrayectos();
    }
  }

  discardAndProceed(): void {
    this.restoreAllSnapshots();
    this.showUnsavedDialog = false;

    if (this.pendingCarrierToggle) {
      const pending = this.pendingCarrierToggle;
      this.pendingCarrierToggle = null;
      this.pendingCountryChange = null;
      this.executeToggleCarrier(pending);
    } else if (this.pendingCountryChange !== null) {
      const country = this.pendingCountryChange;
      this.pendingCarrierToggle = null;
      this.pendingCountryChange = null;
      this.selectedCountry = country;
      this.resetSelection();
    }
  }

  cancelUnsavedDialog(): void {
    this.showUnsavedDialog = false;
    this.pendingCarrierToggle = null;
    this.pendingCountryChange = null;
  }

  isCarrierSelected(carrierId: string): boolean {
    return this.selectedCarrierIds.has(carrierId);
  }

  scrollCarousel(): void {
    if (this.carouselTrack) {
      this.carouselTrack.nativeElement.scrollBy({ left: 220, behavior: 'smooth' });
    }
  }

  // ===== Single Carrier Mode =====

  takeSnapshots(carrier: Carrier): void {
    // Carrier-level snapshot
    this.carrierSnapshots['carrier-' + carrier.id] = JSON.stringify({
      iva_enabled: carrier.iva_enabled,
      iva_dropi: carrier.iva_dropi,
      iva_carrier: carrier.iva_carrier,
    });
    for (const t of carrier.trayectos) {
      this.trayectoSnapshots[carrier.id + '-' + t.id] = JSON.stringify(t);
    }
  }

  selectTrayecto(index: number): void {
    this.activeTrayectoIndex = index;
    if (this.activeTrayecto) {
      this.fabSimTrayectoId = this.activeTrayecto.id;
    }
  }

  get activeTrayecto(): Trayecto | null {
    if (!this.singleSelectedCarrier) return null;
    return this.singleSelectedCarrier.trayectos[this.activeTrayectoIndex] || null;
  }

  hasTrayectoChanges(carrier: Carrier, trayectoId: number): boolean {
    const t = carrier.trayectos.find(tr => tr.id === trayectoId);
    const key = carrier.id + '-' + trayectoId;
    if (!t || !this.trayectoSnapshots[key]) return false;
    return JSON.stringify(t) !== this.trayectoSnapshots[key];
  }

  discardTrayecto(carrier: Carrier, trayectoId: number): void {
    const key = carrier.id + '-' + trayectoId;
    if (!this.trayectoSnapshots[key]) return;
    const original: Trayecto = JSON.parse(this.trayectoSnapshots[key]);
    const idx = carrier.trayectos.findIndex(t => t.id === trayectoId);
    if (idx >= 0) {
      carrier.trayectos[idx] = original;
      this.trayectoSnapshots[key] = JSON.stringify(original);
    }
  }

  discardAll(): void {
    const carrier = this.singleSelectedCarrier;
    if (!carrier) return;
    // Restore carrier-level
    const carrierKey = 'carrier-' + carrier.id;
    if (this.carrierSnapshots[carrierKey]) {
      const snap = JSON.parse(this.carrierSnapshots[carrierKey]);
      carrier.iva_enabled = snap.iva_enabled;
      carrier.iva_dropi = snap.iva_dropi;
      carrier.iva_carrier = snap.iva_carrier;
    }
    for (const t of carrier.trayectos) {
      this.discardTrayecto(carrier, t.id);
    }
  }

  saveTrayecto(carrier: Carrier, trayectoId: number): void {
    this.confirmContext = { carrierId: carrier.id, trayectoId };
    this.confirmChanges = this.buildChangeSummary(carrier, trayectoId);
    this.showConfirmDialog = true;
  }

  executeSave(): void {
    if (!this.confirmContext) return;
    const carrier = this.carriers.find(c => c.id === this.confirmContext!.carrierId);
    if (carrier) {
      // Update carrier-level snapshot
      this.carrierSnapshots['carrier-' + carrier.id] = JSON.stringify({
        iva_enabled: carrier.iva_enabled,
        iva_dropi: carrier.iva_dropi,
        iva_carrier: carrier.iva_carrier,
      });
      // Update all trayecto snapshots
      for (const t of carrier.trayectos) {
        this.trayectoSnapshots[carrier.id + '-' + t.id] = JSON.stringify(t);
      }
      this.saveSuccessId = carrier.id;
      setTimeout(() => (this.saveSuccessId = null), 3000);
    }
    this.showConfirmDialog = false;
    this.confirmContext = null;
    this.fireToast('Cambios guardados exitosamente', 'success');
  }

  cancelConfirm(): void {
    this.showConfirmDialog = false;
    this.confirmContext = null;
  }

  buildChangeSummary(carrier: Carrier, trayectoId: number): { campo: string; anterior: string; nuevo: string }[] {
    const changes: { campo: string; anterior: string; nuevo: string }[] = [];

    // Carrier-level changes
    const carrierKey = 'carrier-' + carrier.id;
    if (this.carrierSnapshots[carrierKey]) {
      const snap = JSON.parse(this.carrierSnapshots[carrierKey]);
      if (carrier.iva_enabled !== snap.iva_enabled) {
        changes.push({ campo: 'Cobro de IVA', anterior: snap.iva_enabled ? 'Activo' : 'Inactivo', nuevo: carrier.iva_enabled ? 'Activo' : 'Inactivo' });
      }
      if (carrier.iva_dropi !== snap.iva_dropi) {
        changes.push({ campo: 'IVA Dropi', anterior: snap.iva_dropi + '%', nuevo: carrier.iva_dropi + '%' });
      }
      if (carrier.iva_carrier !== snap.iva_carrier) {
        changes.push({ campo: 'IVA Carrier', anterior: snap.iva_carrier + '%', nuevo: carrier.iva_carrier + '%' });
      }
    }

    // Trayecto-level changes for ALL trayectos
    for (const t of carrier.trayectos) {
      const key = carrier.id + '-' + t.id;
      if (!this.trayectoSnapshots[key]) continue;
      const original: Trayecto = JSON.parse(this.trayectoSnapshots[key]);
      const prefix = carrier.trayectos.length > 1 ? `[${t.name}] ` : '';

      if (t.dropi.incremento !== original.dropi.incremento) {
        changes.push({ campo: prefix + 'Incremento Dropi', anterior: this.formatCurrency(original.dropi.incremento), nuevo: this.formatCurrency(t.dropi.incremento) });
      }
      if (t.dropi.sobreflete.value !== original.dropi.sobreflete.value || t.dropi.sobreflete.mode !== original.dropi.sobreflete.mode) {
        changes.push({ campo: prefix + 'Sobreflete Dropi', anterior: this.formatSobreflete(original.dropi.sobreflete), nuevo: this.formatSobreflete(t.dropi.sobreflete) });
      }
      if (t.dropi.seguro !== original.dropi.seguro) {
        changes.push({ campo: prefix + 'Seguro Dropi', anterior: original.dropi.seguro + '%', nuevo: t.dropi.seguro + '%' });
      }
      if (t.carrier.sobreflete.value !== original.carrier.sobreflete.value || t.carrier.sobreflete.mode !== original.carrier.sobreflete.mode) {
        changes.push({ campo: prefix + 'Sobreflete Carrier', anterior: this.formatSobreflete(original.carrier.sobreflete), nuevo: this.formatSobreflete(t.carrier.sobreflete) });
      }
      if (t.carrier.seguro !== original.carrier.seguro) {
        changes.push({ campo: prefix + 'Seguro Carrier', anterior: original.carrier.seguro + '%', nuevo: t.carrier.seguro + '%' });
      }
      if (t.carrier.cod !== original.carrier.cod) {
        changes.push({ campo: prefix + 'COD', anterior: original.carrier.cod + '%', nuevo: t.carrier.cod + '%' });
      }
      if (t.carrier.devolucion !== original.carrier.devolucion) {
        changes.push({ campo: prefix + 'Devolución', anterior: this.formatCurrency(original.carrier.devolucion), nuevo: this.formatCurrency(t.carrier.devolucion) });
      }
    }

    return changes;
  }

  // ===== Simulator Accordion =====

  toggleSimAccordion(section: string): void {
    this.simAccordionOpen[section] = !this.simAccordionOpen[section];
  }

  // ===== FAB Simulator =====

  initSimPanel(): void {
    if (this.activeTrayecto) {
      this.fabSimTrayectoId = this.activeTrayecto.id;
    }
    const carrier = this.singleSelectedCarrier;
    if (carrier?.od) {
      this.fabSimOrigen = carrier.od.origins[0] || '';
      this.fabSimDestino = carrier.od.destinations[0] || '';
    } else {
      this.fabSimOrigen = '';
      this.fabSimDestino = '';
    }
  }

  get fabSimTrayecto(): Trayecto | null {
    if (!this.singleSelectedCarrier || this.fabSimTrayectoId === null) return null;
    return this.singleSelectedCarrier.trayectos.find(t => t.id === this.fabSimTrayectoId) || null;
  }

  get fabSimResult(): SimResult {
    const carrier = this.singleSelectedCarrier;
    const trayecto = this.fabSimTrayecto;
    if (!carrier || !trayecto || this.fabSimValor <= 0) {
      return { totalSeller: 0, totalCosto: 0, utilidad: 0, margen: 0 };
    }
    return this.calcSimResult(carrier, trayecto, this.fabSimValor);
  }

  calcSimResult(carrier: Carrier, trayecto: Trayecto, valorOrden: number): SimResult {
    // Dropi side
    const dropiSobre = this.calcSobrefleteValue(trayecto.dropi.sobreflete, valorOrden);
    const seg = valorOrden * trayecto.dropi.seguro / 100;
    const sub = dropiSobre + seg + trayecto.dropi.incremento;
    const iva = carrier.iva_enabled ? sub * carrier.iva_dropi / 100 : 0;
    const totalSeller = sub + iva;

    // Carrier side
    const costSobre = this.calcSobrefleteValue(trayecto.carrier.sobreflete, valorOrden);
    const costSeg = valorOrden * trayecto.carrier.seguro / 100;
    const costSub = costSobre + costSeg + trayecto.carrier.devolucion;
    const costIva = carrier.iva_enabled ? costSub * carrier.iva_carrier / 100 : 0;
    const totalCosto = costSub + costIva;

    const utilidad = totalSeller - totalCosto;
    const margen = totalSeller > 0 ? (utilidad / totalSeller) * 100 : 0;
    return { totalSeller, totalCosto, utilidad, margen };
  }

  calcSobrefleteValue(config: SobrefleteConfig, valorOrden: number): number {
    if (config.mode === '%') return valorOrden * config.value / 100;
    return config.value;
  }

  // Simulator breakdown values
  get fabSimDropiSobre(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.calcSobrefleteValue(t.dropi.sobreflete, this.fabSimValor);
  }

  get fabSimDropiSeg(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * t.dropi.seguro / 100;
  }

  get fabSimDropiIva(): number {
    const carrier = this.singleSelectedCarrier;
    const t = this.fabSimTrayecto;
    if (!carrier || !t) return 0;
    if (!carrier.iva_enabled) return 0;
    const sub = this.fabSimDropiSobre + this.fabSimDropiSeg + t.dropi.incremento;
    return sub * carrier.iva_dropi / 100;
  }

  get fabSimSellerSubtotal(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimDropiSobre + this.fabSimDropiSeg + t.dropi.incremento;
  }

  get fabSimCostSobre(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.calcSobrefleteValue(t.carrier.sobreflete, this.fabSimValor);
  }

  get fabSimCostSeg(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * t.carrier.seguro / 100;
  }

  get fabSimCod(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * t.carrier.cod / 100;
  }

  get fabSimCostIva(): number {
    const carrier = this.singleSelectedCarrier;
    const t = this.fabSimTrayecto;
    if (!carrier || !t) return 0;
    if (!carrier.iva_enabled) return 0;
    const costSub = this.fabSimCostSobre + this.fabSimCostSeg + t.carrier.devolucion;
    return costSub * carrier.iva_carrier / 100;
  }

  get fabSimCarrierSubtotal(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimCostSobre + this.fabSimCostSeg + t.carrier.devolucion;
  }

  // ===== Delta / Margin calculations (3rd column) =====

  calcDeltaSobreflete(trayecto: Trayecto): { value: string; delta: number } {
    const d = trayecto.dropi.sobreflete;
    const c = trayecto.carrier.sobreflete;
    if (d.mode === c.mode) {
      const delta = d.value - c.value;
      const symbol = d.mode === '%' ? '%' : '';
      const prefix = d.mode === '$' ? '$' : '';
      if (delta === 0) return { value: '0' + (d.mode === '%' ? '%' : ''), delta: 0 };
      return {
        value: (delta > 0 ? '+' : '') + prefix + delta.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + symbol,
        delta
      };
    }
    // Different modes: calculate at fabSimValor
    const ref = this.fabSimValor || 50000;
    const dropiVal = this.calcSobrefleteValue(d, ref);
    const carrierVal = this.calcSobrefleteValue(c, ref);
    const delta = dropiVal - carrierVal;
    if (delta === 0) return { value: '$0', delta: 0 };
    return {
      value: (delta > 0 ? '+' : '') + this.formatCurrency(delta),
      delta
    };
  }

  calcDeltaSeguro(trayecto: Trayecto): { value: string; delta: number } {
    const delta = trayecto.dropi.seguro - trayecto.carrier.seguro;
    if (delta === 0) return { value: '0%', delta: 0 };
    return {
      value: (delta > 0 ? '+' : '') + delta.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%',
      delta
    };
  }

  calcGananciaEstimada(trayecto: Trayecto): number {
    const ref = this.fabSimValor || 50000;
    const dropiSobre = this.calcSobrefleteValue(trayecto.dropi.sobreflete, ref);
    const carrierSobre = this.calcSobrefleteValue(trayecto.carrier.sobreflete, ref);
    const deltaSobre = dropiSobre - carrierSobre;
    const deltaSeg = ref * (trayecto.dropi.seguro - trayecto.carrier.seguro) / 100;
    const incremento = trayecto.dropi.incremento;
    return deltaSobre + deltaSeg + incremento;
  }

  // ===== O-D Matrix =====

  startOdEdit(row: number, col: number, value: number): void {
    this.editingOdCell = { row, col };
    this.editingOdValue = value;
  }

  saveOdEdit(od: any): void {
    if (!this.editingOdCell || !od) return;
    od.prices[this.editingOdCell.row][this.editingOdCell.col] = this.editingOdValue;
    this.editingOdCell = null;
  }

  cancelOdEdit(): void {
    this.editingOdCell = null;
  }

  isEditingOd(row: number, col: number): boolean {
    return this.editingOdCell?.row === row && this.editingOdCell?.col === col;
  }

  isDiagonal(od: any, row: number, col: number): boolean {
    if (!od) return false;
    return od.origins[row] === od.destinations[col];
  }

  applyVolumen(carrier: Carrier, index: number): void {
    carrier.volumen.forEach((v: any, i: number) => (v.active = i === index));
  }

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      Local: 'badge-success', Regional: 'badge-info',
      Nacional: 'badge-warning', Especial: 'badge-primary', Remoto: 'badge-danger',
    };
    return map[type] || 'badge-info';
  }

  // ===== Toast =====

  fireToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  // ===== Comparison Mode =====

  initComparisonTrayectos(): void {
    for (const carrier of this.selectedCarriers) {
      if (!this.selectedComparisonTrayectos[carrier.id]) {
        this.selectedComparisonTrayectos[carrier.id] = new Set();
        if (carrier.trayectos.length > 0) {
          this.selectedComparisonTrayectos[carrier.id].add(carrier.trayectos[0].id);
        }
      }
    }
  }

  isComparisonTrayectoSelected(carrierId: string, trayectoId: number): boolean {
    return this.selectedComparisonTrayectos[carrierId]?.has(trayectoId) || false;
  }

  toggleComparisonTrayecto(carrierId: string, trayectoId: number): void {
    if (!this.selectedComparisonTrayectos[carrierId]) {
      this.selectedComparisonTrayectos[carrierId] = new Set();
    }
    if (this.selectedComparisonTrayectos[carrierId].has(trayectoId)) {
      this.selectedComparisonTrayectos[carrierId].delete(trayectoId);
    } else {
      this.selectedComparisonTrayectos[carrierId].add(trayectoId);
    }
  }

  getSelectedTrayectosForCarrier(carrier: Carrier): Trayecto[] {
    const selected = this.selectedComparisonTrayectos[carrier.id];
    if (!selected || selected.size === 0) return [];
    return carrier.trayectos.filter(t => selected.has(t.id));
  }

  getComparisonRows(): { carrier: Carrier; trayecto: Trayecto; result: SimResult }[] {
    const rows: { carrier: Carrier; trayecto: Trayecto; result: SimResult }[] = [];
    for (const carrier of this.selectedCarriers) {
      const trayectos = this.getSelectedTrayectosForCarrier(carrier);
      for (const t of trayectos) {
        rows.push({
          carrier,
          trayecto: t,
          result: this.calcSimResult(carrier, t, this.simValor)
        });
      }
    }
    return rows;
  }

  get comparisonHasResults(): boolean {
    return this.getComparisonRows().length > 0;
  }

  getHeatValue(trayecto: Trayecto, field: HeatField): number | string | null {
    if (!trayecto) return null;
    switch (field.key) {
      case 'dropi.incremento': return trayecto.dropi.incremento;
      case 'dropi.sobreflete': return this.formatSobreflete(trayecto.dropi.sobreflete);
      case 'dropi.seguro': return trayecto.dropi.seguro;
      case 'carrier.sobreflete': return this.formatSobreflete(trayecto.carrier.sobreflete);
      case 'carrier.seguro': return trayecto.carrier.seguro;
      case 'carrier.cod': return trayecto.carrier.cod;
      case 'carrier.devolucion': return trayecto.carrier.devolucion;
      default: return null;
    }
  }

  getHeatNumericValue(trayecto: Trayecto, field: HeatField): number | null {
    if (!trayecto) return null;
    switch (field.key) {
      case 'dropi.incremento': return trayecto.dropi.incremento;
      case 'dropi.sobreflete': return this.calcSobrefleteValue(trayecto.dropi.sobreflete, this.simValor);
      case 'dropi.seguro': return trayecto.dropi.seguro;
      case 'carrier.sobreflete': return this.calcSobrefleteValue(trayecto.carrier.sobreflete, this.simValor);
      case 'carrier.seguro': return trayecto.carrier.seguro;
      case 'carrier.cod': return trayecto.carrier.cod;
      case 'carrier.devolucion': return trayecto.carrier.devolucion;
      default: return null;
    }
  }

  formatHeatValue(trayecto: Trayecto, field: HeatField): string {
    const val = this.getHeatValue(trayecto, field);
    if (val === null) return '—';
    if (field.format === 'sobreflete') return val as string;
    if (field.format === 'currency') return this.formatCurrency(val as number);
    return (val as number).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
  }

  getMarginClass(margen: number): string {
    if (margen < 0) return 'val-negative';     // RED — actual loss
    if (margen < 15) return 'val-warning';      // ORANGE — low margin
    return 'val-positive';                       // GREEN — healthy
  }

  getDeltaClass(delta: number): string {
    if (delta < 0) return 'val-negative';       // RED — losing money
    if (delta === 0) return 'val-neutral';      // GRAY
    return 'val-positive';                       // GREEN — gaining
  }

  // ===== Formatting =====

  formatCurrency(value: number | null): string {
    if (value === null || value === undefined) return '—';
    return '$' + value.toLocaleString('es-CO');
  }

  formatPct(value: number | null): string {
    if (value === null || value === undefined) return '—';
    return value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
  }

  formatSobreflete(config: SobrefleteConfig): string {
    if (config.mode === '%') {
      return config.value.toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + '%';
    }
    return '$' + config.value.toLocaleString('es-CO');
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
