# World models, joint futures, tracking, and calibration: evidence synthesis

Review date: 2026-10-06 (Asia/Taipei). Scope follows ../review_protocol.md. This component is an evidence-bounded scoping synthesis with systematic logging; it is not an exhaustive systematic search. IDs W01–W23 resolve to world_papers.json, and WC01–WC32 resolve to world_claims.json. Page numbers refer to PDF page order unless explicitly described as printed pages.

## What the evidence changes

[ESTABLISHED] The relevant classical comparison is already multimodal, interactive, and sometimes explicitly joint. Scene Transformer constructs scene-level future hypotheses, evaluates joint metrics, and documents the joint-versus-marginal tradeoff. MotionDiffuser directly models a joint future distribution with diffusion. These are close prior art for the motivating PSC claim about excluding inconsistent combinations. [Scene Transformer, Fig. 1, Table 3, Appendix B.1](https://arxiv.org/pdf/2106.08417); [MotionDiffuser, Sections 3.2–3.4](https://arxiv.org/pdf/2306.03083).

[INFERENCE] The defensible question is whether a selected structured core offers a better accuracy–memory–latency tradeoff, more reliable filtering after occlusion, or an actionable capacity diagnostic under controlled conditions. “Classical models cannot represent multiple futures” and “explicit correlations are new” are invalid novelty statements.

[UNKNOWN] None of the inspected papers establishes a navigation improvement from QLC, PSC, or TEC. No experiments were run in this component review. External authors' results are [ESTABLISHED] reports, never [OBSERVED] project results.

## World-model baselines are different experimental objects

[ESTABLISHED] DreamerV3 is now a Nature 2025 article; the earlier arXiv title differs. Its published architecture combines recurrence and discrete representations with actor/critic learning from imagined trajectories. [Published metadata and Fig. 1](https://pubmed.ncbi.nlm.nih.gov/40175544/).

[ESTABLISHED] TD-MPC2 learns a decoder-free control model and plans with MPPI plus a value estimate. Its SimNorm vectors are simplex-normalized deterministic embeddings, not categorical samples. [Sections 3.1–3.2, Eqs. 2–6](https://proceedings.iclr.cc/paper_files/paper/2024/file/cf73d57b6dcda32b293df7c2d5341f49-Paper-Conference.pdf).

[ESTABLISHED] IRIS supplies an autoregressive discrete-token model; DIAMOND supplies observation-space diffusion conditioned on actions/history. DINO-WM predicts pretrained patch features and optimizes goal-directed action sequences. DINO-WM's verified venue is ICML 2025, superseding an older ICLR-under-review record. [IRIS Section 2.2](https://arxiv.org/pdf/2209.00588); [DIAMOND Sections 2.3–3.2](https://proceedings.neurips.cc/paper_files/paper/2024/file/6bdde0373d53d4a501249547084bed43-Paper-Conference.pdf); [DINO-WM proceedings](https://proceedings.mlr.press/v267/zhou25t.html).

[INFERENCE] Compare a Dreamer-style core with the common planner for representation attribution, and separately compare the native full Dreamer/TD-MPC2 agent as an end-to-end system baseline. Replacing their native objective/planner creates a derived baseline; label it clearly. Pretrained visual-encoder capacity/data and denoiser evaluations count toward cost. A broad benchmark score does not certify collision probabilities.

## Objects, occlusion, and identity

[ESTABLISHED] SAVi has an interaction-aware predictor and documents identity swaps under heavy occlusion. SlotFormer forecasts slots jointly across time and objects. They cannot fairly be described as independent-slot methods. [SAVi Fig. 5(b), Appendix Table A.3](https://arxiv.org/pdf/2111.12594); [SlotFormer Sections 3.1–3.3](https://arxiv.org/pdf/2210.05861).

[INFERENCE] Start Stage 0 from supplied object states/semantic slots. Otherwise segmentation, association, and uncertainty-core failures are confounded. Later add the same visual extractor to every core, measure identity switches and track recovery, and compare a shared Transformer/GNN interaction baseline. A slot activation is not automatically an existence probability. Missing observations require an explicit measurement model or learned update whose calibration is evaluated.

[ESTABLISHED] Trajectron++ already combines multimodal probabilistic prediction, dynamics integration and heterogeneous inputs. Its nuScenes comparison discussion distinguishes tracking from forecasting errors. [Trajectron++, Table 5 and surrounding evaluation](https://arxiv.org/pdf/2001.03093). [INFERENCE] Use its prediction capabilities as a baseline without claiming its tracked-input setup directly solves perception under occlusion.

## Correlation is necessary in selected tasks but does not select quantum mathematics

[INFERENCE] Consider two labeled obstacles at four distinct sites: object 1 chooses A1/B1 and object 2 A2/B2. Distribution P assigns one-half to (A1,A2) and one-half to (B1,B2). Distribution Q assigns one-half to (A1,B2) and one-half to (B1,A2). Both have identical per-object marginals and identical spatial first-order intensity, with expected count one in region A. Yet the probability that at least one obstacle occupies A is 1/2 under P and 1 under Q. This is an analytic counterexample to reconstructing a joint collision event from intensity or independent marginals alone, not a measured result.

[INFERENCE] A four-entry classical categorical table represents either distribution exactly. Thus a successful two-agent PSC experiment is a sanity check of correlation access, not evidence for compactness or useful superiority. Add the dense table oracle, joint Gaussian/categorical mixtures, classical nonnegative low-rank/tensor factorization, and autoregressive joint prediction before interpreting any apparent gain. Only scaling with agent count/topology and fixed memory/latency can test the proposed compact representation.

[ESTABLISHED] The 2026 CODA preprint further investigates contextual diffusion plus joint energy refinement on pedestrian/motion datasets. Its workshop publication listing was found but could not be opened; it remains classified here as a verified preprint with unverified workshop status. [Primary paper, Sections 3–4](https://arxiv.org/pdf/2605.22017). [UNKNOWN] No current code release or latest benchmark ranking was verified. It is a recent comparison lead, not a selected executable baseline.

## Flow densities and occupancy interfaces

[ESTABLISHED] FloMo uses conditional normalizing flows for tractable trajectory densities and sampling. Its inspected model focuses on individual agents. It reports manifold-related likelihood artifacts, uses noise stabilization, and evaluates displacement metrics rather than relying on dataset likelihood. [Sections III–V](https://arxiv.org/pdf/2103.03614). [INFERENCE] Include this concrete density baseline while holding measurement noise and the density base measure fixed; a scene-joint flow extension would be a separately specified derived model.

[ESTABLISHED] Occupancy Flow Fields combines cell occupancy probabilities with backward motion flow, handles speculative agents appearing after occlusion, and recovers IDs through flow traces. Its verified venue is RA-L 2022. [Sections III-A,D–G](https://arxiv.org/pdf/2203.03875); [official publication record](https://waymo.com/research/occupancy-flow-fields-for-motion-forecasting-in-autonomous-driving/).

[ESTABLISHED] ImplicitO predicts occupancy and backward flow at continuous query points. Its decoder timing varies with query count; the authors explicitly leave downstream planning evaluation to future work. [Sections 3–5 and Fig. 5](https://arxiv.org/html/2308.01471v1). [INFERENCE] Occupancy interfaces are relevant cost and calibration baselines, but point/cell marginals alone do not determine a multi-time union collision probability. Compare shared query sets and report sensing/encoding and decoding costs separately. Prediction improvements are not evidence of closed-loop navigation gains.

## Particles and random finite sets define important novelty boundaries

[ESTABLISHED] Differentiable particle filters learn recursive belief updates. Optimal-transport resampling and stop-gradient corrections offer distinct ways to differentiate filtering, with different assumptions and cost. [RSS 2018 method](https://arxiv.org/pdf/1805.11122); [Corenflos et al., Proposition 4.3](https://proceedings.mlr.press/v139/corenflos21a/corenflos21a.pdf); [Ścibior and Wood, Algorithm 1](https://arxiv.org/pdf/2106.10314).

[INFERENCE] TEC must compare against persistent classical particles carrying the same hidden intention/history, branch-conditioned dynamics, resampling policy, and information objective. Resetting classical identities every step would weaken the baseline. Learned particles need not be hand-engineered. Distinguish filtering posterior particles, rollout samples, and mixture components; all can have persistence but have different semantics.

[ESTABLISHED] GM-PHD represents intensity with mass equal to expected target count. Its inspected derivation assumes independent targets and additional Poisson/linear-Gaussian conditions. LMB gives explicit labeled existence/state factors but approximates the update; matching its first moment does not preserve every cardinality probability. GLMB retains weighted multi-object hypotheses, and practical implementations analyze truncation error. [GM-PHD Eq. 14 and assumptions A.1–A.6](https://ba-ngu.vo-au.com/vo/VM_GMPHD_SP06.pdf); [LMB Remarks 5–6](https://ba-ngu.vo-au.com/vo/RVVD_LMB_TSP14.pdf); [GLMB Propositions 10–11](https://ba-ngu.vo-au.com/vo/VV_Conjugate_TSP13.pdf); [GLMB implementation Section III](https://arxiv.org/pdf/1312.2372).

[INFERENCE] RFS is most relevant to births, deaths, false detections, missed detections, and label ambiguity. A PHD filter is not a complete joint-intent model; its limitation must not be generalized to all RFS models. QLC's unit trace can coexist with a separate count/existence model, but does not itself express expected count. PSC's proposed discarded-weight alarm needs empirical predictive validation and an intervention; truncation diagnostics in general are already established.

## Distributional evaluation must expose the intended failure

[ESTABLISHED] Proper scores reward accurate distributions in expectation under their assumptions. The energy score supports multivariate forecasts with 0<beta<2 and the appropriate finite moment. [Gneiting and Raftery, Section 4.3 Eq. 22](https://sites.stat.washington.edu/people/raftery/Research/PDF/Gneiting2007jasa.pdf). Calibration alone can be uninformative; post-hoc regression calibration relies on adequate i.i.d. data. [Kuleshov et al., Sections 3.1–3.2 and Fig. 4](https://proceedings.mlr.press/v80/kuleshov18a/kuleshov18a.pdf).

[INFERENCE] Report joint-future log score when the density is available, a fixed-sample energy score, event Brier/log scores, horizon-dependent coverage and sharpness, and collision-event reliability. Marginal coordinate CRPS cannot by itself test cross-agent dependence. MinADE/minFDE need fixed K because adding candidates cannot increase a minimum; pair them with joint consistency, invalid-mode probability, sample precision and probabilities. A low aggregate ECE is not proof of subgroup, temporal, or distribution-shift calibration.

[HYPOTHESIS] A PSC capacity alarm is useful if held-out discarded weight predicts future *excess decision loss* beyond existing uncertainty/latency diagnostics, and adaptive bond expansion or conservative planning improves the preregistered outcome at an acceptable cost. Use separate training, alarm-calibration, and final evaluation scenarios, including shifts. Report false alarms and missed alarms.

## Minimal justified baseline progression

| Stage | Baselines | Purpose |
|---|---|---|
| Stage 0 low-dimensional | Constant velocity; exact Bayes/dense joint table; factorized categorical; joint categorical mixture; classical low-rank nonnegative/tensor model; persistent particles | Establish the mathematical distinction and detect a trivially sufficient classical solution |
| One-obstacle filtering/planning | Kalman/IMM-style model; particles; Gaussian mixture; Gaussian/categorical RSSM with common planner | Test multimodality, occlusion updates and comparable cost |
| Several correlated obstacles | Joint classical autoregressive/GNN/Transformer predictor; interaction-aware slots; joint diffusion; LMB or GLMB when association/cardinality is uncertain | Test correlation and identity under strong classical alternatives |
| Visual extension | Shared perception; SlotFormer-style dynamics; DINO-WM-style features; DIAMOND only if visual generation itself matters | Avoid attributing encoder improvements to the core |
| System comparison | Native TD-MPC2/Dreamer plus standard robotics planner systems chosen by the robotics review | Establish practical rather than core-only utility |

These are proposed baseline roles, not reproduced implementations. FloMo supplies a verified individual-trajectory flow baseline; a joint-flow variant and selected low-dimensional diffusion/joint-mixture variants still require concrete configurations. Occupancy Flow Fields and ImplicitO supply concrete occupancy-interface comparisons, with their distinct state-input and sensor-input assumptions preserved.

## Coverage and reproducibility limitations

Twenty-three primary papers/reports were deliberately included, with two classified conservatively as preprints. Full primary PDFs were opened for all twenty-three, though only relevant sections were inspected and no proof or implementation was independently reproduced. Dreamer journal metadata was verified through PubMed while the full inspected technical version was arXiv; this version difference is recorded. Seven repository pages explicitly declared MIT; their dependencies, model weights and datasets were not license-audited. Other licenses remain UNKNOWN. No repository was installed or executed.

Searches are exact recorded ranked-web queries plus citation chaining and direct metadata verification. Search-engine total counts are UNKNOWN; returned snippets are not an exhaustive database export. A focused public arXiv API query failed both through PowerShell and the web fetcher; failures are preserved. A systematic-review or PRISMA completeness claim is not justified by these searches. Candidate counts in world_screening.json describe only the explicitly named working set, excluding incidental snippets and duplicate reports: 28 candidates, 23 included, four unverified, one excluded. The 33 search-log entries comprise 32 ranked-web queries and one failed API request. Coverage remains weaker for 2025–2026 predictor comparisons, scene-joint flows, CPHD/JPDA/MHT and application-specific calibration. Literature saturation or a final code-available forecasting winner is not established.

