"""Assemble and validate research documents; no network, models or training."""
from pathlib import Path
import csv
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1]
sources = root / 'sources' / 'adaptation'
records = json.loads((sources / 'evidence_records.json').read_text(encoding='utf-8'))['families']
claims = json.loads((sources / 'claims.json').read_text(encoding='utf-8'))
search_log = json.loads((sources / 'search_log.json').read_text(encoding='utf-8'))
by_id = {r['id']: r for r in records}
assert len(by_id) == len(records) == 21
assert len({c['id'] for c in claims}) == len(claims) == 29
for claim in claims:
    ids = [x for x in claim['source_ids'].split(';') if x]
    assert set(ids) <= by_id.keys(), claim
    claim['primary_urls'] = ';'.join(by_id[x]['url'] for x in ids)
    assert claim['kind'] != 'SOURCE' or ids, claim

for filename, rows in [('20_pretrained_candidate_matrix.csv', records), ('21_adaptation_claim_ledger.csv', claims)]:
    with (root / filename).open('w', encoding='utf-8-sig', newline='') as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)

bib = []
for record in records:
    bib.append('@misc{' + record['id'] + ',\n'
        + '  title = {{' + record['title'] + '}},\n'
        + '  author = {' + record['authors'] + '},\n'
        + '  year = {' + str(record['year']) + '},\n'
        + '  howpublished = {' + record['status'] + '},\n'
        + '  url = {' + record['url'] + '},\n'
        + '  note = {Inspected 2026-10-06. Access: ' + record['access_scope'] + '.}\n}\n')
bib.append('''@misc{SAS2026,
  title = {Scientific Agent Skills: A Library of Procedural Knowledge for Research Agents},
  author = {Kassis, Timothy and Agarwal, Vinayak and He, Yuhuan and Patel, Darshil and Brueckner, Aubrey M.},
  year = {2026},
  howpublished = {arXiv preprint},
  doi = {10.48550/arXiv.2609.00065},
  url = {https://arxiv.org/abs/2609.00065},
  note = {Workflow attribution; current metadata checked 2026-10-06}
}
''')
(sources / 'references.bib').write_text('\n'.join(bib), encoding='utf-8')

errors = []
for path in list(root.glob('*.md')) + list(sources.glob('*.md')):
    content = path.read_text(encoding='utf-8-sig')
    if '\ufffd' in content:
        errors.append('Replacement character: ' + path.name)
    for target in re.findall(r'\]\(([^)]+)\)', content):
        if not target.startswith(('http:', 'https:', '#')):
            resolved = (path.parent / target.split('#')[0]).resolve()
            # This script writes its own validation artifact after these checks.
            if not resolved.exists() and resolved != (sources / 'validation.json').resolve():
                errors.append('Broken link: ' + path.name + ' -> ' + target)
assert not errors, errors
assert len(search_log['retrieval_batches']) == search_log['retrieval_batch_count']
assert search_log['search_query_count'] == 26
for record in records:
    assert record['url'].startswith('https://'), record

files = [root / name for name in ['18_pretrained_model_adaptation_review.md',
    '19_adaptation_experiment_protocol.md', '20_pretrained_candidate_matrix.csv',
    '21_adaptation_claim_ledger.csv', 'adaptation_review_protocol.json']]
files += [p for p in sources.iterdir() if p.is_file() and p.name != 'validation.json']
files += [Path(__file__).resolve()]
qa = {'date': '2026-10-06', 'research_software_families': len(records),
      'workflow_attributions': 1, 'claims': len(claims),
      'retrieval_batches': search_log['retrieval_batch_count'],
      'search_queries': search_log['search_query_count'],
      'id_url_utf8_relative_link_checks': 'PASS',
      'model_experiments': 'NOT RUN', 'independent_review': False,
      'limitations': 'Structural artifact checks only; not scientific replication or exhaustive citation validation.',
      'sha256': {p.relative_to(root).as_posix(): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}}
(sources / 'validation.json').write_text(json.dumps(qa, indent=2) + '\n', encoding='utf-8')
print(json.dumps({k: v for k, v in qa.items() if k != 'sha256'}, indent=2))
