/* Build The Machine, Week selector polish. */
(()=>{
'use strict';
if(window.__BTM_WEEK_SELECTOR_FIX__)return;
window.__BTM_WEEK_SELECTOR_FIX__=1;

const CHARACTERS=[
  {id:1,name:'Goku',quote:'I wanna get strong!'},
  {id:2,name:'Tanjiro Kamado',quote:'I will never give up!!'},
  {id:3,name:'Yuji Itadori',quote:"I don't want to regret the way I live!"},
  {id:4,name:'Eren Yeager',quote:'Because I was born into this world!'},
  {id:5,name:'Thorfinn',quote:'I have no enemies.'},
  {id:6,name:'Vegeta',quote:'The sleeper has awakened. I am the prince of all Saiyans once again!'},
  {id:7,name:'Gojo Satoru',quote:'There is no curse as twisted as love.'},
  {id:8,name:'Toji Fushiguro',quote:"As someone who possesses no cursed energy, I'm the invisible man."},
  {id:9,name:'Ken Kaneki',quote:"I'm not wrong. What's wrong is this messed-up world!"},
  {id:10,name:'Itachi Uchiha',quote:'People live their lives bound by what they accept as correct and true.'},
  {id:11,name:'Griffith',quote:"A dream... It's something you do for yourself, not for others."},
  {id:12,name:'Guts',quote:'There is no paradise for you to escape to.'}
];

/* Week cards belong entirely to the original training UI. Do not rebuild them. */
const css=`
.btm-selected-week-quote{margin:14px 0 0;max-width:820px;color:var(--muted,#8195a3);font:italic 15px/1.45 'Barlow Condensed',sans-serif}
.btm-selected-week-quote::before{content:'“';color:var(--blue,#66b9df);font-family:Georgia,serif;font-size:24px;line-height:0;vertical-align:-5px;margin-right:3px}
.btm-selected-week-quote::after{content:'”';color:var(--blue,#66b9df);font-family:Georgia,serif;font-size:24px;line-height:0;vertical-align:-5px;margin-left:3px}
`;
const style=document.createElement('style');style.id='btm-week-quote-style';style.textContent=css;document.head.appendChild(style);

function weekId(button){
  if(!button)return null;
  const explicit=Number(button.dataset.weekId||button.dataset.week);
  if(Number.isInteger(explicit)&&explicit>=1&&explicit<=12)return explicit;
  const match=(button.textContent||'').match(/\bWEEK\s*(\d{1,2})\b/i);
  return match?Number(match[1]):null;
}

function getSelectedCard(grid){
  const weekPanel=grid.closest('.panel');
  if(!weekPanel)return null;
  const cards=[...weekPanel.querySelectorAll('.panel')];
  return cards.find(card=>{
    if(card===weekPanel)return false;
    const text=card.textContent||'';
    return /ANIME PROGRESSION/i.test(text)||/REVEAL\s*\d+%/i.test(text);
  })||null;
}

function removeAccidentalDuplicateCards(grid,keep){
  const weekPanel=grid.closest('.panel');
  if(!weekPanel)return;
  weekPanel.querySelectorAll('.btm-selected-week-panel').forEach(card=>{if(card!==keep)card.remove()});
}

function updateSelectedCard(grid){
  const active=grid.querySelector('.week.active');
  const id=weekId(active)||1;
  const character=CHARACTERS[id-1];
  if(!character)return;
  const card=getSelectedCard(grid);
  if(!card)return;
  removeAccidentalDuplicateCards(grid,card);

  let quote=card.querySelector('.btm-selected-week-quote');
  if(!quote){
    quote=document.createElement('p');
    quote.className='btm-selected-week-quote';
    card.appendChild(quote);
  }
  quote.textContent=character.quote;
}

function bootGrid(grid){
  updateSelectedCard(grid);
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{queued=false;updateSelectedCard(grid)});
  });
  observer.observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
}

function boot(){
  const grid=document.getElementById('weekGrid');
  if(grid){bootGrid(grid);return;}
  const observer=new MutationObserver(()=>{
    const next=document.getElementById('weekGrid');
    if(next){observer.disconnect();bootGrid(next)}
  });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),10000);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.BTMWeekQuotes={characters:CHARACTERS,update:updateSelectedCard};
})();
