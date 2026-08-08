import "./index.css";
import { Composition } from "remotion";
import { VIDEO } from "./theme";
import { Reel, REEL_DURATION } from "./Reel";
import { Reel1, REEL1_DURATION } from "./Reel1";
import { ReelPlaza, REEL_PLAZA_DURATION } from "./ReelPlaza";
import { KaraokeDemo, KARAOKE_DEMO_FRAMES } from "./scenes/KaraokeDemo";

// Todas las composiciones son 9:16 (1080×1920 @30fps) — specs de marca.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Reel1"
        component={Reel1}
        durationInFrames={REEL1_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="ReelPlaza"
        component={ReelPlaza}
        durationInFrames={REEL_PLAZA_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="Reel"
        component={Reel}
        durationInFrames={REEL_DURATION}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      <Composition
        id="KaraokeDemo"
        component={KaraokeDemo}
        durationInFrames={KARAOKE_DEMO_FRAMES}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
