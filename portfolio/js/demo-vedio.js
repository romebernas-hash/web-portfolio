(function () {
  var modal = document.getElementById('vmodal');
  if (!modal) return;
  var player = document.getElementById('vPlayer'),
      title  = document.getElementById('vTitle'),
      miss   = document.getElementById('vMiss'),
      closeB = document.getElementById('vClose'),
      last = null;

  function open(btn) {
    last = btn;
    title.textContent = btn.dataset.title || 'Project demo';
    miss.hidden = true; player.hidden = false;
    player.poster = btn.dataset.poster || '';
    player.src = btn.dataset.video;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    closeB.focus();
    var p = player.play();
    if (p && p.catch) p.catch(function () {});
  }

  function close() {
    player.pause();
    player.removeAttribute('src');
    player.load();                       // stops downloading
    modal.classList.remove('show');
    document.body.style.overflow = '';
    if (last) last.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-video]');
    if (b) { e.preventDefault(); open(b); }
  });
  closeB.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('show')) close();
  });
  player.addEventListener('error', function () {
    if (!player.getAttribute('src')) return;
    player.hidden = true; miss.hidden = false;   // file missing or wrong path
  });
})();