// TweetCard — recrea una tarjeta de tweet de X/Twitter (dark mode) como overlay,
// para citar un tweet viral que se menciona en el video. Vos (footage) quedáis
// atenuado detrás con un scrim suave; la tarjeta entra y sale con spring (mismo
// patrón que PopUp). Props con defaults tipo placeholder para reemplazar luego.
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE, VIDEO } from "../theme";
import { Scrim, useSeqFade } from "../scenes/graphics/_shared";

// Azul "verificado" de X (no está en el theme porque es color de marca ajena).
const X_BLUE = "#1D9BF0";

// Ancho máximo respetando SAFE.side a ambos lados (1080 - 2*80 = 920).
const VIDEO_SIDE_MAX = 1080 - SAFE.side * 2;

export type TweetStats = {
  replies?: string;
  reposts?: string;
  likes?: string;
  views?: string;
};

export type TweetCardProps = {
  author?: string;
  handle?: string;
  avatarSrc?: string; // sin valor -> se dibujan las iniciales del autor
  verified?: boolean;
  text?: string;
  highlight?: string; // frase del texto a pintar en color de acento
  stats?: TweetStats;
  timeAgo?: string; // sello de tiempo tipo X ("1h", "3h"…) junto al @handle
  // ── hero-then-dock ──
  dockAfterMs?: number; // ms que la tarjeta se queda GRANDE y centrada antes de dockear
  dockScale?: number; // escala final ya dockeada arriba (0.6–0.7 se ve como tweet real)
};

// ── badge de verificado estilo X (círculo azul + check blanco) ──────────────
const VerifiedBadge: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="11" fill={X_BLUE} />
    <path
      d="M9.53 16.2 5.5 12.18l1.4-1.42 2.63 2.62 5.56-5.56 1.4 1.42z"
      fill="#fff"
    />
  </svg>
);

// ── iconos de acción estilo X (outline gris). `fill=currentColor` -> heredan
//    el color gris del footer, como en un tweet real sin interacción ──────────
const IconReply: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
  </svg>
);
const IconRepost: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
  </svg>
);
const IconLike: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67zm-4.184-7.69c-1.32-.07-2.786.65-3.79 2.05L12 8.66l-.91-1.11c-1.004-1.4-2.471-2.12-3.79-2.05-1.281.07-2.404.74-3.019 1.98-.607 1.22-.63 2.98.53 5.11 1.14 2.1 3.5 4.5 7.19 6.69 3.69-2.19 6.05-4.59 7.19-6.69 1.16-2.13 1.137-3.89.53-5.11-.615-1.24-1.738-1.91-3.019-1.98z" />
  </svg>
);
const IconViews: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor" style={{ flexShrink: 0 }}>
    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
  </svg>
);

// ── iniciales del autor (hasta 2) para el avatar sin imagen ─────────────────
const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => (w[0] ? w[0].toUpperCase() : ""))
    .join("");

// ── parte el texto en tramos para resaltar `highlight` en acento ────────────
type Span = { t: string; hl: boolean };
const splitHighlight = (text: string, highlight?: string): Span[] => {
  if (!highlight) return [{ t: text, hl: false }];
  const idx = text.indexOf(highlight);
  if (idx === -1) return [{ t: text, hl: false }];
  const spans: Span[] = [];
  if (idx > 0) spans.push({ t: text.slice(0, idx), hl: false });
  spans.push({ t: highlight, hl: true });
  const rest = text.slice(idx + highlight.length);
  if (rest) spans.push({ t: rest, hl: false });
  return spans;
};

export const TweetCard: React.FC<TweetCardProps> = ({
  author = "Founder",
  handle = "@founder",
  avatarSrc,
  verified = true,
  text = "stop writing prompts. design loops that prompt your agents.",
  highlight = "design loops that prompt your agents",
  stats = { reposts: "8.4K", likes: "62K", views: "8M" },
  timeAgo = "1h",
  dockAfterMs = 1200,
  dockScale = 0.65,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Entrada/salida con spring (mismo patrón que PopUp): pop sutil de escala + opacidad.
  const inS = spring({ frame, fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  const outS = spring({ frame: frame - (durationInFrames - 14), fps, config: { damping: 200 } });

  // ── hero-then-dock ────────────────────────────────────────────────────────
  // Primeros ~dockAfterMs: tarjeta GRANDE y centrada (protagonista). Luego un
  // spring suave (sobreamortiguado, sin rebote) la achica a `dockScale` y la sube
  // a la zona superior, dejando libre el centro-inferior donde está la cara del sujeto.
  const dockStart = Math.round((dockAfterMs / 1000) * fps);
  const dockS = spring({
    frame: frame - dockStart,
    fps,
    config: { damping: 22, stiffness: 90, mass: 0.9 },
  });
  // Centro Y de la tarjeta ya dockeada: bien arriba, dentro de la safe zone superior.
  const dockCenterY = SAFE.top + 210; // ≈402px → tarjeta pequeña anclada arriba
  const clampBoth = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const dockTranslateY = interpolate(dockS, [0, 1], [0, dockCenterY - VIDEO.height / 2], clampBoth);
  const dockScaleNow = interpolate(dockS, [0, 1], [1, dockScale], clampBoth);

  const scale =
    interpolate(inS, [0, 1], [0.9, 1]) * dockScaleNow * interpolate(outS, [0, 1], [1, 0.96]);
  const opacity = Math.min(inS, 1) * (1 - outS);

  // Scrim fuerte mientras es protagonista; se desvanece al dockear para revelar al sujeto.
  const scrim = useSeqFade(12) * 0.65 * interpolate(dockS, [0, 1], [1, 0], clampBoth);

  const handleText = handle.startsWith("@") ? handle : `@${handle}`;

  // Métricas presentes, con su ícono estilo X. Orden: reply, repost, like, views.
  const metrics: { key: string; Icon: React.FC<{ size: number }>; value: string }[] = [
    { key: "reply", Icon: IconReply, value: stats.replies ?? "" },
    { key: "repost", Icon: IconRepost, value: stats.reposts ?? "" },
    { key: "like", Icon: IconLike, value: stats.likes ?? "" },
    { key: "views", Icon: IconViews, value: stats.views ?? "" },
  ].filter((m) => m.value.length > 0);

  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <Scrim opacity={scrim} />

      <div
        style={{
          transform: `translateY(${dockTranslateY}px) scale(${scale})`,
          opacity,
          width: 900,
          maxWidth: VIDEO_SIDE_MAX,
          background: theme.colors.bgAlt, // dark tipo X (#161B22)
          border: "1px solid #30363D",
          borderRadius: 28,
          padding: 44,
          boxShadow: "0 40px 100px rgba(0,0,0,0.75)",
          fontFamily: theme.fonts.sans,
        }}
      >
        {/* Header: avatar + nombre (+ verificado) + @handle */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28 }}>
          {avatarSrc ? (
            <Img
              src={staticFile(avatarSrc)}
              style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 84,
                height: 84,
                borderRadius: "50%",
                flexShrink: 0,
                background: theme.colors.accentSoft,
                border: `2px solid ${theme.colors.accent}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: theme.colors.accent,
                fontWeight: theme.weight.bold,
                fontSize: 34,
                letterSpacing: theme.tracking.hook,
              }}
            >
              {initialsOf(author)}
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  color: theme.colors.text,
                  fontWeight: theme.weight.bold,
                  fontSize: 36,
                  letterSpacing: theme.tracking.body,
                  whiteSpace: "nowrap",
                }}
              >
                {author}
              </span>
              {verified ? <VerifiedBadge size={30} /> : null}
            </div>
            <span style={{ color: theme.colors.textMuted, fontSize: 28, fontWeight: theme.weight.regular }}>
              {handleText} · {timeAgo}
            </span>
          </div>
        </div>

        {/* Cuerpo: texto del tweet con la frase clave en acento */}
        <div
          style={{
            color: theme.colors.text,
            fontSize: 44,
            lineHeight: 1.35,
            fontWeight: theme.weight.regular,
            letterSpacing: theme.tracking.body,
          }}
        >
          {splitHighlight(text, highlight).map((span, i) => (
            <span
              key={i}
              style={{
                color: span.hl ? theme.colors.accent : theme.colors.text,
                fontWeight: span.hl ? theme.weight.bold : theme.weight.regular,
              }}
            >
              {span.t}
            </span>
          ))}
        </div>

        {/* Footer: barra de métricas */}
        {metrics.length > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginTop: 36,
              paddingTop: 24,
              borderTop: "1px solid #30363D",
              color: theme.colors.textMuted,
              fontSize: 30,
              fontWeight: theme.weight.semibold,
            }}
          >
            {metrics.map((m) => (
              <span key={m.key} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <m.Icon size={30} />
                <span>{m.value}</span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
