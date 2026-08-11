(()=>{
'use strict';
const DAY_KEY='btm_training_current_day_v1';
const WEEK_KEY='btm_training_current_week_v1';
const getSelected=()=>{const v=Number(localStorage.getItem(DAY_KEY));return Number.isInteger(v)&&v>=0&&v<3?v:-1};
let selectedDay=getSelected();
const $=id=>document.getElementById(id);
const haptic=()=>{if('vibrate' in navigator){try{navigator.vibrate(8)}catch{}}};
function currentWeek(){return Number(localStorage.getItem(WEEK_KEY))||1}
function persist(){if(selectedDay<0)localStorage.removeItem(DAY_KEY);else localStorage.setItem(DAY_KEY,String(selectedDay))}
function getDays(){return [...document.querySelectorAll('#workouts > .day')].map((el,index)=>({el,index,name:el.querySelector('.day-head strong')?.textContent?.trim()||`TRAINING DAY ${index+1}`,summary:el.querySelector('.day-head span')?.textContent?.trim()||''}));}
function ensureSelector(){const section=$('workoutSection'),workouts=$('workouts');if(!section||!workouts)return;let root=$('daySelector');if(!root){root=document.createElement('div');root.id='daySelector';root.className='day-selector';section.insertBefore(root,document.getElementById('workoutBanner'));}
const days=getDays();if(!days.length){root.replaceChildren();return}
root.replaceChildren();days.forEach(({index,name,summary})=>{const b=document.createElement('button');b.type='button';b.className='day-select-card'+(selectedDay===index?' active':'');b.dataset.dayIndex=index;const done=/\b\d+\s*\/\s*\d+\s*COMPLETE/i.test(summary)&&summary.match(/^(\d+)\s*\/\s*(\d+)/);const complete=done&&Number(done[1])===Number(done[2]);if(complete)b.classList.add('complete');b.innerHTML=`<span class="day-select-name">${escapeHTML(name.split(' · ')[0])}</span><span class="day-select-focus">${escapeHTML(name.split(' · ')[1]||'TRAINING')}</span><span class="day-select-status">${complete?'✓ COMPLETE':escapeHTML(summary)}</span>`;b.onclick=()=>{selectedDay=index;persist();haptic();apply();setTimeout(()=>document.querySelector(`#workouts > .day[data-day-index="${index}"]`)?.scrollIntoView({behavior:'smooth',block:'start'}),40)};root.appendChild(b)});}
function apply(){const days=getDays();days.forEach(({el,index})=>{el.classList.toggle('day-hidden',selectedDay!==index);el.classList.toggle('day-selected',selectedDay===index)});const banner=$('workoutBanner');if(banner){banner.classList.toggle('day-prompt',selectedDay<0);if(selectedDay<0)banner.dataset.dayPrompt='true';else delete banner.dataset.dayPrompt;}
const label=document.querySelector('#selectedWeekLabel');if(label){const w=currentWeek();const rank=(document.querySelector('#currentRank')?.textContent||'').trim();label.textContent=selectedDay<0?`WEEK ${w} · ${rank}`:`WEEK ${w} · ${rank} · ${getDays()[selectedDay]?.name?.split(' · ')[0]||''}`;}
const status=document.querySelector('#selectedWeekStatus');if(status){const all=days.length===3&&days.every(({el})=>/\b(\d+)\s*\/\s*(\d+)\s*COMPLETE/i.test(el.querySelector('.day-head span')?.textContent||'')&&Number((el.querySelector('.day-head span')?.textContent||'').match(/^(\d+)\s*\/\s*(\d+)/)[1])===Number((el.querySelector('.day-head span')?.textContent||'').match(/^(\d+)\s*\/\s*(\d+)/)[2]);status.textContent=all?'COMPLETED':selectedDay<0?'SELECT A TRAINING DAY':'IN PROGRESS';}}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function rebuild(){ensureSelector();apply();}
const observer=new MutationObserver(()=>rebuild());
function init(){rebuild();const grid=$('weekGrid');if(grid)grid.addEventListener('click',()=>setTimeout(()=>{selectedDay=-1;persist();rebuild()},0));const today=$('todayCard');if(today){today.addEventListener('click',e=>{const btn=e.target.closest('#startToday');if(!btn)return;const map={2:0,4:1,5:2};const idx=map[new Date().getDay()];if(idx!==undefined){selectedDay=idx;persist();setTimeout(rebuild,0)}})}observer.observe($('workouts'),{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
