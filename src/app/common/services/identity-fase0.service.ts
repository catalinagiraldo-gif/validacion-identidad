import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IdentityDemoStateV2Service } from './identity-demo-state-v2.service';
import { OrigenModal } from './identity-modal.service';
import {
  Fase0ResultKind,
  Fase0CrmKind,
  Fase0Etapa,
  Fase0ProgresoSumsub,
  Fase0SumsubBloque,
  Fase0Evento,
  Fase0EventoTag,
  Fase0BlockMotivo,
  resolverBloqueSumsub,
} from '../models/identity-flow-v2.models';

/** Casos visuales del blueprint que el switcher puede abrir con un clic (demo). */
export type Fase0VistaCaso =
  | 'panel'
  | 'interceptor'
  | 'interceptor-bancario'
  | 'sumsub'
  | 'resultado-aprobado'
  | 'resultado-revision'
  | 'resultado-incompleta'
  | 'resultado-rechazado'
  | 'bloqueo-fraude'
  | 'bloqueo-rechazado'
  | 'crm-recordatorio'
  | 'crm-aprobado'
  | 'crm-revision'
  | 'crm-incompleta'
  | 'crm-marca-blanca';

// Orquestador de los overlays de Fase 0 (Service Blueprint Fase 0,
// docs/validacion/Service_Blueprint_Diagrama Fase 0.md). Proceso 100% NO-CODE:
// Panel Lateral (Etapa 0) · Modal Interceptor recurrente (Etapa 0.5) · Sumsub
// stand-in full-screen (fuera de Dropi) · Modal de Bloqueo full-screen
// (Etapa 1) · 4 modales de resultado (Etapa Continua) · CRM simulado (burbuja
// WhatsApp). TODO condicionado a faseProyecto()==='fase0'; en fase1+
// tryIntercept() no hace nada y el llamador conserva su flujo heredado.
//
// Fuente única de verdad del progreso del usuario en Sumsub: `stateV2.status`
// + `stateV2.motivoPendiente` (nunca un segundo store paralelo) — `progreso`
// abajo es un `computed` de ambos, ver Fase0ProgresoSumsub.

/** Copys CRM TEXTUALES al blueprint (Etapa 0 y Etapa Continua, front stage → CRM). */
const CRM_COPY: Record<Fase0CrmKind, string> = {
  recordatorio:
    'Hola 👋 Aún falta validar tu identidad en Dropi (documento + selfie, unos minutos). Lo pedimos para confirmar quién eres y completar tu perfil. Entra a tu panel y pulsa «Verificar ahora».',
  aprobado:
    'Hola 👋 ¡tu cuenta en Dropi ya está verificada! Ya puedes transferir tu wallet, registrar tus datos bancarios y pedir tu DropiCard sin restricciones. Aprovecha y sigue haciendo crecer tu negocio 🚀',
  'revision-financiero':
    'Hola 👋 tu verificación en Dropi sigue en proceso — según la cola de revisión, puede tomar hasta 72 horas hábiles. Te avisaremos apenas esté lista, no necesitas hacer nada más. ¿Dudas? Escríbenos.',
  incompleta:
    'Hola 👋 empezaste tu verificación en Dropi pero no la terminaste. Complétala para seguir operando sin restricciones: [link a Sumsub].',
  'marca-blanca':
    'Hola 👋 aquí tienes el enlace para verificar tu identidad en Dropi: [link a Sumsub]. Cualquier duda, escríbenos por este mismo canal — nuestro equipo te acompaña en el proceso.',
};

export interface Fase0CrmMessage {
  kind: Fase0CrmKind;
  text: string;
}

/** Etiqueta legible del origen del clic, para el log de eventos. */
const ORIGEN_LABEL: Record<OrigenModal, string> = {
  pedidos: 'Pedidos',
  home: 'Home',
  wallet: 'Transferir Wallet',
  retiro: 'Retiro',
  dropicard: 'Solicitud DropiCard',
  facturacion: 'Datos de Facturación',
  cuenta: 'Información de Cuenta',
};

let eventoIdSeq = 0;

/** Título corto de cada modal de Etapa Continua, solo para el log de eventos. */
const RESULT_KIND_LABEL: Record<Fase0ResultKind, string> = {
  aprobado: '¡Cuenta verificada!',
  'revision-financiero': 'En revisión de Financiero',
  incompleta: 'Verificación incompleta',
  rechazado: 'Verificación rechazada',
};

@Injectable({ providedIn: 'root' })
export class IdentityFase0Service {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);
  private readonly router = inject(Router);

  // --- Recorrido guiado (stepper de Modo Prototipo 0) ---
  private readonly _etapa = signal<Fase0Etapa>('etapa0');
  readonly etapa = this._etapa.asReadonly();

  // --- Etapa 0: Panel Lateral — vive aquí (no en el componente) para que el
  // switcher de estados pueda re-mostrarlo al volver a "Nunca inició Sumsub".
  private readonly _panelDismissed = signal(false);
  readonly panelDismissed = this._panelDismissed.asReadonly();

  dismissPanel(): void {
    this._panelDismissed.set(true);
  }

  // --- Etapa 0.5: Modal Interceptor recurrente ---
  private readonly _interceptorOpen = signal(false);
  private readonly _interceptorOrigen = signal<OrigenModal>('home');
  private readonly _redirecting = signal(false);
  readonly interceptorOpen = this._interceptorOpen.asReadonly();
  readonly interceptorOrigen = this._interceptorOrigen.asReadonly();
  readonly redirecting = this._redirecting.asReadonly();

  // --- Sumsub stand-in (fuera de Dropi) ---
  private readonly _sumsubOpen = signal(false);
  readonly sumsubOpen = this._sumsubOpen.asReadonly();

  // --- Etapa 1: Modal de Bloqueo full-screen ---
  private readonly _blockOpen = signal(false);
  readonly blockOpen = this._blockOpen.asReadonly();
  /** 'fraude' (saldo negativo/retiro-envío) o 'rechazado' (expulsión tras Sumsub) — mismo componente, dos copys reales del blueprint. */
  private readonly _blockMotivo = signal<Fase0BlockMotivo>('fraude');
  readonly blockMotivo = this._blockMotivo.asReadonly();

  // --- Etapa Continua: 4 modales de resultado ---
  private readonly _activeResult = signal<Fase0ResultKind | null>(null);
  readonly activeResult = this._activeResult.asReadonly();

  // --- CRM (burbuja WhatsApp) ---
  private readonly _crmMessage = signal<Fase0CrmMessage | null>(null);
  readonly crmMessage = this._crmMessage.asReadonly();

  // --- Log de eventos: hace visible "cada interacción del blueprint" en tiempo real ---
  private readonly _eventos = signal<Fase0Evento[]>([]);
  readonly eventos = this._eventos.asReadonly();
  private static readonly MAX_EVENTOS = 10;

  private redirectTimer: ReturnType<typeof setTimeout> | null = null;
  private resultTimer: ReturnType<typeof setTimeout> | null = null;
  private crmTimer: ReturnType<typeof setTimeout> | null = null;

  /** Registra un evento en el log visible (más reciente primero, tope de MAX_EVENTOS). */
  private registrarEvento(tag: Fase0EventoTag, texto: string): void {
    const evento: Fase0Evento = { id: ++eventoIdSeq, tag, texto, ts: Date.now() };
    this._eventos.update((lista) => [evento, ...lista].slice(0, IdentityFase0Service.MAX_EVENTOS));
  }

  /** Limpia el log de eventos — solo lo usa el demo-panel/switcher para resetear la demo. */
  limpiarEventos(): void {
    this._eventos.set([]);
  }

  /**
   * Progreso real del usuario en Sumsub — derivado de `stateV2.status` +
   * `motivoPendiente`, nunca una segunda fuente de verdad (blueprint Etapa
   * Continua). 'en_revision' (usado por fase1+) se trata como equivalente a
   * "completa, esperando Financiero" si un stakeholder lo deja así por error.
   */
  readonly progreso = computed<Fase0ProgresoSumsub>(() => {
    const status = this.stateV2.status();
    if (status === 'aprobado') return 'aprobado';
    if (status === 'rechazado') return 'rechazado';
    if (status === 'en_revision') return 'pendiente-financiero';
    if (status === 'pendiente') {
      return this.stateV2.motivoPendiente() === 'incompleta' ? 'incompleta' : 'pendiente-financiero';
    }
    return 'nunca'; // sin_validar, parcial, pj_pendiente: sin caso Sumsub todavía.
  });

  /** Bloque de formulario Sumsub vigente (A-E), según país + marca blanca (blueprint Back stage → DOC ENLACES). */
  readonly sumsubBloque = computed<Fase0SumsubBloque>(() =>
    resolverBloqueSumsub(this.stateV2.pais(), this.stateV2.marcaBlanca())
  );

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
    this._etapa.set('etapa05');
    this.registrarEvento(
      'userpilot',
      `UserPilot intercepta el clic en "${ORIGEN_LABEL[origen]}" → Modal Interceptor (Etapa 0.5).`
    );
  }

  /**
   * "Continuar a verificación": redirección automática a Sumsub. El
   * interceptor se cierra y el stand-in de Sumsub full-screen toma el control
   * (blueprint Etapa 0.5, "Auto-cierre y redirección automática" → Etapa 1
   * del diagrama = "salir de Dropi").
   */
  continueToSumsub(): void {
    this._redirecting.set(true);
    this.registrarEvento('redirect', 'Auto-cierre y redirección automática a Sumsub (el usuario sale de Dropi).');
    if (this.redirectTimer) clearTimeout(this.redirectTimer);
    this.redirectTimer = setTimeout(() => {
      this._redirecting.set(false);
      this._interceptorOpen.set(false);
      this.redirectTimer = null;
      this._sumsubOpen.set(true);
      this._etapa.set('en-sumsub');
      this.registrarEvento('backstage', `Formulario Sumsub cargado — Bloque ${this.sumsubBloque()} (${this.stateV2.pais()}).`);
    }, 1400);
  }

  closeInterceptor(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    const estabaAbierto = this._interceptorOpen();
    this._redirecting.set(false);
    this._interceptorOpen.set(false);
    if (estabaAbierto) {
      this.registrarEvento(
        'userpilot',
        'Usuario cierra el Modal Interceptor (prototipo: se puede cerrar; en producto UserPilot reaparecería al reintentar la acción).'
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Sumsub stand-in — "salió de Dropi"
  // ---------------------------------------------------------------------------
  /** Abre el stand-in directamente (sin pasar por el interceptor) — usado por "Continuar verificación" desde Etapa Continua y por el stepper del demo-panel. */
  openSumsubStandin(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    this._redirecting.set(false);
    this._interceptorOpen.set(false);
    this._sumsubOpen.set(true);
    this._etapa.set('en-sumsub');
    this.registrarEvento('redirect', 'El usuario sale de Dropi y entra a Sumsub.');
    this.registrarEvento('backstage', `Formulario Sumsub cargado — Bloque ${this.sumsubBloque()} (${this.stateV2.pais()}).`);
  }

  /** El usuario abandona el stand-in sin elegir un resultado explícito → equivale a "Incompleto en Sumsub" (blueprint: el proceso queda a medias). */
  abandonSumsubStandin(): void {
    this.resolverSumsub('incompleta');
  }

  // ---------------------------------------------------------------------------
  // Etapa 1 — Bloqueo full-screen
  // ---------------------------------------------------------------------------
  openBlock(motivo: Fase0BlockMotivo = 'fraude'): void {
    this._blockMotivo.set(motivo);
    this._blockOpen.set(true);
    this._etapa.set('bloqueado');
    this.registrarEvento(
      'backstage',
      motivo === 'rechazado'
        ? 'Rechazado en Sumsub → expulsión (Etapa 1): Freno Seco persistente, sin salida manual.'
        : 'Cartera detecta saldo negativo o alerta de fraude → Freno Seco (bloqueo de pantalla completa, sin salida manual).'
    );
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
    this._etapa.set('continua');
    this.registrarEvento('userpilot', `Etapa Continua → modal "${RESULT_KIND_LABEL[kind]}".`);
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

  /**
   * Orquestador único de "qué significa cada resultado de Sumsub": fija el
   * estado real (stateV2), cierra el stand-in, muestra el modal de Etapa
   * Continua y dispara el CRM correspondiente. Punto de entrada compartido
   * por el stand-in de Sumsub (salida real del flujo) y los chips "RESULTADO
   * FASE 0" del demo-panel (forzado manual) — una sola fuente de verdad.
   */
  resolverSumsub(kind: Fase0ResultKind): void {
    switch (kind) {
      case 'aprobado':
        this.stateV2.setStatus('aprobado');
        this.stateV2.setMotivoPendiente(null);
        this.registrarEvento('backstage', 'Legal aprueba en Sumsub y actualiza el Sheet → Admin apaga el pop-up de UserPilot.');
        break;
      case 'revision-financiero':
        this.stateV2.setStatus('pendiente');
        this.stateV2.setMotivoPendiente('revision-financiero');
        this.registrarEvento('backstage', 'Sumsub queda "Completa" → pasa a revisión de Financiero (hasta 72h hábiles).');
        break;
      case 'incompleta':
        this.stateV2.setStatus('pendiente');
        this.stateV2.setMotivoPendiente('incompleta');
        this.registrarEvento('backstage', 'El usuario abandona Sumsub sin terminar el formulario → queda "Incompleta".');
        break;
      case 'rechazado':
        this.stateV2.setStatus('rechazado');
        this.stateV2.setMotivoPendiente(null);
        this.registrarEvento('backstage', 'Legal rechaza en Sumsub → el usuario queda expulsado (Etapa 1, sin CRM propio).');
        break;
    }
    this._sumsubOpen.set(false);
    this.showResult(kind);
    // Blueprint: Rechazado no tiene CRM propio — pasa directo a expulsión (Etapa 1).
    if (kind !== 'rechazado') {
      const crmKind: Fase0CrmKind = kind === 'revision-financiero' ? 'revision-financiero' : kind === 'incompleta' ? 'incompleta' : 'aprobado';
      this.showCrmMessage(crmKind);
    }
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
    this.registrarEvento('crm', `CRM envía mensaje de WhatsApp: "${CRM_COPY[kind].slice(0, 60)}…"`);
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

  /**
   * CTA de banners suaves (Panel Home, identity-gate, cuenta/facturación):
   * invita a verificar sin pasar por el Modal Interceptor de Etapa 0.5.
   * TyC se aceptan dentro de Sumsub. Devuelve true si Fase 0 manejó el clic.
   */
  invitarDesdeBanner(origen: OrigenModal = 'home'): boolean {
    if (this.stateV2.faseProyecto() !== 'fase0') return false;

    if (this.stateV2.marcaBlanca()) {
      this.registrarEvento('backstage', 'Bloque D (marca blanca): banner invita → enlace manual de Soporte.');
      this.showCrmMessage('marca-blanca');
      return true;
    }

    const progreso = this.progreso();
    if (progreso === 'aprobado') return false;

    this.registrarEvento(
      'userpilot',
      `Banner/invite "${ORIGEN_LABEL[origen]}" → directo a verificación (sin interceptor intermedio).`
    );

    if (progreso === 'pendiente-financiero') {
      this.showResult('revision-financiero');
      return true;
    }

    // nunca | incompleta | rechazado (reintento desde banner suave) → Sumsub.
    this.dismissPanel();
    this.openSumsubStandin();
    return true;
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

    this.registrarEvento('backstage', `Clic en "${ORIGEN_LABEL[origen]}" capturado (tipo de usuario: ${this.stateV2.fase0TipoUsuario()}, progreso Sumsub: "${this.progreso()}").`);

    // Etapa 1: saldo negativo/fraude + intento de Retiro o Envío → bloqueo full-screen.
    if (this.stateV2.saldoNegativoFraude() && esRetiroOEnvio) {
      this.openBlock('fraude');
      return true;
    }

    // Bloque D (Marcas Blancas): blueprint es explícito — estos usuarios NO
    // reciben pop-ups automáticos de UserPilot. Soporte/Comercial envía el
    // enlace a mano; el demo deja pasar el clic y solo simula ese aviso manual.
    if (this.stateV2.marcaBlanca()) {
      this.registrarEvento('backstage', 'Bloque D (marca blanca): sin pop-up de UserPilot — Soporte/Comercial comparte el enlace a mano.');
      this.showCrmMessage('marca-blanca');
      return false;
    }

    const progreso = this.progreso();
    if (progreso === 'aprobado') return false; // Ya verificado: el flujo sigue su curso normal.
    if (progreso === 'incompleta') {
      // "Continuar verificación" → directo a Sumsub (sin modal intermedio de incompleta).
      this.openSumsubStandin();
      return true;
    }
    if (progreso === 'pendiente-financiero') {
      this.showResult('revision-financiero');
      return true;
    }
    if (progreso === 'rechazado') {
      // La notificación "No pudimos verificar tu identidad" ya se mostró una
      // vez al salir de Sumsub (resolverSumsub). Blueprint: "luego expulsión
      // (ver Etapa 1)" — cualquier intento posterior escala directo al
      // bloqueo persistente, no vuelve a mostrar el modal ligero con botón.
      this.openBlock('rechazado');
      return true;
    }

    // Corrección tras releer el blueprint (Etapa 0.5 → "Usuarios" y "Tarea"
    // paso 2): "Datos de Facturación" e "Información de Cuenta" SÍ están en
    // la lista de los 6 triggers estándar → Modal UserPilot, "mismo trato"
    // que Transferir Wallet/Recargar/DropiCard — "editar exige verificarse
    // primero" ES ese gate, no una excepción a él. La única bifurcación real
    // es GT/PA en "Registro de Datos Bancarios" (modal nativo, no UserPilot),
    // ya resuelta dentro de `openInterceptor` vía `esVarianteBancariaGtPa`.

    // Nunca inició: Etapa 0.5, interceptor recurrente.
    this.openInterceptor(origen);
    return true;
  }

  // ---------------------------------------------------------------------------
  // Reproducir etapa — stepper de Modo Prototipo 0 (demo-panel)
  // ---------------------------------------------------------------------------
  /** Convierte el progreso vigente en el resultado que debería mostrar Etapa Continua (o null si nunca se jugó nada todavía). */
  private progresoToResultKind(progreso: Fase0ProgresoSumsub): Fase0ResultKind | null {
    switch (progreso) {
      case 'aprobado': return 'aprobado';
      case 'rechazado': return 'rechazado';
      case 'pendiente-financiero': return 'revision-financiero';
      case 'incompleta': return 'incompleta';
      default: return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Switcher de estados — escape hatch de la demo, siempre alcanzable aunque
  // haya un overlay full-screen abierto encima (Etapa 1 bloqueado, Sumsub
  // stand-in, resultado con CTA). Sin esto, un stakeholder que cae en
  // "Bloqueado" o "Incompleta" queda atrapado viendo un solo estado porque el
  // panel de demo queda tapado por el overlay (z-index).
  // ---------------------------------------------------------------------------

  /** Oculta cualquier overlay de Fase 0 sin tocar el estado de negocio (stateV2) — puramente visual, para poder saltar de un estado a otro limpio. */
  private ocultarOverlaysActivos(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    this._redirecting.set(false);
    this._interceptorOpen.set(false);
    this._sumsubOpen.set(false);
    this._blockOpen.set(false);
    if (this.resultTimer) {
      clearTimeout(this.resultTimer);
      this.resultTimer = null;
    }
    this._activeResult.set(null);
  }

  /** Cierra el overlay que esté encima en este momento, sin cambiar el estado de validación — para "solo quiero ver la página de atrás". No cierra el bloqueo (ver `quitarBloqueo`), fiel al blueprint. */
  cerrarOverlayActual(): void {
    if (this.redirectTimer) {
      clearTimeout(this.redirectTimer);
      this.redirectTimer = null;
    }
    this._redirecting.set(false);
    this._interceptorOpen.set(false);
    this._sumsubOpen.set(false);
    if (this.resultTimer) {
      clearTimeout(this.resultTimer);
      this.resultTimer = null;
    }
    this._activeResult.set(null);
  }

  /** Salta directo a cualquier estado de progreso Sumsub, para comparar los distintos resultados sin tener que reproducir todo el recorrido. */
  forzarProgreso(progreso: Fase0ProgresoSumsub): void {
    this.ocultarOverlaysActivos();
    this.stateV2.setSaldoNegativoFraude(false);
    if (progreso === 'nunca') {
      this.stateV2.setStatus('sin_validar');
      this.stateV2.setMotivoPendiente(null);
      this._etapa.set('etapa0');
      this._panelDismissed.set(false);
      this.registrarEvento('backstage', 'Demo: progreso reseteado a "Nunca inició Sumsub" — Panel Lateral vuelve a mostrarse en Home.');
      return;
    }
    const kind = this.progresoToResultKind(progreso);
    if (kind) this.resolverSumsub(kind);
  }

  /**
   * Abre un caso visual del blueprint con un clic (switcher / demo).
   * Prepara el estado mínimo necesario para que el overlay/CRM se vea con el
   * copy correcto — sin obligar a recorrer todo el flujo.
   */
  mostrarVistaCaso(caso: Fase0VistaCaso): void {
    switch (caso) {
      case 'panel':
        this.ocultarOverlaysActivos();
        this.dismissCrm();
        this.stateV2.setSaldoNegativoFraude(false);
        this.stateV2.setMarcaBlanca(false);
        this.stateV2.setFase0TipoUsuario('activo');
        this.stateV2.setStatus('sin_validar');
        this.stateV2.setMotivoPendiente(null);
        this._panelDismissed.set(false);
        this._etapa.set('etapa0');
        this.registrarEvento('userpilot', 'Demo: Panel Lateral Etapa 0 — "Verifica tu cuenta".');
        void this.router.navigate(['/new/home']);
        break;

      case 'interceptor':
        this.ocultarOverlaysActivos();
        this.dismissCrm();
        this.stateV2.setSaldoNegativoFraude(false);
        this.stateV2.setMarcaBlanca(false);
        this.stateV2.setStatus('sin_validar');
        this.stateV2.setMotivoPendiente(null);
        this.openInterceptor('wallet');
        break;

      case 'interceptor-bancario':
        this.ocultarOverlaysActivos();
        this.dismissCrm();
        this.stateV2.setSaldoNegativoFraude(false);
        this.stateV2.setMarcaBlanca(false);
        this.stateV2.setStatus('sin_validar');
        this.stateV2.setMotivoPendiente(null);
        this.stateV2.setPais('GT');
        // Origen "cuenta" + país GT → variante titular de cuenta (proxy GT/PA del prototipo).
        this.openInterceptor('cuenta');
        this.registrarEvento('userpilot', 'Demo: variante GT/PA — modal exclusivo Datos Bancarios (titular).');
        break;

      case 'sumsub':
        this.ocultarOverlaysActivos();
        this.dismissCrm();
        this.openSumsubStandin();
        break;

      case 'resultado-aprobado':
        this.ocultarOverlaysActivos();
        this.resolverSumsub('aprobado');
        break;

      case 'resultado-revision':
        this.ocultarOverlaysActivos();
        this.resolverSumsub('revision-financiero');
        break;

      case 'resultado-incompleta':
        this.ocultarOverlaysActivos();
        this.resolverSumsub('incompleta');
        break;

      case 'resultado-rechazado':
        this.ocultarOverlaysActivos();
        this.resolverSumsub('rechazado');
        break;

      case 'bloqueo-fraude':
        this.forzarBloqueo('fraude');
        break;

      case 'bloqueo-rechazado':
        this.forzarBloqueo('rechazado');
        break;

      case 'crm-recordatorio':
        this.showCrmMessage('recordatorio');
        break;

      case 'crm-aprobado':
        this.showCrmMessage('aprobado');
        break;

      case 'crm-revision':
        this.showCrmMessage('revision-financiero');
        break;

      case 'crm-incompleta':
        this.showCrmMessage('incompleta');
        break;

      case 'crm-marca-blanca':
        this.showCrmMessage('marca-blanca');
        break;
    }
  }

  /** Fuerza la Etapa 1 (bloqueo full-screen) sin necesidad de pasar por un Retiro/Envío real. */
  forzarBloqueo(motivo: Fase0BlockMotivo = 'fraude'): void {
    this.ocultarOverlaysActivos();
    if (motivo === 'fraude') this.stateV2.setSaldoNegativoFraude(true);
    if (motivo === 'rechazado') {
      this.stateV2.setStatus('rechazado');
      this.stateV2.setMotivoPendiente(null);
    }
    this.openBlock(motivo);
  }

  /** Quita el bloqueo — solo existe para la demo; en producto el Freno Seco no tiene salida manual. */
  quitarBloqueo(): void {
    if (this._blockMotivo() === 'rechazado') {
      // El bloqueo por rechazo viene de status === 'rechazado' (progreso
      // deriva de ahí) — hay que resetear el caso completo, no solo el
      // segmento de fraude, o el próximo clic financiero reabre el bloqueo.
      this.stateV2.setStatus('sin_validar');
      this.stateV2.setMotivoPendiente(null);
      this._etapa.set('etapa0');
      this._panelDismissed.set(false);
    } else {
      this.stateV2.setSaldoNegativoFraude(false);
    }
    this._blockOpen.set(false);
    this.registrarEvento('backstage', 'Demo: Financiero resuelve el caso y levanta el Freno Seco.');
  }

  /** Reproduce manualmente una etapa del recorrido, para stakeholders que quieren ver un paso puntual sin repetir todo el flujo. */
  playEtapa(etapa: Fase0Etapa): void {
    switch (etapa) {
      case 'pre':
        this._etapa.set('pre');
        break;
      case 'etapa0':
        // Vuelve a estado "limpio" para poder ver el panel lateral otra vez en Home.
        this.dismissResult();
        this.closeInterceptor();
        this._sumsubOpen.set(false);
        this.closeBlock();
        this._panelDismissed.set(false);
        this._etapa.set('etapa0');
        break;
      case 'etapa05':
        this.openInterceptor(this._interceptorOrigen());
        break;
      case 'en-sumsub':
        this.openSumsubStandin();
        break;
      case 'continua': {
        const kind = this.progresoToResultKind(this.progreso());
        if (kind) this.showResult(kind);
        else this._etapa.set('continua');
        break;
      }
      case 'bloqueado':
        this.openBlock();
        break;
    }
  }
}
