// InfiniteTinkerer Rung 001: no external APIs, trackers or backend.
export const EPISODES = Object.freeze([
  {id:'jukebox',number:'001',title:'The Jukebox Hustle',symbol:'♫',caption:'INSERT 1 REPO',script:'A quarter slips into the jukebox. The record starts. The Gen.E-Wrist yanks the quarter back. The funk never stops.'},
  {id:'payphone',number:'002',title:'Long Distance to Infinity',symbol:'☎',caption:'CALLING THE COSMOS',script:'The payphone answers: Φ369 Labs, connecting you to the universe. The booth lights up. The coin comes back on its string.'},
  {id:'kitchen',number:'003',title:'The Never-Ending Cord',symbol:'∞',caption:'CORD LENGTH: ∞',script:'A kitchen phone cord stretches through the house, down the street, and into the stars. The quarter still finds a way home.'},
  {id:'switchboard',number:'004',title:'The Cosmic Switchboard',symbol:'Φ',caption:'ALL SYSTEMS CONNECTED',script:'One patch cable opens Break the Matrix, another The Interval. Soon the entire switchboard becomes a Fibonacci spiral.'}
]);
export const STAGES = Object.freeze([
  {title:'Imagine · 3 pieces',items:['Write down the real idea','Define what success would look like','Sketch a small, testable plan']},
  {title:'Build · 6 pieces',items:['Create a working starter','Finish a core feature','Handle at least one failure case','Make the experience usable','Run and document a test','Check accessibility and keyboard use']},
  {title:'Share · 9 pieces',items:['Explain it in a README','Choose an appropriate license','Capture a real demo','Write reproducible setup steps','Invite thoughtful feedback','Record a concrete improvement idea','Implement a useful refinement','Publish a tagged or named version','Share what worked and what failed']}
]);
export const MILESTONES = Object.freeze(STAGES.flatMap(stage=>stage.items));
export const STORAGE_KEY = 'phi369.infiniteTinkerer.rung001';
export const clamp = (value,min,max) => Math.max(min,Math.min(max,Number(value)||0));
export function completionCount(done){return Array.isArray(done)?done.filter(Boolean).slice(0,18).length:0}
export function earningsRate(earnings,views){const e=Number(earnings),v=Number(views);return Number.isFinite(e)&&Number.isFinite(v)&&e>=0&&v>0?(e/v)*1000:null}
export function escapeHTML(input){return String(input??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]))}
export function safeUrl(raw){try{const u=new URL(String(raw));return ['http:','https:'].includes(u.protocol)?u.href:null}catch{return null}}
export function safeFacebookGroupUrl(raw){const url=safeUrl(raw);if(!url)return null;const u=new URL(url);return /(^|\.)facebook\.com$/.test(u.hostname)||u.hostname==='fb.com'?url:null}
export function buildDraft({style='humor',topic='',question='',link=''}) {
  const subject=String(topic).trim(); if(!subject)throw new Error('Add a real topic or discovery first.');
  const leads={
    humor:'Somehow this seemed like a perfectly reasonable idea at the time. 😂',
    question:'Something has been rattling around in my brain...',
    build:'I made a thing. It actually works, which is mildly suspicious.',
    lesson:'I tried something, learned a few things, and wanted to share.'
  };
  const opener=leads[style]||leads.lesson;
  const prompt=String(question).trim()||'What would you try next?';
  const href=safeUrl(link);
  return [opener,'',subject,'',prompt,href?'\nProject/demo: '+href:'','\nΦ369 Labs · The Infinite Toking Tinkerer'].filter(Boolean).join('\n');
}
function defaults(){return {projectName:'',projectUrl:'',done:Array(18).fill(false),groups:[],drafts:[],logs:[]}}
export function normalizeState(input){
  const base=defaults();if(!input||typeof input!=='object')return base;
  const items=Array.isArray(input.done)?input.done.slice(0,18).map(v=>v===true):[];
  return {
    projectName:String(input.projectName||'').slice(0,100),
    projectUrl:safeUrl(input.projectUrl)||'',
    done:[...items,...Array(Math.max(0,18-items.length)).fill(false)],
    groups:Array.isArray(input.groups)?input.groups.slice(-50).filter(v=>v&&typeof v==='object'):[],
    drafts:Array.isArray(input.drafts)?input.drafts.slice(-50).filter(v=>v&&typeof v==='object'):[],
    logs:Array.isArray(input.logs)?input.logs.slice(-150).filter(v=>v&&typeof v==='object'):[]
  };
}
function load(){try{return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)))}catch{return defaults()}}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch{setStatus('draft-status','Browser storage is unavailable. Copy your draft to keep it.')}}
function $(id){return document.getElementById(id)}
function setStatus(id,msg){const el=$(id);if(el)el.textContent=msg}
function uuid(){return (globalThis.crypto&&crypto.randomUUID)?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2)}
let state;
let chosen=EPISODES[0],audioObjectUrl=null,sceneTimeout=null;
function renderEpisodes(){
  $('episodes').innerHTML=EPISODES.map(e=>`<button class="episode-button" type="button" data-id="${e.id}" aria-pressed="${chosen.id===e.id}"><span class="episode-index">${e.number}</span><span class="episode-title">${escapeHTML(e.title)}</span></button>`).join('');
  $('episode-label').textContent=`EPISODE ${chosen.number} · ${chosen.title.toUpperCase()}`;
  $('episode-script').textContent=chosen.script;
  $('stage-caption').textContent=chosen.caption;
  $('stage-demo').dataset.device=chosen.id;
  $('retro-device').querySelector('.device-screen').textContent=chosen.symbol;
  $('episodes').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{chosen=EPISODES.find(e=>e.id===b.dataset.id)||EPISODES[0];$('stage-demo').classList.remove('playing');renderEpisodes();setStatus('stage-status','Ready for the next terrible idea.')}))
}
function playOriginalChime(){
  try{
    const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
    const ctx=new C();[392,523.25,659.25].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+i*.09;o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.08,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.24);o.connect(g).connect(ctx.destination);o.start(t);o.stop(t+.25)});setTimeout(()=>ctx.close(),700)
  }catch{}
}
function playScene(){
  if(sceneTimeout)clearTimeout(sceneTimeout);
  const stage=$('stage-demo');stage.classList.remove('playing');void stage.offsetWidth;stage.classList.add('playing');
  setStatus('stage-status','CLINK! One repo spent...');
  const audio=$('scene-audio');if(audioObjectUrl){audio.currentTime=0;audio.play().catch(()=>setStatus('stage-status','Press play on your audio player to hear your track.'))}else playOriginalChime();
  sceneTimeout=setTimeout(()=>{stage.classList.remove('playing');setStatus('stage-status','ZZZZIP! Lil\' Phi Guy recovered. FEATURE, NOT A BUG.')},1400)
}
function renderMilestones(){
  let k=0;
  $('milestones').innerHTML=STAGES.map(stage=>`<div class="milestone-stage"><h3>${escapeHTML(stage.title)}</h3><div class="milestone-rows">${stage.items.map(text=>{const n=k++;return `<label class="milestone-check"><input type="checkbox" data-index="${n}" ${state.done[n]?'checked':''}><span>${escapeHTML(text)}</span></label>`}).join('')}</div></div>`).join('');
  $('milestones').querySelectorAll('input').forEach(box=>box.addEventListener('change',()=>{state.done[Number(box.dataset.index)]=box.checked;save();updateMint()}));
  updateMint();
}
function updateMint(){
  const n=completionCount(state.done),pct=n/18*100;
  $('piece-count').textContent=String(n);$('mint-ring').style.background=`conic-gradient(#f2d177 ${pct}%,#2b4234 ${pct}%)`;
  $('mint-ring').setAttribute('aria-label',`${n} of 18 pieces collected`);
  $('progress-fill').style.width=pct+'%';$('mint-orb').classList.toggle('minted',n===18);
  $('mint-message').textContent=n===18?'CLINK! A complete Lil\' Phi Guy! One symbolic 1 REPO achievement unlocked.':n>=9?'Your invention is taking shape. Keep building and sharing.':n>=3?'A spark has become a plan. Now bring it to life.':'A few sparks away from something wonderful.';
}
function renderDrafts(){
  $('draft-queue').innerHTML=state.drafts.length?state.drafts.slice().reverse().map(d=>`<div class="local-item"><div><strong>${escapeHTML(String(d.title||'Draft').slice(0,110))}</strong><p>${escapeHTML(String(d.content||'').slice(0,170))}</p><small>Saved locally · ${escapeHTML(d.date||'')}</small></div><button type="button" data-draft="${escapeHTML(d.id)}" aria-label="Remove draft">×</button></div>`).join(''):'<p class="fine-print">No saved drafts yet.</p>';
  $('draft-queue').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.drafts=state.drafts.filter(d=>d.id!==b.dataset.draft);save();renderDrafts()}));
}
function renderGroups(){
  $('group-list').innerHTML=state.groups.length?state.groups.slice().reverse().map(g=>`<div class="local-item"><div><strong>${escapeHTML(String(g.name||'').slice(0,120))}</strong><p>${escapeHTML(String(g.fit||'').slice(0,220))}</p><small>${g.rulesChecked?'Rules reviewed by you':'Rules not yet reviewed'}</small>${safeFacebookGroupUrl(g.url)?`<p><a href="${escapeHTML(safeFacebookGroupUrl(g.url))}" target="_blank" rel="noopener noreferrer">Visit group ↗</a></p>`:''}</div><button type="button" data-group="${escapeHTML(g.id)}" aria-label="Remove group note">×</button></div>`).join(''):'<p class="fine-print">Add your first candidate group above.</p>';
  $('group-list').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{state.groups=state.groups.filter(g=>g.id!==b.dataset.group);save();renderGroups()}));
}
function renderMetrics(){
  const totals={};for(const log of state.logs){if(!totals[log.slot])totals[log.slot]={views:0,earnings:0,count:0};const t=totals[log.slot];t.views+=Number(log.views)||0;t.earnings+=Number(log.earnings)||0;t.count++}
  const slots=['Morning','Midday','Evening'];
  const cards=slots.map(slot=>{const t=totals[slot];if(!t)return `<div class="local-item"><div><strong>${slot}</strong><p>No samples yet.</p></div></div>`;const rate=earningsRate(t.earnings,t.views);return `<div class="local-item"><div><strong>${slot} · ${t.count} sample(s)</strong><p>${t.views.toLocaleString()} qualified views · $${t.earnings.toFixed(2)} earned</p><small>${rate===null?'Earnings / 1k qualified views: n/a':'$'+rate.toFixed(2)+' per 1k qualified views'}</small></div></div>`}).join('');
  const latest=state.logs.slice(-4).reverse().map(l=>`<div class="local-item"><div><strong>${escapeHTML(String(l.date))} · ${escapeHTML(String(l.slot))}</strong><p>${escapeHTML(String(l.note||'').slice(0,180))}</p><small>${Number(l.views).toLocaleString()} qualified views / $${Number(l.earnings).toFixed(2)}</small></div></div>`).join('');
  $('metrics-results').innerHTML=cards+(latest?'<h4>Most recent logs</h4>'+latest:'')+'<p class="fine-print">Descriptive totals only, not proof of the best posting time. Test comparable content and account for small samples.</p>';
}
function init(){
  state=load();renderEpisodes();renderMilestones();renderDrafts();renderGroups();renderMetrics();
  $('project-name').value=state.projectName;$('project-url').value=state.projectUrl;
  $('project-name').addEventListener('input',e=>{state.projectName=e.target.value.slice(0,100);save()});
  $('project-url').addEventListener('change',e=>{state.projectUrl=safeUrl(e.target.value)||'';save()});
  $('reset-pieces').addEventListener('click',()=>{if(!confirm('Start a new coin? Your current 18-piece checklist and project name will be cleared.'))return;state.done=Array(18).fill(false);state.projectName='';state.projectUrl='';$('project-name').value='';$('project-url').value='';save();renderMilestones()});
  $('play-scene').addEventListener('click',playScene);
  $('track-input').addEventListener('change',e=>{if(audioObjectUrl)URL.revokeObjectURL(audioObjectUrl);const file=e.target.files?.[0];const audio=$('scene-audio');audioObjectUrl=file?URL.createObjectURL(file):null;audio.hidden=!file;if(file)audio.src=audioObjectUrl;else audio.removeAttribute('src')});
  $('draft-form').addEventListener('submit',e=>{e.preventDefault();try{const raw=Object.fromEntries(new FormData(e.currentTarget).entries());$('draft-output').value=buildDraft(raw);setStatus('draft-status','Draft generated. Edit freely, then copy or save it.')}catch(err){setStatus('draft-status',err.message)}});
  $('copy-draft').addEventListener('click',async()=>{const value=$('draft-output').value;if(!value.trim()){setStatus('draft-status','Nothing to copy yet.');return}try{await navigator.clipboard.writeText(value);setStatus('draft-status','Copied. Publish manually when ready.')}catch{setStatus('draft-status','Clipboard unavailable. Select the text and copy it manually.')}});
  $('save-draft').addEventListener('click',()=>{const content=$('draft-output').value.trim();if(!content){setStatus('draft-status','Write a draft first.');return}state.drafts.push({id:uuid(),title:content.split('\n')[0],content,date:new Date().toLocaleDateString()});state.drafts=state.drafts.slice(-50);save();renderDrafts();setStatus('draft-status','Saved locally. No Facebook post was created.')});
  $('group-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,x=Object.fromEntries(new FormData(f).entries());const url=x.url?safeFacebookGroupUrl(x.url):null;if(x.url&&!url){alert('Please use a Facebook group URL, or leave the link blank.');return}state.groups.push({id:uuid(),name:String(x.name).trim().slice(0,120),url:url||'',fit:String(x.fit||'').slice(0,220),rulesChecked:x.rulesChecked==='on'});state.groups=state.groups.slice(-50);save();renderGroups();f.reset()});
  $('metric-date').value=new Date().toLocaleDateString('en-CA');
  $('metric-form').addEventListener('submit',e=>{e.preventDefault();const f=e.currentTarget,x=Object.fromEntries(new FormData(f).entries());const views=Number(x.views),earnings=Number(x.earnings);if(!Number.isSafeInteger(views)||views<0||!Number.isFinite(earnings)||earnings<0||!x.date){return}state.logs.push({id:uuid(),date:String(x.date),slot:['Morning','Midday','Evening'].includes(x.slot)?x.slot:'Morning',views,earnings,note:String(x.note||'').slice(0,180)});state.logs=state.logs.slice(-150);save();renderMetrics();f.reset();$('metric-date').value=new Date().toLocaleDateString('en-CA')});
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init()}
