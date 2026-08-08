// Gráfica — Chart80. Dona/anillo animado que se LLENA hasta un porcentaje
// (default 80%) con el número gigante al centro. On-brand: anillo de acento
// verde sobre pista oscura, número casi-blanco bold, glow sutil del acento.
// El arco se dibuja de 0→value% en ~0.7s con ease-out (stroke-dasharray por
// interpolate) y el número cuenta al mismo ritmo. Va en el TERCIO SUPERIOR
// (centro-arriba) para NO tapar la cara del sujeto, que habla centrado-abajo.
// Todo determinista con el frame (sin Math.random / Date.now).
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { useSeqFade } from "./_shared";

// ── geometría del anillo (coordenadas del <svg>) ───────────────────────────
const SIZE = 440; // lado del SVG (≈ tamaño visible del anillo)
const C = SIZE / 2; // centro (x=y)
const R = 186; // radio de la línea del anillo
const CIRC = 2 * Math.PI * R; // circunferencia
const STROKE = 26; // grosor de pista y arco
const GLOW = 54; // grosor del halo difuso del acento
// El grupo se rota -90° para que el llenado ARRANQUE ARRIBA (12 en punto).
const START_ROT = -90;

// Posición vertical: tope del anillo ~y300 → centro ~y520, base ~y740.
// Queda dentro de la zona segura (top 192 / bottom 1632) y sobre la cabeza
// del sujeto sin taparle la cara.
const TOP_Y = 300;

interface Chart80Props {
  value?: number; // porcentaje objetivo 0..100 (default 80)
  suffix?: string; // sufijo pegado al número (default "%")
  label?: string; // caption chico opcional bajo el número
}

export const Chart80: React.FC<Chart80Props> = ({ value = 80, suffix = "%", label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSeqFade();

  // Entrada premium: pequeño pop de escala con overshoot leve.
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180, mass: 0.8 } });
  const scale = interpolate(pop, [0, 1], [0.86, 1]);

  // Llenado del arco: 0 → 1 en ~0.7s, RÁPIDO y desacelerando al final (ease-out).
  const drawDur = Math.max(1, Math.round(fps * 0.7));
  const startAt = 4;
  const progress = interpolate(frame, [startAt, startAt + drawDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Fracción de circunferencia dibujada (value% del anillo, escalada por progreso).
  const fraction = (Math.max(0, Math.min(100, value)) / 100) * progress;
  const dash = CIRC * fraction;

  // Punta del arco (dentro del grupo rotado): ahí va el punto guía que brilla.
  const tipTheta = fraction * 2 * Math.PI;
  const tipX = C + R * Math.cos(tipTheta);
  const tipY = C + R * Math.sin(tipTheta);
  const tipOpacity = Math.min(1, progress * 5); // aparece apenas arranca el trazo

  // Número al centro: cuenta 0 → value al mismo ritmo que el arco.
  const shown = Math.round(value * progress) + suffix;

  return (
    <AbsoluteFill style={{ opacity: fade, justifyContent: "flex-start", alignItems: "center", paddingTop: TOP_Y }}>
      <div style={{ position: "relative", width: SIZE, height: SIZE, transform: `scale(${scale})` }}>
        {/* scrim local: un halo oscuro contenido detrás del anillo para dar
            contraste sin oscurecer la cara del sujeto (no es full-frame). */}
        <div
          style={{
            position: "absolute",
            inset: -60,
            background: "radial-gradient(circle at center, rgba(13,17,23,0.72) 0%, rgba(13,17,23,0.35) 52%, rgba(13,17,23,0) 72%)",
          }}
        />

        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ position: "relative" }}>
          {/* pista de fondo: anillo oscuro completo (referencia del 100%) */}
          <circle cx={C} cy={C} r={R} fill="none" stroke="#21262D" strokeWidth={STROKE} />

          {/* grupo rotado -90° para que el llenado empiece arriba y vaya horario */}
          <g transform={`rotate(${START_ROT} ${C} ${C})`}>
            {/* halo difuso del acento detrás del arco (glow sutil) */}
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={GLOW}
              strokeOpacity={0.16}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
            />
            {/* arco activo verde: se dibuja de 0 → value% */}
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${CIRC}`}
            />
            {/* punto guía en la punta del arco (con núcleo casi-blanco) */}
            <g opacity={tipOpacity}>
              <circle cx={tipX} cy={tipY} r={STROKE / 2 + 5} fill={theme.colors.accent} opacity={0.35} />
              <circle cx={tipX} cy={tipY} r={STROKE / 2} fill={theme.colors.accent} />
              <circle cx={tipX} cy={tipY} r={6} fill={theme.colors.text} />
            </g>
          </g>
        </svg>

        {/* número + label, centrados dentro del anillo */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: label ? 10 : 0,
          }}
        >
          <span
            style={{
              fontFamily: theme.fonts.sans, // sans = única familia con extrabold (800)
              fontWeight: theme.weight.extrabold,
              fontSize: 132,
              lineHeight: 1,
              letterSpacing: theme.tracking.hook,
              color: theme.colors.text, // casi-blanco
              fontVariantNumeric: "tabular-nums", // el ancho no baila en el conteo
              textShadow: "0 4px 18px rgba(0,0,0,0.6), 0 0 42px rgba(63,185,80,0.45)",
            }}
          >
            {shown}
          </span>
          {label ? (
            <span
              style={{
                fontFamily: theme.fonts.mono,
                fontWeight: theme.weight.regular,
                fontSize: 30,
                letterSpacing: "0.02em",
                color: theme.colors.textMuted,
                textAlign: "center",
                maxWidth: R * 1.6,
              }}
            >
              {label}
            </span>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};
