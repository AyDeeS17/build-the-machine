/* Single Week naming layer for every dashboard section. */
(()=>{
'use strict';
if(window.__BTM_WEEK_CONSISTENCY__)return;
window.__BTM_WEEK_CONSISTENCY__=1;
const W=window.BTM_WEEKS||[];
const apply=()=>{document.querySelectorAll('.btm-v5-week').forEach((el,i)=>{const w=W[i];if(!w)return;el.dataset.weekId=w.id;const b=el.querySelector('b');if(b)b.textContent='WEEK '+w.id;const span=el.querySelector('span');if(span)span.textContent=w.rank;el.style.setProperty('--week-color',w.color)});document.querySelectorAll('#foodWeeks .week,#runWeeks .week,#sleepWeeks .week').forEach((el,i)=>{const w=W[i];if(!w)return;el.dataset.weekId=w.id;const b=el.querySelector('b'),span=el.querySelector('span');if(b)b.textContent='WEEK '+w.id;if(span)span.textContent=w.rank;el.style.setProperty('--week-color',w.color)})};
const boot=()=>{apply();const mo=new MutationObserver(()=>{clearTimeout(mo.t);mo.t=setTimeout(apply,10)});mo.observe(document.body,{childList:true,subtree:true});setTimeout(apply,250);setTimeout(apply,1000)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

/* Global app controls: persistent Dark Mode, current logo, and automatic PWA updates. */
(()=>{
'use strict';
const THEME_KEY='btm_theme';
const applyTheme=theme=>{document.documentElement.dataset.btmTheme=theme;document.documentElement.style.colorScheme='dark';const b=document.getElementById('btmThemeToggle');if(b){const dark=theme==='dark';b.setAttribute('aria-pressed',dark?'true':'false');b.innerHTML=dark?'☾ DARK':'☼ NORMAL'}};
const injectStyles=()=>{if(document.getElementById('btm-theme-style'))return;const s=document.createElement('style');s.id='btm-theme-style';s.textContent=`
body,.panel,.stat,.rank-panel,.nav,.btn,.week,.exercise,.day-head,.chart{transition:background-color .45s ease,border-color .45s ease,color .45s ease,box-shadow .45s ease,background .45s ease}
header{position:relative}.btm-brand-logo{position:absolute;right:0;top:18px;width:54px;height:54px;border-radius:14px;object-fit:cover;filter:drop-shadow(0 0 12px rgba(32,155,234,.28));transition:transform .25s ease,filter .25s ease}.btm-brand-logo:hover{transform:translateY(-1px);filter:drop-shadow(0 0 18px rgba(32,155,234,.45))}.btm-theme-toggle{position:absolute;right:68px;top:22px;min-width:92px;height:38px;padding:0 12px;border:1px solid #294656;border-radius:7px;background:#0b151c;color:#9fb2bf;font:700 9px 'JetBrains Mono';letter-spacing:.08em;cursor:pointer;transition:background-color .25s ease,border-color .25s ease,color .25s ease,box-shadow .25s ease,transform .18s ease}.btm-theme-toggle:hover{border-color:#66b9df;color:#e8f5fa;box-shadow:0 0 18px rgba(102,185,223,.14);transform:translateY(-1px)}.btm-theme-toggle:active{transform:scale(.98)}
html[data-btm-theme="dark"]{--bg:#020509;--panel:#080d13;--panel2:#0c131b;--line:#203747;--text:#f0f5f8;--muted:#718897}.btm-theme-toggle[aria-pressed="true"]{border-color:#4f8db3;color:#d9effc;background:#08131c;box-shadow:0 0 16px rgba(32,155,234,.12)}html[data-btm-theme="dark"] body{background:radial-gradient(circle at 50% -10%,rgba(20,104,170,.18),transparent 40%),#020509}html[data-btm-theme="dark"] .panel,html[data-btm-theme="dark"] .stat,html[data-btm-theme="dark"] .rank-panel{background:linear-gradient(145deg,#0b131c,#050a0f)}html[data-btm-theme="dark"] .nav{background:#060c12}html[data-btm-theme="dark"] .btn,html[data-btm-theme="dark"] .week,html[data-btm-theme="dark"] .feel button{background:#050b11}html[data-btm-theme="dark"] .exercise{background:#070d13}html[data-btm-theme="dark"] .day-head{background:linear-gradient(135deg,#0d1b25,#071018)}html[data-btm-theme="dark"] .chart{background:#050a0f}html[data-btm-theme="dark"] .btm-theme-toggle{background:#050b11}
@media(max-width:500px){.btm-brand-logo{width:44px;height:44px;top:12px;border-radius:11px}.btm-theme-toggle{right:54px;top:15px;min-width:82px;height:34px;font-size:8px}.sub{padding-right:145px}}
`;
document.head.appendChild(s)};
const injectControls=()=>{const header=document.querySelector('header');if(!header)return;if(!document.querySelector('link[data-btm-apple-icon]')){const l=document.createElement('link');l.rel='apple-touch-icon';l.href='./apple-touch-icon.png';l.dataset.btmAppleIcon='1';document.head.appendChild(l)}if(!document.getElementById('btmBrandLogo')){const img=document.createElement('img');img.id='btmBrandLogo';img.className='btm-brand-logo';img.src='./icon.svg';img.alt='Build The Machine';header.appendChild(img)}if(!document.getElementById('btmThemeToggle')){const b=document.createElement('button');b.id='btmThemeToggle';b.className='btm-theme-toggle';b.type='button';b.addEventListener('click',()=>{const next=(document.documentElement.dataset.btmTheme||'normal')==='dark'?'normal':'dark';localStorage.setItem(THEME_KEY,next);applyTheme(next)});header.appendChild(b)}applyTheme(localStorage.getItem(THEME_KEY)||'normal')};
const registerSW=()=>{if(!('serviceWorker' in navigator))return;navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{reg.update().catch(()=>{});document.addEventListener('visibilitychange',()=>{if(!document.hidden)reg.update().catch(()=>{})})}).catch(()=>{})};
const boot=()=>{injectStyles();injectControls();registerSW()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
