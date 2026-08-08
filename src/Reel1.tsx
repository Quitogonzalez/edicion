// Reel1 — composición final (todo en Remotion). v5: correcciones finales.
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { VIDEO } from "./theme";
import { CameraFootage } from "./components/CameraFootage";
import { PopUp } from "./components/PopUp";
import { Vignette } from "./components/Vignette";
import { KaraokeCaptions } from "./components/KaraokeCaptions";
import { ArbolSubagentes } from "./scenes/graphics/ArbolSubagentes";
import { FableTitle } from "./scenes/graphics/FableTitle";
import { ConceptTitle } from "./scenes/graphics/ConceptTitle";
import { AppBuild } from "./scenes/graphics/AppBuild";
import { NewsMontage } from "./scenes/graphics/NewsMontage";
import { XMark } from "./scenes/graphics/XMark";

const F = VIDEO.fps;
export const REEL1_DURATION = 2335; // 77.8s @30fps
const sec = (s: number) => Math.round(s * F);

const FOCUS: [number, number][] = [[46, 64]];
const NEWS = ["pngs/news1.png", "pngs/news2.png", "pngs/news3.png", "pngs/news4.png"];

const SFX: { at: number; src: string; vol?: number }[] = [
  { at: 0.3, src: "riser_big", vol: 0.55 }, // arranque potente
  { at: 4.4, src: "impact", vol: 0.6 }, // "prohibir" + X
  { at: 10.5, src: "whoosh" }, // FABLE 5
  { at: 13.2, src: "pop" }, { at: 14.0, src: "pop" }, { at: 14.8, src: "pop" }, // app
  { at: 16.5, src: "pop", vol: 0.6 }, { at: 17.3, src: "pop", vol: 0.6 },
  { at: 18.1, src: "pop", vol: 0.6 }, { at: 18.9, src: "pop", vol: 0.6 }, // noticias (POP)
  { at: 24.5, src: "pop", vol: 0.65 }, { at: 27.2, src: "pop", vol: 0.65 }, // Trump in/out (POP)
  { at: 30.0, src: "whoosh" }, // IA agéntica
  { at: 46.0, src: "whoosh" }, { at: 47.0, src: "pop" }, { at: 50.5, src: "pop" }, { at: 54.5, src: "pop" },
  { at: 64.0, src: "whoosh" },
];

export const Reel1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <CameraFootage src="reel1_1.1x.mp4" focusBeats={FOCUS} />

      {/* spotlight en énfasis */}
      <Sequence from={sec(3.6)} durationInFrames={sec(3.6)} name="spotlight hook"><Vignette /></Sequence>
      <Sequence from={sec(64)} durationInFrames={sec(4)} name="spotlight tip"><Vignette /></Sequence>

      {/* X en "prohibir" */}
      <Sequence from={sec(4.3)} durationInFrames={sec(1.3)} name="X prohibir"><XMark /></Sequence>

      {/* FABLE 5 */}
      <Sequence from={sec(10.5)} durationInFrames={sec(2.1)} name="FABLE 5"><FableTitle /></Sequence>

      {/* app armándose (landing) */}
      <Sequence from={sec(12.6)} durationInFrames={sec(3.8)} name="App armándose"><AppBuild /></Sequence>

      {/* noticias urgentes */}
      <Sequence from={sec(16.5)} durationInFrames={sec(8)} name="Noticias">
        <NewsMontage startFrame={sec(16.5)} srcs={NEWS} />
      </Sequence>

      {/* Trump como pop-up (vos principal de fondo) */}
      <Sequence from={sec(24.5)} durationInFrames={sec(3.1)} name="Trump popup">
        <PopUp assetSrc="pngs/trump.png" label="// EE.UU." caption="...y lo apagaron para todo el mundo" />
      </Sequence>

      {/* título IA AGÉNTICA (sin subtítulo) */}
      <Sequence from={sec(30)} durationInFrames={sec(3)} name="IA AGÉNTICA"><ConceptTitle text="IA AGÉNTICA" /></Sequence>

      {/* árbol del agente */}
      <Sequence from={sec(46)} durationInFrames={sec(18)} name="Árbol subagentes"><ArbolSubagentes /></Sequence>

      {/* subtítulos (ocultos en módulos full-screen, título y el tip que ya se ve arriba) */}
      <KaraokeCaptions
        captionsSrc="reel1_1.1x.captions.json"
        hideWindows={[
          [10.3, 16.5],
          [16.4, 27.7],
          [29.8, 33.2],
          [65.4, 68.6],
        ]}
      />

      {/* SFX */}
      {SFX.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={F * 2} name={`sfx:${s.src}`}>
          <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={s.vol ?? 0.35} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
