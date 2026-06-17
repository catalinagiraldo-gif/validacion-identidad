import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { GaliComunidadService } from '../../../services/gali-v3/comunidad.service';
import { GaliChatService } from '../../../services/gali-v3/chat.service';
import {
  AlertaComunidad,
  FiltroComunidadId,
  ProductoTendencia,
  SenalComunidad,
} from '../../../services/gali-v3/types';

@Component({
  selector: 'app-gali-v3-comunidad',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './comunidad.component.html',
  styleUrls: ['./comunidad.component.scss'],
})
export class GaliV3ComunidadComponent {
  private svc = inject(GaliComunidadService);
  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  resumen = this.svc.resumenLider;
  // Data flywheel — explica de dónde viene la inteligencia (V4 Fase 4)
  dataFlywheel = (() => () => {
    const r = this.svc.resumenLider() as unknown as Record<string, unknown>;
    return (r['data_flywheel'] as {
      recipes_activas_aportando: number;
      bloques_compartidos_aportando: number;
      vendedores_publicando: number;
      k_anonymity_min: number;
      data_freshness_minutes: number;
      explicacion: string;
    } | undefined) ?? null;
  })();
  filtros = this.svc.filtros;
  filtroActivo = this.svc.filtroActivo;
  modoMentor = this.svc.modoMentor;
  modoMentorIntro = this.svc.modoMentorIntro;

  productos = this.svc.productos;
  casos = this.svc.casos;
  alertas = this.svc.alertasOrdenadas;
  senales = this.svc.senalesFiltradas;
  top3 = this.svc.top3Movimientos;

  senalExpandida = signal<string | null>(null);
  alertaExpandida = signal<string | null>(null);
  casoExpandido = signal<string | null>(null);
  productoExpandido = signal<string | null>(null);

  cambiarFiltro(f: FiltroComunidadId) {
    this.svc.setFiltro(f);
  }

  toggleMentor() {
    this.svc.toggleMentor();
  }

  toggleSenal(s: SenalComunidad) {
    this.senalExpandida.update(curr => (curr === s.id ? null : s.id));
  }

  toggleAlerta(a: AlertaComunidad) {
    this.alertaExpandida.update(curr => (curr === a.id ? null : a.id));
  }

  toggleCaso(id: string) {
    this.casoExpandido.update(curr => (curr === id ? null : id));
  }

  toggleProducto(p: ProductoTendencia) {
    this.productoExpandido.update(curr => (curr === p.id ? null : p.id));
  }

  aplicarSenal(s: SenalComunidad) {
    this.chatSvc.send(
      `Aplicar señal de comunidad a mi proyecto: "${s.titulo}". Acción sugerida: ${s.accion_sugerida}`,
    );
    this.router.navigateByUrl(s.ruta_aplicar);
  }

  preguntarLider() {
    this.chatSvc.send(
      `Líder virtual, ¿qué tres acciones harías esta semana en mi situación?`,
    );
  }

  preguntarProducto(p: ProductoTendencia) {
    this.chatSvc.send(
      `Cuéntame si "${p.nombre}" tiene sentido para mi negocio. Ya tengo Collar GPS como producto top.`,
    );
  }

  confianzaTexto(v: number) {
    return this.svc.confianzaTexto(v);
  }

  confianzaColor(v: number) {
    return this.svc.confianzaColor(v);
  }

  tipoIcono(tipo: SenalComunidad['tipo']): string {
    if (tipo === 'tendencia') return '↗';
    if (tipo === 'oportunidad') return '✦';
    return '⚡';
  }

  severidadColor(sev: AlertaComunidad['severidad']): string {
    if (sev === 'alta') return 'rust';
    if (sev === 'media') return 'amber';
    return 'sage';
  }

  formatoMiles(n: number): string {
    return new Intl.NumberFormat('es-CO').format(n);
  }
}
