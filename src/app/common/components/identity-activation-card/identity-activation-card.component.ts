import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IdentityAlertContext,
  getIdentityAlert,
  IDENTITY_STATUS_OPTIONS,
} from '../../../config/identity-alerts.config';
import { IdentityDemoStateService } from '../../services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../models/identity-flow.models';

@Component({
  selector: 'app-identity-activation-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './identity-activation-card.component.html',
  styleUrls: ['./identity-activation-card.component.scss'],
})
export class IdentityActivationCardComponent {
  @Input() context: IdentityAlertContext = 'default';
  @Input() blockedAction = '';
  @Input() showDemoBar = true;
  @Input() sticky = false;
  @Input() identityRoute = '/old/configuraciones/flujo-identidad-2026-06-18';
  @Input() variant: 'default' | 'home' = 'default';

  @Output() statusChange = new EventEmitter<IdentitySatelliteStatus>();

  private identityDemo = inject(IdentityDemoStateService);
  private router = inject(Router);

  readonly identityStatusOptions = IDENTITY_STATUS_OPTIONS;

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  get identityAlert() {
    return getIdentityAlert(this.demoIdentityStatus, this.context);
  }

  get lossText(): string {
    const action = this.blockedAction || this.contextAction;
    if (this.demoIdentityStatus === 'en_revision') {
      return 'Revisando tu documentación — te avisamos por correo';
    }
    if (this.variant === 'home') {
      return 'Cuenta limitada hasta verificar';
    }
    return `Sin validación no puedes ${action}`;
  }

  get ctaLabel(): string {
    const alert = this.identityAlert;
    if (!alert) return '';
    if (this.demoIdentityStatus === 'en_revision') {
      return 'Ver estado de revisión';
    }
    if (this.variant === 'home') {
      return alert.cta;
    }
    const action = this.blockedAction || this.contextAction;
    return `Desbloquear ${action}`;
  }

  private get contextAction(): string {
    const map: Record<IdentityAlertContext, string> = {
      default: 'esta función',
      retiros: 'retirar fondos',
      dropicard: 'solicitar Dropicard',
      bancarios: 'agregar cuentas',
      catalogo: 'crear órdenes',
      pedidos: 'gestionar pedidos',
      proveedores: 'ver proveedores',
      home: 'todas las funciones',
    };
    return map[this.context];
  }

  setDemoIdentityStatus(status: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(status);
    this.statusChange.emit(status);
  }

  resetToSinValidar(): void {
    this.identityDemo.setStatus('sin_validar');
  }

  irAValidar(): void {
    this.router.navigate([this.identityRoute]);
  }
}
