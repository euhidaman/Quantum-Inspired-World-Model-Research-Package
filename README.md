# Quantum-Inspired World Model Research Package

Research and prospective experiments on Quantum Latent Cores (QLC), Purified Slot Cores (PSC), Trajectory Ensemble Cores (TEC), and quantum-inspired adaptation of pretrained world models.

**Current status:** research documentation, evidence tables, mathematical definitions, experiment protocols, figures and educational materials. Model implementations, training entry points and Slurm job scripts have not yet been built. No experimental advantage has been demonstrated by this project.

## Start here

- [Research package index](outputs/README.md)
- [Mathematical formulation](outputs/05_mathematical_formulation.md)
- [QLC, PSC and TEC correctness/falsification tests](outputs/08_stage0_falsification_protocols.md)
- [Robotics experiment program](outputs/09_robotics_experiment_program.md)
- [Pretrained-model adaptation review](outputs/18_pretrained_model_adaptation_review.md)
- [Adaptation experiment protocol](outputs/19_adaptation_experiment_protocol.md)
- [Presentation and interactive teaching materials](Quantum-Inspired-World-Model-Research-Package/README.md)

The review is a bounded scoping exercise. Evidence limitations, preprint status and untested hypotheses are recorded in the linked documents. All quantum-inspired mathematics proposed here can be computed classically.

## Use the repository on Fir

From an authenticated Fir session, move to your chosen project-code directory, then clone:

```bash
git clone https://github.com/euhidaman/Quantum-Inspired-World-Model-Research-Package.git
cd Quantum-Inspired-World-Model-Research-Package
```

A private repository requires GitHub authentication configured on the cluster. Later, update a clean checkout using:

```bash
git pull --ff-only
```

Use separate storage for datasets, model checkpoints and run artifacts. Pin the Git commit in each experiment record. Research and code development can happen on the laptop; training and evaluation should run through Slurm on allocated compute nodes. The next implementation milestone is the small mathematical correctness suite, followed by checkpoint reproduction and a resource profile before larger sweeps.

## Repository contents

- `outputs/`: original research, adaptation supplement, provenance and document-generation scripts.
- `Quantum-Inspired-World-Model-Research-Package/`: existing presentation and educational website.
- `.gitignore`: excludes local assistant installations, virtual environments, credentials and future training artifacts.
- `.gitattributes`: keeps source and future shell/job scripts compatible with Linux line endings and preserves the recorded research-artifact bytes.

The scripts in `outputs/scripts/` assemble and validate research artifacts; they do not train models. Their usage and dependencies are documented in the research index. Local `.agents/` and `.claude/` skill installations are not required to read this repository; skill provenance and attribution are retained in the research outputs.
