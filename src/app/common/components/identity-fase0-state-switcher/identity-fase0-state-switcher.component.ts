import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0Service, Fase0VistaCaso } from '../../services/identity-fase0.service';
import {
  Fase0ProgresoSumsub,
  FASE0_PROGRESO_LABELS,
  FASE0_EVENTO_TAG_ICON,
  Fase0TipoUsuario,
  FASE0_TIPO_USUARIO_LABELS,
} from '../../models/identity-flow-v2.models';

// Escape hatch de Modo Prototipo 0: flota SIEMPRE por encima de cualquier
// overlay de Fase 0 (interceptor, Sumsub stand-in, bloqueo, resultado) para
// que un stakeholder nunca quede atrapado viendo un solo estado — puede
// saltar a cualquier otro con un clic, y ve en vivo "cada interacción del
// blueprint" que se disparó (Back stage, UserPilot, Redirección, CRM).
// Solo vive en modo Prototipo 0 (faseProyecto === 'fase0').

interface EstadoOption {
  progreso: Fase0ProgresoSumsub;
  label: string;
}

interface VistaOption {
  caso: Fase0VistaCaso;
  label: string;
  danger?: boolean;
}

@Component({
  selector: 'app-identity-fase0-state-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-state-switcher.component.html',
  styleUrls: ['./identity-fase0-state-switcher.component.scss'],
})
export class IdentityFase0StateSwitcherComponent {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);
  readonly fase0 = inject(IdentityFase0Service);

  readonly expanded = signal(false);
  readonly tagIcon = FASE0_EVENTO_TAG_ICON;

  readonly visible = computed(() => this.stateV2.faseProyecto() === 'fase0');

  /** Overlays / pantallas del blueprint — un clic = ver el caso con copy alineado. */
  readonly vistasFront: VistaOption[] = [
    { caso: 'panel', label: 'Panel lateral (Etapa 0)' },
    { caso: 'interceptor', label: 'Interceptor (Etapa 0.5)' },
    { caso: 'interceptor-bancario', label: 'Bancario GT/PA' },
    { caso: 'sumsub', label: 'Sumsub (fuera de Dropi)' },
    { caso: 'resultado-aprobado', label: '¡Cuenta verificada!' },
    { caso: 'resultado-revision', label: 'Pendiente · revisión' },
    { caso: 'resultado-incompleta', label: 'Pendiente · incompleta' },
    { caso: 'resultado-rechazado', label: 'Rechazado (modal)' },
    { caso: 'bloqueo-fraude', label: 'Bloqueo · fraude', danger: true },
    { caso: 'bloqueo-rechazado', label: 'Bloqueo · post-rechazo', danger: true },
  ];

  readonly vistasCrm: VistaOption[] = [
    { caso: 'crm-recordatorio', label: 'Recordatorio Etapa 0' },
    { caso: 'crm-aprobado', label: 'CRM Aprobado' },
    { caso: 'crm-revision', label: 'CRM Revisión' },
    { caso: 'crm-incompleta', label: 'CRM Incompleta' },
    { caso: 'crm-marca-blanca', label: 'Marca blanca' },
  ];

  readonly estados: EstadoOption[] = [
    { progreso: 'nunca', label: FASE0_PROGRESO_LABELS.nunca },
    { progreso: 'incompleta', label: FASE0_PROGRESO_LABELS.incompleta },
    { progreso: 'pendiente-financiero', label: FASE0_PROGRESO_LABELS['pendiente-financiero'] },
    { progreso: 'aprobado', label: FASE0_PROGRESO_LABELS.aprobado },
    { progreso: 'rechazado', label: FASE0_PROGRESO_LABELS.rechazado },
  ];

  readonly progresoActual = this.fase0.progreso;
  readonly bloqueado = this.fase0.blockOpen;
  readonly bloqueadoLabel = computed(() =>
    this.fase0.blockMotivo() === 'rechazado' ? 'Bloqueado (rechazado)' : 'Bloqueado (fraude)'
  );

  // Corrección (feedback 23-jul): el toggle Nuevo/Activo vivía solo en el
  // panel superior MODO PROTOTIPO — quedaba oculto detrás de overlays
  // full-screen (interceptor, Sumsub, bloqueo). Se expone también aquí,
  // en el escape hatch que siempre flota por encima de todo.
  readonly tipoUsuarioOptions: Fase0TipoUsuario[] = ['nuevo', 'activo'];
  readonly tipoUsuarioActual = this.stateV2.fase0TipoUsuario;

  tipoUsuarioLabel(t: Fase0TipoUsuario): string {
    return FASE0_TIPO_USUARIO_LABELS[t];
  }

  setTipoUsuario(t: Fase0TipoUsuario): void {
    this.stateV2.setFase0TipoUsuario(t);
  }

  readonly hayOverlayAbierto = computed(
    () =>
      this.fase0.interceptorOpen() ||
      this.fase0.sumsubOpen() ||
      this.fase0.blockOpen() ||
      this.fase0.activeResult() !== null
  );
  readonly eventos = this.fase0.eventos;

  /** Resalta el chip del caso que está visible ahora (aprox. por overlay activo). */
  readonly vistaActiva = computed<Fase0VistaCaso | null>(() => {
    if (this.fase0.blockOpen()) {
      return this.fase0.blockMotivo() === 'rechazado' ? 'bloqueo-rechazado' : 'bloqueo-fraude';
    }
    if (this.fase0.sumsubOpen()) return 'sumsub';
    const result = this.fase0.activeResult();
    if (result === 'aprobado') return 'resultado-aprobado';
    if (result === 'revision-financiero') return 'resultado-revision';
    if (result === 'incompleta') return 'resultado-incompleta';
    if (result === 'rechazado') return 'resultado-rechazado';
    if (this.fase0.interceptorOpen()) {
      return this.stateV2.pais() === 'GT' && this.fase0.interceptorOrigen() === 'cuenta'
        ? 'interceptor-bancario'
        : 'interceptor';
    }
    if (
      this.stateV2.fase0TipoUsuario() === 'activo' &&
      this.fase0.progreso() === 'nunca' &&
      !this.fase0.panelDismissed()
    ) {
      return 'panel';
    }
    return null;
  });

  toggle(): void {
    this.expanded.update((v) => !v);
  }

  verCaso(caso: Fase0VistaCaso): void {
    this.fase0.mostrarVistaCaso(caso);
  }

  irA(progreso: Fase0ProgresoSumsub): void {
    this.fase0.forzarProgreso(progreso);
  }

  irABloqueo(): void {
    this.fase0.forzarBloqueo('fraude');
  }

  irABloqueoRechazado(): void {
    this.fase0.forzarBloqueo('rechazado');
  }

  quitarBloqueo(): void {
    this.fase0.quitarBloqueo();
  }

  cerrarOverlay(): void {
    this.fase0.cerrarOverlayActual();
  }
}
