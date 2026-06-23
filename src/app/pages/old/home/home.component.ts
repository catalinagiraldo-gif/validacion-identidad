import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IdentityDemoStateService } from '../../../common/services/identity-demo-state.service';
import { IdentitySatelliteStatus } from '../../../common/models/identity-flow.models';

interface PopoverConfig {
  type: 'warning' | 'info' | 'error';
  icon: string;
  headline: string;
  text: string;
  step: number;
  stateLabel: string;
}

interface IdentityAlertConfig {
  type: 'warning' | 'info' | 'error';
  icon: string;
  text: string;
  cta: string;
  step: number;
  stateLabel: string;
}

const POPOVER_SEEN_KEY = 'dropi-home-ia-popover-seen';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  private identityDemo = inject(IdentityDemoStateService);

  get demoIdentityStatus(): IdentitySatelliteStatus {
    return this.identityDemo.status();
  }

  readonly identityStatusOptions: IdentitySatelliteStatus[] = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  showPopover = false;
  popoverSeen = false;

  readonly identityAlerts: Record<string, IdentityAlertConfig> = {
    sin_validar: {
      type: 'warning', icon: 'pi-shield', step: 1, stateLabel: 'Sin verificar',
      text: 'Sin verificación no puedes crear pedidos, retirar saldo ni acceder a todos los proveedores.',
      cta: 'Verificar mi identidad',
    },
    pendiente: {
      type: 'warning', icon: 'pi-exclamation-triangle', step: 2, stateLabel: 'Verificación incompleta',
      text: 'Empezaste la verificación pero no la completaste. Solo te toma 3 minutos más.',
      cta: 'Continuar verificación',
    },
    en_revision: {
      type: 'info', icon: 'pi-clock', step: 3, stateLabel: 'En revisión',
      text: 'Ya tenemos tus datos. Te notificamos por correo cuando terminemos la revisión.',
      cta: 'Ver estado de revisión',
    },
    rechazado: {
      type: 'error', icon: 'pi-times-circle', step: 2, stateLabel: 'Verificación rechazada',
      text: 'Hubo un problema con tus documentos. Vuelve a intentarlo, el proceso toma 5 minutos.',
      cta: 'Reintentar verificación',
    },
  };

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
    { nombre: 'Dropshipper',         icon: 'pi-user' },
    { nombre: 'Logística',           icon: 'pi-truck' },
    { nombre: 'Shopify',             icon: 'pi-shopping-bag' },
    { nombre: 'Módulo de Garantías', icon: 'pi-shield' },
  ];

  get identityAlert(): IdentityAlertConfig | null {
    return this.demoIdentityStatus !== 'aprobado' ? (this.identityAlerts[this.demoIdentityStatus] ?? null) : null;
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
