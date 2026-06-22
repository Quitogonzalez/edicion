#!/usr/bin/env python3
"""
transcribe.py — Adapter de transcripción para el pipeline de edición de Quito.

Produce DOS salidas a partir de una transcripción word-level:

  1) <stem>.captions.json   -> formato Caption[] de Remotion (para el karaoke)
                               {text, startMs, endMs, timestampMs, confidence}
  2) transcripts/<stem>.json -> formato shape-Scribe de video-use (para el corte)
                               {language_code, words:[{type,text,start,end,speaker_id}]}

Así el karaoke (Remotion / HyperFrames) y el corte (video-use) corren SIN ElevenLabs.

FUENTES DE TRANSCRIPCIÓN (elige una):
  --whisper-json <f>   JSON ya transcrito (MacWhisper export, openai-whisper,
                       whisper.cpp, o `npx hyperframes transcribe`). Auto-detecta
                       los shapes más comunes con palabras + timestamps.
  --openai             Llama a la API de OpenAI Whisper (lee OPENAI_API_KEY de
                       .env o entorno). response_format=verbose_json, word-level.
  (sin fuente)         Si das --audio/--video y no hay --whisper-json, intenta
                       --openai como respaldo.

USO:
  python scripts/transcribe.py --video footage/clip.mp4 --openai
  python scripts/transcribe.py --whisper-json transcripts/clip.macwhisper.json --stem clip
  python scripts/transcribe.py --video footage/clip.mp4 --whisper-json clip.json --edit-dir edit

NOTA: MacWhisper (gratis, local) es la fuente recomendada. Exporta el transcript
como JSON con timestamps por palabra y pásalo con --whisper-json.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path


# ── claves / utilidades ────────────────────────────────────────────────────
def load_env_key(name: str) -> str:
    for candidate in [Path(".env"), Path(__file__).resolve().parent.parent / ".env"]:
        if candidate.exists():
            for line in candidate.read_text().splitlines():
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                if k.strip() == name:
                    val = v.strip().strip('"').strip("'")
                    if val:
                        return val
    return os.environ.get(name, "")


def extract_audio(media: Path) -> Path:
    """Extrae audio mono mp3 (chico, < 25MB API limit) a un tmp."""
    dest = Path(tempfile.mkstemp(suffix=".mp3")[1])
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(media), "-vn", "-ac", "1", "-ar", "16000",
         "-b:a", "64k", str(dest)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )
    return dest


# ── transcripción ──────────────────────────────────────────────────────────
def transcribe_openai(audio: Path, language: str | None) -> dict:
    import requests  # ya instalado (dep de video-use)

    key = load_env_key("OPENAI_API_KEY")
    if not key:
        sys.exit("OPENAI_API_KEY no encontrada en .env ni en el entorno.")
    data = {
        "model": "whisper-1",
        "response_format": "verbose_json",
        "timestamp_granularities[]": "word",
    }
    if language:
        data["language"] = language
    with open(audio, "rb") as f:
        resp = requests.post(
            "https://api.openai.com/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {key}"},
            files={"file": (audio.name, f, "audio/mpeg")},
            data=data, timeout=1800,
        )
    if resp.status_code != 200:
        raise RuntimeError(f"OpenAI {resp.status_code}: {resp.text[:400]}")
    return resp.json()


# ── normalización (cualquier shape -> lista de {text,start,end}) ───────────
def normalize_words(raw: dict | list) -> list[dict]:
    """Acepta los shapes más comunes de Whisper y devuelve palabras planas."""
    words: list[dict] = []

    def push(text, start, end):
        text = (text or "").strip()
        if text == "" or start is None or end is None:
            return
        words.append({"text": text, "start": float(start), "end": float(end)})

    # 1) OpenAI verbose_json: {"words":[{"word","start","end"}]}
    if isinstance(raw, dict) and isinstance(raw.get("words"), list) and raw["words"] \
            and ("word" in raw["words"][0] or "text" in raw["words"][0]):
        for w in raw["words"]:
            push(w.get("word") or w.get("text"), w.get("start"), w.get("end"))
        if words:
            return words

    # 2) whisper(.cpp / openai-whisper / MacWhisper): {"segments":[{"words":[...]}]}
    segs = raw.get("segments") if isinstance(raw, dict) else None
    if isinstance(segs, list):
        for seg in segs:
            for w in (seg.get("words") or []):
                push(w.get("word") or w.get("text"),
                     w.get("start"), w.get("end"))
        if words:
            return words

    # 3) lista plana: [{"word"/"text","start","end"}]
    if isinstance(raw, list):
        for w in raw:
            push(w.get("word") or w.get("text"), w.get("start"), w.get("end"))
        if words:
            return words

    sys.exit("No pude reconocer el shape del JSON de transcripción. "
             "Esperaba palabras con start/end (OpenAI verbose_json, whisper, etc.).")
    return words


# ── escritura de salidas ───────────────────────────────────────────────────
def write_remotion_captions(words: list[dict], out: Path) -> None:
    caps = []
    for i, w in enumerate(words):
        # whitespace-sensitive: espacio antes de cada palabra menos la primera
        text = w["text"] if i == 0 else " " + w["text"]
        start_ms = round(w["start"] * 1000)
        end_ms = round(w["end"] * 1000)
        caps.append({
            "text": text,
            "startMs": start_ms,
            "endMs": end_ms,
            "timestampMs": round((start_ms + end_ms) / 2),
            "confidence": 1,
        })
    out.write_text(json.dumps(caps, ensure_ascii=False, indent=2))
    print(f"captions Remotion → {out}  ({len(caps)} palabras)")


def write_scribe_json(words: list[dict], out: Path, language: str) -> None:
    """Formato que espera pack_transcripts.py de video-use: words con
    entradas 'word' y 'spacing' (las spacing codifican los silencios)."""
    entries: list[dict] = []
    prev_end = None
    for w in words:
        if prev_end is not None and w["start"] > prev_end:
            entries.append({"type": "spacing", "text": " ",
                            "start": prev_end, "end": w["start"],
                            "speaker_id": "speaker_0"})
        entries.append({"type": "word", "text": w["text"],
                        "start": w["start"], "end": w["end"],
                        "speaker_id": "speaker_0"})
        prev_end = w["end"]
    payload = {"language_code": language or "es",
               "text": " ".join(w["text"] for w in words),
               "words": entries}
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    print(f"transcript video-use → {out}  ({len(words)} palabras)")


# ── main ───────────────────────────────────────────────────────────────────
def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--video", "--audio", dest="media", help="Video/audio fuente")
    ap.add_argument("--whisper-json", help="Transcripción word-level ya hecha")
    ap.add_argument("--openai", action="store_true", help="Transcribir con OpenAI Whisper")
    ap.add_argument("--language", default=None, help="Código de idioma (ej: es)")
    ap.add_argument("--stem", default=None, help="Nombre base de salida")
    ap.add_argument("--out-dir", default="transcripts", help="Carpeta de salida (captions)")
    ap.add_argument("--edit-dir", default=None,
                    help="Carpeta edit/ de video-use; escribe transcripts/<stem>.json ahí")
    args = ap.parse_args()

    stem = args.stem or (Path(args.media).stem if args.media
                         else Path(args.whisper_json).stem if args.whisper_json
                         else "transcript")

    # obtener palabras
    if args.whisper_json:
        raw = json.loads(Path(args.whisper_json).read_text())
        words = normalize_words(raw)
    elif args.openai or args.media:
        if not args.media:
            sys.exit("--openai requiere --video/--audio.")
        audio = extract_audio(Path(args.media))
        try:
            raw = transcribe_openai(audio, args.language)
        finally:
            audio.unlink(missing_ok=True)
        words = normalize_words(raw)
    else:
        sys.exit("Da --whisper-json o (--video con --openai).")

    if not words:
        sys.exit("La transcripción no produjo palabras.")

    # salidas
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    write_remotion_captions(words, out_dir / f"{stem}.captions.json")
    if args.edit_dir:
        write_scribe_json(words, Path(args.edit_dir) / "transcripts" / f"{stem}.json",
                          args.language or "es")
    else:
        # también deja el shape-Scribe junto a los captions por conveniencia
        write_scribe_json(words, out_dir / f"{stem}.scribe.json", args.language or "es")


if __name__ == "__main__":
    main()
