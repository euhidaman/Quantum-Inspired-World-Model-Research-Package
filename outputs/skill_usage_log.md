# Skill audit and use log

Execution date: 2026-10-06, Asia/Taipei. Upstream: https://github.com/K-Dense-AI/scientific-agent-skills ; observed main commit `92ace75ac21efe19a620434e0ca4e356081fe807`. Downloaded main snapshots and commit response are in `audit/`; no upstream executable has been run.

Before literature work, inspected current README, SECURITY, the complete literature-review and experimental-design SKILL.md files, and their workflow/reference documentation. Current repository uses `skills/<name>/SKILL.md`. Local installed copies were also read. The README/security policy warn that skills may execute arbitrary code and that scanner findings are not a security guarantee.

| Skill | metadata.version | License | Applied procedure | Dependencies/services/scripts and decision |
|---|---|---|---|---|
| literature-review | 1.11 | MIT license (frontmatter) | Protocol, eligibility, provenance, thematic synthesis, limitations | Python 3.10+/requests for optional checks; Parallel search requires authentication; OpenRouter image generation would transmit prompts and may cost money; Pandoc/XeLaTeX for optional PDF. None installed. Bundled verify_citations.py/search_databases.py/generate_pdf.py/generate_schematic.py NOT executed. Public web and bibliographic source inspection used instead. |
| experimental-design | 1.5 | MIT license (frontmatter) | Units, blocking, randomization, factorial contrasts | Python >=3.12, NumPy/pandas/pydoe 1.5.0 for optional layout generation. No dependency installation or bundled randomization.py/doe_designs.py execution. This is a prospective protocol, not collected trial data. |

Commands: PowerShell Get-Content/rg/Get-ChildItem for read-only inspection; Invoke-WebRequest for public documentation snapshots; Python --version returned 3.14.6. Initial sandbox network reads failed with “Unable to connect to the remote server”; authorized read-only elevated download succeeded. No credential files accessed. No API keys sent. No paid services used. No third-party code installation.

Outputs: this log, search protocol, evidence ledgers, experimental plan. All later scripts are locally authored artifact assembly/validation only, inspected before execution. File hashes and environment are recorded at final audit. This is procedural assistance, not independent scientific peer review.

The skill-requested software-paper citation will be verified before inclusion; an unverified suggested citation will not be treated as evidence.

## Additional applied skills and final software scope

The complete current `skills/statistical-power/SKILL.md` (version 1.3, MIT license) and `skills/scientific-visualization/SKILL.md` (version 1.4, MIT) were fetched at the recorded commit and read before application. Their simulation-based-power and publication-guidelines references were also read/cached. Power guidance informed the prospective crossed-design simulation plan and the explicitly illustrative independent-binomial sensitivity calculation. Visualization guidance informed truthful conceptual figures, labels, source-data separation and visual inspection.

Power skill dependencies: Python >=3.12, statsmodels/SciPy/NumPy/pandas/Matplotlib; optional pingouin/lifelines. Its bundled power.py and simulate_power.py were NOT executed and these optional packages were not installed. No final study power has been claimed. Standard-library NormalDist/math performs only the displayed planning approximation.

Visualization skill dependencies: Python >=3.11; optional Matplotlib/Pillow/pypdf/Plotly/Kaleido by export type. Bundled CLIs were NOT executed. To create actual inspectable PNG/SVG/PDF diagrams, installed Matplotlib and transitive dependencies in project-local `.research_build` using `python -m venv .research_build` and `.research_build/Scripts/python.exe -m pip install matplotlib`. Resolved version 3.11.2; all installed versions saved in `audit/python_packages.txt`. PyPI package installation was authorized for this requested artifact work; it changes only the isolated environment. No credentials or paid image-generation service used.

Locally authored `scripts/assemble_artifacts.py` was inspected before execution; it reads selected evidence JSON and writes CSV/BibTeX, planning calculations, figures and validation/hashes inside outputs. It has no network calls, shell execution or robot/model training. Matplotlib's first invocation could not write its default user cache and used an allowed temporary cache; the script was then configured to use `outputs/audit/matplotlib_cache`.

Verified workflow attribution: Timothy Kassis, Vinayak Agarwal, Yuhuan He, Darshil Patel and Aubrey M. Brueckner (2026), *Scientific Agent Skills: A Library of Procedural Knowledge for Research Agents*, arXiv:2609.00065, DOI 10.48550/arXiv.2609.00065. Opened the primary arXiv record; included in references.bib as software-workflow attribution, not evidence for a model advantage. Suggested `LICENSE` path returned 404; README points to `LICENSE.md`, and the applied skills' license metadata is recorded separately.

Final locally authored `scripts/finalize_package.py` was read before execution. It validates relative links, UTF-8, bibliography URL/ID integrity, records the completed visual review, computes SHA-256 hashes and writes/tests a ZIP using Python's standard library. It has no network operations. The archive is excluded from its own contents; the script is included. No third-party skill executables were run.
