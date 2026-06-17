/* Massagepraktijk Mirjam Maat — gedeelde navigatie-logica */
(function () {
  'use strict';

  var nav = document.querySelector('.nav');
  if (!nav) return;

  // Markeer automatisch de actieve pagina in het menu
  var huidig = location.pathname.split('/').pop() || 'index.html';
  if (huidig === '') huidig = 'index.html';
  Array.prototype.forEach.call(nav.querySelectorAll('.menu a'), function (a) {
    var href = (a.getAttribute('href') || '').split('/').pop();
    if (href && href === huidig) {
      a.setAttribute('aria-current', 'page');
      // markeer ook het bovenliggende dropdown-item
      var top = a.closest('.menu > li');
      if (top) {
        var topLink = top.querySelector(':scope > a, :scope > button');
        if (topLink && topLink.tagName === 'BUTTON') topLink.style.color = 'var(--blauw)';
      }
    }
  });

  // Sticky-schaduw bij scrollen
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Hamburger (mobiel)
  var burger = nav.querySelector('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Dropdowns
  var dropdowns = Array.prototype.slice.call(nav.querySelectorAll('.menu > li.has-sub'));

  function sluitAlle(behalve) {
    dropdowns.forEach(function (li) {
      if (li !== behalve) {
        li.classList.remove('open');
        var b = li.querySelector('button');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    });
  }

  dropdowns.forEach(function (li) {
    var btn = li.querySelector('button');
    if (!btn) return;

    // Desktop: hover opent (CSS doet visueel via .open); hier toggelen voor klik/touch
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var open = li.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      sluitAlle(li);
    });

    // Hover op desktop
    li.addEventListener('mouseenter', function () {
      if (window.matchMedia('(min-width: 981px)').matches) {
        li.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
    li.addEventListener('mouseleave', function () {
      if (window.matchMedia('(min-width: 981px)').matches) {
        li.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Klik buiten het menu sluit dropdowns (desktop)
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) sluitAlle(null);
  });

  // Escape sluit alles
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      sluitAlle(null);
      nav.classList.remove('menu-open');
      if (burger) burger.setAttribute('aria-expanded', 'false');
    }
  });
})();
