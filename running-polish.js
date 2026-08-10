/* Running schedule + daily selector polish. Keeps only Mon/Wed/Fri as active running sessions. */
(()=>{
  'use strict';
  const ACTIVE_DAYS=new Set([0,2,4]);
  const RUN_KEY='btm_running';
  const BACKUP_KEY='btm_running_non_training_backup_v1';
  const cleanRunningData=()=>{
    let data={},backup={};
    try{data=JSON.parse(localStorage.getItem(RUN_KEY)||'{}')||{}}catch{}
    try{backup=JSON.parse(localStorage.getItem(BACKUP_KEY)||'{}')||{}}catch{}
    let changed=false;
    Object.keys(data).forEach(k=>{
      const m=k.match(/^w(\d+)s([0-6])$/); if(!m)return;
      const day=Number(m[2]);
      if(!ACTIVE_DAYS.has(day)){backup[k]=data[k];delete data[k];changed=true;}
    });
    if(changed){localStorage.setItem(RUN_KEY,JSON.stringify(data));localStorage.setItem(BACKUP_KEY,JSON.stringify(backup));}
  };
  const polishDays=()=>{
    const days=document.getElementById('runDays'); if(!days)return;
    [...days.children].forEach((el,i)=>el.classList.toggle('run-nontraining-day',![0,2,4].includes(i)));
    days.dataset.sessions='3';
  };
  const boot=()=>{
    cleanRunningData(); polishDays();
    const days=document.getElementById('runDays');
    if(days)new MutationObserver(polishDays).observe(days,{childList:true});
    if(document.body.dataset.section==='running')document.getElementById('runningBtn')?.click();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else setTimeout(boot,0);
})();
