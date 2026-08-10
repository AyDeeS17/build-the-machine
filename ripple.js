/* Unified UI bootstrap. The interaction stylesheet stays in ripple.css. */
(()=>{
  const syncTraining=()=>{
    const training=document.getElementById('trainingView');
    if(training)training.style.display=document.body.dataset.section==='training'?'block':'none';
  };
  const load=()=>{
    if(window.__btmShellLoaded)return;
    window.__btmShellLoaded=true;
    const s=document.createElement('script');
    s.src='./app-shell.js';
    s.defer=true;
    s.onload=()=>{syncTraining();new MutationObserver(syncTraining).observe(document.body,{attributes:true,attributeFilter:['data-section']})};
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
