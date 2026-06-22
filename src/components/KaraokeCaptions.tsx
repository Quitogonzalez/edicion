// ─────────────────────────────────────────────────────────────────────────
//  KaraokeCaptions.tsx — subtítulos estilo CapCut, palabra por palabra.
//  La palabra activa se resalta con el color de acento. Respeta safe zones.
//  Acepta `captions` (Caption[]) directo, o `captionsSrc` (JSON en public/).
//
//  Formato Caption (de @remotion/captions):
//    { text, startMs, endMs, timestampMs, confidence }
//  Genera ese JSON con el adapter de transcripción (scripts/) desde
//  MacWhisper / `npx hyperframes transcribe` / OpenAI Whisper.
// ─────────────────────────────────────────────────────────────────────────
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AbsoluteFill,
  Sequence,
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

// Cuántos ms agrupar por "página". Más bajo = más palabra-por-palabra.
const SWITCH_EVERY_MS = 900;

export const KaraokeCaptions: React.FC<{
  captions?: Caption[];
  captionsSrc?: string;
  /** Color de la palabra activa (default: acento de marca). */
  highlight?: string;
}> = ({ captions: captionsProp, captionsSrc, highlight = theme.colors.accent }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(
    captionsProp ?? null,
  );
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() =>
    captionsProp ? null : delayRender("fetch-captions"),
  );

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
  return <CaptionTrack captions={captions} highlight={highlight} />;
};

const CaptionTrack: React.FC<{ captions: Caption[]; highlight: string }> = ({
  captions,
  highlight,
}) => {
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: SWITCH_EVERY_MS,
      }),
    [captions],
  );

  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1] ?? null;
        const startFrame = (page.startMs / 1000) * fps;
        const endFrame = Math.min(
          next ? (next.startMs / 1000) * fps : Infinity,
          startFrame + (SWITCH_EVERY_MS / 1000) * fps,
        );
        const durationInFrames = endFrame - startFrame;
        if (durationInFrames <= 0) return null;
        return (
          <Sequence key={i} from={startFrame} durationInFrames={durationInFrames}>
            <CaptionPage page={page} highlight={highlight} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const CaptionPage: React.FC<{ page: TikTokPage; highlight: string }> = ({
  page,
  highlight,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const absoluteTimeMs = page.startMs + (frame / fps) * 1000;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        // Por encima del 15% inferior (UI de IG/TikTok)
        paddingBottom: SAFE.bottom,
        paddingLeft: SAFE.side,
        paddingRight: SAFE.side,
      }}
    >
      <div
        style={{
          fontFamily: theme.fonts.sans,
          fontWeight: theme.weight.extrabold,
          fontSize: 86,
          lineHeight: 1.1,
          textAlign: "center",
          textTransform: "uppercase",
          maxWidth: "90%",
          whiteSpace: "pre-wrap",
          // Contraste alto: stroke + sombra sutil sobre cualquier fondo.
          color: theme.colors.text,
          WebkitTextStroke: `2px ${theme.colors.stroke}`,
          textShadow: "0 6px 24px rgba(0,0,0,0.55)",
        }}
      >
        {page.tokens.map((token) => {
          const isActive =
            token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
          return (
            <span
              key={`${token.fromMs}-${token.text}`}
              style={{
                color: isActive ? highlight : theme.colors.text,
                whiteSpace: "pre",
              }}
            >
              {token.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
