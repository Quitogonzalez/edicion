// StatPunch — dato/cifra que GOLPEA. Un número grande que entra con impacto
// (spring + overshoot). Tres modos, misma API compatible con el uso original:
//   • CLÁSICO   → card con número + label (ej: <StatPunch value="80%" label="pago" />).
//   • BARE      → SOLO el número gigante, sin línea de label debajo. Se activa al
//                 omitir `label`, o forzando `bare`. Sin card: número desnudo con glow.
//   • CONTADOR  → `countTo` anima el número 0→N rápido (~0.7s, desacelerando al
//                 final) con separador de miles y `suffix` pegado (ej "370K"). Se
//                 ubica en el TERCIO SUPERIOR, sobre la cabeza del sujeto sin taparle
//                 la cara; número MUY grande, bold y con el glow de la marca.
// El resto de modos va como CALLOUT en la franja superior (debajo de SAFE.top) para
// NO tapar la cara del creador, que habla en el centro del encuadre.
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE, VIDEO } from "../../theme";
import { useSeqFade } from "./_shared";

// ── parseo del prefijo numérico para el count-up del string `value` ──────────
//    "8M" -> {target:8, suffix:"M"}   "80%" -> {target:80, suffix:"%"}
//    "300K" -> {target:300, suffix:"K"}   "GRATIS" -> null (pop del string)
const parseNumeric = (v: string) => {
  const m = v.trim().match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const raw = m[1];
  const sep = raw.includes(",") ? "," : ".";
  const decimals = /[.,]/.test(raw) ? raw.split(/[.,]/)[1].length : 0;
  return { target: parseFloat(raw.replace(",", ".")), suffix: m[2], decimals, sep };
};

const formatNum = (n: number, decimals: number, sep: string) => {
  const s = n.toFixed(decimals);
  return sep === "," ? s.replace(".", ",") : s;
};

// Separador de miles "." (estilo es-CL), determinista y sin depender del locale.
//    370 -> "370"   1500 -> "1.500"   370000 -> "370.000"
const groupThousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");

export const StatPunch: React.FC<{
  value?: string; // cifra literal a resaltar, ej "8M" (opcional si se usa countTo)
  label?: string; // qué es esa cifra; si se OMITE → modo BARE (solo el número, sin subtítulo)
  countTo?: number; // activa el CONTADOR animado 0→countTo (ej 370)
  suffix?: string; // sufijo pegado al número del contador, ej "K" → "370K"
  bare?: boolean; // fuerza modo BARE aunque se pase label
  position?: "top" | "center"; // dónde va (default top; el contador sube al tercio superior)
  icon?: string; // emoji opcional, ej "👁️"
}> = ({ value, label, countTo, suffix, bare, position = "top", icon }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSeqFade(12);

  const isCounter = countTo !== undefined;
  const showLabel = !bare && !!label; // BARE = sin label ⇒ nada de línea vacía ocupando espacio
  const showCard = showLabel && !isCounter; // el card enmarca el par número+label del modo clásico
  const naked = !showCard; // BARE y CONTADOR van sin card: número desnudo con glow

  // Punch: escala 0.6 -> 1 con overshoot (damping bajo = rebote leve).
  const punch = spring({ frame, fps, config: { damping: 12, stiffness: 200, mass: 0.7 } });
  const scale = interpolate(punch, [0, 1], [0.6, 1]);

  // CONTADOR: 0 -> countTo en ~0.7s, RÁPIDO y desacelerando al final (Easing.out).
  const countDur = Math.max(1, Math.round(fps * 0.7));
  const countProgress = interpolate(frame, [0, countDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const counterShown = groupThousands(Math.round((countTo ?? 0) * countProgress)) + (suffix ?? "");

  // CLÁSICO/BARE: count-up rápido sin rebote (damping alto) atado al string `value`.
  const numeric = value ? parseNumeric(value) : null;
  const count = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 16 });
  const valueShown = numeric
    ? formatNum(numeric.target * count, numeric.decimals, numeric.sep) + numeric.suffix
    : value ?? "";

  const shown = isCounter ? counterShown : valueShown;

  // Ubicación: el CONTADOR sube al tercio superior (~18% desde arriba) para quedar
  // SOBRE LA CABEZA del sujeto sin taparle la cara; el resto usa la franja de siempre.
  const overheadPad = Math.round(VIDEO.height * 0.18); // ~346px
  const paddingTop = position === "center" ? 0 : isCounter ? overheadPad : SAFE.top + 24;

  // El contador va MUY grande; con card queda el drop-shadow de siempre, desnudo suma glow de marca.
  const valueFontSize = isCounter ? 200 : 128;
  const valueTextShadow = naked
    ? "0 6px 24px rgba(0,0,0,0.75), 0 0 48px rgba(63,185,80,0.5)"
    : "0 6px 24px rgba(0,0,0,0.7)";

  return (
    <AbsoluteFill
      style={{
        justifyContent: position === "center" ? "center" : "flex-start",
        alignItems: "center",
        paddingTop,
      }}
    >
      <div
        style={{
          opacity: fade,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: showLabel ? 6 : 0,
          ...(showCard
            ? {
                padding: "26px 48px",
                // fondo = theme.colors.bgAlt (#161B22) con transparencia + blur suave
                background: "rgba(22,27,34,0.82)",
                border: "2px solid rgba(63,185,80,0.55)",
                borderRadius: theme.radius,
                boxShadow: "0 24px 70px rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
              }
            : {}),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {icon ? (
            <span style={{ fontSize: 72, lineHeight: 1, filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.6))" }}>
              {icon}
            </span>
          ) : null}
          <span
            style={{
              fontFamily: theme.fonts.sans, // sans = única familia con extrabold (800) cargado
              fontWeight: theme.weight.extrabold,
              fontSize: valueFontSize,
              lineHeight: 1,
              letterSpacing: theme.tracking.hook,
              color: theme.colors.accent,
              // tabular-nums evita que el ancho baile durante el count-up
              fontVariantNumeric: "tabular-nums",
              textShadow: valueTextShadow,
            }}
          >
            {shown}
          </span>
        </div>
        {showLabel ? (
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontWeight: theme.weight.regular,
              fontSize: 32,
              letterSpacing: "0.02em",
              color: theme.colors.textMuted,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
