# El destacado gris del karaoke no existe en los subtítulos vivos; el componente compartido destaca en verde

Fecha: 2026-11-01. Encontrado al revisar la identidad visual para el manual de marca.

## Qué dice el documento

1. `~/REPOS/mi-segundo-cerebro/20-LLM/raw/redsocialbot/aprendizajes-edicion.md:58` dice "Color del destacado: gris, no verde" (pedido del 2026-10-13) y que "se usó #AAB3BD".
2. `aprendizajes-edicion.md:132` repite que "el destacado del karaoke va en gris" y señala como código vivo `Captions` en `src/ReelNexaBalconV3.tsx`.
3. `aprendizajes-edicion.md:256` (revisión previa a mostrar versiones): "destacado en gris".

## Qué hace el código

1. `src/ReelNexaBalconV3.tsx:1048-1051`: cada palabra va en `color: "#ffffff"`; solo cambia el peso (`BOLD.has(c) ? 600 : 300`). No hay color de palabra activa ni gris.
2. `src/noticias-reel/ReelNoticiasV12.tsx:1042-1062` (la aprobada del 2026-10-28): mismo patrón, `color: BLANCO`, peso 600 para `CLAVES` y 300 para el resto. `src/editor-gancho/GanchoEditorV2.tsx:395` igual.
3. `src/components/KaraokeCaptions.tsx:139`: la palabra activa usa `accent`, cuyo valor por defecto es `theme.colors.accent` = `#3FB950` (`src/theme.ts:27`). Lo usan `ReelPlaza.tsx` y `Reel1.tsx` sin sobrescribirlo, y los dos Nexa Guion3 lo sobrescriben con turquesa (`ReelNexaGuion3.tsx:423`, `ReelNexaGuion3V2.tsx:712`).
4. `#AAB3BD` aparece como color de etiquetas secundarias (por ejemplo `src/editor-reel/ReelEditorV8.tsx:42`, `src/noticias-reel/ReelNoticiasV12.tsx:255`), no como destacado de subtítulo.

## Por qué importa

Quien lea la nota espera un karaoke con palabra activa en gris, y el único componente que tiene palabra activa la pinta de verde. Los reels aprobados desde septiembre no tienen palabra activa coloreada: el énfasis es peso 300 contra 600. Hay que decidir cuál es la regla y corregir la nota o el componente. No toqué ninguno.
