Date: 06/17/2026

Title: Hablemos del proyecto validación de identidad - 2026-06-10 09-00 GMT-05-00 - Recording

00:00:04 Speaker 0
Listo. Bueno, el-- ese es el proyecto y lo que me queda, digamos, de  

00:00:18 Speaker 0
mi Nada. Es que pues se registre y se valide correctamente porque no tenemos forma de notificarlo 
a nivel tecnológico. Eeeh, a volviendo pues de negocio que definí yo pues legal es que la validación 
debe ir contra las bases de datos de los países que el usuario selecciona el documento. Es decir, 
si yo soy persona natural, a mí me van a validar con la base de datos de, pues del país donde opera 
Dropy. Más que todo esto aplica es para persona jurídica porque estamos validándolos contra 
las normas tributarias de dicho país. Es decir, si Dropy está operando en Chile y yo me estoy 
registrando en Chile como persona jurídica, a mí me van a ir a validar en Chile como persona tributaria, 
que tributa como persona jurídica, perdón. Pero si yo soy persona natural, pues me tienen que 
ir a validar contra el país donde yo soy. Pues digamos, soy de Colombia, que va a operar en Dropy, 
en, en Dropy Chile, entonces tienen que ir a verificar que yo en Colombia pues no tenga ningún 
proceso penal o no esté en  

00:07:18 Speaker 0
investigación. El tema de los datos personales y datos de facturación, pues no son idénticos, 
tienen cierta variación entre cada uno, pues lo que hace que sea un poco difícil hacer el tema 
de que sea variado, que se precargaran que los de, los datos personales fueran los mismos de 
facturación. Eeeh, es esto, porque pues no coinciden, no son, no son, no son homologables directamente. 
Eh, el tema de que algunos datos de factura-- de facturación no son iguales a los de, a los datos 
personales, porque yo puedo dar mis datos personales como persona que va a manejar la cuenta, 
pero yo no quiero que me facturen a mí, sino a mi tío que tiene una empresa de perritos y a él le conviene 
que le hagan la facturación. Ah, y listo. Pues básicamente, esos son como lo, lo que se ha, ha 
investigado acá este tema de las reglas son preguntas que ya están preestablecidos, que también 
pasa Cata y les socialicé un poco ayer. Y para el tema de flujo de estudio, digamos que Juan Camilo 
está acá metido en el documento  

00:08:29 Speaker 0
porque él está haciendo todo el tema de la validación de cuentas, de cómo vamos a hacer ese proceso 
KYC/KYB para evitar que la cuenta que registren para hacer retiros, pues no sea una cuenta para 
lavado de activos o que no pertenezca pues a una persona con la TC, ¿pues no? Entonces, para iniciar 
el tema de cómo vamos a validar un usuario nuevo es básicamente como lo podemos ver ahorita en 
Colombia, un usuario nuevo. Digamos que este usuario es nuevo, que le falló la, la validación. 
Actualmente en Dropy tenemos este tema de no logramos validar tus datos o bueno, el de valida 
aquí. Cuando ya registran los datos, esta alerta aquí en reintentar validación, pues me está 
llevando a este tema de datos personales y facturación, donde pues tenemos dos formularios 
totalmente diferentes, ¿verdad? Yo decía Cata que desde est-- desde este...  

00:09:39 Speaker 0
Les decía Cata que desde este mismo formulario ya nos están indicando que pues al usuario que 
si es persona natural, pues ingrese sus datos según el documento de identidad. Y si es una persona 
jurídica, pues que ingresara únicamente los datos personales del representante legal. Es 
decir, que desde acá nos están dando la pers-- la perspectiva de que la persona que se registra 
en Dropy es persona natural o es persona jurídica. Entonces, con base a eso, pues se hizo también 
el planteamiento donde el usuario que se registre, pues vaya directamente a esta pantalla 
por medio de las alertas que los lugares donde están ubicados pues van a seguir, o bueno, tienen 
que seguir siendo los mismos según lo que hablamos con legal, que es en configuración de datos 
personales, en configuración de retiro de saldo, en historial de cartera y en el tema de la Dropicar 
para aquellos países que la tienen habilitada. Actualmente es solo Colombia. Y pues que las 
acciones financieras bloqueadas van a seguir siendo  

00:10:41 Speaker 0
transferencia entre wallets y la de retiros. Y pues una vez se le dé clic a esa, a esa como opción, 
que fue la que les mostré acá, pues obviamente es la de los, la del primer intento, que acá me manda 
a esta pantalla. Va a ser igual, me va a mandar esta pantalla, se va a verificar. Acá hay un tema 
de que si el usuario ya fue validado en otro país, pues se le permita como traer esa información 
a los campos correspondientes. Digamos que si es persona natural es mucho más fácil porque 
los datos de la persona natural pues son los mismos datos de la pers-- de los de la empresa, ¿no? 
Acá, aquí nombre y razón social, pues va a ser el nombre de la persona, digamos, Diana Aldana. 
Y pues acá también va a ser nombre y apellido, según, bueno, primer nombre, segundo nombre, 
primer apellido y segundo apellido, pues van a ser los nombres de, por ejemplo, Diana. Y acá 
nombre o razón social, pues va a ser el mismo nombre. El tipo de persona, pues natural, tipo de 
documento, pues dependiendo de lo que se  

00:11:44 Speaker 0
parametrice en el flujo dentro de ZumZum y pues el documento lo mismo de, de lo que se extraiga 
desde la validación de ZumZum. Entonces digamos que esto, esta forma de, de persona natural, 
pues se le debe permitir al usuario decidir si quiere que sean los mismos o que sean diferentes. 
Y en el caso de la persona jurídica, si acá yo planteé que fuera diferente, entonces debería 
estar iniciando un proceso de validación  

00:12:11 Speaker 1
Nuevo debido a lo que les decía, que cada país tiene como sus particularidades en ciertos campos. 
Hay algunos que sí coinciden, hay otros que no. Digamos que en el tema de Colombia existen tres 
, tres campos que no existen en otros países que son: este tema de tipo de régimen, tipo de responsabilidad 
y el tipo del impuesto. Y si se dan cuenta, en Mé-en México no existe ni mismo régimen fiscal y 
sujeto de impuestos que pues podría homologarse un poco a lo que hay en Colombia. En Ecuador 
ningún campo alusivo a los regímenes o al tema de los impuestos, pues en Chile tampoco. Entonces 
hay como a pesar de que Chile y Ecuador son casi que iguales, en México y Colombia pues difieren. 
Y en Argentina también tenemos un campo totalmente diferente que es condición frente al IVA. 
Entonces, con base a eso, pues siento que no es tan prudente pues precargarle esa información, 
porque lo que buscamos es que el usuario quede con toda su información pues totalmente validada. 
Es decir, que el usuario primero  

00:13:26 Speaker 1
se valide y luego se le traiga la información para así evitar tener que hacer una nueva validación 
en caso de que se le dé por modificarla. Digamos que ahí Cata también ayer me decía el tema de que 
se le puede pedir diligenciar esos campos diferentes y que en el flujo solamente pues extraiga 
como los más, los más que, los que se pueden exceder de un documento. Por ejemplo, tipo de documento, 
nombre o razón social, tipo documento, documento, el tipo de persona. Y campos como por ejemplo 
acá Colombia que es tipo régimen, tipo responsabilidad y el impuesto, pues sí se le pueda dejar 
habilitado para que los modifique o bueno los seleccione en su-- en caso tal. Eso me pare-- me 
pareció buena idea. Yo también pues se podría, yo le decía a Cata pues que si había algún tipo 
de, de, de ajuste en la experiencia para que fuera de pronto más fácil para el usuario hacerlo, 
pues que bienvenida cualquier sugerencia. Eh, en este proceso entonces lo planteé de esta 
forma, esa es mi propuesta para el tema  

00:14:31 Speaker 1
de iniciar la validación. Es muy parecido a lo que tenemos actualmente de una modal de validación 
de identidad donde el usuario pues nos indique cómo se identifica, porque lo, lo que vamos o 
lo, lo que estoy planteando es no-- el usuario no me diligencia los datos para otros países, 
sino que de una vez viene y se valida y con base a esta validación nosotros arrastramos la información 
desde la API de ZoomZoom, ¿sí? Es decir, si yo eloy persona natural, entonces esta persona-- 
esta selección me tiene que mandar al flujo que defina el equipo administrativo, que es el KYC. 
Si el usuario selecciona persona jurídica, pues me manda al flujo KYB que defina el equipo administrativo. 
Y es más, hasta aquí dice representante legal debe realizar la validación y haber proporcionado 
sus datos personales. ¿Qué quiere decir? Que pues primero en Colombia no existe un KYB, sino 
que la persona jurídica sí o sí se va a ir a validar como KYC, como si fuera persona natural. Pero 
nos está diciendo que el representante  

00:15:38 Speaker 1
legal de esa empresa sí o sí tiene que realizar una validación como persona natural. Eso es algo 
que ya ZoomZoom lo solventa. ZoomZoom permite validarse primero como persona, como empresa. 
Entonces le dice acá a la empresa: dame tu nombre, tu país y tu NIT, ¿cierto? Y acá lo busca, te-- 
él trae la información que encuentre, por ejemplo, de Droppy, la carga. Y acá le dice como, bueno, 
súbame cualquiera de estos tres documentos, que es lo que va a definir administrativo. Y acá 
una vez ya lo cargue, pues el usuario, ay, el usuario puede continuar con su vida en la, en el ciclo 
de validación. Entonces, una vez ya lo suba y le dé continuar, él acá le pide la parte asociada 
de la empresa, que es este tema del representante legal. Acá le pus-- acá pues se llama propietario 
efectivo final, pero se definir qué tipo de, de parte asociada es, si es, eeeh, may-- ¿cómo es? 
Este, beneficiario o inversionista mayoritario o si es este tema acá de representante legal. 
El caso es que debe añadir un particular,  

00:16:56 Speaker 1
el cual pues tiene que diligenciar sus datos y posteriormente hacer el tema de la verificación 
o el KYC, que es, nos verifica su correo. Tu documento de identidad acá me precarga porque yo 
ya había hecho este proceso como con un mes de anterioridad por el tema de que les digo de Guatemala. 
Y acá simplemente me pidió el likeness. Digamos que si yo aquí no hubiera tenido documento de 
identidad, pues tendría que haber hecho el tema de escanearlo por lado y lado y luego el likeness. 
Y una vez después me verificó, me dice: usted está verificado como perfil, ahora vaya y complete 
el KYB, que es el de la empresa. Entonces acá se quedó comprobando los datos de la empresa y los 
documentos que le subí de la empresa, buscando si ambos coincidían y pues hoy claramente no 
iban a coincidir. Entonces acá me decía documento de la empresa, toca reenviarlos, pero yo 
me validé. Pues bien, y los datos de la empresa, que fue lo que el programa ZoomZoom buscó, pues 
están bien. Entonces ahí, ahí este tema de  

00:18:01 Speaker 1
que lo que les digo, el representante legal se valida dentro del flujo de ZoomZoom. Entonces, 
en parte lo que nosotros traemos acá es esa información de la validación. Entonces el paso uno 
es todo el tema del checklist, si es persona natural, pues acá se le debería estar indicando 
que esos datos es con los que se les va a hacer la facturación al usuario, por ende pues tiene que 
verificar que esté muy bien, o sea, muy bien validado, que nos dé los datos correctos para la 
validación, pues porque no los va a poder modificar. Digamos que acá yo puse seis meses, pero 
eso está en tema de definición, puede ser tres meses. Podemos mermar el tema de, de cuánto, cuánto 
tiempo transcurre entre cada una de las modificaciones de datos. Y pues todo el tema de los, 
los otros, pues siguen igual a lo que tenemos ahorita en esta modalidad. O pues así lo veo. Y en 
el paso dos, pues está-- debemos estarle diciendo al usuario que el representante legal debe 
realizar la validación y proporcionar sus datos, pues  

00:19:06 Speaker 1
personales y pues indicar que el tipo de documento original debe tener listo el usuario. ¿Aquí 
qué me refiero? Acá nosotros le decimos a, al usuario: «Tienes que tener el documento original 
contigo», pero porque aquí digamos que él viene y selecciona qué tipo de documento quiere o 
bueno, tiene. ¿Sí? Pero como nosotros los vamos a estar mandando directamente a este flujo, 
pues siento que deberíamos estar especificando qué documento podría tener, eh, a la mano, 
no sé, un pasaporte, una cédula, un RUT o el, el documento, pues obviamente que le ga-- eh, que 
el equipo administrativo nos defina con el cual se puede hacer la validación de identidad del 
KYC de persona natural. Eeeh, y aquí también un tema de un aviso indicando que los datos de la 
empresa y el representante legal una vez validados, pues no los va a poder modificar y pues indicar 
qué documento para la empresa debe tener listo. Un NIT, un registro mercantil, lo que se también 
lo que defina, eh, administrativo dentro del flujo de Zumzum.  

00:20:13 Speaker 1
Y bueno, pues el resto sí es igual, que nos acepta capturas de pantalla ni fotocopias, dispositivo 
con cámara, etcétera. Y para el paso tres, pues ya es un mensaje, el mismo mensaje, o pues así 
lo vi yo. Bueno, aquí creo que podría haber un check que seleccione todo. Y este, este mensajito 
acá de, de que lo vamos ahora a mandar a que pues que comience su validación. Eso por ese lado. 
Ya aquí obviamente viene todo el tema del sistema, lo que va a hacer. Acá en clic en comenzar es 
dirigido a la pantalla del web SDK, que es lo que les estaba mostrando acá, que es esto, así como 
pasa en Guatemala, y yo le doy clic en persona natural y me manda de una vez a una nueva pestaña 
del navegador de donde pues debo iniciar el flujo de verificación con Zumzum. Acá pues envía 
la información que tenemos del usuario a Zumzum y en el sistema pues se valida si es persona jurídica, 
a qué flujo me manda, por ejemplo, en el KYB, y si es persona natural, pues me va a mandar claramente 
al KYC. Acá se hace todo  

00:21:18 Speaker 1
el tema de validación, a qué-- contra qué base de datos se hace, si es KYB, qué es empresa, pues 
se debe hacer o se debe contrarrestar contra las bases de datos de ese país donde opera Dropy. 
Y si es KYC, pues ya de-- se contrarresta es con la base de datos de el país que está emitiendo el 
documento. Entonces, lo que les decía, si es un brasilero operando en Dropy Colombia, pues 
tiene que ir a mirar ese documento que él está-- va a escanear. Eh, es con la base de datos de Brasil. 
Eso es lo que también dependemos de que el equipo administrativo nos defina dentro de Zumzum. 
Eh, y acá tiene todo el tema de los intentos. Esto sí lo me guié mucho de cómo está funcionando 
Truora, porque cuando hablé con el equipo de compliance, pues me indicaban que así está funcionando 
y pues como que no hay, no hay intención de que funcione diferente, porque es lo que hasta ahorita 
funciona y no les genera como fricción en cuanto a solicitudes de los usuarios. O bueno, soporte 
de los usuarios. Eh, acá el tema  

00:22:32 Speaker 1
de que si no-- si pasó los diez minutos, entonces el típico mensajito de, de reanuda tu validación, 
si el usuario pues abandona su sesión, el mensajito de vuelve a, a comenzarla. Si el usuario 
la completó correctamente, la validación, pues está todo el tema de la pantalla de datos personales 
diligenciada, un mensaje de texto indicando pues que fue exitoso, un correo, eh, precarga 
la información. Y acá hay un tema que también lo que les decía, les decía es que pues esto es una 
propuesta, también a nivel de experiencia se puede mejorar. Y es que yo acá estoy planteando 
de que después de que venga, haga el tema de aceptación de términos y condiciones, porque tenemos 
países como por ejemplo Ecuador, Chile, Argentina y México, que tenemos un check de acepta-aceptación 
de términos y aviso de privacidad. En Argentina tenemos dos. Esto también se tiene que modificar 
porque deberían ser uno para cada cosa, es uno para decir privacidad y uno para términos y condiciones. 
Entonces, acá básicamente  

00:23:41 Speaker 1
es que el usuario termine de validar, si esto se precargó y esto aquí, pues sale todo el tema de, 
de aceptar esos términos y política de privacidad. Cuando lo acepte, se debe hacer el tema del 
flujo de verificación con el multifactor, flujo que ya también ahorita existe dentro de Dropy. 
Y pues una vez ya termine, pues se va-- debe validar cuando se guarde es cuál es el tipo de persona 
seleccionada por el usuario. Que si es jurídica, entonces se va a precargar. Ah, bueno, esto 
debería ser como... Aquí se precarga es la información, por ejemplo, en información de contacto, 
que eso es algo que también le mostraba ayer a, a Cata. Que la propuesta es unificar el flujo de 
los formularios. Entonces, digamos que ese yo lo seccioné por, por, como por títulos. Entonces 
el primero es información de contacto, pues viene todo el tema de, de lo que vemos ahorita en, 
en datos personales y muy, y como muy, mmm, agrupado a lo que tenemos en, en facturación electrónica, 
que es este pedazo de información  

00:24:51 Speaker 1
de contacto. Hay cosas que se, eh, complementan. Por ejemplo, el tema de país, el tema del municipio 
no lo tenemos acá, aquí tenemos nacionalidad. Entonces esto se podría complementar a es-- 
a lo que tenemos acá. El tema de la dirección aquí también lo tenemos y que pues en teoría esta 
dirección es dirección de contacto, no es dirección de facturación. Entonces esto se puede, 
pues obviamente homologar a un solo campo el email de facturación. En lo que yo propongo es que 
vaya dentro de la información de la empresa, ¿sí? Acá. Y el número de teléfono pues también tiene 
que ver con, eh, la información de contacto, que es en teoría datos personales y pues que acá, 
acá también tenemos un teléfono. Entonces, basándos- basándonos en eso, pues digamos que 
acá si es persona natural, entonces la información de contacto, pues va los datos de la persona 
natural. En información de persona, pues el, es lo mismo que el tipo de persona, o sea persona 
natural. El documento es pues el documento que haya--  

00:25:53 Speaker 1
con el que se haya validado el usuario, que es básicamente un documento que confirme la existencia 
legal de la persona. Y pues información tributaria, que este es solo, pues pertenece solo a 
Colombia. Eso es lo que les digo, que todavía pues no estoy segura de cómo se haga, porque ZoomSub 
nos permite poner campos adicionales dentro de el flujo y eso lo podemos traer vía API, pero 
pues no sé administrativo qué es lo que va a poner o parametrizar en sus flujos en ZoomSub. Entonces, 
en caso de que pues esto no lo traiga, pues toca mirar una forma de cómo hacemos que el usuario 
nos dé su información tributaria y que no vaya a generar fricción porque lo estamos trayendo 
de un flujo aparte a que vuelva a Drop y diligencie, eh, los campos en vez de precargárselos. 
Y para el tema de persona jurídica, ahí me encuadré, jurídica es, pues información de contacto. 
Lo que les digo, este pedazo de información de contacto, pues va a venir todo el tema del representante 
de la empresa, que es lo que les  

00:27:05 Speaker 1
mostraba en ZoomSub, que es toda esta validación y verificación. Digamos que acá lo que les 
decía, como yo ya estaba validada en ZoomSub hace un tiempito, pues ya me precargó automáticamente 
mi documento de identidad en la cédula y lo único que hizo fue validar que yo, pues fuera una persona 
real. Ese, esa es la información que se trae en información de empresa. Pues ya todo el tema que 
les mostré, los documentos que se sube y la información que ZoomSub consulta y pues ya el tipo 
de documento, pues subo el documento que confirme la existencia legal, en este caso pues de 
la empresa. Acá eso es lo que les digo, también depende mucho de qué es lo que el equipo administrativo 
pues parametrice dentro de sus flujos. Puede que ellos digan, así como les mostré acá a ustedes 
que a ZoomSub en este demo me permitía subir tres. Si yo subía una no pasaba nada, pero si yo subía 
los tres pues también, pues mejor, acá está. Yo aquí simplemente pude haber subido este y ya 
haber hecho continuar para que  

00:28:08 Speaker 1
me fuera a validar como, como persona, pero como subí los tres pues ZoomSub cogió toda esta información 
y aquí ustedes se pueden dar cuenta, se visualiza en el backoffice de ZoomSub esos tres documentos 
donde pues me dicen, me dice que pues me los rechazaron. Entonces eso también depende mucho 
de lo que haga administrativo. Administrativo puede decir no sé, en Colombia para KYB, o sea 
persona jurídica, quiero que me suban seis documentos obligatorios. Entonces acá el usuario 
pues los va a subir y la idea es que pues se carguen en el formulario. Y una vez hecho esto, pues 
lo mismo, mensaje de que la validación fue exitosa y se bloquea el formulario. De ya una vez, 
pues se guarda toda la info, porque ya digamos, hice todo el tema de aceptar términos y condiciones, 
hice todo el tema de la verificación de dos, pues pasos. Ya una vez haciendo eso, pues simplemente 
lo que queda es habilitarle las funciones de transferencia entre iguales y retiros, bloquearles 
el formulario e indicarles que pues  

00:29:16 Speaker 1
hasta dentro de seis meses se le vuelve a habilitar. Y ya aquí inicia todo el flujo de solicitar 
la actualización de datos posterior a seis meses, que es la que-- lo que existe actualmente 
en el sistema. Y pues esto es lo que les decía, que es muy-- es igual a lo que se tiene en Trueora. 
De los reintentos, de cuando el usuario abandona el flujo de validación y de cuando el usuario 
es rechazado. Aquí entonces viene que ya el usuario es baneado e intenta acceder a otro de país 
Dropi con el mismo correo. Pues se le debe mostrar un mensaje explicativo, pues indicando que 
no puede ingresar. Lo que les decía, creo que se lo dije a Cata, no recuerdo que se lo dije, es de 
que tenemos que mirar la forma de que este mensaje pues sea muy empático y aunque no nos pueden 
demandar por eso, porque también lo pregunté, eh, si es un tema de, pues de no adherir susceptibilidad 
del usuario. O sea, pues eres criminal, pero pues te vamos a-- no te vamos a decir que por criminal 
no te dejamos entrar. Y en el  

00:30:15 Speaker 1
tema de Colombia tenemos acá este flujo diferente, porque digamos que la, la API de Trueora, 
mmm, por lo que entiendo, no nos permite descargar la información. ¿Sí? Eh, lo que nos permite 
hacer yo le decía a Cata y es que digamos en Colombia yo acá me-- tengo mis datos, no me he logrado 
validar pero el documento que yo subí es esto, ¿sí? Entonces yo una vez vaya y le dé intentar validarme 
o bueno hacer la validación desde cero y me voy hasta el flujo de Truehora, yo puedo irme a validar 
con una cédula pero en Droppy me queda este documento subido, ¿sí? Yo le preguntaba a José como 
esta, este, digamos si yo subo esto y me voy para Truehora, Truehora me dice: Oiga esto no es lo 
que-- no le coincide con lo que usted me está mostrando en Truehora, entonces yo lo rechazo. 
José me dice que así no funciona con la cédula pero sí con el pasaporte. Es decir, si yo acá subo 
una foto de pasaporte y me voy para el flujo de Truehora, Truehora sí coge esa foto de pasaporte 
y la contrarresta a lo que yo  

00:31:20 Speaker 1
estoy haciendo dentro de Truehora, ¿sí? Entonces ahí hay como ese, ese pequeño problemita 
con Colombia y pues como con Colombia lo que les decía Truehora tenemos contrato todo lo que 
queda de año, entonces no podemos simplemente hacerlo igual que el flujo que les dije ahorita, 
toca mirar cómo se hace Colombia y la forma en la que yo propongo hacerlo es que sí tenemos que 
unificar pues el formulario, pero tenemos que ver la forma en la que la persona se, se le mande 
a validar. O sea, tal cual acá, pero la diferencia es que aquí ambos se hacen con Truehora y ya 
lo que vamos a hacer es que si es persona natural, se va por Truehora y si es persona jurídica se 
manda por Zumzum, que es el plan en Colombia se contrata Zumzum es solamente con KYC. En el resto 
de países va a estar como KYC y como KYB, porque lo que les digo es que Truehora solo existe en Colombia. 
Tenemos contratado otros países, sí, pero solo se va a dejar para Colombia y ya Zumzum debe entrar 
a operar como KYC, KYB en los otros  

00:32:28 Speaker 1
países. Entonces, es unificar este formulario de datos personales con los de facturación, 
como la propuesta que le di acá, bueno, y mandarlo a validar, que sería muy parecido a esto de 
vaya y seleccione usted cómo se identifica. Espérenme un segundo. Ah, mentiras, yo no le voy 
a pedir que, que me seleccione cómo se identifica, porque en teoría como va a estar diligenciando 
primero el formulario, pues no tiene sentido que yo le vuelva a pedir que se identifique como 
algo si yo acá, ya el usuario me está diciendo que es natural. Entonces, esto simplemente se 
manda, mmm, vía la API, o sea, Droppy le está mandando eso al, a, a cada uno. Entonces, si yo seleccioné 
en Droppy natural, pan, me manda a Truehora. Si seleccioné acá, si seleccioné natural, inicio 
todo el flujo de persona natural y aquí es que inicia con Truehora. Y si yo seleccioné jurídica, 
pues me lo manda con Zumzum. En natural, pues como ya no voy a tener esta pantalla, sino que voy 
a tener únicamente el tema del checklist. Checklist  

00:33:36 Speaker 1
como persona natural, ¿sí? Es especificarle que esos son los datos y que no podrán ser modificados. 
Bueno, acá no lo podemos especificar. Y que, bueno, pues en teoría es con los que se le va a facturar. 
Y el paso dos es el tema del representante legal y de que una vez nos pase todo eso, pues es con lo 
que se le va a facturar en lo mismo el checklist. Por darle confirmar nos manda al tema de la pantalla 
del web SDK, ya sea de Truehora o de Zumzum, pues dependiendo del tipo de validación. Y acá la 
diferencia es que en Zumzum le mandamos la información que diligenció el usuario en el formulario 
y pues aquí ya es que haga su validación como la conocemos actualmente en Truehora. Entonces, 
¿qué, qué sacamos con que le mande la información? Es que pues ya una vez el usuario ya no tenga 
que modificarla para que no tengamos lo que nos está pasando ahorita. Y es que yo diligencio 
esta información y subo cualquier documento acá. Yo le mostraba a Cata que yo podía subir hasta 
un sillón y en Truehora  

00:34:42 Speaker 1
fui y me validé con mi cédula. En, en datos de facturación electrónica en los otros países pasa 
lo mismo. Diligencian su información bien, pero en el documento que suben van y suben la foto 
de, de ellos mismos, suben la foto de una carita feliz, suben cualquier cosa con tal de diligenciar 
ese, ese formulario. Entonces, acá evitamos que una vez mandando esa información es que Zumzum 
la agarre y con eso pues haga la, la validación. Y lo mismo, el resto sí es como muy parecido de 
que si pasó la validación pues ya, eh, le salga el mensaje que lo hizo correctamente. Se diligencie 
pues la información quede precargada correctamente. Acá la única diferencia es que el documento 
es lo que se va a subir. Aquí no lo estamos mandando a que diligencie el formulario con el documento, 
sino que lo va a obtener es del documento que escanee en Zumzum o en Truehora. Eso toca confirmarlo 
porque José no me ha dado razón de qué es lo que puede hacer Truehora. Y, y ya de una vez queda ya 
todo confirmado, pues  

00:35:49 Speaker 1
se deshabilita el formulario y todo el tema acá de que si es baneado, de que si los reintentos, 
etcétera. Eso aparece el lado. Y el tema de editar la información, aquí yo definí unos campos, 
eh, que si se modifican deberían volver a activar la validación, porque lo que yo les decía al 
equipo administrativo es que si nos ponemos a que si cambio, no sé, el, la fecha de nacimiento 
y mandarle una nueva validación, pues en teoría estamos, estamos desperdiciando un poco el 
tema de En costos de validación. Entonces hay campos que sí o sí son graves o bueno, requieren 
volverse a validar. Por ejemplo, si yo cambio tipo de persona natural a persona jurídica, pues 
claramente ten-- el usuario no va a seguir estando validado con KYC, sino que tiene que irse 
a validar con KYB. Si yo cambio documento de pasaporte a NIT, pues obviamente me tienen que volver 
a validar porque el documento con el que yo me estoy validando en Subsub o en Trueora, pues me 
cambió. Entonces tengo que ir a, a verificar que ese  

00:36:53 Speaker 1
usuario le co-- le, le coincida el NIT con el documento que va a escanear o va a subir la foto. Entonces, 
estos campos son los que ya definí. Eso también, eh, el equipo administrativo junto con Group 
están en ese proceso de identificar cuáles son los, los campos que debería sí o sí como activar 
nuevamente la validación. Y ya acá pues lo mismo, se diligencias, se-- aquí se va a bloquear 
el tema de las wallets porque pues el usuario modificó los campos. Tenemos que solicitar esa 
validación, por ende no deberíamos permitirle mover el dinero y aquí lo manda a el SDK y hace 
todo el proce-- el mismo proceso de diligenciar. Y una vez termine, acá. Una vez termine, pues 
lo mismo, la información queda cargada en el documento y todo el tema de, de confirmaciones 
y otra vez se le vuelve a bloquear el, el formulario. Y pues obviamente acá tenemos el tema de, 
del Intercom, que es lo que ya, ya existe actualmente. Y todo el otro tema de, de deshabilitar 
el formulario. Y acá en el tema de cuentas bancarias,  

00:38:04 Speaker 1
que es muy parecido a lo que ya tenemos en Guatemala, es más, acá tengo las notas, es el, en popup 
de user pilot no podemos hacer la validación de que si es Guatemala me active la validación, 
sino que esto sale si es Guatemala, si es Colombia, si es Brasil, cualquier país que yo seleccione 
acá, pues esto va a salir siempre. Entonces, el flow ideal es que esta validación de Subsub debería 
ejecutarse posterior a validar qué país, si el país corresponde a donde se está accediendo. 
Ejemplo, pues si yo selecciono acá está Guatemala y yo estoy en Guatemala, pues se debe activar. 
Si estoy en Colombia o en Chile y estoy haciendo la, la, el diligenciamiento de formulario y 
selecciono esos mismos países, pues me debe activar la, la validación. Eeeh, y aquí ya una vez 
pues se le-- se corresponda, hay que pedir al usuario que seleccione cómo se identifica, si 
como natural o como jurídica, que es un poco lo que se hace acá, y ya para que me mande al flujo de 
Subsub. Y acá lo que se plantea es que si  

00:39:11 Speaker 1
el usuario no pasó esa validación, pues claramente no le permita la creación de esa cuenta bancaria, 
sino que se la rechace y obviamente esto ya va a quedar, eh, como guardado y no le debe permitir 
crear nuevamente esa misma cuenta con ese mismo tipo y número de documento. Que es básicamente 
lo que diligencia acá el usuario en este formulario que ya existe en Drope, qué tipo de identificación 
y el número de identificación. Entonces, si esto quedó validado, pues el usua-- el sistema 
lo que va a hacer es validar que esto no sea igual al nuevo que yo estoy tratando de agregar como 
cuenta bancaria. Y listo. Este flujo Juan Camilo lo está modificando porque este lo hizo él, 
entonces todavía creo que no lo ha terminado de modificar. Una vez lo modifique les, pues les 
cuento que ya fue modificado. Y pues básicamente esta es la, es la propuesta que se tiene. Sé 
que es un poco largo y de pronto confuso, pero esta fue la mejor forma que de pronto encontré. 
Sé que el equipo de experiencia tiene todo  

00:40:19 Speaker 1
el tema de, pues de que estos-- esto es un tema de onboarding. Yo les decía al equipo administrativo 
que hay que dejar de ver también un poco el tema del onboarding diferente al tema de facturación, 
porque al fin y al cabo la persona que se registra en Drope es persona natural o es persona jurídica, 
¿sí? Entonces tenemos que tratar como de, de, de visualizar un, ese flujo de una sola perspectiva 
para que el usuario pues no genere la fricción que tenemos ahorita. Es que yo diligencié esto 
y me validé y luego vengo acá, lo diligencié y no me valida. O si yo me validé acá con Trueora, mmm, 
a, pues no, no hacer que el usuario después venga acá a este tab, se registre y le-- cuando le guardar 
datos, entonces lo mande a validarse como persona jurídica, por ejemplo. Sino de que, pues 
si yo acá de una vez le digo que sí es persona natural, pues lo mande a KYC, si yo le digo que es persona 
jurídica, pues que vaya y lo valide como persona jurídica, que es lo que les, eh, inicié diciendo 
que es que  

00:41:17 Speaker 1
acá mismo se tiene la concepción de persona natural y persona jurídica. Y listo. No sé si tengan 
dudas, preguntas.  

00:41:30 Speaker 1
Sé que es demasiado largo.  

00:41:33 Speaker 2
Sí, igual Cata, esta es una oportunidad como pues parte de la célula de experiencia en conjunto 
con back office, es también para mejorar esa experiencia desde el registro. Cómo podemos hacer 
una mejor transición a nivel de experiencia en estos flujos que nos está planteando Pau para 
que también lo tengamos en cuenta, que es también un punto a, a tener en cuenta, ¿vale? Yo lo veo 
sencillo, pero sí es mucha información . O sea, a la final no es complejo, pero sí tiene como mucho 
detalle, Pau, como muchas reglas, muchas variaciones, muchos escenarios.  

00:42:11 Speaker 1
Sí, es lo que pasa. Igual lo que yo le decía a Cata, pues digamos que, eh, esto es lo que planteé, 
digamos que así un poco complejo. Acá como modo, modo, modo chisme. Ha sido un poco complejo 
porque digamos que el equipo administrativo, o bueno, creo que eso pasa en muchas partes, es 
que tiene la concepción de que como ya hicieron la contratación, ya se libran del proceso, ¿sí? 
Entonces la definición de esas reglas de negocio han sido un poco difíciles de levantar. Entonces, 
puede que pase de que hayan algunos escenarios que no se hayan contemplado, pero pues digamos 
que hasta apenas, eh, la semana pasada el equipo administrativo logró entender la importancia 
de: necesitamos que ustedes también vayan definiendo sus flujos a nivel de, de compliance, 
eh, lo que necesitan en ZoomSub para así mismo nosotros saber y entender cómo debería estar 
respondiendo el sistema, ¿sí? Entonces, pues todavía estamos en eso. Yo le decía a Cata: esto 
es una primera versión, necesita-- necesito tener como esto  

00:43:24 Speaker 1
visual para que el equipo administrativo, cuando ya nos sentemos con ellos, digan: "Ah, no, 
sí, no, tienes razón, esto no funciona". Porque las validaciones yo las he hecho es a punta de 
estos flujos. Pero yo le decía a Cata: son puros cuadros y flechitas y rayitas, y como se los expliqué 
a ustedes, se los he ido a explicar a ellos. Bueno, tal vez no tan a detalle, pero sí lo, lo a grandes 
rasgos, ¿no? Como si el dili-- el primero se valida, luego tenemos esa información, se precarga 
y la información que se precarga es esta, esta, esta, ¿sí? Así es como se los he tratado de explicar, 
porque pues si me pongo a-- el sistema va y valida y que si es esto va y lo manda a Flow y si es esto 
lo manda a ZoomSub, ¿sí? Ahí lo-- pues los confundo más. Entonces, yo le decía a Cata, necesitamos 
de pronto una primera versión en wireframes, así sea pues con IA claramente, para poderse, 
no, podernos sentar con ese equipo y decirle: mire, esto es desde producto, estamos planteando 
esta experiencia. Ahora  

00:44:19 Speaker 1
necesitamos que ustedes de verdad, pues con lo que han trabajado, nos, mmm, nos alineemos y 
miremos si se va a comportar así. Y si salen más reglas, pues también a empezar a aplicarlas a, 
a la experiencia. Pero lo que les digo, ha sido un poco complejo porque pues igual como esa concepción 
de, de ay, esto nos afecta a todos. Entonces un área me dice tal cosa, la otra me dice otra, pero 
pues deberíamos estar trabajando todos como en sinergia.  

00:44:45 Speaker 2
Entiendo entonces los alcances, que igual estos primeros insumos entonces, Pau, nos van a 
ayudar a que también las otras áreas puedan tener más claridad de esas reglas y esos flujos de 
negocio que hacen falta, ¿correcto?  

00:44:58 Speaker 1
Correcto, sí.  

00:44:59 Speaker 2
En sus procesos.  

00:45:01 Speaker 1
Correcto, sí, es que nos permitan y a ellos les permitan ver como ay, no sé, eeeh, no podemos bloquear, 
por ejemplo, las wallets porque X o Y cosa, ¿sí me entiendes? Es como demostrarles: vamos a funcionar 
así y que digan no, pero no podemos pedir esa información o sí podemos pedir esa información, 
porque Cata que ha trabajado facturación, y lo conoce mejor que nadie. Es-- uno entiende y es 
que una-- el área de facturación en X país pide una cosa y el área de facturación en X país pide 
otra, ¿sí? Pero no tienen como esa versión global de que tal vez los formularios se pueden unificar, 
¿sí? O de cómo hacemos que la facturación también dentro de ZoomSub se valide que no sea una empresa 
que lave dinero, por ejemplo. Entonces, es-esto la verdad, tener lo visual siento que nos va 
a servir para que los equipos entiendan de verdad ahora sí que no, no es solamente definir un 
flujo, sino que esto va a impactar a lo que va a ver el usuario.  

00:46:03 Speaker 2
Claro, es toda una experiencia. Listo. Entonces, si yo lo veo más entonces, Cata, como obviamente 
devorarse toda esta información que nos acaba de transmitir Pau y ya generar los espacios, 
que yo los veo como unos ex-espacios de ideación, de workshop, en donde ya traemos este insumo 
de apoyo para que entre todos pues terminemos de pulir los flujos.  

00:46:28 Speaker 1
Vale, listo.  

00:46:28 Speaker 2
Entonces es también crear como un espacio en donde todos participen en esta, en la socialización 
pues de, de este flujo, que claramente es hacerlo rápido con, con IA, como para bajar toda esa 
info tan valiosa que nos acaba de decir, materializarla un poco.  

00:46:44 Speaker 1
Sí.  

00:46:45 Speaker 2
Forma. Listo. En este orden de ideas... Perdón, Pau. Pau, ¿vas a decir algo?  

00:46:52 Speaker 1
No, de-- iba a decir que también le he dicho a Cata, de pronto, obviamente yo pla-planteé esta 
experiencia, pero pues Cata de pronto cuando se siente a, a absorber toda la información puede 
decir: no, Pau, eh, no sé, esto puede generar fricción, opino que podemos hacerlo mejor antes 
o después, por ejemplo. ¿Sí? Claramente, pues todo eso sería muy valioso para mí, porque yo 
lo hice solita. Entonces sería genial. Me pudieran también dar como ese feedback.  

00:47:21 Speaker 2
Listo. De una.  