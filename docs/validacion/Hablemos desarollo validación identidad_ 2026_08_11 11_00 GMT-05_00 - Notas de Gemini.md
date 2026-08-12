ago 11, 2026

## **Hablemos desarollo validación identidad \- Transcripción**

### **00:00:00**

**Victor Ney Orobio Hurtado:** parte de la configuración que se hace en el en el dashboard de ellos. Eh, entonces eso toca como eh sopesarlo, qué parte es realmente la que queremos tener allá y y cómo podemos también estar al tanto en el lado de acá, en el lado que recopira la información y que y que le va a servir como puente al resto de áreas o clientes de la validación. eh los cambios que se puedan hacer en el dashboard de de Zumsu. Entonces, son de las par de cositas que que llama mucho mi atención porque hay que resolverlas desde un principio, eh, dado que son cosas que que pueden pasar, o sea, uno no puede ignorar el hecho de que un cambio en la configuración del dashboard de Zomsu, puede hacer de que las cosas se comporten de una manera diferente. Entonces, de las primeras cosas que que estoy tratando de abordar o que me gustaría tener en cuenta cuando nos hagan el onboarding de Zumsu es ver cómo desde el API de ellos pueda obtener yo esos cambios y poder hacer como un lock de todo lo que pueda pasar a ese respecto para poder identificar rápidamente si si llega a presentarse esa situación.

**Juan Camilo Rojas:** Va, listo. Pues mira, yo desde mi perspectiva en lo que hemos avanzado en en digamos en todo este tema de la validación de identidad, sí hay particularidades que hay que ir como ya desde el lado tecnológico teniendo esta habilitación, es ver cuál es el alcance de cada punto y digamos dentro de lo tecnológico ya ustedes definen, o sea, no es como que comienzo desde lo más fácil a lo a lo más difícil.

### **00:01:52**

**Juan Camilo Rojas:** Eh, no, sino más un tema de qué es prioridad, cómo está el tema del del de la inversión pues en el en ese recurso, en la investigación, en encontrar la API, que sea lo que nosotros tenemos y demás. y ya pues digamos que las áreas mismas nos desbloqueen la la prioridad porque pues si nos vamos a prioridad todo es prioritario, todo es urgente,

**Victor Ney Orobio Hurtado:** Mhm.

**Juan Camilo Rojas:** eh, pero nada, ahí eso es parafraseando como la situación, ya entrando en materia de lo que para mí es o o debe ser el el backlock del proyecto, sería Colombia, pues al ser el país más grande en facturación, Eh, debe ser la prioridad, pero ese tiene un como tres asteriscos grandes y es lo que acabas de mencionar, tiene truora para la parte de la validación del de persona natural y tendríamos que aplicar para la parte de facturación, que es lo que hoy no hemos podido lograr. con Lina se tenía esa duda y de pronto viste que en la reunión Lina se nos estaba desviando y es que Sonsum nos permite obtener la documentación por cada país, pero la documentación de validación de identidad más no la de facturación,

**Victor Ney Orobio Hurtado:** Eh,

**Juan Camilo Rojas:** que ahí yo quiero que también como que tengas esa apertura de no es un único proyecto, son tres en uno.

### **00:03:33**

**Victor Ney Orobio Hurtado:** Okay, tengo una inquietud ahí.

**Juan Camilo Rojas:** Dime.

**Victor Ney Orobio Hurtado:** Es exactamente a qué se le llama eh documentación de facturación.

**Juan Camilo Rojas:** Resulta que Lina eh dentro de los procesos pues que ellos realizan internamente ellos para poder facturar, es decir, Colombia que es uno de los países donde se realiza, digámoslo así, la declaración ante la de todos los ingresos y egresos, eh se le solicita,

**Victor Ney Orobio Hurtado:** Mhm.

**Juan Camilo Rojas:** ya sea al extranjero que opera en Colombia o al colombiano que opera en otros países que también se hacen facturación, que entiendo que son Ecuador, Chile, Argentina. Eh,

**Victor Ney Orobio Hurtado:** Mhm.

**Juan Camilo Rojas:** ellos necesitan una documentación para poder presentar a la Diana, así como nosotros aquí tenemos el RU, el RU, la Cámara y Comercio, el certificado de creación de empresa, bueno,

**Victor Ney Orobio Hurtado:** Hm.

**Juan Camilo Rojas:** todo eso también existe para los demás países. Entonces ahí el reto más grande es que que ya lo tenemos, que es identificar cuál es la documentación que exige ese ente en los países y cómo la capturamos. Entonces, ahora mismo Sons nos dice, "Yo no tengo, o sea, digamos, yo no sé en Argentina qué documentación tenemos ante las entidades eh tributarias, pero Sonsopsi tiene los documentos de identidad de la persona en cada país." Entonces,

### **00:05:03**

**Juan Camilo Rojas:** supongamos en Argentina que el DNI, que en Ecuador el no sé qué, que en Chile también DNI, si no estoy mal, que en Colombia la cédula. Esos sí los tiene, pero los otros datos, por ejemplo, que el ROUT, que el Cámara y Comercio, que en Argentina el Arca, el quid, el quil y todo eso, pues lo tengo fresquito porque yo participé en ese proyecto.

**Victor Ney Orobio Hurtado:** Ya se

**Juan Camilo Rojas:** Eso es lo que hay que construir y literalmente es para mí

**Victor Ney Orobio Hurtado:** ve.

**Juan Camilo Rojas:** capturar como no sé si conoces la operación de Ecuador y Chile,

**Victor Ney Orobio Hurtado:** No, no lo tengo presente porque

**Juan Camilo Rojas:** ¿no? Ya. Entonces, básicamente ellos que hacen es que no tengo el módulo, pero ellos entran a un módulo de validación donde

**Victor Ney Orobio Hurtado:** No.

**Juan Camilo Rojas:** simplemente chequean que el docum que los datos que puso la persona en el formulario coincidan con el documento que él cargó, más no hay una validación Yeah. de si esa empresa existe, está constituida o es simplemente un papel que o una imagen que crearon con inteligencia

**Victor Ney Orobio Hurtado:** Ok.

**Juan Camilo Rojas:** artificial. Entonces, ese es el ese es el punto algido. Pero como te digo, eh aunque se vean como separados, o sea, aunque se vean juntos, son dos proyectos que van por separado, porque yo entiendo hacia dónde va Lina.

### **00:06:24**

**Juan Camilo Rojas:** va a querer que al final solo haya un botón que diga generar facturación exógena. Usted escoge todos los cruces, movimientos de todas las personas de Dropy, valida cuántos fueron sus ingresos, sus egresos y eso es lo que reporta eh en la en su facturación, en sus procesos pues de

**Victor Ney Orobio Hurtado:** Bueno,

**Juan Camilo Rojas:** financiar.

**Victor Ney Orobio Hurtado:** allí hay que tener un hay que hacerle un zoom bien grande a eso. ¿Por qué? Porque me estás hablando de dos cosas diferentes. Una cosa es la obtención de la documentación y la validación y la pues sí, la validación, valga la la redundancia de la validez de esa documentación, ¿ya?

**Juan Camilo Rojas:** Ajá.

**Victor Ney Orobio Hurtado:** Y otra cosa es el reporte de información exógena, o sea, la recopilación y reporte de información de facturación, que es lo del reporte de exógenas. Son dos son dos mundos, o sea, el uno va antes y el otro va después.

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** O sea, antes de yo ir a reportar cualquier cosa, debo tener en cuenta de si lo que yo voy a reportar está atachado a un documento que sea realmente válido. ¿Ya?

### **00:07:25**

**Victor Ney Orobio Hurtado:** Entonces, la validación va por un lado que tiene como clientes la parte de facturación,

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** la parte de usuarios, eh, y compliance y otras áreas,

**Juan Camilo Rojas:** Ajá.

**Victor Ney Orobio Hurtado:** ¿ya? Pero por un lado va la validación, que es eh de lo que yo estoy enterado, que lo es lo que debemos hacer. Ahora habría que enfocarnos en qué validaciones necesitamos,

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** qué cosas necesitamos validar cada área, aunque tienen cosas en común, por ejemplo, la validación de de verificación de que la persona es la persona y que los documentos que presenta son ciertos es una. Pero resulta que además de los documentos de identificación también existe que si la persona tiene conformada una empresa, entonces se valida como tal la empresa como persona artificial, como persona jurídica, ¿ya?

**Juan Camilo Rojas:** Ajá.

**Victor Ney Orobio Hurtado:** y que esa validación de esa persona jurídica puede tener adjunto la la validación de representantes que son personas naturales por los cuales se valida igual que cualquier otra persona natural. Bueno,

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** y a una vez esté eso validado, ya también hay que tener en cuenta una cosa. Si por ejemplo,

### **00:08:28**

**Juan Camilo Rojas:** Por ejemplo, si una

**Victor Ney Orobio Hurtado:** si es una persona jurídica tiene que tener un registro ante Cámara de Comercio o

**Juan Camilo Rojas:** persona

**Victor Ney Orobio Hurtado:** cualquiera que sea el ente dependiendo del país que haga sus veces. Entonces, hay que verificar ese documento. Tengo entendido que SUMSI tiene la forma de hacer esa verificación de personas jurídicas junto

**Juan Camilo Rojas:** de

**Victor Ney Orobio Hurtado:** con personas naturales. Pero además si se necesita alguna otra tipo de habilidad de algún tipo de documento, eso deberíamos, digamos, en esta fase en la que estamos, deberíamos identificar qué otro tipo de validaciones para de una vez aprovechar con Zumsu y hablar si ellos tienen validación sobre ese otro tipo de documentos que pueda

**Juan Camilo Rojas:** Correcto. Sí, esa esa es una muy buena pregunta.

**Victor Ney Orobio Hurtado:** necesitarse.

**Juan Camilo Rojas:** Eh, ya entiendo que ellos hacen pues la validación con las listas OLAF y las de terrorismo y lista Clinton y demás, pero no estoy seguro de lo de eso que acabas de mencionar y eso es lo que sí voy a preguntarlo por el

**Victor Ney Orobio Hurtado:** Correcto.

**Juan Camilo Rojas:** grupo que tenemos, eh, porque claro, ellos deberían validar en la lista de ese país que ese documento que es propio de de esa región, pues de redundancia de ese país, pues existe, está conformada la la empresa y demás, que eso era eso fue uno de los puntos que nos comió como 15 minutos al final, pero pues lo ideal era meter solamente la la integración tecnológica, pero bueno, en eso es lo que nos hemos eh pasado todos estos meses.

### **00:09:57**

**Victor Ney Orobio Hurtado:** Mhm.

**Juan Camilo Rojas:** Estamos desde más o menos febrero, pues fue por primera vez que vimos el proyecto, ya en marzo lo empezamos a a trabajar y ya desde ese momento

**Victor Ney Orobio Hurtado:** Ok.

**Juan Camilo Rojas:** pues eh entiendo que tecnología también venía con una serie de de cambios después en su estructura y demás y nada, se nos da esta habilitación. Eh, como te decía, dentro de mi backlock está el tema Colombia, que mira que solo con coger Colombia ya tenemos bastante tela por cortar. Y para mí lo que sigue, que fue lo que lo que digamos Jonathan mencionó la reunión pasada, qué es lo que debemos acabar obviamente a futuro y es que ellos crearon por allá un flujo con comercial para capturar solo los datos de las personas

**Victor Ney Orobio Hurtado:** Sí,

**Juan Camilo Rojas:** que agregaban tarjetas para retiros más no más no todo el tema de valid, o sea, se da la validación de identidad, pero realmente lo que pasó fue que simplemente están validando cuentas bancarias y se creó un

**Victor Ney Orobio Hurtado:** Yeah.

**Juan Camilo Rojas:** flujo con Coloca porque Coloca ya tenía implementada la bolsa con Sonsop en ese momento y eh Coloca ofreció ese flujo que ellos ya tenían construido con ellos para capturar los datos en un tema simple de dispersión. Ahora Jonathan dice, "No, yo necesito que ese flujo, como ya pagamos la bolsa con Sonsop, pues no lo habiliten a Dropy." Entonces a mí se me vinieron dos cosas.

### **00:11:35**

**Juan Camilo Rojas:** Lo primero es ante la premura de querer capturar los datos con Sonsop, hablemos con ellos para ver si podemos replicar ese mismo flujo y capturar datos así como ya lo venían haciendo. Sí, que simplemente cojamos la información que qué que nos pasa coloca ya mirar tecnológicamente cómo integramos eso y cómo lo pasamos al FL. propio. Eso es otra validación que hay que hacer. Eh, y como te digo, dentro del roadmap decir, no, prioridad, empecemos con Colombia, pasemos Guatemala y luego el resto de países. que lo tercero que creo que es importante dentro de todo el roadmap es los países que ya tienen ese ese sistema de validación de facturación, como te decía, que son Ecuador y Chile, que es simplemente un flujo, haz de cuenta, un módulo donde el usuario carga la información, eh, carga una imagen y diligencia los datos de ese documento y simplemente desde financiero lo que hacen es validar cuando hacen esos bloqueos masivos que el documento que cargó la persona pues corresponde al documento del país y que los datos estén bien diligenciados y pare de contar. No hay validación de lo que ya dijimos, no hay validación de empresa, no hay validación de persona natural. Y esos son los tres grandes, para mí hitos que debemos tener dentro de este proyecto que se llama validación.

### **00:13:02**

**Juan Camilo Rojas:** Ya con eso ya nos van a decir, "No, pues eh repliquemos en los demás países los flujos que creamos, algunos nos van a servir. Ejemplo, el de Guatemala no nos va a servir con el con el primero que vimos con Sonsop nos va a servir. Entonces considero eh digamos oportuno eso que tú dijiste al principio. Lo primero de lo primero es ver qué nos trae la API, cómo se puede consumir y ya traduciendo eso pues a un lenguaje obviamente coloquial para nosotros que no somos de tecnología, pues listo, ya podemos usar la información que ellos nos dan y nos basamos en los campos de información que ya tiene Dropy construido para cada

**Victor Ney Orobio Hurtado:** Bueno,

**Juan Camilo Rojas:** país.

**Victor Ney Orobio Hurtado:** ahí hay una una cosa que me preocupa y que quiero como como poner en desde el

**Juan Camilo Rojas:** Dale,

**Victor Ney Orobio Hurtado:** punto de vista de de ingeniería, mi recomendación es la siguiente,

**Juan Camilo Rojas:** dale.

**Victor Ney Orobio Hurtado:** o sea, el sistema de validación de identidad debe ser agnóstico, o sea, entre comillas, no le debe importar si yo necesito validarla para facturación o necesito validarla para tarjetas de crédito o para transacciones. O sea, la validación de identidad es validación de identidad. Todos sus clientes deben deben estar deben tener una API sencilla la cual se

### **00:14:14**

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** les diga, "Vea, esto está validado, está pendiente, está bloqueado mientras que se realiza una validación manual o definitivamente está bloqueado." Para mí esos son los estados que un cliente debe entender. Ya. Ahora, más allá de eso, si yo sé que debe haber un un operativo de compliance que resuelva los bloqueos y estas cosas, ¿ya? Pero eso es independiente de las áreas que necesitan consumir si un cliente está o no validado. Ya. Entonces, como tal, validación le debe servir a cualquiera. Ahora, tenemos que tener otra arista y es no existe un único proveedor de validación, como ya lo estamos demostrando ahorita que tenemos truora y vamos a a meter Zumsu. Resulta que si sumulta efectivo en algún país por algún motivo, tal vez tengo que meter algún otro eh proveedor adicional. Entonces, el sistema debería estar habilitado de tal forma de que yo le conecte cualquier proveedor y la respuesta de cara a los clientes, llámese facturación, llámese eh e financiero, llámese eh usuario, llámese transacciones digitales, eh ellos simplemente deben entender es mi cliente está validado, mi cliente está bloqueado porque está pendiente de una validación manual o definitivamente está bloqueado.

### **00:15:49**

**Victor Ney Orobio Hurtado:** Ya. ¿Por qué? Porque en el caso de que esté bloqueado, ya sea bloqueado mientras que se resuelve el caso o definitivamente bloqueado, no, ellos deberían saber que con eso no deben permitir ejecutar acciones a ese cliente. Ya, pero si el cliente aparece como validado, que está en verde, listo, hágale, no hay ningún problema. Yo como sistema de validación le estoy certificando eso y lo certifiqué a través de cualquiera de los proveedores que haya de cara al cliente final.

**Juan Camilo Rojas:** Claro,

**Victor Ney Orobio Hurtado:** Eso no importa cuál fue el proveedor, lo que importa es el

**Juan Camilo Rojas:** claro, entiendo. Sí, me imagino que pues digamos que entendiendo eso que que me estás queriendo decir es

**Victor Ney Orobio Hurtado:** resultado.

**Juan Camilo Rojas:** como cuando hace el llamado a SAPI y yo valido si ya está registrado o no, pues si no lo está haga el proceso y si ya lo está pues valide que efectivamente está y que ya se encuentra validado, que esa la parte tecnológica, que eso es lo que con User Pilot no podíamos lograr.

**Victor Ney Orobio Hurtado:** Exacto.

**Juan Camilo Rojas:** íbamos a lograr una serie de popups y y un baneo, por así decirlo,

### **00:16:51**

**Victor Ney Orobio Hurtado:** Mm.

**Juan Camilo Rojas:** pero no pero no hay bloqueo

**Victor Ney Orobio Hurtado:** Es que Exacto.

**Juan Camilo Rojas:** transaccional.

**Victor Ney Orobio Hurtado:** Y ahí es donde viene el punto álgido. El bloqueo transaccional no es simplemente el sistema de validación. El sistema de validación lo único que te dice es, "¿Es es válido o está bloqueado?" Nada más. Ya la ya el bloqueo transaccional es literal de cada área y de qué

**Juan Camilo Rojas:** Exacto.

**Victor Ney Orobio Hurtado:** va a depender de si me dicen ya fue revisado, está validado o está bloqueado. Ya. Entonces son cosas que vamos a a a ir armando. Y ojo que ahí es donde el enfoque de cada área viene diferente,

**Juan Camilo Rojas:** Correcto.

**Victor Ney Orobio Hurtado:** porque por ejemplo no son las mismas acciones que se llevan a cabo en facturación si el cliente está bloqueado, que las que se llevan en financiero. Y de hecho son sistemas diferentes, aunque todos hagan parte de Dropy, literal, si tú vas a ver, van a van a pertenecer a microservicios diferentes o unos están en el core y otros también en microservicios.

**Juan Camilo Rojas:** Correcto.

### **00:17:56**

**Juan Camilo Rojas:** Sí, eso es, eso es. Mira que aquí Cata se nos unió, se nos acaba de unir, pero mira que va muy alineado con lo que vamos hablando. Ya está definido si la migración con SOPS se hace vía API o trasladando la base de datos completa de un lado a

**Victor Ney Orobio Hurtado:** He.

**Juan Camilo Rojas:** otro, que es todo el tema que estamos hablando de qué nos trae esa API. O sea, si está definido, pues más que si está definido la migración, es qué hacemos, eh, qué hace la API, qué nos devuelve y qué hacemos con la documentación que ya tenemos de esos procesos de validación manual de esos países. Eh, lo otro es, dice, "¿En Colombia es posible completar primero facturación y después identidad?" En ese orden actual donde identidad donde identidad va primero es ver esta pregunta. Cata pues yo creo que es más, cómo te digo, es ver si los servicios son distintos o hace parte de proyecto, porque una cosa es la validación de identidad de compliance y otra cosa es el tema de facturación que necesita LINA, de cuáles son los datos. Y si el formulario que tenemos hoy de facturación, pues nos lo vamos a manejar, ¿va a seguir o se va a modificar? ¿Qué o sea, qué es lo que realmente necesitamos?

### **00:19:18**

**Victor Ney Orobio Hurtado:** O sea,

**Jose Giraldo:** M.

**Victor Ney Orobio Hurtado:** ahí hay una cosa, eh, y es lo siguiente, que para Catalina pregunta, ¿qué necesita realmente cada cliente? Y cuando me refiero a cliente quiero decir facturación, financiero, bueno, cualquier área que necesite tener una validación de identidad. ¿Qué es lo que necesita validar realmente? ¿Por qué? Porque pueden haber validaciones que realmente no tengan que ver con la con la validación de identidad. Entonces, necesitamos necesitamos saber porque este desarrollo y sobre todo lo que está enfocado a Zumsu y a Truora son cosas de validación y verificación de identidad y validación contra unas eh bases de datos de de bueno, quién es el bueno y quién es el malo, por decirlo de esa manera. Eh, entonces necesitamos enfocarnos en con respecto a la identidad, qué necesita validar, con qué documentos, dependiendo de qué nacionalidades y ese tipo de cosas son las que necesitamos. O sea, ¿qué funcionalidades se necesita? ¿Qué funcionalidades se requieren por parte de la validación que preste el servicio de de de validación de identidad? Y vuelvo y les digo, independiente de que sea Truora, Sumsu o muy posiblemente que lleguen en algún momento a requerir algún otro proveedor de validación para algún país específico en el que Zsu y Trudora no puedan eh cumplir.

### **00:20:56**

**Victor Ney Orobio Hurtado:** Lo que necesitamos es saber de cara a nosotros, a nuestros clientes internos, qué necesitan realmente validar. Esa es la pregunta. ¿Qué

**Catalina Giraldo Aguirre:** Eh, en ese caso, a ver,

**Victor Ney Orobio Hurtado:** es?

**Catalina Giraldo Aguirre:** la dinámica que estábamos planeando hacer y que pues ya hemos estado adelantando es primero, o sea, vamos a diferenciar dos países, dos tipos de de situaciones, porque en Colombia pues vamos a tener vamos a seguir teniendo un proceso donde vamos a estar manejando Truora y luego para los datos de identidad y luego son para los datos de facturación. En cambio, pues los otros países lo que queremos hacer y que hemos ya estado trabajando con Juan es que en SS tengamos un flujo unificado que viva dentro de SSOP, o sea, no es un formulario que vive en Dropi, sino que es un formulario o un proceso que vive dentro de Sonsop tanto los datos de identidad de la persona y también se hace la verificación de los datos de facturación de pues de del usuario quiere incluir en Droping. Entonces,

**Victor Ney Orobio Hurtado:** Eh,

**Catalina Giraldo Aguirre:** luego de Sí,

**Victor Ney Orobio Hurtado:** una pregunta, Catalina,

**Catalina Giraldo Aguirre:** sí,

**Victor Ney Orobio Hurtado:** dame un ejemplo, por favor, porque para serte honesto me queda todavía siendo muy abstracto.

### **00:22:11**

**Catalina Giraldo Aguirre:** dime.

**Victor Ney Orobio Hurtado:** ¿Qué diferente o qué información es diferente en datos de facturación que en datos de validación de de

**Catalina Giraldo Aguirre:** Sí, claro. Por ejemplo, en identidad, pues yo solamente pues estoy pidiendo el nombre,

**Victor Ney Orobio Hurtado:** identidad?

**Catalina Giraldo Aguirre:** la persona. En cambio, en datos de facturación voy a estar pidiendo pues obvia primero segundo el país, pues en el que estoy me estoy inscribiendo en Dropy,

**Victor Ney Orobio Hurtado:** Hm.

**Catalina Giraldo Aguirre:** el Nint eh no sé el pasaporte y aparte de eso, normalmente la persona que se identifica,

**Victor Ney Orobio Hurtado:** Aha.

**Catalina Giraldo Aguirre:** o sea, yo no yo podría estar inscribiéndome en Dropy como un usuario de con tal nombre, pero yo quiero que mis datos de facturación puedan quedar a nombre de otra persona. Entonces,

**Victor Ney Orobio Hurtado:** Ok.

**Catalina Giraldo Aguirre:** eh puede que los datos incluso puedan ser distintos, incluso está el nombre datos de facturación porque puedo estar escribiendo a otra persona, al cual también pues se le va pues tenemos que hacerle tiene que hacer el proceso pues de que esos datos de facturación sean correctos. Entonces, por eso está por eso tenemos esa diferencia entre los dos pasos y pues no se puede simplemente como identificar solamente a la persona y ya se puede hacer todo también porque en datos de facturación pues el equipo de admin necesita pues esos datos para poder pues manejar todas las

### **00:23:30**

**Victor Ney Orobio Hurtado:** Ok.

**Catalina Giraldo Aguirre:** facturaciones y todo el proceso de los usuarios y es lo que hemos estado haciendo un poco a mano con Argentina, Chile, Ecuador, pero pues queremos que haya más velocidad porque esto nos está nos está pisando los pies un poco ya todo pues como muchos países no tenemos nada y pues estamos lentos. Por eso que Lo estamos necesitando.

**Victor Ney Orobio Hurtado:** Bueno, listo. Me me estoy poniendo un momentico en en en su punto de vista y entiendo la la entiendo la premura y entiendo eh por qué ven eh las cosas, digamos, eh como que facturación es algo separado de de la validación de identidad. Ya. Ahora les pido que se imaginen esto un momentico. Cuando yo voy a generar una factura o los datos que necesito para generar una factura son los datos de la persona o entidad, ya sea una empresa que vaya a hacer la facturación, que ojo, esos datos pueden ser diferentes a los datos de la persona que tiene su cuenta en Dropy. Pero de en una viéndolo en la esencia como tal, siempre van a ser, así sea para datos de facturación, tú vas a validar o una persona o una empresa, porque es, se supone que es la la persona o la empresa la que a nombre de quién se va a emitir la factura.

### **00:25:03**

**Victor Ney Orobio Hurtado:** Entonces, siempre va a ser validación personal o validación, o sea, de persona natural o de persona jurídica. Siempre va a ser validación de cualquiera que sea los datos. Así esos datos difieran de la validación de persona o de persona natural o de persona jurídica quien tiene la cuenta en Dropy. O sea, siempre independiente del nivel siempre es o validación de persona natural o validación de persona de persona jurídica. Cada quien, persona natural o persona jurídica, presenta unos documentos diferentes. De pronto, la mayor eh diferencia allí es que cuando se valida una persona jurídica, aparte de pedirle el documento que certifique que está constituido como persona jurídica y todo eso, adicional requiere que se valide como persona a su representante o representantes legales. Ya, pero volvemos a lo mismo, se valida la persona jurídica y se validan personas naturales. que desde ese punto de vista agnóstico a quién sea el cliente, sea facturación, sea compliance, sea eh tarjetas de crédito, bueno, sea lo que sea, siempre se van a hacer es validaciones o de personas naturales o de personas jurídicas. Lo que pasa es que en un caso se están validando personas naturales que se dieron como como vea, por favor genere la factura a nombre de esta persona y en otros casos se está eh validando es a la persona como como dueña del del de la cuenta de Dropy.

### **00:26:38**

**Victor Ney Orobio Hurtado:** Pero en esencia siempre el servicio de validación lo que te debe proveer es por favor valídeme esta persona eh jurídica con sus personas naturales o por favor valídeme esta persona natural. Eh, hasta ahí me me soy claro en la explicación.

**Catalina Giraldo Aguirre:** Sí,

**Diana Aldana:** Sí,

**Catalina Giraldo Aguirre:** es lo que hemos estado revisando Yeah. con con Juan Camilo y y también con

**Victor Ney Orobio Hurtado:** Correcto. Entonces, ahora yéndonos un paso más allá,

**Catalina Giraldo Aguirre:** Diana.

**Victor Ney Orobio Hurtado:** eh viene la parte de, bueno, ¿cómo vamos a obtener esa información de la persona y cómo se la vamos a pasar al proveedor? Tenemos la opción, una de las opciones que nos presenta Zumsu es Zumsu puede capturar esa información por nosotros y de hecho hacer ellos la custodia de esa información. Lo que pasa es que si lo hacemos de esa manera tenemos eh dos cosas que mirar. Una, nosotros podemos obtener esa información luego de que Zumsu la haya capturado. Número dos, si en el caso de que nos vayamos a migrar de Zumsu más adelante, eh podemos obtener esa información de vuelta para custodiarla nosotros. Ya.

### **00:27:47**

**Victor Ney Orobio Hurtado:** Ahora, como tenemos a Trora también y Trora va a ir un rato al a la par de Sunsu, yo no sé si Trora ofrezca esas mismas capacidades. Hasta donde yo sé, no tiene exactamente las mismas capacidades. Entonces, en ese caso, tendríamos que tener nosotros la forma más bien de nosotros obtener eh o o mantener las dos cosas como obtengamos la información y se las mandamos o que ellos la obtengan y y luego nosotros la podemos recuperar. Pero esas son cosas que tenemos que

**Catalina Giraldo Aguirre:** En ese en ese caso, Víctor,

**Victor Ney Orobio Hurtado:** mirar.

**Catalina Giraldo Aguirre:** lo que pensamos hacer porque en Truora ya tenemos un proceso en el que la persona pone sus datos en Dropy. Trudora solamente se encarga de verificarte el rostro,

**Victor Ney Orobio Hurtado:** Está.

**Catalina Giraldo Aguirre:** la el documento y se y pues se validan los datos truadropic para saber si está rechazado, necesitas otro intento o ya estás aprobado en Y ahorita lo que queremos proponer con Sonsopa que tal cual escribir los datos en Dropy como de todo como de dat, sino que simplemente para el resto de países, o sea, iniciar el proceso me manda un enlace a Sams completo el proceso en Sosopongo mi rostro, pongo mi pongo mi documento, es un poco más rápido porque no tengo que escribir uno a uno, sino que ya el auto completa casi todo.

### **00:29:09**

**Catalina Giraldo Aguirre:** Y ya luego me pregunta, "Okay, ¿eres la misma persona natural? ¿Eres otra persona? ¿Cómo quieres que te valide para los datos de facturación?" Le pide el documento datos de facturación. También la idea es que el proceso sea más rápido porque simplemente escanea el documento y puede autocompletar varios datos y ya cuando finalice la persona está validada tanto su eh tanto sus datos de cuenta como sus datos de facturación y esa data se debería de reflejar en Dropit, pero pues solamente para vista, como esto es lo que completaste. Ya, si tú quieres hacer la adición del proceso, eh, pues habría que contactarse con soporte para ver cómo se puede hacer la edición de proceso o podemos de pronto nosotros revisar cómo podemos hacer más rápida la adición de esos datos si es el caso, pero es un poco lo Okay. estábamos planteando y la idea es que todo la el proceso pues pueda vivir dentro de SSOTF porque pues hemos visto que en experiencia puede ser mucho más fluido y también pues aparte en tecnología pues es más rápido de que al menos de lo que hemos observado de que pues SS tenga los datos simplemente se reflejen en Dropy a que Dropy tenga los datos, los manda a SSOP, luego SSOP verifique esos datos él mismo y empiece a revisar, ah si esto está bien, esto no.

### **00:30:26**

**Catalina Giraldo Aguirre:** y luego vuelva a mandar a Dropy como que es más rápido que pues complete ese proceso y ya pues se pueda reflejar en Dropy pues eso, esos datos y el estado de la persona de cómo pues de cómo quedó su validación. Y en el caso de Colombia, pues sería un proceso dividido porque sería una parte hacerlo con Truora, pues como lo llamo haciendo en Truora porque pues seguimos con el contrato en Truora y también pues una parte pues con la validación de datos de facturación porque pues y esa esa parte de datos de facturación pues también la queremos manejar de una vez con Samsung porque va a ser un poco más rápido. Y la pregunta que yo tenía en el chat de es posible completar uno y después el otro es porque actualmente en todos los países eh los que tienen datos de facturación, bueno, Argentina todavía no, pero está en beta, pero Chile y Ecuador cuando tienen datos de facturación, o sea, tú no vas al tab de datos de facturación y una completa, sino que tienes que hacer la valiación de entidad y luego completa los datos de facturación. Pero en Colombia puedo completar los datos de facturación sin haber hecho la valiación de identidad. Entonces, eh para mí el proceso sería más como lineal de primero identidad y luego hacer la facturación como el resto de países.

### **00:31:51**

**Catalina Giraldo Aguirre:** Pero entonces es verificar también y tener en cuenta en Colombia de cómo vamos a hacer la dinámica, porque pues ahorita mismo es un poco puedo hacer un uno y después el otro y pues da un poco igual y sí es lo que hemos estado trabajando y perdón José si te quité la palabra estas alzando la mano.

**Victor Ney Orobio Hurtado:** José

**Catalina Giraldo Aguirre:** José, ¿tienes algo?

**Jose Giraldo:** Eh, a ver, yo yo digamos tengo una parte en el sentido, digamos de que lo que hemos hablado con Víctor y todo Rora hasta eh próximo año vamos por un contrato, digamos, más de contrato de de documento y todo. Vamos a estar con Tror, vamos a estar con Trora eh hasta un hasta una fecha del próximo año. Listo. Y eso algo más que se actualizó el contrato y se actualizó por otro año donde se dijo, vamos a el servicio de trer en Colombia. Ahora tenemos el otro proceso. Eso digamos que estamos ya digamos con Sunson y que ya digamos hemos pues obviamente elaborado con ellos para la validación de identidad y laación de de negocio de actos de facturación en los demás países porque tienen más alcance de Latinoamérica y todo. Eso es lo que tenemos, digamos, sobre la mesa en este momento.

### **00:33:20**

**Jose Giraldo:** Por eso mismo la integración con Samsung la veamos, digamos, en el sentido de que podemos ampliar más, tiene más cosas queora y tiene más país y la idea es salir con todos. Algo que nosotros eh digamos pues pensamos es digamos listo, en Colombia está el QYC o la validación de identidad de la persona digamos que está registrando como persona natural. Esa información es lo que ahorita necesitamos como salir en los demás países, salir primero, digamos, y validar ese proceso y inicialmente la información. Ya luego ya en otro en otra fase blocamos la validación de de la de los datos de facturación. Ahora, datos de facturación y datos personales, sí hay campos que son muy iguales, pero en las datas de facturación también, digamos, en los procesos que hacemos para facturar, ejemplo aquí en Colombia que tenemos un proceso, digamos que que se hace con la Dian y demás, pues son son campos para poder eh dar esa información, pero hay ahí hay un punto muy importante y es que datos de de datos personales, ya es la persona que está utilizando la plataforma es ese caso, la persona que estoy digamos utilizando la la información, la plataforma, datos de facturación es exactamente la persona natural o persona jurídica que es una empresa a cual yo deseo que me facture, ¿no? A veces y en los en muchos de los casos no es la misma información, es muy diferente.

### **00:34:52**

**Jose Giraldo:** ¿Qué sentido? que estos de datos de facturación pueden estar cambiando y según las reglas digamos de negocio que eh está digamos por por Dropy puede cambiar en 6 meses y una persona cada 6 meses actualmente cambia esos datos de facturación. Cambia esos datos de facturación para decir yo hoy o o este semestre necesito que me facturen a eh a mi abuela o a mi mamá o a mi tía o mi esposa, etcétera. Digamos, en ese caso, ¿para qué? para que digamos haya un proceso digamos que la persona, el usuario pueda eh de hacer esa facturación. Eso quedó y y después entendí lo que he he hablado con otras personas, hoy en día tenemos como esa regla de negocio que cada 6 meses se pueda cambiar, la persona pueda cambiar eso. Los datos personales pues son sus datos personales son esa información, pero eso no me por eso mismo tenemos que hacer la validación de datos personales y los datos de de la información de de la facturación. Ahora hay un punto donde decía, digamos, que primero hagamos el proceso por Zoom. ¿Ya? Y luego recapamos esos datos y los ponemos dentro de dentro del digamos dropping para mostrar digamos que esos datos son los reales y son los que validó son como el nombre, correo, etcétera, que son serían esos campos.

### **00:36:15**

**Jose Giraldo:** Pero entonces yo quiero yo quiero llegar es como como a un punto de todo eso y es la necesidad que hay en los países y es el primer punto de que podamos construir esta integración de Sunson de una manera que podamos que yo digamos igualmente lo hablaba con Víctor, que podamos llegar a a un mínimo viable ya de de validar los datos de identidad de la persona natural, así como lo tenemos hoy en día en hora. Ya, primero hacer esa y la que yo digamos también comentaba y también les comentaba a Catalina, aquí no está Paula, no sé si con Juan Camilo estoy hablando con Diana, pues primera vez que lo hablo, pero así lo hablaba yo un poco con Pablo, con Diana, con Catalina y con Juan Camilo, que la primera validemos ese es natural, esos datos personales y luego ahí en otras fases validamos las siguientes. Pero obviamente también Víctor ha estado mucho en este proceso, digamos, entendiendo y tecnológicamente digamos viendo la viabilidad técnica de cómo podemos realizar esto. Víctor, eh, ha visto cómo funciona el proceso de trora, nos ha comentado y todo cómo está eh y ya me tiene una estimación de acuerdo al proyecto, pero si es llegar a un punto donde podamos decir, "Venga, podemos lanzar esto, este MVP, eh, en tanto tiempo y y poder llegar como como a ese a ese desarrollo rápido.

### **00:37:47**

**Victor Ney Orobio Hurtado:** Bueno, a un lado de esto que está.

**Catalina Giraldo Aguirre:** en ese,

**Victor Ney Orobio Hurtado:** Dale,

**Catalina Giraldo Aguirre:** perdón,

**Victor Ney Orobio Hurtado:** dale, Catalina,

**Catalina Giraldo Aguirre:** Víctor,

**Victor Ney Orobio Hurtado:** dale. No,

**Catalina Giraldo Aguirre:** no,

**Victor Ney Orobio Hurtado:** dale,

**Catalina Giraldo Aguirre:** en eso que está diciendo José, yo tengo una pregunta y es, ¿llegó la dinámica que tenemos de que listo es como diferente?

**Victor Ney Orobio Hurtado:** dale.

**Catalina Giraldo Aguirre:** Y bueno, de pronto en unos países queremos que sea un flujo como seguido, por así decirlo, donde pues ya de una vez tenemos un solo estado, digamos solamente una línea de estado de estás aprobado, eh estás rechazado, estás en pendiente como invalidación general de identidad, pero pues en Colombia pues tenemos este proceso un poco dividido. Pero entonces yo quería de pronto conocer, teniendo en cuenta esto y que José quiere de pronto estar proponiendo este MVP para solamente natural, si realmente pues nos cuesta demasiado o es técnicamente pues complicado pues que salgamos con los dos flujos, teniendo en cuenta de que ya con Juan hemos estado adelantando en Son pues ya los flujos como natural y facturación y pues que facturación es algo que es realmente muy importante y que las personas de de lo que hemos visto de experiencia, o sea, las personas una vez completo natural, o sea, se olvidan un poco de facturación o hay que hacer otra estrategia para que vuelvan a completar facturación y se nos pierden un poco los usuarios.

### **00:39:08**

**Catalina Giraldo Aguirre:** Entonces, la idea es que no se pierdan o digan, "Ah, bueno, tengo que hacer facturación." O al menos por ejemplo facturación si tiene que volver a hacer, de pronto tienen que completar algunas cosas de nuevo. Entonces es de pronto ver si es muy difícil la parte de facturación para ver si o lo dividimos y está bien, si de pronto técnicamente es complicado y podemos de pronto salir en un país natural. Puede ser. Veo que Guatemala es como el más ahorita eh el que tenemos con más prioridad. Podemos hacer ese un flujo solamente para Guatemala y urgente o de una vez pues mapeamos todo y pues salimos Guatemala de pronto para probar qué tal y ya luego resto de países o de una resto de países y facturación y identidad de pronto no cuesta tanto. De pronto ver ese lado.

**Victor Ney Orobio Hurtado:** Bueno, Catalina, para responderte eh tu pregunta así con con cosas muy puntuales, tienes que tener en cuenta lo siguiente. Facturación es solamente una de las áreas que necesita eh la validación de identidad, ya como tal, el el hacer el poder articular el proceso de de validación de identidad con un proveedor no es la parte más álgida. Ya, porque de hecho hoy con Turora se puede hacer la validación de personas con con bueno, con ciertas limitantes, pero se puede hacer ya.

### **00:40:41**

**Victor Ney Orobio Hurtado:** Eh, ahí lo que lo que hay que tener en cuenta es que hay una parte que vive en el proceso de facturación y otra parte como tal que sí es lo de lo de la validación como tal. O sea, yo puedo facturar, sí, está validado ya, pero resulta que como además de eso está el el otro tema en profundidad y es que yo puedo pedir que se me facture a nombre de otra persona, entonces no es simplemente que yo tenga mis datos validados como usuario de Dropy, o sea, yo como Víctor Ney que me validen con mi cédula a ver si si mi validación de identidad pasa, sino que por ejemplo yo quiero que que a a mi hermano o las facturas hagan salgan a nombre de mi hermano que no tiene una una cuenta en Dropy, pero como persona puede ser validada. Ya. Entonces, en este caso sería simplemente que tengo encadenados dos procesos de validación de de de personas de datos personales a dos personas diferentes. Eso es más de lo mismo en este momentico, ¿ya? Pero la forma en la que eso afecta a mi cliente, que es facturación es diferente. facturación como mínimo, el mejor de los casos, que mis datos de facturación sean los mismos datos de mi uso.

### **00:41:58**

**Victor Ney Orobio Hurtado:** usuario de Dropy solo requiere una validación, un proceso de validación, una ronda que es la validación de Victor Neate. Pero en el caso de que mis datos de facturación no coincidan con los datos de mi usuario, voy a requerir dos rondas. La mía primero para para hacerme como usuario de y luego la validación de cuando yo vaya a presentar unos datos diferentes como como para facturación. Entonces, sí o sí voy a tener esas dos rondas y eso es inevitable. O sea, soy una sola persona que está proporcionando los datos de dos personas diferentes, una para hacerme usuario y otra para que me facture. Como son datos de personas solamente, entonces no tenemos ningún inconveniente porque igual es simplemente otra validación de las mismas que ya existe. Y desde el punto de vista de facturación es, yo no puedo permitirle a usted operar si sus datos de validación, ya sea de la persona principal o la secundaria que quiera meter allí para que para que eh funja como como facturador. Eh, si esos datos no han sido validados, yo no te puedo permitir eh que hacerte facturas, no te puedo permitir hacer operaciones. Entonces, son dos instancias diferentes que se manejan en dos partes diferentes.

### **00:43:15**

**Victor Ney Orobio Hurtado:** Una es la validación de usuarios, que es en el área de usuarios, y otra es la validación de facturación, que es en los datos de de facturación o en el área de facturación. Sin embargo, para ambas debería primar de que si no está validado no puede hacer nada. Y eso es una mejora en el en el lado de facturación, en el lado de de validación como tal, va a ser un servicio que sencillamente debería devolverte es está validado, está pendiente, está bloqueado y debe resolverse el caso o definitivamente está bloqueado. Cualquiera de esos cuatro estados. Ya. Y en facturación se obra dependiendo de cuál fue el resultado, cuál es el resultado que se está reportando. Entonces, como puedes ver, no es que sea algo transparente que se haga que se haga el cambio en una sola parte y ya no, aunque ya tenemos ciertas cosas adelantadas que se pueden adaptar, nada que ver con Sumsu, sino que estoy hablando con Truora y y QIC, eh, igual hay que hacer cambios en dos o tres partes diferentes y esos y esos cambios también van a tener eh lo que tú me estás mencionando o mencionabas hace un rato es de cómo queremos que sea la experiencia del usuario, cómo va a capturar esos datos, cómo me aseguro yo de que de que el usuario no se pase eso eh por la galleta, como se dice, y eso ya va a ser endureciendo un poquitico más las reglas de facturación.

### **00:44:37**

**Victor Ney Orobio Hurtado:** O sea, si el cliente no no ha proporcionado datos de facturación o no me indica que los datos de facturación son sus mismos datos de usuario, entonces yo debo bloquearle las acciones. Eso requiere desarrollo en sí mismo, que actualmente no está.

**Catalina Giraldo Aguirre:** Vale,

**Victor Ney Orobio Hurtado:** Sí.

**Catalina Giraldo Aguirre:** está bien.

**Victor Ney Orobio Hurtado:** Okay.

**Catalina Giraldo Aguirre:** Entonces,

**Victor Ney Orobio Hurtado:** Entonces,

**Catalina Giraldo Aguirre:** a ver

**Victor Ney Orobio Hurtado:** no no no lo que quiero decir es no quiero ponerte o poner dificultades. Lo que sí quiero es que tengamos en cuenta es lo siguiente.

**Catalina Giraldo Aguirre:** si

**Victor Ney Orobio Hurtado:** ¿Qué es lo mínimo que queremos alcanzar? Lo más próximo posible. Y basado a eso, nosotros nos adaptamos para darles una propuesta y decirles, "Vea, mire, les propongo que hagamos esto, que es lo más sencillo para alcanzar esto, que es lo primero que ustedes quieren alcanzar. Ya, igual lo todo lo demás que se quiera hacer se puede ir apilando en en en subsecuentes entregas, pero si si se quiere ver efectividad, si se quiere ver algo lo más rápido posible, entonces, ¿qué es lo mínimo que requieren que se haga para nosotros así mismo adaptarnos y adaptar el tiempo para hacerlo en el mínimo tiempo posible?

### **00:45:43**

**Catalina Giraldo Aguirre:** Vale, listo. Entonces, a ver, déjame a ver si entendí. Lo voy a explicar un poquito como yo lo entendí.

**Victor Ney Orobio Hurtado:** Ok.

**Catalina Giraldo Aguirre:** De pronto estamos estamos proponiendo entonces como para el resto de países porque pues ya en Colombia sí o sí va a estar dividido, pero tenemos propuesto para el resto de países un proceso de identidad y de datos de facturación, pero lo que entiendo es que para identidad tiene una serie de estados que se tienen que también reflejar en Dropis si se completa o no, pero también en datos de facturación hay una serie de estados, o sea, estados diferentes. que también se tiene que reflejar en Droping.

**Victor Ney Orobio Hurtado:** Okay, listo.

**Catalina Giraldo Aguirre:** Entonces,

**Victor Ney Orobio Hurtado:** Allí te hago te hago una salvedad. te haga una salvedad. Realmente,

**Catalina Giraldo Aguirre:** Mhm.

**Victor Ney Orobio Hurtado:** tanto para facturación como para datos de identidad, siempre tenemos una validación de identidad. O sea, los datos de facturación, lo que pasa es que eh digamos estamos acostumbrados a verlo como que son algo diferente a una validación de identidad, pero como tal es una validación de identidad.

### **00:46:45**

**Victor Ney Orobio Hurtado:** O sea, ya es validamos identidad para facturación o validamos identidad para usuario principal, pero ambas son validaciones de identidad. Si habilitamos la habilitación de la perdón, la verificación de identidad para personas, puedo tener datos de facturación, o sea, facturar a nombre de personas y puedo validar usuarios que sean

**Catalina Giraldo Aguirre:** H,

**Victor Ney Orobio Hurtado:** personas.

**Catalina Giraldo Aguirre:** entonces puede haber un punto en el que, por ejemplo, si la persona de datos de facturación es la misma que la de la misma natural, entonces el mismo estado,

**Victor Ney Orobio Hurtado:** Ajá.

**Catalina Giraldo Aguirre:** o sea, el estado de la natural aplicaría para el dato de facturación.

**Victor Ney Orobio Hurtado:** Ya ganaste. Exacto.

**Catalina Giraldo Aguirre:** Ajá.

**Victor Ney Orobio Hurtado:** Ahí ya ganamos.

**Catalina Giraldo Aguirre:** Pero si no esas entonces, claro, o sea,

**Victor Ney Orobio Hurtado:** Ya.

**Catalina Giraldo Aguirre:** en algún punto entonces están interconectadas porque si en una está bien, digamos, si una está aprobada, entonces en la otra probablemente también vas a estar aprobada porque eres la misma persona. Si eres diferente entonces

**Victor Ney Orobio Hurtado:** Exacto. Entonces, para ponerte un ejemplo,

### **00:47:41**

**Catalina Giraldo Aguirre:** no.

**Victor Ney Orobio Hurtado:** ¿qué sucede por cuando yo trato de vender algo en Mercadolibre? Yo ya lo he hecho. Resulta que en Mercadoolbre me ha cuando yo voy a proponer mis datos de facturación, hay un chequito que dice usar los mismos.

**Catalina Giraldo Aguirre:** Ah.

**Victor Ney Orobio Hurtado:** datos de de la cuenta principal, uno lo chequea y ya ellos no te vuelven a pedir nada porque ya estás validado. Ya. Entonces, ese es eso es una digamos una ganancia rápida, ¿ya? Porque no tienes que hacer doble validación después de que la una pase y si vas a usar los mismos datos,

**Catalina Giraldo Aguirre:** H

**Victor Ney Orobio Hurtado:** ya está validado. Ahora, si no va a usar los mismos datos, se le manda otra vez a tu hora. por favor, de ya sus datos, sus sus eh, ¿cómo se llama?, sus documentos, eh, escaneelos y todo y si pasa esa validación se le admiten esos datos como datos de de facturación.

**Catalina Giraldo Aguirre:** Okay,

**Diana Aldana:** Tengo tengo una pregunta.

**Catalina Giraldo Aguirre:** Diana.

**Diana Aldana:** Bueno,

### **00:48:45**

**Victor Ney Orobio Hurtado:** Sí,

**Diana Aldana:** como para que no sucedan como dos validaciones,

**Victor Ney Orobio Hurtado:** Diana.

**Diana Aldana:** eh se podría preguntar al inicio si el titular que se está registrando es el titular de la pues con que se va a hacer facturación y si no ahí sí se hace la validación solamente con el titular de la facturación. ¿Para qué le pedimos validación de identidad al que se está registrando en eso que nos va a aportar a nosotros del que se registra a la final? La data más importante es la de

**Victor Ney Orobio Hurtado:** Te hago una pregunta.

**Diana Aldana:** facturación.

**Catalina Giraldo Aguirre:** No, en ese lado, Diana, sí tenemos que, de hecho, me parece que está es más importante identidad porque pues la digamos la facturación es cumple, entiendo unos requisitos legales en cuanto pues tributarios, pero los datos de cuenta y la verificación de cuenta cumple los verificos de pues de legales de pues de Dropy de cómo tiene que dar todo. Entonces es importante que pues si complete todo o no es que uno sea más importante que el otro. Lo que sí es de que de pronto obviamente el registrarse y lo que hemos estado planteando en el flujo del que está haciendo el blueprint le vamos a preguntar tal cual, oye, completalo. O sea, lo puede hacer.

### **00:50:01**

**Catalina Giraldo Aguirre:** Sí, si apenas se registra puede decir completar datos y pues lo puede completar, pero pues no le vamos a estar insistiendo hasta y con pa le hicimos un umbral viendo varios datos de usuarios de 20 órdenes porque pues estamos viendo varios usuarios y y varios Exceles y vimos de que muchos usuarios luego de hacer como 20 órdenes es que se van a hacer activa a retirar ganancias. Entonces es por eso de que pues establecimos umbral para pues ya decirle como más activamente a nivel de alertas, a nivel de el inicio como tienes que validar tus datos, pero pues no pues sí, como para aclarar ese punto, pues no es que uno sea más importante que el otro, pues cada uno responde a unas responsabilidades que tiene Dropy y que tenemos que pues tener en cuenta para todos los usuarios.

**Victor Ney Orobio Hurtado:** Bueno,

**Diana Aldana:** Dale. M.

**Victor Ney Orobio Hurtado:** yo les hago una pregunta y Mhm.

**Catalina Giraldo Aguirre:** Mhm.

**Victor Ney Orobio Hurtado:** y es supongamos que Víctor Neyobio sea una persona que esté en la lista Clinton. Ya. Entonces, por ende, no deberían hacer negocios conmigo, pero ustedes me permitieron eh vincularme en su en su plataforma y empezar a hacer transacciones, así no pueda retirar el dinero, estoy haciendo transacciones.

### **00:51:20**

**Victor Ney Orobio Hurtado:** Eso, eso es lo que queremos como compañía.

**Catalina Giraldo Aguirre:** No es por eso que no y es por eso que también es importante los datos de facturación porque puede que mi identidad esté bien, pero luego los datos de facturación de la otra persona eh estén no puede operar. Entonces, por eso es importante los dos y actualmente no estamos exigiendo el otro.

**Victor Ney Orobio Hurtado:** M.

**Catalina Giraldo Aguirre:** Y primero pues ponemos a correr al equipo de facturación porque tiene que recopilar los datos de alguna forma y luego cuando ya lo recopilan tiene que verificar y decir, "Ah, no, esto no coincide con la persona o hay algo que está raro o no me da o efectivamente veo que hay un movimiento sospechoso en la wallet,

**Jose Giraldo:** No.

**Catalina Giraldo Aguirre:** veo que pasa esto y lo otro, los datos no coinciden, entonces no puedo pues hacia que la persona esté validada pues su su identidad, pues sus datos que me están dando. no son los correctos y pues tengo que tomar acciones. No sé, pero sí, pues obviamente tenemos eso.

**Jose Giraldo:** Ahí ahí para resumir,

**Catalina Giraldo Aguirre:** otro.

**Jose Giraldo:** digamos, en este caso los dos son importantes,

**Victor Ney Orobio Hurtado:** Mhm.

**Jose Giraldo:** ¿no?

### **00:52:31**

**Jose Giraldo:** Uno no tiene que ser menos importante que el otro.

**Catalina Giraldo Aguirre:** Mhm.

**Jose Giraldo:** Ya en el proceso, digamos, tenemos que pensar es que exactamente todo lo que ha dicho Víctor, todo lo que ha dicho Cata y para Diana, digamos, por eso decía que que está, digamos, porque con todo esto es lo que se ha levantado con Laura, pero digamos para este proceso es tú te registras, yo te tengo que validar porque necesito saber quién se está registrando en la plataforma, quién es la persona que está y va a dar uso de la plataforma. Necesito saber eso y saber qué qué son sus antecedentes y qué ha hecho esa persona. Eso primer punto para la validación de la identidad como persona eh con sus datos personales con su información. Ahora, el punto que también digamos, por eso mismo lo mencionaba, que lo hace Mercado Libre y lo hace otras tipos también de plataformas y obviamente cuando tenemos ya el proceso de cuando opera, cuando hace sus operaciones, vende y todo por cada uno de los países, por estado, por territorio, se necesita hacer un proceso de facturación y ese proceso de facturación necesitó es facturarle a una persona. Ahora, esa persona, esos datos a una empresa que le tengo que yo como empresa Droping facturar, yo le tengo que solicitar esta información. Entonces ahí donde estábamos diciendo esa validación de identidad es la misma, es la misma información, entonces es como un check o algo, pero yo pensaría que es eso es una forma de experiencia usuario Bro.

### **00:53:58**

**Jose Giraldo:** la plataforma que va a permitir a las personas como, bueno, ya quedé aquí, factúreme con eso, ya listo. Pero entonces por eso mismo se tiene que volver a pedir y validar esos datos de facturación. Esa persona tiene que hacer un proceso para que esa información de de cuál a qué persona o a qué empresa se le va a facturar, tenemos que validar. Eso son dos validaciones y eso que actualmente pues en el proceso están los dos, pero hay hay por allá más adelante que se quiere hasta el proceso de la billetera y la información pues de de transacciones que se quieren, pero ahorita pquémonos en esos dos ahora.

**Victor Ney Orobio Hurtado:** O sea,

**Jose Giraldo:** Dale, dale, dale.

**Victor Ney Orobio Hurtado:** para para redondear un poquitico lo que está diciendo José es lo siguiente,

**Catalina Giraldo Aguirre:** Sí.

**Victor Ney Orobio Hurtado:** mírenlo de esta manera. Yo estoy entrando a Dropic, quiero eh eh hacer uso de la plataforma. En ese momentico me validaron como persona, entonces yo ya estoy validado. Cuando el momento en que yo voy a empezar a hacer transacciones me eh eh requieren validarme para poder facturar, lo que se hace allí en ese caso es, me preguntan, vea, usted va a utilizar sus mismos datos de que ya validamos de usuario para que se le haga la

### **00:55:04**

**Catalina Giraldo Aguirre:** Mhm.

**Victor Ney Orobio Hurtado:** factura o quiere dar otros. Si yo elijo que son los mismos, no se requiere mayor validación porque no se requiere, o sea, para qué me van a validar, ya me tienen validado, ya se van a reusar esos datos.

**Catalina Giraldo Aguirre:** Sí,

**Victor Ney Orobio Hurtado:** Entonces, ahí disminuimos la

**Catalina Giraldo Aguirre:** hay sí precisamente en el proceso que como han

**Victor Ney Orobio Hurtado:** fricción.

**Catalina Giraldo Aguirre:** estado mapeando de Trubora, Trora ya mandó como un flujo de arquitectura. Se los puede enviar que es una propuesta, pero haría que verificar ya con Juan si está bien o no.

**Victor Ney Orobio Hurtado:** Hm.

**Catalina Giraldo Aguirre:** Pues la idea es que una vez que yo completo identidad, Trora me pregunta, digo, es que Trora Samsung me pregunta tipo, ¿eres la misma persona natural? ¿Quieres otra persona? ¿Eres otra persona o eres una persona jurídica? Entonces, a partir de esas tres respuestas se si eso es la misma persona, simplemente pues de una pasa todo ya y es un poco más rápido, pues tecnológicamente y también para la experiencia porque simplemente tiene que completar un poco menos pasos y pero pues sí, la idea es que sí durante el proceso sí se pregunte, oye, eres la misma o no.

### **00:56:12**

**Catalina Giraldo Aguirre:** Pero eh quería retomar un poco lo que dijo Víctor de Entonces se intercon Sí, como veo que de pronto, a ver es que tenemos que establecer tipo que es más fácil para ustedes y para porque pues en un mundo ideal pues yo diría, no pues hagamos todo de una de pues estatus de facturación y esto y pues lo vamos realizando y pues podemos incluso pues si es muy prioritario de pronto no hacer eh eh pues de irnos a a Guatemala, pero si no es así y queremos de pronto fragmentarlo es ver cómo porque pues estoy viendo de que hay diferentes estados dados. tanto cuenta como datos de facturación, pero en algún punto se pueden interconectar, o sea, si uno está bien, el otro puede estar bien, probablemente va a estar bien y va a estar aprobado, pero aún así pues son diferentes,

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** no es que sea el mismo estado de aprobado, entonces es aprobado de dos, sino que es aprobado cuenta y por ende muy probablemente si eres la misma persona natural. Pero entonces uno depende del

**Victor Ney Orobio Hurtado:** De de hecho, para que no haya para que no haya tanta confusión es yo soy aprobado,

**Catalina Giraldo Aguirre:** otro.

**Victor Ney Orobio Hurtado:** ¿cierto? Con mis datos básicos como persona. Ya.

### **00:57:36**

**Victor Ney Orobio Hurtado:** Si voy a utilizar esos mismos datos en facturación, ya estoy aprobado porque voy a tratar de validar exactamente los mismos datos. O sea, no hay que correr otra validación, no hay que hacer nada porque literal ya está el registro de que estoy aprobado. No es que existan unos datos para facturación, no, siempre existen unos datos de validación de personas. En este caso, solamente vamos a enfocarnos en la validación de personas. Existen unos datos de validación de personas, independiente de qué proceso sea el que requiera que se validen esos datos de esa persona. Si esa persona ya pasó por el proceso de validación y fue aprobada, ya está aprobado esa persona con esos datos. Ya,

**Catalina Giraldo Aguirre:** Ok.

**Victor Ney Orobio Hurtado:** independiente de que venga de facturación, independiente de que venga por wallet, independiente de que venga por donde venga, si ya la persona está aprobada o está aprobado. Ya. Ahora, luego de eso, el siguiente paso sería, okay, digamos como un siguiente intergable o una siguiente fase sería, bueno, ya tenemos estandarizado la validación para personas con Sumsu y y y también digamos con la con la retrocompatibilidad controra.

### **00:58:47**

**Victor Ney Orobio Hurtado:** Entonces, ahora sí vamos a enfocarnos en validación de de business de de empresas, ya que la validación de business requiere sus propios datos como tal de la empresa, pero también reutiliza validación de las personas vinculadas a esa empresa, que ya tendríamos la validación de las personas.

**Catalina Giraldo Aguirre:** Okay. Sí, podríamos hacer eso, sií, pero pues si me gustaría de pronto conocer si, o sea, si implementamos ya de una vez todo o las dos con la verificación de estados y todo como de pronto en tiempos como cuál tú es la diferencia, si es mucha o no, porque entiendo que si es complejo, pero pues de pronto si la diferencia no es tanta pues yo diría que pudiéramos salir ya completos teniendo en cuenta cuenta de que después pues después si salimos de cuenta

**Victor Ney Orobio Hurtado:** A ver.

**Catalina Giraldo Aguirre:** tenemos que insistir a las personas que valíen facturación y va a ser como un

**Victor Ney Orobio Hurtado:** Ajá.

**Catalina Giraldo Aguirre:** poquito como mencionarles o en al menos un segmento pod poramos acá en Guatemala pero pues ese segmento decirles, oye, ahorita tienes que ahorita completar facturación, entonces va a estar un poco como canzón, como ya hice la cuenta, ¿verdad? Tengo que hacer facturación déjame paz, por favor.

### **01:00:06**

**Catalina Giraldo Aguirre:** Entonces,

**Victor Ney Orobio Hurtado:** Okay. Entonces, mira, para para poder darte para poder darte tiempos, para poderte decir exactamente que entonces hagamos lo

**Catalina Giraldo Aguirre:** E

**Victor Ney Orobio Hurtado:** siguiente. Primero tenemos que tener claro cuál va a ser la forma en la que el cliente se va a enfrentar a esas validaciones. ¿A qué me refiero? Tenemos claro de que primero tiene que haberse validado cuando creó su cuenta, ya de que si ya si va a utilizar los mismos datos de facturación que utilizó para su cuenta, ya está validado, o sea, que no eso no requiere esfuerzo adicional. Pero si va a utilizar datos, diferentes datos, se va a tener que pasar por eh por la validación de esos datos. Okay, ese sería un uno de los dos escenarios.

**Catalina Giraldo Aguirre:** Aha.

**Victor Ney Orobio Hurtado:** Misma persona con mismos datos de facturación, misma o una persona con diferentes datos de facturación. Son dos escenarios. Y ahora tenemos también otros escenarios adicionales que son no es una cuenta de personas, sino que es una empresa la que está abriendo su su cuenta en Dropy.

**Jose Giraldo:** He.

**Catalina Giraldo Aguirre:** Jika Ok.

### **01:01:15**

**Victor Ney Orobio Hurtado:** Ya como tal se va a validar como empresa y por ende automáticamente debe validar las personas que lo representan porque así es la forma en que funciona. O sea, una empresa no se representa sola, sino que es representada por personas y esas personas, o sea, se debe validar la información de la empresa y la información de las personas. Y fuera de eso, si quiere que los datos de facturación, aunque sería algo raro, no aparezcan a nombre de la empresa, sino a nombre de otra empresa o de otra persona, va a también tener que correr esa ronda de validaciones. ¿Estamos claros? Son, miren,

**Catalina Giraldo Aguirre:** Sí,

**Victor Ney Orobio Hurtado:** miren todas las aristas que ya tenemos. Entonces, ¿pretenderlas todas? Sí se puede pretender hacerlas, pero tengan en cuenta de que estamos hablando solamente para facturación, no estamos teniendo en cuenta el flujo de validación para otros clientes que necesitan validación. Hasta ahí estamos. ¿Cuál es la pregunta que me quieres hacer?

**Catalina Giraldo Aguirre:** Sí, es que entiendo que hay diferentes,

**Victor Ney Orobio Hurtado:** Catalina.

**Catalina Giraldo Aguirre:** pero bueno, no sé si afectan algo o no, pero actualmente con el proceso que estamos llevando en Sonso,

### **01:02:12**

**Jose Giraldo:** ¿Por

**Victor Ney Orobio Hurtado:** He.

**Catalina Giraldo Aguirre:** pues Estamos ya abarcando como esas aristas o bueno, si es persona natural, si es persona jurídica, que hacemos y pues ya estamos estructurando como ese flujo para que dentro de Samsung quede y pues entiendo yo me dé un estado si sí, o sea, si está bien, si no está bien y para que pues lo podamos reflejar

**Jose Giraldo:** qué?

**Catalina Giraldo Aguirre:** ya a nivel de pues nosotros en operación pues drop todo. Entonces,

**Victor Ney Orobio Hurtado:** M.

**Catalina Giraldo Aguirre:** de pronto les puedo compartir ahorita pues la arquitectura y también con Juan ahorita le pregunto si puede compartir lo que él está trabajando de los flujos, pero eso ya lo estamos pues ya son pues dentro de Sonso estamos abarcando como esas diferencias o bueno, ¿qué pasa si es esto, qué pasa si lo otro? Entonces, si ya dentro de Sonso, pues lo estamos abarcando y pues entiendo yo,

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** no sé si hay más, pero la idea es que él nos diga un estado o pues nos registre los datos de la persona, unos datos específicos de la persona que pues obvio va a variar según el país porque son un poco diferentes según el país, pero bueno, los datos de la persona para reflejar en droping y el estado es aprobado,

### **01:03:30**

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** reportado en droping para que dispare un evento. pront de una alerta modal que le diga, "Oye, ¿no tienes pasó esto, tienes que hacer esto y lo otro?" Entonces, de pronto, no sé si eso demore mucho tiempo o es o o si pues entiendo que los estados son diferentes según según la persona, pero pues si al final de al cabo el output, por así decirlo, es está en datos de facturación con este estado, en datos de cuenta con este estado, entonces no sé, no o me pueden explicar un poquito como la la complejidad cómo se puede abordar o o cuál sería de pronto un poco la diferencia entre si solamente hacemos cuenta o si hacemos ambos.

**Victor Ney Orobio Hurtado:** A ver si nos vamos a si nos algo que simplifica, bueno, simplifica momentáneamente, pero complicaría las cosas después es si nosotros dependemos absolutamente de Zooms, su, o sea, sencillamente le consultamos a ellos, ellos nos dan el visto bueno o el bloqueo o bueno, dependemos directamente de los estados que ellos nos den, entonces quedaríamos totalmente acoplados a Sumsu. Eso sería bueno porque disminuye el tiempo de desarrollo. Ahorita sencillamente lo que hacemos es un un una capa de envoltorio sobre Zoomsu y todo el

### **01:04:51**

**Jose Giraldo:** Sí.

**Victor Ney Orobio Hurtado:** mundo entraría a consultar y los cambios de desarrollo que se harían serían los cambios pertinentes a cada área que vaya a consumir ese esa respuesta de Sumsu.

**Catalina Giraldo Aguirre:** Ok.

**Victor Ney Orobio Hurtado:** Ya solamente serían esos cambios más el envoltorio. Ahora, por otro lado, ¿qué tiene eso de malo? Por ejemplo, en este momentico tenemos Trora. Eso sería incompatible con Trora porque la verdad Sunsu y Trora no funcionan igual. Ya. Entonces, eso es un un un palo en la rueda que Colombia queda aislado de todo lo que se haga para el resto de países y después habría que mirar a ver cómo vamos a mejorar lo de Colombia en futuro

**Jose Giraldo:** No puedo

**Victor Ney Orobio Hurtado:** cuando se vaya a hacer y es algo totalmente factible,

**Jose Giraldo:** hablar.

**Victor Ney Orobio Hurtado:** es sencillamente una decisión que se toma en aras de de acelerar los tiempos de desarrollo. Ahora, por otro lado, hay que tener en cuenta que si nos vamos fullsu con el envoltorio y todo esto, si en algún momento por algún un este llega a haber algún problema con Zumsu y necesitamos desatacharnos de ellos, como el desarrollo que se va a hacer es a la medida para que Zumsu funcione, entonces vamos a quedar totalmente atados y totalmente dependientes de ellos.

### **01:06:12**

**Victor Ney Orobio Hurtado:** Mi recomendación, o sea, yo no digo que sea imposible, de hecho, eso es algo que es una práctica muy común en cualquier sistema, que es atarse a un proveedor, pero mi recomendación es procuremos no hacer ese tipo de cosas porque podemos tener un proveedor uno o dos años y luego darnos cuenta de que cuando queremos deshacernos de ese proveedor nos va a quedar tremendamente difícil porque todo está eh eh enfocado a funcionar.

**Catalina Giraldo Aguirre:** está almacenado con

**Victor Ney Orobio Hurtado:** Exacto. Entonces,

**Catalina Giraldo Aguirre:** ellos.

**Victor Ney Orobio Hurtado:** eh es como no nos vamos tanto de un lado y y ni nos vamos tanto del otro. O sea, lo mi propuesta o la propuesta que queremos hacerles es lo siguiente. Vamos a tratar de hacerlo lo más rápido, pero lo más rápido también depende es de cuánto tiempo, en cuánto tiempo. Por ejemplo, si ustedes nos dicen, "Ve, ¿qué es lo que podemos hacer en un mes?" Mi contrarrespuesta es, "Okay, ¿qué es lo mínimo que necesitas que esté lo más rápido posible?" En este momentico yo te diría, hagamos eh eh validación de de datos personales y datos personales es independiente de que sea para facturación o para cuenta o para ya, sino que simplemente si lo que se está presentando son datos de una persona y no de un y no de una empresa, ¿ya?

### **01:07:27**

**Victor Ney Orobio Hurtado:** que es lo que tenemos actualmente con Trora, pero vamos a hacerlo que sea primero agnóstico al a al proveedor para que no nos atemos a Sunsu o a Trora o el que sea que manejemos nosotros nuestros estados que sabemos que como mínimo tienen que ser máximo, pero como máximo tienen que ser cuatro estados, que es o está verde, que es que ya está totalmente validado, está en en pendiente porque se está validando, que eso hay algunas validaciones que pueden demorar hasta 24 horas, eh está bloqueado y debe y debe hacerse algún proceso de desbloqueo o definitivamente está baneado o está totalmente bloqueado. Esos son los cuatro estados básicos que se pueden tanto evidenciar como en Trora como en Sumsu y tal vez

**Catalina Giraldo Aguirre:** Sí.

**Victor Ney Orobio Hurtado:** podíamos homologarlo en el futuro para cualquier otro proveedor, ¿ya? Pero son en nuestros estados internos, no los estados de de Sumsu.

**Catalina Giraldo Aguirre:** Ok.

**Victor Ney Orobio Hurtado:** Tumsu nos devuelve un estado y nosotros lo traducimos al estado que nosotros entendemos. Bien, ahora, ¿qué podríamos hacer para ganar velocidad? es bueno, son su ya ellos son expertos en su forma de capturar las cosas.

### **01:08:30**

**Victor Ney Orobio Hurtado:** Entonces, en un en un principio dejemos que ellos capturen. Nosotros obtenemos tanto la información que ellos capturan como los resultados que ellos dan, pero los guardamos del lado de nosotros. Ya, así cualquier otra área que requiera una validación,

**Catalina Giraldo Aguirre:** Mhm.

**Victor Ney Orobio Hurtado:** no vamos a estarle pegando constantemente a Zumsu, porque yo me imagino que estarle haciendo peticiones a ellos cuesta y en el caso de que lleguen a hacer muchísimas peticiones nos pueden hasta bloquear momentáneamente.

**Catalina Giraldo Aguirre:** Okay. Vale,

**Victor Ney Orobio Hurtado:** Ya. Entonces, por eso, por eso no te puedo decir, "No, mira, es que es un desarrollo transparente y es facilito." Sí,

**Catalina Giraldo Aguirre:** entonces

**Victor Ney Orobio Hurtado:** podemos hacer algo muy transparente y muy facilito,

**Jose Giraldo:** Sol.

**Victor Ney Orobio Hurtado:** atándonos totalmente a zumut. Si eso es lo que se requiere, si eso es lo que nos pide, nosotros lo hacemos. No hay inconveniente de ese caso, pero no es algo que yo les

**Catalina Giraldo Aguirre:** mm yo. Ah, entiendo.

**Victor Ney Orobio Hurtado:** recomiendo.

### **01:09:23**

**Catalina Giraldo Aguirre:** Okay, pues lo puedo discutir con Juan y también con Diana. A ver qué como en cuanto según lo que se avanzado qué podemos hacer y de ser el caso.

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** Entonces entiendo de que de pronto lo que tú nos recomiendas es de pronto lo que yo que se podría hacer lo más rápido entiendo es avanzar con Guatemala. Si podemos de pronto hacer solamente cuenta, pues podemos hacer solamente cuenta.

**Victor Ney Orobio Hurtado:** Sí.

**Catalina Giraldo Aguirre:** Eso es lo más rápido. Si puedes de pronto si podemos entonces estimar y dar como un ejemplo de que se puede hacer lo más rápido, pero también y yo lo que estaba planteando es irnos con todo, pero teniendo en cuenta de que quizá no es, o sea, no es muy seguro estar dependiendo al 100 de Sonso para el almacenamiento de esos datos porque luego nos vamos. Entonces entiendo de que se puede de pronto como Sonsop nos

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** devuelve a nosotros como la los estados y la información,

**Victor Ney Orobio Hurtado:** Hm.

**Catalina Giraldo Aguirre:** pero aparte de eso es que tecnología vea una forma en la que pueda almacenar esos datos de Sonsopamos nos toque cortar relaciones con Sonsop, pues simplemente ya seguimos guardando como eso esa data, es ese estado os y todo dentro de Dropi, no solamente como Fring, ya, sino dentro de Dropy y eh y pues que podamos

### **01:10:51**

**Victor Ney Orobio Hurtado:** Mhm.

**Catalina Giraldo Aguirre:** cambiar algún proveedor si en un futuro se presente.

**Victor Ney Orobio Hurtado:** Correcto.

**Catalina Giraldo Aguirre:** Okay, listo.

**Victor Ney Orobio Hurtado:** Igual algo que les quiero pedir, eh, porque porque para poder hacer sugerencias más efectivas es necesario. Miren, yo me considero muy bueno, de hecho a modestia parte excelente en la parte técnica, pero mi parte de usabilidad de usuario es ah más o menos. Entonces, yo prefiero siempre consultar con personas que son más expertas que yo en la usabilidad. Si ustedes tienen casos puntuales tanto de validación de de negocios como de validación de empresas en diferentes países con diferentes, o sea, si tienen ejemplos que nos puedan eh dar como el guion, eh nosotros podríamos ir adelantando y consultárselo a alguien que conozca más de usabilidad de usuario para hacerles

**Catalina Giraldo Aguirre:** Eh,

**Victor Ney Orobio Hurtado:** propuestas ya más

**Catalina Giraldo Aguirre:** no, sí,

**Victor Ney Orobio Hurtado:** enfocadas.

**Catalina Giraldo Aguirre:** pues nosotros estamos, yo ya estoy realizando y pues estoy eh ajustes del blueprint que yo le presentaba a José,

**Victor Ney Orobio Hurtado:** Hm.

**Catalina Giraldo Aguirre:** sobre todo para tener en cuenta otros estados y pues que no hay una espera de pues la idea es que no haya una espera Yeah.

### **01:11:58**

**Catalina Giraldo Aguirre:** por ejemplo, 72 horas porque no va a ser una no va a ser una revisión manual y para ver cómo en la experiencia se puede reflejar en Dropby y pues también en los estilos y la y demás.

**Victor Ney Orobio Hurtado:** A,

**Catalina Giraldo Aguirre:** Y con Petiana vamos a estar revisando esta semana ese prototipo que ya estoy realizando para que ustedes lo puedan

**Victor Ney Orobio Hurtado:** porque es que eso eso para nosotros es muy importante porque tengan en cuenta que desde el punto de vista de

**Catalina Giraldo Aguirre:** ver.

**Victor Ney Orobio Hurtado:** nosotros como tecnología, nuestros Los clientes no solamente son o nuestras interacciones no solamente van a ser con Zoomsu o con la base de datos, sino también que nosotros tenemos que garantizar de que esa experiencia que ustedes quieren darle al usuario desde el punto de vista técnico, ¿cómo la cómo la vamos a soportar? Y si tenemos alguna sugerencia al respecto, pues podérselas dar con tiempo.

**Catalina Giraldo Aguirre:** Okay, entonces eh bueno, entonces como pasos a seguir O no sé si José quiere hablar más. Creo que José está acá al lado. Ah.

**Jose Giraldo:** No, no es que todo es A ver, eh, yo entiendo todo lo que comentaba Víctor, todo lo que esto, pero a ver, es que intento, digamos, como poder eh a ver, digamos como eh el KYC lo que va a hacer solamente es validar, digamos, hablo de KYC o quec o KBAR lo que es unas datos personales y datos de la empresa.

### **01:13:35**

**Jose Giraldo:** Pero para la primer versión, digamos, y en este caso yo lo que quiero dejarlo sobresentado ya es que y eso lo que yo digamos como que eh busco tal vez es salgamos con todos los países solamente valiando los datos de la persona que se está registrando. pues hay su formación y eso es lo que vamos primero a validar, ya sea si es digamos como datos personales o datos jurídicos como persona natural o persona eh jurídica, pero pero es eso, es como como eso y cuando se registra la persona validar su identidad,

**Catalina Giraldo Aguirre:** Hola,

**Jose Giraldo:** luego ya miramos los siguientes factos y eso es lo que yo yo que quiera dejar digamos sentado primero eh o sobre la mesa es creo que digamos hemos llegado como a ese punto, pero lo menciono y soy muy reterativo con eso para que podamos hacerlo no no rápido no, sino que vamos salir de unas fases, vamos a ir sacando, digamos, el proyecto a medida que vamos eh trabajando en el crecimiento.

**Diana Aldana:** Listo, José, gracias. No, igual el objetivo esta re era entender más como la viabilidad técnica. Ya nos llevamos todas sus recomendaciones y lo

**Catalina Giraldo Aguirre:** llevo

**Diana Aldana:** adaptamos.

**Victor Ney Orobio Hurtado:** Eh,

**Diana Aldana:** ¿Listo?

**Victor Ney Orobio Hurtado:** otra Так.

### **01:14:58**

**Diana Aldana:** Yeah.

**Victor Ney Orobio Hurtado:** cosita que que de pronto no he visto y no o sea, yo sé que facturación es facturación y y como tal la parte de usuarios, la parte de cuentas de usuarios son dos de los clientes de la validación, pero ¿qué otros clientes tenemos allí en a la vista? O sea, bueno,

**Catalina Giraldo Aguirre:** Eh,

**Victor Ney Orobio Hurtado:** yo no los

**Catalina Giraldo Aguirre:** pendientes. Tenemos datos bancarios,

**Victor Ney Orobio Hurtado:** Ajá.

**Catalina Giraldo Aguirre:** pero en pendiente lo tenemos que retomar después porque estamos sobre todo enfocándonos en estos

**Victor Ney Orobio Hurtado:** Okay.

**Catalina Giraldo Aguirre:** dos.

**Victor Ney Orobio Hurtado:** Ajá.

**Catalina Giraldo Aguirre:** Pero pero hay que revisar como otro flujo más a detalle cómo hacer la parte de validación de altos

**Victor Ney Orobio Hurtado:** O sea,

**Catalina Giraldo Aguirre:** bancarios.

**Victor Ney Orobio Hurtado:** que por ahora solo tendríamos a la vista el flujo de cuando la persona se inscribe, que crea su cuenta, que necesita ser validada su información y cuando la persona inscribe la información para facturación, que son las validaciones de persona o de negocio que necesitan hacer cuando cuando inscribe esa información. Okay, listo.

### **01:16:03**

**Victor Ney Orobio Hurtado:** Ya me queda más claro ahí.

**Catalina Giraldo Aguirre:** Listo, listo. Igual ahí me llevo bastantes puntos,

**Victor Ney Orobio Hurtado:** Gracias.

**Catalina Giraldo Aguirre:** ¿no? Yo no tengo nada más que agregar ahí. igualmente hoy está la idea es que bueno, no sé si Juan les comentó, pero queremos seguir teniendo un seguimiento pues sobre todo de cómo pues de validación en cuanto a tecnología y entendemos que de pronto el espacio de seguimiento es como un poquito complicado de asistir y también por la situación que llevamos ahorita. Entonces, no sé si les parece si establecemos un weekly para seguir hablando y que vamos siguiendo mostrando avances también de ustedes que

**Jose Giraldo:** Yo Digamos, esa parte esa parte, digamos, pues ahí vamos a estar eh conversando un poco de eso porque vamos a cambiar un poco la metodología,

**Catalina Giraldo Aguirre:** nos

**Jose Giraldo:** pero pero igualmente les voy comentando un poco. Listo, pero sí si es como como ir formando y todo, pero vamos a tener, digamos, otro tipo de dinámicas.

**Catalina Giraldo Aguirre:** Ah, dale. Listo. Entonces, pues estoy pendiente entonces si es viable o si es bueno para el equipo que se establezcan estas reuniones o no.

**Jose Giraldo:** Listo.

**Catalina Giraldo Aguirre:** Igual si esta sí fue muy importante.

**Jose Giraldo:** De bueno.

**Catalina Giraldo Aguirre:** Muchas

**Jose Giraldo:** Sí, esto digamos para levantar el proceso,

**Catalina Giraldo Aguirre:** gracias.

**Jose Giraldo:** digamos, inicial, sí, pero yaamos del seguimiento y todo, vamos conversando.

**Catalina Giraldo Aguirre:** Listo, está ahí.

**Jose Giraldo:** Listo.

**Diana Aldana:** Perfecto. Muchas gracias.

**Catalina Giraldo Aguirre:** Vale,

**Victor Ney Orobio Hurtado:** Gracias. que está muy bien.

**Catalina Giraldo Aguirre:** igualmente espero que estemos muy

**Jose Giraldo:** Chao, Víctor.

**Victor Ney Orobio Hurtado:** Sí, señor.

**Jose Giraldo:** Espérame un momentico.

**Victor Ney Orobio Hurtado:** Ok.

### **La transcripción finalizó después de 01:17:39**

*Esta transcripción editable se generó por computadora y puede contener errores. Los usuarios también pueden cambiar el texto después de que se cree.*