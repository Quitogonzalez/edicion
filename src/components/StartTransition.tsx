// Transición de inicio: tapa el frame colado (~1–3s) y revela el footage con
// un panel que sube (cambio de escena limpio).
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const StartTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // cubre, luego sube y se va revelando el footage
  const slide = interpolate(frame, [durationInFrames - 22, durationInFrames - 2], [0, -110], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ transform: `translateY(${slide}%)` }}>
      <AbsoluteFill style={{ backgroundColor: theme.colors.bg }} />
      {/* borde de acento abajo del panel */}
      <AbsoluteFill style={{ justifyContent: "flex-end" }}>
        <div style={{ height: 8, background: theme.colors.accent }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
