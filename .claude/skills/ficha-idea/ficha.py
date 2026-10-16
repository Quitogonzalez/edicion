#!/usr/bin/env python3
"""ficha.py: revisa que una ficha de idea esté completa antes de escribir el guion.

No juzga si la idea es buena: rechaza la que llega sin dato propio, sin tres
ganchos, sin comparar contra la mediana o sin condición para descartarla.

  python3 ficha.py ideas/2026-10-16-mi-idea.md
  python3 ficha.py --json ideas/2026-10-16-mi-idea.md
"""
import argparse
import importlib.util
import json
import re
import sys
from pathlib import Path

PILARES = {"construir", "negocios y plata", "vida y equilibrio"}
SECCIONES = ["Tesis", "Pilar", "Ganchos", "Evidencia propia", "Estructura", "Referencia", "Apuesta", "Descarte"]
DURACION = (30, 60)
# Los ganchos se puntúan con la skill vecina; si no está, la ficha se revisa igual sin puntaje.
GANCHO_PY = Path(__file__).resolve().parent.parent / "gancho-y-descripcion" / "gancho.py"


def secciones(texto):
    out, actual = {}, None
    for linea in texto.splitlines():
        m = re.match(r"^##\s+(.+?)\s*$", linea)
        if m:
            actual = m.group(1)
            out[actual] = []
        elif actual:
            out[actual].append(linea)
    return {k: "\n".join(v).strip() for k, v in out.items()}


def puntuador():
    if not GANCHO_PY.exists():
        return None
    spec = importlib.util.spec_from_file_location("gancho", GANCHO_PY)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.revisar


def revisar(texto):
    s = secciones(texto)
    fallas, avisos, ganchos = [], [], []
    for nombre in SECCIONES:
        cuerpo = s.get(nombre, "")
        if not cuerpo:
            fallas.append(f"{nombre}: falta o está vacía")
        elif re.search(r"<[^>]+>", cuerpo):
            fallas.append(f"{nombre}: quedó texto de plantilla entre < >")

    pilar = s.get("Pilar", "").strip().lower()
    if pilar and pilar not in PILARES and "<" not in pilar:
        fallas.append(f"Pilar: '{pilar}' no es uno de los 3 (Construir, Negocios y plata, Vida y equilibrio)")

    lineas = [re.sub(r"^\d+[.)]\s*", "", x).strip() for x in s.get("Ganchos", "").splitlines() if re.match(r"^\d+[.)]", x.strip())]
    if len(lineas) != 3:
        fallas.append(f"Ganchos: tienen que ser 3 numerados, hay {len(lineas)}")
    puntuar = puntuador()
    if puntuar and lineas:
        ganchos = sorted((puntuar(g) for g in lineas), key=lambda r: -r["puntaje"])
        if ganchos[0]["puntaje"] < 50:
            fallas.append(f"Ganchos: el mejor saca {ganchos[0]['puntaje']}, menos de 50")
    elif not puntuar:
        avisos.append("Ganchos: no encontré gancho.py, quedaron sin puntaje")

    evidencia = s.get("Evidencia propia", "")
    if evidencia and not re.search(r"\d", evidencia):
        fallas.append("Evidencia propia: no trae ningún número (vistas, plata, días, personas)")

    tiempos = re.findall(r"^\s*(\d+)\s*[-–]\s*(\d+)\s*s\b", s.get("Estructura", ""), re.M)
    if not tiempos:
        fallas.append("Estructura: no hay tramos con tiempo (ej. 0-3 s: gancho)")
    else:
        total = max(int(b) for _, b in tiempos)
        if not DURACION[0] <= total <= DURACION[1]:
            fallas.append(f"Estructura: dura {total} s, la regla es {DURACION[0]}-{DURACION[1]} s (si pasa de 60, justifícalo)")
        if int(tiempos[0][1]) > 3:
            avisos.append(f"Estructura: el primer tramo termina en {tiempos[0][1]} s; el gancho va en los primeros 3")

    apuesta = s.get("Apuesta", "")
    if apuesta:
        if not re.search(r"mediana\D{0,20}\d", apuesta, re.I):
            fallas.append("Apuesta: no dice contra qué mediana se compara (número y fuente)")
        if not re.search(r"\b(validada|apuesta)\b", apuesta.split("Tipo:", 1)[-1], re.I):
            fallas.append("Apuesta: falta 'Tipo: validada' o 'Tipo: apuesta'")

    descarte = s.get("Descarte", "")
    if descarte and not re.search(r"\d", descarte):
        fallas.append("Descarte: la condición necesita un número (vistas, horas, porcentaje)")

    return {"lista": not fallas, "fallas": fallas, "avisos": avisos, "ganchos": ganchos}


def main():
    ap = argparse.ArgumentParser(description="Revisa una ficha de idea de reel.")
    ap.add_argument("ficha")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    r = revisar(Path(a.ficha).read_text(encoding="utf-8"))
    if a.json:
        print(json.dumps(r, ensure_ascii=False, indent=2))
    else:
        print("LISTA para guion" if r["lista"] else "NO está lista")
        for f in r["fallas"]:
            print(f"  falta  {f}")
        for w in r["avisos"]:
            print(f"  ojo    {w}")
        for i, g in enumerate(r["ganchos"]):
            print(f"  {'->' if i == 0 else '  '} {g['puntaje']:5.1f}  {g['gancho'][:70]}  (lo más débil: {g['mas_debil']})")
    sys.exit(0 if r["lista"] else 1)


if __name__ == "__main__":
    main()
