import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityDemoStateV2Service } from '../../services/identity-demo-state-v2.service';
import { IdentityFase0Service } from '../../services/identity-fase0.service';

// Etapa 0 del Service Blueprint Fase 0: Panel Lateral "Verifica tu cuenta".
// Aparece al entrar al Home en fase0 (momento Setup/Activación). Ocupa 25% del
// ancho, tiene botón 'X' visible y NO menciona incentivo monetario ni retiros —
// es solo pedagógico (blueprint Etapa 0, Front stage → Acciones, punto 1).

@Component({
  selector: 'app-identity-fase0-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-panel.component.html',
  styleUrls: ['./identity-fase0-panel.component.scss'],
})
export class IdentityFase0PanelComponent {
  private readonly stateV2 = inject(IdentityDemoStateV2Service);
  private readonly fase0 = inject(IdentityFase0Service);

  readonly dismissed = signal(false);

  readonly isVisible = computed(() => {
    const momento = this.stateV2.momentoUsuario();
    return (
      this.stateV2.faseProyecto() === 'fase0' &&
      (momento === 'setup' || momento === 'activacion') &&
      !this.dismissed()
    );
  });

  verificarAhora(): void {
    this.fase0.openInterceptor('home');
  }

  dismiss(): void {
    this.dismissed.set(true);
  }
}
