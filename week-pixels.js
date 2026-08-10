/* Week selector pixel companions, generated as lightweight inline SVG so no external image assets are required. */
(()=>{
  const CHARACTERS=[
    {name:'Goku',hair:'#111820',skin:'#c98968',outfit:'#e67e22',accent:'#f2b33d',style:'spike',detail:'belt'},
    {name:'Tanjiro',hair:'#261b25',skin:'#c98f72',outfit:'#182126',accent:'#294d3d',style:'fringe',detail:'check'},
    {name:'Yuji',hair:'#c98b8c',skin:'#c99176',outfit:'#18222d',accent:'#304a68',style:'short',detail:'collar'},
    {name:'Eren',hair:'#33251f',skin:'#c78e70',outfit:'#263f45',accent:'#516b59',style:'long',detail:'cloak'},
    {name:'Thorfinn',hair:'#d7b36f',skin:'#d19a78',outfit:'#34444c',accent:'#718a95',style:'braid',detail:'tunic'},
    {name:'Vegeta',hair:'#10161f',skin:'#c88767',outfit:'#234c79',accent:'#dfe6ef',style:'upright',detail:'glove'},
    {name:'Gojo',hair:'#d7e2e9',skin:'#d39a7c',outfit:'#111923',accent:'#5b9ed2',style:'white',detail:'blindfold'},
    {name:'Toji',hair:'#171b1f',skin:'#c78a6c',outfit:'#2d403d',accent:'#6d7d73',style:'messy',detail:'scar'},
    {name:'Kaneki',hair:'#eef2f3',skin:'#c88f73',outfit:'#171c24',accent:'#8f303e',style:'whitefringe',detail:'eye'},
    {name:'Itachi',hair:'#11151b',skin:'#c88f73',outfit:'#171b24',accent:'#7d2635',style:'longbang',detail:'cloak'},
    {name:'Griffith',hair:'#efe5cf',skin:'#d6a384',outfit:'#e2e8eb',accent:'#b7c5cf',style:'flow',detail:'armor'},
    {name:'Guts',hair:'#15181d',skin:'#b98268',outfit:'#20252b',accent:'#6c747b',style:'spike',detail:'sword'}
  ];

  const rect=(x,y,w,h,fill,cls='px')=>`<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
  const sprite=(c)=>{
    const s=[];
    const skin=c.skin, hair=c.hair, outfit=c.outfit, a=c.accent;
    // Head and neck, kept deliberately blocky for a true pixel-art feel.
    s.push(rect(5,6,6,6,skin),rect(6,12,4,2,skin));
    // Hair silhouettes, with character-specific shapes.
    if(c.style==='spike') s.push(rect(4,4,8,3,hair),rect(3,5,2,3,hair),rect(5,2,2,3,hair),rect(7,1,2,4,hair),rect(9,2,2,3,hair),rect(11,4,2,3,hair));
    if(c.style==='fringe') s.push(rect(4,3,8,4,hair),rect(3,5,2,5,hair),rect(5,6,2,2,a),rect(7,5,2,2,hair),rect(9,6,2,2,hair),rect(11,5,2,4,hair));
    if(c.style==='short') s.push(rect(4,4,8,3,hair),rect(4,6,2,2,hair),rect(6,6,2,2,a),rect(8,6,2,2,hair),rect(10,6,2,2,hair));
    if(c.style==='long') s.push(rect(4,3,8,4,hair),rect(3,5,2,8,hair),rect(11,5,2,9,hair),rect(5,6,2,2,hair),rect(7,6,2,2,hair));
    if(c.style==='braid') s.push(rect(4,3,8,3,hair),rect(3,5,2,7,hair),rect(11,5,2,7,hair),rect(5,6,2,2,hair),rect(7,6,2,2,a),rect(9,6,2,2,hair),rect(12,10,2,3,hair));
    if(c.style==='upright') s.push(rect(4,4,8,3,hair),rect(4,2,2,4,hair),rect(6,1,2,5,hair),rect(8,0,2,6,hair),rect(10,2,2,4,hair),rect(12,4,2,3,hair));
    if(c.style==='white') s.push(rect(4,3,8,4,hair),rect(3,5,2,4,hair),rect(11,5,2,4,hair),rect(5,6,2,2,hair),rect(7,6,2,2,hair),rect(9,6,2,2,hair));
    if(c.style==='messy') s.push(rect(4,3,8,4,hair),rect(3,4,2,5,hair),rect(5,2,2,3,hair),rect(8,2,2,3,hair),rect(11,4,3,4,hair),rect(6,6,2,2,a));
    if(c.style==='whitefringe') s.push(rect(4,3,8,4,hair),rect(3,5,2,5,hair),rect(11,5,2,4,hair),rect(5,6,2,2,hair),rect(7,6,2,3,hair),rect(9,6,2,2,hair));
    if(c.style==='longbang') s.push(rect(4,3,8,4,hair),rect(3,5,2,9,hair),rect(11,5,2,9,hair),rect(5,6,2,3,hair),rect(7,6,2,4,hair));
    if(c.style==='flow') s.push(rect(4,3,8,4,hair),rect(3,5,2,8,hair),rect(11,5,2,7,hair),rect(5,6,2,3,hair),rect(8,5,2,4,hair),rect(10,6,2,3,hair));
    // Face, eyes, and a tiny character-specific mark.
    s.push(rect(6,9,1,1,'#10151a'),rect(9,9,1,1,'#10151a'));
    if(c.detail==='blindfold') s.push(rect(5,8,6,2,'#0a0e13'),rect(10,8,1,1,a));
    if(c.detail==='eye') s.push(rect(9,9,1,1,a),rect(10,10,1,1,a));
    if(c.detail==='scar') s.push(rect(7,10,1,2,'#7e3f45'));
    // Neck, torso and clothing.
    s.push(rect(5,13,6,2,outfit),rect(4,15,8,5,outfit),rect(3,17,2,3,outfit),rect(11,17,2,3,outfit));
    if(c.detail==='belt') s.push(rect(5,15,6,1,a),rect(7,15,2,1,'#28251d'));
    if(c.detail==='check') s.push(rect(4,16,2,2,a),rect(8,16,2,2,a),rect(6,18,2,2,a),rect(10,18,2,2,a));
    if(c.detail==='collar') s.push(rect(5,13,2,3,a),rect(9,13,2,3,a));
    if(c.detail==='cloak') s.push(rect(3,15,2,5,a),rect(11,15,2,5,a));
    if(c.detail==='tunic') s.push(rect(7,14,2,5,a));
    if(c.detail==='glove') s.push(rect(3,18,2,2,a),rect(11,18,2,2,a));
    if(c.detail==='armor') s.push(rect(5,14,6,2,a),rect(6,16,4,4,'#c5cfd5'));
    if(c.detail==='sword') s.push(rect(13,7,1,13,'#9aa6ad'),rect(14,6,1,2,'#dce5ea'),rect(12,12,2,1,a));
    return `<svg viewBox="0 0 16 20" role="img" aria-label="Pixel art ${c.name}" xmlns="http://www.w3.org/2000/svg">${s.join('')}</svg>`;
  };

  const install=()=>{
    if(document.getElementById('btm-week-pixels-link'))return;
    const link=document.createElement('link');link.id='btm-week-pixels-link';link.rel='stylesheet';link.href='./week-pixels.css';document.head.appendChild(link);
  };
  const apply=()=>{
    const grid=document.getElementById('weekGrid'); if(!grid)return;
    [...grid.querySelectorAll('.week')].slice(0,12).forEach((card,i)=>{
      if(card.querySelector('.btm-week-pixel'))return;
      const c=CHARACTERS[i];
      const wrap=document.createElement('span');
      wrap.className='btm-week-pixel';
      wrap.dataset.character=c.name;
      wrap.title=c.name;
      wrap.setAttribute('aria-hidden','true');
      wrap.innerHTML=sprite(c);
      card.appendChild(wrap);
    });
  };
  const boot=()=>{
    install(); apply();
    const grid=document.getElementById('weekGrid');
    if(grid)new MutationObserver(apply).observe(grid,{childList:true,subtree:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
