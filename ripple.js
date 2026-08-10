/* Unified UI bootstrap. The interaction stylesheet stays in ripple.css. */
(()=>{
  const load=()=>{
    if(window.__btmShellLoaded)return;
    window.__btmShellLoaded=true;
    const s=document.createElement('script');
    s.src='./app-shell.js';
    s.defer=true;
    document.head.appendChild(s);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();
