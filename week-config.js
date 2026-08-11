window.BTM_WEEKS = Object.freeze([
  { id: 1, rank: 'NOVICE', color: '#66b9df', isDeload: false },
  { id: 2, rank: 'BEGINNER', color: '#71c7b4', isDeload: false },
  { id: 3, rank: 'TRAINEE', color: '#8ccf6b', isDeload: false },
  { id: 4, rank: 'APPRENTICE', color: '#c9d35c', isDeload: false },
  { id: 5, rank: 'SKILLED', color: '#e4bd5b', isDeload: false },
  { id: 6, rank: 'ADVANCED', color: '#e69a57', isDeload: false },
  { id: 7, rank: 'RECOVERY', color: '#d97878', isDeload: true },
  { id: 8, rank: 'ELITE', color: '#c86fc4', isDeload: false },
  { id: 9, rank: 'EXPERT', color: '#b978e6', isDeload: false },
  { id: 10, rank: 'MASTER', color: '#8d8fe8', isDeload: false },
  { id: 11, rank: 'GRANDMASTER', color: '#6f9ee8', isDeload: false },
  { id: 12, rank: 'LEGEND', color: '#66b9df', isDeload: false }
]);

(()=>{
  const load=src=>{const s=document.createElement('script');s.src=`./${src}?v=6`;s.defer=false;document.head.appendChild(s)};
  const boot=()=>{load('pwa-update.js');load('training-days.js')};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
