# Prospective statistical analysis plan v1

Prepared 2026-10-06; no experimental data have been collected. The review protocol was recorded before searching; this experimental plan is ready for investigator review and public preregistration after pilot-based sample sizing. It is not an external preregistration and no power result is represented as measured performance.

## Estimand and primary decision

The primary estimand is the absolute difference in **episode collision probability** between the Stage-0-selected representation and the strongest validation-selected classical competitor, under a frozen scenario distribution and common planner/resource stratum. Count a collision at any time up to goal or the fixed timeout. Report it over all assigned valid episodes. Do not condition the primary estimate on goal success: success is affected by the method, and conditioning can select incomparable subsets.

Goal success is a mandatory guardrail, with timeout, deadlock and intervention rates reported jointly. A method that stops permanently may have low collisions but fails this guardrail. Proposed decision margins are a 1 percentage-point absolute collision reduction and no more than a 2 percentage-point success reduction; these are engineering preferences, not evidence-derived universal thresholds. Freeze margins before confirmation and show sensitivity to other practically defensible choices. Define contact geometry, minimum clearance, goal radius, timeout, progress/deadlock rule, speed bounds and intervention semantics in the task config before collecting data.

The final superiority claim requires a two-sided 95% interval on the collision-risk difference excluding zero, an estimate meeting the practical margin, and a one-sided 95% lower bound for success difference above −0.02. A stronger claim that improvement exceeds 0.01 requires the entire collision interval below −0.01; distinguish these claims. Intersection of safety and success requirements does not permit choosing whichever endpoint succeeds. Predeclare one primary resource stratum (matched p99 latency); matched parameters is a required sensitivity stratum and separate claim.

## Units, pairing and randomization

An outcome row is a complete navigation episode, not a timestep or predicted sample. Scenarios are crossed with methods; map family, map seed, policy seed, start/goal and sensor seed define a reusable scenario ID. Training seed defines a learned model replicate. Episodes sharing a trained model or map are dependent. Independent information comes from replication across both training runs and environmental blocks. Report counts at every level.

Use common exogenous random streams across methods where causal replay is well defined. Reactive obstacles may diverge after robot actions differ: pair their policy/random innovations, not their realized trajectories, and retain both logs. Randomize method/run order within hardware sessions; block by environment, obstacle count, behavior family, sensor condition, platform and day. Hold out maps, policies and interaction structures jointly, rather than leaking video frames from the same episode across splits. Blind qualitative failure annotation to method labels where practicable.

Pilot design proposal: five training seeds, ten map seeds per broad family and multiple policy seeds per map, limited to the small Stage 0/Stage 1 designs. Those are feasibility choices for variance estimation, not justification of confirmatory power. Use separate pilot/selection/confirmation seed lists. No pilot episode enters the primary test set. Save the realized randomization table and generator version, not only a seed.

## Factorial contrasts and staged resource control

Core confirmatory block crosses selected representation versus best classical joint baseline with perfect/noisy-occluded observation and weak/strong obstacle correlation. The same planner is used in every cell. The representation×correlation and representation×occlusion interactions test the proposed mechanism. A separate planner block crosses expected-cost sampled MPC, chance-constrained sampled MPC and CVaR with a single frozen predictor, and repeats with oracle prediction. Do not infer a latent effect from changing both predictor and planner simultaneously.

Use complete paired blocks for these interactions. Wider sweeps of N, horizon, delay, dropout and graph density are exploratory. If a fractional design is used, save the design matrix, rank and alias table first; never alias representation×correlation or representation×occlusion with another likely effect. Training hyperparameters are chosen with equal validation trials or equal search compute; all failures count toward the budget. Select one candidate before the confirmation cohort.

## Model and uncertainty

\[\operatorname{logit}P(Y_{ijk}=1)=\beta_0+\beta_R R+\beta_O O+\beta_C C+\beta_{RO}RO+\beta_{RC}RC+u_i+v_j+w_k.\]
Y is episode collision, R is representation indicator, O is observation condition, C is correlation condition, beta are fixed effects, and u,v,w are map, policy/scenario and training-run random effects. Use the actual nesting/crossing recorded in metadata, with training-run effects nested within architecture where seeds do not define meaningful paired training noise. Add prespecified environment blocks and random slopes only if design supports them. This model summarizes binary outcomes without treating timesteps as independent.

Report model-standardized marginal risks, absolute risk differences and risk ratios with intervals; conditional odds ratios alone are inadequate. Primary interval method: parametric bootstrap of the fitted crossed model with 5,000 refits, declared convergence criteria and failure counts. Robustness: a multiway cluster bootstrap across map/scenario and trained model with paired method comparisons retained; Bayesian hierarchical analysis with prespecified weakly regularizing priors; stratified raw proportions. With too few clusters or complete separation, declare the planned asymptotic analysis inadequate, use a validated regularized/bootstrap strategy agreed before unblinding, and record an amendment. Do not silently drop failed fits.

Time-to-goal/path/jerk analysis must include timeouts. Use censored time-to-goal or a prespecified restricted mean to the timeout, plus conditional descriptive values among successes labeled as such. Time to collision treats goal/timeout as a competing termination/censoring issue, not an assumption of independent censoring by default. Report minimum clearance and near-miss distributions, not only means.

## Power and precision: what can be determined now

Actual baseline collision rate, map variance, training-seed variance and paired discordance are UNKNOWN. Therefore no defensible final sample size can be asserted now. `power_sensitivity.csv` contains independent-binomial illustrative planning scenarios only; its assumptions deliberately do not match the final crossed design. It must not be cited as the final study's power.

\[n\approx\frac{[z_{1-\alpha/2}\sqrt{2\bar p(1-\bar p)}+z_{1-\beta}\sqrt{p_0(1-p_0)+p_1(1-p_1)}]^2}{(p_0-p_1)^2}.\]
This approximation gives episodes per arm for two independent equal-sized binomial groups; p0,p1 are assumed collision risks, pbar their average, z is a standard-normal quantile, alpha is test size and 1−beta target power. It excludes map/training clustering, pairing and the success guardrail. Values generated from this equation are scenario calculations, not observed collision rates. Normal approximations can be poor for very rare events.

After the pilot, simulate the actual crossed logistic analysis over plausible nuisance-parameter ranges, keeping the engineering effect fixed. Grid training seeds {5,10,20}, map counts {10,20,40} per family and policies/episodes per map {10,25,50}, extending only if resources permit. These are search candidates, not promised adequate allocations. Simulate null and alternative with the same pairing, success correlation, interventions, missingness and multiplicity procedure. Use 1,000 replicates for design exploration, 5,000 for a fresh-seed confirmation; save every rejection/failure and Wilson Monte Carlo interval. Count failed fits as non-rejections for an operational calculation while separately diagnosing inferential validity. Require acceptable null rejection behavior before believing power. Select the least costly feasible design reaching the chosen 80% target across the registered plausible nuisance scenarios; otherwise reduce scope or declare the study underpowered. More episodes cannot substitute indefinitely for independent maps/training seeds.

For zero collisions in n independent episodes, the one-sided 95% exact binomial upper bound is 1−0.05^(1/n); near 3/n is only a large-n approximation. This bound is not valid if n counts dependent frames or clustered episodes as independent. Never translate zero contacts in a small robot trial into a safety guarantee.

## Scoring and diagnostic analysis

Use joint NLL only when every model supplies a normalized density under the same base measure. Kernel-scored particles and continuous flows cannot be compared using arbitrary model-specific bandwidths. For all models, use collision-event Brier, prediction-region coverage, occupancy probability error and sample-based energy score with fixed sample budgets. CRPS applies to scalar marginals/projections; state units and aggregation. Best-of-K ADE/FDE use identical K and appear alongside precision, likelihood/coverage and invalid-mode mass. Fix ECE bins using validation data and show uncertainty/bin sensitivity; ECE is not a proper score.

Fit diagnostic-to-failure maps on training/validation only, with raw residual error and ordinary ensemble variance as controls. Test held-out maps and behavior families; report AUROC, area under precision-recall, Brier, risk-coverage, false-negative catastrophic cases and calibration. For rare events, AUROC alone can obscure low precision. No diagnostic threshold may be tuned on test collisions.

Forecast calibration is first evaluated on a frozen common set of query histories and candidate actions. On-policy calibration is reported separately by policy and environment because the planner changes the distribution of visited states. For weighted futures x_m and weights w_m, report energy score sum_m w_m ||x_m−y|| − (1/2) sum_mn w_m w_n ||x_m−x_n||, with observation y and a fixed dimensionally standardized trajectory norm. This is the exact score of the empirical weighted distribution (a V-statistic); do not call it an unbiased population score. For iid equal-weight samples, an optional U-statistic version omits self-pairs and uses M(M−1) in the pair term. Persistent or resampled weighted particles are dependent, so that unbiasedness argument does not automatically apply. Require finite first moments; W19 Section 4.3 Eq.22 supplies scoring context.

## Multiplicity, exclusions and missingness

One selected primary comparison avoids an unrestricted winner's claim. Apply Holm familywise control at 0.05 separately to (a) additional structured-core comparisons, (b) mechanistic interactions and (c) diagnostic hypotheses when making confirmatory claims. Label wider ablations exploratory and report all contrasts, including failures. Do not stop sampling when a p-value crosses a favorable threshold; any sequential design needs a separately frozen spending rule.

A simulator crash before any control is an infrastructure failure with rerun of the same ID after correction; retain original records. A model timeout, invalid belief or control failure after assignment is a method failure; count it under timeout/intervention/failure outcomes, not as an excluded success. Collision observability lost mid-trial is missing safety data, not zero collision; report worst/best-case bounds and a prespecified conservative failure composite. Hardware safety stops are interventions even if no contact occurs. Any exclusion must be algorithm-independent and logged before outcomes are inspected.

## Reporting contract

Publish raw episode table, scenario and trained-model counts, full distributions and paired differences; primary effect and interval; practical margins; all resource measurements; final decision and uncertainty; deviations and failed runs. No post-hoc observed power. Real-robot trials support transfer feasibility unless powered for a safety effect with credible independent units.
