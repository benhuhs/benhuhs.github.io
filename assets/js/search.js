(function () {
  var script = document.currentScript;
  var indexUrl = script.getAttribute('data-index');
  var input = document.querySelector('[data-search-input]');
  var list = document.querySelector('[data-search-results]');
  var status = document.querySelector('[data-search-status]');
  if (!input || !list) return;

  var posts = null;
  var timer = null;

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function highlight(text, terms) {
    var out = escapeHtml(text);
    terms.forEach(function (t) {
      var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
      out = out.replace(re, '<mark>$1</mark>');
    });
    return out;
  }

  function snippet(content, terms) {
    var lower = content.toLowerCase();
    var pos = -1;
    for (var i = 0; i < terms.length && pos < 0; i++) pos = lower.indexOf(terms[i]);
    if (pos < 0) return content.slice(0, 110);
    var start = Math.max(0, pos - 40);
    return (start > 0 ? '…' : '') + content.slice(start, start + 120) + '…';
  }

  function score(p, terms) {
    var title = p.title.toLowerCase();
    var meta = (p.category + ' ' + p.tags + ' ' + p.desc).toLowerCase();
    var body = p.content.toLowerCase();
    var s = 0;
    for (var i = 0; i < terms.length; i++) {
      var t = terms[i];
      var hit = 0;
      if (title.indexOf(t) >= 0) hit += 10;
      if (meta.indexOf(t) >= 0) hit += 4;
      if (body.indexOf(t) >= 0) hit += 1;
      if (!hit) return 0; // every term must match somewhere
      s += hit;
    }
    return s;
  }

  function render(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) {
      list.innerHTML = '';
      status.textContent = '전체 글 ' + posts.length + '개';
      return;
    }
    var hits = posts
      .map(function (p) { return { p: p, s: score(p, terms) }; })
      .filter(function (r) { return r.s > 0; })
      .sort(function (a, b) { return b.s - a.s; });

    status.textContent = hits.length ? '검색 결과 ' + hits.length + '개' : '';
    if (!hits.length) {
      list.innerHTML = '<li class="empty">“' + escapeHtml(q) + '”에 맞는 글이 없습니다.</li>';
      return;
    }
    list.innerHTML = hits.map(function (r) {
      var p = r.p;
      return '<li class="post-item search-item"><a class="post-link" href="' + escapeHtml(p.url) + '">' +
        '<time class="post-date mono">' + escapeHtml(p.date) + '</time>' +
        '<span class="post-title">' + highlight(p.title, terms) +
        '<span class="search-snippet">' + highlight(snippet(p.content, terms), terms) + '</span></span>' +
        (p.category ? '<span class="post-cat">' + escapeHtml(p.category) + '</span>' : '') +
        '</a></li>';
    }).join('');
  }

  function update() {
    if (!posts) return;
    var q = input.value.trim();
    var url = new URL(location.href);
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    render(q);
  }

  input.form && input.form.addEventListener('submit', function (e) { e.preventDefault(); update(); });
  input.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  });

  status.textContent = '불러오는 중…';
  fetch(indexUrl)
    .then(function (r) { return r.json(); })
    .then(function (data) {
      posts = data;
      var q = new URLSearchParams(location.search).get('q') || '';
      input.value = q;
      render(q.trim());
      input.focus();
    })
    .catch(function () { status.textContent = '검색 목록을 불러오지 못했습니다.'; });
})();
