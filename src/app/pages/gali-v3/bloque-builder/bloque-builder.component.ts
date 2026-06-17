import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GaliBloqueBuilderService } from '../../../services/gali-v3/bloque-builder.service';
import {
  BloqueCategoria,
  BloqueEjemplo,
  BloqueModoConstruccion,
  BloqueVentanaTemporal,
  BloqueVisualizacion,
} from '../../../services/gali-v3/types';

@Component({
  selector: 'app-gali-v3-bloque-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './bloque-builder.component.html',
  styleUrls: ['./bloque-builder.component.scss'],
})
export class GaliV3BloqueBuilderComponent {
  private svc = inject(GaliBloqueBuilderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('chatScroll') chatScrollRef?: ElementRef<HTMLDivElement>;

  modo = this.svc.modo;
  bloque = this.svc.bloque;
  preview = this.svc.preview;
  historial = this.svc.historial;
  fuentes = this.svc.fuentes;
  visualizaciones = this.svc.visualizaciones;
  ejemplos = this.svc.ejemplos;
  datosReales = this.svc.datosReales;
  compartir = this.svc.compartirComunidad;
  fuenteActiva = this.svc.fuenteActiva;
  visualizacionActiva = this.svc.visualizacionActiva;
  puedeGuardar = this.svc.puedeGuardar;
  advertenciaCosto = this.svc.advertenciaCosto;

  prompt = signal<string>('');
  guardadoOk = signal<boolean>(false);
  mostrarFuenteSelector = signal<boolean>(false);
  mostrarVizSelector = signal<boolean>(false);
  mostrarRazonamiento = signal<boolean>(true);

  readonly ventanas: Array<{ id: BloqueVentanaTemporal; label: string }> = [
    { id: 'hoy', label: 'Hoy' },
    { id: 'ayer', label: 'Ayer' },
    { id: 'ultima_semana', label: 'Última semana' },
    { id: 'ultimo_mes', label: 'Último mes' },
    { id: 'ultimos_3_meses', label: 'Últimos 3 meses' },
    { id: 'ultimos_6_meses', label: 'Últimos 6 meses' },
    { id: 'ultimo_ano', label: 'Último año' },
  ];

  readonly categorias: Array<{ id: BloqueCategoria; label: string; icono: string }> = [
    { id: 'ventas', label: 'Ventas', icono: '💰' },
    { id: 'pedidos', label: 'Pedidos', icono: '📦' },
    { id: 'metricas', label: 'Métricas', icono: '📊' },
    { id: 'analisis', label: 'Análisis', icono: '🔬' },
    { id: 'proyeccion', label: 'Proyección', icono: '📈' },
    { id: 'custom', label: 'Personalizado', icono: '✦' },
  ];

  readonly iconosOpciones = ['✦', '📊', '📈', '💰', '🪣', '👥', '📍', '🔬', '🏆', '🔥', '📦', '🎯'];

  confianzaTier = computed<'alta' | 'media' | 'baja'>(() => {
    const c = this.bloque().confianza_gali;
    if (c >= 0.8) return 'alta';
    if (c >= 0.6) return 'media';
    return 'baja';
  });

  cohorteMax = computed<number>(() => {
    const d = this.preview().data;
    if (!d?.cohortes) return 0;
    return Math.max(...d.cohortes.flatMap(c => c.retencion));
  });

  barrasMax = computed<number>(() => {
    const d = this.preview().data;
    if (!d?.categorias) return 0;
    return Math.max(...d.categorias.flatMap(c => [c.esta_semana, c.semana_pasada]));
  });

  lineasMax = computed<number>(() => {
    const d = this.preview().data;
    if (!d?.series) return 0;
    return Math.max(...d.series.flatMap(s => s.datos.map(p => p.valor)));
  });

  constructor() {
    effect(() => {
      this.historial();
      queueMicrotask(() => {
        const el = this.chatScrollRef?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
      });
    });

    // Preset desde queryParams — permite que Mi Stack / Builder / etc. pre-llenen la fuente
    this.route.queryParamMap.subscribe(qp => {
      const fuente = qp.get('fuente');
      const prompt = qp.get('prompt');
      const origen = qp.get('origen'); // 'mi-stack' | 'builder' | etc.
      if (fuente && this.fuentes().find(f => f.id === fuente)) {
        this.svc.cambiarFuente(fuente);
      }
      if (prompt) {
        this.svc.enviarPrompt(prompt);
      }
      if (origen) {
        // Reservado para mostrar breadcrumb contextual "Vienes de Mi Stack › Crear bloque"
      }
    });
  }

  setModo(modo: BloqueModoConstruccion) {
    this.svc.setModo(modo);
  }

  enviarPrompt() {
    const texto = this.prompt().trim();
    if (!texto) return;
    this.svc.enviarPrompt(texto);
    this.prompt.set('');
  }

  aplicarEjemplo(ejemplo: BloqueEjemplo) {
    this.svc.aplicarEjemplo(ejemplo);
  }

  toggleDatosReales() {
    this.svc.toggleDatosReales();
  }

  toggleCompartir() {
    this.svc.toggleCompartir();
  }

  toggleRazonamiento() {
    this.mostrarRazonamiento.update(v => !v);
  }

  explicarConfianza() {
    this.svc.explicarConfianza();
  }

  cambiarFuente(id: string) {
    this.svc.cambiarFuente(id);
    this.mostrarFuenteSelector.set(false);
  }

  cambiarVisualizacion(tipo: BloqueVisualizacion) {
    this.svc.cambiarVisualizacion(tipo);
    this.mostrarVizSelector.set(false);
  }

  cambiarVentana(v: BloqueVentanaTemporal) {
    this.svc.cambiarVentana(v);
  }

  cambiarCategoria(c: BloqueCategoria) {
    this.svc.actualizarCategoria(c);
  }

  cambiarIcono(icono: string) {
    this.svc.actualizarIcono(icono);
  }

  actualizarTitulo(t: string) {
    this.svc.actualizarTitulo(t);
  }

  actualizarDescripcion(d: string) {
    this.svc.actualizarDescripcion(d);
  }

  removerFiltro(i: number) {
    this.svc.removerFiltro(i);
  }

  guardar() {
    const saved = this.svc.guardar();
    if (saved) {
      this.guardadoOk.set(true);
      setTimeout(() => this.guardadoOk.set(false), 6000);
    }
  }

  cerrar() {
    this.volverAlInicio();
  }

  volverAlInicio() {
    const tieneDraftSinGuardar = this.preview().data !== null && !this.guardadoOk();
    if (tieneDraftSinGuardar && this.bloque().titulo.trim()) {
      const confirmar = window.confirm(
        '¿Salir sin guardar?\n\nTu bloque en construcción no se conservará. Pulsa Cancelar para volver y guardarlo primero.',
      );
      if (!confirmar) return;
    }
    this.router.navigate(['/gali-v3']);
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.volverAlInicio();
  }

  confianzaTexto(c: number): string {
    return `${Math.round(c * 100)}%`;
  }

  formatNumber(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
    return `$${n}`;
  }

  onPromptKey(event: KeyboardEvent) {
    const isMod = event.metaKey || event.ctrlKey;
    if (event.key === 'Enter' && isMod) {
      event.preventDefault();
      this.enviarPrompt();
    }
  }

  polylinePoints(datos: Array<{ fecha: string; valor: number }>, seriesIndex: number): string {
    const max = this.lineasMax() || 1;
    return datos
      .map((p, i) => {
        const x = 40 + (i + (seriesIndex === 1 ? 5 : 0)) * 50;
        const y = 200 - (p.valor / max) * 160;
        return `${x},${y}`;
      })
      .join(' ');
  }

  cohorteEmptySlots(filled: number): unknown[] {
    const slots = Math.max(0, 6 - filled);
    return Array.from({ length: slots });
  }
}
