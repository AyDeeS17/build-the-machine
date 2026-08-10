/* Reset UI cleanup, removes legacy duplicate controls and the secondary anime emblem. */
(()=>{
'use strict';
if(window.__BTM_RESET_UI_CLEANUP__)return;
window.__BTM_RESET_UI_CLEANUP__=1;
const removeLegacy=()=>{
  document.getElementById('resetWeekBtn')?.remove();
  document.querySelectorAll('.reset-week').forEach(el=>el.remove());
  document.querySelectorAll('.btm-inline-emblem').forEach(el=>el.remove());
};
const boot=()=>{removeLegacy();setTimeout(removeLegacy,0);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
