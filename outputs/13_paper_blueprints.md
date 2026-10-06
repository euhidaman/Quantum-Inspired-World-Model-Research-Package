# Conditional paper blueprints

All titles, contributions and abstracts below are proposals [HYPOTHESIS]. No completed experimental claim is available. Select one principal representation after Stage 0; do not advertise a three-core hybrid as a contribution.

## A. Robotics paper — first engineering target

Candidate title: **Correlation-Bounded Beliefs for Navigation among Interacting Dynamic Obstacles**. Alternative, only if the purification matters: **Locally Purified Slot Beliefs for Risk-Aware Robot Navigation**.

Potential contribution statement: an online joint-belief update with controlled correlation capacity; a benchmark separating impossible joint futures from marginal prediction error; and a validated accuracy–safety–latency tradeoff against classical joint predictors. Each clause requires its own measured evidence. Merely using an LPDO is not sufficient novelty.

Abstract outline: state partial-observation/correlated-future navigation problem; acknowledge existing joint predictors; identify the particular capacity/filtering limitation; specify the proposed core and common planner; insert actual evaluation setting, effect/interval and cost only after measurement; conclude with failure regimes. No anticipated percentage gain belongs in the draft.

Figure plan: motivating equal-marginal/different-joint decision; architecture and latent accounting; Stage 0 rank/forbidden-mass/proper-score curves; calibration by occlusion; safety–latency Pareto; representative failure and real-robot sequence. Experiment tables: oracle controls; matched-parameter/latency main results; chi/kappa and classical factorization ablations; generalization; sensing/controller latency breakdown. Potential venue family: CoRL, ICRA/IROS or RA-L when evidence is ready; report 12 governs current policy.

## B. Representation/methods paper

Candidate title: **Operational Tests for Structured Belief Cores in Sequential Decision Models**.

Contribution must include a precise model nesting/equivalence boundary or new estimator plus multiple tasks beyond a single navigation environment. Required rivals: OOM/PSR, recurrent classical states, joint mixtures/flows, particles and diffusion. Include exact-rho null tests and classical counterexamples. Potential venues: AISTATS/ICML/ICLR/NeurIPS or JMLR, depending on completed scope; a name change alone is insufficient.

Abstract outline: identify an ambiguity in claims of representation advantage; formalize observable equivalence; present an evaluation/algorithmic principle; report reproduced positive and negative regimes; state limitations. Figures: inclusion/equivalence map with assumptions, exact fixtures, scaling curves and failure taxonomy. Tables: degrees of freedom versus actual memory/cost; process families; score/latency; optimizer sensitivity and seed uncertainty.

## C. Visual world-model paper

Candidate title: **Joint Object Beliefs through Occlusion for Visual Navigation**.

Proceed only with RGB-D/video data, explicit tracking/slot-binding analysis and a contribution in visual inference. Compare SAVi/SlotFormer-style interaction models, pretrained-feature prediction, joint trajectories and relevant diffusion/occupancy models. A ground-truth state simulator with colored disks is inadequate evidence. Target CVPR/ICCV/ECCV only after visual representation quality and downstream planning are both established; TPAMI/IJCV require journal-depth evidence and verified current instructions.

Abstract/figure plan: expose occlusion-induced identity/intent ambiguity; describe visual updating and binding; demonstrate controlled perceptual failure recovery; connect to planning outcomes; show sequence overlays, identity-switch distributions, calibration and compute. Separate frontend gains from the belief-core intervention using oracle detections and a shared encoder.

## D. TEC active-perception paper — deferred

Candidate title: **Persistent Future Hypotheses for Active Robot Perception**. Avoid “quantum” in the title unless the projective representation survives real-particle ablations.

Required result: task-grounded information missing from rho, correct branch-conditioned predictions, and decisions better than equally informed classical particles/POMCP at matched cost. Same-rho divergence alone does not qualify. Figures: exact equality null, numeric peek-task solution, physical occluder sensing action, classical branch-memory frontier and branch-survival failures. If particles match, publish the classical method or the equivalence boundary without suggesting a quantum benefit.

## E. Journal extension or negative result

Journal candidate: **Structured Beliefs for Dynamic Navigation: Capacity, Calibration, and Transfer**. Require new theory or filtering method, substantially broader indoor/outdoor/real-robot evidence, failure diagnosis and reusable artifacts beyond any conference predecessor. T-RO/IJRR fit systems/navigation depth; JMLR fits representation/learning depth; TPAMI/IJCV require visual contribution. Cite and disclose the prior paper and explain the substantive extension; never submit overlapping manuscripts concurrently.

Negative-result candidate: **When Structured Quantum-Inspired Beliefs Reduce to Classical Alternatives**. Required contribution is a reproducible operational boundary, matched-cost evidence and a useful failure explanation; failure of one optimizer or an underpowered experiment is insufficient. Include all passed/failed/inconclusive gates, algebraic counterexamples, tuning budgets and complete raw outputs. Venue selection waits for the actual completed insight.
