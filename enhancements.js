/* Build The Machine, achievement rank progression. */
(()=>{
'use strict';
if(window.__BTM_WEEK_SELECTOR_FIX__)return;
window.__BTM_WEEK_SELECTOR_FIX__=1;

const RANKS=[
  {id:1,name:'NOVICE',quote:'Every expert was once willing to begin.'},
  {id:2,name:'BEGINNER',quote:'Small steps become serious progress when you refuse to stop.'},
  {id:3,name:'TRAINEE',quote:'Consistency turns effort into ability.'},
  {id:4,name:'APPRENTICE',quote:'Skill grows when discipline becomes routine.'},
  {id:5,name:'SKILLED',quote:'You are no longer learning the work, you are becoming the work.'},
  {id:6,name:'ADVANCED',quote:'Discipline begins where excuses lose their power.'},
  {id:7,name:'RECOVERY',quote:'Recovery is not retreat, it is how strength prepares to rise again.'},
  {id:8,name:'ELITE',quote:'You earned your place by doing what most people abandon.'},
  {id:9,name:'EXPERT',quote:'Control your effort, sharpen your execution, raise your standard.'},
  {id:10,name:'MASTER',quote:'Mastery is built through consistency when motivation disappears.'},
  {id:11,name:'GRANDMASTER',quote:'At this level, discipline is no longer an action, it is an identity.'},
  {id:12,name:'LEGEND',quote:'The final level is not the end, it is proof of what you became.'}
];
const OLD_NAMES=['Goku','Tanjiro Kamado','Yuji Itadori','Eren Yeager','Thorfinn','Vegeta','Gojo Satoru','Toji Fushiguro','Ken Kaneki','Itachi Uchiha','Griffith','Guts'];
const WEEK_COLORS=['#66b9df','#71c7b4','#8ccf6b','#c9d35c','#e4bd5b','#e69a57','#d97878','#c86fc4','#b978e6','#8d8fe8','#6f9ee8','#66b9df'];

const css=`
.btm-selected-week-rank{margin:16px 0 0;max-width:920px;color:var(--rank-color,#66b9df);font:400 clamp(28px,3.6vw,42px)/1 Anton,sans-serif;letter-spacing:.025em;transition:opacity .28s ease,transform .28s ease,color .35s ease}
.btm-selected-week-rank.is-switching{opacity:0;transform:translateY(7px);filter:blur(4px)}
.btm-selected-week-quote{margin:5px 0 0;max-width:920px;color:#eef7fa;font:700 clamp(20px,2.7vw,30px)/1.15 'Barlow Condensed',sans-serif;letter-spacing:.015em;text-wrap:balance;text-shadow:0 0 1px var(--rank-color,#66b9df),0 0 7px color-mix(in srgb,var(--rank-color,#66b9df) 42%,transparent),0 0 16px color-mix(in srgb,var(--rank-color,#66b9df) 18%,transparent);animation:btm-rank-pulse 4.8s ease-in-out infinite;transition:opacity .28s ease,transform .28s ease,color .35s ease,text-shadow .35s ease}
@keyframes btm-rank-pulse{0%,100%{text-shadow:0 0 1px var(--rank-color,#66b9df),0 0 6px color-mix(in srgb,var(--rank-color,#66b9df) 36%,transparent),0 0 14px color-mix(in srgb,var(--rank-color,#66b9df) 15%,transparent)}50%{text-shadow:0 0 1px var(--rank-color,#66b9df),0 0 9px color-mix(in srgb,var(--rank-color,#66b9df) 48%,transparent),0 0 20px color-mix(in srgb,var(--rank-color,#66b9df) 22%,transparent)}}
.btm-rank-week{--rank-color:#66b9df;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,color .3s ease}
.btm-rank-week b{color:var(--rank-color)!important}.btm-rank-week:hover{border-color:var(--rank-color)!important;box-shadow:0 0 14px color-mix(in srgb,var(--rank-color) 25%,transparent)}
.btm-rank-week .btm-rank-label{display:block;margin-top:5px;color:var(--rank-color);font:700 11px 'JetBrains Mono'}
@media(prefers-reduced-motion:reduce){.btm-selected-week-quote{animation:none!important}.btm-selected-week-rank,.btm-selected-week-quote{transition:opacity .2s ease,color .2s ease}.btm-selected-week-rank.is-switching{transform:none;filter:none}}
`;
const style=document.createElement('style');style.id='btm-week-rank-style';style.textContent=css;document.head.appendChild(style);

function weekId(button){const explicit=Number(button?.dataset.weekId||button?.dataset.week);if(Number.isInteger(explicit)&&explicit>=1&&explicit<=12)return explicit;const m=(button?.textContent||'').match(/\bWEEK\s*(\d{1,2})\b/i);return m?Number(m[1]):null}
function activeWeek(){return weekId(document.querySelector('#weekGrid .week.active'))||1}
function colorFor(id,card){const computed=card?getComputedStyle(card):null;const vars=['--difficulty-color','--week-color','--accent','--theme-primary'];if(computed)for(const v of vars){const x=computed.getPropertyValue(v).trim();if(x)return x}return WEEK_COLORS[id-1]||WEEK_COLORS[0]}
function stripAnime(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);for(const node of nodes){let text=node.nodeValue;for(const name of OLD_NAMES)text=text.replaceAll(name,'');if(text!==node.nodeValue)node.nodeValue=text}}
function findSelectedPanel(grid){const host=grid.closest('.panel');if(!host)return null;const candidates=[...host.querySelectorAll('.panel')];return candidates.find(x=>/ANIME PROGRESSION|REVEAL\s*\d+%/i.test(x.textContent||''))||candidates.find(x=>x.querySelector('.btm-selected-week-quote'))||null}
function ensurePanel(grid,id,color){let panel=findSelectedPanel(grid);if(!panel){panel=document.createElement('section');panel.className='panel btm-achievement-panel';grid.closest('.panel')?.after(panel)}panel.classList.add('btm-achievement-panel');panel.style.setProperty('--rank-color',color);let rank=panel.querySelector('.btm-selected-week-rank');let quote=panel.querySelector('.btm-selected-week-quote');if(!rank){rank=document.createElement('div');rank.className='btm-selected-week-rank';panel.appendChild(rank)}if(!quote){quote=document.createElement('div');quote.className='btm-selected-week-quote';panel.appendChild(quote)}return {panel,rank,quote}}
function apply(){const grid=document.getElementById('weekGrid');if(!grid)return;const cards=[...grid.querySelectorAll('.week')];cards.forEach((card,index)=>{const id=index+1,rank=RANKS[id-1],color=colorFor(id,card);card.classList.add('btm-rank-week');card.style.setProperty('--rank-color',color);card.dataset.rank=rank.name;const b=card.querySelector('b');if(b)b.textContent='WEEK '+id;card.querySelectorAll('.btm-rank-label').forEach(x=>x.remove());const label=document.createElement('span');label.className='btm-rank-label';label.textContent=rank.name;card.appendChild(label)});
const id=activeWeek(),rank=RANKS[id-1],card=cards[id-1],color=colorFor(id,card);stripAnime(document.getElementById('trainingView'));const ui=ensurePanel(grid,id,color);const changed=ui.rank.dataset.id&&ui.rank.dataset.id!==String(id);if(changed){ui.rank.classList.add('is-switching');ui.quote.classList.add('is-switching');setTimeout(()=>{ui.rank.textContent=rank.name;ui.quote.textContent=rank.quote;ui.rank.dataset.id=id;ui.rank.classList.remove('is-switching');ui.quote.classList.remove('is-switching')},220)}else{ui.rank.textContent=rank.name;ui.quote.textContent=rank.quote;ui.rank.dataset.id=id}ui.panel.style.setProperty('--rank-color',color)}
function boot(){apply();const grid=document.getElementById('weekGrid');if(!grid){const mo=new MutationObserver(()=>{const g=document.getElementById('weekGrid');if(g){mo.disconnect();boot()}});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),10000);return}const mo=new MutationObserver(()=>{clearTimeout(boot.t);boot.t=setTimeout(apply,30)});mo.observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});const body=new MutationObserver(()=>{clearTimeout(body.t);body.t=setTimeout(apply,60)});body.observe(document.getElementById('trainingView')||document.body,{childList:true,subtree:true});setTimeout(apply,200);setTimeout(apply,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.BTMWeekRanks={ranks:RANKS,update:apply};
})();