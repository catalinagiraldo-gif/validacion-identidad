import { Injectable, signal } from '@angular/core';
import snapshotData from '../../../../mocks/gali-v3/business-snapshot.json';
import { BusinessSnapshot } from './types';

@Injectable({ providedIn: 'root' })
export class GaliBusinessService {
  readonly snapshot = signal<BusinessSnapshot>(snapshotData as BusinessSnapshot);

  formatCurrency(value: number, currency = 'COP'): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
    return `$${value}`;
  }
}
