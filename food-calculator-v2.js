/* Build The Machine, Smart Food Calculator v3.
   Natural-language food entry, Open Food Facts lookup, compound meals,
   custom-food fallback, daily macro totals and existing tracker sync. */
(()=>{
'use strict';
if(window.__BTM_FOOD_V3__)return;
window.__BTM_FOOD_V3__=1;

const KEY='btm_food_log_v2', CUSTOM='btm_custom_foods_v1';
const $=s=>document.querySelector(s);
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const num=v=>Math.max(0,parseFloat(v)||0);
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

/* Common reference foods. Values are per 100g unless a piece/slice weight is supplied. */
const F={
 egg:['Egg',143,12.6,.7,9.5,'piece',50],
 eggs:['Egg',143,12.6,.7,9.5,'piece',50],
 yogurt:['Plain yogurt',61,3.5,4.7,3.3,'g',100],
 'greek yogurt':['Greek yogurt, plain',59,10.2,3.6,.4,'g',100],
 'chicken breast':['Chicken breast, cooked',165,31,0,3.6,'g',100],
 chicken:['Chicken breast, cooked',165,31,0,3.6,'g',100],
 rice:['Rice, white, cooked',130,2.7,28.2,.3,'g',100],
 turkey:['Turkey breast',104,17,4,2,'g',100],
 'turkey ham':['Turkey ham',104,17,4,2,'g',100],
 cheese:['Cheddar cheese',403,25,1.3,33.1,'g',100],
 cheddar:['Cheddar cheese',403,25,1.3,33.1,'g',100],
 bread:['White bread',266,8.9,49.4,3.3,'slice',25],
 banana:['Banana',89,1.1,22.8,.3,'piece',118],
 apple:['Apple',52,.3,13.8,.2,'piece',182],
 orange:['Orange',47,.9,11.8,.1,'piece',131],
 broccoli:['Broccoli',35,2.4,7.2,.4,'g',100],
 vegetables:['Mixed vegetables',50,2.5,9,.5,'g',100],
 'olive oil':['Olive oil',884,0,0,100,'ml',1],
 oil:['Olive oil',884,0,0,100,'ml',1],
 milk:['Whole milk',61,3.2,4.8,3.3,'ml',1],
 oats:['Oats, dry',389,16.9,66.3,6.9,'g',100],
 'ground beef':['Ground beef, cooked',250,26,0,15,'g',100],
 beef:['Ground beef, cooked',250,26,0,15,'g',100],
 tuna:['Tuna, canned in water',116,25.5,0,.8,'g',100],
 potato:['Potato, cooked',87,1.9,20.1,.1,'g',100],
 pasta:['Pasta, cooked',158,5.8,30.9,.9,'g',100],
 lentils:['Lentils, cooked',116,9,20.1,.4,'g',100],
 avocado:['Avocado',160,2,8.5,14.7,'g',100],
 peanut:['Peanuts',567,25.8,16.1,49.2,'g',100],
 'peanut butter':['Peanut butter',588,25,20,50,'g',100],
 honey:['Honey',304,.3,82.4,0,'g',100],
 sugar:['Sugar',387,0,100,0,'g',100],
 'coca cola':['Coca-Cola',42,0,10.6,0,'ml',1],
 coke:['Coca-Cola',42,0,10.6,0,'ml',1]
};

let selected=null, editing=null, searchTimer=0, lastDate=null, activeRequest=0;

function cloneFood(x){return {name:x.name,kcal:+x.kcal||0,pro:+x.pro||0,carb:+x.carb||0,fat:+x.fat||0,unit:x.unit||'g',grams:+x.grams||100,source:x.source||'Reference',code:x.code||''};}
function localFoods(){const custom=read(CUSTOM,{}),out=[];Object.values(F).forEach(x=>out.push(cloneFood({name:x[0],kcal:x[1],pro:x[2],carb:x[3],fat:x[4],unit:x[5],grams:x[6]})));Object.values(custom).forEach(x=>out.push(cloneFood({...x,source:'My custom food'})));return out;}
function findLocal(q){q=q.toLowerCase().trim();if(!q)return null;const foods=localFoods();return foods.find(x=>x.name.toLowerCase()===q)||foods.find(x=>x.name.toLowerCase().includes(q)||q.includes(x.name.toLowerCase()))||null;}

function currentDate(){
 const t=$('#foodTitle')?.textContent||'';
 const m=t.match(/([A-Z]+DAY),?\s+([A-Z]+)\s+(\d+),\s+(\d{4})/i);
 if(!m)return null;
 const d=new Date(`${m[2]} ${m[3]}, ${m[4]}`);
 return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10);
}
function calc(f,q,u){
 let grams=q;
 if(u==='ml')grams=q*(f.unit==='ml'?(f.grams||1):1);
 else if(['piece','pieces','slice','slices','serving','servings'].includes(u))grams=q*(f.grams||100);
 return {cal:f.kcal*grams/100,pro:f.pro*grams/100,carb:f.carb*grams/100,fat:f.fat*grams/100,grams};
}
function parseLine(line){
 let s=line.trim().replace(/^[-•]+\s*/,'');
 if(!s)return null;
 const m=s.match(/^\s*(\d+(?:\.\d+)?)\s*(kg|g|grams?|ml|l|liters?|pieces?|pcs?|eggs?|slices?|servings?)?\s*(?:of\s+)?(.+?)\s*$/i);
 if(!m)return {qty:1,unit:'serving',food:s};
 let qty=+m[1], raw=(m[2]||'').toLowerCase(), food=m[3].trim();
 let unit=raw;
 if(/^kg$/.test(raw)){qty*=1000;unit='g';}
 else if(/^l$|^liter/.test(raw)){qty*=1000;unit='ml';}
 else if(/^gram|^g$/.test(raw))unit='g';
 else if(/^ml$/.test(raw))unit='ml';
 else if(/^egg/.test(raw)||/^piece|^pc/.test(raw))unit='piece';
 else if(/^slice/.test(raw))unit='slice';
 else if(/^serv/.test(raw))unit='serving';
 else if(!raw){const f=findLocal(food);unit=f?.unit||'g';}
 return {qty,unit,food};
}
function splitCompound(text){
 return text.replace(/\s+and\s+/gi,',').split(/[+,;\n]+/).map(x=>x.trim()).filter(Boolean);
}

async function searchAPI(q){
 const request=++activeRequest;
 try{
  const url='https://world.openfoodfacts.org/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=8&fields=product_name,brands,nutriments,code';
  const r=await fetch(url,{headers:{Accept:'application/json'}});
  if(!r.ok)throw new Error('HTTP '+r.status);
  const j=await r.json();
  if(request!==activeRequest)return [];
  return (j.products||[]).map(p=>{
   const z=p.nutriments||{};
   const kcal=+z['energy-kcal_100g']||((+z['energy-kj_100g']||0)/4.184);
   const pro=+z.proteins_100g||0,carb=+z.carbohydrates_100g||0,fat=+z.fat_100g||0;
   if(!p.product_name||!(kcal||pro||carb||fat))return null;
   return {name:p.product_name+(p.brands?' · '+p.brands:''),kcal,pro,carb,fat,unit:'g',grams:100,source:'Open Food Facts',code:p.code||''};
  }).filter(Boolean);
 }catch{return []}
}

function getInputs(){
 const r=$('#foodMacros'),o={};
 r?.querySelectorAll('label').forEach(l=>{const t=l.textContent.toLowerCase(),i=l.querySelector('input');if(t.includes('calorie'))o.cal=i;if(t.includes('protein'))o.pro=i;if(t.includes('carbo'))o.carb=i;if(t.includes('fat'))o.fat=i;});
 return o;
}
function totals(d){
 return (d.entries||[]).reduce((t,e)=>({cal:t.cal+e.kcal,pro:t.pro+e.pro,carb:t.carb+e.carb,fat:t.fat+e.fat}),{cal:d.base?.cal||0,pro:d.base?.pro||0,carb:d.base?.carb||0,fat:d.base?.fat||0});
}
function setTotals(v){const i=getInputs();[['cal',v.cal],['pro',v.pro],['carb',v.carb],['fat',v.fat]].forEach(([k,x])=>{if(i[k])i[k].value=Math.round(x*10)/10;});}
function targets(){
 const t=$('#foodTargets')?.textContent||'';
 const p=(name,def)=>{const m=t.match(new RegExp(name+'\\s*([0-9.]+)(?:\\s*[–-]\\s*([0-9.]+))?','i'));return m?+(m[2]||m[1]):def;};
 return {cal:p('CALORIES',2000),pro:p('PROTEIN',160),carb:p('CARBOHYDRATES',300),fat:p('FATS',70)};
}

function css(){
 if($('#btm-food-v3-css'))return;
 const s=document.createElement('style');s.id='btm-food-v3-css';
 s.textContent=`
.btm-food-calc{margin-top:22px;padding:18px;border:1px solid #294656;border-radius:9px;background:linear-gradient(145deg,rgba(19,32,42,.97),rgba(9,19,26,.97));box-shadow:0 10px 30px rgba(0,0,0,.14)}
.btm-food-calc h3{margin:0;font:22px Anton;text-transform:uppercase}.calc-ey{font:9px 'JetBrains Mono';letter-spacing:.22em;color:#66b9df}.calc-help{margin:7px 0 0;color:#8195a3;font:10px 'JetBrains Mono';line-height:1.5}
.food-calc-grid{display:grid;grid-template-columns:minmax(230px,1.7fr) 95px 115px 120px 90px;gap:8px;align-items:end;margin-top:14px}.food-calc-field label{display:block!important;margin:0 0 6px!important;color:#8195a3!important;font:9px 'JetBrains Mono'!important}.food-calc-field input,.food-calc-field select,.food-custom-grid input{width:100%;background:#09131a;border:1px solid #294656;color:#e8f0f4;border-radius:5px;padding:10px;font:11px 'JetBrains Mono'}
.food-calc-results,.food-calc-progress{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:14px}.food-calc-metric,.food-calc-progress .pbox{padding:10px;border:1px solid #294656;border-radius:6px;background:#0b151c}.food-calc-metric b{display:block;font:18px 'JetBrains Mono'}.food-calc-metric span,.food-calc-source{font:8px 'JetBrains Mono';color:#8195a3;text-transform:uppercase}
.food-calc-suggest{display:none;margin-top:6px;border:1px solid #294656;background:#09131a;max-height:220px;overflow:auto;position:absolute;z-index:20;width:100%}.food-calc-suggest.show{display:block}.food-search-wrap{position:relative}.food-calc-suggest button{display:block;width:100%;text-align:left;border:0;border-bottom:1px solid #20313b;background:#0b151c;color:#e8f0f4;padding:9px 10px;cursor:pointer;font:10px 'JetBrains Mono'}.food-calc-suggest small{color:#8195a3}
.food-calc-add,.food-calc-log-row button,.food-custom-save{cursor:pointer;background:#66b9df;color:#071016;border:0;border-radius:5px;padding:9px 12px;font:9px 'JetBrains Mono';font-weight:700}.food-calc-log{margin-top:16px}.food-calc-log-row{display:grid;grid-template-columns:minmax(180px,1fr) 80px 75px 65px 65px 65px auto auto;gap:7px;align-items:center;padding:10px 0;border-top:1px solid #20313b;font:9px 'JetBrains Mono'}.food-name{color:#e8f0f4}.food-name small{color:#8195a3}.food-calc-log-row button{background:#0b151c;color:#8195a3;border:1px solid #294656;padding:5px 7px}.food-calc-progress .phead{display:flex;justify-content:space-between;font:9px 'JetBrains Mono';color:#8195a3}.food-calc-progress .pbar{height:4px;margin-top:7px;background:#20313b;border-radius:3px;overflow:hidden}.food-calc-progress i{display:block;height:100%;background:#4fae9f;transition:width .25s ease}.food-calc-status{margin-top:10px;color:#8195a3;font:9px 'JetBrains Mono'}.food-custom{display:none;margin-top:14px;padding:12px;border:1px dashed #294656;border-radius:6px}.food-custom.show{display:block}.food-custom-grid{display:grid;grid-template-columns:2fr repeat(4,1fr) auto;gap:7px;align-items:end}.food-custom-title{font:9px 'JetBrains Mono';color:#8195a3;margin-bottom:7px}
@media(max-width:900px){.food-calc-grid{grid-template-columns:1fr 1fr}.food-calc-results,.food-calc-progress{grid-template-columns:1fr 1fr}.food-custom-grid{grid-template-columns:1fr 1fr}.food-calc-log-row{grid-template-columns:1fr auto}.food-calc-log-row .macro{display:none}}
@media(max-width:500px){.btm-food-calc{padding:13px}.food-calc-grid{grid-template-columns:1fr}.food-calc-results,.food-calc-progress{grid-template-columns:1fr 1fr}}
`;
 document.head.appendChild(s);
}

function build(){
 const title=$('#foodTitle'),panel=title?.closest('.panel');
 if(!panel||panel.querySelector('.btm-food-calc'))return;
 const e=document.createElement('div');e.className='btm-food-calc';
 e.innerHTML=`<div class="calc-ey">SMART FOOD LOG</div><h3>ADD FOOD</h3><p class="calc-help">Type naturally, for example: <b>3 eggs</b>, <b>200g chicken breast</b>, or <b>3 eggs + 200g turkey + 150g rice</b>. The calculator finds nutrition data, scales it to your quantity, and adds everything to today's totals.</p>
 <div class="food-calc-grid"><div class="food-calc-field food-search-wrap"><label>FOOD / MEAL INPUT</label><input id="foodCalcSearch" placeholder="3 eggs + 200g chicken + rice" autocomplete="off"><div id="foodCalcSuggest" class="food-calc-suggest"></div></div><div class="food-calc-field"><label>AMOUNT</label><input id="foodCalcQty" type="number" min="0.1" step="0.1" value="1"></div><div class="food-calc-field"><label>UNIT</label><select id="foodCalcUnit"><option value="g">grams</option><option value="ml">ml</option><option value="piece">pieces</option><option value="slice">slices</option><option value="serving">servings</option></select></div><div class="food-calc-field"><label>MEAL</label><select id="foodCalcMeal"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div><button class="food-calc-add" id="foodCalcAdd">ADD</button></div>
 <div class="food-calc-results"><div class="food-calc-metric"><b id="foodCalcKcal">0</b><span>kcal</span></div><div class="food-calc-metric"><b id="foodCalcPro">0g</b><span>protein</span></div><div class="food-calc-metric"><b id="foodCalcCarb">0g</b><span>carbs</span></div><div class="food-calc-metric"><b id="foodCalcFat">0g</b><span>fat</span></div></div>
 <div class="food-custom" id="foodCustom"><div class="food-custom-title">CAN'T FIND IT? ADD YOUR FOOD LABEL PER 100G</div><div class="food-custom-grid"><input id="customName" placeholder="Food name"><input id="customCal" type="number" min="0" placeholder="kcal"><input id="customPro" type="number" min="0" placeholder="protein g"><input id="customCarb" type="number" min="0" placeholder="carbs g"><input id="customFat" type="number" min="0" placeholder="fat g"><button class="food-custom-save" id="customSave">SAVE FOOD</button></div></div>
 <div class="food-calc-progress" id="foodCalcProgress"></div><div class="food-calc-log" id="foodCalcLog"></div><div class="food-calc-status" id="foodCalcStatus"></div><div class="food-calc-source">Food database: Open Food Facts. Database values are provided by contributors and may contain errors, so packaged foods should be checked against their nutrition label. </div>`;
 panel.appendChild(e);bind();render();
}

function showSuggestions(list){
 const s=$('#foodCalcSuggest');if(!s)return;
 s.innerHTML=list.map((f,i)=>`<button type="button" data-i="${i}">${esc(f.name)} <small>${Math.round(f.kcal)} kcal / 100g · ${f.pro.toFixed(1)}p · ${f.carb.toFixed(1)}c · ${f.fat.toFixed(1)}f</small></button>`).join('');
 s.classList.toggle('show',list.length>0);
 s.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{selected=list[i];const parsed=parseLine($('#foodCalcSearch').value);$('#foodCalcSearch').value=parsed?.food||selected.name;$('#foodCalcQty').value=parsed?.qty||1;$('#foodCalcUnit').value=parsed?.unit||selected.unit||'g';s.classList.remove('show');preview();});
}

function preview(){
 const raw=$('#foodCalcSearch')?.value||'', parsed=parseLine(raw), f=selected||findLocal(parsed?.food||raw);
 if(!f)return;
 const q=num($('#foodCalcQty')?.value)||parsed?.qty||1,u=$('#foodCalcUnit')?.value||parsed?.unit||f.unit,x=calc(f,q,u);
 $('#foodCalcKcal').textContent=Math.round(x.cal);$('#foodCalcPro').textContent=x.pro.toFixed(1)+'g';$('#foodCalcCarb').textContent=x.carb.toFixed(1)+'g';$('#foodCalcFat').textContent=x.fat.toFixed(1)+'g';
}

async function resolveFood(food){
 const local=findLocal(food);if(local)return local;
 const results=await searchAPI(food);return results[0]||null;
}

async function add(){
 const raw=$('#foodCalcSearch').value.trim();if(!raw)return;
 const d=currentDate();if(!d){$('#foodCalcStatus').textContent='Select a Nutrition day first.';return;}
 const lines=splitCompound(raw);
 $('#foodCalcAdd').disabled=true;$('#foodCalcStatus').textContent='Finding food nutrition data...';
 const resolved=[];
 for(const line of lines){
  const p=parseLine(line);if(!p)continue;
  const f=selected&&lines.length===1?selected:await resolveFood(p.food);
  if(!f){$('#foodCalcAdd').disabled=false;$('#foodCustom').classList.add('show');$('#foodCalcStatus').textContent='Could not identify: '+p.food+'. Add its nutrition label below, or choose a search result.';return;}
  resolved.push({p,f});
 }
 const all=read(KEY,{});all[d]??={entries:[],base:null};all[d].entries??=[];
 for(const {p,f} of resolved){const q=lines.length===1?num($('#foodCalcQty').value)||p.qty||1:p.qty||1;const u=lines.length===1?$('#foodCalcUnit').value||p.unit:f.unit||p.unit||'g';const x=calc(f,q,u);all[d].entries.push({id:(crypto.randomUUID?.()||String(Date.now()+Math.random())),name:f.name,qty:q,unit:u,meal:$('#foodCalcMeal').value,kcal:x.cal,pro:x.pro,carb:x.carb,fat:x.fat,source:f.source||'Reference',code:f.code||''});}
 write(KEY,all);sync(all[d]);reset('Food added. Daily calories and macros synced.');
}

function sync(d){
 setTotals(totals(d));
 const ta=$('#btmFoodItems');if(ta)ta.value=(d.entries||[]).map(e=>`${e.qty}${e.unit==='g'?'g':e.unit==='ml'?'ml':' '+e.unit} ${e.name} · ${Math.round(e.kcal)} kcal · ${e.pro.toFixed(1)}p · ${e.carb.toFixed(1)}c · ${e.fat.toFixed(1)}f`).join('\n');
 $('#btmFoodSave')?.click();
}
function reset(msg){editing=null;selected=null;$('#foodCalcAdd').disabled=false;$('#foodCalcAdd').textContent='ADD';$('#foodCalcSearch').value='';$('#foodCalcQty').value=1;$('#foodCalcStatus').textContent=msg;$('#foodCustom').classList.remove('show');render();}

function render(){
 const d=currentDate();if(!d)return;lastDate=d;const all=read(KEY,{}),day=all[d]||{entries:[],base:null},es=day.entries||[],v=totals(day),l=$('#foodCalcLog');if(!l)return;
 l.innerHTML=es.length?es.map(e=>`<div class="food-calc-log-row"><span class="food-name">${esc(e.name)}<small> · ${esc(e.meal||'Meal')} · ${esc(e.source||'')}</small></span><span>${e.qty}${esc(e.unit)}</span><span class="macro">${Math.round(e.kcal)} kcal</span><span class="macro">${e.pro.toFixed(1)}p</span><span class="macro">${e.carb.toFixed(1)}c</span><span class="macro">${e.fat.toFixed(1)}f</span><button data-e="${esc(e.id)}">EDIT</button><button data-d="${esc(e.id)}">DELETE</button></div>`).join(''):'<div class="note">No food added yet.</div>';
 l.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>edit(b.dataset.e));l.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>del(b.dataset.d));setTotals(v);progress(v);
}
function progress(v){
 const t=targets(),m=[['CALORIES',v.cal,t.cal],['PROTEIN',v.pro,t.pro],['CARBS',v.carb,t.carb],['FAT',v.fat,t.fat]],p=m.reduce((s,x)=>s+Math.min(1,x[1]/Math.max(x[2],1)),0)/4;
 $('#foodCalcProgress').innerHTML=m.map(x=>`<div class="pbox"><div class="phead"><span>${x[0]}</span><span>${Math.round(x[1]*10)/10} / ${x[2]}</span></div><div class="pbar"><i style="width:${Math.min(100,x[1]/Math.max(x[2],1)*100)}%"></i></div></div>`).join('');
 $('#foodCalcStatus').textContent=(p>=.95?'🟢 TARGET RANGE REACHED':p>=.8?'🟡 ALMOST THERE':'🔴 BELOW TARGET')+' · '+Math.round(p*100)+'% average target coverage';
}
function edit(id){const d=currentDate(),day=read(KEY,{})[d],e=day?.entries?.find(x=>x.id===id);if(!e)return;editing=id;selected=null;$('#foodCalcSearch').value=e.name;$('#foodCalcQty').value=e.qty;$('#foodCalcUnit').value=e.unit;$('#foodCalcMeal').value=e.meal||'Dinner';$('#foodCalcAdd').textContent='UPDATE';$('#foodCalcStatus').textContent='Editing '+e.name+'. Change the quantity or meal, then UPDATE.';preview();}
function update(){const d=currentDate(),all=read(KEY,{}),day=all[d],e=day?.entries?.find(x=>x.id===editing);if(!e)return;const q=num($('#foodCalcQty').value)||1,f=q/Math.max(e.qty,.1);e.qty=q;e.unit=$('#foodCalcUnit').value;e.meal=$('#foodCalcMeal').value;e.kcal*=f;e.pro*=f;e.carb*=f;e.fat*=f;write(KEY,all);sync(day);reset('Food entry updated.');}
function del(id){const d=currentDate(),all=read(KEY,{}),day=all[d];if(!day)return;day.entries=(day.entries||[]).filter(e=>e.id!==id);write(KEY,all);sync(day);render();}

function saveCustom(){
 const name=$('#customName').value.trim();if(!name)return;
 const food={name,kcal:num($('#customCal').value),pro:num($('#customPro').value),carb:num($('#customCarb').value),fat:num($('#customFat').value),unit:'g',grams:100,source:'My custom food'};
 if(!(food.kcal||food.pro||food.carb||food.fat)){return;}
 const all=read(CUSTOM,{});all[name.toLowerCase()]=food;write(CUSTOM,all);selected=food;$('#foodCalcSearch').value=name;$('#foodCalcQty').value=100;$('#foodCalcUnit').value='g';$('#foodCustom').classList.remove('show');preview();$('#foodCalcStatus').textContent='Custom food saved. You can use it again anytime.';
}

function bind(){
 const q=$('#foodCalcSearch'),s=$('#foodCalcSuggest');
 q.oninput=()=>{clearTimeout(searchTimer);selected=null;const raw=q.value.trim(),parts=splitCompound(raw);s.classList.remove('show');if(!raw)return;const last=parseLine(parts[parts.length-1]);const term=last?.food||raw;const local=localFoods().filter(f=>f.name.toLowerCase().includes(term.toLowerCase())).slice(0,6);if(local.length)showSuggestions(local);searchTimer=setTimeout(async()=>{const r=await searchAPI(term);if(r.length)showSuggestions([...local,...r].slice(0,8));},700);preview();};
 q.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('#foodCalcAdd').click();}};
 $('#foodCalcQty').oninput=preview;$('#foodCalcUnit').onchange=preview;$('#foodCalcAdd').onclick=()=>editing?update():add();$('#customSave').onclick=saveCustom;
}
function refresh(){if(!$('#foodCalcLog'))build();else render();}
window.BTMFoodCalculator={refresh,render};
function boot(){css();build();const observer=new MutationObserver(()=>{const d=currentDate();if(document.body.dataset.section==='food'&&d!==lastDate)refresh();});observer.observe(document.body,{attributes:true,attributeFilter:['data-section']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
