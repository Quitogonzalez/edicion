// PromptBox — dos modos en un solo componente:
//  1) CAJITA TERMINAL (default): ventana oscura con barra de título (3 dots)
//     donde se "escribe" un prompt con typewriter en acento + cursor ▌. Se usa
//     para el ejemplo "prompt bueno vs malo" (líneas con ❌ y ✓).
//  2) HERO DE COMANDO (prop `command`): el nombre del comando en GRANDE,
//     centrado, como recurso visual principal (mono bold, acento con glow,
//     entrada con blur-in por carácter). Acepta `caption` y `badge`.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE, VIDEO } from "../../theme";
import { Scrim, useSeqFade } from "./_shared";
import { fadeUp, popIn } from "../../components/motion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const DEFAULT_LINES = [
  "/loop hasta cumplir el objetivo:",
  "  ejecuta → revisa → corrige → repite",
];

export const PromptBox: React.FC<{
  title?: string;
  lines?: string[];
  prefix?: string;
  badge?: string; // "" o null para omitir el badge final
  command?: string; // si se pasa → modo HERO (nombre del comando en grande)
  caption?: string; // línea corta descriptiva bajo el comando (solo modo HERO)
  exitSlideUp?: boolean; // modo HERO: en los ÚLTIMOS ~12f el comando vuela hacia ARRIBA + fade
  promptText?: string; // si se pasa → modo PROMPT INPUT (caja de chat con el prompt tipeado)
}> = ({
  title = "claude — agent loop",
  lines = DEFAULT_LINES,
  prefix = "→ ",
  badge = "📌 guardá esto",
  command,
  caption,
  exitSlideUp,
  promptText,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = useSeqFade();

  // ── MODO PROMPT INPUT ──────────────────────────────────────────────────────
  // Caja de input de chat tipo "Think deeply…": panel oscuro redondeado con el
  // prompt tipeándose adentro y una fila inferior de affordances (+ / globo /
  // adjuntar) más un botón de mic a la derecha. On-brand (#161B22 + borde sutil).
  // Muestra SOLO promptText (se usa para el prompt malo del reel).
  if (promptText) {
    const total = promptText.length;
    const typeStart = 16;
    const typeEnd = Math.min(typeStart + total * 1.6, durationInFrames - 20);
    const shown = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, total], clamp));
    const typed = promptText.slice(0, shown);
    const typing = shown < total;
    const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;

    // Iconos sutiles de la fila inferior (stroke gris, sin relleno).
    const iconStroke = theme.colors.textMuted;
    const iconProps = {
      width: 34,
      height: 34,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: iconStroke,
      strokeWidth: 2,
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };

    return (
      <AbsoluteFill style={{ opacity: fade }}>
        <Scrim opacity={1} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingTop: SAFE.top,
            paddingBottom: SAFE.bottom,
            paddingLeft: SAFE.side,
            paddingRight: SAFE.side,
          }}
        >
          <div
            style={{
              ...fadeUp({ frame, fps }),
              width: "100%",
              maxWidth: 880,
              background: theme.colors.bgAlt, // #161B22
              border: "1px solid #30363D",
              borderRadius: 32,
              padding: "40px 42px 30px",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              gap: 42,
            }}
          >
            {/* el prompt, tipeándose */}
            <div
              style={{
                fontFamily: theme.fonts.sans,
                fontWeight: theme.weight.regular,
                fontSize: 46,
                lineHeight: 1.32,
                letterSpacing: theme.tracking.body,
                color: theme.colors.text,
                whiteSpace: "pre-wrap",
                minHeight: 46 * 1.32,
              }}
            >
              {typed}
              <span style={{ opacity: cursorOn ? 1 : 0, color: theme.colors.accent }}>▌</span>
            </div>

            {/* fila inferior: affordances a la izquierda, mic a la derecha */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                {/* + (adjuntar/nuevo) */}
                <svg {...iconProps}>
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {/* globo (buscar en la web) */}
                <svg {...iconProps}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18" />
                  <path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18" />
                </svg>
                {/* clip (adjuntar archivo) */}
                <svg {...iconProps}>
                  <path d="M21 11.5l-8.9 8.9a5 5 0 0 1-7.1-7.1l8.9-8.9a3.3 3.3 0 0 1 4.7 4.7l-8.9 8.9a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9" />
                </svg>
              </div>

              {/* afford de mic/enter, on-brand */}
              <div
                style={{
                  width: 62,
                  height: 62,
                  borderRadius: 99,
                  background: theme.colors.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 24px rgba(63,185,80,0.35)",
                }}
              >
                <svg
                  width={30}
                  height={30}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0D1117"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="3" width="6" height="11" rx="3" />
                  <path d="M5 11a7 7 0 0 0 14 0" />
                  <path d="M12 18v3" />
                </svg>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── MODO HERO ─────────────────────────────────────────────────────────────
  // El comando protagoniza la pantalla: tipografía mono bold enorme, acento con
  // glow sutil y entrada elegante (cada carácter aparece con blur + subida).
  if (command) {
    const chars = [...command];

    // Auto-fit: el mono (JetBrains) avanza ~0.6em por carácter. Ajustamos el
    // tamaño para que el comando entre en la zona segura horizontal.
    const HERO_MAX = 200;
    const HERO_MIN = 96;
    const usableW = VIDEO.width - SAFE.side * 2 - 40;
    const heroSize = Math.max(
      HERO_MIN,
      Math.min(HERO_MAX, usableW / (chars.length * 0.6)),
    );

    // Reveal escalonado por carácter (spread total acotado para comandos largos).
    const heroStart = 10;
    const stagger = Math.min(5, 44 / chars.length);
    const revealEnd = heroStart + chars.length * stagger + 18;

    // Glow que "enciende" al asentarse + respiración muy sutil.
    const settle = interpolate(frame, [heroStart, revealEnd], [0, 1], clamp);
    const pulse = 0.85 + 0.15 * Math.sin(frame / 18);
    const g = settle * pulse;
    const glow =
      `0 0 ${(28 * g).toFixed(1)}px rgba(63,185,80,${(0.5 * g).toFixed(3)}), ` +
      `0 0 ${(64 * g).toFixed(1)}px rgba(63,185,80,${(0.26 * g).toFixed(3)})`;

    // Cursor de terminal que aparece al terminar de revelarse el comando.
    const cursorStart = revealEnd - 4;
    const cursorOn = frame > cursorStart && Math.floor(frame / 15) % 2 === 0;

    const captionDelay = revealEnd - 10;
    const badgeDelay = revealEnd - 2;

    // Salida hero: en los ÚLTIMOS ~12 frames el comando "vuela" fuera de cuadro
    // hacia ARRIBA (translateY negativo grande, con ease-in que acelera) + el fade
    // normal de la Sequence. Sólo si exitSlideUp.
    const exitStart = durationInFrames - 12;
    const exitP = interpolate(frame, [exitStart, durationInFrames], [0, 1], clamp);
    const exitY = exitSlideUp ? -Math.pow(exitP, 2) * 760 : 0;

    return (
      <AbsoluteFill style={{ opacity: fade }}>
        <Scrim opacity={1} />
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            gap: 44,
            paddingTop: SAFE.top,
            paddingBottom: SAFE.bottom,
            paddingLeft: SAFE.side,
            paddingRight: SAFE.side,
          }}
        >
          {/* el comando: recurso visual principal */}
          <div
            style={{
              fontFamily: theme.fonts.mono,
              fontWeight: theme.weight.bold,
              fontSize: heroSize,
              lineHeight: 1,
              letterSpacing: theme.tracking.hook,
              whiteSpace: "pre",
              textAlign: "center",
              color: theme.colors.accent,
              textShadow: glow,
              transform: `translateY(${exitY}px)`,
            }}
          >
            {chars.map((ch, i) => {
              const s = spring({
                frame: frame - heroStart - i * stagger,
                fps,
                config: { damping: 200, mass: 0.8 },
                durationInFrames: 18,
              });
              // el "/" inicial más tenue: lee como sigilo de comando slash.
              const dim = ch === "/" && i === 0;
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    whiteSpace: "pre",
                    opacity: s * (dim ? 0.55 : 1),
                    transform: `translateY(${(1 - s) * 34}px) scale(${
                      0.82 + 0.18 * s
                    })`,
                    filter: `blur(${(1 - s) * 14}px)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
            <span
              style={{
                display: "inline-block",
                marginLeft: heroSize * 0.06,
                opacity: cursorOn ? 1 : 0,
              }}
            >
              ▌
            </span>
          </div>

          {caption ? (
            <div
              style={{
                ...fadeUp({ frame, fps, delay: captionDelay }),
                fontFamily: theme.fonts.sans,
                fontWeight: theme.weight.semibold,
                fontSize: 42,
                letterSpacing: theme.tracking.body,
                color: theme.colors.textMuted,
                textAlign: "center",
                maxWidth: 820,
              }}
            >
              {caption}
            </div>
          ) : null}

          {badge ? (
            <div
              style={{
                ...popIn({ frame, fps, delay: badgeDelay }),
                fontFamily: theme.fonts.sans,
                fontWeight: theme.weight.bold,
                fontSize: 30,
                color: theme.colors.accent,
                border: `2px solid ${theme.colors.accent}`,
                borderRadius: 99,
                padding: "8px 20px",
              }}
            >
              {badge}
            </div>
          ) : null}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  // ── MODO CAJITA TERMINAL (default, sin cambios de comportamiento) ───────────
  // El typewriter recorre el texto TOTAL (líneas concatenadas) char por char.
  const fullText = lines.join("\n");
  const total = fullText.length;

  // Arranca ~frame 20; termina antes del final dejando cola para respirar.
  const typeStart = 20;
  const typeEnd = Math.min(typeStart + total * 1.4, durationInFrames - 24);

  const chars = Math.floor(interpolate(frame, [typeStart, typeEnd], [0, total], clamp));
  const typed = fullText.slice(0, chars);
  const typedLines = typed.split("\n");
  const typing = chars < total;
  const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;

  // Badge opcional que entra al terminar de tipear.
  const badgeStart = Math.min(typeEnd + 8, durationInFrames - 20);
  const badgeOp = interpolate(frame, [badgeStart, badgeStart + 18], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scrim opacity={1} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 24,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
        }}
      >
        <div
          style={{
            ...fadeUp({ frame, fps }),
            width: "100%",
            maxWidth: 880,
            background: theme.colors.bgAlt,
            border: "1px solid #30363D",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* barra de título */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "16px 22px",
              borderBottom: "1px solid #30363D",
            }}
          >
            <span style={{ width: 13, height: 13, borderRadius: 99, background: "#30363D" }} />
            <span style={{ width: 13, height: 13, borderRadius: 99, background: "#30363D" }} />
            <span style={{ width: 13, height: 13, borderRadius: 99, background: theme.colors.accent }} />
            <span
              style={{
                marginLeft: 12,
                fontFamily: theme.fonts.mono,
                fontSize: 24,
                color: theme.colors.textMuted,
              }}
            >
              {title}
            </span>
          </div>
          {/* cuerpo: se escribe línea por línea, con cursor en la última */}
          <div style={{ padding: "28px 26px", fontFamily: theme.fonts.mono, fontSize: 34, lineHeight: 1.5 }}>
            {typedLines.map((line, i) => {
              const isLast = i === typedLines.length - 1;
              return (
                <div
                  key={i}
                  style={{
                    color: theme.colors.accent,
                    fontWeight: theme.weight.bold,
                    whiteSpace: "pre-wrap",
                    marginTop: i === 0 ? 0 : 6,
                  }}
                >
                  {i === 0 ? prefix : null}
                  {line}
                  {isLast ? <span style={{ opacity: cursorOn ? 1 : 0 }}>▌</span> : null}
                </div>
              );
            })}
          </div>
        </div>

        {badge ? (
          <div
            style={{
              opacity: badgeOp,
              fontFamily: theme.fonts.sans,
              fontWeight: theme.weight.bold,
              fontSize: 30,
              color: theme.colors.accent,
              border: `2px solid ${theme.colors.accent}`,
              borderRadius: 99,
              padding: "8px 20px",
            }}
          >
            {badge}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
