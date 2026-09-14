# Changelog

## [2.0.0] - 2026-09-14

### Added
- Added heuristic noise reduction.
- Added conservative scratch/isolated-defect repair.
- Added advanced color restoration using a Gray World approximation.
- Added controls for the three advanced restoration functions.

### Performance
- Completed the v1.3 preview-first architecture.
- Added bounded 1600 px preview processing.
- Full-resolution processing is now reserved for export.
- Preserved Web Worker and transferable pixel buffers.
- Preserved slider debounce and job management.

### Export
- JPG export processes the original full-resolution image.
- PNG export processes the original full-resolution image.

### Documentation
- Updated README.
- Updated technical notes.
- Closed the v1.3/v2.1 development roadmap.

## [1.2.0]
- Added Web Worker processing.
- Added transferable ArrayBuffer.
- Added debounce and job IDs.

## [1.1.0]
- Fixed sharpening edge handling.
- Added Pointer Events.
- Added PNG export.
- Added processing indicator.
