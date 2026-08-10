/* Build The Machine, Rules mode, isolated. No E effects. */
(function(){
  const $=id=>document.getElementById(id);
  const btn=$('rulesBtn');
  if(!btn)return;
  const rules=[
    ['EFFORT','Train with intent. Do the work instead of chasing comfort.'],
    ['CLEAN REPS','Technique comes first. If form breaks down, the set is no longer quality work.'],
    ['PROGRESSION','Follow the planned progression. Do not add random volume just because you feel good.'],
    ['REST','Respect the prescribed rest. Recovery is part of the training, not an excuse to avoid it.'],
    ['RUNNING','Follow the weekly running progression and keep the planned increase under control.'],
    ['PAIN','Normal effort and fatigue are not the same as sharp or worsening pain. Stop and reassess when something feels wrong.'],
    ['RECOVERY','Sleep, food, hydration and rest days are part of the machine.']
  ];
  const style=document.createElement('style');
  style.textContent=`
  .rules-view{display:none!important;position:relative;overflow:hidden;background:linear-gradient(rgba(5,15,23,.76),rgba(5,15,23,.94)),radial-gradient(circle at 50% 0%,rgba(102,185,223,.14),transparent 48%),linear-gradient(90deg,#15100d 0%,#30271f 50%,#111922 100%);border-color:#465565;min-height:520px}
  .rules-view.rules-active{display:block!important;animation:rulesFade .65s ease both}
  .rules-view:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.18;background:repeating-linear-gradient(90deg,transparent 0 12%,rgba(180,135,82,.22) 12.1% 12.5%,transparent 12.6% 25%);mix-blend-mode:screen}
  .rules-head,.rules-grid,.rules-commit{position:relative;z-index:2}.rules-head{padding:8px 0 22px;border-bottom:1px solid #465565}.rules-head h2{color:#d9e4eb;margin-top:5px}.rules-sub{color:#9aa9b4;max-width:720px;font-size:13px}
  .rules-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-top:18px}.rule-card{background:rgba(8,17,24,.82);border:1px solid #465565;border-radius:7px;padding:15px;transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}.rule-card:hover{transform:translateY(-2px);border-color:#66b9df;box-shadow:0 10px 25px rgba(0,0,0,.2)}.rule-card h3{margin:0;color:#66b9df;font:700 12px 'JetBrains Mono';letter-spacing:.12em}.rule-card p{margin:8px 0 0;color:#c0ccd3;font-size:14px;line-height:1.25}
  .rules-commit{margin-top:16px;padding:15px;background:rgba(7,16,22,.86);border:1px solid #5d6872;border-radius:7px;display:flex;align-items:center;justify-content:space-between;gap:12px}.rules-check{display:flex;align-items:center;gap:11px;color:#e8f0f4;font:700 11px 'JetBrains Mono';cursor:pointer}.rules-check input{width:22px;height:22px;accent-color:#4fae9f}.rules-status{font:9px 'JetBrains Mono';color:#8195a3;text-transform:uppercase}
  @keyframes rulesFade{from{opacity:0;filter:blur(5px)}to{opacity:1;filter:none}}
  @media(max-width:650px){.rules-grid{grid-template-columns:1fr}.rules-commit{align-items:flex-start;flex-direction:column}}
  @media(prefers-reduced-motion:reduce){.rules-view.rules-active{animation:none}}
  `;
  document.head.appendChild(style);
  const main=document.querySelector('main.wrap');
  if(!main)return;
  const view=document.createElement('section');
  view.id='rulesView';
  view.className='panel rules-view';
  view.setAttribute('aria-hidden','true');
  view.innerHTML=`<div class="rules-head"><div class="ey">THE CODE OF THE MACHINE</div><h2>RULES</h2><p class="rules-sub">Authority → Discipline → Accountability. These rules define how the 12-week program is executed.</p></div><div class="rules-grid">${rules.map(r=>`<article class="rule-card btm-ripple"><h3>${r[0]}</h3><p>${r[1]}</p></article>`).join('')}</div><div class="rules-commit"><label class="rules-check"><input id="rulesCommit" type="checkbox"> I COMMIT TO THE RULES</label><span id="rulesStatus" class="rules-status">NOT COMMITTED</span></div>`;
  main.appendChild(view);

  const training=$('trainingView'),food=$('foodView'),module=$('moduleView');
  function deactivate(){
    view.classList.remove('rules-active');
    view.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('rules-mode');
    document.body.classList.remove('rules-mode');
  }
  function activate(){
    if(training)training.style.display='none';
    if(food)food.classList.remove('show');
    if(module)module.style.display='none';
    document.querySelectorAll('.extra-view').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.btm-nav .btn').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.classList.add('rules-mode');
    document.body.classList.add('rules-mode');
    view.classList.remove('rules-active');
    void view.offsetWidth;
    view.classList.add('rules-active');
    view.setAttribute('aria-hidden','false');
    window.scrollTo({top:0,behavior:'smooth'});
  }
  btn.addEventListener('click',activate);
  document.addEventListener('click',e=>{
    const target=e.target.closest('.btm-nav .btn');
    if(!target)return;
    if(target!==btn)deactivate();
  },true);
  window.addEventListener('btm-section-change',e=>{if(!e.detail||e.detail.id!=='rules')deactivate()});

  const key='btm_rules_commit';
  const cb=$('rulesCommit'),status=$('rulesStatus');
  cb.checked=localStorage.getItem(key)==='1';
  function sync(){status.textContent=cb.checked?'COMMITTED':'NOT COMMITTED';status.style.color=cb.checked?'#4fae9f':'#8195a3'}
  cb.onchange=()=>{localStorage.setItem(key,cb.checked?'1':'0');sync()};
  sync();
  deactivate();

  // Allow the persistent navigation on other section pages to open Rules directly.
  const params=new URLSearchParams(location.search);
  if(params.get('section')==='rules'){
    requestAnimationFrame(()=>activate());
  }
})();
