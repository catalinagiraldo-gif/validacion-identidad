import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { profileGuard } from './guards/profile.guard';

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
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
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

  // ── Default & wildcard ────────────────────────────────────────────
  { path: '', redirectTo: 'arch-select', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
