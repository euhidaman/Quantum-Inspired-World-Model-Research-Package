# Adapting pretrained world models with quantum-inspired mathematics

Research supplement, 2026-10-06. Status: literature and proposed experiments only; no model-performance measurements.

## Recommendation

**Yes: we can preserve a pretrained model and train selected additions or weight updates. We do not need to pretrain the entire system again.** The evidence supports feasibility of adaptation, not a guaranteed quantum-inspired improvement.

Investigate two separate directions:

1. **Weight adaptation:** keep the model's latent interface and use a quantum-inspired parameterization for small trainable updates inside its predictor. This most directly answers the request to modify an existing model.
2. **Belief augmentation:** reuse pretrained visual features and add a learned PSC module for correlated obstacle futures. This tests the original project's uncertainty hypothesis.

Start with DINO-WM for a controlled adaptation experiment. Consider Navigation World Models (NWM) for later navigation transfer. Keep the original exact [Stage 0 tests](08_stage0_falsification_protocols.md). The detailed prospective plan is in [19](19_adaptation_experiment_protocol.md); implementation candidates and evidence are in [20](20_pretrained_candidate_matrix.csv) and [21](21_adaptation_claim_ledger.csv).

## What is actually reused?

| Route | Reused | Trained | Meaning of the change |
|---|---|---|---|
| Predictor weight adapter | Encoder, predictor base weights, compatible downstream interfaces | Small adapter parameters; explicitly selected heads if needed | Changes existing latent dynamics without changing its tensor shape |
| Side belief module | Frozen encoder and optionally original predictor outputs | History/slot bridge, belief update and probability readout | Adds a new state alongside the existing latent |
| Replace the latent core | Usually encoder; possibly compatible decoder through a bridge | New dynamics, bridges and affected heads | Substantial new learning; old dynamics weights may not transfer |
| Unfreeze selected blocks | Pretrained initialization throughout | Selected original weights plus additions | Fine-tuning, not random-initialization pretraining |

A pretrained encoder alone is not a pretrained world model: the action-conditioned dynamics may still be newly learned. Conversely, adapting a released encoder-plus-predictor checkpoint is genuine reuse of trained dynamics.

A fixed transformation g(z) cannot distinguish two histories that the original encoder maps to the same z. Increasing the array dimension does not recover discarded information. A new history pathway, additional observations, or encoder fine-tuning may be necessary. Likewise, an invertible coordinate change alone does not enlarge a model's information content. These are mathematical constraints, not empirical objections to adaptation.

Define “broader and better” operationally: better retained prediction across unseen environments, more accurate joint probabilities, better planning, or equal performance using less measured compute. The number of latent coordinates alone is not an outcome.

## Evidence for feasible hosts

**DINO-WM — first pilot.** Its learned action-conditioned predictor uses frozen DINOv2 patch features. The official repository links trained PointMaze, Wall and PushT checkpoints. Source inspection found separate encoder, predictor and action/proprioception paths, making controlled predictor adaptation plausible. Checkpoint loading and reproduction remain untested. Its existing benchmarks do not establish calibrated crowd prediction. [ICML paper](https://proceedings.mlr.press/v267/zhou25t.html), [official code and checkpoints](https://github.com/gaoyuezhou/dino_wm).

**V-JEPA 2 / 2.1 — stronger video-feature options.** V-JEPA 2 freezes its encoder when learning action-conditioned dynamics from robot data; the training still uses action/state metadata. Version 2.1 adds navigation experiments with a diffusion predictor over dense features. Those reported navigation measurements are open-loop trajectory/planning metrics, not closed-loop collision calibration. Encoder releases are documented; availability of the exact 2.1 navigation predictor checkpoint was not confirmed. [V-JEPA 2 methods](https://arxiv.org/html/2506.09985v1), [2.1 navigation section](https://arxiv.org/html/2603.14482v3), [official model release](https://github.com/facebookresearch/vjepa2).

**NWM — later navigation host.** This is an action-conditioned egocentric navigation world model with a released diffusion-transformer checkpoint. The repository declares CC-BY-NC 4.0 for code and weights and notes that some training-data versions are not redistributed. Its size and sampling cost require profiling before a Fir budget can be estimated. [Methods](https://arxiv.org/html/2412.03572v2), [release and data notes](https://github.com/facebookresearch/nwm).

**TD-MPC2 and DreamerV3 — conditional alternatives.** TD-MPC2 releases many control checkpoints, but observation/action compatibility must be checked for the particular artifact. Its policy, reward and value components depend on the latent interface. Dreamer's recurrent state similarly supports multiple downstream heads. A core swap is not a transparent checkpoint edit. No task-matched Dreamer navigation checkpoint was verified. [TD-MPC2](https://github.com/nicklashansen/tdmpc2), [Dreamer state implementation](https://github.com/danijar/dreamerv3/blob/main/dreamerv3/rssm.py).

**Object and policy components.** DINOSAUR supports extracting object slots from pretrained visual features; SlotFormer supplies a classical object-dynamics precedent. Neither establishes persistent crowd identity or a calibrated scene belief for our task. ViNT/NoMaD checkpoints are useful navigation-policy comparators, but a policy is not automatically an action-conditioned world model. [DINOSAUR](https://dinosaur-paper.github.io/), [SlotFormer](https://github.com/pairlab/SlotFormer), [navigation policy releases](https://github.com/robodhruv/visualnav-transformer).

## Direction A: quantum-inspired weight adaptation

Let W0 be a frozen predictor weight. A LoRA control uses

$$W_\theta = W_0 + B_\theta A_\theta.$$

A multiplicative structured adapter can instead use

$$W_\theta = R_\theta W_0,\qquad R_0=I.$$

Here R has the output dimension of W0. Rectangular weights require explicit dimension handling; do not assume all attention projections are square. Identity initialization should reproduce the unadapted predictor before training. [LoRA](https://arxiv.org/abs/2106.09685).

Existing prior art already includes:

- **QuanTA:** quantum-informed tensor updates for pretrained language models. Its limitations discuss GPU utilization; small trainable parameter counts are not a runtime guarantee. [NeurIPS 2024 method](https://arxiv.org/html/2406.00132).
- **QuIC:** compound-matrix adapters based on orthogonal transformations, evaluated on language and DINOv2 vision transfer. In its inspected vision table, QuIC uses 0.13M trainable parameters with average 82.61, versus LoRA's 1.77M and 83.24. This illustrates a tradeoff, not a universal accuracy win. Its first-order construction reduces to orthogonal fine-tuning. Public implementation usability was not verified. [2025 preprint, v2](https://arxiv.org/html/2502.06916v2).
- **Quantum-PEFT:** Pauli/unitary and tensor-network parameterizations for vision/language fine-tuning. This is further direct prior art for adapting existing weights with quantum-inspired mathematics. [ICLR 2025 paper](https://www.merl.com/publications/docs/TR2025-051.pdf).
- **LoRETTA:** classical tensor-train adaptation, which prevents treating tensorized parameter efficiency itself as uniquely quantum. [NAACL 2024 paper](https://aclanthology.org/2024.naacl-long.174/).

In QuIC-like adaptation, the mathematics enters the parameterization of R, through structured blocks built from matrix minors. In QuanTA, it enters a tensor-factorized weight transformation. **Neither automatically creates a density-matrix belief or a larger latent space.** Both can change useful computation performed inside the existing model.

A defensible research question is: *Under fixed data and tuning budgets, do these parameterizations improve the prediction/planning versus measured-cost tradeoff when adapting a pretrained world model?* Applying them once and observing improvement over an untouched checkpoint is insufficient; ordinary fine-tuning may explain it.

## Direction B: pretrained perception plus a structured belief

Proposed pipeline:

    observation history -> frozen pretrained features -> shared slot/history bridge
                                                        |
                                      classical belief or PSC belief
                                                        |
                                normalized joint future probabilities -> planner

For QLC, a learned bridge can produce a normalized PSD state,

$$\rho_t=\frac{A_tA_t^\dagger+\epsilon I}
                   {\operatorname{Tr}(A_tA_t^\dagger+\epsilon I)},\quad \epsilon>0.$$

The quantum-inspired mathematics enters the state, constrained dynamics and probability readout. An arbitrary neural decoder from matrix entries is not the same as a Born-rule probability model. Use the channel/instrument definitions already specified in [05](05_mathematical_formulation.md).

For PSC, the bridge produces local purification tensors rather than one dense matrix:

$$\rho_t=X_tX_t^\dagger/\|X_t\|_F^2.$$

X is represented by a tensor network over slots; bond dimension controls a structural capacity limit. Require nonzero normalization and valid contractions. Train its initialization, temporal update and readout while reusing perception. Compare against classical joint mixtures, autoregressive/graph predictors and tensor factorizations given identical features and histories.

The hypothesis concerns **joint predictions**: two individually plausible obstacle motions can be jointly impossible. A point-feature prediction loss alone does not specify that distribution. Use normalized joint likelihood and event calibration, with object association and missed detections included in the task.

A pretrained feature bridge may itself fail: object slots can merge, swap identity or omit motion information. First diagnose representational sufficiency with simple probes and a classical sequence predictor. Oracle tracks may isolate the belief mathematics, but they are a separate diagnostic and must be available equally to every method.

Side modules themselves are established: Side-Tuning and Ladder Side-Tuning already adapt frozen networks. Detaching the backbone can save activation-gradient memory; inserting trainable layers internally does not necessarily do so. [Side-Tuning](https://sidetuning.berkeley.edu/), [LST](https://arxiv.org/abs/2206.06522).

## New overlapping work changes the novelty assessment

These sources were absent from the original 58-family extraction and must be incorporated before drafting novelty claims.

**UWM-JEPA, 2026 preprint:** directly combines a density-matrix latent with action-conditioned unitary prediction. Its toy counterfactual task uses simulator-derived training targets. The main comparison reports 0.77 accuracy versus 0.53 for a matched LSTM-JEPA, but Appendix S3's directly supervised recurrent control reaches 0.960 under a different objective. Joint-spectrum preservation does not prove calibrated uncertainty or accessible long-horizon information. This is close QLC prior art, not evidence that a navigation foundation checkpoint can already be converted successfully. [Methods and Appendix S3](https://arxiv.org/html/2605.25313v1).

**QSWM, 2026 preprint:** tests complex and density-like predictors on cellular automata. Table 1 reports improved one-step accuracy for its complex model but lower ten-step accuracy than the classical baseline, 0.5037 versus 0.5143. The inspected table provides no uncertainty intervals. Its density-like construction is not our full CPTP/Born belief model. This is overlapping world-model prior art and a warning against inferring long-rollout gains from one-step fit. [Methods and Table 1](https://arxiv.org/html/2608.05371v1).

**FactorJEPA, 2026 preprint:** explicitly describes replacing a pretrained V-JEPA predictor with factor-specific predictors, followed by staged adaptation. This is direct architectural precedent for latent-dynamics surgery. However, the inspected decoded-future appendix table contains “[result]” placeholders; quantitative completeness is limited. It should inform architecture and classical controls, without being treated as a fully verified performance benchmark. [Predictor-surgery section and appendix](https://arxiv.org/html/2608.01049v1).

Consequently, do not claim the first quantum world model, first density-state JEPA, first quantum-inspired adapter, or first factorized pretrained predictor. Potential contribution must be narrower: a validated adaptation algorithm, informative failure diagnostic, or reproducible cost/calibration advantage on a specified task.

## How this affects QLC, PSC and TEC

| Proposal | Feasible reuse route | Training still needed | Current recommendation |
|---|---|---|---|
| QLC | Feature bridge into density state; possibly distill a pretrained predictor | Bridge, channel/update and probability head | Secondary baseline; compare directly with UWM-JEPA-like and classical recurrent controls |
| PSC | Pretrained features plus shared slots and purified joint belief | Slot/history bridge, tensor dynamics and readout | Preserve as the main original hypothesis after exact falsification tests |
| TEC | Pretrained features plus weighted persistent branches | Branch dynamics, weighting/readout and any extra memory | Defer; equal-density ensembles remain indistinguishable under common linear channels/Born instruments |
| Weight adapters | Update selected layers of an existing predictor | Structured adapter parameters | New parallel research question, experimentally separate from belief-state claims |

Quantum hardware is unnecessary. Classical numerical linear algebra implements all proposed pilots.

## Decision and evidence limits

The practical starting point is **DINO-WM reproduction, then a small adapter comparison**. A second experiment can evaluate frozen-feature PSC against strong joint classical beliefs. NWM is the more directly navigation-oriented transfer candidate once those gates pass. This ranking is an engineering inference, not a published head-to-head result.

The bounded supplement contains 21 curated research/software families plus one workflow attribution. Discovery used primary-source web searches and citation/repository chaining; [raw queries and retrievals](sources/adaptation/search_log.json) preserve successful and failed accesses. Search terms evolved as new work appeared. This is not exhaustive, dual-screened, or PRISMA-complete; there is no defensible total-screened-paper count. Abstract-only records are labeled, and paper/repository versions are grouped rather than counted as independent studies.

Parallel was not configured, so the research-lookup workflow used built-in web retrieval. No paid service, model download, training or cluster job was run. Repository links establish reported availability, not that checkpoints load, licenses cover every dependency, or runs fit a particular Fir allocation. Small scratch models also remain legitimate controls; LeWorldModel's abstract reports a compact alternative, but its runtime was not verified on Fir. [LeWorldModel](https://arxiv.org/abs/2603.19312).

The workflow used literature-review, research-lookup, scientific-critical-thinking and experimental-design skills. Attribution: Kassis et al. (2026), *Scientific Agent Skills: A Library of Procedural Knowledge for Research Agents*, [arXiv:2609.00065](https://doi.org/10.48550/arXiv.2609.00065). See the [supplement skill log](sources/adaptation/skill_log.md).
