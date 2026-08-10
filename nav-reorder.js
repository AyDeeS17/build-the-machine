(()=>{
  const nav=document.querySelector('.btm-nav');
  if(!nav)return;
  const DEFAULT_ORDER=['trainingBtn','runningBtn','foodBtn','sleepBtn','progressBtn','rulesBtn'];
  const STORAGE_KEY='btm-navigation-order-v1';
  const getButtons=()=>DEFAULT_ORDER.map(id=>document.getElementById(id)).filter(Boolean);
  const getOrder=()=>{try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return Array.isArray(v)?v:DEFAULT_ORDER}catch{return DEFAULT_ORDER}};
  const style=document.createElement('style');
  style.textContent=`
    .btm-nav{width:100%!important;max-width:none!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr));gap:7px!important}
    .btm-nav>.btn{width:100%;min-width:0;min-height:38px;will-change:transform;touch-action:none}
    .btm-nav .btm-dragging{position:fixed!important;z-index:10050!important;pointer-events:none!important;margin:0!important;transition:none!important;box-shadow:0 18px 42px rgba(0,0,0,.42),0 0 24px var(--theme-glow)!important;opacity:.96!important;transform:scale(1.025)!important}
    .btm-nav .btm-drag-target{box-shadow:0 0 0 1px var(--theme-primary,var(--blue)),0 0 16px var(--theme-glow)!important}
    .btm-drop-marker{display:block;height:38px;min-width:0;border:1px dashed var(--theme-primary,var(--blue));border-radius:5px;background:color-mix(in srgb,var(--theme-primary,var(--blue)) 8%,transparent);box-shadow:inset 0 0 18px color-mix(in srgb,var(--theme-primary,var(--blue)) 8%,transparent);pointer-events:none}
    .btm-reset-controls{width:100%;display:flex;align-items:center;gap:9px;margin:-15px 0 12px;padding:0}
    .btm-reset-control{position:relative;display:inline-flex;align-items:center;justify-content:center;width:192px;height:36px;padding:0 14px;border:1px solid rgba(187,83,67,.58);border-radius:6px;background:linear-gradient(145deg,#21171a,#120f12);color:#d6a29a;font:10px 'JetBrains Mono';font-weight:700;letter-spacing:.06em;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);transition:transform .2s ease,border-color .25s ease,box-shadow .3s ease,color .2s ease,background .25s ease}
    .btm-reset-control:hover{color:#ffe0c9;border-color:rgba(255,112,60,.88);background:linear-gradient(145deg,#33201c,#191115);box-shadow:0 0 0 1px rgba(255,83,46,.12),0 0 18px rgba(255,72,38,.2);transform:translateY(-1px)}
    .btm-reset-control:active{transform:translateY(0) scale(.985)}
    .btm-reset-controls #btm-universal-reset,.btm-reset-controls .btm-reset-order{position:relative!important;display:inline-flex!important;width:192px!important;min-width:192px!important;height:36px!important;margin:0!important;padding:0 14px!important;border:1px solid rgba(187,83,67,.58)!important;border-radius:6px!important;background:linear-gradient(145deg,#21171a,#120f12)!important;color:#d6a29a!important;font:10px 'JetBrains Mono'!important;font-weight:700!important;letter-spacing:.06em!important;cursor:pointer!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;transition:transform .2s ease,border-color .25s ease,box-shadow .3s ease,color .2s ease,background .25s ease!important}
    .btm-reset-controls #btm-universal-reset:hover,.btm-reset-controls .btm-reset-order:hover{color:#ffe0c9!important;border-color:rgba(255,112,60,.88)!important;background:linear-gradient(145deg,#33201c,#191115)!important;box-shadow:0 0 0 1px rgba(255,83,46,.12),0 0 18px rgba(255,72,38,.2)!important;transform:translateY(-1px)!important}
    .btm-reset-controls #btm-universal-reset::before,.btm-reset-controls #btm-universal-reset::after,.btm-reset-controls .btm-reset-order::before,.btm-reset-controls .btm-reset-order::after{display:none!important}
    .btm-theme-picker{width:100%!important;max-width:none!important;margin:0 0 22px!important}
    .btm-theme-options{width:100%;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px!important}
    .btm-theme-option{justify-content:center;width:100%;min-height:30px}
    @media(max-width:800px){.btm-nav{grid-template-columns:repeat(3,minmax(0,1fr))!important}.btm-reset-controls{margin:-8px 0 12px}.btm-reset-controls #btm-universal-reset,.btm-reset-controls .btm-reset-order{width:100%!important;min-width:0!important}.btm-theme-options{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
    @media(max-width:500px){.btm-nav{grid-template-columns:repeat(2,minmax(0,1fr))!important}.btm-reset-controls{flex-direction:column}.btm-reset-controls #btm-universal-reset,.btm-reset-controls .btm-reset-order{width:100%!important}.btm-theme-options{grid-template-columns:1fr 1fr!important}}
    @media(prefers-reduced-motion:reduce){.btm-nav .btm-dragging,.btm-reset-control{transition:none!important}}
  `;
  document.head.appendChild(style);

  const controls=document.createElement('div');
  controls.className='btm-reset-controls';
  const reset=document.createElement('button');
  reset.type='button';
  reset.className='btm-reset-order btm-reset-control';
  reset.textContent='RESET ORDER';
  reset.title='Restore the default section order';
  controls.appendChild(reset);
  nav.insertAdjacentElement('afterend',controls);

  const moveResetData=()=>{
    const data=document.getElementById('btm-universal-reset');
    if(data&&data.parentElement!==controls){controls.appendChild(data);data.classList.add('btm-reset-control')}
    const picker=document.querySelector('.btm-theme-picker');
    if(picker&&picker.previousElementSibling!==controls)controls.insertAdjacentElement('afterend',picker);
  };
  const observer=new MutationObserver(moveResetData);
  observer.observe(document.body,{childList:true,subtree:true});
  moveResetData();

  const applyOrder=()=>{
    const map=new Map(getButtons().map(b=>[b.id,b]));
    getOrder().forEach(id=>{const b=map.get(id);if(b)nav.appendChild(b)});
    DEFAULT_ORDER.forEach(id=>{const b=map.get(id);if(b&&!nav.contains(b))nav.appendChild(b)});
  };
  reset.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();localStorage.removeItem(STORAGE_KEY);applyOrder()});
  applyOrder();

  let dragging=null,marker=null,timer=null,moved=false,pointerId=null,offsetX=0,offsetY=0,lastMarker=null;
  const buttons=()=>getButtons();
  const clearTargets=()=>buttons().forEach(b=>b.classList.remove('btm-drag-target'));
  const rectMap=()=>new Map(buttons().map(b=>[b,b.getBoundingClientRect()]));
  const animateLayout=(before)=>{
    requestAnimationFrame(()=>{
      buttons().forEach(b=>{
        const old=before.get(b),now=b.getBoundingClientRect();
        if(!old) return;
        const dx=old.left-now.left,dy=old.top-now.top;
        if(Math.abs(dx)+Math.abs(dy)<1)return;
        b.style.transition='none';
        b.style.transform=`translate(${dx}px,${dy}px)`;
        requestAnimationFrame(()=>{b.style.transition='transform .22s cubic-bezier(.2,.8,.2,1)';b.style.transform='';setTimeout(()=>{b.style.transition='';},240)});
      });
    });
  };
  const ensureMarker=()=>{if(!marker){marker=document.createElement('span');marker.className='btm-drop-marker'}};
  const findTarget=(x,y)=>{
    let best=null,bestDist=Infinity;
    for(const b of buttons()){
      if(b===dragging)continue;
      const r=b.getBoundingClientRect();
      const cx=r.left+r.width/2,cy=r.top+r.height/2;
      const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);
      if(d<bestDist){bestDist=d;best=b}
    }
    return best;
  };
  const moveMarker=(x,y)=>{
    if(!dragging)return;
    const target=findTarget(x,y);
    if(!target)return;
    if(target===lastMarker)return;
    lastMarker=target;
    ensureMarker();
    const before=rectMap();
    clearTargets();
    nav.insertBefore(marker,target);
    target.classList.add('btm-drag-target');
    animateLayout(before);
  };
  const startDrag=e=>{
    if(dragging)return;
    dragging=e.currentTarget;
    pointerId=e.pointerId;
    const r=dragging.getBoundingClientRect();
    offsetX=e.clientX-r.left;offsetY=e.clientY-r.top;
    dragging.style.width=r.width+'px';dragging.style.height=r.height+'px';dragging.style.left=r.left+'px';dragging.style.top=r.top+'px';
    dragging.classList.add('btm-dragging');
    try{dragging.setPointerCapture(pointerId)}catch{}
    ensureMarker();
    marker.style.width=r.width+'px';marker.style.height=r.height+'px';
    const before=rectMap();nav.insertBefore(marker,dragging);animateLayout(before);
    dragging.style.left=(e.clientX-offsetX)+'px';dragging.style.top=(e.clientY-offsetY)+'px';
    lastMarker=null;moveMarker(e.clientX,e.clientY);
  };
  const finish=cancel=>{
    if(timer){clearTimeout(timer);timer=null}
    if(!dragging)return;
    const b=dragging;
    if(cancel){marker?.remove();b.style.cssText=b.dataset.btmDragStyle||'';b.classList.remove('btm-dragging');clearTargets();dragging=null;moved=false;return}
    const before=rectMap();
    if(marker?.parentNode===nav)nav.insertBefore(b,marker);
    marker?.remove();clearTargets();
    localStorage.setItem(STORAGE_KEY,JSON.stringify(buttons().map(x=>x.id)));
    const target=b.getBoundingClientRect();
    const currentLeft=parseFloat(b.style.left)||0,currentTop=parseFloat(b.style.top)||0;
    b.style.transition='left .22s cubic-bezier(.2,.8,.2,1),top .22s cubic-bezier(.2,.8,.2,1),transform .22s cubic-bezier(.2,.8,.2,1)';
    b.style.left=target.left+'px';b.style.top=target.top+'px';
    setTimeout(()=>{b.style.cssText=b.dataset.btmDragStyle||'';b.classList.remove('btm-dragging')},230);
    animateLayout(before);
    dragging=null;moved=false;lastMarker=null;pointerId=null;
  };
  buttons().forEach(btn=>{
    btn.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;btn.dataset.btmDragStyle=btn.style.cssText;btn.__btmStartX=e.clientX;btn.__btmStartY=e.clientY;btn.__btmMoved=false;timer=setTimeout(()=>startDrag({currentTarget:btn,pointerId:e.pointerId,clientX:e.clientX,clientY:e.clientY}),e.pointerType==='mouse'?140:260)});
    btn.addEventListener('pointermove',e=>{const dx=Math.abs(e.clientX-btn.__btmStartX),dy=Math.abs(e.clientY-btn.__btmStartY);if(dx>8||dy>8){moved=true;btn.__btmMoved=true}if(dragging===btn){e.preventDefault();btn.style.left=(e.clientX-offsetX)+'px';btn.style.top=(e.clientY-offsetY)+'px';moveMarker(e.clientX,e.clientY)}},{passive:false});
    btn.addEventListener('pointerup',e=>{if(timer){clearTimeout(timer);timer=null}if(dragging===btn){e.preventDefault();finish(false)}});
    btn.addEventListener('pointercancel',()=>finish(true));
    btn.addEventListener('click',e=>{if(btn.__btmMoved){e.preventDefault();e.stopImmediatePropagation();btn.__btmMoved=false}},true);
  });

  const themeScript=document.createElement('script');
  themeScript.src='./theme.js';
  document.head.appendChild(themeScript);
  const programScript=document.createElement('script');
  programScript.src='./program-ui.js?v=2';
  document.head.appendChild(programScript);
})();