// "reconstruye una app con una foto" → 📸 → [App Store]. La app se arma como
// una LANDING real (nav, hero, CTA, features). Limpio, on-brand. Vos salís del plano.
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../../theme";
import { popIn } from "../../components/motion";

const Block: React.FC<{ delay: number; style: React.CSSProperties }> = ({ delay, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={{ ...style, ...popIn({ frame, fps, delay }) }} />;
};

export const AppBuild: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const fade = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const photo = spring({ frame, fps, config: { damping: 16 } });
  const acc = theme.colors.accent;
  const lbl = interpolate(frame, [3, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.bg, opacity: fade, justifyContent: "center", alignItems: "center" }}>
      {/* label: 📸 → [App Store] con presencia */}
      <div style={{ display: "flex", alignItems: "center", gap: 26, marginBottom: 30, opacity: lbl, transform: `translateY(${interpolate(lbl, [0, 1], [-16, 0])}px)` }}>
        <span style={{ fontSize: 78 }}>📸</span>
        <span style={{ fontSize: 92, fontWeight: 900, color: acc, lineHeight: 1 }}>→</span>
        <Img src={staticFile("pngs/appstore.png")} style={{ width: 110, height: 110, borderRadius: 24, boxShadow: "0 12px 30px rgba(0,0,0,0.5)" }} />
      </div>

      {/* la app armándose como landing */}
      <div
        style={{
          width: 600,
          height: 880,
          borderRadius: 40,
          border: `2px solid #30363D`,
          background: theme.colors.bgAlt,
          transform: `scale(${interpolate(photo, [0, 1], [0.88, 1])})`,
          padding: 26,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
          overflow: "hidden",
        }}
      >
        {/* nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Block delay={14} style={{ width: 110, height: 34, borderRadius: 10, background: acc }} />
          <div style={{ display: "flex", gap: 12 }}>
            <Block delay={18} style={{ width: 46, height: 16, borderRadius: 6, background: "#30363D" }} />
            <Block delay={20} style={{ width: 46, height: 16, borderRadius: 6, background: "#30363D" }} />
            <Block delay={22} style={{ width: 46, height: 16, borderRadius: 6, background: "#30363D" }} />
          </div>
        </div>
        {/* hero headline */}
        <Block delay={28} style={{ height: 54, width: "92%", borderRadius: 10, background: "#E6EDF3", marginTop: 18 }} />
        <Block delay={33} style={{ height: 54, width: "62%", borderRadius: 10, background: acc }} />
        <Block delay={38} style={{ height: 22, width: "80%", borderRadius: 7, background: "#30363D", marginTop: 6 }} />
        {/* CTA */}
        <Block delay={44} style={{ height: 58, width: 220, borderRadius: 30, background: acc, marginTop: 10 }} />
        {/* hero image */}
        <Block delay={50} style={{ height: 250, borderRadius: 20, background: "linear-gradient(135deg, #1f6f33, #0D1117)", border: "1px solid #30363D", marginTop: 14 }} />
        {/* features */}
        <div style={{ display: "flex", gap: 14, marginTop: 4 }}>
          <Block delay={56} style={{ flex: 1, height: 90, borderRadius: 14, background: "#0D1117", border: "1px solid #30363D" }} />
          <Block delay={60} style={{ flex: 1, height: 90, borderRadius: 14, background: "#0D1117", border: "1px solid #30363D" }} />
          <Block delay={64} style={{ flex: 1, height: 90, borderRadius: 14, background: "#0D1117", border: "1px solid #30363D" }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
