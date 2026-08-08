---
name: learning
description: Use cuando Quito diga "aprende de esto", "learning", "guarda lo que aprendiste", "nutre tus habilidades", o al cerrar una sesión de trabajo en la que dio feedback, correcciones o mostró preferencias que convenga recordar para la próxima. Destila el feedback de la sesión en LECCIONES accionables y las anexa (dedup/merge) a la nota de aprendizajes de la capacidad relevante en el segundo cerebro (Obsidian). Enriquece skills/agentes con el tiempo para NO re-aprender lo mismo. NO edita videos (eso es reel-editor) ni documenta el video (eso es archivar-reel).
argument-hint: "[capacidad/tema, opcional — ej. 'edicion']"
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
---

# learning — enriquecer habilidades con lo aprendido

Esta skill convierte el feedback de una sesión en **lecciones permanentes** que la
próxima vez ya están cargadas. Objetivo: que Quito no tenga que re-explicar sus
gustos/correcciones. Nutre la **fuente de verdad en Obsidian**; las skills/agentes de
esa capacidad la leen antes de trabajar.

## Dónde viven las lecciones (Obsidian = segundo cerebro)
- **Vault:** `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}`.
- **Ruta por capacidad** (`20-LLM/raw/redsocialbot/aprendizajes-<tema>.md`):
  - `edicion` → `aprendizajes-edicion.md` (edición de reels — la lee el agente/skill `reel-editor`).
  - otras capacidades → `aprendizajes-<tema>.md` (créala si no existe, mismo formato).
- **Puntero in-repo:** `reel-editor` y su agente apuntan a esta nota; si agregas otra
  capacidad, deja un puntero equivalente en la skill/agente que la consuma.
- **Fallback:** si el vault no es accesible, NO falles — escribe las lecciones a
  `out/aprendizajes-<tema>.pendiente.md` en el repo y avisa que quedó pendiente de reflejar.

## Proceso
1. **Identificar la capacidad.** Del argumento, o infiérela de la sesión (edición de
   reel → `edicion`). Si es ambiguo, pregunta en una línea.
2. **Leer la nota existente** (`aprendizajes-<tema>.md`). Es la base a enriquecer, no a
   reemplazar.
3. **Destilar SOLO lo nuevo/refinado.** Recorré el feedback real de la sesión (mensajes
   de Quito, correcciones, lo que elogió, lo que falló y cómo se arregló). Para cada
   lección: **regla accionable + 1 línea de por qué/contexto**, y cita textual de Quito
   cuando sea punchy (español chileno con tildes correctas). Descarta lo que ya está
   dicho; si una lección existente quedó más precisa, **actualízala** en su lugar (no
   dupliques).
4. **Merge, no append ciego.** Mantené los mismos encabezados/secciones de la nota.
   Agregá viñetas nuevas bajo su sección; refiná las existentes. La nota debe quedar
   apretada y sin redundancia (es lo que se carga al trabajar, cada línea cuesta).
5. **Actualizá la fecha** (`actualizado`/frontmatter) con la fecha real del sistema.
6. **Verificá el reflejo** (`test -f` la nota) y reportá 2-3 líneas: qué lecciones nuevas
   entraron, cuáles se refinaron, y la ruta de la nota.

## Reglas
- **Accionable > anecdótico.** Cada lección debe cambiar cómo se edita la próxima vez.
- **No inventes preferencias** que Quito no expresó. Si dudás, no la agregues.
- **Una sola nota por capacidad**, sin duplicados. Es craft-knowledge (cómo hacer), NO
  el registro del video (eso es `archivar-reel` → `videos/`).
- **Chileno (tuteo)**, jamás voseo argentino.
- **Fecha real** del sistema.

## Cierre
Tras nutrir la nota, si la sesión fue de edición, recordá que el agente/skill
`reel-editor` ya la va a leer la próxima. Si además el reel quedó listo, sugerí correr
`archivar-reel` (si no se hizo).
