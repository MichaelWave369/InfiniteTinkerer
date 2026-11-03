// One-time local imports for the creator's two portrait-coin designs.
// No network or server. Data is resized before being saved in localStorage.
export const COIN_VAULT_KEY='phi369.infiniteTinkerer.coinVault.v1';
export const COIN_SLOTS=['classic','fibonacci'];
export const DEFAULT_COIN='./assets/lil-phi-guy.svg';
export function validCoinDataUrl(data){
 return typeof data==='string'&&data.length>100&&data.length<=650000&&
   /^data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(data);
}
export function normalizeCoinVault(raw){
 const base={active:'default',classic:'',fibonacci:''};
 if(!raw||typeof raw!=='object')return base;
 for(const slot of COIN_SLOTS)if(validCoinDataUrl(raw[slot]))base[slot]=raw[slot];
 if(COIN_SLOTS.includes(raw.active)&&base[raw.active])base.active=raw.active;
 return base;
}
export function getCoinSource(vault){
 const data=normalizeCoinVault(vault);
 return data.active==='default'?DEFAULT_COIN:(data[data.active]||DEFAULT_COIN);
}
function getSaved(){
 try{return normalizeCoinVault(JSON.parse(localStorage.getItem(COIN_VAULT_KEY)))}catch{return normalizeCoinVault(null)}
}
function setSaved(vault){
 const safe=normalizeCoinVault(vault);
 try{localStorage.setItem(COIN_VAULT_KEY,JSON.stringify(safe));return true}
 catch{return false}
}
function ready(){
 const selector=document.getElementById('coin-vault-selector');
 if(!selector)return;
 const classic=document.getElementById('coin-vault-classic'),fibonacci=document.getElementById('coin-vault-fibonacci');
 const status=document.getElementById('coin-vault-status'),clear=document.getElementById('coin-vault-reset');
 let vault=getSaved();
 const statusUpdate=message=>{status.textContent=message};
 const apply=()=>{
  const src=getCoinSource(vault);
  document.querySelectorAll('.hero-coin,.stage-quarter').forEach(image=>{image.src=src});
  selector.value=vault.active;
  selector.querySelector('option[value=classic]').disabled=!vault.classic;
  selector.querySelector('option[value=fibonacci]').disabled=!vault.fibonacci;
  window.dispatchEvent(new CustomEvent('phi-coin-selected',{detail:{src}}));
 };
 window.getSelectedPhiCoinArtwork=()=>getCoinSource(vault);
 selector.addEventListener('change',()=>{
  vault.active=selector.value;
  if(!setSaved(vault)){statusUpdate('Could not save selection in browser storage.');return}
  apply();statusUpdate('Coin selection saved locally. Open the Reel Studio to see it in the scene.');
 });
 async function install(file,slot){
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12*1024*1024){
   statusUpdate('Choose a JPG, PNG or WebP under 12 MB.');return;
  }
  const blobUrl=URL.createObjectURL(file);const img=new Image();
  img.onerror=()=>{URL.revokeObjectURL(blobUrl);statusUpdate('The image could not be decoded.')};
  img.onload=()=>{
   URL.revokeObjectURL(blobUrl);
   const c=document.createElement('canvas');c.width=720;c.height=720;
   const ctx=c.getContext('2d');if(!ctx){statusUpdate('Canvas unavailable.');return}
   const side=Math.min(img.naturalWidth,img.naturalHeight),sx=(img.naturalWidth-side)/2,sy=(img.naturalHeight-side)/2;
   ctx.drawImage(img,sx,sy,side,side,0,0,720,720);
   let encoded=c.toDataURL('image/webp',.8);
   if(!encoded.startsWith('data:image/webp'))encoded=c.toDataURL('image/jpeg',.8);
   if(!validCoinDataUrl(encoded)){statusUpdate('This image is too large for the local coin vault. Try a smaller image.');return}
   const candidate={...vault,[slot]:encoded,active:slot};
   if(!setSaved(candidate)){statusUpdate('Browser storage is full or disabled. Try backing up and clearing older drafts.');return}
   vault=normalizeCoinVault(candidate);apply();
   statusUpdate((slot==='classic'?'Classic portrait':'Fibonacci robot')+' coin installed! It is stored only in this browser.');
  };
  img.src=blobUrl;
 }
 classic.addEventListener('change',e=>install(e.currentTarget.files?.[0],'classic'));
 fibonacci.addEventListener('change',e=>install(e.currentTarget.files?.[0],'fibonacci'));
 clear.addEventListener('click',()=>{
  if(!confirm('Erase BOTH saved portrait coins from this browser? The original image files on your computer will not be changed.'))return;
  vault=normalizeCoinVault(null);setSaved(vault);classic.value='';fibonacci.value='';apply();
  statusUpdate('Local portrait coin copies cleared. Default SVG coin restored.');
 });
 apply();statusUpdate('Only the original vector coin is installed until you add a portrait coin.');
 if(vault.classic||vault.fibonacci)statusUpdate('Your locally installed coin art is ready. Choose a style above.');
}
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready()}
