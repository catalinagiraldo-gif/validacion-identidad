import { Injectable, signal, computed } from '@angular/core';
import {
  IdentitySatelliteStatus,
  EstadoId,
  PaisPersona,
  mapEstadoToSatelliteStatus,
} from '../models/identity-flow.models';

const STORAGE_KEY = 'dropi.identity.demoStatus';
const PAIS_KEY = 'dropi.identity.demoPais';

@Injectable({ providedIn: 'root' })
export class IdentityDemoStateService {
  private readonly _status = signal<IdentitySatelliteStatus>(this.loadStatus());
  private readonly _paisPersona = signal<PaisPersona>(this.loadPais());

  readonly status = this._status.asReadonly();
  readonly paisPersona = this._paisPersona.asReadonly();
  readonly isApproved = computed(() => this._status() === 'aprobado');

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

  private loadStatus(): IdentitySatelliteStatus {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v === 'sin_validar' || v === 'pendiente' || v === 'en_revision' || v === 'rechazado' || v === 'aprobado') {
      return v;
    }
    return 'sin_validar';
  }

  private loadPais(): PaisPersona {
    const v = sessionStorage.getItem(PAIS_KEY);
    if (v && v in { 'co-natural': 1, 'co-juridica': 1, 'mx-natural': 1, 'mx-juridica': 1, 'ar-natural': 1, 'ar-juridica': 1, cl: 1, ec: 1 }) {
      return v as PaisPersona;
    }
    return 'co-natural';
  }
}
