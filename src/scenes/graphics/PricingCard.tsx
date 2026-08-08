// Gráfica — PLANES DE PRECIO. Para el momento en que el sujeto dice "necesitas
// pagar el Plan Pro de 20 dólares como mínimo". Dos tarjetas pricing lado a lado:
//   • PRO ($20/mes)  → DESTACADA: borde/acento verde, glow sutil (respira), badge
//                       "mínimo para empezar" y 2 bullets. Es el foco visual.
//   • MAX ($100/mes) → ATENUADA: gris, menor opacidad, 1 bullet. Queda en segundo
//                       plano para comunicar que $20 es el piso.
// Entrada elegante y escalonada: cada tarjeta entra con spring (scale + fade),
// primero Pro, luego Max; el badge y los bullets aparecen en cascada. 100%
// determinista (todo depende de useCurrentFrame + índice; sin Math.random/Date.now).
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE } from "../../theme";
import { useSeqFade } from "./_shared";

export interface PricingCardProps {
  proPrice?: string; // precio del plan destacado (mono), ej "$20"
  proPeriod?: string; // periodo pegado al precio, ej "/mes"
  proBadge?: string; // etiqueta flotante sobre la tarjeta Pro
  proBullets?: string[]; // 2 bullets cortos del plan Pro
  maxPrice?: string; // precio del plan secundario/atenuado, ej "$100"
  maxPeriod?: string; // periodo del plan secundario
  maxBullets?: string[]; // 1 bullet del plan Max
}

// ── Ritmo de entrada (frames) ───────────────────────────────────────────────
const PRO_IN = 4; // la tarjeta Pro entra primero (es el foco)
const MAX_IN = 14; // la tarjeta Max entra después, más discreta
const BADGE_IN = 16; // el badge cae sobre la Pro una vez asentada
const BULLET_STAGGER = 6; // cascada entre bullets

// ── Bullet: check de item. `accent` lo pinta a verde (Pro) o gris (Max) ──────
const Bullet: React.FC<{ text: string; accent?: boolean; appear: number }> = ({
  text,
  accent,
  appear,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      opacity: appear,
      transform: `translateX(${interpolate(appear, [0, 1], [-12, 0])}px)`,
    }}
  >
    <span
      style={{
        fontFamily: theme.fonts.mono,
        fontWeight: theme.weight.bold,
        fontSize: 30,
        lineHeight: 1,
        color: accent ? theme.colors.accent : theme.colors.textMuted,
      }}
    >
      {accent ? "✓" : "–"}
    </span>
    <span
      style={{
        fontFamily: theme.fonts.sans,
        fontWeight: theme.weight.regular,
        fontSize: 30,
        letterSpacing: theme.tracking.body,
        color: accent ? theme.colors.text : theme.colors.textMuted,
      }}
    >
      {text}
    </span>
  </div>
);

// ── Tarjeta de plan ─────────────────────────────────────────────────────────
const PlanCard: React.FC<{
  name: string;
  price: string;
  period: string;
  bullets: string[];
  highlighted?: boolean;
  badge?: string;
  delay: number;
  frame: number;
  fps: number;
}> = ({ name, price, period, bullets, highlighted, badge, delay, frame, fps }) => {
  // Entrada: spring scale + fade. La Pro tiene un leve overshoot (damping bajo)
  // para que "salte" hacia adelante; la Max entra más sobria.
  const s = spring({
    frame: frame - delay,
    fps,
    config: highlighted
      ? { damping: 12, stiffness: 200, mass: 0.7 }
      : { damping: 18, stiffness: 180, mass: 0.8 },
  });
  const appear = interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(s, [0, 1], [0.82, 1]);

  // Glow que respira (determinista): sólo en la Pro y una vez asentada.
  const breathe = 0.5 + 0.5 * Math.sin((frame - delay) / 15);
  const glow = highlighted ? appear * (0.35 + 0.35 * breathe) : 0;

  // Badge flotante: cae con su propio spring, ya asentada la tarjeta.
  const bs = spring({ frame: frame - BADGE_IN, fps, config: { damping: 13, mass: 0.6 } });
  const badgeAppear = interpolate(bs, [0, 0.6], [0, 1], { extrapolateRight: "clamp" });

  // La Max queda atenuada: menos opacidad global para pesar menos que la Pro.
  const cardOpacity = appear * (highlighted ? 1 : 0.62);

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        opacity: cardOpacity,
        transform: `scale(${scale}) translateY(${highlighted ? 0 : 14}px)`,
        display: "flex",
        flexDirection: "column",
        gap: 22,
        padding: highlighted ? "44px 34px 40px" : "38px 30px 34px",
        borderRadius: theme.radius,
        border: `${highlighted ? 3 : 2}px solid ${
          highlighted ? theme.colors.accent : "#30363D"
        }`,
        background: highlighted
          ? "linear-gradient(180deg, rgba(63,185,80,0.12) 0%, rgba(22,27,34,0.9) 60%)"
          : "rgba(22,27,34,0.72)",
        boxShadow: highlighted
          ? `0 24px 70px rgba(0,0,0,0.55), 0 0 ${
              40 + 40 * glow
            }px rgba(63,185,80,${0.25 + 0.4 * glow})`
          : "0 18px 50px rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
      }}
    >
      {/* Badge flotante sobre el borde superior (sólo Pro) */}
      {badge ? (
        <div
          style={{
            position: "absolute",
            top: -26,
            left: "50%",
            transform: `translateX(-50%) scale(${interpolate(badgeAppear, [0, 1], [0.7, 1])})`,
            opacity: badgeAppear,
            fontFamily: theme.fonts.mono,
            fontWeight: theme.weight.bold,
            fontSize: 26,
            letterSpacing: "-0.01em",
            color: theme.colors.bg,
            background: theme.colors.accent,
            borderRadius: 999,
            padding: "10px 24px",
            whiteSpace: "nowrap",
            boxShadow: "0 8px 24px rgba(63,185,80,0.4)",
          }}
        >
          {badge}
        </div>
      ) : null}

      {/* Nombre del plan */}
      <div
        style={{
          fontFamily: theme.fonts.mono,
          fontWeight: theme.weight.bold,
          fontSize: 34,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: highlighted ? theme.colors.accent : theme.colors.textMuted,
        }}
      >
        {name}
      </div>

      {/* Precio: mono, gigante, con /periodo pegado */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: theme.weight.bold,
            fontSize: highlighted ? 118 : 92,
            lineHeight: 1,
            letterSpacing: theme.tracking.hook,
            color: highlighted ? theme.colors.text : theme.colors.textMuted,
            fontVariantNumeric: "tabular-nums",
            textShadow: highlighted
              ? "0 6px 24px rgba(0,0,0,0.6), 0 0 40px rgba(63,185,80,0.3)"
              : "0 6px 24px rgba(0,0,0,0.5)",
          }}
        >
          {price}
        </span>
        <span
          style={{
            fontFamily: theme.fonts.mono,
            fontWeight: theme.weight.regular,
            fontSize: 34,
            color: theme.colors.textMuted,
          }}
        >
          {period}
        </span>
      </div>

      {/* Separador fino */}
      <div
        style={{
          height: 2,
          width: "100%",
          background: highlighted
            ? "rgba(63,185,80,0.35)"
            : "rgba(139,148,158,0.2)",
          borderRadius: 2,
        }}
      />

      {/* Bullets en cascada */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {bullets.map((b, i) => {
          const bAppear = interpolate(
            frame,
            [delay + 10 + i * BULLET_STAGGER, delay + 22 + i * BULLET_STAGGER],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return <Bullet key={`b-${i}`} text={b} accent={highlighted} appear={bAppear} />;
        })}
      </div>
    </div>
  );
};

export const PricingCard: React.FC<PricingCardProps> = ({
  proPrice = "$20",
  proPeriod = "/mes",
  proBadge = "mínimo para empezar",
  proBullets = ["Claude Code / Codex", "el piso para usar esto"],
  maxPrice = "$100",
  maxPeriod = "/mes",
  maxBullets = ["20× más uso"],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSeqFade();

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(13,17,23,0.82) 0%, rgba(13,17,23,0.94) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 44,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
        }}
      >
        {/* dos tarjetas lado a lado */}
        <div
          style={{
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            gap: theme.gap,
            width: "100%",
          }}
        >
          <PlanCard
            name="Pro"
            price={proPrice}
            period={proPeriod}
            bullets={proBullets}
            badge={proBadge}
            highlighted
            delay={PRO_IN}
            frame={frame}
            fps={fps}
          />
          <PlanCard
            name="Max"
            price={maxPrice}
            period={maxPeriod}
            bullets={maxBullets}
            delay={MAX_IN}
            frame={frame}
            fps={fps}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
