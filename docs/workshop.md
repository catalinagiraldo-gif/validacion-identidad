# Workshop RPP — Cómo crear prototipos con Claude Code y GitHub

> **Estado:** DRAFT — pulir antes de ejecutar.
> **Duración objetivo:** 60–75 min.
> **Audiencia:** Product Designers de Dropi (sin experiencia previa en git).
> **Objetivo:** al terminar el workshop, cada designer habrá creado su primer prototipo, lo habrá subido a GitHub vía PR, y lo verá publicado en el dominio privado de RPP.

---

## 0. Contexto previo (para Michel al preparar)

Este workshop es el entregable de **DROP-22787 — Capacitaciones / workshop Product Design** (Fase 3 de la épica DROP-21034).

Depende de que estén listos antes del día del workshop:
- [ ] DROP-22784 Hub desplegado en el dominio definitivo con login corporativo
- [ ] `yarn nuevo-prototipo` funcionando
- [ ] GitHub Actions validando + creando PRs automáticos
- [ ] `docs/git-workflow-designers.md` actualizado con el flujo final
- [ ] Loom de 10 min grabado por Michel con el flujo end-to-end
- [ ] Confluence page de referencia creada

---

## 1. Pre-requisitos que los asistentes deben traer

Enviar este checklist **3 días antes** del workshop:

- [ ] MacBook con permisos de admin (para instalar apps y herramientas)
- [ ] Email corporativo `@dropi.co` activo
- [ ] Cuenta de GitHub creada con email `@dropi.co`
- [ ] Invitación aceptada al repo `producto-rpplab/dropi-prototypes`
- [ ] Setup de máquina completado (ver sección 1.1 abajo)
- [ ] Un ticket de Jira asignado con nombre + módulo + link de Figma listos

> **Nota:** Claude Code maneja todos los comandos git por el diseñador. No necesitan aprender git — solo decirle a Claude "Subir PR a git" cuando estén listos.

---

### 1.1 Guía de setup por diseñador (una sola vez)

Michel ejecuta estos pasos con cada diseñador antes del workshop. Tiempo estimado: ~20 min.

#### Paso 1 — Instalar Claude Code Desktop

1. Ir a https://claude.ai/download
2. Descargar la versión para Mac
3. Instalar arrastrando a Aplicaciones
4. Abrir Claude Code Desktop y loguearse con la cuenta del equipo

> **Verificación:** abrir Claude Code Desktop y confirmar que responde a un mensaje de prueba.

#### Paso 2 — Instalar Node.js

Node.js es necesario para que Claude Code pueda correr el servidor de desarrollo y previsualizar los prototipos en el navegador.

1. Abrir Terminal (Cmd + Espacio → escribir "Terminal")
2. Copiar y pegar este comando:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

3. Cerrar Terminal y volver a abrirla
4. Copiar y pegar:

```bash
nvm install 22 && nvm use 22
```

> **Verificación:** escribir `node --version` en Terminal. Debe mostrar `v22.x.x`.

#### Paso 3 — Instalar Yarn

Yarn es el gestor de dependencias del proyecto. Claude Code lo usa para instalar librerías y arrancar el servidor.

```bash
npm install -g yarn
```

> **Verificación:** escribir `yarn --version`. Debe mostrar `1.22.x`.

#### Paso 4 — Instalar GitHub CLI y autenticarse

GitHub CLI permite que Claude Code suba código y cree Pull Requests por el diseñador. La autenticación se hace una sola vez — después la máquina recuerda la sesión.

```bash
brew install gh
```

Si no tiene Homebrew instalado, primero correr:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Luego autenticarse con GitHub:

```bash
gh auth login
```

Seguir el wizard interactivo:
- Elegir **GitHub.com**
- Elegir **HTTPS**
- Elegir **Login with a web browser**
- Se abre el navegador → autorizar con la cuenta GitHub del diseñador

> **Verificación:** escribir `gh auth status`. Debe mostrar "Logged in to github.com as [usuario]".

#### Paso 5 — Clonar el repositorio

Este paso descarga todos los archivos del proyecto a la máquina del diseñador.

```bash
cd ~ && gh repo clone producto-rpplab/dropi-prototypes
```

#### Paso 6 — Instalar dependencias del proyecto

```bash
cd ~/dropi-prototypes && yarn install
```

Esto toma 2-3 minutos. Instala Angular, PrimeNG, y todas las librerías que usan los prototipos.

> **Verificación:** escribir `yarn start` y abrir http://localhost:4200 en el navegador. Debe verse la app de prototipos.

#### Resumen del setup

| Paso | Qué se instala | Para qué sirve | Se hace... |
|---|---|---|---|
| 1 | Claude Code Desktop | Crear prototipos con IA | Una vez |
| 2 | Node.js (via nvm) | Correr el servidor de desarrollo local | Una vez |
| 3 | Yarn | Instalar dependencias del proyecto | Una vez |
| 4 | GitHub CLI + auth | Subir código y crear PRs desde Claude Code | Una vez |
| 5 | Clonar repo | Tener los archivos del proyecto en la máquina | Una vez |
| 6 | `yarn install` | Instalar librerías del proyecto | Una vez (y si cambian deps) |

#### Flujo diario después del setup

El diseñador solo necesita:

1. Abrir Claude Code Desktop en la carpeta `~/dropi-prototypes`
2. Decirle: **"Hazme el prototipo de DROP-XXXX"** (con el link de Figma)
3. Claude genera todo el código y lo muestra en localhost
4. El diseñador revisa que se vea como el Figma
5. Decirle: **"Subir PR a git"**
6. Claude hace commit, push, y crea el PR automáticamente
7. Michel recibe notificación, revisa y mergea → prototipo publicado

---

## 2. Agenda

| Tiempo | Bloque | Formato |
|---|---|---|
| 0:00 – 0:05 | Bienvenida + objetivo del workshop | Slide |
| 0:05 – 0:15 | **Por qué existe RPP** — problema del retrabajo design-dev, visión del Hub | Slide + demo Hub en vivo |
| 0:15 – 0:25 | **Demo completa end-to-end** — Michel crea un prototipo de 0 a dominio | Pantalla compartida |
| 0:25 – 0:30 | Preguntas rápidas + aclaraciones | Q&A |
| 0:30 – 1:00 | **Hands-on** — cada designer crea su primer prototipo | Ejercicio guiado |
| 1:00 – 1:10 | Review en vivo de los PRs creados + merge de uno | Demostración |
| 1:10 – 1:15 | Cierre + próximos pasos + canal de soporte | Slide |

---

## 3. Slide deck — puntos clave

### Slide 1 — Por qué RPP

- ~30% del retrabajo de sprint viene del gap design-dev
- Tickets que llegan a dev con ambigüedad → preguntas, idas y vueltas, retrabajo
- RPP reduce el gap: el ticket llega con un prototipo interactivo navegable

### Slide 2 — Qué es el Hub

- Un dominio privado `[TODO dominio]` con login por email `@dropi.co`
- Todos los prototipos conviven en un solo lugar
- Home = grid de cards sort by date added descendente
- Badge "Nuevo" en los últimos agregados
- Audiencia: designers, devs, PMs, sponsors, mesas ejecutivas

### Slide 3 — Tu rol como designer

- Tú tomas el ticket, el Figma, y le das el contexto a Claude Code
- Claude Code crea el prototipo siguiendo las reglas del repo (DS Registry + Wireframe Protocol)
- Tú validas en localhost que se vea como el Figma
- Le dices a Claude **"Subir PR a git"** — Claude hace todo: commit, push, crea el PR
- GitHub Actions valida automáticamente
- Michel hace merge → prototipo queda publicado en el Hub

### Slide 4 — Qué NO tienes que hacer

- **NO** tienes que saber git profundo. Los comandos que vas a usar están en `docs/git-workflow-designers.md` como recetas copy-paste
- **NO** tienes que editar rutas de Angular, registry, ni estructura del repo — todo eso lo hace la CI
- **NO** tienes que saber Angular. Claude Code escribe todo el código
- **NO** tienes que subir thumbnails manualmente — CI los captura
- **SÍ** tienes que revisar que el prototipo que Claude Code generó se ve como el Figma

---

## 4. Demo en vivo — script para Michel

> Tiempo objetivo: 10 min. Usar un ticket real simple (ej. un listado nuevo).

1. Abrir Claude Code Desktop en la carpeta `~/dropi-prototypes`
2. Decirle a Claude: **"Actualiza el repo a la última versión"** → Claude hace `git checkout main && git pull`
3. Decirle: **"Hazme el prototipo de DROP-XXXX"** con el link de Figma → mostrar cómo Claude pide el contexto y genera el código
4. Dejar que Claude corra `yarn nuevo-prototipo` → mostrar la carpeta creada
5. Dejar que Claude genere el componente → abrir `localhost:4200` y comparar con Figma
6. Decirle: **"Subir PR a git"** → Claude hace commit + push + crea el PR automáticamente
7. Abrir GitHub en el navegador → mostrar el PR creado con título y descripción
8. Mostrar la corrida de GitHub Actions: validación de meta.json, build, thumbnail auto-generado
9. Mergear el PR (simulando el rol de Michel)
10. Esperar deploy Vercel (~2 min)
11. Abrir el dominio de producción → mostrar el card nuevo en el Hub con badge "Nuevo"

> **Tip para el demo:** tener abierta la pestaña de GitHub Actions en paralelo para mostrar los checks pasando. Genera confianza.

---

## 5. Ejercicio hands-on — 30 min

### Setup previo (5 min)

Cada designer:
1. Verifica que `yarn start` abre `localhost:4200` correctamente
2. Verifica que puede hacer login con su email `@dropi.co`
3. Tiene su ticket + Figma URL listos

### Crear prototipo (20 min)

1. Abrir Claude Code Desktop en `~/dropi-prototypes`
2. Decirle a Claude: **"Hazme el prototipo de DROP-XXXX"** con el link de Figma
3. Dejar que Claude genere — **mientras tanto**, abrir el Figma y comparar
4. Si algo no matchea el diseño, decirle a Claude qué ajustar
5. Cuando esté listo, decirle: **"Subir PR a git"**

### Verificar PR + merge (5 min)

1. Abrir GitHub en el navegador → buscar el PR que Claude creó
2. Esperar checks de CI (validación de schema + build)
3. Compartir link del PR en el chat del workshop
4. Michel mergea 1 o 2 en vivo como ejemplo

### Checkpoint de aprendizaje

Al final del hands-on, cada designer debe poder responder:
- ¿En qué branch estoy ahora mismo?
- ¿Qué pasa si mi CI falla?
- ¿Cómo veo mi prototipo en producción después del merge?

---

## 6. Reglas del repositorio (recordatorio visible durante el workshop)

Del `CLAUDE.md` del repo, copiar en un slide:

**Lo que SÍ puedes modificar:**
- `src/app/prototypes/<module>/<tu-slug>/` — tu carpeta de prototipo
- `mocks/` — agregar o modificar mock data
- `src/assets/images/<module>/` — imágenes descargadas de Figma
- `navigation-map.json` — actualizar el campo `prototype` de tu vista

**Lo que NO puedes modificar (sin avisar a Michel):**
- `src/app/layout/` — sidebar y header
- `src/app/config/` — configuración del sidebar
- `ds-registry/` — specs del Design System
- `CLAUDE.md` — reglas del pipeline
- `src/styles/_variables.scss` — tokens
- `prototypes.registry.ts` — no lo edites, es autogenerado por CI
- `app.routes.ts` — no lo edites, es autogenerado por CI

---

## 7. Soporte post-workshop

- **Canal de Slack dedicado:** `#rpp-soporte` [TODO crear canal]
- **Documentación viva:** `docs/` dentro del repo
- **Office hours:** [TODO acordar con Michel — 1h semanal las primeras 4 semanas]
- **Confluence:** [TODO link a página de Confluence con índice]

---

## 8. TODOs para Michel antes de ejecutar este workshop

- [ ] Confirmar dominio final y login funcionando
- [ ] Grabar Loom de 10 min con el flujo end-to-end
- [ ] Crear canal Slack `#rpp-soporte`
- [ ] Crear Confluence page de referencia en espacio de Producto
- [ ] Preparar 2–3 tickets "de ensayo" con Figma listo para los asistentes que no traigan uno
- [ ] Probar el flujo completo con 1 designer en privado antes del workshop grupal
- [ ] Definir cómo se reciben las invitaciones al repo (¿por email manual? ¿GitHub org?)
- [ ] Coordinar fecha con Product Design lead
- [ ] Preparar slides reales a partir de sección 3
- [ ] Decidir si el workshop es en vivo + grabado, o solo grabado como async onboarding

---

## 9. Decisiones pendientes que afectan este workshop

Del memory `project_rpp_hub_architecture.md` — mientras no estén resueltas, este workshop no puede ejecutarse en producción:

1. ~~Mecanismo de login corporativo~~ → Google SSO restringido a `@dropi.co` ✅
2. Dominio final (prototipos.dropi.co vs rpp.dropi.co vs vercel.app) ❌
3. ~~Filtros del Hub~~ → sort by date + barra de búsqueda ✅
4. ~~Chrome del Hub~~ → layout Dropi (sidebar 250px + header 70px) ✅
5. ~~Cliente git default~~ → Claude Code maneja git directo; setup de máquina documentado en sección 1.1 ✅
6. PR auto-creado (automático vs manual) ❌
