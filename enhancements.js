/* Build The Machine, stable Week difficulty colors. Character emblem/artwork system retired. */
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
}
.week::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 25%,color-mix(in srgb,var(--week-color) 9%,transparent) 50%,transparent 75%);opacity:.35;transform:translateX(-110%);transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.week:hover::before{transform:translateX(110%)}
.week b{color:var(--week-color)!important}
.week small{color:color-mix(in srgb,var(--week-color) 55%,#687d89)!important}
.week:hover{border-color:var(--week-color)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 12%,transparent),0 0 18px var(--week-glow)!important;transform:translateY(-2px)!important}
.week.active{background:linear-gradient(135deg,color-mix(in srgb,var(--week-color) 18%,var(--panel2,#13222c)),var(--panel2,#13222c))!important;border-color:var(--week-color)!important;color:var(--text,#e8f0f4)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 20%,transparent),0 0 20px var(--week-glow),inset 0 1px 0 rgba(255,255,255,.04)!important}
.week.active b{color:var(--week-color)!important}
.week[data-deload="true"]{border-style:dashed!important}
@media(max-width:700px){.week:hover{transform:translateY(-1px)!important}}
@media(prefers-reduced-motion:reduce){.week,.week::before{transition:none!important}.week:hover{transform:none!important}.week::before{display:none!important}}
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

    /* Persist identity on the element, but never use DOM position as identity. */
    button.dataset.weekId=String(w.id);
    button.style.setProperty('--week-color',w.color);
    button.style.setProperty('--week-tint',w.tint);
    button.style.setProperty('--week-glow',w.glow);
    if(w.isDeload)button.dataset.deload='true';
    else button.removeAttribute('data-deload');

    /* Permanently remove leftovers from the retired character-emblem system. */
    button.querySelectorAll('.btm-week-emblem,.btm-inline-emblem,.btm-emblem,.btm-emblem-panel,.week-emblem,.character-emblem,.character-logo').forEach(el=>el.remove());
    button.style.removeProperty('padding-right');
  });
}

function boot(){
  const grid=document.getElementById('weekGrid');
  if(!grid)return;
  applyWeekColors(grid);

  let queued=false;
  const observer=new MutationObserver(()=>{
    if(queued)return;
    queued=true;
    queueMicrotask(()=>{
      queued=false;
      applyWeekColors(grid);
    });
  });
  observer.observe(grid,{childList:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

window.BTMWeekColors={weeks:WEEKS,apply:applyWeekColors};
})();
