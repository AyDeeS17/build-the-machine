/* Build The Machine, stable Week difficulty colors + selected character quotes. */
(()=>{
'use strict';
if(window.__BTM_WEEK_COLOR_SYSTEM__)return;
window.__BTM_WEEK_COLOR_SYSTEM__=1;

/* Week identity is explicit. Never derive colors from DOM position. */
const WEEKS=[
  {id:1,color:'#6fa8dc',tint:'rgba(111,168,220,.075)',glow:'rgba(111,168,220,.16)',label:'EASIEST',isDeload:false},
  {id:2,color:'#62aee0',tint:'rgba(98,174,224,.085)',glow:'rgba(98,174,224,.17)',label:'VERY EASY',isDeload:false},
  {id:3,color:'#5d9fe5',tint:'rgba(93,159,229,.095)',glow:'rgba(93,159,229,.18)',label:'EASY',isDeload:false},
  {id:4,color:'#6d88e4',tint:'rgba(109,136,228,.105)',glow:'rgba(109,136,228,.19)',label:'BUILDING',isDeload:false},
  {id:5,color:'#866fdf',tint:'rgba(134,111,223,.115)',glow:'rgba(134,111,223,.20)',label:'MODERATE',isDeload:false},
  {id:6,color:'#a05ed2',tint:'rgba(160,94,210,.125)',glow:'rgba(160,94,210,.22)',label:'HARD',isDeload:false},
  {id:7,color:'#718592',tint:'rgba(113,133,146,.09)',glow:'rgba(113,133,146,.14)',label:'DELOAD',isDeload:true},
  {id:8,color:'#b967a1',tint:'rgba(185,103,161,.14)',glow:'rgba(185,103,161,.24)',label:'HARD',isDeload:false},
  {id:9,color:'#d05f83',tint:'rgba(208,95,131,.15)',glow:'rgba(208,95,131,.25)',label:'VERY HARD',isDeload:false},
  {id:10,color:'#df5368',tint:'rgba(223,83,104,.16)',glow:'rgba(223,83,104,.27)',label:'INTENSE',isDeload:false},
  {id:11,color:'#e94858',tint:'rgba(233,72,88,.175)',glow:'rgba(233,72,88,.29)',label:'VERY INTENSE',isDeload:false},
  {id:12,color:'#ef3d4d',tint:'rgba(239,61,77,.19)',glow:'rgba(239,61,77,.32)',label:'HARDEST',isDeload:false}
];

/* Verified character lines, one fixed quote per Week. */
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

const css=`
.week{
  --week-color:#6fa8dc;
  --week-tint:rgba(111,168,220,.075);
  --week-glow:rgba(111,168,220,.16);
  position:relative;
  overflow:hidden!important;
  background:linear-gradient(135deg,var(--week-tint),rgba(0,0,0,0) 62%),var(--panel2,#13222c)!important;
  border-color:color-mix(in srgb,var(--week-color) 42%,var(--line,#294656))!important;
  transition:transform .24s cubic-bezier(.2,.8,.2,1),background .3s ease,border-color .3s ease,box-shadow .3s ease,color .2s ease!important;
  font-family:'JetBrains Mono',monospace!important;
  font-size:10px!important;
  font-weight:700!important;
  letter-spacing:.02em!important;
}
.week::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 25%,color-mix(in srgb,var(--week-color) 9%,transparent) 50%,transparent 75%);opacity:.35;transform:translateX(-110%);transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.week:hover::before{transform:translateX(110%)}
.week b,.week span,.week small{font-family:'JetBrains Mono',monospace!important;font-weight:700!important;letter-spacing:.02em!important}
.week b{display:block;color:var(--week-color)!important;font-size:13px!important}
.week span{display:block;margin-top:5px;font-size:11px!important;color:var(--text,#e8f0f4)!important}
.week small{display:block;margin-top:8px;font-size:8px!important;color:color-mix(in srgb,var(--week-color) 55%,#687d89)!important}
.week:hover{border-color:var(--week-color)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 12%,transparent),0 0 18px var(--week-glow)!important;transform:translateY(-2px)!important}
.week.active{background:linear-gradient(135deg,color-mix(in srgb,var(--week-color) 18%,var(--panel2,#13222c)),var(--panel2,#13222c))!important;border-color:var(--week-color)!important;color:var(--text,#e8f0f4)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 20%,transparent),0 0 20px var(--week-glow),inset 0 1px 0 rgba(255,255,255,.04)!important}
.week.active b{color:var(--week-color)!important}
.week[data-deload="true"]{border-style:dashed!important}

.btm-selected-week-panel{margin-top:10px!important;min-height:154px!important;display:block!important;position:relative!important;overflow:hidden!important;padding:28px 30px!important;background:linear-gradient(135deg,var(--selected-tint,rgba(111,168,220,.10)),rgba(0,0,0,0) 58%),linear-gradient(145deg,#13202a,#0d161d)!important;border-color:color-mix(in srgb,var(--selected-color,#6fa8dc) 42%,var(--line,#294656))!important;box-shadow:0 0 24px var(--selected-glow,rgba(111,168,220,.14))!important;transition:border-color .3s ease,box-shadow .3s ease,background .3s ease!important}
.btm-selected-week-panel::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 20%,color-mix(in srgb,var(--selected-color,#6fa8dc) 7%,transparent) 50%,transparent 80%);opacity:.45}
.btm-selected-week-content{position:relative;max-width:900px}
.btm-selected-week-content .ey{color:var(--selected-color,#6fa8dc)!important}
.btm-selected-week-name{margin-top:5px!important;color:var(--text,#e8f0f4)!important;font-family:Anton,sans-serif!important;font-size:34px!important;font-weight:400!important;line-height:1!important;text-transform:uppercase!important}
.btm-selected-week-meta{margin-top:9px;color:var(--muted,#8195a3);font:9px 'JetBrains Mono',monospace;letter-spacing:.08em;text-transform:uppercase}
.btm-selected-week-quote{margin:18px 0 0;max-width:820px;color:var(--text,#e8f0f4);font:italic 16px/1.45 'Barlow Condensed',sans-serif;letter-spacing:.01em}
.btm-selected-week-quote::before{content:'“';color:var(--selected-color,#6fa8dc);font-family:Georgia,serif;font-size:28px;line-height:0;vertical-align:-7px;margin-right:4px}
.btm-selected-week-quote::after{content:'”';color:var(--selected-color,#6fa8dc);font-family:Georgia,serif;font-size:28px;line-height:0;vertical-align:-7px;margin-left:3px}
@media(max-width:700px){.week:hover{transform:translateY(-1px)!important}.btm-selected-week-panel{padding:22px 20px!important}.btm-selected-week-name{font-size:29px!important}.btm-selected-week-quote{font-size:15px!important}}
@media(prefers-reduced-motion:reduce){.week,.week::before,.btm-selected-week-panel{transition:none!important}.week:hover{transform:none!important}.week::before{display:none!important}}
`;

const oldStyle=document.getElementById('btm-week-color-style');
if(oldStyle)oldStyle.remove();
const style=document.createElement('style');
style.id='btm-week-color-style';
style.textContent=css;
document.head.appendChild(style);

function getWeekId(button){
  const explicit=Number(button.dataset.weekId||button.dataset.week||button.dataset.weekColor);
  if(Number.isInteger(explicit)&&explicit>=1&&explicit<=12)return explicit;
  const match=(button.textContent||'').match(/\bWEEK\s*(\d{1,2})\b/i);
  return match?Number(match[1]):null;
}

function applyWeekColors(root=document){
  root.querySelectorAll('.week').forEach(button=>{
    const id=getWeekId(button);
    const w=WEEKS.find(item=>item.id===id);
    if(!w)return;
    button.dataset.weekId=String(w.id);
    button.style.setProperty('--week-color',w.color);
    button.style.setProperty('--week-tint',w.tint);
    button.style.setProperty('--week-glow',w.glow);
    if(w.isDeload)button.dataset.deload='true';
    else button.removeAttribute('data-deload');
    button.querySelectorAll('.btm-week-emblem,.btm-inline-emblem,.btm-emblem,.btm-emblem-panel,.week-emblem,.character-emblem,.character-logo').forEach(el=>el.remove());
    button.style.removeProperty('padding-right');
  });
}

function getActiveWeekId(grid){
  const active=grid.querySelector('.week.active');
  return active?getWeekId(active):1;
}

function findSelectedPanel(grid){
  const training=document.getElementById('trainingView');
  if(!training)return null;
  const existing=[...training.querySelectorAll('.panel')].find(panel=>{
    const text=panel.textContent||'';
    return /ANIME PROGRESSION/i.test(text)||/REVEAL\s*\d+%/i.test(text);
  });
  if(existing)return existing;
  const weekPanel=grid.closest('.panel');
  if(!weekPanel)return null;
  const panel=document.createElement('div');
  panel.className='panel btm-selected-week-panel';
  weekPanel.insertAdjacentElement('afterend',panel);
  return panel;
}

function renderSelectedWeek(grid){
  const panel=findSelectedPanel(grid);
  if(!panel)return;
  const id=getActiveWeekId(grid);
  const character=CHARACTERS.find(item=>item.id===id)||CHARACTERS[0];
  const week=WEEKS.find(item=>item.id===id)||WEEKS[0];
  const phase=(grid.querySelector('.week.active span')?.textContent||'').trim();
  panel.classList.add('btm-selected-week-panel');
  panel.style.setProperty('--selected-color',week.color);
  panel.style.setProperty('--selected-tint',week.tint);
  panel.style.setProperty('--selected-glow',week.glow);
  panel.innerHTML=`<div class="btm-selected-week-content"><div class="ey">ANIME PROGRESSION</div><h2 class="btm-selected-week-name">${character.name}</h2><div class="btm-selected-week-meta">WEEK ${id} · ${phase||week.label}</div><p class="btm-selected-week-quote">${character.quote}</p></div>`;
}

function installSelectedWeek(grid){
  applyWeekColors(grid);
  renderSelectedWeek(grid);
}

function boot(){
  const grid=document.getElementById('weekGrid');
  if(!grid){
    const observer=new MutationObserver(()=>{
      const next=document.getElementById('weekGrid');
      if(next){observer.disconnect();bootGrid(next)}
    });
    observer.observe(document.body,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),10000);
    return;
  }
  bootGrid(grid);
}

function bootGrid(grid){
  installSelectedWeek(grid);
  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      installSelectedWeek(grid);
    });
  });
  observer.observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-week-id']});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

window.BTMWeekColors={weeks:WEEKS,characters:CHARACTERS,apply:applyWeekColors,renderSelected:renderSelectedWeek};
})();
