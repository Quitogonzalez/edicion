# 🎬 edicion — editar reels dirigiendo a Claude

Infraestructura para producir **reels verticales 9:16** (1080×1920, 30fps) para IG/TikTok
dirigiendo a Claude Code. **Yo dirijo, Claude ejecuta.**

## Propósito
Pasar de editar a mano (horas) a **dirigir la edición con prompts** (minutos), manteniendo
la marca: dev build-in-público sobre IA, estética **minimalista y cercana**, fondo oscuro
tipo editor + **un solo color de acento** (`#3FB950`), captions karaoke, anti-vendehúmo.
4 pilares: Dirigiendo a la IA · Construyendo en público · Disciplina y sistema · Opinión con criterio.

## Cómo funciona — 2 ambientes
1. **El corte** → `video-use` + transcripción gratis con **MacWhisper** (sin pagar ElevenLabs):
   elimina muletillas, silencios y retomas, y estructura según el guion.
2. **Motion graphics** → **HyperFrames** (subtítulos karaoke palabra-por-palabra + lower-thirds/
   callouts sobre el footage) y **Remotion** (escenas de marca desde cero: hooks, intros, data-viz).
   El agente `social-media-strategist` decide **QUÉ** sumar.

## Cómo se usa
1. Dejá el video en `footage/`.
2. Abrí Claude Code en esta carpeta y decí **"edita este reel"**.
3. La skill `reel-editor` orquesta todo con las reglas de marca (incluida la regla crítica:
   **nunca sobrescribir una escena — siempre crear V2/V3**).

La guía completa de uso (`Resources/GUIA-DE-USO.md`) queda fuera del repo: es material personal, no versionado.

## Stack
| Herramienta | Rol |
|---|---|
| `video-use` | Corte dirigido por transcript |
| HyperFrames | Captions karaoke + overlays sobre footage |
| Remotion (este proyecto) | Escenas de marca 9:16 con `src/theme.ts` |
| MacWhisper / OpenAI Whisper | Transcripción (vía `scripts/transcribe.py`, sin ElevenLabs) |
| Agente `social-media-strategist` | Dirección creativa (el "qué") |
| Skill `reel-editor` | Orquesta los 2 ambientes |

## Estructura
```
.claude/skills/reel-editor/   La skill que orquesta (SKILL.md + references/)
Resources/                    Lineamientos personales (local, no versionado)
src/                          theme · fonts · components (Karaoke, motion) · scenes · Reel · Root
scripts/                      transcribe.py (adapter) · silences.py
footage/ transcripts/ out/    media (gitignored) · project.md (memoria de sesión)
```

## Setup (una vez)
```bash
cp .env.example .env     # pegá tu OPENAI_API_KEY (opcional; gitignored)
npm install              # deps de Remotion
npm run dev              # Studio en localhost:3000 (probá la composición KaraokeDemo)
```
MacWhisper es la transcripción por defecto (gratis/local). ElevenLabs es opcional.

## Render
```bash
npx remotion render Reel out/reel.mp4 --codec h264
```

---
🤖 Generado con [Claude Code](https://claude.com/claude-code)
