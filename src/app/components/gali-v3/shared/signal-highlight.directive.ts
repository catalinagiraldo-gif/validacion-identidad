import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Aplica una clase `is-highlighted-signal` a los elementos con [data-signal="ID"]
 * cuando la URL trae ?signal=ID. La clase pulsa 3 veces y luego se quita.
 *
 * Uso: en cualquier página target, agregar [data-signal="signal-id"] al elemento a resaltar.
 * Y poner <ng-container signalHighlight></ng-container> dentro del componente (o en el host).
 */
@Directive({
  selector: '[signalHighlight]',
  standalone: true,
})
export class SignalHighlightDirective implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private host = inject(ElementRef<HTMLElement>);
  private sub?: Subscription;

  ngOnInit() {
    this.sub = this.route.queryParamMap.subscribe(params => {
      const id = params.get('signal');
      if (!id) return;
      // Esperamos un tick a que el DOM esté renderizado
      queueMicrotask(() => this.applyHighlight(id));
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  private applyHighlight(signalId: string) {
    const root: HTMLElement = this.host.nativeElement;
    // Buscar elementos con data-signal coincidente, o si no, todo el container
    const targets = Array.from(root.querySelectorAll(`[data-signal="${signalId}"]`)) as HTMLElement[];
    const elements: HTMLElement[] = targets.length > 0 ? targets : [root];

    elements.forEach(el => {
      el.classList.add('is-highlighted-signal');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.classList.remove('is-highlighted-signal'), 4500);
    });
  }
}
