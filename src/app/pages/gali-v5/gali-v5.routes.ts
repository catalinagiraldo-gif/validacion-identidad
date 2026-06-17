import { Routes } from '@angular/router';

const screen = (path: string, screenId: string) => ({
  path,
  loadComponent: () =>
    import('./screens/dropi-screen-page.component').then(m => m.DropiScreenPageComponent),
  data: { screenId },
});

const redirect = (path: string, redirectTo: string) => ({
  path,
  redirectTo,
  pathMatch: 'full' as const,
});

export const GALI_V5_CHILD_ROUTES: Routes = [
  // ── Productos ──
  {
    path: 'productos/catalogo',
    loadComponent: () =>
      import('./pages/catalog/catalog-page.component').then(m => m.CatalogPageComponent),
  },
  {
    path: 'productos/proveedores',
    loadComponent: () =>
      import('./pages/providers/providers-page.component').then(m => m.ProvidersPageComponent),
  },
  {
    path: 'productos/caza-productos',
    loadComponent: () =>
      import('./pages/caza-productos/caza-page.component').then(m => m.CazaPageComponent),
  },
  {
    path: 'productos/negociaciones',
    loadComponent: () =>
      import('./pages/negotiations/negotiations-page.component').then(m => m.NegotiationsPageComponent),
  },

  // ── Pedidos ──
  {
    path: 'mis-pedidos/mis-pedidos',
    loadComponent: () =>
      import('./pages/orders/orders-page.component').then(m => m.OrdersPageComponent),
  },
  {
    path: 'mis-pedidos/novedades',
    loadComponent: () =>
      import('./pages/novedades/novedades-page.component').then(m => m.NovedadesPageComponent),
  },
  {
    path: 'mis-pedidos/garantias',
    loadComponent: () =>
      import('./pages/garantias/garantias-page.component').then(m => m.GarantiasPageComponent),
    data: { variant: 'garantias' },
  },
  {
    path: 'mis-pedidos/ordenes-de-despacho',
    loadComponent: () =>
      import('./pages/garantias/garantias-page.component').then(m => m.GarantiasPageComponent),
    data: { variant: 'ordenes-despacho' },
  },
  screen('mis-pedidos/garantias-recolecciones', 'garantias-recolecciones'),
  {
    path: 'mis-pedidos/validador-direcciones',
    loadComponent: () =>
      import('./pages/validador/validador-direcciones-page.component').then(m => m.ValidadorDireccionesPageComponent),
  },
  {
    path: 'mis-pedidos/etiquetas',
    loadComponent: () =>
      import('./pages/etiquetas/etiquetas-page.component').then(m => m.EtiquetasPageComponent),
  },

  redirect('mis-pedidos/carritos-abandonados', 'productos/catalogo'),
  redirect('mis-pedidos/configuracion-de-pedidos', 'mis-pedidos/mis-pedidos'),
  redirect('mis-garantias/garantias', 'mis-pedidos/garantias'),
  redirect('mis-garantias/ordenes-de-despacho', 'mis-pedidos/ordenes-de-despacho'),
  redirect('mis-garantias/garantias-recolecciones', 'mis-pedidos/garantias-recolecciones'),
  redirect('mis-garantias/devoluciones', 'mis-pedidos/garantias'),
  redirect('mis-garantias/reclamaciones', 'mis-pedidos/garantias'),
  redirect('mis-garantias/seguimiento-guias', 'logistica/torre-logistica'),

  // ── Logística ──
  {
    path: 'logistica/transportadoras',
    loadComponent: () =>
      import('./pages/logistica/carrier-preferences-page.component').then(m => m.CarrierPreferencesPageComponent),
  },
  {
    path: 'logistica/torre-logistica',
    loadComponent: () =>
      import('./pages/logistica/torre-logistica-page.component').then(m => m.TorreLogisticaPageComponent),
  },
  redirect('transportadora/preferencias', 'logistica/transportadoras'),
  redirect('reportes/torre-logistica', 'logistica/torre-logistica'),

  // ── Reportes ──
  {
    path: 'reportes/dashboard',
    loadComponent: () =>
      import('./pages/reportes/report-dashboard-kpi-page.component').then(m => m.ReportDashboardKpiPageComponent),
  },
  {
    path: 'reportes/dashboard-financiero',
    loadComponent: () =>
      import('./pages/reportes/dashboard-financiero-page.component').then(m => m.DashboardFinancieroPageComponent),
  },
  {
    path: 'reportes/productos-vendidos',
    loadComponent: () =>
      import('./pages/reportes/productos-vendidos-page.component').then(m => m.ProductosVendidosPageComponent),
  },
  {
    path: 'reportes/clientes',
    loadComponent: () =>
      import('./pages/reportes/clientes-page.component').then(m => m.ClientesPageComponent),
  },
  {
    path: 'reportes/calendario',
    loadComponent: () =>
      import('./pages/reportes/reportes-calendario-page.component').then(m => m.ReportesCalendarioPageComponent),
  },
  {
    path: 'reportes/descargas',
    loadComponent: () =>
      import('./pages/reportes/reportes-descargas-page.component').then(m => m.ReportesDescargasPageComponent),
  },
  redirect('dashboard', 'reportes/dashboard'),

  // ── Financiero ──
  {
    path: 'financiero/historial-de-cartera',
    loadComponent: () =>
      import('./pages/financiero/wallet-page.component').then(m => m.WalletPageComponent),
  },
  screen('financiero/datos-bancarios', 'datos-bancarios'),
  screen('financiero/retiros-de-saldo', 'retiros-de-saldo'),
  screen('financiero/datos-facturacion', 'datos-facturacion'),
  screen('financiero/facturas-pendientes', 'facturas-pendientes'),
  screen('financiero/notas-credito', 'notas-credito'),
  screen('financiero/depositos-manuales', 'depositos-manuales'),
  screen('financiero/transacciones', 'transacciones'),
  screen('financiero/movimientos-billetera', 'movimientos-billetera'),
  redirect('historial-de-cartera', 'financiero/historial-de-cartera'),
  redirect('configuraciones/datos-bancarios', 'financiero/datos-bancarios'),
  redirect('configuraciones/retiros-de-saldo', 'financiero/retiros-de-saldo'),

  // ── Dropi Card ──
  {
    path: 'dropi-card/cards',
    loadComponent: () =>
      import('./pages/dropicard/dropicard-page.component').then(m => m.DropicardPageComponent),
  },

  // ── Marketing ──
  {
    path: 'marketing/campanas',
    loadComponent: () =>
      import('./pages/marketing/campanas-page.component').then(m => m.CampanasPageComponent),
  },
  {
    path: 'marketing/automatizacion',
    loadComponent: () =>
      import('./pages/marketing/automatizacion-page.component').then(m => m.AutomatizacionPageComponent),
  },
  {
    path: 'marketing/configuraciones',
    loadComponent: () =>
      import('./pages/marketing/configuraciones-marketing-page.component').then(m => m.ConfiguracionesMarketingPageComponent),
  },
  {
    path: 'marketing/chatea-pro',
    loadComponent: () =>
      import('./pages/marketing/chatea-pro-page.component').then(m => m.ChateaProPageComponent),
  },
  {
    path: 'marketing/roax-informes',
    loadComponent: () =>
      import('./pages/marketing/roax-informes-page.component').then(m => m.RoaxInformesPageComponent),
  },
  {
    path: 'marketing/roax-lanzador',
    loadComponent: () =>
      import('./pages/marketing/roax-lanzador-page.component').then(m => m.RoaxLanzadorPageComponent),
  },
  {
    path: 'marketing/creador-de-paginas',
    loadComponent: () =>
      import('./pages/marketing/creador-paginas-page.component').then(m => m.CreadorPaginasPageComponent),
  },

  // ── CAS / Academy ──
  {
    path: 'cas/bandeja',
    loadComponent: () =>
      import('./pages/cas/cas-bandeja-page.component').then(m => m.CasBandejaPageComponent),
  },
  screen('cas/tickets', 'tickets'),
  {
    path: 'academy',
    loadComponent: () =>
      import('./pages/akademy/akademy-page.component').then(m => m.AkademyPageComponent),
  },

  // ── Configuraciones ──
  screen('configuraciones/datos-personales', 'datos-personales'),
  screen('configuraciones/seguridad', 'seguridad'),
  screen('configuraciones/integraciones', 'integraciones-config'),
  screen('configuraciones/referidos', 'referidos'),
  screen('configuraciones/configuracion-de-tienda', 'configuracion-de-tienda'),
  screen('configuraciones/usuarios-equipo', 'usuarios-equipo'),
  screen('configuraciones/dropi-testers', 'dropi-testers'),
  screen('configuraciones/planes', 'planes'),
  screen('configuraciones/mis-sesiones', 'mis-sesiones'),
  screen('configuraciones/historial-de-actividades', 'historial-de-actividades'),
  screen('configuraciones/preferencias-cuenta', 'preferencias-cuenta'),

  // ── Gali Hub & Proyectos ──
  {
    path: 'proyecto/:id',
    loadComponent: () =>
      import('./pages/proyecto/proyecto-detalle-page.component').then(m => m.ProyectoDetallePageComponent),
  },
  {
    path: 'proyectos/nuevo',
    loadComponent: () =>
      import('./pages/proyectos/nuevo-proyecto-page.component').then(m => m.NuevoProyectoPageComponent),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./pages/proyectos/proyectos-list-page.component').then(m => m.ProyectosListPageComponent),
  },
  {
    path: 'agentes',
    loadComponent: () =>
      import('./pages/agentes/agentes-page.component').then(m => m.AgentesPageComponent),
  },
  {
    path: 'skills/nueva',
    loadComponent: () =>
      import('./pages/skills/skill-editor-page.component').then(m => m.SkillEditorPageComponent),
  },
  {
    path: 'skills/comunidad',
    loadComponent: () =>
      import('./pages/skills/skills-comunidad-page.component').then(m => m.SkillsComunidadPageComponent),
  },
  {
    path: 'skills',
    loadComponent: () =>
      import('./pages/skills/skills-page.component').then(m => m.SkillsPageComponent),
  },
  {
    path: 'reglas',
    loadComponent: () =>
      import('./pages/reglas/reglas-page.component').then(m => m.ReglasPageComponent),
  },
  {
    path: 'marketplace',
    loadComponent: () =>
      import('./pages/marketplace/marketplace-page.component').then(m => m.MarketplacePageComponent),
  },
  {
    path: 'conexiones',
    loadComponent: () =>
      import('./pages/conexiones/conexiones-page.component').then(m => m.ConexionesPageComponent),
  },

  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.DropiHomeComponent),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
