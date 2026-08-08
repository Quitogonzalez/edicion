// GapModule — rellena un VACÍO del video: recurso real grande + vos en PiP a un lado.
// El footage base queda cubierto; el audio sigue saliendo de la capa base (PiP muteado).
import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE } from "../theme";

export const GapModule: React.FC<{
  startFrame: number; // frame global del inicio (sincroniza el PiP)
  assetSrc?: string; // imagen en public/ (ej. "pngs/noticia.png")
  label?: string; // etiqueta mono arriba
  caption?: string; // línea grande debajo del recurso
  children?: React.ReactNode; // alternativa a assetSrc (card tipográfica)
}> = ({ startFrame, assetSrc, label, caption, children }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 18, stiffness: 160, mass: 0.7 } });
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = Math.min(inS, out);
  const y = interpolate(inS, [0, 1], [44, 0]);
  const pipW = 300;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: op }}>
      {/* vos en PiP, arriba a la derecha (no choca con los subtítulos de abajo) */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top - 30,
          right: 44,
          width: pipW,
          height: (pipW * 16) / 9,
          borderRadius: 22,
          overflow: "hidden",
          border: `3px solid ${theme.colors.accent}`,
          boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
          transform: `translateY(${y}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile("reel1_1.1x.mp4")}
          trimBefore={startFrame}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* recurso real grande, centrado-izquierda */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "6%",
          right: "6%",
          transform: `translateY(${y}px)`,
        }}
      >
        {label ? (
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontSize: 28,
              color: theme.colors.accent,
              letterSpacing: 1,
              marginBottom: 14,
            }}
          >
            {label}
          </div>
        ) : null}
        {assetSrc ? (
          <Img
            src={staticFile(assetSrc)}
            style={{
              width: "100%",
              borderRadius: 16,
              border: "1px solid #30363D",
              boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
            }}
          />
        ) : (
          children
        )}
        {caption ? (
          <div
            style={{
              fontFamily: theme.fonts.sans,
              fontWeight: theme.weight.bold,
              fontSize: 34,
              color: theme.colors.text,
              marginTop: 20,
              letterSpacing: theme.tracking.body,
            }}
          >
            {caption}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
