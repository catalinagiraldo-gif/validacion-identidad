import { Injectable, inject, signal } from '@angular/core';
import { IdentityDemoStateV2Service } from './identity-demo-state-v2.service';
import { OrigenModal } from './identity-modal.service';
import { Fase0ResultKind, Fase0CrmKind } from '../models/identity-flow-v2.models';

// Orquestador de los overlays de Fase 0 (Service Blueprint Fase 0,
// docs/validacion/Service_Blueprint_Diagrama Fase 0.md). Proceso 100% NO-CODE:
// Panel Lateral (Etapa 0) · Modal Interceptor recurrente (Etapa 0.5) · Modal de
// Bloqueo full-screen (Etapa 1) · 4 modales de resultado (Etapa Continua) · CRM
// simulado (burbuja WhatsApp). TODO condicionado a faseProyecto()==='fase0';
// en fase1+ tryIntercept() no hace nada y el llamador conserva su flujo heredado.

/** Copys CRM TEXTUALES al blueprint (Etapa 0 y Etapa Continua, front stage → CRM). */
const CRM_COPY: Record<Fase0CrmKind, string> = {
  recordatorio:
    'Hola 👋 Notamos que aún no verificas tu cuenta en Dropi. Lo necesitamos para confirmar quién eres y mantener la plataforma segura — no toma más de unos minutos.',
  aprobado:
    'Hola 👋 ¡tu cuenta en Dropi ya está verificada! Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard sin restricciones. Aprovecha y sigue haciendo crecer tu negocio 🚀',
  'revision-financiero':
    'Hola 👋 tu verificación en Dropi sigue en proceso — puede tardar hasta 72 horas hábiles. Te avisaremos apenas esté lista, no necesitas hacer nada más. ¿Dudas? Escríbenos.',
  incompleta:
    'Hola 👋 empezaste tu verificación en Dropi pero no la terminaste. Complétala para seguir operando sin restricciones: [link a Sumsub].',
};

export interface Fase0CrmMessage {
  kind: Fase0CrmKind;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class IdentityFase0Service {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);

  // --- Etapa 0.5: Modal Interceptor recurrente ---
  private readonly _interceptorOpen = signal(false);
  private readonly _interceptorOrigen = signal<OrigenModal>('home');
  private readonly _redirecting = signal(false);
  readonly interceptorOpen = this._interceptorOpen.asReadonly();
  readonly interceptorOrigen = this._interceptorOrigen.asReadonly();
  readonly redirecting = this._redirecting.asReadonly();

  // --- Etapa 1: Modal de Bloqueo full-screen ---
  private readonly _blockOpen = signal(false);
  readonly blockOpen = this._blockOpen.asReadonly();

  // --- Etapa Continua: 4 modales de resultado ---
  private readonly _activeResult = signal<Fase0ResultKind | null>(null);
  readonly activeResult = this._activeResult.asReadonly();

  // --- CRM (burbuja WhatsApp) ---
  private readonly _crmMessage = signal<Fase0CrmMessage | null>(null);
  readonly crmMessage = this._crmMessage.asReadonly();

  private redirectTimer: ReturnType<typeof setTimeout> | null = null;
  private resultTimer: ReturnType<typeof setTimeout> | null = null;
  private crmTimer: ReturnType<typeof setTimeout> | null = null;

  // ---------------------------------------------------------------------------
  // Etapa 0.5 — Interceptor
  // ---------------------------------------------------------------------------
  openInterceptor(origen: OrigenModal): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    this._interceptorOrigen.set(origen);
    this._redirecting.set(false);
    this._interceptorOpen.set(true);
  }

  /**
   * "Continuar a verificación": redirección automática a Sumsub. El interceptor es
   * un overlay sobre la página actual; cerrarlo tras la transición ES "volver a la
   * página de origen" (blueprint Etapa 0.5, "Auto-cierre y redirección automática").
   */
  continueToSumsub(): void {
    this._redirecting.set(true);
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
    this.redirectTimer = setTimeout(() => {
      this._redirecting.set(false);
      this._interceptorOpen.set(false);
      this.redirectTimer = null;
    }, 1400);
  }

  closeInterceptor(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    this._redirecting.set(false);
    this._interceptorOpen.set(false);
  }

  // ---------------------------------------------------------------------------
  // Etapa 1 — Bloqueo full-screen
  // ---------------------------------------------------------------------------
  openBlock(): void {
    this._blockOpen.set(true);
  }

  /** En producto el bloqueo es persistente; closeBlock() solo lo usa el demo-panel para resetear. */
  closeBlock(): void {
    this._blockOpen.set(false);
  }

  // ---------------------------------------------------------------------------
  // Etapa Continua — 4 modales de resultado
  // ---------------------------------------------------------------------------
  showResult(kind: Fase0ResultKind): void {
    if (this.resultTimer) {
      clearTimeout(this.resultTimer);
      this.resultTimer = null;
    }
    this._activeResult.set(kind);
    if (kind === 'aprobado') {
      // Blueprint: el modal "¡Cuenta verificada!" desaparece solo a los 4-5 segundos.
      this.resultTimer = setTimeout(() => {
        this.dismissResult();
        this.resultTimer = null;
      }, 4500);
    }
  }

  dismissResult(): void {
    if (this.resultTimer) {
      clearTimeout(this.resultTimer);
      this.resultTimer = null;
    }
    this._activeResult.set(null);
  }

  // ---------------------------------------------------------------------------
  // CRM — burbuja WhatsApp con copy textual del blueprint
  // ---------------------------------------------------------------------------
  showCrmMessage(kind: Fase0CrmKind): void {
    if (this.crmTimer) {
      clearTimeout(this.crmTimer);
      this.crmTimer = null;
    }
    this._crmMessage.set({ kind, text: CRM_COPY[kind] });
    this.crmTimer = setTimeout(() => {
      this.dismissCrm();
      this.crmTimer = null;
    }, 6000);
  }

  dismissCrm(): void {
    if (this.crmTimer) {
      clearTimeout(this.crmTimer);
      this.crmTimer = null;
    }
    this._crmMessage.set(null);
  }

  // ---------------------------------------------------------------------------
  // Guard de triggers financieros
  // ---------------------------------------------------------------------------
  /**
   * Devuelve true si el overlay de Fase 0 tomó control del clic (el llamador debe
   * hacer `return` sin ejecutar su flujo heredado). Devuelve false en fase1+, donde
   * el llamador ejecuta el modal Sumsub heredado como siempre.
   */
  tryIntercept(origen: OrigenModal, esRetiroOEnvio: boolean): boolean {
    if (this.stateV2.faseProyecto() !== 'fase0') return false;
    // Etapa 1: saldo negativo/fraude + intento de Retiro o Envío → bloqueo full-screen.
    if (this.stateV2.saldoNegativoFraude() && esRetiroOEnvio) {
      this.openBlock();
      return true;
    }
    // Etapa 0.5: interceptor recurrente.
    this.openInterceptor(origen);
    return true;
  }
}
