(()=>{
  const nav=document.querySelector('.btm-nav');
  if(!nav)return;
  const DEFAULT_ORDER=['trainingBtn','runningBtn','foodBtn','sleepBtn','progressBtn','rulesBtn'];
  const STORAGE_KEY='btm-navigation-order-v1';
  const getButtons=()=>DEFAULT_ORDER.map(id=>document.getElementById(id)).filter(Boolean);
  const getOrder=()=>{try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return Array.isArray(v)?v:DEFAULT_ORDER}catch{return DEFAULT_ORDER}};
  let reset=null;

  const style=document.createElement('style');
  style.textContent=`
    .btm-nav .btm-reset-order{position:relative;isolation:isolate;overflow:hidden;margin-left:2px;display:inline-flex;align-items:center;justify-content:center;min-width:118px;height:34px;padding:0 14px;border:1px solid rgba(187,83,67,.58);border-radius:6px;background:linear-gradient(145deg,#21171a,#120f12);color:#d6a29a;font:10px 'JetBrains Mono';font-weight:700;letter-spacing:.06em;cursor:pointer;box-shadow:inset 0 1px 0 rgba(255,255,255,.025);transition:transform .2s ease,border-color .25s ease,box-shadow .3s ease,color .2s ease,background .25s ease}
    .btm-nav .btm-reset-order::before{content:'';position:absolute;z-index:-1;left:18%;right:18%;bottom:-16px;height:30px;border-radius:50%;background:radial-gradient(ellipse at center,rgba(255,92,42,.72) 0,rgba(231,65,37,.3) 36%,transparent 72%);opacity:0;filter:blur(7px);transform:translateY(7px) scale(.7);transition:opacity .25s ease,transform .3s ease}
    .btm-nav .btm-reset-order::after{content:'';position:absolute;z-index:-1;left:22%;bottom:0;width:56%;height:25px;background:radial-gradient(ellipse at 30% 100%,rgba(255,172,62,.8) 0 5%,transparent 18%),radial-gradient(ellipse at 67% 100%,rgba(242,78,38,.7) 0 6%,transparent 20%),radial-gradient(ellipse at 50% 100%,rgba(255,112,39,.65) 0 5%,transparent 20%);opacity:0;filter:blur(2px);transform:translateY(8px) scaleY(.55);transform-origin:bottom;transition:opacity .22s ease,transform .28s ease}
    .btm-nav .btm-reset-order:hover{color:#ffe0c9;border-color:rgba(255,112,60,.88);background:linear-gradient(145deg,#33201c,#191115);box-shadow:0 0 0 1px rgba(255,83,46,.12),0 0 18px rgba(255,72,38,.2),0 0 34px rgba(231,68,31,.08);transform:translateY(-1px)}
    .btm-nav .btm-reset-order:hover::before{opacity:1;transform:translateY(-2px) scale(1)}
    .btm-nav .btm-reset-order:hover::after{opacity:.9;transform:translateY(-2px) scaleY(1);animation:btmResetOrderHeat 1.15s ease-in-out infinite alternate}
    .btm-nav .btm-reset-order:active{transform:translateY(0) scale(.985)}
    @keyframes btmResetOrderHeat{from{filter:blur(2px);opacity:.68}to{filter:blur(3px);opacity:1;transform:translateY(-4px) scaleY(1.12)}}
    @media(max-width:800px){.btm-nav .btm-reset-order{margin-left:0;width:100%;grid-column:1/-1}.btm-nav{top:4px}}
    @media(prefers-reduced-motion:reduce){.btm-nav .btm-reset-order{transition:none!important}.btm-nav .btm-reset-order::before,.btm-nav .btm-reset-order::after{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(style);

  const applyOrder=()=>{const map=new Map(getButtons().map(b=>[b.id,b]));getOrder().forEach(id=>{const b=map.get(id);if(b)nav.insertBefore(b,reset)});DEFAULT_ORDER.forEach(id=>{const b=map.get(id);if(b&&!nav.contains(b))nav.insertBefore(b,reset)})};
  reset=document.createElement('button');reset.type='button';reset.className='btm-reset-order';reset.textContent='RESET ORDER';reset.title='Restore the default section order';nav.appendChild(reset);
  reset.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();localStorage.removeItem(STORAGE_KEY);applyOrder()});
  applyOrder();
  let dragging=null,marker=null,startX=0,startY=0,timer=null,moved=false;
  const clear=()=>getButtons().forEach(b=>b.classList.remove('btm-drag-target'));
  const makeMarker=()=>{if(!marker){marker=document.createElement('span');marker.className='btm-drop-marker'}};
  const finish=(cancel=false)=>{if(timer){clearTimeout(timer);timer=null}if(!dragging)return;if(!cancel&&marker?.parentNode===nav){nav.insertBefore(dragging,marker);localStorage.setItem(STORAGE_KEY,JSON.stringify(getButtons().map(b=>b.id)))}marker?.remove();clear();dragging.classList.remove('btm-dragging');dragging=null;moved=false};
  const position=x=>{if(!dragging)return;makeMarker();clear();let placed=false;for(const b of getButtons()){if(b===dragging)continue;const r=b.getBoundingClientRect();if(x<r.left+r.width/2){nav.insertBefore(marker,b);b.classList.add('btm-drag-target');placed=true;break}}if(!placed)nav.insertBefore(marker,reset)};
  getButtons().forEach(btn=>{
    btn.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType==='mouse')return;startX=e.clientX;startY=e.clientY;moved=false;timer=setTimeout(()=>{dragging=btn;btn.classList.add('btm-dragging');try{btn.setPointerCapture(e.pointerId)}catch{}position(e.clientX)},e.pointerType==='mouse'?140:280)});
    btn.addEventListener('pointermove',e=>{const dx=Math.abs(e.clientX-startX),dy=Math.abs(e.clientY-startY);if(dx>8||dy>8)moved=true;if(dragging){e.preventDefault();position(e.clientX)}else if(moved&&e.pointerType==='touch'&&timer){clearTimeout(timer);timer=null}},{passive:false});
    btn.addEventListener('pointerup',e=>{if(timer){clearTimeout(timer);timer=null}if(dragging){e.preventDefault();finish(false)}});
    btn.addEventListener('pointercancel',()=>finish(true));
    btn.addEventListener('click',e=>{if(moved){e.preventDefault();e.stopImmediatePropagation();moved=false}},true);
  });
})();
