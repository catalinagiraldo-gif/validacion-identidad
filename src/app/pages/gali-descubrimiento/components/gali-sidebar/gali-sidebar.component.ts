import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AvatarState,
  ExecutionStep,
  GaliMessage,
  Product,
} from '../../models/gali.models';
import { GaliAvatarComponent } from '../gali-avatar/gali-avatar.component';
import { GaliExecutionStreamComponent } from '../gali-execution-stream/gali-execution-stream.component';
import { GaliInputComponent } from '../gali-input/gali-input.component';
import { GaliLearningRibbonComponent } from '../gali-learning-ribbon/gali-learning-ribbon.component';
import { GaliMessageComponent } from '../gali-message/gali-message.component';
import { GaliSuggestionChipComponent } from '../gali-suggestion-chip/gali-suggestion-chip.component';

@Component({
  selector: 'gali-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    GaliAvatarComponent,
    GaliExecutionStreamComponent,
    GaliInputComponent,
    GaliLearningRibbonComponent,
    GaliMessageComponent,
    GaliSuggestionChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside class="gs">
      <header class="gs__header">
        <div class="gs__identity">
          <gali-avatar size="sidebar" [state]="avatarState"></gali-avatar>
          <div class="gs__title">
            <span class="gs__name">Gali</span>
            <span class="gs__state">{{ stateLabel(avatarState) }}</span>
          </div>
        </div>
        <button
          class="gs__reset"
          (click)="reset.emit()"
          aria-label="Empezar de cero"
          title="Empezar de cero"
        >
          ↺
        </button>
      </header>

      <div class="gs__thread" #thread>
        <gali-message
          *ngFor="let msg of visibleMessages(); trackBy: trackByMsgId"
          [message]="msg"
        ></gali-message>

        <gali-execution-stream
          *ngIf="executionStream && !executionDone"
          [steps]="executionStream"
        ></gali-execution-stream>
      </div>

      <div class="gs__suggestions" *ngIf="showSuggestions && suggestions.length">
        <gali-suggestion-chip
          *ngFor="let s of suggestions; let i = index"
          [label]="s"
          [accent]="acceptChipIndex === i"
          [delay]="i * 80"
          (clicked)="suggestionClicked.emit({ label: $event, index: i })"
        ></gali-suggestion-chip>
      </div>

      <div class="gs__input">
        <gali-input
          #input
          [streamingEnabled]="streamingEnabled"
          [disabled]="processing"
          [placeholder]="processing ? 'Gali está procesando...' : 'Sigue conversando con Gali...'"
          (submitted)="submitted.emit($event)"
          (toggleStream)="toggleStream.emit()"
        ></gali-input>
      </div>

      <gali-learning-ribbon></gali-learning-ribbon>
    </aside>
  `,
  styleUrl: './gali-sidebar.component.scss',
})
export class GaliSidebarComponent implements AfterViewChecked {
  @Input() messages: GaliMessage[] = [];
  @Input() executionStream: ExecutionStep[] | null = null;
  @Input() avatarState: AvatarState = 'idle';
  @Input() suggestions: string[] = [];
  @Input() showSuggestions = true;
  @Input() acceptChipIndex: number | null = null;
  @Input() streamingEnabled = true;
  @Input() processing = false;
  @Output() submitted = new EventEmitter<string>();
  @Output() toggleStream = new EventEmitter<void>();
  @Output() suggestionClicked = new EventEmitter<{ label: string; index: number }>();
  @Output() reset = new EventEmitter<void>();

  @ViewChild('thread') threadRef?: ElementRef<HTMLDivElement>;
  @ViewChild('input') inputRef?: GaliInputComponent;

  private lastLength = 0;

  visibleMessages(): GaliMessage[] {
    return this.messages.filter(m => m.type !== 'reasoning');
  }

  trackByMsgId(_: number, m: GaliMessage): string {
    return m.id;
  }

  get executionDone(): boolean {
    if (!this.executionStream) return true;
    return this.executionStream.every(s => s.status === 'done');
  }

  stateLabel(s: AvatarState): string {
    const map: Record<AvatarState, string> = {
      idle: 'En línea',
      thinking: 'Pensando...',
      speaking: 'Respondiendo',
      alert: 'Te pregunta algo',
      success: '✓ Listo',
    };
    return map[s];
  }

  focusInput(): void {
    this.inputRef?.focus();
  }

  ngAfterViewChecked(): void {
    const el = this.threadRef?.nativeElement;
    if (el && this.messages.length !== this.lastLength) {
      el.scrollTop = el.scrollHeight;
      this.lastLength = this.messages.length;
    }
  }
}
