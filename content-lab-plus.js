// Privacy-first backup, restore, and descriptive posting-time experiments.
import {STORAGE_KEY,normalizeState,safeFacebookGroupUrl,earningsRate} from './app.js';
import {COIN_VAULT_KEY,normalizeCoinVault} from './coin-vault.js';
export const BACKUP_SCHEMA='phi369.infiniteTinkerer.backup.v1';
export const SLOTS=['Morning','Midday','Evening'];

export function cleanState(input){
 const state=normalizeState(input);
 state.groups=state.groups.map((g,i)=>({
  id:String(g.id??i).slice(0,90),name:String(g.name||'').slice(0,120),
  url:safeFacebookGroupUrl(g.url)||'',fit:String(g.fit||'').slice(0,220),
  rulesChecked:g.rulesChecked===true
 }));
 state.drafts=state.drafts.map((d,i)=>({
  id:String(d.id??i).slice(0,90),title:String(d.title||'').slice(0,110),
  content:String(d.content||'').slice(0,10000),date:String(d.date||'').slice(0,45)
 }));
 state.logs=state.logs.map((l,i)=>{
  const views=Number(l.views),earnings=Number(l.earnings);
  return {id:String(l.id??i).slice(0,90),date:/^\d{4}-\d{2}-\d{2}$/.test(String(l.date))?String(l.date):'',
   slot:SLOTS.includes(l.slot)?l.slot:'Morning',
   views:Number.isSafeInteger(views)&&views>=0?views:0,
   earnings:Number.isFinite(earnings)&&earnings>=0?Math.round(earnings*100)/100:0,
   note:String(l.note||'').slice(0,180)};
 });
 state.projectName=String(state.projectName||'').slice(0,100);
 return state;
}
export function createBackup(state,coins,now=''){
 return {schema:BACKUP_SCHEMA,createdAt:now||new Date().toISOString(),
  note:'Local private backup. Includes your saved coin images, drafts, community notes and metrics.',
  data:{state:cleanState(state),coins:normalizeCoinVault(coins)}};
}
export function parseBackup(raw){
 const input=typeof raw==='string'?JSON.parse(raw):raw;
 if(!input||input.schema!==BACKUP_SCHEMA||!input.data||
  typeof input.data!=='object'||!input.data.state||typeof input.data.state!=='object'||
  !input.data.coins||typeof input.data.coins!=='object')throw Error('Not a recognized InfiniteTinkerer backup.');
 return {state:cleanState(input.data.state),coins:normalizeCoinVault(input.data.coins)};
}
export function slotSummaries(logs){
 const summary=SLOTS.map(slot=>({slot,count:0,views:0,earnings:0,rate:null}));
 for(const log of Array.isArray(logs)?logs:[]){
  if(!log||!SLOTS.includes(log.slot))continue;
  const views=Number(log.views),earnings=Number(log.earnings);
  if(!Number.isSafeInteger(views)||views<0||!Number.isFinite(earnings)||earnings<0)continue;
  const result=summary[SLOTS.indexOf(log.slot)];
  result.count++;result.views+=views;result.earnings+=earnings;
 }
 return summary.map(item=>({...item,rate:earningsRate(item.earnings,item.views)}));
}
export function nextTestSlot(logs){
 const list=slotSummaries(logs);
 const least=Math.min(...list.map(s=>s.count));
 return list.find(s=>s.count===least).slot;
}
export function sufficientSamples(logs,minSamples=3,minViews=1000){
 return slotSummaries(logs).every(s=>s.count>=minSamples&&s.views>=minViews);
}
function load(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function saveFile(text,filename,type){
 const blob=new Blob([text],{type});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');
 a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),15000);
}
function csvField(value){let cell=String(value??'');if(/^[\s]*[=+@\-]/.test(cell))cell="'"+cell;return '"'+cell.replace(/"/g,'""')+'"'}
export function metricsCsv(logs){
 const rows=['"date","slot","qualified_views","earnings_usd","note"'];
 for(const log of cleanState({logs}).logs)rows.push(
  [log.date,log.slot,log.views,log.earnings.toFixed(2),log.note].map(csvField).join(',')
 );
 return rows.join('\r\n')+'\r\n';
}
function ready(){
 const exportBtn=document.getElementById('export-lab-backup');
 if(!exportBtn)return;
 const importInput=document.getElementById('import-lab-backup');
 const status=document.getElementById('lab-backup-status');
 const insights=document.getElementById('time-insights');
 function renderInsights(){
  const saved=cleanState(load(STORAGE_KEY));
  const rows=slotSummaries(saved.logs);
  const ready=sufficientSamples(saved.logs);
  const next=nextTestSlot(saved.logs);
  insights.textContent='';
  const heading=document.createElement('p');heading.className='small-strong';
  heading.textContent=ready?'All three time windows have baseline samples. Compare cautiously: topics and audiences may differ.':
    'Keep testing. Each time slot needs at least three posts and 1,000 qualified views before a preliminary comparison.';
  insights.append(heading);
  const grid=document.createElement('div');grid.className='insight-grid';
  for(const s of rows){
   const card=document.createElement('div');card.className='insight-card';
   const title=document.createElement('strong');title.textContent=s.slot;
   const counts=document.createElement('span');counts.textContent=s.count+' logs · '+s.views.toLocaleString()+' qualified views';
   const rate=document.createElement('small');rate.textContent=s.rate===null?'Rate not available':'$'+s.rate.toFixed(2)+' earned / 1k qualified views';
   card.append(title,counts,rate);grid.append(card);
  }
  insights.append(grid);
  const nextMessage=document.createElement('p');nextMessage.className='reel-status';
  nextMessage.textContent='Suggested next test window: '+next+' (the least-sampled slot). This balances the experiment, not a claim about the algorithm.';
  insights.append(nextMessage);
 }
 exportBtn.addEventListener('click',()=>{
  try{
   const backup=createBackup(load(STORAGE_KEY),load(COIN_VAULT_KEY));
   saveFile(JSON.stringify(backup,null,2),'InfiniteTinkerer-backup-'+new Date().toISOString().slice(0,10)+'.json','application/json');
   status.textContent='Backup exported. It includes saved coin art, drafts, milestones, groups, and metrics. Keep this private.';
  }catch(e){status.textContent='Backup failed: '+String(e.message||e)}
 });
 document.getElementById('export-lab-csv').addEventListener('click',()=>{
  const state=cleanState(load(STORAGE_KEY));
  saveFile(metricsCsv(state.logs),'InfiniteTinkerer-metrics.csv','text/csv;charset=utf-8');
  status.textContent='Metrics CSV exported. No data left your browser except the downloaded file.';
 });
 importInput.addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>3*1024*1024){status.textContent='Backup must be under 3 MB.';importInput.value='';return}
  try{
   const parsed=parseBackup(await file.text());
   const yes=confirm('Restore this backup? It replaces the current milestones, drafts, groups, timing logs, and saved coin artwork in THIS browser. Export your current data first.');
   if(!yes){status.textContent='Restore cancelled; nothing was changed.';return}
   const previousState=localStorage.getItem(STORAGE_KEY),previousCoins=localStorage.getItem(COIN_VAULT_KEY);
   try{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(parsed.state));
    localStorage.setItem(COIN_VAULT_KEY,JSON.stringify(parsed.coins));
   }catch(e){
    try{if(previousState===null)localStorage.removeItem(STORAGE_KEY);else localStorage.setItem(STORAGE_KEY,previousState);
      if(previousCoins===null)localStorage.removeItem(COIN_VAULT_KEY);else localStorage.setItem(COIN_VAULT_KEY,previousCoins)}catch{}
    throw Error('Browser storage is unavailable or full; restore was rolled back if possible.');
   }
   status.textContent='Backup restored. Reloading to show restored information...';
   window.location.reload();
  }catch(e){status.textContent='Restore failed: '+String(e.message||e)}
  finally{importInput.value=''}
 });
 const metric=document.getElementById('metric-form');
 if(metric)metric.addEventListener('submit',()=>queueMicrotask(renderInsights));
 renderInsights();
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready()}
