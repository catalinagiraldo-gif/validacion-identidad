import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type GaliChipAgent =
  | 'ADA Spy'
  | 'Roax'
  | 'Chatea Pro'
  | 'Vigilante'
  | 'Gali'
  | 'Agente Financiero';

export type GaliChipStatus = 'ok' | 'warn' | 'critical' | 'running' | 'neutral';

@Component({
  selector: 'gali-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gali-chip.component.html',
  styleUrl: './gali-chip.component.scss',
})
export class GaliChipComponent {
  @Input({ required: true }) agentName!: GaliChipAgent;
  @Input({ required: true }) message!: string;
  @Input() count?: number;
  @Input() status: GaliChipStatus = 'neutral';
  @Input() ctaLabel?: string;
  @Output() ctaClick = new EventEmitter<void>();

  agentInitial(): string {
    return this.agentName.charAt(0);
  }

  onCta(): void {
    this.ctaClick.emit();
  }
}
