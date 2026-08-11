(()=>{
'use strict';
const EX_KEY='btm_training_exercise_completion_v2';
const LOG_KEY='btm_progress';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
function calc(){const completions=read(EX_KEY,{}),logs=read(LOG_KEY,{}),program=window.BTM_TRAINING_WEEKS||{};let days=0,completedDays=0,done=0,clean=0,med=0,bad=0,total=0,fullWeeks=0;
Object.values(program).forEach(w=>{let weekDone=true;w.days.forEach((d,di)=>{if(!d.exercises.length)return;days++;let dayDone=true;d.exercises.forEach((ex,ei)=>{total++;const k=`w${w.id}:d${di}:e${ei}`,lk=`${w.id}|${di}|${ei}`;if(completions[k]){done++;const f=logs[lk]?.feel;if(f==='clean')clean++;else if(f==='mediocre')med++;else if(f==='bad')bad++;}else dayDone=false});if(dayDone)completedDays++;if(!dayDone)weekDone=false});if(weekDone)fullWeeks++});
const consistency=days?Math.round(completedDays/days*100):0;const completion=total?done/total:0;const quality=done?(clean+med*.8+bad*.6)/done:0;const score=Math.round((completion*.4+quality*.35+(consistency/100)*.15+(fullWeeks/12)*.1)*100);return {consistency,score}}
function apply(){const c=calc();const t=document.getElementById('consistencyText'),f=document.getElementById('consistencyFill');if(t)t.textContent=c.consistency+'%';if(f)f.style.width=c.consistency+'%';const ms=document.querySelector('.machine-score strong');if(ms)ms.textContent=c.score;}
apply();setInterval(apply,600);
})();
