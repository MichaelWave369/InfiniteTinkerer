// Lil' Phi Guy Reel Studio: an original 8-second animated 9:16 browser export.
// No services, tracking, or project uploads. Optional audio is user-selected and stays local.
import {EPISODES} from './app.js';

export const REEL_LENGTH = 8;
export const REEL_WIDTH = 540;
export const REEL_HEIGHT = 960;
const CUES = Object.freeze({
  jukebox:['INSERT 1 REPO','LET THE FUNK PLAY','ZZZZIP! COIN RECOVERED','FEATURE, NOT A BUG'],
  payphone:['INSERT 1 REPO','CALLING THE COSMOS','LONG DISTANCE: INFINITE','QUARTER RECOVERED'],
  kitchen:['ONE LITTLE QUARTER','CORD LENGTH: ∞','REEL IT ALL BACK','FEATURE, NOT A BUG'],
  switchboard:['PATCH INTO THE FIELD','ALL SYSTEMS CONNECTED','RETRIEVING 1 REPO','IN CODE WE TRUST']
});
const SCENES = new Set(EPISODES.map(s=>s.id));

export function cueAt(id, seconds) {
  const t=Math.max(0,Number(seconds)||0);
  const phase=t<1.4?0:t<4.1?1:t<5.8?2:3;
  return {phase:['insert','activate','retrieve','end'][phase], text:(CUES[SCENES.has(id)?id:'jukebox'])[phase]};
}
export function coinMotion(seconds) {
  const t=Math.max(0,Math.min(REEL_LENGTH,Number(seconds)||0));
  const mix=(a,b,p)=>a+(b-a)*Math.max(0,Math.min(1,p));
  if(t<1.4) return {x:mix(175,359,t/1.4),y:mix(644,566,t/1.4),radius:mix(66,21,t/1.4),angle:t*4};
  if(t<4.1) return {x:359,y:566,radius:21,angle:t*4};
  if(t<5.8) return {x:mix(359,175,(t-4.1)/1.7),y:mix(566,644,(t-4.1)/1.7),radius:mix(21,66,(t-4.1)/1.7),angle:t*6};
  return {x:175,y:644-6*Math.sin(t*5),radius:66,angle:.05*Math.sin(t*4)};
}
export function preferredMimeType(supported) {
  const options=['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4'];
  return options.find(type=>supported(type))||null;
}
function rounded(ctx,x,y,w,h,r,fill,stroke,lineWidth=1) {
  const R=Math.min(r,w/2,h/2);
  ctx.beginPath();ctx.moveTo(x+R,y);ctx.arcTo(x+w,y,x+w,y+h,R);
  ctx.arcTo(x+w,y+h,x,y+h,R);ctx.arcTo(x,y+h,x,y,R);
  ctx.arcTo(x,y,x+w,y,R);ctx.closePath();
  if(fill){ctx.fillStyle=fill;ctx.fill()}
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke()}
}
function text(ctx,s,x,y,size=22,color='#f4e1a6',align='center',font='system-ui') {
  ctx.font='800 '+size+'px '+font;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(s,x,y);
}
function fibonacci(ctx,t) {
  ctx.save();ctx.translate(265,460);ctx.rotate(t*.18);ctx.beginPath();
  for(let i=0;i<245;i++){const theta=i*.052;const radius=3*Math.exp(theta*.25);const x=radius*Math.cos(theta),y=radius*Math.sin(theta);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
  ctx.strokeStyle='rgba(242,210,117,.30)';ctx.lineWidth=3;ctx.stroke();ctx.restore();
}
function drawBackdrop(ctx,t,id) {
  const g=ctx.createLinearGradient(0,0,540,960);
  g.addColorStop(0,'#062519');g.addColorStop(.55,id==='payphone'?'#16334b':'#0c3326');g.addColorStop(1,'#05130e');
  ctx.fillStyle=g;ctx.fillRect(0,0,540,960);
  for(let i=0;i<48;i++){const x=(i*97+33)%540,y=(i*193+53)%960;ctx.fillStyle='rgba(186,237,193,'+(.11+.18*(.5+.5*Math.sin(t*1.7+i)))+')';ctx.fillRect(x,y,i%7===0?3:2,i%7===0?3:2)}
  ctx.strokeStyle='rgba(126,191,145,.16)';ctx.lineWidth=1;
  for(let i=0;i<10;i++){const y=680+i*34;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(540,y);ctx.stroke()}
  fibonacci(ctx,t);
  rounded(ctx,25,22,490,93,13,'rgba(4,22,17,.83)','#547253',2);
  text(ctx,'THE INFINITE',270,58,28,'#f5e9b3');
  text(ctx,'TOKING TINKERER',270,93,30,'#88f0a8');
  rounded(ctx,26,855,488,78,12,'rgba(5,25,18,.88)','#53714b',2);
  text(ctx,'Φ369 LABS  ·  ENTER THE FIELD',270,887,23,'#f6dc8d');
  text(ctx,'ONE COIN · INFINITE POSSIBILITIES',270,918,15,'#b6e9c1');
}
function drawRobot(ctx,x,y,wiggle) {
  ctx.save();ctx.translate(x,y+wiggle);
  rounded(ctx,-29,-22,58,53,11,'#d5b76b','#f6d991',3);
  ctx.fillStyle='#0f392b';ctx.beginPath();ctx.arc(-10,0,6,0,Math.PI*2);ctx.arc(10,0,6,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#183d2d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,9,10,0,Math.PI);ctx.stroke();
  ctx.strokeStyle='#e7cb80';ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(0,-36);ctx.stroke();
  ctx.fillStyle='#7cf1a2';ctx.beginPath();ctx.arc(0,-39,5,0,Math.PI*2);ctx.fill();ctx.restore();
}
function drawDevice(ctx,id,t,phase) {
  const active=phase==='activate';
  const pulse=active?(.7+.3*Math.sin(t*18)):.5;
  ctx.save();ctx.shadowColor=active?'#60ff9e':'#221809';ctx.shadowBlur=active?28:12;
  if(id==='jukebox'){
    rounded(ctx,150,239,250,400,98,'#4c2722','#f2c873',10);
    rounded(ctx,178,268,194,300,80,'#10664d','#e6b268',8);
    ctx.shadowBlur=0;
    for(let i=0;i<8;i++){ctx.fillStyle=i%2?'#e8bc60':'#193b30';ctx.fillRect(196,324+i*25,160,12)}
    text(ctx,'♫',275,465,105,active?'#a7ffc7':'#f6d27e');
    rounded(ctx,315,548,65,20,6,'#081e19','#e8ca76',3);
    for(let i=0;i<5;i++){text(ctx,'♪',105+i*87,192+(i%2)*39-15*Math.sin(t*4+i),32,active?'#a6ffc2':'#8b9c74')}
  }else if(id==='payphone'){
    rounded(ctx,145,229,255,430,18,'#22525a','#8ababa',8);
    rounded(ctx,163,249,220,347,10,'#0a242a','#b5dbd1',4);
    rounded(ctx,205,328,135,175,13,'#43777a','#bad8cf',6);
    rounded(ctx,226,361,96,66,9,'#092e32','#7eaeb0',4);
    text(ctx,'☎',273,419,59,active?'#b2ffcb':'#e4e8cf');
    text(ctx,'Φ',273,479,30,'#fff0a0');
    if(active){ctx.globalAlpha=.3+.5*pulse;ctx.fillStyle='#85ffb0';ctx.beginPath();ctx.ellipse(273,512,93,134,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
    rounded(ctx,329,541,48,16,4,'#091f20','#f2db8a',2);
  }else if(id==='kitchen'){
    rounded(ctx,153,302,245,320,60,'#6c986d','#d1df9f',8);
    rounded(ctx,178,344,194,160,23,'#3e654b','#c0d09a',5);
    for(let row=0;row<3;row++)for(let col=0;col<3;col++){ctx.fillStyle='#d9d2a3';ctx.beginPath();ctx.arc(218+col*45,380+row*41,9,0,Math.PI*2);ctx.fill()}
    ctx.strokeStyle=active?'#d3ffa0':'#c9b17a';ctx.lineWidth=9;ctx.beginPath();
    for(let i=0;i<18;i++){let x=194+i*11,y=545+19*Math.sin(i*2+t*4);if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.stroke();
    rounded(ctx,329,563,49,16,5,'#142b1c','#f4d898',2);
  }else{
    rounded(ctx,112,302,315,310,14,'#604128','#e7c47e',8);
    rounded(ctx,128,320,283,270,9,'#251f16','#a77f4a',3);
    for(let row=0;row<5;row++)for(let col=0;col<8;col++){
      const x=150+col*33,y=349+row*42;
      ctx.fillStyle=(col+row)%3===0?'#8cecb4':'#e0bd77';
      ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();
    }
    if(active){ctx.strokeStyle='#a2f7b9';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(155,355);ctx.bezierCurveTo(430,320,80,550,383,528);ctx.stroke()}
    rounded(ctx,331,552,54,18,4,'#0d1b15','#eed383',2);
  }
  ctx.restore();
}
function drawHandAndString(ctx,coin,t) {
  ctx.save();
  ctx.strokeStyle='#e7d28e';ctx.lineWidth=2;
  ctx.setLineDash([6,4]);ctx.beginPath();ctx.moveTo(115,674);
  ctx.bezierCurveTo(95,520,coin.x-46,coin.y+58,coin.x,coin.y);ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle='#9e6856';rounded(ctx,28,676,130,53,23,'#a8705d','#d3a18a',3);
  rounded(ctx,44,631,85,61,17,'#2b4b3e','#a3c691',6);
  rounded(ctx,56,641,60,37,8,'#0b241e','#9acc92',2);
  text(ctx,'3·6·9',86,667,17,'#83edaa');
  ctx.restore();
}
export function renderFrame(ctx,seconds,id='jukebox',coinImage=null) {
  const t=Math.max(0,Math.min(REEL_LENGTH,Number(seconds)||0));
  const activeId=SCENES.has(id)?id:'jukebox',cue=cueAt(activeId,t),coin=coinMotion(t);
  ctx.clearRect(0,0,REEL_WIDTH,REEL_HEIGHT);
  drawBackdrop(ctx,t,activeId);
  text(ctx,activeId.toUpperCase()+'  /  EPISODE '+String(EPISODES.findIndex(e=>e.id===activeId)+1).padStart(3,'0'),270,158,18,'#f1d788');
  drawRobot(ctx,95,258,Math.sin(t*2)*7);
  drawRobot(ctx,446,258,Math.cos(t*2)*7);
  drawDevice(ctx,activeId,t,cue.phase);
  drawHandAndString(ctx,coin,t);
  ctx.save();ctx.translate(coin.x,coin.y);ctx.rotate(coin.angle);
  ctx.shadowColor='#edda8c';ctx.shadowBlur=17;ctx.beginPath();ctx.arc(0,0,coin.radius+4,0,Math.PI*2);ctx.fillStyle='#dbad57';ctx.fill();
  ctx.beginPath();ctx.arc(0,0,coin.radius,0,Math.PI*2);ctx.clip();
  if(coinImage&&coinImage.complete&&coinImage.naturalWidth>0)ctx.drawImage(coinImage,-coin.radius,-coin.radius,coin.radius*2,coin.radius*2);
  else{ctx.fillStyle='#115b38';ctx.fillRect(-coin.radius,-coin.radius,coin.radius*2,coin.radius*2);text(ctx,'Φ',0,coin.radius*.45,coin.radius*1.5,'#ffe4a2')}
  ctx.restore();
  rounded(ctx,31,760,478,62,10,'rgba(4,25,20,.93)','#62865f',2);
  text(ctx,cue.text,270,800,22,'#f8e6b0');
  return cue;
}

function setMessage(message){const el=document.getElementById('reel-status');if(el)el.textContent=message}
function onReady(){
  const canvas=document.getElementById('reel-canvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');if(!ctx){setMessage('Canvas drawing is unavailable in this browser.');return}
  const select=document.getElementById('reel-episode'),preview=document.getElementById('reel-preview'),exportButton=document.getElementById('reel-export');
  const art=document.getElementById('reel-coin-file'),song=document.getElementById('reel-song-file');
  EPISODES.forEach(e=>{const opt=document.createElement('option');opt.value=e.id;opt.textContent=e.number+' · '+e.title;select.append(opt)});
  let coinImage=new Image(),customImageUrl=null,audioFileUrl=null,busy=false,frameHandle=null,previousCue='',playingAudio=null;
  coinImage.onload=()=>{if(!busy)renderFrame(ctx,0,select.value,coinImage)};
  coinImage.src=window.getSelectedPhiCoinArtwork?.()||'./assets/lil-phi-guy.svg';
  window.addEventListener('phi-coin-selected',event=>{
    const src=event.detail?.src;
    if(typeof src!=='string'||busy)return;
    const newImage=new Image();
    newImage.onload=()=>{coinImage=newImage;renderFrame(ctx,0,select.value,coinImage);setMessage('Coin Vault artwork loaded in the Reel Studio.')};
    newImage.src=src;
  });
  renderFrame(ctx,0,select.value,coinImage);
  select.addEventListener('change',()=>{if(!busy)renderFrame(ctx,0,select.value,coinImage)});
  art.addEventListener('change',()=>{
    const file=art.files&&art.files[0];if(!file)return;
    if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){setMessage('Choose a PNG, JPG, or WebP coin image under 12 MB.');art.value='';return}
    const url=URL.createObjectURL(file),next=new Image();
    next.onload=()=>{if(customImageUrl)URL.revokeObjectURL(customImageUrl);customImageUrl=url;coinImage=next;renderFrame(ctx,0,select.value,coinImage);setMessage('Custom coin loaded in this browser only.')};
    next.onerror=()=>{URL.revokeObjectURL(url);setMessage('That coin image could not be opened.')};
    next.src=url;
  });
  song.addEventListener('change',()=>{
    const file=song.files&&song.files[0];if(audioFileUrl){URL.revokeObjectURL(audioFileUrl);audioFileUrl=null}
    if(!file){setMessage('Video exports without a soundtrack unless you choose one.');return}
    if(!file.type.startsWith('audio/')||file.size>75*1024*1024){song.value='';setMessage('Choose an original audio file under 75 MB.');return}
    audioFileUrl=URL.createObjectURL(file);setMessage('Original soundtrack selected locally. It will be embedded in supported exports.');
  });
  const supported=typeof MediaRecorder!=='undefined'&&typeof canvas.captureStream==='function';
  const type=supported?preferredMimeType(v=>MediaRecorder.isTypeSupported(v)):null;
  if(!type){exportButton.disabled=true;exportButton.title='Video recording is not available in this browser. Try current Chrome or Edge.'}
  const setBusy=(value)=>{busy=value;preview.disabled=value;exportButton.disabled=value||!type;select.disabled=value;art.disabled=value;song.disabled=value};
  async function play(record) {
    if(busy)return;
    setBusy(true);previousCue='';let rec=null,mixedStream=null,audioCtx=null,clip=null,chunks=[],mime=type;
    let recordingStopped=false;
    try{
      const videoStream=record?canvas.captureStream(24):null;
      mixedStream=videoStream;
      if(audioFileUrl){
        clip=new Audio(audioFileUrl);clip.preload='auto';
        const AudioContextType=window.AudioContext||window.webkitAudioContext;
        if(record&&AudioContextType){
          audioCtx=new AudioContextType();
          const source=audioCtx.createMediaElementSource(clip),out=audioCtx.createMediaStreamDestination();
          source.connect(out);source.connect(audioCtx.destination);
          mixedStream=new MediaStream([...videoStream.getVideoTracks(),...out.stream.getAudioTracks()]);
          audioCtx.resume().catch(()=>{});
        }
      }
      if(record){
        rec=new MediaRecorder(mixedStream,{mimeType:mime,videoBitsPerSecond:2600000});
        rec.addEventListener('dataavailable',e=>{if(e.data&&e.data.size>0)chunks.push(e.data)});
        rec.addEventListener('error',()=>setMessage('Recording failed. Try a different browser or smaller image.'));
        rec.addEventListener('stop',()=>{
          recordingStopped=true;
          if(chunks.length){
            const output=new Blob(chunks,{type:mime});const url=URL.createObjectURL(output),a=document.createElement('a');
            const ext=mime.startsWith('video/mp4')?'mp4':'webm';
            a.href=url;a.download='Lil-Phi-Guy-'+select.value+'-8s.'+ext;document.body.append(a);a.click();a.remove();
            setTimeout(()=>URL.revokeObjectURL(url),30000);
            setMessage('Video exported! The quarter has officially escaped the browser.');
          }else setMessage('No video data was recorded. Try a different browser.');
          videoStream.getTracks().forEach(track=>track.stop());
          if(mixedStream!==videoStream)mixedStream.getTracks().forEach(track=>track.stop());
          if(audioCtx)audioCtx.close().catch(()=>{});
          setBusy(false);
        });
        rec.start(250);
      }
      if(clip){clip.currentTime=0;clip.play().catch(()=>setMessage('Playback was blocked. Check browser audio permissions.'))}
      const start=performance.now();
      function step(now){
        const elapsed=Math.min(REEL_LENGTH,(now-start)/1000),cue=renderFrame(ctx,elapsed,select.value,coinImage);
        if(cue.phase!==previousCue){previousCue=cue.phase;setMessage((record?'Recording: ':'Preview: ')+cue.text)}
        if(elapsed<REEL_LENGTH){frameHandle=requestAnimationFrame(step);return}
        if(clip)clip.pause();
        if(record&&rec&&rec.state!=='inactive'){rec.stop();return}
        if(!record){setBusy(false);setMessage('Preview complete. ZZZZIP! Ready for another run.')}
      }
      frameHandle=requestAnimationFrame(step);
    }catch(err){
      if(frameHandle)cancelAnimationFrame(frameHandle);
      if(clip)clip.pause();
      if(rec&&rec.state!=='inactive'){try{rec.stop()}catch{}}
      if(mixedStream)mixedStream.getTracks().forEach(track=>track.stop());
      if(audioCtx)audioCtx.close().catch(()=>{});
      setBusy(false);
      setMessage('Could not render this clip: '+String(err&&err.message?err.message:err));
    }
  }
  preview.addEventListener('click',()=>play(false));
  exportButton.addEventListener('click',()=>play(true));
  document.getElementById('reel-reset').addEventListener('click',()=>{
    if(busy)return;art.value='';if(customImageUrl)URL.revokeObjectURL(customImageUrl);customImageUrl=null;coinImage=new Image();coinImage.onload=()=>renderFrame(ctx,0,select.value,coinImage);coinImage.src=window.getSelectedPhiCoinArtwork?.()||'./assets/lil-phi-guy.svg';setMessage('Reverted to the coin selected in your Coin Vault.')
  });
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onReady);else onReady()}
