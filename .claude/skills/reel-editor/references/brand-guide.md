# brand-guide — el alma del contenido de Quito

> Referencia de gusto/voz/marca. La guía original la redactó otra IA: tomá el alma,
> no la sigas al pie de la letra. Ante la duda: **simple, limpio y humano.**

## Quién soy / qué transmito
Dev de 20 años construyendo en público: dirijo a la IA para crear cosas reales
(productos, agentes, sistemas). Le hablo a gente joven que quiere entender la IA de
hoy **sin humo**. No vendo "hazte rico con IA". Muestro el proceso real: lo que
funciona, lo que rompo, cómo pienso. Vulnerable cuando corresponde (cuento lo que
fallé antes de lo que logré). Español chileno natural.

## Los 4 pilares (cada reel pertenece claro a UNO)
1. **Dirigiendo a la IA** — cómo le saco jugo real a modelos/agentes.
2. **Construyendo en público** — detrás de escena de lo que estoy creando.
3. **Disciplina y sistema** — cómo me organizo, hábitos, segundo cerebro.
4. **Opinión con criterio** — tomas contracorriente, bien fundadas.

## Estructura (esqueleto de todo reel)
| Bloque | Tiempo | Qué pasa |
|---|---|---|
| Hook | 0–3s | Frase que para el scroll. Concreto, sin clickbait. Texto grande desde el frame 1. |
| Contexto | 3–10s | Qué es / por qué importa, SIMPLE. |
| Desarrollo | 10–30s | 2–3 puntos clave, con ejemplo/pantalla real. |
| CTA | últimos 3–5s | Accionable o pregunta que invite a comentar. **Nunca "sígueme para más".** |

**Regla de oro: si el primer segundo no detiene el scroll, el resto no existe. El hook se diseña primero.**

## Estética / dirección de arte
- Base visual: **screen recordings reales** (terminal, editor, el agente trabajando) + **tomas reales** (cara, escritorio). Cero stock cliché.
- Paleta: fondo oscuro tipo editor (#0D1117–#161B22), texto casi-blanco (#E6EDF3), **UN** color de acento (default #3FB950). Menos es más. Todo en `src/theme.ts`.
- Tipografía: dos familias máx. Mono para código/datos (JetBrains Mono). Sans limpia para captions/títulos (Inter). Bold para hooks, regular para el resto.
- Movimiento: sutil y con intención. Entradas con spring. Cortes al ritmo de la voz. Nada de transiciones de PowerPoint.
- Densidad: **una idea por pantalla. Aire.**

## Specs técnicas (no negociable)
9:16 · 1080×1920 · 30fps (60 solo si hay mucho movimiento de pantalla) · 15–40s
(justificar si pasa de 45s) · H.264 MP4 bitrate alto (≥10 Mbps) · audio AAC 48kHz ·
sin marca de agua · **captions quemados siempre** · safe zones: nada clave en 15%
inferior ni 10% superior.

## Audio y ritmo
Voz al frente (conecta). Música −18/−20 dB, discreta, nada épico de gurú. Cortá
pausas muertas y muletillas. Los cortes de plano y la aparición de texto caen con
el énfasis de la voz.

## 🚫 Anti-patrones
Stock genérico de "IA" (hologramas azules, robots, cerebros neón) · hooks que
prometen y no entregan · texto saturando · transiciones de PowerPoint · música épica
tapando la voz · tono vendehúmo / plata fácil · sobrescribir una escena en vez de versionarla.
