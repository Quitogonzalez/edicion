# Ficha de efecto: recuadro-de-captura

- **id:** R03
- **familia:** Recursos encima
- **nombre:** recuadro-de-captura
- **qué hace:** Muestra una captura de pantalla en un marco redondeado.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| ancho | 880 | px |  |
| posición | centrada, en la mitad superior, dentro de la zona segura | — |  |
| radio | 24 | px |  |
| sombra | 20 | % |  |
| entrada | 10 | frames |  |

## Cuándo usarlo

- Mostrar una pantalla mientras se habla de ella.
- No usar cuando: si la captura no se lee a 880 px de ancho.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/LandingFlash.tsx` (marco de navegador con entrada por spring).

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
