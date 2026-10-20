# Ficha de efecto: viñeta

- **id:** R02
- **familia:** Recursos encima
- **nombre:** viñeta
- **qué hace:** Oscurece los bordes y deja el centro libre.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| opacidad en bordes | 0.2 | — |  |
| centro | sin oscurecer | — |  |
| fundido | 10 | frames |  |

## Cuándo usarlo

- Sujeto en primer plano, para dirigir la mirada al centro.
- No usar cuando: planos abiertos donde los bordes aportan información.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/Vignette.tsx`. Su intensidad por defecto (0.85) es más fuerte que esta versión básica.

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
