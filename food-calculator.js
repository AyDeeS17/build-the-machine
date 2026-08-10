/* Smart Food Calculator loader. */
(()=>{
'use strict';
if(window.__BTM_FOOD_LOADER__)return;
window.__BTM_FOOD_LOADER__=true;
const load=()=>{
 if(document.querySelector('script[data-btm-food-v2]'))return;
 const s=document.createElement('script');
 s.src='./food-calculator-v2.js';s.defer=true;s.dataset.btmFoodV2='1';
 s.onload=()=>{
  if(document.querySelector('script[data-btm-food-input-fix]'))return;
  const f=document.createElement('script');f.src='./food-calculator-edit.js';f.defer=true;f.dataset.btmFoodInputFix='1';document.head.appendChild(f);
 };
 document.head.appendChild(s);
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
