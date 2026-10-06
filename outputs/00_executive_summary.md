# Structured latent world models: recommendation

**Pretrained-adaptation addendum (2026-10-06):** [Review 18](18_pretrained_model_adaptation_review.md) shows feasible routes for reusing pretrained weights and separates weight adapters from PSC belief augmentation. It also adds UWM-JEPA, QSWM and FactorJEPA as overlapping prior art. Read that supplement before using this original summary to make a novelty claim. [Protocol 19](19_adaptation_experiment_protocol.md) specifies the next checkpoint-reuse experiment.

Prepared 2026-10-06. **Allocate the first engineering effort to a small PSC falsification pilot. Keep QLC as a mathematical baseline; defer TEC as a main method.** This is `[INFERENCE]` from the reviewed theory and practical testability, not a performance result. No structured core has yet earned a robotics-paper claim or passed an empirical gate.

The practical question is whether explicit, persistent **joint** obstacle beliefs improve calibrated prediction and navigation at an equal latency/memory budget. Existing world models and trajectory predictors already represent multiple futures, including correlated multi-agent futures. The defensible gap is a measured tradeoff in representation, filtering and control—not access to otherwise “infinite” possibilities.

The main evidence is recorded by source ID in [the paper database](02_paper_database.csv), [claim ledger](03_claim_evidence_ledger.csv), and [review](01_systematic_literature_review.md):

- `[ESTABLISHED]` HQMM, OOM and purified sequence-model prior art sharply limits QLC novelty (Q01–Q06,Q14). A larger density-matrix parameter count is not evidence of useful advantage.
- `[INFERENCE]` PSC provides a controllable dependence bottleneck, but its two-obstacle demonstration is exactly solvable by a joint table or two classical mixture components. It must beat strong joint classical controls on scaling, not only independent slots (Q07,Q17,W09,W10).
- `[INFERENCE]` Equal-density TEC ensembles give the same observations under common linear channels/instruments. Branch-conditioned models can differ because they retain extra information; identical information must be supplied to classical particles (Q11,W12–W14; derivation in report 05).

The main risks are prior-art overlap, hidden decoder/context capacity, uncalibrated rare-event risk, slot association/cardinality failures, contraction latency, and unfair baselines. Discarded weight, purity and branch spread are diagnostic candidates, not established safety certificates.

Next three actions:

1. Implement the small exact fixtures and classical controls in [Stage 0](08_stage0_falsification_protocols.md); save probabilities, errors, costs and failed runs. Do not build a full hybrid.
2. Use the PSC correlation ladder to test rank capacity, ordering, joint classical competitors and whether truncation diagnostics detect held-out failures. Stop the PSC contribution if simple joint models match its frontier.
3. Only after a useful Stage 0 result, freeze a common predictor/planner interface and run the single-obstacle pipeline before correlated multi-obstacle navigation. Use the [statistics plan](10_statistical_analysis_plan.md) to set final sample counts from pilot nuisance estimates.

This package is a **bounded, auditable evidence review and prospective research program**, not a completed exhaustive systematic review or empirical paper. Source-access failures, abstract-only records, publication-status uncertainty and search coverage are disclosed. The locally recorded review protocol is not a public registry submission. No robot hardware is assumed available. All computation proposed is ordinary classical numerical linear algebra.

Start with the [integrated ten-part synthesis](17_final_synthesis.md). It links the experiment ladder, fair baselines, resource estimates, publication options and dated 2-week/1-month/3-month/6-month schedule.
