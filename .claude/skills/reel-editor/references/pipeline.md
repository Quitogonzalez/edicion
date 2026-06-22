# pipeline — secuencia end-to-end de un reel

Carpetas: `footage/` (crudo) · `transcripts/` (transcripción) · `edit/` (trabajo video-use) · `out/` (final) · `src/` (Remotion).

## Reel completo (camino recomendado)
```bash
# 0. Footage en footage/clip.mp4. Guion a mano o pegado en el chat.

# 1. TRANSCRIBIR (gratis). MacWhisper: exportá JSON word-level, luego:
python scripts/transcribe.py --video footage/clip.mp4 \
    --whisper-json <export-macwhisper.json> --stem clip --edit-dir edit
#   (o --openai en vez de --whisper-json; o `npx hyperframes transcribe footage/clip.mp4`)

# 2. CORTAR muletillas/silencios/retomas según guion → invocar skill `video-use`
#    (el transcript ya está en edit/transcripts/clip.json, salta ElevenLabs).
#    Confirmá la estrategia de corte antes de ejecutar. Resultado: video cortado.

# 3. CAPTIONS karaoke
#    a) sobre footage → skill `embedded-captions` (HyperFrames), color acento #3FB950
#    b) o escena Remotion → <KaraokeCaptions captionsSrc="clip.captions.json" />

# 4. MOTION GRAPHICS (consultá social-media-strategist para el QUÉ)
#    overlay → skills graphic-overlays/motion-graphics → webm transparente
#    escena de marca → src/scenes/*.tsx (theme.ts)

# 5. RENDER + verificar 9:16
npx remotion render Reel out/clip.mp4 --codec h264
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,codec_name -of csv=p=0 out/clip.mp4
#    → debe decir h264,1080,1920
```

## Camino LEAN (sin video-use, corte simple por silencios)
```bash
python scripts/silences.py footage/clip.mp4 --noise -30dB --min 0.4   # rangos de silencio
# Claude razona qué cortar (cruza con el transcript y el guion) y arma el EDL mental,
# luego corta con ffmpeg (-ss/-to por segmento) + concat, fades de 30ms en cada corte.
```

## Composite de overlay HyperFrames sobre footage (ffmpeg)
```bash
# overlay.webm (alpha) encima de base.mp4; subtítulos SIEMPRE al final del filtro.
ffmpeg -i base.mp4 -i overlay.webm \
  -filter_complex "[0][1]overlay=0:0[v]" -map "[v]" -map 0:a \
  -c:v libx264 -crf 18 -c:a aac out/clip.mp4
```

## Reglas duras (de video-use, valen para todo)
1. Subtítulos se aplican AL FINAL del filtro (después de overlays), si no, se ocultan.
2. Offsets de subtítulos en timeline de salida (no de la fuente) tras concatenar cortes.
3. Verificá la duración con ffprobe contra lo esperado del EDL.
