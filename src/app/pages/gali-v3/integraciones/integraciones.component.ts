import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';

interface Plataforma {
  id: string;
  nombre: string;
  glyph: string;
  categoria: 'tienda' | 'ads' | 'mensajeria';
  descripcion: string;
  estado: 'conectada' | 'pendiente' | 'desconectada';
  valor: string;
}

const PLATAFORMAS: Plataforma[] = [
  { id: 'tn',    nombre: 'Tienda Nube',     glyph: 'TN',  categoria: 'tienda',     descripcion: 'Sincroniza catálogo, pedidos y stock en tiempo real.',        estado: 'conectada',    valor: 'Tu tienda en piloto automático.' },
  { id: 'sh',    nombre: 'Shopify',         glyph: 'SH',  categoria: 'tienda',     descripcion: 'Importa productos y procesa pedidos automáticamente.',        estado: 'conectada',    valor: 'Pasa de "manual" a "operación" en 3 clics.' },
  { id: 'wc',    nombre: 'WooCommerce',     glyph: 'WC',  categoria: 'tienda',     descripcion: 'Conecta tu tienda WordPress con el catálogo Dropi.',           estado: 'desconectada', valor: 'Para quien ya tiene WordPress.' },
  { id: 'meta',  nombre: 'Meta Ads',        glyph: 'META',categoria: 'ads',        descripcion: 'Sincroniza píxel, eventos y catálogos de Facebook/Instagram.',  estado: 'conectada',    valor: 'Lanza creative sin salir de Dropi.' },
  { id: 'gads',  nombre: 'Google Ads',      glyph: 'GA',  categoria: 'ads',        descripcion: 'Tracking de conversiones y catálogos en Performance Max.',     estado: 'desconectada', valor: 'Anuncios en Search + Shopping.' },
  { id: 'mc',    nombre: 'Mailchimp',       glyph: 'MC',  categoria: 'ads',        descripcion: 'Email a clientes y leads desde Dropi sin exportar listas.',    estado: 'desconectada', valor: 'Recuperación de carrito automática.' },
  { id: 'wa',    nombre: 'WhatsApp Business',glyph:'WA',  categoria: 'mensajeria', descripcion: 'Mensajes transaccionales y atención al cliente.',              estado: 'pendiente',    valor: 'Cierra ventas por WhatsApp con histórico.' },
];

@Component({
  selector: 'app-gali-v3-integraciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss'],
})
export class GaliV3IntegracionesComponent {
  plataformas = signal<Plataforma[]>(PLATAFORMAS);

  modalAbierto = signal<Plataforma | null>(null);
  paso = signal<1 | 2 | 3>(1);
  apiKey = signal('');

  readonly categorias = [
    { id: 'tienda',     label: 'Tiendas',       hint: 'Tu catálogo y pedidos' },
    { id: 'ads',        label: 'Publicidad',    hint: 'Campañas y tracking' },
    { id: 'mensajeria', label: 'Mensajería',    hint: 'Atención y notificaciones' },
  ] as const;

  porCategoria(cat: Plataforma['categoria']): Plataforma[] {
    return this.plataformas().filter(p => p.categoria === cat);
  }

  conectadas = () => this.plataformas().filter(p => p.estado === 'conectada').length;

  abrirModal(p: Plataforma) {
    if (p.estado === 'conectada') return;
    this.modalAbierto.set(p);
    this.paso.set(1);
    this.apiKey.set('');
  }

  cerrarModal() { this.modalAbierto.set(null); }

  avanzar() {
    if (this.paso() === 3) {
      const p = this.modalAbierto();
      if (p) {
        this.plataformas.update(list => list.map(x => x.id === p.id ? { ...x, estado: 'conectada' } : x));
      }
      this.cerrarModal();
      return;
    }
    this.paso.update(p => (p + 1) as 1 | 2 | 3);
  }

  retroceder() {
    if (this.paso() === 1) return;
    this.paso.update(p => (p - 1) as 1 | 2 | 3);
  }

  labelEstado(e: Plataforma['estado']): string {
    return e === 'conectada' ? 'conectada' : e === 'pendiente' ? 'falta configurar' : 'sin conectar';
  }
}
