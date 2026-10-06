# Mathematical audit for QLC, PSC and TEC

Prepared 2026-10-06. [INFERENCE] denotes deductions supplied here, not newly discovered theorems. [HYPOTHESIS] denotes tests to run; no experiment below was executed. Source IDs resolve through quantum_papers.json. All computation is classical numerical linear algebra.

## QLC coordinates, channel and observation update

Let d be Hilbert-space dimension and r a retained factor rank. For nonzero A in C^(d×r), define

\[
\rho=AA^\dagger/\|A\|_F^2,\quad \rho\succeq0,\quad \mathrm{Tr}\rho=1 .
\]

This stores a normalized positive matrix. Positivity follows because v†AA†v=||A†v||²≥0. A full Hermitian matrix has d real diagonal entries and d(d−1) real off-diagonal coordinates; trace normalization removes one, giving d²−1. A rank-r density manifold generically has 2dr−r²−1 real dimensions: divide the factor by its U(r) right-unitary gauge and normalization. These are parameter counts, not useful process-capacity or speed claims. Compare actual stored complex scalars, optimizer state and precision.

For fixed action a and exogenous context h, take matrices K_k(a,h) satisfying \(\sum_k K_k^\dagger K_k=I_d\), and set

\[
\mathcal E_{a,h}(\rho)=\sum_k K_k\rho K_k^\dagger .
\]

Each summand and every extension \(I_n\otimes\mathcal E\) preserves positivity by the same quadratic-form argument, and cyclicity of trace proves trace preservation. The matrix of stacked Kraus blocks can be constrained to have orthonormal columns. This is established HQMM machinery [Q03, §3]; the original Choi record [Q18] is metadata-only in this review.

A sensor model needs an outcome-indexed instrument, not merely a TP prediction channel:

\[
\mathcal J_{o,a}(\rho)=\sum_k K_{o,k,a}\rho K_{o,k,a}^\dagger,\quad
p(o\mid\rho,a)=\mathrm{Tr}\mathcal J_{o,a}(\rho),\quad
\rho^+={\mathcal J_{o,a}(\rho)\over p(o\mid\rho,a)}.
\]

Here o is a discrete observation or discretized feature, \(\sum_{o,k}K_{o,k,a}^\dagger K_{o,k,a}=I\), and conditioning is defined only for positive outcome probability. This separates the unnormalized linear instrument from its normalized nonlinear Bayesian-style update. For continuous o use a density with a specified base measure and an integral normalization. The learned filter need not assert physical quantum measurement disturbance in robot sensors.

For a diagonal classical belief diag(p), every column-stochastic transition P has Kraus matrices \(K_{ij}=\sqrt{P_{ij}}|i\rangle\langle j|\). Then \(\mathcal E(\mathrm{diag}p)=\mathrm{diag}(Pp)\). This direct calculation gives a classical diagonal control; diagonal Kraus matrices alone would be an unnecessarily restrictive classical transition family.

Under column vectorization,
\[
\mathrm{vec}(\mathcal J_o(\rho))
 =\big[\sum_k \overline{K}_{o,k}\otimes K_{o,k}\big]\mathrm{vec}(\rho).
\]
The bracket is an ordinary linear operator on d² coordinates. Thus finite linear observable-state baselines are essential [Q03, Theorem 1]. Q14 updates the exact finite-process hierarchy; those separation theorems do not compare runtime or prediction under finite noisy data.

## Operational off-diagonal test

Let \(\Delta\) remove off-diagonal entries in one fixed basis. Any future history likelihood under common linear dynamics has the form \(p(w\mid\rho)=\mathrm{Tr}(\rho F_w)\), where w is the action-observation word and \(F_w\) is the corresponding Heisenberg-picture effect. Then

\[
p(w\mid\rho)-p(w\mid\Delta\rho)
 =\mathrm{Tr}[(\rho-\Delta\rho)F_w].
\]

Only the readout-relevant operator span matters. If every reachable \(F_w\) is diagonal, off-diagonal coordinates are operationally irrelevant. A diagonal final readout does not suffice: preceding dynamics can rotate off-diagonal information into it. Likewise, checking pairwise commutation at one step does not establish one shared diagonal algebra for every reachable history.

A controlled Stage 0 unit test is
\[
\rho_\pm=\begin{pmatrix}1/2&\pm c\\\pm c&1/2\end{pmatrix},
\quad 0<c<1/2,\quad
U={1\over\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix},\quad M_0=|0\rangle\langle0|.
\]
Both matrices are valid and have identical diagonals. Without U, both outcome probabilities equal 1/2. With U, they equal \(1/2\pm c\). With c=1/4, analytic targets are 0.75 and 0.25; these are calculations, not measured model results.

Crucial falsification caveat: a classical state carrying one scalar z=±c and the readout \(p(0)=1/2+z\) solves this task exactly. The test verifies implementation and loss of information under the imposed diagonal bottleneck. It does not show advantage over an equally informed classical representation. Train on classical histories with no privileged access to ± labels; compare a real-vector recurrent model, real symmetric PSD model, PSR/OOM where valid, and mixtures. Match encoder access and decoded futures.

There is also a simultaneous basis gauge: \(\rho\mapsto V\rho V^\dagger\), \(K\mapsto VKV^\dagger\), \(M\mapsto VMV^\dagger\) leaves every output probability unchanged. A matrix being nondiagonal in an arbitrary learned basis does not identify a physical obstacle relation.

## Continuous dynamics and assumptions

With \(\hbar=1\), Hermitian H, operators L_k and nonnegative rates \(\gamma_k\), a time-independent generator is
\[
\mathcal L(\rho)=-i[H,\rho]+\sum_k\gamma_k
 \big(L_k\rho L_k^\dagger-\tfrac12\{L_k^\dagger L_k,\rho\}\big).
\]
H governs the reversible part; L_k and \(\gamma_k\) specify the dissipative part; brackets and braces are commutator and anticommutator. Finite-dimensional, linear, continuous CP-TP semigroup assumptions are the relevant restricted setting [Q10 abstract; Q07 Eqs.(1)–(2)]. The Kraus/Lindblad decomposition is not itself unique.

For fixed exogenous a,h the coefficients may define a valid conditional generator. If they depend on \(\rho\), the resulting neural flow is nonlinear and is not the basic linear semigroup theorem. Time-dependent positive-rate generators can be used as a separate construction; do not label them a time-homogeneous semigroup. Explicit Euler integration can violate PSD even for a valid generator; discrete Kraus updates avoid this particular integration issue.

## LPDO construction and the topology-specific bound

Fix L ordered slots. Slot i has physical dimension d_i, a local purification index of size \(\kappa_i\), and neighboring bond dimensions \(\chi_{i-1},\chi_i\), with \(\chi_0=\chi_L=1\). Let tensor \(T_i^{s_i,e_i}\) be a \(\chi_{i-1}\times\chi_i\) matrix. Define

\[
X_{s_1\ldots s_L,e_1\ldots e_L}
  =T_1^{s_1,e_1}\cdots T_L^{s_L,e_L},\qquad
\rho={XX^\dagger\over \mathrm{Tr}XX^\dagger}.
\]

The ancilla indices e are summed out to give a mixed physical state. This is the local purification structure of Q07 Eq.(3). Storage is exactly proportional to \(\sum_i d_i\kappa_i\chi_{i-1}\chi_i\), and is O(Ldκχ²) for bounded uniform dimensions. Complex storage needs two real values per complex entry. Dense \(\rho\) would have \(d^{2L}\) entries; d^L is only the physical basis size.

[INFERENCE: proof.] Normalize \(|X\rangle\), treating every pair \((s_i,e_i)\) as one physical index. Split the open chain once between slots m and m+1. Call the two physical groups A,B and their local purifications A',B'. Contracting tensors on each side gives
\[
|X\rangle=\sum_{\alpha=1}^{\chi_m}|u_\alpha\rangle_{AA'}|v_\alpha\rangle_{BB'} .
\]
Therefore its Schmidt rank across \(AA':BB'\) is at most \(\chi_m\). Its reduced entropy is at most \(\log\chi_m\), because the entropy of at most \(\chi_m\) nonzero Schmidt probabilities is bounded by that of the uniform distribution.

For any systems C,D,E, strong subadditivity gives
\(I(C:DE)-I(C:D)=I(C:E\mid D)\ge0\).
This is local-discarding monotonicity; apply it twice to remove A' and B' [Q19, Theorem 2, Eq.(1.5)]. With \(S(\sigma)=-\mathrm{Tr}\sigma\log\sigma\) and \(I(A:B)=S(A)+S(B)-S(AB)\),
\[
I(A:B)_\rho
 \le I(AA':BB')_{|X\rangle}
 =2S(AA')_{|X\rangle}
 \le2\log\chi_m .
\]
Purity gives the middle equality. Thus the requested LPDO bound holds for this specific single-bond cut, even with arbitrary local κ. Logs in base 2 give bits; natural logs give nats.

For a partition cutting edges E_cut of a purified tensor network, the same factorization yields the conservative bound \(I(A:B)\le2\sum_{e\in E_\mathrm{cut}}\log\chi_e\), if local ancillas stay with their vertices. This is a representational upper bound, not proof of tractable contraction. A periodic chain usually cuts two bonds; an arbitrary interleaving partition can cut many. It is invalid to reuse 2logχ without counting those edges. A generic MPO's operator bond is not the purification bond; arbitrary signed MPO truncation need not preserve PSD.

At χ=1 the local purification is a product, hence \(\rho=\bigotimes_i\rho_i\). The independence conclusion applies to the state and to local product readouts conditional on the shared context. A joint learned decoder or a marginalized shared random context can create output correlation despite χ=1. Consequently the experiment must constrain/read out models consistently. An unconstrained dense decoder can hide all the supposedly tensor-native structure.

## Truncation and a defensible capacity alarm

Use canonical purification Schmidt weights s_j at a chosen cut, normalized so \(\sum_j s_j²=1\). Keep the largest χ values and define discarded weight \(\epsilon=\sum_{j>\chi}s_j²\). If \(0\le\epsilon<1\), the normalized truncated vector \(|\widetilde X\rangle\) has overlap \(\sqrt{1-\epsilon}\) with \(|X\rangle\). Elementary two-dimensional diagonalization of the difference of the two pure projectors gives
\[
\tfrac12\||X\rangle\langle X|-|\widetilde X\rangle\langle\widetilde X|\|_1
=\sqrt\epsilon .
\]
Partial trace cannot increase trace distance, so
\(D(\rho,\widetilde\rho)\le\sqrt\epsilon\), with \(D=\frac12\|\cdot\|_1\).
For a fixed effect \(0\preceq C\preceq I\),
\[
|\mathrm{Tr}[C(\rho-\widetilde\rho)]|\le D(\rho,\widetilde\rho)\le\sqrt\epsilon .
\]
C can represent a collision event only when that event is a valid common linear readout of this modeled state. The bound concerns representation error, not environmental model misspecification, sensing error or actual collision probability. A learned nonlinear decoder needs its own continuity argument.

Canonicalize before computing this ε. An arbitrary local-tensor SVD residual changes with gauge and need not equal physical lost weight. With fixed exact CP-TP dynamics and repeated compressions, a conservative telescoping sum of \(\sqrt{\epsilon_t}\) bounds accumulated distance; conditioning on rare observations may amplify error, so this argument does not carry through normalized updates unchanged. Q07 Appendix D is relevant numerical-error prior art.

[HYPOTHESIS.] Pre-register whether ε predicts held-out error of joint occupancy and calibration after controlling for obstacle count, interactions, prediction entropy, ensemble disagreement and out-of-distribution scores. Test randomized capacity increases and the same fallback planner at equal added compute. A mere correlation between ε and crowded scenes does not prove actionable benefit.

## TEC ensemble equivalence: complete operational statement

An ensemble is \(\mathcal E=\{(w_b,|\psi_b\rangle)\}_{b=1}^B\), where weights are nonnegative and sum to one and every vector has unit norm. Define \(\rho_\mathcal E=\sum_b w_b|\psi_b\rangle\langle\psi_b|\). Q11 supplies established ensemble nonuniqueness; the following argument is independent of its unretrieved full theorem.

For any common linear instrument \(\mathcal J_o\),
\[
\sum_b w_b\mathcal J_o(|\psi_b\rangle\langle\psi_b|)
=\mathcal J_o(\rho_\mathcal E).
\]
Thus equal input density matrices give equal outcome probabilities and equal normalized posteriors whenever the outcome has positive probability. For any history \(o_{1:T}\),
\[
p(o_{1:T}\mid a_{0:T-1})
=\mathrm{Tr}\big[\mathcal J_{o_T,a_{T-1}}\circ\cdots\circ
\mathcal J_{o_1,a_0}(\rho_\mathcal E)\big].
\]
Linearity proves equality for two same-ρ ensembles at every horizon. Adaptive policies based only on the common observed history preserve equality by induction. A common nonlinear map that depends only on ρ also cannot distinguish identical ρ; nonlinear branchwise maps can, because the ensemble itself then becomes extra state.

For example, the equal mixtures of {|0>,|1>} and {|+>,|−>} both yield I/2. Every common channel/readout agrees. Any claimed difference on this test signals a bug, estimator variance, branch access or additional model assumptions. Merely choosing a different unravelling of one master equation does not produce extra predictive information.

If a branch index b records physical intent/history, use the enlarged classical–projective state
\[
\Omega=\sum_b w_b|b\rangle\langle b|\otimes
|\psi_b\rangle\langle\psi_b|.
\]
Tracing out b returns ρ but loses accessible labels. Label-conditioned transitions can distinguish \(\Omega\) states with identical ρ. That is legitimate additional classical memory. Compare with particles carrying the identical b, trajectory history, age, mode and resampling budget. Label permutations accompanied by the corresponding model permutation must leave predictions unchanged.

## Projective metric, novelty and Stage 0 traps

Define the metric convention
\[
d_{\rm FS}([\psi],[\phi])=\arccos|\langle\psi|\phi\rangle|,
\qquad \|\psi\|=\|\phi\|=1.
\]
A ray [ψ] identifies all \(e^{i\theta}\psi\); the absolute overlap makes independent phase rotations irrelevant. The range is [0,π/2] in this convention. Other normalizations exist, so state this one explicitly [Q13 provides geometry background]. An equivalent phase-minimized Euclidean distance is \(\min_\theta\|\psi-e^{i\theta}\phi\|=\sqrt{2-2|\langle\psi|\phi\rangle|}\). Compare this alternative under equal architecture and optimization budget.

Phase invariance does not imply invariance to all ensemble decompositions. The equal two-state z-basis ensemble of I/2 has orthogonal branch pairs. An equal mixture of four states {|0>,|1>,|+>,|−>} also has I/2 but includes nonorthogonal cross-pairs. Pairwise geometric-diversity scores can therefore change under a pure decomposition change. Score predictions, physically defined branch labels and valid path costs; do not treat arbitrary ensemble spread as identifiable environmental uncertainty.

Minimum decisive tests before engineering:
1. QLC: exact diagonal/rotated readout calculations, basis-gauge invariance, classical scalar and real-PSD controls; then learned histories with no privileged labels.
2. PSC: correlated binary slot distributions with known exact marginals; χ=1 and increasing χ; compare nonnegative tensor train, graphical model, mixture and particles. Include nonlocal dependence patterns and slot-order permutations that challenge a chain.
3. PSC alarm: exact dense small-state ground truth; canonical-gauge perturbations; equal-compute capacity/fallback interventions; validate against generic uncertainty scores.
4. TEC: equal-ρ ensembles under a common instrument must agree within numerical tolerance; introduce a declared accessible intent/history label, then compare persistent classical particles; independently randomize phases and branch order.
5. For all: report parameter count, stored bytes, floating precision, state-update/rollout latency and planner samples separately. A constructed exact representation separation does not establish learnability, calibration or useful robot behavior.

