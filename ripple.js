/* Build The Machine, lightweight ripple interaction */
(() => {
  const major = [
    '.week', '.btm-nav .btn', '.stat', '.panel', '.day-head',
    '.food-week', '.daily-tracker', '.progress-card', '.tracker-card',
    '.major-interactive', '.progress-section'
  ];
  const apply = () => {
    document.querySelectorAll(major.join(',')).forEach(el => {
      if (!el.classList.contains('btm-ripple')) el.classList.add('btm-ripple');
    });
  };
  const pulse = e => {
    const el = e.target.closest('.btm-ripple');
    if (!el) return;
    el.classList.remove('btm-ripple-active');
    void el.offsetWidth;
    el.classList.add('btm-ripple-active');
    setTimeout(() => el.classList.remove('btm-ripple-active'), 900);
  };
  apply();
  new MutationObserver(apply).observe(document.body, {childList:true,subtree:true});
  document.addEventListener('click', pulse, {passive:true});
})();
