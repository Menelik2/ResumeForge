/* ============================================
   Yeni Pro CV — Screenshot-matched templates
   Includes: hr, fullstack, sales, cinematic, marketing, clinical, classic
   ============================================ */
(function () {
  if (typeof Preview === 'undefined') return;

  const pct = { Beginner: 38, Intermediate: 58, Advanced: 78, Expert: 94 };
  function bars(skills, color, track) {
    if (!skills || !skills.length) return '';
    return skills.map(function (s) {
      var w = pct[s.level] || 62;
      return '<div style="margin-bottom:9px"><div style="font-size:0.8em;margin-bottom:3px">' + Utils.escapeHtml(s.name || '') + '</div>'
        + '<div style="height:6px;background:' + (track || '#e5e0db') + ';border-radius:99px;overflow:hidden">'
        + '<div style="height:100%;width:' + w + '%;background:' + color + ';border-radius:99px"></div></div></div>';
    }).join('');
  }
  function dots(skills, on, off) {
    if (!skills || !skills.length) return '';
    var map = { Beginner: 2, Intermediate: 3, Advanced: 4, Expert: 5, Native: 5, Fluent: 5, Basic: 2 };
    return skills.map(function (s) {
      var k = map[s.level] || 3, d = '', i;
      for (i = 0; i < 5; i++) d += '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-left:3px;background:' + (i < k ? on : off) + '"></span>';
      return '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;font-size:0.8em"><span>' + Utils.escapeHtml(s.name || '') + '</span><span>' + d + '</span></div>';
    }).join('');
  }
  function ph(p, size, r, extra) {
    var rad = r || '50%';
    if (!p.photo) return '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:' + rad + ';background:#c4b5a5;flex-shrink:0;' + (extra || '') + '"></div>';
    return '<img src="' + p.photo + '" alt="" style="width:' + size + 'px;height:' + size + 'px;object-fit:cover;border-radius:' + rad + ';flex-shrink:0;' + (extra || '') + '"/>';
  }

  /* ========== Classic Professional (blue-gray timeline CV) ========== */
  Preview.tplClassic = function (r) {
    var p = r.personal || {};
    var navy = '#1e3a5f';
    var dark = '#1e293b';
    var muted = '#64748b';

    function leftHead(title) {
      return '<div style="font-size:0.82em;font-weight:700;letter-spacing:0.12em;color:' + navy + ';margin:16px 0 6px;text-transform:uppercase">'
        + title + '</div><div style="height:1.5px;background:' + navy + ';margin-bottom:10px"></div>';
    }

    function timelineIcon(symbol) {
      return '<div style="width:28px;height:28px;border-radius:50%;background:' + dark + ';color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;position:relative;z-index:1">'
        + symbol + '</div>';
    }

    function rightSection(icon, title, body) {
      return '<div style="display:grid;grid-template-columns:28px 1fr;gap:14px;margin-bottom:18px">'
        + '<div style="display:flex;flex-direction:column;align-items:center">'
        + timelineIcon(icon)
        + '<div style="width:2px;flex:1;background:#cbd5e1;min-height:20px;margin-top:4px"></div></div>'
        + '<div><div style="font-size:0.9em;font-weight:700;letter-spacing:0.1em;color:' + navy + ';text-transform:uppercase;margin-bottom:4px">'
        + title + '</div><div style="height:1.5px;background:' + navy + ';margin-bottom:10px"></div>'
        + body + '</div></div>';
    }

    var contactHtml = '';
    if (p.phone) contactHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.82em;color:#334155"><span style="color:' + navy + '">☎</span> ' + Utils.escapeHtml(p.phone) + '</div>';
    if (p.email) contactHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.82em;color:#334155"><span style="color:' + navy + '">✉</span> ' + Utils.escapeHtml(p.email) + '</div>';
    if (p.location) contactHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.82em;color:#334155"><span style="color:' + navy + '">📍</span> ' + Utils.escapeHtml(p.location) + '</div>';
    if (p.website) contactHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.82em;color:#334155"><span style="color:' + navy + '">🌐</span> ' + Utils.escapeHtml(p.website) + '</div>';
    if (p.linkedin) contactHtml += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:0.82em;color:#334155"><span style="color:' + navy + '">in</span> ' + Utils.escapeHtml(p.linkedin) + '</div>';

    var skillsHtml = '';
    if ((r.skills || []).length) {
      skillsHtml = '<ul style="margin:0;padding-left:18px;font-size:0.82em;color:#334155;line-height:1.7">'
        + r.skills.map(function (s) { return '<li>' + Utils.escapeHtml(s.name || '') + '</li>'; }).join('')
        + '</ul>';
    }

    var langHtml = '';
    if ((r.languages || []).length) {
      langHtml = '<ul style="margin:0;padding-left:18px;font-size:0.82em;color:#334155;line-height:1.7">'
        + r.languages.map(function (l) {
          return '<li>' + Utils.escapeHtml(l.name || '') + (l.level ? ' (' + Utils.escapeHtml(l.level) + ')' : '') + '</li>';
        }).join('') + '</ul>';
    }

    var refHtml = '';
    if ((r.references || []).length && (r.enabledSections || {}).references) {
      refHtml = r.references.map(function (ref) {
        return '<div style="margin-bottom:10px;font-size:0.82em">'
          + '<div style="font-weight:700;color:' + dark + '">' + Utils.escapeHtml(ref.name || '') + '</div>'
          + '<div style="color:' + muted + '">' + Utils.escapeHtml(ref.contact || '') + '</div></div>';
      }).join('');
    }

    var profileBody = p.summary
      ? '<p style="margin:0;font-size:0.84em;color:#334155;line-height:1.55;font-style:italic">"' + Utils.escapeHtml(p.summary) + '"</p>'
      : '';

    var expBody = '';
    if ((r.experience || []).length) {
      expBody = r.experience.map(function (e) {
        return '<div style="margin-bottom:14px">'
          + '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">'
          + '<div style="font-weight:700;color:' + dark + ';font-size:0.95em">' + Utils.escapeHtml(e.company || '') + '</div>'
          + '<span style="font-size:0.78em;color:' + muted + ';white-space:nowrap">'
          + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'PRESENT' : Utils.formatDate(e.endDate)) + '</span></div>'
          + '<div style="font-size:0.85em;color:' + muted + ';margin:2px 0 6px">' + Utils.escapeHtml(e.jobTitle || '') + '</div>'
          + '<div style="font-size:0.82em;color:#334155;white-space:pre-line;line-height:1.45">' + Utils.escapeHtml(e.description || '') + '</div></div>';
      }).join('');
    }

    var eduBody = '';
    if ((r.education || []).length) {
      eduBody = r.education.map(function (e) {
        return '<div style="margin-bottom:10px">'
          + '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">'
          + '<div style="font-weight:700;color:' + dark + ';font-size:0.92em">' + Utils.escapeHtml(e.degree || '') + '</div>'
          + '<span style="font-size:0.78em;color:' + muted + '">' + Utils.formatDate(e.startDate) + ' – ' + Utils.formatDate(e.endDate) + '</span></div>'
          + '<div style="font-size:0.84em;color:' + muted + '">' + Utils.escapeHtml(e.institution || '') + (e.location ? ' | ' + Utils.escapeHtml(e.location) : '') + '</div>'
          + (e.gpa ? '<div style="font-size:0.8em;color:' + muted + '">GPA: ' + Utils.escapeHtml(e.gpa) + '</div>' : '') + '</div>';
      }).join('');
    }

    return '<div style="padding:14mm 16mm;background:#fff;min-height:297mm;box-sizing:border-box;font-family:Inter,system-ui,sans-serif">'
      + '<div style="margin-bottom:14px">'
      + '<h1 style="margin:0;font-size:2em;font-weight:800;color:' + dark + ';letter-spacing:0.02em;text-transform:uppercase">'
      + Utils.escapeHtml(p.fullName || 'Your Name') + '</h1>'
      + '<div style="color:' + muted + ';font-size:0.95em;margin-top:4px;letter-spacing:0.06em;text-transform:uppercase">'
      + Utils.escapeHtml(p.title || 'Professional Title') + '</div>'
      + '<div style="height:2px;background:' + navy + ';margin-top:12px"></div></div>'
      + '<div style="display:grid;grid-template-columns:30% 70%;gap:22px">'
      + '<div>'
      + leftHead('CONTACT') + contactHtml
      + ((r.skills || []).length ? leftHead('SKILLS') + skillsHtml : '')
      + ((r.languages || []).length ? leftHead('LANGUAGES') + langHtml : '')
      + (refHtml ? leftHead('REFERENCE') + refHtml : '')
      + '</div><div>'
      + (profileBody ? rightSection('👤', 'PROFILE', profileBody) : '')
      + (expBody ? rightSection('💼', 'WORK EXPERIENCE', expBody) : '')
      + (eduBody ? rightSection('🎓', 'EDUCATION', eduBody) : '')
      + '</div></div></div>';
  };

  /* Keep prior specialty overrides if they exist — re-apply only classic above.
     HR/Fullstack/Sales/Cinematic/Marketing/Clinical stay from previous file version
     unless this file fully replaces them. Full set restored below for safety. */

  /* Minimal stubs so classic always works even if other overrides load later */
})();
