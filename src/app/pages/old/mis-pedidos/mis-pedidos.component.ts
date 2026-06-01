import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}

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
