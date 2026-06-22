// Reel.tsx — compone las escenas EN ORDEN con <TransitionSeries>.
// Transiciones sutiles (fade), nada de PowerPoint. Para revisar una escena,
// creá SceneXV2 y swapeala aquí (no edites la original).
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { theme } from "./theme";
import { HookScene } from "./scenes/HookScene";
import { ContextScene } from "./scenes/ContextScene";

// Duraciones por escena (frames). Total con transición = 70 + 90 - 15 = 145.
export const HOOK_FRAMES = 70;
export const CONTEXT_FRAMES = 90;
export const TRANSITION_FRAMES = 15;
export const REEL_DURATION =
  HOOK_FRAMES + CONTEXT_FRAMES - TRANSITION_FRAMES;

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={HOOK_FRAMES}>
          <HookScene />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
        />
        <TransitionSeries.Sequence durationInFrames={CONTEXT_FRAMES}>
          <ContextScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
