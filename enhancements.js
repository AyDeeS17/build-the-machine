/* Build The Machine, Week difficulty color system. Character emblem/artwork system retired. */
(()=>{
'use strict';
if(window.__BTM_WEEK_COLOR_SYSTEM__)return;
window.__BTM_WEEK_COLOR_SYSTEM__=1;

const WEEKS=[
  {color:'#6fa8dc',tint:'rgba(111,168,220,.075)',glow:'rgba(111,168,220,.16)',label:'EASIEST'},
  {color:'#62aee0',tint:'rgba(98,174,224,.085)',glow:'rgba(98,174,224,.17)',label:'VERY EASY'},
  {color:'#5d9fe5',tint:'rgba(93,159,229,.095)',glow:'rgba(93,159,229,.18)',label:'EASY'},
  {color:'#6d88e4',tint:'rgba(109,136,228,.105)',glow:'rgba(109,136,228,.19)',label:'BUILDING'},
  {color:'#866fdf',tint:'rgba(134,111,223,.115)',glow:'rgba(134,111,223,.20)',label:'MODERATE'},
  {color:'#a05ed2',tint:'rgba(160,94,210,.125)',glow:'rgba(160,94,210,.22)',label:'HARD'},
  {color:'#718592',tint:'rgba(113,133,146,.09)',glow:'rgba(113,133,146,.14)',label:'DELOAD'},
  {color:'#b967a1',tint:'rgba(185,103,161,.14)',glow:'rgba(185,103,161,.24)',label:'HARD'},
  {color:'#d05f83',tint:'rgba(208,95,131,.15)',glow:'rgba(208,95,131,.25)',label:'VERY HARD'},
  {color:'#df5368',tint:'rgba(223,83,104,.16)',glow:'rgba(223,83,104,.27)',label:'INTENSE'},
  {color:'#e94858',tint:'rgba(233,72,88,.175)',glow:'rgba(233,72,88,.29)',label:'VERY INTENSE'},
  {color:'#ef3d4d',tint:'rgba(239,61,77,.19)',glow:'rgba(239,61,77,.32)',label:'HARDEST'}
];

const css=`
/* Week identity is difficulty-driven, not character-driven. */
.week{--week-color:#6fa8dc;--week-tint:rgba(111,168,220,.075);--week-glow:rgba(111,168,220,.16);--week-label:'EASIEST';position:relative;overflow:hidden!important;background:linear-gradient(135deg,var(--week-tint),rgba(0,0,0,0) 62%),var(--panel2,#13222c)!important;border-color:color-mix(in srgb,var(--week-color) 42%,var(--line,#294656))!important;transition:transform .24s cubic-bezier(.2,.8,.2,1),background .3s ease,border-color .3s ease,box-shadow .3s ease,color .2s ease!important}
.week::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 25%,color-mix(in srgb,var(--week-color) 9%,transparent) 50%,transparent 75%);opacity:.35;transform:translateX(-110%);transition:transform .6s cubic-bezier(.2,.7,.2,1)}
.week:hover::before{transform:translateX(110%)}
.week b{color:var(--week-color)!important}
.week small{color:color-mix(in srgb,var(--week-color) 55%,#687d89)!important}
.week:hover{border-color:var(--week-color)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 12%,transparent),0 0 18px var(--week-glow)!important;transform:translateY(-2px)!important}
.week.active{background:linear-gradient(135deg,color-mix(in srgb,var(--week-color) 18%,var(--theme-dark,#173247)),var(--panel2,#13222c))!important;border-color:var(--week-color)!important;color:var(--theme-light,#bfeeff)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--week-color) 20%,transparent),0 0 20px var(--week-glow),inset 0 1px 0 rgba(255,255,255,.04)!important}
.week.active b{color:var(--week-color)!important}
.week[data-deload="true"]{border-style:dashed!important}
.week[data-deload="true"]::after{content:'DELOAD';position:absolute;right:7px;top:6px;font:7px 'JetBrains Mono';font-weight:700;letter-spacing:.12em;color:var(--week-color);opacity:.72;pointer-events:none}
@media(max-width:700px){.week:hover{transform:translateY(-1px)!important}}
@media(prefers-reduced-motion:reduce){.week,.week::before{transition:none!important}.week:hover{transform:none!important}.week::before{display:none!important}}
`;

const style=document.createElement('style');
style.id='btm-week-color-style';
style.textContent=css;
document.head.appendChild(style);

function applyWeekColors(root=document){
  root.querySelectorAll('.week').forEach((button,index)=>{
    const w=WEEKS[index]||WEEKS[0];
    button.style.setProperty('--week-color',w.color);
    button.style.setProperty('--week-tint',w.tint);
    button.style.setProperty('--week-glow',w.glow);
    button.style.setProperty('--week-label',`'${w.label}'`);
    button.dataset.weekColor=index+1;
    if(index===6)button.dataset.deload='true';
    else delete button.dataset.deload;

    /* Remove any leftover emblem/logo nodes from older builds. */
    button.querySelectorAll('.btm-week-emblem,.btm-inline-emblem,.btm-emblem,.btm-emblem-panel').forEach(el=>el.remove());
    button.style.removeProperty('padding-right');
  });
}

function boot(){
  applyWeekColors(document);
  const observer=new MutationObserver(mutations=>{
    let changed=false;
    for(const m of mutations){
      if(m.type==='childList' && (m.addedNodes.length||m.removedNodes.length)){changed=true;break}
      if(m.type==='attributes' && m.attributeName==='class'){changed=true;break}
    }
    if(changed)applyWeekColors(document);
  });
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

window.BTMWeekColors={weeks:WEEKS,apply:applyWeekColors};
})();
