import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaliAvatarComponent } from '../gali-avatar/gali-avatar.component';
import { GaliInputComponent } from '../gali-input/gali-input.component';
import { GaliSuggestionChipComponent } from '../gali-suggestion-chip/gali-suggestion-chip.component';
import { AvatarState, GaliMessage } from '../../models/gali.models';

@Component({
  selector: 'gali-hero',
  standalone: true,
  imports: [
    CommonModule,
    GaliAvatarComponent,
    GaliInputComponent,
    GaliSuggestionChipComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="hero">
      <div class="hero__halo"></div>
      <div class="hero__card">
        <div class="hero__avatar">
          <gali-avatar size="hero" [state]="avatarState"></gali-avatar>
        </div>

        <h1 class="hero__greeting" *ngIf="initialMessage">
          {{ initialMessage }}
        </h1>

        <div class="hero__suggestions">
          <gali-suggestion-chip
            *ngFor="let s of suggestions; let i = index"
            [label]="s"
            [delay]="600 + i * 100"
            (clicked)="suggestionClicked.emit($event)"
          ></gali-suggestion-chip>
        </div>

        <div class="hero__input">
          <gali-input
            #input
            size="hero"
            placeholder='Ej. "tendencias en mascotas", "skincare", "hogar"...'
            [streamingEnabled]="streamingEnabled"
            (submitted)="submitted.emit($event)"
            (toggleStream)="toggleStream.emit()"
          ></gali-input>
        </div>

        <div class="hero__hint">
          <span class="hero__hint-key">⌘K</span> para enfocar · Datos LATAM en vivo
        </div>
      </div>
    </div>
  `,
  styleUrl: './gali-hero.component.scss',
})
export class GaliHeroComponent {
  @Input() initialMessage = '';
  @Input() suggestions: string[] = [];
  @Input() avatarState: AvatarState = 'idle';
  @Input() streamingEnabled = true;
  @Output() submitted = new EventEmitter<string>();
  @Output() suggestionClicked = new EventEmitter<string>();
  @Output() toggleStream = new EventEmitter<void>();

  @ViewChild('input') inputRef?: GaliInputComponent;

  focusInput(): void {
    this.inputRef?.focus();
  }
}
