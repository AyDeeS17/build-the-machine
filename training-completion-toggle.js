(()=>{
'use strict';
if(window.__BTM_TRAINING_COMPLETION_TOGGLE__)return;
window.__BTM_TRAINING_COMPLETION_TOGGLE__=1;

const KEY='btm_training_exercise_completion_v2';
const TRAIN_KEY='btm_training_week_completion_v1';
const $=id=>document.getElementById(id);
const read=(k,f={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

const css=document.createElement('style');
css.id='btm-training-completion-toggle-style';
css.textContent=`
.btm-ex-complete-row{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin-top:12px}
.btm-ex-complete-btn{cursor:pointer;border:1px solid var(--line,#294656);border-radius:6px;background:#0b151c;color:var(--muted,#8195a3);padding:9px 13px;font:10px 'JetBrains Mono';font-weight:700;letter-spacing:.03em;transition:background .28s ease,border-color .28s ease,color .28s ease,box-shadow .28s ease,transform .15s ease}
.btm-ex-complete-btn:hover{transform:translateY(-1px);border-color:rgba(91,190,116,.65);color:#b7efc1}
.btm-ex-complete-btn.is-complete{background:#5bbe74;color:#071016;border-color:#5bbe74;box-shadow:0 0 14px rgba(91,190,116,.13)}
.exercise.btm-exercise-complete{border-left:2px solid #5bbe74!important;background:rgba(91,190,116,.075)!important;box-shadow:inset 0 0 18px rgba(91,190,116,.035)}
.btm-training-ex-progress{margin:4px 0 12px;padding:11px 14px;border:1px solid var(--line,#294656);border-radius:7px;background:#0b151c;color:var(--muted,#8195a3);font:10px 'JetBrains Mono';display:flex;align-items:center;justify-content:space-between;gap:10px}
.btm-training-ex-progress strong{color:#8ee19b;font-size:12px}
.btm-training-week-complete{display:flex;align-items:center;gap:10px;margin-top:12px;padding:12px 14px;border-top:1px solid var(--line,#294656);color:var(--muted,#8195a3);font:10px 'JetBrains Mono'}
.btm-training-week-complete button{cursor:pointer;border:1px solid rgba(91,190,116,.55);border-radius:6px;background:rgba(91,190,116,.10);color:#9de2ab;padding:9px 13px;font:10px 'JetBrains Mono';font-weight:700}
.btm-training-week-complete button.is-complete{background:#5bbe74;color:#071016;border-color:#5bbe74;box-shadow:0 0 13px rgba(91,190,116,.12)}
.exercise .check{display:none!important}
@media(max-width:600px){.btm-training-ex-progress{flex-direction:column;align-items:flex-start}.btm-ex-complete-row{justify-content:stretch}.btm-ex-complete-btn{width:100%}.btm-training-week-complete{flex-direction:column;align-items:stretch}.btm-training-week-complete button{width:100%}}
`;
document.head.appendChild(css);

function state(){return read(KEY,{});}
function setExercise(w,day,exercise,done){
  const all=state(),key=`w${w}:d${day}:e${exercise}`;
  if(done)all[key]=true;else delete all[key];
  write(KEY,all);
}
function exerciseDone(w,day,exercise){return !!state()[`w${w}:d${day}:e${exercise}`];}
function selectedWeek(){
  const grid=$('weekGrid');
  const active=grid?.querySelector('.week.active');
  const m=(active?.textContent||'').match(/WEEK\s*(\d+)/i);
  return m?+m[1]:1;
}
function exerciseCards(){return [...document.querySelectorAll('#workouts .exercise')];}
function identify(card,index){
  const day=card.closest('.day');
  const days=[...document.querySelectorAll('#workouts .day')];
  return {day:Math.max(0,days.indexOf(day)),exercise:index};
}
function count(){
  const cards=exerciseCards();
  let done=0;
  cards.forEach((card,i)=>{const p=identify(card,i);if(exerciseDone(selectedWeek(),p.day,p.exercise))done++});
  return {done,total:cards.length};
}
function weekCompleted(w){
  const cards=exerciseCards();
  if(!cards.length)return false;
  return cards.every((card,i)=>{const p=identify(card,i);return exerciseDone(w,p.day,p.exercise)});
}
function updateWeekState(w){
  const all=read(TRAIN_KEY,{});
  if(weekCompleted(w))all[String(w)]={completed:true};
  else delete all[String(w)];
  write(TRAIN_KEY,all);
}
function renderProgress(){
  const stats=document.querySelector('#trainingView .stats');
  if(!stats)return;
  let p=stats.querySelector('.btm-training-ex-progress');
  if(!p){p=document.createElement('div');p.className='btm-training-ex-progress';stats.parentElement.insertBefore(p,stats.nextSibling)}
  const c=count();
  p.innerHTML='<span>TRAINING PROGRESS</span><strong>'+c.done+' / '+c.total+' EXERCISES COMPLETED</strong>';
}
function renderButtons(){
  const w=selectedWeek(),cards=exerciseCards();
  cards.forEach((card,i)=>{
    const p=identify(card,i),done=exerciseDone(w,p.day,p.exercise);
    card.classList.toggle('btm-exercise-complete',done);
    const old=card.querySelector('.check');if(old)old.style.display='none';
    let row=card.querySelector('.btm-ex-complete-row');
    if(!row){
      row=document.createElement('div');row.className='btm-ex-complete-row';
      const btn=document.createElement('button');btn.type='button';btn.className='btm-ex-complete-btn';row.appendChild(btn);
      card.appendChild(row);
      btn.addEventListener('click',e=>{
        e.preventDefault();e.stopPropagation();
        const now=!exerciseDone(w,p.day,p.exercise);
        setExercise(w,p.day,p.exercise,now);
        updateWeekState(w);
        renderButtons();
        syncWeekUI();
      });
    }
    const btn=row.querySelector('.btm-ex-complete-btn');
    btn.textContent=done?'✓ COMPLETED':'COMPLETE';
    btn.classList.toggle('is-complete',done);
  });
  renderProgress();
}
function syncWeekUI(){
  const grid=$('weekGrid');if(!grid)return;
  const w=selectedWeek(),complete=weekCompleted(w);
  [...grid.children].forEach((b,i)=>{
    const n=i+1;
    b.classList.toggle('btm-ex-week-complete',complete&&n===w);
    b.classList.toggle('is-complete',n===w&&complete);
    b.title=n===w?(complete?'All required exercises completed':'Complete every required exercise to finish this week'):(completeForStoredWeek(n)?'Completed':'');
  });
  const toolbar=grid.parentElement;
  if(!toolbar)return;
  let panel=toolbar.querySelector('.btm-training-week-complete');
  if(panel)panel.remove();
  const p=document.createElement('div');p.className='btm-training-week-complete';
  p.innerHTML='<span>'+ (complete?'✓ WEEK '+w+' COMPLETED':'COMPLETE ALL EXERCISES TO FINISH WEEK '+w) +'</span><button type="button" class="'+(complete?'is-complete':'')+'">'+(complete?'✓ COMPLETED':'COMPLETE WEEK')+'</button>';
  const btn=p.querySelector('button');
  btn.addEventListener('click',()=>{
    if(weekCompleted(w)){return}
    const cards=exerciseCards();
    cards.forEach((card,i)=>{const x=identify(card,i);setExercise(w,x.day,x.exercise,true)});
    updateWeekState(w);renderButtons();syncWeekUI();
  });
  toolbar.appendChild(p);
}
function completeForStoredWeek(w){return !!read(TRAIN_KEY,{})[String(w)]?.completed;}
function observe(){
  const mo=new MutationObserver(()=>{clearTimeout(observe.t);observe.t=setTimeout(()=>{renderButtons();syncWeekUI()},25)});
  mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('storage',()=>{renderButtons();syncWeekUI()});
}
function boot(){
  renderButtons();
  syncWeekUI();
  observe();
  setTimeout(()=>{renderButtons();syncWeekUI()},100);
  setTimeout(()=>{renderButtons();syncWeekUI()},500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
