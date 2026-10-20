# Ficha de efecto: empuje-lento

- **id:** C01
- **familia:** Cámara
- **nombre:** empuje-lento
- **qué hace:** Avance lento hacia el sujeto durante todo el plano.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| escala inicial | 1.00 | escala |  |
| escala final | 1.04 | escala |  |
| duración | la del plano | frames |  |
| curva | ease-in-out | — |  |

## Cuándo usarlo

- Planos de habla estáticos que necesitan vida.
- No usar cuando: si el plano ya se mueve de forma visible.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/CameraFootage.tsx` (push tipo Ken Burns).

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
