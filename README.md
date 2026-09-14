# 📸 Restaurador de Fotos — v2.1

# 📷 Restaurador de Fotos

Herramienta web para restaurar y mejorar fotografías antiguas directamente desde el navegador.

<p align="center">
  <a href="https://alfredosan-eng.github.io/restaurador_fotos/">
    <img src="https://img.shields.io/badge/🚀%20Abrir%20Restaurador%20de%20Fotos-4285F4?style=for-the-badge" alt="Abrir Restaurador de Fotos">
  </a>
</p>

Herramienta web **client-side** para corregir y mejorar fotografías antiguas sin enviar las imágenes a un servidor de procesamiento.

La v2.1 cierra la primera gran etapa del proyecto combinando rendimiento para imágenes grandes con restauración heurística local.

> **Nota:** la restauración avanzada no utiliza IA generativa. Los algoritmos trabajan sobre píxeles y no pueden reconstruir información que ya no existe.

## 🚀 Evolución

```text
v1.0 → Corrección cromática + Canvas
v1.1 → Nitidez segura + Touch + PNG
v1.2 → Web Worker + Transferable Buffer
v1.3 → Preview reducida + Exportación full-resolution
v2.1 → Ruido + Rayones + Restauración de color
```

## ⚡ v1.3 — Rendimiento

### Preview reducida

Para editar, la imagen se reduce de forma proporcional hasta un máximo de **1600 px en su dimensión mayor**.

Ejemplo:

```text
6000 × 4000 original
       ↓
1600 × 1067 preview
```

Los sliders trabajan sobre la preview, evitando procesar millones de píxeles en cada cambio.

### Exportación full-resolution

Al descargar:

```text
Original
   ↓
Canvas a resolución completa
   ↓
Web Worker
   ↓
Procesamiento
   ↓
JPG / PNG
```

La preview no limita la resolución del archivo exportado.

### Web Worker

El trabajo intensivo sigue en `image-worker.js`.

El buffer RGBA utiliza `ArrayBuffer` transferible.

### Debounce y jobs

Los cambios rápidos de controles se agrupan y cada operación tiene un identificador para evitar resultados obsoletos.

## 🧠 v2.1 — Restauración avanzada

### Reducción de ruido

Filtro local 3×3 configurable. Su objetivo es reducir pequeñas variaciones y ruido antes de aumentar contraste o nitidez.

### Reparación de rayones

Detector heurístico de outliers de luminancia.

Compara el píxel con sus vecinos verticales y horizontales y mezcla anomalías fuertes con el entorno.

Es útil para pequeñas marcas aisladas, pero **no es inpainting ni restauración semántica**.

### Restauración de color

Implementación aproximada de Gray World para compensar dominantes globales.

No sustituye un flujo profesional ICC/colorimétrico.

## 🔐 Privacidad

El procesamiento de fotografías es local.

No se añadió:

- API de imágenes.
- Backend.
- Base de datos.
- SDK de IA.
- Servicio cloud de restauración.

Las únicas dependencias externas del frontend siguen siendo Tailwind CSS y Font Awesome vía CDN.

## 🧩 Tecnologías

- HTML5
- CSS3
- JavaScript Vanilla
- Canvas API
- ImageData
- Web Workers
- Transferable ArrayBuffer
- Pointer Events

## 🏗️ Arquitectura

```text
                     MAIN THREAD
                          │
                ┌─────────┴─────────┐
                │                   │
             UI/Sliders         Canvas Preview
                │                   │
                └─────────┬─────────┘
                          │
                    ImageData buffer
                          │
                    Transferable
                          ▼
                 ┌─────────────────┐
                 │ image-worker.js │
                 │                 │
                 │ Color           │
                 │ Noise           │
                 │ Scratch repair  │
                 │ Sharpening      │
                 └────────┬────────┘
                          │
                     Result buffer
                          │
                          ▼
                       Canvas
                          │
                     Export JPG/PNG
```

## 📁 Estructura

```text
restaurador-fotos-antiguas/
├── index.html
├── image-worker.js
├── README.md
├── CHANGELOG.md
├── .gitignore
└── docs/
    ├── TECHNICAL_NOTES.md
    └── ROADMAP.md
```

## 🚀 Ejecución local

Como el proyecto usa Web Worker, es preferible ejecutarlo mediante HTTP:

```bash
python3 -m http.server 8000
```

Después:

```text
http://localhost:8000
```

## 🌐 GitHub Pages

`index.html` es la entrada y `image-worker.js` debe permanecer accesible desde el mismo origen.

## 📈 Memoria

Un buffer RGBA requiere aproximadamente 4 bytes por píxel.

Por ejemplo:

```text
6000 × 4000 = 24 MP
24 MP × 4 ≈ 96 MB
```

Eso es solo un buffer. El navegador puede mantener simultáneamente Canvas, imagen decodificada y buffers adicionales.

Por eso v1.3 reduce el coste interactivo mediante preview.

## 🧪 Estado final

**v2.1 — Advanced Restoration**

Esta versión cierra la etapa inicial de desarrollo:

- Preview optimizada.
- Worker.
- Exportación full-resolution.
- JPG.
- PNG.
- Touch/stylus.
- Reducción de ruido.
- Reparación heurística.
- Restauración de color.
- Nitidez edge-safe.

## 👤 Autor

**AlfredoSan**

GitHub: https://github.com/alfredosan-eng

## 📄 Licencia

MIT License

Copyright (c) 2026 Alfredo San

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
