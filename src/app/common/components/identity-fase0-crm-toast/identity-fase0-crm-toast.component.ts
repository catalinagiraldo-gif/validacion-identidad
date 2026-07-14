import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';

// Fase 0 — CRM en Front stage: el trabajo del CRM es interno (Back stage) pero
// su resultado le llega al usuario como mensaje de WhatsApp. Este toast simula
// esa burbuja con copy 100% textual al blueprint (los 4 mensajes de Etapa 0 y
// Etapa Continua). Auto-dismiss por timer en el servicio + botón cerrar.

@Component({
  selector: 'app-identity-fase0-crm-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-fase0-crm-toast.component.html',
  styleUrls: ['./identity-fase0-crm-toast.component.scss'],
})
export class IdentityFase0CrmToastComponent {
  readonly fase0 = inject(IdentityFase0Service);

  cerrar(): void {
    this.fase0.dismissCrm();
  }
}
