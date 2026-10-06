# Robotics search and screening audit

Date: 2026-10-06 (Asia/Taipei client date). Search mechanism: ranked public-web discovery through web.run; primary pages/author manuscripts/proceedings opened before extraction. No dedicated scholarly API was called by this subtask. Raw tool response text is cached under outputs/sources/robotics_*.json. The response caches are retrieval records, not redistributed source PDFs.

Seven search batches contained 27 exact query strings. Batch-returned entries were 28,28,23,24,19,40,22 respectively (sum 184). These are displayed results, not database population sizes, unique reports or screened studies. Query-level counts are unavailable for batched web searches. The exact strings, retrieval date and batch counts are in robotics_search_log.json, generated from caches by the inspected local script robotics_summarize_search.py with command: python outputs/evidence/robotics_summarize_search.py. No third-party scripts or dependencies were installed or executed.

## Selection and decisions

Sixteen candidate studies were selected for focused extraction (R01–R16). All 16 have opened primary-source content; scope ranges from abstract/author metadata to inspected full method sections. The JSON verification field identifies scope. Preprint/journal versions were merged as one study. Ten foundational studies predate 2021 and were included for planner assumptions/prior art, consistent with protocol. This domain search is purposive/scoping coverage, not exhaustive independent double screening. The unselected displayed entries were not all assessed in full text; do not put 184 directly into a fully screened PRISMA denominator.

| Candidate | Decision | Basis |
|---|---|---|
| DWA, VO, ORCA, SIPP, RRT*, TEB, IT-MPC, chance constraints, POMCP, belief iLQG | INCLUDE/BACKGROUND | Foundational planner/uncertainty controls; no obsolete performance ranking |
| RA-MPPI, DR-CVaR | INCLUDE | Risk-aware shared-planner prior art; retrieved preprint status explicit |
| SocNavBench, SocNavGym, Arena5, HuNavSim | INCLUDE | External/reactive benchmark and implementation candidates |
| BARN2022/2024 reports | NOT_RETRIEVED for extraction | Discovered; full primary text not opened. Static-clutter navigation only in this review's provisional classification; no paper claim made |
| Safe Interval Path Planning With Kinodynamic Constraints2023 | NOT_RETRIEVED | Discovered; full primary source not opened; useful citation-chain follow-up if selected robot requires it |
| SIPP on Lattices2026 | UNVERIFIED/NOT_RETRIEVED | Search returned recent preprint; not opened, not cited as evidence |
| Arena-Bench2.0 2025 | UNVERIFIED/NOT_RETRIEVED | Secondary metadata discovered; official paper not opened; no substantive claim made |
| 2025 social-navigation review | BACKGROUND_DISCOVERY_ONLY | Search discovered a review; primary benchmark papers preferred, review not cited as experimental evidence |
| Wikipedia, Reddit, research aggregators, synthetic summaries | EXCLUDE_FROM_EVIDENCE | Discovery output only; no final scientific claim rests on them |

Use 10 foundational and 6 newer selected studies in aggregation.

## Recovery and failure log

- ORCA linked chapter PDF failed; author project description/publication metadata and current official RVO2 code were opened. Do not cite chapter-specific experimental numbers from the aggregated project page.
- TEB ScienceDirect and DOI endpoints returned internal errors. Publisher-formatted full PDF from a mirror and official author code citation recovered method and metadata.
- Blackmore chance-constrained PDF endpoint failed. MIT repository metadata/abstract recovered; detailed theorem analysis remains absent.
- RA-MPPI NSF PDF endpoint failed; IEEE page yielded no usable metadata. Full arXiv HTML recovered. ICRA2023 publication is discovered but deliberately not treated as independently verified.
- SocNavBench ACM DOI endpoint returned 403. Author arXiv acceptance statement and full manuscript recovered.2022 journal issue metadata remains unverified here; use retrieved 2021 accepted-manuscript record.
- Arena5 RSS PDF timed out on two retries. Official RSS page/BibTeX opened. Its author list differs from indexed PDF header and author project site; official metadata retained with discrepancy.
- Invalid DR-CVaR HTML v3 returned error; actual arXiv record lists v1, which was then opened successfully.
- CoppeliaRobotics main licensing URL failed; official manual licensing page recovered.
- Old Nav2 MPPI URL returned 404; followed the live Jazzy setup-page link to current MPPI docs.
- RRT* SAGE endpoint failed; MIT primary repository includes title/authors/date/venue/DOI and abstract, all inspected.
- No performance claims rely on inaccessible content. UNKNOWN license/hardware/status fields were retained.

## Current-source contradictions

RVO2's old project page states restricted research/nonprofit availability, whereas current official code README gives Apache2. Use the license of the exact pinned code revision, not historical prose.

CARLA's package quickstart describes UE4/0.9.15 and8GB-class VRAM recommendation; current default repository describes UE5 development and16GB+ VRAM recommendation. These refer to different tracks; no blended minimum is defensible.

HuNavSim manuscript wrapper and repository support do not establish Jazzy/Harmonic compatibility. Arena5's Isaac Gym integration does not establish current Isaac Sim/Lab compatibility.

Isaac Lab default branch warns it is in development. Habitat-Sim explicitly warns of absent official Meta-team maintenance beyond0.3.4. Both are reasons to pin and validate, not grounds for claiming the engines unusable.

