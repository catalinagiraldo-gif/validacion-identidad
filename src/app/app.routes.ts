import { Routes } from '@angular/router';
import { PrototypeGalleryComponent } from './pages/prototype-gallery/prototype-gallery.component';

export const routes: Routes = [
  { path: '', component: PrototypeGalleryComponent },
  // Wireframe routes are added here as prototypes are created:
  // {
  //   path: 'orders/DROPI-1234-bulk-actions',
  //   loadComponent: () => import('./pages/orders-bulk-actions/orders-bulk-actions.component')
  //     .then(m => m.OrdersBulkActionsComponent)
  // },
];
