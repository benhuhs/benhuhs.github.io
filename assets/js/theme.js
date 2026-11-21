(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

(function () {
  var btn = document.querySelector('.dd-btn'), menu = document.getElementById('dd-cats');
  if (!btn || !menu) return;
  function set(open) { btn.setAttribute('aria-expanded', open); menu.hidden = !open; }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
  document.addEventListener('click', function (e) { if (!menu.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); btn.focus(); } });
})();
