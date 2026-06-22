#!/usr/bin/env python3
"""
silences.py — Detecta silencios con ffmpeg para el flujo de corte "lean".

Imprime los rangos de silencio (JSON) para que Claude razone qué cortar.
Útil cuando NO usas el pipeline nativo de video-use y querés un corte simple
guiado por transcript + silencios.

USO:
  python scripts/silences.py footage/clip.mp4
  python scripts/silences.py footage/clip.mp4 --noise -30dB --min 0.4

Salida: [{"start": 1.23, "end": 2.10, "dur": 0.87}, ...]
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def detect(media: Path, noise: str, min_dur: float) -> list[dict]:
    proc = subprocess.run(
        ["ffmpeg", "-i", str(media), "-af",
         f"silencedetect=noise={noise}:d={min_dur}", "-f", "null", "-"],
        stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True,
    )
    log = proc.stderr
    starts = [float(m) for m in re.findall(r"silence_start: ([\d.]+)", log)]
    ends = [float(m) for m in re.findall(r"silence_end: ([\d.]+)", log)]
    ranges = []
    for i, s in enumerate(starts):
        e = ends[i] if i < len(ends) else None
        if e is None:
            continue
        ranges.append({"start": round(s, 3), "end": round(e, 3),
                       "dur": round(e - s, 3)})
    return ranges


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("media")
    ap.add_argument("--noise", default="-30dB", help="Umbral de ruido (default -30dB)")
    ap.add_argument("--min", type=float, default=0.4,
                    help="Duración mínima de silencio en s (default 0.4)")
    args = ap.parse_args()
    if not Path(args.media).exists():
        sys.exit(f"No existe: {args.media}")
    print(json.dumps(detect(Path(args.media), args.noise, args.min),
                     ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
