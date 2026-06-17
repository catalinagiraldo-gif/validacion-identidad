import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Learning } from '../pages/gali-descubrimiento/models/gali.models';

@Injectable({ providedIn: 'root' })
export class GaliLearningService {
  private learnings = new BehaviorSubject<Learning[]>([]);
  learnings$ = this.learnings.asObservable();

  add(key: string, icon: string, label: string, detectedBy: string): void {
    const current = this.learnings.value;
    const existing = current.find(l => l.key === key);

    if (existing) {
      const updated = current.map(l =>
        l.key === key
          ? { ...l, counter: (l.counter ?? 1) + 1, timestamp: Date.now(), detectedBy }
          : l,
      );
      this.learnings.next(updated);
    } else {
      this.learnings.next([
        ...current,
        { key, icon, label, detectedBy, counter: 1, timestamp: Date.now() },
      ]);
    }
  }

  forget(key: string): void {
    this.learnings.next(this.learnings.value.filter(l => l.key !== key));
  }

  forgetAll(): void {
    this.learnings.next([]);
  }

  get count(): number {
    return this.learnings.value.length;
  }
}
