// Gráfica — LoopRing. Ilustra el comando /loop: "corre tu prompt en bucle
// según un intervalo (ej. cada 15 min)". Look: scheduler/cron de dev,
// minimalista y verde terminal. Un anillo se dibuja y gira sin parar, con
// una flecha en la punta (↻) y un contador de corridas que incrementa,
// dando sensación de repetición infinita. Todo determinista con el frame.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, SAFE } from "../../theme";
import { Scrim, useSeqFade, lerpColor } from "./_shared";

// ── geometría del anillo (coordenadas del <svg>) ───────────────────────────
const SIZE = 520; // lado del SVG
const C = SIZE / 2; // centro (x=y)
const R = 210; // radio del anillo
const CIRC = 2 * Math.PI * R; // circunferencia
const ARC = 0.72; // fracción del anillo que ocupa el arco activo
const SPEED = 4; // grados por frame → una vuelta cada 90 frames (3s)

interface LoopRingProps {
  interval?: string; // texto central: el intervalo del scheduler
  label?: string; // etiqueta/comando arriba
  caption?: string; // pie de página
}

export const LoopRing: React.FC<LoopRingProps> = ({
  interval = "cada 15 min",
  label = "/loop",
  caption = "repite tu prompt en bucle",
}) => {
  const frame = useCurrentFrame();
  const fade = useSeqFade();

  // dibujado inicial del arco (0 → ARC) y encendido del color (gris → acento)
  const drawT = interpolate(frame, [6, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arcFraction = ARC * drawT;
  const arcColor = lerpColor(theme.colors.textMuted, theme.colors.accent, drawT);

  // rotación continua del grupo (spinner que nunca se detiene)
  const rotation = frame * SPEED;

  // punta del arco (antes de la rotación del grupo) → ahí va la flecha
  const tipAngleDeg = arcFraction * 360;
  const tipRad = (tipAngleDeg * Math.PI) / 180;
  const tipX = C + R * Math.cos(tipRad);
  const tipY = C + R * Math.sin(tipRad);

  // contador de corridas: incrementa una unidad por cada vuelta completa
  const corrida = Math.floor(rotation / 360) + 1;
  // flash sutil al reiniciar cada vuelta (sensación de "corre otra vez")
  const loopFrac = (rotation / 360) % 1;
  const flash = Math.max(0, 1 - loopFrac * 8);
  const centerScale = 1 + 0.05 * flash;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scrim opacity={1} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 56,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
        }}
      >
        {/* etiqueta / comando */}
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 40,
            fontWeight: theme.weight.bold,
            letterSpacing: -0.5,
            color: theme.colors.accent,
            border: `2px solid ${theme.colors.accent}`,
            borderRadius: 16,
            padding: "14px 28px",
            background: theme.colors.accentSoft,
          }}
        >
          {label}
        </div>

        {/* anillo + texto central */}
        <div style={{ position: "relative", width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* pista fija: marcas tipo reloj/cron (no rota, sirve de referencia) */}
            <circle
              cx={C}
              cy={C}
              r={R}
              fill="none"
              stroke="#30363D"
              strokeWidth={10}
              strokeDasharray="3 30"
              strokeLinecap="round"
            />
            {/* grupo que gira: glow + arco activo + flecha en la punta */}
            <g transform={`rotate(${rotation} ${C} ${C})`}>
              {/* glow difuso detrás del arco */}
              <circle
                cx={C}
                cy={C}
                r={R}
                fill="none"
                stroke={theme.colors.accent}
                strokeWidth={30}
                strokeOpacity={0.18}
                strokeDasharray={`${CIRC * arcFraction} ${CIRC}`}
                strokeLinecap="round"
              />
              {/* arco activo (se dibuja de 0 a ARC) */}
              <circle
                cx={C}
                cy={C}
                r={R}
                fill="none"
                stroke={arcColor}
                strokeWidth={16}
                strokeDasharray={`${CIRC * arcFraction} ${CIRC}`}
                strokeLinecap="round"
              />
              {/* flecha en la punta del arco, orientada en el sentido del giro */}
              <g transform={`translate(${tipX} ${tipY}) rotate(${tipAngleDeg + 90})`}>
                <polygon points="20,0 -14,-16 -14,16" fill={theme.colors.accent} />
              </g>
            </g>
          </svg>

          {/* texto central: intervalo (hero) + contador de corridas */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              transform: `scale(${centerScale})`,
            }}
          >
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 26,
                letterSpacing: 4,
                color: theme.colors.textMuted,
              }}
            >
              // INTERVALO
            </div>
            <div
              style={{
                fontFamily: theme.fonts.sans,
                fontSize: 64,
                fontWeight: theme.weight.bold,
                letterSpacing: theme.tracking.hook,
                color: theme.colors.text,
                textAlign: "center",
              }}
            >
              {interval}
            </div>
            <div
              style={{
                fontFamily: theme.fonts.mono,
                fontSize: 34,
                fontWeight: theme.weight.semibold,
                letterSpacing: -0.5,
                color: theme.colors.accent,
              }}
            >
              ↻ corrida #{corrida}
            </div>
          </div>
        </div>

        {/* pie de página (opcional) */}
        {caption ? (
          <div
            style={{
              fontFamily: theme.fonts.sans,
              fontSize: 38,
              fontWeight: theme.weight.regular,
              letterSpacing: theme.tracking.body,
              color: theme.colors.textMuted,
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
