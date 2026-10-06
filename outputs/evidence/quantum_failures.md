# Quantum retrieval and execution failures

Date: 2026-10-06 (client timezone Asia/Taipei).

| Item | Exact request/action | Result and treatment |
|---|---|---|
| Prompt alias | Get-Content audit/user_master_prompt.txt | Missing at time of read. Read the user attachment directly; no scientific assumption drawn from missing file. |
| Choi publisher | https://www.sciencedirect.com/science/article/pii/0024379575900750 | web open: 403; DOI/alternate publisher route also failed. |
| Choi CORE PDF | https://core.ac.uk/download/pdf/82789302.pdf | web open: 403. Public read-only PowerShell retry with network escalation returned a Cloudflare challenge; stopped, no bypass or PDF saved. |
| Choi Crossref | https://api.crossref.org/works/10.1016%2F0024-3795(75)90075-0 | web open failed. Initial PowerShell request: Unable to connect to remote server. Same read-only request with approved escalation succeeded, one record cached in quantum_crossref_choi.json. Original theorem remains NOT_RETRIEVED. |
| HJW publisher | https://www.sciencedirect.com/science/article/pii/0375960193908809 | 403; alternate abstract URL also failed. Goldsmiths author-institution record opened; explicitly says no full text. Claims restricted to abstract plus independent derivation. |
| HJW Crossref web | https://api.crossref.org/works/10.1016%2F0375-9601(93)90880-9 | Tool internal error; not used. Author-institution metadata sufficient for selected scope. |
| GKS 1976 | https://doi.org/10.1063/1.522979; https://repository.ias.ac.in/51137/ | DOI redirected to inaccessible AIP path; institution record open failed. Search snippets excluded from conclusions; original not included as verified evidence. |
| Lindblad PDF | https://link.springer.com/content/pdf/10.1007/BF01608499.pdf | Redirected to subscription record. Metadata/abstract inspected; not called full-text evidence. |
| Lindblad Euclid | https://projecteuclid.org/journals/communications-in-mathematical-physics/volume-48/issue-2/On-the-generators-of-quantum-dynamical-semigroups/cmp/1103899849.full | Returned one-line shell, no usable article. |
| SciPost | https://scipost.org/SciPostPhys.15.6.222 and /pdf | Bot challenge. Used author arXiv record/full paper v5; marked version difference. |
| Jaeger DOI | https://doi.org/10.1162/089976600300015411 | Internal error. Author-hosted full paper with publication note and erratum retrieved. |
| Dalibard fulltext | https://harvest.aps.org/v2/journals/articles/10.1103/PhysRevLett.68.580/fulltext | 401 Unauthorized. Publisher abstract opened; claims restricted. |
| Anandan author PDF | https://www.tau.ac.il/~yakir/yahp/yh64 | Four-page PDF opened, zero extracted text. Screenshot tool did not expose inspectable image through wrapper; detailed original equations not claimed inspected. Publisher abstract verified. |
| Audit-code tool invocation | First quantum_build_discovery.py apply_patch wrapper | JavaScript parse error from embedded backticks; no file mutation occurred. Rewritten wrapper succeeded; standard-library audit passed. |

Network command used for the successful bibliographic retrieval (PowerShell):
~~~powershell
$ErrorActionPreference = 'Stop'
$response = Invoke-WebRequest -Uri 'https://api.crossref.org/works/10.1016%2F0024-3795(75)90075-0' -UseBasicParsing -TimeoutSec 25
[System.IO.File]::WriteAllText((Join-Path (Get-Location) 'outputs/sources/quantum_crossref_choi.json'), $response.Content)
~~~

All other literature requests and returned text are cached in quantum_search*.json, quantum_open*.json and quantum_find*.json. Discovery results include unassessed secondary pages; none is promoted into evidence by being returned. The only executed project program was the inspected, project-authored standard-library provenance/JSON validator. No model or robot experiment was run. Python executable: C:/Python314/python.exe; package installation: none.

