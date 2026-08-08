---
name: archivar-reel
description: >-
  Use al terminar un reel (estado "listo") o cuando Quito pida "archiva este reel", "súbelo a Drive y bórralo", "documenta este video / reel", "libera espacio del out". Archiva la versión final + el footage original en Google Drive (vía rclone), libera disco, y deja un registro ejecutivo del video en el segundo cerebro (área RedSocialBot del vault): resumen, guion, receta de edición y métricas. La invoca/sugiere reel-editor al cerrar un reel. NO la uses para editar (eso es reel-editor) ni para documentar la sesión de trabajo (eso es documentar-avance).
argument-hint: "[slug o archivo del reel, opcional]"
allowed-tools:
---

# Archivar un reel — Drive + registro en el segundo cerebro

Cuando un reel queda listo, esta skill hace tres cosas en orden: **archiva** el
resultado en Google Drive y libera disco, **documenta** el video en el segundo
cerebro como registro permanente, y **actualiza** la memoria del proyecto.

**Por qué existe:** editar deja basura pesada (cada versión ~50 MB, el footage
~180 MB) y el conocimiento del video (guion, ángulo, receta) se pierde si no queda
escrito. Esto es el cierre del flujo de `reel-editor`.

**Regla de oro (borrado seguro):** nunca borres un archivo local antes de
**verificar** que está en Drive. La final y el footage se borran **solo con OK
explícito** de Quito; las versiones intermedias se borran automáticamente tras
verificar.

## Convenciones

- **Vault:** `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}`.
- **Registro:** `20-LLM/raw/redsocialbot/videos/` (una nota por reel + `README.md` índice).
- **Drive:** remote `gdrive:` (rclone, ya autenticado). Destino:
  `gdrive:RedSocialBot/reels/<slug>/` → `<slug>-final.mp4` + `<slug>-footage.mp4`.
- **Plantilla de la nota:** `references/plantilla-nota.md`.
- **Chileno (tuteo):** redacta en chileno, jamás voseo argentino.

## Proceso

### 1. Identificar el reel y reunir material (sin inventar)
- **Slug:** del argumento, o pregunta. Ej. `reel1`, `ia-ordena-vida`.
- **Final + intermedias:** lista `out/<slug>*.mp4` (y stills `out/*.png`). **No
  asumas cuál es la final** — si hay varias versiones, **pregunta a Quito cuál es la
  que conservamos** (es destructivo). Confírmalo siempre antes de borrar.
- **Footage:** `footage/<archivo>.mp4` (la fuente).
- **Guion:** busca en el vault `20-LLM/raw/redsocialbot/*<tema>*.md` (`type: guion`).
- **Transcript / cortes:** `transcripts/<slug>.json`, `edit/` (takes), si existen.
- **Receta de edición:** versiones creadas (de `out/` + `project.md`), captions
  (motor), motion graphics/escenas (`src/scenes/`, `src/components/`), tema/acento
  (`src/theme.ts`).
- Pregunta solo lo que falte y no esté en el material: **ángulo, pilar (de los 4),
  plataformas, duración real, estado** (listo / publicado).

### 2. Archivar en Drive (rclone)
Sube con nombres explícitos y verifica antes de tocar nada local:
```bash
SLUG=<slug>
DRIVE="gdrive:RedSocialBot/reels/$SLUG"
rclone copyto "out/<FINAL>.mp4"        "$DRIVE/$SLUG-final.mp4"   --progress
rclone copyto "footage/<FOOTAGE>.mp4"  "$DRIVE/$SLUG-footage.mp4" --progress
# Verificar (rclone valida hash en copyto; además confirmamos a la vista):
rclone lsf --format "sp" "$DRIVE/"
# Link de compartir para la nota:
rclone link "$DRIVE/$SLUG-final.mp4"
```
Si algún `copyto` falla (exit ≠ 0) **detente**: no borres nada y reporta.

### 3. Documentar en el segundo cerebro
- Crea/asegura `…/redsocialbot/videos/`.
- Escribe `videos/<AAAA-MM-DD>-<slug>.md` desde `references/plantilla-nota.md`,
  rellenando todo con el material real (resumen ejecutivo, guion, hook & CTA, receta
  de edición, links de Drive). Métricas quedan como placeholder a llenar tras publicar.
- Actualiza/crea el índice `videos/README.md` (agrega la fila del reel a la tabla).
- **Verifica el reflejo:** `test -f "$VIDEOS/<AAAA-MM-DD>-<slug>.md"` y reporta
  "reflejado ✓". Si el vault no es accesible, no falles: deja el registro pendiente y
  avisa (igual que el fallback de `documentar-avance`).

### 4. Liberar disco (con la regla de oro)
- **Intermedias** (`out/<slug>-v*.mp4` que no son la final) y stills sueltos
  asociados: bórralos **automáticamente** tras verificar la subida. Si los stills
  tienen nombres ambiguos (no prefijados por slug), **lístalos y confirma** antes.
- **Final + footage:** muestra el espacio que se liberaría y **pide OK explícito** a
  Quito antes de borrarlos del disco. Quedan respaldados en Drive.

### 5. Actualizar memoria del proyecto
- En `project.md`, sección "Reels en curso": marca el reel como `archivado`, agrega
  el link de Drive y la ruta de la nota del vault. Si ya no está "en curso", muévelo
  a una línea de archivados.

### 6. Reportar
3-4 líneas: qué se subió y dónde (Drive), nota creada (ruta del vault), espacio
liberado (MB), y qué quedó pendiente (ej. métricas, OK de borrado de final/footage).

## Reglas (no negociables)
- **Verificar antes de borrar.** Nunca `rm` sin confirmar que está en Drive.
- **Final/footage solo con OK.** Intermedias auto; lo irrecuperable se confirma.
- **No inventes** datos del video (ángulo, métricas, decisiones que no ocurrieron).
- **Una sola fuente del registro:** una nota por reel en `videos/`, sin duplicados.
- **Fecha real** del sistema (`AAAA-MM-DD`).
- **No subas** las versiones intermedias a Drive: solo final + footage.
