# Room Latent Lab

A small, dependency-free website that compares four ways a world model can represent an occluded room:

- a compact or factorized current baseline;
- a quantum-inspired density-matrix core (QLC);
- a Purified Slot Core (PSC);
- a Trajectory Ensemble Core (TEC).

The room is rendered by a lightweight canvas perspective engine. No external libraries, server, quantum hardware, or internet connection are required.

The additive **Latent Space Geometry** lab compares four interactive 3D teaching projections:

- a learned occupied manifold for the current compact baseline;
- a density-matrix spectrum with lifted basis/coherence directions for QLC;
- woven local-state surfaces joined by tensor-network bonds for PSC;
- weighted, branching future trajectories for TEC.

These are projections of high-dimensional mathematical state spaces, not literal physical shapes. In particular, QLC is not drawn as a larger sphere: its additional coordinates describe a constrained matrix-state family and do not guarantee better predictions.

## Run it

Open `index.html` directly in a modern browser. If your browser restricts local scripts, start any static file server in this folder, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

You can also open `standalone.html`, which contains the HTML, CSS, and JavaScript in one file.

## Files

- `index.html` — accessible page structure
- `styles.css` — light presentation-style layout
- `app.js` — 3D room renderer, latent-geometry renderer, and interactions
- `standalone.html` — generated single-file version
- `build-standalone.mjs` — regenerates the standalone file and conversation visualization fragment

## Scientific scope

This is a conceptual simulator, not benchmark evidence. It does not claim that all current world models use one deterministic vector, nor that density-matrix mathematics automatically provides more useful information. Every proposed representation must be compared with matched-parameter and matched-compute baselines.
