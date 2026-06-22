import { Injectable, signal } from '@angular/core';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  title?: string;
  severity: ToastSeverity;
  duration: number;
}

export interface ToastOptions {
  title?: string;
  severity?: ToastSeverity;
  /** Auto-dismiss in ms. 0 = no auto-dismiss. Default 4000. */
  duration?: number;
}

/**
 * Shared toast notifications following the dropi-toast DS spec
 * (fixed top-right, 8px severity border, auto-dismiss 3-5s).
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<ToastItem[]>([]);
  private seq = 0;

  show(message: string, opts: ToastOptions = {}): void {
    const id = ++this.seq;
    const item: ToastItem = {
      id,
      message,
      title: opts.title,
      severity: opts.severity ?? 'success',
      duration: opts.duration ?? 4000,
    };
    this.toasts.update(list => [...list, item]);
    if (item.duration > 0) {
      setTimeout(() => this.dismiss(id), item.duration);
    }
  }

  success(message: string, title?: string): void { this.show(message, { severity: 'success', title }); }
  error(message: string, title?: string): void { this.show(message, { severity: 'error', title }); }
  warning(message: string, title?: string): void { this.show(message, { severity: 'warning', title }); }
  info(message: string, title?: string): void { this.show(message, { severity: 'info', title }); }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
