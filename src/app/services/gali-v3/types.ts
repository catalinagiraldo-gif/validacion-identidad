export type ProjectStatus = 'activo' | 'pausado' | 'completado';
export type PipelineStageStatus = 'pendiente' | 'activo' | 'completado' | 'pausado';
export type ArtifactKind = 'landing' | 'flow' | 'vista' | 'agente' | 'producto' | 'welcome' | 'project';
export type SignalKind = 'oportunidad' | 'riesgo' | 'optimizacion';
export type Urgencia = 'alta' | 'media' | 'baja';
export type Nivel = 'aprendiz' | 'operador' | 'estratega';

export interface PipelineStage {
  stage: string;
  status: PipelineStageStatus;
  label: string;
}

export interface ProjectArtifactRef {
  id: string;
  name: string;
  version?: number;
  url?: string;
  estado?: string;
  ejecuciones?: number;
  slug?: string;
}

export interface ProjectMemory {
  decisiones_clave: string[];
  aprendizajes: string[];
  siguiente_accion: string;
  siguiente_accion_razonamiento: string;
}

export interface ProjectMetrics {
  roas_actual: number;
  ventas_totales: number;
  ventas_semana: number;
  presupuesto_diario: number;
  ctr_actual: number;
  dias_antes_saturacion: number | null;
}

export interface ProjectProduct {
  id: string;
  name: string;
  image: string;
  costo: number;
  precio_sugerido: number;
  margen: number;
  angulo_elegido: string;
  ciudad_principal: string;
}

export interface GaliProject {
  id: string;
  name: string;
  status: ProjectStatus;
  icon: string;
  created_at: string;
  last_activity: string;
  days_active: number;
  product: ProjectProduct;
  pipeline: PipelineStage[];
  artifacts: {
    landings: ProjectArtifactRef[];
    flows: ProjectArtifactRef[];
    vistas: ProjectArtifactRef[];
    agentes: ProjectArtifactRef[];
  };
  memory: ProjectMemory;
  metrics: ProjectMetrics;
}

export type SignalEstadoEjecucion = 'pendiente' | 'ejecutado' | 'resultado';
export type AgenteEstado = 'activo' | 'esperando' | 'completado' | 'fallido' | 'pausa';

export interface SignalResultado {
  metrica: string;
  antes: number;
  despues: number;
  delta_label: string;
  roas_antes?: number;
  roas_despues?: number;
  ejecutado_hace?: string;
}

export interface Signal {
  id: string;
  tipo: SignalKind;
  icon: string;
  titulo: string;
  contexto: string;
  accion_sugerida: { label: string; target_route: string };
  urgencia: Urgencia;
  timestamp: string;
  fuente: string;
  confianza?: number;
  razonamiento?: string;
  estado_ejecucion?: SignalEstadoEjecucion;
  resultado?: SignalResultado;
  propuesta_receta?: { label: string; route: string };
}

export interface AgenteActivo {
  id: string;
  nombre: string;
  icono: string;
  estado: AgenteEstado;
  progreso_texto: string;
  confianza: number;
  memoria_usada: string[];
  iniciado_hace: string;
  marketplace_id: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'gali';
  timestamp: string;
  content: string;
  streaming?: boolean;
  artifacts?: Array<{ type: string; ref: string }>;
  context?: { projectId?: string; route?: string };
}

export interface SlashCommand {
  command: string;
  label: string;
  icon: string;
  description: string;
}

export interface GaliMemory {
  perfil: {
    nombre: string;
    ciudad_base: string;
    tiempo_en_dropi: string;
    nivel: Nivel;
    ultima_sesion: string;
    ultima_actividad: string;
  };
  negocio: {
    nicho_principal: string;
    nichos_explorados: string[];
    tono_preferido: string;
    roas_objetivo: string;
    presupuesto_mensual: string;
    plataformas_activas: string[];
    productos_activos: number;
    ventas_totales_lifetime: number;
  };
  decisiones: Array<{ fecha: string; que: string; por_que: string }>;
  aprendizajes: string[];
  preferencias_esteticas: {
    paleta_landings: string[];
    estilo: string;
    evitar: string[];
  };
  siguiente_accion_sugerida: string;
}

export interface FlowBlockDef {
  id: string;
  label: string;
  icon: string;
  categoria: string;
  color: string;
  configFields?: string[];
}

export interface ApiBlockDef {
  id: string;
  label: string;
  icon: string;
  categoria: string;
  color: string;
  endpoint: string;
  auth: string;
  rate_limit: string;
  anonymity_threshold?: number;
}

export interface FlowBlocksCatalog {
  triggers: FlowBlockDef[];
  actions: FlowBlockDef[];
  conditions: FlowBlockDef[];
  api_blocks?: ApiBlockDef[];
}

export interface PlantillaMercado {
  id: string;
  name: string;
  icon: string;
  descripcion: string;
  categoria: string;
  nivel: Nivel;
  popularidad: number;
  tiempo_estimado: string;
  tags: string[];
}

export interface AgenteMercado {
  id: string;
  name: string;
  icon: string;
  color: string;
  tagline: string;
  descripcion: string;
  creado_por: string;
  instalaciones: number;
  rating: number;
  prerequisites: string[];
  que_hace: string[];
  instalado: boolean;
}

export interface ConexionMercado {
  id: string;
  name: string;
  icon: string;
  color: string;
  descripcion: string;
  categoria: string;
  conectado: boolean;
  estado: string;
  permite: string[];
}

export interface BusinessSnapshot {
  pedidos: { hoy: number; nuevos: number; en_transito: number; entregados: number; novedades_criticas: number };
  wallet: { saldo_actual: number; moneda: string; tendencia: string; proyeccion_7d: number; fecha_optima_retiro: string };
  campanas: { activas: number; presupuesto_diario_total: number; roas_promedio: number; salud_general: string };
  productos: { activos_catalogo: number; favoritos: number; con_ventas_semana: number };
  automatizaciones: { activas: number; ejecuciones_hoy: number; alertas_pendientes: number };
  alertas_recientes: Array<{ tipo: string; msg: string }>;
}

// ============================================
// Modo Objetivos → Roadmap (V4 Vista 5)
// ============================================
export type ObjetivoMetricaTipo = 'pedidos_mes' | 'roas' | 'ingresos' | 'productos_lanzados';
export type SemanaEstado = 'completada' | 'activa' | 'futura';
export type PasoEstado = 'completado' | 'en_progreso' | 'pendiente';
export type ObjetivoEstado = 'activo' | 'completado' | 'abandonado';

export interface ObjetivoMetrica {
  tipo: ObjetivoMetricaTipo;
  valor_objetivo: number;
  valor_actual: number;
  valor_inicial?: number;
  unidad: string;
}

export interface ObjetivoPaso {
  id: string;
  titulo: string;
  descripcion: string;
  razon_gali: string;
  ruta_dropi: string;
  tipo_bloque: string;
  estado: PasoEstado;
  confianza_gali: number;
}

export interface ObjetivoSemana {
  numero: number;
  titulo: string;
  meta_parcial: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: SemanaEstado;
  porcentaje_real: number;
  pasos: ObjetivoPaso[];
}

export interface ObjetivoSnapshotInicial {
  pedidos_actuales_mes: number;
  roas_historico: number;
  productos_top: string[];
  ciudades_top: string[];
  inversion_actual_semana: number;
  moneda: string;
}

export interface GaliObjetivo {
  id: string;
  declaracion_usuario: string;
  metrica: ObjetivoMetrica;
  creado_at: string;
  deadline: string;
  plazo_semanas: number;
  porcentaje_completado: number;
  porcentaje_proyectado_gali: number;
  proyeccion_valor_final: number;
  confianza_gali: number;
  fuentes_confianza: string[];
  razonamiento_gali: string;
  snapshot_inicial: ObjetivoSnapshotInicial;
  semanas: ObjetivoSemana[];
}

export interface ObjetivoHistorico {
  id: string;
  declaracion_usuario: string;
  metrica: { tipo: ObjetivoMetricaTipo; valor_objetivo: number; valor_actual: number; unidad: string };
  estado: ObjetivoEstado;
  fecha_completado?: string;
  plazo_semanas: number;
  duracion_real_semanas: number;
  aprendizaje_capturado: string;
}

export interface ObjetivoPreguntaOnboarding {
  id: string;
  pregunta: string;
  ayuda_gali: string;
  ejemplos: string[];
}

// ============================================
// Comunidad en Vivo — Líder Virtual (V4 Vista 3)
// ============================================
export type SenalComunidadTipo = 'tendencia' | 'oportunidad' | 'estrategia';
export type FiltroComunidadId = 'perfil' | 'nicho' | 'ecosistema';
export type AlertaSeveridad = 'alta' | 'media' | 'baja';

export interface ResumenLiderVirtual {
  frases: string[];
  actualizado_hace: string;
  data_window: string;
  vendedores_analizados: number;
  confianza_global: number;
}

export interface FiltroComunidad {
  id: FiltroComunidadId;
  label: string;
  descripcion: string;
}

export interface SenalComunidad {
  id: string;
  tipo: SenalComunidadTipo;
  titulo: string;
  contexto: string;
  fuente: string;
  confianza: number;
  vendedores_afectados: number;
  relevancia_perfil: number;
  categoria: string;
  geografia: string[];
  accion_sugerida: string;
  ruta_aplicar: string;
}

export interface ProductoTendencia {
  id: string;
  nombre: string;
  categoria: string;
  crecimiento_semanal: number;
  vendedores_activos: number;
  margen_promedio: number;
  saturacion_dias: number;
  ticket_promedio_cop: number;
  confianza: number;
  imagen_emoji: string;
  ciudades_top: string[];
  tendencia_creative: string;
}

export interface CasoTop {
  id: string;
  perfil_anonimizado: string;
  resultado: string;
  tiempo: string;
  estrategia_clave: string;
  metricas_finales: {
    roas: number;
    pedidos_mes: number;
    productos_activos: number;
  };
  ciudades: string[];
  aprendizaje_aplicable: string;
}

export interface AlertaComunidad {
  id: string;
  tipo: 'transportadora' | 'proveedor' | 'saturacion' | 'plataforma';
  severidad: AlertaSeveridad;
  titulo: string;
  contexto: string;
  fuente: string;
  alternativa_sugerida: string;
  afectados: number;
}

// ============================================
// Constructor de Bloques Custom (V4 Vista 8)
// ============================================
export type BloqueCategoria = 'ventas' | 'pedidos' | 'metricas' | 'analisis' | 'proyeccion' | 'custom';
export type BloqueVisualizacion =
  | 'metrica'
  | 'barras'
  | 'barras_agrupadas'
  | 'lineas'
  | 'tabla'
  | 'funnel'
  | 'heatmap_cohorts'
  | 'lista_top';
export type BloqueVentanaTemporal = 'hoy' | 'ayer' | 'ultima_semana' | 'ultimo_mes' | 'ultimos_3_meses' | 'ultimos_6_meses' | 'ultimo_ano';
export type BloqueModoConstruccion = 'chat' | 'manual';
export type BloqueOrigenFuente = 'dropi-core' | 'stack-personal' | 'comunidad' | 'local';

export interface BloqueFuente {
  id: string;
  label: string;
  descripcion: string;
  campos: string[];
  origen: BloqueOrigenFuente;
  confianza_dato: number;
  requiere_stack?: string[];
  anonimizado?: boolean;
}

export interface BloqueTipoVisualizacion {
  id: BloqueVisualizacion;
  label: string;
  descripcion: string;
  icono: string;
}

export interface BloqueFiltro {
  campo: string;
  operador: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'in' | 'contains';
  valor: string | number | string[];
}

export interface BloqueOrdenamiento {
  por: string;
  direccion: 'asc' | 'desc';
}

export interface BloqueCostoComputacional {
  registros_a_procesar: number;
  tiempo_estimado_ms: number;
  advertencia: string | null;
}

export interface BloqueChatMessage {
  id: string;
  role: 'user' | 'gali';
  content: string;
  timestamp: string;
  cambios_aplicados?: string[];
}

export interface BloqueEjemplo {
  id: string;
  titulo: string;
  descripcion_corta: string;
  prompt_origen: string;
  categoria: BloqueCategoria;
  icono: string;
  nivel: Nivel;
}

export interface BloqueCustom {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: BloqueCategoria;
  icono: string;
  fuente_id: string | null;
  tipo_visualizacion: BloqueVisualizacion;
  filtros: BloqueFiltro[];
  ventana_temporal: BloqueVentanaTemporal;
  ordenamiento: BloqueOrdenamiento | null;
  datos_simulados: boolean;
  confianza_gali: number;
  razonamiento_gali: string;
  costo_computacional: BloqueCostoComputacional;
}

export interface BloquePreviewData {
  tipo_visualizacion: BloqueVisualizacion;
  fuente_id: string;
  ventana_temporal: BloqueVentanaTemporal;
  datos_simulados: boolean;
  confianza_gali: number;
  razonamiento_gali: string;
  filtros: BloqueFiltro[];
  ordenamiento?: BloqueOrdenamiento;
  costo_computacional: BloqueCostoComputacional;
  categorias?: Array<{ label: string; esta_semana: number; semana_pasada: number; delta: string }>;
  columnas?: string[];
  filas?: Array<Record<string, string | number>>;
  cohortes?: Array<{ mes: string; tamano: number; retencion: number[] }>;
  pasos?: Array<{ etapa: string; valor: number; porcentaje: number; drop: number }>;
  series?: Array<{ label: string; datos: Array<{ fecha: string; valor: number }>; es_proyeccion?: boolean }>;
  revenue_proyectado?: number;
  moneda?: string;
}

export interface BloquePreviewState {
  cargando: boolean;
  vacio: boolean;
  data: BloquePreviewData | null;
}

// Bloques publicados por la comunidad (Marketplace Fase 3)
export interface BloqueComunidad {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: BloqueCategoria;
  icono: string;
  tipo_visualizacion: BloqueVisualizacion;
  fuente_id: string;
  ventana_temporal: BloqueVentanaTemporal;
  creado_por: string;
  perfil_creador: Nivel;
  instalaciones: number;
  rating: number;
  publicado_hace: string;
  tags: string[];
  confianza_promedio: number;
  destacado: boolean;
  requiere_stack: string[];
}

export interface BloquesComunidadMeta {
  vendedores_que_publican: number;
  bloques_totales: number;
  actualizado_hace: string;
  data_window: string;
}

export interface BloqueComunidadCategoria {
  id: string;
  label: string;
  count: number;
}
