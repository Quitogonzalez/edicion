// ─────────────────────────────────────────────────────────────────────────
//  OutroCTA — tarjeta de CIERRE / llamado a la acción para el final del reel.
//  "empieza hoy, probalo y contame cómo te va". Look dev minimalista:
//  Scrim fuerte sobre el footage, texto casi-blanco + acento verde,
//  titular sans extrabold, detalle en mono. Entrada escalonada y determinista.
//  Duración recomendada: ~5s = 150 frames (a 30fps).
// ─────────────────────────────────────────────────────────────────────────
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { theme, SAFE } from "../../theme";
import { Scrim, useSeqFade } from "./_shared";
import { fadeUp } from "../../components/motion";

export const OutroCTA: React.FC<{
  title?: string;
  subtitle?: string;
  tag?: string;
}> = ({
  title = "EMPIEZA HOY",
  subtitle = "probalo y contame cómo te va",
  tag = "guarda esto 📌",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade global de la escena atado a la duración de la Sequence.
  const seq = useSeqFade(14);

  // ── Entrada escalonada ────────────────────────────────────────────────
  // Titular: spring con impacto (pop + leve subida).
  const titleS = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
  });
  const titleY = interpolate(titleS, [0, 1], [40, 0]);
  const titleScale = interpolate(titleS, [0, 1], [0.92, 1]);

  // Subrayado de acento que se dibuja debajo del titular.
  const underline = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtexto: fadeUp con delay.
  const subA = fadeUp({ frame, fps, delay: 16, distance: 28, duration: 20 });

  // Chip / handle: fadeUp con más delay.
  const tagA = fadeUp({ frame, fps, delay: 30, distance: 20, duration: 18 });

  // Cursor mono parpadeante (determinista, atado al frame — nada de random).
  const cursorOn = Math.floor(frame / 15) % 2 === 0 ? 1 : 0;

  return (
    <AbsoluteFill style={{ opacity: seq }}>
      <Scrim opacity={0.96} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingLeft: SAFE.side,
          paddingRight: SAFE.side,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
        }}
      >
        {/* Titular */}
        <div
          style={{
            transform: `translateY(${titleY}px) scale(${titleScale})`,
            opacity: interpolate(titleS, [0, 0.4], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.sans,
              fontWeight: theme.weight.extrabold,
              fontSize: 128,
              lineHeight: 1.02,
              letterSpacing: theme.tracking.hook,
              color: theme.colors.text,
              textShadow: "0 6px 30px rgba(0,0,0,0.9)",
            }}
          >
            {title}
          </div>
          {/* Subrayado de acento */}
          <div
            style={{
              height: 8,
              width: `${underline * 62}%`,
              margin: "22px auto 0",
              background: theme.colors.accent,
              borderRadius: 4,
              boxShadow: `0 0 22px ${theme.colors.accentSoft}`,
            }}
          />
        </div>

        {/* Subtexto (mono, con cursor parpadeante) */}
        {subtitle ? (
          <div
            style={{
              ...subA,
              marginTop: theme.gap + 12,
              fontFamily: theme.fonts.mono,
              fontWeight: theme.weight.regular,
              fontSize: 40,
              letterSpacing: theme.tracking.body,
              color: theme.colors.textMuted,
            }}
          >
            {subtitle}
            <span style={{ color: theme.colors.accent, opacity: cursorOn }}>
              _
            </span>
          </div>
        ) : null}

        {/* Chip / handle */}
        {tag ? (
          <div style={{ ...tagA, marginTop: theme.gap + 8 }}>
            <div
              style={{
                display: "inline-block",
                fontFamily: theme.fonts.mono,
                fontWeight: theme.weight.bold,
                fontSize: 34,
                letterSpacing: -0.5,
                color: theme.colors.accent,
                border: `2px solid ${theme.colors.accent}`,
                borderRadius: 16,
                padding: "16px 26px",
                background: theme.colors.accentSoft,
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
