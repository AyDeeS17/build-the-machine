/* Build The Machine, Week selector polish. */
(()=>{
'use strict';
if(window.__BTM_WEEK_SELECTOR_FIX__)return;
window.__BTM_WEEK_SELECTOR_FIX__=1;

const CHARACTERS=[
  {id:1,name:'Goku',quote:'I am the hope of the universe!'},
  {id:2,name:'Tanjiro Kamado',quote:'I will never give up!!'},
  {id:3,name:'Yuji Itadori',quote:"I don't want to regret anything because of the way I've lived!"},
  {id:4,name:'Eren Yeager',quote:'Because I was born into this world.'},
  {id:5,name:'Thorfinn',quote:'I have no enemies.'},
  {id:6,name:'Vegeta',quote:'The sleeper has awakened. I am the prince of all Saiyans once again!'},
  {id:7,name:'Gojo Satoru',quote:'Throughout heaven and earth, I alone am the honored one.'},
  {id:8,name:'Toji Fushiguro',quote:"As someone who possesses no cursed energy, I'm the invisible man."},
  {id:9,name:'Ken Kaneki',quote:"I'm a ghoul."},
  {id:10,name:'Itachi Uchiha',quote:'People live their lives bound by what they accept as correct and true.'},
  {id:11,name:'Griffith',quote:"I'll not... betray my dream. That is all."},
  {id:12,name:'Guts',quote:'So long as I have my sword to fight with, I\'m sure to survive.'}
];

const WEEK_COLORS=[
  '#66b9df','#71c7b4','#8ccf6b','#c9d35c','#e4bd5b','#e69a57',
  '#d97878','#c86fc4','#b978e6','#8d8fe8','#6f9ee8','#66b9df'
];

const css=`
.btm-selected-week-quote{
  margin:16px 0 0;
  max-width:920px;
  color:var(--quote-color,#e8f0f4);
  font:700 clamp(22px,3vw,32px)/1.12 'Barlow Condensed',sans-serif;
  letter-spacing:.015em;
  text-wrap:balance;
  text-shadow:
    0 0 1px var(--quote-color,#66b9df),
    0 0 7px color-mix(in srgb,var(--quote-color,#66b9df) 42%,transparent),
    0 0 16px color-mix(in srgb,var(--quote-color,#66b9df) 18%,transparent);
  animation:btm-quote-pulse 4.8s ease-in-out infinite;
  transition:opacity .28s ease,transform .28s ease,filter .28s ease,color .35s ease,text-shadow .35s ease;
  will-change:opacity,transform,filter,text-shadow;
}
.btm-selected-week-quote::before{content:'“';color:var(--quote-color,#66b9df);font-family:Georgia,serif;font-size:1.05em;line-height:0;vertical-align:-.08em;margin-right:4px;opacity:.9}
.btm-selected-week-quote::after{content:'”';color:var(--quote-color,#66b9df);font-family:Georgia,serif;font-size:1.05em;line-height:0;vertical-align:-.08em;margin-left:4px;opacity:.9}
.btm-selected-week-quote.is-switching{opacity:0;transform:translateY(7px);filter:blur(4px)}
.btm-selected-week-quote.is-entering{animation:btm-quote-enter .48s cubic-bezier(.22,.8,.24,1) both,btm-quote-pulse 4.8s ease-in-out .48s infinite}
@keyframes btm-quote-pulse{
  0%,100%{text-shadow:0 0 1px var(--quote-color,#66b9df),0 0 6px color-mix(in srgb,var(--quote-color,#66b9df) 36%,transparent),0 0 14px color-mix(in srgb,var(--quote-color,#66b9df) 15%,transparent)}
  50%{text-shadow:0 0 1px var(--quote-color,#66b9df),0 0 9px color-mix(in srgb,var(--quote-color,#66b9df) 48%,transparent),0 0 20px color-mix(in srgb,var(--quote-color,#66b9df) 22%,transparent)}
}
@keyframes btm-quote-enter{
  from{opacity:0;transform:translateY(7px);filter:blur(4px)}
  to{opacity:1;transform:translateY(0);filter:blur(0)}
}
@media(prefers-reduced-motion:reduce){
  .btm-selected-week-quote{animation:none!important;transition:opacity .2s ease,color .2s ease,text-shadow .2s ease}
  .btm-selected-week-quote.is-switching{transform:none;filter:none}
}
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

function removeUnwantedAvatar(card){
  if(!card)return;
  const children=[...card.children];
  const candidates=children.filter(el=>{
    if(el.classList.contains('btm-selected-week-quote'))return false;
    if((el.textContent||'').trim())return false;
    const r=el.getBoundingClientRect();
    return r.width>100&&r.height>80;
  });
  if(candidates.length){
    const target=candidates.sort((a,b)=>b.getBoundingClientRect().right-a.getBoundingClientRect().right)[0];
    target.remove();
  }
  card.querySelectorAll('img').forEach(img=>{
    const r=img.getBoundingClientRect();
    if(r.width>80&&r.height>80)img.remove();
  });
}

function getDifficultyColor(card,id){
  if(card){
    const sources=[
      card.querySelector('[data-color]'),
      card.querySelector('[data-accent]'),
      card.querySelector('[style*="color"]'),
      card.querySelector('[style*="background"]'),
      card.querySelector('[class*="color"]'),
      card.querySelector('[class*="accent"]')
    ].filter(Boolean);
    for(const source of sources){
      const data=source.dataset.color||source.dataset.accent;
      if(data)return data;
      const computed=getComputedStyle(source);
      const values=[computed.color,computed.borderColor,computed.backgroundColor];
      const usable=values.find(v=>v&&v!=='rgba(0, 0, 0, 0)'&&v!=='transparent');
      if(usable)return usable;
    }
    const cardStyle=getComputedStyle(card);
    const custom=[
      cardStyle.getPropertyValue('--theme-primary').trim(),
      cardStyle.getPropertyValue('--difficulty-color').trim(),
      cardStyle.getPropertyValue('--accent').trim(),
      cardStyle.getPropertyValue('--theme-accent').trim()
    ].find(Boolean);
    if(custom)return custom;
  }
  return WEEK_COLORS[(id||1)-1]||WEEK_COLORS[0];
}

let switchTimer=0;
let lastCharacterId=0;

function updateSelectedCard(grid){
  const active=grid.querySelector('.week.active');
  const id=weekId(active)||1;
  const character=CHARACTERS[id-1];
  if(!character)return;
  const card=getSelectedCard(grid);
  if(!card)return;
  removeAccidentalDuplicateCards(grid,card);
  removeUnwantedAvatar(card);

  let quote=card.querySelector('.btm-selected-week-quote');
  if(!quote){
    quote=document.createElement('p');
    quote.className='btm-selected-week-quote';
    card.appendChild(quote);
  }

  const color=getDifficultyColor(card,id);
  const changed=lastCharacterId!==0&&lastCharacterId!==id;
  clearTimeout(switchTimer);

  if(changed){
    quote.classList.remove('is-entering');
    quote.classList.add('is-switching');
    switchTimer=setTimeout(()=>{
      quote.style.setProperty('--quote-color',color);
      quote.textContent=character.quote;
      quote.classList.remove('is-switching');
      void quote.offsetWidth;
      quote.classList.add('is-entering');
      setTimeout(()=>quote.classList.remove('is-entering'),520);
    },280);
  }else{
    quote.style.setProperty('--quote-color',color);
    if(quote.textContent!==character.quote)quote.textContent=character.quote;
  }
  lastCharacterId=id;
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
