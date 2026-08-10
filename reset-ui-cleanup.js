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
const loadPixelCharacters=()=>{
  if(document.getElementById('btm-pixel-characters-script'))return;
  const s=document.createElement('script');
  s.id='btm-pixel-characters-script';
  s.src='./pixel-characters.js?v=2';
  s.defer=true;
  document.head.appendChild(s);
};
const boot=()=>{removeLegacy();loadPixelCharacters();setTimeout(removeLegacy,0);};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
