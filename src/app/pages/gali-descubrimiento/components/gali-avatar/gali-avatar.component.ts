import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarState } from '../../models/gali.models';

@Component({
  selector: 'gali-avatar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="avatar"
      [class.avatar--hero]="size === 'hero'"
      [class.avatar--sidebar]="size === 'sidebar'"
      [class.avatar--inline]="size === 'inline'"
      [attr.data-state]="state"
      [attr.aria-label]="'Avatar de Gali. Estado: ' + state"
    >
      <div class="avatar__core">
        <div class="avatar__mesh"></div>
      </div>
      <div class="avatar__sonar" *ngIf="state === 'speaking'"></div>
      <div class="avatar__orbital" *ngIf="state === 'thinking'">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
      <div class="avatar__success" *ngIf="state === 'success'">✓</div>
      <div class="avatar__alert" *ngIf="state === 'alert'">!</div>
    </div>
  `,
  styleUrl: './gali-avatar.component.scss',
})
export class GaliAvatarComponent {
  @Input() state: AvatarState = 'idle';
  @Input() size: 'hero' | 'sidebar' | 'inline' = 'sidebar';
}
