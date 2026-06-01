# RPP Hub Onboarding Video - Script de Grabacion

**Duracion objetivo:** 8-10 minutos  
**Audiencia:** Equipo de desarrollo Dropi (disenadores y frontend devs)  
**Tono:** Profesional pero cercano, en espanol  
**Formato:** Screen recording con voiceover  
**Herramienta de grabacion:** Loom o OBS  

---

## [0:00 - 0:30] Intro

**Pantalla:** Pagina de login de dropitesters.co (pantalla completa, browser limpio sin tabs extras)

**Narracion:**

> Bienvenidos al workshop de RPP Hub, el portal de prototipos interactivos de Dropi.
>
> En los proximos minutos vamos a recorrer juntos todo lo que necesitan para empezar a crear prototipos de alta fidelidad usando Claude Code, nuestro design system y el flujo automatizado que ya esta configurado.
>
> Esto no es teoria. Al final de este video van a poder clonar el repo, correr el proyecto y crear su primer prototipo.

**Acciones:**
1. Mostrar la URL `dropitesters.co` en la barra del browser
2. Click en "Iniciar sesion con Google"
3. Seleccionar cuenta de Google del equipo
4. Esperar a que cargue el Hub (pausa de 2 segundos en la pantalla principal)

---

## [0:30 - 1:30] Tour del Hub

**Pantalla:** Hub principal de RPP cargado, mostrando el selector de arquitectura

**Narracion:**

> Esto es el Hub. Lo primero que van a ver es el selector de arquitectura. Tenemos dos opciones: Arquitectura Antigua y Nueva Arquitectura.
>
> La Arquitectura Antigua corresponde a los modulos legacy que todavia estan en produccion. La Nueva Arquitectura es hacia donde estamos migrando y donde vamos a enfocar el trabajo de prototipos.
>
> Seleccionemos Nueva Arquitectura.
>
> Aqui ven la galeria de prototipos. Cada card es un modulo del sistema: Productos, Pedidos, Dashboard, Integraciones, Wallet...
>
> Entremos a Home. Fijense en la barra lateral: esta es la navegacion completa del sistema. Pueden acceder a cualquier modulo desde aqui.
>
> Vamos rapido por algunos modulos para que vean el nivel de fidelidad que estamos buscando.

**Acciones:**
1. Hacer hover sobre "Arquitectura Antigua" (sin click, solo mostrar que existe)
2. Click en "Nueva Arquitectura"
3. Scroll lento por la galeria de prototipos (3 segundos)
4. Click en "Home"
5. Senalar con el cursor la barra lateral de navegacion
6. Click en "Productos" desde el sidebar
7. Pausa 2 segundos en la vista de Productos
8. Click en "Pedidos" desde el sidebar
9. Pausa 2 segundos en la vista de Pedidos
10. Click en "Dashboard" desde el sidebar
11. Pausa 2 segundos en la vista de Dashboard

---

## [1:30 - 3:00] Setup Local

**Pantalla:** Terminal (iTerm2 o terminal integrado de VS Code) con fondo oscuro y fuente de 14px+

**Narracion:**

> Ahora vamos a lo practico. Asi se configura el proyecto en su maquina.
>
> Primero, clonamos el repositorio. El repo se llama rpp-prototipos y esta en nuestra organizacion de GitHub.
>
> (pausa mientras se ejecuta el clone)
>
> Entramos al directorio del proyecto.
>
> Ahora, importante: usamos Node 18. Si tienen nvm instalado, solo ejecutan `nvm use` y el archivo `.nvmrc` del proyecto les configura la version correcta.
>
> Instalamos dependencias con yarn. Esto puede tomar un minuto la primera vez.
>
> (pausa mientras instala)
>
> Y finalmente, levantamos el servidor de desarrollo con `ng serve`.
>
> Cuando vean este mensaje de "Compiled successfully", abran `localhost:4200` en su browser. Deberian ver exactamente lo mismo que vimos en dropitesters.co, pero corriendo local.
>
> Todo lo que modifiquen se va a reflejar en tiempo real gracias al hot reload de Angular.

**Acciones:**
1. Escribir: `git clone git@github.com:producto-rpplab/rpp-prototipos.git`
2. Esperar a que termine el clone
3. Escribir: `cd rpp-prototipos`
4. Escribir: `nvm use`
5. Mostrar el output que confirma Node 18
6. Escribir: `yarn install`
7. Esperar a que termine (puede cortar en edicion)
8. Escribir: `ng serve`
9. Esperar al mensaje "Compiled successfully"
10. Cambiar al browser y abrir `localhost:4200`
11. Mostrar la app corriendo local

---

## [3:00 - 4:30] Entender el Proyecto

**Pantalla:** VS Code o Cursor con el proyecto abierto, panel lateral del explorador visible

**Narracion:**

> Antes de crear prototipos, necesitan entender como esta organizado el proyecto. Les voy a mostrar los archivos clave.
>
> Primero, el archivo mas importante: CLAUDE.md. Este es el archivo que Claude Code lee cada vez que le piden crear un prototipo. Contiene todas las reglas del proyecto: que tokens usar, como nombrar archivos, como estructurar componentes, que convenciones seguir.
>
> Si van a modificar algo del flujo de trabajo, este es el archivo que tocan.
>
> Ahora, navigation-map-new.json. Este archivo define toda la estructura de navegacion de la Nueva Arquitectura. Cada ruta, cada modulo, cada submenu esta mapeado aqui. Claude lo usa para generar la navegacion correcta automaticamente.
>
> Pasemos a la carpeta ds-registry. Aqui vive nuestro Design System tokenizado. Tienen los tokens de color, tipografia, espaciado y los componentes base. Cuando Claude crea un prototipo, consulta estos archivos para usar los valores correctos.
>
> Dentro de src/app/pages/new/ estan las 36 pantallas de la Nueva Arquitectura. Cada carpeta es un modulo, y dentro van a encontrar los componentes de cada vista.
>
> Finalmente, wireframe-prompt-template.md. Este es el template que usamos para pedirle a Claude que cree prototipos. Les va a servir como punto de partida para sus prompts.

**Acciones:**
1. Abrir el explorador de archivos en la raiz del proyecto
2. Click en `CLAUDE.md` - scroll lento mostrando las secciones principales
3. Resaltar con el cursor las reglas mas importantes (tokens, naming)
4. Click en `navigation-map-new.json` - mostrar la estructura del JSON
5. Expandir la carpeta `ds-registry/` - mostrar subcarpetas (tokens, components)
6. Abrir un archivo de tokens como ejemplo (ej: colors)
7. Expandir `src/app/pages/new/` - scroll para mostrar las 36 carpetas
8. Click en `wireframe-prompt-template.md` - mostrar el formato del template

---

## [4:30 - 6:30] Crear un Prototipo con Claude Code

**Pantalla:** Claude Code (terminal o Desktop app) abierto junto al browser

**Narracion:**

> Ahora viene lo bueno. Vamos a crear un prototipo en vivo usando Claude Code.
>
> Abro Claude Code y le escribo un prompt. Fijense en la estructura: le digo que modulo, que vista, para que rol de usuario, y le paso la URL del Figma.
>
> (escribiendo el prompt)
>
> "Crea el prototipo de la vista de Detalle de Producto del modulo Productos para rol dropshipper usando el Figma:" y aqui pego la URL del diseno.
>
> Observen lo que hace Claude. Primero lee CLAUDE.md para entender las reglas del proyecto. Luego extrae el contexto del Figma: componentes, colores, tipografia, espaciado, assets.
>
> Fijense: esta descargando los iconos y assets directamente del Figma. No tenemos que exportar nada manualmente.
>
> Ahora esta creando el componente Angular. Usa los tokens del DS Registry, no valores hardcodeados. La estructura de archivos sigue la convencion del proyecto.
>
> Y el resultado... veamoslo en el browser.
>
> Ahi esta. Un prototipo de alta fidelidad, responsive, con los tokens correctos, la navegacion funcional y los assets del Figma. Todo en una sola interaccion.
>
> Puntos clave de lo que acaba de pasar:
> - Claude descargo los assets automaticamente
> - Uso los tokens del Design System, no colores arbitrarios
> - Creo un layout responsive con los breakpoints correctos
> - La navegacion ya esta conectada al navigation map

**Acciones:**
1. Abrir Claude Code Desktop (o terminal con `claude`)
2. Escribir el prompt lentamente para que se lea en pantalla:
   `Crea el prototipo de la vista Detalle de Producto del modulo Productos para rol dropshipper usando el Figma: [URL del Figma]`
3. Esperar mientras Claude procesa (mostrar que lee CLAUDE.md)
4. Mostrar en la salida de Claude cuando extrae contexto del Figma
5. Mostrar cuando descarga assets
6. Mostrar cuando crea archivos (el output de archivos creados)
7. Cambiar al browser - hacer refresh en localhost:4200
8. Navegar a la nueva vista creada
9. Scroll por el prototipo mostrando la fidelidad
10. Reducir el browser para mostrar responsive
11. Volver al tamano completo

---

## [6:30 - 7:30] Flujo de Trabajo

**Pantalla:** Split screen: editor a la izquierda, browser a la derecha

**Narracion:**

> El flujo de trabajo dia a dia es asi de simple.
>
> Uno: editan el componente en su editor. Guardan. El browser se actualiza automaticamente con hot reload. Iteran hasta que quede bien.
>
> Dos: cuando estan satisfechos, hacen commit y push. Observen los comandos: git add, git commit con un mensaje descriptivo, git push.
>
> Tres: Vercel detecta el push automaticamente y hace deploy. En menos de un minuto, el cambio esta vivo en dropitesters.co.
>
> Verifiquemos... (abre dropitesters.co). Ahi esta, el cambio ya esta en produccion.
>
> Para cambios que necesiten revision, usen Pull Requests. Crean una rama, hacen push, abren el PR en GitHub y piden review. Esto es especialmente importante cuando tocan componentes compartidos o la navegacion.

**Acciones:**
1. Hacer un cambio pequeno en un componente (ej: cambiar un texto)
2. Guardar el archivo (Cmd+S)
3. Mostrar el hot reload en el browser
4. Cambiar a la terminal
5. Escribir: `git add .`
6. Escribir: `git commit -m "feat(productos): actualizar layout detalle producto"`
7. Escribir: `git push`
8. Mostrar el output del push exitoso
9. Esperar unos segundos
10. Abrir dropitesters.co en el browser
11. Navegar al cambio y mostrar que esta live
12. (Opcional) Mostrar brevemente la interfaz de Vercel con el deploy exitoso

---

## [7:30 - 8:30] Metricas y Proximos Pasos

**Pantalla:** Slide o documento con las metricas (puede ser un Google Doc o una pantalla preparada)

**Narracion:**

> Ahora hablemos de como vamos a medir el exito de este flujo.
>
> Tenemos cuatro metricas clave:
>
> Velocidad: cada prototipo deberia tomar menos de 2 horas desde que reciben el Figma hasta que esta deployado. Con Claude Code y el setup que les acabo de mostrar, la mayoria se completan en menos de una hora.
>
> Volumen: el objetivo es producir 5 o mas prototipos por sprint. Eso nos permite cubrir un modulo completo cada dos semanas.
>
> Cobertura: queremos llegar al 80% o mas de los modulos prototipados. Hoy estamos en... (mostrar numero actual). La meta es cerrar la brecha este trimestre.
>
> Fidelidad: cada prototipo debe tener un match de 85% o mas contra el Figma original. Tokens correctos, espaciado consistente, tipografia fiel al diseno.
>
> Para reportar: usamos un template estandar que esta en el repo, en docs/metrics-template. Cada viernes llenan el reporte con los prototipos completados esa semana.
>
> Y hacemos sync semanal los miercoles para revisar prototipos, resolver dudas y alinear prioridades.

**Acciones:**
1. Mostrar en pantalla las 4 metricas (puede ser un slide o documento):
   - Velocidad: < 2h por prototipo
   - Volumen: 5+ por sprint
   - Cobertura: 80%+ de modulos
   - Fidelidad: 85%+ Figma match
2. Senalar cada metrica mientras se menciona
3. Mostrar brevemente el template de reporte de metricas
4. Mostrar el calendario/invitacion del sync semanal (opcional)

---

## [8:30 - 9:00] Cierre

**Pantalla:** Browser mostrando dropitesters.co con la galeria de prototipos

**Narracion:**

> Para cerrar: el repositorio esta listo, el pipeline esta configurado, las herramientas estan ahi.
>
> Tienen Claude Code para generar prototipos a partir del Figma. Tienen el Design System tokenizado para mantener consistencia. Tienen deploy automatico para que todo lo que hagan este visible al instante.
>
> Su mision: explorar, prototipar, iterar. No tengan miedo de experimentar. El flujo esta disenado para que sea rapido equivocarse y rapido corregir.
>
> Si tienen preguntas, me escriben a producto@dropi.co o me buscan por Slack.
>
> Nos vemos en el primer sync. A prototipar.

**Acciones:**
1. Mostrar la galeria de prototipos en dropitesters.co (scroll suave)
2. Pausa de 3 segundos en la pantalla completa
3. Transicion a end card con logo de Dropi (agregar en post-produccion)

---

## Checklist de Grabacion

- [ ] Pantalla limpia (cerrar notificaciones, apps innecesarias, Slack en DND)
- [ ] Resolucion 1920x1080
- [ ] Zoom del browser al 100%
- [ ] Terminal con fuente legible (14px minimo, recomendado 16px)
- [ ] Microfono probado (hacer grabacion de prueba de 10 segundos)
- [ ] Script ensayado 1 vez completo (cronometrar para validar duracion)
- [ ] Tabs del browser preparados en orden:
  - Tab 1: dropitesters.co (pagina de login)
  - Tab 2: dropitesters.co (hub cargado, para mostrar post-login)
  - Tab 3: GitHub del repo
  - Tab 4: Vercel dashboard
  - Tab 5: localhost:4200 (app corriendo local)
- [ ] VS Code/Cursor abierto con el proyecto cargado
- [ ] Claude Code Desktop instalado y configurado
- [ ] Terminal con el proyecto ya clonado y `ng serve` corriendo
- [ ] Figma abierto con el diseno que se va a prototipar en vivo
- [ ] Grabador de pantalla configurado (audio + video + cursor visible)
- [ ] Segundo monitor apagado o extendido (evitar distracciones visuales)

---

## Assets Necesarios para el Video

| Asset | Formato | Uso | Estado |
|-------|---------|-----|--------|
| Logo Dropi | PNG transparente, min 512px | Intro/outro cards | [ ] Listo |
| Captura login page | Screenshot 1920x1080 | Referencia para intro | [ ] Listo |
| Captura prototype gallery | Screenshot 1920x1080 | B-roll si se necesita corte | [ ] Listo |
| Captura Claude Code en accion | Screen recording clip | Backup si la demo en vivo falla | [ ] Listo |
| Captura Vercel deploy success | Screenshot | Mostrar pipeline exitoso | [ ] Listo |
| Figma del modulo a prototipar | URL accesible | Demo en vivo seccion 4:30 | [ ] Listo |
| Template de metricas | Google Doc o screenshot | Seccion 7:30 | [ ] Listo |
| Musica de fondo (opcional) | MP3/WAV, royalty free | Intro/outro, volumen bajo | [ ] Listo |

---

## Post-Produccion

### Edicion obligatoria
1. **Intro card** (3 segundos): Logo Dropi + titulo "RPP Hub: Workshop de Onboarding" + fecha
2. **Zoom digitales**: Aplicar zoom (150-200%) cuando se muestren:
   - Archivos de codigo (CLAUDE.md, navigation-map, tokens)
   - Output de terminal (mensajes de exito/error)
   - Metricas
3. **Subtitulos en espanol**: Todo el voiceover subtitulado (accesibilidad + ruido ambiental)
4. **Timestamps en descripcion**: Copiar las secciones del script como capitulos del video
5. **Outro card** (3 segundos): Logo Dropi + "producto@dropi.co" + "Recursos: github.com/producto-rpplab/rpp-prototipos"

### Edicion opcional
- Transiciones suaves entre secciones (fade de 0.5s)
- Resaltar cursor con circulo amarillo en clicks importantes
- Agregar callouts/flechas para senalar areas especificas
- Musica de fondo en intro/outro (bajar a 0% durante narracion)

### Especificaciones de exportacion
- Resolucion: 1920x1080 (1080p)
- Formato: MP4 (H.264)
- Frame rate: 30fps
- Audio: AAC, 128kbps minimo
- Tamano estimado: 200-400 MB

### Distribucion
1. Subir a Google Drive compartido del equipo (carpeta: RPP Hub / Workshop)
2. Compartir link en el canal de Slack del equipo
3. Agregar link al README del repositorio
4. Opcionalmente subir a Loom para chaptering automatico

---

## Notas para el Narrador

- **Ritmo**: No correr. Pausar 1-2 segundos entre ideas para que el espectador procese.
- **Comandos de terminal**: Leer en voz alta cada comando antes de escribirlo.
- **Errores**: Si algo falla durante la grabacion en vivo, no cortar. Mostrar como se resuelve. Eso es mas valioso que una demo perfecta.
- **Tono**: Como si estuvieras explicandole a un companero nuevo sentado a tu lado. Ni clase universitaria ni tutorial de YouTube hype.
- **Duracion real estimada**: 9 minutos con las pausas naturales. Si pasa de 10, cortar la seccion de metricas a lo esencial.

---

## Plan B (si la demo en vivo falla)

Si Claude Code no responde o hay algun error durante la seccion 4:30-6:30:

1. Tener grabado previamente un clip de respaldo de Claude creando un prototipo
2. Decir: "Les voy a mostrar una grabacion de como se ve el flujo completo"
3. Reproducir el clip de respaldo
4. Continuar con la seccion siguiente normalmente

Si `ng serve` falla o el build tiene errores:

1. Tener la app ya corriendo en otra terminal como backup
2. O mostrar directamente dropitesters.co y decir: "Esto es exactamente lo que veran en local"
