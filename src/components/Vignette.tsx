// Vignette / spotlight: oscurece los bordes y deja el centro (tu cara) iluminado.
// Entra y sale con fade. Úsalo en momentos de énfasis (primer plano de cara).
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const Vignette: React.FC<{ intensity?: number }> = ({ intensity = 0.85 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const op = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, intensity, intensity, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <AbsoluteFill
      style={{
        opacity: op,
        background:
          "radial-gradient(ellipse 52% 38% at 50% 42%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.82) 100%)",
        pointerEvents: "none",
      }}
    />
  );
};
