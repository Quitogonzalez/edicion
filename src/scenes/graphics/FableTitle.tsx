// Texto "FABLE 5" GRANDE encima del footage (cuando lo nombra). Sin fondo.
import { interpolate, spring, useCurrentFrame, useVideoConfig, AbsoluteFill } from "remotion";
import { theme, SAFE } from "../../theme";

export const FableTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const out = interpolate(frame, [durationInFrames - 7, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const op = Math.min(inS, out);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: SAFE.top + 120 }}>
      <div style={{ opacity: op, transform: `scale(${interpolate(inS, [0, 1], [0.7, 1])})`, textAlign: "center" }}>
        <div
          style={{
            fontFamily: theme.fonts.sans,
            fontWeight: theme.weight.extrabold,
            fontSize: 150,
            letterSpacing: theme.tracking.hook,
            color: theme.colors.text,
            textShadow: "0 8px 30px rgba(0,0,0,0.85)",
            lineHeight: 0.95,
          }}
        >
          FABLE 5
        </div>
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 34,
            color: theme.colors.accent,
            marginTop: 8,
            letterSpacing: 2,
          }}
        >
          el modelo de Anthropic
        </div>
      </div>
    </AbsoluteFill>
  );
};
