import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';

export type GaliMarkState = 'reposo' | 'propuesta' | 'alerta' | 'actuando' | 'memoria';
export type GaliMarkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'gali-mark',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-mark.component.html',
  styleUrls: ['./gali-mark.component.scss'],
})
export class GaliMarkComponent {
  @Input() state: GaliMarkState = 'reposo';
  @Input() size: GaliMarkSize = 'md';
  @Input() label: string | null = null;

  @HostBinding('class') get hostClass() {
    return `gv2-mark gv2-mark--${this.size} gv2-mark--${this.state}`;
  }
  @HostBinding('attr.aria-label') get ariaLabel() {
    return this.label ?? `Gali — ${this.state}`;
  }
  @HostBinding('attr.role') role = 'img';
}
