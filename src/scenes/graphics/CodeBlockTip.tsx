// Gráfica 3 — El tip como bloque de código copiable (1:08–1:15).
// Look: snippet en el editor. La línea del tip se "escribe" (typewriter) en acento.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, SAFE } from "../../theme";
import { Scrim, useSeqFade } from "./_shared";
import { fadeUp } from "../../components/motion";
import { useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TIP = "hazme todas las preguntas necesarias antes de empezar";

export const CodeBlockTip: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = useSeqFade();

  const chars = Math.floor(interpolate(frame, [35, 125], [0, TIP.length], clamp));
  const typed = TIP.slice(0, chars);
  const typing = chars < TIP.length;
  const cursorOn = typing || Math.floor(frame / 15) % 2 === 0;
  const badgeOp = interpolate(frame, [140, 160], [0, 1], clamp);
  const labelOp = interpolate(frame, [165, 185], [0, 1], clamp);

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
              prompt.txt
            </span>
          </div>
          {/* cuerpo */}
          <div style={{ padding: "28px 26px", fontFamily: theme.fonts.mono, fontSize: 34, lineHeight: 1.5 }}>
            <div style={{ color: theme.colors.textMuted }}>[ tu prompt aquí... ]</div>
            <div style={{ color: theme.colors.accent, fontWeight: theme.weight.bold, marginTop: 10 }}>
              → {typed}
              <span style={{ opacity: cursorOn ? 1 : 0 }}>▌</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
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
            📌 guardá esto
          </div>
          <div
            style={{
              opacity: labelOp,
              fontFamily: theme.fonts.mono,
              fontSize: 26,
              color: theme.colors.textMuted,
            }}
          >
            interacción inversa
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
