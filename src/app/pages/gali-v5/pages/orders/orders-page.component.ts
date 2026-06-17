import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import ordersData from '../../../../../../mocks/gali-v5/orders.json';
import { DropiGaliBarComponent, GaliBarStat } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliWorkspaceService } from '../../services/gali-workspace.service';
import { GaliInsightDirective } from '../../directives/gali-insight.directive';

interface OrderRow {
  id: string;
  product: string;
  clientName: string;
  address: string;
  phone: string;
  addressValid: boolean;
  carrier: string;
  guide: string;
  recaudo: string;
  statusTags: string[];
  riskLevel?: 'verde' | 'amarillo' | 'rojo';
  riskLabel?: string;
}

type GaliTriageStatus = 'ok' | 'managing' | 'decision' | 'auto';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiGaliBarComponent, GaliInsightDirective],
  templateUrl: './orders-page.component.html',
  styleUrl: './orders-page.component.scss',
})
export class OrdersPageComponent {
  private router = inject(Router);
  private ws = inject(GaliWorkspaceService);

  searchQuery = '';
  readonly breadcrumbs = ['Pedidos', 'Ordenes'];

  goToSignals(): void {
    this.ws.setMode('operar');
    this.router.navigate(['/gali-v5']);
  }
  readonly orders: OrderRow[] = ordersData.orders;

  readonly galiStats: GaliBarStat[] = [
    { value: 31, label: 'confirmadas auto', variant: 'ok' },
    { value: 8, label: 'Chatea Pro gestionando', variant: 'neutral' },
    { value: 3, label: 'requieren tu decisión', variant: 'warn' },
    { value: 47, label: 'pedidos hoy' },
  ];

  // Per-order Gali status (maps order ID → triage status)
  readonly galiStatus: Record<string, GaliTriageStatus> = {
    '160604': 'auto',
    '160605': 'managing',
    '160606': 'decision',
    '160607': 'ok',
    '160608': 'managing',
    '160609': 'auto',
    '160610': 'decision',
  };

  getGaliStatus(id: string): GaliTriageStatus {
    return this.galiStatus[id] ?? 'ok';
  }

  getGaliLabel(id: string): string {
    const s = this.getGaliStatus(id);
    return {
      auto: '✦ Confirmada auto',
      managing: '✦ Gali gestionando',
      decision: '✦ Tu decisión',
      ok: '',
    }[s];
  }

  getGaliChipClass(id: string): string {
    const s = this.getGaliStatus(id);
    return {
      auto: 'gali-chip--auto',
      managing: 'gali-chip--managing',
      decision: 'gali-chip--decision',
      ok: '',
    }[s];
  }

  private readonly riskByOrder: Record<string, { level: 'verde' | 'amarillo' | 'rojo'; label: string; hint: string }> = {
    '160604': { level: 'verde', label: 'Huella verde', hint: 'Cliente recurrente · sin novedades recientes' },
    '160605': { level: 'amarillo', label: 'Revisar', hint: '2 novedades en 90 días · Chatea Pro confirmando' },
    '160606': { level: 'rojo', label: 'Alto riesgo', hint: 'Zona rural + historial de devolución · anticipo recomendado' },
    '160607': { level: 'verde', label: 'Huella verde', hint: 'Pedido estándar Bogotá' },
    '160608': { level: 'amarillo', label: 'Revisar', hint: 'Primera compra · monto alto' },
    '160609': { level: 'verde', label: 'Huella verde', hint: 'Confirmación automática elegible' },
    '160610': { level: 'rojo', label: 'Alto riesgo', hint: 'Patrón fraude: 3 pedidos cancelados mismo barrio' },
  };

  getRiskLevel(o: OrderRow): { level: 'verde' | 'amarillo' | 'rojo'; label: string; hint: string } | null {
    return this.riskByOrder[o.id] ?? { level: 'verde', label: 'Sin alerta', hint: 'Vigilante no detectó riesgo' };
  }

  getCarrierInsight(carrier: string): string {
    const insights: Record<string, string> = {
      'Coordinadora': 'Coordinadora Bogotá: 15% novedad hoy — 3× el umbral. Vigilante recomienda Servientrega (3.8%). Efectividad 30 días: 75%.',
      'Servientrega': 'Servientrega: 3.8% novedad. Ruta más segura para Bogotá esta semana. Tiempo promedio: 5 días. Vigilante tiene routing activo.',
      'Veloces': 'Veloces: 5.2% novedad en Medellín. Rendimiento estable. Mejor opción para entregas express en Antioquia.',
      'Envía': 'Envía: 6.1% novedad. Mejor en ciudades intermedias. Vigilante monitorea su rendimiento en tiempo real.',
    };
    return insights[carrier] ?? `${carrier}: Vigilante monitorea en tiempo real. Sin alertas críticas esta semana.`;
  }
}
