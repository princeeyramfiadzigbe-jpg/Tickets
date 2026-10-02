(function () {
  /* Edit this list to change the events on the page. Dates are YYYY-MM-DD. */
  var EVENTS = [
    { title: 'The Champion Album Listening', date: '2024-07-23', venue: "Rockstone's Office", img: 'img/champion-album.jpg', alt: 'Singer in a dark shirt pointing upward on a red and purple stage', cat: 'Concerts' },
    { title: 'Davido', date: '2024-08-12', venue: 'O2 Arena', img: 'img/davido.jpg', alt: 'Large arena crowd facing a lit stage', cat: 'Concerts' },
    { title: 'Kofi Kinaata Made in Taadi', date: '2024-09-05', venue: 'PZ', img: 'img/kofi-kinaata.jpg', alt: 'Crowd silhouettes in front of a bright stage glow', cat: 'Concerts' },
    { title: 'TEG Live', date: '2024-09-05', venue: 'First Love Centre', img: 'img/teg-live.jpg', alt: 'Defe Defe event banner', cat: 'Concerts', contain: true }
  ];

  var state = { cat: 'All', q: '', d: '' };
  var grid = document.getElementById('grid');
  var empty = document.getElementById('empty');
  var count = document.getElementById('count');
  var chips = document.querySelectorAll('.chip');

  function parts(iso) {
    var dt = new Date(iso + 'T00:00:00');
    return {
      day: dt.getDate(),
      mon: dt.toLocaleDateString('en-GB', { month: 'short' }),
      full: dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }

  function render() {
    var q = state.q.trim().toLowerCase();
    var list = EVENTS.filter(function (e) {
      return (state.cat === 'All' || e.cat === state.cat) &&
        (!q || (e.title + ' ' + e.venue).toLowerCase().indexOf(q) > -1) &&
        (!state.d || e.date === state.d);
    });
    grid.innerHTML = list.map(function (e) {
      var p = parts(e.date);
      return '<article class="ticket">' +
        '<div class="t-media' + (e.contain ? ' contain' : '') + '"><img src="' + e.img + '" alt="' + esc(e.alt) + '" loading="lazy"></div>' +
        '<div class="t-body"><time class="t-date" datetime="' + e.date + '"><b>' + p.day + '</b><span>' + p.mon + '</span></time>' +
        '<div><h3>' + esc(e.title) + '</h3><p class="t-venue"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z"/></svg>' + esc(e.venue) + '</p></div></div>' +
        '<div class="perf"></div>' +
        '<div class="t-foot"><span>' + p.full + '</span><button class="btn btn-small" data-buy="' + esc(e.title) + '">Get tickets</button></div>' +
        '</article>';
    }).join('');
    empty.hidden = list.length > 0;
    count.textContent = list.length + (list.length === 1 ? ' event' : ' events');
    chips.forEach(function (c) { c.setAttribute('aria-pressed', c.dataset.cat === state.cat); });
  }

  function setCat(cat) { state.cat = cat; render(); }

  chips.forEach(function (c) { c.addEventListener('click', function () { setCat(c.dataset.cat); }); });
  document.querySelectorAll('a[data-cat]').forEach(function (a) {
    a.addEventListener('click', function () { setCat(a.dataset.cat); closeMenu(); });
  });

  document.getElementById('search').addEventListener('submit', function (e) {
    e.preventDefault();
    state.q = document.getElementById('q').value;
    state.d = document.getElementById('d').value;
    render();
    document.getElementById('events').scrollIntoView();
  });
  document.getElementById('clear').addEventListener('click', function () {
    state = { cat: 'All', q: '', d: '' };
    document.getElementById('q').value = '';
    document.getElementById('d').value = '';
    render();
  });

  /* mobile menu */
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  function closeMenu() { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  /* auth dialog */
  var dlg = document.getElementById('auth');
  var form = document.getElementById('auth-form');
  var note = document.getElementById('auth-note');
  var mode = 'signin';

  function setMode(m, sub) {
    mode = m;
    var up = m === 'signup';
    document.getElementById('auth-title').textContent = up ? 'Create account' : 'Sign in';
    document.getElementById('auth-submit').textContent = up ? 'Create account' : 'Sign in';
    document.getElementById('auth-sub').textContent = sub || (up ? 'Create an account to buy tickets and keep track of your orders.' : 'Sign in to buy tickets and keep track of your orders.');
    document.getElementById('name-row').hidden = !up;
    document.getElementById('signin-extras').hidden = up;
    form.elements.password.autocomplete = up ? 'new-password' : 'current-password';
    document.getElementById('tab-signin').setAttribute('aria-selected', !up);
    document.getElementById('tab-signup').setAttribute('aria-selected', up);
    note.textContent = '';
  }

  function openAuth(m, sub) { setMode(m || 'signin', sub); if (!dlg.open) dlg.showModal(); }

  document.querySelectorAll('[data-open-auth]').forEach(function (b) {
    b.addEventListener('click', function () { closeMenu(); openAuth(b.dataset.openAuth); });
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-buy]');
    if (b) openAuth('signin', 'Sign in to buy tickets for ' + b.dataset.buy + '.');
  });
  document.querySelectorAll('.tabs button').forEach(function (t) {
    t.addEventListener('click', function () { setMode(t.dataset.mode); });
  });
  document.getElementById('auth-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  document.getElementById('forgot').addEventListener('click', function (e) {
    e.preventDefault();
    note.textContent = 'Password reset is not connected yet.';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    var checks = { email: /^\S+@\S+\.\S+$/.test(f.email.value), password: f.password.value.length >= 6 };
    if (mode === 'signup') checks.name = f.name.value.trim().length > 0;
    ['name', 'email', 'password'].forEach(function (n) {
      if (!(n in checks)) { f[n].removeAttribute('aria-invalid'); return; }
      f[n].setAttribute('aria-invalid', !checks[n]);
      if (!checks[n]) ok = false;
    });
    if (!ok) { note.textContent = 'Check the highlighted fields. Passwords need at least 6 characters.'; return; }
    note.textContent = 'Accounts are not connected yet. This form is ready to link to your sign-in service.';
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  render();
})();
