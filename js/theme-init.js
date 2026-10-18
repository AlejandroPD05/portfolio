/* Runs before the first paint so the theme never flashes and the reveal
   animations are only armed when JavaScript is actually available.
   (External file, not inline, so the Content-Security-Policy can use
   script-src 'self'.) */
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  /* ?motion=on forces the full animation set even when the OS reports
     prefers-reduced-motion (session-only override for local testing). */
  if (/[?&]motion=on(&|$)/.test(window.location.search)) {
    root.classList.add('force-motion');
  }

  try {
    /* Every visit opens on the white/light scheme: the dark toggle is a
       session-only choice and is never restored from storage or OS. */
    root.classList.add('light-mode');

    var storedLang = window.localStorage.getItem('portfolio.lang');
    if (!storedLang) {
      var browserLang = (navigator.language || 'es').slice(0, 2).toLowerCase();
      storedLang = browserLang === 'en' ? 'en' : 'es';
    }
    root.lang = storedLang;
  } catch (error) {
    root.classList.add('light-mode');
  }

  if (window.location.protocol === 'file:') {
    document.addEventListener('DOMContentLoaded', function () {
      var warning = document.getElementById('standaloneWarning');
      if (warning) warning.hidden = false;
    });
  }
})();
