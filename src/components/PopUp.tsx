// PopUp — vos quedáis de PRINCIPAL (footage de fondo) y una imagen aparece como
// pop-up (entra y sale con spring). Para Trump en "gobierno de Estados Unidos".
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, SAFE } from "../theme";

export const PopUp: React.FC<{ assetSrc: string; label?: string; caption?: string }> = ({
  assetSrc,
  label,
  caption,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const inS = spring({ frame, fps, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  const outS = spring({ frame: frame - (durationInFrames - 14), fps, config: { damping: 200 } });
  const scale = interpolate(inS, [0, 1], [0, 1]) * interpolate(outS, [0, 1], [1, 0]);
  const op = Math.min(inS, 1) * (1 - outS);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: SAFE.top + 10 }}>
      <div style={{ transform: `scale(${scale})`, opacity: op, width: 600, textAlign: "center" }}>
        {label ? (
          <div style={{ fontFamily: theme.fonts.sans, fontWeight: theme.weight.extrabold, fontSize: 42, letterSpacing: 1, textTransform: "uppercase", color: "#FFFFFF", marginBottom: 16, textAlign: "center", textShadow: "0 3px 14px rgba(0,0,0,0.92)" }}>
            {label}
          </div>
        ) : null}
        <Img
          src={staticFile(assetSrc)}
          style={{ width: "100%", borderRadius: 18, border: `2px solid ${theme.colors.accent}`, boxShadow: "0 30px 80px rgba(0,0,0,0.7)" }}
        />
        {caption ? (
          <div style={{ fontFamily: theme.fonts.sans, fontWeight: theme.weight.bold, fontSize: 32, color: theme.colors.text, marginTop: 16, textShadow: "0 3px 12px rgba(0,0,0,0.9)" }}>
            {caption}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
