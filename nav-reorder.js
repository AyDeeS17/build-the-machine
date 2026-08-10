(()=>{
  const nav=document.querySelector('.btm-nav');
  if(!nav)return;
  const DEFAULT_ORDER=['trainingBtn','runningBtn','foodBtn','sleepBtn','progressBtn','rulesBtn'];
  const STORAGE_KEY='btm-navigation-order-v1';
  const getButtons=()=>DEFAULT_ORDER.map(id=>document.getElementById(id)).filter(Boolean);
  const getOrder=()=>{try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');return Array.isArray(v)?v:DEFAULT_ORDER}catch{return DEFAULT_ORDER}};
  let reset=null;
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
