import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fab-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fab-menu">
      <button
        class="fab-menu__btn"
        *ngFor="let btn of buttons; let i = index"
        [style.animation-delay]="(i * 80) + 'ms'"
        [attr.aria-label]="btn.label"
        (mouseenter)="hoveredBtn = btn.id"
        (mouseleave)="hoveredBtn = null"
      >
        <i [class]="btn.icon" class="fab-menu__icon"></i>
        <span
          class="fab-menu__tooltip"
          *ngIf="hoveredBtn === btn.id"
        >{{ btn.label }}</span>
      </button>
    </div>
  `,
  styleUrl: './fab-menu.component.scss',
})
export class FabMenuComponent {
  hoveredBtn: string | null = null;

  buttons = [
    { id: 'huella', icon: 'pi pi-wifi', label: 'Huella Digital' },
    { id: 'torre', icon: 'pi pi-wave-pulse', label: 'Torre de Control' },
    { id: 'chat', icon: 'pi pi-comments', label: 'Chat de soporte' },
  ];
}
