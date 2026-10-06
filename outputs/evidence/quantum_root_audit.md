# Independent domain audit of root mathematical and Stage 0 drafts

Read outputs/05_mathematical_formulation.md and outputs/08_stage0_falsification_protocols.md on 2026-10-06. Findings were sent to coordinator; root files were not edited by this agent.

1. Stage 0B forbidden joint mass alone is an invalid success gate: a point mass on 01 has zero forbidden probability but misses half of the target. Use proper joint NLL or exact total variation as primary; require coverage and forbidden-mass criteria jointly.
2. Stage 0C equality tolerance 1e-10 must apply to exact contractions/enumerations, not independent Monte Carlo estimates.
3. A denominator floor alone can break trace normalization. Use stable factor rescaling plus normalization or a declared valid density reset for numerically degenerate input.
4. Rank-r manifold formula assumes exact rank r and 1≤r≤d.
5. Define the Stage 0A outcome-noise process explicitly, e.g. p_epsilon = epsilon + (1−2epsilon) p_base for symmetric bit flips.
6. Tensor residual warnings are already appropriate. Extend with the valid canonical one-step bound D(rho,rho_truncated)≤sqrt(discarded_weight) only under the purification Schmidt conditions; conditioning on rare observations can amplify errors.
7. Real symmetric density matrices solve the specified real two-level coherence fixture. A complex representation is not shown necessary.
8. Current process hierarchy must cite Q14 (2024), not leave Q03/Q04's historical open strictness question unresolved.
9. Tensor-probability empirical prior art Q17 §6 includes main full-data fitting, without regularization. Those results are not held-out generalization or robotics evidence.
10. Exact chain BP contraction and approximate loopy BP are clearly distinguished in the root draft. Preserve this in final diagrams and summaries.

No blocking mathematical error found in the root LPDO one-cut proof, common-channel ensemble equivalence, Fubini–Study convention or CVaR definition. The substantive scientific risk is unfair bottleneck/control selection, especially passing 0B using invalid-mass suppression without coverage.

