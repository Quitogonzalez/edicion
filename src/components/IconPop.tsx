// IconPop — 1 o 2 logos/íconos en fila que aparecen rápido ARRIBA del sujeto y
// salen rápido (entra y sale con spring). Acompaña lo que dice el hablante sin
// taparle la cara. Ej: logo Twitter (chip), dúo codex+claude_code, detective
// (tintWhite). Patrón Img+staticFile+spring in/out, igual que PopUp.
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SAFE } from "../theme";

type Position = "overhead" | "top" | "center";

// Borde superior de la fila según la zona pedida. Todas quedan por ENCIMA del
// centro (960) para no tapar la cara del sujeto.
const TOP_BY_POSITION: Record<Position, number> = {
  top: SAFE.top + 20, // ~212px, pegado al margen seguro superior
  overhead: 320, // ~y 320-640, justo arriba de la cabeza (default)
  center: 660, // alto pero todavía por encima del centro
};

export const IconPop: React.FC<{
  srcs: string[]; // 1-2 rutas dentro de public/ (ej: ["pngs/twitter.png"])
  size?: number; // alto/lado de cada ícono (default 280)
  position?: Position; // default "overhead"
  tintWhite?: boolean; // filter brightness(0) invert(1) → íconos oscuros a blanco
  chip?: boolean; // tarjeta clara redondeada bajo cada ícono (logos con fondo)
  gap?: number; // separación entre íconos (default 40)
}> = ({ srcs, size = 280, position = "overhead", tintWhite = false, chip = false, gap = 40 }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrada: pop rápido (escala 0→1 + fade).
  const inS = spring({ frame, fps, config: { damping: 14, stiffness: 220, mass: 0.6 } });
  // Salida: fade+scale en los últimos ~12 frames de la Sequence.
  const OUT = 12;
  const outS = spring({ frame: frame - (durationInFrames - OUT), fps, config: { damping: 200 } });

  const scale = interpolate(inS, [0, 1], [0, 1]) * interpolate(outS, [0, 1], [1, 0.7]);
  const opacity = Math.min(inS, 1) * (1 - outS);

  const icons = srcs.slice(0, 2); // máximo 2

  // filtro combinado: tinte blanco opcional + sombra para legibilidad sobre video
  const imgFilter = [
    tintWhite ? "brightness(0) invert(1)" : "",
    "drop-shadow(0 14px 34px rgba(0,0,0,0.55))",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: TOP_BY_POSITION[position],
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {icons.map((s, i) =>
          chip ? (
            <div
              key={`${s}-${i}`}
              style={{
                background: "#FFFFFF",
                borderRadius: 40,
                padding: Math.round(size * 0.14),
                boxShadow: "0 26px 64px rgba(0,0,0,0.5)",
                display: "flex",
              }}
            >
              <Img
                src={staticFile(s)}
                style={{
                  width: size,
                  height: size,
                  objectFit: "contain",
                  filter: tintWhite ? "brightness(0) invert(1)" : undefined,
                }}
              />
            </div>
          ) : (
            <Img
              key={`${s}-${i}`}
              src={staticFile(s)}
              style={{
                width: size,
                height: size,
                objectFit: "contain",
                filter: imgFilter,
              }}
            />
          ),
        )}
      </div>
    </AbsoluteFill>
  );
};
