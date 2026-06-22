# motion-routing — ¿HyperFrames o Remotion para el motion graphic?

Regla simple: **¿es un overlay sobre mi footage, o una escena diseñada desde cero?**

| Quiero… | Herramienta | Por qué |
|---|---|---|
| Lower-third, callout, dato encima del video que se reproduce | HyperFrames `graphic-overlays` | Diseñado para empacar talking-head con cards timed sobre el video que sigue corriendo |
| Hit corto: kinetic type, count-up de número, logo sting, stat, headline | HyperFrames `motion-graphics` | Motion-first <10–30s, MP4 u overlay transparente |
| Subtítulos VFX/karaoke sobre footage | HyperFrames `embedded-captions` | Per-word, puede ir detrás del sujeto |
| Hook / intro / outro / data-viz como **escena de marca completa** 9:16 | **Remotion** | Control total con `theme.ts`, versionado, transiciones, captions integrados |
| Reel programático multi-escena con tokens de marca | **Remotion** | `Reel.tsx` + `TransitionSeries` |

## Flujo overlay (HyperFrames) sobre footage
1. Diseñá la card/animación en HTML (skill `graphic-overlays` / `motion-graphics`).
2. Renderizá a **webm transparente**: `npx hyperframes render . -o overlay.webm` (alpha).
3. Composite con ffmpeg sobre el footage cortado (overlay arriba, subtítulos al final).

## Flujo escena (Remotion)
1. Creá `src/scenes/MiEscena.tsx` usando `theme.ts`, helpers `motion.ts` (fadeUp/popIn), `AnimatedText`.
2. Sumala a `Reel.tsx` dentro de `<TransitionSeries>` (transición `fade()`/`slide()` sutil).
3. Render: `npx remotion render Reel out/<reel>.mp4 --codec h264`.

## Híbrido (lo normal)
Footage real cortado (Ambiente 1) → captions karaoke + overlays HyperFrames encima →
y/o escenas de marca Remotion como hook/intro intercaladas con `TransitionSeries`.
Para portar una escena Remotion a HyperFrames (si querés un solo motor): skill `remotion-to-hyperframes`.

## Dirección creativa
Antes de decidir QUÉ sumar, consultá al agente `social-media-strategist`
(hooks, retención, qué aporta valor vs. relleno). Él decide el "qué"; este doc decide el "con qué".
