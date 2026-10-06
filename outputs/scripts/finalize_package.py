"""Validate local artifacts and write a portable zip; no network or science runs."""
from pathlib import Path
import csv
import hashlib
import json
import re
import zipfile

root = Path(__file__).resolve().parents[1]
archive = root / 'research_package.zip'
errors = []
for p in list(root.glob('*.md')) + list((root/'evidence').glob('*.md')):
    text = p.read_text(encoding='utf-8-sig')
    if '\ufffd' in text:
        errors.append(f'Replacement character: {p.name}')
    for target in re.findall(r'\]\(([^)]+)\)', text):
        if not target.startswith(('http:','https:','#')) and not (p.parent/target.split('#')[0]).exists():
            errors.append(f'Broken relative link: {p.name} -> {target}')
bib = (root/'references.bib').read_text(encoding='utf-8')
for url in re.findall(r'url = \{([^}]*)\}', bib):
    if '\\' in url:
        errors.append(f'Escaped bibliography URL: {url}')
papers = list(csv.DictReader((root/'02_paper_database.csv').open(encoding='utf-8-sig',newline='')))
keys = set(re.findall(r'@\w+\{([^,]+),',bib))
if not {p['id'] for p in papers} <= keys:
    errors.append('Missing bibliography paper ID')
assert not errors, errors
qa = {'date':'2026-10-06','relative_links':'PASS','utf8_replacement_scan':'PASS','bib_url_roundtrip':'PASS',
      'bib_paper_id_coverage':'PASS','six_pngs_visually_inspected':True,
      'figure_observation':'Labels, arrows and evidence counts legible; no clipping observed.',
      'scientific_review':'Original specialist audits retained in evidence. Adaptation supplement uses one-assistant review; its separate validation is in sources/adaptation/validation.json.',
      'limitations':'No navigation experiments, exhaustive systematic coverage or independent human peer review.'}
(root/'audit/final_quality_check.json').write_text(json.dumps(qa,indent=2)+'\n',encoding='utf-8')
files=[p for p in sorted(root.rglob('*')) if p.is_file() and p != archive and 'matplotlib_cache' not in p.parts and '__pycache__' not in p.parts]
hashes={p.relative_to(root).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in files if p.name != 'file_hashes.json'}
(root/'audit/file_hashes.json').write_text(json.dumps(hashes,indent=2)+'\n',encoding='utf-8')
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED) as z:
    for p in files:
        z.write(p,p.relative_to(root).as_posix())
with zipfile.ZipFile(archive) as z:
    assert z.testzip() is None
    entries=len(z.namelist())
print(json.dumps({'archive':str(archive),'files':entries,'bytes':archive.stat().st_size,'zip_integrity':'PASS','qa':'PASS'},indent=2))
