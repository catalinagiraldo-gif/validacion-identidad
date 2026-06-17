import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import builderProfile from '../../../../../mocks/gali-v3/builder-profile.json';

@Component({
  selector: 'app-gali-v3-builders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './builders.component.html',
  styleUrls: ['./builders.component.scss'],
})
export class GaliV3BuildersComponent {
  data = builderProfile;

  formatCop(n: number): string {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
    return `$${n}`;
  }

  pctTier(): number {
    return this.data.perfil.tier_progress_to_next;
  }

  pctRequisito(actual: number, objetivo: number): number {
    return Math.min(100, Math.round((actual / objetivo) * 100));
  }
}
