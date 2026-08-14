/* Build The Machine, training exercise schema migration.
   Preserves existing completion/log data while remapping only exercise indices
   changed by the standardized HUMAN BUILD SPEC prescription.
*/
(()=>{
  'use strict';
  const VERSION='2';
  if(localStorage.getItem('btm_training_schema')===VERSION)return;

  let state={};
  try{state=JSON.parse(localStorage.getItem('btm_progress')||'{}')||{}}catch{state={}};

  // Old schema:
  // Tue = [pull, dips, rows, push, scapular, hollow]
  // Thu = [bulg, squat, calf, wall, knee, hollow, side]
  // Fri = [chin, pike, diamond, close-chin, dips, l-sit, hang]
  // New spec:
  // Tue = [pull, chin, dips, rows, push]
  // Thu = [bulg, tempo/pistol, calf, wall, knee, hollow, side]
  // Sat = [l-sit, pike, diamond, decline push-ups, close dips, flexed-arm hang]
  const map={
    0:{0:0,1:2,2:3,3:4},
    1:{0:0,2:2,3:3,4:4,5:5,6:6},
    2:{1:1,2:2,5:0,6:5}
  };

  const migrated={};
  for(const[key,value]of Object.entries(state)){
    const parts=key.split('|');
    if(parts.length!==3){migrated[key]=value;continue}
    const oldDay=Number(parts[1]),oldEx=Number(parts[2]);
    const newEx=map[oldDay]?.[oldEx];
    if(newEx===undefined){if(oldDay>2)migrated[key]=value;continue}
    const newKey=`${parts[0]}|${oldDay}|${newEx}`;
    if(!migrated[newKey])migrated[newKey]=value;
  }

  localStorage.setItem('btm_progress',JSON.stringify(migrated));
  localStorage.setItem('btm_training_schema',VERSION);
})();
