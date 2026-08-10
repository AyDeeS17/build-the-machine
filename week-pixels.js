/* Week character portraits, mature face-first presentation for the 12-week selector. */
(()=>{
'use strict';
if(window.__BTM_WEEK_PORTRAITS__)return;
window.__BTM_WEEK_PORTRAITS__=true;
const C=[
{name:'Goku',hair:'#151a22',skin:'#c98968',outfit:'#e77c24',accent:'#f1b84b',style:'spike'},
{name:'Tanjiro Kamado',hair:'#241d27',skin:'#c98f72',outfit:'#18252a',accent:'#315b49',style:'fringe'},
{name:'Yuji Itadori',hair:'#b9757d',skin:'#c99176',outfit:'#18222d',accent:'#3d6284',style:'short'},
{name:'Eren Yeager',hair:'#30231f',skin:'#c78e70',outfit:'#263e45',accent:'#526f61',style:'long'},
{name:'Thorfinn',hair:'#d3ad6b',skin:'#d19a78',outfit:'#34444c',accent:'#7e9aa5',style:'braid'},
{name:'Vegeta',hair:'#10161f',skin:'#c88767',outfit:'#234c79',accent:'#dfe6ef',style:'upright'},
{name:'Gojo Satoru',hair:'#d7e2e9',skin:'#d39a7c',outfit:'#111923',accent:'#67b9e4',style:'white'},
{name:'Toji Fushiguro',hair:'#171b1f',skin:'#c78a6c',outfit:'#2d403d',accent:'#789088',style:'messy'},
{name:'Ken Kaneki',hair:'#eef2f3',skin:'#c88f73',outfit:'#171c24',accent:'#a33e51',style:'whitefringe'},
{name:'Itachi Uchiha',hair:'#11151b',skin:'#c88f73',outfit:'#171b24',accent:'#8d3041',style:'longbang'},
{name:'Griffith',hair:'#efe5cf',skin:'#d6a384',outfit:'#dfe6ea',accent:'#b9c9d2',style:'flow'},
{name:'Guts',hair:'#15181d',skin:'#b98268',outfit:'#20252b',accent:'#707a82',style:'spike'}
];
const hair=c=>{const h=c.hair;const m={
spike:`<path d="M26 42Q20 20 34 11L39 22L44 6L48 20L57 8L55 23L66 14L61 42Q45 49 26 42Z"/>`,
fringe:`<path d="M26 42Q22 20 37 12Q55 4 66 20L62 43L55 32L50 43L45 30L38 42L32 33Z"/>`,
short:`<path d="M27 41Q23 21 38 13Q55 7 66 21L62 42L55 34L50 43L44 32L38 42L32 34Z"/>`,
long:`<path d="M25 43Q21 18 38 10Q56 4 66 20L66 72L58 78L56 43L49 31L43 43L36 31L29 46Z"/>`,
braid:`<path d="M26 42Q22 19 38 11Q56 5 66 20L62 43L55 32L50 43L44 31L37 42L32 34Z"/><path d="M64 40Q75 48 66 57Q75 63 66 71Q73 77 65 84" fill="none" stroke="${h}" stroke-width="7" stroke-linecap="round"/>`,
upright:`<path d="M27 42Q22 22 33 14L31 4L40 15L44 0L49 14L57 3L56 16L66 9L62 42L55 32L50 42L44 30L38 42L32 34Z"/>`,
white:`<path d="M25 42Q22 20 38 11Q55 4 66 20L62 43L55 32L50 43L44 30L38 42L32 33Z"/>`,
messy:`<path d="M25 43Q21 19 38 11Q55 5 67 20L73 13L70 29L65 25L63 43L55 32L49 43L43 29L36 42L31 34Z"/>`,
whitefringe:`<path d="M25 42Q22 20 38 11Q55 5 66 20L62 43L55 31L49 44L44 29L38 42L32 33Z"/>`,
longbang:`<path d="M25 43Q21 18 38 10Q56 4 66 20L66 72L58 78L56 44L50 31L44 44L37 31L30 45Z"/>`,
flow:`<path d="M25 43Q22 19 39 10Q57 4 68 21L69 70Q64 77 57 76L56 43L49 31L43 43L36 31L29 45Z"/>`
};return `<g fill="${h}">${m[c.style]||m.short}</g>`};
const portrait=c=>`<svg class="btm-character-art" viewBox="0 0 92 110" role="img" aria-label="${c.name}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
<defs><radialGradient id="skin${c.name.replace(/\W/g,'')}" cx="45%" cy="35%"><stop offset="0" stop-color="#f0b89a"/><stop offset=".62" stop-color="${c.skin}"/><stop offset="1" stop-color="#80564d"/></radialGradient><linearGradient id="coat${c.name.replace(/\W/g,'')}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${c.outfit}"/></linearGradient><filter id="shadow${c.name.replace(/\W/g,'')}"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".55"/></filter></defs>
<g filter="url(#shadow${c.name.replace(/\W/g,'')})">
<path d="M24 108Q25 82 35 76L57 76Q68 82 70 108Z" fill="url(#coat${c.name.replace(/\W/g,'')})"/>
<path d="M35 73Q45 82 57 73L58 88Q46 96 34 88Z" fill="url(#skin${c.name.replace(/\W/g,'')})"/>
<path d="M25 43Q26 21 46 17Q66 21 68 43L64 65Q58 79 46 82Q33 79 28 65Z" fill="url(#skin${c.name.replace(/\W/g,'')})"/>
${hair(c)}
<path d="M31 45Q36 39 41 44M51 44Q57 39 62 45" fill="none" stroke="#3b2526" stroke-width="3" stroke-linecap="round"/>
<path d="M34 51Q39 47 43 51M49 51Q54 47 59 51" fill="none" stroke="#151a22" stroke-width="2.3" stroke-linecap="round"/>
<ellipse cx="40" cy="52" rx="2.2" ry="1.6" fill="#0a1015"/><ellipse cx="54" cy="52" rx="2.2" ry="1.6" fill="#0a1015"/>
<path d="M46 52L44 61L48 62" fill="none" stroke="#7d4d46" stroke-width="1.3" stroke-linecap="round"/>
<path d="M39 68Q46 72 54 68" fill="none" stroke="#5e3535" stroke-width="1.8" stroke-linecap="round"/>
<path d="M29 61Q46 73 64 61" fill="none" stroke="#ffffff" stroke-opacity=".11" stroke-width="3"/>
</g>
<path class="btm-character-trace" d="M26 43Q26 21 46 17Q66 21 68 43L64 65Q58 79 46 82Q33 79 28 65Z" pathLength="1"/>
</svg>`;
const panelPortrait=c=>`<div class="btm-selected-portrait"><div class="btm-selected-art">${portrait(c)}</div><div><div class="ey">WEEK CHARACTER</div><h3>${c.name}</h3><p>Progression symbol for this stage of the machine.</p></div></div>`;
const ensurePanel=()=>{const toolbar=document.querySelector('.week-toolbar');if(!toolbar||document.getElementById('btm-selected-character'))return;const p=document.createElement('div');p.id='btm-selected-character';p.className='btm-selected-character';p.innerHTML='<div id="btm-selected-character-inner"></div>';toolbar.appendChild(p)};
const updatePanel=()=>{ensurePanel();const grid=document.getElementById('weekGrid'),target=document.getElementById('btm-selected-character-inner');if(!grid||!target)return;const cards=[...grid.querySelectorAll('.week')].slice(0,12),i=Math.max(0,cards.findIndex(x=>x.classList.contains('active')));if(C[i])target.innerHTML=panelPortrait(C[i])};
const apply=()=>{const grid=document.getElementById('weekGrid');if(!grid)return;[...grid.querySelectorAll('.week')].slice(0,12).forEach((card,i)=>{if(card.querySelector('.btm-week-pixel'))return;const wrap=document.createElement('span');wrap.className='btm-week-pixel';wrap.dataset.character=C[i].name;wrap.title=C[i].name;wrap.innerHTML=portrait(C[i]);card.appendChild(wrap)});updatePanel()};
const boot=()=>{if(!document.getElementById('btm-week-pixels-link')){const l=document.createElement('link');l.id='btm-week-pixels-link';l.rel='stylesheet';l.href='./week-pixels.css';document.head.appendChild(l)};ensurePanel();apply();const grid=document.getElementById('weekGrid');if(grid){grid.addEventListener('click',()=>setTimeout(updatePanel,0),{passive:true});const obs=new MutationObserver(()=>{apply()});obs.observe(grid,{childList:true,subtree:true});window.__btmWeekCharacterObserver=obs}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
