/* Pixel-art character portraits for the selected week. */
(()=>{
'use strict';
if(window.__BTM_PIXEL_CHARACTERS__)return;
window.__BTM_PIXEL_CHARACTERS__=1;
const COLORS=['#66b9df','#e86a78','#b58cff','#7ec8a0','#d6a45d','#d6c36a','#8c82d8','#e58b5b','#6fb8d6','#a879d6','#c98b58','#d05b68'];
const CHARS=[
 {name:'Goku',skin:'#d9a078',hair:'#11151b',shirt:'#f27a2d',accent:'#315b9a',style:'spiky',detail:'gi'},
 {name:'Tanjiro Kamado',skin:'#d7a078',hair:'#4a1e20',shirt:'#263d31',accent:'#173d2b',style:'fringe',detail:'check'},
 {name:'Yuji Itadori',skin:'#d9a17d',hair:'#d7797c',shirt:'#171b26',accent:'#343a55',style:'short',detail:'collar'},
 {name:'Eren Yeager',skin:'#c99068',hair:'#382a22',shirt:'#4c6049',accent:'#243c2d',style:'long',detail:'jacket'},
 {name:'Thorfinn',skin:'#d9a178',hair:'#c7b58a',shirt:'#43556b',accent:'#27394d',style:'blond',detail:'tunic'},
 {name:'Vegeta',skin:'#d29a73',hair:'#11151c',shirt:'#244c86',accent:'#e9e7dc',style:'widow',detail:'armor'},
 {name:'Gojo Satoru',skin:'#e0ae89',hair:'#e8edf4',shirt:'#111823',accent:'#cbd9e8',style:'white',detail:'blindfold'},
 {name:'Toji Fushiguro',skin:'#c8936d',hair:'#141820',shirt:'#1a2027',accent:'#5b6a78',style:'messy',detail:'scar'},
 {name:'Ken Kaneki',skin:'#dfae8f',hair:'#e8edf1',shirt:'#17181d',accent:'#b9c3cd',style:'whitefringe',detail:'mask'},
 {name:'Itachi Uchiha',skin:'#c78c6b',hair:'#15151a',shirt:'#14151a',accent:'#b32632',style:'longfringe',detail:'cloak'},
 {name:'Griffith',skin:'#e1b08c',hair:'#f0f2f5',shirt:'#d7d9df',accent:'#71829b',style:'flowing',detail:'armor'},
 {name:'Guts',skin:'#bf825f',hair:'#15171b',shirt:'#252b31',accent:'#6e7882',style:'wild',detail:'armor'}
];
const $=id=>document.getElementById(id);
const rect=(c,x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(x*4,y*4,w*4,h*4)};
function sprite(canvas,s){
 const c=canvas.getContext('2d'); c.imageSmoothingEnabled=false; c.clearRect(0,0,96,128);
 rect(c,5,27,14,5,s.shirt); rect(c,3,31,18,1,s.shirt); rect(c,7,28,10,4,s.accent);
 rect(c,10,23,4,5,s.skin); rect(c,8,15,2,4,s.skin); rect(c,14,15,2,4,s.skin);
 rect(c,8,8,8,15,s.skin); rect(c,7,11,1,9,s.skin); rect(c,16,11,1,9,s.skin);
 const hair={
  spiky:[[6,8,2,3],[8,5,2,3],[10,3,2,3],[12,5,2,3],[14,3,2,3],[16,6,2,3],[5,10,2,5],[17,9,2,6]],
  fringe:[[6,7,11,5],[7,5,9,3],[8,9,2,5],[10,8,2,4],[12,9,2,5],[14,8,2,4],[16,9,2,5]],
  short:[[7,6,10,5],[8,4,8,3],[7,9,2,4],[15,9,2,4]],
  long:[[6,6,11,6],[7,4,9,3],[6,10,2,11],[16,10,2,11],[9,10,2,5],[12,9,2,6]],
  blond:[[6,7,11,5],[8,4,8,4],[6,9,2,7],[16,9,2,6],[9,9,2,3],[13,9,2,4]],
  widow:[[7,6,10,5],[8,4,8,3],[10,3,2,3],[12,3,2,4],[14,5,2,3],[7,10,2,5],[16,10,2,5]],
  white:[[6,7,11,5],[7,5,9,3],[8,3,2,3],[10,4,2,3],[12,3,2,4],[14,4,2,3],[16,6,2,5]],
  messy:[[6,7,11,5],[7,5,9,3],[6,10,2,5],[16,9,2,6],[9,8,2,5],[13,8,2,5]],
  whitefringe:[[6,7,11,5],[7,5,9,3],[8,3,2,3],[10,4,2,4],[12,3,2,4],[14,5,2,4],[16,7,2,4]],
  longfringe:[[6,6,11,6],[7,4,9,3],[6,10,2,12],[16,10,2,12],[9,9,2,6],[13,8,2,7]],
  flowing:[[6,7,11,5],[7,5,9,3],[8,3,2,3],[10,4,2,3],[12,3,2,4],[14,4,2,3],[6,10,2,9],[16,9,2,10]],
  wild:[[6,7,11,5],[7,4,9,4],[6,10,2,9],[16,9,2,10],[8,9,2,4],[14,8,2,5]]
 }[s.style];
 hair.forEach(a=>rect(c,a[0],a[1],a[2],a[3],s.hair));
 rect(c,9,14,2,1,'#11151b'); rect(c,13,14,2,1,'#11151b'); rect(c,11,18,2,1,'#8b5148');
 if(s.detail==='gi'){rect(c,8,27,2,5,s.accent);rect(c,14,27,2,5,s.accent);rect(c,10,28,4,1,'#f4c55d')}
 if(s.detail==='check'){for(let y=27;y<32;y++)for(let x=7;x<17;x++)if((x+y)%2===0)rect(c,x,y,1,1,s.accent)}
 if(s.detail==='collar'){rect(c,9,26,2,6,s.accent);rect(c,13,26,2,6,s.accent);rect(c,10,27,4,1,'#0d1016')}
 if(s.detail==='jacket'){rect(c,7,27,2,5,'#64735e');rect(c,15,27,2,5,'#64735e');rect(c,11,27,2,5,'#1d2c24')}
 if(s.detail==='tunic'){rect(c,8,27,2,5,s.accent);rect(c,14,27,2,5,s.accent);rect(c,10,28,4,1,'#a9b8c8')}
 if(s.detail==='armor'){rect(c,6,27,4,4,s.accent);rect(c,14,27,4,4,s.accent);rect(c,9,28,6,3,s.shirt);rect(c,10,29,4,1,'#c6c9cf')}
 if(s.detail==='blindfold'){rect(c,7,13,10,2,'#151a22');rect(c,8,15,8,1,s.accent)}
 if(s.detail==='scar'){rect(c,13,15,1,5,'#9b4c4c');rect(c,14,17,1,1,'#9b4c4c')}
 if(s.detail==='mask'){rect(c,7,16,10,6,'#16181d');rect(c,9,17,2,1,s.accent);rect(c,13,17,2,1,s.accent);rect(c,10,20,4,1,'#303740')}
 if(s.detail==='cloak'){rect(c,5,27,14,5,'#15151a');rect(c,7,27,2,1,s.accent);rect(c,15,27,2,1,s.accent);rect(c,10,28,4,1,s.accent)}
 if(s.detail==='flowing'){rect(c,7,27,3,5,s.accent);rect(c,14,27,3,5,s.accent);rect(c,10,27,4,1,'#eef1f5')}
 rect(c,5,32,6,1,s.accent); rect(c,13,32,6,1,s.accent);
 rect(c,8,11,1,2,'rgba(255,255,255,.14)'); rect(c,15,11,1,2,'rgba(255,255,255,.10)');
}
function panelHtml(idx){const s=CHARS[idx];return `<div class="btm-pixel-stage" style="--char-color:${COLORS[idx]}"><div class="btm-pixel-aura"></div><canvas class="btm-pixel-canvas" width="96" height="128" aria-label="Pixel-art ${s.name}"></canvas><div class="btm-pixel-name">${s.name.toUpperCase()}</div></div>`}
function render(idx){const panel=$('btm-selected-emblem-panel');if(!panel)return;panel.className='btm-pixel-panel';panel.innerHTML=panelHtml(idx);const cv=panel.querySelector('canvas');sprite(cv,CHARS[idx]);panel.style.setProperty('--emblem-color',COLORS[idx]);}
function activeIndex(){const grid=$('weekGrid');if(!grid)return 0;const bs=[...grid.querySelectorAll('.week')];const i=bs.findIndex(b=>b.classList.contains('active'));return i<0?0:i}
function boot(){const panel=$('btm-selected-emblem-panel');if(!panel){setTimeout(boot,40);return}render(activeIndex());const grid=$('weekGrid');if(grid&&!grid.__btmPixelBound){grid.addEventListener('click',()=>{requestAnimationFrame(()=>render(activeIndex()))});grid.__btmPixelBound=true}}
const style=document.createElement('style');style.textContent=`
.btm-pixel-panel{position:relative;display:flex!important;align-items:center;justify-content:flex-end;min-height:150px;border:1px solid color-mix(in srgb,var(--emblem-color) 42%,#294656)!important;border-radius:8px;background:radial-gradient(circle at 68% 45%,color-mix(in srgb,var(--emblem-color) 17%,transparent),transparent 58%),#09141b;overflow:hidden;transition:border-color .25s ease,box-shadow .25s ease}.btm-pixel-stage{position:relative;width:175px;height:150px;display:flex;align-items:flex-end;justify-content:center;isolation:isolate}.btm-pixel-canvas{width:112px;height:150px;image-rendering:pixelated;image-rendering:crisp-edges;position:relative;z-index:2;filter:drop-shadow(0 0 7px color-mix(in srgb,var(--char-color) 22%,transparent));transition:transform .25s ease,filter .25s ease}.btm-pixel-aura{position:absolute;width:110px;height:110px;border-radius:50%;right:32px;bottom:17px;background:radial-gradient(circle,color-mix(in srgb,var(--char-color) 20%,transparent),transparent 68%);filter:blur(9px);opacity:.72;z-index:0}.btm-pixel-name{position:absolute;left:12px;bottom:9px;z-index:3;font:7px 'JetBrains Mono';letter-spacing:.14em;color:color-mix(in srgb,var(--char-color) 74%,#8195a3);opacity:.9}.btm-pixel-panel:hover{border-color:color-mix(in srgb,var(--char-color) 65%,#294656)!important;box-shadow:inset 0 0 24px color-mix(in srgb,var(--char-color) 7%,transparent),0 0 22px color-mix(in srgb,var(--char-color) 8%,transparent)}.btm-pixel-panel:hover .btm-pixel-canvas{transform:translateY(-3px);filter:drop-shadow(0 0 12px color-mix(in srgb,var(--char-color) 48%,transparent)) brightness(1.06)}.btm-pixel-panel .btm-pixel-canvas{animation:btmPixelIn .3s ease both}.btm-pixel-panel.is-changing .btm-pixel-canvas{opacity:0;transform:translateY(4px) scale(.97)}@keyframes btmPixelIn{from{opacity:0;transform:translateY(4px) scale(.97)}to{opacity:1;transform:none}}@media(max-width:700px){.btm-pixel-stage{width:130px}.btm-pixel-canvas{width:88px;height:118px}.btm-pixel-name{display:none}}@media(prefers-reduced-motion:reduce){.btm-pixel-canvas{animation:none!important;transition:none!important}}
`;document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
