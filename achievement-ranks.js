/* Build The Machine, single source of truth for Week achievement ranks. */
(()=>{
'use strict';
if(window.BTMWeekRanksData)return;
const RANKS=[
 ['NOVICE','Every expert was once willing to begin.'],
 ['BEGINNER','Small steps become serious progress when you refuse to stop.'],
 ['TRAINEE','Consistency turns effort into ability.'],
 ['APPRENTICE','Skill grows when discipline becomes routine.'],
 ['SKILLED','You are no longer learning the work, you are becoming the work.'],
 ['ADVANCED','Discipline begins where excuses lose their power.'],
 ['RECOVERY','Recovery is not retreat, it is how strength prepares to rise again.'],
 ['ELITE','You earned your place by doing what most people abandon.'],
 ['EXPERT','Control your effort, sharpen your execution, raise your standard.'],
 ['MASTER','Mastery is built through consistency when motivation disappears.'],
 ['GRANDMASTER','At this level, discipline is no longer an action, it is an identity.'],
 ['LEGEND','The final level is not the end, it is proof of what you became.']
];
window.BTMWeekRanksData={ranks:RANKS};
})();
