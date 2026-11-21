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

(function () {
  var btn = document.querySelector('.menu-btn'), side = document.getElementById('side');
  if (!btn || !side) return;
  var root = document.documentElement, mq = window.matchMedia('(max-width: 900px)');
  function sync() {
    var open = mq.matches ? root.classList.contains('side-open') : !root.classList.contains('side-hidden');
    btn.setAttribute('aria-expanded', open);
  }
  btn.addEventListener('click', function () {
    if (mq.matches) { root.classList.toggle('side-open'); }
    else {
      var hidden = root.classList.toggle('side-hidden');
      try { localStorage.setItem('side', hidden ? 'hidden' : 'shown'); } catch (e) {}
    }
    sync();
  });
  side.addEventListener('click', function (e) {
    if (mq.matches && e.target === side) { root.classList.remove('side-open'); sync(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && root.classList.contains('side-open')) { root.classList.remove('side-open'); sync(); btn.focus(); }
  });
  if (mq.addEventListener) mq.addEventListener('change', sync);
  sync();
  requestAnimationFrame(function () { requestAnimationFrame(function () { root.classList.add('side-ready'); }); });
})();

(function () {
  var input = document.querySelector('[data-cat-filter]');
  if (!input) return;
  var items = Array.prototype.slice.call(document.querySelectorAll('[data-cat-list] > li'));
  var count = document.querySelector('[data-cat-count]'), empty = document.querySelector('[data-cat-empty]');
  var total = count ? count.getAttribute('data-total') : items.length;
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase(), shown = 0;
    items.forEach(function (li) {
      var t = li.querySelector('.post-title'), c = li.querySelector('.post-cat');
      var hay = ((t ? t.textContent : '') + ' ' + (c ? c.textContent : '')).toLowerCase();
      var hit = !q || hay.indexOf(q) !== -1;
      li.hidden = !hit; if (hit) shown++;
    });
    if (count) count.textContent = q ? '글 ' + total + '개 중 ' + shown + '개' : '글 ' + total + '개';
    if (empty) empty.hidden = shown !== 0;
  });
})();

(function () {
  var box = document.getElementById('search');
  if (!box) return;
  var input = box.querySelector('input');
  function go(smooth) {
    box.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    input.focus({ preventScroll: true });
  }
  if (location.hash === '#search') setTimeout(function () { go(false); }, 0);
  var link = document.querySelector('.search-link');
  if (link) link.addEventListener('click', function (e) { e.preventDefault(); history.replaceState(null, '', '#search'); go(true); });
})();
