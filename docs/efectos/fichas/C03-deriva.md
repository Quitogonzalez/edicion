# Ficha de efecto: deriva

- **id:** C03
- **familia:** Cámara
- **nombre:** deriva
- **qué hace:** Movimiento mínimo y constante para que el plano no quede muerto.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| amplitud | ±6 | px en X e Y |  |
| ciclo | 8 | s |  |
| curva | senoidal | — |  |

## Cuándo usarlo

- Planos fijos largos.
- No usar cuando: si el plano ya se mueve con C01 o C04.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/CameraFootage.tsx` (micro-drift).

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
