# Mathematical formulation and boundaries

Status: prospective specification, 2026-10-06. No model training or navigation benchmark has been executed. `[INFERENCE]` denotes derivations below; source-supported foundations are indexed in the claim ledger and quantum evidence report. Every object is classically stored and computed.

## 1. Controlled partially observed scene

\[s_t=(x_t^R,m,\{(x_{j,t},i_{j,t})\}_{j=1}^{N_t}),\quad s_{t+1}\sim p_\star(s'\mid s_t,a_t),\quad o_t\sim p_\star(o\mid s_t).\]
Here time is t, x^R is robot pose/velocity, m is the static map, N is obstacle count, x_j is obstacle physical state, i_j is hidden intent, a is control, and o is a sensor observation; p_star is the unknown environment process. This separates physical states from hidden behavioral modes. The Markov assumption applies to the augmented scene, not necessarily to raw images. Test it with increasing history length and policy-shift holdouts.

\[b_t(s)=p(s_t=s\mid o_{0:t},a_{0:t-1}),\quad b_{t+1}(s')\propto p(o_{t+1}\mid s')\int p(s'\mid s,a_t)b_t(s)\,ds.\]
The belief b is a posterior over scenes; the update predicts then corrects using the observation. The integral includes sums over discrete intentions and cardinalities. Learned latents approximate this operation; none is automatically a calibrated Bayesian posterior. Stage 0 uses a known generative process so filtering errors have an exact reference.

\[q_\theta(\tau_{1:N}\mid o_{0:t},a_{0:t+H-1})\]
is the model's joint distribution of all obstacle trajectories tau over H future steps, conditional on observations and candidate robot controls; theta denotes learned parameters. Robot-conditioned prediction is required when agents react to the robot. Open-loop predictors instead assume a prescribed ego plan or negligible reaction. Evaluate both assumptions separately.

“Infinite possibilities” means continuous support, multimodal mass, correlated joint trajectories, or increasing resolution-dependent effective hypothesis count. It does not mean unlimited model capacity. Report horizon, N, mode labels in synthetic tasks, occupancy coverage, and discretization scale. An effective number such as exp(entropy) is meaningful only with a declared discrete partition; differential entropy alone is coordinate-dependent.

## 2. QLC

\[\rho=AA^\dagger/\operatorname{Tr}(AA^\dagger),\quad A\in\mathbb C^{d\times r},\quad A\ne0.\]
A is a complex factor, dagger is conjugate transpose, d is latent dimension, and r caps rank. The normalized product is positive semidefinite (PSD), Hermitian and trace one. It stores uncertainty in a matrix; it does not store physical qubits. Rescale a nonzero factor before normalization for numerical stability; reset a zero factor to a declared rank-compatible factor, such as a fixed unit vector in its first column and zeros elsewhere, and log it. Resetting to I_d/d would require full rank and is incompatible with r<d unless the rank budget is explicitly expanded. Simply flooring the denominator can violate unit trace. Validate eigenvalues, trace and conditioning in float64 before lower precision.

\[p(y\mid\rho)=\operatorname{Tr}(\rho M_y),\quad M_y\succeq0,\quad\sum_yM_y=I_d.\]
y is a discrete observation category, M_y is its positive measurement operator, and I_d is identity. These conditions make the probabilities nonnegative and sum to one. Continuous outcomes require an operator-valued density integrated against a specified base measure. An arbitrary neural decoder may be useful but is no longer necessarily a Born-rule model. Use a fixed readout first so identifiability is testable.

\[\rho^-_{t+1}=\sum_kK_k(a_t,h_t)\rho_tK_k^\dagger(a_t,h_t),\quad\sum_k K_k^\dagger K_k=I_d.\]
Each K_k is a Kraus operator; h_t is optional recorded context, and the minus marks the prediction before seeing the next observation. The constraint defines a completely positive trace-preserving (CPTP) map. Holding a,h fixed makes it linear in rho. If h depends on rho or hidden history, the overall closed update may be nonlinear or contain extra memory; count that state and capacity in all controls. A stacked isometry from QR can enforce the constraint, but rank collapse and differentiation must be tested.

\[\rho_{t+1}=\mathcal I_{o_{t+1},a_t}(\rho^-_{t+1})/\operatorname{Tr}\mathcal I_{o_{t+1},a_t}(\rho^-_{t+1}).\]
The observation instrument I is a completely positive, trace-nonincreasing map whose sum over observations is trace preserving. Its trace is an observation likelihood. Conditioning is normalized and nonlinear; this does not contradict linear unnormalized instrument evolution. An independent observation encoder overwrite is a different inference rule and must be ablated.

\[\dot\rho=-i[H_0,\rho]+\sum_k\gamma_k\left(L_k\rho L_k^\dagger-\tfrac12\{L_k^\dagger L_k,\rho\}\right).\]
H_0 is Hermitian, L_k are jump operators, gamma_k are nonnegative rates, i is the imaginary unit, and brackets/braces are commutator/anticommutator. Under the finite-dimensional linear time-homogeneous Markov semigroup assumptions, this is the GKSL generator form. It is optional: a discrete channel is the simpler starting point. State-dependent neural operators do not inherit that theorem automatically; the theorem characterizes generators, not a uniquely correct robot dynamics model.

`[INFERENCE]` A full-rank complex density matrix has d²−1 real degrees of freedom; the exact-rank-r manifold (1≤r≤d) has 2dr−r²−1, while storing A uses 2dr real scalars before removing gauge. A categorical d-vector has d−1. These are coordinate/storage statements, not general expressiveness or sample-efficiency rankings. Use total learned weights, context, decoder and optimizer states in accounting.

`[INFERENCE]` With diagonal readouts and transitions that never convert coherence into populations, changing off-diagonals cannot change observations. Merely calling a transition “commuting” is insufficient: specify the shared basis and the preservation property. Stage 0A directly tests operational effects. Simultaneous unitary changes of state, dynamics and readout preserve all predictions, so raw coherence magnitude is basis-dependent.

## 3. PSC: explicitly choose an open chain purification

\[X_{\mathbf i,\boldsymbol\alpha}=\sum_{b_1\ldots b_{L-1}}\prod_{\ell=1}^L A^{[\ell]}_{b_{\ell-1},i_\ell,\alpha_\ell,b_\ell},\quad\rho=XX^\dagger/\|X\|_F^2.\]
L is maximum slots, i_l has d local physical values, alpha_l has kappa purification values, b_l is a bond index of size at most chi, b_0=b_L=1, and A^[l] is a local tensor. Bold indices collect all slots; Frobenius norm normalizes X. This is a chain locally purified density operator (LPDO), with at most O(L d kappa chi²) stored complex entries. The d^L basis size is not freely parameterized at small chi. Contraction and differentiation costs must be measured separately from storage.

Use one local value for “absent”, separate visibility from existence, and couple a continuous pose distribution to each discrete intention/existence state. An absent value handles up to L objects only; overflow requires an explicit fallback or unknown-object occupancy. Changes in slot identity require association variables, not a silently perfect object oracle. Start with fixed identities and add permutations, births/exits, split/merge and re-binding later.

\[I(A:B)_\rho\le 2\log\chi.\]
Here A and B are the two physical sides of one chain cut, I is quantum mutual information, and log is natural logarithm (nats). `[INFERENCE: proof]` Normalize X as a pure state on physical plus local auxiliary systems AA'BB'. Its Schmidt rank across that one cut is at most chi, so its pure-state mutual information is twice the entropy of AA', at most 2 log chi. Partial traces over A',B' are local channels; data processing cannot increase mutual information. Local decoded classical outcomes obey the same upper bound. This is not an area law for physical scenes. Across several cut bonds replace log chi by the sum of their logarithms; a loopy graph or different purification placement requires a new argument. A joint nonlocal decoder can inject dependence outside this bound and must be counted as a separate correlated baseline.

\[\rho'\approx\operatorname{normalize}\!\left[\mathcal T_\chi(X')\mathcal T_\chi(X')^\dagger\right].\]
X' is an enlarged purification after local/pairwise channel application; T_chi truncates the purification, not an unconstrained density matrix. This preserves PSD by construction but need not preserve the exact channel or filtering distribution. Keep purification-index truncation separate from bond truncation. Record normalization drift and per-cut discarded singular weight in the chosen canonical gauge. General local weights or BP residuals are not certified global trace-distance bounds. Rare dangerous mass can be small in a norm and large in decision cost.

On a chain/tree, exact sum-product contraction with valid nonnegative classical factors is exact; quantum/complex double-layer networks require their actual contraction rules. Loopy BP and BP gauging are approximate and may fail to converge. Never interpret arbitrary complex “messages” as normalized sensor likelihoods. Compare dense contraction on tiny cases, chain contractions, then damped loopy methods with residual and fallback logs.

## 4. TEC

\[\mu=\sum_{m=1}^{M}w_m\delta_{[\psi_m]},\quad\rho(\mu)=\sum_mw_m\psi_m\psi_m^\dagger.\]
M is branch count, w_m are nonnegative classical weights summing to one, delta is a point mass, and [psi] is the ray of a unit complex d-vector after identifying all global phases. Its state space is complex projective space CP^(d−1), not a literal three-dimensional sphere. The density operator is the average rank-one projector (not the vector first moment). Store trajectory/intent labels separately if used; count their bytes and prediction capacity.

\[\psi'_m=F_\theta(\psi_m,a,h,\mu)/\|F_\theta(\psi_m,a,h,\mu)\|,\quad w'_m\propto w_m p(o'\mid\psi'_m).\]
F is a proposed learned branch update; all symbols otherwise follow earlier definitions. A valid ray model must be equivariant to global phase, and all predictions phase-invariant. Permuting branches and weights together must leave the represented measure unchanged. Zero norm, zero likelihood, resampling and genealogy loss need declared handling. Branch-dependent nonlinear dynamics deliberately leave the ordinary common-channel model.

\[p(y\mid\mu,a)=\sum_m w_m\operatorname{Tr}\!\left[M_y\mathcal E_a(\psi_m\psi_m^\dagger)\right]=\operatorname{Tr}\!\left[M_y\mathcal E_a(\rho(\mu))\right].\]
E_a is the same linear channel for every branch. `[INFERENCE]` Linearity proves equality for any equal-rho ensembles. Composing common unnormalized instruments extends it to complete observation histories and adaptive policies based on those histories. Different unravelings alone cannot identify a classical hidden future. Thus same-rho divergence requires a decoder/dynamics/state beyond this model, and still needs environmental evidence of correctness. Compare against ordinary weighted particles carrying identical extra information.

\[d_{FS}([\psi],[\phi])=\arccos |\langle\psi,\phi\rangle|.\]
This defines the Fubini–Study distance convention used here for unit rays; phi is a second branch. It is invariant to global phase, but it does not guarantee distinguishable sensor observations, calibrated probability, or safer actions. Test task utility against decoded trajectory distance and expected observation information gain. Do not call branch separation “information gain” without an observation model.

## 5. Risk and information objectives

\[a^*=\arg\min_a\ \mathbb E_q[C(\tau,a)]+\lambda\operatorname{CVaR}_\alpha(C),\quad \operatorname{CVaR}_\alpha(C)=\min_\eta\left[\eta+\frac{\mathbb E_q[(C-\eta)_+]}{1-\alpha}\right].\]
C is a prespecified task/collision loss, lambda is a nonnegative tradeoff, alpha in (0,1) selects the upper cost tail, eta is a threshold, and positive-part means max(0,x). Expectation uses the model's weighted JOINT futures. For TEC use w_m rather than treating branches equally. For PSC sample/constrain joint outcomes rather than multiplying marginal occupancy probabilities. Additive expectation plus CVaR double-weights some cost intentionally; separately test a constraint formulation. Binary collision CVaR can saturate when collision probability exceeds the tail fraction, so use it cautiously.

\[P_q(\text{any collision during }1{:}H\mid a)\le\delta.\]
delta is the tolerated model-predicted horizon risk. This concerns a union over agents and time, not a per-step probability. Per-agent/per-step risk budgets require a justified union bound or joint calculation. Calibration error, model shift, finite samples and actuator delay prevent treating it as a real-world guarantee. Validate collision-event probabilities on held-out episodes and log realized constraint violations.

\[J_{info}(a)=J(a)-\beta I(Z;O_{t+1:t+H}\mid a,o_{0:t}).\]
Z is a persistent hypothesized intention/scene label, O is a future observation sequence, I is mutual information, and beta weights task-relevant information. The same observation likelihood and label content must be supplied to classical particle/belief-space baselines. A robot that can peek around an occluder is an appropriate test; a task where sensing cannot change later actions is a negative control.

Start with expected-cost sampled MPC, add calibrated chance constraints, then CVaR as one prespecified planner interaction. Worst credible branch requires a calibrated credible set; otherwise an arbitrarily unlikely branch stops the robot. Distributionally robust objectives require a justified ambiguity set and held-out radius calibration; defer unless ordinary model calibration fails in a diagnosed way.

For a Bernoulli collision loss with probability p and upper-tail fraction q=1−alpha, CVaR equals min(1,p/q) [INFERENCE from the definition]. It is monotone in p until saturation and may not change action ordering from expected collision probability. A distinct severity-sensitive claim therefore needs a prespecified nonbinary loss and matching calibration, not merely a new name for binary risk.
