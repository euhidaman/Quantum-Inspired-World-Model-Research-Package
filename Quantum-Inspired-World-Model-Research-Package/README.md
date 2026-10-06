# Quantum-Inspired World-Model Research Package

This package contains the final 17-slide presentation and a separate light-mode, offline website built around one understandable room scenario.

## Open the presentation

Open `presentation/Quantum-Inspired-World-Model-Cores-Meow-Style-17-Slides.pptx` in Microsoft PowerPoint, Keynote, or LibreOffice Impress. The deck uses the supplied `meow.pptx` design language and includes speaker notes with a `[Sources]` block on every slide.

## Run the website

The simplest option is to double-click `website/standalone.html`. It has no package-install step and does not require internet access.

For the editable version, keep these three files in the same folder and open `website/index.html`:

- `index.html`
- `styles.css`
- `app.js`

You may also serve the folder locally:

```bash
cd website
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## What the website demonstrates

The same 3D room can be viewed through four model structures:

- **Current baseline:** one compact or factorized latent state.
- **Quantum Latent Core (QLC):** one density-matrix belief whose decoded room alternatives can remain jointly represented.
- **Purified Slot Core (PSC):** room and object slots linked by a compressed tensor-network structure.
- **Trajectory Ensemble Core (TEC):** separate, weighted complete-room future branches.

Below the room simulator, the additive **Latent Space Geometry** lab shows how the internal state structures differ:

- a curved learned manifold for the compact baseline;
- spectrum and basis/coherence directions for the density-matrix proposal;
- woven tensor-network slot surfaces for PSC;
- weighted future-trajectory branches for TEC.

Every drawing is explicitly labeled as a 3D teaching projection of a higher-dimensional state space. QLC is not presented as a larger sphere, and coordinate count is not presented as proof of greater useful information.

The visualization is a synthetic teaching tool, not a benchmark result. A richer state family is useful only if it improves prediction or planning under matched parameters, memory, FLOPs, and latency.

## Editing the website

Edit `website/styles.css` for appearance and `website/app.js` for scene behavior. After editing, run:

```bash
cd website
node build-standalone.mjs
```

This regenerates `standalone.html` from the editable source files.
------------------------------------

The **quantum part is in the mathematics used to store and update the world model’s belief**, not in the room, robot, sensors, or hardware.

**Quantum Latent Core (QLC):** the latent state is a density matrix ( ρ ). Its diagonal stores ordinary probabilities; off-diagonal values store **coherence**, meaning relationships between possible room states that can affect future predictions. Updates use quantum probability rules such as Kraus/CPTP maps and Born-rule measurements. 

**Purified Slot Core (PSC):** the room is divided into object slots, but the joint belief is stored as a locally purified tensor network. The bond dimension ( χ ) controls how much correlation can be represented between objects, for example, how seeing one object changes belief about another hidden object. 

**Trajectory Ensemble Core (TEC):** the model stores several weighted pure-state branches. Each branch is one complete possible future; averaging the branches produces the density matrix. 

So the claim is not that the physical room is quantum. The proposal borrows **quantum probability, state geometry, and tensor-network mathematics** to build richer latent beliefs. Everything still runs using normal floating-point computation, no qubits or quantum speed-up. 


**Why this latent space is better:** World models may encode futures implicitly in one vector, forcing models to learn possibilities and relationships from scratch; our proposals represent them within the latent state.

QLC stores relationships between alternatives, PSC connects object beliefs with controllable correlation capacity (χ), and TEC preserves separate complete futures rather than only their average.  

This can preserve ambiguity, propagate evidence between related objects, and expose prediction failures rather than requiring an ordinary vector to learn these structures implicitly.
