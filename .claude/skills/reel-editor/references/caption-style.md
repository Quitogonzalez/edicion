# caption-style — subtítulos karaoke estilo CapCut

Decisión de Quito: **karaoke real palabra-por-palabra** (no chunks). Color base
casi-blanco + palabra activa en el color de acento. Contraste alto siempre.

## Specs
- Estilo: **karaoke** (palabra resaltada al hablar). Máx 3–4 palabras por línea, centradas, peso bold/extrabold, MAYÚSCULAS.
- Color: base `#E6EDF3`, palabra activa = acento (`theme.colors.accent`). Stroke + sombra sutil para leer sobre cualquier fondo.
- Posición: por encima del 15% inferior (safe zone). Centrado.

## Dos motores (elegí según el caso)

### 1) HyperFrames `embedded-captions` — para footage real (recomendado)
Per-word, 32 identidades visuales, puede componer el texto **detrás del sujeto**
(matte occlusion). Pipeline: transcripción → matting → render HTML → overlay ffmpeg.
- Invocá la skill `embedded-captions`. Para un look CapCut limpio y de marca usá la
  identidad `anchor` o `velocity` y forzá el color de acento (#3FB950) en la palabra activa.
- Fuente de timestamps: el `<stem>.captions.json` / transcript del adapter, o `npx hyperframes transcribe`.

### 2) Remotion `<KaraokeCaptions>` — para escenas de marca / control total
Componente en `src/components/KaraokeCaptions.tsx`. Usa `createTikTokStyleCaptions`
(@remotion/captions) + resaltado por `token.fromMs/toMs`. Respeta safe zones y theme.
```tsx
import { KaraokeCaptions } from "./components/KaraokeCaptions";
// sobre footage:
<AbsoluteFill>
  <OffthreadVideo src={staticFile("footage-cortado.mp4")} />
  <KaraokeCaptions captionsSrc="mi-reel.captions.json" />
</AbsoluteFill>
```
- El JSON lo genera `scripts/transcribe.py` (Caption[]: text/startMs/endMs/timestampMs/confidence).
- Tunear cuántas palabras por "página": `SWITCH_EVERY_MS` (más bajo = más palabra-por-palabra).

## Cuál usar
- Talking-head real, quiero el efecto premium / texto detrás de mí → **embedded-captions**.
- Escena 100% diseñada en Remotion (hook, intro, data-viz) con captions integrados → **KaraokeCaptions**.
