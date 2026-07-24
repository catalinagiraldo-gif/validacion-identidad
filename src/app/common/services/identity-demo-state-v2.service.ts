import { Injectable, signal, computed } from '@angular/core';
import {
  FaseProyecto,
  FASES_PROYECTO,
  MomentoUsuario,
  MOMENTOS_USUARIO,
  Pais9,
  PAISES_9,
  TipoPersonaV2,
  SegmentoUsuario,
  MecanismoVigente,
  MECANISMO_MATRIZ,
  MotorValidacion,
  EstadoKyb,
  MotivoPendiente,
  IdentitySatelliteStatusV2,
  DatosCapturadosKyc,
  Fase0TipoUsuario,
} from '../models/identity-flow-v2.models';

// Additive demo-panel state for Plan2.md (docs/validacion/Plan2.md), Parte 1.
// This service NEVER reads from or writes to IdentityDemoStateService's
// sessionStorage keys — it is a parallel, independent state store scoped to
// /new/* pages built against the 7-part rediseño (Fase de entrega × Etapa del
// usuario × país × tipo de persona, ver Matriz maestra líneas 251-267).

const FASE_PROYECTO_KEY   = 'dropi.identityV2.faseProyecto';
const MOMENTO_KEY         = 'dropi.identityV2.momentoUsuario';
const PAIS_KEY            = 'dropi.identityV2.pais';
const TIPO_PERSONA_KEY    = 'dropi.identityV2.tipoPersona';
const SEGMENTO_KEY        = 'dropi.identityV2.segmentoUsuario';
const STATUS_KEY          = 'dropi.identityV2.status';
const ESTADO_KYB_KEY      = 'dropi.identityV2.estadoKyb';
const EMAIL_BANEADO_KEY   = 'dropi.identityV2.emailEnListaNegra';
const REP_LEGAL_VALIDADO_KEY = 'dropi.identityV2.representanteLegalValidado';
const WEBHOOK_CONFIRMED_KEY  = 'dropi.identityV2.webhookConfirmed';
const MOTIVO_PENDIENTE_KEY   = 'dropi.identityV2.motivoPendiente';
const SALDO_NEGATIVO_FRAUDE_KEY = 'dropi.identityV2.saldoNegativoFraude';
const MARCA_BLANCA_KEY    = 'dropi.identityV2.marcaBlanca';
const FASE0_TIPO_USUARIO_KEY = 'dropi.identityV2.fase0TipoUsuario';
const TIENE_DATOS_ANTIGUOS_KEY = 'dropi.identityV2.tieneDatosFormularioAntiguo';
const RISK_SCORE_KEY      = 'dropi.identityV2.riskScore';
const LAST_VALIDATED_KEY  = 'dropi.identityV2.lastValidatedAt';

export type RiskScore = 'bajo' | 'medio' | 'alto';

@Injectable({ providedIn: 'root' })
export class IdentityDemoStateV2Service {
  private readonly _faseProyecto  = signal<FaseProyecto>(this.loadFaseProyecto());
  private readonly _momentoUsuario = signal<MomentoUsuario>(this.loadMomentoUsuario());
  private readonly _pais          = signal<Pais9>(this.loadPais());
  private readonly _tipoPersona   = signal<TipoPersonaV2>(this.loadTipoPersona());
  private readonly _segmentoUsuario = signal<SegmentoUsuario>(this.loadSegmentoUsuario());
  private readonly _status        = signal<IdentitySatelliteStatusV2>(this.loadStatus());
  private readonly _estadoKyb     = signal<EstadoKyb>(this.loadEstadoKyb());
  private readonly _emailEnListaNegra = signal<boolean>(this.loadEmailEnListaNegra());
  private readonly _representanteLegalValidado = signal<boolean>(this.loadRepLegalValidado());
  /** Fase 4 — "Caso Ecuador": el webhook de la autoridad fiscal debe confirmar antes de guardar cualquier dato fiscal. */
  private readonly _webhookConfirmed = signal<boolean>(this.loadWebhookConfirmed());
  /** Fase 0 — motivo del estado "pendiente" en Etapa Continua (blueprint: dos motivos distintos). */
  private readonly _motivoPendiente = signal<MotivoPendiente>(this.loadMotivoPendiente());
  /**
   * Fase 0 — segmento "saldo negativo / fraude" (blueprint Etapa 1). DISTINTO de
   * emailEnListaNegra (que es el ban cross-country RN-16/17): éste dispara el Modal
   * de Bloqueo full-screen al intentar Retiro o Envío.
   */
  private readonly _saldoNegativoFraude = signal<boolean>(this.loadSaldoNegativoFraude());
  /**
   * Fase 0 — Bloque D del blueprint (Marcas Blancas): estos usuarios no reciben
   * pop-ups automáticos de UserPilot. Soporte/Comercial envía el enlace de
   * Sumsub a mano por WhatsApp o Intercom durante la atención al cliente.
   */
  private readonly _marcaBlanca = signal<boolean>(this.loadMarcaBlanca());
  /**
   * Fase 0 — "Nuevos" (ETAPA 0, entra por primera vez al Home) vs "Activos"
   * (ETAPA 0.5). Eje propio del blueprint, distinto de `momentoUsuario`
   * (eje Fase 1-5): solo gatilla el Panel Lateral en Home — el Modal
   * Interceptor trata a ambos igual ante un clic financiero.
   */
  private readonly _fase0TipoUsuario = signal<Fase0TipoUsuario>(this.loadFase0TipoUsuario());
  /** Plan2.md Parte 8 — usuario antiguo con datos del formulario manual viejo (pre-Sumsub), nunca certificados. */
  private readonly _tieneDatosFormularioAntiguo = signal<boolean>(this.loadTieneDatosFormularioAntiguo());
  /** Plan2.md Parte 8 — datos capturados en el KYC (pasos 1-5 del modal), para precargar "Datos de facturación" en la vía "mis-datos". No persiste en sessionStorage: vive solo durante la sesión del modal/página, como el resto del flujo simulado. */
  private readonly _datosCapturadosKyc = signal<DatosCapturadosKyc | null>(null);
  /** RN-10: score de riesgo asignado en la primera validación — 'medio' dispara monitoreo periódico (5-C). */
  private readonly _riskScore = signal<RiskScore>(this.loadRiskScore());
  /** RN-11: fecha de la última validación aprobada, para el bloqueo de 6 meses del Dueño de cuenta (5-A). */
  private readonly _lastValidatedAt = signal<Date | null>(this.loadLastValidatedAt());

  readonly faseProyecto   = this._faseProyecto.asReadonly();
  readonly momentoUsuario = this._momentoUsuario.asReadonly();
  readonly pais           = this._pais.asReadonly();
  readonly tipoPersona    = this._tipoPersona.asReadonly();
  readonly segmentoUsuario = this._segmentoUsuario.asReadonly();
  readonly status         = this._status.asReadonly();
  readonly estadoKyb      = this._estadoKyb.asReadonly();
  readonly emailEnListaNegra = this._emailEnListaNegra.asReadonly();
  readonly representanteLegalValidado = this._representanteLegalValidado.asReadonly();
  readonly webhookConfirmed = this._webhookConfirmed.asReadonly();
  readonly motivoPendiente = this._motivoPendiente.asReadonly();
  readonly saldoNegativoFraude = this._saldoNegativoFraude.asReadonly();
  readonly marcaBlanca = this._marcaBlanca.asReadonly();
  readonly fase0TipoUsuario = this._fase0TipoUsuario.asReadonly();
  readonly tieneDatosFormularioAntiguo = this._tieneDatosFormularioAntiguo.asReadonly();
  readonly datosCapturadosKyc = this._datosCapturadosKyc.asReadonly();
  readonly riskScore = this._riskScore.asReadonly();
  readonly lastValidatedAt = this._lastValidatedAt.asReadonly();

  /** Banner pedagógico de migración (wiretext 4-A) — solo Fase 4+, Etapa legacy, segmento migrado. */
  readonly mostrarAvisoMigracion = computed(() =>
    this._faseProyecto() !== 'fase0' && this._faseProyecto() !== 'fase1' &&
    this._faseProyecto() !== 'fase2' && this._faseProyecto() !== 'fase3' &&
    this._momentoUsuario() === 'legacy' &&
    this._segmentoUsuario() === 'migrado-legacy' &&
    this._status() !== 'aprobado'
  );

  /** Mecanismo vigente para la celda Fase × Etapa actual — nunca N/A (línea 265). */
  readonly mecanismoVigente = computed<MecanismoVigente>(() =>
    MECANISMO_MATRIZ[this._faseProyecto()][this._momentoUsuario()]
  );

  readonly esCoNatural = computed(() => this._pais() === 'CO' && this._tipoPersona() === 'natural');

  /**
   * Motor de validación: Truora solo aparece con CO + Natural desde Fase 2
   * (línea 610); Sumsub se vuelve nativo para el resto recién en Fase 3
   * (línea 710). Antes de eso, todo cae al fallback manual de Fase 0/1.
   */
  readonly motorValidacion = computed<MotorValidacion>(() => {
    const fase = this._faseProyecto();
    if (fase === 'fase0' || fase === 'fase1') return 'manual-backoffice';
    if (fase === 'fase2') return this.esCoNatural() ? 'truora' : 'manual-backoffice';
    return this.esCoNatural() ? 'truora' : 'sumsub';
  });

  readonly isApproved = computed(() => this._status() === 'aprobado');

  /** RN-23: KYB fallido queda pj_pendiente, nunca degrada a persona natural. */
  readonly isPjPendiente = computed(() => this._estadoKyb() === 'pj_pendiente');

  /**
   * RN-11: el Dueño de cuenta no puede editar sus datos sensibles por 6 meses
   * desde su última validación aprobada (Plan2.md wiretext 5-A). `true`
   * significa "bloqueado" (todavía dentro de la ventana de 6 meses).
   */
  readonly duenoBloqueadoPorTiempo = computed(() => {
    if (this._status() !== 'aprobado') return false;
    const fecha = this._lastValidatedAt();
    if (!fecha) return false;
    const seisMesesMs = 1000 * 60 * 60 * 24 * 30 * 6;
    return Date.now() - fecha.getTime() < seisMesesMs;
  });

  setFaseProyecto(fase: FaseProyecto): void {
    this._faseProyecto.set(fase);
    sessionStorage.setItem(FASE_PROYECTO_KEY, fase);
  }

  setMomentoUsuario(momento: MomentoUsuario): void {
    this._momentoUsuario.set(momento);
    sessionStorage.setItem(MOMENTO_KEY, momento);
  }

  setPais(pais: Pais9): void {
    this._pais.set(pais);
    sessionStorage.setItem(PAIS_KEY, pais);
  }

  setTipoPersona(tipo: TipoPersonaV2): void {
    this._tipoPersona.set(tipo);
    sessionStorage.setItem(TIPO_PERSONA_KEY, tipo);
  }

  setSegmentoUsuario(segmento: SegmentoUsuario): void {
    this._segmentoUsuario.set(segmento);
    sessionStorage.setItem(SEGMENTO_KEY, segmento);
  }

  setStatus(status: IdentitySatelliteStatusV2): void {
    this._status.set(status);
    sessionStorage.setItem(STATUS_KEY, status);
  }

  setTieneDatosFormularioAntiguo(value: boolean): void {
    this._tieneDatosFormularioAntiguo.set(value);
    sessionStorage.setItem(TIENE_DATOS_ANTIGUOS_KEY, String(value));
  }

  setDatosCapturadosKyc(datos: DatosCapturadosKyc | null): void {
    this._datosCapturadosKyc.set(datos);
  }

  /** Setup Moment (Regla de Validación Nula): usuario nuevo → sin_validar; legacy con datos viejos sin certificar → parcial. */
  resetStatusParaSetup(): void {
    this.setStatus(this._tieneDatosFormularioAntiguo() ? 'parcial' : 'sin_validar');
  }

  setEstadoKyb(estado: EstadoKyb): void {
    this._estadoKyb.set(estado);
    sessionStorage.setItem(ESTADO_KYB_KEY, estado);
    // RN-23: si el KYB queda pj_pendiente, reflejarlo también en `status` para
    // que datos-facturacion/cuenta lean un solo estado consistente (antes
    // solo vivía en estadoKyb, separado — hallazgo de auditoría).
    if (estado === 'pj_pendiente') {
      this.setStatus('pj_pendiente');
    } else if (estado === 'aprobado' && this._status() === 'pj_pendiente') {
      this.setStatus('aprobado');
    }
  }

  setRiskScore(score: RiskScore): void {
    this._riskScore.set(score);
    sessionStorage.setItem(RISK_SCORE_KEY, score);
  }

  setLastValidatedAt(fecha: Date | null): void {
    this._lastValidatedAt.set(fecha);
    sessionStorage.setItem(LAST_VALIDATED_KEY, fecha ? fecha.toISOString() : '');
  }

  /** Helper de demo: fija la última validación a N meses atrás desde hoy (stepper del demo-panel). */
  setMesesDesdeUltimaValidacion(meses: number): void {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - meses);
    this.setLastValidatedAt(fecha);
  }

  setEmailEnListaNegra(value: boolean): void {
    this._emailEnListaNegra.set(value);
    sessionStorage.setItem(EMAIL_BANEADO_KEY, String(value));
  }

  setRepresentanteLegalValidado(value: boolean): void {
    this._representanteLegalValidado.set(value);
    sessionStorage.setItem(REP_LEGAL_VALIDADO_KEY, String(value));
  }

  setWebhookConfirmed(value: boolean): void {
    this._webhookConfirmed.set(value);
    sessionStorage.setItem(WEBHOOK_CONFIRMED_KEY, String(value));
  }

  setMotivoPendiente(motivo: MotivoPendiente): void {
    this._motivoPendiente.set(motivo);
    if (motivo === null) {
      sessionStorage.removeItem(MOTIVO_PENDIENTE_KEY);
    } else {
      sessionStorage.setItem(MOTIVO_PENDIENTE_KEY, motivo);
    }
  }

  setSaldoNegativoFraude(value: boolean): void {
    this._saldoNegativoFraude.set(value);
    sessionStorage.setItem(SALDO_NEGATIVO_FRAUDE_KEY, String(value));
  }

  setMarcaBlanca(value: boolean): void {
    this._marcaBlanca.set(value);
    sessionStorage.setItem(MARCA_BLANCA_KEY, String(value));
  }

  setFase0TipoUsuario(value: Fase0TipoUsuario): void {
    this._fase0TipoUsuario.set(value);
    sessionStorage.setItem(FASE0_TIPO_USUARIO_KEY, value);
  }

  private loadFaseProyecto(): FaseProyecto {
    const v = sessionStorage.getItem(FASE_PROYECTO_KEY);
    return (FASES_PROYECTO as string[]).includes(v ?? '') ? (v as FaseProyecto) : 'fase0';
  }

  private loadMomentoUsuario(): MomentoUsuario {
    const v = sessionStorage.getItem(MOMENTO_KEY);
    return (MOMENTOS_USUARIO as string[]).includes(v ?? '') ? (v as MomentoUsuario) : 'setup';
  }

  private loadPais(): Pais9 {
    const v = sessionStorage.getItem(PAIS_KEY);
    return (PAISES_9 as string[]).includes(v ?? '') ? (v as Pais9) : 'CO';
  }

  private loadTipoPersona(): TipoPersonaV2 {
    const v = sessionStorage.getItem(TIPO_PERSONA_KEY);
    if (v === 'natural' || v === 'juridica' || v === 'extranjera') return v;
    return 'natural';
  }

  private loadSegmentoUsuario(): SegmentoUsuario {
    const v = sessionStorage.getItem(SEGMENTO_KEY);
    const valid: SegmentoUsuario[] = ['dropshipper-natural', 'proveedor-juridica', 'baneado-cross-country', 'migrado-legacy'];
    return valid.includes(v as SegmentoUsuario) ? (v as SegmentoUsuario) : 'dropshipper-natural';
  }

  private loadStatus(): IdentitySatelliteStatusV2 {
    const v = sessionStorage.getItem(STATUS_KEY);
    if (v === 'sin_validar' || v === 'parcial' || v === 'pendiente' || v === 'en_revision' || v === 'rechazado' || v === 'aprobado' || v === 'pj_pendiente') return v;
    return 'sin_validar';
  }

  private loadTieneDatosFormularioAntiguo(): boolean {
    return sessionStorage.getItem(TIENE_DATOS_ANTIGUOS_KEY) === 'true';
  }

  private loadEstadoKyb(): EstadoKyb {
    const v = sessionStorage.getItem(ESTADO_KYB_KEY);
    const valid: EstadoKyb[] = ['no_iniciado', 'en_progreso', 'aprobado', 'pj_pendiente', 'rechazado'];
    return valid.includes(v as EstadoKyb) ? (v as EstadoKyb) : 'no_iniciado';
  }

  private loadEmailEnListaNegra(): boolean {
    return sessionStorage.getItem(EMAIL_BANEADO_KEY) === 'true';
  }

  private loadRepLegalValidado(): boolean {
    return sessionStorage.getItem(REP_LEGAL_VALIDADO_KEY) === 'true';
  }

  private loadWebhookConfirmed(): boolean {
    const v = sessionStorage.getItem(WEBHOOK_CONFIRMED_KEY);
    return v === null ? true : v === 'true';
  }

  private loadMotivoPendiente(): MotivoPendiente {
    const v = sessionStorage.getItem(MOTIVO_PENDIENTE_KEY);
    return v === 'revision-financiero' || v === 'incompleta' ? v : null;
  }

  private loadSaldoNegativoFraude(): boolean {
    return sessionStorage.getItem(SALDO_NEGATIVO_FRAUDE_KEY) === 'true';
  }

  private loadMarcaBlanca(): boolean {
    return sessionStorage.getItem(MARCA_BLANCA_KEY) === 'true';
  }

  private loadFase0TipoUsuario(): Fase0TipoUsuario {
    const v = sessionStorage.getItem(FASE0_TIPO_USUARIO_KEY);
    return v === 'activo' ? 'activo' : 'nuevo';
  }

  private loadRiskScore(): RiskScore {
    const v = sessionStorage.getItem(RISK_SCORE_KEY);
    return v === 'bajo' || v === 'medio' || v === 'alto' ? v : 'bajo';
  }

  private loadLastValidatedAt(): Date | null {
    const v = sessionStorage.getItem(LAST_VALIDATED_KEY);
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }
}
