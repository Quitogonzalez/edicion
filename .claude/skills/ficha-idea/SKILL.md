---
name: ficha-idea
description: Arma y revisa la ficha de una idea de reel ANTES del guion. Úsala cuando Quito diga "tengo una idea para un reel", "arma la ficha", "esta idea sirve?", "qué grabo esta semana", o cuando reel-editor arranque un reel sin ficha. Llena tesis, pilar, 3 ganchos, dato propio, estructura de 30-60 s, referencia, comparación contra su mediana y condición de descarte, y la valida con ficha.py. NO escribe el guion final (eso es social-media-strategist) ni edita (eso es reel-editor).
allowed-tools:
  - Read
  - Write
  - Bash
---

# ficha-idea

Lo que más tiempo le toma a Quito no es editar: es definir bien la idea. Esta
ficha obliga a que cada idea llegue con un dato suyo y una apuesta medible
antes de gastar una hora en guion y edición.

El porqué de cada campo, con su caso real:
1. **Evidencia propia.** Los reels de tips genéricos de IA quedaron bajo su
   mediana (2.017 y 2.517 vistas). El de un caso real como freelance sacó 5.247.
2. **Tres ganchos.** El gancho se elige comparando, no con el primero que sale.
3. **Apuesta contra la mediana.** Sin un número de referencia no hay forma de
   saber después si la idea funcionó o solo pareció buena.
4. **Descarte.** Una idea sin condición para morir se repite aunque no rinda.

## Fuentes que lees antes de llenarla

1. Reglas de marca (única fuente): `pilares.md`, `voice.md` y
   `guia-produccion-reels.md` en
   `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}/30-PERSONAL/marca-personal/`.
2. Mediana y lo que ya se probó: `C:\agentes\data\redes\aprendizajes.md` en el PC.
   Desde el Mac: `ssh motor 'Get-Content C:\agentes\data\redes\aprendizajes.md'`.
   Copia la mediana con su fecha; si el archivo no responde, dilo y no inventes
   el número.
3. Ganchos de referentes: `_research/competencia-2026-10-01/04-hooks-quito.json`
   (86 ganchos clasificados por familia) en la misma carpeta de marca.
4. Preferencias de edición: `20-LLM/raw/redsocialbot/aprendizajes-edicion.md`.

## Proceso

1. Copia `plantilla.md` a `ideas/AAAA-MM-DD-<slug>.md` en la raíz del repo.
2. Llena los 8 campos. Si Quito no te dio el dato propio, pregúntaselo: es el
   único campo que no puedes buscar tú.
3. Corre el revisor y arregla lo que marque:
   ```bash
   python3 .claude/skills/ficha-idea/ficha.py ideas/<archivo>.md
   ```
4. Muéstrale a Quito la tesis, los 3 ganchos con su puntaje y la apuesta. Él
   elige el gancho; tú recomiendas uno con su motivo.
5. Con su OK, cambia `estado: borrador` a `estado: aprobada` y pasa al guion.

## Después de publicar

A las 48 h, anota en la misma ficha las vistas reales y si cumplió la
condición de descarte. Si contradice algo de `aprendizajes.md`, propón la línea
nueva para ese archivo.

## Qué no es

`ficha.py` revisa que la ficha esté completa, no que la idea sea buena. El
puntaje de los ganchos sale de `gancho-y-descripcion/gancho.py`: filtra
saludos y ganchos sin nada concreto, no predice vistas.
