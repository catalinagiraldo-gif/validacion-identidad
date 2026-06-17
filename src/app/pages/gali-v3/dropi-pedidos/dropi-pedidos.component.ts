import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliChatService } from '../../../services/gali-v3/chat.service';

interface AwakeOrder {
  id: string;
  cliente: string;
  ciudad: string;
  tipo: 'direccion_incorrecta' | 'devolucion' | 'fraude' | 'no_entregado';
  estado: 'critica' | 'gali-procesando' | 'resuelta';
  resumen: string;
  accion_gali?: string;
  eta?: string;
}

const MOCK_ORDERS: AwakeOrder[] = [
  { id: '#10847', cliente: 'María González', ciudad: 'Bogotá', tipo: 'fraude', estado: 'critica',
    resumen: 'Cliente con 3 órdenes anteriores rechazadas. Gali requiere tu decisión.' },
  { id: '#10821', cliente: 'Carlos Patiño', ciudad: 'Cali', tipo: 'direccion_incorrecta', estado: 'gali-procesando',
    resumen: 'Dirección incompleta. Gali contactó al cliente por WhatsApp.', accion_gali: 'Esperando respuesta del cliente', eta: '~2h' },
  { id: '#10803', cliente: 'Lina Ramírez', ciudad: 'Medellín', tipo: 'devolucion', estado: 'gali-procesando',
    resumen: 'Cliente quiere devolver. Gali generó guía de retorno automática.', accion_gali: 'Esperando recepción en bodega', eta: '~3d' },
  { id: '#10798', cliente: 'Andrés Vargas', ciudad: 'Barranquilla', tipo: 'no_entregado', estado: 'gali-procesando',
    resumen: 'Reintento programado para mañana 9am.', accion_gali: 'Reintento agendado', eta: 'mañana' },
  { id: '#10790', cliente: 'Diana Caicedo', ciudad: 'Bogotá', tipo: 'direccion_incorrecta', estado: 'resuelta',
    resumen: 'Dirección corregida vía WhatsApp. Pedido entregado.', accion_gali: 'Cerrado · entregado hace 4h' },
  { id: '#10785', cliente: 'Pablo Martínez', ciudad: 'Pereira', tipo: 'devolucion', estado: 'resuelta',
    resumen: 'Reembolso procesado automáticamente.', accion_gali: 'Cerrado · reembolso $89k aplicado' },
  { id: '#10780', cliente: 'Sara Lozano', ciudad: 'Bogotá', tipo: 'no_entregado', estado: 'resuelta',
    resumen: 'Entregada en segundo intento.', accion_gali: 'Cerrado · entregada' },
];

@Component({
  selector: 'app-gali-v3-dropi-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dropi-pedidos.component.html',
  styleUrls: ['./dropi-pedidos.component.scss'],
})
export class GaliV3DropiPedidosComponent {
  private chatSvc = inject(GaliChatService);
  orders = MOCK_ORDERS;

  criticas = this.orders.filter(o => o.estado === 'critica');
  procesando = this.orders.filter(o => o.estado === 'gali-procesando');
  resueltas = this.orders.filter(o => o.estado === 'resuelta');

  aprobar(o: AwakeOrder) {
    this.chatSvc.send(`Aprueba acción Gali para pedido ${o.id}`);
  }

  manejarYo(o: AwakeOrder) {
    this.chatSvc.send(`Quiero manejar yo el pedido ${o.id}`);
  }

  tipoLabel(t: string) {
    return ({
      direccion_incorrecta: 'Dirección',
      devolucion: 'Devolución',
      fraude: 'Posible fraude',
      no_entregado: 'No entregado',
    } as Record<string, string>)[t] ?? t;
  }
}
