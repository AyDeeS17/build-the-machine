/* Universal reset controller. App-shell owns the data/rendering; this layer only provides one safe reset surface. */
(()=>{
'use strict';
if(window.__BTM_UNIVERSAL_RESET__)return;
window.__BTM_UNIVERSAL_RESET__=1;

const START=new Date('2026-08-10T00:00:00');
const $=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const pad=n=>String(n).padStart(2,'0');
const dateFor=(w,d)=>{const x=new Date(START);x.setDate(x.getDate()+(w-1)*7+d);return x};
const dateKey=(w,d)=>{const x=dateFor(w,d);return `${x.getFullYear()}-${pad(x.getMonth()+1)}-${pad(x.getDate())}`};
const dayNames=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const css=`
#btm-universal-reset{margin-left:auto;display:inline-flex;align-items:center;justify-content:center;gap:7px;min-width:112px;padding:9px 13px;border:1px solid rgba(181,92,99,.48);border-radius:5px;background:linear-gradient(145deg,rgba(48,25,29,.72),rgba(29,17,21,.72));color:#c99da1;font:10px 'JetBrains Mono';font-weight:700;letter-spacing:.05em;cursor:pointer;transition:transform .2s ease,border-color .2s ease,box-shadow .25s ease,color .2s ease,background .2s ease}
#btm-universal-reset:hover{transform:translateY(-1px);color:#f0c4c8;border-color:rgba(220,105,115,.8);background:linear-gradient(145deg,rgba(68,29,35,.86),rgba(34,18,22,.86));box-shadow:0 0 0 1px rgba(220,105,115,.08),0 0 18px rgba(210,82,94,.12)}
#btm-universal-reset:active{transform:translateY(0) scale(.985)}
.btm-reset-backdrop{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(3,8,12,.58);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;visibility:hidden;transition:opacity .26s ease,visibility 0s linear .26s}
.btm-reset-backdrop.is-open{opacity:1;visibility:visible;transition:opacity .26s ease,visibility 0s linear 0s}
.btm-reset-dialog{width:min(440px,100%);padding:25px;border:1px solid #3a5868;border-radius:10px;background:linear-gradient(145deg,#14242e,#0a151c);box-shadow:0 24px 80px rgba(0,0,0,.52),0 0 32px rgba(76,145,180,.08);transform:translateY(10px) scale(.985);opacity:.96;transition:transform .26s cubic-bezier(.2,.8,.2,1),opacity .26s ease}
.btm-reset-backdrop.is-open .btm-reset-dialog{transform:none;opacity:1}
.btm-reset-dialog .ey{margin-bottom:7px;color:#66b9df;font:9px 'JetBrains Mono';letter-spacing:.24em}
.btm-reset-dialog h3{margin:0;color:#e8f0f4;font:400 27px Anton,sans-serif;text-transform:uppercase}
.btm-reset-dialog p{margin:11px 0 21px;color:#8195a3;font-size:13px;line-height:1.5}
.btm-reset-dialog .btm-reset-actions{display:flex;justify-content:flex-end;gap:9px}
.btm-reset-dialog button{min-width:92px;cursor:pointer;border-radius:5px;padding:10px 14px;font:10px 'JetBrains Mono';font-weight:700;transition:transform .18s ease,background .18s ease,border-color .18s ease,box-shadow .18s ease}
.btm-reset-cancel{color:#b9c8d0;background:#0b151c;border:1px solid #294656}.btm-reset-cancel:hover{background:#13232d;border-color:#456579;transform:translateY(-1px)}
.btm-reset-confirm{color:#f4dfe1;background:#431d23;border:1px solid #81434b}.btm-reset-confirm:hover{background:#5a252d;border-color:#b45c66;box-shadow:0 0 18px rgba(190,72,86,.14);transform:translateY(-1px)}
@media(max-width:800px){#btm-universal-reset{margin-left:0;width:100%;grid-column:1/-1}.btm-reset-dialog{padding:21px}}
@media(prefers-reduced-motion:reduce){#btm-universal-reset,.btm-reset-backdrop,.btm-reset-dialog,.btm-reset-dialog button{transition:none!important}}
`;

function installStyles(){if($('#btm-universal-reset-style'))return;const s=document.createElement('style');s.id='btm-universal-reset-style';s.textContent=css;document.head.appendChild(s)}
function removeLegacyControls(){
  all('.btm-reset-action,.btm-reset-modal,.btm-reset-dialog').forEach(el=>{if(el.closest('.btm-reset-backdrop'))return;el.remove()});
  all('#resetWeekBtn,#btm-reset-week,#btm-erase').forEach(el=>el.remove());
}
function installButton(){
  const nav=$('.btm-nav');if(!nav)return false;
  removeLegacyControls();
  let b=$('#btm-universal-reset');
  if(!b){b=document.createElement('button');b.id='btm-universal-reset';b.type='button';nav.appendChild(b)}
  updateButtonLabel();
  b.onclick=()=>openConfirm(getSelection());
  return true;
}
function activeWeek(gridSelector){
  const b=$(gridSelector+' .week.active');
  if(!b)return null;
  const m=(b.textContent||'').match(/WEEK\s+(\d+)/i);
  return m?Number(m[1]):null;
}
function activeDay(gridSelector){
  const buttons=all(gridSelector+' .day');
  const i=buttons.findIndex(b=>b.classList.contains('active'));
  return i>=0?i:null;
}
function section(){return document.body.dataset.section||'training'}
function getSelection(){
  const s=section();
  if(s==='food'){
    const w=activeWeek('#foodWeeks')||1,d=activeDay('#foodDays');
    return d==null?{type:'week',week:w}: {type:'day',week:w,day:d,scope:'food'};
  }
  if(s==='running'){
    const w=activeWeek('#runWeeks')||1,d=activeDay('#runDays');
    return d==null?{type:'week',week:w}: {type:'day',week:w,day:d,scope:'running'};
  }
  if(s==='sleep'){
    const w=activeWeek('#sleepWeeks')||1,d=activeDay('#sleepDays');
    return d==null?{type:'week',week:w}: {type:'day',week:w,day:d,scope:'sleep'};
  }
  const w=activeWeek('#weekGrid')||1;
  return {type:'week',week:w};
}
function updateButtonLabel(){
  const b=$('#btm-universal-reset');if(!b)return;
  const x=getSelection();b.textContent=x.type==='day'?'RESET DAY':'RESET WEEK';b.title=x.type==='day'?'Erase the selected day':'Erase the selected week';
}
function modal(){
  let root=$('#btm-universal-reset-modal');if(root)return root;
  root=document.createElement('div');root.id='btm-universal-reset-modal';root.className='btm-reset-backdrop';root.setAttribute('aria-hidden','true');
  root.innerHTML='<div class="btm-reset-dialog" role="dialog" aria-modal="true" aria-labelledby="btmResetTitle"><div class="ey">DESTRUCTIVE ACTION</div><h3 id="btmResetTitle">ARE YOU SURE?</h3><p id="btmResetMessage"></p><div class="btm-reset-actions"><button type="button" class="btm-reset-cancel">CANCEL</button><button type="button" class="btm-reset-confirm">ERASE</button></div></div>';
  document.body.appendChild(root);
  root.addEventListener('click',e=>{if(e.target===root)closeConfirm()});
  root.querySelector('.btm-reset-cancel').addEventListener('click',closeConfirm);
  root.querySelector('.btm-reset-confirm').addEventListener('click',()=>{if(pending)performReset(pending);closeConfirm()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('is-open'))closeConfirm()});
  return root;
}
let pending=null;
function openConfirm(x){
  pending=x;const r=modal(),msg=$('#btmResetMessage');
  if(x.type==='day'){
    const d=dateFor(x.week,x.day),name=dayNames[d.getDay()],pretty=d.toLocaleDateString('en-US',{month:'long',day:'numeric'});
    msg.textContent=`You're about to erase the data for ${name}, ${pretty}. This action cannot be undone.`;
  }else msg.textContent=`You're about to erase the data for Week ${x.week}. This action cannot be undone.`;
  r.classList.add('is-open');r.setAttribute('aria-hidden','false');setTimeout(()=>r.querySelector('.btm-reset-cancel')?.focus(),30);
}
function closeConfirm(){const r=$('#btm-universal-reset-modal');if(!r)return;r.classList.remove('is-open');r.setAttribute('aria-hidden','true');pending=null}
function deleteDateObject(key,date){
  const data=read(key,null);if(!data||typeof data!=='object')return;
  if(Object.prototype.hasOwnProperty.call(data,date)){delete data[date];write(key,data)}
}
function deleteWeekDateObject(key,w){
  const data=read(key,null);if(!data||typeof data!=='object')return;
  let changed=false;for(let d=0;d<7;d++){const k=dateKey(w,d);if(Object.prototype.hasOwnProperty.call(data,k)){delete data[k];changed=true}}
  if(changed)write(key,data)
}
function deleteRunningDay(w,d){
  const data=read('btm_running',null);if(!data)return;const k=`w${w}s${d}`;if(Object.prototype.hasOwnProperty.call(data,k)){delete data[k];write('btm_running',data)}
}
function deleteRunningWeek(w){
  const data=read('btm_running',null);if(!data)return;let changed=false;Object.keys(data).forEach(k=>{if(k.startsWith(`w${w}s`)){delete data[k];changed=true}});if(changed)write('btm_running',data)
}
function deleteFoodDay(w,d){
  const date=dateKey(w,d);deleteDateObject('btm_nutrition_unified',date);
  const log=read('btm_food_log_v1',null);if(log&&typeof log==='object'&&Object.prototype.hasOwnProperty.call(log,date)){delete log[date];write('btm_food_log_v1',log)}
}
function deleteFoodWeek(w){deleteWeekDateObject('btm_nutrition_unified',w);deleteWeekDateObject('btm_food_log_v1',w)}
function deleteSleepDay(w,d){deleteDateObject('btm_sleep_v2',dateKey(w,d))}
function deleteSleepWeek(w){deleteWeekDateObject('btm_sleep_v2',w)}
function deleteTrainingWeek(w){
  const data=read('btm_progress',null);if(!data||typeof data!=='object')return;
  let changed=false;Object.keys(data).forEach(k=>{if(k.startsWith(`${w}|`)){delete data[k];changed=true}});if(changed)write('btm_progress',data)
}
function performReset(x){
  if(x.type==='day'){
    if(x.scope==='food')deleteFoodDay(x.week,x.day);
    else if(x.scope==='running')deleteRunningDay(x.week,x.day);
    else if(x.scope==='sleep')deleteSleepDay(x.week,x.day);
  }else{
    deleteTrainingWeek(x.week);deleteRunningWeek(x.week);deleteFoodWeek(x.week);deleteSleepWeek(x.week);
  }
  rerender(x);
}
function rerender(x){
  const s=section();
  requestAnimationFrame(()=>{
    if(s==='food'){const b=$(`#foodDays .day:nth-child(${(x.day??0)+1})`);if(b)b.click();else $('#foodWeeks .week.active')?.click()}
    else if(s==='running'){const b=$(`#runDays .day:nth-child(${(x.day??0)+1})`);if(b)b.click();else $('#runWeeks .week.active')?.click()}
    else if(s==='sleep'){const b=$(`#sleepDays .day:nth-child(${(x.day??0)+1})`);if(b)b.click();else $('#sleepWeeks .week.active')?.click()}
    else $('#weekGrid .week.active')?.click();
    if(s==='progress')document.getElementById('progressBtn')?.click();
    updateButtonLabel();
  });
}
function boot(){
  installStyles();installButton();
  const observer=new MutationObserver(()=>{removeLegacyControls();if(!$('#btm-universal-reset'))installButton();updateButtonLabel()});
  observer.observe(document.body,{subtree:true,childList:true});
  document.addEventListener('click',e=>{if(e.target.closest('.btm-nav .btn,.btm-week-grid .week,.btm-day-grid .day'))setTimeout(updateButtonLabel,0)},{capture:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
