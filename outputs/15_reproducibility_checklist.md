# Reproducibility checklist and artifact status

## Delivered research artifacts

- [x] Supplied master prompt archived; existing nested package preserved.
- [x] Upstream skill documentation and observed commit cached; skills/dependencies/use logged.
- [x] Local review protocol recorded before scientific searches; initial SHA-256 saved.
- [x] Source queries/retrieval responses, evidence extraction, status/access limits and failed calls retained.
- [x] Thematic review, source database, claims, hypotheses, Stage 0, experiment/statistics/venue plans created.
- [x] Analytical examples labeled as derivations, empirical gates labeled NOT RUN.
- [x] Conceptual figures generated with reproducible source; no fabricated performance plots.
- [x] Bibliography, CSV schema and source-ID consistency checked by assembly audit.
- [ ] Independent human double screening and full database coverage: not completed.
- [ ] Public protocol/preregistration deposit: not performed.
- [ ] Complete license audit of candidate baseline dependencies/weights/datasets: not completed.

## Required before model training

- [ ] Versioned generator configs and exact observation/transition/cost definitions.
- [ ] Train/validation/test separation at scene/policy/episode level; hash raw input and split lists.
- [ ] Seeds for model initialization, environment, policies, planner, resampling and optimizer; save actual run schedule.
- [ ] PSD/trace/shape/probability/gauge tests, exact small tensor contraction, association/cardinality and overflow semantics.
- [ ] Belief-core and planner interface schemas; normalized sample/likelihood contracts and units.
- [ ] Same input history, encoder/pretraining, decoder, cost, horizon and planner budget per comparison.
- [ ] Full parameter/state/optimizer memory accounting; hyperparameter-search and failed-run budgets.
- [ ] Simulator physics, sensor/render configuration, map/asset licenses and committed package lock.
- [ ] Container recipe after platform selection, with image digest and external proprietary-component instructions; do not claim a reproducible container before it builds.
- [ ] CI for numerical invariants, deterministic replay and artifact schema; CI must not launch uncontrolled robot tests.

## Required before reporting results

- [ ] All raw episodes/predictions/outcomes and timing traces retained; failed runs included.
- [ ] Hardware/driver/clock/OS information; warm-up and synchronization timing procedure.
- [ ] P50/P95/P99 latency and misses; peak memory; training time, transitions, seeds and total tuning compute.
- [ ] Primary estimand, practical margins, analysis, exclusions and multiplicity locked before confirmation.
- [ ] Power/precision based on actual pilot nuisance ranges; null calibration and fit failures reported.
- [ ] Interval resampling respects map/model/scenario dependence; no timestep pseudoreplication.
- [ ] Collision, success, deadlock, timeout and interventions jointly reported; missing safety logs not coded zero.
- [ ] Calibration on common queries and on-policy evaluations separated.
- [ ] Pareto frontiers drawn from actual saved runs, uncertainty and omitted/failed points disclosed.
- [ ] Exact paper versions, corrections, publication status and code licenses rechecked before submission.
- [ ] Human investigator reviews every mathematical claim and primary source; AI assistance disclosed under the venue policy.

## Required before real-robot trials

- [ ] Matched-compute simulation gate passed; braking, watchdog, monitor and emergency stop tested.
- [ ] Safety/ethics review appropriate to participants/site; consent and data handling specified.
- [ ] Controlled trial progression, supervisor and incident/restart procedure.
- [ ] Ground truth and sensor/control clock alignment; trial/day/block randomization.
- [ ] Safety interventions count as outcomes; hardware transfer limitations stated.

Rebuild artifact tables/figures with `python outputs/scripts/assemble_artifacts.py` and the isolated environment recorded in `audit/python_packages.txt`. This script assembles the research package; it does not run the proposed scientific experiments. Inspect it before execution in another environment.
