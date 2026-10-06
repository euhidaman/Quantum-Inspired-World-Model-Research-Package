# Research Source Map

The presentation's speaker notes contain slide-specific source blocks. These are the main primary sources used for the architecture and mathematical claims.

## Current world-model baselines

- Hafner et al., **Mastering Diverse Domains through World Models (DreamerV3)**: https://arxiv.org/abs/2301.04104
- Hansen et al., **TD-MPC2: Scalable, Robust World Models for Continuous Control**: https://arxiv.org/abs/2310.16828

## Quantum Latent Core

- Bengtsson, Weis, and Życzkowski, **Geometry of the Set of Mixed Quantum States**: https://arxiv.org/abs/1112.2347
- Srinivasan et al., **Learning Hidden Quantum Markov Models**: https://proceedings.mlr.press/v84/srinivasan18a.html
- Adhikary et al., **Expressiveness and Learning of Hidden Quantum Markov Models**: https://proceedings.mlr.press/v108/adhikary20a.html

## Purified Slot Core

- Werner et al., **A Positive Tensor Network Approach for Simulating Open Quantum Many-Body Systems**: https://arxiv.org/abs/1412.5746
- Schollwöck, **The Density-Matrix Renormalization Group in the Age of Matrix Product States**: https://arxiv.org/abs/1008.3477
- SlotFormer, an object-centric dynamics comparator: https://openreview.net/forum?id=TFbwV6I0VLg

## Trajectory Ensemble Core

- Hughston, Jozsa, and Wootters, **A Complete Classification of Quantum Ensembles Having a Given Density Matrix**: https://doi.org/10.1016/0375-9601(93)90880-9

## Accuracy boundaries used throughout

- A full complex density matrix over nominal basis dimension `d` has `d²−1` real degrees of freedom; a categorical distribution over `d` outcomes has `d−1`. This is a coordinate comparison, not proof of more useful information or better prediction.
- The Bloch ball is exact only for `d=2`. Higher-dimensional state spaces are constrained convex bodies; a 3D drawing is only a projection.
- Density-matrix entries are not interacting physical particles. QLC interaction is implemented by learned valid operators; PSC uses tensor-network bonds; TEC requires explicit branch-aware dynamics or readouts.
- Every proposed advantage must be evaluated against matched classical baselines at comparable parameters, memory, compute, and latency.

