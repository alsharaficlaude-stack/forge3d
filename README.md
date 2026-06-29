# Forge3D

A browser-based 3D **design, edit, slice & STL/OBJ/3MF export** suite — runs entirely in the browser, nothing to install. Build from 100+ editable parametric shapes, import & break apart STLs, cut/merge (real CSG booleans), add print connectors, preview slice layers, and export for any 3D printer.

## Features

- **Design** — 100+ editable shapes (prisms, gears, polyhedra, beams, lathed forms…), draw-on-plate tools, extruded 3D text, exact mm/cm/inch sizing, gizmos, align & distribute.
- **Edit** — boolean cut / merge / hollow, mirror, lay-flat, array, on-object editor.
- **Import & break** — import STL, split into separate bodies, plane-cut large models into pieces with alignment connectors (round, square, dovetail…).
- **Big Print** — scale a model to a real-world size and auto-tile it into plate-sized pieces with connectors across multiple plates.
- **Slice** — layer preview, print stats (filament, time), overhang highlight, curated printer library, custom bed sizes.
- **Export** — binary STL, OBJ, and colour-aware 3MF.
- **Quality of life** — light/dark theme, keyboard shortcuts (`?`), auto-recover, save/load project JSON, mobile layout.

## Tech

Single-file front-end. [Three.js](https://threejs.org/) (r128, via CDN) for the WebGL viewport, an embedded public-domain CSG/BSP engine for booleans, [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) + [Space Mono](https://fonts.google.com/specimen/Space+Mono) for type. No build step.

## Run

Open `Forge3D.html` in a modern browser (needs internet for the CDN libraries). The marketing site is `index.html`.

## Files

| File | Purpose |
|------|---------|
| `Forge3D.html` | The editor app (design / draw / slice / big-print) |
| `index.html` | Landing / marketing page |
| `auth.html`, `forge-auth.js` | Prototype accounts (localStorage only — **not real security**) |
| `admin.html` | Prototype user-admin dashboard |
| `forge-ui.css` | Shared design system (landing / auth / admin) |

## Status

Prototype / preview build, evolving. The auth layer stores accounts in the browser only and is for demoing flows — it is not secure and should not be used for real credentials.

---

Built end-to-end in conversation with Claude.
