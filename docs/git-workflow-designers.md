# Guía de Git para Product Designers — RPP Pipeline
> Esta guía te lleva paso a paso desde cero. No necesitas saber Git.
> Si algo falla, no te preocupes — Git siempre permite deshacer.

---

## Tabla de contenidos

1. [Instalación inicial (una sola vez)](#1-instalación-inicial-una-sola-vez)
2. [Antes de empezar cada wireframe](#2-antes-de-empezar-cada-wireframe)
3. [Trabajar con Claude Code](#3-trabajar-con-claude-code)
4. [Guardar tu trabajo](#4-guardar-tu-trabajo)
5. [Subir tu trabajo y abrir PR](#5-subir-tu-trabajo-y-abrir-pr)
6. [Ver tu wireframe publicado](#6-ver-tu-wireframe-publicado)
7. [Después de que aprueben tu PR](#7-después-de-que-aprueben-tu-pr)
8. [Glosario](#8-glosario)
9. [Troubleshooting](#9-troubleshooting)
10. [Reglas del repositorio](#10-reglas-del-repositorio)

---

## 1. Instalación inicial (una sola vez)

Esto lo haces UNA sola vez en tu computador. Después nunca más.

### 1.1 Instalar herramientas

Abre la Terminal (Mac: busca "Terminal" en Spotlight).

```bash
# Instalar Homebrew (gestor de paquetes de Mac)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Git
brew install git

# Instalar Node.js via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Cerrar y reabrir Terminal, luego:
nvm install 22.7.0

# Instalar Yarn
npm install -g yarn

# Instalar GitHub CLI
brew install gh

# Instalar Claude Code
npm install -g @anthropic-ai/claude-code
```

### 1.2 Configurar tu identidad en Git

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@dropi.co"
```

### 1.3 Autenticarte en GitHub

```bash
gh auth login
```

Te va a preguntar:
- "What account?" → **GitHub.com**
- "Preferred protocol?" → **HTTPS**
- "Authenticate?" → **Login with a web browser**
- Se abre el navegador, autorizas, listo.

### 1.4 Clonar el repositorio (descargar el proyecto)

```bash
# Ir a tu carpeta de proyectos (o donde quieras tenerlo)
cd ~/Documents

# Clonar (descargar) el repositorio
gh repo clone dropi/dropi-prototypes

# Entrar al proyecto
cd dropi-prototypes

# Instalar dependencias
nvm use
yarn install
```

Ahora tienes el proyecto en tu computador. **Nunca más necesitas hacer este paso.**

### 1.5 Verificar que funciona

```bash
yarn start
```

Abre http://localhost:4200 en tu navegador. Deberías ver la pantalla de login de Dropi.
Presiona `Ctrl + C` en la terminal para detener el servidor cuando quieras.

---

## 2. Antes de empezar cada wireframe

Cada vez que vas a crear un wireframe nuevo, haz esto primero:

```bash
# 1. Ir al proyecto
cd ~/Documents/dropi-prototypes

# 2. Ir a la rama principal
git checkout main

# 3. Traer los últimos cambios del equipo
git pull

# 4. Instalar dependencias nuevas (por si alguien agregó algo)
yarn install

# 5. Crear tu rama de trabajo
git checkout -b feat/DROP-XXXX-nombre-de-tu-vista
```

### Cómo nombrar tu rama

El formato es: `feat/DROP-[número del ticket]-[nombre corto]`

Ejemplos:
- `feat/DROP-9300-listado-garantias`
- `feat/DROP-9301-wallet-dropshipper`
- `feat/DROP-9400-reportes-ventas`

> **Importante:** Cada wireframe va en su propia rama. Nunca trabajes en `main` directamente.

---

## 3. Trabajar con Claude Code

### 3.1 Abrir Claude Code

```bash
# Asegúrate de estar en la carpeta del proyecto
cd ~/Documents/dropi-prototypes

# Abrir Claude Code
claude
```

### 3.2 Darle el prompt

Copia la plantilla de `docs/wireframe-prompt-template.md`, llénala con los datos de tu wireframe, y pégala en Claude Code.

Ejemplo:

```
Genera un wireframe interactivo para la siguiente vista:

### Vista
- Nombre: Listado de garantías
- Módulo: garantias > activas
- Rol de usuario: proveedor

### Figma
- URL: https://www.figma.com/design/XXXXX/Garantias?node-id=1234-5678

### Tipo de vista
- [x] Página completa (page)

### Datos mock
- Entidad principal: garantías
- Cantidad mínima de items: 20+
- Propiedades: id, producto, cliente, fecha, estado, motivo

### Interacciones clave
- Tabla con filtros por estado
- Click en fila abre detalle
```

### 3.3 Ver tu wireframe mientras trabajas

En otra pestaña de terminal (Cmd + T):

```bash
cd ~/Documents/dropi-prototypes
yarn start
```

Abre http://localhost:4200 y navega a tu vista. Cada vez que Claude Code haga cambios, el navegador se actualiza automáticamente.

---

## 4. Guardar tu trabajo

Cuando Claude Code termine o cuando quieras guardar un avance:

### 4.1 Ver qué cambió

```bash
git status
```

Esto te muestra en rojo los archivos que cambiaron. Algo como:

```
modified:   navigation-map.json
modified:   mocks/products.json
new file:   src/app/pages/garantias/garantias.component.ts
new file:   src/app/pages/garantias/garantias.component.html
new file:   src/app/pages/garantias/garantias.component.scss
```

### 4.2 Agregar los archivos

```bash
# Agregar todos los archivos que cambiaron
git add .
```

### 4.3 Hacer commit (guardar con mensaje)

```bash
git commit -m "feat: add listado de garantías wireframe from DROP-9300"
```

El mensaje debe decir qué hiciste. Formato: `feat: add [nombre de la vista] wireframe from [ticket]`

> **Puedes hacer múltiples commits.** Cada vez que tengas un avance significativo, guarda. No esperes a tener todo perfecto.

---

## 5. Subir tu trabajo y abrir PR

### 5.1 Subir tu rama a GitHub

```bash
git push -u origin feat/DROP-XXXX-nombre-de-tu-vista
```

La primera vez te pide `-u origin [nombre]`. Las siguientes veces solo:

```bash
git push
```

### 5.2 Abrir el Pull Request

```bash
gh pr create --title "feat: wireframe listado garantías (DROP-9300)" --body "## Summary
- Wireframe del listado de garantías para rol proveedor
- 20 items en mock data
- Filtros por estado, búsqueda, acciones por fila

## Figma
https://www.figma.com/design/XXXXX/Garantias?node-id=1234-5678

## Preview
Login como proveedor para ver la vista en Garantías > Activas"
```

Esto crea el PR en GitHub y te da un link. Cópialo y compártelo en Slack.

### 5.3 Qué pasa después

1. **GitHub Actions** valida automáticamente:
   - Que el proyecto compila sin errores
   - Que actualizaste `navigation-map.json`
   - Que no tocaste archivos protegidos (sidebar, DS Registry, etc.)

2. **Vercel** genera automáticamente un preview:
   - Un bot comenta en tu PR con el link
   - Ejemplo: `https://dropi-prototypes-git-feat-drop-9300.vercel.app`
   - Cualquier persona del equipo puede ver tu wireframe desde ese link

3. **Michel o el UX lead** revisa el PR:
   - Si está bien → lo aprueba y hace merge
   - Si necesita ajustes → te deja comentarios

---

## 6. Ver tu wireframe publicado

### Preview (mientras el PR está abierto)

Vercel genera un link por cada PR. Lo encuentras en:
- El comentario automático del bot en tu PR
- O en la sección "Deployments" de tu PR en GitHub

### Producción (después del merge)

Cuando tu PR se mergea a `main`, el wireframe se publica en:

```
https://dropi-prototypes.vercel.app
```

Todos los wireframes del equipo viven ahí.

---

## 7. Después de que aprueben tu PR

Una vez que tu PR fue mergeado, limpia tu espacio:

```bash
# Volver a main
git checkout main

# Traer los cambios (incluye tu merge)
git pull

# Eliminar tu rama local (ya no la necesitas)
git branch -d feat/DROP-XXXX-nombre-de-tu-vista
```

Listo. Ahora puedes empezar otro wireframe volviendo al [Paso 2](#2-antes-de-empezar-cada-wireframe).

---

## 8. Glosario

| Término | Qué significa |
|---|---|
| **Repositorio (repo)** | La carpeta del proyecto con todo su historial de cambios |
| **Clonar** | Descargar el repositorio a tu computador (una sola vez) |
| **Branch (rama)** | Una copia paralela del proyecto donde trabajas sin afectar a los demás |
| **main** | La rama principal. Siempre tiene la versión estable y publicada |
| **Commit** | Un punto de guardado con mensaje. Como "Ctrl+S" pero con descripción |
| **Push** | Subir tus commits de tu computador a GitHub |
| **Pull** | Traer los últimos cambios de GitHub a tu computador |
| **Pull Request (PR)** | Una solicitud para que tus cambios se integren a main. Incluye review |
| **Merge** | Integrar los cambios de tu rama a main (lo hace el reviewer) |
| **Preview URL** | Un link temporal que Vercel genera para ver tu wireframe sin instalar nada |
| **GitHub Actions** | Robots que validan tu código automáticamente cuando abres un PR |

---

## 9. Troubleshooting

### "No tengo permisos para pushear"

```bash
gh auth login
# Re-autentícate y vuelve a intentar
```

### "Mis cambios chocan con los de alguien más" (conflicto)

```bash
# Traer los últimos cambios de main a tu rama
git pull origin main
```

Si hay conflictos, Claude Code puede ayudarte:
```
Tengo conflictos de merge en [archivo]. Ayúdame a resolverlos.
```

### "Quiero deshacer todo lo que hice y empezar de nuevo"

```bash
# Descartar todos los cambios no guardados
git checkout .

# Volver a main limpio
git checkout main
git pull
```

### "El servidor no arranca"

```bash
nvm use
yarn install
yarn start
```

### "No sé en qué rama estoy"

```bash
git branch
```

La rama activa tiene un `*` al lado. Si no estás en la correcta:

```bash
git checkout feat/DROP-XXXX-tu-rama
```

### "Quiero ver los wireframes de otro designer"

```bash
git fetch
git checkout feat/DROP-XXXX-su-rama
yarn start
# Abre localhost:4200
```

Para volver a tu trabajo:

```bash
git checkout feat/DROP-XXXX-tu-rama
```

---

## 10. Reglas del repositorio

### Lo que SÍ puedes modificar en tu PR

- `src/app/pages/[tu-modulo]/` — tu componente nuevo
- `src/app/app.routes.ts` — agregar tu ruta
- `mocks/` — agregar o modificar mock data
- `src/assets/images/[tu-modulo]/` — imágenes del wireframe
- `navigation-map.json` — actualizar el campo `prototype` de tu vista

### Lo que NO puedes modificar

- `src/app/layout/` — sidebar y header (solo Michel)
- `src/app/config/` — configuración del sidebar (solo Michel)
- `ds-registry/` — specs del Design System (solo Michel)
- `CLAUDE.md` — reglas del pipeline (solo Michel)
- `src/styles/_variables.scss` — tokens (solo Michel)

Si necesitas un cambio en archivos protegidos, habla con Michel primero.

### Convenciones de commit

```
feat: add [nombre vista] wireframe from [ticket]
fix: ajustar [qué] en [vista] per review feedback
```

### Convenciones de branch

```
feat/DROP-[número]-[nombre-corto-en-kebab-case]
```

---

## Resumen visual del flujo

```
┌─────────────────────────────────────────────────┐
│  1. git pull                   (traer últimos)  │
│  2. git checkout -b feat/...   (crear rama)     │
│  3. claude                     (abrir Claude)   │
│  4. [pegar prompt template]    (generar)        │
│  5. yarn start                 (ver local)      │
│  6. git add . && git commit    (guardar)        │
│  7. git push                   (subir)          │
│  8. gh pr create               (abrir PR)       │
│  9. [Vercel genera preview]    (automático)     │
│ 10. [Review + merge]           (Michel)         │
│ 11. git checkout main && pull  (limpiar)        │
└─────────────────────────────────────────────────┘
```
