import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-gali-v3-equipo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <article class="equipo">
      <header class="equipo__head">
        <span class="equipo__tag">✦ Mi equipo</span>
        <h1>Quién puede ver y hacer qué</h1>
        <p>Gali puede hablar con tu asistente vía WhatsApp cuando hay pedidos por confirmar.</p>
      </header>

      <ul class="equipo__members">
        <li class="equipo__member">
          <div class="equipo__avatar">T</div>
          <div>
            <strong>Tú</strong>
            <span>Dueño · Acceso total</span>
          </div>
        </li>
        <li class="equipo__member">
          <div class="equipo__avatar">A</div>
          <div>
            <strong>Asistente</strong>
            <span>Pedidos · Ve solo pedidos</span>
          </div>
        </li>
      </ul>

      <section class="equipo__whatsapp">
        <h2>Gali habla con tu asistente vía WhatsApp</h2>
        <p class="equipo__mock-msg">"Hola [asistente], tienes 5 pedidos por confirmar hoy."</p>
        <div class="equipo__actions">
          <button type="button" class="equipo__btn">Configurar</button>
          <button type="button" class="equipo__btn equipo__btn--ghost">Ver actividad del equipo</button>
        </div>
      </section>

      <section class="equipo__activity">
        <h3>Actividad reciente</h3>
        <ul>
          <li>Asistente confirmó 12 pedidos Bogotá · hace 2 h</li>
          <li>Gali envió alerta novedades · hoy 8:32am</li>
        </ul>
      </section>
    </article>
  `,
  styles: [`
    @import 'styles/gali-v3-tokens';
    :host { display: block; height: 100%; overflow-y: auto; }
    .equipo { padding: $gv3-space-6 $gv3-space-8; max-width: 640px; font-family: $gv3-font-body; }
    .equipo__tag { font-family: $gv3-font-mono; font-size: 11px; color: $gv3-terracota; }
    .equipo__head h1 { font-family: $gv3-font-display; font-size: $gv3-text-2xl; margin: $gv3-space-2 0; }
    .equipo__head p { color: $gv3-text-secondary; font-size: $gv3-text-sm; }
    .equipo__members { list-style: none; padding: 0; margin: $gv3-space-5 0; display: flex; flex-direction: column; gap: $gv3-space-3; }
    .equipo__member {
      display: flex; gap: $gv3-space-3; align-items: center; padding: $gv3-space-4;
      background: $gv3-bg-surface; border-radius: $gv3-radius-md; border: 1px solid $gv3-border-whisper;
      strong { display: block; font-size: $gv3-text-sm; }
      span { font-size: $gv3-text-xs; color: $gv3-text-tertiary; }
    }
    .equipo__avatar {
      width: 40px; height: 40px; border-radius: 50%; background: $gv3-orange-soft;
      display: flex; align-items: center; justify-content: center; font-weight: 600; color: $gv3-rust;
    }
    .equipo__whatsapp {
      padding: $gv3-space-5; background: $gv3-bg-warm; border-radius: $gv3-radius-md;
      border-left: 3px solid $gv3-terracota; margin-bottom: $gv3-space-5;
      h2 { font-size: $gv3-text-base; margin: 0 0 $gv3-space-2; }
    }
    .equipo__mock-msg {
      font-size: $gv3-text-sm; color: $gv3-text-secondary; font-style: italic;
      padding: $gv3-space-3; background: $gv3-bg-surface; border-radius: $gv3-radius-sm; margin: 0 0 $gv3-space-3;
    }
    .equipo__actions { display: flex; gap: $gv3-space-2; }
    .equipo__btn {
      font-family: $gv3-font-mono; font-size: 11px; padding: 8px 14px;
      border-radius: $gv3-radius-sm; border: 0; background: $gv3-orange; color: $gv3-text-onAccent; cursor: pointer;
      &--ghost { background: transparent; border: 1px solid $gv3-border-default; color: $gv3-text-secondary; }
    }
    .equipo__activity h3 { font-size: $gv3-text-sm; color: $gv3-text-tertiary; }
    .equipo__activity ul { list-style: none; padding: 0; font-size: $gv3-text-sm; color: $gv3-text-secondary; }
    .equipo__activity li { padding: 6px 0; border-bottom: 1px solid $gv3-border-whisper; }
  `],
})
export class GaliV3EquipoComponent {}
