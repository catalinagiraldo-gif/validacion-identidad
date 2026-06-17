import { Injectable } from '@angular/core';

export interface ProximoPaso {
  icon: string;
  label: string;
  meta: string;
  route: string;
  queryParams?: Record<string, string>;
}

export type RutaContexto =
  | 'inicio'
  | 'proyecto'
  | 'proyecto-nuevo'
  | 'builder'
  | 'mercado'
  | 'agente-detalle'
  | 'landing-artifact'
  | 'vista'
  | 'vista-nueva'
  | 'mapa'
  | 'retos'
  | 'objetivo'
  | 'comunidad'
  | 'mi-stack'
  | 'bloque-builder'
  | 'catalogo'
  | 'pedidos'
  | 'campanas'
  | 'proveedores'
  | 'caza'
  | 'cartera'
  | 'legacy-cas'
  | 'legacy-academy'
  | 'legacy-dropi-card';

@Injectable({ providedIn: 'root' })
export class ProximosPasosService {
  rutaActual(url: string): RutaContexto {
    if (url.includes('/proyecto/nuevo')) return 'proyecto-nuevo';
    if (url.includes('/proyecto/')) return 'proyecto';
    if (url.includes('/builder')) return 'builder';
    if (url.includes('/mercado/agente/')) return 'agente-detalle';
    if (url.includes('/mercado')) return 'mercado';
    if (url.includes('/artifact/landing/')) return 'landing-artifact';
    if (url.includes('/vista/nueva')) return 'vista-nueva';
    if (url.includes('/vista/')) return 'vista';
    if (url.includes('/mapa')) return 'mapa';
    if (url.includes('/retos')) return 'retos';
    if (url.includes('/objetivo')) return 'objetivo';
    if (url.includes('/comunidad')) return 'comunidad';
    if (url.includes('/bloque-builder')) return 'bloque-builder';
    if (url.includes('/mi-stack')) return 'mi-stack';
    if (url.includes('/dropi/catalogo')) return 'catalogo';
    if (url.includes('/dropi/pedidos')) return 'pedidos';
    if (url.includes('/dropi/campanas')) return 'campanas';
    if (url.includes('/dropi/proveedores')) return 'proveedores';
    if (url.includes('/dropi/caza')) return 'caza';
    if (url.includes('/dropi/cartera')) return 'cartera';
    if (url.includes('/legacy/cas')) return 'legacy-cas';
    if (url.includes('/legacy/academy')) return 'legacy-academy';
    if (url.includes('/legacy/dropi-card')) return 'legacy-dropi-card';
    return 'inicio';
  }

  pasosFor(ctx: RutaContexto): ProximoPaso[] {
    switch (ctx) {
      case 'inicio':
        return [
          { icon: '🗺', label: 'Ver mapa del negocio', meta: 'todas las secciones · ⌘M', route: '/gali-v3/mapa' },
          { icon: '🎯', label: '4 retos te esperan hoy', meta: '🔥 racha de 12 días · +140pts disponibles', route: '/gali-v3/retos' },
          { icon: '📁', label: 'Continuar Collar GPS', meta: 'ROAS 2.8x · próximo: expandir Medellín', route: '/gali-v3/proyecto/collar-gps-2026' },
        ];
      case 'proyecto':
        return [
          { icon: '📄', label: 'Editar landing del proyecto', meta: 'v2 · click-to-edit in-place', route: '/gali-v3/artifact/landing/land-1' },
          { icon: '⚡', label: 'Automatizar siguiente paso', meta: 'auto-pausa CTR · 5 min', route: '/gali-v3/builder' },
          { icon: '📣', label: 'Ver salud de campañas', meta: 'diagnóstico Gali por card', route: '/gali-v3/dropi/campanas' },
        ];
      case 'proyecto-nuevo':
        return [
          { icon: '🗺', label: 'Antes: mira el mapa', meta: 'entiende qué se conecta con qué', route: '/gali-v3/mapa' },
          { icon: '⚡', label: 'Descubre productos en alza', meta: '10 hallazgos esta semana', route: '/gali-v3/dropi/caza-productos' },
        ];
      case 'builder':
        return [
          { icon: '▶', label: 'Probar flow ahora', meta: 'ejecución mock con log en vivo', route: '/gali-v3/builder' },
          { icon: '⚡', label: 'Mercado: plantillas listas', meta: '12 plantillas con triggers comunes', route: '/gali-v3/mercado', queryParams: { tab: 'plantillas' } },
          { icon: '🤖', label: 'Conectar un agente', meta: '8 agentes pre-construidos', route: '/gali-v3/mercado', queryParams: { tab: 'agentes' } },
        ];
      case 'mercado':
        return [
          { icon: '🛡', label: 'Conocer Vigilante anti-baneo', meta: 'ya instalado · revisa creatives', route: '/gali-v3/mercado/agente/ag-1' },
          { icon: '⚡', label: 'Aplicar Auto-pausa CTR', meta: 'plantilla popular · 5 min', route: '/gali-v3/builder' },
          { icon: '🔌', label: 'Conectar WhatsApp Business', meta: 'habilita 4 agentes nuevos', route: '/gali-v3/mercado', queryParams: { tab: 'conexiones' } },
        ];
      case 'agente-detalle':
        return [
          { icon: '▶', label: 'Invocar agente ahora', meta: 'sobre tu negocio actual', route: '/gali-v3' },
          { icon: '🛒', label: 'Ver más agentes', meta: '7 alternativas en mercado', route: '/gali-v3/mercado', queryParams: { tab: 'agentes' } },
        ];
      case 'landing-artifact':
        return [
          { icon: '🚀', label: 'Publicar y crear campaña', meta: 'Meta Ads · $50k/día sugerido', route: '/gali-v3/dropi/campanas' },
          { icon: '✦', label: 'Generar variación', meta: 'Gali compone v3 con otro ángulo', route: '/gali-v3/artifact/landing/land-1' },
          { icon: '⚡', label: 'Conectar a flow', meta: 'auto-pausa landing si conversión baja', route: '/gali-v3/builder' },
        ];
      case 'vista':
        return [
          { icon: '✎', label: 'Editar widgets de esta vista', meta: '9 widgets disponibles', route: '/gali-v3/vista/operacion-hoy' },
          { icon: '✦', label: 'Crear una vista nueva', meta: 'desde prompt natural', route: '/gali-v3/vista/nueva' },
          { icon: '📊', label: 'Centro de mando denso', meta: '7 widgets para estrategas', route: '/gali-v3/vista/centro-mando' },
        ];
      case 'vista-nueva':
        return [
          { icon: '📋', label: 'Operación de hoy', meta: 'template lista para usar', route: '/gali-v3/vista/operacion-hoy' },
          { icon: '⚡', label: 'Productos ganadores', meta: 'template ROAS-aware', route: '/gali-v3/vista/productos-ganadores' },
        ];
      case 'mapa':
        return [
          { icon: '📁', label: 'Crear proyecto nuevo', meta: 'desde objetivo en lenguaje natural', route: '/gali-v3/proyecto/nuevo' },
          { icon: '🎯', label: 'Ver retos del día', meta: 'gamificación + insignias + cohorte', route: '/gali-v3/retos' },
          { icon: '⌘', label: 'Atajos rápidos: ⌘K', meta: 'navega cualquier sección en 2 teclas', route: '/gali-v3' },
        ];
      case 'retos':
        return [
          { icon: '📄', label: 'Renovar creative con fatiga', meta: 'reto diario +50pts', route: '/gali-v3/artifact/landing/land-1' },
          { icon: '🛒', label: 'Resolver novedad crítica', meta: 'reto diario +40pts', route: '/gali-v3/dropi/pedidos' },
          { icon: '🔥', label: 'Caza productos en alza', meta: 'reto diario +20pts', route: '/gali-v3/dropi/caza-productos' },
        ];
      case 'catalogo':
        return [
          { icon: '✦', label: 'Despertar un producto', meta: 'click en ✦ para análisis LATAM', route: '/gali-v3/dropi/catalogo' },
          { icon: '⚡', label: 'Caza productos en alza', meta: '10 hallazgos esta semana', route: '/gali-v3/dropi/caza-productos' },
          { icon: '🏬', label: 'Ver proveedores', meta: 'score Gali por proveedor', route: '/gali-v3/dropi/proveedores' },
        ];
      case 'pedidos':
        return [
          { icon: '🤖', label: 'Instalar analista de novedades', meta: 'triage automático 24/7', route: '/gali-v3/mercado/agente/ag-2' },
          { icon: '⚡', label: 'Reporte WA al final del día', meta: 'plantilla auto-WhatsApp', route: '/gali-v3/mercado', queryParams: { tab: 'plantillas' } },
          { icon: '🛒', label: 'Crear orden manual', meta: 'asistido por Gali', route: '/pedidos/orden-manual' },
        ];
      case 'campanas':
        return [
          { icon: '📈', label: 'Escalar la mejor campaña', meta: 'p75 LATAM dobló presupuesto día 18', route: '/gali-v3/proyecto/collar-gps-2026' },
          { icon: '🛡', label: 'Pasar creatives por Vigilante', meta: 'previene baneo Meta/TikTok', route: '/gali-v3/mercado/agente/ag-1' },
          { icon: '⚡', label: 'Auto-pausa si CTR<2%', meta: 'plantilla 1-click', route: '/gali-v3/builder' },
        ];
      case 'proveedores':
        return [
          { icon: '🔍', label: 'Caza productos en alza', meta: 'cruza con tus proveedores favoritos', route: '/gali-v3/dropi/caza-productos' },
          { icon: '📦', label: 'Ver catálogo despertado', meta: 'productos de estos proveedores', route: '/gali-v3/dropi/catalogo' },
        ];
      case 'caza':
        return [
          { icon: '📁', label: 'Crear proyecto del producto top', meta: 'Gali pre-llena el plan', route: '/gali-v3/proyecto/nuevo' },
          { icon: '🏬', label: 'Ver proveedores con este producto', meta: 'score Gali listo', route: '/gali-v3/dropi/proveedores' },
        ];
      case 'cartera':
        return [
          { icon: '⚡', label: 'Auto-retiro al pico', meta: 'flow: si saldo > umbral → retira', route: '/gali-v3/builder' },
          { icon: '📊', label: 'Vista financiera', meta: 'wallet + proyección + alertas', route: '/gali-v3/vista/operacion-hoy' },
        ];
      case 'bloque-builder':
        return [
          { icon: '🏠', label: 'Volver al inicio', meta: 've tus bloques en el lienzo', route: '/gali-v3' },
          { icon: '⚡', label: 'Crear una recipe que use este bloque', meta: 'auto-trigger sobre tu nuevo dato', route: '/gali-v3/builder' },
          { icon: '🛒', label: 'Ver bloques compartidos en mercado', meta: 'bloques publicados por la comunidad', route: '/gali-v3/mercado' },
        ];
      case 'legacy-cas':
      case 'legacy-academy':
      case 'legacy-dropi-card':
        return [
          { icon: '🗺', label: 'Volver al mapa', meta: 've cómo conecta con el resto', route: '/gali-v3/mapa' },
          { icon: '🏠', label: 'Volver al inicio Gali', meta: 'welcome + atajos', route: '/gali-v3' },
        ];
      default:
        return [];
    }
  }

  /** Frase breve para el breadcrumb conversacional */
  breadcrumbFor(ctx: RutaContexto): { aqui: string; proximo: string } {
    const labels: Record<RutaContexto, { aqui: string; proximo: string }> = {
      inicio: { aqui: 'Inicio', proximo: 'Abrir el mapa para ver todo (⌘M)' },
      proyecto: { aqui: 'Proyecto activo', proximo: 'Editar la landing in-place' },
      'proyecto-nuevo': { aqui: 'Creando proyecto', proximo: 'Describe un objetivo y dale enter' },
      builder: { aqui: 'Builder de automatizaciones', proximo: 'Probar el flow con datos mock' },
      mercado: { aqui: 'Mercado', proximo: 'Instalar un agente para tu nicho' },
      'agente-detalle': { aqui: 'Detalle de agente', proximo: 'Instalar e invocar sobre tu negocio' },
      'landing-artifact': { aqui: 'Landing editable', proximo: 'Publicar y crear campaña' },
      vista: { aqui: 'Vista personalizada', proximo: 'Editar widgets o crear otra' },
      'vista-nueva': { aqui: 'Componer vista', proximo: 'Describe lo que quieres ver' },
      mapa: { aqui: 'Mapa del negocio', proximo: 'Clickear un nodo para entrar · o ✎ editar' },
      retos: { aqui: 'Retos · gamificación', proximo: 'Completa tu reto diario para +50pts' },
      objetivo: { aqui: 'Mi Objetivo · roadmap', proximo: 'Avanza el siguiente paso de tu semana activa' },
      comunidad: { aqui: 'Comunidad en Vivo', proximo: 'Aplicar señal del top 10% a tu proyecto' },
      'mi-stack': { aqui: 'Mi Stack personal', proximo: 'Conectar Google Sheets para subir tu intelligence' },
      'bloque-builder': { aqui: 'Constructor de Bloques', proximo: 'Describe en español y Gali lo arma en vivo' },
      catalogo: { aqui: 'Catálogo despertado', proximo: 'Click en ✦ de un producto' },
      pedidos: { aqui: 'Pedidos triage Gali', proximo: 'Aprobar acciones automáticas' },
      campanas: { aqui: 'Campañas con health-indicator', proximo: 'Escalar la mejor o pausar la peor' },
      proveedores: { aqui: 'Proveedores con score Gali', proximo: 'Ver productos en alza de cada uno' },
      caza: { aqui: 'Caza productos', proximo: 'Crear proyecto del top match' },
      cartera: { aqui: 'Historial de cartera', proximo: 'Configurar retiro automático' },
      'legacy-cas': { aqui: 'CAS (clásico)', proximo: 'Click ✦ para drawer Gali contextual' },
      'legacy-academy': { aqui: 'Academy (clásico)', proximo: 'Click ✦ para sugerencia Gali' },
      'legacy-dropi-card': { aqui: 'Dropi Card (clásico)', proximo: 'Click ✦ para análisis Gali' },
    };
    return labels[ctx] ?? { aqui: 'Gali', proximo: 'Explora el mapa' };
  }

  iconFor(ctx: RutaContexto): string {
    const icons: Record<RutaContexto, string> = {
      inicio: '🏠',
      proyecto: '📁',
      'proyecto-nuevo': '✦',
      builder: '⚡',
      mercado: '🛒',
      'agente-detalle': '🤖',
      'landing-artifact': '📄',
      vista: '📊',
      'vista-nueva': '📋',
      mapa: '🗺',
      retos: '🎯',
      objetivo: '◎',
      comunidad: '👥',
      'mi-stack': '⚡',
      'bloque-builder': '✦',
      catalogo: '📦',
      pedidos: '🛒',
      campanas: '📣',
      proveedores: '🏬',
      caza: '⚡',
      cartera: '💰',
      'legacy-cas': '💬',
      'legacy-academy': '🎓',
      'legacy-dropi-card': '💳',
    };
    return icons[ctx] ?? '✦';
  }
}
