/* Build The Machine, unified achievement-rank system. */
(()=>{
'use strict';
if(window.__BTM_UNIFIED_RANK_SYSTEM__)return;
window.__BTM_UNIFIED_RANK_SYSTEM__=1;

const RANKS=[
  ['NOVICE','Every expert was once willing to begin.'],
  ['BEGINNER','Small steps become serious progress when you refuse to stop.'],
  ['TRAINEE','Consistency turns effort into ability.'],
  ['APPRENTICE','Skill grows when discipline becomes routine.'],
  ['SKILLED','You are no longer learning the work, you are becoming the work.'],
  ['ADVANCED','Discipline begins where excuses lose their power.'],
  ['RECOVERY','Recovery is not retreat, it is how strength prepares to rise again.'],
  ['ELITE','You earned your place by doing what most people abandon.'],
  ['EXPERT','Control your effort, sharpen your execution, raise your standard.'],
  ['MASTER','Mastery is built through consistency when motivation disappears.'],
  ['GRANDMASTER','At this level, discipline is no longer an action, it is an identity.'],
  ['LEGEND','The final level is not the end, it is proof of what you became.']
];
const COLORS=['#66b9df','#71c7b4','#8ccf6b','#c9d35c','#e4bd5b','#e69a57','#d97878','#c86fc4','#b978e6','#8d8fe8','#6f9ee8','#66b9df'];
const OLD_NAMES=['Goku','Tanjiro Kamado','Yuji Itadori','Eren Yeager','Thorfinn','Vegeta','Gojo Satoru','Toji Fushiguro','Ken Kaneki','Itachi Uchiha','Griffith','Guts'];
const OLD_TERMS=['ANIME PROGRESSION','ANIME CHARACTER','CHARACTER PROGRESSION','MANGA PROGRESSION'];

const css=document.createElement('style');
css.id='btm-unified-rank-style';
css.textContent=`
.btm-unified-rank-panel{position:relative;min-height:150px;margin:18px 0;padding:24px 28px;border:1px solid var(--rank-color,#66b9df);border-radius:8px;background:radial-gradient(circle at 82% 35%,color-mix(in srgb,var(--rank-color,#66b9df) 10%,transparent),transparent 42%),linear-gradient(145deg,#13202a,#0d161d);overflow:hidden;transition:border-color .35s ease,box-shadow .35s ease,opacity .22s ease,transform .22s ease}
.btm-unified-rank-panel::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--rank-color,#66b9df) 3%,transparent),transparent);pointer-events:none}
.btm-unified-rank-kicker{position:relative;font:9px 'JetBrains Mono';letter-spacing:.22em;color:var(--muted)}
.btm-unified-rank-name{position:relative;margin-top:5px;font:clamp(36px,5vw,52px)/.95 Anton,sans-serif;letter-spacing:.02em;color:var(--rank-color,#66b9df);text-shadow:0 0 8px color-mix(in srgb,var(--rank-color,#66b9df) 28%,transparent)}
.btm-unified-rank-quote{position:relative;margin-top:10px;max-width:900px;font:700 clamp(20px,2.7vw,30px)/1.12 'Barlow Condensed',sans-serif;color:#eef7fa;text-wrap:balance;text-shadow:0 0 2px var(--rank-color,#66b9df),0 0 8px color-mix(in srgb,var(--rank-color,#66b9df) 42%,transparent),0 0 17px color-mix(in srgb,var(--rank-color,#66b9df) 18%,transparent);animation:btmUnifiedRankPulse 4.8s ease-in-out infinite}
.btm-unified-rank-quote::before{content:'“';color:var(--rank-color,#66b9df);font-family:Georgia,serif;margin-right:4px}.btm-unified-rank-quote::after{content:'”';color:var(--rank-color,#66b9df);font-family:Georgia,serif;margin-left:4px}
@keyframes btmUnifiedRankPulse{0%,100%{text-shadow:0 0 2px var(--rank-color,#66b9df),0 0 7px color-mix(in srgb,var(--rank-color,#66b9df) 36%,transparent),0 0 15px color-mix(in srgb,var(--rank-color,#66b9df) 15%,transparent)}50%{text-shadow:0 0 2px var(--rank-color,#66b9df),0 0 10px color-mix(in srgb,var(--rank-color,#66b9df) 50%,transparent),0 0 21px color-mix(in srgb,var(--rank-color,#66b9df) 23%,transparent)}}
.btm-unified-rank-panel.is-switching{opacity:.35;transform:translateY(4px)}
.week.btm-unified-rank-week{--rank-color:#66b9df;transition:background .3s ease,border-color .3s ease,box-shadow .3s ease,color .3s ease}.week.btm-unified-rank-week b{color:var(--rank-color)!important}.week.btm-unified-rank-week span{color:#dce9ee}.week.btm-unified-rank-week small{color:#718894}.week.btm-unified-rank-week:hover{border-color:var(--rank-color)!important;box-shadow:0 0 15px color-mix(in srgb,var(--rank-color) 24%,transparent)}
@media(prefers-reduced-motion:reduce){.btm-unified-rank-quote{animation:none}.btm-unified-rank-panel{transition:none}}
`;
document.head.appendChild(css);

function rankFor(n){return RANKS[Math.max(1,Math.min(12,n))-1]}
function colorFor(n){return COLORS[Math.max(1,Math.min(12,n))-1]}
function numberFrom(el,index){const explicit=Number(el?.dataset.weekId||el?.dataset.week);if(Number.isInteger(explicit)&&explicit>=1&&explicit<=12)return explicit;const m=(el?.textContent||'').match(/\bWEEK\s*(\d{1,2})\b/i);return m?Number(m[1]):index+1}
function selectedNumber(grid){const active=grid?.querySelector('.week.active');return numberFrom(active,0)||1}

function removeAnime(root=document.body){
  if(!root)return;
  root.querySelectorAll('.btm-character-card,.btm-manga-panel,.btm-week-manga,.btm-silhouette-wrap,.btm-silhouette,.btm-manga-art,.btm-manga-ink,.btm-manga-trace').forEach(el=>el.remove());
  root.querySelectorAll('.btm-selected-week-panel').forEach(el=>{if(!el.classList.contains('btm-unified-rank-panel'))el.remove()});
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(node=>{let text=node.nodeValue;const original=text;OLD_NAMES.forEach(name=>{text=text.replaceAll(name,'')});OLD_TERMS.forEach(term=>{text=text.replaceAll(term,'ACHIEVEMENT RANK')});if(text!==original)node.nodeValue=text});
  root.querySelectorAll('img,svg').forEach(el=>{const alt=(el.getAttribute('alt')||'')+' '+(el.getAttribute('aria-label')||'');if(OLD_NAMES.some(n=>alt.toLowerCase().includes(n.toLowerCase())))el.remove()});
}

function normalizeGrid(grid,mode){
  if(!grid)return;
  [...grid.querySelectorAll('.week')].slice(0,12).forEach((card,i)=>{
    const n=i+1,[rank]=rankFor(n);card.classList.add('btm-unified-rank-week');card.dataset.weekId=n;card.dataset.rank=rank;card.style.setProperty('--rank-color',colorFor(n));
    const b=card.querySelector('b');if(b)b.textContent='WEEK '+n;
    const span=card.querySelector('span');if(span)span.textContent=rank;
    const small=card.querySelector('small');if(small){
      let detail=(small.textContent||'').replace(/Goku|Tanjiro Kamado|Yuji Itadori|Eren Yeager|Thorfinn|Vegeta|Gojo Satoru|Toji Fushiguro|Ken Kaneki|Itachi Uchiha|Griffith|Guts/gi,'').replace(/·\s*DELOAD/gi,'').trim();
      if(mode==='training')detail=n===7?'RECOVERY · DELOAD':(n===12?'LEGEND · FINAL RANK':rank+' · '+(detail||'PROGRESSION'));
      else detail=n===7?'RECOVERY · DELOAD':rank+(detail?' · '+detail:'');
      small.textContent=detail;
    }
  });
}

function trainingPanel(){
  const grid=document.getElementById('weekGrid');if(!grid)return;
  const n=selectedNumber(grid),[rank,quote]=rankFor(n),color=colorFor(n),training=document.getElementById('trainingView');if(!training)return;
  training.querySelectorAll('.btm-character-card,.btm-selected-week-panel').forEach(el=>el.remove());
  let panel=training.querySelector('.btm-unified-rank-panel');if(!panel){panel=document.createElement('section');panel.className='btm-unified-rank-panel';grid.closest('.panel')?.insertAdjacentElement('afterend',panel)}
  panel.style.setProperty('--rank-color',color);const previous=panel.dataset.week;
  if(previous&&previous!==String(n)){panel.classList.add('is-switching');clearTimeout(panel.__rankTimer);panel.__rankTimer=setTimeout(()=>panel.classList.remove('is-switching'),220)}
  panel.dataset.week=n;panel.innerHTML='<div class="btm-unified-rank-kicker">ACHIEVEMENT RANK · WEEK '+n+'</div><div class="btm-unified-rank-name">'+rank+'</div><div class="btm-unified-rank-quote">'+quote+'</div>';
}

function normalizeAll(){removeAnime(document.body);normalizeGrid(document.getElementById('weekGrid'),'training');normalizeGrid(document.getElementById('foodWeeks'),'other');normalizeGrid(document.getElementById('runWeeks'),'other');normalizeGrid(document.getElementById('sleepWeeks'),'other');trainingPanel()}
function boot(){
  normalizeAll();
  const grids=['weekGrid','foodWeeks','runWeeks','sleepWeeks'].map(id=>document.getElementById(id)).filter(Boolean);
  grids.forEach(grid=>{const mo=new MutationObserver(()=>{clearTimeout(grid.__rankTimer);grid.__rankTimer=setTimeout(()=>{removeAnime(document.body);normalizeGrid(grid,grid.id==='weekGrid'?'training':'other');if(grid.id==='weekGrid')trainingPanel()},25)});mo.observe(grid,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})});
  const bodyMo=new MutationObserver(()=>{clearTimeout(bodyMo.__rankTimer);bodyMo.__rankTimer=setTimeout(normalizeAll,45)});bodyMo.observe(document.body,{childList:true,subtree:true});
  setTimeout(normalizeAll,150);setTimeout(normalizeAll,600);setTimeout(normalizeAll,1500);
}
window.BTMWeekRanks={ranks:RANKS,colors:COLORS,update:normalizeAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
