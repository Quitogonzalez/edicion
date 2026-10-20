# Ficha de efecto: subtítulos-karaoke

- **id:** X01
- **familia:** Texto
- **nombre:** subtítulos-karaoke
- **qué hace:** Grupos cortos de subtítulos; la palabra activa se ilumina.

## Parámetros básicos

| Parámetro | Valor por defecto | Unidad | Desviaciones (motivo) |
|---|---|---|---|
| grupo | 3 a 4 palabras (~1.1 s) | — |  |
| palabra activa | acento del tema | — |  |
| resto | atenuado | — |  |
| rebote | ninguno | — |  |
| posición | centro vertical, fuera de la franja inferior segura | — |  |

## Cuándo usarlo

- Cualquier video hablado.
- No usar cuando: en ventanas con gráfica a pantalla completa: los subtítulos se ocultan.

## Costo de render

Pendiente. Medir en el Mac con el reel de prueba común a todos los efectos: tiempo de render con el efecto y sin él, en segundos.

## Origen

existente: `src/components/KaraokeCaptions.tsx`.

## Veredicto

**sin probar**. Lo pone quien dirige el reel.

Motivo: recién diseñado; sin render medido ni validado con un reel.
