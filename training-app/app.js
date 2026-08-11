(()=>{
'use strict';
const WEEKS=window.BTM_WEEKS||[];
const PROGRAM=window.BTM_TRAINING_WEEKS||{};
const EX_KEY='btm_training_exercise_completion_v2';
const LOG_KEY='btm_progress';
const WEEK_KEY='btm_training_current_week_v1';
const RANK_QUOTES={NOVICE:'Every expert was once willing to begin.',BEGINNER:'Small steps become serious progress when you refuse to stop.',TRAINEE:'Consistency turns effort into ability.',APPRENTICE:'Skill grows when discipline becomes routine.',SKILLED:'You are no longer learning the work, you are becoming the work.',ADVANCED:'Discipline begins where excuses lose their power.',RECOVERY:'Recovery is not retreat, it is how strength prepares to rise again.',ELITE:'You earned your place by doing what most people abandon.',EXPERT:'Control your effort, sharpen your execution, raise your standard.',MASTER:'Mastery is built through consistency when motivation disappears.',GRANDMASTER:'At this level, discipline is no longer an action, it is an identity.',LEGEND:'The final level is not the end, it is proof of what you became.'};
const BLOCK=w=>w<=4?'FOUNDATION BLOCK':w<=6?'DIFFICULTY BLOCK':w===7?'DELOAD BLOCK':w<=9?'REBUILD BLOCK':w===10?'VARIATION BLOCK':'PEAK BLOCK';
const safeRead=(key,f)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??f}catch{return f}};
const safeWrite=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
let week=Number(localStorage.getItem(WEEK_KEY))||1;
if(!PROGRAM[week])week=1;
let completions=safeRead(EX_KEY,{});
let logs=safeRead(LOG_KEY,{});
const $=id=>document.getElementById(id);
const meta=()=>WEEKS[week-1]||{id:week,rank:'WEEK '+week,color:'#66b9df'};
const program=()=>PROGRAM[week]||{days:[],deload:false};
const exerciseKey=(w,d,i)=>`w${w}:d${d}:e${i}`;
const logKey=(w,d,i)=>`${w}|${d}|${i}`;
const getLog=(d,i)=>logs[logKey(week,d,i)]||(logs[logKey(week,d,i)]={done:false,feel:'',sets:[]});
const totalExercises=()=>WEEKS.reduce((sum,w)=>sum+(PROGRAM[w.id]?.days||[]).reduce((n,d)=>n+d.exercises.length,0),0);
const completedExercises=()=>Object.values(completions).filter(Boolean).length;
function haptic(){if('vibrate' in navigator){try{navigator.vibrate(8)}catch{}}}
function save(){safeWrite(EX_KEY,completions);safeWrite(LOG_KEY,logs);localStorage.setItem(WEEK_KEY,String(week));renderAll()}
function isComplete(d,i){return !!completions[exerciseKey(week,d,i)]}
function setComplete(d,i,value){const k=exerciseKey(week,d,i);if(value)completions[k]=true;else delete completions[k]}
function weekComplete(w){const p=PROGRAM[w];if(!p?.days?.length)return false;return p.days.every((d,di)=>d.exercises.every((_,ei)=>!!completions[exerciseKey(w,di,ei)]))}
function completedWeeks(){return WEEKS.filter(w=>weekComplete(w.id)).length}
function renderHero(){const m=meta(),p=program(),pct=Math.round((completedExercises()/Math.max(1,totalExercises()))*100);$('currentWeek').textContent='WEEK '+week;$('currentRank').textContent=m.rank;$('overallProgress').textContent=pct+'%';$('overallFill').style.width=pct+'%';$('rankQuote').textContent=RANK_QUOTES[m.rank]||'';$('deloadBadge').classList.toggle('hidden',!m.isDeload);$('weekCount').textContent=completedWeeks()+' / 12 COMPLETE'}
function renderWeeks(){const root=$('weekGrid');root.replaceChildren();WEEKS.forEach(w=>{const b=document.createElement('button');b.type='button';b.className='week-card'+(week===w.id?' active ':'')+(weekComplete(w.id)?' complete':'');b.style.setProperty('--week-color',w.color);const check=weekComplete(w.id)?'<span class="week-check">✓</span>':'';b.innerHTML=check+'<span class="week-number">WEEK '+w.id+'</span><span class="week-rank">'+w.rank+(w.isDeload?' · DELOAD':'')+'</span>';b.onclick=()=>{week=w.id;localStorage.setItem(WEEK_KEY,String(week));haptic();renderAll();$('workoutSection').scrollIntoView({behavior:'smooth',block:'start'})};root.appendChild(b)})}
function renderBanner(){const m=meta(),p=program(),root=$('workoutBanner');root.className='workout-banner'+(m.isDeload?' deload':'');root.innerHTML='<div class="banner-title">'+(m.isDeload?'RECOVERY · DELOAD':BLOCK(week))+'</div><p class="banner-note">'+(m.isDeload?'Training stress is deliberately reduced: fewer sets, easier variations and 4 RIR. Recover now so Weeks 8–12 can progress again.':'Complete the fixed prescription with clean form. RIR controls effort, while the Week configuration controls progression. Completion never rewrites future Weeks.')+'</p>';$('selectedWeekLabel').textContent='WEEK '+week+' · '+m.rank;$('selectedWeekStatus').textContent=weekComplete(week)?'COMPLETED':'IN PROGRESS'}
function metric(label,value,extra=''){return '<div class="metric '+extra+'"><div class="metric-label">'+label+'</div><div class="metric-value">'+value+'</div></div>'}
function renderWorkouts(){const root=$('workouts');root.replaceChildren();const p=program();p.days.forEach((day,di)=>{const box=document.createElement('section');box.className='day';const doneCount=day.exercises.reduce((n,_,ei)=>n+(isComplete(di,ei)?1:0),0);const head=document.createElement('div');head.className='day-head';head.innerHTML='<strong>'+day.day+'</strong><span>'+doneCount+' / '+day.exercises.length+' COMPLETE</span>';box.appendChild(head);day.exercises.forEach((ex,ei)=>box.appendChild(exerciseCard(ex,di,ei)));root.appendChild(box)});if(weekComplete(week)){const done=document.createElement('div');done.className='week-complete';done.textContent='✓ WEEK '+week+' COMPLETED';root.appendChild(done)}}
function exerciseCard(ex,di,ei){const done=isComplete(di,ei),log=getLog(di,ei),card=document.createElement('article');card.className='exercise-card'+(done?' complete':'');const variation=ex.variation&&ex.variation!==ex.name?'<div class="variation">'+escapeHTML(ex.variation)+'</div>':'';card.innerHTML='<div class="exercise-top"><div><div class="exercise-name">'+escapeHTML(ex.name)+'</div>'+variation+'</div></div><div class="metrics">'+metric('SETS × REPS',ex.sets+' × '+ex.reps)+metric('RIR',ex.rir,'rir')+'</div>';
const sets=document.createElement('div');sets.className='set-grid';const values=Array.isArray(log.sets)?log.sets:[];for(let i=0;i<ex.sets;i++){const input=document.createElement('input');input.className='set-input';input.inputMode='decimal';input.placeholder='Set '+(i+1);input.value=values[i]||'';input.addEventListener('input',()=>{const current=getLog(di,ei);current.sets[i]=input.value;safeWrite(LOG_KEY,logs)});sets.appendChild(input)}card.appendChild(sets);
const feel=document.createElement('div');feel.className='feel-row';['clean','mediocre','bad'].forEach(f=>{const b=document.createElement('button');b.type='button';b.className='feel-btn'+(log.feel===f?' active':'');b.textContent=f;b.onclick=()=>{getLog(di,ei).feel=f;safeWrite(LOG_KEY,logs);haptic();renderWorkouts();renderHero()};feel.appendChild(b)});card.appendChild(feel);
const button=document.createElement('button');button.type='button';button.className='complete-btn'+(done?' done':'');button.textContent=done?'✓ COMPLETED':'COMPLETE';button.onclick=()=>{setComplete(di,ei,!done);getLog(di,ei).done=!done;safeWrite(LOG_KEY,logs);safeWrite(EX_KEY,completions);haptic();renderAll();card.scrollIntoView({behavior:'smooth',block:'nearest'})};card.appendChild(button);return card}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function resetWeekData(w){Object.keys(completions).filter(k=>k.startsWith(`w${w}:`)).forEach(k=>delete completions[k]);Object.keys(logs).filter(k=>k.startsWith(`${w}|`)).forEach(k=>delete logs[k]);safeWrite(EX_KEY,completions);safeWrite(LOG_KEY,logs);}
function openReset(kind){const w=week;$('resetTitle').textContent=kind==='all'?'RESET ALL TRAINING':'RESET WEEK '+w;$('resetText').textContent=kind==='all'?'All 12 weeks, exercise completions, set logs and training progress will be erased.':'All Training progress for Week '+w+' will be erased.';$('resetSheet').classList.remove('hidden');$('confirmReset').dataset.kind=kind}
function closeSheets(){$('resetSheet').classList.add('hidden');$('settingsSheet').classList.add('hidden')}
function renderAll(){renderHero();renderWeeks();renderBanner();renderWorkouts()}
$('settingsBtn').onclick=()=>{$('settingsSheet').classList.remove('hidden')};$('closeSettings').onclick=closeSheets;$('cancelReset').onclick=closeSheets;$('resetCurrent').onclick=()=>{closeSheets();setTimeout(()=>openReset('week'),120)};$('resetAll').onclick=()=>{closeSheets();setTimeout(()=>openReset('all'),120)};$('confirmReset').onclick=()=>{const kind=$('confirmReset').dataset.kind;if(kind==='all'){completions={};logs={};localStorage.removeItem(WEEK_KEY)}else resetWeekData(week);safeWrite(EX_KEY,completions);safeWrite(LOG_KEY,logs);closeSheets();haptic();renderAll()};$('resetSheet').addEventListener('click',e=>{if(e.target===$('resetSheet'))closeSheets()});$('settingsSheet').addEventListener('click',e=>{if(e.target===$('settingsSheet'))closeSheets()});
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}))}
renderAll();
})();
