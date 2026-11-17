/* Shortlist filter and section entrances. The page reads completely without this file. */
(function () {
  'use strict';

  // entrances: reveal the parts of each section once, as they come into view
  var parts = Array.prototype.slice.call(document.querySelectorAll('[data-in]'));
  function showAll() { parts.forEach(function (el) { el.classList.add('in'); }); }
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    showAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    parts.forEach(function (el) { io.observe(el); });
    // safety net: nothing stays hidden if the observer never fires
    window.setTimeout(function () {
      parts.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
      });
    }, 1800);
  }

  // the one moving picture: stop it for visitors who asked for less motion
  var clip = document.querySelector('.band video');
  if (clip && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    clip.removeAttribute('autoplay'); clip.pause();
  }

  // shortlist: pick what you need, see which agencies list it
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var rows = Array.prototype.slice.call(document.querySelectorAll('.rows li'));
  var status = document.querySelector('.need-status');
  if (!chips.length || !rows.length || !status) return;

  function update() {
    var wanted = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
                      .map(function (c) { return c.getAttribute('data-tag'); });
    var hits = 0;
    rows.forEach(function (li) {
      var tags = (li.getAttribute('data-tags') || '').split(' ');
      var ok = wanted.every(function (t) { return tags.indexOf(t) !== -1; });
      li.classList.toggle('off', !ok);
      if (ok) hits += 1;
    });
    if (!wanted.length || hits === rows.length) status.textContent = status.getAttribute('data-all');
    else if (hits === 0) status.textContent = status.getAttribute('data-none');
    else status.textContent = status.getAttribute('data-some').replace('{n}', String(hits));
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      update();
    });
  });
  update();
})();
