(()=>{
'use strict';

const TITLE_KEY='btm_equipped_title_v1';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const esc=s=>String(s??'').replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));

const iconFor=id=>({
  first_rep:'✦',
  no_excuses:'◈',
  clean_machine:'✧',
  iron_week:'▣',
  halfway:'◇',
  perfect_week:'★',
  consistent:'▥',
  legend:'♛'
}[id]||'◆');

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

function availableTitles(){
  const claimed=claims();
  const cardIds=claimedIdsFromCards();
  return models().filter(a=>isClaimed(a,claimed,cardIds));
}

function renderTitleSection(){
  const header=document.querySelector('.app-header');
  if(!header)return;

  let el=document.getElementById('titleSection');
  if(!el){
    el=document.createElement('section');
    el.id='titleSection';
    el.className='title-section';
    header.insertBefore(el,header.querySelector('.main-nav')||null);
  }

  const available=availableTitles();
  const equipped=localStorage.getItem(TITLE_KEY)||'';
  const sig=JSON.stringify({equipped,available:available.map(a=>[a.id,a.titleReward])});
  if(el.dataset.sig===sig)return;
  el.dataset.sig=sig;

  el.innerHTML=`
    <div class="achievement-title-kicker">EQUIPPED TITLE</div>
    <div class="achievement-title-current">
      <span class="achievement-title-current-icon">${iconFor(available.find(a=>a.titleReward===equipped)?.id)}</span>
      <strong>${esc(equipped||'SELECT A TITLE')}</strong>
    </div>
    ${available.length?`
      <div class="achievement-title-options" role="group" aria-label="Available titles">
        ${available.map(a=>`
          <button type="button" class="achievement-title-option ${equipped===a.titleReward?'active':''}" data-title="${esc(a.titleReward)}">
            <span class="achievement-title-option-icon">${iconFor(a.id)}</span>
            <span class="achievement-title-option-copy">
              <strong>${esc(a.titleReward)}</strong>
              <small>${equipped===a.titleReward?'EQUIPPED':'EQUIP TITLE'}</small>
            </span>
            ${equipped===a.titleReward?'<span class="achievement-title-check">✓</span>':''}
          </button>
        `).join('')}
      </div>
    `:`
      <div class="achievement-title-empty">Claim achievements to unlock titles.</div>
    `}
  `;

  el.querySelectorAll('.achievement-title-option').forEach(button=>{
    button.addEventListener('click',()=>{
      const title=button.dataset.title;
      if(!title)return;
      localStorage.setItem(TITLE_KEY,title);
      renderTitleSection();
    });
  });
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
    .title-section{
      margin:10px 0 14px;
      padding:14px;
      border:1px solid var(--line);
      border-radius:16px;
      background:linear-gradient(145deg,#0d1820,#081118);
      box-shadow:0 10px 28px rgba(0,0,0,.18);
    }
    .achievement-title-kicker{
      font:800 8px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.16em;
      color:var(--muted);
      margin-bottom:7px;
      text-align:center;
    }
    .achievement-title-current{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      width:100%;
      min-height:44px;
      padding:9px 12px;
      box-sizing:border-box;
      border:1px solid rgba(102,185,223,.28);
      border-radius:11px;
      background:rgba(102,185,223,.055);
      color:#fff;
      font:900 11px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.08em;
      text-align:center;
      text-shadow:0 0 10px rgba(190,235,255,.25);
    }
    .achievement-title-current-icon{
      color:#bfeeff;
      font-size:15px;
    }
    .achievement-title-options{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:7px;
      margin-top:8px;
    }
    .achievement-title-option{
      position:relative;
      display:flex;
      align-items:center;
      gap:8px;
      min-width:0;
      min-height:48px;
      padding:9px 10px;
      border:1px solid var(--line);
      border-radius:11px;
      background:rgba(255,255,255,.025);
      color:var(--muted);
      text-align:left;
      cursor:pointer;
      transition:transform .15s ease,border-color .2s ease,background .2s ease,box-shadow .2s ease,color .2s ease;
      -webkit-tap-highlight-color:transparent;
      touch-action:manipulation;
    }
    .achievement-title-option:hover{
      transform:translateY(-1px);
      border-color:rgba(102,185,223,.4);
      background:rgba(102,185,223,.065);
    }
    .achievement-title-option:active{transform:scale(.985)}
    .achievement-title-option.active{
      border-color:rgba(102,185,223,.75);
      color:#e8fbff;
      background:linear-gradient(145deg,rgba(102,185,223,.13),rgba(102,185,223,.045));
      box-shadow:0 0 18px rgba(102,185,223,.1),inset 0 1px 0 rgba(255,255,255,.05);
    }
    .achievement-title-option-icon{
      flex:0 0 24px;
      width:24px;
      height:24px;
      display:grid;
      place-items:center;
      border:1px solid rgba(102,185,223,.2);
      border-radius:7px;
      color:#bfeeff;
      background:rgba(102,185,223,.06);
      font-size:13px;
    }
    .achievement-title-option.active .achievement-title-option-icon{
      border-color:rgba(102,185,223,.5);
      background:rgba(102,185,223,.12);
    }
    .achievement-title-option-copy{
      min-width:0;
      display:flex;
      flex-direction:column;
      gap:3px;
    }
    .achievement-title-option-copy strong{
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap;
      font:900 8px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.08em;
    }
    .achievement-title-option-copy small{
      font:800 6px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.09em;
      color:var(--muted);
    }
    .achievement-title-option.active .achievement-title-option-copy small{color:#91dff8}
    .achievement-title-check{
      margin-left:auto;
      color:#91e19d;
      font-size:13px;
      line-height:1;
    }
    .achievement-title-empty{
      margin-top:8px;
      padding:9px 10px;
      color:var(--muted);
      font:700 8px ui-monospace,SFMono-Regular,Menlo,monospace;
      text-align:center;
      border:1px dashed var(--line);
      border-radius:10px;
    }
    .achievement-title-reward{
      grid-column:2;
      margin-top:6px;
      color:var(--muted);
      font:800 7px ui-monospace,SFMono-Regular,Menlo,monospace;
      letter-spacing:.09em;
    }
    .achievement-title-reward strong{color:#9fdcf5;font-weight:900}
    .achievement-card.claimed .achievement-title-reward strong{color:#91e19d}
    @media(max-width:420px){
      .achievement-title-options{grid-template-columns:1fr}
    }
    @media(prefers-reduced-motion:reduce){
      .achievement-title-option{transition:none!important}
    }
  `;
  document.head.appendChild(s);
}

function observeAchievements(){
  const root=document.getElementById('achievementList');
  if(!root||root.__titleObserver)return;
  const obs=new MutationObserver(()=>{
    decorateCards();
    renderTitleSection();
  });
  obs.observe(root,{subtree:true,childList:true,attributes:true,attributeFilter:['class','data-achievement-id']});
  root.__titleObserver=obs;
}

function boot(){
  inject();
  renderTitleSection();
  decorateCards();
  observeAchievements();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
else boot();
})();
