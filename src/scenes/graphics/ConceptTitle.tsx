// Título de concepto (ej. "IA AGÉNTICA") sobre el footage, sin fondo.
// Por defecto va en la zona baja (debajo de los logos que ya pusiste).
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { theme, SAFE } from "../../theme";

export const ConceptTitle: React.FC<{ text: string; sub?: string }> = ({ text, sub }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.6 } });
  const out = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = Math.min(inS, out);
  const underline = interpolate(frame, [8, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 80 }}
    >
      <div style={{ opacity: op, transform: `translateY(${interpolate(inS, [0, 1], [24, 0])}px)`, textAlign: "center" }}>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontWeight: theme.weight.extrabold,
            fontSize: 92,
            letterSpacing: theme.tracking.hook,
            color: theme.colors.text,
            textShadow: "0 6px 26px rgba(0,0,0,0.85)",
          }}
        >
          {text}
        </div>
        <div
          style={{
            height: 6,
            width: `${underline * 60}%`,
            margin: "16px auto 0",
            background: theme.colors.accent,
            borderRadius: 3,
          }}
        />
        {sub ? (
          <div style={{ fontFamily: theme.fonts.mono, fontSize: 30, color: theme.colors.textMuted, marginTop: 16 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
