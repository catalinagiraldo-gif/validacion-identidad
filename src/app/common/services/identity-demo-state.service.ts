import { Injectable, signal, computed } from '@angular/core';
import {
  IdentitySatelliteStatus,
  EstadoId,
  PaisPersona,
  mapEstadoToSatelliteStatus,
} from '../models/identity-flow.models';

export interface DatosFiscales {
  emailFacturacion: string;
  municipio: string;
  tipoRegimen?: string;
  actividadEconomica?: string;
  regimenFiscal?: string;
  codigoPostal?: string;
  condicionIVA?: string;
  provincia?: string;
}

export type FaseUsuario = 'setup' | 'activacion' | 'habito' | 'profesional' | 'legacy';

export interface FaseConfig {
  id: FaseUsuario;
  label: string;
  dia: string;
  defaultStatus: IdentitySatelliteStatus;
  primeraOrdenEntregada: boolean;
}

export const FASES: FaseConfig[] = [
  { id: 'setup',       label: '1 Setup',          dia: 'Día 1',    defaultStatus: 'sin_validar', primeraOrdenEntregada: false },
  { id: 'activacion',  label: '2 Primera venta',   dia: 'Día 15',   defaultStatus: 'sin_validar', primeraOrdenEntregada: true },
  { id: 'habito',      label: '3 Quiere retirar',  dia: 'Día 20+',  defaultStatus: 'sin_validar', primeraOrdenEntregada: true },
  { id: 'profesional', label: '4 Profesional',     dia: 'Mes 3+',   defaultStatus: 'aprobado',    primeraOrdenEntregada: true },
  { id: 'legacy',      label: '5 Legacy',          dia: 'Antiguo',  defaultStatus: 'sin_validar', primeraOrdenEntregada: false },
];

const STORAGE_KEY    = 'dropi.identity.demoStatus';
const PAIS_KEY       = 'dropi.identity.demoPais';
const FASE_KEY       = 'dropi.identity.demoFase';
const ORDEN_KEY      = 'dropi.identity.primeraOrden';
const RESULTADO_KEY  = 'dropi.identity.resultadoModal';

export type ResultadoModal = 'aprobado' | 'en_revision' | 'rechazado';

@Injectable({ providedIn: 'root' })
export class IdentityDemoStateService {
  private readonly _status             = signal<IdentitySatelliteStatus>(this.loadStatus());
  private readonly _paisPersona        = signal<PaisPersona>(this.loadPais());
  private readonly _fase               = signal<FaseUsuario>(this.loadFase());
  private readonly _primeraOrden       = signal<boolean>(this.loadPrimeraOrden());
  private readonly _resultadoModal     = signal<ResultadoModal>(this.loadResultadoModal());
  private readonly _datosFiscales      = signal<DatosFiscales | null>(null);

  readonly status             = this._status.asReadonly();
  readonly paisPersona        = this._paisPersona.asReadonly();
  readonly fase               = this._fase.asReadonly();
  readonly primeraOrdenEntregada = this._primeraOrden.asReadonly();
  readonly resultadoModal     = this._resultadoModal.asReadonly();
  readonly datosFiscales      = this._datosFiscales.asReadonly();

  readonly isApproved         = computed(() => this._status() === 'aprobado');
  readonly showSoftTouchpoints = computed(() =>
    this._primeraOrden() && this._status() !== 'aprobado'
  );

  readonly faseConfig = computed(() =>
    FASES.find(f => f.id === this._fase()) ?? FASES[0]
  );

  readonly pais = computed<'CO' | 'MX' | 'AR' | 'CL' | 'EC'>(() => {
    const p = this._paisPersona();
    if (p.startsWith('co')) return 'CO';
    if (p.startsWith('mx')) return 'MX';
    if (p.startsWith('ar')) return 'AR';
    if (p === 'cl') return 'CL';
    return 'EC';
  });

  readonly tipoPersona = computed<'natural' | 'juridica'>(() =>
    this._paisPersona().endsWith('juridica') ? 'juridica' : 'natural'
  );

  setFase(fase: FaseUsuario): void {
    const config = FASES.find(f => f.id === fase)!;
    this._fase.set(fase);
    this._primeraOrden.set(config.primeraOrdenEntregada);
    this._status.set(config.defaultStatus);
    sessionStorage.setItem(FASE_KEY, fase);
    sessionStorage.setItem(ORDEN_KEY, String(config.primeraOrdenEntregada));
    sessionStorage.setItem(STORAGE_KEY, config.defaultStatus);
  }

  setFromEstado(estado: EstadoId, pais?: PaisPersona): void {
    this._status.set(mapEstadoToSatelliteStatus(estado));
    if (pais) {
      this._paisPersona.set(pais);
      sessionStorage.setItem(PAIS_KEY, pais);
    }
    sessionStorage.setItem(STORAGE_KEY, this._status());
  }

  setStatus(status: IdentitySatelliteStatus, pais?: PaisPersona): void {
    this._status.set(status);
    if (pais) {
      this._paisPersona.set(pais);
      sessionStorage.setItem(PAIS_KEY, pais);
    }
    sessionStorage.setItem(STORAGE_KEY, status);
  }

  setPaisPersona(pais: PaisPersona): void {
    this._paisPersona.set(pais);
    sessionStorage.setItem(PAIS_KEY, pais);
  }

  setResultadoModal(r: ResultadoModal): void {
    this._resultadoModal.set(r);
    sessionStorage.setItem(RESULTADO_KEY, r);
  }

  setDatosFiscales(d: DatosFiscales): void {
    this._datosFiscales.set(d);
  }

  private loadStatus(): IdentitySatelliteStatus {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === 'sin_validar' || v === 'pendiente' || v === 'en_revision' || v === 'rechazado' || v === 'aprobado') return v;
    return 'sin_validar';
  }

  private loadPais(): PaisPersona {
    const v = sessionStorage.getItem(PAIS_KEY);
    const valid: PaisPersona[] = ['co-natural','co-juridica','mx-natural','mx-juridica','ar-natural','ar-juridica','cl','ec'];
    return valid.includes(v as PaisPersona) ? (v as PaisPersona) : 'co-natural';
  }

  private loadFase(): FaseUsuario {
    const v = sessionStorage.getItem(FASE_KEY);
    const valid: FaseUsuario[] = ['setup','activacion','habito','profesional','legacy'];
    return valid.includes(v as FaseUsuario) ? (v as FaseUsuario) : 'setup';
  }

  private loadPrimeraOrden(): boolean {
    return sessionStorage.getItem(ORDEN_KEY) === 'true';
  }

  private loadResultadoModal(): ResultadoModal {
    const v = sessionStorage.getItem(RESULTADO_KEY);
    if (v === 'aprobado' || v === 'en_revision' || v === 'rechazado') return v;
    return 'aprobado';
  }
}
