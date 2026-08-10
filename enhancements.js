/* Character emblem presentation for Build The Machine. */
(()=>{
'use strict';
if(window.__BTM_CHARACTER_EMBLEMS__)return;
window.__BTM_CHARACTER_EMBLEMS__=1;

const EMBLEMS=[
  {name:'Four-Star Dragon Ball',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="36"/><path d="M50 25l5.7 16.1H73l-13.9 9.8 5.4 16.2L50 57.4 35.5 67l5.4-16.1L27 41.1h17.3z"/></svg>`},
  {name:'Sun Crest',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="19"/><g>${Array.from({length:12},(_,i)=>`<path transform="rotate(${i*30} 50 50)" d="M47 8h6l-2 19h-2z"/>`).join('')}</g></svg>`},
  {name:'Black Talisman',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M30 16h40l7 9-7 59H30l-7-59z"/><path d="M38 31h24M38 43h24M38 55h16"/></svg>`},
  {name:'Wings Emblem',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 82C39 64 27 48 10 39c13 1 25 6 35 16-5-15-8-28-7-37 8 9 14 20 17 32 3-12 9-23 17-32 1 9-2 22-7 37 10-10 22-15 35-16-17 9-29 25-40 43z"/></svg>`},
  {name:'Twin Daggers',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 18l13 7-7 38-8 19-4-20zM76 18l-13 7 7 38 8 19 4-20z"/><path d="M19 69h20M61 69h20"/></svg>`},
  {name:'Saiyan Crest',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M22 25h56l-9 17-19 7-19-7z"/><path d="M34 49l-7 27 23-12 23 12-7-27"/></svg>`},
  {name:'Infinity Eye',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 50Q50 18 88 50 50 82 12 50Z"/><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="4"/></svg>`},
  {name:'Cursed Spear',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10v80"/><path d="M50 12l-15 20 15-5 15 5zM50 42l-13 16 13-5 13 5z"/><path d="M41 90h18"/></svg>`},
  {name:'Ghoul Mask',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M24 22q26-17 52 0l-3 48-23 18-23-18z"/><path d="M31 40l15 5M69 40L54 45M38 63q12 8 24 0"/><circle cx="39" cy="37" r="4"/><circle cx="61" cy="37" r="4"/></svg>`},
  {name:'Crow Feather',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M67 10C43 20 28 39 27 69c13-12 28-17 43-18-12-7-21-17-26-29 11 8 22 12 34 13-2-9-6-17-11-25z"/><path d="M28 70l-9 19"/></svg>`},
  {name:'Hawk Wing',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M12 68C29 57 38 43 45 20c7 12 10 25 8 38 10-13 20-22 35-28-8 18-21 31-39 39-13 5-25 5-37-1z"/><path d="M22 73q28 8 57-12"/></svg>`},
  {name:'Brand of Sacrifice',svg:`<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 10v80M18 29l64 42M82 29L18 71"/><path d="M18 29l20 6M82 29L62 35M18 71l20-6M82 71L62 65"/></svg>`}
];

const css=`
.btm-character-card{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:20px;align-items:stretch;min-height:185px;overflow:hidden}
.btm-character-card .btm-emblem-panel{position:relative;display:flex;align-items:center;justify-content:center;min-height:150px;border:1px solid #294656;border-radius:8px;background:radial-gradient(circle at 50% 38%,rgba(102,185,223,.18),transparent 58%),#09141b;overflow:hidden}
.btm-character-card .btm-emblem-panel:before{content:'';position:absolute;inset:10px;border:1px solid rgba(102,185,223,.12);border-radius:6px;pointer-events:none}
.btm-emblem{width:104px;height:104px;display:grid;place-items:center;color:#66b9df;filter:drop-shadow(0 0 14px rgba(102,185,223,.22));transition:transform .28s ease,filter .28s ease,opacity .28s ease}
.btm-emblem svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.btm-emblem svg circle:first-child{fill:rgba(102,185,223,.08)}
.btm-emblem-label{position:absolute;left:14px;bottom:11px;font:8px 'JetBrains Mono';letter-spacing:.16em;text-transform:uppercase;color:#8195a3}
.btm-emblem-panel:hover .btm-emblem{transform:translateY(-3px) scale(1.035);filter:drop-shadow(0 0 20px rgba(102,185,223,.38))}
.btm-week-emblem{position:absolute;right:10px;top:50%;width:42px;height:42px;transform:translateY(-50%);display:grid;place-items:center;color:#66b9df;opacity:.7;transition:transform .25s ease,opacity .25s ease,filter .25s ease}
.btm-week-emblem svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.week{position:relative;padding-right:60px}
.week:hover .btm-week-emblem,.week.active .btm-week-emblem{opacity:1;transform:translateY(-50%) scale(1.08);filter:drop-shadow(0 0 10px rgba(102,185,223,.32))}
.btm-character-card .btm-emblem-panel .btm-emblem{animation:btmEmblemIn .36s ease both}
@keyframes btmEmblemIn{from{opacity:0;transform:translateY(6px) scale(.92)}to{opacity:1;transform:none}}
@media(max-width:700px){.btm-character-card{grid-template-columns:1fr 150px}.btm-emblem{width:82px;height:82px}.btm-week-emblem{width:34px;height:34px;right:8px}.week{padding-right:50px}}
@media(prefers-reduced-motion:reduce){.btm-emblem,.btm-week-emblem{transition:none!important;animation:none!important}}
`;
const style=document.createElement('style');style.id='btm-character-emblem-style';style.textContent=css;document.head.appendChild(style);

function markup(index,extra=''){const e=EMBLEMS[index%EMBLEMS.length];return `<span class="btm-emblem" data-emblem-index="${index}" title="${e.name}" aria-label="${e.name}">${e.svg}</span>${extra}`}
function decorateWeekButtons(grid){
  if(!grid)return;
  grid.querySelectorAll('.week').forEach((button,index)=>{
    const weekIndex=index;
    let icon=button.querySelector('.btm-week-emblem');
    if(!icon){
      icon=document.createElement('span');
      icon.className='btm-week-emblem';
      icon.setAttribute('aria-hidden','true');
      icon.innerHTML=EMBLEMS[weekIndex].svg;
      button.appendChild(icon);
    }else if(icon.dataset.index!==String(weekIndex)){
      icon.dataset.index=String(weekIndex);icon.innerHTML=EMBLEMS[weekIndex].svg;
    }
  });
}
function patchCharacterCard(){
  const card=document.getElementById('btm-character-card');
  const grid=document.getElementById('weekGrid');
  if(!card||!grid)return false;
  decorateWeekButtons(grid);
  const wrap=card.querySelector('.btm-silhouette-wrap');
  if(wrap){
    const reveal=card.querySelector('#charReveal');
    const right=document.createElement('div');
    right.className='btm-emblem-panel';
    right.id='btm-selected-emblem-panel';
    right.innerHTML=markup(Math.max(0,[...grid.querySelectorAll('.week')].findIndex(b=>b.classList.contains('active'))),'<span class="btm-emblem-label">CHARACTER EMBLEM</span>');
    wrap.replaceWith(right);
    if(reveal)reveal.style.display='none';
  }
  const update=()=>{
    const buttons=[...grid.querySelectorAll('.week')];
    const idx=Math.max(0,buttons.findIndex(b=>b.classList.contains('active')));
    decorateWeekButtons(grid);
    const panel=card.querySelector('#btm-selected-emblem-panel');
    if(panel){
      const old=panel.querySelector('.btm-emblem');
      if(old){old.outerHTML=markup(idx)}
      panel.querySelector('.btm-emblem-label')?.remove();
      const label=document.createElement('span');label.className='btm-emblem-label';label.textContent=EMBLEMS[idx].name;panel.appendChild(label);
    }
  };
  update();
  if(!card.__btmEmblemObserver){
    const observer=new MutationObserver(()=>update());
    observer.observe(grid,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    card.__btmEmblemObserver=observer;
  }
  return true;
}

const boot=()=>{
  if(patchCharacterCard())return;
  const observer=new MutationObserver(()=>{if(patchCharacterCard())observer.disconnect()});
  observer.observe(document.body,{subtree:true,childList:true});
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
