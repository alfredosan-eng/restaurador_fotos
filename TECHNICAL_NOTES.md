# Technical Notes — v2.1

## Preview

La edición utiliza una resolución limitada:

```text
PREVIEW_MAX_DIMENSION = 1600
```

La función `getPreviewSize()` mantiene la relación de aspecto.

## Full-resolution export

`renderFullResolution()` crea un Canvas temporal con las dimensiones originales.

El procesamiento full-resolution solo se ejecuta al exportar.

## Worker

`image-worker.js` recibe:

```text
type
jobId
width
height
buffer
options
```

El buffer se transfiere mediante:

```javascript
worker.postMessage(message, [buffer])
```

y se devuelve de la misma forma.

## Request manager

`workerRequests` es un `Map` que asocia cada `jobId` con una Promise.

Esto permite gestionar preview y exportación sin reemplazar el handler global del Worker.

## Debounce

Los sliders esperan 100 ms antes de iniciar el procesamiento de preview.

## Restauración de color

`applyGrayWorld()` calcula promedios RGB y aplica una compensación parcial según `colorRestore`.

## Reducción de ruido

`boxBlurBlend()` usa un vecindario 3×3 y mezcla el resultado con el píxel original según la intensidad.

## Reparación de rayones

`repairScratches()` compara luminancia con los cuatro vecinos cardinales.

La operación solo actúa cuando la diferencia supera un umbral fijo.

No existe detección semántica de rayones.

## Nitidez

`unsharpSafe()` conserva el contenido original del borde mediante una copia inicial del buffer.

## Limitaciones

La estrategia mejora la experiencia con imágenes grandes, pero no elimina los límites de memoria del navegador.

La exportación full-resolution puede requerir varios buffers grandes.

## Futuras mejoras fuera de v2.1

- Procesamiento por tiles.
- OffscreenCanvas.
- Cancelación explícita de tareas.
- Benchmarks.
- Gestión EXIF/orientación.
- Gestión avanzada de color.
- IA opcional como módulo separado.
