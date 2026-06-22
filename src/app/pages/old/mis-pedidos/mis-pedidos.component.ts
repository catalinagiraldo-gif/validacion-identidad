import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface PedidoClient {
  name: string;
  address: string;
  phone: string;
  addressStatus: 'verified' | 'warning' | 'error';
}

interface Pedido {
  id: number;
  product: string;
  client: PedidoClient;
  status: string;
  trackingNumber: string | null;
  transportadora: string;
  bodega: string;
  tipoEnvio: string;
  storeBadge: string;
  orderId: string;
  date: string;
  etiqueta: boolean;
  huellaStatus: 'clean' | 'alert';
  notificaciones: number;
  actions: string[];
}

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.scss'],
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  searchQuery = '';
  showActionsDropdown = false;

  demoIdentityStatus = 'sin_validar';
  readonly identityStatusOptions = ['sin_validar', 'pendiente', 'en_revision', 'rechazado', 'aprobado'];
  readonly blockedAction = 'gestionar pedidos';

  private readonly alertsMap: Record<string, { type: string; icon: string; text: string; cta: string; step: number; stateLabel: string }> = {
    sin_validar: { type: 'warning', icon: 'pi-shield',                step: 1, stateLabel: 'Sin validar',                text: 'Aún no puedes gestionar pagos de pedidos. Valida tu identidad para activar el procesamiento.', cta: 'Validar identidad' },
    pendiente:   { type: 'warning', icon: 'pi-exclamation-triangle',  step: 2, stateLabel: 'Verificación incompleta',    text: 'Terminaste a medias tu verificación. Un paso más y los pagos de tus pedidos quedan activos.', cta: 'Continuar verificación' },
    en_revision: { type: 'info',    icon: 'pi-clock',                 step: 3, stateLabel: 'En revisión',                text: 'Tu identidad está en revisión. Te avisamos en cuanto esté aprobada para activar el procesamiento.', cta: 'Ver estado' },
    rechazado:   { type: 'error',   icon: 'pi-times-circle',          step: 2, stateLabel: 'Verificación rechazada',     text: 'Tu verificación fue rechazada. Reintenta para desbloquear el procesamiento de tus pedidos.', cta: 'Reintentar verificación' },
  };

  get identityAlert() {
    return this.demoIdentityStatus !== 'aprobado' ? this.alertsMap[this.demoIdentityStatus] : null;
  }

  irAValidar(): void {
    this.router.navigate(['/old/configuraciones/flujo-identidad-2026-06-18']);
  }

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.http.get<Pedido[]>('/api/pedidos').subscribe(data => {
      this.pedidos = data;
    });
  }

  get filteredPedidos(): Pedido[] {
    if (!this.searchQuery.trim()) return this.pedidos;
    const q = this.searchQuery.toLowerCase();
    return this.pedidos.filter(p =>
      p.id.toString().includes(q) ||
      p.product.toLowerCase().includes(q) ||
      p.client.name.toLowerCase().includes(q) ||
      p.client.phone.includes(q)
    );
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDIENTE': return 'status-pending';
      case 'GUÍA GENERADA': return 'status-generated';
      case 'PENDIENTE DE CONFIRMACIÓN': return 'status-confirmation';
      default: return 'status-pending';
    }
  }

  getMarkerIcon(status: string): string {
    const map: Record<string, string> = {
      verified: 'assets/icons/pedidos/map-marker-check.svg',
      warning: 'assets/icons/pedidos/map-marker-exclamation.svg',
      error: 'assets/icons/pedidos/map-marker-cross.svg',
    };
    return map[status] || map['verified'];
  }

  toggleActionsDropdown(): void {
    this.showActionsDropdown = !this.showActionsDropdown;
  }

  hasAction(pedido: Pedido, action: string): boolean {
    return pedido.actions.includes(action);
  }
}
