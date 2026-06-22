// Demo de subtítulos karaoke sobre fondo de marca.
// En un reel real, debajo de los captions iría tu footage:
//   <OffthreadVideo src={staticFile("footage-cortado.mp4")} />  (capa de abajo)
//   <KaraokeCaptions captionsSrc="mi-reel.json" />              (capa de arriba)
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { KaraokeCaptions } from "../components/KaraokeCaptions";

export const KARAOKE_DEMO_FRAMES = 90; // 3s @30fps

export const KaraokeDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg }}>
      <KaraokeCaptions captionsSrc="sample-captions.json" />
    </AbsoluteFill>
  );
};
