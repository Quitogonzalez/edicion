// Primitivas compartidas para las gráficas. Look: infra real de dev
// (no "IA" genérica). Paleta de theme.ts, movimiento con spring, fluido.
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme } from "../../theme";

// ── interpolación de color hex (para encender chips de gris a acento) ───────
const hex = (c: string) => {
  const n = c.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
export const lerpColor = (a: string, b: string, t: number) => {
  const A = hex(a);
  const B = hex(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, t))));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
};

// ── fade de entrada/salida atado a la duración de la Sequence ───────────────
export const useSeqFade = (fadeFrames = 12) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

// ── scrim: oscurece el footage detrás de la gráfica para que resalte ────────
export const Scrim: React.FC<{ opacity: number }> = ({ opacity }) => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse at center, rgba(13,17,23,0.78) 0%, rgba(13,17,23,0.92) 100%)",
      opacity,
    }}
  />
);

// ── chip tipo etiqueta de sistema; `on` 0..1 lo "enciende" a acento ─────────
export const Chip: React.FC<{
  label: string;
  on: number; // 0 = apagado (gris), 1 = activo (acento)
  big?: boolean;
}> = ({ label, on, big }) => {
  const color = lerpColor(theme.colors.textMuted, theme.colors.accent, on);
  const border = lerpColor("#30363D", theme.colors.accent, on);
  return (
    <div
      style={{
        fontFamily: theme.fonts.mono,
        fontWeight: theme.weight.bold,
        fontSize: big ? 44 : 36,
        letterSpacing: -0.5,
        color,
        border: `2px solid ${border}`,
        borderRadius: 16,
        padding: big ? "20px 28px" : "14px 22px",
        background: `rgba(63,185,80,${0.12 * on})`,
        transform: `scale(${1 + 0.04 * on})`,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

// ── conector (línea/flecha que se dibuja). `p` 0..1 = progreso de dibujo ─────
export const Connector: React.FC<{
  p: number;
  vertical?: boolean;
  length: number;
  on?: number;
}> = ({ p, vertical, length, on = 1 }) => {
  const color = lerpColor("#30363D", theme.colors.accent, on);
  const drawn = length * Math.max(0, Math.min(1, p));
  return (
    <div
      style={{
        width: vertical ? 3 : drawn,
        height: vertical ? drawn : 3,
        background: color,
        borderRadius: 2,
        alignSelf: "center",
      }}
    />
  );
};
