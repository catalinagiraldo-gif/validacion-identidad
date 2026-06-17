import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { GaliMarkComponent } from '../gali-mark/gali-mark.component';
import {
  AccionGali,
  OrquestadorService,
  RespuestaGali,
} from '../../../services/gali-v2/orquestador.service';
import { GaliStreamingService } from '../../../services/gali-v2/streaming.service';

@Component({
  selector: 'gali-response-overlay',
  standalone: true,
  imports: [CommonModule, GaliMarkComponent],
  templateUrl: './gali-response-overlay.component.html',
  styleUrls: ['./gali-response-overlay.component.scss'],
})
export class GaliResponseOverlayComponent implements OnInit, OnDestroy {
  private orquestador = inject(OrquestadorService);
  private streaming = inject(GaliStreamingService);

  respuesta: RespuestaGali | null = null;
  textoStream = '';
  streamingActivo = false;

  private subs: Subscription[] = [];
  private streamSub?: Subscription;

  ngOnInit() {
    this.subs.push(
      this.orquestador.respuestaActual$.subscribe(r => {
        this.respuesta = r;
        if (r) {
          this.startStream(r.texto);
        } else {
          this.streamSub?.unsubscribe();
          this.textoStream = '';
          this.streamingActivo = false;
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
    this.streamSub?.unsubscribe();
  }

  private startStream(texto: string) {
    this.streamingActivo = true;
    this.textoStream = '';
    this.streamSub?.unsubscribe();
    this.streamSub = this.streaming.stream(texto).subscribe({
      next: t => (this.textoStream = t),
      complete: () => (this.streamingActivo = false),
    });
  }

  cerrar() {
    this.orquestador.cerrar();
  }

  ejecutar(a: AccionGali) {
    this.orquestador.ejecutar(a);
    this.cerrar();
  }

  saltarStream() {
    if (this.respuesta && this.streamingActivo) {
      this.streamSub?.unsubscribe();
      this.textoStream = this.respuesta.texto;
      this.streamingActivo = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.respuesta) this.cerrar();
  }

  onBackdropClick(ev: MouseEvent) {
    if (ev.target === ev.currentTarget) this.cerrar();
  }
}
