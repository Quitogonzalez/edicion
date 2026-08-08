// LandingFlash — flash rápido de "una página web" encima del sujeto.
// Muestra un screenshot enmarcado como ventana de navegador (barra con 3
// puntitos + URL falsa) que entra con spring (scale 0.9→1 + fade), se mantiene
// un instante y sale con fade en los últimos frames. Pensado para ~1–1.5s.
// Ubicación centro/arriba: no tapa del todo, es un flash.
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LandingFlash: React.FC<{
  src?: string;
  width?: number;
}> = ({ src = "pngs/landing.jpg", width = 880 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrada: spring rápido → sirve de fade y de escala 0.9→1.
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });
  const scale = interpolate(enter, [0, 1], [0.9, 1]);

  // Salida: fade en los últimos ~10 frames.
  const exit = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);
  const opacity = enter * exit;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: SAFE.top + 40,
      }}
    >
      <div
        style={{
          width,
          transform: `scale(${scale})`,
          opacity,
          borderRadius: theme.radius,
          overflow: "hidden",
          background: theme.colors.bgAlt,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.75)",
        }}
      >
        {/* Barra superior tipo navegador */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "0 24px",
            height: 56,
            background: "#21262D",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* 3 puntitos */}
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#FF5F57" }} />
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#FEBC2E" }} />
            <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#28C840" }} />
          </div>
          {/* Barra de URL falsa */}
          <div
            style={{
              flex: 1,
              height: 34,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "0 18px",
              borderRadius: 999,
              background: theme.colors.bg,
              border: "1px solid rgba(255,255,255,0.06)",
              fontFamily: theme.fonts.mono,
              fontSize: 22,
              color: theme.colors.textMuted,
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            <span style={{ color: theme.colors.accent, fontSize: 18 }}>●</span>
            <span>https://</span>
          </div>
        </div>

        {/* Screenshot */}
        <Img src={staticFile(src)} style={{ display: "block", width: "100%" }} />
      </div>
    </AbsoluteFill>
  );
};
