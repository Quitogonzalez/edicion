// Gráfica — Enjambre de agentes. Para ilustrar `/ultra goal` ("lanza un
// enjambre de agentes"): desde UN origen central emanan N logos de Claude que
// aparecen escalonados (stagger), crecen de chico a normal y se dispersan en
// 360° hacia afuera. Da la sensación de MUCHOS Claudes trabajando en paralelo.
// 100% determinista: todo depende de useCurrentFrame + el índice del agente
// (la variación orgánica se deriva con funciones trig del índice, NO random).
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE } from "../../theme";
import { Chip, Scrim, useSeqFade } from "./_shared";

export interface AgentSwarmProps {
  count?: number; // cuántos logos de Claude emanan del origen
  label?: string; // etiqueta del origen central (el comando que dispara el enjambre)
  caption?: string; // texto de apoyo abajo
}

// ── Ritmo de aparición (frames) ─────────────────────────────────────────────
const CENTER_IN = 8; // el origen aparece
const FIRST_AGENT = 16; // primer logo emana
const STAGGER = 8; // separación entre logos (efecto enjambre en ráfaga)
const SPREAD = 330; // dispersión base hacia afuera (px)
const BASE_SIZE = 150; // tamaño normal del logo (px)
const ORIGIN_TOP = "46%"; // origen en zona media-alta: deja libre el centro-inferior (el sujeto)

const CLAUDE_LOGO = staticFile("pngs/logo_claude.png");

export const AgentSwarm: React.FC<AgentSwarmProps> = ({
  count = 14,
  label = "1 objetivo",
  caption = "un enjambre de agentes en paralelo",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSeqFade();

  // El origen central se "enciende" a acento.
  const onCenter = interpolate(frame, [CENTER_IN, CENTER_IN + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Estado determinista de cada logo a partir de su índice.
  const agents = Array.from({ length: count }, (_, i) => {
    const delay = FIRST_AGENT + i * STAGGER;
    const age = frame - delay;

    // Dirección repartida en toda la circunferencia (arranca arriba, -90°) con
    // un leve jitter derivado del índice para que no queden simétricos.
    const angleDeg = -90 + i * (360 / count) + Math.sin(i * 2.3) * 10;
    const rad = (angleDeg * Math.PI) / 180;

    // Variación orgánica derivada del índice (sin Math.random): cada logo tiene
    // radio, tamaño y ligera rotación distintos, cambiando suave de uno a otro.
    const radiusVar = 0.85 + 0.3 * (0.5 + 0.5 * Math.cos(i * 1.7)); // 0.85–1.15
    const sizeVar = 0.72 + 0.4 * (0.5 + 0.5 * Math.sin(i * 1.3 + 1)); // 0.72–1.12
    const rot = Math.sin(i * 1.9) * 16; // inclinación estática por logo

    // Pop con spring (escala): emerge chico y llega a tamaño normal (con leve
    // overshoot orgánico). Velocidad del pop también varía por índice.
    const appear = spring({
      frame: age,
      fps,
      config: { damping: 13, mass: 0.55 },
      durationInFrames: Math.round(22 + 6 * Math.sin(i * 0.8)),
    });
    const scale = 0.2 + 0.8 * appear;

    // Deriva hacia afuera: 0 = en el origen, sigue expandiéndose despacio (el
    // enjambre no se congela, se dispersa).
    const drift = interpolate(age, [0, 26, 130], [0, 1, 1.14], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Fade-in al emerger + leve fade-out al final (se disipa a lo lejos).
    const opacity = interpolate(age, [0, 10, 120, 160], [0, 1, 1, 0.72], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const target = SPREAD * radiusVar;
    return {
      i,
      delay,
      x: target * Math.cos(rad) * drift,
      y: target * Math.sin(rad) * drift,
      size: BASE_SIZE * sizeVar,
      scale,
      opacity,
      rot,
    };
  });

  // Contador que sube: cuántos agentes ya se lanzaron.
  const lanzados = agents.filter((a) => frame >= a.delay + 4).length;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scrim opacity={1} />
      <AbsoluteFill
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            letterSpacing: 4,
            color: theme.colors.textMuted,
          }}
        >
          // ENJAMBRE DE AGENTES
        </div>

        {/* zona del enjambre: origen central + logos de Claude emanando */}
        <div
          style={{
            position: "relative",
            flex: 1,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* logos de Claude que emanan del origen (debajo del origen) */}
          {agents.map((a) => (
            <div
              key={`a-${a.i}`}
              style={{
                position: "absolute",
                left: "50%",
                top: ORIGIN_TOP,
                transform: `translate(-50%, -50%) translate(${a.x}px, ${a.y}px) scale(${a.scale}) rotate(${a.rot}deg)`,
                opacity: a.opacity,
                filter: "drop-shadow(0 6px 18px rgba(0,0,0,0.45))",
              }}
            >
              <Img
                src={CLAUDE_LOGO}
                style={{ width: a.size, height: a.size, display: "block" }}
              />
            </div>
          ))}

          {/* origen central: el comando que dispara el enjambre (encima) */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: ORIGIN_TOP,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Chip label={label} on={onCenter} big />
          </div>
        </div>

        {/* contador que sube + caption */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontWeight: theme.weight.bold,
              fontSize: 42,
              letterSpacing: -0.5,
              color: theme.colors.accent,
            }}
          >
            {lanzados} agentes en paralelo
          </div>
          <div
            style={{
              fontFamily: theme.fonts.sans,
              fontSize: 30,
              fontWeight: theme.weight.regular,
              letterSpacing: theme.tracking.body,
              color: theme.colors.textMuted,
              textAlign: "center",
            }}
          >
            {caption}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
