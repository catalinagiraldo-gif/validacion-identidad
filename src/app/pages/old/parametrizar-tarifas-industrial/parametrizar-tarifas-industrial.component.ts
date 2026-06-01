import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Tier {
  from: number;
  to: number | null;
  base: number | null;
  add: number | null;
  mode: string;
}

interface Trayecto {
  id: number;
  name: string;
  type: string;
  flete_base: number;
  dropi_increment: number;
  sob_tasa: number;
  sob_min: number;
  sob_tasa_co: number;
  sob_min_co: number;
  seg: number;
  seg_co: number;
  cod_co: number;
  devolucion: number;
  tiers: Tier[];
}

interface Carrier {
  id: string;
  name: string;
  country: string;
  code: string;
  iva: number;
  tipos: string[];
  logo: string;
  trayectos: Trayecto[];
  od: any;
  volumen: any[];
}

interface SimResult {
  flete: number;
  totalSeller: number;
  totalCosto: number;
  utilidad: number;
  margen: number;
}

interface HeatField {
  key: string;
  label: string;
  group: 'dropi' | 'carrier';
  format: 'currency' | 'pct';
}

@Component({
  selector: 'app-parametrizar-tarifas-industrial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametrizar-tarifas-industrial.component.html',
  styleUrls: ['./parametrizar-tarifas-industrial.component.scss'],
})
export class ParametrizarTarifasIndustrialComponent implements OnInit {
  @ViewChild('carouselTrack') carouselTrack!: ElementRef<HTMLDivElement>;

  carriers: Carrier[] = [];
  countries: string[] = [];
  selectedCountry = '';
  selectedCarrierIds: Set<string> = new Set();
  loading = true;

  // Single-carrier mode
  activeTrayectoIndex = 0;
  trayectoSnapshots: Record<string, string> = {};

  readonly countryFlags: Record<string, string> = {
    Argentina: 'assets/images/flags/ar.svg',
    Colombia: 'assets/images/flags/co.svg',
    México: 'assets/images/flags/mx.svg',
    Ecuador: 'assets/images/flags/ec.svg',
    Chile: 'assets/images/flags/cl.svg',
    Perú: 'assets/images/flags/pe.svg',
  };

  // Audit history
  showAuditHistory = false;
  auditLog: any[] = [];

  // Save confirm dialog
  showConfirmDialog = false;
  confirmContext: { carrierId: string; trayectoId: number } | null = null;
  confirmChanges: { campo: string; anterior: string; nuevo: string }[] = [];
  saveSuccessId: string | null = null;

  // Delete confirm dialog
  showDeleteDialog = false;
  deleteContext: { carrierId: string; trayectoId: number; trayectoName: string } | null = null;

  // Unsaved changes dialog
  showUnsavedDialog = false;
  pendingCarrierToggle: string | null = null;
  pendingCountryChange: string | null = null;

  // Toast
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  // Comparison mode
  selectedTrayectoType = '';
  simValor = 50000;
  simPeso = 2;

  // Editable heat map values
  editingHeatCell: { carrierId: string; field: string } | null = null;
  editingHeatValue = 0;

  readonly heatFields: HeatField[] = [
    { key: 'dropi_increment', label: 'Incremento Dropi', group: 'dropi', format: 'currency' },
    { key: 'sob_tasa', label: 'Sobreflete Dropi', group: 'dropi', format: 'pct' },
    { key: 'sob_min', label: 'Mín. sobreflete Dropi', group: 'dropi', format: 'currency' },
    { key: 'seg', label: 'Seguro Dropi', group: 'dropi', format: 'pct' },
    { key: 'sob_tasa_co', label: 'Sobreflete carrier', group: 'carrier', format: 'pct' },
    { key: 'sob_min_co', label: 'Mín. sobreflete carrier', group: 'carrier', format: 'currency' },
    { key: 'seg_co', label: 'Seguro carrier', group: 'carrier', format: 'pct' },
    { key: 'cod_co', label: 'COD', group: 'carrier', format: 'pct' },
    { key: 'devolucion', label: 'Devolución', group: 'carrier', format: 'currency' },
  ];

  readonly pctFields = new Set(['sob_tasa', 'seg', 'sob_tasa_co', 'seg_co', 'cod_co']);
  readonly tierModes = ['fijo', 'adicional', 'mínimo', 'por kg'];

  // Tier inline editing
  editingTier: { tierIndex: number; field: string } | null = null;
  editingTierValue: number | string = 0;

  // Simulator accordion sections
  simAccordionOpen: Record<string, boolean> = { order: true, tarifas: false, impuestos: false };

  // FAB Simulator
  showSimPanel = false;
  fabSimValor = 50000;
  fabSimPeso = 2;
  fabSimTrayectoId: number | null = null;
  fabSimOrigen = '';
  fabSimDestino = '';

  // O-D inline editing
  editingOdCell: { row: number; col: number } | null = null;
  editingOdValue = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Carrier[]>('/api/carriers').subscribe(data => {
      this.carriers = data;
      this.countries = [...new Set(data.map(c => c.country))];
      if (this.countries.length > 0) {
        this.selectedCountry = this.countries[0];
      }
      this.loading = false;
    });
    this.http.get<any[]>('/api/audit-log').subscribe(log => this.auditLog = log);
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
    this.showAuditHistory = false;
  }

  // ===== Unsaved Changes Guard =====

  hasAnyUnsavedChanges(): boolean {
    if (this.selectedCarrierIds.size !== 1) return false;
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return false;
    return carrier.trayectos.some(t => this.hasTrayectoChanges(carrier, t.id));
  }

  getUnsavedTrayectoNames(): string[] {
    if (this.selectedCarrierIds.size !== 1) return [];
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return [];
    return carrier.trayectos
      .filter(t => this.hasTrayectoChanges(carrier, t.id))
      .map(t => t.name);
  }

  private restoreAllSnapshots(): void {
    if (this.selectedCarrierIds.size !== 1) return;
    const id = [...this.selectedCarrierIds][0];
    const carrier = this.carriers.find(c => c.id === id);
    if (!carrier) return;
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

    if (this.singleSelectedCarrier) {
      this.takeSnapshots(this.singleSelectedCarrier);
      this.initSimPanel();
    }

    if (this.isComparisonMode) {
      const allTypes = this.getAllTrayectoTypes();
      if (allTypes.length > 0 && !allTypes.includes(this.selectedTrayectoType)) {
        this.selectedTrayectoType = allTypes[0];
      }
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

  saveTrayecto(carrier: Carrier, trayectoId: number): void {
    if (!this.hasTrayectoChanges(carrier, trayectoId)) return;
    this.confirmContext = { carrierId: carrier.id, trayectoId };
    this.confirmChanges = this.buildChangeSummary(carrier, trayectoId);
    this.showConfirmDialog = true;
  }

  executeSave(): void {
    if (!this.confirmContext) return;
    const carrier = this.carriers.find(c => c.id === this.confirmContext!.carrierId);
    if (carrier) {
      const t = carrier.trayectos.find(tr => tr.id === this.confirmContext!.trayectoId);
      if (t) {
        this.trayectoSnapshots[carrier.id + '-' + t.id] = JSON.stringify(t);
        this.saveSuccessId = carrier.id + '-' + t.id;
        setTimeout(() => (this.saveSuccessId = null), 3000);
      }
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
    const key = carrier.id + '-' + trayectoId;
    if (!this.trayectoSnapshots[key]) return [];
    const original: Trayecto = JSON.parse(this.trayectoSnapshots[key]);
    const current = carrier.trayectos.find(t => t.id === trayectoId);
    if (!current) return [];

    const fields: { k: keyof Trayecto; label: string; fmt: 'currency' | 'pct' }[] = [
      { k: 'dropi_increment', label: 'Incremento Dropi', fmt: 'currency' },
      { k: 'sob_tasa', label: 'Sobreflete Dropi', fmt: 'pct' },
      { k: 'sob_min', label: 'Mín. sobreflete Dropi', fmt: 'currency' },
      { k: 'seg', label: 'Seguro Dropi', fmt: 'pct' },
      { k: 'sob_tasa_co', label: 'Sobreflete carrier', fmt: 'pct' },
      { k: 'sob_min_co', label: 'Mín. sobreflete carrier', fmt: 'currency' },
      { k: 'seg_co', label: 'Seguro carrier', fmt: 'pct' },
      { k: 'cod_co', label: 'COD', fmt: 'pct' },
      { k: 'devolucion', label: 'Devolución', fmt: 'currency' },
    ];

    const changes: { campo: string; anterior: string; nuevo: string }[] = [];
    for (const f of fields) {
      const oldVal = original[f.k] as number;
      const newVal = current[f.k] as number;
      if (oldVal !== newVal) {
        const fmt = f.fmt === 'currency' ? (v: number) => this.formatCurrency(v) : (v: number) => v + '%';
        changes.push({ campo: f.label, anterior: fmt(oldVal), nuevo: fmt(newVal) });
      }
    }
    if (JSON.stringify(current.tiers) !== JSON.stringify(original.tiers)) {
      changes.push({ campo: 'Rangos de peso', anterior: original.tiers.length + ' rangos', nuevo: current.tiers.length + ' rangos' });
    }
    return changes;
  }

  // ===== Delete Trayecto =====

  canDeleteTrayecto(carrier: Carrier): boolean {
    return carrier.trayectos.length > 1;
  }

  requestDeleteTrayecto(carrier: Carrier, trayectoId: number): void {
    if (!this.canDeleteTrayecto(carrier)) return;
    const t = carrier.trayectos.find(tr => tr.id === trayectoId);
    if (!t) return;
    this.deleteContext = { carrierId: carrier.id, trayectoId, trayectoName: t.name };
    this.showDeleteDialog = true;
  }

  executeDelete(): void {
    if (!this.deleteContext) return;
    const carrier = this.carriers.find(c => c.id === this.deleteContext!.carrierId);
    if (!carrier) return;

    const idx = carrier.trayectos.findIndex(t => t.id === this.deleteContext!.trayectoId);
    if (idx < 0) return;

    const name = this.deleteContext.trayectoName;
    delete this.trayectoSnapshots[carrier.id + '-' + this.deleteContext.trayectoId];
    carrier.trayectos.splice(idx, 1);

    if (this.activeTrayectoIndex >= carrier.trayectos.length) {
      this.activeTrayectoIndex = Math.max(0, carrier.trayectos.length - 1);
    }

    this.showDeleteDialog = false;
    this.deleteContext = null;
    this.fireToast(`Trayecto "${name}" eliminado`, 'success');
  }

  cancelDelete(): void {
    this.showDeleteDialog = false;
    this.deleteContext = null;
  }

  // ===== Add Trayecto =====

  addTrayecto(carrier: Carrier): void {
    const nextId = Math.max(0, ...carrier.trayectos.map(t => t.id)) + 1;
    const newTrayecto: Trayecto = {
      id: nextId, name: `Trayecto ${nextId}`, type: 'Local',
      flete_base: 0, dropi_increment: 0,
      sob_tasa: 0, sob_min: 0, sob_tasa_co: 0, sob_min_co: 0,
      seg: 0, seg_co: 0, cod_co: 0, devolucion: 0,
      tiers: [{ from: 0, to: 1, base: 0, add: null, mode: 'fijo' }],
    };
    carrier.trayectos.push(newTrayecto);
    this.trayectoSnapshots[carrier.id + '-' + nextId] = JSON.stringify(newTrayecto);
    this.activeTrayectoIndex = carrier.trayectos.length - 1;
  }

  // ===== Tier Inline Editing =====

  startTierEdit(tierIndex: number, field: string, value: number | string | null): void {
    this.editingTier = { tierIndex, field };
    this.editingTierValue = value ?? 0;
  }

  saveTierEdit(tiers: Tier[]): void {
    if (!this.editingTier) return;
    const tier = tiers[this.editingTier.tierIndex];
    if (!tier) return;
    if (this.editingTier.field === 'mode') {
      tier.mode = this.editingTierValue as string;
    } else {
      const val = Number(this.editingTierValue);
      (tier as any)[this.editingTier.field] = isNaN(val) ? null : val;
    }
    this.editingTier = null;
  }

  cancelTierEdit(): void {
    this.editingTier = null;
  }

  isEditingTierCell(tierIndex: number, field: string): boolean {
    return this.editingTier?.tierIndex === tierIndex && this.editingTier?.field === field;
  }

  addTier(trayecto: Trayecto): void {
    const last = trayecto.tiers[trayecto.tiers.length - 1];
    const from = last ? (last.to ?? last.from + 1) : 0;
    trayecto.tiers.push({ from, to: null, base: 0, add: null, mode: 'fijo' });
  }

  deleteTier(trayecto: Trayecto, index: number): void {
    if (trayecto.tiers.length <= 1) return;
    trayecto.tiers.splice(index, 1);
  }

  // ===== Simulator Accordion =====

  toggleSimAccordion(section: string): void {
    this.simAccordionOpen[section] = !this.simAccordionOpen[section];
  }

  // ===== Tier Type Badge =====

  getTierTypeBadge(tier: Tier): { label: string; cssClass: string } {
    if (tier.to !== null && tier.to <= 7) {
      return { label: 'Paquetería Express', cssClass: 'badge-express' };
    }
    return { label: 'Mercancía Industrial', cssClass: 'badge-industrial' };
  }

  // ===== FAB Simulator =====

  initSimPanel(): void {
    if (this.activeTrayecto) {
      this.fabSimTrayectoId = this.activeTrayecto.id;
    }
  }

  get fabSimTrayecto(): Trayecto | null {
    if (!this.singleSelectedCarrier || this.fabSimTrayectoId === null) return null;
    return this.singleSelectedCarrier.trayectos.find(t => t.id === this.fabSimTrayectoId) || null;
  }

  get fabSimResult(): SimResult {
    const carrier = this.singleSelectedCarrier;
    const trayecto = this.fabSimTrayecto;
    if (!carrier || !trayecto || this.fabSimValor <= 0 || this.fabSimPeso <= 0) {
      return { flete: 0, totalSeller: 0, totalCosto: 0, utilidad: 0, margen: 0 };
    }
    const flete = this.calcFlete(trayecto.tiers, this.fabSimPeso);
    const sobre = Math.max(this.fabSimValor * (trayecto.sob_tasa / 100), trayecto.sob_min);
    const seg = this.fabSimValor * (trayecto.seg / 100);
    const sub = flete + sobre + seg + trayecto.dropi_increment;
    const iva = sub * (carrier.iva / 100);
    const totalSeller = sub + iva;

    const costSobre = Math.max(this.fabSimValor * (trayecto.sob_tasa_co / 100), trayecto.sob_min_co);
    const costSeg = this.fabSimValor * (trayecto.seg_co / 100);
    const costSub = flete + costSobre + costSeg + trayecto.devolucion;
    const costIva = costSub * (carrier.iva / 100);
    const totalCosto = costSub + costIva;

    const utilidad = totalSeller - totalCosto;
    const margen = totalSeller > 0 ? (utilidad / totalSeller) * 100 : 0;
    return { flete, totalSeller, totalCosto, utilidad, margen };
  }

  get fabSimCod(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * (t.cod_co / 100);
  }

  get fabSimSobre(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return Math.max(this.fabSimValor * (t.sob_tasa / 100), t.sob_min);
  }

  get fabSimSeg(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * (t.seg / 100);
  }

  get fabSimCostSobre(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return Math.max(this.fabSimValor * (t.sob_tasa_co / 100), t.sob_min_co);
  }

  get fabSimCostSeg(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimValor * (t.seg_co / 100);
  }

  // Accordion subtotals
  get fabSimOrderSubtotal(): number {
    return this.fabSimValor + this.fabSimResult.flete;
  }

  get fabSimTarifasSubtotal(): number {
    const t = this.fabSimTrayecto;
    if (!t) return 0;
    return this.fabSimSobre + this.fabSimSeg + t.dropi_increment;
  }

  get fabSimImpuestosSubtotal(): number {
    const t = this.fabSimTrayecto;
    const c = this.singleSelectedCarrier;
    if (!t || !c) return 0;
    const costSub = this.fabSimResult.flete + this.fabSimCostSobre + this.fabSimCostSeg + t.devolucion;
    const costIva = costSub * (c.iva / 100);
    return this.fabSimCostSobre + this.fabSimCostSeg + t.devolucion + costIva;
  }

  get fabSimTotalFlete(): number {
    return this.fabSimResult.totalSeller;
  }

  // ===== O-D Matrix Editing =====

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

  calcVolWeight(l: number, a: number, h: number, type: 'territorial' | 'international'): number {
    if (type === 'territorial') return l * a * h * 400;
    return (l * a * h) / 2500;
  }

  applyVolumen(carrier: Carrier, index: number): void {
    carrier.volumen.forEach((v, i) => (v.active = i === index));
  }

  getTypeBadgeClass(type: string): string {
    const map: Record<string, string> = {
      Local: 'badge-success', Regional: 'badge-info',
      Nacional: 'badge-warning', Especial: 'badge-primary', Remoto: 'badge-danger',
    };
    return map[type] || 'badge-info';
  }

  isPctFieldWarning(fieldKey: string, value: number): boolean {
    return this.pctFields.has(fieldKey) && value > 100;
  }

  // ===== Toast =====

  fireToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 3000);
  }

  // ===== Comparison Mode =====

  getAllTrayectoTypes(): string[] {
    const types = new Set<string>();
    for (const c of this.selectedCarriers) {
      for (const t of c.trayectos) {
        types.add(t.type);
      }
    }
    return [...types];
  }

  getTrayectoForCarrier(carrier: Carrier, type: string): Trayecto | null {
    return carrier.trayectos.find(t => t.type === type) || null;
  }

  getHeatValue(carrier: Carrier, field: HeatField): number | null {
    const t = this.getTrayectoForCarrier(carrier, this.selectedTrayectoType);
    if (!t) return null;
    return (t as any)[field.key] as number;
  }

  getHeatCellClass(field: HeatField, carrier: Carrier): string {
    const val = this.getHeatValue(carrier, field);
    if (val === null) return 'heat-na';

    const values = this.selectedCarriers
      .map(c => this.getHeatValue(c, field))
      .filter((v): v is number => v !== null);

    if (values.length < 2) return '';

    const min = Math.min(...values);
    const max = Math.max(...values);
    if (min === max) return '';

    if (val === min) return 'heat-best';
    if (val === max) return 'heat-worst';
    return '';
  }

  get comparisonHasResults(): boolean {
    return this.getComparisonResults().length > 0;
  }

  get simValid(): boolean {
    return this.simValor > 0 && this.simPeso > 0;
  }

  startHeatEdit(carrierId: string, field: string, currentValue: number): void {
    this.editingHeatCell = { carrierId, field };
    this.editingHeatValue = currentValue;
  }

  saveHeatEdit(): void {
    if (!this.editingHeatCell) return;
    const carrier = this.carriers.find(c => c.id === this.editingHeatCell!.carrierId);
    if (!carrier) return;
    const t = this.getTrayectoForCarrier(carrier, this.selectedTrayectoType);
    if (t) {
      (t as any)[this.editingHeatCell.field] = this.editingHeatValue;
    }
    this.editingHeatCell = null;
  }

  cancelHeatEdit(): void {
    this.editingHeatCell = null;
  }

  isEditingHeat(carrierId: string, field: string): boolean {
    return this.editingHeatCell?.carrierId === carrierId && this.editingHeatCell?.field === field;
  }

  // ===== Calculation =====

  calcFlete(tiers: Tier[], peso: number): number {
    if (!tiers?.length || peso <= 0) return 0;
    let accumulated = 0;
    for (const t of tiers) {
      const hi = t.to ?? 9999;
      if (t.mode === 'fijo' && peso >= t.from && peso <= hi) return t.base ?? 0;
      if (t.mode === 'mínimo' && peso >= t.from && peso <= hi) return t.base ?? 0;
      if ((t.mode === 'adicional' || t.mode === 'por kg') && t.add && peso > t.from) {
        const k = Math.min(peso, hi) - t.from;
        if (k > 0) accumulated += k * t.add;
      }
    }
    return accumulated || (tiers[0]?.base ?? 0);
  }

  calcMargin(carrier: Carrier, trayecto: Trayecto): SimResult {
    if (this.simValor <= 0 || this.simPeso <= 0) {
      return { flete: 0, totalSeller: 0, totalCosto: 0, utilidad: 0, margen: 0 };
    }
    const flete = this.calcFlete(trayecto.tiers, this.simPeso);
    const sobre = Math.max(this.simValor * (trayecto.sob_tasa / 100), trayecto.sob_min);
    const seg = this.simValor * (trayecto.seg / 100);
    const sub = flete + sobre + seg + trayecto.dropi_increment;
    const iva = sub * (carrier.iva / 100);
    const totalSeller = sub + iva;

    const costSobre = Math.max(this.simValor * (trayecto.sob_tasa_co / 100), trayecto.sob_min_co);
    const costSeg = this.simValor * (trayecto.seg_co / 100);
    const costSub = flete + costSobre + costSeg + trayecto.devolucion;
    const costIva = costSub * (carrier.iva / 100);
    const totalCosto = costSub + costIva;

    const utilidad = totalSeller - totalCosto;
    const margen = totalSeller > 0 ? (utilidad / totalSeller) * 100 : 0;

    return { flete, totalSeller, totalCosto, utilidad, margen };
  }

  getMarginClass(margen: number): string {
    if (margen >= 15) return 'margin-green';
    if (margen >= 10) return 'margin-yellow';
    return 'margin-red';
  }

  getComparisonResults(): { carrier: Carrier; trayecto: Trayecto; result: SimResult }[] {
    return this.selectedCarriers
      .map(c => {
        const t = this.getTrayectoForCarrier(c, this.selectedTrayectoType);
        if (!t) return null;
        return { carrier: c, trayecto: t, result: this.calcMargin(c, t) };
      })
      .filter((r): r is { carrier: Carrier; trayecto: Trayecto; result: SimResult } => r !== null);
  }

  // ===== Audit History =====

  toggleAuditHistory(): void { this.showAuditHistory = !this.showAuditHistory; }

  get filteredAuditLog(): any[] {
    if (this.selectedCarrierIds.size === 1) {
      const id = [...this.selectedCarrierIds][0];
      return this.auditLog.filter(e => e.carrierId === id);
    }
    const ids = [...this.selectedCarrierIds];
    return this.auditLog.filter(e => ids.includes(e.carrierId));
  }

  formatDate(iso: string): string {
    const d = new Date(iso);
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${day} ${months[d.getMonth()]} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  formatAuditValue(campo: string, valor: number): string {
    const lower = campo.toLowerCase();
    if (lower.includes('tasa') || lower.includes('seguro') || lower.includes('cod') || lower.includes('%')) {
      return valor + '%';
    }
    return this.formatCurrency(valor);
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

  formatFieldValue(value: number | null, format: 'currency' | 'pct'): string {
    if (format === 'currency') return this.formatCurrency(value);
    return this.formatPct(value);
  }

  tierRangeLabel(tier: Tier): string {
    const to = tier.to !== null ? tier.to + ' kg' : '+ kg';
    return tier.from + ' – ' + to;
  }

  tierModeLabel(mode: string): string {
    const map: Record<string, string> = {
      fijo: 'Fijo', adicional: 'Adicional', 'mínimo': 'Mínimo', 'por kg': 'Por kg',
    };
    return map[mode] || mode;
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }
}
