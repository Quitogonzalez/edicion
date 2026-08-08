// Gráfica — Árbol de subagentes (0:51–1:08). Más dinámico, menos "IA":
// entradas punchy con spring, nodo activo que pulsa (proceso vivo), float sutil,
// indicador "···" trabajando, y el resumen que vuelve ágil.
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE } from "../../theme";
import { Scrim, lerpColor, useSeqFade } from "./_shared";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// entrada punchy (overshoot) — se siente rápida
const useRise = (delay: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 13, stiffness: 200, mass: 0.7 } });
  return {
    appear: s,
    style: {
      opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
      transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px) scale(${interpolate(s, [0, 1], [0.9, 1])})`,
    } as React.CSSProperties,
  };
};

const Node: React.FC<{
  title: string;
  sub?: string;
  delay: number;
  active: number; // 0..1 pulso de "procesando"
  dim?: number; // 0..1 atenuar (en la vuelta)
  working?: boolean;
}> = ({ title, sub, delay, active, dim = 0, working }) => {
  const frame = useCurrentFrame();
  const { appear, style } = useRise(delay);
  const lit = appear * (1 - 0.5 * dim);
  const pulse = active * (0.5 + 0.5 * Math.sin(frame / 6)); // latido
  const float = Math.sin((frame + delay) / 28) * 3;
  const accent = lerpColor("#30363D", theme.colors.accent, lit);
  const color = lerpColor(theme.colors.textMuted, theme.colors.text, lit);
  return (
    <div
      style={{
        ...style,
        transform: `${style.transform} translateY(${float}px)`,
        border: `2px solid ${accent}`,
        borderRadius: 16,
        padding: "14px 24px",
        minWidth: 440,
        background: `rgba(63,185,80,${0.1 * lit + 0.12 * pulse})`,
        boxShadow: `0 0 ${28 * pulse}px rgba(63,185,80,${0.5 * pulse})`,
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: 99,
          background: theme.colors.accent,
          opacity: 0.4 + 0.6 * active,
          flexShrink: 0,
        }}
      />
      <div style={{ textAlign: "left", flex: 1 }}>
        <div style={{ fontFamily: theme.fonts.mono, fontWeight: 700, fontSize: 38, color }}>
          {title}
          {working ? <span style={{ color: theme.colors.accent }}>{".".repeat(1 + (Math.floor(frame / 10) % 3))}</span> : null}
        </div>
        {sub ? (
          <div style={{ fontFamily: theme.fonts.sans, fontSize: 22, color: theme.colors.textMuted }}>{sub}</div>
        ) : null}
      </div>
    </div>
  );
};

const Wire: React.FC<{ p: number; on: number }> = ({ p, on }) => (
  <div
    style={{
      width: 3,
      height: 34 * Math.max(0, Math.min(1, p)),
      background: lerpColor("#30363D", theme.colors.accent, on),
      borderRadius: 2,
    }}
  />
);

export const ArbolSubagentes: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = useSeqFade();

  // sincronizado al VO pero con motion punchy. "active" marca el nodo en curso.
  const aTu = interpolate(frame, [6, 40, 380, 430], [0, 1, 0, 1], clamp);
  const aAsist = interpolate(frame, [30, 60, 150, 380, 410], [0, 1, 0.2, 0.2, 0.9], clamp);
  const aAgU = interpolate(frame, [150, 175, 270], [0, 1, 0.2], clamp);
  const aPlat = interpolate(frame, [270, 300, 380], [0, 1, 0.3], clamp);

  const answer = interpolate(frame, [375, 405], [0, 1], clamp);
  const dimDown = answer;
  const travelTop = interpolate(frame, [395, 455], [72, 17], clamp);
  const resumenOp = interpolate(frame, [395, 415, 450, 470], [0, 1, 1, 0], clamp);
  const tuDone = interpolate(frame, [430, 450], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scrim opacity={0.82} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
        }}
      >
        <Node title="tú" delay={6} active={aTu} working={false} />
        <div style={{ opacity: tuDone, color: theme.colors.accent, fontFamily: theme.fonts.sans, fontSize: 24, height: 28 }}>
          ✓ esto tenés esta semana
        </div>
        <Wire p={interpolate(frame, [34, 58], [0, 1], clamp)} on={aAsist} />
        <Node title="asistente personal" delay={30} active={aAsist} />
        <Wire p={interpolate(frame, [150, 172], [0, 1], clamp)} on={aAgU * (1 - dimDown)} />
        <Node title="agente universidad" delay={150} active={aAgU} dim={dimDown} working={frame > 175 && frame < 270} />
        <Wire p={interpolate(frame, [270, 292], [0, 1], clamp)} on={aPlat * (1 - dimDown)} />
        <Node title="plataforma U" sub="calendario · tareas" delay={270} active={aPlat} dim={dimDown} working={frame > 300 && frame < 375} />
      </AbsoluteFill>

      {/* el resumen vuelve ágil hacia arriba */}
      <div
        style={{
          position: "absolute",
          top: `${travelTop}%`,
          right: 100,
          opacity: resumenOp,
          fontFamily: theme.fonts.mono,
          fontWeight: 700,
          fontSize: 28,
          color: theme.colors.accent,
          border: `2px solid ${theme.colors.accent}`,
          borderRadius: 12,
          padding: "8px 16px",
          background: "rgba(63,185,80,0.14)",
        }}
      >
        resumen ↑
      </div>
    </AbsoluteFill>
  );
};
