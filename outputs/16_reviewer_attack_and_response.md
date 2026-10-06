# Hostile but fair reviewer audit

Status: design review, not a rebuttal to actual peer review. Every response is conditional on evidence that must still be collected. Source IDs resolve in the ledger/database.

| Objection | Validity and evidence | Required experiment / design change | Defensible response only if supported |
|---|---|---|---|
| “Quantum theatre” | Valid if terminology substitutes for a useful algorithm; all proposed computation is classical | Compare real/complex and classical parameterizations; state exact operational object | A named inductive bias with a measured constrained-budget result, never hardware advantage |
| “HQMMs already exist” | Correct: Q01–Q04,Q14 | Map exact controlled model to prior art; test a new estimator or task property | Acknowledge existing model class; claim only demonstrated new component |
| “Density matrix is expensive classical storage” | Correct cost concern | Count real scalars, actual bytes, contraction/readout time; compare OOM/vector | Tradeoff is useful in a stated regime, if measured |
| “Networks encode correlation implicitly” | Correct; W09,W10 and interaction slots | Strong graph/attention/joint predictors and classical tensors | Explicit structure gives a particular efficiency/diagnostic benefit, not exclusive expressiveness |
| “Particles already give multiple futures” | Correct: W12–W18,R09 | Persistent weighted joint particles with same labels/history | Only a remaining matched-budget advantage justifies the new representation |
| “Diffusion is multimodal” | Correct: W04,W10 | Joint diffusion with fixed denoiser evaluations and encoder | Measure filtering/calibration/latency tradeoff, not ability to sample alone |
| “Scene area law is unproved” | Correct | Long-range/ordering/dense-graph stress tests; exact tiny oracle | State sparse-correlation empirical regime and observed failure boundary |
| “BP may not converge” | Correct: Q08,Q09 are conditional/approximate | Residual, iteration cap, exact comparison, damping and fallback cost | Bounded algorithm with disclosed nonconvergence frequency |
| “Fixed slots fail at entry/exit” | Correct without existence/association handling | Absence state, births/exits, ID ambiguity, overflow; LMB/GLMB | Demonstrated finite-capacity handling; no unbounded-cardinality claim |
| “TEC identity is gauge” | Correct in common-channel/Born model | Exact equal-rho null, phase/permutation tests and correct environmental branch task | Additional grounded classical information, with particle comparison |
| “Parameter count is not expressiveness” | Correct | Separate observable process class, learned accuracy, bytes and latency | Only scoped class theorem or measured practical result |
| “More compute caused gain” | Plausible | Both budget strata, equal tuning and full pipeline profiles | Pareto evidence with comparable inputs and costs |
| “Classical planners are weak” | Valid if only a naive controller | DWA/Nav2, ORCA, sampled MPC, SIPP/oracle and belief-space control in appropriate roles | Results against assumptions-matched, competently tuned baselines |
| “No real robot” | True now | High-fidelity/real transfer after gate; independent monitor | Claim simulation scope honestly until transfer is completed |
| “Simulator too simple” | True for Stage 0 by design | External replay + reactive policies; multiple maps/sensors | Small tasks isolate mechanism; larger tasks establish external validity |
| “Too slow online” | UNKNOWN until profiling | P99 end-to-end latency, jitter, fallback and missed deadline rates | Actual control-budget feasibility on stated hardware |
| “Uncertainty uncalibrated” | UNKNOWN | Common-query calibration, joint/event scores, subgroup/OOD coverage | Empirically calibrated scope, never unconditional safety guarantee |
| “Planner caused improvement” | Plausible confounding | Crossed predictor/planner blocks and oracle controls | Attribute only the controlled contrast |
| “Representation not identifiable” | Correct gauge/coordinate concern | Equivalent-state/operator transformations; operational equivalence and history tests | Use only invariant/task-defined diagnostics; avoid physical interpretation of latent coordinates |
| “Known pieces, no new principle” | Serious current concern | Demonstrate one new algorithm, diagnostic or useful constrained tradeoff | Narrow contribution with explicit prior-art mapping; otherwise negative/method-boundary result |

Additional design failures identified during this review: forbidden-state mass alone rewards a collapsed valid mode; the protocol now co-requires distribution recovery. Best-of-K trajectory metrics improve mechanically with K; hold K fixed and add proper scores/coverage. Binary CVaR can saturate and mirror expected-risk ordering; use a justified severity distribution before claiming a distinct benefit. Conditioning collision rate on success induces a post-treatment selection problem; report all assigned episodes and a success guardrail.

Decision: a polished explanation cannot answer these objections without data. The current defensible deliverable is the falsifiable research program, mathematical boundaries and source record. Do not write a rhetorical rebuttal to an objection that remains true.
