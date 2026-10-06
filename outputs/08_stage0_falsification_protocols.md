# Stage 0: exact falsification protocols

Status: proposed experiments only. Expected values below are analytical task definitions/derivations, not measured results. No training, simulation or robot experiment was run while preparing this package. Implement these small tests before a full world-model stack.

## Common contract

Freeze task JSON, generator version, seed families, precision, outcome support and budget strata. Separate train/validation/test scenario generators; never select truncation rank, stopping epoch or risk threshold on test data. Start float64 with exact small-system oracles. Suggested pilot training seeds: 5 per learned method, for variance estimation only, not a powered final sample. Use disjoint scenario seeds and repeated paired scenarios across methods. Save all likelihoods, outcomes, raw timing, state diagnostics and failures.

Match total real trainable scalars (count real and imaginary parts), encoded history, deterministic context, state bytes, decoder flexibility, data and optimization/search budget. Then independently tune a matched-tail-latency frontier. A shared interface does not make unlike decoders equally expressive. Give every baseline the same measured physical information and trainable access to past cues.

## 0A — Operational coherence, then useful advantage

**Identity fixture.** Use two basis vectors |0>, |1>, and |+>=(|0>+|1>)/sqrt(2), |->=(|0>-|1>)/sqrt(2). Set rho_plus=|+><+|, rho_minus=|-><-|; both have diagonal (1/2,1/2). A computational-basis readout returns (1/2,1/2) for both. Apply Hadamard U=1/sqrt(2)[[1,1],[1,-1]], then computational readout: plus returns outcome 0 with probability 1, minus outcome 1 with probability 1. Dephasing erases that distinction. Check PSD, unit trace and probabilities to absolute 1e-10 in float64; a tolerance failure is a software error, not a negative scientific result.

**Learning task.** At episode start show a binary cue selecting plus/minus. Distractor observations follow for length H in {2,8,32}; the final control chooses identity or U. Generate noisy outcomes with fixed epsilon in {0.01,0.1}; log true probabilities. Provide cue history to ALL models. Cross both transition type and cue. Hold out sequences of distractors and cue-to-readout delays. Full complex, real symmetric, diagonal QLC; low ranks; history-aware categorical recurrent model; OOM/PSR; Gaussian mixture and real vector recurrent controls all learn the same conditional law. A two-state classical memory solves this tiny task exactly: the fixture cannot prove a QLC advantage.

Primary learned endpoint: per-final-outcome NLL against held-out generated outcomes; secondary Brier, true probability error, learned coherence in a fixed basis, intervention difference, parameter/state bytes and p50/p95/p99 latency. Compare dephasing after cue with dephasing before readout. Use phase-randomization/gauge transforms with co-transformed operators as invariance controls. Orthogonally ablate CPTP constraints versus unconstrained stable recurrent dynamics.

The outcome-1 probability with label-flip noise is p_epsilon=epsilon+(1−2epsilon)p_base, where p_base is the noiseless Born probability defined by the fixture. Sampling is Bernoulli with this probability. For mechanistic tolerance checks use exact probabilities, not sampled outcome frequencies.

**Gate 1.** Mechanistic pass requires correct fixture and operational dephasing effect. Main-contribution pass additionally requires a preregistered useful predictive/calibration gap against matched classical controls on a broader process family, not merely the forced diagonal bottleneck. If the categorical bit or OOM matches it, retain QLC only as a mathematical baseline. Do not conflate operational coherence with identifiable physical intent.

```text
for cue, delay, action, noise, seed in frozen_scenarios:
    history, outcome, true_prob = generator(...)
    for core in fixed_budget_candidates:
        predict(history, action); score(outcome, true_prob)
        repeat_with_dephasing_or_basis_change(); save_every_record()
aggregate_by_training_seed_and_scenario_block()
```

## 0B — Joint correlation and capacity

**Two-slot fixture.** Two obstacle intentions z1,z2 are binary. Exactly one enters a shared doorway: P(01)=P(10)=1/2, P(00)=P(11)=0. Each marginal is Bernoulli(1/2). Their product assigns 1/2 mass to impossible states; a joint two-component mixture or two joint particles is exact. The initial outcome mapping must be fixed/local: an unrestricted joint decoder could reconstruct the constraint from independent latents and invalidate the factorization contrast.

Compare independent slots; classical correlated tensor factor model; PSC chi={1,2,4}, kappa={1,2,4}; dense joint table; joint mixture and weighted joint particles; graph/attention model. A chi=2 purification can represent the two-mode diagonal mixture with suitable local auxiliary indices; chi=4 need not improve a saturated two-slot task. A pure coherent state also gives the same diagonal probabilities, so the fixture cannot establish a need for complex values or mixedness.

**Capacity ladder.** To force increasing necessary dependence, use q equally likely matched labels across a fixed bipartition, q in {2,4,8,16}, then independently controlled pairs crossing the cut. Fix local dimension at 17 (16 labels plus absent) throughout this q sweep, so local capacity does not change with q. Include local and long-range correlations, random/permuted slot order and negative controls with independent intentions. Compute exact distribution for small L and sum all forbidden mass. Larger tasks use held-out constraint violation estimates with uncertainty and exact tractable subsets. Freeze correlation graph and observation likelihood; hide intentions behind a noisy occluder for filtering rather than just fitting a static table.

Primary: total probability on forbidden joint states. Secondary: proper joint NLL with declared smoothing, joint Brier, observation likelihood, memory, p99 filtering/rollout latency. On the strictly zero-support target, infinite NLL for a model assigning zero to a realized valid event is an error to report; epsilon floors must be common and sensitivity-tested.

The required co-primary distribution-recovery endpoint is exact total variation on the small known support; forbidden mass alone is insufficient. Report both, with mode coverage, before declaring a representation pass.

**Truncation diagnostic test.** Enlarge a known purification with local channels, truncate X by a specified canonical SVD, and record cut/kappa discarded weights. Compare to exact global state/distribution error and collision-region probability error. Hold out graph/order regimes for the diagnostic model. Include an intentionally rare but high-cost future: small discarded mass need not imply small safety loss. BP residual, convergence and exact-contraction differences are separate outputs. Test no truncation, direct canonical truncation, and BP gauging only after exact-chain correctness.

**Decision-relevance fixture.** A shortcut passes crossing zone 1 at step 1 and zone 2 at step 2. Obstacle j occupies its zone exactly when z_j=1. Collision is the union of these two events, with loss 4; a collision-free detour costs 3.5. In the anti-correlated target the shortcut has expected loss 4, so the detour is optimal. The product of correct marginals predicts shortcut loss 3 and wrongly selects it. These are dimensionless toy costs, not deployment risk tolerances. A joint classical table reproduces the correct decision exactly. This fixture tests a union risk; purely additive marginal costs may not depend on correlation at all.

**Gate 2.** Representation pass requires the expected rank/correlation relationship, forbidden mass <=0.01, and total variation from the exact target <=0.01 (half the sum of absolute probability differences), with valid-mode mass/recall reported. The distribution condition prevents a collapsed single valid mode from passing. Engineering pass requires useful predictive/planning performance against joint classical models within both budget strata. Diagnostic pass is separate: predefine out-of-domain improvement over residual/variance; if discarded weight is uninformative, abandon the diagnostic claim even if PSC prediction works. Stop for negative probabilities, silent loss of normalization, nonconvergence without fallback, or latency blowup.

```text
for graph, order, q, observation_condition in capacity_tasks:
    exact_joint = known_generator(...)
    fit_or_construct_each_core_using_training_data()
    for chi, kappa in registered_sweep:
        predict_joint(); enumerate_small_support()
        measure_forbidden_mass_and_error()
        truncate_known_state(); record_weight_and_true_error()
```

## 0C — Same-rho branch identity

**Null fixture.** mu_Z gives weight 1/2 to |0>,|1>; mu_X gives 1/2 to |+>,|->. Both average to I/2. Under identical linear channels and common Born instruments, all observation sequence probabilities agree. Test several fixed/random valid channels and measurement bases, then adaptive controls chosen from observed histories. Maximum probability deviation must be <=1e-10 in float64 on small fixtures. A systematic difference falsifies the implementation, not the equivalence theorem.

**Beyond-rho fixture.** Define an explicitly classical branch-conditioned Bernoulli probability f(psi)=|<0|psi>|^4. Its ensemble average is 1/2 for mu_Z and 1/4 for mu_X. This is a valid constructed nonlinear observable, not a Born readout. It proves that an augmented ensemble model can retain distinctions lost by rho; it does not show that real scenes possess these labels. Classical particles carrying the same scalar reproduce the fixture exactly.

The null-fixture 1e-10 tolerance applies to exact contractions/enumeration of finite observation histories. Independent Monte Carlo unravelings can have different finite-sample estimates; compare them using sampling uncertainty, not this deterministic tolerance.

**Exact sensing fixture.** An observed regime cue selects mu_Z or mu_X above; the corresponding hidden hazard B is Bernoulli with probability p=1/2 or 1/4, generated from f, and remains fixed for the episode. Horizon is two decisions. At step 0: GO costs 10B and terminates; DETOUR costs 3 and terminates; PEEK costs 1.1 and reveals binary Y with P(Y=B)=0.9, then permits GO or DETOUR at step 1. There is no motion or mode transition while peeking. Conditional on B, sensor noise is independent of regime and branch. All models see the regime cue, and the density-average ablation is explicitly forced to forget it; a learnable QLC may encode it differently and is an essential additional control.

For p=1/2, P(Y=1)=1/2, posteriors are 0.9 and 0.1, so optimal expected PEEK loss is 1.1+(1/2)3+(1/2)1=3.1; DETOUR at 3 is optimal. For p=1/4, P(Y=1)=0.3, posteriors are 0.75 and 1/28; PEEK loss is 1.1+0.3(3)+0.7(10/28)=2.25, below GO at 2.5 and DETOUR at 3. Thus correct initial actions differ. These are analytical targets, not observations. A classical two-regime belief solves both; passing only against the intentionally lossy rho ablation does not support TEC superiority.

**Environmental extension.** Map the fixed hazard to a pedestrian emerging from a blind corner; add validated geometry only after the table fixture works. Test whether a learned rho encoder actually collapses histories with different correct futures. Compare density-average ablation, unconstrained history-aware QLC, label-aware TEC, label-aware classical particles, history-conditioned mixture and POMCP/belief-space control; vary M={1,4,8,16,32,64}. Pair real/complex branches, branch-independent/conditioned dynamics, FS/decoded/observation distances, resampling/no resampling, jump/diffusive schemes. The observation model and all persistent labels are shared across fair comparisons.

Primary: correct conditional predictive score; downstream prespecified value of information and collision-success outcomes. Log ESS=1/sum(w²), branch genealogy/survival, unique decoded modes and same-rho divergence. Validate permutation/global-phase invariance and include a no-informative-sensing control.

**Gate 3.** Proceed only if branch distinctions are correct, useful for decisions and more efficient than matched classical particles with identical labels. More divergence is not better. Artificially withholding branch labels/history from classical baselines fails fairness. If particles match it, rename the method a persistent particle belief model or defer TEC.

## Required artifacts before any gate decision

Versioned configs and generator source; command/package/hardware manifest; train/validation/test seeds and split hashes; raw per-episode predictions and outcomes; model/optimizer checkpoints; all failed runs; timing traces including preprocessing and contraction; normalization/PSD/gauge tests; uncertainty intervals and prespecified practical margins. Report gates as PASS, FAIL or INCONCLUSIVE, with mechanism and utility separated. At this package's completion all three empirical gates are **NOT RUN**.

Provenance: the small probability/cost targets are algebraic project derivations [INFERENCE], detailed in report 05. Sequence-model prior art is Q01–Q06,Q14; tensor positivity/truncation is Q07–Q09,Q17; ensemble nonuniqueness is Q11; fair particle and joint-prediction rivals are W09,W10,W12–W18; proper-scoring rationale is W19. None of these papers is claimed to have run the fixtures proposed here.
