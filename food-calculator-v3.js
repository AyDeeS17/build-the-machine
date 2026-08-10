/* Build The Machine, simplified nutrition tracker.
   Keeps the existing 84-day nutrition system, adds automatic + manual food entry,
   and keeps all entries in the same daily totals used by the program. */
(()=>{
'use strict';
if(window.__BTM_FOOD_V3_SIMPLE__)return;
window.__BTM_FOOD_V3_SIMPLE__=1;

const KEY='btm_food_log_v3', CUSTOM='btm_custom_foods_v1';
const $=s=>document.querySelector(s);
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const n=v=>Math.max(0,parseFloat(v)||0);
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));

const F={
 egg:['Egg',143,12.6,.7,9.5,'piece',50], eggs:['Egg',143,12.6,.7,9.5,'piece',50],
 yogurt:['Plain yogurt',61,3.5,4.7,3.3,'g',100], 'greek yogurt':['Greek yogurt, plain',59,10.2,3.6,.4,'g',100],
 chicken:['Chicken breast, cooked',165,31,0,3.6,'g',100], 'chicken breast':['Chicken breast, cooked',165,31,0,3.6,'g',100],
 rice:['Rice, white, cooked',130,2.7,28.2,.3,'g',100], turkey:['Turkey breast',104,17,4,2,'g',100], 'turkey ham':['Turkey ham',104,17,4,2,'g',100],
 cheese:['Cheddar cheese',403,25,1.3,33.1,'g',100], bread:['White bread',266,8.9,49.4,3.3,'slice',25],
 banana:['Banana',89,1.1,22.8,.3,'piece',118], apple:['Apple',52,.3,13.8,.2,'piece',182], orange:['Orange',47,.9,11.8,.1,'piece',131],
 broccoli:['Broccoli',35,2.4,7.2,.4,'g',100], vegetables:['Mixed vegetables',50,2.5,9,.5,'g',100],
 'olive oil':['Olive oil',884,0,0,100,'ml',1], oil:['Olive oil',884,0,0,100,'ml',1], milk:['Whole milk',61,3.2,4.8,3.3,'ml',1],
 oats:['Oats, dry',389,16.9,66.3,6.9,'g',100], 'ground beef':['Ground beef, cooked',250,26,0,15,'g',100], beef:['Ground beef, cooked',250,26,0,15,'g',100],
 tuna:['Tuna, canned in water',116,25.5,0,.8,'g',100], potato:['Potato, cooked',87,1.9,20.1,.1,'g',100],
 pasta:['Pasta, cooked',158,5.8,30.9,.9,'g',100], lentils:['Lentils, cooked',116,9,20.1,.4,'g',100],
 avocado:['Avocado',160,2,8.5,14.7,'g',100], peanut:['Peanuts',567,25.8,16.1,49.2,'g',100],
 'peanut butter':['Peanut butter',588,25,20,50,'g',100], honey:['Honey',304,.3,82.4,0,'g',100], sugar:['Sugar',387,0,100,0,'g',100],
 coke:['Coca-Cola',42,0,10.6,0,'ml',1], 'coca cola':['Coca-Cola',42,0,10.6,0,'ml',1]
};

let selected=null, searchTimer=0, editing=null, activeRequest=0, current=null;

function clone(x){return {name:x.name,kcal:+x.kcal||0,pro:+x.pro||0,carb:+x.carb||0,fat:+x.fat||0,unit:x.unit||'g',grams:+x.grams||100,source:x.source||'Reference',code:x.code||''};}
function locals(){const c=read(CUSTOM,{}),a=[];Object.values(F).forEach(x=>a.push(clone({name:x[0],kcal:x[1],pro:x[2],carb:x[3],fat:x[4],unit:x[5],grams:x[6]})));Object.values(c).forEach(x=>a.push(clone({...x,source:'My custom food'})));return a;}
function find(q){q=q.toLowerCase().trim();const a=locals();return a.find(x=>x.name.toLowerCase()===q)||a.find(x=>x.name.toLowerCase().includes(q)||q.includes(x.name.toLowerCase()))||null;}
function date(){const t=$('#foodTitle')?.textContent||'',m=t.match(/([A-Z]+DAY),?\s+([A-Z]+)\s+(\d+),\s+(\d{4})/i);if(!m)return null;const d=new Date(`${m[2]} ${m[3]}, ${m[4]}`);return Number.isNaN(d.getTime())?null:d.toISOString().slice(0,10);}
function calc(f,q,u){let g=q;if(['piece','pieces','slice','slices','serving','servings'].includes(u))g=q*(f.grams||100);else if(u==='ml'&&f.unit!=='ml')g=q;else if(u==='ml'&&f.unit==='ml')g=q*(f.grams||1);return {cal:f.kcal*g/100,pro:f.pro*g/100,carb:f.carb*g/100,fat:f.fat*g/100};}
function dayData(){const d=date();if(!d)return null;const all=read(KEY,{});all[d]??={entries:[],base:{cal:0,pro:0,carb:0,fat:0}};all[d].entries??=[];all[d].base??={cal:0,pro:0,carb:0,fat:0};return {d,all,day:all[d]};}
function totals(day){return (day.entries||[]).reduce((t,e)=>({cal:t.cal+e.cal,pro:t.pro+e.pro,carb:t.carb+e.carb,fat:t.fat+e.fat}),{...day.base});}
function saveDay(x){write(KEY,x.all);syncExisting(x.day);render();}
function syncExisting(day){
 const u=read('btm_nutrition_unified',{}),d=date();if(!d)return;
 u[d]??={cal:0,pro:0,carb:0,fat:0,water:0,meals:'',items:'',complete:false};
 const t=totals(day);u[d].cal=t.cal;u[d].pro=t.pro;u[d].carb=t.carb;u[d].fat=t.fat;
 u[d].items=(day.entries||[]).map(e=>`${e.qty}${e.unit} ${e.name} · ${Math.round(e.cal)} kcal · ${e.pro.toFixed(1)}p · ${e.carb.toFixed(1)}c · ${e.fat.toFixed(1)}f`).join('\n');
 write('btm_nutrition_unified',u);
}
function targets(){const t=$('#foodTargets')?.textContent||'';const get=(name,def)=>{const m=t.match(new RegExp(name+'\\s*([0-9.]+)(?:\\s*[–-]\\s*([0-9.]+))?','i'));return m?+(m[2]||m[1]):def;};return {cal:get('CALORIES',2000),pro:get('PROTEIN',160),carb:get('CARBOHYDRATES',300),fat:get('FATS',70)};}

async function api(q){const req=++activeRequest;try{const r=await fetch('https://world.openfoodfacts.org/cgi/search.pl?search_terms='+encodeURIComponent(q)+'&search_simple=1&action=process&json=1&page_size=8&fields=product_name,brands,nutriments,code',{headers:{Accept:'application/json'}});if(!r.ok)throw 0;const j=await r.json();if(req!==activeRequest)return [];return (j.products||[]).map(p=>{const z=p.nutriments||{},k=+z['energy-kcal_100g']||((+z['energy-kj_100g']||0)/4.184),pro=+z.proteins_100g||0,c=+z.carbohydrates_100g||0,f=+z.fat_100g||0;return p.product_name&&(k||pro||c||f)?{name:p.product_name+(p.brands?' · '+p.brands:''),kcal:k,pro,carb:c,fat:f,unit:'g',grams:100,source:'Open Food Facts',code:p.code||''}:null;}).filter(Boolean);}catch{return [];}}

function css(){if($('#btm-food-simple-css'))return;const s=document.createElement('style');s.id='btm-food-simple-css';s.textContent=`
#btm-food-view .btm-food-calc{margin-top:0}.btm-food-calc{padding:16px;border:1px solid #294656;border-radius:8px;background:#0d171e}.btm-food-calc h3{margin:0;font:22px Anton;text-transform:uppercase}.calc-help{margin:6px 0 14px;color:#8195a3;font:10px 'JetBrains Mono';line-height:1.45}.food-mode{display:flex;gap:6px;margin-bottom:10px}.food-mode button,.food-calc-add,.food-calc-log-row button{cursor:pointer;border:1px solid #294656;background:#0b151c;color:#8195a3;border-radius:5px;padding:8px 11px;font:9px 'JetBrains Mono';font-weight:700}.food-mode button.active,.food-calc-add{background:#66b9df;color:#071016;border-color:#66b9df}.food-grid{display:grid;grid-template-columns:minmax(220px,1fr) 90px 105px 90px;gap:7px;align-items:end}.food-field label{display:block;color:#8195a3;font:8px 'JetBrains Mono';margin-bottom:5px}.food-field input,.food-field select{width:100%;background:#09131a;border:1px solid #294656;color:#e8f0f4;border-radius:5px;padding:9px;font:10px 'JetBrains Mono'}.food-search{position:relative}.food-suggest{display:none;position:absolute;z-index:30;left:0;right:0;top:100%;background:#09131a;border:1px solid #294656;max-height:200px;overflow:auto}.food-suggest.show{display:block}.food-suggest button{display:block;width:100%;padding:9px;text-align:left;border:0;border-bottom:1px solid #20313b;background:#0b151c;color:#e8f0f4;font:10px 'JetBrains Mono';cursor:pointer}.manual-fields{display:none;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:9px}.manual-fields.show{display:grid}.food-add-row{display:flex;gap:7px;margin-top:9px}.food-add-row select{background:#09131a;border:1px solid #294656;color:#e8f0f4;border-radius:5px;padding:8px;font:9px 'JetBrains Mono'}.daily-total{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-bottom:12px}.macro-box{padding:10px;border:1px solid #294656;border-radius:6px;background:#0b151c}.macro-box b{display:block;font:16px 'JetBrains Mono'}.macro-box span{font:8px 'JetBrains Mono';color:#8195a3}.macro-bar{height:4px;background:#20313b;border-radius:3px;margin-top:6px;overflow:hidden}.macro-bar i{display:block;height:100%;background:#4fae9f}.macro-row{display:flex;justify-content:space-between;color:#8195a3;font:8px 'JetBrains Mono';margin-top:4px}.food-log{margin-top:12px}.food-log-row{display:grid;grid-template-columns:minmax(180px,1fr) 70px 65px 65px 65px 65px auto;gap:6px;align-items:center;padding:8px 0;border-top:1px solid #20313b;font:8px 'JetBrains Mono'}.food-log-row .name{color:#e8f0f4}.food-log-row small{color:#8195a3}.food-status{margin-top:8px;color:#8195a3;font:8px 'JetBrains Mono'}.override-note{margin-top:8px;color:#8195a3;font:8px 'JetBrains Mono'}
/* Hide clutter while preserving the existing week/day system and data. */
#btm-food-view>.btm-hero,#btm-food-view>.panel:nth-of-type(3),#btm-food-view>.panel:nth-of-type(4),#btm-food-view>.panel:last-child{display:none!important}#btm-food-view>.panel:first-of-type{padding-bottom:10px}#btm-food-view>.panel:nth-of-type(2){margin-top:10px}#foodTargets{display:none}#foodMacros,#btmFoodWater,.btm-water-row,.btm-text-grid,.btm-check,#btmFoodSave,#btmFoodSaved{display:none!important}
@media(max-width:800px){.food-grid{grid-template-columns:1fr 1fr}.daily-total,.manual-fields{grid-template-columns:1fr 1fr}.food-log-row{grid-template-columns:1fr auto}.food-log-row .macro{display:none}}@media(max-width:500px){.food-grid{grid-template-columns:1fr}.daily-total{grid-template-columns:1fr 1fr}.btm-food-calc{padding:12px}}
`;document.head.appendChild(s);}

function build(){
 const title=$('#foodTitle'),panel=title?.closest('.panel');if(!panel||panel.querySelector('.btm-food-calc'))return;
 const wrap=document.createElement('div');wrap.className='btm-food-calc';wrap.innerHTML=`
 <div class="daily-total" id="simpleTotals"></div>
 <div class="calc-help">Add a known food for automatic nutrition, or use Manual Entry when you already know the calories/macros.</div>
 <div class="food-mode"><button id="autoMode" class="active">AUTO FOOD</button><button id="manualMode">MANUAL ENTRY</button></div>
 <div class="food-grid" id="autoFields"><div class="food-field food-search"><label>FOOD</label><input id="foodQ" placeholder="Eggs, chicken, rice..." autocomplete="off"><div id="foodSuggest" class="food-suggest"></div></div><div class="food-field"><label>AMOUNT</label><input id="foodQty" type="number" min="0.1" step="0.1" value="1"></div><div class="food-field"><label>UNIT</label><select id="foodUnit"><option value="g">grams</option><option value="ml">ml</option><option value="piece">pieces</option><option value="slice">slices</option><option value="serving">servings</option></select></div><div class="food-field"><label>MEAL</label><select id="foodMeal"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div></div>
 <div class="manual-fields" id="manualFields"><div class="food-field"><label>FOOD NAME</label><input id="manualName" placeholder="Homemade meal"></div><div class="food-field"><label>CALORIES</label><input id="manualCal" type="number" min="0" step="0.1"></div><div class="food-field"><label>PROTEIN, G</label><input id="manualPro" type="number" min="0" step="0.1"></div><div class="food-field"><label>CARBS, G</label><input id="manualCarb" type="number" min="0" step="0.1"></div><div class="food-field"><label>FATS, G</label><input id="manualFat" type="number" min="0" step="0.1"></div></div>
 <div class="food-add-row"><select id="foodMeal2"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select><button class="food-calc-add" id="addFood">ADD FOOD</button></div>
 <div class="override-note">For automatic foods, you can override Calories or Carbs before adding if the label differs from the database.</div>
 <div class="food-log" id="simpleLog"></div><div class="food-status" id="foodStatus"></div>`;
 panel.insertBefore(wrap,panel.firstChild);bind();render();
}

function bind(){
 const q=$('#foodQ'),s=$('#foodSuggest');
 $('#autoMode').onclick=()=>mode(false);$('#manualMode').onclick=()=>mode(true);
 q.oninput=()=>{clearTimeout(searchTimer);selected=null;s.classList.remove('show');const v=q.value.trim();if(!v)return;const local=locals().filter(f=>f.name.toLowerCase().includes(v.toLowerCase())).slice(0,8);if(local.length)show(local);searchTimer=setTimeout(async()=>{const r=await api(v);if(r.length)show([...local,...r].slice(0,8));},350);};
 $('#foodQty').oninput=preview;$('#foodUnit').onchange=preview;$('#addFood').onclick=add;
}
function mode(manual){$('#autoMode').classList.toggle('active',!manual);$('#manualMode').classList.toggle('active',manual);$('#autoFields').style.display=manual?'none':'grid';$('#manualFields').classList.toggle('show',manual);$('#foodMeal').style.display=manual?'none':'block';}
function show(list){const s=$('#foodSuggest');s.innerHTML=list.map((f,i)=>`<button type="button" data-i="${i}">${esc(f.name)} <small>${Math.round(f.kcal)} kcal/100g</small></button>`).join('');s.classList.add('show');s.querySelectorAll('button').forEach((b,i)=>b.onclick=()=>{selected=list[i];$('#foodQ').value=selected.name;$('#foodUnit').value=selected.unit||'g';s.classList.remove('show');preview();});}
function preview(){const f=selected||find($('#foodQ').value);if(!f)return;const x=calc(f,n($('#foodQty').value)||1,$('#foodUnit').value);$('#foodStatus').textContent=`Preview: ${Math.round(x.cal)} kcal · ${x.pro.toFixed(1)}g protein · ${x.carb.toFixed(1)}g carbs · ${x.fat.toFixed(1)}g fat`;}
function add(){
 const x=dayData();if(!x)return;
 let e;
 if($('#manualFields').classList.contains('show')){
  const name=$('#manualName').value.trim()||'Manual food';e={id:crypto.randomUUID?.()||String(Date.now()+Math.random()),name,qty:1,unit:'serving',meal:$('#foodMeal2').value,cal:n($('#manualCal').value),pro:n($('#manualPro').value),carb:n($('#manualCarb').value),fat:n($('#manualFat').value),source:'Manual'};
  if(!e.cal&&!e.pro&&!e.carb&&!e.fat){$('#foodStatus').textContent='Enter at least one nutrition value.';return;}
 }else{
  const f=selected||find($('#foodQ').value);if(!f){$('#foodStatus').textContent='Select a food from the suggestions, or use Manual Entry.';return;}
  const z=calc(f,n($('#foodQty').value)||1,$('#foodUnit').value);e={id:crypto.randomUUID?.()||String(Date.now()+Math.random()),name:f.name,qty:n($('#foodQty').value)||1,unit:$('#foodUnit').value,meal:$('#foodMeal').value,cal:z.cal,pro:z.pro,carb:z.carb,fat:z.fat,source:f.source,code:f.code||''};
 }
 x.day.entries.push(e);saveDay(x);clearForm();
}
function clearForm(){$('#foodQ').value='';$('#foodQty').value=1;$('#manualName').value='';['manualCal','manualPro','manualCarb','manualFat'].forEach(id=>$('#'+id).value='');selected=null;$('#foodStatus').textContent='Added to today.';}
function remove(id){const x=dayData();if(!x)return;x.day.entries=x.day.entries.filter(e=>e.id!==id);saveDay(x);}
function edit(id){
 const x=dayData();if(!x)return;const e=x.day.entries.find(v=>v.id===id);if(!e)return;
 mode(true);$('#manualName').value=e.name;$('#manualCal').value=e.cal;$('#manualPro').value=e.pro;$('#manualCarb').value=e.carb;$('#manualFat').value=e.fat;
 $('#addFood').textContent='UPDATE';$('#addFood').onclick=()=>{e.name=$('#manualName').value.trim()||e.name;e.cal=n($('#manualCal').value);e.pro=n($('#manualPro').value);e.carb=n($('#manualCarb').value);e.fat=n($('#manualFat').value);saveDay(x);$('#addFood').textContent='ADD FOOD';$('#addFood').onclick=add;clearForm();};
}
function render(){
 if(!$('#simpleTotals'))return;const x=dayData();if(!x)return;current=x.d;const t=totals(x.day),tar=targets();
 const vals=[['CALORIES',t.cal,tar.cal,'kcal'],['PROTEIN',t.pro,tar.pro,'g'],['CARBS',t.carb,tar.carb,'g'],['FATS',t.fat,tar.fat,'g']];
 $('#simpleTotals').innerHTML=vals.map(v=>`<div class="macro-box"><b>${Math.round(v[1]*10)/10} / ${v[2]} ${v[3]}</b><span>${v[0]}</span><div class="macro-bar"><i style="width:${Math.min(100,v[1]/Math.max(v[2],1)*100)}%"></i></div></div>`).join('');
 $('#simpleLog').innerHTML=(x.day.entries||[]).length?(x.day.entries||[]).map(e=>`<div class="food-log-row"><span class="name">${esc(e.name)} <small>· ${esc(e.meal||'')}</small></span><span>${e.qty}${e.unit}</span><span class="macro">${Math.round(e.cal)} kcal</span><span class="macro">${e.pro.toFixed(1)}p</span><span class="macro">${e.carb.toFixed(1)}c</span><span class="macro">${e.fat.toFixed(1)}f</span><button data-edit="${e.id}">EDIT</button><button data-del="${e.id}">×</button></div>`).join(''):'<div class="note">No food logged yet.</div>';
 $('#simpleLog').querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>edit(b.dataset.edit));$('#simpleLog').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>remove(b.dataset.del));
 const unified=read('btm_nutrition_unified',{});if(unified[x.d]){unified[x.d].cal=t.cal;unified[x.d].pro=t.pro;unified[x.d].carb=t.carb;unified[x.d].fat=t.fat;write('btm_nutrition_unified',unified);}
}
function refresh(){build();render();}
function boot(){css();refresh();const title=$('#foodTitle');if(title)new MutationObserver(()=>{if(date()!==current)render();}).observe(title,{childList:true,subtree:true,characterData:true});const body=document.body;new MutationObserver(()=>{if(body.dataset.section==='food')setTimeout(refresh,0);}).observe(body,{attributes:true,attributeFilter:['data-section']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.BTMFoodCalculator={refresh,render};
})();
