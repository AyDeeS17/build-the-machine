(()=>{
'use strict';
if(!('serviceWorker' in navigator))return;
window.addEventListener('load',async()=>{
 try{
  const reg=await navigator.serviceWorker.register('./sw.js?v=6',{scope:'./',updateViaCache:'none'});
  await reg.update();
  navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!window.__btmReloaded){window.__btmReloaded=true;window.location.reload()}});
 }catch(e){console.warn('PWA update registration failed',e)}
});
})();
