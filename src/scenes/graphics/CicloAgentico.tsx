// Gráfica 1 — Ciclo agéntico (0:37–0:45). "objetivo → ejecuta → autocorrige".
// Look: máquina de estados / pipeline de CI, NO cerebros ni robots.
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { theme, SAFE } from "../../theme";
import { Chip, Connector, Scrim, useSeqFade } from "./_shared";

export const CicloAgentico: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = useSeqFade();

  const onObjetivo = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onEjecuta = interpolate(frame, [75, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const onAuto = interpolate(frame, [120, 135], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c1 = interpolate(frame, [45, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const c2 = interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const loop = interpolate(frame, [150, 175], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <Scrim opacity={1} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          paddingTop: SAFE.top,
          paddingBottom: SAFE.bottom,
        }}
      >
        <div
          style={{
            fontFamily: theme.fonts.mono,
            fontSize: 30,
            letterSpacing: 4,
            color: theme.colors.textMuted,
            marginBottom: 28,
          }}
        >
          // IA AGÉNTICA
        </div>

        <Chip label="OBJETIVO" on={onObjetivo} big />
        <Connector p={c1} vertical length={56} on={onEjecuta} />
        <Chip label="EJECUTA" on={onEjecuta} big />
        <Connector p={c2} vertical length={56} on={onAuto} />
        <Chip label="AUTOCORRIGE" on={onAuto} big />

        <div
          style={{
            opacity: loop,
            marginTop: 30,
            fontFamily: theme.fonts.sans,
            fontSize: 34,
            fontWeight: theme.weight.semibold,
            color: theme.colors.accent,
          }}
        >
          ↻ itera solo hasta lograrlo
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
