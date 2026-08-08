// Montaje de noticias URGENTE: 4 titulares grandes que entran 1-2-3-4 y se apilan.
// Banner BREAKING NEWS arriba-izquierda. Vos en PiP chico. (SFX whoosh en Reel1.)
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
import { theme, SAFE } from "../../theme";

export const NewsMontage: React.FC<{ startFrame: number; srcs: string[] }> = ({ startFrame, srcs }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const STEP = 24;
  const blink = 0.55 + 0.45 * Math.sin(frame / 5);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: out }}>
      {/* BREAKING NEWS banner */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top - 36,
          left: 40,
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#E10600",
          padding: "10px 20px",
          borderRadius: 10,
          boxShadow: "0 8px 24px rgba(225,6,0,0.4)",
        }}
      >
        <span style={{ width: 16, height: 16, borderRadius: 99, background: "#fff", opacity: blink }} />
        <span style={{ fontFamily: theme.fonts.sans, fontWeight: 900, fontSize: 40, color: "#fff", letterSpacing: 1 }}>
          BREAKING NEWS
        </span>
      </div>

      {/* vos en PiP chico */}
      <div
        style={{
          position: "absolute",
          top: SAFE.top + 70,
          right: 40,
          width: 210,
          height: (210 * 16) / 9,
          borderRadius: 16,
          overflow: "hidden",
          border: `3px solid ${theme.colors.accent}`,
          boxShadow: "0 14px 34px rgba(0,0,0,0.6)",
          zIndex: 20,
        }}
      >
        <OffthreadVideo src={staticFile("reel1_1.1x.mp4")} trimBefore={startFrame} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* 4 noticias grandes apilándose */}
      {srcs.map((src, i) => {
        const s = spring({ frame: frame - i * STEP, fps, config: { damping: 13, stiffness: 210, mass: 0.6 } });
        if (s <= 0) return null;
        const rot = (i % 2 === 0 ? -1 : 1) * (4 - i * 0.5);
        return (
          <div
            key={src}
            style={{
              position: "absolute",
              top: "50%",
              left: "48%",
              width: 760,
              transform: `translate(-50%, -50%) translateY(${interpolate(s, [0, 1], [70, i * 4])}px) scale(${interpolate(s, [0, 1], [0.78, 1])}) rotate(${rot}deg)`,
              opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
              zIndex: i + 1,
              borderRadius: 18,
              overflow: "hidden",
              border: `2px solid #30363D`,
              boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
            }}
          >
            <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
