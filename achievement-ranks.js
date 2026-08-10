(()=>{
'use strict';
if(window.__BTM_ACHIEVEMENT_RANKS__)return;
window.__BTM_ACHIEVEMENT_RANKS__=1;
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
const oldNames=['Goku','Tanjiro Kamado','Yuji Itadori','Eren Yeager','Thorfinn','Vegeta','Gojo Satoru','Toji Fushiguro','Ken Kaneki','Itachi Uchiha','Griffith','Guts'];
const css=document.createElement('style');css.id='btm-achievement-ranks-style';css.textContent=`
.btm-rank-panel{margin:18px 0;padding:18px 20px;border:1px solid var(--week-color,var(--line));border-radius:9px;background:radial-gradient(circle at 70% 20%,color-mix(in srgb,var(--week-color,var(--blue)) 12%,transparent),transparent 45%),linear-gradient(145deg,#13202a,#0d161d);transition:opacity .3s ease,transform .3s ease,border-color .4s ease,box-shadow .4s ease}
.btm-rank-panel.is-changing{opacity:.35;transform:translateY(2px)}
.btm-rank-kicker{font:9px 'JetBrains Mono';letter-spacing:.18em;color:var(--muted);margin-bottom:5px}
.btm-rank-name{font:32px Anton,sans-serif;color:var(--week-color,var(--blue));letter-spacing:.03em}
.btm-rank-quote{margin-top:5px;font:22px/1.15 'Barlow Condensed',sans-serif;font-weight:600;color:#eef7fa;text-shadow:0 0 4px color-mix(in srgb,var(--week-color,var(--blue)) 75%,transparent),0 0 12px color-mix(in srgb,var(--week-color,var(--blue)) 32%,transparent);animation:btmRankPulse 3.8s ease-in-out infinite}
@keyframes btmRankPulse{0%,100%{text-shadow:0 0 3px color-mix(in srgb,var(--week-color,var(--blue)) 60%,transparent),0 0 9px color-mix(in srgb,var(--week-color,var(--blue)) 22%,transparent)}50%{text-shadow:0 0 6px color-mix(in srgb,var(--week-color,var(--blue)) 82%,transparent),0 0 16px color-mix(in srgb,var(--week-color,var(--blue)) 34%,transparent)}}
.week.btm-rank-week{--week-color:var(--blue);transition:background .3s,border-color .3s,box-shadow .3s,color .3s}
.week.btm-rank-week b{color:var(--week-color,var(--blue))!important}.week.btm-rank-week:hover{border-color:var(--week-color);box-shadow:0 0 14px color-mix(in srgb,var(--week-color) 25%,transparent)}
@media(max-width:600px){.btm-rank-name{font-size:27px}.btm-rank-quote{font-size:19px}}
`;document.head.appendChild(css);
function weekNumber(){const a=document.querySelector('#weekGrid .week.active');const m=(a?.textContent||'').match(/WEEK\s*(\d+)/i);return m?Math.max(1,Math.min(12,+m[1])):1}
function weekColor(n){const el=document.querySelectorAll('#weekGrid .week')[n-1];return el?getComputedStyle(el).getPropertyValue('--week-color').trim()||getComputedStyle(el).color:'var(--blue)'}
function removeOldText(root){if(!root)return;const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(n=>{let t=n.nodeValue;oldNames.forEach(name=>{t=t.replaceAll(name,'')});n.nodeValue=t})}
function apply(){const grid=document.getElementById('weekGrid');if(!grid)return;const cards=[...grid.querySelectorAll('.week')];cards.forEach((card,i)=>{const n=i+1;card.classList.add('btm-rank-week');card.dataset.rank=RANKS[n-1][0];const c=getComputedStyle(card).borderColor;card.style.setProperty('--week-color',c&&c!=='rgb(41, 70, 86)'?c:'var(--blue)');const b=card.querySelector('b');if(b)b.textContent='WEEK '+n;const spans=card.querySelectorAll('span,small');spans.forEach(s=>{if(/Goku|Tanjiro|Yuji|Eren|Thorfinn|Vegeta|Gojo|Toji|Kaneki|Itachi|Griffith|Guts/i.test(s.textContent))s.textContent=RANKS[n-1][0]})});
const view=document.getElementById('trainingView');if(!view)return;removeOldText(view);let panel=view.querySelector('.btm-rank-panel');if(!panel){panel=document.createElement('section');panel.className='btm-rank-panel';const workouts=document.getElementById('workouts');workouts?.parentNode.insertBefore(panel,workouts)}const n=weekNumber(),rank=RANKS[n-1];panel.style.setProperty('--week-color',weekColor(n));panel.innerHTML='<div class="btm-rank-kicker">ACHIEVEMENT RANK · WEEK '+n+'</div><div class="btm-rank-name">'+rank[0]+'</div><div class="btm-rank-quote">“'+rank[1]+'”</div>';
}
let last=0;function boot(){apply();const mo=new MutationObserver(()=>{const n=weekNumber();if(n!==last){last=n;const p=document.querySelector('.btm-rank-panel');if(p)p.classList.add('is-changing');setTimeout(()=>{apply();document.querySelector('.btm-rank-panel')?.classList.remove('is-changing')},180)}else apply()});mo.observe(document.body,{childList:true,subtree:true});setTimeout(apply,200);setTimeout(apply,700)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();