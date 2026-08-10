(()=>{
'use strict';
if(window.__BTM_THEME_SYSTEM__)return;
window.__BTM_THEME_SYSTEM__=1;
const KEY='btm-theme-v1';
const THEMES={
 blue:{name:'BLUE',primary:'#66b9df',dark:'#173247',light:'#bfeeff',glow:'rgba(76,169,220,.24)',line:'#294656',bg:'#071016',panel:'#13202a',panel2:'#13222c',input:'#09131a',hover:'#1d4155'},
 red:{name:'RED',primary:'#e35d67',dark:'#4a1e25',light:'#ffc0c5',glow:'rgba(227,72,88,.24)',line:'#5a3038',bg:'#11090c',panel:'#24171b',panel2:'#2b1b20',input:'#160d10',hover:'#5b242c'},
 orange:{name:'ORANGE',primary:'#f08a45',dark:'#4b2a18',light:'#ffd1a8',glow:'rgba(240,120,58,.24)',line:'#65422d',bg:'#110d08',panel:'#241b15',panel2:'#2b2118',input:'#17100b',hover:'#5a311c'},
 green:{name:'GREEN',primary:'#59c49f',dark:'#1d4238',light:'#c5ffe7',glow:'rgba(70,189,148,.24)',line:'#2e5a4d',bg:'#08120f',panel:'#14211e',panel2:'#172720',input:'#0b1713',hover:'#244f43'}
};
const root=document.documentElement;
const getTheme=()=>{try{const v=localStorage.getItem(KEY);return THEMES[v]?v:'blue'}catch{return'blue'}};
const setVars=t=>{root.style.setProperty('--blue',t.primary);root.style.setProperty('--line',t.line);root.style.setProperty('--bg',t.bg);root.style.setProperty('--panel',t.panel);root.style.setProperty('--panel2',t.panel2);root.style.setProperty('--theme-primary',t.primary);root.style.setProperty('--theme-dark',t.dark);root.style.setProperty('--theme-light',t.light);root.style.setProperty('--theme-glow',t.glow);root.style.setProperty('--theme-hover',t.hover);root.style.setProperty('--theme-input',t.input)};
const apply=(name,save=true)=>{if(!THEMES[name])name='blue';const t=THEMES[name];root.dataset.btmTheme=name;setVars(t);if(save)localStorage.setItem(KEY,name);document.querySelectorAll('.btm-theme-option').forEach(b=>{const on=b.dataset.theme===name;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on))});document.dispatchEvent(new CustomEvent('btm:theme-change',{detail:{theme:name}}));};
const css=`
@property --blue{syntax:'<color>';inherits:true;initial-value:#66b9df}
@property --line{syntax:'<color>';inherits:true;initial-value:#294656}
@property --bg{syntax:'<color>';inherits:true;initial-value:#071016}
@property --panel{syntax:'<color>';inherits:true;initial-value:#13202a}
@property --panel2{syntax:'<color>';inherits:true;initial-value:#13222c}
@property --theme-primary{syntax:'<color>';inherits:true;initial-value:#66b9df}
@property --theme-dark{syntax:'<color>';inherits:true;initial-value:#173247}
@property --theme-light{syntax:'<color>';inherits:true;initial-value:#bfeeff}
@property --theme-glow{syntax:'<color>';inherits:true;initial-value:rgba(76,169,220,.24)}
@property --theme-hover{syntax:'<color>';inherits:true;initial-value:#1d4155}
@property --theme-input{syntax:'<color>';inherits:true;initial-value:#09131a}
html,body,.wrap,.nav,.panel,.stat,.exercise,.day-head,.btn,.week,.feel button,.sets input,.food input,.food textarea,.btm-theme-picker,.btm-theme-option{transition:background-color .65s cubic-bezier(.2,.8,.2,1),background-image .65s cubic-bezier(.2,.8,.2,1),border-color .65s cubic-bezier(.2,.8,.2,1),color .55s ease,box-shadow .65s cubic-bezier(.2,.8,.2,1)}
body{background:radial-gradient(circle at 50% -10%,var(--theme-glow),transparent 38%),var(--bg)!important}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 50% 8%,var(--theme-glow),transparent 48%),linear-gradient(180deg,transparent 0%,rgba(0,0,0,.08) 100%);opacity:.85;transition:background .65s ease,opacity .65s ease}
.wrap{position:relative;z-index:1}
header{border-color:var(--line)!important}
h1 span,.ey,.banner h2,.stat b,.nav-icon{color:var(--theme-primary)!important}
.nav,.panel,.stat{background:linear-gradient(145deg,var(--panel),var(--panel2))!important;border-color:var(--line)!important}
.btn,.week,.feel button{background:var(--panel2)!important;border-color:var(--line)!important;color:var(--muted)!important}
.btn.active,.week.active,.feel button.active{background:var(--theme-dark)!important;color:var(--theme-light)!important;box-shadow:0 0 0 1px color-mix(in srgb,var(--theme-primary) 12%,transparent),0 0 18px var(--theme-glow)}
.btn.active{border-color:var(--theme-primary)!important}
.week.active{border-color:var(--week-color,var(--theme-primary))!important}
.btn:hover,.week:hover,.feel button:hover{border-color:var(--theme-primary)!important;color:var(--theme-light)!important;box-shadow:0 0 14px var(--theme-glow)}
.exercise{background:linear-gradient(145deg,var(--panel2),var(--theme-input))!important;border-color:var(--line)!important}
.day-head{background:linear-gradient(135deg,var(--theme-dark),var(--panel2))!important;border-color:var(--line)!important}
.sets input,.food input,.food textarea{background:var(--theme-input)!important;border-color:var(--line)!important;color:var(--text)!important}
.sets input:focus,.food input:focus,.food textarea:focus{outline:none;border-color:var(--theme-primary)!important;box-shadow:0 0 0 2px var(--theme-glow)}
.bar{background:var(--line)!important}.bar i{background:var(--theme-primary)!important;box-shadow:0 0 10px var(--theme-glow)}
.check{accent-color:var(--theme-primary)!important}
.save{background:var(--theme-primary)!important;color:var(--bg)!important;box-shadow:0 0 18px var(--theme-glow)}
.chart{border-color:var(--line)!important;background:var(--theme-input)!important}
.reset-week{color:var(--muted)!important;background:var(--panel2)!important;border-color:var(--line)!important}.reset-week:hover{color:var(--theme-light)!important;border-color:var(--theme-primary)!important}
.btm-theme-picker{width:100%;max-width:760px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:-12px 0 22px;padding:8px 10px;background:linear-gradient(145deg,var(--panel),var(--panel2));border:1px solid var(--line);border-radius:7px}
.btm-theme-label{font:9px 'JetBrains Mono';font-weight:700;letter-spacing:.18em;color:var(--muted);white-space:nowrap}
.btm-theme-options{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.btm-theme-option{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid var(--line);border-radius:5px;background:var(--theme-input);color:var(--muted);font:9px 'JetBrains Mono';font-weight:700;cursor:pointer}
.btm-theme-option:hover{color:var(--theme-light);border-color:var(--theme-primary);transform:translateY(-1px)}
.btm-theme-option.is-selected{color:var(--theme-light);border-color:var(--theme-primary);background:var(--theme-dark);box-shadow:0 0 12px var(--theme-glow)}
.btm-theme-dot{width:9px;height:9px;border-radius:50%;display:inline-block;box-shadow:0 0 8px currentColor}
.btm-theme-option[data-theme="blue"] .btm-theme-dot{background:#66b9df;color:#66b9df}.btm-theme-option[data-theme="red"] .btm-theme-dot{background:#e35d67;color:#e35d67}.btm-theme-option[data-theme="orange"] .btm-theme-dot{background:#f08a45;color:#f08a45}.btm-theme-option[data-theme="green"] .btm-theme-dot{background:#59c49f;color:#59c49f}
@media(max-width:800px){.btm-theme-picker{margin:-8px 0 18px;align-items:flex-start;flex-direction:column}.btm-theme-options{width:100%;justify-content:flex-start}.btm-theme-option{flex:1;justify-content:center}}
@media(prefers-reduced-motion:reduce){html,body,.wrap,.nav,.panel,.stat,.exercise,.day-head,.btn,.week,.feel button,.sets input,.food input,.food textarea,.btm-theme-picker,.btm-theme-option{transition:none!important}body::before{transition:none!important}}
`;
const style=document.createElement('style');style.id='btm-theme-system-style';style.textContent=css;document.head.appendChild(style);
const buildPicker=()=>{if(document.querySelector('.btm-theme-picker'))return;const nav=document.querySelector('.btm-nav');if(!nav)return;const box=document.createElement('div');box.className='btm-theme-picker';box.innerHTML='<span class="btm-theme-label">COLOR THEME</span><div class="btm-theme-options"></div>';const options=box.querySelector('.btm-theme-options');Object.entries(THEMES).forEach(([key,t])=>{const b=document.createElement('button');b.type='button';b.className='btm-theme-option';b.dataset.theme=key;b.innerHTML='<span class="btm-theme-dot"></span>'+t.name;b.addEventListener('click',()=>apply(key));options.appendChild(b)});nav.insertAdjacentElement('afterend',box)};
const boot=()=>{buildPicker();apply(getTheme(),false)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.BTMTheme={apply,getTheme,themes:THEMES};
})();