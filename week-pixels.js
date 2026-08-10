/* Week character artwork, clean vector-anime companions for the 12-week selector. */
(()=>{
  'use strict';
  if(window.__BTM_WEEK_CHARACTERS__)return;
  window.__BTM_WEEK_CHARACTERS__=true;
  const CHARACTERS=[
    {name:'Goku',hair:'#151a22',skin:'#c98968',outfit:'#e77c24',accent:'#f1b84b',hairType:'spike',pose:'guard'},
    {name:'Tanjiro Kamado',hair:'#241d27',skin:'#c98f72',outfit:'#18252a',accent:'#315b49',hairType:'fringe',pose:'sword'},
    {name:'Yuji Itadori',hair:'#b9757d',skin:'#c99176',outfit:'#18222d',accent:'#3d6284',hairType:'short',pose:'fist'},
    {name:'Eren Yeager',hair:'#30231f',skin:'#c78e70',outfit:'#263e45',accent:'#526f61',hairType:'long',pose:'cloak'},
    {name:'Thorfinn',hair:'#d3ad6b',skin:'#d19a78',outfit:'#34444c',accent:'#7e9aa5',hairType:'braid',pose:'blade'},
    {name:'Vegeta',hair:'#10161f',skin:'#c88767',outfit:'#234c79',accent:'#dfe6ef',hairType:'upright',pose:'arms'},
    {name:'Gojo Satoru',hair:'#d7e2e9',skin:'#d39a7c',outfit:'#111923',accent:'#67b9e4',hairType:'white',pose:'blindfold'},
    {name:'Toji Fushiguro',hair:'#171b1f',skin:'#c78a6c',outfit:'#2d403d',accent:'#789088',hairType:'messy',pose:'stance'},
    {name:'Ken Kaneki',hair:'#eef2f3',skin:'#c88f73',outfit:'#171c24',accent:'#a33e51',hairType:'whitefringe',pose:'cloak'},
    {name:'Itachi Uchiha',hair:'#11151b',skin:'#c88f73',outfit:'#171b24',accent:'#8d3041',hairType:'longbang',pose:'hand'},
    {name:'Griffith',hair:'#efe5cf',skin:'#d6a384',outfit:'#dfe6ea',accent:'#b9c9d2',hairType:'flow',pose:'armor'},
    {name:'Guts',hair:'#15181d',skin:'#b98268',outfit:'#20252b',accent:'#707a82',hairType:'spike',pose:'sword'}
  ];
  const hair=c=>{const h=c.hair,map={
    spike:`<path d="M31 31 Q27 20 33 13 L37 19 L41 8 L45 18 L51 7 L52 20 L59 12 L58 28 Q52 34 31 31Z" fill="${h}"/>`,
    fringe:`<path d="M31 30 Q28 16 38 12 Q51 7 59 17 L57 30 L52 23 L48 29 L44 20 L39 28 L35 22Z" fill="${h}"/>`,
    short:`<path d="M31 29 Q30 15 40 12 Q53 9 59 19 L57 28 L52 24 L48 28 L44 23 L39 28 L35 23Z" fill="${h}"/>`,
    long:`<path d="M30 30 Q28 14 39 10 Q52 7 59 17 L59 54 L54 58 L52 30 L47 24 L43 29 L38 23 L34 31Z" fill="${h}"/>`,
    braid:`<path d="M30 30 Q28 14 39 11 Q53 8 59 18 L57 31 L53 25 L49 29 L45 21 L40 29 L35 23Z" fill="${h}"/><path d="M58 28 Q64 34 59 39 Q65 43 59 48 Q63 52 58 57" fill="none" stroke="${h}" stroke-width="5" stroke-linecap="round"/>`,
    upright:`<path d="M31 30 Q28 17 36 13 L35 5 L41 12 L43 1 L47 12 L52 3 L52 14 L59 8 L57 29 L52 23 L48 28 L44 21 L39 28 L35 23Z" fill="${h}"/>`,
    white:`<path d="M30 30 Q29 15 40 11 Q53 7 59 18 L57 30 L52 23 L48 29 L44 20 L39 28 L35 22Z" fill="${h}"/>`,
    messy:`<path d="M30 30 Q28 15 39 11 Q50 7 59 17 L64 12 L62 25 L58 22 L56 31 L51 23 L46 29 L42 20 L37 28 L34 23Z" fill="${h}"/>`,
    whitefringe:`<path d="M30 30 Q29 15 40 11 Q53 7 59 18 L57 30 L52 23 L48 31 L44 20 L40 29 L36 22Z" fill="${h}"/>`,
    longbang:`<path d="M30 30 Q28 14 39 10 Q52 7 59 17 L59 55 L54 59 L52 31 L48 23 L43 31 L39 23 L34 32Z" fill="${h}"/>`,
    flow:`<path d="M30 31 Q28 15 40 10 Q54 7 60 19 L61 53 Q57 58 52 57 L52 30 L47 24 L43 30 L38 23 L34 31Z" fill="${h}"/>`
  };return map[c.hairType]||map.short};
  const face=c=>`<path d="M34 25 Q44 19 55 25 L54 39 Q50 47 44 48 Q37 46 33 39Z" fill="${c.skin}"/><path d="M38 34 L41 34 M48 34 L51 34" stroke="#182029" stroke-width="1.4" stroke-linecap="round"/><path d="M42 41 Q45 42 48 41" fill="none" stroke="#7b4c46" stroke-width="1" stroke-linecap="round"/>`;
  const body=c=>`<path d="M37 45 L50 45 Q58 48 61 60 L64 88 L25 88 L28 61 Q30 49 37 45Z" fill="${c.outfit}"/><path d="M39 47 L44 58 L50 47" fill="none" stroke="${c.accent}" stroke-width="2" opacity=".9"/><path d="M31 57 L23 70 M57 57 L66 68" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
  const pose=c=>{
    if(c.pose==='sword')return `<path d="M23 70 L15 45" stroke="${c.accent}" stroke-width="2.2"/><path d="M13 43 L15 39 L17 44" fill="none" stroke="#e8f0f4" stroke-width="1.4"/><path d="M20 58 L29 65" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
    if(c.pose==='fist')return `<path d="M58 59 L70 49" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><circle cx="72" cy="47" r="5" fill="${c.skin}"/><path d="M27 61 L18 70" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
    if(c.pose==='cloak')return `<path d="M29 50 Q16 63 18 88 L68 88 Q70 64 57 50 L54 86 L32 86Z" fill="${c.accent}" opacity=".62"/><path d="M59 58 L70 74" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
    if(c.pose==='blade')return `<path d="M61 62 L73 42" stroke="${c.accent}" stroke-width="2.2"/><path d="M72 42 L76 36" stroke="#e8f0f4" stroke-width="1.5"/><path d="M30 60 L20 68" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
    if(c.pose==='arms')return `<path d="M31 58 L20 67 M57 58 L68 67" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><path d="M24 68 L20 72 M64 68 L68 72" stroke="${c.accent}" stroke-width="4" stroke-linecap="round"/>`;
    if(c.pose==='blindfold')return `<rect x="33" y="31" width="23" height="6" rx="2" fill="#090d13"/><path d="M57 34 L65 40" stroke="#090d13" stroke-width="2"/><path d="M30 57 L20 67" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/>`;
    if(c.pose==='stance')return `<path d="M30 58 L19 74 M58 58 L70 72" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><path d="M19 74 L12 75 M70 72 L76 73" stroke="${c.outfit}" stroke-width="4" stroke-linecap="round"/>`;
    if(c.pose==='hand')return `<path d="M58 57 L70 50" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><path d="M70 50 l4 -5 M70 50 l6 0 M70 50 l4 4" stroke="${c.skin}" stroke-width="2" stroke-linecap="round"/>`;
    if(c.pose==='armor')return `<path d="M29 55 L20 69 M58 55 L68 69" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><path d="M32 52 L56 52 L60 73 L28 73Z" fill="${c.accent}" opacity=".65"/><path d="M38 54 L50 54" stroke="#fff" stroke-width="1.2" opacity=".65"/>`;
    return `<path d="M30 58 L20 70 M58 58 L68 68" stroke="${c.skin}" stroke-width="5" stroke-linecap="round"/><path d="M20 70 L15 74 M68 68 L73 72" stroke="${c.outfit}" stroke-width="4" stroke-linecap="round"/>`;
  };
  const outline=`M31 31 Q27 20 33 13 Q37 8 41 8 Q45 4 51 7 Q58 10 59 18 L59 43 Q59 46 61 51 Q65 58 66 68 L72 73 L68 77 L64 74 L64 88 L25 88 L28 69 L23 70 L18 76 L13 74 L19 67 L25 58 Q28 49 33 44 L33 39 Q31 35 31 31Z`;
  const svg=c=>`<svg class="btm-character-art" viewBox="0 0 88 96" role="img" aria-label="${c.name}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet"><g class="btm-character-drawing">${body(c)}${face(c)}${hair(c)}${pose(c)}</g><path class="btm-character-trace" d="${outline}" pathLength="1"/></svg>`;
  const install=()=>{if(document.getElementById('btm-week-pixels-link'))return;const link=document.createElement('link');link.id='btm-week-pixels-link';link.rel='stylesheet';link.href='./week-pixels.css';document.head.appendChild(link)};
  const apply=()=>{const grid=document.getElementById('weekGrid');if(!grid)return;[...grid.querySelectorAll('.week')].slice(0,12).forEach((card,i)=>{if(card.querySelector('.btm-week-pixel'))return;const c=CHARACTERS[i],wrap=document.createElement('span');wrap.className='btm-week-pixel';wrap.dataset.character=c.name;wrap.title=c.name;wrap.innerHTML=svg(c);card.appendChild(wrap)})};
  const boot=()=>{install();apply();const grid=document.getElementById('weekGrid');if(grid){const obs=new MutationObserver(apply);obs.observe(grid,{childList:true,subtree:true});window.__btmWeekCharacterObserver=obs}};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
