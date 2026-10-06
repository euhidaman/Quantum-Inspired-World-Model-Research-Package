# Research package — 2026-10-06

Start with [the executive summary](00_executive_summary.md) or [the integrated ten-part synthesis](17_final_synthesis.md). For the follow-up question about modifying an existing model, read the [pretrained adaptation review](18_pretrained_model_adaptation_review.md) and [experiment protocol](19_adaptation_experiment_protocol.md).

**Recommendation:** test PSC first; retain QLC as a baseline; defer TEC. This is a conditional research priority. No structured core has demonstrated a navigation advantage in this project.

**Adaptation update:** reuse pretrained weights where interfaces permit. Start a separate DINO-WM predictor-adapter pilot, with LoRA and orthogonal controls; test PSC belief augmentation separately. New UWM-JEPA, QSWM and FactorJEPA preprints narrow the original novelty boundaries. The supplement adds 21 curated research/software families and 29 claims, with overlap with the original database; these are not 21 additional unique papers. All experiments remain NOT RUN.

| Artifact | Purpose |
|---|---|
| [18 adaptation review](18_pretrained_model_adaptation_review.md) / [19 protocol](19_adaptation_experiment_protocol.md) | Pretrained reuse routes, recent overlapping work and separate adapter/belief experiments |
| [20 candidate matrix](20_pretrained_candidate_matrix.csv) / [21 claim ledger](21_adaptation_claim_ledger.csv) | Source access, checkpoint limitations, evidence and untested proposals |
| [Adaptation sources](sources/adaptation/references.bib) / [search log](sources/adaptation/search_log.json) / [validation](sources/adaptation/validation.json) | Focused supplement bibliography, exact retrievals and structural checks |
| [01 review](01_systematic_literature_review.md) | Thematic evidence, contradictions and coverage limitations |
| [02 paper database](02_paper_database.csv) / [references](references.bib) | 58 extracted paper/report families, with publication and access scope |
| [03 claim ledger](03_claim_evidence_ledger.csv) | Evidence, locations, inference/hypothesis boundaries |
| [04 novelty](04_novelty_map.md) / [05 mathematics](05_mathematical_formulation.md) | Prior-art boundaries and precise definitions |
| [06 hypotheses](06_hypothesis_registry.md) / [07 baselines](07_baseline_matrix.csv) | Falsifiable claims and fair classical controls |
| [08 Stage 0](08_stage0_falsification_protocols.md) | Exact fixtures, analytical targets, gates and stop rules |
| [09 robotics](09_robotics_experiment_program.md) / [10 statistics](10_statistical_analysis_plan.md) | Gated experiments and prospective analysis |
| [11 platforms](11_simulator_and_hardware_selection.md) / [12 venues](12_venue_strategy.md) | Dated official-source checks and explicit unknowns |
| [13 blueprints](13_paper_blueprints.md) / [14 risks](14_risk_register.md) | Conditional paper tracks and mitigations |
| [15 reproducibility](15_reproducibility_checklist.md) / [16 review](16_reviewer_attack_and_response.md) | Artifact status and hostile-review tests |
| [Search log](search_log.md) / [queries](search_queries.csv) / [protocol](review_protocol.md) | Methods and reproducible discovery limits |
| [Skill log](skill_usage_log.md) | Versions, licenses, dependencies, security and attribution |
| [Figures](figures/captions.md) | Six inspected conceptual figures, each PNG/SVG/PDF |

This is a bounded scoping evidence review, not a complete PRISMA-compliant systematic review. Of the 58 curated report families, 46 have relevant full-text sections inspected, 11 have abstract/description scope, and one is metadata-only. Detailed claims are restricted accordingly. The local protocol is not a public registry submission. All empirical gates are NOT RUN.

`evidence/` contains specialist extractions, audits, screening and source-status notes. `sources/` preserves tool retrieval outputs, including failures; these may contain provider-specific citation markers and are not manuscript text. `audit/` contains the prompt, skill snapshots, initial protocol hash, software versions, command log and file hashes. A few terminal displays had Windows encoding errors; delivered prose/CSV/BibTeX is UTF-8 (CSV with BOM).

To rebuild tables and figures from the supplied evidence, use the pinned packages in `audit/python_packages.txt` and run `python outputs/scripts/assemble_artifacts.py` from the parent workspace. The source script is provided for inspection and has no network/model-training calls. Its structural validation does not certify every scientific interpretation. The virtual environment is outside outputs and is not included in the portable archive.

Scientific Agent Skills is credited in [references.bib](references.bib) and the skill log. Human investigators should review the source evidence and experimental assumptions before public registration, implementation or manuscript submission.

To rebuild the adaptation tables and bibliography, run `python outputs/scripts/assemble_adaptation_supplement.py`. Its [separate skill log](sources/adaptation/skill_log.md) records the web fallback and review limits. Run `python outputs/scripts/finalize_package.py` afterward to refresh the combined archive and file hashes.
