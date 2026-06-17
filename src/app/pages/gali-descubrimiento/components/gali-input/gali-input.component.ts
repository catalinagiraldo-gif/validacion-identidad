import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'gali-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="gi" [class.gi--hero]="size === 'hero'" [class.gi--disabled]="disabled">
      <input
        #inputEl
        type="text"
        class="gi__field"
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (keydown.enter)="onSubmit()"
        (keydown.arrowUp)="onArrowUp($any($event))"
        [attr.aria-label]="'Escribe tu intención a Gali'"
      />

      <button
        type="button"
        class="gi__btn gi__btn--mic"
        (click)="onMicClick($event)"
        [class.gi__btn--showing-tip]="showMicTip()"
        aria-label="Hablar con Gali (próximamente)"
      >
        🎤
        <span class="gi__tooltip" *ngIf="showMicTip()">
          Próximamente: input de voz
        </span>
      </button>

      <button
        type="button"
        class="gi__btn"
        (click)="toggleStream.emit()"
        [attr.aria-label]="streamingEnabled ? 'Desactivar streaming' : 'Activar streaming'"
        [title]="streamingEnabled ? 'Streaming activo (clic para desactivar)' : 'Texto instantáneo (clic para activar streaming)'"
      >
        ⏱
        <span class="gi__btn-dot" *ngIf="streamingEnabled"></span>
      </button>

      <button
        type="button"
        class="gi__send"
        (click)="onSubmit()"
        [disabled]="!value.trim() || disabled"
        aria-label="Enviar"
      >
        →
      </button>
    </div>
  `,
  styleUrl: './gali-input.component.scss',
})
export class GaliInputComponent {
  @Input() placeholder = 'Cuéntale a Gali qué buscas...';
  @Input() size: 'hero' | 'sidebar' = 'sidebar';
  @Input() disabled = false;
  @Input() streamingEnabled = true;
  @Output() submitted = new EventEmitter<string>();
  @Output() toggleStream = new EventEmitter<void>();

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  value = '';
  showMicTip = signal(false);
  private lastSubmitted = '';

  focus(): void {
    this.inputEl?.nativeElement.focus();
  }

  onSubmit(): void {
    if (!this.value.trim() || this.disabled) {
      this.shakeInput();
      return;
    }
    this.lastSubmitted = this.value;
    this.submitted.emit(this.value);
    this.value = '';
  }

  onArrowUp(e: KeyboardEvent): void {
    if (!this.value && this.lastSubmitted) {
      e.preventDefault();
      this.value = this.lastSubmitted;
    }
  }

  onMicClick(e: MouseEvent): void {
    e.stopPropagation();
    this.showMicTip.set(true);
    setTimeout(() => this.showMicTip.set(false), 2400);
  }

  private shakeInput(): void {
    const el = this.inputEl?.nativeElement?.parentElement;
    if (!el) return;
    el.classList.remove('gi--shake');
    void el.offsetWidth;
    el.classList.add('gi--shake');
  }
}
