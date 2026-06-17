import { CommonModule } from '@angular/common';
import { Component, Input, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { GaliChatService } from '../../../services/gali-v3/chat.service';

export interface AwakenSuggestion {
  icon: string;
  label: string;
  meta: string;
  prompt: string;
  route?: string;
}

@Component({
  selector: 'awaken-overlay',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './awaken-overlay.component.html',
  styleUrls: ['./awaken-overlay.component.scss'],
})
export class AwakenOverlayComponent {
  @Input() section!: string;
  @Input() title!: string;
  @Input() resumen!: string;
  @Input() suggestions: AwakenSuggestion[] = [];

  private chatSvc = inject(GaliChatService);
  private router = inject(Router);

  open = signal(false);
  draft = signal('');

  toggle() { this.open.update(v => !v); }
  close() { this.open.set(false); }

  pickSuggestion(s: AwakenSuggestion) {
    this.chatSvc.send(s.prompt);
    if (s.route) this.router.navigateByUrl(s.route);
    this.close();
  }

  send() {
    const t = this.draft().trim();
    if (!t) return;
    this.chatSvc.send(`[${this.section}] ${t}`);
    this.draft.set('');
    this.close();
  }
}
