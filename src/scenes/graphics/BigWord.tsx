// BigWord — texto GRANDE en MAYÚSCULAS para remates punchy sobre el footage.
// Palabra/frase corta que golpea (ej: "8 MILLONES", "FINITO"). Sin card ni fondo:
// solo tipografía extrabold con sombra fuerte para leerse sobre video.
//
// Tres modos de ENTRADA (mode):
//   • "rise"   → entra deslizándose DESDE ABAJO hacia arriba (translateY grande→0)
//                + fade, ~0.5s, con ease-out. Elegante, "sube a escena".
//   • "impact" → punch de escala (1.35→1) + micro-shake que decae. Sensación de
//                GOLPE. Para remates duros ("IMPRECISO E IMPREDECIBLE").
//   • "pop"    → spring de escala suave (0.82→1). Rebote leve, amable.
//
// AUTO-FIT: la tipografía arranca ~190px y se REDUCE si el texto es largo para
// entrar en el ancho seguro (VIDEO.width − 2·SAFE.side). Podés forzar saltos de
// línea con "\n"; el ajuste mide la línea más ancha. Todo determinista (sin
// Math.random / Date.now): el micro-shake usa trig del frame.
//
// SALIDA: los últimos ~10 frames de la Sequence hacen fade + leve deslizamiento
// hacia abajo (opacity vía useSeqFade, traslación extra acá).
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE, VIDEO } from "../../theme";
import { useSeqFade } from "./_shared";

// Ancho útil: todo el frame menos el margen lateral seguro a cada lado.
const SAFE_WIDTH = VIDEO.width - 2 * SAFE.side; // 1080 − 160 = 920px
// Avance medio por carácter (en "em") para sans extrabold en MAYÚSCULAS con el
// tracking apretado del theme. Calibrado para que frases cortas queden grandes.
const CHAR_ADVANCE = 0.58;
const FONT_MAX = 190; // tamaño de arranque (palabra corta)
const FONT_MIN = 46; // piso para que una frase larga siga siendo legible

// Tamaño auto-ajustado: la línea más ancha debe caber en SAFE_WIDTH.
const fitFontSize = (lines: string[]) => {
  const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
  if (longest === 0) return FONT_MAX;
  const needed = SAFE_WIDTH / (longest * CHAR_ADVANCE);
  return Math.max(FONT_MIN, Math.min(FONT_MAX, needed));
};

export const BigWord: React.FC<{
  text: string; // se muestra en MAYÚSCULAS; "\n" fuerza salto de línea
  mode?: "rise" | "impact" | "pop"; // animación de entrada (default "rise")
  color?: string; // color del texto (default blanco); ignorado si accent
  position?: "center" | "top" | "overhead"; // ubicación vertical (default center)
  accent?: boolean; // true → usa el verde de acento en vez de color/blanco
}> = ({ text, mode = "rise", color = "#FFFFFF", position = "center", accent }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = useSeqFade(10); // envolvente de opacidad: fade-in y fade-out (~10f)

  const lines = text.split("\n");
  const fontSize = fitFontSize(lines);

  // Deslizamiento hacia abajo en la salida (últimos ~10 frames).
  const exitY = interpolate(frame, [durationInFrames - 10, durationInFrames], [0, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── transform por modo ────────────────────────────────────────────────────
  let transform: string;
  if (mode === "impact") {
    // Punch de escala 1.35→1 con ease-out (golpe seco).
    const impactScale = interpolate(frame, [0, 9], [1.35, 1], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    // Micro-shake determinista (trig del frame) que decae en ~12 frames.
    const decay = interpolate(frame, [0, 12], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const shakeX = Math.sin(frame * 2.4) * 9 * decay;
    const shakeY = Math.cos(frame * 3.1) * 5 * decay;
    const rot = Math.sin(frame * 2.4) * 1.2 * decay;
    transform = `translate(${shakeX}px, ${shakeY + exitY}px) scale(${impactScale}) rotate(${rot}deg)`;
  } else if (mode === "pop") {
    // Spring de escala suave 0.82→1 (rebote leve).
    const pop = spring({ frame, fps, config: { damping: 14, stiffness: 170, mass: 0.8 } });
    const popScale = interpolate(pop, [0, 1], [0.82, 1]);
    transform = `translateY(${exitY}px) scale(${popScale})`;
  } else {
    // "rise": entra desde abajo (translateY 130→0) con ease-out en ~0.5s.
    const riseDur = Math.round(fps * 0.5);
    const riseY = interpolate(frame, [0, riseDur], [130, 0], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    transform = `translateY(${riseY + exitY}px)`;
  }

  // ── color + sombra fuerte para legibilidad sobre video ────────────────────
  const finalColor = accent ? theme.colors.accent : color;
  const textShadow = accent
    ? "0 6px 28px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.85), 0 0 40px rgba(63,185,80,0.45)"
    : "0 6px 28px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.85)";

  // ── ubicación vertical ────────────────────────────────────────────────────
  const layout =
    position === "top"
      ? { justifyContent: "flex-start" as const, paddingTop: SAFE.top + 24 }
      : position === "overhead"
        ? { justifyContent: "flex-start" as const, paddingTop: 380 } // ~y 380–560, sobre la cabeza
        : { justifyContent: "center" as const, paddingTop: 0 };

  return (
    <AbsoluteFill style={{ alignItems: "center", ...layout }}>
      <div
        style={{
          opacity: fade,
          transform,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {lines.map((line, i) => (
          <span
            key={i}
            style={{
              fontFamily: theme.fonts.sans, // sans = única familia con extrabold (800) cargado
              fontWeight: theme.weight.extrabold,
              fontSize,
              lineHeight: 0.98,
              letterSpacing: theme.tracking.hook,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              color: finalColor,
              textShadow,
            }}
          >
            {line}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
