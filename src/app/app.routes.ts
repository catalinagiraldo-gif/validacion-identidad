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
        path: 'pedidos/orden-manual',
        loadComponent: () =>
          import('./pages/orders-manual/orders-manual.component').then(
            m => m.OrdersManualComponent,
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
