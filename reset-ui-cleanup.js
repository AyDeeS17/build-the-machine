/* Reset UI cleanup, remove retired duplicate controls and character-emblem leftovers. */
(()=>{
'use strict';
if(window.__BTM_RESET_UI_CLEANUP__)return;
window.__BTM_RESET_UI_CLEANUP__=1;
const removeLegacy=()=>{
  document.getElementById('resetWeekBtn')?.remove();
  document.querySelectorAll('.reset-week').forEach(el=>el.remove());
  document.querySelectorAll('.btm-inline-emblem,.btm-week-emblem,.btm-emblem,.btm-emblem-panel,.week-emblem,.character-emblem,.character-logo').forEach(el=>el.remove());
  document.getElementById('btm-pixel-characters-script')?.remove();
};
const boot=()=>{removeLegacy();setTimeout(removeLegacy,0);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
