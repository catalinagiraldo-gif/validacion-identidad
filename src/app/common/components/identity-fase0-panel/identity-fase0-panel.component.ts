import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';

// Etapa 0 del Service Blueprint Fase 0: Panel "Verifica tu cuenta" en Home.
// Diseño alineado al modal UserPilot de referencia (header naranja con
// ilustración + cuerpo blanco + CTA full-width). Ocupa ~25% a la derecha,
// tiene 'X' visible y NO menciona incentivo monetario ni retiros — es solo
// pedagógico (blueprint Etapa 0, Front stage → Acciones, punto 1).

@Component({
  selector: 'app-identity-fase0-panel',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase0-panel.component.html',
  styleUrls: ['./identity-fase0-panel.component.scss'],
})
export class IdentityFase0PanelComponent {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);
  private readonly fase0 = inject(IdentityFase0Service);

  readonly isVisible = computed(() => {
    // Blueprint: Panel Lateral es exclusivo de ETAPA 0 ("Usuarios Activos con
    // historial en Dropi, sin verificar"). Un Nuevo con progreso "nunca" NO lo
    // ve — para él, el único disparador es un clic financiero (Etapa 0.5,
    // mismo trato que un Activo). Eje `fase0TipoUsuario`, no `momentoUsuario`
    // (ese es del rediseño Fase 1-5, otro eje).
    return (
      this.stateV2.faseProyecto() === 'fase0' &&
      this.stateV2.fase0TipoUsuario() === 'activo' &&
      this.fase0.progreso() === 'nunca' &&
      !this.stateV2.marcaBlanca() &&
      !this.fase0.panelDismissed()
    );
  });

  verificarAhora(): void {
    // Panel pedagógico (Etapa 0): directo a Sumsub — sin interceptor intermedio.
    this.fase0.invitarDesdeBanner('home');
  }

  dismiss(): void {
    this.fase0.dismissPanel();
  }
}
