import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IdentityDemoStateService,
  FASES,
  FaseUsuario,
  ResultadoModal,
} from '../../../common/services/identity-demo-state.service';
import { PaisPersona, IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';
import { IdentityDemoStateV2Service } from '../../../common/services/identity-demo-state-v2.service';
import { IdentityFase0Service } from '../../../common/services/identity-fase0.service';
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
  imports: [CommonModule],
  templateUrl: './prototype-demo-panel.component.html',
  styleUrls: ['./prototype-demo-panel.component.scss'],
})
export class PrototypeDemoPanelComponent {
  private stateSvc = inject(IdentityDemoStateService);
  private stateV2  = inject(IdentityDemoStateV2Service);
  private fase0    = inject(IdentityFase0Service);

  collapsed = signal(false);

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

  readonly statusOptions: Array<{ value: ResultadoModal; label: string }> = [
    { value: 'aprobado',    label: 'Aprobado' },
    { value: 'en_revision', label: 'En revisión' },
    { value: 'rechazado',   label: 'Rechazado' },
  ];

  readonly identityStatusLabel = computed(() => {
    const map: Record<string, string> = {
      sin_validar: 'Sin iniciar',
      pendiente:   'Pendiente',
      en_revision: 'En revisión',
      rechazado:   'Rechazado',
      aprobado:    'Aprobado',
    };
    return map[this.currentStatus()] ?? this.currentStatus();
  });

  readonly statusClass = computed(() => {
    const s = this.currentStatus();
    if (s === 'aprobado')    return 'status--approved';
    if (s === 'en_revision') return 'status--review';
    if (s === 'rechazado')   return 'status--rejected';
    return 'status--none';
  });

  /** Badge de motor de solo lectura (Truora/Sumsub/manual), visible sin abrir el modal. */
  readonly motorBadge = computed(() => {
    const m = this.motorValidacion();
    if (m === 'truora') return { icon: '🟢', label: 'Truora' };
    if (m === 'sumsub') return { icon: '🔵', label: 'Sumsub' };
    return { icon: '🟡', label: 'Gestión manual — Backoffice' };
  });

  // --- Controles Fase 0 (Service Blueprint Fase 0) ---
  readonly showFase0Controls = computed(() => this.faseProyecto() === 'fase0');
  readonly saldoNegativoFraude = this.stateV2.saldoNegativoFraude;
  readonly motivoPendiente = this.stateV2.motivoPendiente;
  readonly statusV2 = this.stateV2.status;
  readonly showMotivoPendiente = computed(() => this.stateV2.status() === 'pendiente');

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

  faseProyectoLabel(f: FaseProyecto): string { return FASE_PROYECTO_LABELS[f]; }
  momentoLabel(m: MomentoUsuario): string { return MOMENTO_LABELS[m]; }
  segmentoLabel(s: SegmentoUsuario): string { return SEGMENTO_LABELS[s]; }

  setFaseProyecto(fase: FaseProyecto): void {
    this.stateV2.setFaseProyecto(fase);
  }

  /** "Momento del usuario" -- la vieja fila FASE, renombrada; sigue delegando 1:1 al servicio base. */
  setMomentoUsuario(fase: FaseUsuario): void {
    this.stateSvc.setFase(fase);
    this.stateV2.setMomentoUsuario(fase as MomentoUsuario);
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

  setIdentidadStatus(resultado: ResultadoModal): void {
    this.stateSvc.setResultadoModal(resultado);
    const status: IdentitySatelliteStatus =
      resultado === 'aprobado' ? 'aprobado' : resultado === 'en_revision' ? 'en_revision' : 'rechazado';
    this.stateSvc.setStatus(status);
    this.stateV2.setStatus(status);
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

  setMotivoPendiente(motivo: MotivoPendiente): void {
    this.stateV2.setMotivoPendiente(motivo);
  }

  /** Setea el estado coherente y dispara el modal de resultado de Etapa Continua. */
  showResultadoFase0(kind: Fase0ResultKind): void {
    switch (kind) {
      case 'aprobado':
        this.stateV2.setStatus('aprobado');
        this.stateV2.setMotivoPendiente(null);
        break;
      case 'revision-financiero':
        this.stateV2.setStatus('pendiente');
        this.stateV2.setMotivoPendiente('revision-financiero');
        break;
      case 'incompleta':
        this.stateV2.setStatus('pendiente');
        this.stateV2.setMotivoPendiente('incompleta');
        break;
      case 'rechazado':
        this.stateV2.setStatus('rechazado');
        this.stateV2.setMotivoPendiente(null);
        break;
    }
    this.fase0.showResult(kind);
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

  setWebhook(confirmed: boolean): void {
    this.stateV2.setWebhookConfirmed(confirmed);
  }

  toggle(): void {
    this.collapsed.set(!this.collapsed());
  }
}
