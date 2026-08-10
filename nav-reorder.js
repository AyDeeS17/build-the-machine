(()=>{
  const STORAGE_KEY='btm-navigation-order-v1';
  const DEFAULT_ORDER=['trainingBtn','runningBtn','foodBtn','sleepBtn','progressBtn','rulesBtn'];
  const nav=document.querySelector('.btm-nav');
  if(!nav) return;

  const style=document.createElement('style');
  style.textContent=`
    .btm-nav{position:sticky;top:8px;z-index:1000;overflow:visible}
    .btm-nav .btn{position:relative;transition:transform .18s ease,box-shadow .18s ease,opacity .18s ease,background .18s ease;touch-action:pan-y;user-select:none;-webkit-user-select:none}
    .btm-nav .btn.btm-dragging{z-index:20;transform:scale(1.045) translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.42),0 0 14px rgba(102,185,223,.16);opacity:.94;cursor:grabbing}
    .btm-nav .btn.btm-drag-target{box-shadow:inset 0 0 0 1px var(--blue),0 0 12px rgba(102,185,223,.12)}
    .btm-nav .btn.btm-dragging *{pointer-events:none}
    .btm-nav .btm-drop-marker{width:3px;min-width:3px;height:34px;border-radius:4px;background:var(--blue);box-shadow:0 0 10px rgba(102,185,223,.55);align-self:center;animation:btmMarker .65s ease-in-out infinite alternate}
    .btm-nav.btm-reordering{cursor:grabbing}
    .btm-nav .btm-reset-order{margin-left:6px;white-space:nowrap;color:var(--muted);background:#0b151c;border:1px solid var(--line);border-radius:5px;padding:8px 10px;font:9px 'JetBrains Mono';font-weight:700;cursor:pointer;transition:.18s ease}
    .btm-nav .btm-reset-order:hover{color:var(--text);border-color:var(--blue);transform:translateY(-1px)}
    @keyframes btmMarker{from{opacity:.45;transform:scaleY(.72)}to{opacity:1;transform:scaleY(1)}}
    @media(max-width:800px){.btm-nav .btm-reset-order{grid-column:1/-1;margin:2px 0 0;width:100%}.btm-nav{top:4px}}
    @media(prefers-reduced-motion:reduce){.btm-nav .btn,.btm-nav .btm-reset-order{transition:none}.btm-nav .btm-drop-marker{animation:none}}
  `;
  document.head.appendChild(style);

  const buttons=()=>DEFAULT_ORDER.map(id=>document.getElementById(id)).filter(Boolean);
  const getOrder=()=>{try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return Array.isArray(saved)?saved:DEFAULT_ORDER}catch{return DEFAULT_ORDER}};
  const saveOrder=()=>localStorage.setItem(STORAGE_KEY,JSON.stringify(buttons().map(b=>b.id)));
  const applyOrder=()=>{
    const order=getOrder();
    const map=new Map(buttons().map(b=>[b.id,b]));
    order.forEach(id=>{const b=map.get(id);if(b)nav.insertBefore(b,resetBtn||null)});
    DEFAULT_ORDER.forEach(id=>{const b=map.get(id);if(b&&!nav.contains(b))nav.insertBefore(b,resetBtn||null)});
  };

  let resetBtn=null;
  resetBtn=document.createElement('button');
  resetBtn.type='button';
  resetBtn.className='btm-reset-order';
  resetBtn.textContent='RESET ORDER';
  resetBtn.title='Restore the default section order';
  nav.appendChild(resetBtn);
  resetBtn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    if(confirm('Reset the section navigation to the default order?')){
      localStorage.removeItem(STORAGE_KEY);
      applyOrder();
    }
  });
  applyOrder();

  let dragging=null, startX=0, startY=0, longPress=null, isDragging=false, marker=null, moved=false;
  const clearTarget=()=>buttons().forEach(b=>b.classList.remove('btm-drag-target'));
  const stopTimer=()=>{if(longPress){clearTimeout(longPress);longPress=null}};
  const makeMarker=()=>{if(!marker){marker=document.createElement('span');marker.className='btm-drop-marker'}};
  const finish=(cancel=false)=>{
    stopTimer();
    if(!dragging)return;
    if(!cancel && marker && marker.parentNode===nav){nav.insertBefore(dragging,marker);saveOrder()}
    if(marker&&marker.parentNode)marker.remove();
    clearTarget();
    dragging.classList.remove('btm-dragging');
    nav.classList.remove('btm-reordering');
    try{dragging.releasePointerCapture?.(dragging._pointerId)}catch{}
    dragging=null;isDragging=false;moved=false;
  };
  const position=(x)=>{
    if(!dragging)return;
    makeMarker();
    const candidates=buttons().filter(b=>b!==dragging);
    let placed=false;
    clearTarget();
    for(const b of candidates){
      const r=b.getBoundingClientRect();
      const mid=r.left+r.width/2;
      if(x<mid){nav.insertBefore(marker,b);b.classList.add('btm-drag-target');placed=true;break}
    }
    if(!placed)nav.insertBefore(marker,resetBtn);
  };

  buttons().forEach(btn=>{
    btn.addEventListener('pointerdown',e=>{
      if(e.button!==0 && e.pointerType==='mouse')return;
      stopTimer(); moved=false; startX=e.clientX; startY=e.clientY;
      btn._pointerId=e.pointerId;
      longPress=setTimeout(()=>{
        dragging=btn;isDragging=true;btn.classList.add('btm-dragging');nav.classList.add('btm-reordering');makeMarker();
        try{btn.setPointerCapture(e.pointerId)}catch{}
        position(e.clientX);
      }, e.pointerType==='mouse'?120:280);
    });
    btn.addEventListener('pointermove',e=>{
      const dx=Math.abs(e.clientX-startX),dy=Math.abs(e.clientY-startY);
      if(dx>8||dy>8)moved=true;
      if(!isDragging && moved && e.pointerType==='touch'){stopTimer();return}
      if(isDragging){e.preventDefault();position(e.clientX)}
    },{passive:false});
    btn.addEventListener('pointerup',e=>{
      stopTimer();
      if(isDragging){e.preventDefault();finish(false)}
    });
    btn.addEventListener('pointercancel',()=>finish(true));
    btn.addEventListener('lostpointercapture',()=>{if(isDragging)finish(false)});
    btn.addEventListener('click',e=>{
      if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}
    },true);
  });
})();
