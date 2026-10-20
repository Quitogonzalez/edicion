# Ficha de efecto: punch-in

- **id:** C02
- **familia:** Cámara
- **nombre:** punch-in
- **qué hace:** Acercamiento corto para remarcar una frase.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| escala pico | 1.06 | escala |  |
| entrada | 8 | frames |  |
| mantiene | 12 | frames |  |
| salida | 10 | frames |  |
| tope de escala total | 1.08 | escala |  |

## Cuándo usarlo

- Una frase de énfasis.
- No usar cuando: más de un punch-in en pocos segundos, o cualquiera con rebote.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/CameraFootage.tsx` (punch-in ~1.08). La versión básica propuesta es 1.06.

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
