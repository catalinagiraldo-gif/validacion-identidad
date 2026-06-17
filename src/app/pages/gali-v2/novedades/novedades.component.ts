import { CommonModule, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GaliMarkComponent } from '../../../components/gali-v2/gali-mark/gali-mark.component';
import { GaliHeaderInputComponent } from '../../../components/gali-v2/gali-header-input/gali-header-input.component';
import { GaliResponseOverlayComponent } from '../../../components/gali-v2/gali-response-overlay/gali-response-overlay.component';
import novedadesData from '../../../../../mocks/gali-v2/novedades-triage.json';

type Estado = 'pendiente' | 'procesando' | 'resuelto';

interface Novedad {
  id: string;
  tipo: string;
  pedido_id: string;
  cliente: string;
  ciudad: string;
  fecha?: string;
  estado_gali: Estado;
  accion_gali: string;
  requiere_humano?: boolean;
  urgencia: 'alta' | 'media' | 'baja';
  monto_riesgo_cop?: number;
  eta?: string;
}

@Component({
  selector: 'app-novedades',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    DecimalPipe,
    GaliMarkComponent,
    GaliHeaderInputComponent,
    GaliResponseOverlayComponent,
  ],
  templateUrl: './novedades.component.html',
  styleUrls: ['./novedades.component.scss'],
})
export class NovedadesComponent implements OnInit {
  novedades = signal<Novedad[]>([]);
  expandida = signal<string | null>(null);
  resueltasExpandidas = signal(false);

  criticas = computed(() => this.novedades().filter(n => n.estado_gali === 'pendiente'));
  enProceso = computed(() => this.novedades().filter(n => n.estado_gali === 'procesando'));
  resueltas = computed(() => this.novedades().filter(n => n.estado_gali === 'resuelto'));

  perdidaPotencial = computed(() =>
    this.criticas().reduce((sum, n) => sum + (n.monto_riesgo_cop ?? 0), 0),
  );

  ngOnInit() {
    this.novedades.set(novedadesData.novedades as Novedad[]);
  }

  expandir(id: string) {
    this.expandida.update(curr => (curr === id ? null : id));
  }

  aprobarAccionGali(n: Novedad) {
    this.novedades.update(arr =>
      arr.map(x =>
        x.id === n.id
          ? {
              ...x,
              estado_gali: 'procesando' as Estado,
              accion_gali: 'Aprobado. Ejecutando ahora — te aviso cuando termine.',
              eta: '~10min',
            }
          : x,
      ),
    );
    this.expandida.set(null);
  }

  manejarYo(n: Novedad) {
    this.expandida.set(null);
  }

  toggleResueltas() {
    this.resueltasExpandidas.update(v => !v);
  }
}
