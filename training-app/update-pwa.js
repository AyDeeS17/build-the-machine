(()=>{'use strict';
const loadCalendar=()=>{if(document.getElementById('btmCalendarLive'))return;const s=document.createElement('script');s.id='btmCalendarLive';s.src='./calendar-live.js?v=41';document.body.appendChild(s)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCalendar,{once:true});else loadCalendar();
if(!('serviceWorker'in navigator))return;
window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('./sw.js?v=41',{scope:'./',updateViaCache:'none'});await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(window.__btmPwaReloaded)return;window.__btmPwaReloaded=true;window.location.reload()})}catch(err){console.warn('BTM PWA update failed',err)}})
})();
