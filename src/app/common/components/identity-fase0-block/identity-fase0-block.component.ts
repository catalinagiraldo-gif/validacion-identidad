import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentityFase0Service } from '../../services/identity-fase0.service';
import { IdentityFase0BackstageDotComponent } from '../identity-fase0-backstage-dot/identity-fase0-backstage-dot.component';
import { Fase0BlockMotivo } from '../../models/identity-flow-v2.models';

// Etapa 1 del Service Blueprint Fase 0: Freno Seco — Modal Pantalla Completa
// (Bloqueo Visual / Spam Recurrente — Sin Salida). Sin botón de cierre ni de
// "Contactar a soporte" dentro del modal (blueprint corrige la UX-Writing
// vieja: ese botón nunca existió como destino real). La única vía es el
// ícono de soporte flotante, fuera del modal — el reset del demo lo hace el
// demo-panel vía closeBlock().
//
// Dos motivos reales del blueprint comparten este mismo componente:
// 'fraude' (Etapa 1, saldo negativo/fraude + Retiro o Envío) y 'rechazado'
// (Etapa Continua → "luego expulsión (ver Etapa 1)", tras cerrar la
// notificación "No pudimos verificar tu identidad").

interface BlockView {
  headline: string;
  texto: string;
  hint: string;
  backstage: string;
}

// Blueprint: la expulsión post-rechazo usa el mismo Freno Seco de Etapa 1
// ("Bloqueamos esta operación…"), no reutiliza el headline del modal ligero
// de Etapa Continua ("No pudimos verificar…"). Lo que cambia es el chip de
// soporte (hint) y la nota de backstage.
const BLOCK_COPY = {
  headline: 'Bloqueamos esta operación por seguridad',
  texto:
    'Estamos revisando tu cuenta para proteger tus fondos. No podrás hacer retiros ni envíos mientras dure la revisión. ¿Tienes dudas? Comparte tu caso desde el ícono de soporte, abajo a la derecha.',
} as const;

const BLOCK_VIEWS: Record<Fase0BlockMotivo, BlockView> = {
  fraude: {
    ...BLOCK_COPY,
    hint: 'Abre el widget de soporte flotante · chip "Validación de identidad" → "Mi cuenta está bloqueada"',
    backstage: 'Cartera (Andrés Herrera) corre un script en Python que cruza saldo negativo/fraude por país (y correo + DNI para baneos multipaís) y lanza campañas focalizadas en UserPilot. No es un freeze de saldo por código — es UserPilot interceptando la pantalla hasta que Legal/Financiero resuelvan el caso a mano.',
  },
  rechazado: {
    ...BLOCK_COPY,
    hint: 'Abre el widget de soporte flotante · chip "Validación de identidad" → "Me rechazaron la verificación"',
    backstage: 'Expulsión tras rechazo en Sumsub (Etapa Continua → "luego expulsión, ver Etapa 1"): mismo Freno Seco visual que fraude, pero el chip de soporte es "Me rechazaron la verificación". Distinto de "Bloqueado" (revisión Legal/Financiero) — no se menciona fraude al usuario. Soporte puede desbanear si es falso positivo.',
  },
};

@Component({
  selector: 'app-identity-fase0-block',
  standalone: true,
  imports: [CommonModule, IdentityFase0BackstageDotComponent],
  templateUrl: './identity-fase0-block.component.html',
  styleUrls: ['./identity-fase0-block.component.scss'],
})
export class IdentityFase0BlockComponent {
  readonly fase0 = inject(IdentityFase0Service);

  readonly view = computed<BlockView>(() => BLOCK_VIEWS[this.fase0.blockMotivo()]);
}
