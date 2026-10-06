"""Assemble source tables, bibliography and conceptual figures; no model experiments.
Run from any directory with the project .research_build Python environment.
Only reads/writes the outputs directory. No network access or external commands.
"""
from pathlib import Path
import csv
import hashlib
import json
import math
import os
import platform
import re
from statistics import NormalDist
import textwrap

ROOT = Path(__file__).resolve().parents[1]
EVID = ROOT / 'evidence'

def read(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))

def save_json(name, obj):
    (ROOT / name).write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

def scalar(v):
    if isinstance(v, list):
        return '; '.join(str(x) for x in v)
    if isinstance(v, dict):
        return json.dumps(v, ensure_ascii=False)
    return v

def save_csv(name, rows, fields):
    with (ROOT / name).open('w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore')
        writer.writeheader()
        writer.writerows({k: scalar(v) for k, v in row.items()} for row in rows)

papers = []
claims = []
for domain in ('quantum', 'world', 'robotics'):
    papers += read(EVID / f'{domain}_papers.json')
    claims += read(EVID / f'{domain}_claims.json')
paper_fields = ['id','title','authors','year','venue','status','doi','url','category','contribution','benchmark','representation','planner','uncertainty','metrics','strongest_result','assumptions','limitations','relevance','stance','code','license','location','verification']
ids = {p['id'] for p in papers}
assert len(ids) == len(papers), 'Duplicate paper IDs'
for p in papers:
    assert all(k in p for k in paper_fields), (p['id'], 'missing field')
    assert p['url'].startswith('http'), p['id']
save_csv('02_paper_database.csv', papers, paper_fields)
docs = read(EVID / 'robotics_document_sources.json')
venue_docs = [
 ('VD01','CoRL 2026 instructions','https://2026.corl.org/contributions/instruction-for-authors','Paper Submission Requirements; Submission Policy; Camera Ready','Initial main text is 8 pages, camera-ready 9; parallel archival submissions disallowed by default.'),
 ('VD02','RSS 2027 CFP','https://roboticsconference.org/information/cfp/index.html','Important Dates; Two-Stage Process; Paper Format and Length','Live opened CFP sets initial December 4 2026 AoE submission with 5 content plus 1 reference page; invited final April 16 2027 has 8 content pages.'),
 ('VD03','ICRA 2027 CFP','https://2027.ieee-icra.org/contribute/call-for-icra-2027-papers-now-accepting-submissions/','Closed heading; Formatting Instructions; FAQ','Complete paper maximum is 8 pages; opened page says submission closed; final extended date not asserted.'),
 ('VD04','RA-L author instructions','https://www.ieee-ras.org/publications/ra-l/ra-l-information-for-authors/','Page Length; Multimedia','Six pages including references, up to two extra with charges; supplemental text cannot bypass total limit.'),
 ('VD05','ICML 2026 instructions','https://icml.cc/Conferences/2026/AuthorInstructions','Paper Submissions; Camera-ready instructions','Eight content pages initially, nine final; anonymous code/data encouraged.'),
 ('VD06','NeurIPS 2026 handbook','https://nips.cc/Conferences/2026/MainTrackHandbook','Paper Format; Code and Data Submission','Nine content pages initially, ten final; checklist excluded from content limit; supporting code/data encouraged.'),
 ('VD07','ICLR 2027 author guidelines','https://iclr.cc/Conferences/2027/AuthorGuidelines','Deadlines; Paper Length; Dual Submission','Paper deadline September 25 2026 AoE; nine main pages initially, ten for discussion/final; substantially similar parallel submissions disallowed.'),
 ('VD08','AISTATS 2027 CFP','https://virtual.aistats.org/Conferences/2027/CallForPapers','Key Dates; Formatting; Mandatory AI Use Statement','Abstract September 29 and full paper October 6 2026; eight content pages initially; AI statement and reproducibility checklist outside limit.'),
 ('VD09','JMLR author information','https://jmlr.org/author-info.html','Scope; Originality; Submission procedure','No simultaneous conference/journal submission; over 35 pages may prolong review, over 50 requires cover-letter justification.'),
 ('VD10','CVPR 2027 CFP','https://cvpr.thecvf.com/Conferences/2027/CallForPapers','Paper Submission; Dual Submission Policy','Paper deadline November 16 2026 AoE and supplementary November 23; current author-guideline page limit not verified.'),
 ('VD11','ECCV 2026 policies','https://eccv.ecva.net/Conferences/2026/SubmissionPolicies','Paper formatting; Dual submissions; Supplementary material','Fourteen content pages plus references; similar concurrent submissions disallowed in stated review window; code encouraged.'),
 ('VD12','T-RO FAQ','https://www.ieee-ras.org/publications/t-ro/t-ro-faq/','Strict page limit; dual submission; supplementary material questions','Initial regular papers at most eighteen pages; final twenty; simultaneous conference submission disallowed.'),
 ('VD13','IJRR author guidance','https://journals.sagepub.com/author-instructions/ijr','Article types; Data availability; Submission','Normal length twelve final two-column pages, exceptions on merit; data availability statement expected; work not under consideration elsewhere.'),
 ('VD14','IJCV submission guidelines','https://link.springer.com/journal/11263/submission-guidelines','Research Data Policy; Manuscript Submission','Official guidelines inspected; fixed maximum page count not verified in retrieved instructions.'),
]
for did,title,url,loc,claim in venue_docs:
    docs.append(dict(id=did,title=title,url=url,location=loc,claim=claim,date='2026-10-06',verification='Opened official webpage; dated snapshot, not future policy guarantee'))
    claims.append(dict(claim_id=did+'-C',claim=claim,claim_type='ESTABLISHED',source_ids=[did],exact_source_location=loc,confidence='High for retrieved text; recheck before submission',contradictions='See report 12 for stale indexed snippets, redirects and unresolved endpoints',verification_scope='Official policy snapshot only'))
save_json('evidence/document_sources.json',docs)
doc_ids = {d['id'] for d in docs}

local_claims = [
 ('L01','PSC is the first engineering candidate, QLC a baseline and TEC deferred; no core has demonstrated superiority.','INFERENCE',['Q04','Q07','Q14','W09','W10'],'04_novelty_map.md; 00_executive_summary.md','Moderate','Ranking may reverse after Stage 0.'),
 ('L02','Equal density ensembles have identical history probabilities under common linear instruments and history-adaptive policies.','INFERENCE',['Q11'],'05_mathematical_formulation.md section 4; quantum_math.md equivalence proof','High under stated assumptions','Branch-conditioned state or nonlinear readout changes the model.'),
 ('L03','One open-chain purification cut of dimension chi bounds physical mutual information by 2 log chi.','INFERENCE',['Q07','Q19'],'05 section 3; quantum_math.md LPDO proof','High under specified topology','Nonlocal decoder, extra bonds or nonlocal auxiliaries alter the bound.'),
 ('L04','The two-slot anti-correlated target has forbidden mass 1/2 under independent correct marginals.','INFERENCE',[],'08 section 0B: enumerate four binary outcomes','High algebraic','A two-component classical joint mixture is exact.'),
 ('L05','Zero forbidden mass can hide loss of valid modes.','INFERENCE',[],'08 section 0B TV co-primary; delta on one valid mode is a counterexample','High algebraic','Requires proper score/coverage to detect collapse.'),
 ('L06','The specified peek task has optimal DETOUR at p=1/2 and PEEK at p=1/4.','INFERENCE',[],'08 exact sensing fixture: costs 10B,3,1.1; sensor accuracy .9','High algebraic','A scalar classical Bayes belief reproduces it.'),
 ('L07','PSC may yield useful joint filtering or capacity diagnostics at matched resources.','HYPOTHESIS',['Q07','Q17','W09','W10'],'06 H2/H5; 08 Gate 2','Untested','Classical tensors, graphs, mixtures or particles may match it.'),
 ('L08','Navigation performance of the proposed cores remains unknown; no model, simulator benchmark or robot experiment was executed for this package.','UNKNOWN',[],'audit/command_log.md; empirical gates NOT RUN','Explicit scope','Artifact rendering and planning calculations are not navigation experiments.'),
 ('L09','Binary upper-tail CVaR equals min(1,p/(1-alpha)).','INFERENCE',[],'05 final paragraph: derive from CVaR definition for Bernoulli loss','High algebraic','General severity-valued losses behave differently.'),
 ('L10','Budget, effect margins, schedule and compute scenarios are proposed assumptions, not measured feasibility.','HYPOTHESIS',[],'10 statistical plan; 11 resource scenarios; 17 schedule','Untested','Actual hardware and pilot nuisance parameters remain unknown.'),
 ('L11','The requested cores have no established project-specific preference over a strong classical predictor and planner yet.','INFERENCE',['W09','W10','W12','Q04','Q14'],'17 success criterion and all NOT RUN gates','High as evidence-status conclusion','This is not a proof that future experiments cannot find an advantage.'),
]
for cid, claim, ctype, sources, loc, conf, contra in local_claims:
    claims.append(dict(claim_id=cid, claim=claim, claim_type=ctype, source_ids=sources,
                       exact_source_location=loc, confidence=conf, contradictions=contra,
                       verification_scope='Project derivation/proposal/scope statement; not an external experimental result'))
claim_fields = ['claim_id','claim','claim_type','source_ids','source_urls','exact_source_location','confidence','contradictions','verification_scope']
urlmap = {p['id']:p['url'] for p in papers} | {d['id']:d['url'] for d in docs}
for c in claims:
    srcs = c['source_ids']
    if isinstance(srcs,str):
        srcs = [x.strip() for x in re.split('[;,]',srcs) if x.strip()]
        c['source_ids'] = srcs
    assert set(srcs) <= ids | doc_ids, (c['claim_id'],srcs)
    c['source_urls'] = [urlmap[x] for x in srcs]
assert len({x['claim_id'] for x in claims}) == len(claims)
save_csv('03_claim_evidence_ledger.csv', claims, claim_fields)

def bib_escape(v):
    return str(v).replace('&',r'\&').replace('%',r'\%').replace('_',r'\_')

bib = ['% Verified/qualified source records; UTF-8. See CSV for exact verification scope.']
for p in papers:
    authors = p['authors']
    if isinstance(authors,list):
        authors = ' and '.join(authors)
    else:
        authors = authors.replace('; ', ' and ').replace(';',' and ')
    fields = {'title':'{'+p['title']+'}', 'author':authors, 'year':p['year'], 'howpublished':p['venue'], 'url':p['url'], 'note':p['status']+'; inspected 2026-10-06; '+p['verification']}
    if p.get('doi') and 'UNKNOWN' not in p['doi'].upper():
        fields['doi'] = p['doi']
    bib.append('@misc{'+p['id']+',\n'+',\n'.join('  '+k+' = {'+(str(v) if k in ('url','doi') else bib_escape(v))+'}' for k,v in fields.items())+'\n}')
bib.append('@misc{SAS2026,\n  title = {Scientific Agent Skills: A Library of Procedural Knowledge for Research Agents},\n  author = {Kassis, Timothy and Agarwal, Vinayak and He, Yuhuan and Patel, Darshil and Brueckner, Aubrey M.},\n  year = {2026},\n  howpublished = {arXiv preprint},\n  eprint = {2609.00065},\n  archivePrefix = {arXiv},\n  doi = {10.48550/arXiv.2609.00065},\n  url = {https://arxiv.org/abs/2609.00065},\n  note = {Software-workflow attribution only; primary metadata/abstract opened 2026-10-06}\n}')
(ROOT/'references.bib').write_text('\n\n'.join(bib)+'\n',encoding='utf-8')

# Baselines are experimental roles; code/license values remain scoped to inspected evidence.
B = [
 ('Constant position/velocity/acceleration','predictor','1 onward','','Documented kinematics; no learned intent','Negligible baseline; measure actual end-to-end cost'),
 ('Kalman / extended Kalman','tracker','1','','Unimodal local Gaussian assumptions; prescribed noise model','Small matrices; proposed implementation'),
 ('Interacting multiple model','tracker','1','','Finite behavior modes; inspect implementation before selection','Mode-count scaling; UNKNOWN measured latency'),
 ('Persistent weighted particle filter','belief','0C onward','W12;W13;W14','Same labels, observations and history as TEC','Match M and measured resampling cost'),
 ('Joint categorical table','oracle/belief','0B','','Exact tiny distribution over all joint modes','Exponential full table; tiny oracle only'),
 ('Joint Gaussian/categorical mixture','belief/predictor','0 onward','','Shared multimodal scene component, not independent per-agent mixture','Match parameters/components/latency'),
 ('Classical nonnegative/tensor factorization','belief','0B onward','Q17','Same topology, local variables and readout contract','Match factor entries and contraction cost'),
 ('OOM / PSR','sequence core','0A','Q05;Q06;Q14','Validity/positivity and process assumptions explicit','Match observable state/learned parameters'),
 ('Gaussian RSSM-style core','world model','1','','Derived common-planner baseline; concrete config pending','Same encoder, history and decoder'),
 ('Categorical RSSM / Dreamer-style core','world model','1','W01','Adapted belief core differs from native Dreamer agent','Same data, samples, training/tuning budget'),
 ('Native DreamerV3','full system','later','W01','Actor/critic and imagined training affect attribution','Separate system comparison'),
 ('TD-MPC2','full system / derived core','later','W02','Deterministic SimNorm; native value/planner differ','Separate native and adapted results'),
 ('IRIS','token world model','visual','W03','Discrete autoregressive observations','Count token generation/history'),
 ('DIAMOND','diffusion world model','visual','W04','Image generation objective; not automatically calibrated collision belief','Count denoising and visual encoder cost'),
 ('DINO-WM','feature world model','visual','W05','Pretrained feature/data budget counted','Count planning optimization and encoder'),
 ('SAVi / SlotFormer','object-centric dynamics','visual','W06;W07','Interaction-aware slots; not independence control','Same frontend and object identity supervision'),
 ('Trajectron++','trajectory predictor','1 onward','W08','Tracked inputs and dynamics; label assumptions explicit','Match trajectories/horizon and input state'),
 ('Scene Transformer / joint graph predictor','joint trajectory','2','W09','Joint scene hypotheses and attention','Matched total model and rollout cost'),
 ('MotionDiffuser','joint diffusion','2','W10','Joint scene futures; sample/denoising budget controlled','Match wall-clock latency, not only parameter count'),
 ('FLOMO','flow trajectory','1 onward','W21','Individual-agent conditioning; not a verified joint scene flow. Density/noise conventions must match scoring','Exact density; actual inference cost unknown'),
 ('Occupancy Flow Fields / ImplicitO','occupancy forecast','visual','W22;W23','Output resolution/query load; planning integration separate','Count queried locations and horizon'),
 ('GM-PHD','intensity tracker','births/exits','W15','First-order intensity not full joint law','Components/pruning cost reported'),
 ('LMB','labeled existence tracker','births/exits','W16','Approximate labeled independent Bernoulli form','Report associations, pruning and active labels'),
 ('GLMB','joint multi-target tracker','births/exits','W17;W18','Retains weighted joint hypotheses; assumptions apply','Hypothesis truncation cost and error'),
 ('CPHD / JPDA / MHT','tracking candidates','conditional','','UNVERIFIED extraction; not an included evidence-backed winner','Select/verify only if cardinality/association task requires'),
 ('A* / D* Lite','global route','1 onward','','Static-map/replanning roles; not standalone dynamic avoidance','Specific implementation/license unselected'),
 ('Hybrid A* / kinodynamic RRT','kinodynamic route','conditional','','For car-like/kinodynamic constraints; exact implementation unselected','Task-specific; no compute claim'),
 ('RRT*','sampling planner','conditional','R05_RRTSTAR','Asymptotic assumptions do not solve unknown moving obstacles','Separate dynamic extension needed'),
 ('SIPP','time-aware planner','1 onward','R04_SIPP','Supplied obstacle trajectory/reservation forecast','Oracle or same forecast only'),
 ('DWA / Nav2 local control','reactive control','1 onward','R01_DWA','Admissible velocity window and sensed geometry','Tune footprint/dynamics/frequency equally'),
 ('TEB','trajectory optimization','conditional','R06_TEB','Opened code ROS1; ROS2 port compatibility unverified','Optimization iterations and obstacle assumptions'),
 ('Velocity obstacles / RVO / ORCA','avoidance','1 onward','R02_VO;R03_ORCA','Reciprocity/velocity assumptions; no universal pedestrian guarantee','Use official eligible code; report limits'),
 ('Social Force','behavior/control candidate','2','','Primary original source not independently extracted here','Unverified lead; do not rely on as sole human realism'),
 ('Sampled MPC / MPPI / CEM','shared planner','0 onward','R07_ITMPC','Same action-conditioned joint futures/cost model','Fixed horizon/samples; p99 deadline'),
 ('Chance-constrained MPC','risk planner','1 onward','R08_CHANCE','Joint horizon event and model/calibration assumptions','Finite sample uncertainty plus compute'),
 ('CVaR / RA-MPPI','risk planner','1 onward','R11_RAMPP','Weighted upper-tail severity; binary saturation caveat','Tail effective sample size and iterations'),
 ('Distributionally robust CVaR filter','safety/risk','conditional','R12_DRCVAR','Ambiguity set and radius must be justified','Optimization feasibility/fallback latency'),
 ('POMCP','belief-space planner','0C onward','R09_POMCP','Generative model plus same observations/branch labels','Match simulator calls and search time'),
 ('Belief-space iLQG','belief-space planner','conditional','R10_BELIEFILQG','Gaussian/local approximation; not exact multimodal oracle','Derivatives/rollouts in cost'),
 ('Oracle future/state/intent/joint law','oracle controls','all','','Separate prediction, perception and planning limits','Not deployment baselines'),
 ('QLC / PSC / TEC','proposed cores','0 first','Q01;Q07;Q11','Independent hypotheses; all empirical gates NOT RUN','Report real scalars, bytes, full latency and training budget'),
]
byid={p['id']:p for p in papers}
baseline_rows=[]
for name,kind,stage,sources,assumptions,cost in B:
    ps=[byid[x] for x in sources.split(';') if x in byid]
    baseline_rows.append(dict(name=name,category=kind,stage=stage,source_ids=sources,
        assumptions=assumptions,code=' | '.join(str(p['code']) for p in ps) or 'UNSELECTED / not verified',
        license=' | '.join(str(p['license']) for p in ps) or 'UNKNOWN',compute=cost,
        implementation_status='NOT RUN / candidate design'))
save_csv('07_baseline_matrix.csv',baseline_rows,list(baseline_rows[0]))

# Planning-only power sensitivity, with no implied empirical event rate.
power_rows=[]
for p0,p1 in ((.10,.08),(.10,.05),(.05,.04),(.05,.025),(.02,.01),(.01,.005)):
    for power in (.80,.90):
        avg=(p0+p1)/2
        z=NormalDist().inv_cdf(.975); zp=NormalDist().inv_cdf(power)
        n=math.ceil((z*math.sqrt(2*avg*(1-avg))+zp*math.sqrt(p0*(1-p0)+p1*(1-p1)))**2/(p0-p1)**2)
        power_rows.append(dict(assumed_baseline=p0,assumed_candidate=p1,alpha=.05,target_power=power,n_per_arm_approx=n,
            scope='Illustrative independent equal-group binomial normal approximation; NOT final crossed-design power'))
save_csv('power_sensitivity.csv',power_rows,list(power_rows[0]))

# Audit of curated extraction only. Do not infer PRISMA denominators from search hits.
limited={'Q10','Q11','Q12','Q13','Q16','R02_VO','R03_ORCA','R05_RRTSTAR','R08_CHANCE','R10_BELIEFILQG','R15_ARENA5'}
metadata={'Q18'}
full=ids-limited-metadata
audit={'date':'2026-10-06','review_type':'bounded scoping synthesis; not complete PRISMA systematic review',
       'curated_report_families':len(papers),'full_text_relevant_sections':len(full),
       'abstract_or_description_scope':len(ids&limited),'metadata_only':len(ids&metadata),
       'full_text_ids':sorted(full),'limited_ids':sorted(ids&limited),'metadata_ids':sorted(ids&metadata),
       'database_total_records':'NOT_AVAILABLE','all_discovery_hits_screened':False,
       'independent_human_double_screening':False,
       'excluded_or_unverified_named_candidates':'See domain screening/failure logs; not a complete merged discovery denominator',
       'studies':'Not independently adjudicated across all reports; paper families are not claimed as independent empirical studies'}
assert len(full)+len(ids&limited)+len(ids&metadata)==len(papers)
save_json('screening_audit.json',audit)

query_rows=[]
for row in read(EVID/'world_search_log.json'):
    query_rows.append(dict(workstream='world',date=row.get('date','2026-10-06'),database=row.get('database','ranked web'),query=row.get('query','UNKNOWN'),result_count=row.get('total_result_count','NOT_REPORTED'),cache=row.get('raw_response',''),screening=row.get('screening','See domain screening manifest')))
for domain,path,countkey in [('quantum','quantum_query_log.json','returned_batch_hits'),('robotics','robotics_search_log.json','returned_result_entries')]:
    for row in read(EVID/path):
        for query in row.get('queries',[]):
            query_rows.append(dict(workstream=domain,date=row.get('date','2026-10-06'),database='Ranked public web; supplementary discovery',query=query,result_count='Per-query total NOT_REPORTED; returned batch entries '+str(row.get(countkey,'UNKNOWN')),cache='sources/'+row.get('cache',row.get('file','')),screening='Selected primary reports extracted; incidental snippets not all screened'))
for path in sorted((ROOT/'sources').glob('root_venues_*.json')):
    data=read(path)
    for query in data.get('args',{}).get('search_query',[]):
        query_rows.append(dict(workstream='venue/docs',date='2026-10-06',database='Ranked public web; official follow-up reads',query=query['q'],result_count='NOT_REPORTED',cache='sources/'+path.name,screening='Only opened official instructions used; failures and unknowns retained'))
save_csv('search_queries.csv',query_rows,list(query_rows[0]))
marker='\n## Consolidated completed-search index\n'
log=(ROOT/'search_log.md').read_text(encoding='utf-8').split(marker)[0]
log+=marker+'\nExact queries and per-query/batch count limitations: [search_queries.csv](search_queries.csv). The table contains '+str(len(query_rows))+' query-log rows, including a failed API attempt; it is not a count of papers.\n\n'
log+='| Workstream | Extraction and screening | Raw evidence |\n|---|---|---|\n| Quantum/tensors | 19 selected reports; query log, discovery and failures in evidence/quantum_* | sources/quantum_* |\n| World models/tracking | 23 selected reports; 28 named candidates (23 included, 4 unverified, 1 wrong-topic excluded) in world_screening.json | sources/world_* |\n| Robotics/platforms | 16 selected papers plus official documentation; returned discovery entries not a screened denominator | sources/robotics_* |\n| Venues/skills | Official-page snapshots and documented unresolved policies; not scholarly study records | sources/root_venues_* and audit/ |\n\n'
log+='Curated evidence: '+str(len(papers))+' report families; '+str(len(full))+' with relevant full-text sections inspected, '+str(len(ids&limited))+' abstract/description scope, '+str(len(ids&metadata))+' metadata only. These are reports/families, not independently adjudicated empirical studies. No complete all-record exclusion denominator, exhaustive database export, or independent human double screening is claimed. DOI existence alone was never treated as technical support.\n\n'
log+='Known failures: shell sandbox network restrictions; focused arXiv API unavailable; some publisher PDF/metadata endpoints inaccessible; wrong click arguments repaired using browser reference IDs; IROS/current CVPR-author instructions/TPAMI unresolved. Source-specific failures are preserved in the domain logs and raw responses. No failed retrieval was silently converted to a verified claim.\n'
(ROOT/'search_log.md').write_text(log,encoding='utf-8')

# Actual conceptual figures. No model-performance data or invented result curves.
os.environ['MPLCONFIGDIR'] = str(ROOT / 'audit' / 'matplotlib_cache')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':11,'svg.fonttype':'none','pdf.fonttype':42})
FIG=ROOT/'figures'; FIG.mkdir(exist_ok=True)
captions=[]
def canvas(title, subtitle):
    fig,ax=plt.subplots(figsize=(13,8)); fig.subplots_adjust(left=.02,right=.98,bottom=.04,top=.91)
    ax.set(xlim=(0,13),ylim=(0,8)); ax.axis('off')
    fig.suptitle(title,x=.04,ha='left',fontsize=20,fontweight='bold',color='#142D45')
    ax.text(.25,7.72,subtitle,va='top',fontsize=10,color='#45576A',wrap=True)
    return fig,ax
def box(ax,x,y,w,h,title,body='',color='#EAF1F7'):
    ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle='round,pad=0.05,rounding_size=0.10',fc=color,ec='#26445D',lw=1.2))
    ax.text(x+w/2,y+h-.22,title,ha='center',va='top',weight='bold',fontsize=11,color='#142D45')
    if body:
        width=max(18,int(w*10))
        wrapped='\n'.join(textwrap.fill(s,width=width) for s in body.split('\n'))
        ax.text(x+w/2,y+h-.66,wrapped,ha='center',va='top',fontsize=10,linespacing=1.4,color='#263B4D')
def arrow(ax,a,b):
    ax.add_patch(FancyArrowPatch(a,b,arrowstyle='-|>',mutation_scale=15,lw=1.3,color='#26445D'))
def finish(fig,name,caption):
    for suffix in ('png','svg','pdf'):
        fig.savefig(FIG/f'{name}.{suffix}',dpi=180,facecolor='white')
    plt.close(fig); captions.append((name,caption))

fig,ax=canvas('Evidence retrieval and screening audit','PRISMA-style layout for the curated set only. Complete discovery and independent-study counts are unavailable.')
box(ax,.4,5.7,5.1,1.25,'Ranked discovery + primary retrieval','Query logs and failed requests retained')
box(ax,7.1,5.7,5.1,1.25,'Coverage limitation','Not all returned hits screened; no exhaustive database denominator', '#FFF0D9')
box(ax,3.6,3.7,5.7,1.2,f'{len(papers)} curated paper / report families','Preprint and published versions linked where identified')
arrow(ax,(4.4,5.65),(5.5,4.98))
for x,n,title,body in [(0.4,len(full),'Relevant full text','Only cited sections inspected'),(4.6,len(ids&limited),'Abstract / description','No detailed theorem or score claim'),(8.8,len(ids&metadata),'Metadata only','Excluded from technical conclusions')]:
    box(ax,x,1.15,3.7,1.55,f'{n} — {title}',body)
    arrow(ax,(6.4,3.65),(x+1.85,2.8))
ax.text(.4,.35,'Not a full PRISMA-compliant systematic review. Source IDs and scope: screening_audit.json.',fontsize=10)
finish(fig,'prisma_flow','Curated-source scope and limitations. Counts are read from the actual paper records and explicit evidence-scope classification, not invented search totals.')

fig,ax=canvas('Literature taxonomy','Themes describe verified prior art and experimental roles; box size does not encode evidence strength.')
items=[('World prediction','RSSM, tokens, features, diffusion\nW01–W05'),('Joint object futures','Slots, trajectories, flows, occupancy\nW06–W11, W21–W23'),('Classical beliefs','Particles, mixtures, RFS, PSR\nW12–W18, Q05–Q06'),('Quantum-inspired mathematics','HQMM, purification, projective rays\nQ01–Q19'),('Robot control','Reactive, time-aware, risk, belief-space\nR01–R12'),('Validation','Social benchmarks, calibration, transfer\nR13–R16, W19–W20')]
for k,(title,body) in enumerate(items):
    col=k%3; row=k//3;box(ax,.4+col*4.25,4.7-row*2.6,3.9,2.05,title,body)
ax.text(.5,.8,'Research question: which explicit structure earns a useful accuracy–safety–cost tradeoff?',weight='bold')
finish(fig,'literature_taxonomy','Six thematic evidence groups. The review table expands these to the eighteen requested themes; IDs link to the source database.')

fig,ax=canvas('Representation comparison','All three are classical numerical models. Relative performance is UNKNOWN.')
cols=[('QLC','Density operator rho','Operational off-diagonals','HQMM / OOM, real vector','Baseline / decisive test'),('PSC','Purified joint slot tensors','Cross-slot dependence budget','Joint mixture, graph, tensor','First conditional pilot'),('TEC','Weighted persistent rays','Information beyond rho','Equally informed particles','Deferred')]
for k,(name,obj,test,rival,decision) in enumerate(cols):
    x=.4+4.25*k;box(ax,x,2.3,3.9,4.65,name,f'State: {obj}\n\nTest: {test}\n\nClassical rival: {rival}\n\nPriority: {decision}')
ax.text(.5,1.3,'Passing a mechanism test does not establish novelty or matched-compute advantage.',weight='bold')
ax.text(.5,.65,'All empirical gates: NOT RUN. Recommendation is an inference from prior art and testability.')
finish(fig,'representation_comparison','Objects, decisive questions, classical rivals and conditional priorities; no performance ranking is implied.')

fig,ax=canvas('Experiment ladder','Escalate resources only after the previous scientific and systems gate passes.')
stages=[('0','Exact falsification','Analytic tiny tasks + strong classical controls'),('1','One obstacle','Known state, then noise / occlusion / lidar'),('2','Joint obstacles','Interactions, cardinality, scaling, common planner'),('3','Generalization','Held-out indoor/outdoor maps and policies'),('4','Supervised transfer','Robot timing, safety monitors and interventions')]
for k,(num,title,body) in enumerate(stages):
    y=6.0-k*1.18;box(ax,.6,y,11.7,.93,f'Stage {num}: {title}',body)
    if k<4:arrow(ax,(6.45,y-.03),(6.45,y-.24))
finish(fig,'experiment_ladder','Prospective progression from analytical fixtures to supervised transfer. No rung represents an executed navigation experiment.')

fig,ax=canvas('Shared architecture for fair comparison','Keep observation history, decoder contract, objective and control budget comparable.')
box(ax,3.8,6.0,5.4,.95,'Common sensor / history encoder','State first; visual frontend later')
for k,title in enumerate(('QLC','PSC','TEC','Classical controls')):
    x=.35+3.25*k;box(ax,x,3.75,2.8,1.1,title,'Swappable belief core')
    arrow(ax,(6.5,5.95),(x+1.4,4.9));arrow(ax,(x+1.4,3.7),(6.5,2.95))
box(ax,3.2,1.95,6.6,.95,'Common joint forecast / risk contract','Same horizon, samples and candidate controls')
box(ax,3.2,.25,6.6,.95,'Same planner -> executed action','Log forecasts, timing, risk and safety interventions')
arrow(ax,(6.5,1.9),(6.5,1.25))
finish(fig,'architecture_diagram','Controlled representation comparison. Shared interface does not by itself ensure equal capacity; all context, decoder and pretraining resources are counted.')

fig,ax=canvas('Decision gates','Mechanism, useful advantage and publication readiness are separate decisions.')
box(ax,.45,5.8,3.7,1.15,'G1 — QLC','Operational effect + classical comparison')
box(ax,4.65,5.8,3.7,1.15,'G2 — PSC','Capacity + distribution recovery + cost')
box(ax,8.85,5.8,3.7,1.15,'G3 — TEC','Correct branch utility beyond particles')
for x in (2.3,6.5,10.7):arrow(ax,(x,5.7),(6.5,4.65))
box(ax,3.6,3.35,5.8,1.25,'G4 — Robotics utility','Matched-compute simulation + timing')
box(ax,.5,1.05,5.45,1.35,'G5 — Scale only if stable','One obstacle -> multiple -> transfer')
box(ax,7.05,1.05,5.45,1.35,'G6 — Evidence before venue','Pass / fail / inconclusive all disclosed')
arrow(ax,(5.2,3.3),(3.2,2.45));arrow(ax,(7.8,3.3),(9.8,2.45))
ax.text(.55,.32,'Failure branch at every gate: simplify, diagnose, or develop a rigorous negative result. All gates NOT RUN.',fontsize=10)
finish(fig,'decision_gate_diagram','Prospective gate logic. Tests are independent initially; no combined hybrid is assumed.')
(FIG/'captions.md').write_text('# Figure captions and accessible descriptions\n\nAll figures are conceptual research-program diagrams, except the curated-source counts in the flow. No benchmark curves are shown. General report format; no publisher compliance claimed.\n\n'+'\n\n'.join(f'## {name}\n\n{cap}' for name,cap in captions)+'\n',encoding='utf-8')
save_json('figures/manifest.json',{'date':'2026-10-06','generator':'scripts/assemble_artifacts.py','matplotlib':matplotlib.__version__,'figure_inches':[13,8],'png_dpi':180,'background':'white','fonts':'DejaVu Sans; SVG text searchable; PDF TrueType embedded','sources':['02_paper_database.csv','screening_audit.json','04_novelty_map.md','08_stage0_falsification_protocols.md','09_robotics_experiment_program.md'],'conceptual_not_experimental':True,'figures':[n for n,c in captions]})

required=['00_executive_summary.md','01_systematic_literature_review.md','02_paper_database.csv','03_claim_evidence_ledger.csv','04_novelty_map.md','05_mathematical_formulation.md','06_hypothesis_registry.md','07_baseline_matrix.csv','08_stage0_falsification_protocols.md','09_robotics_experiment_program.md','10_statistical_analysis_plan.md','11_simulator_and_hardware_selection.md','12_venue_strategy.md','13_paper_blueprints.md','14_risk_register.md','15_reproducibility_checklist.md','16_reviewer_attack_and_response.md','17_final_synthesis.md','references.bib','search_log.md','skill_usage_log.md']
assert all((ROOT/f).is_file() and (ROOT/f).stat().st_size>0 for f in required)
report={'python':platform.python_version(),'paper_records':len(papers),'claim_records':len(claims),'baseline_rows':len(B),'bib_entries':len(papers)+1,'source_links_valid':True,'required_files_present':True,'figures':len(captions),'power_rows':len(power_rows),'scope':'Structural validation, not verification of every scholarly statement or proposed experiment'}
save_json('audit/validation_report.json',report)
hashes={str(p.relative_to(ROOT)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(ROOT.rglob('*')) if p.is_file() and p.name not in ('file_hashes.json','research_package.zip')}
save_json('audit/file_hashes.json',hashes)
print(json.dumps(report,indent=2))
