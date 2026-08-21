/* ============================================
   Yeni Pro CV — Screenshot-matched templates
   Overrides: hr, fullstack, sales, cinematic, marketing, clinical
   ============================================ */
(function () {
  if (typeof Preview === 'undefined') return;

  const pct = { Beginner: 38, Intermediate: 58, Advanced: 78, Expert: 94 };
  function bars(skills, color, track) {
    if (!skills || !skills.length) return '';
    return skills.map(function (s) {
      var w = pct[s.level] || 62;
      return '<div style="margin-bottom:9px">'
        + '<div style="font-size:0.8em;margin-bottom:3px">' + Utils.escapeHtml(s.name || '') + '</div>'
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
  function iconCircle(sym, bg) {
    return '<span style="width:20px;height:20px;border-radius:50%;background:' + (bg || '#f0e6e0') + ';display:inline-flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0">' + sym + '</span>';
  }
  function secBadge(label, bg) {
    return '<span style="display:inline-block;background:' + bg + ';color:#fff;padding:4px 12px;border-radius:5px;font-size:0.72em;font-weight:700;letter-spacing:0.05em">' + label + '</span>';
  }
  function timelineHead(label, color) {
    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">'
      + secBadge(label, color)
      + '<span style="flex:1;height:2px;background:linear-gradient(90deg,' + color + ',#e8ddd6)"></span>'
      + '<span style="width:8px;height:8px;border-radius:50%;background:' + color + '"></span></div>';
  }

  /* ========== 1. HR Management (Lidiyia style) ========== */
  Preview.tplHR = function (r) {
    var p = r.personal || {}, c = '#3d1212';
    return '<div style="padding:7mm 8mm;background:#f7f2ec;min-height:297mm;box-sizing:border-box;font-family:Georgia,Times New Roman,serif">'
      + '<div style="background:' + c + ';color:#fff;border-radius:18px;padding:16px 22px;display:flex;align-items:center;gap:18px;margin-bottom:16px;box-shadow:0 4px 16px rgba(61,18,18,0.2)">'
      + ph(p, 90, '50%', 'border:3px solid rgba(255,255,255,0.4)')
      + '<div><div style="font-size:1.7em;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;line-height:1.15">'
      + Utils.escapeHtml(p.fullName || 'Your Name') + '</div>'
      + '<div style="color:#e8b8b8;margin-top:5px;font-size:0.95em;font-family:Inter,sans-serif">'
      + Utils.escapeHtml(p.title || 'HR & Management') + '</div></div></div>'
      + '<div style="display:grid;grid-template-columns:1fr 1.4fr;gap:24px;font-family:Inter,system-ui,sans-serif">'
      + '<div>'
      + '<h3 style="margin:0 0 10px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">Contact</h3>'
      + '<div style="font-size:0.8em;line-height:2;color:#444">'
      + (p.email ? '<div style="display:flex;gap:8px;align-items:center">' + iconCircle('✉') + Utils.escapeHtml(p.email) + '</div>' : '')
      + (p.phone ? '<div style="display:flex;gap:8px;align-items:center">' + iconCircle('☎') + Utils.escapeHtml(p.phone) + '</div>' : '')
      + (p.location ? '<div style="display:flex;gap:8px;align-items:center">' + iconCircle('📍') + Utils.escapeHtml(p.location) + '</div>' : '')
      + (p.linkedin ? '<div style="display:flex;gap:8px;align-items:center">' + iconCircle('in') + Utils.escapeHtml(p.linkedin) + '</div>' : '')
      + '</div>'
      + ((r.education || []).length ? '<h3 style="margin:18px 0 10px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">Education</h3>'
        + r.education.map(function (e) {
          return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between;gap:6px">'
            + '<span style="color:#555;font-size:0.85em">' + Utils.escapeHtml(e.institution || '') + '</span>'
            + '<span style="font-size:0.8em;color:#888">' + Utils.formatDate(e.endDate) + '</span></div>'
            + '<div style="font-weight:600;color:' + c + ';font-size:0.9em;margin-top:2px">' + Utils.escapeHtml(e.degree || '') + '</div></div>';
        }).join('') : '')
      + ((r.skills || []).length ? '<h3 style="margin:18px 0 10px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">Skills</h3>' + bars(r.skills, c, '#e8ddd6') : '')
      + ((r.languages || []).length ? '<h3 style="margin:18px 0 8px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">Language</h3>'
        + '<ul style="margin:0;padding-left:18px;font-size:0.85em;color:#444">'
        + r.languages.map(function (l) { return '<li style="margin-bottom:3px">' + Utils.escapeHtml(l.name) + ' – ' + Utils.escapeHtml(l.level || '') + '</li>'; }).join('')
        + '</ul>' : '')
      + '</div><div>'
      + (p.summary ? '<h3 style="margin:0 0 8px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">About Me</h3>'
        + '<p style="margin:0 0 16px;font-size:0.88em;color:#333;line-height:1.55">' + Utils.escapeHtml(p.summary) + '</p>' : '')
      + ((r.experience || []).length ? '<h3 style="margin:0 0 12px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">Experience</h3>'
        + r.experience.map(function (e) {
          return '<div style="margin-bottom:14px">'
            + '<div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline">'
            + '<div style="display:flex;align-items:center;gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:' + c + ';flex-shrink:0"></span>'
            + '<strong style="font-size:0.95em">' + Utils.escapeHtml(e.jobTitle || '') + '</strong></div>'
            + '<span style="font-size:0.78em;color:#888;white-space:nowrap">' + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</span></div>'
            + '<div style="margin-left:16px;font-size:0.8em;color:#666;margin-top:2px">' + Utils.escapeHtml(e.company || '') + (e.location ? ' | ' + Utils.escapeHtml(e.location) : '') + '</div>'
            + '<div style="margin-left:16px;margin-top:4px;font-size:0.84em;color:#333;white-space:pre-line;line-height:1.45">' + Utils.escapeHtml(e.description || '') + '</div></div>';
        }).join('') : '')
      + ((r.references || []).length && (r.enabledSections || {}).references
        ? '<h3 style="margin:14px 0 10px;font-size:1.1em;color:#1a1a1a;font-family:Georgia,serif">References</h3>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.8em">'
        + r.references.map(function (ref) {
          return '<div><strong>' + Utils.escapeHtml(ref.name || '') + '</strong><div style="color:#666;margin-top:2px">' + Utils.escapeHtml(ref.contact || '') + '</div></div>';
        }).join('') + '</div>' : '')
      + '</div></div></div>';
  };

  /* ========== 2. Full-Stack Sidebar (Tsedneya style) ========== */
  Preview.tplFullstack = function (r) {
    var p = r.personal || {}, c = '#5c3a21';
    return '<div style="display:grid;grid-template-columns:38% 62%;min-height:297mm;font-family:Inter,system-ui,sans-serif">'
      + '<div style="background:linear-gradient(170deg,#4a2f1a 0%,#6b4423 45%,#5c3a21 100%);color:#fff;padding:14mm 10mm">'
      + '<h1 style="margin:0;font-size:1.75em;font-weight:800;line-height:1.08;letter-spacing:-0.02em">' + Utils.escapeHtml(p.fullName || 'Your Name') + '</h1>'
      + '<div style="color:#e8c9a8;margin-top:6px;font-size:0.88em">' + Utils.escapeHtml(p.title || 'Full-Stack Developer') + '</div>'
      + '<div style="text-align:center;margin:20px 0">' + ph(p, 115, '50%', 'border:4px solid rgba(255,255,255,0.22);box-shadow:0 10px 28px rgba(0,0,0,0.35)') + '</div>'
      + (p.summary ? '<div style="background:rgba(255,255,255,0.1);border-radius:16px;padding:12px 14px;font-size:0.76em;line-height:1.5;color:#f5e6d3">'
        + '<strong style="display:block;margin-bottom:6px;letter-spacing:0.1em;font-size:0.9em">ABOUT ME</strong>'
        + Utils.escapeHtml(p.summary) + '</div>' : '')
      + '<div style="margin-top:14px">'
      + (p.email ? '<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:8px 14px;margin-bottom:7px;font-size:0.76em;display:flex;align-items:center;gap:8px">✉ ' + Utils.escapeHtml(p.email) + '</div>' : '')
      + (p.phone ? '<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:8px 14px;margin-bottom:7px;font-size:0.76em;display:flex;align-items:center;gap:8px">☎ ' + Utils.escapeHtml(p.phone) + '</div>' : '')
      + (p.location ? '<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:8px 14px;margin-bottom:7px;font-size:0.76em;display:flex;align-items:center;gap:8px">📍 ' + Utils.escapeHtml(p.location) + '</div>' : '')
      + (p.linkedin ? '<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:8px 14px;margin-bottom:7px;font-size:0.76em;display:flex;align-items:center;gap:8px">in ' + Utils.escapeHtml(p.linkedin) + '</div>' : '')
      + (p.website ? '<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:8px 14px;font-size:0.76em;display:flex;align-items:center;gap:8px">🌐 ' + Utils.escapeHtml(p.website) + '</div>' : '')
      + '</div>'
      + ((r.languages || []).length ? '<div style="margin-top:18px"><div style="font-size:0.72em;letter-spacing:0.12em;margin-bottom:8px;opacity:0.9">LANGUAGES</div>'
        + dots(r.languages, '#fff', 'rgba(255,255,255,0.22)') + '</div>' : '')
      + ((r.skills || []).length ? '<div style="margin-top:14px"><div style="font-size:0.72em;letter-spacing:0.12em;margin-bottom:8px;opacity:0.9">SKILLS</div>'
        + dots(r.skills, '#fff', 'rgba(255,255,255,0.22)') + '</div>' : '')
      + '</div><div style="background:#fff;padding:13mm 11mm">'
      + ((r.education || []).length ? '<div style="margin-bottom:18px">' + timelineHead('EDUCATION', c)
        + r.education.map(function (e) {
          return '<div style="margin-bottom:11px"><div style="display:flex;justify-content:space-between">'
            + '<span style="font-size:0.84em;color:#666">' + Utils.escapeHtml(e.degree || '') + '</span>'
            + '<span style="font-size:0.78em;color:#999">' + Utils.formatDate(e.endDate) + '</span></div>'
            + '<div style="font-weight:700;color:#1a1a1a;margin-top:2px">' + Utils.escapeHtml(e.institution || '') + '</div>'
            + (e.gpa ? '<div style="font-size:0.78em;color:#666">GPA: ' + Utils.escapeHtml(e.gpa) + '</div>' : '') + '</div>';
        }).join('') + '</div>' : '')
      + ((r.experience || []).length ? '<div style="margin-bottom:18px">' + timelineHead('EXPERIENCE', c)
        + r.experience.map(function (e) {
          return '<div style="margin-bottom:14px">'
            + '<div style="font-size:0.76em;color:#999">' + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</div>'
            + '<div style="font-weight:700;font-size:1em;margin-top:2px">' + Utils.escapeHtml(e.jobTitle || '') + '</div>'
            + '<div style="color:' + c + ';font-size:0.88em;margin-bottom:4px">' + Utils.escapeHtml(e.company || '') + '</div>'
            + '<div style="font-size:0.84em;color:#333;white-space:pre-line;line-height:1.45">' + Utils.escapeHtml(e.description || '') + '</div></div>';
        }).join('') + '</div>' : '')
      + ((r.certifications || []).length ? '<div>' + timelineHead('CERTIFICATES', c)
        + r.certifications.map(function (cert) {
          return '<div style="margin-bottom:8px;font-size:0.86em"><strong>' + Utils.escapeHtml(cert.name || '') + '</strong>'
            + ' <span style="color:#666">— ' + Utils.escapeHtml(cert.organization || '') + '</span></div>';
        }).join('') + '</div>' : '')
      + '</div></div>';
  };

  /* ========== 3. Sales Executive (Rebeka style) ========== */
  Preview.tplSales = function (r) {
    var p = r.personal || {}, c = '#1a6bb5';
    return '<div style="padding:11mm 13mm;font-family:Inter,system-ui,sans-serif;background:#fff;min-height:297mm;box-sizing:border-box">'
      + '<div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:8px">'
      + ph(p, 94, '10px', 'border:2px solid #dbeafe')
      + '<div style="flex:1;min-width:0">'
      + '<h1 style="margin:0;font-size:1.9em;font-weight:800;color:#0f2744;letter-spacing:-0.02em">' + Utils.escapeHtml(p.fullName || 'Your Name') + '</h1>'
      + '<div style="color:' + c + ';font-size:1em;margin-top:3px">' + Utils.escapeHtml(p.title || 'Sales') + '</div>'
      + '<div style="height:2.5px;background:linear-gradient(90deg,' + c + ',#93c5fd);margin:10px 0 8px"></div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px 14px;font-size:0.76em;color:#475569">'
      + (p.email ? '<span>✉ ' + Utils.escapeHtml(p.email) + '</span>' : '')
      + (p.phone ? '<span>☎ ' + Utils.escapeHtml(p.phone) + '</span>' : '')
      + (p.location ? '<span>📍 ' + Utils.escapeHtml(p.location) + '</span>' : '')
      + (p.linkedin ? '<span>in ' + Utils.escapeHtml(p.linkedin) + '</span>' : '')
      + (p.website ? '<span>🌐 ' + Utils.escapeHtml(p.website) + '</span>' : '')
      + '</div></div></div>'
      + (p.summary ? '<div style="margin:14px 0"><div style="color:' + c + ';font-weight:700;font-size:0.84em;letter-spacing:0.04em;border-bottom:2px solid ' + c + ';padding-bottom:4px;margin-bottom:8px">ABOUT ME</div>'
        + '<p style="margin:0;font-size:0.88em;color:#334155;line-height:1.55">' + Utils.escapeHtml(p.summary) + '</p></div>' : '')
      + ((r.experience || []).length ? '<div style="margin:14px 0"><div style="color:' + c + ';font-weight:700;font-size:0.84em;letter-spacing:0.04em;border-bottom:2px solid ' + c + ';padding-bottom:4px;margin-bottom:10px">EXPERIENCE</div>'
        + r.experience.map(function (e) {
          return '<div style="margin-bottom:13px">'
            + '<div style="font-size:0.76em;color:#94a3b8">' + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</div>'
            + '<div style="font-size:0.8em;color:#64748b">' + Utils.escapeHtml(e.company || '') + (e.location ? ', ' + Utils.escapeHtml(e.location) : '') + '</div>'
            + '<div style="font-weight:700;color:' + c + ';font-size:0.95em;margin:2px 0 4px">' + Utils.escapeHtml(e.jobTitle || '') + '</div>'
            + '<div style="font-size:0.84em;color:#334155;white-space:pre-line;line-height:1.45">' + Utils.escapeHtml(e.description || '').replace(/^•/gm, '→').replace(/^-\s/gm, '→ ') + '</div></div>';
        }).join('') + '</div>' : '')
      + ((r.education || []).length ? '<div style="margin:14px 0"><div style="color:' + c + ';font-weight:700;font-size:0.84em;letter-spacing:0.04em;border-bottom:2px solid ' + c + ';padding-bottom:4px;margin-bottom:8px">EDUCATION</div>'
        + r.education.map(function (e) {
          return '<div style="display:flex;justify-content:space-between;margin-bottom:8px;gap:12px">'
            + '<div><div style="font-weight:700">' + Utils.escapeHtml(e.institution || '') + '</div>'
            + '<div style="color:' + c + ';font-size:0.9em">' + Utils.escapeHtml(e.degree || '') + '</div>'
            + (e.gpa ? '<div style="font-size:0.8em;color:#64748b">GPA: ' + Utils.escapeHtml(e.gpa) + '</div>' : '') + '</div>'
            + '<span style="font-size:0.84em;color:#94a3b8">' + Utils.formatDate(e.endDate) + '</span></div>';
        }).join('') + '</div>' : '')
      + ((r.skills || []).length ? '<div style="margin:14px 0"><div style="color:' + c + ';font-weight:700;font-size:0.84em;letter-spacing:0.04em;border-bottom:2px solid ' + c + ';padding-bottom:4px;margin-bottom:8px">SKILLS</div>'
        + '<div style="font-size:0.86em;color:#334155">' + r.skills.map(function (s) {
          return '<div style="margin-bottom:3px">→ ' + Utils.escapeHtml(s.name || '') + (s.level ? ' (' + Utils.escapeHtml(s.level) + ')' : '') + '</div>';
        }).join('') + '</div></div>' : '')
      + '</div>';
  };

  /* ========== 4. Cinematic Dark (Daniel style) ========== */
  Preview.tplCinematic = function (r) {
    var p = r.personal || {}, c = '#a78bfa';
    return '<div style="background:#0a0a10;color:#e2e8f0;padding:9mm;min-height:297mm;font-family:Inter,system-ui,sans-serif;box-sizing:border-box">'
      + '<div style="display:grid;grid-template-columns:35% 65%;gap:14px">'
      + '<div>'
      + '<div style="text-align:center;margin-bottom:12px">' + ph(p, 105, '50%', 'border:3px solid #7c3aed;box-shadow:0 0 32px rgba(124,58,237,0.55)') + '</div>'
      + '<h1 style="margin:0;text-align:center;font-size:1.6em;font-weight:800;color:#fff;line-height:1.12">' + Utils.escapeHtml(p.fullName || 'Your Name') + '</h1>'
      + '<div style="text-align:center;color:' + c + ';letter-spacing:0.22em;font-size:0.7em;text-transform:uppercase;margin-top:6px">' + Utils.escapeHtml(p.title || 'Video Editor') + '</div>'
      + '<div style="margin-top:14px;background:#14141e;border-radius:12px;padding:11px;font-size:0.76em;line-height:1.75;color:#94a3b8">'
      + '<div style="color:' + c + ';font-size:0.85em;font-weight:700;margin-bottom:6px">● CONTACT</div>'
      + (p.phone ? '<div>☎ ' + Utils.escapeHtml(p.phone) + '</div>' : '')
      + (p.email ? '<div>✉ ' + Utils.escapeHtml(p.email) + '</div>' : '')
      + (p.location ? '<div>📍 ' + Utils.escapeHtml(p.location) + '</div>' : '')
      + (p.website ? '<div>🌐 ' + Utils.escapeHtml(p.website) + '</div>' : '')
      + (p.linkedin ? '<div>in ' + Utils.escapeHtml(p.linkedin) + '</div>' : '')
      + '</div>'
      + ((r.skills || []).length ? '<div style="margin-top:10px;background:#14141e;border-radius:12px;padding:11px"><div style="color:' + c + ';font-size:0.75em;font-weight:700;margin-bottom:8px">SKILLS</div>'
        + bars(r.skills, '#7c3aed', '#2a2a38') + '</div>' : '')
      + ((r.languages || []).length ? '<div style="margin-top:10px;background:#14141e;border-radius:12px;padding:11px"><div style="color:' + c + ';font-size:0.75em;font-weight:700;margin-bottom:6px">LANGUAGES</div>'
        + bars(r.languages.map(function (l) { return { name: l.name, level: (l.level === 'Native' || l.level === 'Fluent') ? 'Expert' : 'Advanced' }; }), '#7c3aed', '#2a2a38') + '</div>' : '')
      + '</div><div>'
      + (p.summary ? '<div style="background:#14141e;border-radius:12px;padding:12px;margin-bottom:10px"><div style="color:' + c + ';font-size:0.8em;font-weight:700">ABOUT ME</div>'
        + '<p style="margin:6px 0 0;font-size:0.84em;color:#cbd5e1;line-height:1.5">' + Utils.escapeHtml(p.summary) + '</p></div>' : '')
      + ((r.experience || []).length ? '<div style="background:#14141e;border-radius:12px;padding:12px;margin-bottom:10px"><div style="color:' + c + ';font-size:0.8em;font-weight:700;margin-bottom:8px">EXPERIENCE</div>'
        + r.experience.map(function (e) {
          return '<div style="margin-bottom:12px;padding-left:10px;border-left:2px solid #7c3aed">'
            + '<div style="font-size:0.7em;color:#94a3b8">' + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</div>'
            + '<div style="font-weight:700;color:#fff">' + Utils.escapeHtml(e.jobTitle || '') + '</div>'
            + '<div style="color:' + c + ';font-size:0.84em">' + Utils.escapeHtml(e.company || '') + '</div>'
            + '<div style="font-size:0.8em;color:#cbd5e1;margin-top:3px;white-space:pre-line">' + Utils.escapeHtml(e.description || '') + '</div></div>';
        }).join('') + '</div>' : '')
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      + ((r.education || []).length ? '<div style="background:#14141e;border-radius:12px;padding:10px"><div style="color:' + c + ';font-size:0.75em;font-weight:700">EDUCATION</div>'
        + r.education.map(function (e) {
          return '<div style="margin-top:6px;font-size:0.76em"><strong style="color:#fff">' + Utils.escapeHtml(e.degree || '') + '</strong>'
            + '<div style="color:#94a3b8">' + Utils.escapeHtml(e.institution || '') + '</div></div>';
        }).join('') + '</div>' : '<div></div>')
      + ((r.achievements || []).length && (r.enabledSections || {}).achievements
        ? '<div style="background:#14141e;border-radius:12px;padding:10px"><div style="color:' + c + ';font-size:0.75em;font-weight:700">ACHIEVEMENTS</div>'
        + r.achievements.map(function (a) {
          return '<div style="margin-top:6px;font-size:0.76em;color:#cbd5e1">' + Utils.escapeHtml(a.name || a.title || '') + '</div>';
        }).join('') + '</div>' : '')
      + '</div></div></div></div>';
  };

  /* ========== 5. Marketing Gold (Hiwot style) ========== */
  Preview.tplMarketing = function (r) {
    var p = r.personal || {}, c = '#ca8a04';
    var parts = (p.fullName || 'Your Name').trim().split(/\s+/);
    var first = parts.slice(0, -1).join(' ') || parts[0];
    var last = parts.length > 1 ? parts[parts.length - 1] : '';
    function badge(t) { return secBadge(t, '#eab308'); }
    return '<div style="display:grid;grid-template-columns:36% 64%;min-height:297mm;font-family:Inter,system-ui,sans-serif">'
      + '<div style="background:#fffdf7;padding:11mm 9mm;border-right:1px solid #fef08a">'
      + ph(p, 90, '10px', 'border:2px solid #fde047')
      + '<h1 style="margin:12px 0 0;font-size:1.55em;font-weight:800;line-height:1.12;color:#0f172a">'
      + Utils.escapeHtml(first) + (last ? '<br><span style="color:#eab308">' + Utils.escapeHtml(last) + '</span>' : '') + '</h1>'
      + '<div style="color:' + c + ';font-weight:700;letter-spacing:0.14em;font-size:0.7em;text-transform:uppercase;margin-top:5px">'
      + Utils.escapeHtml(p.title || 'Marketing Manager') + '</div>'
      + (p.summary ? '<div style="margin-top:14px">' + badge('SUMMARY')
        + '<p style="margin:8px 0 0;font-size:0.78em;color:#334155;line-height:1.5">' + Utils.escapeHtml(p.summary) + '</p></div>' : '')
      + '<div style="margin-top:14px">' + badge('CONTACT')
      + '<div style="margin-top:8px;font-size:0.76em;line-height:1.9;color:#475569">'
      + (p.phone ? '<div>☎ ' + Utils.escapeHtml(p.phone) + '</div>' : '')
      + (p.email ? '<div>✉ ' + Utils.escapeHtml(p.email) + '</div>' : '')
      + (p.location ? '<div>📍 ' + Utils.escapeHtml(p.location) + '</div>' : '')
      + (p.linkedin ? '<div>in ' + Utils.escapeHtml(p.linkedin) + '</div>' : '')
      + (p.website ? '<div>🌐 ' + Utils.escapeHtml(p.website) + '</div>' : '')
      + '</div></div>'
      + ((r.skills || []).length ? '<div style="margin-top:14px">' + badge('SKILLS')
        + '<div style="margin-top:8px">' + dots(r.skills, '#eab308', '#fef08a') + '</div></div>' : '')
      + ((r.education || []).length ? '<div style="margin-top:14px">' + badge('EDUCATION')
        + r.education.map(function (e) {
          return '<div style="margin-top:8px;font-size:0.78em"><strong>' + Utils.escapeHtml(e.degree || '') + '</strong>'
            + '<div style="color:#64748b">' + Utils.escapeHtml(e.institution || '') + '</div>'
            + (e.gpa ? '<div style="color:#666">GPA: ' + Utils.escapeHtml(e.gpa) + '</div>' : '') + '</div>';
        }).join('') + '</div>' : '')
      + ((r.languages || []).length ? '<div style="margin-top:14px">' + badge('LANGUAGES')
        + '<div style="margin-top:8px">' + dots(r.languages, '#eab308', '#fef08a') + '</div></div>' : '')
      + '</div><div style="padding:11mm 10mm;background:#fff">'
      + ((r.experience || []).length ? '<div style="margin-bottom:16px">' + badge('WORK EXPERIENCE')
        + r.experience.map(function (e) {
          return '<div style="margin-top:12px;display:grid;grid-template-columns:10px 1fr;gap:10px">'
            + '<div style="padding-top:5px"><span style="display:block;width:10px;height:10px;border-radius:50%;background:#eab308"></span></div>'
            + '<div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap">'
            + '<strong style="font-size:0.94em">' + Utils.escapeHtml(e.jobTitle || '') + '</strong>'
            + '<span style="font-size:0.7em;background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:4px">'
            + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</span></div>'
            + '<div style="color:' + c + ';font-size:0.86em;font-weight:600">' + Utils.escapeHtml(e.company || '') + '</div>'
            + '<div style="margin-top:4px;font-size:0.84em;color:#334155;white-space:pre-line;line-height:1.45">' + Utils.escapeHtml(e.description || '') + '</div></div></div>';
        }).join('') + '</div>' : '')
      + ((r.certifications || []).length ? '<div>' + badge('CERTIFICATIONS')
        + '<ul style="margin:10px 0 0;padding-left:18px;font-size:0.84em">'
        + r.certifications.map(function (cert) {
          return '<li style="margin-bottom:5px"><strong>' + Utils.escapeHtml(cert.name || '') + '</strong> — ' + Utils.escapeHtml(cert.organization || '') + '</li>';
        }).join('') + '</ul></div>' : '')
      + '</div></div>';
  };

  /* ========== 6. Clinical Care (Abigail style) ========== */
  Preview.tplClinical = function (r) {
    var p = r.personal || {}, c = '#166534';
    var parts = (p.fullName || 'Your Name').trim().split(/\s+/);
    var first = parts[0] || 'Your';
    var rest = parts.slice(1).join(' ') || 'Name';
    return '<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;font-family:Inter,system-ui,sans-serif;background:#fefce8">'
      + '<div style="background:linear-gradient(180deg,#14532d 0%,#166534 55%,#15803d 100%);color:#fff;padding:12mm 9mm;border-radius:0 48px 0 0;position:relative">'
      + '<div style="text-align:center">' + ph(p, 108, '50%', 'border:4px solid rgba(255,255,255,0.35);box-shadow:0 8px 22px rgba(0,0,0,0.28)') + '</div>'
      + '<div style="text-align:center;margin-top:14px">'
      + '<div style="font-family:Georgia,cursive;font-size:1.65em;font-style:italic;color:#bbf7d0">' + Utils.escapeHtml(first) + '</div>'
      + '<div style="font-size:1.12em;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;margin-top:3px">' + Utils.escapeHtml(rest) + '</div>'
      + '<div style="color:#86efac;font-size:0.7em;letter-spacing:0.16em;text-transform:uppercase;margin-top:6px">' + Utils.escapeHtml(p.title || 'Registered Nurse') + '</div></div>'
      + (p.summary ? '<div style="margin-top:16px;font-size:0.76em;line-height:1.5;color:#dcfce7"><strong style="color:#fff;display:block;margin-bottom:4px">ABOUT ME</strong>'
        + Utils.escapeHtml(p.summary) + '</div>' : '')
      + '<div style="margin-top:14px;font-size:0.76em;line-height:1.9;color:#bbf7d0">'
      + '<strong style="color:#fff;display:block;margin-bottom:4px">CONTACT</strong>'
      + (p.phone ? '<div>☎ ' + Utils.escapeHtml(p.phone) + '</div>' : '')
      + (p.email ? '<div>✉ ' + Utils.escapeHtml(p.email) + '</div>' : '')
      + (p.location ? '<div>📍 ' + Utils.escapeHtml(p.location) + '</div>' : '')
      + (p.linkedin ? '<div>in ' + Utils.escapeHtml(p.linkedin) + '</div>' : '')
      + '</div>'
      + ((r.skills || []).length ? '<div style="margin-top:14px"><strong style="font-size:0.72em;color:#fff">CORE STRENGTHS</strong>'
        + '<div style="margin-top:6px;font-size:0.76em;color:#dcfce7">' + r.skills.map(function (s) { return '• ' + Utils.escapeHtml(s.name || ''); }).join('<br>') + '</div></div>' : '')
      + '</div><div style="padding:10mm 10mm;position:relative">'
      + '<div style="position:absolute;top:10px;right:14px;background:' + c + ';color:#fff;border-radius:14px;padding:10px 12px;text-align:center;font-size:0.62em;line-height:1.3;max-width:92px;box-shadow:0 4px 12px rgba(22,101,52,0.25)">'
      + '<div style="font-size:1.3em">♥</div><div style="letter-spacing:0.05em;margin-top:3px">CARE<br>COMPASSION<br>COMMITMENT</div></div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:8px 12px;font-size:0.74em;color:#475569;margin-bottom:12px;padding-right:100px">'
      + (p.phone ? '<span>☎ ' + Utils.escapeHtml(p.phone) + '</span>' : '')
      + (p.email ? '<span>✉ ' + Utils.escapeHtml(p.email) + '</span>' : '')
      + (p.location ? '<span>📍 ' + Utils.escapeHtml(p.location) + '</span>' : '')
      + '</div>'
      + '<div style="background:#fff;border:1px solid #d9f99d;border-radius:14px;padding:12px 14px;margin-bottom:14px;box-shadow:0 2px 8px rgba(22,101,52,0.06)">'
      + '<div style="color:' + c + ';font-weight:700;font-size:0.8em">♡ PROFESSIONAL SUMMARY</div>'
      + '<p style="margin:6px 0 0;font-size:0.84em;color:#334155;line-height:1.5">' + Utils.escapeHtml(p.summary || '') + '</p></div>'
      + ((r.experience || []).length ? '<div style="margin-bottom:14px"><div style="color:' + c + ';font-weight:700;font-size:0.84em;margin-bottom:8px">PROFESSIONAL EXPERIENCE</div>'
        + r.experience.map(function (e) {
          return '<div style="margin-bottom:12px;padding-left:14px;border-left:2px solid #86efac;position:relative">'
            + '<span style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:' + c + ';border:2px solid #fefce8"></span>'
            + '<div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><strong style="font-size:0.9em">' + Utils.escapeHtml(e.jobTitle || '') + '</strong>'
            + '<span style="font-size:0.74em;color:#64748b">' + Utils.formatDate(e.startDate) + ' – ' + (e.current ? 'Present' : Utils.formatDate(e.endDate)) + '</span></div>'
            + '<div style="color:' + c + ';font-size:0.8em">' + Utils.escapeHtml(e.company || '') + (e.location ? ' · ' + Utils.escapeHtml(e.location) : '') + '</div>'
            + '<div style="margin-top:3px;font-size:0.8em;color:#334155;white-space:pre-line">' + Utils.escapeHtml(e.description || '') + '</div></div>';
        }).join('') + '</div>' : '')
      + '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;border-top:1px solid #d9f99d;padding-top:12px">'
      + ((r.education || []).length ? '<div><div style="color:' + c + ';font-weight:700;font-size:0.72em">EDUCATION</div>'
        + r.education.map(function (e) {
          return '<div style="margin-top:6px;font-size:0.74em"><strong>' + Utils.escapeHtml(e.degree || '') + '</strong>'
            + '<div style="color:#64748b">' + Utils.escapeHtml(e.institution || '') + '</div>'
            + (e.gpa ? '<div>GPA: ' + Utils.escapeHtml(e.gpa) + '</div>' : '') + '</div>';
        }).join('') + '</div>' : '')
      + ((r.certifications || []).length ? '<div><div style="color:' + c + ';font-weight:700;font-size:0.72em">CERTIFICATIONS</div>'
        + r.certifications.map(function (cert) {
          return '<div style="margin-top:5px;font-size:0.74em">✓ ' + Utils.escapeHtml(cert.name || '') + '</div>';
        }).join('') + '</div>' : '')
      + ((r.skills || []).length ? '<div><div style="color:' + c + ';font-weight:700;font-size:0.72em">SKILLS</div>'
        + '<div style="margin-top:6px">' + dots(r.skills, c, '#bbf7d0') + '</div></div>' : '')
      + '</div></div></div>';
  };
})();
