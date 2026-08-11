(()=>{
'use strict';
if(window.__BTM_INTERACTION_SAFETY__)return;
window.__BTM_INTERACTION_SAFETY__=true;
const style=document.createElement('style');
style.id='btmInteractionSafety';
style.textContent=`
/* HARD HIT-TEST RULE: closed modal layers are never allowed to receive iPhone touches. */
.sheet-backdrop.hidden,
.skip-confirm-backdrop.hidden{pointer-events:none!important;visibility:hidden!important;display:none!important}
.sheet-backdrop:not(.hidden),
.skip-confirm-backdrop:not(.hidden){pointer-events:auto!important;visibility:visible!important}
#settingsSheet,#resetSheet,#skipConfirm{pointer-events:none!important}
#settingsSheet:not(.hidden),#resetSheet:not(.hidden),#skipConfirm:not(.hidden){pointer-events:auto!important}
/* Decorative layers must never sit in the touch path. */
.btm-ripple,
.btm-ripple-host::before,
.btm-ripple-host::after,
.sheet::before,
button::after{pointer-events:none!important}
/* Explicitly preserve native tap + vertical scrolling behavior on iPhone. */
button,[role="button"],a,input,select,textarea{touch-action:manipulation}
#app,#workouts,#progressView{touch-action:pan-y}
/* The page itself is the hit-test surface when no modal is open. */
.app-shell,main#app{position:relative;z-index:1}
.sheet-backdrop:not(.hidden),.skip-confirm-backdrop:not(.hidden){z-index:100}
`;
document.head.appendChild(style);
const modalIds=['settingsSheet','resetSheet','skipConfirm'];
function syncModal(id){
 const el=document.getElementById(id);
 if(!el)return;
 const hidden=el.classList.contains('hidden');
 const closing=el.classList.contains('closing');
 const open=!hidden&&!closing;
 el.style.pointerEvents=open?'auto':'none';
 el.style.visibility=open?'visible':'hidden';
 el.setAttribute('aria-hidden',String(!open));
}
function sync(){
 modalIds.forEach(syncModal);
 const guided=document.getElementById('btmGuided');
 if(guided){
  const open=guided.classList.contains('open');
  guided.style.pointerEvents=open?'auto':'none';
  guided.style.visibility=open?'visible':'hidden';
  guided.setAttribute('aria-hidden',String(!open));
 }
}
sync();
const observer=new MutationObserver(sync);
observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','aria-hidden']});
window.addEventListener('pageshow',sync,{passive:true});
})();
