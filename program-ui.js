(()=>{
'use strict';
if(window.__BTM_PROGRAM_UI__)return;
window.__BTM_PROGRAM_UI__=1;

const css=`
.btm-rules-stage{position:relative;overflow:hidden;padding:24px;border:1px solid var(--line);border-radius:10px;background:radial-gradient(circle at 50% 0%,var(--theme-glow,rgba(76,169,220,.12)),transparent 42%),linear-gradient(145deg,var(--panel,#13202a),var(--theme-input,#09131a));box-shadow:0 18px 55px rgba(0,0,0,.2)}
.btm-rules-stage::before{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,transparent 30%,color-mix(in srgb,var(--theme-primary,var(--blue)) 7%,transparent) 50%,transparent 70%);opacity:.5}
.btm-rules-head{position:relative;margin-bottom:20px}.btm-rules-head h2{margin-top:5px;color:var(--theme-light,var(--text))}.btm-rules-head .note{max-width:760px;line-height:1.45}
.btm-rules-grid{position:relative;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.btm-rule-card{min-height:118px;padding:15px 16px;border:1px solid var(--line);border-radius:8px;background:linear-gradient(145deg,color-mix(in srgb,var(--panel2,var(--panel)) 88%,transparent),var(--theme-input,#09131a));transition:transform .2s ease,border-color .25s ease,box-shadow .25s ease,background .3s ease}
.btm-rule-card:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--theme-primary,var(--blue)) 65%,var(--line));box-shadow:0 0 20px var(--theme-glow,rgba(76,169,220,.18))}
.btm-rule-card b{display:block;margin-bottom:8px;color:var(--theme-primary,var(--blue));font:11px 'JetBrains Mono';letter-spacing:.14em}
.btm-rule-card span{display:block;color:var(--muted);font:13px/1.5 'Barlow Condensed',sans-serif}
.btm-rule-card strong{color:var(--theme-light,var(--text))}
.btm-rules-commit{position:relative;display:flex;align-items:center;gap:9px;margin-top:16px;padding-top:15px;border-top:1px solid var(--line);color:var(--muted);font:10px 'JetBrains Mono';letter-spacing:.08em}
.btm-rules-commit input{width:18px;height:18px;accent-color:var(--theme-primary,var(--blue))}
@media(max-width:700px){.btm-rules-stage{padding:18px}.btm-rules-grid{grid-template-columns:1fr}.btm-rule-card{min-height:0}}
@media(prefers-reduced-motion:reduce){.btm-rule-card{transition:none!important}}
`;
const style=document.createElement('style');style.id='btm-program-ui-style';style.textContent=css;document.head.appendChild(style);

const rulesHTML=`
<div class="btm-rules-head">
  <div class="ey">THE CODE OF THE MACHINE</div>
  <h2>RULES</h2>
  <p class="note">The operating manual for the full 12-week system. Follow the prescribed work, control fatigue, and log reality instead of trying to make the dashboard look better.</p>
</div>
<div class="btm-rules-grid">
  <article class="btm-rule-card"><b>TRAINING</b><span>Train on the program's prescribed <strong>Tuesday, Thursday and Saturday</strong> calisthenics sessions. Complete the sets and reps shown for the current Week. Do not skip ahead because a target looks easy, and do not add ego-driven volume. Clean form and the prescribed <strong>1–2 RIR</strong> take priority over extra repetitions.</span></article>
  <article class="btm-rule-card"><b>RIR</b><span>RIR controls effort and fatigue. Respect the prescribed <strong>1–2 reps in reserve</strong>. Do not turn every set into failure training. If the target reps are reached with the intended RIR and clean technique, move forward with the program. If form breaks before the target, stop the set rather than forcing ugly reps.</span></article>
  <article class="btm-rule-card"><b>RUNNING</b><span>Running is <strong>Monday, Wednesday and Friday</strong>, three sessions per week. Follow the planned distance and record KM and pace accurately. The system starts at <strong>5.00 km per run</strong> and uses planned weekly progression. Keep most work controlled, do not add random extra runs, and do not make every session maximal. Pain that appears or worsens is a reason to stop and reassess, not blindly push through.</span></article>
  <article class="btm-rule-card"><b>NUTRITION</b><span>Use the <strong>weekly targets already shown in the Nutrition section</strong>, do not create competing targets. The current system uses a daily calorie target of <strong>1800–2000 kcal</strong> and a protein target of <strong>130–160 g</strong>, while carbohydrate and fat targets vary by Week. Track food honestly, keep protein consistent, log carbs and fats, and use carbohydrates to support training. Do not deliberately under-eat just to move the scale faster.</span></article>
  <article class="btm-rule-card"><b>SLEEP &amp; RECOVERY</b><span>Target <strong>23:00 → 07:30</strong>, approximately 8h 30m. Consistency supports recovery, muscle growth, running performance, energy and adherence. Keep the schedule stable instead of trying to repair several poor nights with random oversleeping. The existing sleep tracker remains the source of truth for the actual sleep score.</span></article>
  <article class="btm-rule-card"><b>DELOAD</b><span><strong>Week 7 is intentionally easier.</strong> Its reduced workload exists to recover, lower accumulated fatigue and prepare you for the second half. Do not add extra work, chase Week 6 numbers, or make up missed volume. Finish the deload, recover, then resume the normal progression in Week 8.</span></article>
  <article class="btm-rule-card"><b>PROGRESSION</b><span>Progress according to the Week data, not according to ego. Follow the prescribed sets and reps, maintain technique, respect RIR, and let the planned increases do the work. If performance drops significantly, prioritize recovery and execution instead of forcing progression. A bad session is information, not permission to rewrite the program.</span></article>
  <article class="btm-rule-card"><b>CONSISTENCY</b><span>Log workouts, running distance and pace, nutrition, sleep and weekly check-ins honestly. Never manipulate numbers to inflate completion or progress percentage. A missed session should remain a missed session. The dashboard is designed to expose reality so you can correct it, not to reward better-looking statistics.</span></article>
</div>
<label class="btm-rules-commit"><input id="rulesCommit" type="checkbox"><span>I COMMIT TO THE RULES</span></label>`;

function installRules(){
  const view=document.getElementById('btm-rules-view');
  if(!view)return false;
  const stage=view.querySelector('.btm-rules-stage');
  if(!stage)return false;
  stage.innerHTML=rulesHTML;
  const commit=stage.querySelector('#rulesCommit');
  commit.checked=localStorage.getItem('btm_rules_commit')==='1';
  commit.addEventListener('change',()=>localStorage.setItem('btm_rules_commit',commit.checked?'1':'0'));
  return true;
}

function boot(){
  if(installRules())return;
  const observer=new MutationObserver(()=>{if(installRules())observer.disconnect()});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),8000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();