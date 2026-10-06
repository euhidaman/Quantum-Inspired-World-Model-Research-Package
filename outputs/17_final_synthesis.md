# Integrated research program

**Follow-up update:** [Pretrained adaptation review 18](18_pretrained_model_adaptation_review.md) and [protocol 19](19_adaptation_experiment_protocol.md) extend this original synthesis. They support reusing compatible checkpoints, distinguish predictor-weight adaptation from learned belief augmentation, and add recent overlapping quantum/world-model prior art. Read them before relying on the original novelty assessment. The original 58-family extraction remains a separate, overlapping evidence set.

2026-10-06. Reading guide to the complete output package. Claim tags: ESTABLISHED = verified source in its scope; INFERENCE = reasoned deduction; HYPOTHESIS = untested proposal; SPECULATION = weakly grounded possibility; UNKNOWN = unresolved; OBSERVED = actual saved project measurement. No model-performance result in this package is OBSERVED.

## Part I — Direct recommendation

Prioritize PSC for a small falsification pilot; use QLC as a constrained sequence-model baseline; defer TEC as a main contribution. [INFERENCE] PSC has the most direct robotics mechanism to test—cross-obstacle dependence with explicit capacity—but the same two-agent examples are trivially represented classically. Engineering priority is not publication readiness. All empirical gates are NOT RUN. [Executive recommendation](00_executive_summary.md), [novelty map](04_novelty_map.md).

## Part II — Research gap

The gap is not “representing multiple futures”. [ESTABLISHED] Existing trajectories, mixtures, particles, object interactions and diffusion can already do that, including joint futures (W08–W10,W12–W18). [HYPOTHESIS] An explicit structured belief might improve filtering persistence, calibrated joint risk or failure diagnostics at a constrained resource budget. Define a scenario and observable outcome where its bottleneck matters, and give all classical rivals identical information.

## Part III — Literature synthesis

The review is organized by world models/prediction, tracking/uncertainty, robotics control, and mathematical process/tensor theory. Source status and exact claim locations are in the [database](02_paper_database.csv) and [ledger](03_claim_evidence_ledger.csv). The [review](01_systematic_literature_review.md) explicitly limits its coverage: a curated, logged scoping synthesis cannot establish exhaustive systematic-review completeness or priority. Metadata corrections include DreamerV3 Nature 2025, DINO-WM ICML 2025 and newer HQMM/OOM separation results.

## Part IV — Mathematical formulation

The [formulation](05_mathematical_formulation.md) defines the controlled scene, Bayesian belief, QLC channels/instruments, chain LPDO slots, TEC measures and risk/information objectives. Every equation has symbol definitions and interpretation. Key boundaries: channel linearity is conditional on external context; conditioning is distinct from unconditional dynamics; PSC correlation bounds depend on topology and decoder locality; same-rho TEC equivalence extends to common observation instruments; Born/projective mathematics is classical numerical computation here. Q19 supports the information-theoretic foundation of the chain-cut proof; report 05 labels the assembled derivation as an inference.

## Part V — Gated experiments

First run exact coherence, correlation-capacity and equal-density fixtures. Each has a classical exact solution, so it is a correctness test before it is a potential advantage test. Then learn nontrivial process families with matched memory/latency. PSC must recover all valid modes, not only avoid impossible ones; TEC must make correct useful decisions, not merely diverge. [Stage 0](08_stage0_falsification_protocols.md) specifies probabilities, action costs, numerical tolerances and failure conditions.

Only then build single-obstacle navigation with controlled partial observations, followed by interacting obstacles and held-out indoor/outdoor environments. Real robots follow matched-compute simulation evidence, calibrated timing and supervised safety preparation. [Robotics program](09_robotics_experiment_program.md), [platform decision](11_simulator_and_hardware_selection.md).

## Part VI — Baselines and fairness

Use one planner to isolate latent effects, one predictor to isolate planner effects, and oracle futures to locate bottlenecks. Essential rivals are simple kinematics, Kalman/IMM/particles, joint mixtures, OOM/PSR, recurrent classical beliefs, interaction-aware slots/graphs, joint diffusion/flows and classical tensor factorizations. DWA/Nav2, ORCA, SIPP, sampled MPC/MPPI and a belief-space planner occupy different assumption-dependent roles; no single reactive planner is the universal comparator. [Baseline matrix](07_baseline_matrix.csv).

Count encoder/pretraining, decoder, context, latent bytes, training transitions, tuning trials/failures, inference and planning samples, p99 latency, memory and seeds. Separate matched-parameter, matched-latency and unconstrained frontiers. Never attribute a frontend/planner gain to the latent core.

## Part VII — Statistics and reproducibility

Primary outcome is collision risk over all assigned complete episodes, with a success noninferiority guardrail. Maps, trained models and repeated scenarios induce dependence; frames are not replicates. Select the candidate on validation data, lock the confirmation design, estimate nuisance ranges from a separate pilot, and simulate the exact hierarchical analysis to choose final replication. Current power tables are illustrative independent-binomial calculations only. [Analysis plan](10_statistical_analysis_plan.md), [reproducibility status](15_reproducibility_checklist.md).

The locally timestamped literature protocol is not an external preregistration. Raw search responses, retrieval failures, source versions, command summaries, package versions and generated-figure provenance are preserved. No simulation, full model, robot test, container or CI system is represented as already implemented.

## Part VIII — Venue strategy

The [dated venue report](12_venue_strategy.md) separates current verified policy from inaccessible or unknown instructions. A robotics paper is the first likely track if evidence emerges; ML needs a general representation/method insight, vision needs visual inference results, and journals need substantial depth. RSS 2027's opened live page describes a new two-stage route; it is a possible checkpoint, not justification for premature submission. Near AISTATS/CVPR deadlines do not make this plan an empirical paper. No concurrent overlapping archival submissions are recommended. [Conditional blueprints](13_paper_blueprints.md).

## Part IX — Risks and stop rules

Stop a main-method claim if an equally informed simpler model matches it, the required operational mechanism is absent, calibration fails on held-out shifts, or tail latency is unacceptable. Separate FAIL from INCONCLUSIVE when uncertainty is wide. A negative study needs correct controls and a useful boundary, not one failed optimizer run. Keep catastrophic cases, association/overflow problems, nonconvergence and safety interventions visible. [Risk register](14_risk_register.md), [reviewer objections](16_reviewer_attack_and_response.md).

## Part X — Immediate schedule

Dates are proposed from the user's 2026-10-06 Asia/Taipei context, not promises about compute throughput or publication.

| Window | Work and artifact | Decision |
|---|---|---|
| First 2 weeks: Oct 6–20, 2026 | Review the source/novelty boundary; implement exact tiny fixtures and classical controls; freeze generator configs; record correctness and p99 timing; prepare public protocol if investigators choose | Reject incorrect or redundant mechanisms before large engineering |
| First month: through Nov 6, 2026 | PSC correlation/ordering ladder; learned joint classical/tensor/particle controls; pilot seeds and nuisance estimates; QLC/TEC limited decisive comparisons | Choose one candidate or stop all main-method claims; validate useful capacity signal |
| First 3 months: through Jan 6, 2027 | If gates pass, stable single-obstacle stack, controlled sensors, correlated multi-agent pilot, common-planner tests and power/compute design; reassess a publication track only with concrete evidence | Freeze confirmation model, comparisons and independent holdouts |
| First 6 months: through Apr 6, 2027 | Powered confirmation if feasible, multiple environments and robustness, conditional supervised hardware/transfer, full ablations and failure release | Determine which venue's evidence standard is actually met; otherwise extend or report a rigorous boundary |

Resource estimates and assumptions are in report 11. No robot purchase or expensive compute sweep should precede the cheap falsification gates.

## Answer to the project's success criterion

**A robotics researcher should not yet prefer the proposed cores over a good classical predictor and planner.** [INFERENCE] The reason to investigate PSC is a measurable hypothesis about controlled joint dependence and online filtering. The reason to adopt it would have to be a saved, reproducible improvement on calibrated joint prediction or safe goal-reaching at the same resource budget, surviving strong correlated classical alternatives. If that evidence does not appear, recommend the simpler method.
