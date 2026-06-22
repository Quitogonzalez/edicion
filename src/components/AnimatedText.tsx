// Texto animado reutilizable. Entrada con fadeUp. Resalta una palabra-clave
// con el color de acento (una idea por pantalla, aire, peso bold para hooks).
import { useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";
import { fadeUp } from "./motion";

export const AnimatedText: React.FC<{
  children: React.ReactNode;
  delay?: number;
  size?: number;
  weight?: number;
  color?: string;
  mono?: boolean;
  align?: "left" | "center";
}> = ({
  children,
  delay = 0,
  size = 72,
  weight = theme.weight.bold,
  color = theme.colors.text,
  mono = false,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...fadeUp({ frame, fps, delay }),
        fontFamily: mono ? theme.fonts.mono : theme.fonts.sans,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.12,
        color,
        textAlign: align,
        letterSpacing: mono ? -1 : -0.5,
      }}
    >
      {children}
    </div>
  );
};

/** Una palabra resaltada con el color de acento. */
export const Accent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: theme.colors.accent }}>{children}</span>
);
