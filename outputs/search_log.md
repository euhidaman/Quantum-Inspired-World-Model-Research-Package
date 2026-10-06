# Search log

Review date/cutoff: 2026-10-06 (Asia/Taipei). Protocol recorded before scientific searches in `review_protocol.md`. Public skill-repository inspection preceded this file; it is not a literature search.

Exact query batches, opened source responses, counts of returned records where available, and inclusion decisions are preserved in `sources/` and `evidence/`. Web engines do not expose an exhaustive hit count: record `not reported`, never estimate it. Bibliographic API counts are distinguished from ranked web samples. Publisher/proceedings/arXiv reads establish only what was actually inspected.

Limits: searches are performed by one coordinated AI team, not two independent human reviewers. A bounded evidence review cannot establish absence of prior art. Final PRISMA-style counts cover the logged candidate set, not the entire literature.

## Consolidated completed-search index

Exact queries and per-query/batch count limitations: [search_queries.csv](search_queries.csv). The table contains 105 query-log rows, including a failed API attempt; it is not a count of papers.

| Workstream | Extraction and screening | Raw evidence |
|---|---|---|
| Quantum/tensors | 19 selected reports; query log, discovery and failures in evidence/quantum_* | sources/quantum_* |
| World models/tracking | 23 selected reports; 28 named candidates (23 included, 4 unverified, 1 wrong-topic excluded) in world_screening.json | sources/world_* |
| Robotics/platforms | 16 selected papers plus official documentation; returned discovery entries not a screened denominator | sources/robotics_* |
| Venues/skills | Official-page snapshots and documented unresolved policies; not scholarly study records | sources/root_venues_* and audit/ |

Curated evidence: 58 report families; 46 with relevant full-text sections inspected, 11 abstract/description scope, 1 metadata only. These are reports/families, not independently adjudicated empirical studies. No complete all-record exclusion denominator, exhaustive database export, or independent human double screening is claimed. DOI existence alone was never treated as technical support.

Known failures: shell sandbox network restrictions; focused arXiv API unavailable; some publisher PDF/metadata endpoints inaccessible; wrong click arguments repaired using browser reference IDs; IROS/current CVPR-author instructions/TPAMI unresolved. Source-specific failures are preserved in the domain logs and raw responses. No failed retrieval was silently converted to a verified claim.
