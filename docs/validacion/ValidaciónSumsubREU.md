ago 4, 2026
Revisemos integracion de SumSub - Transcripción
00:00:00

Manuel Digregorio: Yo soy Manuel, soy Solutions Architect en Samsap, principalmente eh me enfoco en ayudar en en la etapa de implementación e integración.
Victor Ney Orobio Hurtado: Primero
Manuel Digregorio: Eh, así que bueno, estuve mirando el flujo que que nos compartieron
Victor Ney Orobio Hurtado: loag.
Manuel Digregorio: y en base a eso armé una una propuesta de arquitectura para que revisemos. Y bueno, en base a esto creo que ya podemos eh avanzar con la configuración. Es el perdón.
Juan Camilo Rojas: No hay un sonido que
Victor Ney Orobio Hurtado: Muy
Juan Camilo Rojas: viene
Manuel Digregorio: Ah, okay, okay. Bueno,
Juan Camilo Rojas: ya.
Manuel Digregorio: les comentaba que en base a esta arquitectura e quizás surge alguna modificación o algo, pero creo que que se puede ya empezar a trabajar en en la configuración de, digamos, desde el lado del dashboard de Sams y en la integración.
Juan Camilo Rojas: Vale, antes Manuel de de de iniciar,
Camilo Diaz Granados: Tal cual.
Juan Camilo Rojas: qué pena, Cami, te te quité te rodé la palabra. Hoy nos acompaña el equipo de tecnología, estaba diciendo que Víctor y José, José es el el líder, digamos, de de la parte del área de tecnología, es el el Project Lead. Eh, Víctor trabaja con él y ellos, digamos que en el orden de de la de la reunión, pues también eh que ellos se presenten y también poder llevar a cabo la reunión conforme a integración.


00:01:46

Juan Camilo Rojas: Y posteriormente pasamos al tema de del flujo como para entender qué es lo que necesitamos de nuestro lado. Eh, para poder iniciar, digamos, con el tema de la integración. Sé que este es un paso importante, ya tenemos los flujos, que es algo que venimos trabajando ya hace algunos días, pero también importante el tema de la integración y el esfuerzo técnico. Entonces le cedo la palabra tecnología y muchas gracias de verdad por este espacio.
Jose Giraldo: Eh, listo, listo, Juan Camilo. Eh, gracias, Manuel. Eh, bueno, pues digamos nosotros dentro del proceso del flujo y todos los otros ya hemos hablado en otros espacios que tenemos un hoy en día en Colombia un servicio con con Rora eh, y este servicio obvamente de desarrollo para que nosotros eh hablemos un poco el mismo tema y y como tecnología, tenemos unos microservicios que lo que hace digamos eh este proceso en Colombia es el proceso de KC solamente en Colombia para la validación de la identidad. Nosotros tenemos, digamos, en el flujo eh mapeado y si lo que estábamos viendo ayer con con Víctor, que aquí está, que es mi compañero y la persona, digamos, como desarrollador que va a implementar todo el proceso, ya era, digamos que pudiéramos coger de base lo que ya estaba, ¿ya?


00:03:14

Jose Giraldo: y poder validar con Sunsun todo el flujo de lo que se quiere, digamos, actualmente eh de desarrollo. Ahí se fue se fue este muchacho.
Camilo Diaz Granados: Se fue Manuel, pero dejémoslo ya ya de ingresar.
Jose Giraldo: Ah,
Camilo Diaz Granados: Pero José, antes justo con con esto que mencionas, le quería hacer una pregunta. ¿Ustedes vieron ya la documentación nuestra?
Jose Giraldo: dale. Sí, sí, sí, sí.
Camilo Diaz Granados: S.
Jose Giraldo: la de ustedes y nosotros digamos ya la hemos visto y ya anteriormente otras reuniones pues ya me la habían
Camilo Diaz Granados: Buenísimo.
Jose Giraldo: pasado y ya digamos tenemos pues eh el usuario digamos con cual eh creamos
Camilo Diaz Granados: Excelente.
Jose Giraldo: un perfil para Víctor donde como desarrollador para poder interactuar.
Camilo Diaz Granados: Sí.
Jose Giraldo: Pero obviamente no tenemos los flujos todavía porque obviamente entiendo y este es el proceso donde primero se van a crear los flujos en Sums entender el flujo digamos del proceso de cómo eh funciona la persona cuando valida y qué datos necesita. Nosotros ya mapeamos un proceso obviamente de acuerdo a lo que eh el equipo de de Juan Camilo, aún las áreas requieren de de dentro de Ropi y con eso hemos mapeado un proceso también de arquitectura.


00:04:22

Jose Giraldo: Pero ahorita eh Manuel hablaba que que ya también ha definido como una arquitectura, me gustaría mucho conocer ese esa propuesta, este flujo que tiene para nosotros así apiar eh una forma de MVP o desarrollo rápido ya para esa integración.
Camilo Diaz Granados: Buenísimo. Si quieres ahí ahí yo doy un poquito de contexto antes, Manu, para que todos estemos superalineados.
Manuel Digregorio: Bueno,
Camilo Diaz Granados: En la reunión, yo me estuve reuniendo con las diferentes personas del equipo, en especial con Juan Camilo. Tuvimos una reunión hace más o menos una semanita donde logramos revisar todo el flujo completo. Digamos que lo vimos en dos fases, una fase hacer el KYC para validar realmente a los diferentes usuarios y luego desde ese KYC pasar un proceso de validación para todo lo que es facturación, que era el área que necesitaba Lina. Entonces,
Manuel Digregorio: Ev.
Camilo Diaz Granados: poder ver todos esos datos específicamente para la facturación. Entonces, no que fuera un solo flujo, sino partir el flujo en dos para facilidades. Eh, muy alineado a eso, esa es la arquitectura de la cual estaba hablando Manu. Eh, primero arrancar con esa validación como tal del KYC Pool y luego eh


00:05:30

Manuel Digregorio: Ah. M.
Camilo Diaz Granados: pasar a hacer la validación en el momento de hacer la facturación, donde hay como tres tres posibles caminos para ese ese proceso de facturación eh que ya lo vamos a revisar. Entonces sí, la idea, si quieres, ahí arranquemos un poquito con el flujo que nosotros eh creamos con Juan Camilo y que le pasamos a Manuel para que lo pudiéramos ver y desde ahí vamos viendo cómo cómo desde el lado técnico de ustedes eh se alínea muy
Manuel Digregorio: Ok.
Camilo Diaz Granados: bien a lo que tienen dentro de la plataforma. ¿Te parece, José?
Jose Giraldo: Eh, listo. Yeah. Listo. Eso. Sí, sí.
Camilo Diaz Granados: Buenísimo.
Manuel Digregorio: Les hago una consulta. Eh, el flujo que recibí, el que el que recibimos por mail, ¿estamos todos al tanto de de ese diagrama? Todos lo recibieron. Okay, perfecto. Eh, bueno, yo agrego un comentario. Básicamente, porque hablamos mucho de flujo, lo que yo hice fue en base al flujo completo, digamos, después los vemos cómo se separa en distintas partes y todo, pero en base a eso armé una arquitectura de cómo se puede reproducir eso usando Sams e para entender, digamos, no es que ese flujo se arma completamente en Samso, digamos, ustedes lo disparan.


00:06:48

Manuel Digregorio: paran desde desde su lado, eh, sino que este flujo puntualmente requiere eh digamos una configuración de ambos lados. O sea, por un lado va a estar lo que es la integración y por otro lado va a estar temas de lógica que ustedes van a tener que hacer eh del lado de ustedes. Eh, pero bueno, después cuando cuando les muestre lo que yo armé, eh ahí se va a entender bien. Eh, pero estaría muy bueno, como dijo Camilo, arrancar primero todos mirando el flujo completo, el que definieron del lado de Dropy y después yo les voy a mostrar cómo lo vamos a reproducir eso en Samsung. Ok.
Juan Camilo Rojas: Vale, permíteme entonces ya pongo el flujo y lo repasamos rápidamente.
Camilo Diaz Granados: Sí, mientras que Juanca lo pones, quería preguntarle un poquito a José y a Víctor, ¿cómo vieno la documentación? ¿Les pareció clara? Eh, me gustaría como mientras tanto ir conociendo como esos comentarios de parte de ustedes.
Jose Giraldo: Víctor, ahí te doy la palabra, Víctor, de pronto digamos que comentarios tenga
Victor Ney Orobio Hurtado: Ah, bueno, en la documentación observé varias cosas. Una es diferentes consumidores, por llamarlo así, de este proceso de validación que realmente toca abstraarlos de diferentes documentos.


00:08:46

Victor Ney Orobio Hurtado: Eso fue lo que básicamente eh una de las tareas que hicimos fue mirar como este servicio de validación eh a quiénes les va a servir, eh cuáles son los casos y P. También de ahí resultaron unas preguntas que de pronto en su momento las se las haré, o sea, en este momentico creo que de pronto no nos alcanza el tiempo, pero sí tengo varias pregunticas, eh,
Juan Camilo Rojas: No.
Victor Ney Orobio Hurtado: porque unas que tienen que ver con con cosas legales que tenemos que tener en cuenta, por ejemplo, la custodia de información. Bueno, varias cositas ahí que tenemos que tener en cuenta y que de hecho ustedes han expresado en varios de esos documentos. Eh, y también otros detalles ya como tal de configuración, pero creo que es algo de lo que vamos a ver ahoritica. Me gustaría saber qué parte, qué tanto de esa configuración va eh como tal en el dashboard de Sums y qué otras cosas si realmente dependen de nosotros o si podríamos hacerlo eh que todo fluya de un lado hacia otro, pero pues me imagino que es algo que vamos a ver en esta reunión. No.
Manuel Digregorio: Sí, Víctor. Eso creo que se va a aclarar ahora cuando cuando les muestre la parte de mía.


00:10:02

Manuel Digregorio: M.
Juan Camilo Rojas: Vale, todos están viendo mi pantalla, ¿ven? Voy a intentar hacerle un poquito más de zoom.
Camilo Diaz Granados: S Manu, ahí Juanca, ahí se ve Super.
Juan Camilo Rojas: Perfecto. Bueno, Jose, como bien sabes, pues los procesos de validación es cuando el usuario Jose y todo digamos el equipo para contexto cuando cuando se solicita una acción que dispare para nosotros una alerta como lo es un retiro, una recarga, todo lo que es transaccional dinero, eh y el usuario no tiene una validación, lo ideal es que, bueno, aquí dice user pilot, eso fue como se pensaba hacer Eh, anteriormente digamos que era la parte no c, pero ya con la integración tecnológica lo ideal es que el sistema en este digamos en esta línea que se ve aquí haga la validación interna de si el usuario está validado o no en la en la base de sonsorpego de identificar si este usuario está o no eh validado dentro de cualquier plataforma país, llámese Colombia, Chile, Argentina y demás, él debería eh permitir que toda la información que tenga, digamos, en otros países sea, o sea, si ya él se registró, él debería poder seguir operando dentro de la plataforma sin tener ningún tipo de de bloqueo, sin poder retirar eh dinero, sin poder hacer una recarga, traslado entre wallets y demás.


00:11:35

Juan Camilo Rojas: Eh, digamos que en esta en esta parte cuando el usuario es no validado, digamos que aquí tenemos dos dos caminos. Perdón, estoy, creo que este no es el flujo que yo le envié a Manuel, perdón, pero hasta ahí voy bien. Si no, que demme un momentico, qué penal.
Jonatan Fernando Espinosa Villamizar: Eh, Camilo, equipo, una cosa adicional, eh, pues también un motivo para para convocar pues esta reunión, aparte de de estar aquí con nuestro equipo TI, para que nos ayuden en tenerción de esto, es un poco eh mostrar pues tener más claro el panorama frente a lo que sucede en Guatemala. Ya hubo reunión con el equipo de Coloca donde realmente estamos de acuerdo los dos equipos en hacer esta transferencia. Incluso como lo comenté a Camilo, el equipo de Coloca ya tiene eh individualizado cuáles son las personas que son de Dropy y quiénes son de Coloca. Quisiera saber de una vez que se me puede definir si existe un modelo de documento, si el documento sale del lado de ZSUP, si creo el documento del lado de lo paso para firmas de coloca cómo podremos hacer primero la firma de este documento y segundo cómo funciona eh ese traslado de información de lo que de lo que se encuentra en en las bases de Coloca, teniendo en cuenta que compartimos a a Sunsu, eh cómo funciona esto, sino entamos algo también desde desde el tiempo de TI o simplemente se hace de manera interna desde la Zoom sobre el cambio de titularidad de de de estos usuarios.


00:13:26

Camilo Diaz Granados: Super J, si quieres, ya te contesto, contesto. Enfoquémonos ahorita en esto. Ya, ya te respondo vía WhatsApp acá por el interno. Listo.
Juan Camilo Rojas: Listo. Qué pena.
Camilo Diaz Granados: Ahora que de uno.
Jonatan Fernando Espinosa Villamizar: Dale, dale.
Juan Camilo Rojas: Sí, qué pena. Entonces, lo que se replica, lo que ven acá arriba es lo mismo que que se replica acá abajo. Simplemente que esta es la parte de Sonsof y esta es la parte de validación de usuario, simplemente la acción. Lo ideal es, listo, se le muestra la verificación de validación de Dropy y digamos que aquí ya disparado el web SK eh Sonsoft, donde invita a la persona a capturar sus datos. Entonces, pregunta a la persona por dónde desea validarse. Esto digamos que eh lo armé con Camilí en el tema de por dónde quiere la persona continuar, si por el celular o por el computador, no debería ser un un stop del proceso. Se solicita un código de verificación, un OTP. Eh, aquí valida el código, solicita un consentimiento para iniciar la verificación. Se crea la cuenta en Sonso para futuras validaciones, que es opcional.


00:14:37

Juan Camilo Rojas: Luego le solicita cargar documento a definir por defecto del país. Aquí fue donde yo digamos eh Camilo, reflexionábamos en el tema de bueno, ¿cuáles deberían ser los campos? Camilo me decía, "Yo puedo seleccionar la nacionalidad y nosotros ya tenemos un dropdown de documentos que podemos seleccionar de manera predeterminada." Ahora Nosotros entendemos que dentro de los flujos de Dropy tenemos nombre, fecha de nacimiento, correo, teléfono, nacionalidad, cédula de ciudadanía y dirección. Eh, esto para el caso de Colombia. En los otros países, pues esta parte de datos personales no cambia mucho, pero hay algunos que sí pueden variar, sobre todo en el tema de provincias, cantones, más que todo el nombre, que no es ciudad eh o algo así, sino cantones y y municipios, sobre todo es en la parte eh de facturación. Pero bueno, antes de pasar acá, se solicita cargar el documento que se define por cada país. Luego de esto activa un lightness y finalmente se le solicita una verificación por eh mensaje de texto. Una vez entra en la etapa de validación, esto es para el QYC. Eh, si no es una validación exitosa, entra en un procedimiento de compliance, que es cuando ya el equipo de Jonathan toma y recepciona ese
Manuel Digregorio: He.
Juan Camilo Rojas: ese usuario según su score y lo habilita manualmente o lo bloquea y le notifica que no puedes digamos seguir operando dentro de la plataforma.


00:16:21

Juan Camilo Rojas: En caso de que sí se le es notificado que fue exitosa la validación. y desactiva toda acción pues que permita eh que bloquea al usuario dentro de Dropy. Aquí, ¿qué es lo importante de tecnología? Eh, que le explicaba Camilo poderse traer estos datos personales. O sea, en el punto donde yo pongo el documento, extraigo la información del usuario, yo debería poder traer la información en los campos que necesitamos. Entonces ahí de pronto habrá un trabajo conjunto de qué es lo que necesitamos solicitar. Me decías, Camilo, que todos los, digamos, los formularios son editables, entonces podríamos hacer un un trabajo conjunto ahí de qué campos necesitamos, qué queremos traer y consumir de la de la API que de la API de ustedes.
Camilo Diaz Granados: S ahí, ahí si quieres,
Juan Camilo Rojas: Eso para la parte del
Camilo Diaz Granados: ahí si quieres va hacer un comentario. Entonces, Juan, ¿podrías hacer otra vez su? Entonces, lo que estaría pasando un poco, Jose, es desde el botón, hay un botón donde se hace la redirección para hacer la validación eh de identidad, donde las personas pasan a SDK, hacen el proceso que acaba de mencionar Juan Camilo, dentro de la validación de identidad, en la validación de identidad proceder, extraemos los datos del documento, cédula, pasaporte, lo que sea.


00:17:45

Camilo Diaz Granados: Esos datos llegan ustedes por API, por un output puntual, name, last name y demás. Y esos datos ustedes los podrían jalar, jalar automáticamente a el flujo a la pantalla que estaba mostrando Camilo. Entonces, digamos que sería como el pedacito desde desde integración, eh, pues desde tecnología y pues la generación del botón para poder hacer la redirección a la SDK. Digamos que va como por ese lado. Si ustedes quisieran captar más de los más más datos de los outputs que les estamos dando, no hay ningún problema. Digamos que ustedes también los podrían estar utilizando en otro lado. Eh, a grandes rasgos va por ahí. Veo que Víctor por ahí tiene la mano levantada y Manu también.
Victor Ney Orobio Hurtado: Bueno, hay una cosita y es eh desde el punto de vista de la experiencia del usuario, una de las cosas que tratamos de evitar también es que el usuario tenga que llenar varias veces los mismos
Manuel Digregorio: Voilà.
Victor Ney Orobio Hurtado: datos. ¿Ya? Entonces, en ese caso, por ejemplo, si el formulario de nosotros tiene los datos que ustedes necesitan o tenemos realmente nosotros la potestad de incluir los datos que nosotros necesitamos más los que ustedes necesiten, entonces, ¿qué posibilidad hay de nosotros en primera instancia examinar qué datos necesitan ustedes, incluirlos en nuestro formulario y mandarles ya esos datos a ustedes para que no tuvieran que volvérselos a preguntar a Yeah.


00:19:17

Manuel Digregorio: Bueno, La tomo yo, Camilo. Y si quieren también, porque veo que van surgiendo preguntas que las voy a responder ahora cuando les muestre la arquitectura, pero Víctor, sí, eh, si ustedes tienen datos que han colectado previamente, ustedes los pueden enviar a Sams vía API, así como pueden también obtener todos los datos que Sams luego colecte y documentos, etcétera, también los pueden obtener vía API. La información de que se colecta, todo lo que Samsung colecta es información que es de Dropy. Samsamente eh manipula la información, por usar alguna palabra, pero la la administra, la gestiona, pero eh Dropy es el dueño, con lo cual toda esa información está disponible. Eh, básicamente cuando en el momento que se inicia una verificación, lo primero que ocurre es que se crea un application y dentro de ese applicant es donde se va guardando toda la información relacionada con la verificación e documentos que la persona suba, los resultados, etcétera. Y si ustedes antes de que de que la persona arranque el proceso quieren alimentar ese usuario, ese aplicant con información vía API, lo que hacen es crean el application e inmediatamente le lo completan con esa información que le quieren dar y después cuando la persona corre el flujo lo va enriqueciendo con más información.


00:20:55

Manuel Digregorio: Así que eh básicamente hasta Ahora no he visto cosas, muchas grandes cosas que no que no podamos hacer. Samsung tiene un montón de productos y servicios y una librería enorme de endpints para que se puedan atender prácticamente todos los use cases. Por eso con Camilo insistíamos un poco en que definieran el flujo, porque en base a eso podemos nosotros eh eh mostrarles una una alguna forma o alguna solución para para reproducir el caso. Juan, si querés comparto yo y les voy mostrando.
Juan Camilo Rojas: Uy,
Manuel Digregorio: ¿Estás muteado?
Juan Camilo Rojas: dale.
Camilo Diaz Granados: Una una última cosita para agregar ahí. Digamos que dentro del proceso no lo no lo agregamos por Juan,
Manuel Digregorio: Listo.
Camilo Diaz Granados: pero vi que nos hizo falta el tema de la validación en AML para todo el equipo de Jonathan de Cumpliance. Eso se hace directamente desde que se capta el documento. Entonces, simplemente pues no está puesto en la arquitectura, pero se debería tener para que ustedes tengan la tranquilidad de legal. ¿Listo?
Manuel Digregorio: Bueno, no sé si pueden ver.
Camilo Diaz Granados: Sper, ahí se ve, mano.
Manuel Digregorio: Perfecto. Bueno, les voy voy a ir recorriendo este documento donde la idea es mostrarles cómo implementaríamos esto en Samsung.


00:22:28

Manuel Digregorio: Bueno, básicamente digamos va a haber una parte anterior a a esto que la van a gestionar ustedes, pero en algún punto se va a disparar la verificación como habían mencionado recién. Bueno, primero van a chequear internamente si existe elant, si ya tienen un applicationant creado para este usuario y si fue aprobado, obviamente. Entonces, tienen que hacer esa validación. Después los detalles de los endo pasar, pero en realidad eh después les voy a mostrar la tenemos una herramienta de ya que básicamente lo que le pregunten se los va a responder inclusive los los ends que necesitan para hacer una especie de chat GPT que tienen en la documentación eh que facilita un montón integración, pero van a chequear en caso de que es existe el usuario previamente ente la verificación, o sea, eh y ya fue aprobado, puede continuar realizando la las acciones que quiera y si no existe se dispara la verificación. E bueno, esto me quedó desactualizado, pero ya me habían por Telegram me aclararon que la idea tenemos dos formas, digamos, de usar Samsap. Una es a través de links de verificación donde no hay una integración. Básicamente ustedes crean un link, lo pueden hacer desde el dashboard o vía API y se lo envían al usuario final del de la manera que ustedes quieran y cuando la persona hace clic en ese link, eh se dispara el SDK, pero como una ventana, digamos, independiente.


00:24:16

Manuel Digregorio: Cuando hablamos de integración nos referimos a en beber el SDK en la app de ustedes y que la experiencia sea, digamos todo dentro de la app del sitio de ustedes. Bueno, ustedes me confirmaron que yo no a usar link, que la idea es que la el SDK se dispare por afuera de Dropy. Entonces, lo primero que va a ocurrir es vamos a crear un level en Samsap. un level es un una serie de pasos de verificación, un mini flujo, por así decirlo. Y acá vamos a tener cuatro pasos. Eh, uno va a ser de verificación de documento, eh, otro va a ser de likeness, que es básicamente el chequeo de de que se realiza poniendo la cara frente a la cámara para ver si la persona está viva. Obviamente se analizan un montón de otras cosas. Después el próximo paso va a ser email y SMS OTP. Y lo puse como un paso el AML screening, pero para que sepan esto, digamos no hay un paso de AML screening, sino que esto ocurre en el fondo. Eh, la persona no no atraviesa un paso de verificación de IML. E para que todos estén al tanto, hay un montón de cosas que ya se preconfiguran o ya están resueltas.


00:25:39

Manuel Digregorio: La idea de Samsan un montón de soluciones que pasan en el fondo. Eh, por ejemplo, ahí cuando mostrabas el flujo, Juan, había una parte donde eh estaba la opción de de ir por a través de la web o de seguir el flujo en el celular. Bueno, eso por ejemplo es algo que por default ya ya está seteado y nada, es una opción del SDK la persona, una de las primeras cosas que la persona ve se puede habilitar o deshabilitar, pero son cosas que ya están preconfiguradas. Bueno, en base al a la al resultado de esta verificación, vamos a tener dos escenarios. En realidad hay tres. Uno es el de que se requiere una lo que se llama resubission requested, que básicamente se da en casos, por ejemplo, si el documento, si el sistema no puede leer bien el documento, se le pide en el momento que vuelva a a cargar las imágenes. Eh, y después tenemos estos dos resultados que son aprobado o rechazado. En el caso aprobado, ustedes van a recibir los resultados vía webhook. Ahí se van a enterar de que cambió el estatus del applicant y fue aprobado y ahí lo que tienen que hacer es actualizar su su base de datos en base a esto. Y en caso de que sea rechazado, como había mostrado Juan, e van a tener una cola de compliance.


00:27:12

Manuel Digregorio: Nosotros tenemos un servicio que es case management, que es justamente para gestionar los casos, donde el compliance officer o el la persona que se ocupe de esto va a poder acceder al al caso, va a tener toda la información relevante y va a poder tomar una decisión, ya sea rechazarlo o aprobarlo. Después tenemos este esta otra parte que sería el flujo B, lo llamamos. Eh, sí,
Victor Ney Orobio Hurtado: Disculpa un momentico antes de que pasemos esa parte de facturación. Eh,
Manuel Digregorio: Víctor.
Victor Ney Orobio Hurtado: el en el caso del el compliance, el la persona que hace las veces de manager de esta de esta cola de compliance, cuando él ejecuta alguna acción, ya sea aprobarlo o rechazarlo, ¿eso hay alguna forma de que nos llegue vía web por lo que hizo esa persona Oh.
Manuel Digregorio: Si el si el mismo Webhook review les va a estar llegando, digamos, les va a estar haciendo llegar la información del cambio de estatus.
Victor Ney Orobio Hurtado: Perfecto.
Camilo Diaz Granados: Me imagino que imagino,
Victor Ney Orobio Hurtado: That's
Camilo Diaz Granados: Víctor, que te interesa saber quién le dio a que pasara el usuario, ¿cierto? Si está en naranjita, si está en en naranja, saber quién lo dio actualizar para que saliera verde, ¿cierto?


00:28:37

Victor Ney Orobio Hurtado: Correcto. Lo que pasa es que los temas de trazabilidad aquí son se vuelven muy importantes. Entonces cualquier tipo de cambio con respecto al estado de la información es muy importante tener esa trazabilidad.
Manuel Digregorio: Sí, tenemos un montón de webhooks. Te recomiendo después ingresar ahí en docs.samsab.com, que ahí lo voy a dejar en el chat para que veas toda la librería que tenemos, pero básicamente toda la información, todos los cambios, siempre vas a tener algún webhook para obtener lo que vos quieras. Y en la documentación, esto, Víctor, para vos va a estar muy bueno. Eh, justo a la derecha de la barra de búsqueda, ahí te dejé en el chat la el URL, dice Ask AI. Ese botón te abre el la herramienta de inteligencia artificial que tenemos, una de las herramientas, porque en realidad eh también tenemos una en el dashboard. Y también tenemos la posibilidad de de que creen agentes usando cloud o chat GPT o lo que usen. agentes con los conocimientos para inclusive hasta poder configurar y setear. de integraciones. Después eso si quieren lo vemos más en detalle. E bueno, Víctor, no sé si eso responde tu pregunta.
Victor Ney Orobio Hurtado: Sí, muchas


00:30:12

Manuel Digregorio: Perfecto. Bueno, entonces vamos al flujo B. Acá e tenemos ya la parte la lógica, digamos, de que en base a quién va a facturar van a haber distintos outputs. Básicamente en algún momento la persona va a llegar a una pantalla de facturación y tenemos un servicio que se llama cuestionarios, con los cuales eh vamos vamos a usar esto para preguntarle a la persona primero si va si es una persona natural o jurídica. Y esto va a abrir dos ramas diferentes. Si la persona es natural, tenemos dos opciones. Eh, va a utilizar los mismos datos para facturar. Si se da esa opción, no pasa nada, termina el flujo. Para que sepan, tenemos la posibilidad de crear cuestionarios donde las preguntas son condicionales, ¿no? Entonces es la persona no va a ver todas las preguntas, sino que en base a lo que vaya seleccionando se le van a ir mostrando las preguntas correspondientes. O sea, en esta rama le va le van a aparecer estas dos opciones y en esta otra rama, si es persona jurídica, le van a aparecer estas otras dos. La otra posibilidad en esta rama es que va a usar los datos de un tercero natural. Entonces, acá lo que va a haber que hacer es enviarle el link de verificación a esta a esta tercer persona.


00:31:39

Manuel Digregorio: E esto lo van a tener, digamos, el link lo van a a obtener de Samsap, pero después cómo le hacen llegar este link a esa persona ya es algo que tienen que manejar de su lado, porque nosotros no tenemos forma de saberlo. Y bueno, este esta persona se va a va a correr el mismo level. Vamos a usar para todos los KYC, vamos a usar el mismo level de verificación, este que les mostré al principio. Entonces esa persona va a pasar por ese mismo flujo de verificación. Y tenemos esta otra rama en donde ya aparece la parte de KYB. Hay dos opciones. Eh, la se le va a facturar a un representante legal. Para esto va a haber un level de KYB que vamos a crear. La otra opción es que va a ser un representante legal distinto. Entonces, para esto va se va a usar el KYB y el KYC. También acá les dejé también eh digamos un detalle de los distintos componentes dentro de Samsung que vamos a configurar. Vamos a tener este level KYC, que es el que les mostré para todos los KYC, un KYB general, bueno, cuestionarios para las preguntas y después vamos a usar el Workflow Builder, que es un servicio que tenemos para eh orquestar, digamos, la lógica en base a estas ramas de de de facturación que se van dando eh con la respuesta de los cuestionarios.


00:33:29

Manuel Digregorio: E bueno, el access token y los links se configuran desde el dashboard, los webhooks también. Case management puse a definir porque no estaba seguro si ese servicio planeaban usarlo dentro de Samsan ya alguna algún servicio para la gestión de los casos. Y bueno, el el tema también que mencionaban que según el país se van a configurar los documentos que que se van a aceptar. Eso sería eh a grandes rasgos la la documentación. Sí,
Victor Ney Orobio Hurtado: En el caso de la de las configuraciones,
Manuel Digregorio: Víctor.
Victor Ney Orobio Hurtado: como por ejemplo la configuración de los documentos admitidos por país, también esa información la podemos consultar.
Manuel Digregorio: Si la pueden. ¿Cómo?
Victor Ney Orobio Hurtado: Sí,
Manuel Digregorio: Perdón.
Victor Ney Orobio Hurtado: también esa información la puedo consultar. A ver, ¿a qué me refiero? No, no, no me gustaría queer algún tipo de de mismch o drift entre lo que está configurado en en Zom y lo que nosotros vamos a mostrar acá. debería ser el cuado.
Manuel Digregorio: Claro, hay una parte que es importante donde digamos hay que orquestrar bien lo que se sete en Samsung con lo que ustedes van a configurar de su lado porque e no sé, les doy un ejemplo.


00:34:53

Manuel Digregorio: Por ejemplo, capaz vos estás llamando a un level que no coincide con el que se configuró en Sams cualquier cosa. Entonces, vas a estar disparando otro flujo de verificación o quizás estás pidiendo cierta información que no está configurada para colectarse en ningún level. Eh, entonces lo ideal sería que alguien de ustedes de la parte que va a estar haciendo la integración tenga acceso al dashboard o que trabaje muy cercanamente con la con alguna. No sé quién va a ser el responsable, digamos, de setear las cosas en el dashboard. Yo los puedo ayudar, inclusive puedo setearles todos si quieren, eh, pero creo que estaría bueno que alguien eh sea como el owner de la parte del dashboard, porque después cuando ya estén en producción o por el motivo que sea, si quieren realizar un cambio, eh, es mucho más rápido que que entren que entre alguien al dashboard y que lo haga en el momento a que tenga que solicitarle al equipo de soporte de Samsa, eh, Eh, la herramienta nuestra y el dash es bastante user friendly, eh, y además, bueno, con todas estas herramientas de la verdad que cualquier cosa que uno pregunte te tira los pasos para para configurar en general. E bueno, muchas veces las mismas personas que hacen la integración, la parte digamos de de ya más de programar, tienen acceso al dashboard y si no están trabajando muy en conjunto con alguien que tiene acceso.


00:36:33

Manuel Digregorio: Así eh se aseguran de que esté todo sincronizado. Eso no sé cómo quieren que lo trabajemos. Yo no tengo ningún problema si quieren que yo puedo configurar tod todos estos componentes en Samsung. Lo puedo hacer muy rápido, de hecho, pero por ejemplo eh en algún momento ustedes desde el dashboard van a crear el app token y ahí van a recibir eh las kiss y esos son esa es información sensible que van a tener que tener y guardar ustedes. Eh, entonces sí o sí, por lo menos eso y también el setor de los webhooks lo van a tener que hacer ustedes. Sí, Lina.
Lina Marcela Peña Ospina: Sí, gracias. Te hago una pregunta. En el flujo,
Manuel Digregorio: Uy,
Lina Marcela Peña Ospina: me quitaste la pantalla.
Manuel Digregorio: perdón, perdón. Ahí la pongo de
Lina Marcela Peña Ospina: Sí.
Manuel Digregorio: vuelta.
Lina Marcela Peña Ospina: para preguntarte en el flujo de la persona jurídica o la empresa, cuando preguntas ahí representante legal o dueño, dueño de cuenta y luego pregunta representante legal distinto y y y bueno, en esa parte yo lo quiero entender más como lo habíamos diseñado en los fluxos. ¿Qué habíamos dicho? Si la persona escoge o elige persona jurídica, hace una hace una búsqueda en las bases de datos que ustedes tienen, porque yo hice un modelo que ustedes de un link que me mandaron, entonces se buscaba la empresa,


00:38:03

Manuel Digregorio: Sí.
Lina Marcela Peña Ospina: se seleccionaba y aparte después hacía un un QYC del representante legal como para ligar. Eso eso traducido a lo que estoy viendo es eso.
Manuel Digregorio: Sí, perdón porque quizás yo uso lenguaje que que yo solo me
Lina Marcela Peña Ospina: Ajá.
Manuel Digregorio: entiendo, pero eso que vos decís es es este caso. Auto Kyv es nuestro servicio donde ingresando el nombre y
Lina Marcela Peña Ospina: Okay.
Manuel Digregorio: número de registro, esto esto le apunta a la base de datos y extrae los datos de la empresa.
Lina Marcela Peña Ospina: la
Manuel Digregorio: Y e luego este mismo
Lina Marcela Peña Ospina: empresa.
Manuel Digregorio: flujo e, perdón, esta parte de acá reingresa a flujo A. Esto hace, esto sería el KC, digamos, el flujo A.
Lina Marcela Peña Ospina: representante legal o el dueño de la empresa
Manuel Digregorio: es sí de de lo que eso lo digamos de lo a quien ustedes se lo
Lina Marcela Peña Ospina: Okay.
Juan Camilo Rojas: Ok.
Manuel Digregorio: quieran hacer, digamos, ahí después si me dan el detalle de exactamente cómo lo quieren hacer,
Lina Marcela Peña Ospina: Tal cual.
Manuel Digregorio: lo podemos configurar porque inclusive este mismo flujo en algún punto les
Lina Marcela Peña Ospina: Okay.
Manuel Digregorio: puede eh ya puede tener incorporado el KYC dentro del KYB.


00:39:18

Manuel Digregorio: Eso también es algo que se puede hacer. O sea,
Lina Marcela Peña Ospina: Tengo otra pregunta.
Manuel Digregorio: la misma persona está corriendo el flujo del KYB y en algún punto les solicita verificar a la al UVO, digamos, a al owner o a quien sea, eh, y ahí mismo se dispara también esa verificación. Sí, perdón.
Lina Marcela Peña Ospina: Okay,
Manuel Digregorio: Tenías
Lina Marcela Peña Ospina: tengo ya dos preguntas, pero más dirigido de pronto a la integración que se va a hacer,
Manuel Digregorio: otra.
Lina Marcela Peña Ospina: como para que a mí me quede claro cómo cómo va a quedar y cuál va a ser el resultado. Nosotros habíamos hablado en su momento cuando construimos los flujos era que la condicional del país me iba a dar la verificación o la validación del proceso de validación. Ejemplo, si la persona es de Ecuador y así se esté validando en Colombia, en Chile, donde sea, pues su validación va a ser con respecto a todo el proceso de Ecuador. Eso se hace internamente en en Sunso, dependiendo de dónde de dónde es, porque digamos actualmente lo que se hace es que se pone documento extranjero y demás. Pero entonces se van a hacer con las bases del país donde se seleccione la nacionalidad, chicos.


00:40:26

Lina Marcela Peña Ospina: Pero entonces quería saber si eso si eso va a quedar así, si se va a validar con con respecto al país y y si esa información, o sea, cuando nos pasaron el link de Zoomsup era hacían la validación en Zomsup y eso después iba a migrar a Drop, así va a quedar. Pues eso todavía no está
Manuel Digregorio: Eh, la verdad que no no entendí la primer pregunta, eh,
Lina Marcela Peña Ospina: definido.
Manuel Digregorio: o sea, cuando te referís a a la validación, porque Samsung valida muchas cosas, entonces no sé si si te entendí,
Juan Camilo Rojas: Pero
Manuel Digregorio: ¿me podrías explicar de vuelta?
Lina Marcela Peña Ospina: o no sé si Juan Camilo sí me entendió y él ya tiene la respuesta, creía yo.
Manuel Digregorio: Ah, okay. No
Juan Camilo Rojas: Digamos que esa fue una una conversación que tuvimos con
Manuel Digregorio: sé.
Juan Camilo Rojas: Jonathan. Eh, el usuario se valida, digamos, yo soy colombiano y opero en Argentina. Entonces realmente si yo me valido, si yo ya tuve una validación previa en Sonso, pues Sonsopo guarda toda la información y lo valida según la nacionalidad. Ya Jonathan me complementa si es necesario, pero digamos que depende del nivel de riesgo que represente esa persona en el país de donde esté operando, pues eh se toma la decisión si se bloquea o no.


00:41:44

Juan Camilo Rojas: Pero yo creo que eso es un término más eh legal, back, donde ya tenemos que sentarnos nosotros y y definir esa parte deción, pero no hace parte del,
Lina Marcela Peña Ospina: Pero
Juan Camilo Rojas: o sea, no hace parte de la digamos de lo que estamos desarrollando en Đ en este
Manuel Digregorio: Eh, Yeah. Yo agrego algo quizás a Clara.
Juan Camilo Rojas: punto.
Manuel Digregorio: Cuando estamos validando un KYC, por lo menos para este flujo que hemos definido, e para para Sams no importa el documento que si es de Argentina, si es de Colombia, eh en ningún momento va a haber una verificación con respecto a temas legales de cierto
Lina Marcela Peña Ospina: Sí.
Manuel Digregorio: país. Eh, digamos, las verificaciones a nivel global. Lo único que sí acá va a estar chequeándose, por ejemplo, tienen van a usar eh AML screening, con lo cual se va a buscar eh esa persona ante listas, pero listas, digamos, de antilavado mundiales, eh y antiterrorismo y bueno, todas las distintas listas, pero no hay algo, no hay una cuestión relacionada al país, nada más que se va a colectar un documento de cierto país y después se va a chequear si el documento fue adulterado. Si el documento es real, se va a machear la cara del documento con la con la cara que pone la persona en la cámara.


00:43:02

Manuel Digregorio: O sea, hay un montón de cosas que ocurren en el fondo que que que se van a verificar. Después cuando la persona fue aprobada va a estar en la base de datos de ustedes. Después ustedes usan la información como quieren, digamos. Si si después en otro país esa misma persona se quiere verificar eh y ustedes detectan que esa persona ya fue verificada dentro de Sams y quieren usar esa, digamos, esa validación, buenísimo. Si lo quieren hacer pasar por otra capa de verificación, pueden también hacerlo pasar por otra capa de verificación. O sea, son todas cosas que las definen ustedes. Samsung, como les dije, es una plataforma que abarca un montón de servicios para distintas industrias. Y prácticamente, como les decía, yo no he visto eh no recuerdo muchos use cases donde no hayamos podido hacer algo, digamos. Entonces eh no sé si responde la pregunta, pero creo que es algo más a definir del lado de ustedes cómo lo gestionan. Y perdón, había otra pregunta también, Lina, era
Lina Marcela Peña Ospina: Sí, es que tal vez esas preguntas que yo estoy haciendo sí van para más para el resultado.
Manuel Digregorio: eh
Lina Marcela Peña Ospina: ¿Cómo lo voy a ver yo que soy la que finalmente soy la que facturo, la que emito la factura y la que voy a consumir estos datos de


00:44:19

Manuel Digregorio: sí ustedes para pueden ver la información de un application validado,
Lina Marcela Peña Ospina: facturación?
Camilo Diaz Granados: Yeah.
Manuel Digregorio: ya sea eh escuchando los distintos webhooks que nosotros tenemos, eso es algo que van a que van a setear del lado de ustedes programáticamente según las necesidades que tengan. Eh, también tenemos APIs, eh tenemos endpoints para inclusive para para importar eh applicants con toda la data. Eh, o pueden entrar al dashboard, pueden tener usuarios con acceso al dashboard y ahí van a tener eh una sección que se llama applicants y van a estar todos los O. Lol. la los usuarios que ustedes han verificado, eh, que de hecho alguien va a tener que entrar al dashboard para hacer la gestión de los casos que se vayan creando con Case Management. Eh, la idea de Samsung es que es una plataforma donde se integra todo. es un parte un poco también el eslogan
Camilo Diaz Granados: Pero ahí ahí si quieres para claridad, Lina. Entonces todos estos datos que se hacen del cuestionario,
Lina Marcela Peña Ospina: H
Camilo Diaz Granados: de las validaciones,
Manuel Digregorio: M.
Camilo Diaz Granados: todos llegan a la plataforma de Samsung. Ahí el equipo técnico de ustedes los los va a jalar de alguna manera por el API y muy seguramente esos datos te van a aparecer en algún lugar donde tú los ves.


00:45:42

Camilo Diaz Granados: Normalmente deberían salir esos datos.
Lina Marcela Peña Ospina: Ah,
Camilo Diaz Granados: Sí,
Manuel Digregorio: Sí.
Camilo Diaz Granados: eso es como realmente no tengo claro qué plataforma usas tú,
Lina Marcela Peña Ospina: okay.
Manuel Digregorio: y
Camilo Diaz Granados: pero lo que debería pasar es que esos datos que capturamos te salgan allá. Sí. Yeah.
Lina Marcela Peña Ospina: Listo.
Manuel Digregorio: y digamos también para que sepas, creo que están las,
Lina Marcela Peña Ospina: Vale.
Manuel Digregorio: o sea, vos podés como como esto se está implementando, creo que es un buen momento también para que internamente vos solicites qué querés ver, cómo lo querés ver, porque la información está,
Lina Marcela Peña Ospina: Claro.
Manuel Digregorio: entonces, ¿cómo la gestionan, cómo la usan, ya lo definen ustedes y y perdón Lina,
Lina Marcela Peña Ospina: Bueno, y ahora último.
Manuel Digregorio: pero también inclusive hasta quizás sería bueno que vos también tengas acceso al dashboard donde vas no vas a depender de de nadie y vas a tener todo ahí adentro como una
Lina Marcela Peña Ospina: Sper, no,
Manuel Digregorio: opción.
Lina Marcela Peña Ospina: ya una última cosa es que es importante también que Juanca lo que decías ahorita de que si una persona se validó, tuvo una validación de identidad o de datos de facturación en Colombia y que usar esos mismos datos en Ecuador, no sé si sea bien, porque pueda que ella decida que lo que vende por Ecuador se facture por otra empresa y no es la misma.


00:46:56

Manuel Digregorio: Lo que pueden hacer en ese escenario es como de alguna manera estamos separando eh digamos lo ten para Viendo el flujo del lado de Sams vamos a tener un level para KYC, o sea, para personas y un level para empresas. Si si esa persona ya se verificó, eh habría que ver qué quieren hacer, pero no es necesario que que la persona pase por el mismo por la por las mismas verificaciones por las cuales ya pasó. O sea, si ya hizo, si ya cargó el documento, no es necesario que le vuelvan a pedir que lo carguen, salvo que ustedes quieran. Eh, y bueno, si si ya pasó el liveness, se puede configurar como para que la persona no tenga que volver a realizar los mismos pasos duplicados, digamos.
Camilo Diaz Granados: Sí,
Manuel Digregorio: Eso también lo tení en cuenta.
Camilo Diaz Granados: muy alineado a lo que a lo que dice Manu es fíjense que al final ahí estamos creando el Primerum. ording del usuario y la y la llenada de facturación del usuario. ¿Okay? ¿Ustedes quieren que el usuario una vez ya fue validado, ya es un usuario que ya trabaja con ustedes, ustedes ya lo conocen, no necesita pasar por un documento rostro otra vez?


00:48:17

Camilo Diaz Granados: ¿Okay? Se le puede poner solo facial para que haga el proceso, para desbloquear los procesos de agregar un nuevo punto de facturación. Sí. O podría ser un OTP. Digamos que ya depende un poquito del nivel de seguridad que ustedes quieran meter en ese proceso, pero todo eso es posible.
Manuel Digregorio: Ok.
Camilo Diaz Granados: Eso al final crear otro level y que el llamado lo lo envíe ahí. Sí. Eh, sí, a grandes rasgos eso sería es superfácil. Digamos que en este caso pues lo generamos de el inicial y la primera los primeros datos de facturación.
Juan Camilo Rojas: Vale, muchas gracias Manu, por la aclaración. Digamos nos quedan 10 minuticos para que aprovechemos la re. Víctor, ¿tenías alguna una duda? Por favor. Gracias,
Victor Ney Orobio Hurtado: Eh, sí. Bueno,
Juan Camilo Rojas: Manuel.
Victor Ney Orobio Hurtado: eh,
Manuel Digregorio: Ah.
Victor Ney Orobio Hurtado: ya vimos que se valida, se hace la validación eh de la persona y contra unas bases de AML que son globales. Eh, pero hay existen otro tipo de bases de datos que son las bases locales, por ejemplo, como de antecedentes, cosas así.


00:49:20

Victor Ney Orobio Hurtado: SUMS maneja este tipo de de de verificaciones en todos los países o no las maneja ninguno o solo en algunos. Esa sería la primera pregunta. La segunda pregunta es, por ejemplo, si una persona se verifica con un documento de identidad, por ejemplo, soy un extranjero, estoy aquí en Colombia, me verifico con el con el pasaporte, pero resulta que yo abrí una cuenta en el país donde yo soy de origen, digamos, en Chile y allá me verifico con la PNI que os tienen ellos allá, eh se se puede identificar fácilmente que es la misma persona, sí, se esté identificando con diferentes documentos. Yeah.
Manuel Digregorio: Sí.
Camilo Diaz Granados: Si quieres ahí,
Manuel Digregorio: Eh,
Camilo Diaz Granados: arranca con ese mano y ya hablamos de las validaciones de antecedentes Yes.
Manuel Digregorio: dale. Sí, básicamente hay un montón de de de comparaciones que hace el sistema para chequear duplicados. No es solamente que cuando encuentra que un documento ya fue cargado lo lo macha como duplicado, sino que eh hay un unas cuantas cosas, digamos, eh la persona va va a saltar con si aunque cargue un documento diferente, la persona va a ser detectada como duplicado ya de por sí por el liveness, o sea, la la las caras van quedando en la base de datos.


00:50:40

Manuel Digregorio: Entonces, eh y y la verificación de de cara eh digamos es una tecnología donde detecta deep fakes, eh detecta un montón de cosas, con lo cual eh en ese sentido sí por el tema de duplicados no no deberían preocuparse ¿Y cuál era la otra pregunta?
Camilo Diaz Granados: Para el tema de antecedentes,
Manuel Digregorio: Perdón.
Camilo Diaz Granados: Víctor, te cuento, nosotros eh tenemos la capacidad de hacer antecedentes de AML global. ¿Con quién lo hacemos? Con un aliado nuestro, se llama Compr Advantage, es la plataforma más grande de AML mundial. Y para temas de antecedentes, tal cual como nosotros lo estuvimos hablando desde el principio de del proceso, nosotros no tenemos antecedentes puntuales en este momento por cada país. Se están agregando en este momento, deberían estar saliendo antecedentes penales, todo el tema pues de policía y de crimen organizado debería estar apareciendo en Colombia próximamente, al igual que en los principales países de la región. ¿Por qué antes esto no se tenía? Digamos que en en el resto del mundo es ilegal hacer validaciones de antecedentes eh por un tema de manejo de datos, pero en Latinoamérica es posible. Entonces, nosotros hacer una empresa global y buscando dar el mejor servicio lo estamos implementando en este momento.


00:52:00

Camilo Diaz Granados: La idea es que ustedes tengan la capacidad de poder tener y tomar decisiones lo más rápido posible. Eh, entonces tengo entendido que eso está en roadmap para estar saliendo más o menos el próximo mes, próximos dos meses. Ya debería estar full implementado en la plataforma. Obviamente, pues ahí les estaríamos dando eh la actualización para que ustedes lo puedan llegar a agregar y eso también está dentro de las capacidades que ustedes tienen contratadas en el momento donde se abre. Eh, simplemente sería un dato más de información más allá de la validación de identidad, que pues es lo primordial y pues que ustedes puedan ir bloqueando. Otra cosa importante ahí, Víctor, es nosotros todos los datos faciales que se van sacando de la plataforma les llegan a ustedes y nosotros nos podemos dar cuenta de un caso que tú acabas de mencionar que es Víctor creó una cuenta en Dropy en Colombia y creó una cuenta en Dropy en Chile. Yo me puedo dar cuenta que es la misma persona por los faciales y por los nombres, pero más que todo por un facial. En caso hipotético de que Víctor me hiciera un fraude como el que pasa con el como del problema que están teniendo, por lo cual están eh creando confiopagos, ¿no? Eh, hay algo s super relevante que es que yo puedo bloquear ese rostro y no volverlo a dejar pasar.


00:53:18

Camilo Diaz Granados: Y eso, ¿qué termina haciendo? Puede que te haga un fraude una vez, pero automáticamente te bloqueó ese rostro y la persona nunca más va a poder generar una cuenta dentro de de Dropy. Entonces, comenzamos a reducir esos fraudes en el mediano y largo plazo. Creo que eso también es un dato importante que para ustedes termina siendo relevante y termina siendo la base real de usuarios sana que deberían tener. Sure.
Victor Ney Orobio Hurtado: Bueno, y una última cosita, qué pena. Pues la verdad tengo un montón de preguntas más, pero entonces yo tengo por ahí el el cuestionario. Entonces, ¿a a quién debería dirigirse los de ustedes para para no alargar mucho esta reunión? Yeah. Pero ya tenemos poquito tiempo.
Manuel Digregorio: E los cuestionarios, nos estamos refiriendo a los mismos cuestionarios de los cuales hablamos ahí en el flujo para ir definiendo las los outputs.
Camilo Diaz Granados: No,
Victor Ney Orobio Hurtado: No,
Camilo Diaz Granados: como
Victor Ney Orobio Hurtado: ya son dudas con miras a la integración,
Camilo Diaz Granados: dudas.
Victor Ney Orobio Hurtado: o sea,
Manuel Digregorio: Ah, sí, sí.
Victor Ney Orobio Hurtado: por estuve leyendo los documentos y todo y tengo otras preguntas,


00:54:19

Manuel Digregorio: Eh,
Victor Ney Orobio Hurtado: unas que son un poquitico más técnicas y otras son con los casos HCH que me gustaría como mirar.
Manuel Digregorio: sí. Me las puedes mandar a mí por correo o bueno, no como o sea si tienen slack,
Victor Ney Orobio Hurtado: Perfecto.
Manuel Digregorio: no sé si si usan slack también ese medio podría ser.
Victor Ney Orobio Hurtado: Te las mando por correo.
Camilo Diaz Granados: Digamos que el correo sería mejor y si quieres nos avisan también por el grupo de Telegram para
Manuel Digregorio: Dale.
Camilo Diaz Granados: nosotros estar pendientes. La idea es es facilitarlo lo antes posible, ¿no?
Victor Ney Orobio Hurtado: Perfecto, Gracias.
Camilo Diaz Granados: Eh, dale,
Jonatan Fernando Espinosa Villamizar: Eh, Kiko, eh, gracias por la presentación.
Camilo Diaz Granados: Jonathan.
Jonatan Fernando Espinosa Villamizar: Antes de finalizar, pues teniendo en cuenta y aprovechando el espacio que está su estrategia acá, eh sí quisiera que tratáramos en estos 2 minutos la prioridad que tenemos frente a a Guatemala y es que pues de manera estratégica ya tenemos que empezar a hacer presencia nosotros para todo el tema de dispersión y así pues no depender de de Coloca eh para este evento. Entonces, sé y con lo que entiendo, pues la línea de tiempo para integración eh es un poco incierta al parecer, pronto puede tomar un mayor tiempo.


00:55:34

Jonatan Fernando Espinosa Villamizar: Eh, y es observar si lo podemos hacer a través de del link del que habíamos en caso específico para para Guatemala. Entonces, eh pues aprovechando, repito, la presencia de Sulsu y de TI, podríamos de pronto entrar discutir esto o tenerlo al menos visualizado para para los backofice del día de mañana y es que sí se hace necesario para empezar a capturar estos datos para la dispersión B.
Camilo Diaz Granados: Justo, justo Jonathan, eso era lo que te iba a responder por interno. Nosotros estamos sacando un antes utilizábamos algo que se llamaba copy application para poder enviar los aplicantes desde una cuenta a otra, que era lo que íbamos a hacer con con con la cuenta de Guatemala, con su aliado de Guatemala. Eh, ahorita sacamos algo que se llama share, que es mucho mejor, ¿cierto, Manu? Eso lo vimos ahorita en nuestro evento interno. Estamos pidiendo el documento para que ustedes lo puedan hacer. Yo creo que la solución la la puedes explicar un poquito a grandes rasgos, Manu, para que para que ellos tengan una idea de cómo funcionaría Share. Digamos que es algo algo que a ustedes les funciona mucho,
Jonatan Fernando Espinosa Villamizar: Perfecto.


00:56:44

Camilo Diaz Granados: que al final es pasar esos datos directamente a ustedes y que ustedes ya los tengan y simplemente poner ese mismo level
Jonatan Fernando Espinosa Villamizar: He.
Camilo Diaz Granados: para que ustedes puedan validar a los usuarios que vengan desde Guatemala, que al final sería el mismo level de KC términos prácticos, pero si quieres explica un poquito de mi mano y ese documento te lo estaremos pasando. Yeah. Ando, espero que mañana ya me lo den para podértelo dar y que las dos compañías lo firmen.
Jonatan Fernando Espinosa Villamizar: Sí, eso es buenísimo, pero y también frente a los usuarios nuevos, o sea, los que diariamente, eso lo que me interesa es para ya no depender tanto de los servicios de de Colom en Guatemala. ya el paciente no se entregaría de la forma en que tú me vas a indicar en este momento, pero frente a los usuarios que se van generando nuevo. Esa es mi preocupación en este momento.
Camilo Diaz Granados: Podríamos utilizar este mismo level de KYC para los usuarios de Guatemala y funcionaría perfecto. Digamos que ahí no habría ningún problema.
Jonatan Fernando Espinosa Villamizar: Listo. Listo. Tam. Bueno,
Manuel Digregorio: Y bueno, con respecto al a este servicio, básicamente eh sirve para compartir applicants.


00:57:42

Manuel Digregorio: Cuando hablo de applicants es la forma interna a la que llamamos a los users. Eh, básicamente se tienen que que firmar un acuerdo, digamos, ambas partes que van a estar compartiendo los applicants. Y para decirlo así como a grandes rasgos, si por ejemplo la empresa con la cual ustedes están compartiendo tienen unant que ustedes quieren verificar, e no va a hacer falta que este user pase por la verificación si ya fue aprobado, a no ser que ustedes requieran un nivel de verificación o algún paso de verificación extra que no haya por el cual esa persona no haya pasado previamente. Supongamos que eh les van a compartir un application que ya fue aprobado previamente, pero ustedes tienen un paso de proof of address, por decir cualquier cosa, eh, y ese applicant no pasó por ese paso puntual. Entonces, esa persona va a pasar va se va se le va a enviar de alguna forma, sea link o sea por integración, la posibilidad de disparar el SDK. y va a pasar solamente por ese paso puntual. Eh, sí, eso sería una explicación así muy muy general. Después si si quieren ir ya a dudas más puntuales y técnicas es un ya es un poco más creo que necesitamos un poco más de tiempo. E no sé si hay alguna duda con respecto a eso.


00:59:28

Camilo Diaz Granados: En términos prácticos, Jonathan, podríamos comenzar a utilizar ya ese KYC, ese flujo de KYC en Guatemala y utilizar el share más adelante cuando ya firmemos ese documento. O sea, podríamos arrancar ya con el flujo del level de KYC en Guatemala.
Jonatan Fernando Espinosa Villamizar: Sí, justamente es eso. Pues preguntando al equipo, ¿podríamos utilizar ya eh lo que nos indica Suns para empezar a capturar nosotros la información desde Guatemala? Yeah.
Camilo Diaz Granados: Creo que ahí lo que estaría faltando es la creación del flujo para que el equipo técnico pudiera poner el link de redirección en Guatemala para que hicieran la validación, ¿cierto?
Victor Ney Orobio Hurtado: tendríamos que evaluar eh el mínimo caso de uso puntual para poderte decir exactamente con qué rapidez lo podemos ensamblar y verificar, pero tenemos que ir muy al punto de qué es exactamente lo que lo que necesitamos para poder
Jonatan Fernando Espinosa Villamizar: Vale, vale, vale. Te agradezco, te agradezco.
Manuel Digregorio: un comentario nada más. Eh, hay una posibilidad de de digamos la como el caso más simple para verificar a una persona es ingresar al dashboard, configurar un level y ahí mismo desde el dashboard se puede crear el link y se le puede enviar de alguna forma a cualquier persona para que lo abra y ahí se va a verificar.


01:00:58

Manuel Digregorio: Eh, no sé si es algo que les vaya a servir, pero lo tiro como como un comentario.
Jonatan Fernando Espinosa Villamizar: S super.
Camilo Diaz Granados: podrían tal cual podrían generar el el flujo, el y mandarles el link como yo se los mandé a ustedes. Entonces,
Jonatan Fernando Espinosa Villamizar: Claro.
Camilo Diaz Granados: ahorita todos los que vayan a utilizar ese link van a terminar siendo personas de Guatemala prácticamente y
Jonatan Fernando Espinosa Villamizar: Sí, exacto. O sea, todo aquel usuario que ingresa a través de la plataforma de Guatemala,
Camilo Diaz Granados: listo.
Jonatan Fernando Espinosa Villamizar: nosotros tenemos condicionado que se dispare todo el proceso de que Messi una vez van a hacer un movimiento a través de la Wallet. cuando vayan a hacer ese movimiento, pues se le enviaría entonces el link para que para que introduzca la documentación y así se activa su
Camilo Diaz Granados: Tal cual. Tal cual. Entonces, yo lo que les diría, equipos, equipos, hagamos una cosa. Eh, los siguientes pasos podrían llegar a ser, Víctor, mándanos las las dudas que tienes directamente por correo para que nosotros con Manu vayamos avanzando, eh, para que quedemos claros.


01:01:58

Camilo Diaz Granados: Todos quedamos bien con el flujo que que vimos, lo vemos posible, todo podemos arrancar. Entonces, quedaríamos a su disposición para ver si tenemos un espacio para mostrarles cómo se genera o si Manuel Manu nos ayuda si y les generamos ese level para que ya lo tengan. Eh, me parece muy bueno que ustedes lo aprendan a hacer, eh, como dijo Manu. Entonces, pues no sé ahí, Manu, ¿qué siguientes pasos te parece que podrían llegar a ser desde tu lado? M.
Manuel Digregorio: Desde mi lado quedo a disposición para las dudas técnicas Y como les comentaba, si ustedes quieren, yo les puedo configurar los levels, no tengo ningún problema. E como ustedes quieran. Eh, lo lo yo un poco coincido con Camilo,
Victor Ney Orobio Hurtado: Yeah.
Manuel Digregorio: es importante que que alguien eh se familiarice con el dashboard porque eh inclusive en la configuración de Levels hay un montón de configuraciones que quizás ustedes ni las están teniendo en cuenta, pero hay cosas que que se pueden hacer y Okay. Digamos, yo me voy a basar en lo que ustedes me especifiquen, pero quizás hay cosas que que no vieron que se pueden hacer y capaz les interesan, pero como quieran. Yo puedo configurarlo muy rápido esto.


01:03:12

Victor Ney Orobio Hurtado: Bueno, particularmente a mí me gustaría tener una sección precisamente para para mirar esa configuración y creo que sería muy útil que alguien en el caso en este caso de los de los usuarios o las personas que van a consumir ir este servicio eh por medio de lo que implementemos en TI también estuviera al tanto de de esto, o sea, que pudiera también asistir a esa sesión
Jonatan Fernando Espinosa Villamizar: Claro, por mi lado total disposición para para poder estar en la sesión. M.
Manuel Digregorio: Sí. E perdón,
Camilo Diaz Granados: Yo yo yo justo Dale dale
Manuel Digregorio: Camilo, ¿sabes lo que pensaba?
Camilo Diaz Granados: todo tuyo,
Manuel Digregorio: No, no, perdón,
Camilo Diaz Granados: mano.
Manuel Digregorio: perdón.
Camilo Diaz Granados: Eh, justo lo que pensaba es buenísimo que estés tú, Víctor, buenísimo que esté Jonathan. Me parece que Juanca también podría llegar a estar y me parece que Paula también podrían llegar a estar. Digamos que ahí cubren como un poquito diferentes áreas de la empresa y así cuando quieran hacer cualquier cambio de diferentes áreas, digamos que ya todos están hablando un poquito el mismo idioma y se pueden mover más rápido. Eh, al final va a ser como más explicar cómo se genera todo.


01:04:22

Camilo Diaz Granados: Entonces, yo creo que podría llegar a ser bastante relevante y las diferentes visiones les van a ayudar un montón. Yeah.
Manuel Digregorio: Bueno, yo lo que lo que pensaba Camilo, es que quizás podemos incluir a, o sea, podemos eh solicitar alguna sesión de onboarding, del equipo de onboarding, que justamente son los especialistas en eso. Yo no soy muy bueno, la verdad, haciendo onboarding capaz me voy por las ramas con cosas técnicas, eh, pero creo que estaría bueno capaz tener alguna sesión con el equipo onboarding para que les muestre el dashboard, las configuraciones básicas, eh, y también yo creo que les mandé por Telegram, pero bueno, en en uno de mis primeros mensajes envié un montón de links y eh tenemos también muchos webinars para temas puntuales que también están buenos por si quieren eh capacitarse sobre distintos aspectos de del dashboard. Así que no sé si eso les interesa. Creo que quizás estaría bueno armar un par de sesiones. Genial. Bueno, buenísimo. Disculpen, pero yo tengo un hard stop ahora, e, así que quedo, gracias por el tiempo y quedo a disposición para lo que necesiten. Víctor, cuando tengas las dudas, mándamelas y ni bien pueda te las respondo.
Victor Ney Orobio Hurtado: Okay, cuenta con ello. Muchas gracias. Yeah.
Manuel Digregorio: Gracias,
Jonatan Fernando Espinosa Villamizar: Manuel Camilo,
Manuel Digregorio: equipo,
Camilo Diaz Granados: Buenísimo.
Manuel Digregorio: que anden bien.
Jonatan Fernando Espinosa Villamizar: muchísimas gracias.
Camilo Diaz Granados: Muchas gracias, equipo.
Jose Giraldo: Gracias.
Paula Macias: aquí
Jose Giraldo: Hasta luego.
Camilo Diaz Granados: Muy bien.
Nataly Moreno Bernal: Muchas gracias.
Manuel Digregorio: Nos vemos.
Nataly Moreno Bernal: Que estén Yeah.
Manuel Digregorio: Ciao. Ciao.
Jonatan Fernando Espinosa Villamizar: Yeah.
Lina Marcela Peña Ospina: Hasta luego. Gracias,


La transcripción finalizó después de 01:06:08

Esta transcripción editable se generó por computadora y puede contener errores. Los usuarios también pueden cambiar el texto después de que se cree.
