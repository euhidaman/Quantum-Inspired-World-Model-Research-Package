"""Audit saved quantum discovery responses; project-authored, standard library only."""
import json,re,pathlib
root=pathlib.Path(__file__).resolve().parents[2]
src=root/"outputs"/"sources"
dst=root/"outputs"/"evidence"
papers=json.loads((dst/"quantum_papers.json").read_text(encoding="utf-8"))
rows=[]; logs=[]
for path in sorted(src.glob("quantum_search*.json")):
    data=json.loads(path.read_text(encoding="utf-8"))
    queries=data.get("queries", data.get("request",{}).get("search_query",[]))
    response=data["result"]
    hits=[]
    for block in response.split("--------------------------------------------------------------------------------"):
        m=re.match(r"\s*(.*?)\s+\((https?://[^\n]+)\)\n",block,re.S)
        if not m: continue
        title=m.group(1).strip(); url=m.group(2)
        ids=re.findall(r"turn\d+(?:search|academia|reddit)\d+",block)
        if not ids: continue
        hits.append((title,url,ids[0]))
    for i,(title,url,rid) in enumerate(hits,1):
        match=[p["id"] for p in papers if p["url"]==url]
        rows.append({"batch":path.name,"returned_order":i,"title_as_returned":title,
                     "url":url,"web_reference":rid,"selected_primary_record_ids":match,
                     "screening_decision":"LINKED_SELECTED_RECORD" if match else "DISCOVERY_ONLY_UNASSESSED",
                     "reason":"See selected paper extraction and exact inspection scope" if match else
                              "Returned discovery hit; not treated as independently verified evidence"})
    logs.append({"cache":path.name,"date":data["date"],"queries":[q["q"] for q in queries],
                 "returned_batch_hits":len(hits),"total_database_hits":"NOT_REPORTED",
                 "per_query_hit_counts":"NOT_REPORTED_BY_BATCHED_WEB_TOOL"})
(dst/"quantum_discovery.json").write_text(json.dumps(rows,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
(dst/"quantum_query_log.json").write_text(json.dumps(logs,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
parts=["# Quantum search log","","Search date: 2026-10-06. Ranked public web discovery plus explicit primary-record retrieval.",
"Counts below are parsed returned source headings, not exhaustive database hit counts. A batched tool response does not attribute hits to individual queries. Duplicates and unassessed hits remain in quantum_discovery.json.",""]
for item in logs:
    parts += [f"## {item['cache']}",f"Returned batch source headings: {item['returned_batch_hits']}. Per-query and total database counts: NOT REPORTED.",""]
    parts += ["- "+chr(96)+q+chr(96) for q in item["queries"]]+[""]
parts += ["## Direct retrieval and screening","","Direct opening/citation chaining requests and exact returned text are in quantum_open*.json and quantum_find*.json. They are not extra independent search queries. The Crossref DOI request returned one record and is saved in quantum_crossref_choi.json.",
"","Selected extraction: 19 references; 13 with inspected full-text material, five with abstract-level scope, one with bibliographic metadata only. The related SSA journal/report records are linked; they are not counted as independent studies. The selected set is not an exhaustive systematic-review count.",
"","Author-institution records were used when publisher metadata could not be opened. Several search-result snippets remain unassessed and are excluded from evidence-backed conclusions. Discovery hits that link different reports of a selected work may remain DISCOVERY_ONLY_UNASSESSED until manually linked; no automatic title-based claim verification occurs.",
"","Custom audit command: python outputs/evidence/quantum_build_discovery.py. No external packages or third-party scripts were installed/executed."]
(dst/"quantum_search_log.md").write_text("\n".join(parts)+"\n",encoding="utf-8")
required="id title authors year venue status doi url category contribution benchmark representation planner uncertainty metrics strongest_result assumptions limitations relevance stance code license location verification".split()
assert len({p["id"] for p in papers})==len(papers)
assert all(not(set(required)-set(p)) for p in papers)
claims=json.loads((dst/"quantum_claims.json").read_text(encoding="utf-8"))
ids={p["id"] for p in papers}
assert all(set(c["source_ids"]) <= ids for c in claims)
print(json.dumps({"paper_records":len(papers),"claims":len(claims),"query_count":sum(len(x["queries"]) for x in logs),"returned_headings_with_duplicates":len(rows),"unique_discovery_urls":len({x["url"] for x in rows}),"batch_hit_counts":[x["returned_batch_hits"] for x in logs],"validation":"pass"}))

