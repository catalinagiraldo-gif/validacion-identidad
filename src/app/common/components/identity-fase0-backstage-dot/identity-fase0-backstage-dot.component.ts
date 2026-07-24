import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Bolita "!" reutilizable para anotar, dentro de los overlays de Fase 0, qué
// pasa en el Back stage del Service Blueprint Fase 0 (Google Sheets, Legal,
// UserPilot, Sumsub backoffice, Cartera). Nunca muestra copy de cara al
// usuario final — es una nota para quien está viendo el prototipo (PM,
// diseño, stakeholders), igual que los tooltips ocultos del diagrama
// original (docs/validacion/Service_Blueprint_Diagrama Fase 0.md).

@Component({
  selector: 'app-fase0-backstage-dot',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-backstage-dot.component.html',
  styleUrls: ['./identity-fase0-backstage-dot.component.scss'],
})
export class IdentityFase0BackstageDotComponent {
  /** Nota interna de negocio (Back stage) a mostrar en el tooltip — no es copy de usuario. */
  @Input({ required: true }) texto = '';
  /** aria-label del botón, describe qué etapa/intervención explica esta bolita. */
  @Input() label = 'Qué pasa por dentro (backstage)';
  /** Variante visual — 'light' para overlays claros, 'dark' para el bloqueo full-screen oscuro. */
  @Input() variante: 'light' | 'dark' = 'light';

  readonly open = signal(false);

  toggle(): void {
    this.open.set(!this.open());
  }

  close(): void {
    this.open.set(false);
  }
}
