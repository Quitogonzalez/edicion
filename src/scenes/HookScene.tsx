// Escena de ejemplo: HOOK (0–3s). Texto grande desde el frame 1, para el scroll.
// REGLA DE VERSIONADO: para revisar esta escena, NO la edites — creá HookSceneV2.
import { AbsoluteFill } from "remotion";
import { theme, SAFE } from "../theme";
import { AnimatedText, Accent } from "../components/AnimatedText";

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.bg,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: SAFE.top,
        paddingBottom: SAFE.bottom,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
      }}
    >
      <AnimatedText size={104} weight={theme.weight.extrabold}>
        Le dije a la IA que <Accent>se editara sola</Accent>
      </AnimatedText>
    </AbsoluteFill>
  );
};
