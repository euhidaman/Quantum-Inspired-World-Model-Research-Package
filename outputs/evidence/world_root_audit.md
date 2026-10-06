# Audit of root statistical/Stage 0 plans

Audit date: 2026-10-06. Read-only review of reports 05, 08 and 10; no root files edited. This is a methods audit, not proof or experimental reproduction.

## Resolved in the inspected current version

- Stage 0B now requires total variation/mode recovery alongside forbidden mass. This prevents a predictor collapsing onto a single valid mode from passing solely by placing no mass on impossible states.
- The energy-score formula is labeled as the exact weighted empirical score (V-statistic), with iid U-statistic conditions separated. Weighted/resampled particle dependence is explicitly acknowledged.
- Calibration is assessed first on shared frozen histories/actions; on-policy results are separated.
- Hierarchical analysis preserves trained-model and map/scenario clustering, without inventing cross-architecture training-seed pairing.
- Small fixtures and same-density equivalence are labeled analytic project derivations, not source experiments. Exact-enumeration tolerances are distinguished from Monte Carlo variability.

## Additional evidence now available

- W21/WC28–WC29 support a concrete tractable-flow comparator while documenting its individual-agent scope and noise/manifold caveats. A joint-flow extension is a derived baseline, not an already verified FloMo capability.
- W22/WC30 support occupancy-flow disocclusion/ID comparisons. The source is RA-L 2022, not CVPR.
- W23/WC31 support query-budget occupancy comparisons and explicitly do not establish downstream planning improvements.
- WC32 is an analytic inference about marginal occupancy outputs, not a source-reported theorem that all occupancy-based systems lack correlations.

## Aggregate audit after assembly

The assembled extraction contains 58 paper records, 89 claims and 59 bibliography entries (58 paper families plus the separately scoped workflow-attribution record). All 23 world records match the aggregate CSV fields exactly. Required fields are present; primary URLs are syntactically valid and unique; each paper ID has a BibTeX entry; source-ID and URL-list lengths match. The inspected UTF-8 files contain no Unicode replacement characters. This is structural/linkage validation, not a fresh HTTP probe of every URL or independent verification of every other domain's metadata.

The aggregate schema preserves the requested method, evaluation, limitation, code/license and verification fields. Preprints and accepted manuscripts retain qualified statuses; unknown DOIs are omitted from bibliography DOI fields. Full/limited/metadata scope counts add to 58 (46/11/1), and the review explicitly disclaims exhaustive discovery, independent human screening and study-level completeness.

Concrete corrections sent to the coordinator:

1. The bibliography generator applies prose TeX escaping to URL fields. Twelve URL values contain backslashes before underscores or percent signs. Preserve literal URL/DOI values separately from prose escaping so bibliography importers can round-trip identifiers, notably W15 and R06_TEB.
2. Report 01 should explicitly name W21 (individual-agent flow) and W22–W23 (occupancy flow), replacing the stale generic sentence that these are included where independently retrieved. Narrow its remaining flow-coverage limitation to scene-joint/recent comparisons.
3. The FloMo baseline row should state its individual-agent conditioning; a joint scene-flow extension remains a proposed derived baseline.

All entries currently use BibTeX `misc` with publication metadata in `howpublished`. This preserves qualification but is a conservative archival format, not journal-style bibliographic normalization. No stronger publication status or author-name expansion should be inferred merely to change entry types.
