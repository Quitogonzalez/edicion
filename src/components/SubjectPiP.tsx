// SubjectPiP — "picture-in-picture" del sujeto para beats split-screen.
//   Muestra al MISMO sujeto (mismo video, mismo instante GLOBAL) dentro de un
//   recuadro redondeado. Pensado para un split-screen: arriba una gráfica, abajo
//   el sujeto en este recuadro.
//
//   SINCRONÍA (lo crítico): este componente se monta dentro de un
//   <Sequence from={X}>, y dentro de una Sequence el tiempo del video arranca en
//   0. Para que el fotograma del PiP coincida EXACTO con el footage de fondo en el
//   tiempo global, se expone `startFromSec` y se pasa como
//   `startFrom={Math.round(startFromSec * fps)}` a OffthreadVideo. Como
//   plaza_base.mp4 dura lo mismo que el reel, colocar el PiP en
//   <Sequence from={sec(52.5)}> con startFromSec={52.5} muestra el footage en
//   t=52.5s global (idéntico al fondo).
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../theme";

export const SubjectPiP: React.FC<{
  /** Segundo GLOBAL desde el que arranca el video (debe igualar el `from` de la Sequence en segundos). */
  startFromSec: number;
  /** Ruta dentro de public/. Por defecto el mismo footage crudo que el fondo. */
  src?: string;
  width?: number;
  height?: number;
  /** Encuadre del sujeto dentro del recuadro (CSS object-position). Sube el % para mostrar más abajo (menos techo/TV). */
  objectPosition?: string;
  /** Override de posicionamiento del recuadro (se aplica al recuadro). */
  style?: React.CSSProperties;
}> = ({
  startFromSec,
  src = "plaza_base.mp4",
  width = 620,
  height = 820,
  objectPosition = "50% 50%",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrada: spring de escala 0.9→1 + fade, en ~0.4s.
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: Math.round(0.4 * fps),
  });
  const scale = interpolate(entrance, [0, 1], [0.9, 1]);
  const opacity = entrance;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 96,
      }}
    >
      <div
        style={{
          width,
          height,
          borderRadius: 28,
          overflow: "hidden",
          border: "2px solid rgba(63,185,80,0.5)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
          backgroundColor: theme.colors.bg,
          transform: `scale(${scale})`,
          opacity,
          ...style,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          startFrom={Math.round(startFromSec * fps)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
