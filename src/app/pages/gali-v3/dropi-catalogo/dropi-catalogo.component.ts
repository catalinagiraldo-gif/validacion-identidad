import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import { SignalHighlightDirective } from '../../../components/gali-v3/shared/signal-highlight.directive';

interface AwakeProduct {
  id: string;
  name: string;
  image?: string;
  costo: number;
  precio: number;
  margen: number;
  categoria: string;
  ciudad: string;
  ventas_semana: number;
  tendencia_pct: number;
  ventana_dias: number;
  angulos: Array<{ titulo: string; porcentaje: number; tono: string; hook?: string }>;
  badges: string[];
}

const MOCK_PRODUCTS: AwakeProduct[] = [
  {
    id: 'p1',
    name: 'Collar GPS para perros',
    costo: 26000, precio: 89000, margen: 71,
    categoria: 'Mascotas', ciudad: 'Bogotá',
    ventas_semana: 340, tendencia_pct: 23, ventana_dias: 14,
    angulos: [
      { titulo: 'Mamá / seguridad emocional', porcentaje: 38, tono: 'emocional', hook: '¿Sabes dónde está tu perro en este momento?' },
      { titulo: 'Regalo ideal para dueños', porcentaje: 29, tono: 'aspiracional' },
      { titulo: 'Control sin ansiedad', porcentaje: 22, tono: 'racional' },
    ],
    badges: ['🔥 En alza', 'Verificado'],
  },
  {
    id: 'p2',
    name: 'Difusor de aromaterapia LED',
    costo: 22000, precio: 58000, margen: 68,
    categoria: 'Hogar', ciudad: 'Medellín',
    ventas_semana: 412, tendencia_pct: 340, ventana_dias: 10,
    angulos: [
      { titulo: 'Hogar zen / autocuidado', porcentaje: 45, tono: 'emocional' },
      { titulo: 'Decoración con propósito', porcentaje: 32, tono: 'aspiracional' },
    ],
    badges: ['⚡ Explotando', 'Compatible con tu perfil'],
  },
  {
    id: 'p3',
    name: 'Lámpara recargable portátil',
    costo: 18000, precio: 45000, margen: 60,
    categoria: 'Hogar', ciudad: 'Cali',
    ventas_semana: 89, tendencia_pct: 12, ventana_dias: 21,
    angulos: [
      { titulo: 'Cortes de luz / emergencia', porcentaje: 52, tono: 'racional' },
      { titulo: 'Outdoor / camping', porcentaje: 28, tono: 'aspiracional' },
    ],
    badges: ['Estable'],
  },
  {
    id: 'p4',
    name: 'Cargador inalámbrico 3 en 1',
    costo: 32000, precio: 95000, margen: 66,
    categoria: 'Tech', ciudad: 'Bogotá',
    ventas_semana: 156, tendencia_pct: 45, ventana_dias: 18,
    angulos: [
      { titulo: 'Productividad / home office', porcentaje: 41, tono: 'racional' },
      { titulo: 'Regalo premium', porcentaje: 33, tono: 'aspiracional' },
    ],
    badges: ['Margen 66%'],
  },
  {
    id: 'p5',
    name: 'Set yoga premium 6 piezas',
    costo: 29000, precio: 79000, margen: 63,
    categoria: 'Fitness', ciudad: 'Bogotá',
    ventas_semana: 218, tendencia_pct: 56, ventana_dias: 12,
    angulos: [
      { titulo: 'Resoluciones / nuevo año tú', porcentaje: 48, tono: 'aspiracional' },
      { titulo: 'Cuerpo sano sin gym', porcentaje: 31, tono: 'emocional' },
    ],
    badges: ['Estacional'],
  },
  {
    id: 'p6',
    name: 'Mini proyector portátil 1080p',
    costo: 145000, precio: 320000, margen: 55,
    categoria: 'Tech', ciudad: 'Medellín',
    ventas_semana: 47, tendencia_pct: 8, ventana_dias: 30,
    angulos: [
      { titulo: 'Cine en casa', porcentaje: 60, tono: 'aspiracional' },
    ],
    badges: ['Premium'],
  },
];

@Component({
  selector: 'app-gali-v3-dropi-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, SignalHighlightDirective],
  templateUrl: './dropi-catalogo.component.html',
  styleUrls: ['./dropi-catalogo.component.scss'],
})
export class GaliV3DropiCatalogoComponent {
  private chatSvc = inject(GaliChatService);

  products = signal<AwakeProduct[]>(MOCK_PRODUCTS);
  awakenedId = signal<string | null>(null);

  toggleAwake(id: string) {
    this.awakenedId.set(this.awakenedId() === id ? null : id);
  }

  closeAwake() {
    this.awakenedId.set(null);
  }

  analizar(p: AwakeProduct) {
    this.chatSvc.send(`Analiza este producto: ${p.name}`);
  }

  crearLanding(p: AwakeProduct) {
    this.chatSvc.send(`Crea una landing para ${p.name} usando el ángulo principal`);
  }

  generarAngulos(p: AwakeProduct) {
    this.chatSvc.send(`Genera ángulos de venta para ${p.name}`);
  }

  format(n: number): string {
    return `$${n.toLocaleString('es-CO')}`;
  }
}
