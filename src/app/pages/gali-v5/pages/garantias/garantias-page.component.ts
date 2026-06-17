import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliAgentAlertComponent } from '../../components/gali-agent-alert/gali-agent-alert.component';

type GarantiasVariant = 'garantias' | 'ordenes-despacho';

interface GarantiasConfig {
  title: string;
  breadcrumbs: string[];
  showAlert: boolean;
  columns: { key: string; label: string; width?: string }[];
  rows: Record<string, string>[];
}

@Component({
  selector: 'app-garantias-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DropiGaliBarComponent, GaliAgentAlertComponent],
  templateUrl: './garantias-page.component.html',
  styleUrl: './garantias-page.component.scss',
})
export class GarantiasPageComponent implements OnInit {
  private route = inject(ActivatedRoute);

  variant: GarantiasVariant = 'garantias';
  config: GarantiasConfig = GARANTIAS;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.variant = (data['variant'] as GarantiasVariant) ?? 'garantias';
      this.config = this.variant === 'ordenes-despacho' ? ORDENES_DESPACHO : GARANTIAS;
    });
  }
}

const GARANTIAS: GarantiasConfig = {
  title: 'Garantías',
  breadcrumbs: ['Pedidos', 'Garantías'],
  showAlert: true,
  columns: [
    { key: 'check', label: '', width: '82px' },
    { key: 'id', label: 'ID', width: '90px' },
    { key: 'pedido', label: 'Pedido', width: '216px' },
    { key: 'producto', label: 'Producto', width: '216px' },
    { key: 'motivo', label: 'Motivo', width: '160px' },
    { key: 'fecha', label: 'Fecha', width: '188px' },
    { key: 'estado', label: 'Estado', width: '200px' },
    { key: 'acciones', label: 'Acciones', width: '150px' },
  ],
  rows: Array.from({ length: 10 }, (_, i) => ({
    check: '',
    id: String(301 + i),
    pedido: `#${160604 + i}`,
    producto: ['Collar GPS', 'Audífonos Pro', 'Faja Colombiana'][i % 3],
    motivo: ['Producto defectuoso', 'No entregado', 'Daño en transporte'][i % 3],
    fecha: '27/05/2026',
    estado: 'Nueva orden: 35130642',
    acciones: '',
  })),
};

const ORDENES_DESPACHO: GarantiasConfig = {
  title: 'Órdenes de despacho',
  breadcrumbs: ['Pedidos', 'Garantías'],
  showAlert: false,
  columns: [
    { key: 'check', label: '', width: '50px' },
    { key: 'id', label: 'ID', width: '90px' },
    { key: 'bodega', label: 'Bodega', width: '240px' },
    { key: 'pedidos', label: 'Pedidos', width: '240px' },
    { key: 'transportadora', label: 'Transportadora', width: '235px' },
    { key: 'fecha', label: 'Fecha despacho', width: '188px' },
    { key: 'guia', label: 'Guía', width: '200px' },
    { key: 'estado', label: 'Estado', width: '188px' },
    { key: 'acciones', label: 'Acciones', width: '200px' },
  ],
  rows: Array.from({ length: 8 }, (_, i) => ({
    check: '',
    id: `OD-${2026}-${41 + i}`,
    bodega: 'Dropi bodega Bogotá',
    pedidos: String(24 + i),
    transportadora: ['ENVIA', 'COORDINADORA', 'SERVIENTREGA'][i % 3],
    fecha: '27/05/2026',
    guia: '70231456',
    estado: 'Programado',
    acciones: '',
  })),
};
