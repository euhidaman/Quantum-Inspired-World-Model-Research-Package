# Robotics evidence and proposed experiment program

Evidence searched on 2026-10-06. This document distinguishes retrieved methods from proposed project experiments. No robot, simulator, predictor, or controller was executed. Paper IDs resolve in robotics_papers.json; documentation IDs resolve in robotics_document_sources.json.

## Recommendation

[INFERENCE] Use PSC as a conditional representation candidate only after its small correlation task passes. Robotics cannot establish that a quantum-inspired representation is needed merely by beating a reactive planner. The decisive comparison is the selected structured core versus joint classical particles/mixtures/graphical models, using the same observations, decoded future interface, risk calculation and control optimization. Include QLC as a controlled sequence-model baseline; defer TEC robotics work until branch information survives the same-density-matrix and classical-particle tests. These rankings are hypotheses about research tractability, not navigation findings.

[INFERENCE] Start the shared planner with sampled finite-horizon MPC/MPPI, because it can consume trajectory samples without forcing every representation to output a Gaussian. Preserve trajectory-level obstacle and temporal dependence in each joint sample. Fit the control optimizer once on a development split; freeze horizon, sample budget, cost terms and constraints for primary representation comparisons. Independently vary the planner to locate planner–representation interactions. IT-MPC, RA-MPPI and sample-based DR-CVaR filtering already supply classical planning machinery; adding a learned belief to them is not itself a new planning principle. [IT-MPC](https://arxiv.org/abs/1707.02342), [RA-MPPI](https://arxiv.org/html/2209.12842v1), [DR-CVaR filtering](https://arxiv.org/html/2309.08821v1).

## Baselines that answer different questions

| Baseline | What it tests | Essential qualification |
|---|---|---|
| Constant velocity + common MPC | Whether belief learning is necessary | Include tuned noise and an intention-switch model; a deliberately brittle CV baseline is uninformative |
| Kalman/IMM/particle tracker + common MPC | Whether filtering/intent uncertainty is enough | Use the same detections, observation noise and track lifecycle; tracking evidence is covered by the separate tracking review |
| DWA / Nav2 DWB | Practical local-reactive floor | DWB is a modern implementation family, not exact 1997 DWA reproduction |
| ORCA / RVO2 | Fast reciprocal interaction baseline | Run both reciprocal and non-cooperative obstacle policies |
| SIPP / space-time graph search | Benefit of explicit time and waiting | Feed the same predicted occupancy, and separately oracle obstacle trajectories |
| TEB | Timed trajectory optimization and alternative path topologies | Author code is ROS1; a ROS2 port is not assumed |
| RRT* | Global geometric search baseline | Dynamic/kinodynamic extension must be specified; vanilla asymptotic optimality is not online safety |
| Sampled MPC/MPPI expected cost | Common control optimizer | Fix control samples, future samples, horizon and refresh rate |
| Chance constraint / CVaR / DR-CVaR | Risk-measure contribution | Reuse the identical predictive distribution; do not attribute the risk objective's gain to the latent |
| POMCP and Gaussian belief-space iLQG | Information-gathering and belief-control prior art | Use small discretized POMCP tasks or disclose continuous-space adaptation; iLQG's Gaussian belief is limited |
| Oracle future / oracle state / oracle intent / oracle joint belief | Source of remaining error | Separate these oracles; reveal only the named missing information |

[ESTABLISHED] DWA selects dynamically reachable, stoppable velocities; ORCA's sufficient conditions share avoidance responsibility; SIPP reasons over safe time intervals; TEB optimizes timed poses; and RRT* provides an asymptotic result. Each supplies a different baseline, rather than interchangeable proof of safety. [DWA](https://publications.ri.cmu.edu/the-dynamic-window-approach-to-collision-avoidance), [ORCA](https://gamma-web.iacs.umd.edu/ORCA/), [SIPP](https://www.cs.cmu.edu/~maxim/files/sipp_icra11.pdf), [TEB code and citation](https://github.com/rst-tu-dortmund/teb_local_planner), [RRT*](https://dspace.mit.edu/entities/publication/77dff1d1-ffd6-42f3-a3a5-fef87a964959).

## Risk measures must correspond to the tested outcome

[INFERENCE] Define the event C as any footprint collision over the complete horizon, including between sampled time points. The primary chance constraint is P(C | history, candidate actions) <= delta. In a discretized approximation, allocate delta_jh so that sum_jh delta_jh <= delta. The union bound then gives P(any C_jh) <= sum_jh P(C_jh) <= delta without requiring independence. It does not fix missed collisions between integration steps or an inaccurate learned distribution. Swept-volume checking or a justified interpolation margin is required. Count latency and actuator delay in the swept footprint.

[ESTABLISHED] The retrieved chance-constrained formulation uses linear-Gaussian assumptions. DR-CVaR filtering constrains safe halfspaces per obstacle and time, assumes linear ego dynamics in its formulation, and explicitly discusses conservative concentration assumptions versus experimentally tuned parameters. Do not turn either statement into an unconditional guarantee for arbitrary neural forecasts. [Chance-constrained planning](https://dspace.mit.edu/handle/1721.1/80914), [DR-CVaR Sections II–III](https://arxiv.org/html/2309.08821v1).

[INFERENCE; algebraic deduction] For a loss L and upper-tail probability mass q in (0,1], use CVaR_q(L) = min_eta {eta + E[(L-eta)_+]/q}. Here eta is a loss threshold and (z)_+ = max(z,0). This averages the worst q fraction of outcomes. For binary collision loss L in {0,1}, with collision probability p, the minimum occurs at eta=0 when p<=q, and eta=1 when p>=q; hence CVaR_q(L)=min(1,p/q). Binary CVaR therefore supplies no collision-severity ordering beyond p, and saturates for p>=q. If studying severity, preregister a physically interpretable nonbinary cost such as impact-speed proxy or minimum-clearance deficit; report actual collisions separately. A source using confidence alpha may instead call the tail mass 1-alpha: do not mix conventions.

[HYPOTHESIS] Compare expected loss, horizon chance constraint and severity-sensitive CVaR as the main three objectives. Add distributional robustness only after validating the empirical forecast and selecting the ambiguity radius on development data. Worst credible branch is useful as a conservative stress test, but defining credibility by an arbitrary weight cutoff can remove rare dangerous modes. Information gain needs a model of future observations conditioned on action; latent branch spread alone is not information gain.

## Gated robotics ladder

[HYPOTHESIS] The following are proposed stages, with every configuration and pilot threshold frozen before confirmatory evaluation.

1. **Stage0, analytic scenarios.** Small exact finite future trees establish whether joint modes or branch identity alter correct risk/action decisions. Use exact probabilities and exhaustive action enumeration as the reference. Test zero correlation, correlated pairs, hidden common cause, births/exits and irrelevant latent degrees of freedom. No perception encoder or realistic simulator should be added until representation claims survive this stage.
2. **One-obstacle control pilot.** A nonholonomic robot crosses one obstacle's path under two hidden intentions and controlled occlusion. Start with ground-truth state plus deliberately specified observation noise. Increase horizon and occlusion duration independently. Record predicted horizon risk, actual collision, success, waiting, minimum distance and total decision latency. This checks end-to-end integration before multi-object complexity.
3. **Correlated pairs and groups.** Use mutually exclusive passage, group motion, yielding and a shared hidden signal. Change correlation strength while preserving per-agent marginals. Also include independent behavior and a mis-specified grouping condition. PSC must improve the joint task without merely receiving extra observations or parameters.
4. **Multiple environments.** Indoor corridor, doorway/intersection and room with occluders; outdoor covered walkway/courtyard and mixed-direction crossing. These are proposed environment categories, not new named benchmarks. Hold out maps and behavior families, and evaluate increasing obstacle count, births/exits and unseen density.
5. **Sensor-based simulation.** Replace state inputs with a common lidar detection/tracking pipeline. Add RGB-D only for the separate visual research question. Separate localization error, detection error, association error and forecast error with oracle substitutions.
6. **External benchmark transfer.** Use SocNavBench replay as a standardized non-reactive stress test; pair it with reactive HuNavSim-style behavior or a verified Arena release. Split train/test human policies so that ORCA-generated crowds are not the sole training and testing world.
7. **Real robot.** Only after matched-compute simulation benefit and a latency/safety dry run. Start with scripted mobile props in an exclusion area, then trained consenting participants under the applicable institutional process. Use multiple days and environments, preserve all stops/interventions and randomize trial order.

[ESTABLISHED] SocNavBench Section5.3 explicitly says pedestrians follow recorded trajectories without reacting to the robot. It can test prediction and collision avoidance but cannot alone establish reciprocal interaction modeling. HuNavSim supplies individual reactions controlled through behavior trees, but these remain designed models. [SocNavBench](https://arxiv.org/html/2103.00047v2), [HuNavSim](https://arxiv.org/html/2305.01303v3).

## Separation, metrics and deployment checks

[HYPOTHESIS] Use a crossed primary comparison of representation × planner on paired scenario seeds, then block by environment, behavior family, obstacle count and observation condition. Freeze a compact primary set; expand expensive sweeps only if the relevant gate passes. Report both matched stored-belief bytes and matched end-to-end latency, plus trainable parameters, training transitions, seeds, compute, forecast samples and optimization rollouts. Latency includes detection, belief update, decoding, risk evaluation, planner and ROS transport; model inference alone is insufficient.

[HYPOTHESIS] Collision incidence and goal success must both be reported over all assigned episodes. Do not estimate collision rate only among successful episodes: a planner that freezes forever can appear safe. Record timeout/deadlock and safety intervention as separate outcomes; predefine any composite safety-adjusted success. Report calibration of the actual horizon event, not only per-step occupancy. Separate forecast risk miscalibration from the action selection procedure; risk estimates selected by optimization can be overoptimistic even when generic forecast metrics look reasonable.

[HYPOTHESIS] Preserve joint trajectory sample identity across obstacle and time axes. Shuffling samples independently by object is a deliberate factorization ablation; silently doing so defeats the PSC question. Test occupancy compression separately, since identical marginals can conceal distinct joint collision probabilities. Conversely, if the planner only sums marginal expected costs, it may never exploit the additional dependence; include an event/risk objective where dependence changes a decision.

[HYPOTHESIS] Use an identical independent stop layer for every hardware method. Trigger stops on stale observations/commands, lost localization or tracking, infeasible plans, actuator faults and breached separation. Log planned action, executed action and reason. A stop prevents injury but is still a task intervention. Verify the actual robot's stop/restart behavior; Jackal's manual says continued commands can resume motion when Stop Mode is released. [Jackal manual](https://docs.clearpathrobotics.com/docs_robots/outdoor_robots/jackal/user_manual_jackal/).

[UNKNOWN] No training-hour, episode-count, simulator-throughput or real-time feasibility estimate has been measured. Proposed 10Hz planning/20Hz emergency monitoring, if chosen by the coordinator, would be engineering targets requiring measurement and stopping-distance analysis, not verified platform capability.

