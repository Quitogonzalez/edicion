// LowerThirdCTA — cierre en el tercio inferior, BAJO el sujeto (sin taparle la cara).
// Para los últimos ~5s: "pruébalo y cuéntame cómo te va!".
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE } from "../theme";

export const LowerThirdCTA: React.FC<{ text?: string }> = ({
  text = "pruébalo y cuéntame cómo te va!",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inA = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outA = interpolate(frame, [durationInFrames - 12, durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const op = Math.min(inA, outA);
  const y = interpolate(inA, [0, 1], [26, 0]);
  return (
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: SAFE.bottom + 24, paddingLeft: SAFE.side, paddingRight: SAFE.side }}>
      <div
        style={{
          opacity: op,
          transform: `translateY(${y}px)`,
          background: "rgba(13,17,23,0.74)",
          border: `2px solid ${theme.colors.accent}`,
          borderRadius: 20,
          padding: "20px 36px",
          maxWidth: 920,
          textAlign: "center",
          boxShadow: "0 16px 44px rgba(0,0,0,0.6)",
        }}
      >
        <span style={{ fontFamily: theme.fonts.sans, fontWeight: theme.weight.bold, fontSize: 46, color: "#FFFFFF", letterSpacing: 0.2, textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>
          {text}
        </span>
      </div>
    </AbsoluteFill>
  );
};
