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

  // Single-carrier mode
  expandedTrayectoId: number | null = null;
  trayectoSnapshots: Record<string, string> = {};

  // Audit history
  showAuditHistory = false;
  auditLog: any[] = [];

  // Dialog modal state
  showConfirmDialog = false;
  confirmContext: { carrierId: string; trayectoId: number } | null = null;
  confirmChanges: { campo: string; anterior: string; nuevo: string }[] = [];
  saveSuccessId: string | null = null;

  // Comparison mode
  selectedTrayectoType = '';
  simValor = 50000;
  simPeso = 2;

  // Editable heat map values (keyed by carrierId)
  editingHeatCell: { carrierId: string; field: string } | null = null;
  editingHeatValue = 0;

  readonly heatFields: HeatField[] = [
    { key: 'flete_base', label: 'Flete base', group: 'dropi', format: 'currency' },
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Carrier[]>('/api/carriers').subscribe(data => {
      this.carriers = data;
      this.countries = [...new Set(data.map(c => c.country))];
      if (this.countries.length > 0) {
        this.selectedCountry = this.countries[0];
      }
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

  // ===== Carousel =====

  toggleCarrier(carrierId: string): void {
    if (this.selectedCarrierIds.has(carrierId)) {
      this.selectedCarrierIds.delete(carrierId);
    } else {
      this.selectedCarrierIds.add(carrierId);
    }
    // Reset single-carrier state
    this.expandedTrayectoId = null;
    this.trayectoSnapshots = {};

    // Take snapshots for single carrier
    if (this.singleSelectedCarrier) {
      this.takeSnapshots(this.singleSelectedCarrier);
      if (this.singleSelectedCarrier.trayectos.length > 0) {
        this.expandedTrayectoId = this.singleSelectedCarrier.trayectos[0].id;
      }
    }

    // Set default trayecto type for comparison
    if (this.isComparisonMode) {
      const allTypes = this.getAllTrayectoTypes();
      if (allTypes.length > 0 && !allTypes.includes(this.selectedTrayectoType)) {
        this.selectedTrayectoType = allTypes[0];
      }
    }
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

  toggleTrayecto(id: number): void {
    this.expandedTrayectoId = this.expandedTrayectoId === id ? null : id;
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
      { k: 'flete_base', label: 'Flete base', fmt: 'currency' },
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
    this.expandedTrayectoId = nextId;
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

    // For costs/rates, lower is better. For increment, lower is better too.
    if (val === min) return 'heat-best';
    if (val === max) return 'heat-worst';
    return '';
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
    if (!tiers?.length) return 0;
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
    const flete = this.calcFlete(trayecto.tiers, this.simPeso);
    const sobre = Math.max(this.simValor * (trayecto.sob_tasa / 100), trayecto.sob_min);
    const seg = this.simValor * (trayecto.seg / 100);
    const sub = flete + sobre + seg + trayecto.dropi_increment;
    const iva = sub * (carrier.iva / 100);
    const totalSeller = sub + iva;

    const costSobre = Math.max(this.simValor * (trayecto.sob_tasa_co / 100), trayecto.sob_min_co);
    const costSeg = this.simValor * (trayecto.seg_co / 100);
    const costSub = flete + costSobre + costSeg;
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
