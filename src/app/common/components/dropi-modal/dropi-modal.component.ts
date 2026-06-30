import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropi-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropi-modal.component.html',
  styleUrls: ['./dropi-modal.component.scss'],
})
export class DropiModalComponent {
  @Input({ required: true }) header = '';
  @Input() visible = false;
  @Input() width = '500px';
  @Input() closable = true;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();

  onBackdropClick(): void {
    if (this.closable) this.close();
  }

  close(): void {
    if (!this.closable) return;
    this.visible = false;
    this.visibleChange.emit(false);
    this.closed.emit();
  }
}
