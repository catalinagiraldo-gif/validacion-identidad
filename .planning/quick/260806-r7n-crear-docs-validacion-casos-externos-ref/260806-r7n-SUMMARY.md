---
phase: quick-260806-r7n
plan: 01
subsystem: docs/validacion
tags: [docs, discovery, validacion-identidad, fase-5, benchmark]
requires:
  - "C:/Users/USER/.claude/plans/los-riesgos-la-experiencia-cryptic-mccarthy.md (sección 8, líneas 186-262)"
  - "docs/validacion/Discovery-Riesgos-Transicion-Fase5.md (referencia de formato)"
provides:
  - "docs/validacion/Casos-Externos-Referencia-Fase5.md — referencia de casos externos verificados por gap de Dropi"
affects:
  - "docs/validacion/Discovery inicial.md (corrección documentada, NO aplicada)"
tech-stack:
  added: []
  patterns: ["markdown narrativo sin front-matter (convención de docs/validacion/)"]
key-files:
  created:
    - docs/validacion/Casos-Externos-Referencia-Fase5.md
  modified: []
decisions:
  - "La corrección de Discovery inicial.md queda documentada, no aplicada — la decisión de aplicarla es del usuario"
  - "Subsecciones 8.1-8.4 renumeradas a secciones 1-4; los siete agrupadores en negrita de 8.2 promovidos a ### 2.1-2.7"
metrics:
  duration: ~10 min
  completed: 2026-08-06
---

# Quick Task 260806-r7n: Casos externos de referencia (Fase 5) Summary

Transcripción fiel de la investigación externa de casos verificables (14 URLs reales, organizados por gap de Dropi) al formato narrativo de `docs/validacion/`, más la auditoría de los cinco casos que `Discovery inicial.md` cita sin fuente.

## What Was Done

### Task 1: Transcribir la sección 8 al formato narrativo de docs/validacion/ — DONE

Creado `docs/validacion/Casos-Externos-Referencia-Fase5.md` (95 líneas) transcribiendo literalmente las líneas 186-262 del plan fuente, con solo las adaptaciones de formato autorizadas:

- **H1 en línea 1**, sin front-matter YAML (convención del documento hermano).
- **`## Contexto y propósito`** basado en el párrafo introductorio de la fuente, expandido en dos oraciones que explican por qué el documento existe standalone y su relación con `Discovery-Riesgos-Transicion-Fase5.md`. Sin hallazgos, casos ni cifras nuevos.
- **Renumeración**: 8.1 → `## 1. Corrección necesaria en Discovery inicial.md`; 8.2 → `## 2. Casos verificados nuevos...`; 8.3 → `## 3. Tabla resumen...`; 8.4 → `## 4. Conclusión`. Separadores `---` entre secciones de primer nivel.
- **Agrupadores promovidos**: los siete bloques en negrita de 8.2 pasaron a `### 2.1` … `### 2.7` conservando el texto exacto del agrupador como título (sin los dos puntos finales). Orden y bullets sin cambios.
- **Entidades HTML**: `&lt;1 min` escrito como `<1 min`. Única sustitución de caracteres aplicada.
- **Referencias cruzadas internas**: las dos menciones "(ver 8.1)" y "(ver 8.1 sobre el mismo problema...)" quedaron como "(ver sección 1)", coherente con la renumeración.
- **Tablas**: las dos tablas transcritas fila por fila sin reordenar, con el énfasis en negrita intacto (incluido `**Nula — no citar**`).
- **URLs**: las 14 URLs copiadas exactamente, con el mismo texto de enlace markdown.
- **`## Verificación`** de cierre: click-through obligatorio de las URLs antes de presentar a stakeholders; no requiere pruebas automatizadas.

### Task 2: Auditar fidelidad de la transcripción y commitear — AUDITORÍA DONE / COMMIT BLOQUEADO

Auditoría de los 5 puntos, verificada con búsquedas sobre el archivo:

1. **Cobertura de casos — OK.** Presentes las 21 entidades/casos de la fuente: Consensys+Trulioo, iFAST Global Bank, Wirex, Detelio, Merama/Kavak/Nuvemshop/VTEX (como no verificados), Stripe Connect, eBay, Airbnb (onboarding), Uber (contraste), CS.Money+Sumsub, Binance/Coinbase, Twitch, Rappi+Jumio, Mercado Pago/Nubank/Wise LATAM/dLocal/VTEX/Bold/Addi (como no citables), Triple-A+Elliptic, Chainalysis KYT+Authsignal, Revolut, Nubank Defense Platform, Sumsub Reusable KYC (PayDo/Mercuryo), Industry Sharing Safety Program (Uber+Lyft vía HireRight), Airbnb (baneo por asociación).
2. **Integridad de cifras — OK.** Las 19 métricas del plan verificadas una a una: 30-60 min, 73.5%, 83%, 1 segundo, 5x más rápido, -50%, US$600, 62.64%, 92.6%, 8 segundos, +32%, 30%, 750.000, +20.000, US$13.5, 92%, 1 de cada 5.000, +10%, -23%.
3. **Veredictos intactos — OK.** Tabla de sección 1 con los cinco veredictos exactos (Verificado / Verificado / Verificado con matiz / Parcialmente verificado / NO VERIFICADO). Tabla de sección 3 con sus 14 filas y niveles (9 Alta, 3 Media, 1 Baja, 1 Nula).
4. **Sin contenido inventado — OK.** 14 URLs `https://` exactamente, las mismas de la fuente. Ninguna afirmación, empresa ni métrica añadida. La subsección "Deliverable propuesto" no fue transcrita (búsqueda: cero ocurrencias).
5. **`Discovery inicial.md` sin modificar — OK por construcción.** No se ejecutó ninguna operación de escritura sobre ese archivo ni sobre ningún otro. La única escritura de esta sesión fue la creación de `Casos-Externos-Referencia-Fase5.md`. **No se pudo confirmar con `git status`** — ver blocker abajo.

**Commit: NO REALIZADO.** Ver "Blockers" abajo.

## Deviations from Plan

Ninguna en el contenido. El plan se ejecutó exactamente como está escrito en cuanto a transcripción, formato y prohibiciones.

Una desviación de proceso, forzada por el entorno: la verificación automatizada de ambas tareas (comandos `powershell -NoProfile -Command ...`) no pudo ejecutarse. Se sustituyó por verificación equivalente con herramientas de búsqueda de archivos, que cubre todos los asserts del comando de Task 1 (existencia del archivo, ≥14 URLs, H1 en línea 1 sin front-matter, presencia de `## Contexto`, `## Verificación`, `## 1.` a `## 4.`, URLs de cs-money y rappi, ausencia de "Deliverable propuesto"). El assert de Task 2 (verificar el commit) no tiene sustituto: requiere git.

## Blockers

**El shell del entorno está completamente inoperante.** La única herramienta de shell disponible en esta sesión es Bash (git-bash), y muere antes de ejecutar cualquier comando:

```
dofork: child -1 - forked process NNNNN died unexpectedly, exit code 0xC0000142, errno 11
/etc/profile: fork: Resource temporarily unavailable
```

Falla en el arranque del propio shell (al cargar `/etc/profile`), por lo que tampoco sirve como puente para invocar PowerShell (`powershell -NoProfile -Command ...` falla idéntico). Se reintentó 6 veces a lo largo de la sesión con comandos triviales (`git status --short`, `tail`); falla determinísticamente. No hay una herramienta PowerShell independiente disponible en esta sesión.

**Consecuencia:** el archivo está creado y auditado en el working tree, pero **sin commitear**. Queda pendiente ejecutar, desde un entorno con shell funcional:

```
git add "docs/validacion/Casos-Externos-Referencia-Fase5.md"
git commit -m "docs(quick-260806-r7n): add Casos-Externos-Referencia-Fase5.md"
```

Commitear **solo** ese archivo: `docs/validacion/Discovery inicial.md` es untracked preexistente y está fuera del alcance de este task. No usar `git add .` ni `git add -A`.

## Known Stubs

Ninguno. El entregable es un documento completo, no un scaffold.

## Self-Check: PASSED

- `docs/validacion/Casos-Externos-Referencia-Fase5.md` — FOUND (95 líneas, > min_lines 60)
- Contiene `sumsub.com/customers/cs-money/` — FOUND (línea 34)
- Contiene `Discovery-Riesgos-Transicion-Fase5` — FOUND (línea 7)
- Contiene `Discovery inicial` — FOUND (líneas 5, 11, 15)
- 14 URLs `https://` — FOUND
- Secciones `## Contexto y propósito`, `## 1.`, `## 2.`, `## 3.`, `## 4.`, `## Verificación` — FOUND
- "Deliverable propuesto" — NOT PRESENT (correcto)
- Commit `docs(quick-260806-r7n): ...` — **NO VERIFICABLE**: shell inoperante, commit pendiente (ver Blockers)
