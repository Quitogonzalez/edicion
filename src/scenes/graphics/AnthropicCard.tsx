// Card tipográfica: Anthropic = competencia de OpenAI. Sin captura, limpia y real.
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";

const Brand: React.FC<{ name: string; product: string; accent?: boolean; delay: number }> = ({
  name,
  product,
  accent,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200, mass: 0.7 } });
  return (
    <div
      style={{
        opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        transform: `scale(${interpolate(s, [0, 1], [0.85, 1])})`,
        flex: 1,
        border: `2px solid ${accent ? theme.colors.accent : "#30363D"}`,
        borderRadius: 18,
        padding: "30px 18px",
        textAlign: "center",
        background: accent ? "rgba(63,185,80,0.10)" : "rgba(22,27,34,0.6)",
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.sans,
          fontWeight: theme.weight.extrabold,
          fontSize: 46,
          letterSpacing: theme.tracking.hook,
          color: accent ? theme.colors.accent : theme.colors.text,
        }}
      >
        {name}
      </div>
      <div style={{ fontFamily: theme.fonts.mono, fontSize: 25, color: theme.colors.textMuted, marginTop: 6 }}>
        {product}
      </div>
    </div>
  );
};

export const AnthropicCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const vs = spring({ frame: frame - 18, fps });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <Brand name="OpenAI" product="ChatGPT" delay={4} />
      <div style={{ opacity: vs, fontFamily: theme.fonts.mono, fontSize: 32, color: theme.colors.textMuted }}>
        vs
      </div>
      <Brand name="Anthropic" product="Claude · Fable 5" accent delay={12} />
    </div>
  );
};
