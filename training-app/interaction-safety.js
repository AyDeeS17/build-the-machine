(()=>{
'use strict';
if(window.__BTM_INTERACTION_SAFETY__)return;
window.__BTM_INTERACTION_SAFETY__=true;
const style=document.createElement('style');
style.id='btmInteractionSafety';
style.textContent=`
/* Inactive modal backdrops must never own the iPhone hit-test surface. */
.sheet-backdrop.hidden{pointer-events:none!important;visibility:hidden!important}
.sheet-backdrop:not(.hidden){pointer-events:auto!important;visibility:visible!important}
#settingsSheet{pointer-events:none!important}
#settingsSheet:not(.hidden){pointer-events:auto!important}
#resetSheet{pointer-events:none!important}
#resetSheet:not(.hidden){pointer-events:auto!important}
/* Decorative interaction layers are visual only. */
.btm-ripple,.btm-ripple-host::before,.btm-ripple-host::after{pointer-events:none!important}
/* Keep taps responsive without taking pan gestures away from the page. */
button,[role="button"],a{touch-action:manipulation}
`;
document.head.appendChild(style);
const modalIds=['settingsSheet','resetSheet'];
function syncModal(id){
 const el=document.getElementById(id);
 if(!el)return;
 const hidden=el.classList.contains('hidden');
 const closing=el.classList.contains('closing');
 el.style.pointerEvents=(hidden||closing)?'none':'auto';
 el.style.visibility=hidden?'hidden':'visible';
}
function sync(){
 modalIds.forEach(syncModal);
 const guided=document.getElementById('btmGuided');
 if(guided){
  const open=guided.classList.contains('open');
  guided.style.pointerEvents=open?'auto':'none';
  guided.style.visibility=open?'visible':'hidden';
 }
}
sync();
const observer=new MutationObserver(sync);
observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden']});
window.addEventListener('pageshow',sync,{passive:true});
})();
