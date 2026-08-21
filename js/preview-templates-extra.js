/* ============================================
   Yeni Pro CV — Extra templates (match screenshots)
   Loaded after preview.js — overrides tplHR..tplClinical
   ============================================ */
(function () {
  if (typeof Preview === 'undefined') return;

  const levelPct = { Beginner: 40, Intermediate: 60, Advanced: 80, Expert: 95 };
  const bars = (skills, color, track) => {
    if (!skills || !skills.length) return '';
    return skills.map(s => {
      const pct = levelPct[s.level] || 65;
      return `<div style="margin-bottom:8px;">
        <div style="font-size:0.82em;margin-bottom:3px;color:inherit;">${Utils.escapeHtml(s.name || '')}</div>
        <div style="height:7px;background:${track || '#e2e8f0'};border-radius:999px;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${color};border-radius:999px;"></div>
        </div></div>`;
    }).join('');
  };
  const dots = (skills, filled, empty) => {
    if (!skills || !skills.length) return '';
    const n = { Beginner: 2, Intermediate: 3, Advanced: 4, Expert: 5 };
    return skills.map(s => {
      const k = n[s.level] || 3;
      let d = '';
      for (let i = 0; i < 5; i++) d += `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:3px;background:${i < k ? filled : empty};"></span>`;
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:0.82em;"><span>${Utils.escapeHtml(s.name || '')}</span><span>${d}</span></div>`;
    }).join('');
  };
  const photo = (p, size, extra) => {
    if (!p.photo) return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:#cbd5e1;${extra || ''}"></div>`;
    return `<img src="${p.photo}" alt="" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:50%;${extra || ''}" />`;
  };
  const photoSq = (p, size, extra) => {
    if (!p.photo) return `<div style="width:${size}px;height:${size}px;border-radius:10px;background:#cbd5e1;${extra || ''}"></div>`;
    return `<img src="${p.photo}" alt="" style="width:${size}px;height:${size}px;object-fit:cover;border-radius:10px;${extra || ''}" />`;
  };

  /* ---- HR Management: burgundy rounded header, 2-col ---- */
  Preview.tplHR = function (r) {
    const p = r.personal || {};
    const c = '#4a1515';
    return `<div style="padding:8mm;background:#f5f0eb;font-family:Georgia,'Times New Roman',serif;min-height:297mm;box-sizing:border-box;">
      <div style="background:${c};color:#fff;border-radius:16px;padding:14px 20px;display:flex;align-items:center;gap:18px;margin-bottom:14px;">
        ${photo(p, 86, 'border:3px solid rgba(255,255,255,0.45);flex-shrink:0;')}
        <div>
          <div style="font-size:1.65em;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;line-height:1.15;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</div>
          <div style="color:#e8b4b4;margin-top:4px;font-size:0.95em;font-family:Inter,sans-serif;">${Utils.escapeHtml(p.title) || 'HR & Management'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1.35fr;gap:22px;font-family:Inter,system-ui,sans-serif;">
        <div>
          <h3 style="margin:0 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">Contact</h3>
          <div style="font-size:0.8em;line-height:1.85;color:#444;">
            ${p.email ? `<div style="display:flex;gap:8px;align-items:center;"><span style="width:18px;height:18px;border-radius:50%;background:#f0e6e0;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">✉</span>${Utils.escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div style="display:flex;gap:8px;align-items:center;"><span style="width:18px;height:18px;border-radius:50%;background:#f0e6e0;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">☎</span>${Utils.escapeHtml(p.phone)}</div>` : ''}
            ${p.location ? `<div style="display:flex;gap:8px;align-items:center;"><span style="width:18px;height:18px;border-radius:50%;background:#f0e6e0;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">📍</span>${Utils.escapeHtml(p.location)}</div>` : ''}
            ${p.linkedin ? `<div style="display:flex;gap:8px;align-items:center;"><span style="width:18px;height:18px;border-radius:50%;background:#f0e6e0;display:inline-flex;align-items:center;justify-content:center;font-size:10px;">in</span>${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          </div>
          ${(r.education || []).length ? `<h3 style="margin:16px 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">Education</h3>${r.education.map(e => `
            <div style="margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;gap:8px;"><span style="color:#666;font-size:0.85em;">${Utils.escapeHtml(e.institution || '')}</span><span style="font-size:0.8em;color:#888;">${Utils.formatDate(e.endDate)}</span></div>
              <div style="font-weight:600;color:${c};font-size:0.9em;">${Utils.escapeHtml(e.degree || '')}</div>
            </div>`).join('')}` : ''}
          ${(r.skills || []).length ? `<h3 style="margin:16px 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">Skills</h3>${bars(r.skills, c, '#e8ddd6')}` : ''}
          ${(r.languages || []).length ? `<h3 style="margin:16px 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">Language</h3><ul style="margin:0;padding-left:18px;font-size:0.85em;color:#444;">${r.languages.map(l => `<li style="margin-bottom:3px;">${Utils.escapeHtml(l.name)} – ${Utils.escapeHtml(l.level || '')}</li>`).join('')}</ul>` : ''}
        </div>
        <div>
          ${p.summary ? `<h3 style="margin:0 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">About Me</h3><p style="margin:0 0 14px;font-size:0.88em;color:#333;line-height:1.55;">${Utils.escapeHtml(p.summary)}</p>` : ''}
          ${(r.experience || []).length ? `<h3 style="margin:0 0 10px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">Experience</h3>${r.experience.map(e => `
            <div style="margin-bottom:14px;">
              <div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;">
                <div style="display:flex;align-items:center;gap:8px;"><span style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0;"></span><strong style="font-size:0.95em;">${Utils.escapeHtml(e.jobTitle || '')}</strong></div>
                <span style="font-size:0.8em;color:#888;white-space:nowrap;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span>
              </div>
              <div style="margin-left:16px;font-size:0.82em;color:#666;margin-top:2px;">${Utils.escapeHtml(e.company || '')}${e.location ? ' | ' + Utils.escapeHtml(e.location) : ''}</div>
              <div style="margin-left:16px;margin-top:4px;font-size:0.85em;color:#333;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
            </div>`).join('')}` : ''}
          ${(r.references || []).length && (r.enabledSections || {}).references ? `<h3 style="margin:12px 0 8px;font-size:1.05em;color:#1a1a1a;font-family:Georgia,serif;">References</h3>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.82em;">${r.references.map(ref => `<div><strong>${Utils.escapeHtml(ref.name || '')}</strong><div style="color:#666;">${Utils.escapeHtml(ref.contact || '')}</div></div>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>`;
  };

  /* ---- Full-Stack: brown left sidebar like Tsedneya ---- */
  Preview.tplFullstack = function (r) {
    const p = r.personal || {};
    const c = '#6b4423';
    return `<div style="display:grid;grid-template-columns:38% 62%;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="background:linear-gradient(165deg,#5c3a21 0%,#7a4a2a 50%,#5c3a21 100%);color:#fff;padding:16mm 11mm;">
        <h1 style="margin:0;font-size:1.7em;font-weight:800;line-height:1.1;letter-spacing:-0.02em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:#e8c9a8;margin-top:6px;font-size:0.9em;">${Utils.escapeHtml(p.title) || 'Full-Stack Developer'}</div>
        <div style="text-align:center;margin:18px 0;">${photo(p, 110, 'border:4px solid rgba(255,255,255,0.25);box-shadow:0 8px 24px rgba(0,0,0,0.3);')}</div>
        ${p.summary ? `<div style="background:rgba(255,255,255,0.1);border-radius:14px;padding:12px;font-size:0.78em;line-height:1.5;color:#f5e6d3;"><strong style="display:block;margin-bottom:6px;letter-spacing:0.08em;font-size:0.9em;">ABOUT ME</strong>${Utils.escapeHtml(p.summary)}</div>` : ''}
        <div style="margin-top:14px;">
          ${p.email ? `<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:7px 12px;margin-bottom:7px;font-size:0.78em;display:flex;align-items:center;gap:8px;">✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:7px 12px;margin-bottom:7px;font-size:0.78em;display:flex;align-items:center;gap:8px;">☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:7px 12px;margin-bottom:7px;font-size:0.78em;display:flex;align-items:center;gap:8px;">📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:7px 12px;margin-bottom:7px;font-size:0.78em;display:flex;align-items:center;gap:8px;">in ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          ${p.website ? `<div style="background:rgba(255,255,255,0.12);border-radius:999px;padding:7px 12px;font-size:0.78em;display:flex;align-items:center;gap:8px;">🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
        </div>
        ${(r.languages || []).length ? `<div style="margin-top:18px;"><div style="font-size:0.75em;letter-spacing:0.1em;margin-bottom:8px;">LANGUAGES</div>${dots(r.languages.map(l => ({ name: l.name, level: l.level === 'Native' || l.level === 'Fluent' ? 'Expert' : l.level === 'Advanced' ? 'Advanced' : 'Intermediate' })), '#fff', 'rgba(255,255,255,0.25)')}</div>` : ''}
        ${(r.skills || []).length ? `<div style="margin-top:14px;"><div style="font-size:0.75em;letter-spacing:0.1em;margin-bottom:8px;">SKILLS</div>${dots(r.skills, '#fff', 'rgba(255,255,255,0.25)')}</div>` : ''}
      </div>
      <div style="background:#fff;padding:14mm 12mm;">
        ${(r.education || []).length ? `<div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="background:${c};color:#fff;padding:5px 14px;border-radius:6px;font-size:0.75em;font-weight:700;letter-spacing:0.06em;">EDUCATION</span>
            <span style="flex:1;height:2px;background:linear-gradient(90deg,${c},#e8ddd6);"></span>
            <span style="width:8px;height:8px;border-radius:50%;background:${c};"></span>
          </div>
          ${r.education.map(e => `<div style="margin-bottom:10px;padding-left:4px;">
            <div style="display:flex;justify-content:space-between;"><span style="font-size:0.85em;color:#666;">${Utils.escapeHtml(e.degree || '')}</span><span style="font-size:0.8em;color:#999;">${Utils.formatDate(e.endDate)}</span></div>
            <div style="font-weight:700;color:#1a1a1a;">${Utils.escapeHtml(e.institution || '')}</div>
            ${e.gpa ? `<div style="font-size:0.8em;color:#666;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}
          </div>`).join('')}
        </div>` : ''}
        ${(r.experience || []).length ? `<div style="margin-bottom:18px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="background:${c};color:#fff;padding:5px 14px;border-radius:6px;font-size:0.75em;font-weight:700;letter-spacing:0.06em;">EXPERIENCE</span>
            <span style="flex:1;height:2px;background:linear-gradient(90deg,${c},#e8ddd6);"></span>
            <span style="width:8px;height:8px;border-radius:50%;background:${c};"></span>
          </div>
          ${r.experience.map(e => `<div style="margin-bottom:14px;">
            <div style="font-size:0.78em;color:#999;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
            <div style="font-weight:700;font-size:1em;">${Utils.escapeHtml(e.jobTitle || '')}</div>
            <div style="color:${c};font-size:0.88em;margin-bottom:4px;">${Utils.escapeHtml(e.company || '')}</div>
            <div style="font-size:0.85em;color:#333;white-space:pre-line;line-height:1.45;">${Utils.escapeHtml(e.description || '')}</div>
          </div>`).join('')}
        </div>` : ''}
        ${(r.certifications || []).length ? `<div>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="background:${c};color:#fff;padding:5px 14px;border-radius:6px;font-size:0.75em;font-weight:700;letter-spacing:0.06em;">CERTIFICATES</span>
            <span style="flex:1;height:2px;background:linear-gradient(90deg,${c},#e8ddd6);"></span>
            <span style="width:8px;height:8px;border-radius:50%;background:${c};"></span>
          </div>
          ${r.certifications.map(cert => `<div style="margin-bottom:8px;font-size:0.88em;"><strong>${Utils.escapeHtml(cert.name || '')}</strong> <span style="color:#666;">— ${Utils.escapeHtml(cert.organization || '')}</span></div>`).join('')}
        </div>` : ''}
      </div>
    </div>`;
  };

  /* ---- Sales: clean blue like Rebeka ---- */
  Preview.tplSales = function (r) {
    const p = r.personal || {};
    const c = '#1a6bb5';
    return `<div style="padding:12mm 14mm;font-family:Inter,system-ui,sans-serif;background:#fff;min-height:297mm;box-sizing:border-box;">
      <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:10px;">
        ${photoSq(p, 92, 'border:2px solid #dbeafe;flex-shrink:0;')}
        <div style="flex:1;min-width:0;">
          <h1 style="margin:0;font-size:1.85em;font-weight:800;color:#0f2744;letter-spacing:-0.02em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:${c};font-size:1em;margin-top:2px;">${Utils.escapeHtml(p.title) || 'Sales'}</div>
          <div style="height:2px;background:linear-gradient(90deg,${c},#93c5fd);margin:10px 0 8px;"></div>
          <div style="display:flex;flex-wrap:wrap;gap:10px 14px;font-size:0.78em;color:#475569;">
            ${p.email ? `<span>✉ ${Utils.escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span>☎ ${Utils.escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span>📍 ${Utils.escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<span>in ${Utils.escapeHtml(p.linkedin)}</span>` : ''}
            ${p.website ? `<span>🌐 ${Utils.escapeHtml(p.website)}</span>` : ''}
          </div>
        </div>
      </div>
      ${p.summary ? `<div style="margin:14px 0;"><div style="color:${c};font-weight:700;font-size:0.85em;letter-spacing:0.04em;border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:8px;">ABOUT ME</div><p style="margin:0;font-size:0.88em;color:#334155;line-height:1.55;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
      ${(r.experience || []).length ? `<div style="margin:14px 0;"><div style="color:${c};font-weight:700;font-size:0.85em;letter-spacing:0.04em;border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:10px;">EXPERIENCE</div>${r.experience.map(e => `
        <div style="margin-bottom:12px;">
          <div style="font-size:0.78em;color:#94a3b8;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
          <div style="font-size:0.82em;color:#64748b;">${Utils.escapeHtml(e.company || '')}${e.location ? ', ' + Utils.escapeHtml(e.location) : ''}</div>
          <div style="font-weight:700;color:${c};font-size:0.95em;margin:2px 0 4px;">${Utils.escapeHtml(e.jobTitle || '')}</div>
          <div style="font-size:0.85em;color:#334155;white-space:pre-line;line-height:1.45;">${Utils.escapeHtml(e.description || '').replace(/^•/gm, '→').replace(/^-/gm, '→')}</div>
        </div>`).join('')}</div>` : ''}
      ${(r.education || []).length ? `<div style="margin:14px 0;"><div style="color:${c};font-weight:700;font-size:0.85em;letter-spacing:0.04em;border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:8px;">EDUCATION</div>${r.education.map(e => `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;gap:12px;">
          <div><div style="font-weight:700;">${Utils.escapeHtml(e.institution || '')}</div><div style="color:${c};font-size:0.9em;">${Utils.escapeHtml(e.degree || '')}</div>${e.gpa ? `<div style="font-size:0.82em;color:#64748b;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>
          <span style="font-size:0.85em;color:#94a3b8;">${Utils.formatDate(e.endDate)}</span>
        </div>`).join('')}</div>` : ''}
      ${(r.skills || []).length ? `<div style="margin:14px 0;"><div style="color:${c};font-weight:700;font-size:0.85em;letter-spacing:0.04em;border-bottom:2px solid ${c};padding-bottom:4px;margin-bottom:8px;">SKILLS</div>
        <div style="font-size:0.88em;color:#334155;">${r.skills.map(s => `<div style="margin-bottom:3px;">→ ${Utils.escapeHtml(s.name || '')}${s.level ? ' (' + Utils.escapeHtml(s.level) + ')' : ''}</div>`).join('')}</div></div>` : ''}
    </div>`;
  };

  /* ---- Cinematic Dark ---- */
  Preview.tplCinematic = function (r) {
    const p = r.personal || {};
    const c = '#a78bfa';
    return `<div style="background:#0c0c12;color:#e2e8f0;padding:10mm;min-height:297mm;font-family:Inter,system-ui,sans-serif;box-sizing:border-box;">
      <div style="display:grid;grid-template-columns:36% 64%;gap:14px;">
        <div>
          <div style="text-align:center;margin-bottom:10px;">${photo(p, 100, 'border:3px solid #7c3aed;box-shadow:0 0 28px rgba(124,58,237,0.55);')}</div>
          <h1 style="margin:0;text-align:center;font-size:1.55em;font-weight:800;color:#fff;line-height:1.15;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="text-align:center;color:${c};letter-spacing:0.2em;font-size:0.72em;text-transform:uppercase;margin-top:6px;">${Utils.escapeHtml(p.title) || 'Video Editor'}</div>
          <div style="margin-top:14px;background:#16161f;border-radius:12px;padding:10px;font-size:0.78em;line-height:1.7;color:#94a3b8;">
            <div style="color:${c};font-size:0.85em;font-weight:700;margin-bottom:6px;">CONTACT</div>
            ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
            ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
            ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
            ${p.website ? `<div>🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
            ${p.linkedin ? `<div>in ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          </div>
          ${(r.skills || []).length ? `<div style="margin-top:12px;background:#16161f;border-radius:12px;padding:10px;"><div style="color:${c};font-size:0.75em;font-weight:700;margin-bottom:8px;">SKILLS</div>${bars(r.skills, '#7c3aed', '#2a2a38')}</div>` : ''}
          ${(r.languages || []).length ? `<div style="margin-top:10px;background:#16161f;border-radius:12px;padding:10px;"><div style="color:${c};font-size:0.75em;font-weight:700;margin-bottom:6px;">LANGUAGES</div>${bars(r.languages.map(l => ({ name: l.name, level: l.level === 'Native' || l.level === 'Fluent' ? 'Expert' : 'Advanced' })), '#7c3aed', '#2a2a38')}</div>` : ''}
        </div>
        <div>
          ${p.summary ? `<div style="background:#16161f;border-radius:12px;padding:12px;margin-bottom:10px;"><div style="color:${c};font-size:0.8em;font-weight:700;">ABOUT ME</div><p style="margin:6px 0 0;font-size:0.85em;color:#cbd5e1;line-height:1.5;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
          ${(r.experience || []).length ? `<div style="background:#16161f;border-radius:12px;padding:12px;margin-bottom:10px;"><div style="color:${c};font-size:0.8em;font-weight:700;margin-bottom:8px;">EXPERIENCE</div>${r.experience.map(e => `
            <div style="margin-bottom:12px;padding-left:10px;border-left:2px solid #7c3aed;">
              <div style="font-size:0.72em;color:#94a3b8;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
              <div style="font-weight:700;color:#fff;">${Utils.escapeHtml(e.jobTitle || '')}</div>
              <div style="color:${c};font-size:0.85em;">${Utils.escapeHtml(e.company || '')}</div>
              <div style="font-size:0.8em;color:#cbd5e1;margin-top:3px;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
            </div>`).join('')}</div>` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${(r.education || []).length ? `<div style="background:#16161f;border-radius:12px;padding:10px;"><div style="color:${c};font-size:0.75em;font-weight:700;">EDUCATION</div>${r.education.map(e => `<div style="margin-top:6px;font-size:0.78em;"><strong style="color:#fff;">${Utils.escapeHtml(e.degree || '')}</strong><div style="color:#94a3b8;">${Utils.escapeHtml(e.institution || '')}</div></div>`).join('')}</div>` : '<div></div>'}
            ${(r.achievements || []).length && (r.enabledSections || {}).achievements ? `<div style="background:#16161f;border-radius:12px;padding:10px;"><div style="color:${c};font-size:0.75em;font-weight:700;">ACHIEVEMENTS</div>${r.achievements.map(a => `<div style="margin-top:6px;font-size:0.78em;color:#cbd5e1;">${Utils.escapeHtml(a.name || a.title || '')}</div>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  };

  /* ---- Marketing Gold ---- */
  Preview.tplMarketing = function (r) {
    const p = r.personal || {};
    const c = '#ca8a04';
    const badge = (t) => `<span style="display:inline-block;background:#eab308;color:#fff;padding:3px 10px;border-radius:5px;font-size:0.7em;font-weight:700;letter-spacing:0.04em;">${t}</span>`;
    const nameParts = (p.fullName || 'Your Name').trim().split(/\s+/);
    const first = nameParts.slice(0, -1).join(' ') || nameParts[0];
    const last = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    return `<div style="display:grid;grid-template-columns:36% 64%;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="background:#fffdf5;padding:12mm 9mm;border-right:1px solid #fef08a;">
        ${photoSq(p, 88, 'border:2px solid #fde047;')}
        <h1 style="margin:12px 0 0;font-size:1.5em;font-weight:800;line-height:1.15;color:#0f172a;">${Utils.escapeHtml(first)}${last ? `<br><span style="color:#eab308;">${Utils.escapeHtml(last)}</span>` : ''}</h1>
        <div style="color:${c};font-weight:700;letter-spacing:0.12em;font-size:0.72em;text-transform:uppercase;margin-top:4px;">${Utils.escapeHtml(p.title) || 'Marketing Manager'}</div>
        ${p.summary ? `<div style="margin-top:14px;">${badge('SUMMARY')}<p style="margin:8px 0 0;font-size:0.8em;color:#334155;line-height:1.5;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
        <div style="margin-top:14px;">${badge('CONTACT')}<div style="margin-top:8px;font-size:0.78em;line-height:1.85;color:#475569;">
          ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div>in ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          ${p.website ? `<div>🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
        </div></div>
        ${(r.skills || []).length ? `<div style="margin-top:14px;">${badge('SKILLS')}<div style="margin-top:8px;">${dots(r.skills, '#eab308', '#fef08a')}</div></div>` : ''}
        ${(r.education || []).length ? `<div style="margin-top:14px;">${badge('EDUCATION')}${r.education.map(e => `<div style="margin-top:8px;font-size:0.8em;"><strong>${Utils.escapeHtml(e.degree || '')}</strong><div style="color:#64748b;">${Utils.escapeHtml(e.institution || '')}</div>${e.gpa ? `<div style="color:#666;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${(r.languages || []).length ? `<div style="margin-top:14px;">${badge('LANGUAGES')}<div style="margin-top:8px;">${dots(r.languages.map(l => ({ name: l.name, level: l.level === 'Native' || l.level === 'Fluent' ? 'Expert' : l.level === 'Advanced' ? 'Advanced' : 'Intermediate' })), '#eab308', '#fef08a')}</div></div>` : ''}
      </div>
      <div style="padding:12mm 11mm;background:#fff;">
        ${(r.experience || []).length ? `<div style="margin-bottom:16px;">${badge('WORK EXPERIENCE')}${r.experience.map(e => `
          <div style="margin-top:12px;display:grid;grid-template-columns:10px 1fr;gap:10px;">
            <div style="padding-top:5px;"><span style="display:block;width:10px;height:10px;border-radius:50%;background:#eab308;"></span></div>
            <div>
              <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;"><strong style="font-size:0.95em;">${Utils.escapeHtml(e.jobTitle || '')}</strong>
                <span style="font-size:0.72em;background:#fef9c3;color:#854d0e;padding:2px 8px;border-radius:4px;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
              <div style="color:${c};font-size:0.88em;font-weight:600;">${Utils.escapeHtml(e.company || '')}</div>
              <div style="margin-top:4px;font-size:0.85em;color:#334155;white-space:pre-line;line-height:1.45;">${Utils.escapeHtml(e.description || '')}</div>
            </div>
          </div>`).join('')}</div>` : ''}
        ${(r.certifications || []).length ? `<div>${badge('CERTIFICATIONS')}<ul style="margin:10px 0 0;padding-left:18px;font-size:0.85em;">${r.certifications.map(cert => `<li style="margin-bottom:5px;"><strong>${Utils.escapeHtml(cert.name || '')}</strong> — ${Utils.escapeHtml(cert.organization || '')}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  };

  /* ---- Clinical Care: green medical ---- */
  Preview.tplClinical = function (r) {
    const p = r.personal || {};
    const c = '#166534';
    const nameParts = (p.fullName || 'Your Name').trim().split(/\s+/);
    const first = nameParts[0] || 'Your';
    const rest = nameParts.slice(1).join(' ') || 'Name';
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;font-family:Inter,system-ui,sans-serif;background:#fefce8;">
      <div style="background:linear-gradient(180deg,#14532d 0%,#166534 60%,#15803d 100%);color:#fff;padding:12mm 9mm;border-radius:0 40px 0 0;">
        <div style="text-align:center;">${photo(p, 105, 'border:4px solid rgba(255,255,255,0.35);box-shadow:0 6px 20px rgba(0,0,0,0.25);')}</div>
        <div style="text-align:center;margin-top:12px;">
          <div style="font-family:Georgia,'Brush Script MT',cursive;font-size:1.6em;font-style:italic;color:#bbf7d0;">${Utils.escapeHtml(first)}</div>
          <div style="font-size:1.15em;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;margin-top:2px;">${Utils.escapeHtml(rest)}</div>
          <div style="color:#86efac;font-size:0.72em;letter-spacing:0.14em;text-transform:uppercase;margin-top:6px;">${Utils.escapeHtml(p.title) || 'Registered Nurse'}</div>
        </div>
        ${p.summary ? `<div style="margin-top:16px;font-size:0.78em;line-height:1.5;color:#dcfce7;"><strong style="color:#fff;display:block;margin-bottom:4px;">ABOUT ME</strong>${Utils.escapeHtml(p.summary)}</div>` : ''}
        <div style="margin-top:14px;font-size:0.78em;line-height:1.9;color:#bbf7d0;">
          <strong style="color:#fff;display:block;margin-bottom:4px;">CONTACT</strong>
          ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div>in ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
        </div>
        ${(r.skills || []).length ? `<div style="margin-top:14px;"><strong style="font-size:0.75em;color:#fff;">CORE STRENGTHS</strong><div style="margin-top:6px;font-size:0.78em;color:#dcfce7;">${r.skills.map(s => `• ${Utils.escapeHtml(s.name || '')}`).join('<br>')}</div></div>` : ''}
      </div>
      <div style="padding:11mm 11mm;position:relative;">
        <div style="position:absolute;top:12px;right:16px;background:${c};color:#fff;border-radius:12px;padding:8px 10px;text-align:center;font-size:0.65em;line-height:1.3;max-width:90px;">
          <div style="font-size:1.2em;">♥</div>
          <div style="letter-spacing:0.04em;margin-top:2px;">CARE<br>COMPASSION<br>COMMITMENT</div>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px 12px;font-size:0.75em;color:#475569;margin-bottom:12px;padding-right:100px;">
          ${p.phone ? `<span>☎ ${Utils.escapeHtml(p.phone)}</span>` : ''}
          ${p.email ? `<span>✉ ${Utils.escapeHtml(p.email)}</span>` : ''}
          ${p.location ? `<span>📍 ${Utils.escapeHtml(p.location)}</span>` : ''}
        </div>
        <div style="background:#fff;border:1px solid #d9f99d;border-radius:12px;padding:12px;margin-bottom:14px;">
          <div style="color:${c};font-weight:700;font-size:0.8em;display:flex;align-items:center;gap:6px;">♡ PROFESSIONAL SUMMARY</div>
          <p style="margin:6px 0 0;font-size:0.85em;color:#334155;line-height:1.5;">${Utils.escapeHtml(p.summary || '')}</p>
        </div>
        ${(r.experience || []).length ? `<div style="margin-bottom:14px;"><div style="color:${c};font-weight:700;font-size:0.85em;margin-bottom:8px;">PROFESSIONAL EXPERIENCE</div>${r.experience.map(e => `
          <div style="margin-bottom:12px;padding-left:14px;border-left:2px solid #86efac;position:relative;">
            <span style="position:absolute;left:-6px;top:4px;width:10px;height:10px;border-radius:50%;background:${c};border:2px solid #fefce8;"></span>
            <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;"><strong style="font-size:0.92em;">${Utils.escapeHtml(e.jobTitle || '')}</strong>
              <span style="font-size:0.75em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
            <div style="color:${c};font-size:0.82em;">${Utils.escapeHtml(e.company || '')}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
            <div style="margin-top:3px;font-size:0.82em;color:#334155;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
          </div>`).join('')}</div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;border-top:1px solid #d9f99d;padding-top:12px;">
          ${(r.education || []).length ? `<div><div style="color:${c};font-weight:700;font-size:0.75em;">EDUCATION</div>${r.education.map(e => `<div style="margin-top:6px;font-size:0.75em;"><strong>${Utils.escapeHtml(e.degree || '')}</strong><div style="color:#64748b;">${Utils.escapeHtml(e.institution || '')}</div>${e.gpa ? `<div>GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : ''}
          ${(r.certifications || []).length ? `<div><div style="color:${c};font-weight:700;font-size:0.75em;">CERTIFICATIONS</div>${r.certifications.map(cert => `<div style="margin-top:5px;font-size:0.75em;">✓ ${Utils.escapeHtml(cert.name || '')}</div>`).join('')}</div>` : ''}
          ${(r.skills || []).length ? `<div><div style="color:${c};font-weight:700;font-size:0.75em;">SKILLS</div><div style="margin-top:6px;">${dots(r.skills, c, '#bbf7d0')}</div></div>` : ''}
        </div>
      </div>
    </div>`;
  };
})();
