# Novelty boundaries and contribution map

**Updated evidence, 2026-10-06:** the [adaptation supplement](18_pretrained_model_adaptation_review.md) adds direct density-state world-model prior art (UWM-JEPA), complex/density-like world-model experiments (QSWM), pretrained predictor surgery (FactorJEPA), and quantum-inspired weight adaptation (QuanTA, QuIC, Quantum-PEFT). These findings supersede any implication below that those broad combinations remain unestablished. The three world-model papers are preprints with material limitations detailed in the supplement. Novelty must concern a narrower validated method, diagnostic or resource/performance result.

`[INFERENCE]` The most defensible near-term program is a **conditional PSC pilot**, with QLC as a theory/ablation baseline and TEC deferred until a classical branch-memory comparison leaves an unresolved gap. This is an engineering-priority judgment, not evidence that PSC is novel or superior. No publication gate has passed.

## Prior art versus proposed contribution

| Core | Established object / prior art | Project synthesis | Candidate new contribution [HYPOTHESIS] | Untested benefit / closest classical rival |
|---|---|---|---|---|
| QLC | Density operator, CP instruments, HQMM learning and OOM/PSR relations (Q01–Q06,Q14–Q16) | Action/observation-conditioned density belief in obstacle forecasting | A particular constrained estimator or identifiable task statistic with measured budget advantage | Calibration or filtering efficiency; OOM, recurrent categorical state, mixture/flow |
| PSC | Locally purified PSD tensor networks; tensor probabilistic models; BP contraction/gauging (Q04,Q07–Q09,Q17) | Object existence/intention slots, structured joint futures, continuous pose heads and online control | A budget-controlled filtering algorithm plus validated diagnostic for graph/order/truncation failure in dynamic navigation | Lower forbidden joint mass or useful risk calibration; classical tensor factors, graph/attention predictor, joint mixture/particles/diffusion |
| TEC | Nonunique pure-state decompositions, quantum trajectories, classical particle filters (Q11–Q13,W12–W14) | Persistent joint scene branches and sensing actions | A task-grounded branch state/update or diagnostic beyond equal-cost classical particles | Active perception or sample reuse; labeled particles, mixture over policies, POMCP |

`[ESTABLISHED]` HQMMs and locally purified sequence constructions have a studied connection (Q04, relevant uniform/infinite-length assumptions). Calling the same mathematical structure “QLC” or arranging it across slots does not erase that prior art. In the finite-memory stationary setting, published 2024 work separates finite HMM, finite HQMM and more general linear process models (Q14). This is a process-class result, not a navigation speed or sample-complexity theorem. The earlier HQMM/OOM open-question wording is outdated in that scope.

`[ESTABLISHED]` Joint correlated multi-agent prediction already appears in Scene Transformer and MotionDiffuser (W09,W10). Persistent track labels, cardinality/existence uncertainty and pruning diagnostics also have substantial random-finite-set/filtering precedents (W15–W18). Claims that classical methods only represent independent futures, or that any truncation diagnostic is new, are unsound.

## Exact novelty questions, answered separately

| Question | QLC | PSC | TEC |
|---|---|---|---|
| Exact mathematical object? | Trace-one PSD complex matrix plus instruments | Chosen chain/tree locally purified tensor representation of a joint slot belief | Weighted measure on projective rays, optionally with additional persistent labels |
| Already a sequence model? | Yes: HQMM/OOM-related literature | Yes for closely related locally purified sequence factorizations; topology/variable role matter | Quantum trajectory mathematics and classical particle sequence inference predate this proposal |
| Already a world model? | Yes: UWM-JEPA directly uses a density-state world model; QSWM uses complex/density-like states. Exact proposed navigation implementation remains unverified | Object-centric dynamics and tensor sequence models exist separately; FactorJEPA adds related pretrained factorized-predictor work | Particle/state ensemble world prediction already exists |
| Already in navigation/dynamic prediction? | Exact proposed implementation UNKNOWN in this bounded search | Exact LPDO slot filter for these tasks UNKNOWN | Classical branch/particle navigation is established; exact complex-ray variant UNKNOWN |
| New application only? | Density model applied to robot data may be only this | Possible unless slot binding/update/truncation/control adds a demonstrated principle | Likely if projective coordinates just reparameterize particles |
| Parameterization change only? | Yes unless measurable constrained-process difference matters | Yes unless structure trades accuracy for compute usefully | Yes unless persistent variables change the sufficient state and complexity |
| Optimization contribution? | None yet; a newly validated constrained learner could qualify | None yet; online adaptive bonds/gauging require independent validation | None yet; resampling and branch updates need comparator ablation |
| Evaluation contribution? | Operational-coherence control with history-aware rivals | Impossible-mode/capacity/failure benchmark | Equal-rho plus correct environmental branch discrimination |
| What defeats claimed novelty or advantage? | Prior same controlled estimator/benchmark defeats novelty; equal-cost classical performance defeats the advantage claim | Prior same slot tensor filter defeats novelty; graph/mixture/tensor parity defeats claimed utility advantage | Prior equivalent branch method defeats novelty; equal-rho equivalence or particle parity defeats the proposed operational advantage |

Novelty and utility are distinct: a new algorithm can offer no advantage, and a useful known algorithm can be appropriate for a new task. Matching behavior with a baseline does not by itself establish historical prior art.

Absence of an exact match in the present retrieved set is `[UNKNOWN]`, never a first-use claim. Before submission, extend backward/forward citation searches and search implementation terminology (PSD recurrent models, tensor-train Bayesian filters, graphical filtering, multi-hypothesis tracking, interacting multiple-model filters) that may omit “quantum”.

## What could justify engineering

PSC offers an explicit, testable dependence bottleneck with a tunable bond budget; this makes failure easier to probe. The meaningful claim would be narrower than universal expressiveness: *under a specified sparse interaction regime and matched latency, the selected factorization reduces calibrated joint forecasting error enough to change navigation decisions.* The hypothesis must survive a dense oracle on small tasks, simple joint mixture, a graph model and a classical nonnegative/tensor factorization. Complex amplitudes and purification need their own ablations.

QLC is useful for detecting when coherence terminology is operationally empty and for testing constrained recurrent process models. TEC is useful only after the project identifies a persistent environmental variable compressed away by rho and demonstrates why an ordinary particle state is insufficient at the matched budget. Adding arbitrary branch-conditioned nonlinearity alone is not a new physical principle.

The contribution can also be negative: a reproducible map of where the cores collapse to classical alternatives, with operational tests and cost evidence. Merely reporting no improvement on an undertuned implementation is insufficient.
