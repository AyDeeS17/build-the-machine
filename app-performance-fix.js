/* Targeted interaction performance patch. Prevents nutrition inputs from rebuilding the whole section on every keystroke. */
(()=>{
'use strict';
if(window.__BTM_INPUT_PERF__)return;window.__BTM_INPUT_PERF__=1;
const $=s=>document.querySelector(s),read=(k,d={})=>{try{return JSON.parse(localStorage.getItem(k)||'null')||d}catch{return d}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const dateKey=()=>{const t=$('#foodTitle')?.textContent||'',m=t.match(/([A-Z]+DAY),?\s+([A-Z]+)\s+(\d+),\s+(\d{4})/i);if(!m)return null;const d=new Date(`${m[2]} ${m[3]}, ${m[4]}`);return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10)};
const install=()=>{const r=$('#foodMacros');if(!r||r.__btmPerfInstalled)return;r.__btmPerfInstalled=1;r.addEventListener('input',e=>{const i=e.target;if(!i.matches('input[data-food-key]'))return;e.stopImmediatePropagation();const d=dateKey();if(!d)return;const all=read('btm_nutrition_unified',{}),x=all[d]||{cal:0,pro:0,carb:0,fat:0,water:0,meals:'',items:'',complete:false};x[i.dataset.foodKey]=+i.value||0;all[d]=x;write('btm_nutrition_unified',all);const meter=i.parentElement?.querySelector('.btm-meter i');if(meter){const key=i.dataset.foodKey,t=key==='cal'?2000:key==='pro'?160:parseFloat((document.querySelector('#foodTargets')?.textContent.match(key==='carb'?/CARBOHYDRATES\s*([0-9.]+)/i:/FATS\s*([0-9.]+)/i)||[])[1]||100);meter.style.width=Math.min(100,(+i.value||0)/t*100)+'%'}},true)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
const watch=new MutationObserver(()=>{if($('#foodMacros')){install();watch.disconnect()}});watch.observe(document.body,{childList:true,subtree:true});
})();
