/* Single Week naming layer for every dashboard section. */
(()=>{
'use strict';
if(window.__BTM_WEEK_CONSISTENCY__)return;
window.__BTM_WEEK_CONSISTENCY__=1;
const W=window.BTM_WEEKS||[];
const apply=()=>{document.querySelectorAll('.btm-v5-week').forEach((el,i)=>{const w=W[i];if(!w)return;el.dataset.weekId=w.id;const b=el.querySelector('b');if(b)b.textContent='WEEK '+w.id;const span=el.querySelector('span');if(span)span.textContent=w.rank;el.style.setProperty('--week-color',w.color)});document.querySelectorAll('#foodWeeks .week,#runWeeks .week,#sleepWeeks .week').forEach((el,i)=>{const w=W[i];if(!w)return;el.dataset.weekId=w.id;const b=el.querySelector('b'),span=el.querySelector('span');if(b)b.textContent='WEEK '+w.id;if(span)span.textContent=w.rank;el.style.setProperty('--week-color',w.color)})};
const boot=()=>{apply();const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(apply,10)});mo.observe(document.body,{childList:true,subtree:true});setTimeout(apply,250);setTimeout(apply,1000)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
