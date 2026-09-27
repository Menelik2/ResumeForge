/* ============================================
   Yeni Pro CV — Screenshot-matched templates
   hr | fullstack | sales | cinematic | marketing | clinical | classic
   Loads full implementations from known-good commit (offline-capable via jsDelivr cache)
   ============================================ */
(function () {
  if (typeof Preview === 'undefined') return;
  var SRC = 'https://cdn.jsdelivr.net/gh/Menelik2/ResumeForge@8949f6999fb74d4869227229a8e11c46c8ad5fb4/js/preview-templates-extra.js';
  var s = document.createElement('script');
  s.src = SRC;
  s.async = false;
  s.onerror = function () {
    console.warn('ResumeForge: extended templates CDN unavailable; using built-in fallbacks');
  };
  document.head.appendChild(s);
})();
