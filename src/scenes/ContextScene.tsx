// Escena de ejemplo: CONTEXTO (3–10s). Qué es / por qué importa, simple.
// Muestra una línea mono (tipo terminal) + idea principal. Aire, una idea.
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE } from "../theme";
import { AnimatedText, Accent } from "../components/AnimatedText";
import { popIn } from "../components/motion";

export const ContextScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        gap: theme.gap,
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
      }}
    >
      <div
        style={{
          ...popIn({ frame, fps, delay: 4 }),
          fontFamily: theme.fonts.mono,
          fontSize: 40,
          fontWeight: theme.weight.bold,
          color: theme.colors.accent,
          backgroundColor: theme.colors.accentSoft,
          padding: "12px 24px",
          borderRadius: theme.radius,
        }}
      >
        $ claude edita reel.mp4
      </div>
      <AnimatedText size={68} delay={10} color={theme.colors.textMuted}>
        Corta muletillas, pone <Accent>subtítulos</Accent> y suma motion graphics
      </AnimatedText>
    </AbsoluteFill>
  );
};
