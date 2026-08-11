import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityDemoStateService, ResultadoModal } from '../../services/identity-demo-state.service';
import { IdentityModalService, StartScreen } from '../../services/identity-modal.service';
import { IdentitySatelliteStatus } from '../../models/identity-flow.models';
import { Fase0TipoUsuario, FASE15_TIPO_USUARIO_LABELS } from '../../models/identity-flow-v2.models';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';

// Selector de casos del track Fase 1-5 — el equivalente del escape hatch que ya
// existe para Modo Prototipo 0. Sin esto, ver un caso de Fase 1-5 obliga a
// combinar a mano varias filas de chips del demo panel y además navegar uno
// mismo a la ruta gateada correcta; con esto, un stakeholder salta a cualquier
// caso con un clic.
//
// Gating inverso al del switcher de Fase 0 (=== 'fase0'): los dos nunca compiten
// por pantalla, siempre hay exactamente uno montado.

interface PaginaOption {
  ruta: string;
  label: string;
}

interface EstadoOption {
  status: IdentitySatelliteStatus;
  label: string;
  /** Qué significa este estado en el proceso real de Truora (CO) / Sumsub (resto de países). */
  nota: string;
  danger?: boolean;
}

interface ModalOption {
  label: string;
  startScreen: StartScreen;
  /** Solo para screen3: resultado que debe mostrar la pantalla de resultado. */
  resultado?: ResultadoModal;
  danger?: boolean;
}

@Component({
  selector: 'app-identity-fase15-state-switcher',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase15-state-switcher.component.html',
  styleUrls: ['./identity-fase15-state-switcher.component.scss'],
})
export class IdentityFase15StateSwitcherComponent {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);
  private readonly identityStateSvc = inject(IdentityDemoStateService);
  private readonly modalSvc = inject(IdentityModalService);
  private readonly router = inject(Router);

  readonly expanded = signal(false);

  readonly visible = computed(() => this.stateV2.faseProyecto() !== 'fase0');

  /** Páginas gateadas por `<app-identity-gate>` — un clic = ver el gate en su contexto real. */
  readonly paginas: PaginaOption[] = [
    { ruta: '/new/historial-de-cartera', label: 'Wallet / Transferencia' },
    { ruta: '/new/financiero/retiros-de-saldo', label: 'Retiros de saldo' },
    { ruta: '/new/dropi-card/cards', label: 'DropiCard' },
    { ruta: '/new/financiero/datos-facturacion', label: 'Facturación' },
    { ruta: '/new/configuraciones/cuenta', label: 'Cuenta' },
  ];

  readonly estados: EstadoOption[] = [
    { status: 'sin_validar', label: 'Sin validar', nota: 'El usuario nunca abrió el formulario de Truora (Colombia) o Sumsub (resto de países)' },
    { status: 'pendiente', label: 'Pendiente', nota: 'Empezó el formulario pero no lo terminó — mismo dato que Truora "2.3 Proceso abandonado" / Sumsub incompleto' },
    { status: 'en_revision', label: 'En revisión', nota: 'Ya envió todo; Truora/Sumsub está evaluando. Camino automático (>92%) resuelve en segundos, cola de excepciones (≤8%) hasta 24h' },
    { status: 'rechazado', label: 'Rechazado', danger: true, nota: 'Truora o Sumsub no pudo confirmar los datos — el usuario conserva lo que ya tenía aprobado antes' },
    { status: 'aprobado', label: 'Aprobado', nota: 'Truora/Sumsub confirmó — mismo resultado final para Colombia (Truora) y el resto de países (Sumsub), aunque el proveedor nunca se nombra al usuario' },
  ];

  // Corrección (mismo criterio que el switcher de Fase 0, feedback 23-jul): el
  // toggle Nuevo/Activo ya vive en el panel superior MODO PROTOTIPO, pero ese
  // panel no siempre se lee como "el lugar donde controlo Nuevo/Activo para
  // Fase 1-5". Se expone también aquí para que el switcher sea el único
  // lugar donde ver y cambiar todos los ejes de Fase 1-5 de un vistazo.
  readonly tipoUsuarioOptions: Fase0TipoUsuario[] = ['nuevo', 'activo'];
  readonly tipoUsuarioActual = this.stateV2.fase0TipoUsuario;

  tipoUsuarioLabel(t: Fase0TipoUsuario): string {
    return FASE15_TIPO_USUARIO_LABELS[t];
  }

  setTipoUsuario(t: Fase0TipoUsuario): void {
    this.stateV2.setFase0TipoUsuario(t);
  }

  // `screen1` (checklist) no es punto de entrada válido del modal — no se expone.
  readonly modales: ModalOption[] = [
    { label: 'Intro', startScreen: 'screen0' },
    { label: 'Formulario', startScreen: 'screen2' },
    { label: 'Resultado · Aprobado', startScreen: 'screen3', resultado: 'aprobado' },
    { label: 'Resultado · En revisión', startScreen: 'screen3', resultado: 'en_revision' },
    { label: 'Resultado · Rechazado', startScreen: 'screen3', resultado: 'rechazado', danger: true },
  ];

  readonly statusActual = this.identityStateSvc.status;
  readonly modalAbierto = this.modalSvc.isOpen;

  readonly statusLabel = computed(
    () => this.estados.find((e) => e.status === this.statusActual())?.label ?? 'Sin validar'
  );

  toggle(): void {
    this.expanded.update((v) => !v);
  }

  irAPagina(ruta: string): void {
    this.router.navigate([ruta]);
  }

  /**
   * Se escriben los DOS estados a propósito: `<app-identity-gate>` y las páginas
   * /new/ leen `IdentityDemoStateService.status()`, pero varias piezas de Fase 1-5
   * leen `IdentityDemoStateV2Service.status()`. El propio modal ya escribe siempre
   * ambos (confirmExit / onAprobadoReturn / onEnRevisionReturn / onRechazadoReturn)
   * justo para no desincronizarlos; forzar el estado desde aquí debe hacer lo mismo.
   */
  setEstado(status: IdentitySatelliteStatus): void {
    this.identityStateSvc.setStatus(status);
    this.stateV2.setStatus(status);
  }

  /**
   * `screen3` NO deriva su resultado de `status()`: el modal lee
   * `IdentityDemoStateService.resultadoModal` (`readonly resultado = this.stateSvc.resultadoModal`)
   * y ramifica con `@if (resultado() === 'aprobado' | 'en_revision' | 'rechazado')`.
   * Por eso el resultado se fija con `setResultadoModal(...)` ANTES de abrir el modal.
   */
  abrirModal(opt: ModalOption): void {
    if (opt.resultado) {
      this.identityStateSvc.setResultadoModal(opt.resultado);
    }
    this.modalSvc.open('wallet', opt.startScreen);
  }

  previsualizarAvisoAbandono(): void {
    if (!this.modalSvc.isOpen()) {
      this.modalSvc.open('wallet', 'screen2');
    }
    this.modalSvc.mostrarAvisoAbandono();
  }

  cerrarModal(): void {
    this.modalSvc.close();
  }
}
