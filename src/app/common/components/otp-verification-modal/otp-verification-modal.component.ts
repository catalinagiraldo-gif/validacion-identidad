import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { DropiModalComponent } from '../dropi-modal/dropi-modal.component';

@Component({
  selector: 'app-otp-verification-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DropiModalComponent],
  template: `
    <app-dropi-modal header="Confirma con un código" [visible]="visible" width="420px" (visibleChange)="onClose()">
      <p class="otp-text">
        Enviamos un código de 6 dígitos a tu medio de contacto actual
        <strong>{{ medio }}</strong>
        para confirmar este cambio.
      </p>
      <div class="otp-field">
        <label class="otp-label">Código de verificación</label>
        <input
          type="text"
          inputmode="numeric"
          maxlength="6"
          class="otp-input"
          [class.otp-input--error]="error"
          [(ngModel)]="code"
          [ngModelOptions]="{ standalone: true }"
          placeholder="000000"
          (keyup.enter)="verificar()"
        />
        @if (error) {
          <p class="otp-error">{{ error }}</p>
        }
      </div>
      <p class="otp-hint">Entorno de prueba: el código es <strong>123456</strong>.</p>
      <div footer>
        <button type="button" class="otp-btn otp-btn--secondary" (click)="onClose()">Cancelar</button>
        <button type="button" class="otp-btn otp-btn--primary" [disabled]="code.length !== 6 || verificando()" (click)="verificar()">
          Verificar
        </button>
      </div>
    </app-dropi-modal>
  `,
  styleUrls: ['./otp-verification-modal.component.scss'],
})
export class OtpVerificationModalComponent implements OnChanges {
  @Input() visible = false;
  @Input({ required: true }) medio = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() verified = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private http = inject(HttpClient);

  code = '';
  error = '';
  readonly verificando = signal(false);
  private requestId = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.code = '';
      this.error = '';
      this.http.post<{ requestId: string }>('/api/otp/request', { medio: this.medio }).subscribe((res) => {
        this.requestId = res.requestId;
      });
    }
  }

  verificar(): void {
    if (this.code.length !== 6) return;
    this.verificando.set(true);
    this.error = '';
    this.http
      .post<{ verified: boolean }>('/api/otp/verify', { requestId: this.requestId, code: this.code })
      .subscribe({
        next: () => {
          this.verificando.set(false);
          this.close();
          this.verified.emit();
        },
        error: () => {
          this.verificando.set(false);
          this.error = 'Código incorrecto. Inténtalo de nuevo.';
        },
      });
  }

  onClose(): void {
    this.close();
    this.cancelled.emit();
  }

  private close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
