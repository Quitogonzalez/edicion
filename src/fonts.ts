// Carga de fuentes vía @remotion/google-fonts (type-safe, bloquea el render
// hasta que la fuente está lista). Dos familias máximo, como pide la guía:
//   - sans limpia para captions/títulos  -> Inter
//   - mono para código/datos             -> JetBrains Mono
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const { fontFamily: monoFamily } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});
