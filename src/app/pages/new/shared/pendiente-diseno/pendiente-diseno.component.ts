import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface PendienteDisenoData {
  title: string;
  breadcrumb: string[];
  figmaNote?: string;
}

@Component({
  selector: 'app-pendiente-diseno',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./pendiente-diseno.component.scss'],
  template: `
    <div class="page-wrapper">
      <nav class="breadcrumb">
        <span class="breadcrumb-item"><i class="pi pi-home"></i></span>
        <ng-container *ngFor="let crumb of data.breadcrumb; let last = last">
          <i class="pi pi-chevron-right breadcrumb-chevron"></i>
          <span class="breadcrumb-item" [class.active]="last">{{ crumb }}</span>
        </ng-container>
      </nav>

      <h1 class="page-title">{{ data.title }}</h1>

      <div class="pending-card">
        <div class="pending-card__icon">
          <i class="pi pi-pencil"></i>
        </div>
        <h2 class="pending-card__title">Diseño pendiente de Figma</h2>
        <p class="pending-card__text" *ngIf="data.figmaNote">{{ data.figmaNote }}</p>
        <p class="pending-card__text" *ngIf="!data.figmaNote">
          Esta vista se construirá con la especificación exacta de Figma (colores, textos y campos) una vez tengamos acceso al nodo de diseño correspondiente.
        </p>
      </div>
    </div>
  `,
})
export class PendienteDisenoComponent {
  data: PendienteDisenoData = { title: '', breadcrumb: [] };

  constructor(route: ActivatedRoute) {
    const routeData = route.snapshot.data as Partial<PendienteDisenoData>;
    this.data = {
      title: routeData.title ?? '',
      breadcrumb: routeData.breadcrumb ?? [],
      figmaNote: routeData.figmaNote,
    };
  }
}
