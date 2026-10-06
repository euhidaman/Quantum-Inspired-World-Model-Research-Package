# Literature review: structured beliefs for dynamic navigation

Review date: 2026-10-06 (Asia/Taipei). The requested filename is retained, but the achieved review is a **bounded scoping synthesis with a prospective protocol and systematic logging**, not an exhaustive database-based systematic review. It does not establish literature saturation or absence of prior art. No meta-analysis or project benchmark was performed.

## Methods and coverage

The local [protocol](review_protocol.md) was written before scientific retrieval and its initial hash saved. Searches prioritize 2021–2026 applications and allow older foundational mathematics/planners. Inclusion requires relevance to representation, uncertainty, control, evaluation, or an explicit limiting result. Final technical claims require an opened primary paper/official record and location; title-only leads remain unverified. Preprints and accepted manuscripts retain distinct status.

Three domain workstreams used exact-query ranked public web discovery, direct official proceedings/arXiv/publisher/author-paper retrieval and citation chaining. Domain logs in `evidence/*search_log*` and `quantum_query_log.json` preserve queries/dates and returned counts where exposed. Public arXiv API retrieval failed; a public Crossref singleton verified Choi metadata. Neither is presented as a successful exhaustive bibliographic search. Search-engine ranking counts are not database totals; incidental snippets were not all screened.

The [paper database](02_paper_database.csv) includes structured extraction for every selected report family; preprint/published versions are linked within a row where identified. The [screening audit](screening_audit.json) and [flow figure](figures/prisma_flow.png) give actual curated-set counts and distinguish full-section, abstract-only and metadata-only evidence. They deliberately do not invent total identified/excluded-study counts. Domain candidate/failure files retain additional explicit exclusions and unretrieved leads. Software/venue documentation is separate from scientific papers.

Each domain's extraction was checked by the coordinator and cross-checked for mathematical/baseline errors by specialist agents. These are coordinated AI reviews, not independent human double screening. Appraisal asks whether assumptions, actual method, cited location, comparator and evaluation scope support the specific claim. No clinical risk-of-bias score or generic GRADE grade was assigned to algorithm papers. Detailed source locations and uncertainties remain in the [claim ledger](03_claim_evidence_ledger.csv).

## Thematic map

| Required theme | Evidence anchors | Synthesis / residual gap |
|---|---|---|
| Latent world models for control | W01,W02,W05 | Learned predictive/control states exist; collision-risk calibration is a separate property |
| Deterministic, Gaussian, categorical, token, diffusion latents | W01–W05; Gaussian RSSM is a planned control | No single “standard latent” baseline covers these distinct models |
| Dynamic-obstacle prediction | W08–W10,R13–R16 | Joint futures, dynamics and evaluation settings matter more than a generic model label |
| Multimodal trajectory forecasts | W08–W11,W21 | Sampling/latent modes and individual-agent flow densities already represent alternative futures |
| Occupancy and occupancy flow | W22,W23 | Occluded occupancy/flow and query-based forecasting exist; planning utility is not automatic |
| Standard planning / collision avoidance | R01–R07 | Separate static routing, reactive velocity control and timed trajectory planning |
| Risk / chance constraints | R08,R11,R12 | Guarantees depend on model/uncertainty assumptions and event definition |
| Belief-space / POMDP | R09,R10 | Classical beliefs and sensing actions are required TEC rivals |
| Object-centric video | W06,W07 | Interaction-aware slots are not independent-slot baselines |
| Particle filtering | W12–W14 | Learned recursive particles and differentiable resampling already exist |
| RFS / multi-object tracking | W15–W18 | Existence, cardinality, labels and hypothesis pruning are established concerns |
| Density sequence / HQMM | Q01–Q04,Q14–Q16 | QLC has direct prior art; current hierarchy results must replace older open questions |
| OOM / predictive state | Q05,Q06,Q14 | Classical observable-process rivals are essential |
| Locally purified tensors | Q07,Q17 | Positivity-preserving structured storage is established; robot utility remains hypothetical |
| Tensor contraction / BP | Q08,Q09 | Approximate contraction/gauging is not universal convergence or safety certification |
| Projective geometry / trajectories | Q11–Q13 | Ensemble decomposition and distance are mathematical tools, not physical hidden intents |
| Active perception | R09,R10 and report 08 exact fixture | Information value must use observation likelihood and downstream actions |
| Calibration / abstention | W19,W20 | Proper scoring and marginal calibration do not imply shifted joint safety; abstention policy remains a design hypothesis |
| Sim-to-real / robot validation | R01,R04,R07,R13–R16; platform docs | Inspected settings inform design, not proof of transfer for the proposed cores |

Verified additions include FLOMO (W21, IROS 2021), Occupancy Flow Fields (W22, RA-L 2022) and ImplicitO (W23, CVPR 2023). FLOMO is not a verified joint-scene flow baseline; ImplicitO leaves downstream planning to future work in its inspected text. Detailed thematic extractions are in [world models](evidence/world_review.md), [quantum foundations](evidence/quantum_review.md), and [robotics](evidence/robotics_review.md).

## What is already solved, in a scoped sense

`[ESTABLISHED]` Modern world models already use discrete stochastic state, tokens, diffusion-generated observations and pretrained predictive features. DreamerV3's verified publication is Nature 2025, while DINO-WM is ICML 2025; older arXiv/under-review labels should not be copied forward. These papers do not jointly prove calibrated dynamic-obstacle navigation. TD-MPC2's simplex-normalized embedding should not be mislabeled a sampled categorical belief. Sources: W01–W05, methods and publication metadata.

`[ESTABLISHED]` Object-centric dynamics can use attention across slots, and joint trajectory models can encode cross-agent consistency. Scene Transformer and MotionDiffuser directly weaken the claim that correlations among alternatives are absent from classical prediction. A PSC-versus-independent-slots comparison therefore tests factorization, not superiority to current joint predictors. Sources: W06–W10, architecture and joint prediction sections.

`[ESTABLISHED]` HQMM learning and its relationship to tensor sequence constructions and OOMs predate this project. A 2024 process-class separation establishes limits beyond older papers' unresolved questions. Theorems concern exact realization under specified stochastic-process assumptions; they do not compare training cost, navigation benefit or all nonlinear recurrent networks. Sources: Q01–Q06,Q14. `[INFERENCE]` Off-diagonals are useful only through the chosen observable process, and simultaneous basis changes prevent literal interpretations of raw coherence.

`[ESTABLISHED]` Locally purified factors preserve positivity and enable controlled tensor approximations. BP-based contraction/gauging connects older graphical inference ideas to tensor computation under stated conditions. `[INFERENCE]` A chain purification yields a cut-dependent information bottleneck, but no inspected source proves that dynamic scenes obey a favorable area law. Sources: Q07–Q09,Q17,Q19; report 05 proof.

`[ESTABLISHED]` Particle and random-finite-set methods already preserve weighted hypotheses, labels/existence and—in richer variants—joint multi-target alternatives. An intensity alone loses higher-order dependence; that limitation must not be attributed to every RFS model. Truncation/pruning analysis also predates the PSC proposal. Sources: W12–W18.

## What remains unresolved

`[UNKNOWN]` No inspected source or project experiment establishes that the particular QLC/PSC/TEC cores improve dynamic navigation under matched compute. Unknowns include inference stability after long occlusion, slot assignment, rank/order dependence, calibration of rare collisions, online contraction/rollout cost and whether a simple classical joint representation already suffices.

`[HYPOTHESIS]` PSC might offer a useful controlled approximation for sparse interactions and an empirically informative capacity diagnostic. The hypothesis is most vulnerable when interactions become global, topology changes rapidly, or dangerous futures have small probability. A modest bond dimension is a resource choice, not guaranteed scene structure.

`[INFERENCE]` TEC's mathematical nonuniqueness is decisive: two ensembles with the same density operator remain indistinguishable under common linear channels and instruments. Branch-dependent nonlinear dynamics or extra labels create a richer *classical* state. The unresolved engineering question is whether that state is better organized in projective coordinates than ordinary persistent particles; arbitrary same-rho divergence does not answer it.

## Contradictions and negative evidence

| Tempting claim | Contrary evidence / limitation | Design response |
|---|---|---|
| “Multiple futures require a quantum latent” | Joint mixtures, trajectories, particles and diffusion already offer them | State the selected dependency/filtering bottleneck |
| “d²−1 parameters proves an advantage” | Coordinate size is not learned process utility; OOM/HQMM hierarchy has specific assumptions | Match memory, weights, latency and history |
| “Purification is novel for sequence learning” | Q04,Q07,Q17 establish related objects | Identify exact new slot/filtering/control algorithm |
| “Higher chi always helps” | Saturated tiny cases, optimization and contraction cost can remove gains | Exact oracle plus plateau/overfit/scaling tests |
| “Zero forbidden mass proves correctness” | One valid mode can absorb all mass | Add proper joint score/TV and valid-mode recall |
| “Discarded weight certifies safety” | Rare high-cost mass and conditioning amplification break the inference | Validate collision-event error and rare-mode alarms |
| “Different unravelings mean different physical worlds” | Common-instrument equal-rho equivalence | Ground branch labels, test correctness, compare particles |
| “ORCA/SIPP guarantees apply universally” | Reciprocity and supplied prediction assumptions limit scope | Report violations; compare assumptions-matched settings |
| “Best-of-K metrics prove calibrated prediction” | Minimum error decreases as candidates are added | Fix K and measure probability/precision/coverage |

## Defensible claims now and later

Now: a source-grounded mathematical formulation, a falsifiable hierarchy of proposed experiments, known equivalence/prior-art boundaries, and a conditional engineering priority. This is a research program. Later, only after saved experiments: task- and resource-specific prediction/safety improvements, failure-diagnostic utility, or a well-supported negative result. No “first”, “quantum speedup”, unlimited capacity or real-robot validation claim is currently justified.

## Limitations and required search extension

Coverage is uneven: 2025–2026 application literature, learned tensor-train filters, scene-joint flows and recent flow/occupancy comparisons, CPHD/JPDA/MHT and domain-specific calibration/abstention deserve additional systematic database searches. Some foundational sources were only inspectable at abstract/metadata level; detailed theorem claims are not inferred from those records. No broad retraction audit, exhaustive forward-citation export or independent replication was completed. Code existence/licenses were verified only where explicit; dependencies, pretrained weights and assets need separate audits.

Before a formal systematic-review manuscript or novelty assertion, rerun comprehensive queries in appropriate bibliographic databases with pagination/export, reconcile all record/report/study counts, use independent human full-text eligibility decisions, retrieve unavailable core reports and document amendments. The current package preserves enough provenance to extend that work without pretending it has already happened.
