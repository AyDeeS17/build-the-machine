/* Nutrition calculator loader, simplified v3. */
(()=>{
  'use strict';
  if(window.__BTM_FOOD_LOADER__)return;
  window.__BTM_FOOD_LOADER__=true;
  const load=()=>{
    if(document.querySelector('script[data-btm-food-v3]'))return;
    const s=document.createElement('script');
    s.src='./food-calculator-v3.js';
    s.defer=true;
    s.dataset.btmFoodV3='1';
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
