import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dropi-panel-splitter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="splitter"
      [class.splitter--edge-left]="edge === 'left'"
      (mousedown)="onMouseDown($event)"
      title="Arrastrar para redimensionar">
      <div class="splitter__grip">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `,
  styleUrl: './dropi-panel-splitter.component.scss',
})
export class DropiPanelSplitterComponent {
  @Input() currentWidth = 200;
  @Input() minWidth = 140;
  @Input() maxWidth = 340;
  /** 'right' = drag right increases width (section nav). 'left' = drag left increases width (gali panel). */
  @Input() edge: 'right' | 'left' = 'right';
  @Output() widthChange = new EventEmitter<number>();
  @Output() dragStart = new EventEmitter<void>();
  @Output() dragEnd = new EventEmitter<void>();

  private startX = 0;
  private startWidth = 200;
  private dragging = false;

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.dragging) return;
    const rawDelta = e.clientX - this.startX;
    const delta = this.edge === 'left' ? -rawDelta : rawDelta;
    const newWidth = Math.max(this.minWidth, Math.min(this.maxWidth, this.startWidth + delta));
    this.widthChange.emit(newWidth);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (!this.dragging) return;
    this.dragging = false;
    document.body.style.cursor = '';
    document.body.classList.remove('is-resizing');
    this.dragEnd.emit();
  }

  onMouseDown(e: MouseEvent): void {
    this.dragging = true;
    this.startX = e.clientX;
    this.startWidth = this.currentWidth;
    document.body.style.cursor = 'col-resize';
    document.body.classList.add('is-resizing');
    this.dragStart.emit();
    e.preventDefault();
  }
}
