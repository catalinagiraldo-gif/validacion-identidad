import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IdentidadTourService, TourStep } from './identidad-tour.service';
import { IdentityDemoStateService, FaseUsuario } from './identity-demo-state.service';
import { IdentityDemoStateV2Service } from './identity-demo-state-v2.service';
import { IdentityModalService } from './identity-modal.service';

/**
 * Guion de negocio para stakeholders (sponsors, board, Product Designers) —
 * distinto del acompañamiento fino de los controles del demo-panel. Cada
 * paso conduce la demo en vivo (fija fase/etapa/país, navega a la pantalla
 * real) mientras narra en lenguaje llano, sin jerga de componentes ni
 * códigos RN-XX, qué problema de negocio resuelve ese momento (fuente:
 * docs/validacion/Historia.md y Consideraciones.md). Usa el motor de tour ya
 * existente (IdentidadTourService/IdentidadTourComponent) — no es un motor
 * nuevo, solo un guion de contenido distinto sobre el mismo mecanismo.
 */
@Injectable({ providedIn: 'root' })
export class IdentidadStakeholderTourService {
  private tour     = inject(IdentidadTourService);
  private router   = inject(Router);
  private stateSvc = inject(IdentityDemoStateService);
  private stateV2  = inject(IdentityDemoStateV2Service);
  private modalSvc = inject(IdentityModalService);

  start(): void {
    this.modalSvc.close();
    this.tour.setSteps(this.buildSteps());
    this.tour.start();
  }

  /** Mismo puente que usa el demo-panel al cambiar "Momento del usuario": mantiene sincronizados el servicio base (que consumen 9 páginas /old/) y el v2. */
  private irAMomento(momento: FaseUsuario): void {
    this.stateSvc.setFase(momento);
    this.stateV2.setMomentoUsuario(momento);
    if (momento === 'setup') this.stateV2.resetStatusParaSetup();
  }

  private buildSteps(): TourStep[] {
    return [
      {
        id: 'intro',
        title: 'El vacío legal que resuelve este proyecto',
        body: 'Hoy Dropi valida identidad con un solo mecanismo (Truora), y solo para personas naturales en Colombia. El 40% de las validaciones se gestiona a mano por WhatsApp sin SLA, no existe validación de empresas, y a los extranjeros se les valida por nombre — no por documento —, con riesgo real de homónimos y facturas inválidas. Este recorrido muestra, fase por fase, cómo el nuevo sistema cierra esos huecos sin frenar la operación del negocio.',
        placement: 'center',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase0');
          this.irAMomento('setup');
          this.router.navigate(['/new/home']);
        },
      },
      {
        id: 'fase0',
        title: 'Fase 0 · Onboarding sin fricción',
        body: 'Al registrarse o recargar la wallet nunca se pide ningún documento — eso mata la conversión del usuario nuevo. Solo después de su primera venta aparece un aviso amable invitándolo a configurar sus datos, nunca un bloqueo.',
        target: '[data-tour="fase-entrega"]',
        placement: 'bottom',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase0');
          this.irAMomento('activacion');
          this.router.navigate(['/new/home']);
        },
      },
      {
        id: 'fase1',
        title: 'Fase 1 · Bloqueo cruzado de usuarios baneados',
        body: 'Antes de cualquier otra validación, el sistema revisa si el correo ya fue baneado en otro país — si lo fue, bloquea el acceso sin darle ni un botón para reintentar. Esto evita que alguien expulsado por fraude en un país siga operando libremente en otro con la misma cuenta.',
        target: '[data-tour="fase-entrega"]',
        placement: 'bottom',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase1');
          this.stateV2.setSegmentoUsuario('baneado-cross-country');
          this.stateV2.setEmailEnListaNegra(true);
          this.router.navigate(['/new/home']);
        },
      },
      {
        id: 'fase2',
        title: 'Fase 2 · Formulario unificado (Colombia, persona natural)',
        body: 'Cuando este usuario intenta retirar dinero aparece el bloqueo — pero solo sobre esa acción puntual: nunca deja de poder vender ni crear órdenes, ese es el motor del negocio y nunca se toca. Para Colombia + persona natural, la validación corre con Truora y llena de una sola vez los datos de identidad y de facturación, sin pedirlos dos veces.',
        target: '[data-tour="identity-gate"]',
        placement: 'top',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase2');
          this.irAMomento('habito');
          this.stateV2.setSegmentoUsuario('dropshipper-natural');
          this.stateV2.setEmailEnListaNegra(false);
          this.stateV2.setPais('CO');
          this.stateV2.setTipoPersona('natural');
          this.stateV2.setStatus('sin_validar');
          this.router.navigate(['/new/financiero/retiros-de-saldo']);
        },
      },
      {
        id: 'fase3',
        title: 'Fase 3 · Sumsub, empresas y ruteo internacional',
        body: 'Para el resto del mundo (fuera de Colombia, o cualquier empresa), el motor cambia a Sumsub. Una empresa ya no digita su NIT: elige el país, escribe el nombre, y el sistema trae los datos reales para que solo confirme — cero fricción. Si la empresa no se puede validar todavía, el usuario no pierde lo ya avanzado ni se degrada a persona natural: queda pendiente para reintentar directo.',
        target: '[data-tour="identity-gate"]',
        placement: 'top',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase3');
          this.irAMomento('profesional');
          this.stateV2.setSegmentoUsuario('proveedor-juridica');
          this.stateV2.setPais('MX');
          this.stateV2.setTipoPersona('juridica');
          this.stateV2.setStatus('sin_validar');
          this.router.navigate(['/new/financiero/retiros-de-saldo']);
        },
      },
      {
        id: 'fase4',
        title: 'Fase 4 · Migración de la base existente',
        body: 'A los usuarios antiguos no se les pide repetir el proceso desde cero: los ya validados se migran por detrás, sin que lo noten. Al resto se le avisa con 1-2 semanas de anticipación antes de aplicar cualquier bloqueo — nunca de un día para otro, nunca a toda la base a la vez. Y ningún dato fiscal se guarda hasta que la autoridad tributaria lo confirme en tiempo real: así se evita que alguien escriba un dato falso solo para saltarse el control.',
        target: '[data-tour="migration-banner"]',
        placement: 'bottom',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase4');
          this.irAMomento('legacy');
          this.stateV2.setSegmentoUsuario('migrado-legacy');
          this.stateV2.setPais('EC');
          this.stateV2.setStatus('sin_validar');
          this.stateV2.setWebhookConfirmed(false);
          this.router.navigate(['/new/historial-de-cartera']);
        },
      },
      {
        id: 'fase5',
        title: 'Fase 5 · Edición inteligente, sin pagar validaciones de más',
        body: 'Una vez validado, el Dueño de la cuenta no puede tocar su nombre ni su documento por 6 meses — así se previene fraude y lavado de activos. Quien factura, en cambio, puede cambiar de persona natural a empresa cuando quiera: los datos de contacto se guardan al instante, pero cambiar algo sensible (nombre, documento) siempre exige verificarse de nuevo y bloquea retiros mientras se revisa.',
        target: '[data-tour="cuenta-lock-rn11"]',
        placement: 'bottom',
        onEnter: () => {
          this.stateV2.setFaseProyecto('fase5');
          this.irAMomento('habito');
          this.stateV2.setPais('CO');
          this.stateV2.setTipoPersona('natural');
          this.stateV2.setStatus('aprobado');
          this.stateV2.setMesesDesdeUltimaValidacion(2);
          this.router.navigate(['/new/configuraciones/cuenta']);
        },
      },
      {
        id: 'cierre',
        title: 'De 40% manual a menos de 8%',
        body: 'Ese es el norte del proyecto: bajar la carga operativa de Back Office sin frenar nunca la orden — el motor que une todo el ecosistema de Dropi — ni pedirle al usuario más de lo necesario en cada momento. Quedan preguntas abiertas que este prototipo no resuelve todavía: el alcance de KYT para criptoactivos, un flujo nativo para Guatemala/Panamá, y el tratamiento de marca propia/emprendedor — decisiones pendientes de Legal y Producto, no huecos del diseño.',
        placement: 'center',
        onEnter: () => {
          this.router.navigate(['/new/home']);
        },
      },
    ];
  }
}
