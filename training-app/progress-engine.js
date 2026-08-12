(()=>{
'use strict';
const EX_KEY='btm_training_exercise_completion_v2',LOG_KEY='btm_progress';
const QUALITY=Object.freeze({clean:1,mediocre:.8,bad:.6});
const clamp01=n=>Math.max(0,Math.min(1,Number.isFinite(n)?n:0));
const percent=n=>Math.round(clamp01(n)*100);
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??f}catch{return f}};
const weeks=()=>window.BTM_WEEKS||[];
const program=()=>window.BTM_TRAINING_WEEKS||{};
const exerciseKey=(w,d,e)=>`w${w}:d${d}:e${e}`;
const logKey=(w,d,e)=>`${w}|${d}|${e}`;
const snapshot=()=>({completions:read(EX_KEY,{}),logs:read(LOG_KEY,{})});
function exercisesForDay(w,d){return program()[w]?.days?.[d]?.exercises||[]}
function calculateExerciseProgress(w,d,completions){const total=exercisesForDay(w,d).length;const completed=exercisesForDay(w,d).reduce((n,_,e)=>n+(completions[exerciseKey(w,d,e)]?1:0),0);return {completed,total,ratio:total?completed/total:0,percent:percent(total?completed/total:0)}}
function calculateDayProgress(w,d,completions){const x=calculateExerciseProgress(w,d,completions);const day=program()[w]?.days?.[d];const skipped=!!day?.skipped;
return {...x,skipped,state:skipped?'SKIPPED':x.completed===0?'UNTOUCHED':x.completed===x.total?'COMPLETED':'IN PROGRESS'} }
function calculateWeekProgress(w,completions){const days=program()[w]?.days||[];const scheduled=days.length;const dayMetrics=days.map((_,d)=>calculateDayProgress(w,d,completions));const completedDays=dayMetrics.filter(x=>x.state==='COMPLETED').length;const skippedDays=dayMetrics.filter(x=>x.state==='SKIPPED').length;const ratio=scheduled?dayMetrics.reduce((s,x)=>s+x.ratio,0)/scheduled:0;return {week:w,scheduledDays:scheduled,completedDays,skippedDays,dayMetrics,ratio,percent:percent(ratio),complete:scheduled>0&&completedDays===scheduled}}
function calculateProgramProgress(completions){const ws=weeks();let scheduledDays=0,completedDays=0,totalExercises=0,completedExercises=0;const weekMetrics=ws.map(w=>{const x=calculateWeekProgress(w.id,completions);scheduledDays+=x.scheduledDays;completedDays+=x.completedDays;const days=program()[w.id]?.days||[];days.forEach((d,di)=>{totalExercises+=d.exercises.length;completedExercises+=calculateExerciseProgress(w.id,di,completions).completed});return x});const ratio=scheduledDays?completedDays/scheduledDays:0;return {scheduledDays,completedDays,totalExercises,completedExercises,weekMetrics,ratio,percent:percent(ratio)}}
function calculatePerformanceScore(w,completions,logs){const days=program()[w]?.days||[];let total=0,quality=0,clean=0,mediocre=0,bad=0;days.forEach((d,di)=>d.exercises.forEach((_,ei)=>{total++;if(completions[exerciseKey(w,di,ei)]){const feel=logs[logKey(w,di,ei)]?.feel;quality+=QUALITY[feel]||0;if(feel==='clean')clean++;if(feel==='mediocre')mediocre++;if(feel==='bad')bad++}}));return {total,quality,clean,mediocre,bad,ratio:total?quality/total:0,percent:percent(total?quality/total:0)}}
function calculateAchievementProgress(current,target){const c=Math.max(0,Number(current)||0),t=Math.max(0,Number(target)||0);return {current:t?Math.min(c,t):0,target:t,ratio:t?clamp01(c/t):0,percent:t?percent(c/t):0,unlocked:t>0&&c>=t}}
function calculateAll(){const {completions,logs}=snapshot();const ws=weeks();const weekMetrics=ws.map(w=>{const completion=calculateWeekProgress(w.id,completions);const performance=calculatePerformanceScore(w.id,completions,logs);return {...completion,performance}});const programMetrics=calculateProgramProgress(completions);const tracked=weekMetrics.filter(x=>x.completedDays>0);const avgPerformance=tracked.length?tracked.reduce((s,x)=>s+x.performance.ratio,0)/tracked.length:0;const clean=weekMetrics.reduce((s,x)=>s+x.performance.clean,0);const mediocre=weekMetrics.reduce((s,x)=>s+x.performance.mediocre,0);const bad=weekMetrics.reduce((s,x)=>s+x.performance.bad,0);const completedDays=programMetrics.completedDays;return {completions,logs,weekMetrics,program:programMetrics,overallProgramPercent:programMetrics.percent,averagePerformancePercent:percent(avgPerformance),completedTrainingDays:completedDays,totalTrainingDays:programMetrics.scheduledDays,clean,mediocre,bad,quality:QUALITY}}
window.BTM_PROGRESS_ENGINE={QUALITY,clamp01,percent,snapshot,calculateExerciseProgress,calculateDayProgress,calculateWeekProgress,calculateProgramProgress,calculatePerformanceScore,calculateAchievementProgress,calculateAll};
})();
