import { Injectable, computed, signal } from '@angular/core';
import bloquesData from '../../../../mocks/gali-v3/bloques-custom-ejemplos.json';
import bloquesComunidadData from '../../../../mocks/gali-v3/bloques-comunidad.json';
import {
  BloqueCategoria,
  BloqueChatMessage,
  BloqueComunidad,
  BloqueComunidadCategoria,
  BloquesComunidadMeta,
  BloqueCostoComputacional,
  BloqueCustom,
  BloqueEjemplo,
  BloqueFiltro,
  BloqueFuente,
  BloqueModoConstruccion,
  BloquePreviewData,
  BloquePreviewState,
  BloqueTipoVisualizacion,
  BloqueVentanaTemporal,
  BloqueVisualizacion,
} from './types';

interface RawData {
  ejemplos_iniciales: BloqueEjemplo[];
  fuentes_disponibles: BloqueFuente[];
  tipos_visualizacion: BloqueTipoVisualizacion[];
  bloque_construccion_default: BloqueCustom;
  previews_demo: Record<string, BloquePreviewData>;
  respuestas_gali_iteracion: Record<string, string>;
}

interface ComunidadFile {
  meta: BloquesComunidadMeta;
  categorias_filtro: BloqueComunidadCategoria[];
  bloques: BloqueComunidad[];
}

const data = bloquesData as unknown as RawData;
const comunidadData = bloquesComunidadData as unknown as ComunidadFile;

const STORAGE_KEY_BLOQUES_GUARDADOS = 'gali_v3_bloques_custom';

@Injectable({ providedIn: 'root' })
export class GaliBloqueBuilderService {
  readonly ejemplos = signal<BloqueEjemplo[]>(data.ejemplos_iniciales);
  readonly fuentes = signal<BloqueFuente[]>(data.fuentes_disponibles);
  readonly visualizaciones = signal<BloqueTipoVisualizacion[]>(data.tipos_visualizacion);

  readonly modo = signal<BloqueModoConstruccion>('chat');
  readonly bloque = signal<BloqueCustom>(this.cloneDefault());
  readonly preview = signal<BloquePreviewState>({ cargando: false, vacio: true, data: null });
  readonly historial = signal<BloqueChatMessage[]>([]);
  readonly datosReales = signal<boolean>(false);
  readonly compartirComunidad = signal<boolean>(false);
  readonly bloquesGuardados = signal<BloqueCustom[]>(this.loadGuardados());

  // Marketplace — bloques publicados por la comunidad (Fase 3)
  readonly bloquesComunidad = signal<BloqueComunidad[]>(comunidadData.bloques);
  readonly comunidadMeta = signal<BloquesComunidadMeta>(comunidadData.meta);
  readonly comunidadCategorias = signal<BloqueComunidadCategoria[]>(comunidadData.categorias_filtro);

  readonly hayPreview = computed(() => this.preview().data !== null);
  readonly fuenteActiva = computed<BloqueFuente | null>(() => {
    const id = this.bloque().fuente_id;
    if (!id) return null;
    return this.fuentes().find(f => f.id === id) ?? null;
  });
  readonly visualizacionActiva = computed<BloqueTipoVisualizacion | null>(() => {
    const tipo = this.bloque().tipo_visualizacion;
    return this.visualizaciones().find(v => v.id === tipo) ?? null;
  });
  readonly puedeGuardar = computed(() => {
    const b = this.bloque();
    return !!b.titulo.trim() && !!b.fuente_id && this.hayPreview();
  });
  readonly advertenciaCosto = computed(() => this.bloque().costo_computacional.advertencia);

  setModo(modo: BloqueModoConstruccion) {
    this.modo.set(modo);
  }

  reset() {
    this.bloque.set(this.cloneDefault());
    this.preview.set({ cargando: false, vacio: true, data: null });
    this.historial.set([]);
    this.datosReales.set(false);
    this.compartirComunidad.set(false);
  }

  aplicarEjemplo(ejemplo: BloqueEjemplo) {
    this.appendUserMessage(ejemplo.prompt_origen);
    this.preview.set({ cargando: true, vacio: false, data: null });
    setTimeout(() => this.cargarPreviewDemo(ejemplo), 700);
  }

  enviarPrompt(texto: string) {
    const trimmed = texto.trim();
    if (!trimmed) return;
    this.appendUserMessage(trimmed);
    const ejemploMatch = this.matchEjemplo(trimmed);
    this.preview.set({ cargando: true, vacio: false, data: null });
    setTimeout(() => {
      if (ejemploMatch) {
        this.cargarPreviewDemo(ejemploMatch);
      } else {
        this.aplicarIteracion(trimmed);
      }
    }, 700);
  }

  actualizarTitulo(titulo: string) {
    this.bloque.update(b => ({ ...b, titulo }));
  }

  actualizarDescripcion(descripcion: string) {
    this.bloque.update(b => ({ ...b, descripcion }));
  }

  actualizarCategoria(categoria: BloqueCategoria) {
    this.bloque.update(b => ({ ...b, categoria }));
  }

  actualizarIcono(icono: string) {
    this.bloque.update(b => ({ ...b, icono }));
  }

  cambiarFuente(fuenteId: string) {
    this.bloque.update(b => ({ ...b, fuente_id: fuenteId }));
    this.appendGaliMessage(
      `Listo, cambié la fuente a "${this.fuentes().find(f => f.id === fuenteId)?.label}". Estoy regenerando el preview con esos datos.`,
      ['Fuente actualizada'],
    );
    this.regenerarPreviewDesdeBloque();
  }

  cambiarVisualizacion(tipo: BloqueVisualizacion) {
    this.bloque.update(b => ({ ...b, tipo_visualizacion: tipo }));
    const viz = this.visualizaciones().find(v => v.id === tipo);
    this.appendGaliMessage(
      `Cambié la visualización a "${viz?.label ?? tipo}". Conserva los mismos filtros y ventana temporal.`,
      ['Visualización actualizada'],
    );
    this.regenerarPreviewDesdeBloque();
  }

  cambiarVentana(ventana: BloqueVentanaTemporal) {
    this.bloque.update(b => ({ ...b, ventana_temporal: ventana }));
    this.regenerarPreviewDesdeBloque();
  }

  agregarFiltro(filtro: BloqueFiltro) {
    this.bloque.update(b => ({ ...b, filtros: [...b.filtros, filtro] }));
  }

  removerFiltro(index: number) {
    this.bloque.update(b => ({ ...b, filtros: b.filtros.filter((_, i) => i !== index) }));
  }

  toggleDatosReales() {
    this.datosReales.update(v => !v);
    const usandoReales = this.datosReales();
    this.bloque.update(b => ({ ...b, datos_simulados: !usandoReales }));
    const data = this.preview().data;
    if (data) {
      this.preview.set({
        cargando: false,
        vacio: false,
        data: { ...data, datos_simulados: !usandoReales },
      });
    }
    this.appendGaliMessage(
      usandoReales
        ? 'Cargué tus datos reales en el preview. Ahora ves números de tu operación, no simulados.'
        : 'Volví a datos simulados para que puedas iterar sin afectar el costo de procesamiento.',
      [usandoReales ? 'Datos reales ON' : 'Datos simulados ON'],
    );
  }

  toggleCompartir() {
    this.compartirComunidad.update(v => !v);
  }

  // ---------- Marketplace de comunidad ----------
  /** Comprueba si un bloque de la comunidad ya fue instalado por el usuario */
  estaInstalado(comunidadId: string): boolean {
    return this.bloquesGuardados().some(b => b.id === `com-installed-${comunidadId}`);
  }

  /** Instala un bloque de la comunidad clonándolo al store local del usuario */
  instalarBloqueComunidad(c: BloqueComunidad): BloqueCustom | null {
    if (this.estaInstalado(c.id)) return null;
    const fuente = this.fuentes().find(f => f.id === c.fuente_id);
    const clonado: BloqueCustom = {
      id: `com-installed-${c.id}`,
      titulo: c.titulo,
      descripcion: c.descripcion,
      categoria: c.categoria,
      icono: c.icono,
      fuente_id: c.fuente_id,
      tipo_visualizacion: c.tipo_visualizacion,
      filtros: [],
      ventana_temporal: c.ventana_temporal,
      ordenamiento: null,
      datos_simulados: true,
      confianza_gali: c.confianza_promedio,
      razonamiento_gali: `Bloque instalado desde la comunidad. Autor original: ${c.creado_por}. ${c.instalaciones} dropshippers lo usan. Rating ${c.rating}/5.`,
      costo_computacional: {
        registros_a_procesar: 0,
        tiempo_estimado_ms: 0,
        advertencia: fuente?.requiere_stack?.length
          ? `Este bloque rinde mejor con ${fuente.requiere_stack.join(', ')} conectado en Mi Stack.`
          : null,
      },
    };
    const all = [...this.bloquesGuardados(), clonado];
    this.bloquesGuardados.set(all);
    this.persistGuardados(all);
    return clonado;
  }

  /** Desinstala un bloque de la comunidad — solo si fue instalado desde marketplace */
  desinstalarBloqueComunidad(comunidadId: string) {
    const targetId = `com-installed-${comunidadId}`;
    const all = this.bloquesGuardados().filter(b => b.id !== targetId);
    this.bloquesGuardados.set(all);
    this.persistGuardados(all);
  }

  guardar(): BloqueCustom | null {
    if (!this.puedeGuardar()) return null;
    const b = this.bloque();
    const guardado: BloqueCustom = { ...b, id: `bloque-${Date.now()}` };
    const all = [...this.bloquesGuardados(), guardado];
    this.bloquesGuardados.set(all);
    this.persistGuardados(all);
    this.appendGaliMessage(
      `Guardé "${guardado.titulo}" en tus bloques. ${this.compartirComunidad() ? 'Lo compartí también con la comunidad — recibirás reportes de cuántos lo instalan.' : 'Solo está en tu cuenta, no se comparte.'}`,
      ['Bloque guardado'],
    );
    return guardado;
  }

  explicarConfianza() {
    const explicacion = data.respuestas_gali_iteracion['explicar_confianza'];
    this.appendGaliMessage(explicacion, ['Razonamiento de confianza']);
  }

  // ---------- internals ----------
  private cloneDefault(): BloqueCustom {
    return JSON.parse(JSON.stringify(data.bloque_construccion_default)) as BloqueCustom;
  }

  private cargarPreviewDemo(ejemplo: BloqueEjemplo) {
    const previewData = data.previews_demo[ejemplo.id];
    if (!previewData) return;
    this.bloque.update(b => ({
      ...b,
      titulo: ejemplo.titulo,
      descripcion: ejemplo.descripcion_corta,
      categoria: ejemplo.categoria,
      icono: ejemplo.icono,
      fuente_id: previewData.fuente_id,
      tipo_visualizacion: previewData.tipo_visualizacion,
      filtros: previewData.filtros,
      ventana_temporal: previewData.ventana_temporal,
      ordenamiento: previewData.ordenamiento ?? null,
      datos_simulados: previewData.datos_simulados,
      confianza_gali: previewData.confianza_gali,
      razonamiento_gali: previewData.razonamiento_gali,
      costo_computacional: previewData.costo_computacional,
    }));
    this.preview.set({ cargando: false, vacio: false, data: previewData });
    this.appendGaliMessage(previewData.razonamiento_gali, [
      `Visualización: ${this.visualizaciones().find(v => v.id === previewData.tipo_visualizacion)?.label ?? previewData.tipo_visualizacion}`,
      `Fuente: ${this.fuentes().find(f => f.id === previewData.fuente_id)?.label ?? previewData.fuente_id}`,
      `Confianza Gali: ${Math.round(previewData.confianza_gali * 100)}%`,
    ]);
  }

  private matchEjemplo(texto: string): BloqueEjemplo | null {
    const lower = texto.toLowerCase();
    if (lower.includes('ciudad') || lower.includes('ciudades')) return this.ejemplos()[0];
    if (lower.includes('margen') || lower.includes('rentabilidad')) return this.ejemplos()[1];
    if (lower.includes('cohort') || lower.includes('recompra')) return this.ejemplos()[2];
    if (lower.includes('fuga') || lower.includes('funnel') || lower.includes('caen')) return this.ejemplos()[3];
    if (lower.includes('proyec') || lower.includes('estimar') || lower.includes('30 días') || lower.includes('30 dias')) return this.ejemplos()[4];
    return null;
  }

  private aplicarIteracion(texto: string) {
    const lower = texto.toLowerCase();
    const respuestas = data.respuestas_gali_iteracion;
    let respuesta = respuestas['ordenar_crecimiento'];
    let cambios: string[] = [];

    if (lower.includes('orden')) {
      respuesta = respuestas['ordenar_crecimiento'];
      cambios = ['Ordenamiento actualizado'];
      this.bloque.update(b => ({
        ...b,
        ordenamiento: { por: 'delta_porcentaje', direccion: 'desc' },
      }));
    } else if (lower.includes('meta') || lower.includes('campaña')) {
      respuesta = respuestas['agregar_filtro_meta'];
      cambios = ['Filtro: Meta Ads'];
      this.agregarFiltro({ campo: 'origen', operador: '=', valor: 'meta-ads' });
    } else if (lower.includes('línea') || lower.includes('linea') || lower.includes('tendencia')) {
      respuesta = respuestas['cambiar_visualizacion'];
      cambios = ['Visualización: líneas'];
      this.bloque.update(b => ({ ...b, tipo_visualizacion: 'lineas' }));
    } else if (lower.includes('mes pasado') || lower.includes('mes anterior')) {
      respuesta = respuestas['comparar_mes_anterior'];
      cambios = ['Ventana: comparación mensual'];
      this.bloque.update(b => ({ ...b, ventana_temporal: 'ultimo_mes' }));
    } else if (lower.includes('confianza') || lower.includes('por qué') || lower.includes('porque')) {
      respuesta = respuestas['explicar_confianza'];
      cambios = ['Razonamiento de confianza'];
    } else {
      respuesta = 'Entendí tu pedido pero necesito que seas un poco más específica. ¿Quieres cambiar la fuente, los filtros, la visualización o la ventana temporal?';
      cambios = [];
    }

    this.preview.set({ cargando: false, vacio: false, data: this.preview().data });
    this.appendGaliMessage(respuesta, cambios);
  }

  private regenerarPreviewDesdeBloque() {
    const current = this.preview().data;
    if (!current) return;
    const b = this.bloque();
    this.preview.set({
      cargando: false,
      vacio: false,
      data: {
        ...current,
        fuente_id: b.fuente_id ?? current.fuente_id,
        tipo_visualizacion: b.tipo_visualizacion,
        ventana_temporal: b.ventana_temporal,
        filtros: b.filtros,
        ordenamiento: b.ordenamiento ?? undefined,
      },
    });
  }

  private appendUserMessage(content: string) {
    const msg: BloqueChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    this.historial.update(h => [...h, msg]);
  }

  private appendGaliMessage(content: string, cambios_aplicados: string[] = []) {
    const msg: BloqueChatMessage = {
      id: `msg-${Date.now()}-g`,
      role: 'gali',
      content,
      timestamp: new Date().toISOString(),
      cambios_aplicados,
    };
    this.historial.update(h => [...h, msg]);
  }

  private loadGuardados(): BloqueCustom[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_BLOQUES_GUARDADOS);
      if (!raw) return [];
      return JSON.parse(raw) as BloqueCustom[];
    } catch {
      return [];
    }
  }

  private persistGuardados(bloques: BloqueCustom[]) {
    try {
      localStorage.setItem(STORAGE_KEY_BLOQUES_GUARDADOS, JSON.stringify(bloques));
    } catch {
      // no-op
    }
  }
}
