import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { profileGuard } from './guards/profile.guard';
import { GALI_V5_CHILD_ROUTES } from './pages/gali-v5/gali-v5.routes';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'arch-select',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/arch-select/arch-select.component').then(
        m => m.ArchSelectComponent,
      ),
  },

  // ── Old architecture ──────────────────────────────────────────────
  {
    path: 'old/profile-select',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile-select/profile-select.component').then(
        m => m.ProfileSelectComponent,
      ),
  },
  {
    path: 'old',
    canActivate: [authGuard],
    canActivateChild: [profileGuard],
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./pages/old/home/home.component').then(
            m => m.HomeComponent,
          ),
      },
      {
        path: 'productos/catalogo',
        loadComponent: () =>
          import('./pages/old/catalog/catalog.component').then(
            m => m.CatalogComponent,
          ),
      },
      {
        path: 'mis-pedidos/mis-pedidos',
        loadComponent: () =>
          import('./pages/old/mis-pedidos/mis-pedidos.component').then(
            m => m.MisPedidosComponent,
          ),
      },
      {
        path: 'pedidos/orden-manual',
        loadComponent: () =>
          import('./pages/old/orders-manual/orders-manual.component').then(
            m => m.OrdersManualComponent,
          ),
      },
      {
        path: 'productos/caza-productos',
        loadComponent: () =>
          import('./pages/old/caza-productos/caza-productos.component').then(
            m => m.CazaProductosComponent,
          ),
      },
      {
        path: 'productos/proveedores',
        loadComponent: () =>
          import('./pages/old/proveedores/proveedores.component').then(
            m => m.ProveedoresComponent,
          ),
      },
      {
        path: 'historial-de-cartera',
        loadComponent: () =>
          import('./pages/old/historial-cartera/historial-cartera.component').then(
            m => m.HistorialCarteraComponent,
          ),
      },
      {
        path: 'dropi-card/cards',
        loadComponent: () =>
          import('./pages/old/dropicard/dropicard.component').then(
            m => m.DropicardComponent,
          ),
      },
      {
        path: 'cas/bandeja',
        loadComponent: () =>
          import('./pages/old/cas/cas.component').then(
            m => m.CasComponent,
          ),
      },
      {
        path: 'academy',
        loadComponent: () =>
          import('./pages/old/academy/academy.component').then(
            m => m.AcademyComponent,
          ),
      },
      {
        path: 'pedidos/mis-pedidos-proveedor',
        loadComponent: () =>
          import('./pages/old/orders-provider/orders-provider.component').then(
            m => m.OrdersProviderComponent,
          ),
      },
      {
        path: 'configuraciones/datos-personales',
        loadComponent: () =>
          import('./pages/old/datos-personales/datos-personales.component').then(
            m => m.DatosPersonalesComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad',
        loadComponent: () =>
          import('./pages/old/validacion-identidad/validacion-identidad.component').then(
            m => m.ValidacionIdentidadComponent,
          ),
      },
      {
        path: 'configuraciones/verificacion-identidad',
        loadComponent: () =>
          import('./pages/old/verificacion-identidad/verificacion-identidad.component').then(
            m => m.VerificacionIdentidadComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad-hub',
        loadComponent: () =>
          import('./pages/old/validacion-identidad-hub/validacion-identidad-hub.component').then(
            m => m.ValidacionIdentidadHubComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad-pais',
        loadComponent: () =>
          import('./pages/old/validacion-identidad-pais/validacion-identidad-pais.component').then(
            m => m.ValidacionIdentidadPaisComponent,
          ),
      },
      {
        path: 'configuraciones/flujo-identidad-2026-06-18',
        loadComponent: () =>
          import('./pages/old/flujo-identidad/flujo-identidad.component').then(
            m => m.FlujoIdentidadComponent,
          ),
      },
      {
        path: 'identidad/hub',
        loadComponent: () =>
          import('./pages/old/identidad-hub/identidad-hub.component').then(
            m => m.IdentidadHubComponent,
          ),
      },
      {
        path: 'configuraciones/datos-bancarios',
        loadComponent: () =>
          import('./pages/old/datos-bancarios/datos-bancarios.component').then(
            m => m.DatosBancariosComponent,
          ),
      },
      {
        path: 'configuraciones/retiros-de-saldo',
        loadComponent: () =>
          import('./pages/old/retiro-saldo/retiro-saldo.component').then(
            m => m.RetiroSaldoComponent,
          ),
      },
      {
        path: 'parametrizar-tarifas',
        loadComponent: () =>
          import('./pages/old/parametrizar-tarifas/parametrizar-tarifas.component').then(
            m => m.ParametrizarTarifasComponent,
          ),
      },
      {
        path: 'parametrizar-tarifas-industrial',
        loadComponent: () =>
          import('./pages/old/parametrizar-tarifas-industrial/parametrizar-tarifas-industrial.component').then(
            m => m.ParametrizarTarifasIndustrialComponent,
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: '**', redirectTo: 'home' },
    ],
  },

  // ── New architecture ──────────────────────────────────────────────
  {
    path: 'new/profile-select',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile-select/profile-select.component').then(
        m => m.ProfileSelectComponent,
      ),
  },
  {
    path: 'new',
    canActivate: [authGuard],
    canActivateChild: [profileGuard],
    loadComponent: () =>
      import('./layout/layout-new/layout-new.component').then(
        m => m.LayoutNewComponent,
      ),
    children: [
      {
        path: 'prototipos',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/new/home/home.component').then(
            m => m.HomeNewComponent,
          ),
      },
      // Productos
      {
        path: 'productos/catalogo',
        loadComponent: () =>
          import('./pages/new/productos/catalogo/catalogo.component').then(
            m => m.CatalogoNewComponent,
          ),
      },
      {
        path: 'productos/proveedores',
        loadComponent: () =>
          import('./pages/new/productos/proveedores/proveedores.component').then(
            m => m.ProveedoresNewComponent,
          ),
      },
      {
        path: 'productos/caza-productos',
        loadComponent: () =>
          import('./pages/new/productos/cazaproductos/cazaproductos.component').then(
            m => m.CazaproductosNewComponent,
          ),
      },
      {
        path: 'productos/negociaciones',
        loadComponent: () =>
          import('./pages/new/productos/negociaciones/negociaciones.component').then(
            m => m.NegociacionesNewComponent,
          ),
      },
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/new/dashboard/dashboard/dashboard.component').then(
            m => m.DashboardNewComponent,
          ),
      },
      {
        path: 'dashboard/productos',
        loadComponent: () =>
          import('./pages/new/dashboard/productos/dashboard-productos.component').then(
            m => m.DashboardProductosNewComponent,
          ),
      },
      {
        path: 'dashboard/clientes',
        loadComponent: () =>
          import('./pages/new/dashboard/clientes/dashboard-clientes.component').then(
            m => m.DashboardClientesNewComponent,
          ),
      },
      {
        path: 'dashboard/calendario',
        loadComponent: () =>
          import('./pages/new/dashboard/calendario/dashboard-calendario.component').then(
            m => m.DashboardCalendarioNewComponent,
          ),
      },
      {
        path: 'dashboard/descargas',
        loadComponent: () =>
          import('./pages/new/dashboard/descargas/dashboard-descargas.component').then(
            m => m.DashboardDescargasNewComponent,
          ),
      },
      // Pedidos
      {
        path: 'mis-pedidos/mis-pedidos',
        loadComponent: () =>
          import('./pages/new/pedidos/ordenes/ordenes.component').then(
            m => m.OrdenesNewComponent,
          ),
      },
      {
        path: 'mis-pedidos/novedades',
        loadComponent: () =>
          import('./pages/new/pedidos/novedades/novedades.component').then(
            m => m.NovedadesNewComponent,
          ),
      },
      {
        path: 'mis-pedidos/validador-direcciones',
        loadComponent: () =>
          import('./pages/new/pedidos/validador-direcciones/validador-direcciones.component').then(
            m => m.ValidadorDireccionesNewComponent,
          ),
      },
      {
        path: 'mis-pedidos/etiquetas',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      // Garantias
      {
        path: 'mis-garantias/garantias',
        loadComponent: () =>
          import('./pages/new/pedidos/garantias/garantias.component').then(
            m => m.GarantiasNewComponent,
          ),
      },
      {
        path: 'mis-garantias/ordenes-de-despacho',
        loadComponent: () =>
          import('./pages/new/pedidos/ordenes-despacho/ordenes-despacho.component').then(
            m => m.OrdenesDespachoNewComponent,
          ),
      },
      {
        path: 'mis-garantias/garantias-recolecciones',
        loadComponent: () =>
          import('./pages/new/pedidos/garantias-recolecciones/garantias-recolecciones.component').then(
            m => m.GarantiasRecoleccionesNewComponent,
          ),
      },
      // Logistica
      {
        path: 'transportadora/preferencias',
        loadComponent: () =>
          import('./pages/new/logistica/transportadoras/transportadoras.component').then(
            m => m.TransportadorasNewComponent,
          ),
      },
      {
        path: 'reportes/torre-logistica',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      // Reportes
      {
        path: 'reportes',
        loadComponent: () =>
          import('./pages/new/reportes/reportes.component').then(
            m => m.ReportesNewComponent,
          ),
      },
      // Financiero
      {
        path: 'historial-de-cartera',
        loadComponent: () =>
          import('./pages/new/financiero/wallet/wallet.component').then(
            m => m.WalletNewComponent,
          ),
      },
      // Dropicard
      {
        path: 'dropi-card/cards',
        loadComponent: () =>
          import('./pages/new/financiero/dropicard/dropicard.component').then(
            m => m.DropicardNewComponent,
          ),
      },
      // Facturacion
      {
        path: 'facturacion',
        loadComponent: () =>
          import('./pages/new/financiero/facturacion/facturacion.component').then(
            m => m.FacturacionNewComponent,
          ),
      },
      // Marketing
      {
        path: 'marketing',
        loadComponent: () =>
          import('./pages/new/marketing/chatea-pro/chatea-pro.component').then(
            m => m.ChateaProNewComponent,
          ),
      },
      {
        path: 'marketing/campanas',
        loadComponent: () =>
          import('./pages/new/marketing/campanas/campanas.component').then(
            m => m.CampanasNewComponent,
          ),
      },
      {
        path: 'marketing/chatea-pro',
        loadComponent: () =>
          import('./pages/new/marketing/chatea-pro/chatea-pro.component').then(
            m => m.ChateaProNewComponent,
          ),
      },
      {
        path: 'marketing/roax',
        loadComponent: () =>
          import('./pages/new/marketing/roax/roax.component').then(
            m => m.RoaxNewComponent,
          ),
      },
      {
        path: 'marketing/creador-paginas',
        loadComponent: () =>
          import('./pages/new/marketing/creador-paginas/creador-paginas.component').then(
            m => m.CreadorPaginasNewComponent,
          ),
      },
      {
        path: 'marketing/configuraciones',
        loadComponent: () =>
          import('./pages/new/marketing/configuraciones/configuraciones-mkt.component').then(
            m => m.ConfiguracionesMktNewComponent,
          ),
      },
      // CAS
      {
        path: 'cas/bandeja',
        loadComponent: () =>
          import('./pages/new/cas/bandeja/bandeja.component').then(
            m => m.CasBandejaNewComponent,
          ),
      },
      // Academy
      {
        path: 'academy',
        loadComponent: () =>
          import('./pages/new/academy/academy.component').then(
            m => m.AcademyNewComponent,
          ),
      },
      // Configuraciones
      {
        path: 'configuraciones',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
      {
        path: 'configuraciones/datos-personales',
        loadComponent: () =>
          import('./pages/old/datos-personales/datos-personales.component').then(
            m => m.DatosPersonalesComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad',
        loadComponent: () =>
          import('./pages/old/validacion-identidad/validacion-identidad.component').then(
            m => m.ValidacionIdentidadComponent,
          ),
      },
      {
        path: 'configuraciones/verificacion-identidad',
        loadComponent: () =>
          import('./pages/old/verificacion-identidad/verificacion-identidad.component').then(
            m => m.VerificacionIdentidadComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad-hub',
        loadComponent: () =>
          import('./pages/old/validacion-identidad-hub/validacion-identidad-hub.component').then(
            m => m.ValidacionIdentidadHubComponent,
          ),
      },
      {
        path: 'configuraciones/validacion-identidad-pais',
        loadComponent: () =>
          import('./pages/old/validacion-identidad-pais/validacion-identidad-pais.component').then(
            m => m.ValidacionIdentidadPaisComponent,
          ),
      },
      {
        path: 'configuraciones/cuenta',
        loadComponent: () =>
          import('./pages/new/configurar/cuenta/cuenta.component').then(
            m => m.CuentaNewComponent,
          ),
      },
      {
        path: 'configuraciones/seguridad',
        loadComponent: () =>
          import('./pages/new/configurar/seguridad/seguridad.component').then(
            m => m.SeguridadNewComponent,
          ),
      },
      {
        path: 'configuraciones/integraciones',
        loadComponent: () =>
          import('./pages/new/configurar/integraciones/integraciones.component').then(
            m => m.IntegracionesNewComponent,
          ),
      },
      {
        path: 'configuraciones/referidos',
        loadComponent: () =>
          import('./pages/new/configurar/referidos/referidos.component').then(
            m => m.ReferidosNewComponent,
          ),
      },
      {
        path: 'configuraciones/tienda',
        loadComponent: () =>
          import('./pages/new/configurar/tienda/tienda.component').then(
            m => m.TiendaNewComponent,
          ),
      },
      {
        path: 'configuraciones/usuarios',
        loadComponent: () =>
          import('./pages/new/configurar/usuarios/usuarios.component').then(
            m => m.UsuariosNewComponent,
          ),
      },
      {
        path: 'configuraciones/dropitesters',
        loadComponent: () =>
          import('./pages/new/configurar/dropitesters/dropitesters.component').then(
            m => m.DropitestersNewComponent,
          ),
      },
      {
        path: 'configuraciones/flujo-identidad-2026-06-18',
        loadComponent: () =>
          import('./pages/new/configurar/flujo-identidad/flujo-identidad.component').then(
            m => m.FlujoIdentidadComponent,
          ),
      },
      // Pedidos proveedor
      {
        path: 'pedidos/orden-manual',
        loadComponent: () =>
          import('./pages/old/orders-manual/orders-manual.component').then(
            m => m.OrdersManualComponent,
          ),
      },
      {
        path: 'pedidos/mis-pedidos-proveedor',
        loadComponent: () =>
          import('./pages/old/orders-provider/orders-provider.component').then(
            m => m.OrdersProviderComponent,
          ),
      },
      // Tarifas
      {
        path: 'parametrizar-tarifas',
        loadComponent: () =>
          import('./pages/old/parametrizar-tarifas/parametrizar-tarifas.component').then(
            m => m.ParametrizarTarifasComponent,
          ),
      },
      {
        path: 'parametrizar-tarifas-industrial',
        loadComponent: () =>
          import('./pages/old/parametrizar-tarifas-industrial/parametrizar-tarifas-industrial.component').then(
            m => m.ParametrizarTarifasIndustrialComponent,
          ),
      },
      { path: '', redirectTo: 'prototipos', pathMatch: 'full' },
      { path: '**', redirectTo: 'prototipos' },
    ],
  },

  // ── Gali — shells autónomos (fuera del layout new/) ──────────────
  {
    path: 'gali-v5',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/gali-v5/gali-v5-shell.component').then(m => m.GaliV5ShellComponent),
    children: GALI_V5_CHILD_ROUTES,
  },
  {
    path: 'gali-v3',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/gali-v3/gali-v3-shell.component').then(m => m.GaliV3ShellComponent),
    children: [
      { path: 'onboarding', loadComponent: () => import('./pages/gali-v3/onboarding/onboarding.component').then(m => m.GaliV3OnboardingComponent) },
      { path: 'playground-maestria', loadComponent: () => import('./pages/gali-v3/playground-maestria/playground-maestria.component').then(m => m.GaliV3PlaygroundMaestriaComponent) },
      { path: 'proyecto/:id', loadComponent: () => import('./pages/gali-v3/proyecto/proyecto.component').then(m => m.GaliV3ProyectoComponent) },
      { path: 'builder', loadComponent: () => import('./pages/gali-v3/builder/builder.component').then(m => m.GaliV3BuilderComponent) },
      { path: 'mercado/agente/nuevo', loadComponent: () => import('./pages/gali-v3/mercado/agente-editor.component').then(m => m.GaliV3AgenteEditorComponent) },
      { path: 'mercado/agente/:id', loadComponent: () => import('./pages/gali-v3/mercado/agente-detail.component').then(m => m.GaliV3AgenteDetailComponent) },
      { path: 'mercado', loadComponent: () => import('./pages/gali-v3/mercado/mercado.component').then(m => m.GaliV3MercadoComponent) },
      { path: 'artifact/landing/:id', loadComponent: () => import('./pages/gali-v3/artifact-landing/artifact-landing.component').then(m => m.GaliV3ArtifactLandingComponent) },
      { path: 'vista/:slug', loadComponent: () => import('./pages/gali-v3/vista/vista.component').then(m => m.GaliV3VistaComponent) },
      { path: 'equipo', loadComponent: () => import('./pages/gali-v3/equipo/equipo.component').then(m => m.GaliV3EquipoComponent) },
      { path: 'mapa', loadComponent: () => import('./pages/gali-v3/mapa/mapa.component').then(m => m.GaliV3MapaComponent) },
      { path: 'retos', loadComponent: () => import('./pages/gali-v3/retos/retos.component').then(m => m.GaliV3RetosComponent) },
      { path: 'objetivo', loadComponent: () => import('./pages/gali-v3/objetivo/objetivo.component').then(m => m.GaliV3ObjetivoComponent) },
      { path: 'comunidad', loadComponent: () => import('./pages/gali-v3/comunidad/comunidad.component').then(m => m.GaliV3ComunidadComponent) },
      { path: 'mi-stack', loadComponent: () => import('./pages/gali-v3/mi-stack/mi-stack.component').then(m => m.GaliV3MiStackComponent) },
      { path: 'bloque-builder', loadComponent: () => import('./pages/gali-v3/bloque-builder/bloque-builder.component').then(m => m.GaliV3BloqueBuilderComponent) },
      { path: 'builders', loadComponent: () => import('./pages/gali-v3/builders/builders.component').then(m => m.GaliV3BuildersComponent) },
      { path: 'roadmap', loadComponent: () => import('./pages/gali-v3/roadmap/roadmap.component').then(m => m.GaliV3RoadmapComponent) },
      { path: 'dropi/catalogo', loadComponent: () => import('./pages/gali-v3/dropi-catalogo/dropi-catalogo.component').then(m => m.GaliV3DropiCatalogoComponent) },
      { path: 'dropi/pedidos', loadComponent: () => import('./pages/gali-v3/dropi-pedidos/dropi-pedidos.component').then(m => m.GaliV3DropiPedidosComponent) },
      { path: 'dropi/campanas', loadComponent: () => import('./pages/gali-v3/dropi-campanas/dropi-campanas.component').then(m => m.GaliV3DropiCampanasComponent) },
      { path: 'dropi/proveedores', loadComponent: () => import('./pages/gali-v3/dropi-proveedores/dropi-proveedores.component').then(m => m.GaliV3DropiProveedoresComponent) },
      { path: 'dropi/caza-productos', loadComponent: () => import('./pages/gali-v3/dropi-caza/dropi-caza.component').then(m => m.GaliV3DropiCazaComponent) },
      { path: 'dropi/cartera', loadComponent: () => import('./pages/gali-v3/dropi-cartera/dropi-cartera.component').then(m => m.GaliV3DropiCarteraComponent) },
      { path: 'legacy/cas', data: { legacy: 'cas' }, loadComponent: () => import('./pages/gali-v3/legacy/legacy-host.component').then(m => m.GaliV3LegacyHostComponent) },
      { path: 'legacy/academy', data: { legacy: 'academy' }, loadComponent: () => import('./pages/gali-v3/legacy/legacy-host.component').then(m => m.GaliV3LegacyHostComponent) },
      { path: 'legacy/dropi-card', data: { legacy: 'dropi-card' }, loadComponent: () => import('./pages/gali-v3/legacy/legacy-host.component').then(m => m.GaliV3LegacyHostComponent) },
      { path: 'integraciones', loadComponent: () => import('./pages/gali-v3/integraciones/integraciones.component').then(m => m.GaliV3IntegracionesComponent) },
      { path: 'landings', loadComponent: () => import('./pages/gali-v3/landings/landings.component').then(m => m.GaliV3LandingsComponent) },
      { path: 'pedidos', loadComponent: () => import('./pages/gali-v3/pedidos/pedidos.component').then(m => m.GaliV3PedidosWrapperComponent) },
      { path: 'cartera', loadComponent: () => import('./pages/gali-v3/cartera/cartera.component').then(m => m.GaliV3CarteraWrapperComponent) },
      { path: 'catalogo', loadComponent: () => import('./pages/gali-v3/catalogo/catalogo.component').then(m => m.GaliV3CatalogoWrapperComponent) },
      { path: '', loadComponent: () => import('./pages/gali-v3/inicio/inicio.component').then(m => m.GaliV3InicioComponent) },
    ],
  },
  // Alias /gali-v4 → /gali-v3
  { path: 'gali-v4', redirectTo: 'gali-v3', pathMatch: 'full' },
  { path: 'gali-v4/:p', redirectTo: 'gali-v3/:p' },
  { path: 'gali-v4/:p/:c', redirectTo: 'gali-v3/:p/:c' },
  {
    path: 'gali-v2',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/gali-v2/gali-v2-shell.component').then(m => m.GaliV2ShellComponent),
    children: [
      { path: 'onboarding', loadComponent: () => import('./pages/gali-v2/onboarding/onboarding.component').then(m => m.OnboardingComponent) },
      { path: 'playground-maestria', loadComponent: () => import('./pages/gali-v2/playground-maestria/playground-maestria.component').then(m => m.PlaygroundMaestriaComponent) },
      { path: 'novedades', loadComponent: () => import('./pages/gali-v2/novedades/novedades.component').then(m => m.NovedadesComponent) },
      { path: 'proyectos/:id', loadComponent: () => import('./pages/gali-v2/proyectos/proyecto-detalle.component').then(m => m.ProyectoDetalleComponent) },
      { path: 'proyectos', loadComponent: () => import('./pages/gali-v2/proyectos/proyectos-lista.component').then(m => m.ProyectosListaComponent) },
      { path: '', loadComponent: () => import('./pages/gali-v2/lienzo/lienzo.component').then(m => m.LienzoComponent) },
    ],
  },
  // Gali — páginas individuales (experimentos)
  {
    path: 'gali/descubrimiento',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-descubrimiento/gali-descubrimiento.component').then(m => m.GaliDescubrimientoComponent),
  },
  {
    path: 'gali/estrategia',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-estrategia/gali-estrategia.component').then(m => m.GaliEstrategiaComponent),
  },
  {
    path: 'gali/creacion',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-creacion/gali-creacion.component').then(m => m.GaliCreacionComponent),
  },
  {
    path: 'gali/lanzamiento',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-lanzamiento/gali-lanzamiento.component').then(m => m.GaliLanzamientoComponent),
  },
  {
    path: 'gali/onboarding',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-onboarding/gali-onboarding.component').then(m => m.GaliOnboardingComponent),
  },
  {
    path: 'gali',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/gali-dashboard/gali-dashboard.component').then(m => m.GaliDashboardComponent),
  },

  // ── Default & wildcard ────────────────────────────────────────────
  { path: '', redirectTo: 'old/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'old/home' },
];
