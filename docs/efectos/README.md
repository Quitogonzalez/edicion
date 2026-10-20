# Efectos genéricos para reels verticales

Repertorio de efectos para reels de 1080×1920 a 30 fps. Sirve para cualquier video: no es de un reel concreto y no fija colores ni tipografías. Esos vienen de `src/theme.ts`.

**Estado: diseño, sin probar.** Todos los valores de esta página son de partida. Se validan en el Mac y quedan en la ficha de cada efecto. El costo de render también se mide allí; ningún número de costo está escrito aquí.

Plantilla de ficha: [`ficha.md`](ficha.md).

## Principios

1. **Versión básica primero.** Cada efecto se implementa con los valores de su fila en las tablas de abajo, sin ajustes. Nada se personaliza por defecto.
2. **Personalizar sólo por el video.** Se ajusta un efecto cuando el video tiene un problema concreto: ritmo, legibilidad, un énfasis que hace falta. Cada ajuste se anota en la ficha con su motivo. Sin motivo, se revierte.
3. **Nítido pero natural.** El texto se ve nítido. La imagen no se sobreafila ni se le suben contraste o saturación para que "se vea de película".
4. **Cinematográfico, sutil.** El look sale de pocos elementos (grano leve, viñeta suave, zoom contenido), no de muchos efectos a la vez.
5. **Zoom moderado.** La escala total de un plano no pasa de 1.08, el mismo tope que usa `CameraFootage.tsx`. Nada de zooms con rebote.
6. **Cada efecto cumple una función:** marcar un corte, ordenar un dato, dar énfasis, sostener la voz. Si no cumple ninguna, no entra.
7. **Pocas capas a la vez.** Como máximo un recurso encima y un efecto de cámara activos al mismo tiempo, además de los subtítulos.
8. **Sin rebote por defecto.** Las entradas usan ease-out. Los springs con rebote se reservan para énfasis, y la ficha tiene que justificarlos.
9. **Unidades.** Lo visual va en frames (1 s = 30 frames). El audio va en ms y dB. Los números de esta página son de partida.
10. **Zona segura.** Se usa `SAFE` de `src/theme.ts`: ningún texto importante en los 192 px superiores ni en los 288 px inferiores, ni a menos de 80 px de los bordes laterales.

## Fuera del repertorio

Estos efectos no entran en ninguna familia. Si un video parece pedir uno, primero se prueba con un efecto del repertorio. Si aun así hace falta, se discute y queda escrito en una ficha.

- **Transiciones de presentación:** cubo, persiana, estrella, iris, barrido con rebote, "cortina".
- **Neón, resplandor (glow), contornos luminosos, hologramas, escaneos.**
- **Estética de IA:** partículas, bokeh generado, brillos "mágicos", gradientes de texto de moda, trazos orgánicos decorativos.
- **Destellos de luz:** flash blanco o de color, lens flare.
- **Glitch, aberración cromática, distorsión.**
- **Capa amarilla:** ningún tinte, overlay ni fondo amarillo, en ningún efecto.
- **Sonidos de cliché por defecto:** whoosh, riser, impacto. Sólo con motivo explícito en la ficha.

## Repertorio

Cada efecto tiene un `id`: la letra es la familia y el número no se reutiliza. Las columnas de "versión básica" son el punto de partida.

### T · Transiciones

Entre planos. El corte es la base; el resto se usa poco.

| id | nombre | qué hace | versión básica |
|---|---|---|---|
| T01 | corte-seco | Cambia de plano sin transición. | 0 frames. Es el default de todo corte. |
| T02 | fundido-cruzado | Un plano se disuelve en el siguiente. | 8 frames, lineal. |
| T03 | fundido-a-negro | Cierra un bloque a negro y abre el siguiente desde negro. | 10 frames de salida y 10 de entrada, ease-in-out. |
| T04 | corte-en-movimiento | Corta en el pico de un gesto o un paneo para que la imagen parezca continua. | Corte en el frame de mayor movimiento, 0 frames. |

### C · Cámara

Movimiento sobre un plano ya grabado.

| id | nombre | qué hace | versión básica |
|---|---|---|---|
| C01 | empuje-lento | Avance lento hacia el sujeto durante todo el plano. | Escala 1.00 → 1.04 en la duración del plano, ease-in-out. |
| C02 | punch-in | Acercamiento corto para remarcar una frase. | 1.00 → 1.06 en 8 frames, mantiene 12, vuelve a 1.00 en 10. |
| C03 | deriva | Movimiento mínimo y constante para que el plano no quede muerto. | ±6 px en X e Y, ciclo senoidal de 8 s. |
| C04 | reencuadre | Pasa de encuadre abierto a cerrado dentro del mismo plano. | 1.00 → 1.08 con desplazamiento al punto de interés, 20 frames, ease-out. |
| C05 | cámara-lenta | Baja la velocidad para remarcar un gesto. | 0.6×, rampa de 12 frames de entrada y 12 de salida. |

### R · Recursos encima

Capas sobre el footage. Como máximo una activa a la vez. Sin tintes ni texturas generadas (humo, polvo animado).

| id | nombre | qué hace | versión básica |
|---|---|---|---|
| R01 | grano | Grano fino de película. | Monocromático, opacidad 0.05, cambia cada 2 frames, mezcla soft-light. |
| R02 | viñeta | Oscurece los bordes y deja el centro libre. | Opacidad 0.2 en los bordes, centro sin oscurecer, fundido de 10 frames. |
| R03 | recuadro-de-captura | Muestra una captura de pantalla en un marco redondeado. | 880 px de ancho, centrada en la mitad superior y dentro de la zona segura. Radio 24 px, sombra al 20 %, entra en 10 frames. |
| R04 | recuadro-del-sujeto | El sujeto en un recuadro, para los split-screen. | 880 px de ancho, mitad inferior, radio 24 px, sin sombra. |
| R05 | énfasis-de-área | Marca una zona de la pantalla con un trazo fino. | Trazo de 3 px en el color de acento, esquinas con el radio del tema, sin brillo. Entra y sale en 8 frames. |
| R06 | barra-de-progreso | Muestra el avance del reel. | 6 px de alto en el borde inferior, relleno en el color de acento. |
| R07 | imagen-emergente | Un logo o una imagen entra arriba del sujeto y sale sin taparle la cara. | Entra en 12 frames con ease-out, se mantiene mientras dura la frase y sale en 8 frames. |

### X · Texto

| id | nombre | qué hace | versión básica |
|---|---|---|---|
| X01 | subtítulos-karaoke | Grupos cortos de subtítulos; la palabra activa se ilumina. | Grupos de 3 a 4 palabras (~1.1 s), palabra activa en el color de acento, resto atenuado, sin rebote. Centro vertical, fuera de la franja inferior segura. |
| X02 | titulo-de-plano | Título grande sobre el plano. | Entrada `fadeUp` de `motion.ts`: 40 px de desplazamiento, 22 frames. |
| X03 | tercio-inferior | Nombre, cargo o dato bajo el sujeto, sin taparle la cara. | Borde inferior a 288 px del fondo, máximo 2 líneas, `fadeUp`. |
| X04 | cifra-que-cuenta | Un número sube hasta su valor final. | De 0 al valor en 30 frames, ease-out, sin decimales salvo que el dato los necesite. |
| X05 | cita | Frase textual con su atribución. | Máximo 3 líneas, `fadeUp`, atribución en el color de texto secundario. |

### A · Audio

| id | nombre | qué hace | versión básica |
|---|---|---|---|
| A01 | música-bajo-voz | La música baja cuando hay voz (ducking). | Base −18 dB, con voz −28 dB, ataque 100 ms, liberación 600 ms. |
| A02 | clic-de-corte | Un clic muy corto en un corte que importa. | −22 dB, 80 ms o menos. Sólo en cortes T01 marcados como énfasis, nunca en todos. |
| A03 | nivel-parejo | Voz y mezcla con el mismo nivel en todos los clips. | Mezcla final a −14 LUFS integrados, pico real −1 dBTP. |
| A04 | fundido-de-audio | Entrada y salida suaves del audio. | Entrada 300 ms, salida 500 ms. Acompaña a T03 y al cierre. |

## Lo que ya existe en el código

Mapa de `src/components` contra el repertorio, para no reescribir lo que ya está. Esta página no cambia el código.

| Componente | id | Nota |
|---|---|---|
| `CameraFootage.tsx` | C01, C02, C03 | Su punch-in llega a 1.08; la versión básica propuesta es 1.06. Su "realce" (brillo, contraste, viñeta) combina varios efectos y necesita ficha propia. |
| `Vignette.tsx` | R02 | Intensidad por defecto 0.85, más fuerte que la versión básica. |
| `LandingFlash.tsx` | R03 | Marco de navegador con entrada por spring. |
| `SubjectPiP.tsx` | R04 | Mismo sujeto en un recuadro redondeado. |
| `PopUp.tsx`, `IconPop.tsx` | R07 | Entran con spring; la versión básica pide ease-out. |
| `KaraokeCaptions.tsx` | X01 | Grupos de ~1.1 s, palabra activa en verde. |
| `LowerThirdCTA.tsx` | X03 | Tercio inferior, bajo el sujeto. |
| `motion.ts` | X02, R07 | `fadeUp` coincide con X02. `popIn` tiene rebote (damping 12): sólo para énfasis justificado. |
| `StartTransition.tsx` | ninguno | Un panel que sube al inicio es un barrido de presentación. Recomendación: retirarlo. El colado de los primeros segundos se recorta en el corte; si el hook necesita esos segundos, un fundido de 8 frames (T02). |

## Archivos

- `README.md`: esta página. Principios, repertorio y reglas.
- `ficha.md`: plantilla de una ficha por efecto.
- `fichas/<id>-<nombre>.md`: una ficha por efecto, creada desde la plantilla. Ya existen las 25.

El repo es público: las fichas no llevan rutas personales ni material de los reels.

## Ciclo de vida de un efecto

1. **Nuevo.** Se crea la ficha desde `ficha.md` con veredicto *sin probar* y el siguiente id libre de su familia. Un efecto que no encaja en ninguna familia se discute antes de tener id.
2. **Probar.** Se prueba en su versión básica sobre un video real, en el Mac. El costo de render se mide con el mismo reel de prueba para todos los efectos, para que los números sean comparables.
3. **Ajustar.** Sólo si el video lo pide. Cada ajuste se escribe en la ficha con su motivo.
4. **Veredicto.** Lo pone quien dirige el reel, nunca el agente que monta. Los valores son:
   - *Favorito:* el que se usa por defecto en su familia. Como máximo uno por familia, y sólo después de dos reels reales.
   - *Aprobado:* sirve en reels, sin ser el preferido. Exige haberlo usado en al menos un reel real.
   - *Sin probar:* nuevo o sin medir.
   - *Rechazado:* no se usa. La ficha queda con el motivo para no volver a proponerlo.

La validación visual y auditiva la hace quien dirige el reel. El agente no puede ver ni oír el render.

Orden de prueba: primero T01, X01, C02, R02, A01 y A03, porque aparecen en casi todos los reels. El resto queda en *sin probar* hasta que un reel lo pida.

## Pendiente

- Medir el costo de render en el Mac, con y sin cada efecto.
- Probar T01, X01, C02, R02, A01 y A03, y poner sus veredictos.
- Retirar `StartTransition.tsx`: decidido, pero el cambio de código no está hecho.
- Validar los valores de partida con el primer reel de prueba.
