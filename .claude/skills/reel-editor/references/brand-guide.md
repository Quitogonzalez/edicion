# brand-guide — resumen de la marca de Quito para editar

> Desde el 2026-11-02 la fuente única es el manual de marca del vault,
> `~/REPOS/mi-segundo-cerebro/30-PERSONAL/marca-personal/manual-de-marca.md`.
> Esta guía es su resumen para el taller. Si algo choca, manda el manual.
> El feedback fino sigue en `aprendizajes-edicion.md` del vault.
> Las piezas de NexaCGS siguen su propio brief, no esta guía.

## Quién es y qué transmite
Construye productos con IA y muestra cómo, lo que funciona y lo que no. Su diferencia
es separar lo real del humo y mostrar qué herramientas dan valor de verdad.
Personalidad "taller abierto". Proceso real, errores incluidos y cada resultado con su
dato. No es el gurú ni el arquitecto que entrega todo terminado. Español chileno
natural con tuteo.

## Los 3 pilares
Fuente única `30-PERSONAL/marca-personal/pilares.md` del vault.
1. **Construir (hoy, con IA).** Herramientas, conceptos, actualidad, Jarvis, casos de uso.
2. **Emprendimiento y proyectos.** NexaCGS, despiAPP y otros. Sin plata como tema.
3. **Vida y equilibrio.** Hábitos, deporte, estudios, reflexiones.

## Estructura
| Bloque | Tiempo | Qué pasa |
|---|---|---|
| Gancho | 0 a 3 s | Frase que para el scroll y que entiende alguien que no conoce sus proyectos. Texto grande desde el cuadro 1. |
| Contexto | 3 a 10 s | Qué es y por qué importa, simple. |
| Desarrollo | hasta el cierre | Puntos con pantalla o material real. Cada bloque agrega algo. |
| Cierre | últimos 3 a 5 s | "Sígueme" con motivo y el botón real de Instagram, o la lección. Nunca "sígueme para más". |

Quito cuenta, no lee. El guion es referencia y la edición sigue lo que grabó.

## Color
| Token | Valor | Uso |
|---|---|---|
| tinta | `#0B0F14` | Fondo |
| blanco | `#FFFFFF` | Texto, sombra `0 4px 22px rgba(0,0,0,.55)` |
| gris claro | `#C3CAD1` | Secundario |
| gris medio | `#AAB3BD` | Etiquetas |
| crema | `#F3EBDD` | Solo notas a mano |
| amarillo dato | `#FFE14A` | Solo subrayar el dato real con zoom |

El verde `#3FB950` dejó de ser acento el 2026-11-01. `src/theme.ts` todavía lo tiene
como `accent` y `KaraokeCaptions` lo usa por defecto. En piezas nuevas no se usa.
`#0D1117` y `#E6EDF3` son valores viejos. El turquesa es de NexaCGS.
Color del video natural, igualado entre cortes, oscuro sutil y nunca amarillo.

## Tipografía
Tres familias con rol fijo.
1. **Inter** para todo. Subtítulos 300 con clave 600. Cifras 800. Portada 850 y bajada 500.
2. **Caveat 600 crema** solo para notas a mano.
3. **JetBrains Mono** solo para código y terminales reconstruidas.
Excepción del motivacional, Inter 760 con Snell Roundhand Bold. Un calco usa la fuente
de su referencia. Didot es de NexaCGS y Syne está prohibida.

## Subtítulos
Karaoke de grupos cortos, Inter minúscula 62 px, palabra por palabra con desenfoque.
Clave en 600 y resto en 300, todo blanco, sin color en la palabra activa. Tercio
inferior, nunca sobre la cara. Revisados palabra por palabra contra lo que dijo.
Sin puntos ni viñetas en pantalla.

## Movimiento
Recursos reales, nunca tarjetas ni pops genéricos. Cifras con conteo. Entradas desde
0,95 con desenfoque y salida más rápida. La pantalla cambia cada 3 a 7 s. Humo con
whoosh en cortes de sección y pop en cada aparición. Se edita quitando.

## Specs técnicas
9:16, 1080 × 1920, 30 fps (60 solo con mucho movimiento de pantalla). Reel de 30 a 60 s
de referencia; tutorial y noticias hasta unos 2 min 30 s si cada bloque aporta.
H.264 de 10 Mbps o más, AAC 48 kHz, sin marca de agua, subtítulos quemados siempre.
Nada clave en el 15 % inferior ni en el 10 % superior.

## Audio
Voz al frente, -15 LUFS y pico -1 dBTP. Riser al inicio, whoosh sutil en cada corte y
un SFX por aparición. Por defecto sin música de fondo en piezas habladas; si va,
discreta, nunca épica y entregada aparte. Medir y corregir los 43 ms de atraso del
mp4 de Remotion.

## Portadas
Cuadro real de Quito con buen gesto, Codex solo para luz y nitidez. Capa gris 18 %,
degradado abajo, título Inter 850 en dos líneas y bajada Inter 500 dentro del 3:4.

## Anti-patrones
1. Stock de IA (hologramas, robots, cerebros de neón).
2. Ganchos que prometen y no entregan.
3. Texto saturando o sobre la cara.
4. Música épica tapando la voz.
5. Tono vendehúmo o plata fácil.
6. Sobrescribir una escena aprobada en vez de crear una versión nueva.
