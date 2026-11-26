import json, datetime as dt, urllib.request, urllib.parse, pathlib, time, os
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'public'/'threat-feed.json'
NOW=dt.datetime.now(dt.timezone.utc)
def fetch(url):
    for i in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'CYBER-WORLD public security research','Accept':'application/json'})
            with urllib.request.urlopen(req,timeout=45) as r:
                return json.load(r)
        except Exception:
            if i==2: raise
            time.sleep(10*(i+1))
def query(url,**params):
    return fetch(url+'?'+urllib.parse.urlencode(params))
KEV='https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json'
NVD='https://services.nvd.nist.gov/rest/json/cves/2.0'
EPSS='https://api.first.org/data/v1/epss'
def kev():
    raw=fetch(KEV)['vulnerabilities']
    if not raw: raise ValueError('empty KEV')
    return [{'id':v['cveID'],'vendor':v['vendorProject'],'product':v['product'],'date':v['dateAdded'],'due':v.get('dueDate'),'ransomware':v.get('knownRansomwareCampaignUse'),'url':'https://www.cisa.gov/known-exploited-vulnerabilities-catalog'} for v in raw]
def nvd():
    start=(NOW-dt.timedelta(days=7)).isoformat(timespec='milliseconds')
    end=NOW.isoformat(timespec='milliseconds')
    rows=[]; offset=0
    while True:
        raw=query(NVD,pubStartDate=start,pubEndDate=end,startIndex=offset,resultsPerPage=2000)
        batch=raw['vulnerabilities']
        for item in batch:
            c=item['cve']; metrics=c.get('metrics',{}); scores=[m['cvssData']['baseScore'] for k in ('cvssMetricV40','cvssMetricV31','cvssMetricV30','cvssMetricV2') for m in metrics.get(k,[]) if 'baseScore' in m.get('cvssData',{})]
            rows.append({'id':c['id'],'date':c['published'][:10],'cvss':scores[0] if scores else None,'url':'https://nvd.nist.gov/vuln/detail/'+c['id']})
        offset+=len(batch)
        if offset>=raw['totalResults']: break
        if not batch: raise ValueError('incomplete NVD pagination')
        time.sleep(7)
    return rows
def epss(ids):
    rows=[]
    for i in range(0,len(ids),80):
        batch=query(EPSS,cve=','.join(ids[i:i+80]))['data']
        rows.extend({'id':v['cve'],'epss':float(v['epss']),'percentile':float(v['percentile']),'date':v['date'],'url':'https://www.first.org/epss/'} for v in batch)
    if ids and not rows: raise ValueError('empty EPSS')
    return rows
def main():
    old=json.loads(OUT.read_text()) if OUT.exists() else {}
    feeds=old.get('feeds',{}); status={}
    def run(name,fn):
        try:
            rows=fn(); feeds[name]={'asOf':NOW.isoformat(),'rows':rows}; status[name]={'ok':True,'count':len(rows)}
        except Exception as e:
            status[name]={'ok':False,'error':str(e)[:250],'retained':name in feeds}
    run('CISA KEV',kev); run('NVD',nvd)
    ids=sorted({r['id'] for k in ('CISA KEV','NVD') for r in feeds.get(k,{}).get('rows',[])})
    run('FIRST EPSS',lambda:epss(ids))
    out={'schemaVersion':1,'attemptedAt':NOW.isoformat(),'feeds':feeds,'status':status,'notices':['CISA KEV: CC0','This product uses the NVD API but is not endorsed or certified by the NVD.','See EPSS at https://www.first.org/epss'],'scope':'Vulnerability signals only; no incident counts or country attribution.'}
    OUT.parent.mkdir(exist_ok=True)
    tmp=OUT.with_suffix('.tmp'); tmp.write_text(json.dumps(out,ensure_ascii=False,separators=(',',':'))); os.replace(tmp,OUT)
    print(json.dumps(status))
    return all(v['ok'] for v in status.values())
if __name__=='__main__':
    raise SystemExit(0 if main() else 1)
