import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface PopoverConfig {
  type: 'warning' | 'info' | 'error';
  icon: string;
  headline: string;
  text: string;
  step: number;
  stateLabel: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  showPopover = false;

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

  get activePopover(): PopoverConfig | null {
    return this.showPopover ? (this.popoverMap[this.demoIdentityStatus] ?? null) : null;
  }

  ngOnInit(): void {
    if (this.demoIdentityStatus !== 'aprobado') {
      setTimeout(() => { this.showPopover = true; }, 1500);
    }
  }

  onStatusChange(s: string): void {
    this.demoIdentityStatus = s;
    this.showPopover = false;
    if (s !== 'aprobado') {
      setTimeout(() => { this.showPopover = true; }, 400);
    }
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  closePopover(): void {
    this.showPopover = false;
  }
}
