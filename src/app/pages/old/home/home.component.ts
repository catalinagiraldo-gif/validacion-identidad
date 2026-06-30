import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';
import { IdentityActivationCardComponent } from '../../../common/components/identity-activation-card/identity-activation-card.component';
import { getIdentityAlert, IDENTITY_STATUS_OPTIONS } from '../../../config/identity-alerts.config';

interface PopoverConfig {
  type: 'warning' | 'info' | 'error';
  icon: string;
  headline: string;
  text: string;
  step: number;
  stateLabel: string;
}

const POPOVER_SEEN_KEY = 'dropi-home-ia-popover-seen';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, IdentityActivationCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  readonly identityStatusOptions = IDENTITY_STATUS_OPTIONS;
  showPopover = false;
  popoverSeen = false;

  private readonly popoverMap: Record<string, PopoverConfig | null> = {
    sin_validar: {
      type: 'warning',
      icon: 'pi-shield',
      step: 1,
      stateLabel: 'Sin verificar',
      headline: 'Tu cuenta está limitada',
      text: 'Sin verificación no puedes crear pedidos, retirar saldo ni acceder a todos los proveedores.',
    },
    pendiente: {
      type: 'warning',
      icon: 'pi-exclamation-triangle',
      step: 2,
      stateLabel: 'Verificación incompleta',
      headline: 'Tienes documentos pendientes',
      text: 'Empezaste la verificación pero no la completaste. Solo te toma 3 minutos más.',
    },
    en_revision: {
      type: 'info',
      icon: 'pi-clock',
      step: 3,
      stateLabel: 'En revisión',
      headline: 'Revisando tu documentación',
      text: 'Ya tenemos tus datos. Te notificamos por correo cuando terminemos la revisión.',
    },
    rechazado: {
      type: 'error',
      icon: 'pi-times-circle',
      step: 2,
      stateLabel: 'Verificación rechazada',
      headline: 'Necesitas reiniciar la verificación',
      text: 'Hubo un problema con tus documentos. Vuelve a intentarlo, el proceso toma 5 minutos.',
    },
    aprobado: null,
  };

  readonly capacitaciones = [
    { nombre: 'Dropshipper', icon: 'pi-user' },
    { nombre: 'Logística', icon: 'pi-truck' },
    { nombre: 'Shopify', icon: 'pi-shopping-bag' },
    { nombre: 'Módulo de Garantías', icon: 'pi-shield' },
  ];

  get identityAlert() {
    return getIdentityAlert(this.demoIdentityStatus, 'home');
  }

  get showInlineCard(): boolean {
    return !!this.identityAlert && this.popoverSeen;
  }

  get activePopover(): PopoverConfig | null {
    return this.showPopover ? (this.popoverMap[this.demoIdentityStatus] ?? null) : null;
  }

  ngOnInit(): void {
    this.popoverSeen = sessionStorage.getItem(POPOVER_SEEN_KEY) === '1';
    if (this.demoIdentityStatus !== 'aprobado' && !this.popoverSeen) {
      setTimeout(() => { this.showPopover = true; }, 1500);
    }
  }

  onStatusChange(s: IdentitySatelliteStatus): void {
    this.identityDemo.setStatus(s);
    this.showPopover = false;
    if (s !== 'aprobado' && !this.popoverSeen) {
      setTimeout(() => { this.showPopover = true; }, 400);
    }
  }

  irAValidar(): void {
    this.markPopoverSeen();
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  closePopover(): void {
    this.markPopoverSeen();
  }

  private markPopoverSeen(): void {
    sessionStorage.setItem(POPOVER_SEEN_KEY, '1');
    this.popoverSeen = true;
    this.showPopover = false;
  }
}
