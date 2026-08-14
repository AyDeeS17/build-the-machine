(()=>{
'use strict';

const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

function models(){
  return window.BTM_ACHIEVEMENTS?.models?.()||[];
}

function claims(){
  const c=read('btm_achievement_claims_v1',{});
  return c&&typeof c==='object'?c:{};
}

function claimedIdsFromCards(){
  const root=document.getElementById('achievementList');
  if(!root)return new Set();
  return new Set([...root.querySelectorAll('.achievement-card.claimed')]
    .map(c=>c.dataset.achievementId)
    .filter(Boolean));
}

function isClaimed(a,claimed,cardIds){
  const value=claimed[a.id];
  return value===true||value?.claimed===true||a.claimed===true||cardIds.has(a.id);
}

function decorateCards(){
  const root=document.getElementById('achievementList');
  if(!root)return;
  const ms=models();
  const byId=new Map(ms.map(a=>[a.id,a]));

  root.querySelectorAll('.achievement-card').forEach(card=>{
    const a=byId.get(card.dataset.achievementId);
    if(!a)return;
    let reward=card.querySelector('.achievement-title-reward');
    if(!reward){
      reward=document.createElement('div');
      reward.className='achievement-title-reward';
      const progress=card.querySelector('.achievement-progress');
      (progress||card.querySelector('.achievement-note'))?.insertAdjacentElement('beforebegin',reward);
    }
    reward.innerHTML=`TITLE REWARD <strong>${esc(a.titleReward)}</strong>`;
  });
}

function inject(){
  if(document.getElementById('achievementTitleSyncCSS'))return;
  const s=document.createElement('style');
  s.id='achievementTitleSyncCSS';
  s.textContent=`
    .achievement-title-reward{
      grid-column:2;
      margin-top:6px;
      color:var(--muted);
      font:800 7px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.09em;
    }
    .achievement-title-reward strong{color:#9fdcf5;font-weight:900}
    .achievement-card.claimed .achievement-title-reward strong{color:#91e19d}
  `;
  document.head.appendChild(s);
}

function observeAchievements(){
  const root=document.getElementById('achievementList');
  if(!root||root.__titleObserver)return;
  const obs=new MutationObserver(()=>decorateCards());
  obs.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-achievement-id']});
  root.__titleObserver=obs;
}

function boot(){
  inject();
  decorateCards();
  observeAchievements();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
