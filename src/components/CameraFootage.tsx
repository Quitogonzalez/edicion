// CameraFootage — el footage con "movimiento de cámara" pro:
//  - push lento tipo Ken Burns (vida constante)
//  - punch-ins al ritmo de la voz (énfasis)
//  - micro-drift sutil (la cámara nunca está 100% quieta)
//  - "retroceso" (focusBeats): cuando hay una gráfica full-screen activa, el video
//    baja brillo + blur leve y se aleja un toque, para que el motion graphic resalte.
//  - "realce" (highlightBeats): lo OPUESTO — punch-in suave + más brillo/contraste/
//    saturación + viñeta que oscurece solo los bordes, para dirigir la atención al
//    sujeto (la cara) en beats de énfasis ("cuando digo 3 comandos, ilumíname").
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Keyframes [segundo, escala] — push + punch-ins/primeros planos (footage 1.1x, 0–77.8s).
const ZOOM_T = [0, 3.0, 5.0, 7.6, 10.5, 12.5, 28, 31, 33, 37, 40, 44, 64, 67, 70, 77.8];
const ZOOM_S = [
  1.04, 1.06, 1.14, 1.0, 1.07, 1.0, 1.04, 1.1, 1.02, 1.05, 1.09, 1.0, 1.06, 1.12, 1.03, 1.05,
];

const FADE = 0.35; // s de transición del retroceso
const HL_FADE = 0.4; // s de transición del realce (entrada/salida suave, sin corte)

export const CameraFootage: React.FC<{
  src?: string;
  focusBeats?: [number, number][];
  highlightBeats?: [number, number][];
}> = ({ src = "reel1_1.1x.mp4", focusBeats = [], highlightBeats = [] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const zoom = interpolate(t, ZOOM_T, ZOOM_S, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.ease),
  });

  // micro-drift (cámara viva), determinista y muy sutil
  const driftX = Math.sin(frame / 110) * 9;
  const driftY = Math.cos(frame / 145) * 7;

  // ¿gráfica activa? -> retroceso suave (trapezoide con bordes en fade)
  let recede = 0;
  for (const [a, b] of focusBeats) {
    const up = interpolate(t, [a - FADE, a], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const down = interpolate(t, [b, b + FADE], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    recede = Math.max(recede, Math.min(up, down));
  }

  // ¿beat de realce? -> highlight (mismo trapezoide, pero con easing para un
  // realce fluido). Independiente de recede: ambos pueden estar presentes sin
  // romperse (en la práctica no se solapan; si lo hicieran, se combinan sin crash).
  let highlight = 0;
  for (const [a, b] of highlightBeats) {
    const up = interpolate(t, [a - HL_FADE, a], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    const down = interpolate(t, [b, b + HL_FADE], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    });
    highlight = Math.max(highlight, Math.min(up, down));
  }

  // recede aleja/oscurece/desenfoca; highlight hace punch-in y sube brillo/contraste/
  // saturación. Se multiplican, así que conviven sin pisarse.
  const scale = zoom * (1 - 0.05 * recede) * (1 + 0.08 * highlight); // punch-in ~1.08
  const brightness = (1 - 0.5 * recede) * (1 + 0.08 * highlight);
  const contrast = 1 + 0.1 * highlight;
  const saturate = 1 + 0.15 * highlight;
  const blur = 7 * recede;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${driftX}px, ${driftY}px)`,
          transformOrigin: "center center",
          filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturate}) blur(${blur}px)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </AbsoluteFill>

      {/* Viñeta de realce: oscurece SOLO los bordes (centro transparente) para
          dirigir la atención a la cara. Fija al frame (no se mueve con el video). */}
      {highlight > 0 && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse 78% 66% at center, transparent 42%, rgba(0,0,0,0.55) 100%)",
            opacity: highlight,
            pointerEvents: "none",
          }}
        />
      )}
    </AbsoluteFill>
  );
};
