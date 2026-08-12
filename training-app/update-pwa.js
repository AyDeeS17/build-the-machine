(()=>{'use strict';
const APP_VERSION='43';
const loadCalendar=()=>{if(document.getElementById('btmCalendarLive'))return;const s=document.createElement('script');s.id='btmCalendarLive';s.src=`./calendar-live.js?v=${APP_VERSION}`;document.body.appendChild(s)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCalendar,{once:true});else loadCalendar();
if(!('serviceWorker'in navigator))return;
window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register(`./sw-v${APP_VERSION}.js`,{scope:'./',updateViaCache:'none'});await reg.update();if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(window.__btmPwaReloaded)return;window.__btmPwaReloaded=true;window.location.reload()})}catch(err){console.warn('BTM PWA update failed',err)}})
})();
