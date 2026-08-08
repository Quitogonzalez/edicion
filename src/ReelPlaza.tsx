// ReelPlaza v3.1 — corte SUAVE (sin microcortes) + LUT sutil + audio mínimo.
import {
  AbsoluteFill, Audio, Sequence, staticFile,
  spring, interpolate, Easing, useCurrentFrame, useVideoConfig,
} from "remotion";
import { VIDEO, theme, SAFE } from "./theme";
import { CameraFootage } from "./components/CameraFootage";
import { KaraokeCaptions } from "./components/KaraokeCaptions";
import { TweetCard } from "./components/TweetCard";
import { PopUp } from "./components/PopUp";
import { SubjectPiP } from "./components/SubjectPiP";
import { IconPop } from "./components/IconPop";
import { LandingFlash } from "./components/LandingFlash";
import { LowerThirdCTA } from "./components/LowerThirdCTA";
import { PromptBox } from "./scenes/graphics/PromptBox";
import { Chart80 } from "./scenes/graphics/Chart80";
import { BigWord } from "./scenes/graphics/BigWord";
import { LoopRing } from "./scenes/graphics/LoopRing";
import { OutroCTA } from "./scenes/graphics/OutroCTA";
import { AgentSwarm } from "./scenes/graphics/AgentSwarm";
import { PricingCard } from "./scenes/graphics/PricingCard";

const F = VIDEO.fps;
const sec = (s: number) => Math.round(s * F);
export const REEL_PLAZA_DURATION = sec(112.83);

const W = {
  hookHL:    [0.1, 6.9],
  chart80:   [4.9, 7.8],
  stein:     [8.1, 12.8],
  count370:  [13.0, 14.5],
  tweetZoom: [14.2, 16.2],
  m8:        [16.4, 18.5],
  tweet:     [18.5, 24.2],
  tresHL:    [29.2, 32.6],
  codex:     [33.0, 35.0],
  pricing:   [35.2, 38.5],
  loopHero:  [38.5, 41.5],
  loopRing:  [43.5, 46.0],
  goalHero:  [46.0, 48.6],
  finito:    [49.3, 51.3],
  goalSplit: [51.3, 56.4],
  detective: [56.6, 58.7],
  ultraHero: [63.9, 66.9],
  swarm:     [68.8, 75.2],
  secretoHL: [83.0, 85.7],
  landing:   [88.8, 90.5],
  badPrompt: [90.3, 93.7],
  impreciso: [94.1, 96.3],
  goodPrompt:[96.6, 102.9],
  outro:     [106.5, 110.0],
  lowerCTA:  [110.2, 112.83],
} as const;

const FULL = [
  W.pricing, W.loopHero, W.loopRing, W.goalHero, W.ultraHero, W.swarm,
  W.badPrompt, W.goodPrompt, W.outro,
] as [number, number][];
const HL = [W.hookHL, W.tweetZoom, W.tresHL, W.secretoHL] as [number, number][];
const HIDE = [...FULL, W.m8, W.finito, W.goalSplit, W.impreciso, W.lowerCTA] as [number, number][];

const seq = (w: readonly [number, number]) => ({ from: sec(w[0]), durationInFrames: sec(w[1] - w[0]) });

// SFX bajos (voz al frente) + sincronizados.
const SFX: { at: number; src: string; vol?: number; dur?: number }[] = [
  { at: 0.0,   src: "riser_start",  vol: 0.42, dur: 4 },
  { at: 4.9,   src: "ting",        vol: 0.10 },
  { at: 8.1,   src: "whoosh_a",    vol: 0.12 },
  { at: 13.0,  src: "pop_a",       vol: 0.14 },
  { at: 14.2,  src: "swosh_a",     vol: 0.12 },
  { at: 16.4,  src: "boom",        vol: 0.18 },
  { at: 18.5,  src: "whoosh_a",    vol: 0.12 },
  { at: 19.8,  src: "click_a",     vol: 0.10 },
  { at: 29.2,  src: "fastwhoosh",  vol: 0.14 },
  { at: 33.0,  src: "logo_anim",   vol: 0.12 },
  { at: 35.2,  src: "pop_b",       vol: 0.14 },
  { at: 38.5,  src: "whoosh_a",    vol: 0.12 },
  { at: 43.5,  src: "pop_a",       vol: 0.10 },
  { at: 46.0,  src: "whoosh_a",    vol: 0.12 },
  { at: 49.3,  src: "pop_a",       vol: 0.14 },
  { at: 51.5,  src: "pop_b",       vol: 0.09 }, // bullet 1 goal
  { at: 52.0,  src: "pop_b",       vol: 0.09 }, // bullet 2
  { at: 52.5,  src: "pop_b",       vol: 0.09 }, // bullet 3
  { at: 56.6,  src: "swosh_a",     vol: 0.12 },
  { at: 63.9,  src: "fastwhoosh",  vol: 0.14 },
  { at: 66.9,  src: "swosh_a",     vol: 0.10 },
  { at: 68.8,  src: "whoosh_a",    vol: 0.12 },
  { at: 70.1,  src: "pop_a",       vol: 0.12 },
  { at: 83.0,  src: "riser_intro", vol: 0.16 },
  { at: 88.8,  src: "fastwhoosh",  vol: 0.12 },
  { at: 90.3,  src: "click_a",     vol: 0.10 },
  { at: 94.1,  src: "boom",        vol: 0.18 },
  { at: 96.6,  src: "pop_b",       vol: 0.12 },
  { at: 106.5, src: "riser_intro", vol: 0.16 },
];

const Count370: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = interpolate(frame, [0, Math.round(fps * 0.7)], [0, 370], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 300 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width={92} height={92} viewBox="0 0 24 24" fill="none">
          <path d="M12 3v11m0 0l-4.2-4.2M12 14l4.2-4.2M4.5 19.5h15" stroke="#FFFFFF" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: theme.fonts.sans, fontWeight: theme.weight.extrabold, fontSize: 150, color: "#FFFFFF", letterSpacing: -2, textShadow: "0 0 42px rgba(63,185,80,0.55), 0 4px 20px rgba(0,0,0,0.85)" }}>
          {Math.round(t)}K
        </span>
      </div>
    </AbsoluteFill>
  );
};

// Bullets del /goal: SIN caja, SIN header, aparecen en descendente (progresivo), negrita.
const GoalBullets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows: [string, string][] = [
    ["→", "le das UNA meta clara"],
    ["↻", "itera vuelta tras vuelta"],
    ["✓", "un agente revisa hasta cumplirla"],
  ];
  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-start", paddingTop: SAFE.top + 40, paddingLeft: 96, paddingRight: 70 }}>
      <div>
        {rows.map(([ic, tx], i) => {
          const app = spring({ frame: frame - (6 + i * 15), fps, config: { damping: 16, stiffness: 180, mass: 0.6 } });
          const op = interpolate(app, [0, 1], [0, 1]);
          const y = interpolate(app, [0, 1], [24, 0]);
          return (
            <div key={i} style={{ opacity: op, transform: `translateY(${y}px)`, display: "flex", gap: 22, alignItems: "baseline", marginTop: i ? 30 : 0, fontFamily: theme.fonts.sans, fontWeight: theme.weight.extrabold, fontSize: 54, color: "#FFFFFF", textShadow: "0 3px 16px rgba(0,0,0,0.9)" }}>
              <span style={{ color: theme.colors.accent, fontFamily: theme.fonts.mono }}>{ic}</span>
              <span>{tx}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const ReelPlaza: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <CameraFootage src="plaza_base.mp4" focusBeats={FULL} highlightBeats={HL} />

      <Sequence {...seq(W.chart80)} name="80% chart"><Chart80 value={80} /></Sequence>
      <Sequence {...seq(W.stein)} name="steinberger"><PopUp assetSrc="pngs/steinberger.png" label="Peter Steinberger" /></Sequence>
      <Sequence {...seq(W.count370)} name="370K"><Count370 /></Sequence>
      <Sequence {...seq(W.tweetZoom)} name="twitter"><IconPop srcs={["pngs/twitter.png"]} chip size={220} /></Sequence>
      <Sequence {...seq(W.m8)} name="8M"><BigWord text="8 millones" mode="rise" position="top" /></Sequence>
      <Sequence {...seq(W.tweet)} name="tweet">
        <TweetCard
          author="Peter Steinberger" handle="@steipete" verified avatarSrc="pngs/steinberger.png" timeAgo="1h"
          text="Here's your monthly reminder that you shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agents."
          highlight="designing loops that prompt your agents"
          stats={{ reposts: "9.2K", likes: "71K", views: "8M" }}
        />
      </Sequence>

      <Sequence {...seq(W.codex)} name="codex/claude"><IconPop srcs={["pngs/codex.png", "pngs/claude_code.png"]} size={230} gap={46} /></Sequence>
      <Sequence {...seq(W.pricing)} name="pricing"><PricingCard /></Sequence>

      <Sequence {...seq(W.loopHero)} name="/loop"><PromptBox command="/loop" badge="" /></Sequence>
      <Sequence {...seq(W.loopRing)} name="loop ring"><LoopRing interval="cada 15 min" label="/loop" caption="" /></Sequence>

      <Sequence {...seq(W.goalHero)} name="/goal"><PromptBox command="/goal" badge="" /></Sequence>
      <Sequence {...seq(W.finito)} name="FINITO"><BigWord text="finito" mode="rise" position="top" /></Sequence>
      <Sequence {...seq(W.goalSplit)} name="goal split">
        <AbsoluteFill style={{ background: "linear-gradient(160deg, #0D1117 0%, #161B22 100%)" }} />
        <GoalBullets />
        <SubjectPiP startFromSec={W.goalSplit[0]} width={640} height={780} objectPosition="50% 58%" style={{ position: "absolute", bottom: 120, left: 220 }} />
      </Sequence>
      <Sequence {...seq(W.detective)} name="agente revisor"><IconPop srcs={["pngs/detective.png"]} chip size={240} /></Sequence>

      <Sequence {...seq(W.ultraHero)} name="/ultracode"><PromptBox command="/ultracode" exitSlideUp badge="" /></Sequence>
      <Sequence {...seq(W.swarm)} name="swarm"><AgentSwarm count={14} label="1 objetivo" caption="un enjambre de agentes en paralelo" /></Sequence>

      <Sequence {...seq(W.landing)} name="pagina web"><LandingFlash /></Sequence>
      <Sequence {...seq(W.badPrompt)} name="prompt malo"><PromptBox promptText="hazme la página más bonita que conozcas" /></Sequence>
      <Sequence {...seq(W.impreciso)} name="impreciso"><BigWord text={"impreciso e\nimpredecible"} mode="impact" position="top" /></Sequence>
      <Sequence {...seq(W.goodPrompt)} name="prompt bueno"><PromptBox promptText="/goal · necesito una página SIN ERRORES ✓" /></Sequence>

      <Sequence {...seq(W.outro)} name="outro"><OutroCTA title="EMPIEZA HOY" subtitle="" tag="" /></Sequence>
      <Sequence {...seq(W.lowerCTA)} name="lower cta"><LowerThirdCTA text="pruébalo y cuéntame cómo te va!" /></Sequence>

      <KaraokeCaptions captionsSrc="plaza.captions.json" hideWindows={HIDE} />

      {SFX.map((s, i) => (
        <Sequence key={i} from={sec(s.at)} durationInFrames={s.dur ? sec(s.dur) : F * 2} name={`sfx:${s.src}`}>
          <Audio src={staticFile(`sfx/${s.src}.wav`)} volume={(s.vol ?? 0.15) * (s.src.startsWith("riser") ? 1 : 1.4)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
