from pathlib import Path
import json, re
root = Path(__file__).resolve().parents[1]
source_dir = root / "sources"
rows = []
for p in sorted(source_dir.glob("robotics_*.json")):
    data = json.loads(p.read_text(encoding="utf-8"))
    if "queries" not in data:
        continue
    result = data.get("result", "")
    if not isinstance(result, str):
        result = json.dumps(result)
    returned = sorted(set(re.findall(r"turn\d+(?:search|academia|reddit)\d+", result)))
    rows.append({"file": p.name, "date": data.get("date"), "queries": data["queries"], "returned_result_entries": len(returned), "returned_ids": returned})
out = root / "evidence" / "robotics_search_log.json"
out.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")
print(json.dumps({"search_batches": len(rows), "queries": sum(len(r["queries"]) for r in rows), "returned_entries_by_batch": {r["file"]: r["returned_result_entries"] for r in rows}}, ensure_ascii=False))

