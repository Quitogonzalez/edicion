# pipeline — flujo end-to-end de un reel (probado en "Plaza Egaña" v3.2)

> Receta battle-tested (2 clips iPhone vertical 4K + audio de grabadora externa →
> `reel-plaza-v32.mp4`, 112.9s, h264, 1080×1920, AAC). **Arquitectura clave:** el footage
> cortado y gradeado vive en `public/plaza_base.mp4`; TODO lo demás (gráficas, captions
> karaoke, SFX) se compone en UNA composición Remotion (`ReelPlaza`) y se renderiza de una
> sola pasada. ffmpeg solo hace corte/gradeo/audio del footage base; nunca compone capas.
>
> Anclas: scripts en `out/<reel>/scripts/` · composición `src/ReelPlaza.tsx` (+
> `src/components/KaraokeCaptions.tsx`, `src/scenes/graphics/`, `src/theme.ts` accent
> `#3FB950`) · historia completa en `out/<reel>/NOTAS.md` · whisper `/opt/homebrew/bin/whisper`.

## Etapas (en orden)
0. **Sync dual-system** — alinear el m4a externo con cada clip por cross-correlation; hornear masters `master_XXXX_sync_1080.mp4` (video 1080×1920 + audio bueno). Si el audio ya va en cámara, saltar.
1. **Transcribir** — whisper word-level sobre el WAV de cada master.
2. **Cortar** — muletillas/silencios/retomas/falsos arranques; frame-exacto desde masters.
3. **Gradear (LUT)** — en la MISMA pasada del corte.
4. **Audio** — `loudnorm` (voz al frente).
5. **Captions** — re-transcribir el footage **ya cortado** → `plaza.captions.json` con correcciones de términos.
6. **Gráficas** — componentes Remotion por ventanas `W` (palabra-gatillo).
7. **SFX** — `public/sfx/*.wav`, disparados como `<Audio>` en Remotion, vol bajo.
8. **Render** — `npx remotion render` (todo junto, una pasada).
9. **Verificar** — `ffprobe` + stills + skill `/watch` sobre el render propio.
10. **Archivar** — skill `archivar-reel`.

## Comandos exactos

### 0. Sync + masters (`sync.py` + `build_masters.sh`) ✅
`sync.py`: cross-correlation en banda-voz 200–3200Hz (robusto a micros distintos), mide 3 ventanas → offset + drift.
```bash
VF="scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p"
# offset positivo → adelanta audio con adelay:
ffmpeg -y -i V1 -i M4A -filter_complex "[0:v]$VF[v];[1:a]adelay=7796|7796,aresample=48000[a]" -map "[v]" -map "[a]" -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 192k -shortest master_5894_sync_1080.mp4
# audio empieza tarde en el m4a → -ss ANTES del -i del m4a:
ffmpeg -y -i V2 -ss 288.656 -i M4A -filter_complex "[0:v]$VF[v];[1:a]aresample=48000[a]" ... master_5895_sync_1080.mp4
```

### 1 y 5. Whisper CLI ✅
```bash
ffmpeg -y -v error -i master.mp4 -vn -ac 1 -ar 16000 out.wav
/opt/homebrew/bin/whisper out.wav --language Spanish --model small --word_timestamps True --output_format json --output_dir DIR --fp16 False --verbose False
# --model base como respaldo si small es muy lento / revienta RAM (8GB). Sumar el offset del tramo a los tiempos.
```

### 2-4. Corte frame-exacto + LUT + audio — EN UN PASE CON CONCAT-FILTER
`-ss` **antes** de `-i` + `-t dur` = frame-exacto (sin lead de keyframe). `LC_ALL=C` obligatorio (locale chileno, coma decimal).
```bash
dur=$(LC_ALL=C awk "BEGIN{printf \"%.3f\", $b-$a}")
# ⚠ NO usar concat demuxer -c copy (driftea A/V). Cortar con concat-FILTER (re-codifica, A/V clavado):
# [0:v]trim=A:B,setpts=PTS-STARTPTS[v0];…;[v0][v1]concat=n=N:v=1:a=0[cv];
# [0:a]atrim=A:B,asetpts=PTS-STARTPTS[a0];…;[a0][a1]concat=n=N:v=0:a=1[ca];
# [cv]${LUT}[v];[ca]${AUD}[a]   → -map [v] -map [a]   (funde corte+gradeo+audio, mata el drift de raíz)
LUT="format=yuv420p,eq=contrast=1.06:saturation=0.92:brightness=-0.05:gamma=0.98,colorbalance=rs=-0.02:bs=0.04:rm=-0.01:bm=0.01:rh=-0.04:bh=0.03,vignette=angle=PI/6,unsharp=5:5:0.25"  # ✅ SUTIL oscuro/sin amarillo (aprobado)
AUD="loudnorm=I=-15:TP=-1.5:LRA=13"  # ✅ mínimo aprobado
```
Filtros largos → `-filter_complex_script trim.txt`. `showwavespic` para ubicar un silencio antes de cortar:
```bash
ffmpeg -v error -ss 13 -t 3.5 -i public/plaza_base.mp4 -filter_complex "showwavespic=s=1600x260:colors=0x3FB950" -frames:v 1 wave.png
```

### 5. Captions (`captions_v3.py`) ✅ — SIEMPRE re-transcribir el corte final
Whisper JSON del footage FINAL → `Caption[]` (ms) con `REPL` (palabra→palabra: cloud→Claude, "ben claude"→OpenClaw, veras→verás, página bot→web, pruebalo→pruébalo) y `SEQ` (n-gramas: `["ultra","code"]→["ultracode"]`, `["slash","goal"]→["/goal"]`, `["segundo","goal"]→["Segundo,","/goal"]`).

### 6-7. Gráficas + SFX en Remotion
Ventanas `W` por palabra-gatillo (leídas de los captions nuevos). Componentes: `PromptBox`, `StatPunch`/`Chart80`, `TweetCard`/`PopUp`, `AgentSwarm`, `LoopRing`, `PricingCard`, `OutroCTA`, `LowerThirdCTA`, `IconPop`, `BigWord`, `CameraFootage` (focus/highlight beats). Karaoke: `createTikTokStyleCaptions({combineTokensWithinMilliseconds:1100})`, palabra activa `accent` + `scale(1.07)`, ya-dichas blancas, por-venir opacidad 0.5, `paddingBottom: SAFE.bottom`.
```bash
# SFX → public/sfx/ (48k estéreo); riser de inicio nivelado aparte:
ffmpeg -v error -i Riser-1.MP3 -af "loudnorm=I=-20:TP=-3" -ar 48000 -ac 2 public/sfx/riser_start.wav
# en Remotion: const SFX=[{at:0.0,src:"riser_start",vol:0.42,dur:4},…]; vol no-riser ×1.4
```

### 8-9. Render / QA
```bash
npx remotion render ReelPlaza out/<reel>/reel.mp4 --codec h264 --concurrency=7 --log=error
npx remotion still ReelPlaza still.png --frame=N --log=error   # verificar UNA gráfica sin render completo
# /watch sobre el render propio: python3 <watch>/scripts/watch.py out/<reel>/reel.mp4 --detail balanced --no-whisper
# Remotion Studio LAGEA → juzgar sync solo en el render, nunca en Studio.
```

### Drift A/V (solo si el corte NO se hizo con concat-filter)
```bash
V=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=nk=1:nw=1 cut.mp4)
A=$(ffprobe -v error -select_streams a:0 -show_entries stream=duration -of default=nk=1:nw=1 cut.mp4)
ffmpeg -v error -i cut.mp4 -c:v copy -filter:a "atempo=$(python3 -c "print(round($A/$V,7))")" -c:a aac -b:a 192k final.mp4
# ⚠ ffprobe stream=duration MIENTE (padding AAC): para medir de verdad decodificá a WAV y medí format=duration del WAV.
# Validar dirección con 3 clips (voz -90ms / original / +90ms) y que Quito elija (él ve el lip-sync).
```

## Técnicas clave
- **Reconstruir tramos choppy desde tomas limpias del master** (no parchar con microcortes): concat-filter de tomas exactas + LUT+loudnorm, nativo sin atempo → lip-sync correcto ahí. Ej. cierre = 3 tomas de `master_5895`.
- **Silence-squeeze SUAVE** (`squeeze2.py`, GAPMAX 0.55, GAPKEEP 0.28) evita el efecto robótico.
- **Verificar todo con datos**: transcript, `showwavespic`, stills, `/watch` — no a ojo en Studio.

## Scripts (qué sirve)
✅ `sync.py`, `build_masters.sh`, `cut_fluido.py` (descarta retomas), `squeeze2.py`, `captions_v3.py`.
⚠ `build_v3.sh` (base, pero su concat `-c copy` driftea — preferir concat-filter).
❌ `align_rebuild.py`, `remap_ws.py` — **fallan con masters de muchas retomas** (alineación colapsa). Hacer cortes quirúrgicos a mano + remapear ventanas/SFX por palabra-gatillo.

## Gotchas → fix (resumen)
- `concat -c copy` driftea → concat-filter en un pase (o `atempo=A/V` si ya horneado).
- Captions ~0.4s desfasados tras re-ediciones → **re-transcribir el footage final**, no re-timear el JSON viejo.
- `awk` coma decimal (locale CL) → `LC_ALL=C`.
- `ffprobe stream=duration` engaña → medir WAV decodificado.
- `-ss` después de `-i` arrastra al keyframe → `-ss` antes + `-t`.
- Studio lagea → juzgar en el render.
- RAM 8GB / disco lleno frena render/whisper → skill `limpieza-mac`, whisper `--model base`, `pkill -f chrome-headless-shell`.

## Regla de oro
**Cortar en un solo pase con concat-filter** (no `-c copy`) y **re-transcribir el footage final** para los captions. Esas dos decisiones evitan las dos cadenas de retrabajo más caras (diagnóstico de drift + atempo, y el desfase de 0.4s en captions).

---
_Camino genérico anterior (video-use / MacWhisper / HyperFrames overlays) archivado; este flujo Remotion-first es el probado._
