import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { BloqueoMotivo } from '../../services/identity-profile.service';
import { DropiAlertComponent } from '../dropi-alert/dropi-alert.component';

export type BlockBannerContext = 'retiro' | 'transferencia' | 'dropicard';

const CONTEXT_LABEL: Record<BlockBannerContext, string> = {
  retiro: 'retirar saldo',
  transferencia: 'transferir entre cuentas',
  dropicard: 'usar tu Dropicard',
};

const MOTIVO_EXPLICACION: Record<Exclude<BloqueoMotivo, 'ninguno'>, string> = {
  'falta-dueno': 'Verifica tu identidad en Información de cuenta.',
  'falta-responsable': 'Verifica al responsable tributario en Datos de facturación.',
  ambos: 'Verifica tu identidad en Información de cuenta y al responsable tributario en Datos de facturación.',
};

@Component({
  selector: 'app-identity-block-banner',
  standalone: true,
  imports: [CommonModule, DropiAlertComponent],
  template: `
    @if (motivo !== 'ninguno') {
      <app-dropi-alert [message]="message" severity="warning" [closable]="false">
        <button type="button" class="identity-block-banner__cta" (click)="irAVerificar()">Ir a verificar</button>
      </app-dropi-alert>
    }
  `,
  styles: [`
    .identity-block-banner__cta {
      display: inline-block;
      margin-left: 8px;
      border: none;
      background: transparent;
      color: inherit;
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
      padding: 0;
    }
  `],
})
export class IdentityBlockBannerComponent {
  @Input({ required: true }) motivo: BloqueoMotivo = 'ninguno';
  @Input({ required: true }) contexto: BlockBannerContext = 'retiro';

  private router = inject(Router);

  get message(): string {
    if (this.motivo === 'ninguno') return '';
    const accion = CONTEXT_LABEL[this.contexto];
    return `Aún no puedes ${accion}. ${MOTIVO_EXPLICACION[this.motivo]}`;
  }

  irAVerificar(): void {
    if (this.motivo === 'falta-responsable') {
      this.router.navigateByUrl('/financiero/datos-facturacion');
    } else {
      this.router.navigateByUrl('/configuraciones/cuenta');
    }
  }
}
