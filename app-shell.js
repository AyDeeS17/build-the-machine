/* Build The Machine, unified section shell. Keeps the existing training engine and local data intact. */
(()=>{
  const START=new Date('2026-08-10T00:00:00');
  const PHASES=['The Beginning','Steady Steps','Building Strength','Breaking Limits','True Resilience','Pride & Power','Recover & Reset','Back To Work','Embrace The Pain','Discipline & Control','Ascension','The Machine'];
  const CHARS=['Goku','Tanjiro Kamado','Yuji Itadori','Eren Yeager','Thorfinn','Vegeta','Gojo Satoru','Toji Fushiguro','Ken Kaneki','Itachi Uchiha','Griffith','Guts'];
  const FOOD_TARGETS=[{carb:300,fat:70},{carb:300,fat:70},{carb:310,fat:70},{carb:310,fat:70},{carb:320,fat:72},{carb:320,fat:72},{carb:270,fat:68},{carb:320,fat:72},{carb:330,fat:72},{carb:330,fat:73},{carb:340,fat:74},{carb:340,fat:75}];
  const $=id=>document.getElementById(id);
  const iso=d=>d.toISOString().slice(0,10);
  const dateFor=(w,d)=>{const x=new Date(START);x.setDate(x.getDate()+(w-1)*7+d);return x};
  const fmt=d=>d.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
  const read=(key,fallback={})=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
  const write=(key,value)=>localStorage.setItem(key,JSON.stringify(value));

  function boot(){
    const nav=document.querySelector('.btm-nav');
    const training=$('trainingView');
    if(!nav||!training)return;
    injectViews();
    bindNavigation(nav);
    migrateData();
    enhanceTraining();
    show('training',false);
  }

  function injectViews(){
    if(!$('btm-food-view')){
      const v=document.createElement('section');v.id='btm-food-view';v.className='btm-section btm-food-view';v.innerHTML=`
        <div class="btm-hero"><div><div class="ey">12-WEEK NUTRITION SYSTEM</div><h2>FUEL THE MACHINE</h2><p class="note">August 10, 2026 through November 1, 2026. Every one of the 84 days is tracked independently.</p></div><div class="btm-hero-stat" id="foodOverall">0%</div></div>
        <div class="panel"><div class="ey">NUTRITION TIMELINE</div><h2>SELECT A WEEK</h2><div id="foodWeeks" class="btm-week-grid"></div><div id="foodDays" class="btm-day-grid"></div></div>
        <div class="panel"><div class="ey">WEEKLY TARGET</div><h2 id="foodWeekTitle">WEEK 1</h2><div id="foodTargets" class="btm-target-grid"></div></div>
        <div class="panel"><div class="ey">WEEKLY SUMMARY</div><div id="foodSummary" class="btm-kpi-grid"></div></div>
        <div class="panel"><div class="ey">DAILY INTAKE</div><h2 id="foodTitle">MONDAY, AUGUST 10, 2026</h2><div id="foodMacros" class="btm-input-grid"></div><div class="btm-input-grid btm-water-row"><label>WATER, LITERS<input id="btmFoodWater" type="number" min="0" step="0.1"></label></div><div class="btm-text-grid"><label>MEALS<textarea id="btmFoodMeals"></textarea></label><label>FOOD CONSUMED<textarea id="btmFoodItems"></textarea></label></div><label class="btm-check"><input id="btmFoodComplete" type="checkbox"><span>MARK THIS DAY COMPLETE</span></label><button class="save" id="btmFoodSave">SAVE DAY</button><span class="note" id="btmFoodSaved"></span></div>
        <div class="panel"><div class="ey">BODY & GAIN TRACKING</div><h2>WEEKLY CHECK-IN</h2><div class="btm-input-grid"><label>BODY WEIGHT, KG<input id="btmBodyWeight" type="number" step="0.1"></label><label>WAIST, CM<input id="btmBodyWaist" type="number" step="0.1"></label><label>PROGRESS NOTE<input id="btmBodyNote"></label></div><button class="save" id="btmBodySave">SAVE WEEKLY CHECK-IN</button></div>
        <div class="panel"><div class="ey">12-WEEK COMPLETION</div><h2>NUTRITION PROGRESS</h2><canvas id="foodChart" class="btm-chart"></canvas></div>`;
      document.querySelector('main.wrap').appendChild(v);
    }
    if(!$('btm-running-view')){
      const v=document.createElement('section');v.id='btm-running-view';v.className='btm-section btm-running-view';v.innerHTML=`
        <div class="btm-hero"><div><div class="ey">RUNNING SYSTEM</div><h2>RUN THE MACHINE</h2><p class="note">Three sessions per week. Week 1 starts at 5.00 km per run, with a 10% planned progression each week.</p></div><div class="btm-hero-stat" id="runTarget">5.00 KM</div></div>
        <div class="panel"><div class="ey">12-WEEK RUNNING PROGRESSION</div><h2>SELECT A WEEK</h2><div id="runWeeks" class="btm-week-grid"></div><div id="runDays" class="btm-day-grid"></div></div>
        <div class="panel"><div class="ey">THIS WEEK</div><h2 id="runTitle">RUN</h2><div id="runFields" class="btm-input-grid"></div><div class="btm-check-row"><label class="btm-check"><input id="runDone" type="checkbox"><span>SESSION COMPLETE</span></label><button class="save" id="runSave">SAVE RUN</button></div></div>
        <div class="panel"><div class="ey">WEEKLY TOTALS</div><div id="runKpis" class="btm-kpi-grid"></div><canvas id="runChart" class="btm-chart"></canvas></div>`;
      document.querySelector('main.wrap').appendChild(v);
    }
    if(!$('btm-sleep-view')){
      const v=document.createElement('section');v.id='btm-sleep-view';v.className='btm-section btm-sleep-view';v.innerHTML=`
        <div class="btm-hero"><div><div class="ey">SLEEP SYSTEM</div><h2>RECOVER THE MACHINE</h2><p class="note">Target schedule: 23:00 bedtime and 07:30 wake time, 8h 30m total.</p></div><div class="btm-hero-stat">23:00 → 07:30</div></div>
        <div class="panel"><div class="ey">12-WEEK SLEEP PROGRESSION</div><h2>SELECT A WEEK</h2><div id="sleepWeeks" class="btm-week-grid"></div><div id="sleepDays" class="btm-day-grid"></div></div>
        <div class="panel"><div class="ey">DAILY SLEEP</div><h2 id="sleepTitle">SLEEP</h2><div class="btm-input-grid"><label>BEDTIME<input id="sleepBed" type="time" value="23:00"></label><label>WAKE TIME<input id="sleepWake" type="time" value="07:30"></label><label>SLEEP QUALITY, 1–10<input id="sleepQuality" type="number" min="1" max="10"></label><div class="btm-kpi"><b id="sleepScore">0%</b><span>SLEEP SCORE</span></div></div><p class="note" id="sleepDuration"></p><button class="save" id="sleepSave">SAVE SLEEP</button></div>
        <div class="panel"><div class="ey">12-WEEK TREND</div><h2>SLEEP CONSISTENCY</h2><canvas id="sleepChart" class="btm-chart"></canvas><div id="sleepKpis" class="btm-kpi-grid"></div></div>`;
      document.querySelector('main.wrap').appendChild(v);
    }
    if(!$('btm-progress-view')){
      const v=document.createElement('section');v.id='btm-progress-view';v.className='btm-section btm-progress-view';v.innerHTML=`
        <div class="panel"><div class="ey">THE 12-WEEK JOURNEY</div><h2>OVERALL PROGRESS</h2><div class="btm-percent" id="overallPercent">0%</div><div class="btm-progress-bar"><i id="overallBar"></i></div><p class="note">Only completed or logged work counts. Opening a section never counts as progress.</p></div>
        <div id="overallKpis" class="btm-kpi-grid"></div>
        <div class="panel"><div class="ey">WEEK BY WEEK</div><h2>PROGRESSION BREAKDOWN</h2><div id="overallTable"></div></div>
        <div class="panel"><div class="ey">OVERALL TREND</div><canvas id="overallChart" class="btm-chart"></canvas></div>`;
      document.querySelector('main.wrap').appendChild(v);
    }
    if(!$('btm-rules-view')){
      const v=document.createElement('section');v.id='btm-rules-view';v.className='btm-section btm-rules-view';v.innerHTML=`
        <div class="btm-rules-stage"><div class="ey">THE CODE OF THE MACHINE</div><h2>RULES</h2><p class="note">Authority, discipline, accountability. These rules define how the twelve weeks are executed.</p><div class="btm-rules-grid">
          <article><b>EFFORT</b><span>Train with intent. Most working sets finish with 1–3 clean reps in reserve.</span></article>
          <article><b>CLEAN REPS</b><span>Technique comes first. If form breaks down, the set is no longer quality work.</span></article>
          <article><b>PROGRESSION</b><span>Follow the planned progression. Add reps first, then make the exercise harder when the top range is clean.</span></article>
          <article><b>REST</b><span>Big movements get 2–3 minutes. Accessories and core get 60–120 seconds.</span></article>
          <article><b>RUNNING</b><span>Keep runs controlled. Running progression is separate from muscle-building progression.</span></article>
          <article><b>PAIN</b><span>Normal effort is expected. Sharp or worsening pain is not.</span></article>
          <article><b>RECOVERY</b><span>Sleep, food, hydration and rest days are part of the machine.</span></article>
        </div><label class="btm-check"><input id="rulesCommit" type="checkbox"><span>I COMMIT TO THE RULES</span></label></div>`;
      document.querySelector('main.wrap').appendChild(v);
    }
  }

  function bindNavigation(nav){
    const map={trainingBtn:'training',runningBtn:'running',foodBtn:'food',sleepBtn:'sleep',progressBtn:'progress',rulesBtn:'rules'};
    Object.entries(map).forEach(([id,name])=>{const b=$(id);if(!b)return;b.dataset.section=name;b.setAttribute('type','button');b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();show(name,true)},true)});
    const saved=localStorage.getItem('btm_active_section');
    if(saved&&mapValues().includes(saved))show(saved,false);else show('training',false);
    const cb=$('rulesCommit');if(cb){cb.checked=localStorage.getItem('btm_rules_commit')==='1';cb.addEventListener('change',()=>write('btm_rules_commit',cb.checked?'1':'0'))}
  }
  const mapValues=()=>['training','running','food','sleep','progress','rules'];

  function show(name,scroll){
    const views={training:$('trainingView'),food:$('btm-food-view'),running:$('btm-running-view'),sleep:$('btm-sleep-view'),progress:$('btm-progress-view'),rules:$('btm-rules-view')};
    Object.entries(views).forEach(([k,v])=>{if(v)v.classList.toggle('active',k===name)});
    document.querySelectorAll('.btm-nav .btn').forEach(b=>b.classList.toggle('active',b.dataset.section===name));
    document.body.dataset.section=name;
    localStorage.setItem('btm_active_section',name);
    if(name==='food')renderFood();
    if(name==='running')renderRunning();
    if(name==='sleep')renderSleep();
    if(name==='progress')renderOverall();
    if(name==='rules'){const cb=$('rulesCommit');if(cb)cb.checked=localStorage.getItem('btm_rules_commit')==='1'}
    if(scroll)window.scrollTo({top:0,behavior:'smooth'});
  }

  function migrateData(){
    const food={};
    const old84=read('btm_nutrition_84',{}),oldV2=read('btm_nutrition_v2',{}),build=read('build_machine_food_v2',{});
    Object.entries(build).forEach(([d,v])=>food[d]={cal:v.cal||0,pro:v.pro||0,carb:v.carb||0,fat:v.fat||0,water:v.water||0,meals:v.meals||'',items:v.items||'',complete:!!v.complete});
    Object.entries(oldV2).forEach(([d,v])=>food[d]={...(food[d]||{}),cal:v.cal||food[d]?.cal||0,pro:v.pro||food[d]?.pro||0,carb:v.carb||food[d]?.carb||0,fat:v.fat||food[d]?.fat||0,water:v.water||food[d]?.water||0,meals:v.meals||food[d]?.meals||'',items:v.items||food[d]?.items||'',complete:v.complete??food[d]?.complete||false});
    Object.entries(old84).forEach(([d,v])=>food[d]={...(food[d]||{}),cal:v.cal||food[d]?.cal||0,pro:v.protein||food[d]?.pro||0,carb:v.carbs||food[d]?.carb||0,fat:v.fats||food[d]?.fat||0,water:v.water||food[d]?.water||0,meals:v.meals||food[d]?.meals||'',items:v.items||food[d]?.items||'',complete:v.complete==='yes'||food[d]?.complete||false});
    write('btm_nutrition_unified',food);
    const run={...read('btm_running',{})};const legacy=read('btm_runs_v2',{});Object.entries(legacy).forEach(([d,v])=>{const dt=new Date(d+'T00:00:00');const days=Math.round((dt-START)/86400000);if(days<0||days>=84)return;const w=Math.floor(days/7)+1,i=days%7;const key='w'+w+'s'+i;if(!run[key])run[key]={};run[key]={...run[key],distance:v.distance||'',pace:v.pace||'',effort:v.effort||'',notes:v.notes||'',done:!!(v.done||v.distance)} });write('btm_running',run);
  }

  let foodWeek=1,foodDay=0,runWeek=1,runDay=0,sleepWeek=1,sleepDay=0;
  const foodData=()=>read('btm_nutrition_unified',{}),runData=()=>read('btm_running',{}),sleepData=()=>read('btm_sleep_v2',{});
  const fkey=(w,d)=>iso(dateFor(w,d));const rkey=(w,d)=>'w'+w+'s'+d;
  const ensureFood=(w,d)=>{const data=foodData(),k=fkey(w,d);if(!data[k])data[k]={cal:0,pro:0,carb:0,fat:0,water:0,meals:'',items:'',complete:false};write('btm_nutrition_unified',data);return data[k]};
  const ensureRun=(w,d)=>{const data=runData(),k=rkey(w,d);if(!data[k])data[k]={distance:'',pace:'',effort:'',notes:'',done:false};write('btm_running',data);return data[k]};
  const ensureSleep=(w,d)=>{const data=sleepData(),k=fkey(w,d);if(!data[k])data[k]={bed:'23:00',wake:'07:30',quality:''};write('btm_sleep_v2',data);return data[k]};

  function renderFood(){
    const data=foodData();
    $('foodWeeks').innerHTML='';for(let w=1;w<=12;w++){const b=document.createElement('button');b.className='week'+(w===foodWeek?' active':'');b.innerHTML='<b>WEEK '+w+'</b><span>'+PHASES[w-1]+'</span><small>'+(w===7?'DELOAD · ':'')+FOOD_TARGETS[w-1].carb+'g carbs · '+FOOD_TARGETS[w-1].fat+'g fat</small>';b.onclick=()=>{foodWeek=w;foodDay=0;renderFood()};$('foodWeeks').appendChild(b)}
    $('foodDays').innerHTML='';for(let d=0;d<7;d++){const k=fkey(foodWeek,d),v=data[k]||{},b=document.createElement('button');b.className='day'+(d===foodDay?' active':'')+(v.complete?' complete':'');b.innerHTML='<b>'+dateFor(foodWeek,d).toLocaleDateString('en-US',{weekday:'short'}).toUpperCase()+'</b><small>'+dateFor(foodWeek,d).toLocaleDateString('en-US',{month:'short',day:'numeric'})+'</small><small>'+(v.complete?'✓ COMPLETE':v.cal||v.pro||v.carb||v.fat?'LOGGED':'EMPTY')+'</small>';b.onclick=()=>{foodDay=d;renderFood()};$('foodDays').appendChild(b)}
    const v=ensureFood(foodWeek,foodDay);$('foodTitle').textContent=fmt(dateFor(foodWeek,foodDay)).toUpperCase();$('foodWeekTitle').textContent='WEEK '+foodWeek+' · '+PHASES[foodWeek-1];$('foodTargets').innerHTML=[['CALORIES','1800–2000 kcal'],['PROTEIN','130–160 g'],['CARBOHYDRATES',FOOD_TARGETS[foodWeek-1].carb+' g'],['FATS',FOOD_TARGETS[foodWeek-1].fat+' g']].map(x=>'<div class="btm-target"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('');
    $('foodMacros').innerHTML=[['Calories','cal','kcal'],['Protein','pro','g'],['Carbohydrates','carb','g'],['Fats','fat','g']].map(([label,key,u])=>'<label>'+label+'<input data-food-key="'+key+'" type="number" min="0" step="0.1" value="'+(v[key]||'')+'"><span class="btm-meter"><i style="width:'+macroPct(key,v[key]||0,foodWeek)+'%"></i></span></label>').join('');
    $('btmFoodWater').value=v.water||'';$('btmFoodMeals').value=v.meals||'';$('btmFoodItems').value=v.items||'';$('btmFoodComplete').checked=!!v.complete;
    $('foodSummary').innerHTML=foodSummary(foodWeek);$('foodOverall').textContent=foodOverall()+'%';draw('foodChart',foodTrend(),v=>Math.round(v)+'%');renderBody();
    $('foodMacros').querySelectorAll('[data-food-key]').forEach(inp=>inp.addEventListener('input',()=>{const x=ensureFood(foodWeek,foodDay);x[inp.dataset.foodKey]=+inp.value||0;const all=foodData();all[fkey(foodWeek,foodDay)]=x;write('btm_nutrition_unified',all);renderFood()}));
    $('btmFoodSave').onclick=()=>{const x=ensureFood(foodWeek,foodDay);x.water=+$('btmFoodWater').value||0;x.meals=$('btmFoodMeals').value;x.items=$('btmFoodItems').value;x.complete=$('btmFoodComplete').checked;const all=foodData();all[fkey(foodWeek,foodDay)]=x;write('btm_nutrition_unified',all);$('btmFoodSaved').textContent=' Saved';renderFood()};
  }
  function macroPct(k,v,w){const t=k==='cal'?2000:k==='pro'?160:k==='carb'?FOOD_TARGETS[w-1].carb:FOOD_TARGETS[w-1].fat;return Math.min(100,Math.round((+v||0)/t*100))}
  function foodSummary(w){const rows=[];for(let d=0;d<7;d++){const v=foodData()[fkey(w,d)];if(v&&(v.complete||v.cal||v.pro||v.carb||v.fat||v.water||v.meals||v.items))rows.push(v)}const avg=k=>rows.length?Math.round(rows.reduce((s,v)=>s+(+v[k]||0),0)/rows.length):0,done=rows.filter(v=>v.complete).length;return [['Average calories',avg('cal')+' kcal'],['Average protein',avg('pro')+' g'],['Average carbs',avg('carb')+' g'],['Average fat',avg('fat')+' g'],['Days completed',done+'/7'],['Adherence',Math.round(done/7*100)+'%']].map(x=>'<div class="btm-kpi"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('')}
  function foodOverall(){let n=0;for(let w=1;w<=12;w++)for(let d=0;d<7;d++)if(ensureFood(w,d).complete)n++;return Math.round(n/84*100)}
  function foodTrend(){const a=[];for(let w=1;w<=12;w++){const rows=[];for(let d=0;d<7;d++){const v=ensureFood(w,d);if(v.complete||v.cal||v.pro||v.carb||v.fat)rows.push(v)}a.push(rows.length?Math.round(rows.filter(v=>v.complete).length/7*100):0)}return a}
  function renderBody(){const b=read('btm_body_tracking',{})[foodWeek]||{};$('btmBodyWeight').value=b.weight||'';$('btmBodyWaist').value=b.waist||'';$('btmBodyNote').value=b.note||'';$('btmBodySave').onclick=()=>{const all=read('btm_body_tracking',{});all[foodWeek]={weight:$('btmBodyWeight').value,waist:$('btmBodyWaist').value,note:$('btmBodyNote').value};write('btm_body_tracking',all);renderBody()}}

  function renderRunning(){
    const data=runData(),x=5*Math.pow(1.1,runWeek-1);$('runTarget').textContent=x.toFixed(2)+' KM';$('runWeeks').innerHTML='';for(let w=1;w<=12;w++){const b=document.createElement('button');b.className='week'+(w===runWeek?' active':'');let done=0;for(let d=0;d<7;d++)if(data[rkey(w,d)]?.done)done++;b.innerHTML='<b>WEEK '+w+'</b><span>'+PHASES[w-1]+'</span><small>'+ (5*Math.pow(1.1,w-1)).toFixed(2)+' KM / RUN · '+done+'/3 DONE'+(w===7?' · DELOAD':'')+'</small>';b.onclick=()=>{runWeek=w;runDay=0;renderRunning()};$('runWeeks').appendChild(b)}
    $('runDays').innerHTML='';for(let d=0;d<7;d++){const v=data[rkey(runWeek,d)]||{},b=document.createElement('button');b.className='day'+(d===runDay?' active':'')+(v.distance?' complete':'');b.innerHTML='<b>'+dateFor(runWeek,d).toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)+'</b><small>'+dateFor(runWeek,d).getDate()+'</small><small>'+(v.distance?v.distance+' km':'EMPTY')+'</small>';b.onclick=()=>{runDay=d;renderRunning()};$('runDays').appendChild(b)}
    const v=ensureRun(runWeek,runDay);$('runTitle').textContent=fmt(dateFor(runWeek,runDay)).toUpperCase();$('runFields').innerHTML='<label>DISTANCE, KM<input id="runDistance" type="number" step="0.01" value="'+(v.distance||'')+'"></label><label>AVERAGE PACE, MIN/KM<input id="runPace" value="'+(v.pace||'')+'" placeholder="7:30"></label><label>EFFORT, 1–10<input id="runEffort" type="number" min="1" max="10" value="'+(v.effort||'')+'"></label><label>NOTES<input id="runNotes" value="'+(v.notes||'')+'"></label>';$('runDone').checked=!!v.done;$('runKpis').innerHTML=runKpis(runWeek);draw('runChart',runTrend(),v=>v.toFixed(1));$('runSave').onclick=()=>{const x=ensureRun(runWeek,runDay);x.distance=$('runDistance').value;x.pace=$('runPace').value;x.effort=$('runEffort').value;x.notes=$('runNotes').value;x.done=$('runDone').checked;const all=runData();all[rkey(runWeek,runDay)]=x;write('btm_running',all);renderRunning()};
  }
  function paceSeconds(v){if(!v)return null;const m=String(v).match(/^(\d+):([0-5]\d)$/);return m?Number(m[1])*60+Number(m[2]):Number(v)*60}
  function runKpis(w){const data=runData(),rows=[];for(let d=0;d<7;d++)if(data[rkey(w,d)])rows.push(data[rkey(w,d)]);const km=rows.reduce((s,v)=>s+(parseFloat(v.distance)||0),0),done=rows.filter(v=>v.done).length,p=rows.map(v=>paceSeconds(v.pace)).filter(Boolean),avg=p.length?Math.round(p.reduce((a,b)=>a+b,0)/p.length):0;return [['Planned KM',(5*Math.pow(1.1,w-1)*3).toFixed(2)],['Actual KM',km.toFixed(2)],['Sessions',done+'/3'],['Avg pace',avg?Math.floor(avg/60)+':'+String(avg%60).padStart(2,'0'):'--']].map(x=>'<div class="btm-kpi"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('')}
  function runTrend(){const data=runData(),a=[];for(let w=1;w<=12;w++){let km=0;for(let d=0;d<7;d++)km+=parseFloat(data[rkey(w,d)]?.distance)||0;a.push(km)}return a}

  function sleepDuration(v){if(!v.bed||!v.wake)return 0;const t=s=>{const a=String(s).split(':');return (+a[0]||0)*60+(+a[1]||0)};let n=t(v.wake)-t(v.bed);if(n<=0)n+=1440;return n}
  function sleepScore(v){const dur=sleepDuration(v);if(!dur)return 0;const t=s=>{const a=String(s).split(':');return (+a[0]||0)*60+(+a[1]||0)},bed=t(v.bed),wake=t(v.wake),bedTarget=1380,wakeTarget=450;let bd=Math.abs(bed-bedTarget);if(bed<720)bd=Math.abs(bed+1440-bedTarget);const wd=Math.abs(wake-wakeTarget),duration=Math.max(0,Math.min(100,100-Math.abs(dur-510)*.45)),schedule=Math.max(0,100-(bd*.12+wd*.12)),quality=v.quality?Math.max(0,Math.min(100,+v.quality*10)):100;return Math.round(duration*.45+schedule*.4+quality*.15)}
  function renderSleep(){const data=sleepData();$('sleepWeeks').innerHTML='';for(let w=1;w<=12;w++){const b=document.createElement('button');b.className='week'+(w===sleepWeek?' active':'');b.innerHTML='<b>WEEK '+w+'</b><span>'+PHASES[w-1]+'</span><small>'+Math.round(sleepWeekScore(w))+'% AVG</small>';b.onclick=()=>{sleepWeek=w;sleepDay=0;renderSleep()};$('sleepWeeks').appendChild(b)}$('sleepDays').innerHTML='';for(let d=0;d<7;d++){const v=data[fkey(sleepWeek,d)]||{},b=document.createElement('button');b.className='day'+(d===sleepDay?' active':'')+(v.bed?' complete':'');b.innerHTML='<b>'+dateFor(sleepWeek,d).toLocaleDateString('en-US',{weekday:'short'}).slice(0,2)+'</b><small>'+dateFor(sleepWeek,d).getDate()+'</small><small>'+(v.bed?sleepScore(v)+'%':'EMPTY')+'</small>';b.onclick=()=>{sleepDay=d;renderSleep()};$('sleepDays').appendChild(b)}const v=ensureSleep(sleepWeek,sleepDay);$('sleepTitle').textContent=fmt(dateFor(sleepWeek,sleepDay)).toUpperCase();$('sleepBed').value=v.bed||'23:00';$('sleepWake').value=v.wake||'07:30';$('sleepQuality').value=v.quality||'';const dur=sleepDuration(v),score=sleepScore(v);$('sleepScore').textContent=score+'%';$('sleepDuration').textContent=dur?Math.floor(dur/60)+'h '+dur%60+'m sleep · '+(score>=90?'Excellent':score>=75?'Good':score>=55?'Moderate':'Poor'):'Enter bedtime and wake time';$('sleepKpis').innerHTML=sleepKpis();draw('sleepChart',Array.from({length:12},(_,i)=>sleepWeekScore(i+1)),v=>Math.round(v)+'%');$('sleepSave').onclick=()=>{const x=ensureSleep(sleepWeek,sleepDay);x.bed=$('sleepBed').value;x.wake=$('sleepWake').value;x.quality=$('sleepQuality').value;const all=sleepData();all[fkey(sleepWeek,sleepDay)]=x;write('btm_sleep_v2',all);renderSleep()}}
  function sleepWeekScore(w){const a=[];for(let d=0;d<7;d++){const v=sleepData()[fkey(w,d)];if(v?.bed&&v?.wake)a.push(sleepScore(v))}return a.length?a.reduce((x,y)=>x+y,0)/a.length:0}
  function sleepKpis(){const data=sleepData(),dur=[],scores=[],beds=[],wakes=[];for(let w=1;w<=12;w++)for(let d=0;d<7;d++){const v=data[fkey(w,d)];if(v?.bed&&v?.wake){dur.push(sleepDuration(v));scores.push(sleepScore(v));const t=s=>{const a=String(s).split(':');return (+a[0]||0)*60+(+a[1]||0)};beds.push(t(v.bed));wakes.push(t(v.wake))}}const avg=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):0,clock=m=>String(Math.floor((m%1440)/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');return [['Avg sleep',Math.floor(avg(dur)/60)+'h '+avg(dur)%60+'m'],['Avg score',avg(scores)+'%'],['Avg bedtime',beds.length?clock(avg(beds)):'--'],['Avg wake',wakes.length?clock(avg(wakes)):'--']].map(x=>'<div class="btm-kpi"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('')}

  function trainingMetrics(w){const raw=read('btm_progress',{}),m={done:0,total:0};Object.entries(raw).forEach(([k,v])=>{if(k.startsWith(w+'|')){m.total++;if(v.done)m.done++}});return m}
  function runWeekScore(w){let n=0;const d=runData();for(let i=0;i<7;i++)if(d[rkey(w,i)]?.distance)n++;return Math.round(Math.min(1,n/3)*100)}
  function nutritionWeekScore(w){let s=0,n=0;for(let d=0;d<7;d++){const v=foodData()[fkey(w,d)];if(!v||!(v.cal||v.pro||v.carb||v.fat))continue;const t=FOOD_TARGETS[w-1];const cal=+v.cal>=1800&&+v.cal<=2000?1:Math.min(1,(+v.cal||0)/1800),pro=Math.min(1,(+v.pro||0)/130),carb=Math.min(1,(+v.carb||0)/t.carb),fat=Math.min(1,(+v.fat||0)/t.fat);s+=(cal+pro+carb+fat)/4*100;n++}return n?Math.round(s/n):0}
  function overallWeek(w){const t=trainingMetrics(w),training=t.total?Math.round(t.done/t.total*100):0;return Math.round(training*.35+runWeekScore(w)*.2+nutritionWeekScore(w)*.25+sleepWeekScore(w)*.2)}
  function renderOverall(){const vals=Array.from({length:12},(_,i)=>overallWeek(i+1)),overall=Math.round(vals.reduce((a,b)=>a+b,0)/12);$('overallPercent').textContent=overall+'%';$('overallBar').style.width=overall+'%';let workouts=0,runs=0,km=0,nut=0,sleep=0;for(let w=1;w<=12;w++){workouts+=trainingMetrics(w).done;for(let d=0;d<7;d++){const r=runData()[rkey(w,d)];if(r?.distance){runs++;km+=+r.distance}const f=foodData()[fkey(w,d)];if(f&&(f.cal||f.pro||f.carb||f.fat))nut++;const s=sleepData()[fkey(w,d)];if(s?.bed&&s?.wake)sleep++}}$('overallKpis').innerHTML=[['Program completion',overall+'%'],['Workouts completed',workouts],['Running sessions',runs],['Running KM',km.toFixed(1)],['Nutrition days',nut],['Sleep days',sleep]].map(x=>'<div class="btm-kpi"><b>'+x[1]+'</b><span>'+x[0]+'</span></div>').join('');let html='<table class="btm-table"><tr><th>WEEK</th><th>TRAINING</th><th>RUNNING</th><th>NUTRITION</th><th>SLEEP</th><th>OVERALL</th></tr>';for(let w=1;w<=12;w++){const t=trainingMetrics(w);html+='<tr><td>W'+w+'</td><td>'+(t.total?Math.round(t.done/t.total*100):0)+'%</td><td>'+runWeekScore(w)+'%</td><td>'+nutritionWeekScore(w)+'%</td><td>'+Math.round(sleepWeekScore(w))+'%</td><td><b>'+vals[w-1]+'%</b></td></tr>'}html+='</table>';$('overallTable').innerHTML=html;draw('overallChart',vals,v=>Math.round(v)+'%')}

  function enhanceTraining(){
    const grid=$('weekGrid');if(!grid||$('btm-character-card'))return;
    const card=document.createElement('section');card.id='btm-character-card';card.className='panel btm-character-card';card.innerHTML='<div><div class="ey">ANIME PROGRESSION</div><h2 id="charName">THE BEGINNING</h2><p class="note" id="charMeta">WEEK 1 · REVEAL 8%</p></div><div class="btm-silhouette-wrap"><div class="btm-silhouette"><i></i><b></b><em></em></div><span id="charReveal"></span></div>';
    grid.parentElement.parentElement.insertBefore(card,grid.parentElement.nextSibling);
    const update=()=>{const buttons=[...grid.querySelectorAll('.week')],idx=Math.max(0,buttons.findIndex(b=>b.classList.contains('active'))),w=idx+1;card.style.setProperty('--week-accent',`hsl(${195+(w-1)*12} 62% 64%)`);$('charName').textContent=CHARS[idx]||PHASES[idx];$('charMeta').textContent='WEEK '+w+' · '+PHASES[idx]+' · REVEAL '+Math.round(w/12*100)+'%';$('charReveal').style.width=Math.round(w/12*100)+'%'};
    new MutationObserver(update).observe(grid,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});update();
  }

  function draw(id,vals,label){const c=$(id);if(!c)return;const ctx=c.getContext('2d'),w=c.clientWidth||800,h=250,d=window.devicePixelRatio||1;c.width=w*d;c.height=h*d;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);const valid=vals.filter(v=>v!=null),min=valid.length?Math.min(...valid):0,max0=valid.length?Math.max(...valid):1,max=max0===min?min+1:max0,L=42,R=15,T=18,B=32,pw=w-L-R,ph=h-T-B;ctx.strokeStyle='#294656';for(let i=0;i<4;i++){const y=T+ph*i/3;ctx.beginPath();ctx.moveTo(L,y);ctx.lineTo(w-R,y);ctx.stroke()}ctx.fillStyle='#8195a3';ctx.font='9px JetBrains Mono';for(let i=0;i<vals.length;i++){const x=L+i*pw/Math.max(1,vals.length-1);ctx.fillText('W'+(i+1),x-7,h-10)}ctx.strokeStyle='#66b9df';ctx.lineWidth=2;let started=false;vals.forEach((v,i)=>{if(v==null)return;const x=L+i*pw/Math.max(1,vals.length-1),y=T+ph-(v-min)/(max-min)*ph;if(!started){ctx.beginPath();ctx.moveTo(x,y);started=true}else ctx.lineTo(x,y)});if(started)ctx.stroke();ctx.fillStyle='#66b9df';vals.forEach((v,i)=>{if(v==null)return;const x=L+i*pw/Math.max(1,vals.length-1),y=T+ph-(v-min)/(max-min)*ph;ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();if(label){ctx.font='9px JetBrains Mono';ctx.fillText(label(v),x-10,y-8)}})}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
