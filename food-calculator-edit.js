/* Smart Food Calculator input normalizer. */
(()=>{
'use strict';
if(window.__BTM_FOOD_INPUT_FIX__)return;window.__BTM_FOOD_INPUT_FIX__=1;
const parse=()=>{
 const q=document.getElementById('foodCalcSearch'),qty=document.getElementById('foodCalcQty'),unit=document.getElementById('foodCalcUnit');
 if(!q||!qty||!unit)return;
 const m=q.value.trim().match(/^\s*(\d+(?:\.\d+)?)\s*(kg|g|grams?|ml|l|liters?|pieces?|pcs?|eggs?|slices?|servings?)?\s*(?:of\s+)?(.+?)\s*$/i);
 if(!m)return;
 let n=+m[1],u=(m[2]||'').toLowerCase();
 if(/^kg$/.test(u)){n*=1000;u='g'}
 else if(/^l$|^liter/.test(u)){n*=1000;u='ml'}
 else if(/^gram|^g$/.test(u))u='g';
 else if(/^ml$/.test(u))u='ml';
 else if(/^egg|^piece|^pc/.test(u))u='piece';
 else if(/^slice/.test(u))u='slice';
 else if(/^serv/.test(u))u='serving';
 else return;
 qty.value=n;unit.value=u;
};
const boot=()=>{const b=document.getElementById('foodCalcAdd');if(!b||b.dataset.qtyFix)return;b.dataset.qtyFix='1';b.addEventListener('click',parse,true);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
new MutationObserver(boot).observe(document.body,{childList:true,subtree:true});
})();
