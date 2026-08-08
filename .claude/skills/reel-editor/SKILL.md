---
name: reel-editor
description: >
  Editor de reels 9:16 de Quito (IG/TikTok, contenido build-in-public sobre IA).
  Úsala SIEMPRE que se trabaje en este proyecto (/edicion) para editar un video:
  cortar muletillas/silencios/retomas, estructurar por guion, poner subtítulos
  karaoke estilo CapCut, y sumar motion graphics (gráficas, efectos, animaciones)
  sobre footage real. Orquesta dos ambientes — el CORTE (video-use, transcripción
  gratis vía adapter) y los MOTION GRAPHICS (HyperFrames + Remotion) — y delega la
  dirección creativa al agente social-media-strategist. Trigger: "edita este reel",
  "córtame los silencios/muletillas", "ponle subtítulos", "qué gráfica/efecto le
  sumo", "hazme un hook/escena de marca", "renderiza el reel".
metadata:
  tags: video, reels, edición, remotion, hyperframes, video-use, captions, 9:16
---

# reel-editor — cómo editar un reel de Quito

> Lee `project.md` (raíz del proyecto) ANTES de empezar: tiene la memoria de sesión,
> los reels en curso y las decisiones de marca. Actualízalo al terminar.

> **Preferencias de Quito (aprendizajes) → viven en OBSIDIAN**, no acá. Léelas ANTES
> de editar: `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}/20-LLM/raw/redsocialbot/aprendizajes-edicion.md`
> (gusto de cortes/audio/LUT/texto/karaoke/cierre — evita re-preguntar lo ya sabido).
> La skill **`learning`** nutre esa nota; el agente **`reel-editor`** (`.claude/agents/reel-editor.md`)
> la lee y ejecuta la edición. El **flujo técnico exacto** está en `references/pipeline.md`.
> Si el vault no está montado, seguí igual y avisá que las preferencias no cargaron.

## La marca en 6 líneas (detalle en `references/brand-guide.md`)
- Dev de 20 años, build-in-public sobre IA. Tono cercano, directo, **anti-vendehúmo**, español chileno.
- 4 pilares: (1) Dirigiendo a la IA · (2) Construyendo en público · (3) Disciplina y sistema · (4) Opinión con criterio. **Cada reel pertenece claro a UNO.**
- Estética: **minimalista y cercana**, dev moderno. Fondo oscuro tipo editor, texto casi-blanco, **UN** color de acento (`src/theme.ts`).
- Specs: **9:16, 1080×1920, 30fps, 15–40s**, captions karaoke quemados, safe zones (nada en 15% inferior / 10% superior).
- Estructura: Hook (0–3s) → Contexto (3–10s) → Desarrollo (10–30s) → CTA. **El hook se diseña primero.**
- La guía original del usuario es REFERENCIA de gusto, no spec literal (la hizo otra IA). Aplicá criterio.

## Los dos ambientes (el pipeline)

### Ambiente 1 — EL CORTE  (video-use + adapter, SIN ElevenLabs)
1. El footage va en `footage/`. El guion (si existe) en la raíz o pégalo en el chat.
2. **Transcribir** (gratis): elegí una fuente y corré el adapter:
   - MacWhisper (recomendado): exportá JSON word-level y →
     `python scripts/transcribe.py --video footage/X.mp4 --whisper-json <export.json> --edit-dir edit`
   - OpenAI Whisper: `python scripts/transcribe.py --video footage/X.mp4 --openai --edit-dir edit`
   - HyperFrames Whisper: `npx hyperframes transcribe footage/X.mp4` y luego pasá su salida con `--whisper-json`.
   Esto deja el transcript en formato shape-Scribe en `edit/transcripts/X.json` (para video-use)
   y `transcripts/X.captions.json` (Caption[] para el karaoke).
3. **Cortar**: invocá la skill `video-use`. Ya tiene el transcript inyectado, así que
   salta su paso de ElevenLabs. Razona qué cortar (muletillas "eh/em", silencios,
   retomas) **según el guion** y genera el EDL → corte. Confirmá la estrategia antes de ejecutar.
   - Camino lean (sin video-use): `python scripts/silences.py footage/X.mp4` + razonar cortes + ffmpeg.
4. Resultado: video cortado y estructurado en `out/<reel>/` (o `edit/`).

### Ambiente 2 — CAPTIONS + MOTION GRAPHICS
5. **Subtítulos karaoke** (palabra por palabra, color de acento). Dos motores:
   - Sobre footage real → skill `embedded-captions` de HyperFrames (per-word; puede ir
     detrás del sujeto). Usa los timestamps del adapter.
   - Escena de marca en Remotion → componente `<KaraokeCaptions captionsSrc="X.captions.json" />`.
   Detalle y cuándo usar cada uno: `references/caption-style.md`.
6. **Dirección creativa** (qué gráfica/efecto/animación sumar): consultá al agente
   `social-media-strategist` (es el "red social bot": hooks, retención, qué aporta valor).
7. **Motion graphics** — routing (detalle en `references/motion-routing.md`):
   - Overlay sobre footage (lower-third, callout, dato, título cinético, PiP) → skills
     `graphic-overlays` / `motion-graphics` de HyperFrames → webm transparente → composite ffmpeg.
   - Escena de marca completa / hook / data-viz / intro-outro → **Remotion** (`src/scenes/`, con `theme.ts`).
8. **Render + composite** → `out/<reel>.mp4`. Verificá **1080×1920** con `ffprobe`.
   - Remotion: `npx remotion render Reel out/<reel>.mp4 --codec h264`
   - Recordá: subtítulos SIEMPRE en la capa de arriba (si usás video-use, se queman al final).

## Mapa de delegación (qué dice Quito → qué hago)
| Quito dice… | Acción |
|---|---|
| "edita este video" / "córtame silencios y muletillas" | Ambiente 1 (transcribe → video-use cut) |
| "ponle subtítulos" / "captions karaoke" | Ambiente 2 paso 5 (embedded-captions o Remotion) |
| "qué le sumo" / "qué gráfica/efecto/animación" | agente `social-media-strategist` → routing motion |
| "ponle un lower-third / callout / dato encima" | HyperFrames `graphic-overlays` (overlay sobre footage) |
| "hazme un hook / escena / intro de marca" | Remotion (`src/scenes/`, theme.ts) |
| "renderiza / exporta" | render + composite + `ffprobe` verify 1080×1920 |
| "cambiá esta escena / no me gusta" | **VERSIONAR** (ver regla crítica abajo), no sobrescribir |
| "esto va sobre mi cámara / déjalo a un lado" | recomponer a un lado, split al centro → `references/revision-prompts.md` |
| "hazlo chroma / fondo verde para keyear" | escena chroma #00FF00 opaca → `references/revision-prompts.md` |

## ⚠️ Regla crítica de versionado
Cuando Quito pida cambios a una escena, **NO** la edites ni la borres. Creá una
versión nueva: `SceneX V2`, `SceneX V3`… (archivos `HookSceneV2.tsx`, etc.) y swapeala
en `Reel.tsx`. Preserva el historial. Detalle: `references/versioning-rule.md`.

## Checklist antes de exportar
- [ ] Hook funciona sin sonido (se entiende solo con el texto del primer segundo).
- [ ] Captions karaoke quemados, legibles, sincronizados.
- [ ] Nada importante en 15% inferior / 10% superior.
- [ ] Un solo color de acento, consistente (`theme.ts`).
- [ ] Voz al frente, música abajo (−18/−20 dB), sin pausas muertas.
- [ ] El reel pertenece claro a UN pilar. CTA real (no "sígueme para más").
- [ ] 9:16, 1080×1920, H.264 (verificado con ffprobe).

## Cierre — archivar y registrar (al quedar "listo")
Cuando el reel está aprobado y exportado, sugiere correr la skill **`archivar-reel`**:
sube la final + el footage a Google Drive, libera el disco (`out/`/`footage/` se
acumulan rápido) y deja el registro ejecutivo del video en el segundo cerebro
(guion, receta de edición, métricas). Es el cierre natural de este flujo.

## 🚫 Anti-patrones (nunca)
Stock genérico de "IA" (hologramas, robots, cerebros neón) · hooks que prometen y no
entregan · texto saturando la pantalla · transiciones de PowerPoint · música épica de
gurú tapando la voz · tono vendehúmo · **sobrescribir una escena en vez de versionarla**.

## Herramientas del stack (referencia rápida)
- `video-use` (skill) — corte dirigido por transcript.
- `embedded-captions`, `graphic-overlays`, `motion-graphics`, `hyperframes-*` (skills) + `npx hyperframes` (CLI).
- `remotion-best-practices` (skill) — reglas técnicas Remotion.
- Agente `social-media-strategist` — dirección creativa.
- `scripts/transcribe.py` (adapter), `scripts/silences.py` (cut lean).
