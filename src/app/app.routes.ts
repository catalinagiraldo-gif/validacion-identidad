import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
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
          import('./pages/catalog/catalog.component').then(
            m => m.CatalogComponent,
          ),
      },
      {
        path: 'mis-pedidos/mis-pedidos',
        loadComponent: () =>
          import('./pages/mis-pedidos/mis-pedidos.component').then(
            m => m.MisPedidosComponent,
          ),
      },
      {
        path: 'pedidos/orden-manual',
        loadComponent: () =>
          import('./pages/orders-manual/orders-manual.component').then(
            m => m.OrdersManualComponent,
          ),
      },
      {
        path: 'productos/caza-productos',
        loadComponent: () =>
          import('./pages/caza-productos/caza-productos.component').then(
            m => m.CazaProductosComponent,
          ),
      },
      {
        path: 'productos/proveedores',
        loadComponent: () =>
          import('./pages/proveedores/proveedores.component').then(
            m => m.ProveedoresComponent,
          ),
      },
      {
        path: 'historial-de-cartera',
        loadComponent: () =>
          import('./pages/historial-cartera/historial-cartera.component').then(
            m => m.HistorialCarteraComponent,
          ),
      },
      {
        path: 'dropi-card/cards',
        loadComponent: () =>
          import('./pages/dropicard/dropicard.component').then(
            m => m.DropicardComponent,
          ),
      },
      {
        path: 'cas/bandeja',
        loadComponent: () =>
          import('./pages/cas/cas.component').then(
            m => m.CasComponent,
          ),
      },
      {
        path: 'academy',
        loadComponent: () =>
          import('./pages/academy/academy.component').then(
            m => m.AcademyComponent,
          ),
      },
      {
        path: 'pedidos/mis-pedidos-proveedor',
        loadComponent: () =>
          import('./pages/orders-provider/orders-provider.component').then(
            m => m.OrdersProviderComponent,
          ),
      },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      // Catch-all for prototype routes — renders gallery as placeholder
      {
        path: '**',
        loadComponent: () =>
          import('./pages/prototype-gallery/prototype-gallery.component').then(
            m => m.PrototypeGalleryComponent,
          ),
      },
    ],
  },
];
