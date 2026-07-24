import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IdentityDemoStateService,
  FASES,
  FaseUsuario,
} from '../../../common/services/identity-demo-state.service';
import { PaisPersona, IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';
import { IdentityDemoStateV2Service } from '../../../common/services/identity-demo-state-v2.service';
import { IdentityFase0Service } from '../../../common/services/identity-fase0.service';
import { IdentidadStakeholderTourService } from '../../../common/services/identidad-stakeholder-tour.service';
import { IdentityFase0BackstageDotComponent } from '../../../common/components/identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';
import {
  FaseProyecto,
  FASES_PROYECTO,
  MomentoUsuario,
  Pais9,
  PAISES_9,
  TipoPersonaV2,
  SegmentoUsuario,
  SEGMENTOS_USUARIO,
  Fase0ResultKind,
  Fase0CrmKind,
  MotivoPendiente,
  IdentitySatelliteStatusV2,
  Fase0Etapa,
  FASE0_ETAPAS,
  FASE0_ETAPA_LABELS,
  FASE0_ETAPA_BACKSTAGE,
  Fase0ProgresoSumsub,
  FASE0_PROGRESO_LABELS,
  FASE0_BLOQUE_LABELS,
  Fase0TipoUsuario,
  FASE0_TIPO_USUARIO_LABELS,
} from '../../../common/models/identity-flow-v2.models';

// Controles del demo-panel extendidos según Plan2.md Parte 7: dos filas
// ortogonales pero acumulativas -- "Fase de entrega" (rollout del proyecto,
// líneas 251-267) y "Momento del usuario" (Etapa PLG, la vieja fila FASE
// renombrada, sigue delegando 1:1 al servicio base). País y Persona se
// extienden de 5→9 y 2→3 respectivamente y siguen "puenteando" hacia el
// servicio viejo solo cuando el valor cae dentro de lo que éste reconoce --
// así /old/* nunca ve un valor que no entiende (Hallazgo de auditoría,
// líneas 1317-1333).

type PaisCode = 'CO' | 'MX' | 'AR' | 'CL' | 'EC';
const OLD_PAISES: PaisCode[] = ['CO', 'MX', 'AR', 'CL', 'EC'];

const PAIS_NATURAL_MAP: Record<PaisCode, PaisPersona> = {
  CO: 'co-natural',
  MX: 'mx-natural',
  AR: 'ar-natural',
  CL: 'cl',
  EC: 'ec',
};

const PAIS_JURIDICA_MAP: Record<PaisCode, PaisPersona> = {
  CO: 'co-juridica',
  MX: 'mx-juridica',
  AR: 'ar-juridica',
  CL: 'cl',
  EC: 'ec',
};

const FASE_PROYECTO_LABELS: Record<FaseProyecto, string> = {
  fase0: 'Fase 0', fase1: 'Fase 1', fase2: 'Fase 2', fase3: 'Fase 3', fase4: 'Fase 4', fase5: 'Fase 5',
};

const MOMENTO_LABELS: Record<MomentoUsuario, string> = {
  setup: 'Setup', activacion: 'Activación', habito: 'Habit', profesional: 'Cross-Border', legacy: 'Legacy',
};

const SEGMENTO_LABELS: Record<SegmentoUsuario, string> = {
  'dropshipper-natural':   'Dropshipper natural',
  'proveedor-juridica':    'Proveedor jurídica',
  'baneado-cross-country': 'Baneado cross-country',
  'migrado-legacy':        'Migrado legacy',
};

@Component({
  selector: 'app-prototype-demo-panel',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './prototype-demo-panel.component.html',
  styleUrls: ['./prototype-demo-panel.component.scss'],
})
export class PrototypeDemoPanelComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private stateV2  = inject(IdentityDemoStateV2Service);
  private fase0    = inject(IdentityFase0Service);
  private stakeholderTour = inject(IdentidadStakeholderTourService);

  collapsed = signal(false);
  /** Parte C — explicador dedicado a stakeholders: modal de bienvenida distinto del panel de controles. */
  mostrarBienvenidaTour = signal(false);

  readonly fases         = FASES;
  readonly fasesProyecto = FASES_PROYECTO;
  readonly paisesV2      = PAISES_9;
  readonly segmentos     = SEGMENTOS_USUARIO;

  readonly currentFase    = this.stateSvc.fase;
  readonly currentStatus  = this.stateSvc.status;
  readonly currentPaisOld = this.stateSvc.pais;
  readonly currentTipoOld = this.stateSvc.tipoPersona;
  readonly primeraOrden   = this.stateSvc.primeraOrdenEntregada;
  readonly resultadoModal = this.stateSvc.resultadoModal;

  readonly faseProyecto     = this.stateV2.faseProyecto;
  readonly segmentoUsuario  = this.stateV2.segmentoUsuario;
  readonly paisV2           = this.stateV2.pais;
  readonly tipoPersonaV2    = this.stateV2.tipoPersona;
  readonly motorValidacion  = this.stateV2.motorValidacion;
  readonly mecanismoVigente = this.stateV2.mecanismoVigente;
  readonly emailEnListaNegra = this.stateV2.emailEnListaNegra;
  readonly representanteLegalValidado = this.stateV2.representanteLegalValidado;
  readonly webhookConfirmed = this.stateV2.webhookConfirmed;
  readonly estadoKyb        = this.stateV2.estadoKyb;
  readonly tieneDatosFormularioAntiguo = this.stateV2.tieneDatosFormularioAntiguo;

  /**
   * Plan2.md Parte 8: el control IDENTIDAD solo dejaba elegir los 3 estados
   * terminales (aprobado/en_revision/rechazado) -- no había forma de
   * demostrar "nunca ha hecho nada" (sin_validar), "empezó y no terminó"
   * (pendiente) ni el estado nuevo "parcial" (datos del formulario viejo,
   * pre-Sumsub, nunca certificados) sin depender de un efecto colateral de
   * otro control (Momento del usuario = Setup).
   */
  readonly statusOptionsV2: Array<{ value: IdentitySatelliteStatusV2; label: string }> = [
    { value: 'sin_validar', label: 'Sin iniciar' },
    { value: 'parcial',     label: 'Parcial (datos viejos)' },
    { value: 'pendiente',   label: 'Pendiente' },
    { value: 'en_revision', label: 'En revisión' },
    { value: 'rechazado',   label: 'Rechazado' },
    { value: 'aprobado',    label: 'Aprobado' },
  ];

  readonly currentStatusV2 = this.stateV2.status;

  readonly identityStatusLabel = computed(() => {
    const map: Record<string, string> = {
      sin_validar: 'Sin iniciar',
      parcial:     'Parcial (datos viejos)',
      pendiente:   'Pendiente',
      en_revision: 'En revisión',
      rechazado:   'Rechazado',
      aprobado:    'Aprobado',
      pj_pendiente: 'Empresa pendiente',
    };
    return map[this.currentStatusV2()] ?? this.currentStatusV2();
  });

  /** Cada uno de los 7 estados tiene su propia clase/color — antes 4 de los 7 (sin_validar/parcial/pendiente/pj_pendiente) caían todos en el mismo gris "status--none", dando la impresión de que cambiar el chip IDENTIDAD no hacía nada. */
  readonly statusClass = computed(() => {
    const map: Record<string, string> = {
      sin_validar: 'status--none',
      parcial: 'status--parcial',
      pendiente: 'status--pending',
      en_revision: 'status--review',
      rechazado: 'status--rejected',
      aprobado: 'status--approved',
      pj_pendiente: 'status--pj-pendiente',
    };
    return map[this.currentStatusV2()] ?? 'status--none';
  });

  /** Badge de motor de solo lectura (Truora/Sumsub/manual), visible sin abrir el modal. */
  readonly motorBadge = computed(() => {
    const m = this.motorValidacion();
    if (m === 'truora') return { icon: '🟢', label: 'Truora' };
    if (m === 'sumsub') return { icon: '🔵', label: 'Sumsub' };
    return { icon: '🟡', label: 'Gestión manual — Backoffice' };
  });

  // --- Modo Prototipo: 0 (recorrido Fase 0 completo) vs 2 (Fases 1/2/3/4/5) ---
  readonly modoPrototipo = computed<'proto0' | 'proto2'>(() =>
    this.faseProyecto() === 'fase0' ? 'proto0' : 'proto2'
  );

  /** Chips FASE DE ENTREGA visibles: en Prototipo 0 solo Fase 0 (informativo); en Prototipo 2, todas menos Fase 0. */
  readonly fasesProyectoVisibles = computed<FaseProyecto[]>(() =>
    this.modoPrototipo() === 'proto0'
      ? (['fase0'] as FaseProyecto[])
      : this.fasesProyecto.filter((f) => f !== 'fase0')
  );

  selectPrototipo0(): void {
    this.stateV2.setFaseProyecto('fase0');
  }

  selectPrototipo2(): void {
    if (this.faseProyecto() === 'fase0') {
      this.stateV2.setFaseProyecto('fase2');
    }
  }

  // --- Controles Fase 0 (Service Blueprint Fase 0) ---
  readonly showFase0Controls = computed(() => this.faseProyecto() === 'fase0');
  readonly fase0TipoUsuario = this.stateV2.fase0TipoUsuario;
  readonly fase0TipoUsuarioOptions: Fase0TipoUsuario[] = ['nuevo', 'activo'];
  readonly saldoNegativoFraude = this.stateV2.saldoNegativoFraude;
  readonly marcaBlanca = this.stateV2.marcaBlanca;
  readonly motivoPendiente = this.stateV2.motivoPendiente;
  readonly statusV2 = this.stateV2.status;
  readonly showMotivoPendiente = computed(() => this.stateV2.status() === 'pendiente');

  /** Progreso real del usuario en Sumsub — derivado, ver IdentityFase0Service.progreso. */
  readonly progresoSumsub = this.fase0.progreso;
  readonly progresoSumsubLabel = computed(() => FASE0_PROGRESO_LABELS[this.progresoSumsub()]);
  readonly progresoBadgeClass = computed(() => {
    const map: Record<Fase0ProgresoSumsub, string> = {
      nunca: 'status--none',
      incompleta: 'status--pj-pendiente',
      'pendiente-financiero': 'status--pending',
      aprobado: 'status--approved',
      rechazado: 'status--rejected',
    };
    return map[this.progresoSumsub()];
  });

  /** Bloque Sumsub vigente (A-E) según país + marca blanca — ver IdentityFase0Service.sumsubBloque. */
  readonly sumsubBloqueLabel = computed(() => FASE0_BLOQUE_LABELS[this.fase0.sumsubBloque()]);

  // --- Recorrido guiado (stepper) ---
  readonly fase0Etapas = FASE0_ETAPAS;
  readonly fase0EtapaActual = this.fase0.etapa;

  fase0EtapaLabel(e: Fase0Etapa): string {
    return FASE0_ETAPA_LABELS[e];
  }

  fase0EtapaNota(e: Fase0Etapa): string {
    return FASE0_ETAPA_BACKSTAGE[e];
  }

  reproducirEtapa(e: Fase0Etapa): void {
    this.fase0.playEtapa(e);
  }

  readonly resultadoFase0Options: Array<{ kind: Fase0ResultKind; label: string }> = [
    { kind: 'aprobado',            label: 'Aprobado' },
    { kind: 'revision-financiero', label: 'Pendiente: revisión financiero' },
    { kind: 'incompleta',          label: 'Pendiente: incompleta' },
    { kind: 'rechazado',           label: 'Rechazado' },
  ];

  readonly crmFase0Options: Array<{ kind: Fase0CrmKind; label: string }> = [
    { kind: 'recordatorio',        label: 'Recordatorio Etapa 0' },
    { kind: 'aprobado',            label: 'Aprobado' },
    { kind: 'revision-financiero', label: 'Revisión financiero' },
    { kind: 'incompleta',          label: 'Incompleta' },
    { kind: 'marca-blanca',        label: 'Marca blanca (Soporte)' },
  ];

  readonly showEmailBaneadoToggle = computed(() => this.faseProyecto() !== 'fase0');
  readonly showRepLegalToggle = computed(() => {
    const f = this.faseProyecto();
    return f === 'fase3' || f === 'fase4' || f === 'fase5';
  });
  readonly showWebhookToggle = computed(() => {
    const f = this.faseProyecto();
    return (f === 'fase4' || f === 'fase5') && this.paisV2() === 'EC';
  });

  /** A8 — RN-10/RN-11: chip de Riesgo + stepper de meses, solo relevantes desde Fase 5 (edición/re-validación). */
  readonly showRiesgoControles = computed(() => this.faseProyecto() === 'fase5');
  readonly riskScore = this.stateV2.riskScore;
  readonly lastValidatedAt = this.stateV2.lastValidatedAt;
  readonly mesesDesdeUltimaValidacion = computed(() => {
    const fecha = this.lastValidatedAt();
    if (!fecha) return null;
    const dias = (Date.now() - fecha.getTime()) / (1000 * 60 * 60 * 24);
    return Math.round(dias / 30);
  });
  readonly mesesOptions = [0, 2, 4, 6, 8, 12];

  faseProyectoLabel(f: FaseProyecto): string { return FASE_PROYECTO_LABELS[f]; }
  momentoLabel(m: MomentoUsuario): string { return MOMENTO_LABELS[m]; }
  segmentoLabel(s: SegmentoUsuario): string { return SEGMENTO_LABELS[s]; }

  setFaseProyecto(fase: FaseProyecto): void {
    this.stateV2.setFaseProyecto(fase);
  }

  /**
   * "Momento del usuario" -- la vieja fila FASE, renombrada; sigue delegando
   * 1:1 al servicio base. Plan2.md Parte 8: stateSvc.setFase() ya resetea su
   * propio status según FASES[].defaultStatus (setup -> sin_validar), pero
   * antes dejaba stateV2.status huérfano de ese reset -- un usuario podía
   * quedar en "Setup" con identidad "aprobada" en la mitad del sistema. Al
   * volver a Setup, stateV2 se resetea explícitamente (sin_validar, o
   * 'parcial' si el usuario tiene datos del formulario viejo sin certificar).
   */
  setMomentoUsuario(fase: FaseUsuario): void {
    this.stateSvc.setFase(fase);
    this.stateV2.setMomentoUsuario(fase as MomentoUsuario);
    if (fase === 'setup') {
      this.stateV2.resetStatusParaSetup();
    }
  }

  setSegmento(segmento: SegmentoUsuario): void {
    this.stateV2.setSegmentoUsuario(segmento);
    if (segmento === 'baneado-cross-country') {
      this.stateV2.setEmailEnListaNegra(true);
    } else if (segmento === 'migrado-legacy') {
      this.setMomentoUsuario('legacy');
      this.stateV2.setEmailEnListaNegra(false);
    } else {
      this.stateV2.setEmailEnListaNegra(false);
    }
  }

  /**
   * Fija el estado de identidad en ambos servicios. 'parcial' no existe en el
   * servicio base (IdentitySatelliteStatus) -- se puentea a 'sin_validar' ahí,
   * mismo patrón que 'pj_pendiente' cae a 'en_revision' (Hallazgo de auditoría,
   * identity-demo-state-v2.service.ts).
   */
  setIdentidadStatus(status: IdentitySatelliteStatusV2): void {
    this.stateV2.setStatus(status);
    const bridged: IdentitySatelliteStatus = status === 'parcial' || status === 'pj_pendiente' ? 'sin_validar' : status;
    this.stateSvc.setStatus(bridged);
    if (status === 'aprobado' || status === 'en_revision' || status === 'rechazado') {
      this.stateSvc.setResultadoModal(status);
    }
  }

  /** Extiende PAÍS de 5→9; solo puentea al servicio viejo cuando /old/* reconoce el valor. */
  setPais(pais: Pais9): void {
    this.stateV2.setPais(pais);
    if ((OLD_PAISES as string[]).includes(pais)) {
      const tipo = this.currentTipoOld();
      const pp = tipo === 'juridica' ? PAIS_JURIDICA_MAP[pais as PaisCode] : PAIS_NATURAL_MAP[pais as PaisCode];
      this.stateSvc.setPaisPersona(pp);
    }
  }

  /** Extiende PERSONA de 2→3; "extranjera" no existe en el servicio viejo, no se puentea. */
  setTipoPersonaV2(tipo: TipoPersonaV2): void {
    this.stateV2.setTipoPersona(tipo);
    if (tipo === 'natural' || tipo === 'juridica') {
      const pais = this.currentPaisOld();
      const pp = tipo === 'juridica' ? PAIS_JURIDICA_MAP[pais] : PAIS_NATURAL_MAP[pais];
      this.stateSvc.setPaisPersona(pp);
    }
  }

  // --- Acciones de los controles Fase 0 ---

  toggleSaldoNegativoFraude(): void {
    const next = !this.saldoNegativoFraude();
    this.stateV2.setSaldoNegativoFraude(next);
    // Al apagar el segmento, resetea un bloqueo full-screen que estuviera activo.
    if (!next) {
      this.fase0.closeBlock();
    }
  }

  toggleMarcaBlanca(): void {
    this.stateV2.setMarcaBlanca(!this.marcaBlanca());
  }

  fase0TipoUsuarioLabel(t: Fase0TipoUsuario): string {
    return FASE0_TIPO_USUARIO_LABELS[t];
  }

  setFase0TipoUsuario(t: Fase0TipoUsuario): void {
    this.stateV2.setFase0TipoUsuario(t);
  }

  setMotivoPendiente(motivo: MotivoPendiente): void {
    this.stateV2.setMotivoPendiente(motivo);
  }

  /**
   * Forzar un resultado desde el demo-panel usa el mismo orquestador que el
   * Sumsub stand-in (`resolverSumsub`) — una sola fuente de verdad para
   * "qué significa cada resultado" (estado + modal + CRM).
   */
  showResultadoFase0(kind: Fase0ResultKind): void {
    this.fase0.resolverSumsub(kind);
  }

  simularCrm(kind: Fase0CrmKind): void {
    this.fase0.showCrmMessage(kind);
  }

  toggleEmailBaneado(): void {
    this.stateV2.setEmailEnListaNegra(!this.emailEnListaNegra());
  }

  toggleRepLegal(): void {
    this.stateV2.setRepresentanteLegalValidado(!this.representanteLegalValidado());
  }

  /** Plan2.md Parte 8: si el usuario está en Setup, refleja el toggle inmediatamente como 'parcial'/'sin_validar'. */
  toggleDatosFormularioAntiguo(): void {
    this.stateV2.setTieneDatosFormularioAntiguo(!this.tieneDatosFormularioAntiguo());
    if (this.currentFase() === 'setup') {
      this.stateV2.resetStatusParaSetup();
    }
  }

  setWebhook(confirmed: boolean): void {
    this.stateV2.setWebhookConfirmed(confirmed);
  }

  setRiskScore(score: 'bajo' | 'medio' | 'alto'): void {
    this.stateV2.setRiskScore(score);
  }

  setMesesDesdeUltimaValidacion(meses: number): void {
    this.stateV2.setMesesDesdeUltimaValidacion(meses);
  }

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }

  abrirBienvenidaTour(): void {
    this.mostrarBienvenidaTour.set(true);
  }

  cerrarBienvenidaTour(): void {
    this.mostrarBienvenidaTour.set(false);
  }

  iniciarTourStakeholder(): void {
    this.mostrarBienvenidaTour.set(false);
    this.stakeholderTour.start();
  }
}
