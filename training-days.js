(()=>{
'use strict';
const KEY='btm_training_current_day_v2';
const readDay=()=>{const v=Number(localStorage.getItem(KEY));return Number.isInteger(v)&&v>=0&&v<3?v:-1};
let selectedDay=readDay();
const days=['Tuesday','Thursday','Friday'];
const $=s=>document.querySelector(s);
function injectStyles(){if($('#btm-training-day-styles'))return;const s=document.createElement('style');s.id='btm-training-day-styles';s.textContent=`
.btm-training-day-selector{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:18px 0 4px}
.btm-training-day{appearance:none;-webkit-appearance:none;cursor:pointer;text-align:left;min-height:86px;padding:14px;border:1px solid #294656;border-radius:9px;background:linear-gradient(145deg,#13202a,#0d161d);color:#e8f0f4;transition:transform .18s ease,border-color .22s ease,box-shadow .22s ease,background .22s ease}
.btm-training-day:hover{transform:translateY(-2px);border-color:#66b9df;box-shadow:0 0 18px rgba(102,185,223,.12)}
.btm-training-day:active{transform:scale(.985)}
.btm-training-day.active{border-color:#66b9df;background:linear-gradient(145deg,rgba(102,185,223,.14),#0d161d);box-shadow:0 0 0 1px rgba(102,185,223,.14),0 0 22px rgba(102,185,223,.1)}
.btm-training-day.complete{border-color:rgba(79,174,159,.7);background:linear-gradient(145deg,rgba(79,174,159,.12),#0d161d)}
.btm-training-day.complete.active{border-color:#4fae9f;box-shadow:0 0 0 1px rgba(79,174,159,.16),0 0 22px rgba(79,174,159,.1)}
.btm-training-day strong{display:block;font:700 14px 'JetBrains Mono';letter-spacing:.05em}.btm-training-day span{display:block;margin-top:7px;color:#8195a3;font:10px 'JetBrains Mono';text-transform:uppercase}.btm-training-day.complete span{color:#83d6c9}
.btm-day-hidden{display:none!important}
.btm-training-week-complete{display:block;margin-top:6px;color:#83d6c9;font:9px 'JetBrains Mono';letter-spacing:.08em}
@media(max-width:600px){.btm-training-day-selector{grid-template-columns:1fr}.btm-training-day{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:12px}.btm-training-day span{margin:0;text-align:right}}
`;
document.head.appendChild(s)}
function currentWeek(){const active=document.querySelector('#weekGrid .week.active b');const m=active?.textContent.match(/WEEK\s+(\d+)/i);return m?Number(m[1]):1}
function dayInfo(){return [...document.querySelectorAll('#workouts > .day')].map((el,i)=>({el,i,complete:completeDay(i)}))}
function completeDay(di){const program=window.BTM_TRAINING_WEEKS?.[currentWeek()];const day=program?.days?.[di];if(!day?.exercises?.length)return false;const state=JSON.parse(localStorage.getItem('btm_progress')||'{}');return day.exercises.every((_,ei)=>!!state[`${currentWeek()}|${di}|${ei}`]?.done)}
function weekComplete(){const program=window.BTM_TRAINING_WEEKS?.[currentWeek()];return !!program?.days?.length&&program.days.length===3&&program.days.every((_,di)=>completeDay(di))}
function render(){const workouts=$('#workouts');if(!workouts)return;injectStyles();let selector=$('#btm-training-day-selector');if(!selector){selector=document.createElement('div');selector.id='btm-training-day-selector';selector.className='btm-training-day-selector';workouts.parentNode.insertBefore(selector,workouts)}const infos=dayInfo();selector.replaceChildren();infos.forEach(({i,complete})=>{const b=document.createElement('button');b.type='button';b.className='btm-training-day'+(selectedDay===i?' active':'')+(complete?' complete':'');b.innerHTML=`<strong>${days[i]}</strong><span>${complete?'✓ COMPLETED':'SELECT WORKOUT'}</span>`;b.onclick=()=>{selectedDay=i;localStorage.setItem(KEY,String(i));apply();document.querySelector(`#workouts > .day:nth-child(${i+1})`)?.scrollIntoView({behavior:'smooth',block:'start'});};selector.appendChild(b)});apply();updateWeekCard()}
function apply(){const infos=dayInfo();infos.forEach(({el,i})=>el.classList.toggle('btm-day-hidden',selectedDay!==i));let prompt=$('#btm-training-day-prompt');if(selectedDay<0){if(!prompt){prompt=document.createElement('p');prompt.id='btm-training-day-prompt';prompt.className='note';prompt.textContent='Select Tuesday, Thursday or Friday to view that workout.';$('#workouts')?.parentNode.insertBefore(prompt,$('#workouts'))}}else prompt?.remove()}
function updateWeekCard(){const card=document.querySelector('#weekGrid .week.active');if(!card)return;const done=weekComplete();card.classList.toggle('week-training-complete',done);let badge=card.querySelector('.btm-training-week-complete');if(done&&!badge){badge=document.createElement('small');badge.className='btm-training-week-complete';badge.textContent='✓ COMPLETE';card.appendChild(badge)}else if(!done)badge?.remove()}
function init(){render();const grid=$('#weekGrid');if(grid)new MutationObserver(()=>{selectedDay=-1;localStorage.removeItem(KEY);setTimeout(render,0)}).observe(grid,{childList:true,subtree:true});const workouts=$('#workouts');if(workouts)new MutationObserver(()=>setTimeout(render,0)).observe(workouts,{childList:true});setInterval(()=>{if(document.body.dataset.section==='training')updateWeekCard()},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
