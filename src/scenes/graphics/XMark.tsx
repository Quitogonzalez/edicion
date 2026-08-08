// X que aparece rápido en "prohibir" — simple pero llama la atención.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const XMark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 9, stiffness: 240, mass: 0.6 } });
  const out = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = Math.sin(frame / 1.5) * (3 * out);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          transform: `scale(${interpolate(inS, [0, 1], [0, 1])}) rotate(${shake}deg)`,
          opacity: Math.min(inS, 1) * out,
          fontSize: 280,
          fontWeight: 900,
          color: "#FF3B30",
          textShadow: "0 0 50px rgba(255,59,48,0.6), 0 8px 30px rgba(0,0,0,0.6)",
        }}
      >
        ✕
      </div>
    </AbsoluteFill>
  );
};
