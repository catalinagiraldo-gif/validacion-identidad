import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

/**
 * galiInsight directive — Ambient Intelligence Layer
 *
 * Apply to any metric element to show a Gali analysis tooltip on hover.
 * Usage: <span galiInsight="Gali detectó tendencia alcista en este ROAS. +12% vs semana anterior.">2.9×</span>
 * Or: <span [galiInsight]="dynamicInsightText">{{ value }}</span>
 */
@Directive({
  selector: '[galiInsight]',
  standalone: true,
})
export class GaliInsightDirective implements OnInit, OnDestroy {
  @Input('galiInsight') insight = '';

  private tooltip: HTMLElement | null = null;
  private mouseenterFn?: () => void;
  private mouseleaveFn?: () => void;
  private mousemoveFn?: (e: MouseEvent) => void;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const host = this.el.nativeElement;

    // Style the host element to show it has Gali context
    this.renderer.setStyle(host, 'cursor', 'default');
    this.renderer.setStyle(host, 'border-bottom', '1px dashed rgba(255, 97, 2, 0.4)');
    this.renderer.setStyle(host, 'position', 'relative');

    this.mouseenterFn = () => this.showTooltip();
    this.mouseleaveFn = () => this.hideTooltip();
    this.mousemoveFn  = (e: MouseEvent) => this.moveTooltip(e);

    host.addEventListener('mouseenter', this.mouseenterFn);
    host.addEventListener('mouseleave', this.mouseleaveFn);
    host.addEventListener('mousemove', this.mousemoveFn as EventListener);
  }

  ngOnDestroy(): void {
    this.hideTooltip();
    const host = this.el.nativeElement;
    if (this.mouseenterFn) host.removeEventListener('mouseenter', this.mouseenterFn);
    if (this.mouseleaveFn) host.removeEventListener('mouseleave', this.mouseleaveFn);
    if (this.mousemoveFn)  host.removeEventListener('mousemove', this.mousemoveFn as EventListener);
  }

  private showTooltip(): void {
    if (!this.insight) return;
    if (this.tooltip) return;

    const tip = this.renderer.createElement('div') as HTMLElement;
    tip.className = 'gali-insight-tip';
    tip.innerHTML = `
      <span class="gali-insight-tip__glyph">✦</span>
      <div class="gali-insight-tip__body">
        <strong class="gali-insight-tip__label">Gali Insight</strong>
        <p class="gali-insight-tip__text">${this.insight}</p>
      </div>
    `;
    tip.style.cssText = `
      position: fixed;
      z-index: 9999;
      background: #1a1a22;
      color: #e2e2e8;
      border: 1px solid rgba(255, 97, 2, 0.35);
      border-radius: 10px;
      padding: 10px 14px;
      max-width: 260px;
      min-width: 200px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s ease;
      line-height: 1.4;
    `;

    const glyph = tip.querySelector('.gali-insight-tip__glyph') as HTMLElement;
    if (glyph) {
      glyph.style.cssText = 'color: #ff6102; font-size: 14px; flex-shrink: 0; margin-top: 1px;';
    }
    const label = tip.querySelector('.gali-insight-tip__label') as HTMLElement;
    if (label) {
      label.style.cssText = 'display: block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #ff6102; margin-bottom: 4px;';
    }
    const text = tip.querySelector('.gali-insight-tip__text') as HTMLElement;
    if (text) {
      text.style.cssText = 'margin: 0; font-size: 12px; color: #c8c8d8; line-height: 1.5;';
    }

    document.body.appendChild(tip);
    this.tooltip = tip;

    // Fade in
    requestAnimationFrame(() => {
      if (this.tooltip) this.tooltip.style.opacity = '1';
    });
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
      const tip = this.tooltip;
      setTimeout(() => {
        if (tip.parentNode) tip.parentNode.removeChild(tip);
      }, 150);
      this.tooltip = null;
    }
  }

  private moveTooltip(e: MouseEvent): void {
    if (!this.tooltip) return;
    const offset = 14;
    let x = e.clientX + offset;
    let y = e.clientY + offset;

    const tipW = this.tooltip.offsetWidth || 260;
    const tipH = this.tooltip.offsetHeight || 80;

    if (x + tipW > window.innerWidth - 8) x = e.clientX - tipW - offset;
    if (y + tipH > window.innerHeight - 8) y = e.clientY - tipH - offset;

    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top  = `${y}px`;
  }
}
