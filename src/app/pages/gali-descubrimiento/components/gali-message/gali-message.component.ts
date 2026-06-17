import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GaliService } from '../../../../services/gali.service';
import { GaliMessage } from '../../models/gali.models';
import { ConfidenceMeterComponent } from '../confidence-meter/confidence-meter.component';
import { GaliAvatarComponent } from '../gali-avatar/gali-avatar.component';

@Component({
  selector: 'gali-message',
  standalone: true,
  imports: [CommonModule, ConfidenceMeterComponent, GaliAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="msg" [attr.data-type]="message.type">
      <ng-container [ngSwitch]="message.type">
        <!-- USER MESSAGE -->
        <div *ngSwitchCase="'user'" class="msg__user">
          <div class="msg__bubble msg__bubble--user">{{ message.text }}</div>
        </div>

        <!-- GALI TEXT -->
        <div *ngSwitchCase="'gali-text'" class="msg__gali">
          <gali-avatar size="inline" state="idle"></gali-avatar>
          <div class="msg__bubble msg__bubble--gali">
            <p class="msg__text">
              {{ displayText() }}<span class="msg__cursor" *ngIf="streaming()"></span>
            </p>
            <confidence-meter
              *ngIf="showConfidenceMeter()"
              [value]="message.confidence!"
              [details]="message.confidenceDetails ?? []"
            ></confidence-meter>
            <div
              class="msg__trust-mute"
              *ngIf="message.confidence != null && !streaming() && !showConfidenceMeter()"
              title="Trust Stage 2 — Gali se calla cuando confía (>{{ 80 }}%)"
            >
              ✓ confianza alta · silenciado
            </div>
          </div>
        </div>

        <!-- NUDGE -->
        <div *ngSwitchCase="'nudge'" class="msg__nudge">
          <gali-avatar size="inline" state="alert"></gali-avatar>
          <div class="msg__bubble msg__bubble--nudge">
            <div class="msg__nudge-label">NUDGE PROACTIVO</div>
            <p class="msg__text">{{ message.text }}</p>
          </div>
        </div>

        <!-- REASONING — used only inside canvas, hidden in thread -->
        <div *ngSwitchCase="'reasoning'" hidden></div>
      </ng-container>
    </div>
  `,
  styleUrl: './gali-message.component.scss',
})
export class GaliMessageComponent implements OnInit, OnDestroy {
  private galiSvc = inject(GaliService);

  @Input({ required: true }) message!: GaliMessage;

  displayText = signal('');
  streaming = signal(false);
  trustStage = signal<1 | 2>(1);
  private timerId: any;
  private trustSub?: any;

  ngOnInit(): void {
    this.trustSub = this.galiSvc.trustStage$.subscribe(s => this.trustStage.set(s));
    if (this.message.streaming && !this.message.instant && this.message.text) {
      this.streaming.set(true);
      this.streamText(this.message.text);
    } else {
      this.displayText.set(this.message.text ?? '');
    }
  }

  /** Trust Stage 1: siempre. Trust Stage 2: solo si <80% (Gali admite incertidumbre). */
  showConfidenceMeter(): boolean {
    if (this.message.confidence == null || this.streaming()) return false;
    if (this.trustStage() === 1) return true;
    return this.message.confidence < 80;
  }

  private streamText(text: string): void {
    const words = text.split(' ');
    let idx = 0;
    const tick = () => {
      if (idx >= words.length) {
        this.streaming.set(false);
        return;
      }
      const next = words.slice(0, idx + 1).join(' ');
      this.displayText.set(next);
      idx++;
      this.timerId = setTimeout(tick, 30 * Math.max(3, words[idx - 1]?.length ?? 4));
    };
    tick();
  }

  ngOnDestroy(): void {
    if (this.timerId) clearTimeout(this.timerId);
    this.trustSub?.unsubscribe();
  }
}
