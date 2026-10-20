# Ficha de efecto: imagen-emergente

- **id:** R07
- **familia:** Recursos encima
- **nombre:** imagen-emergente
- **qué hace:** Un logo o una imagen entra arriba del sujeto y sale sin taparle la cara.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| entrada | 12 | frames |  |
| curva de entrada | ease-out | — |  |
| permanencia | la duración de la frase | — |  |
| salida | 8 | frames |  |

## Cuándo usarlo

- Nombrar una herramienta o una marca mientras se habla de ella.
- No usar cuando: si tapa la cara, o si se mantiene más que la frase.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/PopUp.tsx` e `src/components/IconPop.tsx` (entran con spring; la versión básica pide ease-out).

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
