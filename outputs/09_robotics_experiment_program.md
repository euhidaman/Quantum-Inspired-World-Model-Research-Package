# Robotics program after Stage 0

Status: proposed, conditional on report 08. [INFERENCE] PSC receives the initial small engineering allocation; no full stack or hybrid is authorized by scientific evidence yet. A working simulator alone does not pass a representation gate.

## Shared interfaces and attribution

Use one sensor/history encoder, a swappable belief core, a versioned trajectory/occupancy distribution contract, the same cost and collision geometry, and one sampled MPC/MPPI implementation. Cores expose initialize, update, predict, decode_occupancy and diagnostics; planners expose plan(belief, goal, constraints). Prediction must state whether futures are joint across obstacles, conditioned on ego controls, and normalized. Log candidate actions and risk estimates so decisions can be replayed with another evaluator.

The control comparison has four blocks: (1) every eligible core with the same planner; (2) different planners with the same predictor; (3) every planner with oracle futures; (4) learned predictions with exact/sufficiently enumerated risk evaluation on small tasks. Separate core-derived RSSM/TD-MPC2-style baselines from their complete native agents. Shared visual pretraining, deterministic memory and decoder capacity count in all resource budgets.

Core fairness manifest: real trainable parameter count; actual latent bytes and batch size; training transitions and episodes; encoder/decoder sizes; optimizer, steps and schedule; planner horizon/sample count; hyperparameter trials and total search compute; wall-clock training; p50/p95/p99 inference/planner/end-to-end latency and deadline misses; GPU peak allocated/reserved memory; rollout rate; sensors and input history; all split and training/scenario/planner seeds. Report matched-parameter and matched-latency results separately, plus unconstrained Pareto points. Do not hide the cost of Kraus construction, tensor contraction, diffusion denoising or particle resampling.

## Stage 1: stable single-obstacle pipeline

Five scenario families: open room, corridor, blind corner, doorway and warehouse aisle. Start from perfect tracked state to isolate the core. Use explicit kinematics/geometry for a person proxy, wheeled cart and mobile robot, with acceleration and footprint constraints; add bicycle-like motion only in a justified outdoor stage. Synthetic proxies do not support claims about human comfort or intent prediction in public spaces.

Behavior modes: crossing, yielding, stopping, accelerating, turning, reversing, hidden destination and occlusion emergence. Generate modes from a documented stochastic policy whose probabilities are known in a synthetic subset. Include constant-velocity negative controls where a complex belief should not help. Freeze start/goal, map and policy seed lists.

Observation ladder: perfect state -> noisy tracked state -> dropout/delay/occlusion -> lidar/depth -> RGB-D. Monocular RGB is deferred unless depth ambiguity is a research question. Each increase has its own matched frontend experiment. Use an oracle detector/tracker to locate whether failure originates in perception or belief update. Test oracle future, oracle state, oracle intent and oracle joint distribution separately.

Minimum competitors: constant velocity plus the common planner; Kalman/IMM and particle filtering; joint mixture where multimodality is present; Gaussian and categorical recurrent latent; chosen core; native DWA/Nav2 and ORCA systems. Add an exact small belief-space/POMCP control for informative sensing. A* or a comparable static global route supplies the same route context; its static assumptions must not be mistaken for dynamic collision avoidance. SIPP is a time-aware oracle/supplied-prediction comparator. Verify a specific D*/Hybrid A*/kinodynamic RRT implementation only if replanning/car-like kinematics make it relevant.

Gate: sensor/planner timing is stable, collision checking agrees with independent geometry, all failures logged, and a useful prediction/safety gain survives classical controls at comparable compute. Otherwise diagnose before adding obstacles.

## Stage 2: correlated multi-obstacle futures

Profile N=2,4,8,16, stopping escalation if the control deadline fails. Include independent agents, mutually exclusive passage, groups, leader-follower, overtaking, opposing traffic, crossing flows, bottlenecks, shared destinations and one obstacle occluding another. Vary interaction graph density and ordering independently of N. Add births/exits and fixed-slot overflow as explicit conditions, with LMB/GLMB or an equivalent multi-hypothesis tracker when label/cardinality uncertainty matters.

Strong joint comparisons are mandatory: graph/Transformer joint predictor, interaction-aware slot dynamics, joint Gaussian/categorical mixture, classical tensor/nonnegative low-rank factorization, weighted joint particles and a normalized/generative joint diffusion baseline. Include a flow predictor when continuous likelihood is a target. A diagonal density or independent slots alone is an inadequate baseline. Two-obstacle correlation checks are mechanisms; multi-obstacle cost/accuracy scaling tests compactness.

Prespecified ablations: QLC complex/real/diagonal, ranks, regularization and readout basis; PSC chi={1,2,4,8,16}, kappa={1,2,4}, fixed/dynamic binding, continuous/discrete heads, chain/tree/sparse graph and dense oracle; TEC M={1,4,8,16,32,64}, real/complex, common/branch-conditioned dynamics, metrics and resampling. Do not run the full Cartesian product. First screen exact correctness, then vary one mechanistic axis within a complete representation×correlation×observation block; retain important interactions and disclose omitted combinations.

## Stage 3: environments and robustness

Indoor holdouts: offices/corridors, homes, warehouse aisles and crowded intersections with unseen geometry. Outdoor holdouts: controlled campus paths, sidewalk-like intersections and parking-lot/cart routes. No claim of outdoor generalization from changed textures on one indoor map. Separate held-out map, policy, density, speed, horizon, occlusion, lighting/texture, obstacle class and interaction topology; then stress combined shifts.

Perturb sensor noise, localization drift, delayed/missed measurements, actuator delay, model mismatch, unseen policies, limited sensing range, OOD semantics, births/exits, capacity overflow and reduced replanning frequency. Include physically plausible abrupt changes and braking limits. Preserve catastrophic cases as failure videos with ground truth, predicted futures, uncertainty and command timing. Publish the failure taxonomy, not only selected successful clips.

Two external validation modes: replay measured pedestrian trajectories for reproducibility (not ego-reactive behavior), and reactive independent obstacle policies. SocNavBench, HuNavSim, SocNavGym and Arena are candidates with source/status/integration limits in report 11 and R13–R16. Do not reuse the predictor's training policy as the only test adversary.

## Stage 4: supervised transfer

Only after matched-compute simulation evidence and task-specific approval, proceed from static foam objects -> remotely controlled cart -> another robot -> controlled human participant after institutional safety/ethics review. Begin one dynamic obstacle and expand only after stopping distance and latency are validated. Never begin with uncontrolled public interaction.

Use available calibrated differential-drive lab hardware first; TurtleBot-class indoor and Jackal-class outdoor systems are options, not assumed possessions. Require physical emergency stop, independent collision/minimum-distance monitor, command watchdog, supervisor, geofence and speed caps derived from measured stopping distance. Log monitor interventions separately from contacts and successful goal arrival. The monitor must be identical across methods; its interventions are outcomes, not erased failures.

Measure perception/transport/actuator delay, localization drift, controller frequency, dropped observations, actual prediction/planning latency, safety stops and transfer degradation. Randomize method order within day/platform blocks. Robot counts depend on pilot variance, session dependence and feasible resets; small real trials establish feasibility rather than statistical safety superiority.

## Risk objectives and outputs

Start expected task loss, then compare chance constraints and CVaR with the SAME predictor; information gain is a separate sensing-enabled task. Worst-credible-mode and distributionally robust planning remain conditional on defensible credible/ambiguity sets. Binary collision CVaR saturates and may duplicate expected-risk ordering; use declared severity losses if making a different claim.

Primary outcome: episode collision probability with success guardrail (report 10). Also log near misses, clearance, time-to-collision, censored time-to-goal, path efficiency, control smoothness/jerk, deadlock, replans, intervention, latency and memory. Predictions: normalized NLL when comparable, Brier, coverage, sharpness, energy/CRPS, fixed-K ADE/FDE and mode coverage. Diagnostics: QLC entropy/purity/rank/dephasing effect; PSC valid correlation, discarded weight, active bonds and BP residual; TEC ESS, decoded mode count and genealogy/same-rho behavior. Plot safety–latency and prediction–compute frontiers only after data exist.

## Implementation boundary

Proposed directories: configs, data, environments, sensors, models/{shared_encoder,gaussian_rssm,categorical_rssm,qlc,psc,tec,particles,diffusion}, planners/{dwa,teb,orca,mpc,mppi,sampling,belief_space}, training, evaluation, statistics, scripts, tests, videos, reports, references. Implement small core interfaces/fixtures first. Do not create empty modules and describe them as completed software. Required tests include PSD/trace, valid tensor shapes/contraction, gauge/permutation invariance, BP exact-small comparison and convergence fallback, deterministic replay, collision geometry and normalized distribution contracts.
