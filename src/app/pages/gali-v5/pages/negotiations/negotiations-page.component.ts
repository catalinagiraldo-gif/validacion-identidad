import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type NegotiationStatus = 'pendiente' | 'aprobada' | 'rechazada' | 'vencida';

interface NegotiationCard {
  id: string;
  createdAt: string;
  provider: { name: string; avatar: string };
  productCount: number;
  productScope: string;
  commissionType: string;
  commissionAmount: string;
  performanceQty: string;
  performanceSales: string;
  status: NegotiationStatus;
  deadline?: string;
}

@Component({
  selector: 'app-negotiations-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './negotiations-page.component.html',
  styleUrl: './negotiations-page.component.scss',
})
export class NegotiationsPageComponent {
  readonly communityId = '12345';
  readonly breadcrumbs = ['Productos', 'Negociaciones'];

  readonly tabs = ['Todas', 'Pendientes', 'Aprobadas', 'Rechazadas', 'Vencidas', 'Historial'];
  activeTab = signal('Todas');
  searchQuery = '';

  readonly negotiations: NegotiationCard[] = [
    {
      id: '243678',
      createdAt: '30/04/2025',
      provider: {
        name: 'Almacenes Denuevo',
        avatar: 'assets/images/dropi-baseline/negociaciones/provider-denuevo.png',
      },
      productCount: 5,
      productScope: 'Productos específicos',
      commissionType: 'Fija',
      commissionAmount: '$1.000',
      performanceQty: '-',
      performanceSales: '-',
      status: 'pendiente',
      deadline: '29/08/2025',
    },
    {
      id: '243679',
      createdAt: '28/04/2025',
      provider: {
        name: 'ADMA',
        avatar: 'assets/images/dropi-baseline/catalog/provider-adma.png',
      },
      productCount: 12,
      productScope: 'Catálogo completo',
      commissionType: 'Porcentual',
      commissionAmount: '10%',
      performanceQty: '24',
      performanceSales: '$ 890.000',
      status: 'aprobada',
    },
    {
      id: '243680',
      createdAt: '25/04/2025',
      provider: {
        name: 'Suppli',
        avatar: 'assets/images/dropi-baseline/catalog/provider-suppli.png',
      },
      productCount: 3,
      productScope: 'Productos específicos',
      commissionType: 'Fija',
      commissionAmount: '$2.500',
      performanceQty: '8',
      performanceSales: '$ 124.000',
      status: 'pendiente',
      deadline: '15/06/2025',
    },
    {
      id: '243681',
      createdAt: '20/04/2025',
      provider: {
        name: 'PUNTO BARATO',
        avatar: 'assets/images/dropi-baseline/provider-prendas.png',
      },
      productCount: 1,
      productScope: 'Producto único',
      commissionType: 'Porcentual',
      commissionAmount: '15%',
      performanceQty: '-',
      performanceSales: '-',
      status: 'rechazada',
    },
    {
      id: '243682',
      createdAt: '15/04/2025',
      provider: {
        name: 'Resiland',
        avatar: 'assets/images/dropi-baseline/provider-faka.png',
      },
      productCount: 7,
      productScope: 'Productos específicos',
      commissionType: 'Fija',
      commissionAmount: '$800',
      performanceQty: '2',
      performanceSales: '$ 45.900',
      status: 'vencida',
    },
  ];

  statusLabel(status: NegotiationStatus): string {
    const labels: Record<NegotiationStatus, string> = {
      pendiente: 'Pendiente',
      aprobada: 'Aprobada',
      rechazada: 'Rechazada',
      vencida: 'Vencida',
    };
    return labels[status];
  }

  copyId(id: string): void {
    void navigator.clipboard?.writeText(id);
  }

  selectTab(tab: string): void {
    this.activeTab.set(tab);
  }
}
