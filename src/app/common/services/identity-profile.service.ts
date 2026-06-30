// Fuente de verdad del flujo de validación de identidad integrado (Sumsub).
// Modela dos entidades de negocio independientes — dueño de cuenta y responsable
// tributario — porque Reglasvalidacion.md les da reglas de bloqueo distintas.
import { Injectable, signal, computed } from '@angular/core';
import { TipoPersona } from '../models/identity-flow.models';

export type ValidationStatus = 'sin_validar' | 'pendiente' | 'en_revision' | 'rechazado' | 'aprobado';
export type PaisValidacion = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';

export interface RejectionReason {
  code: string;
  label: string;
  description: string;
}

export interface DatosPersonaNatural {
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  fechaNacimiento: string;
  nacionalidad: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface DatosPersonaJuridica {
  razonSocial: string;
  nit: string; // nunca digitado por el usuario — lo entrega Sumsub KYB
  representante: DatosPersonaNatural;
}

export interface DuenoCuentaState {
  tipoPersona: TipoPersona | null;
  natural: DatosPersonaNatural | null;
  juridica: DatosPersonaJuridica | null;
  pais: PaisValidacion;
  status: ValidationStatus;
  fechaValidacion: string | null;
  fechaDesbloqueo: string | null;
  motivoRechazo: RejectionReason | null;
  sumsubApplicantId: string | null;
}

export interface DatosFacturacionFiscal {
  pais: string;
  municipio: string;
  direccion: string;
  email: string;
  indicativo: string;
  telefono: string;
  tipoRegimen: string;
  tipoResponsabilidad: string;
  impuesto: string;
}

export interface ResponsableTributarioState {
  mismosDatosDueno: boolean;
  tipoPersona: TipoPersona | null;
  natural: DatosPersonaNatural | null;
  juridica: DatosPersonaJuridica | null;
  datosFacturacion: DatosFacturacionFiscal | null;
  status: ValidationStatus;
  motivoRechazo: RejectionReason | null;
  sumsubApplicantId: string | null;
}

export type BloqueoMotivo = 'ninguno' | 'falta-dueno' | 'falta-responsable' | 'ambos';

const SEIS_MESES_MS = 6 * 30 * 24 * 60 * 60 * 1000;

const STORAGE_DUENO = 'dropi.identityProfile.dueno';
const STORAGE_RESPONSABLE = 'dropi.identityProfile.responsable';

function emptyNatural(): DatosPersonaNatural {
  return {
    primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
    fechaNacimiento: '', nacionalidad: '', tipoDocumento: '', numeroDocumento: '',
    email: '', telefono: '', direccion: '',
  };
}

function defaultDueno(): DuenoCuentaState {
  return {
    tipoPersona: null,
    natural: null,
    juridica: null,
    pais: 'CO',
    status: 'sin_validar',
    fechaValidacion: null,
    fechaDesbloqueo: null,
    motivoRechazo: null,
    sumsubApplicantId: null,
  };
}

function defaultResponsable(): ResponsableTributarioState {
  return {
    mismosDatosDueno: true,
    tipoPersona: null,
    natural: null,
    juridica: null,
    datosFacturacion: null,
    status: 'sin_validar',
    motivoRechazo: null,
    sumsubApplicantId: null,
  };
}

@Injectable({ providedIn: 'root' })
export class IdentityProfileService {
  private readonly _dueno = signal<DuenoCuentaState>(this.loadDueno());
  private readonly _responsable = signal<ResponsableTributarioState>(this.loadResponsable());

  readonly dueno = this._dueno.asReadonly();
  readonly responsable = this._responsable.asReadonly();

  // --- Computed: estado del dueño ---
  readonly duenoValidado = computed(() => this._dueno().status === 'aprobado');

  readonly duenoBloqueadoEdicion = computed(() => {
    const d = this._dueno();
    if (d.status !== 'aprobado' || !d.fechaDesbloqueo) return false;
    return Date.now() < new Date(d.fechaDesbloqueo).getTime();
  });

  // --- Computed: estado del responsable tributario ---
  readonly responsableValidado = computed(() => {
    const r = this._responsable();
    return r.mismosDatosDueno ? this.duenoValidado() : r.status === 'aprobado';
  });

  readonly responsableStatusEfectivo = computed<ValidationStatus>(() => {
    const r = this._responsable();
    return r.mismosDatosDueno ? this._dueno().status : r.status;
  });

  // --- Computed: reglas de bloqueo (regla #2 — solo salidas de dinero) ---
  readonly retirosBloqueados = computed(() => !this.duenoValidado() || !this.responsableValidado());
  readonly transferenciasBloqueadas = computed(() => !this.duenoValidado() || !this.responsableValidado());
  readonly dropicardBloqueada = computed(() => !this.duenoValidado() || !this.responsableValidado());

  readonly bloqueoMotivo = computed<BloqueoMotivo>(() => {
    const faltaDueno = !this.duenoValidado();
    const faltaResponsable = !this.responsableValidado();
    if (faltaDueno && faltaResponsable) return 'ambos';
    if (faltaDueno) return 'falta-dueno';
    if (faltaResponsable) return 'falta-responsable';
    return 'ninguno';
  });

  // --- Mutadores: dueño ---
  setDuenoTipoPersona(tipo: TipoPersona): void {
    this._dueno.update((d) => ({ ...d, tipoPersona: tipo }));
    this.persistDueno();
  }

  setDuenoDatosNatural(datos: Partial<DatosPersonaNatural>): void {
    this._dueno.update((d) => ({
      ...d,
      tipoPersona: 'natural',
      natural: { ...(d.natural ?? emptyNatural()), ...datos },
    }));
    this.persistDueno();
  }

  setDuenoValidado(applicantId: string, tipoPersona: TipoPersona, datos: DatosPersonaNatural | DatosPersonaJuridica): void {
    const ahora = new Date();
    const desbloqueo = new Date(ahora.getTime() + SEIS_MESES_MS);
    this._dueno.update((d) => ({
      ...d,
      tipoPersona,
      natural: tipoPersona === 'natural' ? (datos as DatosPersonaNatural) : d.natural,
      juridica: tipoPersona === 'juridica' ? (datos as DatosPersonaJuridica) : d.juridica,
      status: 'aprobado',
      fechaValidacion: ahora.toISOString(),
      fechaDesbloqueo: desbloqueo.toISOString(),
      motivoRechazo: null,
      sumsubApplicantId: applicantId,
    }));
    this.persistDueno();
  }

  setDuenoRechazado(motivo: RejectionReason): void {
    this._dueno.update((d) => ({ ...d, status: 'rechazado', motivoRechazo: motivo }));
    this.persistDueno();
  }

  setDuenoPendiente(): void {
    this._dueno.update((d) => ({ ...d, status: 'pendiente' }));
    this.persistDueno();
  }

  // --- Mutadores: responsable tributario ---
  setResponsableMismosDatos(mismos: boolean): void {
    this._responsable.update((r) => ({ ...r, mismosDatosDueno: mismos }));
    this.persistResponsable();
  }

  setResponsableDatosFacturacion(datos: Partial<DatosFacturacionFiscal>): void {
    this._responsable.update((r) => ({
      ...r,
      datosFacturacion: {
        pais: '', municipio: '', direccion: '', email: '', indicativo: '57', telefono: '',
        tipoRegimen: '', tipoResponsabilidad: '', impuesto: '',
        ...(r.datosFacturacion ?? {}),
        ...datos,
      },
    }));
    this.persistResponsable();
  }

  setResponsableValidado(applicantId: string, tipoPersona: TipoPersona, datos: DatosPersonaNatural | DatosPersonaJuridica): void {
    this._responsable.update((r) => ({
      ...r,
      tipoPersona,
      natural: tipoPersona === 'natural' ? (datos as DatosPersonaNatural) : r.natural,
      juridica: tipoPersona === 'juridica' ? (datos as DatosPersonaJuridica) : r.juridica,
      status: 'aprobado',
      motivoRechazo: null,
      sumsubApplicantId: applicantId,
    }));
    this.persistResponsable();
  }

  setResponsableRechazado(motivo: RejectionReason): void {
    this._responsable.update((r) => ({ ...r, status: 'rechazado', motivoRechazo: motivo }));
    this.persistResponsable();
  }

  setResponsablePendiente(): void {
    this._responsable.update((r) => ({ ...r, status: 'pendiente' }));
    this.persistResponsable();
  }

  /** Regla #1 — fricción intencional defensiva: todo cambio sensible tras
   * aprobado fuerza vuelta a pendiente y re-validación completa con Sumsub. */
  invalidateResponsableForRevalidation(): void {
    this._responsable.update((r) => ({ ...r, status: 'pendiente', motivoRechazo: null }));
    this.persistResponsable();
  }

  resetAll(): void {
    this._dueno.set(defaultDueno());
    this._responsable.set(defaultResponsable());
    sessionStorage.removeItem(STORAGE_DUENO);
    sessionStorage.removeItem(STORAGE_RESPONSABLE);
  }

  private persistDueno(): void {
    sessionStorage.setItem(STORAGE_DUENO, JSON.stringify(this._dueno()));
  }

  private persistResponsable(): void {
    sessionStorage.setItem(STORAGE_RESPONSABLE, JSON.stringify(this._responsable()));
  }

  private loadDueno(): DuenoCuentaState {
    try {
      const raw = sessionStorage.getItem(STORAGE_DUENO);
      if (raw) return { ...defaultDueno(), ...JSON.parse(raw) };
    } catch { /* corrupted storage, fall through to default */ }
    return defaultDueno();
  }

  private loadResponsable(): ResponsableTributarioState {
    try {
      const raw = sessionStorage.getItem(STORAGE_RESPONSABLE);
      if (raw) return { ...defaultResponsable(), ...JSON.parse(raw) };
    } catch { /* corrupted storage, fall through to default */ }
    return defaultResponsable();
  }
}
