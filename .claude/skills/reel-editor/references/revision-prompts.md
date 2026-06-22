# revision-prompts — prompts reutilizables de revisión

Plantillas para pedir cambios frecuentes. Adaptadas a la marca de Quito (acento
único #3FB950, minimalismo) y a su stack (Remotion / HyperFrames / ffmpeg / DaVinci).
**Siempre versionando** (no sobrescribir; ver `versioning-rule.md`).

## 1) Recomponer a un lado (dejar espacio para la webcam)
> Para Escena <N>, recompoñé el motion graphic para que viva SOLO en el <lado izquierdo 35% | derecho 35% | mitad superior | mitad inferior> de la pantalla, con un corte limpio al centro. Dejá el lado opuesto completamente vacío para la cámara. **No escales la escena hacia abajo: recomponé y reordená** para que se vea limpia, balanceada e intencional en ese lado. Mantené el acento #3FB950 y las safe zones.

- En Remotion: nueva escena versionada (`SceneXV2`), layout a un lado con `AbsoluteFill` + padding; el otro lado transparente/vacío.
- En el editor: el motion va en una pista; tu cam llena el resto. Crop al split si hace falta.

## 2) Chroma / fondo verde para keyear
> Para Escena <N>, usá un fondo chroma verde puro y sólido: `#00FF00`. Sin gradientes, sombras, textura, niebla, glow ni viñeta. Fondo perfectamente plano y consistente para keyear limpio. **No uses verde en ningún lado** del motion graphic (UI, texto, íconos, elementos). Hacé todos los paneles/cards/overlays **sólidos y opacos** (pueden ser glassy, pero NO transparentes/semitransparentes) para evitar problemas de borde al keyear. Contraste fuerte, bordes limpios, que "salte" del fondo.

- Render con alpha real (mejor que chroma): Remotion/HyperFrames pueden exportar **webm transparente** → composite directo sin keyer. Usá chroma solo si tu editor lo exige.
- Composite por chroma con ffmpeg (sin DaVinci):
  ```bash
  ffmpeg -i base.mp4 -i escena-chroma.mp4 -filter_complex \
    "[1:v]chromakey=0x00FF00:0.10:0.08[ck];[0:v][ck]overlay[v]" -map "[v]" -map 0:a out/reel.mp4
  ```
- En DaVinci: 3D Keyer → línea sobre el verde → ajustar Despill / Flat vs Tight.

## 3) Insertar imágenes propias en una escena
> En Escena <N>, reemplazá el texto/placeholder del <teléfono | card | bloque> por una imagen. Las imágenes están en `public/pngs/`. Una por slide, manteniendo el layout y el acento.

- Dejá las imágenes en `public/pngs/` y referencialas con `<Img src={staticFile("pngs/...")} />` (Remotion) o en el HTML (HyperFrames).
