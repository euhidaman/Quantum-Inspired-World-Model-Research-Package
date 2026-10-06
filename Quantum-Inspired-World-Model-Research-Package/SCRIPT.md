# Presentation Script

## Opening

My project is about how a world model stores uncertainty about the world.

The main question is: if a robot cannot see everything that is happening, how should it remember the possibilities and use them to decide what to do next?

The website uses one simple room example. A service robot watches a technician push a cart. The technician and cart then move behind an opaque divider. While they are hidden, the robot does not know whether they will come out through the left exit or the right exit.

This represents a real robotics problem. The model has to remember which facts belong together: if the cart goes left, the technician should probably still be moving with it. The robot may also choose to wait, move closer, or inspect one side to get better evidence.

The room is only a teaching example. The latent state is not literally shaped like a room. It is the model's internal mathematical representation, which is decoded into predictions about the room.

## The current method: a compact world-model state

First, I show a common current approach as the baseline.

A world model takes observations from cameras or sensors and compresses them into an internal state. It also keeps memory of what happened before. Then it predicts how that state will change when the robot takes an action. Those predictions can be used for reward, value, control, or planning.

In the website, this is shown as one compact or factorized estimate. When the cart goes behind the divider, one prediction may become broad or settle toward a compromise route.

This does not mean that all modern world models are deterministic. Stochastic recurrent, mixture, and diffusion-style models can represent multiple futures. My point is narrower: the particular relationship needed later may not remain explicit or easy for the planner to use.

So the problem is not simply that the model needs a bigger vector. A wider classical vector could store more numbers. The question is whether a structured state can preserve useful alternatives, object relationships, and complete future possibilities in a way that improves prediction or planning.

## What “quantum-inspired” means

Before explaining the three alternatives, I want to clarify the word quantum-inspired.

I am not claiming that the room, the robot, or the hardware is quantum. I am not using qubits, a quantum computer, or quantum speed-up. Everything would run on ordinary computers using normal numerical linear algebra.

I am borrowing three mathematical ideas: density matrices for structured probability, purification and tensor networks for compressed relationships, and weighted ensembles of pure states for keeping complete alternatives separate.

Mathematical richness is not automatically an advantage. Each proposal has to improve prediction or action quality at comparable parameter, memory, computation, and latency budgets.

## Alternative 1: Quantum Latent Core, or QLC

The first proposal is the Quantum Latent Core.

In simple terms, instead of representing the belief as only one vector or one list of probabilities, I represent it as one density matrix.

The diagonal entries act like ordinary probabilities for possible states. The off-diagonal entries represent relationships between those alternatives. In the proposal, these are called coherence terms.

For the room example, the matrix can keep the left-exit and right-exit alternatives inside one joint belief. It does not have to immediately choose one route or reduce everything to a single average route. The transparent room states shown in the website are decoded possibilities. They are not two physical rooms or particles.

When evidence arrives, the matrix is updated using a valid probability-preserving operation. It must remain positive and its total probability must remain one. A readout then turns the matrix into a prediction, such as the probability that the cart appears at the left exit.

The possible advantage is that the planner can use relationships between alternatives when deciding which sensor action is useful.

But the off-diagonal values only matter if the learned dynamics and readouts actually use them. If they are ignored, they are just extra coordinates. Also, a classical vector with the same parameter budget may store a similar number of values. So QLC does not win simply because a density matrix has more mathematical degrees of freedom.

The geometry section does not draw QLC as a bigger sphere. It shows an illustrative spectrum and basis/coherence directions. For dimensions greater than two, the 3D image is only a projection of the constrained density-matrix space.

The QLC test would be to compare a full density matrix against a diagonal-only version and equally sized classical states. If the full matrix improves prediction or planning under the same budget, then the coherence structure may be useful. If not, it should not be treated as an advantage.

## Alternative 2: Purified Slot Core, or PSC

The second proposal is the Purified Slot Core.

This approach focuses on relationships between meaningful parts of the scene. Instead of treating the whole room as one dense matrix, I divide it into object and room slots.

The slots in the example include the room layout and divider, the technician's pose and intent, the cart's position and velocity, and door or sensor visibility.

Each slot has a local state, and tensor-network bonds connect selected slots. These bonds represent learned statistical dependence. They are not physical strings or forces in the room.

The idea is that evidence entering one part of the model can update related parts. For example, if a microphone hears the cart on the left, that evidence can update the cart slot, and then the learned bonds can pass information to the technician, the divider, the route, and the collision-risk prediction.

The main control in PSC is the bond dimension, written as chi. In normal English, chi is a capacity knob. With a small chi, the slots are close to independent. With a larger chi, the model can preserve richer cross-slot relationships. But a larger chi also costs more memory and computation, and compression can discard information.

PSC may help when object identity and object relationships are important. It can represent that the technician and cart move together, or that the divider explains why both are hidden.

PSC normally assumes a fixed set of slots, so changing the number of objects needs an empty slot or another mechanism. A finite chi may also remove exactly the dependency that matters for planning. The experiment would sweep chi at matched compute and measure when extra relationships justify their cost.

## Alternative 3: Trajectory Ensemble Core, or TEC

The third proposal is the Trajectory Ensemble Core.

TEC keeps several complete future trajectories explicitly instead of averaging them together too early.

In the room example, one branch could say the cart exits left, another says it exits right, and another says it stops behind the divider. Each branch contains an internally consistent story: the cart, the technician, the robot's observations, and what may happen after an action.

Each branch has a weight showing how believable it is. New evidence changes the weights without immediately destroying branch identity.

This can help with planning because an action may be safe in one future and unsafe in another. The robot can compare those consequences or choose an information-seeking inspection.

The website shows the branches as ribbons. Ribbon width represents belief weight, not physical size. The dashed line is an illustrative average. That average can pass between the real alternatives and lose their branch identity.

TEC has a particularly important limitation. Different sets of weighted pure-state branches can produce the same density matrix. If the dynamics and readout treat every branch identically, then the extra branch description may just be another way of writing the same belief.

Therefore, branch identity has to be operational through branch-conditioned dynamics or readouts. The decisive experiment is to construct two different ensembles with the same density matrix and check whether the same actions and observations produce different predictions. If not, the extra branch structure is not useful.

## How the three proposals differ

These are not three visual styles for the same model. They place structure in different parts of the latent state.

QLC puts structure inside one matrix. Its main idea is relationships between alternatives, including coherence.

PSC distributes structure across semantic room and object slots. Its main idea is controllable cross-object dependence through tensor-network bonds.

TEC keeps alternatives as separate complete futures. Its main idea is persistent branch identity for prediction and planning.

Their risks are different too. QLC may contain values that the network never uses. PSC may lose important information during compression, especially when chi is small. TEC may keep branch labels that are mathematically redundant unless the model gives them an operational role.

## What the website demonstrates

The first interactive section moves the timeline from visible, to hidden, to reappearing. I can add sensor evidence, choose a robot action, and change the prediction horizon.

Then I can switch between the four methods. The baseline shows one compact prediction. QLC shows linked alternatives in one joint belief. PSC shows the person, cart, and route staying connected through retained relationships. TEC shows separate complete branches whose weights change with evidence.

The second section is the latent-space geometry lab. It shows a learned region for the baseline, matrix directions for QLC, woven slot surfaces for PSC, and weighted future ribbons for TEC. These are 3D teaching projections, not literal shapes or benchmark evidence.

## Evaluation and conclusion

To test the proposal properly, all four approaches should use the same room sequences, encoder and decoder, and comparable parameter, memory, FLOP, and latency budgets.

I would measure multi-step prediction, calibration during occlusion, action regret, safety violations, and active-sensing value. I would also run diagonal versus full QLC, different chi values for PSC, and the same-density-matrix gauge test for TEC.

The classical baselines should include Dreamer-style recurrent world models, efficient latent-control models such as TD-MPC2, wider classical vectors, and mixture or factorized variants.

So my claim is not that quantum mathematics automatically creates intelligence. My claim is that it gives three structured and testable ways to represent uncertainty in a world model.

QLC asks whether matrix-valued beliefs preserve useful relationships between alternatives. PSC asks whether linked slots preserve important cross-object dependencies at a controllable cost. TEC asks whether explicit complete futures improve branch-aware planning when their identities are genuinely observable.

One approach may win, several may help in different situations, or none may beat a strong classical baseline. That is acceptable because the proposal is designed to be falsifiable.

The next step is to put all three cores behind one shared encoder and decoder and evaluate them on the same occluded-room benchmark. The success condition is simple: the extra structure must improve prediction or action quality enough to justify its additional computation.
