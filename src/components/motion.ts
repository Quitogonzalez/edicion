// ─────────────────────────────────────────────────────────────────────────
//  motion.ts — helpers de animación reutilizables (consistencia en todo el reel)
//  Movimiento: sutil y con intención. Entradas con spring, nada lineal seco.
// ─────────────────────────────────────────────────────────────────────────
import { interpolate, spring } from "remotion";

type Base = { frame: number; fps: number; delay?: number };

/** Entrada suave hacia arriba + fade. Para títulos, líneas de texto, cards. */
export const fadeUp = ({
  frame,
  fps,
  delay = 0,
  distance = 40,
  duration = 22,
}: Base & { distance?: number; duration?: number }) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 200 },
    durationInFrames: duration,
  });
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [distance, 0])}px)`,
  };
};

/** Pop con leve rebote. Para énfasis, números, badges, íconos. */
export const popIn = ({
  frame,
  fps,
  delay = 0,
  duration = 18,
}: Base & { duration?: number }) => {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 140, mass: 0.6 },
    durationInFrames: duration,
  });
  return {
    opacity: interpolate(s, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
    transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
  };
};

/** Fade simple (entrada/salida) por rango de frames. */
export const fadeInOut = ({
  frame,
  fps,
  inAt = 0,
  outAt,
  fade = 8,
}: { frame: number; fps: number; inAt?: number; outAt?: number; fade?: number }) => {
  const fadeIn = interpolate(frame, [inAt, inAt + fade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut =
    outAt === undefined
      ? 1
      : interpolate(frame, [outAt - fade, outAt], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  return { opacity: Math.min(fadeIn, fadeOut) };
};
