(()=>{
'use strict';
if(!('serviceWorker' in navigator))return;
window.addEventListener('load',async()=>{
 try{
  const VERSION='7';
  const reg=await navigator.serviceWorker.register(`./sw.js?v=${VERSION}`,{scope:'./',updateViaCache:'none'});
  await reg.update();
  if(reg.waiting)reg.waiting.postMessage({type:'SKIP_WAITING'});
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   if(!window.__btmReloaded){
    window.__btmReloaded=true;
    window.location.reload();
   }
  });
 }catch(e){console.warn('PWA update registration failed',e)}
});
})();
