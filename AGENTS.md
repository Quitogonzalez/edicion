# edicion — infra de edición de reels verticales

Producir reels 9:16 (1080×1920, 30fps, H.264) para Instagram y TikTok dirigiendo
a Claude: corte por transcript, LUT, captions karaoke, motion graphics, render.
Quito dirige, Claude ejecuta.

**Estado real, medido el 2026-08-08:** funciona y se usó en producción — tres
reels terminados y archivados en Drive. Pero **el repo está congelado**: último
commit del 2026-07-22, cuatro commits en total, 44 archivos versionados. Casi
todo lo construido después vive **solo en disco**: unos 934 archivos sin
trackear. Rama actual `feat/archivar-reel`.

## Al entrar — cualquier agente, cada sesión

1. **Las lecciones acumuladas. Es el paso 1, antes que el handoff.**
   `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}/20-LLM/raw/redsocialbot/aprendizajes-edicion.md`
   Son las preferencias de Quito destiladas de sesiones reales. **Si el vault no
   responde, sigue igual pero avísalo en voz alta** — nunca degrades en silencio:
   editar sin ellas significa volver a preguntar lo que ya se sabe.
2. **El handoff:** `ESTADO.md` en la raíz. Ojo: **no está versionado en git.**
3. **Git real:** `git status --short`, `git log --oneline -10`, la rama actual.
   Si un documento y el repo se contradicen, gana el repo y lo dices. Hoy se
   contradicen: `ESTADO.md:5` dice `actualizado: 2026-07-07` y el último commit
   es del 2026-06-23.
4. **El reel en curso:** `project.md` (raíz) y `out/<reel>/NOTAS.md`.
5. **El método común:** `80-METODO/Protocolo-agentes-PORTABLE.md` en el vault.

## Al salir — o cierras el bucle, o no cerraste

Este repo tiene **el único bucle de aprendizaje cerrado del ecosistema**, y se
mantiene cerrado porque el que lee tiene la obligación de pedir que se escriba:

- Hubo feedback, correcciones o preferencias nuevas → sugiere correr **`learning`**.
- El reel quedó aprobado y exportado → sugiere correr **`archivar-reel`**.

No lo hagas a mano: `learning` trae las reglas que evitan que la nota se pudra
—merge en vez de append ciego, no inventar preferencias, una nota por capacidad—
y sin ellas la nota crece hasta que nadie la carga.

## Quién gana cuando dos cosas se contradicen

La instrucción directa de Quito en el chat está sobre cualquier documento del
repo. Si chocan, señala el conflicto y pregunta. **Nunca elijas en silencio.**

| Pregunta | Documento que manda |
|---|---|
| ¿Cómo le gustan los reels a Quito? | `aprendizajes-edicion.md` en el vault — fuente de verdad |
| ¿Cómo se ejecuta técnicamente? | `.claude/skills/reel-editor/references/pipeline.md` |
| ¿En qué reel estamos? | `project.md` + `out/<reel>/NOTAS.md` |
| ¿Dónde quedó la sesión anterior? | `ESTADO.md` |
| ¿Qué es la marca? | `.claude/skills/reel-editor/references/brand-guide.md` |

`Resources/GUIA-DE-USO.md` es la guía original para humanos: referencia de
intención, **no autoridad**. Tiene datos vencidos (ver "Deuda conocida").

## Lo que no haces solo

- **No borres media local sin verificar que está en Drive.** `out/` y `footage/`
  están fuera de git: lo que se borra ahí no se recupera.
- **No borres la versión final ni el footage master sin visto bueno.** Las
  intermedias sí, después de comprobar el respaldo.
- **No sobrescribas una escena que Quito aprobó.** Crea `SceneV2`, `SceneV3`,
  `reel-...-v2.mp4`. Es la regla crítica del proyecto.
- **No renderices sin mostrar preview primero.** El render es caro en tiempo.
  Confirma footage y lip-sync antes: un cambio de tempo obliga a rehacer captions
  y ventanas de gráficas, así que un render con footage malo cuesta doble.
- **No uses APIs pagadas sin avisar.** La transcripción por defecto es Whisper
  local, gratis.
- **No decidas el lip-sync por tu cuenta: no puedes oír.** Ofrece dos o tres
  clips con offsets distintos para que Quito elija.
- **No commitees trabajo en curso ajeno.** El árbol tiene cientos de archivos sin
  trackear de varias sesiones. Stagea archivo por archivo.
- **No instales dependencias ni cambies versiones sin avisar.**

## Comandos

```bash
npm run dev      # remotion studio
npm run build    # remotion bundle
npm run lint     # eslint src && tsc
```

**No hay script `test`.** Render real:
`npx remotion render <ReelPlaza|Reel1|Reel|KaraokeDemo> out/<reel>.mp4 --codec h264`
(los ids están en `src/Root.tsx`). Verifica siempre 1080×1920 con `ffprobe`.

## Estructura — solo lo que no es obvio

- `.claude/skills/` — 23 entradas, y **solo tres son de este proyecto**:
  `reel-editor` (orquesta), `learning` (destila lecciones) y `archivar-reel`
  (Drive, registro y liberar disco). Las otras son la familia HyperFrames y
  graphify: dependencias, no las edites. **No repitas acá lo que ellas dicen.**
- `.claude/agents/reel-editor.md` — el agente editor. Es quien carga las lecciones.
- `out/<reel>/scripts/` — scripts reales de cada reel. `captions_v3.py` sirve;
  `align_rebuild.py` y `remap_ws.py` **fallaron** con masters de muchas retomas:
  no los reutilices.
- `bitacora/` — relato de sesiones.

## Deuda conocida (medida, no arreglada)

- `CLAUDE.md` (raíz, sin versionar) declara un grafo en `graphify-out/` que **no
  existe**, y `.claude/settings.json` instala hooks que llaman a
  `graphify hook-guard` en cada `Bash`, `Grep`, `Read` y `Glob` contra ese grafo
  inexistente.
- `.claude/skills/remotion-best-practices` es un **symlink roto** (apunta a
  `.agents/`, que no existe). `GUIA-DE-USO.md:22` la da por disponible.
- `project.md:15` dice "HyperFrames (17 skills **globales**)": son 17, pero viven
  en este repo, no en `~/.claude/skills/`.
- `ESTADO.md` y `bitacora/2026-07-07.md` están **duplicados byte a byte** con el
  vault. Un artefacto vive en un solo lado; el que no es fuente de verdad se pudre.
- `README.md:57` documenta `npx remotion render Reel`; los reels reales son
  `ReelPlaza` y `Reel1`.
