import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { SignalHighlightDirective } from '../../../components/gali-v3/shared/signal-highlight.directive';

interface AwakeCampaign {
  id: string;
  nombre: string;
  plataforma: 'Meta' | 'TikTok';
  roas: number;
  ctr: number;
  presupuesto: number;
  salud: 'buena' | 'media' | 'mala';
  salud_score: number;
  gali_dice: string;
  accion_sugerida: string;
}

const MOCK_CAMPAIGNS: AwakeCampaign[] = [
  { id: 'c1', nombre: 'Collar GPS — Mamá Bogotá', plataforma: 'Meta', roas: 2.8, ctr: 3.4, presupuesto: 80000, salud: 'buena', salud_score: 8.2,
    gali_dice: 'Funcionando bien. Creative B tiene 2x más CTR que el A. Considera pausar el A.',
    accion_sugerida: 'Pausar creative A' },
  { id: 'c2', nombre: 'Difusor aromaterapia — TikTok', plataforma: 'TikTok', roas: 3.6, ctr: 4.1, presupuesto: 45000, salud: 'buena', salud_score: 9.1,
    gali_dice: 'Excelente. Sostenido 4 días. Listo para escalar 2x.',
    accion_sugerida: 'Escalar presupuesto a $90k' },
  { id: 'c3', nombre: 'Set yoga — Resoluciones', plataforma: 'Meta', roas: 0.9, ctr: 1.1, presupuesto: 20000, salud: 'mala', salud_score: 2.4,
    gali_dice: 'Estás perdiendo $4k/día. Ángulo no resuena. Top vendedores usan "cuerpo sano sin gym", no "tonificar".',
    accion_sugerida: 'Cambiar ángulo y pausar' },
];

@Component({
  selector: 'app-gali-v3-dropi-campanas',
  standalone: true,
  imports: [CommonModule, RouterModule, SignalHighlightDirective],
  templateUrl: './dropi-campanas.component.html',
  styleUrls: ['./dropi-campanas.component.scss'],
})
export class GaliV3DropiCampanasComponent {
  private chatSvc = inject(GaliChatService);
  campaigns = MOCK_CAMPAIGNS;

  ejecutar(c: AwakeCampaign) {
    this.chatSvc.send(`Ejecuta para campaña ${c.nombre}: ${c.accion_sugerida}`);
  }

  format(n: number): string {
    return `$${n.toLocaleString('es-CO')}`;
  }
}
