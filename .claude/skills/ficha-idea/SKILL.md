---
name: ficha-idea
description: Prepara una idea antes del guion con tesis, fuente, mirada de Quito, aperturas verbal y visual, estructura y forma de revisarla. Admite reflexiones sobre libros/podcasts sin exigir cifras ni resultados propios. No escribe el guion final ni edita video.
allowed-tools:
  - Read
  - Write
  - Bash
---

# ficha-idea

La ficha prepara una conversación y una pieza concreta. `ficha.py` comprueba
campos y coherencia temporal; no juzga interés ni predice viralidad.
La ficha operativa vive en **la misma página de Notion**. `ideas/` puede guardar
un artefacto técnico enlazado desde ella; no es otro calendario ni backlog.

## Contexto que recuperas

1. Lee el índice editorial vigente y solo sus criterios pertinentes:
   `${OBSIDIAN_VAULT_PATH:-$HOME/REPOS/mi-segundo-cerebro}/20-LLM/raw/redsocialbot/conocimiento-editorial/README.md`.
2. Consulta `estrategia.md`, `voice.md` y `guia-produccion-reels.md` en
   `30-PERSONAL/marca-personal/` del vault. La preparación habitual es contexto
   y punteo para hablar. No alteres la voz curada.
3. Recupera la ficha actual de Notion y feedback de esa pieza. Antes de edición,
   lee `20-LLM/raw/redsocialbot/aprendizajes-edicion.md`.
4. Usa Radar para métricas con plataforma, fecha y procedencia. Una mediana de
   Instagram no es benchmark de YouTube. Si falta muestra comparable, ND.

## Preparación

1. Identifica el tipo: **reflexión**, experiencia, demo, actualidad o idea.
   Para reflexiones, separa fuente y mirada literal de Quito. Un libro necesita
   título/autor y pasaje, capítulo o página de su edición; un podcast, episodio
   y enlace, más minuto si consta. Una conversación propia también puede ser
   fuente. Distingue cita comprobada, resumen e interpretación.
2. Una reflexión no necesita anécdota ni resultado personal. Para experiencias
   y demos, pide evidencia real si falta; puede ser cualitativa. No inventes
   números para completar campos. Si ya explicó su postura, trabaja con ella;
   si falta, haz una sola pregunta concreta y espera.
3. Desarrolla la tesis, tres entradas y lo que promete cada una. Valora frase,
   primera imagen y contexto de quien mira. Los puntajes del helper vecino
   son heurísticos; no elijas una apertura solo por su nota.
4. Completa `plantilla.md` como artefacto enlazado y ejecuta:
   `python3 .claude/skills/ficha-idea/ficha.py ideas/<archivo>.md`.
   Acuerda duración por pieza. Una ficha LISTA aún no está aprobada.
5. Presenta lo concreto y conserva el alcance del feedback: aprobar una
   apertura no aprueba guion, montaje o publicación. Mantén la pauta vigente
   en su página; no acumules V1/V2/V3 allí.

## Revisión tras publicar

Conserva enlace publicado, fecha y métricas observadas con su fuente. Registra
qué aprendimos y qué queda sin saber. Muchas vistas no demuestran retención
ni causalidad, y una muestra pequeña no obliga a descartar un tema.
El feedback de Quito queda literal, con revisión y alcance; no se convierte
por defecto en una regla universal.
