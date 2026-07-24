import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
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

  toggle(): void {
    this.expanded.update((v) => !v);
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
