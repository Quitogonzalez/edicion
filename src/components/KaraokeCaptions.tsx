// Captions — KARAOKE: grupos cortos (~1.1s, 3-4 palabras) y la palabra que se está
// diciendo se ilumina en verde; las que faltan van atenuadas. Sincronizado por token.
// Se pueden ocultar en ventanas puntuales (ej. gráfica full-screen en vez del subtítulo).
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
  useVideoConfig,
} from "remotion";
import {
  createTikTokStyleCaptions,
  type Caption,
  type TikTokPage,
} from "@remotion/captions";
import { theme, SAFE } from "../theme";

// Karaoke: grupos cortos (~3-4 palabras) para que sea transitorio, no frases largas.
const SWITCH_EVERY_MS = 1100;

export const KaraokeCaptions: React.FC<{
  captions?: Caption[];
  captionsSrc?: string;
  hideWindows?: [number, number][]; // segundos donde NO mostrar subtítulo
}> = ({ captions: captionsProp, captionsSrc, hideWindows = [] }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(captionsProp ?? null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => (captionsProp ? null : delayRender("fetch-captions")));

  const fetchCaptions = useCallback(async () => {
    if (!captionsSrc || handle === null) return;
    try {
      const res = await fetch(staticFile(captionsSrc));
      setCaptions(await res.json());
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [captionsSrc, handle, continueRender, cancelRender]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  if (!captions) return null;
  return <CaptionTrack captions={captions} hideWindows={hideWindows} />;
};

const CaptionTrack: React.FC<{ captions: Caption[]; hideWindows: [number, number][] }> = ({
  captions,
  hideWindows,
}) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: SWITCH_EVERY_MS }),
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const startSec = page.startMs / 1000;
        const hidden = hideWindows.some(([a, b]) => startSec >= a && startSec < b);
        if (hidden) return null;
        const startFrame = startSec * fps;
        const endFrame = Math.min(
          next ? (next.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = Math.max(1, Math.round(endFrame - startFrame));
        return (
          <Sequence key={i} from={Math.round(startFrame)} durationInFrames={durationInFrames}>
            <CaptionPage page={page} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const absMs = page.startMs + (frame / fps) * 1000; // tiempo absoluto en el timeline

  const opacity = interpolate(
    frame,
    [0, 3, durationInFrames - 4, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const y = interpolate(frame, [0, 6], [12, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: SAFE.bottom,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.06em 0.30em",
          fontFamily: theme.fonts.sans,
          fontWeight: theme.weight.extrabold,
          fontSize: 52,
          lineHeight: 1.16,
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: theme.tracking.hook,
          maxWidth: 900,
          textShadow: "0 4px 20px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.95)",
        }}
      >
        {page.tokens.map((tk, i) => {
          const t = tk.text.trim();
          if (!t) return null;
          const active = absMs >= tk.fromMs && absMs < tk.toMs;
          const spoken = absMs >= tk.toMs;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: active ? theme.colors.accent : theme.colors.text,
                opacity: active || spoken ? 1 : 0.5,
                transform: active ? "scale(1.07)" : "scale(1)",
              }}
            >
              {t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
