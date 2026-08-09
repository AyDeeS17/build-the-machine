(()=>{
function boot(){
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 const nav=$('.app-nav'); if(!nav)return setTimeout(boot,300);
 const style=document.createElement('style');style.textContent=`
 .app-nav{display:flex!important;flex-wrap:wrap;gap:7px;margin:22px 0;padding:5px;width:max-content;max-width:100%;background:#0c171f;border:1px solid #294656;border-radius:8px}
 .app-nav button{cursor:pointer;color:#8195a3;background:#0b151c;border:1px solid #294656;border-radius:5px;padding:10px 13px;font:10px 'JetBrains Mono';font-weight:700}
 .app-nav button.active{background:#173247;border-color:#66b9df;color:#e4f5fc}
 #training-view .day{margin:30px 0 38px!important;border:1px solid #31566b!important;border-radius:10px!important;overflow:hidden!important;background:#0c171f!important;box-shadow:0 8px 24px rgba(0,0,0,.18)}
 #training-view .day-head{padding:19px 20px!important;min-height:60px!important;background:linear-gradient(90deg,#173247,#10232d)!important;border-bottom:1px solid #3d6f8c!important}
 #training-view .day-head strong{font-size:15px!important;color:#e8f0f4!important;letter-spacing:.05em}
 #training-view .day-head span{font-size:10px!important;color:#66b9df!important}
 #training-view .exercise{padding:19px 20px!important;min-height:125px!important}
 #training-view .name{font-size:22px!important}
 #btm-reset-week{margin-top:12px}
 @media(max-width:600px){.app-nav{width:100%;display:grid!important;grid-template-columns:1fr 1fr}.app-nav button{width:100%}}
 `;document.head.appendChild(style);
 const labels=[['nav-training','TRAINING'],['nav-food','FOOD / NUTRITION'],['nav-running','RUNNING'],['nav-sleep','SLEEP'],['nav-progress','OVERALL PROGRESS']];
 labels.forEach(([id,label])=>{let b=document.getElementById(id);if(!b){b=document.createElement('button');b.id=id;nav.appendChild(b)}b.textContent=label});
 // Remove any accidental legacy/back controls from the main navigation.
 nav.querySelectorAll('button,a').forEach(el=>{const t=(el.textContent||'').toLowerCase();if(t.includes('old version')||t.includes('go back'))el.remove()});
 const views={training:$('#training-view'),food:$('#food-view'),running:$('#running-view'),sleep:$('#sleep-view'),progress:$('#progress-view')};
 function show(name){Object.values(views).forEach(v=>{if(v)v.classList.remove('active')});Object.entries(views).forEach(([k,v])=>{if(v)v.style.display=k===name?'block':'none'});labels.forEach(([id])=>{const b=document.getElementById(id);if(b)b.classList.toggle('active',id==='nav-'+name)});window.scrollTo({top:0,behavior:'smooth'})}
 labels.forEach(([id])=>{const b=document.getElementById(id);b.onclick=e=>{e.preventDefault();const n=id.replace('nav-','');show(n);if(n==='running'&&typeof window.renderRunning==='function')window.renderRunning();if(n==='sleep'&&typeof window.renderSleep==='function')window.renderSleep();if(n==='progress'&&typeof window.renderOverall==='function')window.renderOverall()}});
 show('training');
 // Week erase button, placed under the existing week selector.
 const selector=$('#training-view .week-selector-shell')||$('#training-view .panel');
 if(selector&&!document.getElementById('btm-reset-week')){
  const row=document.createElement('div');row.id='btm-reset-week';row.style.cssText='display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 0 0;border-top:1px solid #294656;margin-top:14px';
  row.innerHTML='<span style="color:#8195a3;font:11px JetBrains Mono">Want to start this week over?</span><button id="btm-erase" style="cursor:pointer;background:#351c1c;color:#ffdede;border:1px solid #8c4b4b;border-radius:5px;padding:9px 12px;font:10px JetBrains Mono;font-weight:700">ERASE SELECTED WEEK</button>';
  selector.appendChild(row);
  $('#btm-erase').onclick=()=>{
   const active=$('#weekGrid .week.active');const m=active&&active.textContent.match(/WEEK\s+(\d+)/i);const w=m?+m[1]:1;
   if(!confirm('Erase ALL training progression for Week '+w+'? This cannot be undone.'))return;
   let st={};try{st=JSON.parse(localStorage.getItem('btm_progress')||'{}')}catch(e){}
   Object.keys(st).forEach(k=>{if(k.startsWith(w+'|'))delete st[k]});localStorage.setItem('btm_progress',JSON.stringify(st));location.reload();
  };
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();