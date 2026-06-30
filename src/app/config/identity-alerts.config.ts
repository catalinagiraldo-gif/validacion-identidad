import { IdentitySatelliteStatus } from '../common/models/identity-flow.models';

export interface IdentityAlertConfig {
  type: 'warning' | 'info' | 'error';
  icon: string;
  text: string;
  cta: string;
  step: number;
  stateLabel: string;
}

export const IDENTITY_STATUS_OPTIONS: IdentitySatelliteStatus[] = [
  'sin_validar',
  'pendiente',
  'en_revision',
  'rechazado',
  'aprobado',
];

/** Contextual copy overrides per satellite module */
export type IdentityAlertContext =
  | 'default'
  | 'retiros'
  | 'dropicard'
  | 'bancarios'
  | 'catalogo'
  | 'pedidos'
  | 'proveedores'
  | 'home';

const CONTEXT_ACTIONS: Record<IdentityAlertContext, string> = {
  default: 'esta función',
  retiros: 'retirar fondos',
  dropicard: 'solicitar Dropicard',
  bancarios: 'agregar cuentas bancarias',
  catalogo: 'crear órdenes',
  pedidos: 'gestionar pedidos',
  proveedores: 'ver proveedores',
  home: 'todas las funciones',
};

const BASE_ALERTS: Record<IdentitySatelliteStatus, IdentityAlertConfig | null> = {
  sin_validar: {
    type: 'warning',
    icon: 'pi-shield',
    step: 1,
    stateLabel: 'Sin validar',
    text: 'Verifica tu identidad para desbloquear retiros, facturación y Dropicard. Solo toma unos minutos.',
    cta: 'Verificar identidad',
  },
  pendiente: {
    type: 'warning',
    icon: 'pi-exclamation-triangle',
    step: 2,
    stateLabel: 'Verificación incompleta',
    text: 'Tienes una verificación incompleta. Termínala para recuperar el acceso completo.',
    cta: 'Continuar verificación',
  },
  en_revision: {
    type: 'info',
    icon: 'pi-clock',
    step: 3,
    stateLabel: 'En revisión',
    text: 'Tus datos están en revisión. Te notificaremos cuando tengamos novedades.',
    cta: 'Ver estado',
  },
  rechazado: {
    type: 'error',
    icon: 'pi-times-circle',
    step: 2,
    stateLabel: 'Verificación rechazada',
    text: 'Tu verificación fue rechazada. Reintenta para recuperar el acceso.',
    cta: 'Reintentar',
  },
  aprobado: null,
};

export function getIdentityAlert(
  status: IdentitySatelliteStatus,
  context: IdentityAlertContext = 'default',
): IdentityAlertConfig | null {
  const base = BASE_ALERTS[status];
  if (!base) return null;

  const action = CONTEXT_ACTIONS[context];
  const cloned = { ...base };

  if (status === 'sin_validar') {
    cloned.text = `Para ${action}, verifica tu identidad. Sin validar, esta función permanece bloqueada.`;
    cloned.cta = context === 'home' ? 'Verificar identidad' : `Desbloquear ${action}`;
  } else if (status === 'pendiente') {
    cloned.text = `Casi listo. Completa la verificación para ${action}.`;
  } else if (status === 'en_revision') {
    cloned.text = `Tu identidad está en revisión. Podrás ${action} en cuanto aprobemos tu validación.`;
  } else if (status === 'rechazado') {
    cloned.text = `Tu verificación fue rechazada. Reintenta para recuperar ${action}.`;
  }

  return cloned;
}
