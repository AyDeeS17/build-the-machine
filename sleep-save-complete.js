(()=>{
'use strict';
if(window.__BTM_UNIFIED_COMPLETION__)return;
window.__BTM_UNIFIED_COMPLETION__=1;

const START=new Date('2026-08-10T00:00:00');
const TRAIN_KEY='btm_training_week_completion_v1';
const RUN_KEY='btm_running';
const SLEEP_KEY='btm_sleep_v2';
const NUT_KEYS=['btm_nutrition_manual_v5','btm_nutrition_manual_v4','btm_nutrition_unified'];
const $=id=>document.getElementById(id);
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
const dateFor=(w,d)=>{const x=new Date(START);x.setDate(x.getDate()+(w-1)*7+d);return x};
const fk=(w,d)=>dateFor(w,d).toISOString().slice(0,10);
const rk=(w,d)=>'w'+w+'s'+d;

const css=document.createElement('style');
css.id='btm-unified-completion-style';
css.textContent=`
.btm-completion-day{position:relative;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,color .3s ease,transform .2s ease!important}
.btm-completion-day.is-complete{background:rgba(91,190,116,.14)!important;border-color:#5bbe74!important;color:#b7efc1!important;box-shadow:0 0 14px rgba(91,190,116,.10)!important}
.btm-completion-day.is-complete::after{content:' ✓';color:#79d68e;font-weight:700}
.btm-completion-week{position:relative;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,color .3s ease!important}
.btm-completion-week.is-complete{background:linear-gradient(145deg,rgba(91,190,116,.20),rgba(91,190,116,.08))!important;border-color:#5bbe74!important;color:#c3f3cb!important;box-shadow:0 0 18px rgba(91,190,116,.11)!important}
.btm-completion-week.is-complete b{color:#8ee19b!important}
.btm-completion-week.is-complete::after{content:' ✓';color:#79d68e;font-weight:700}
.btm-complete-row{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin-top:12px}
.btm-unified-save,.btm-unified-complete{cursor:pointer;border-radius:6px;padding:10px 15px;font:10px 'JetBrains Mono';font-weight:700;transition:filter .2s,background .25s,border-color .25s,box-shadow .25s}
.btm-unified-save{background:var(--blue,#66b9df);color:#071016;border:1px solid var(--blue,#66b9df)}
.btm-unified-complete{background:rgba(91,190,116,.10);color:#9de2ab;border:1px solid rgba(91,190,116,.55)}
.btm-unified-complete.is-complete{background:#5bbe74;color:#071016;border-color:#5bbe74;box-shadow:0 0 13px rgba(91,190,116,.12)}
.btm-unified-save:hover,.btm-unified-complete:hover{filter:brightness(1.1)}
.btm-week-complete-panel{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:12px;padding:12px 14px;border-top:1px solid var(--line,#294656)}
.btm-training-complete{cursor:pointer;background:rgba(91,190,116,.10);color:#9de2ab;border:1px solid rgba(91,190,116,.55);border-radius:6px;padding:10px 16px;font:10px 'JetBrains Mono';font-weight:700;transition:background .25s,border-color .25s,box-shadow .25s}
.btm-training-complete.is-complete{background:#5bbe74;color:#071016;border-color:#5bbe74;box-shadow:0 0 14px rgba(91,190,116,.12)}
.btm-completion-toast{position:fixed;right:18px;bottom:18px;z-index:21000;padding:10px 14px;border:1px solid rgba(91,190,116,.55);border-radius:6px;background:#102118;color:#b7efc1;font:10px 'JetBrains Mono';box-shadow:0 10px 30px rgba(0,0,0,.35)}
@media(max-width:600px){.btm-week-complete-panel{align-items:flex-start;flex-direction:column}.btm-training-complete{width:100%}}
`;
document.head.appendChild(css);

function trainingState(){return read(TRAIN_KEY,{});}
function setTrainingWeek(w,done){const all=trainingState();if(done)all[String(w)]={completed:true};else delete all[String(w)];write(TRAIN_KEY,all);return !!all[String(w)];}
function trainingDone(w){return !!trainingState()[String(w)]?.completed;}
function runningState(){return read(RUN_KEY,{});}
function sleepState(){return read(SLEEP_KEY,{});}
function nutritionState(){for(const k of NUT_KEYS){const v=read(k,null);if(v&&typeof v==='object'&&Object.keys(v).length)return v;}return {};}
function runDone(w,d){return !!runningState()[rk(w,d)]?.done;}
function sleepDone(w,d){return !!sleepState()[fk(w,d)]?.complete;}
function nutritionDone(w,d){return !!nutritionState()[fk(w,d)]?.complete;}
function runningWeekDone(w){return [0,2,4].every(d=>runDone(w,d));}
function sleepWeekDone(w){return Array.from({length:7},(_,d)=>sleepDone(w,d)).every(Boolean);}
function nutritionWeekDone(w){return Array.from({length:7},(_,d)=>nutritionDone(w,d)).every(Boolean);}
function toast(text){document.querySelector('.btm-completion-toast')?.remove();const x=document.createElement('div');x.className='btm-completion-toast';x.textContent=text;document.body.appendChild(x);setTimeout(()=>x.remove(),1600)}
function patchDayButtons(container,doneFn,validDays=null){if(!container)return;[...container.children].forEach((b,d)=>{const valid=!validDays||validDays.includes(d);b.classList.add('btm-completion-day');b.classList.toggle('is-complete',valid&&doneFn(d));if(!valid){b.style.opacity='.42';b.title='No scheduled session';}else{b.style.opacity='';b.title=doneFn(d)?'Completed':'Incomplete';}})}
function patchWeekButtons(container,doneFn){if(!container)return;[...container.children].forEach((b,i)=>{b.classList.add('btm-completion-week');b.classList.toggle('is-complete',doneFn(i+1));})}
function saveRunning(w,d){const all=runningState(),k=rk(w,d),old=all[k]||{};all[k]={...old,distance:$('runDistance')?.value||'',pace:$('runPace')?.value||'',effort:$('runEffort')?.value||'',notes:$('runNotes')?.value||'',done:!!old.done,saved:true};write(RUN_KEY,all);toast('✓ RUN SAVED');refreshSection('running')}
function completeRunning(w,d){const all=runningState(),k=rk(w,d),old=all[k]||{};all[k]={...old,distance:$('runDistance')?.value||old.distance||'',pace:$('runPace')?.value||old.pace||'',effort:$('runEffort')?.value||old.effort||'',notes:$('runNotes')?.value||old.notes||'',done:true,saved:true};write(RUN_KEY,all);toast('✓ RUN COMPLETED');refreshSection('running')}
function saveSleep(w,d){const all=sleepState(),k=fk(w,d),old=all[k]||{};all[k]={...old,bed:$('sleepBed')?.value||'',wake:$('sleepWake')?.value||'',quality:$('sleepQuality')?.value||'',saved:true,complete:!!old.complete};write(SLEEP_KEY,all);toast('✓ SLEEP SAVED');refreshSection('sleep')}
function completeSleep(w,d){const all=sleepState(),k=fk(w,d),old=all[k]||{};all[k]={...old,bed:$('sleepBed')?.value||old.bed||'',wake:$('sleepWake')?.value||old.wake||'',quality:$('sleepQuality')?.value||old.quality||'',saved:true,complete:true};write(SLEEP_KEY,all);toast('✓ SLEEP COMPLETED');refreshSection('sleep')}
function getCurrentWeek(containerId){const c=$(containerId);if(!c)return 1;const active=c.querySelector('.week.active');const text=active?.textContent||'';const m=text.match(/WEEK\s*(\d+)/i);return m?Math.max(1,Math.min(12,+m[1])):1}
function getCurrentDay(containerId){const c=$(containerId);if(!c)return 0;const a=[...c.children];return Math.max(0,a.indexOf(c.querySelector('.day.active')))}
function installRunningControls(){const view=$('btm-running-view');if(!view)return;const weeks=$('runWeeks'),days=$('runDays');patchWeekButtons(weeks,runningWeekDone);patchDayButtons(days,d=>runDone(getCurrentWeek('runWeeks'),d),[0,2,4]);const w=getCurrentWeek('runWeeks'),d=getCurrentDay('runDays');const panel=$('runSave')?.parentElement;if(!panel)return;panel.querySelector('#btmRunUnifiedControls')?.remove();const row=document.createElement('div');row.id='btmRunUnifiedControls';row.className='btm-complete-row';row.innerHTML='<button class="btm-unified-save">SAVE</button><button class="btm-unified-complete">COMPLETE</button>';panel.appendChild(row);row.querySelector('.btm-unified-save').onclick=()=>saveRunning(w,d);row.querySelector('.btm-unified-complete').onclick=()=>completeRunning(w,d);row.querySelector('.btm-unified-complete').classList.toggle('is-complete',runDone(w,d));const legacy=$('runSave');if(legacy)legacy.style.display='none';const legacyCheck=$('runDone')?.closest('.btm-check');if(legacyCheck)legacyCheck.style.display='none'}
function installSleepControls(){const view=$('btm-sleep-view');if(!view)return;const weeks=$('sleepWeeks'),days=$('sleepDays');patchWeekButtons(weeks,sleepWeekDone);patchDayButtons(days,d=>sleepDone(getCurrentWeek('sleepWeeks'),d));const save=$('sleepSave');if(!save)return;const panel=save.parentElement;panel.querySelector('#btmSleepUnifiedControls')?.remove();const row=document.createElement('div');row.id='btmSleepUnifiedControls';row.className='btm-complete-row';row.innerHTML='<button class="btm-unified-save">SAVE</button><button class="btm-unified-complete">COMPLETE</button>';panel.appendChild(row);const w=getCurrentWeek('sleepWeeks'),d=getCurrentDay('sleepDays');row.querySelector('.btm-unified-save').onclick=()=>saveSleep(w,d);row.querySelector('.btm-unified-complete').onclick=()=>completeSleep(w,d);row.querySelector('.btm-unified-complete').classList.toggle('is-complete',sleepDone(w,d));save.style.display='none'}
function installTrainingControls(){const grid=$('weekGrid');if(!grid)return;patchWeekButtons(grid,trainingDone);const toolbar=grid.parentElement;if(!toolbar)return;let panel=toolbar.querySelector('#btmTrainingWeekCompletePanel');if(!panel){panel=document.createElement('div');panel.id='btmTrainingWeekCompletePanel';panel.className='btm-week-complete-panel';panel.innerHTML='<span class="note" id="btmTrainingWeekStatus"></span><button class="btm-training-complete" id="btmTrainingCompleteBtn"></button>';toolbar.appendChild(panel)}const w=getCurrentWeek('weekGrid'),done=trainingDone(w);$('btmTrainingWeekStatus').textContent=done?'✓ WEEK '+w+' COMPLETED':'TRAINING WEEK '+w;const btn=$('btmTrainingCompleteBtn');btn.textContent=done?'✓ COMPLETED':'COMPLETE WEEK';btn.classList.toggle('is-complete',done);btn.onclick=()=>{setTrainingWeek(w,!trainingDone(w));toast(trainingDone(w)?'✓ TRAINING WEEK '+w+' COMPLETED':'✓ TRAINING WEEK '+w+' REOPENED');installTrainingControls()}}
function refreshSection(name){try{if(name==='running'&&typeof window.renderRunning==='function')window.renderRunning();if(name==='sleep'&&typeof window.renderSleep==='function')window.renderSleep();if(name==='food'&&typeof window.render==='function'&&window.__BTM_NUTRITION_MANUAL_V5__)window.render()}catch(e){}setTimeout(patchAll,30)}
function patchAll(){installTrainingControls();installRunningControls();installSleepControls();patchNutrition()}
function patchNutrition(){const view=$('btm-food-view');if(!view)return;const weeks=view.querySelector('#foodWeeks'),days=view.querySelector('#foodDays');patchWeekButtons(weeks,w=>nutritionWeekDone(w));patchDayButtons(days,d=>nutritionDone(getCurrentWeek('foodWeeks'),d))}
function observe(){const mo=new MutationObserver(()=>{clearTimeout(observe.t);observe.t=setTimeout(patchAll,20)});mo.observe(document.body,{childList:true,subtree:true});window.addEventListener('storage',()=>setTimeout(patchAll,30));setInterval(patchAll,1000)}
function boot(){patchAll();observe();setTimeout(patchAll,100);setTimeout(patchAll,500);setTimeout(patchAll,1500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
const trainingLoader=document.createElement('script');trainingLoader.src='./training-completion-toggle.js';trainingLoader.defer=true;document.head.appendChild(trainingLoader);
})();
