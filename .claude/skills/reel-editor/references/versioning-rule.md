# versioning-rule — regla CRÍTICA de versionado de escenas

> Cuando Quito dé feedback o pida cambios a una escena: **NO sobrescribas ni reemplaces la original.**

## Reglas
- **No** edites la escena original en su lugar.
- **No** borres la versión anterior.
- Creá una **versión nueva**, justo después de la original.
- Naming obligatorio:
  - Archivo: `HookSceneV2.tsx`, `HookSceneV3.tsx`, …
  - Etiqueta/comentario: `// Escena X V2 — [Nombre original]`
- Swapeá la versión nueva en `Reel.tsx` (cambiá el import), dejando la original intacta.
- **Ramificá desde la ÚLTIMA versión, no desde la original**: V3 se construye sobre V2. El número de escena queda fijo; solo incrementa la versión.

## Por qué
Mantiene el workflow limpio, preserva las iteraciones y hace el historial de revisiones
fácil de seguir. Quito siempre puede volver a una versión anterior.

## Ejemplo
```
src/scenes/
  HookScene.tsx       ← original, NO se toca
  HookSceneV2.tsx     ← revisión 1 (nueva)
  HookSceneV3.tsx     ← revisión 2 (nueva)
```
```tsx
// en Reel.tsx, para usar la V2:
import { HookSceneV2 as HookScene } from "./scenes/HookSceneV2";
```

Esto aplica IGUAL a overlays de HyperFrames: nuevo archivo `overlay-X-v2.html`, no sobrescribir.
