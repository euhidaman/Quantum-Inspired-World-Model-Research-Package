# Prospective experiment: pretrained adaptation and structured beliefs

2026-10-06. Design only. All gates are NOT RUN. This supplement extends [the original experimental program](09_robotics_experiment_program.md); it does not replace its correctness or statistical gates.

## Questions and separation of claims

**Experiment A:** Does a quantum-inspired weight adapter improve a pretrained world model's rollout/planning versus resource-cost tradeoff, relative to classical adaptation?

**Experiment B:** Given the same pretrained visual information, does a PSC belief improve joint obstacle forecasting and risk calibration relative to equally informed classical beliefs?

Run these separately. Combining a new backbone, adapter, slot extractor, loss and planner in the first comparison would prevent attribution. A win in A is not evidence for a density-matrix belief; a win in B is not evidence that quantum-inspired weight tuning caused it.

## Gate 0: select and reproduce one checkpoint

Proposed first artifact: a released DINO-WM Wall checkpoint with its exact encoder, preprocessing, history, action convention and environment version. PointMaze is a fallback only if the Wall artifact cannot be reproduced, with the reason recorded.

1. Pin repository commit, checkpoint URL and hash, encoder artifact, dependency versions, dataset split and all configuration files.
2. Check source/data/weight terms for the chosen artifacts. Record the exact files; a repository-level license is not a substitute for every dependency's terms.
3. Load the untouched checkpoint and reproduce its published evaluation recipe as closely as accessible artifacts permit.
4. Record any reproduction discrepancy, missing data or undocumented setting. Do not label a new local score “reproduced” without a comparable target and uncertainty.
5. Profile a short run on an allocated Fir GPU: device, VRAM, peak allocated/reserved memory, examples/second, rollout latency and end-to-end planning latency. Exclude neither feature extraction nor sampling from deployment cost.

Stop if the base model is broken or task interfaces mismatch. New adapter results would then be uninterpretable.

## Experiment A: predictor adaptation

Keep the pretrained visual encoder frozen. Use one source checkpoint across arms. Inspect actual predictor weight shapes before choosing target modules: the reviewed implementation includes fused QKV and attention output projections, which need not share dimensions. Pin the same target-layer list across methods.

| Arm | Intervention | Purpose |
|---|---|---|
| A0 | Untouched pretrained model | Measures adaptation need |
| A1 | LoRA in selected predictor layers | Standard parameter-efficient control |
| A2 | Orthogonal adapter with the same multiplication orientation | Tests whether ordinary orthogonal tuning explains the result |
| A3 | QuIC-style higher-order compound adapter | Tests the additional structured parameterization |
| A4 | Full predictor fine-tuning, frozen encoder | Higher-budget accuracy/cost reference |
| A5, conditional | Classical tensor-train adapter or matched residual adapter | Required if the proposed contribution is tensor efficiency or added capacity |

A5 is selected prospectively according to the final method claim. Do not add whichever comparator looks weakest after seeing test results. QuanTA can replace A3 in a separately specified experiment if implementation access or matrix dimensions make QuIC unsuitable; that is a recorded protocol change, not a silent substitution.

For multiplicative adapters, initialize the transform to identity; for additive adapters, initialize the effective update to zero. Verify unchanged outputs before training, nonzero gradients after a suitable optimization step, and no optimizer membership or weight changes in frozen modules. If implementing the published parameterization independently, label it a local implementation; test its small-matrix algebra against direct evaluation.

**Data.** First use the original benchmark distribution. The adaptation target should retain observation/action semantics while changing a documented environment factor, initially held-out map geometry if the benchmark generator supports it. Choose that factor before collecting adaptation results. Split by map/trajectory before making overlapping windows. Appearance changes and another embodiment are later, distinct tests.

**Budget.** Use identical adaptation trajectories, minibatch exposure, forecasting objective and checkpoint selection rule. Give each arm the same number of hyperparameter trials. Compare several trainable-parameter budgets; match to within 5% when the parameterization permits, and disclose exact mismatches otherwise. A4 is explicitly unmatched and anchors the cost curve. Also report equal-wall-time results: parameter count and time answer different questions.

**Outcomes.** Primary predictive endpoint: blind-rollout feature error averaged over a prespecified horizon H0 from the reproduced evaluation configuration, using the same fixed reference encoder for every arm. Also report errors at one step and twice H0. For a changed representation, evaluating only against its own moving target would be invalid.

Planning success and end-to-end latency are task endpoints using an identical planner, candidate budget and stopping rule. Evaluate retention on the source task separately from adaptation performance. Fine-tuning can trade transfer behavior against in-domain fit; general evidence motivates checking this, without predicting our result. [Kumar et al.](https://arxiv.org/abs/2202.10054).

A claim of improvement requires either better held-out performance at comparable measured resources, or comparable performance within a prospectively chosen practical margin at lower measured cost. Set that margin after the engineering pilot and before the main evaluation. Failure to beat A0 only shows failed adaptation; beating A0 alone does not establish a quantum-inspired benefit.

## Experiment B: shared pretrained features, alternative beliefs

Start with a controlled rendered scene containing two moving obstacles and partial occlusion. The generator supplies a known finite set of correlated intentions and joint outcomes. Increase to four and eight obstacles only after the two-obstacle system learns all valid modes.

The scene generator, mode definitions, observation history and robot actions must be identical across methods. Test delayed disambiguating observations, crossings, missed detections and identity swaps as separate factors rather than changing all conditions together.

Run two clearly separated tiers:

- **Diagnostic tier:** shared oracle tracks/history to isolate belief representation and update.
- **Visual tier:** a shared frozen feature extractor plus the same learned or fixed slot/history front end. All methods receive equal information and training supervision.

The visual tier tests deployment relevance; the oracle tier does not establish end-to-end perception success. Start with pretrained features alone when action/embodiment mismatch makes the original predictor unsuitable. If original predictor outputs are added, every belief model receives the same outputs.

| Belief | Minimum reason for inclusion |
|---|---|
| Independent per-slot categorical belief | Quantifies the dependence bottleneck |
| Full joint table for the smallest finite task | Checks exact learnability |
| Joint mixture or particles | Strong shared-mode classical control |
| Autoregressive/graph predictor | Classical interaction control |
| Classical tensor-factor model | Separates tensor compression from specifically purified structure |
| PSC with bond dimensions 1, 2, 4, 8 | Tests capacity and cost trend |
| QLC, optional later | Dense structured-state comparator |

Do not use only independent marginals as the classical baseline. Match history, slot ordering, supervision, training effort and representation budget. Report the complete parameter/memory/contraction-time curve where exact matching is impossible.

Train normalized joint probabilities using a proper likelihood objective. Primary endpoint for the finite diagnostic task: held-out joint negative log-likelihood. Report total variation against the known conditional distribution, valid-mode coverage and impossible-mode mass. A concentrated single valid mode can achieve low impossible mass while missing the true distribution.

For risk readout, score a precisely defined collision event under a fixed candidate action sequence using Brier score and calibration curves, including event prevalence. Choose any calibration mapping on validation data only. Minimum-over-samples displacement error is not the primary metric because it can reward uncalibrated coverage.

Use local readouts for the bond-capacity claim; an unrestricted global decoder could supply correlations outside the tested tensor bottleneck. Measure truncation error, normalization, PSD validity and slot permutation sensitivity. Passing the exact [Stage 0 PSC fixture](08_stage0_falsification_protocols.md) is required before learned claims.

## Replication, uncertainty and stopping

Use three paired adaptation seeds per arm in the engineering pilot. This estimates feasibility and variability; it is not a powered confirmatory sample size. Adaptation runs are experimental units. Many frames from one model are not independent training replicates.

In the main study, cross independently trained adaptations with held-out maps/scenarios. Pair methods on starting states, goals and exogenous random-number schedules, while allowing policy-dependent trajectories to differ. Analyze method contrasts with seed and scenario/map dependence represented; use the original [statistics plan](10_statistical_analysis_plan.md) to set replication and a crossed hierarchical analysis or corresponding resampling procedure.

A single source checkpoint supports conclusions conditional on that checkpoint. Multiple adaptation seeds do not measure uncertainty across pretraining runs. Generalization across backbones/checkpoints is a later replication.

Keep the final test set sealed until the method, hyperparameter selection rule, practical margins and analysis are fixed. Log deviations before inspecting affected outcomes. Count failed/OOM runs and report their treatment; do not quietly discard them.

Stop or narrow the claim when:

- Identity initialization or mathematical invariants fail.
- Equal-information classical models solve the proposed distinguishing example just as well.
- Any apparent improvement disappears under the required objective or capacity control.
- Claimed parameter savings produce worse measured memory/time without a useful accuracy gain.
- Long-rollout or source-task behavior degrades despite better one-step fit.
- The frozen features lack required information; diagnose that before replacing the belief model.

## Navigation transfer gate

After a successful controlled result, evaluate a compatible NWM checkpoint or a V-JEPA-based navigation predictor. These are distinct implementations and require fresh interface checks. Keep the planner fixed when testing prediction changes.

For closed-loop navigation, predefine the horizon and collision denominator, and report collision and success together. A system can reduce collisions by staying still. Include progress, time-to-goal and intervention/failure accounting. Do not claim safer navigation from open-loop feature error alone.

A new dynamic-crowd dataset, policy action space or sensor rig can require additional training even when most weights are reused. The outcome may be a useful feature-based system without successful reuse of the original dynamics; report that distinction.

## Compute and automation handoff

Recommended division: research, code review and experiment manifests on this laptop; training, evaluation and datasets on Fir. A local controller can call the Claude API and submit reviewed, bounded experiment commands through the user's established SSH/Slurm workflow. Claude API inference itself runs at the API provider; the experimental model runs on Fir.

The controller should read this protocol, the mathematical definitions, immutable run configurations and metric schemas. Give it a finite run budget and explicit retry limits. Preserve raw failures, source hashes, seeds, trainable-parameter lists, checkpoint provenance and validation/test separation. It must not optimize against test results or start an unlimited resubmission loop.

Estimate the GPU-hour budget only after profiling the selected artifact on the actual allocation. No Fir wall-time, cost or memory requirement has been established by this review. No model code, Slurm job, SSH connection, API call or checkpoint download was executed for this protocol.

Next concrete implementation task: reproduce the selected DINO-WM checkpoint and produce the profiling record before scheduling an adapter sweep.
