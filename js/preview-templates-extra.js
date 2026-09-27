/* ============================================
   Yeni Pro CV — Screenshot-matched templates
   Loads full implementations from known-good commit
   ============================================ */
(function () {
  if (typeof Preview === 'undefined') return;
  var done = false;
  function load() {
    if (done) return;
    done = true;
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/gh/Menelik2/ResumeForge@8949f6999fb74d4869227229a8e11c46c8ad5fb4/js/preview-templates-extra.js';
    s.async = false;
    s.onerror = function () {
      console.warn('ResumeForge: could not load extended templates from CDN');
    };
    document.head.appendChild(s);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
