import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropiTitulosComponent, DropiButtonNewComponent } from '../../components/shared';
import { DropiGaliBarComponent } from '../../components/dropi-gali-bar/dropi-gali-bar.component';
import { GaliInsightDirective } from '../../directives/gali-insight.directive';
import { GaliAgentAlertComponent } from '../../components/gali-agent-alert/gali-agent-alert.component';

interface CarrierIndicator {
  carrier: string;
  myOpEffectiveness: number;
  dropiEffectiveness: number;
  avgFreight: string;
  deliveryTime: string;
  deliveryTimeDropi: string;
}

interface SmartRoutingRow {
  ciudad: string;
  transportadoraActual: string;
  transportadoraSugerida: string;
  motivoNovedad: number;
  estado: 'activo' | 'aplicar' | 'ok';
  pedidosPendientes: number;
}

@Component({
  selector: 'app-torre-logistica-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiTitulosComponent, DropiButtonNewComponent, DropiGaliBarComponent, GaliInsightDirective, GaliAgentAlertComponent],
  templateUrl: './torre-logistica-page.component.html',
  styleUrl: './torre-logistica-page.component.scss',
})
export class TorreLogisticaPageComponent {
  miOperacion = true;
  dropiView = false;
  readonly breadcrumbs = ['Logística', 'Torre logística'];
  readonly smartRoutingApplied = signal(false);

  readonly smartRoutingRows: SmartRoutingRow[] = [
    { ciudad: 'Bogotá', transportadoraActual: 'Coordinadora', transportadoraSugerida: 'Servientrega', motivoNovedad: 15, estado: 'activo', pedidosPendientes: 12 },
    { ciudad: 'Cali', transportadoraActual: 'Veloces', transportadoraSugerida: 'Envía', motivoNovedad: 9, estado: 'aplicar', pedidosPendientes: 4 },
    { ciudad: 'Medellín', transportadoraActual: 'Coordinadora', transportadoraSugerida: 'Coordinadora', motivoNovedad: 3, estado: 'ok', pedidosPendientes: 0 },
    { ciudad: 'Bucaramanga', transportadoraActual: 'Servientrega', transportadoraSugerida: 'Servientrega', motivoNovedad: 2, estado: 'ok', pedidosPendientes: 0 },
  ];

  applySmartRouting(): void {
    this.smartRoutingApplied.set(true);
  }

  readonly indicators: CarrierIndicator[] = [
    { carrier: 'Veloces', myOpEffectiveness: 60, dropiEffectiveness: 40, avgFreight: '$15.800', deliveryTime: '4,5 días', deliveryTimeDropi: '4,5 días' },
    { carrier: 'Servientrega', myOpEffectiveness: 20, dropiEffectiveness: 55, avgFreight: '$15.800', deliveryTime: '5 días', deliveryTimeDropi: '5,5 días' },
    { carrier: 'Coordinadora', myOpEffectiveness: 75, dropiEffectiveness: 62, avgFreight: '$14.200', deliveryTime: '3,5 días', deliveryTimeDropi: '4 días' },
    { carrier: 'Envía', myOpEffectiveness: 48, dropiEffectiveness: 35, avgFreight: '$16.500', deliveryTime: '5 días', deliveryTimeDropi: '5 días' },
  ];

  readonly mapPins = [
    { carrier: 'Veloces', x: 180, y: 200 },
    { carrier: 'Servientrega', x: 220, y: 160 },
    { carrier: 'Coordinadora', x: 150, y: 280 },
    { carrier: 'Envía', x: 240, y: 320 },
  ];
}
