// ─────────────────────────────────────────────────────────────────────────
//  theme.ts — TOKENS DE MARCA (un solo lugar para todo)
//  Cambiar el color de acento aquí lo cambia en TODO el reel.
//  Estética: dev moderno, minimalista y cercano. Fondo oscuro tipo editor.
// ─────────────────────────────────────────────────────────────────────────
import { interFamily, monoFamily } from "./fonts";

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// Safe zones (px): nada importante en el 15% inferior ni en el 10% superior.
export const SAFE = {
  top: Math.round(VIDEO.height * 0.1), // 192px
  bottom: Math.round(VIDEO.height * 0.15), // 288px
  side: 80,
} as const;

export const theme = {
  colors: {
    bg: "#0D1117", // fondo base (no negro puro)
    bgAlt: "#161B22", // paneles / cards
    text: "#E6EDF3", // texto casi-blanco
    textMuted: "#8B949E", // texto secundario
    accent: "#3FB950", // ← EL color de acento. Cambiá SOLO esto para re-marcar.
    accentSoft: "rgba(63,185,80,0.15)",
    stroke: "#010409", // contorno para legibilidad de captions
  },
  fonts: {
    sans: interFamily, // títulos / captions
    mono: monoFamily, // código / datos
  },
  // Pesos: bold para hooks, regular para el resto.
  weight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  radius: 24,
  gap: 32,
  // Tracking (letter-spacing): hooks apretados y premium, casi tocándose.
  tracking: { hook: "-0.03em", body: "-0.01em" },
} as const;

export type Theme = typeof theme;
