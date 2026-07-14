import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';

// Etapa 1 del Service Blueprint Fase 0: Freno Seco — Modal Pantalla Completa
// (Bloqueo Visual / Spam Recurrente — Sin Salida). Sin botón de cierre;
// permanece hasta que Legal/Financiero resuelvan. "Contactar a soporte" es un
// afordance de prototipo (no destino real) y NO cierra el modal — el reset lo
// hace el demo-panel vía closeBlock().

@Component({
  selector: 'app-identity-fase0-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-block.component.html',
  styleUrls: ['./identity-fase0-block.component.scss'],
})
export class IdentityFase0BlockComponent {
  readonly fase0 = inject(IdentityFase0Service);

  readonly contactando = signal(false);

  contactarSoporte(): void {
    this.contactando.set(true);
    setTimeout(() => this.contactando.set(false), 2200);
  }
}
