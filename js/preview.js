/* ============================================
   Yeni Pro CV — Live Preview Renderer
   ============================================ */

const Preview = {
  render(resume, container) {
    if (!container) return;
    const t = resume.template || 'modern';
    const c = resume.customization || {};
    const accent = c.accentColor || '#0d9488';
    const font = c.font || 'Inter';
    const fontSizeMap = { small: '9.5pt', medium: '10.5pt', large: '11.5pt' };
    const spacingMap = { compact: '1.25', normal: '1.45', comfortable: '1.65' };
    const fs = fontSizeMap[c.fontSize] || '10.5pt';
    const lh = spacingMap[c.spacing] || '1.45';
    container.style.setProperty('--resume-accent', accent);
    container.style.setProperty('--resume-font', font);
    container.style.fontFamily = font + ', system-ui, sans-serif';
    container.style.fontSize = fs;
    container.style.lineHeight = lh;
    container.dataset.template = t;
    let html = '';
    switch (t) {
      case 'minimal': html = this.tplMinimal(resume, accent); break;
      case 'corporate': html = this.tplCorporate(resume, accent); break;
      case 'creative': html = this.tplCreative(resume, accent); break;
      case 'elegant': html = this.tplElegant(resume, accent); break;
      case 'executive': html = this.tplExecutive(resume, accent); break;
      case 'tech': html = this.tplTech(resume, accent); break;
      case 'student': html = this.tplStudent(resume, accent); break;
      case 'two-column': html = this.tplTwoColumn(resume, accent); break;
      case 'ats': html = this.tplATS(resume, accent); break;
      case 'hr': html = this.tplHR(resume, accent); break;
      case 'fullstack': html = this.tplFullstack(resume, accent); break;
      case 'sales': html = this.tplSales(resume, accent); break;
      case 'cinematic': html = this.tplCinematic(resume, accent); break;
      case 'marketing': html = this.tplMarketing(resume, accent); break;
      case 'clinical': html = this.tplClinical(resume, accent); break;
      default: html = this.tplModern(resume, accent);
    }
    container.innerHTML = html;
  },

  photoHtml(p, size = 90, extra = '') {
    if (!p.photo) return '';
    const shape = p.photoShape === 'square' ? 'border-radius:8px' : 'border-radius:50%';
    return `<img src="${p.photo}" alt="Photo" style="width:${size}px;height:${size}px;object-fit:cover;${shape};border:2px solid #e2e8f0;${extra}" />`;
  },

  contactLine(p) {
    const parts = [];
    if (p.email) parts.push(`📧 ${Utils.escapeHtml(p.email)}`);
    if (p.phone) parts.push(`📱 ${Utils.escapeHtml(p.phone)}`);
    if (p.location) parts.push(`📍 ${Utils.escapeHtml(p.location)}`);
    if (p.website) parts.push(`🌐 ${Utils.escapeHtml(p.website)}`);
    if (p.linkedin) parts.push(`🔗 ${Utils.escapeHtml(p.linkedin)}`);
    if (p.github) parts.push(`🐙 ${Utils.escapeHtml(p.github)}`);
    return parts.join('  ·  ');
  },

  contactBlockRight(p) {
    const lines = [];
    if (p.email) lines.push(`<div style="margin-bottom:3px;">📧 ${Utils.escapeHtml(p.email)}</div>`);
    if (p.phone) lines.push(`<div style="margin-bottom:3px;">📱 ${Utils.escapeHtml(p.phone)}</div>`);
    if (p.location) lines.push(`<div style="margin-bottom:3px;">📍 ${Utils.escapeHtml(p.location)}</div>`);
    if (p.website) lines.push(`<div style="margin-bottom:3px;">🌐 ${Utils.escapeHtml(p.website)}</div>`);
    if (p.linkedin) lines.push(`<div style="margin-bottom:3px;">🔗 ${Utils.escapeHtml(p.linkedin)}</div>`);
    if (p.github) lines.push(`<div style="margin-bottom:3px;">🐙 ${Utils.escapeHtml(p.github)}</div>`);
    return lines.join('');
  },

  sectionTitle(title, accent) {
    return `<h2 class="resume-section-title" style="color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin:16px 0 8px;font-size:1.05em;text-transform:uppercase;letter-spacing:0.06em;">${title}</h2>`;
  },

  genericList(title, items, enabled, accent, mapper) {
    if (!enabled || !items || !items.length) return '';
    return this.sectionTitle(title, accent) + items.map(i => `<div style="margin-bottom:4px;">${mapper(i)}</div>`).join('');
  },

  skillsHtml(skills, display, accent) {
    if (!skills || !skills.length) return '';
    if (display === 'badges') {
      return `<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;">${skills.map(s =>
        `<span style="background:${accent}18;color:${accent};padding:3px 10px;border-radius:999px;font-size:0.9em;font-weight:500;white-space:nowrap;">${Utils.escapeHtml(s.name)}${s.level ? ' · ' + Utils.escapeHtml(s.level) : ''}</span>`
      ).join('')}</div>`;
    }
    const parts = skills.map(s => {
      const name = Utils.escapeHtml(s.name || '');
      const level = s.level ? ` (${Utils.escapeHtml(s.level)})` : '';
      return name + level;
    });
    return `<div style="font-size:0.95em;line-height:1.55;">${parts.join(', ')}</div>`;
  },

  skillBars(skills, color) {
    if (!skills || !skills.length) return '';
    const levelPct = { Beginner: 35, Intermediate: 55, Advanced: 75, Expert: 92 };
    return skills.map(s => {
      const pct = levelPct[s.level] || 60;
      return `<div style="margin-bottom:6px;"><div style="font-size:0.85em;margin-bottom:2px;">${Utils.escapeHtml(s.name || '')}</div>
        <div style="height:6px;background:#e2e8f0;border-radius:999px;overflow:hidden;"><div style="height:100%;width:${pct}%;background:${color};border-radius:999px;"></div></div></div>`;
    }).join('');
  },

  renderItems(items, renderer) {
    if (!items || !items.length) return '';
    return items.map(renderer).join('');
  },

  tplModern(r, accent) {
    const p = r.personal;
    const order = r.sectionOrder || ['summary','experience','education','skills','projects','certifications','languages','awards','volunteer','publications','interests','references','achievements'];
    const enabled = r.enabledSections || {};
    let body = '';
    const sections = {
      summary: () => p.summary ? `${this.sectionTitle('Professional Summary', accent)}<p style="margin:0 0 8px;">${Utils.escapeHtml(p.summary).replace(/\n/g, '<br>')}</p>` : '',
      experience: () => {
        if (!enabled.experience || !(r.experience||[]).length) return '';
        return this.sectionTitle('Experience', accent) + this.renderItems(r.experience, e => `
          <div style="margin-bottom:12px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong>
              <span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
            <div style="color:#475569;font-size:0.95em;">${Utils.escapeHtml(e.company)}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
            <div style="margin-top:4px;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div></div>`);
      },
      education: () => {
        if (!enabled.education || !(r.education||[]).length) return '';
        return this.sectionTitle('Education', accent) + this.renderItems(r.education, e => `
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.degree)}</strong>
              <span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${Utils.formatDate(e.endDate)}</span></div>
            <div style="color:#475569;">${Utils.escapeHtml(e.institution)}${e.gpa ? ' · GPA: ' + Utils.escapeHtml(e.gpa) : ''}</div></div>`);
      },
      skills: () => {
        if (!enabled.skills || !(r.skills||[]).length) return '';
        return this.sectionTitle('Skills', accent) + this.skillsHtml(r.skills, r.customization?.skillsDisplay || 'text', accent);
      },
      projects: () => {
        if (!enabled.projects || !(r.projects||[]).length) return '';
        return this.sectionTitle('Projects', accent) + this.renderItems(r.projects, pr => `
          <div style="margin-bottom:10px;"><strong>${Utils.escapeHtml(pr.name)}</strong>
            ${pr.technologies ? `<span style="color:#64748b;font-size:0.9em;"> · ${Utils.escapeHtml(pr.technologies)}</span>` : ''}
            <div style="margin-top:2px;">${Utils.escapeHtml(pr.description || '')}</div></div>`);
      },
      certifications: () => {
        if (!enabled.certifications || !(r.certifications||[]).length) return '';
        return this.sectionTitle('Certifications', accent) + this.renderItems(r.certifications, c =>
          `<div style="margin-bottom:6px;"><strong>${Utils.escapeHtml(c.name)}</strong> — ${Utils.escapeHtml(c.organization)}</div>`);
      },
      languages: () => {
        if (!enabled.languages || !(r.languages||[]).length) return '';
        return this.sectionTitle('Languages', accent) + `<div>${r.languages.map(l => `${Utils.escapeHtml(l.name)} (${Utils.escapeHtml(l.level || '')})`).join(', ')}</div>`;
      },
      awards: () => this.genericList('Awards', r.awards, enabled.awards, accent, a => `<strong>${Utils.escapeHtml(a.name || '')}</strong>${a.description ? ' — ' + Utils.escapeHtml(a.description) : ''}`),
      volunteer: () => this.genericList('Volunteer Experience', r.volunteer, enabled.volunteer, accent, v => `<strong>${Utils.escapeHtml(v.role || '')}</strong> at ${Utils.escapeHtml(v.organization || '')}`),
      publications: () => this.genericList('Publications', r.publications, enabled.publications, accent, p => Utils.escapeHtml(p.title || p.name || '')),
      interests: () => this.genericList('Interests', r.interests, enabled.interests, accent, i => Utils.escapeHtml(i.name || i)),
      references: () => this.genericList('References', r.references, enabled.references, accent, ref => `${Utils.escapeHtml(ref.name || '')} — ${Utils.escapeHtml(ref.contact || '')}`),
      achievements: () => this.genericList('Achievements', r.achievements, enabled.achievements, accent, a => Utils.escapeHtml(a.name || a.title || a))
    };
    order.forEach(key => { if (sections[key]) body += sections[key](); });
    return `<div style="padding:18mm 16mm;">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:14px;border-bottom:2px solid ${accent};padding-bottom:12px;">
        <div style="display:flex;align-items:center;gap:16px;flex:1;min-width:0;">
          ${this.photoHtml(p, 80)}
          <div>
            <h1 style="margin:0;font-size:1.75em;font-weight:700;color:#0f172a;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
            <div style="color:${accent};font-size:1.1em;font-weight:500;margin-top:3px;">${Utils.escapeHtml(p.title) || 'Professional Title'}</div>
          </div>
        </div>
        <div style="text-align:right;font-size:0.82em;color:#475569;line-height:1.55;flex-shrink:0;max-width:42%;">${this.contactBlockRight(p)}</div>
      </div>
      ${body}
    </div>`;
  },

  tplMinimal(r, accent) {
    const p = r.personal;
    return `<div style="padding:20mm 18mm;font-family:Georgia,serif;">
      <h1 style="margin:0;font-size:1.9em;font-weight:400;text-align:center;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div style="text-align:center;color:#64748b;margin:6px 0 4px;">${Utils.escapeHtml(p.title)}</div>
      <div style="text-align:center;font-size:0.8em;color:#94a3b8;margin-bottom:18px;">${this.contactLine(p)}</div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplCorporate(r, accent) {
    const p = r.personal;
    return `<div style="padding:0;">
      <div style="background:${accent};color:#fff;padding:16mm 16mm 12mm;">
        <h1 style="margin:0;font-size:1.7em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="opacity:0.9;margin-top:4px;">${Utils.escapeHtml(p.title)}</div>
        <div style="font-size:0.85em;margin-top:8px;opacity:0.85;">${this.contactLine(p)}</div>
      </div>
      <div style="padding:12mm 16mm;">${this._simpleSections(r, accent)}</div>
    </div>`;
  },

  tplCreative(r, accent) {
    const p = r.personal;
    return `<div style="display:grid;grid-template-columns:32% 68%;min-height:297mm;">
      <div style="background:${accent};color:#fff;padding:16mm 10mm;">
        ${this.photoHtml(p, 100)}
        <h1 style="margin:12px 0 4px;font-size:1.4em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="opacity:0.9;">${Utils.escapeHtml(p.title)}</div>
        <div style="margin-top:16px;font-size:0.8em;line-height:1.7;">
          ${p.email ? `<div>📧 ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>📱 ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
        </div>
        ${(r.skills||[]).length ? `<div style="margin-top:20px;"><strong style="font-size:0.85em;">SKILLS</strong><div style="margin-top:8px;">${this.skillsHtml(r.skills, 'badges', '#fff')}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplElegant(r, accent) {
    const p = r.personal;
    return `<div style="padding:18mm 20mm;font-family:Merriweather,Georgia,serif;">
      <div style="text-align:center;border-bottom:1px solid ${accent};padding-bottom:12px;margin-bottom:16px;">
        ${this.photoHtml(p, 80)}
        <h1 style="margin:10px 0 2px;font-size:1.85em;font-weight:400;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};font-style:italic;">${Utils.escapeHtml(p.title)}</div>
        <div style="font-size:0.8em;color:#64748b;margin-top:8px;">${this.contactLine(p)}</div>
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplExecutive(r, accent) {
    const p = r.personal;
    return `<div style="padding:16mm;">
      <div style="display:flex;justify-content:space-between;gap:20px;border-bottom:3px solid ${accent};padding-bottom:12px;margin-bottom:14px;">
        <div style="flex:1;">
          <h1 style="margin:0;font-size:1.75em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:${accent};margin-top:2px;">${Utils.escapeHtml(p.title)}</div>
        </div>
        <div style="text-align:right;font-size:0.82em;color:#475569;">${this.contactBlockRight(p)}</div>
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplTech(r, accent) {
    const p = r.personal;
    return `<div style="padding:14mm 15mm;font-family:'JetBrains Mono',monospace;">
      <div style="border-left:4px solid ${accent};padding-left:12px;margin-bottom:16px;">
        <h1 style="margin:0;font-size:1.6em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};">// ${Utils.escapeHtml(p.title) || 'Developer'}</div>
        <div style="font-size:0.8em;color:#64748b;margin-top:6px;">${this.contactLine(p)}</div>
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplStudent(r, accent) {
    const p = r.personal;
    return `<div style="padding:16mm;">
      <h1 style="margin:0;font-size:1.7em;color:${accent};">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div style="margin:2px 0 6px;">${Utils.escapeHtml(p.title) || 'Student'}</div>
      <div style="font-size:0.85em;color:#64748b;margin-bottom:14px;">${this.contactLine(p)}</div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplTwoColumn(r, accent) {
    const p = r.personal;
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;">
      <div style="background:#f1f5f9;padding:14mm 10mm;">
        ${this.photoHtml(p, 90)}
        <h1 style="margin:12px 0 2px;font-size:1.3em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};">${Utils.escapeHtml(p.title)}</div>
        <div style="font-size:0.8em;color:#64748b;margin:10px 0 16px;line-height:1.7;">
          ${p.email ? `<div>📧 ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>📱 ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
        </div>
        ${(r.skills||[]).length ? `<div style="margin-bottom:14px;"><strong style="color:${accent};font-size:0.85em;">SKILLS</strong><div style="margin-top:6px;">${this.skillsHtml(r.skills, 'badges', accent)}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplATS(r, accent) {
    const p = r.personal;
    return `<div style="padding:15mm 18mm;font-family:Arial,Helvetica,sans-serif;font-size:11pt;">
      <div style="display:flex;justify-content:space-between;gap:16px;margin-bottom:12px;border-bottom:1px solid #333;padding-bottom:8px;">
        <div>
          <h1 style="margin:0;font-size:16pt;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div>${Utils.escapeHtml(p.title)}</div>
        </div>
        <div style="text-align:right;font-size:9.5pt;">${this.contactBlockRight(p)}</div>
      </div>
      ${p.summary ? `<div style="margin-bottom:10px;"><strong>PROFESSIONAL SUMMARY</strong><br>${Utils.escapeHtml(p.summary)}</div>` : ''}
      ${(r.experience||[]).length ? `<div style="margin-bottom:10px;"><strong>EXPERIENCE</strong>${r.experience.map(e => `
        <div style="margin:6px 0;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong> | ${Utils.escapeHtml(e.company)} | ${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}<br>${Utils.escapeHtml(e.description || '')}</div>`).join('')}</div>` : ''}
      ${(r.education||[]).length ? `<div style="margin-bottom:10px;"><strong>EDUCATION</strong>${r.education.map(e => `
        <div style="margin:4px 0;">${Utils.escapeHtml(e.degree)} — ${Utils.escapeHtml(e.institution)}${e.gpa ? ' · GPA: ' + Utils.escapeHtml(e.gpa) : ''}</div>`).join('')}</div>` : ''}
      ${(r.skills||[]).length ? `<div style="margin-bottom:10px;"><strong>SKILLS</strong><br>${r.skills.map(s => Utils.escapeHtml(s.name) + (s.level ? ' (' + Utils.escapeHtml(s.level) + ')' : '')).join(', ')}</div>` : ''}
    </div>`;
  },

  /* ===== NEW: HR Management (burgundy header) ===== */
  tplHR(r, accent) {
    const p = r.personal;
    const c = '#4a1515';
    return `<div style="padding:0;font-family:Inter,system-ui,sans-serif;">
      <div style="background:${c};color:#fff;padding:14mm 16mm;display:flex;align-items:center;gap:18px;">
        ${this.photoHtml(p, 88, 'border:3px solid rgba(255,255,255,0.35);')}
        <div>
          <h1 style="margin:0;font-size:1.7em;letter-spacing:0.04em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:#f5d0d0;margin-top:4px;font-size:1.05em;">${Utils.escapeHtml(p.title) || 'HR & Management'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:38% 62%;gap:0;min-height:220mm;">
        <div style="padding:12mm 10mm;background:#faf7f5;border-right:1px solid #e7e0dc;">
          <h3 style="color:${c};margin:0 0 8px;font-size:0.95em;">Contact</h3>
          <div style="font-size:0.82em;line-height:1.7;color:#475569;">
            ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
            ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
            ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
            ${p.linkedin ? `<div>🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          </div>
          ${(r.education||[]).length ? `<h3 style="color:${c};margin:16px 0 8px;font-size:0.95em;">Education</h3>${r.education.map(e => `
            <div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;"><strong style="font-size:0.9em;">${Utils.escapeHtml(e.institution)}</strong><span style="font-size:0.8em;color:#64748b;">${Utils.formatDate(e.endDate)}</span></div>
            <div style="font-size:0.85em;color:${c};">${Utils.escapeHtml(e.degree)}</div>${e.gpa ? `<div style="font-size:0.8em;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}` : ''}
          ${(r.skills||[]).length ? `<h3 style="color:${c};margin:16px 0 8px;font-size:0.95em;">Skills</h3>${this.skillBars(r.skills, c)}` : ''}
          ${(r.languages||[]).length ? `<h3 style="color:${c};margin:16px 0 8px;font-size:0.95em;">Language</h3><ul style="margin:0;padding-left:16px;font-size:0.85em;">${r.languages.map(l => `<li>${Utils.escapeHtml(l.name)} – ${Utils.escapeHtml(l.level || '')}</li>`).join('')}</ul>` : ''}
        </div>
        <div style="padding:12mm 12mm;">
          ${p.summary ? `<h3 style="color:${c};margin:0 0 8px;font-size:0.95em;">About Me</h3><p style="margin:0 0 14px;font-size:0.9em;color:#334155;">${Utils.escapeHtml(p.summary)}</p>` : ''}
          ${(r.experience||[]).length ? `<h3 style="color:${c};margin:0 0 10px;font-size:0.95em;">Experience</h3>${r.experience.map(e => `
            <div style="margin-bottom:12px;padding-left:12px;border-left:3px solid ${c};">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong><span style="font-size:0.85em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
              <div style="font-size:0.85em;color:#64748b;">${Utils.escapeHtml(e.company)}${e.location ? ' | ' + Utils.escapeHtml(e.location) : ''}</div>
              <div style="margin-top:4px;font-size:0.88em;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
            </div>`).join('')}` : ''}
          ${(r.references||[]).length && (r.enabledSections||{}).references ? `<h3 style="color:${c};margin:12px 0 8px;font-size:0.95em;">References</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:0.85em;">${r.references.map(ref => `<div><strong>${Utils.escapeHtml(ref.name || '')}</strong><div style="color:#64748b;">${Utils.escapeHtml(ref.contact || '')}</div></div>`).join('')}</div>` : ''}
        </div>
      </div>
    </div>`;
  },

  /* ===== NEW: Full-Stack Sidebar (brown) ===== */
  tplFullstack(r, accent) {
    const p = r.personal;
    const c = '#5c3d2e';
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="background:${c};color:#fff;padding:14mm 10mm;">
        <div style="text-align:center;">${this.photoHtml(p, 100, 'border:3px solid rgba(255,255,255,0.3);margin:0 auto;')}</div>
        <h1 style="margin:14px 0 4px;font-size:1.35em;text-align:center;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="text-align:center;color:#e8c4a8;font-size:0.9em;">${Utils.escapeHtml(p.title) || 'Full-Stack Developer'}</div>
        ${p.summary ? `<div style="margin-top:16px;background:rgba(255,255,255,0.08);padding:10px;border-radius:10px;font-size:0.8em;line-height:1.5;">${Utils.escapeHtml(p.summary)}</div>` : ''}
        <div style="margin-top:16px;font-size:0.8em;line-height:1.9;">
          ${p.email ? `<div style="background:rgba(255,255,255,0.12);padding:4px 10px;border-radius:999px;margin-bottom:6px;">✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div style="background:rgba(255,255,255,0.12);padding:4px 10px;border-radius:999px;margin-bottom:6px;">☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div style="background:rgba(255,255,255,0.12);padding:4px 10px;border-radius:999px;margin-bottom:6px;">📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div style="background:rgba(255,255,255,0.12);padding:4px 10px;border-radius:999px;margin-bottom:6px;">🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          ${p.website ? `<div style="background:rgba(255,255,255,0.12);padding:4px 10px;border-radius:999px;">🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
        </div>
        ${(r.languages||[]).length ? `<div style="margin-top:18px;"><strong style="font-size:0.8em;">LANGUAGES</strong>${r.languages.map(l => `<div style="font-size:0.8em;margin-top:4px;">${Utils.escapeHtml(l.name)} — ${Utils.escapeHtml(l.level || '')}</div>`).join('')}</div>` : ''}
        ${(r.skills||[]).length ? `<div style="margin-top:14px;"><strong style="font-size:0.8em;">SKILLS</strong><div style="margin-top:6px;">${this.skillsHtml(r.skills, 'badges', '#e8c4a8')}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;background:#fff;">
        ${(r.education||[]).length ? `<div style="margin-bottom:16px;"><span style="background:${c};color:#fff;padding:3px 12px;border-radius:6px;font-size:0.8em;font-weight:700;">EDUCATION</span>
          ${r.education.map(e => `<div style="margin-top:10px;"><div style="display:flex;justify-content:space-between;"><strong>${Utils.escapeHtml(e.degree)}</strong><span style="font-size:0.85em;color:#64748b;">${Utils.formatDate(e.endDate)}</span></div>
          <div style="color:${c};font-size:0.9em;">${Utils.escapeHtml(e.institution)}</div>${e.gpa ? `<div style="font-size:0.85em;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${(r.experience||[]).length ? `<div style="margin-bottom:16px;"><span style="background:${c};color:#fff;padding:3px 12px;border-radius:6px;font-size:0.8em;font-weight:700;">EXPERIENCE</span>
          ${r.experience.map(e => `<div style="margin-top:12px;"><div style="font-size:0.8em;color:#94a3b8;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
          <strong>${Utils.escapeHtml(e.jobTitle)}</strong><div style="color:${c};font-size:0.9em;">${Utils.escapeHtml(e.company)}</div>
          <div style="margin-top:4px;font-size:0.88em;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div></div>`).join('')}</div>` : ''}
        ${(r.certifications||[]).length ? `<div><span style="background:${c};color:#fff;padding:3px 12px;border-radius:6px;font-size:0.8em;font-weight:700;">CERTIFICATES</span>
          ${r.certifications.map(c => `<div style="margin-top:8px;font-size:0.9em;"><strong>${Utils.escapeHtml(c.name)}</strong> — ${Utils.escapeHtml(c.organization)}</div>`).join('')}</div>` : ''}
      </div>
    </div>`;
  },

  /* ===== NEW: Sales Executive (blue ATS-clean) ===== */
  tplSales(r, accent) {
    const p = r.personal;
    const c = '#1e5a8a';
    return `<div style="padding:14mm 16mm;font-family:Inter,system-ui,sans-serif;">
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:12px;border-bottom:2px solid ${c};padding-bottom:12px;">
        ${this.photoHtml(p, 80, 'border-radius:8px;')}
        <div style="flex:1;">
          <h1 style="margin:0;font-size:1.75em;color:${c};">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:#475569;margin-top:2px;">${Utils.escapeHtml(p.title) || 'Sales'}</div>
          <div style="font-size:0.82em;color:#64748b;margin-top:6px;display:flex;flex-wrap:wrap;gap:10px;">
            ${p.email ? `<span>✉ ${Utils.escapeHtml(p.email)}</span>` : ''}
            ${p.phone ? `<span>☎ ${Utils.escapeHtml(p.phone)}</span>` : ''}
            ${p.location ? `<span>📍 ${Utils.escapeHtml(p.location)}</span>` : ''}
            ${p.linkedin ? `<span>🔗 ${Utils.escapeHtml(p.linkedin)}</span>` : ''}
            ${p.website ? `<span>🌐 ${Utils.escapeHtml(p.website)}</span>` : ''}
          </div>
        </div>
      </div>
      ${p.summary ? `<h3 style="color:${c};margin:0 0 6px;font-size:0.95em;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">ABOUT ME</h3><p style="margin:0 0 14px;font-size:0.9em;">${Utils.escapeHtml(p.summary)}</p>` : ''}
      ${(r.experience||[]).length ? `<h3 style="color:${c};margin:0 0 8px;font-size:0.95em;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">EXPERIENCE</h3>${r.experience.map(e => `
        <div style="margin-bottom:12px;">
          <div style="font-size:0.8em;color:#94a3b8;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
          <div style="color:#64748b;font-size:0.85em;">${Utils.escapeHtml(e.company)}${e.location ? ', ' + Utils.escapeHtml(e.location) : ''}</div>
          <strong style="color:${c};">${Utils.escapeHtml(e.jobTitle)}</strong>
          <div style="margin-top:4px;font-size:0.88em;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
        </div>`).join('')}` : ''}
      ${(r.education||[]).length ? `<h3 style="color:${c};margin:0 0 8px;font-size:0.95em;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">EDUCATION</h3>${r.education.map(e => `
        <div style="margin-bottom:8px;display:flex;justify-content:space-between;flex-wrap:wrap;">
          <div><strong>${Utils.escapeHtml(e.institution)}</strong><div style="color:${c};font-size:0.9em;">${Utils.escapeHtml(e.degree)}</div>${e.gpa ? `<div style="font-size:0.85em;">GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>
          <span style="font-size:0.85em;color:#64748b;">${Utils.formatDate(e.endDate)}</span>
        </div>`).join('')}` : ''}
      ${(r.skills||[]).length ? `<h3 style="color:${c};margin:0 0 8px;font-size:0.95em;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">SKILLS</h3>${this.skillsHtml(r.skills, r.customization?.skillsDisplay || 'text', c)}` : ''}
    </div>`;
  },

  /* ===== NEW: Cinematic Dark ===== */
  tplCinematic(r, accent) {
    const p = r.personal;
    const c = '#a78bfa';
    return `<div style="background:#0f0f14;color:#e2e8f0;padding:12mm;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="display:grid;grid-template-columns:38% 62%;gap:16px;">
        <div>
          <div style="text-align:center;">${this.photoHtml(p, 100, 'border:3px solid #7c3aed;box-shadow:0 0 20px rgba(124,58,237,0.4);')}</div>
          <h1 style="margin:12px 0 2px;font-size:1.5em;text-align:center;color:#fff;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="text-align:center;color:${c};letter-spacing:0.15em;font-size:0.8em;text-transform:uppercase;">${Utils.escapeHtml(p.title) || 'Video Editor'}</div>
          <div style="margin-top:14px;font-size:0.8em;line-height:1.8;color:#94a3b8;">
            ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
            ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
            ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
            ${p.website ? `<div>🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
          </div>
          ${(r.skills||[]).length ? `<div style="margin-top:16px;"><strong style="color:${c};font-size:0.8em;">SKILLS</strong>${this.skillBars(r.skills, '#7c3aed')}</div>` : ''}
          ${(r.languages||[]).length ? `<div style="margin-top:12px;"><strong style="color:${c};font-size:0.8em;">LANGUAGES</strong>${r.languages.map(l => `<div style="font-size:0.8em;margin-top:3px;">${Utils.escapeHtml(l.name)} — ${Utils.escapeHtml(l.level || '')}</div>`).join('')}</div>` : ''}
        </div>
        <div>
          ${p.summary ? `<div style="background:#1a1a24;border-radius:10px;padding:12px;margin-bottom:12px;"><strong style="color:${c};font-size:0.85em;">ABOUT ME</strong><p style="margin:6px 0 0;font-size:0.85em;color:#cbd5e1;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
          ${(r.experience||[]).length ? `<div style="background:#1a1a24;border-radius:10px;padding:12px;margin-bottom:12px;"><strong style="color:${c};font-size:0.85em;">EXPERIENCE</strong>${r.experience.map(e => `
            <div style="margin-top:10px;padding-left:10px;border-left:2px solid #7c3aed;">
              <div style="font-size:0.75em;color:#94a3b8;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</div>
              <strong style="color:#fff;">${Utils.escapeHtml(e.jobTitle)}</strong>
              <div style="color:${c};font-size:0.85em;">${Utils.escapeHtml(e.company)}</div>
              <div style="font-size:0.82em;margin-top:3px;color:#cbd5e1;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
            </div>`).join('')}</div>` : ''}
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            ${(r.education||[]).length ? `<div style="background:#1a1a24;border-radius:10px;padding:10px;"><strong style="color:${c};font-size:0.8em;">EDUCATION</strong>${r.education.map(e => `<div style="margin-top:6px;font-size:0.8em;"><strong style="color:#fff;">${Utils.escapeHtml(e.degree)}</strong><div style="color:#94a3b8;">${Utils.escapeHtml(e.institution)}</div></div>`).join('')}</div>` : ''}
            ${(r.achievements||[]).length && (r.enabledSections||{}).achievements ? `<div style="background:#1a1a24;border-radius:10px;padding:10px;"><strong style="color:${c};font-size:0.8em;">ACHIEVEMENTS</strong>${r.achievements.map(a => `<div style="margin-top:6px;font-size:0.8em;color:#cbd5e1;">${Utils.escapeHtml(a.name || a.title || '')}</div>`).join('')}</div>` : ''}
          </div>
        </div>
      </div>
    </div>`;
  },

  /* ===== NEW: Marketing Gold ===== */
  tplMarketing(r, accent) {
    const p = r.personal;
    const c = '#ca8a04';
    return `<div style="display:grid;grid-template-columns:36% 64%;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="background:#fffbeb;padding:14mm 10mm;border-right:3px solid #eab308;">
        ${this.photoHtml(p, 90, 'border-radius:8px;')}
        <h1 style="margin:12px 0 2px;font-size:1.4em;color:#0f172a;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${c};font-weight:700;letter-spacing:0.08em;font-size:0.85em;text-transform:uppercase;">${Utils.escapeHtml(p.title) || 'Marketing Manager'}</div>
        ${p.summary ? `<div style="margin-top:14px;"><span style="background:#eab308;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.7em;font-weight:700;">SUMMARY</span><p style="margin:8px 0 0;font-size:0.82em;color:#334155;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
        <div style="margin-top:14px;"><span style="background:#eab308;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.7em;font-weight:700;">CONTACT</span>
          <div style="margin-top:8px;font-size:0.8em;line-height:1.8;color:#475569;">
            ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
            ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
            ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
            ${p.linkedin ? `<div>🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
            ${p.website ? `<div>🌐 ${Utils.escapeHtml(p.website)}</div>` : ''}
          </div>
        </div>
        ${(r.skills||[]).length ? `<div style="margin-top:14px;"><span style="background:#eab308;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.7em;font-weight:700;">SKILLS</span><div style="margin-top:8px;">${this.skillBars(r.skills, '#eab308')}</div></div>` : ''}
        ${(r.education||[]).length ? `<div style="margin-top:14px;"><span style="background:#eab308;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.7em;font-weight:700;">EDUCATION</span>${r.education.map(e => `<div style="margin-top:8px;font-size:0.82em;"><strong>${Utils.escapeHtml(e.degree)}</strong><div style="color:#64748b;">${Utils.escapeHtml(e.institution)}</div>${e.gpa ? `<div>GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : ''}
        ${(r.languages||[]).length ? `<div style="margin-top:14px;"><span style="background:#eab308;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.7em;font-weight:700;">LANGUAGES</span>${r.languages.map(l => `<div style="font-size:0.82em;margin-top:4px;">${Utils.escapeHtml(l.name)} — ${Utils.escapeHtml(l.level || '')}</div>`).join('')}</div>` : ''}
      </div>
      <div style="padding:14mm 12mm;background:#fff;">
        ${(r.experience||[]).length ? `<div style="margin-bottom:16px;"><span style="background:#eab308;color:#fff;padding:3px 12px;border-radius:4px;font-size:0.8em;font-weight:700;">WORK EXPERIENCE</span>${r.experience.map(e => `
          <div style="margin-top:12px;padding-left:12px;border-left:3px solid #eab308;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong style="color:#0f172a;">${Utils.escapeHtml(e.jobTitle)}</strong>
              <span style="font-size:0.8em;background:#fef9c3;color:#854d0e;padding:1px 8px;border-radius:4px;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
            <div style="color:${c};font-size:0.9em;">${Utils.escapeHtml(e.company)}</div>
            <div style="margin-top:4px;font-size:0.88em;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
          </div>`).join('')}</div>` : ''}
        ${(r.certifications||[]).length ? `<div><span style="background:#eab308;color:#fff;padding:3px 12px;border-radius:4px;font-size:0.8em;font-weight:700;">CERTIFICATIONS</span>
          <ul style="margin:10px 0 0;padding-left:18px;font-size:0.88em;">${r.certifications.map(c => `<li style="margin-bottom:4px;"><strong>${Utils.escapeHtml(c.name)}</strong> — ${Utils.escapeHtml(c.organization)}</li>`).join('')}</ul></div>` : ''}
      </div>
    </div>`;
  },

  /* ===== NEW: Clinical Care (green medical) ===== */
  tplClinical(r, accent) {
    const p = r.personal;
    const c = '#166534';
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;font-family:Inter,system-ui,sans-serif;">
      <div style="background:linear-gradient(180deg,#14532d,#166534);color:#fff;padding:14mm 10mm;position:relative;">
        <div style="text-align:center;">${this.photoHtml(p, 100, 'border:3px solid rgba(255,255,255,0.4);')}</div>
        <h1 style="margin:14px 0 2px;font-size:1.35em;text-align:center;font-family:Georgia,serif;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="text-align:center;color:#bbf7d0;font-size:0.85em;letter-spacing:0.1em;text-transform:uppercase;">${Utils.escapeHtml(p.title) || 'Registered Nurse'}</div>
        ${p.summary ? `<div style="margin-top:16px;font-size:0.8em;line-height:1.55;color:#dcfce7;"><strong style="color:#fff;">ABOUT ME</strong><p style="margin:6px 0 0;">${Utils.escapeHtml(p.summary)}</p></div>` : ''}
        <div style="margin-top:16px;font-size:0.8em;line-height:1.9;color:#bbf7d0;">
          ${p.phone ? `<div>☎ ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.email ? `<div>✉ ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div>🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
        </div>
        ${(r.skills||[]).length ? `<div style="margin-top:16px;"><strong style="font-size:0.8em;color:#fff;">CORE STRENGTHS</strong><div style="margin-top:6px;">${this.skillsHtml(r.skills, 'badges', '#86efac')}</div></div>` : ''}
      </div>
      <div style="padding:12mm 12mm;background:#fefce8;">
        ${p.summary ? '' : ''}
        <div style="background:#fff;border:1px solid #d9f99d;border-radius:10px;padding:12px;margin-bottom:14px;">
          <strong style="color:${c};font-size:0.85em;">PROFESSIONAL SUMMARY</strong>
          <p style="margin:6px 0 0;font-size:0.88em;color:#334155;">${Utils.escapeHtml(p.summary || '')}</p>
        </div>
        ${(r.experience||[]).length ? `<div style="margin-bottom:14px;"><strong style="color:${c};font-size:0.9em;">PROFESSIONAL EXPERIENCE</strong>${r.experience.map(e => `
          <div style="margin-top:10px;padding-left:14px;border-left:2px solid #86efac;position:relative;">
            <div style="position:absolute;left:-5px;top:4px;width:8px;height:8px;border-radius:50%;background:${c};"></div>
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong>
              <span style="font-size:0.8em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
            <div style="color:${c};font-size:0.85em;">${Utils.escapeHtml(e.company)}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
            <div style="margin-top:3px;font-size:0.85em;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
          </div>`).join('')}</div>` : ''}
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
          ${(r.education||[]).length ? `<div><strong style="color:${c};font-size:0.8em;">EDUCATION</strong>${r.education.map(e => `<div style="margin-top:6px;font-size:0.78em;"><strong>${Utils.escapeHtml(e.degree)}</strong><div style="color:#64748b;">${Utils.escapeHtml(e.institution)}</div>${e.gpa ? `<div>GPA: ${Utils.escapeHtml(e.gpa)}</div>` : ''}</div>`).join('')}</div>` : ''}
          ${(r.certifications||[]).length ? `<div><strong style="color:${c};font-size:0.8em;">CERTIFICATIONS</strong>${r.certifications.map(c => `<div style="margin-top:6px;font-size:0.78em;">${Utils.escapeHtml(c.name)}</div>`).join('')}</div>` : ''}
          ${(r.skills||[]).length ? `<div><strong style="color:${c};font-size:0.8em;">SKILLS</strong><div style="margin-top:6px;font-size:0.78em;">${r.skills.map(s => Utils.escapeHtml(s.name)).join(', ')}</div></div>` : ''}
        </div>
      </div>
    </div>`;
  },

  _simpleSections(r, accent, minimal = false, skip = []) {
    const enabled = r.enabledSections || {};
    let html = '';
    const order = r.sectionOrder || ['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'awards', 'volunteer', 'publications', 'interests', 'references', 'achievements'];
    order.forEach(key => {
      if (skip.includes(key) || key === 'summary') return;
      if (key === 'experience' && enabled.experience && (r.experience||[]).length) {
        html += this.sectionTitle('Experience', accent);
        html += this.renderItems(r.experience, e => `
          <div style="margin-bottom:10px;">
            <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong><span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
            <div style="color:#475569;">${Utils.escapeHtml(e.company)}</div>
            <div style="white-space:pre-line;margin-top:3px;">${Utils.escapeHtml(e.description || '')}</div>
          </div>`);
      }
      if (key === 'education' && enabled.education && (r.education||[]).length) {
        html += this.sectionTitle('Education', accent);
        html += this.renderItems(r.education, e => `<div style="margin-bottom:8px;"><strong>${Utils.escapeHtml(e.degree)}</strong> — ${Utils.escapeHtml(e.institution)}${e.gpa ? ' · GPA: ' + Utils.escapeHtml(e.gpa) : ''}</div>`);
      }
      if (key === 'skills' && enabled.skills && (r.skills||[]).length) {
        html += this.sectionTitle('Skills', accent) + this.skillsHtml(r.skills, r.customization?.skillsDisplay || 'text', accent);
      }
      if (key === 'projects' && enabled.projects && (r.projects||[]).length) {
        html += this.sectionTitle('Projects', accent);
        html += this.renderItems(r.projects, pr => `<div style="margin-bottom:8px;"><strong>${Utils.escapeHtml(pr.name)}</strong><div>${Utils.escapeHtml(pr.description || '')}</div></div>`);
      }
      if (key === 'certifications' && enabled.certifications && (r.certifications||[]).length) {
        html += this.sectionTitle('Certifications', accent);
        html += r.certifications.map(c => `<div style="margin-bottom:4px;">${Utils.escapeHtml(c.name)} — ${Utils.escapeHtml(c.organization)}</div>`).join('');
      }
      if (key === 'languages' && enabled.languages && (r.languages||[]).length) {
        html += this.sectionTitle('Languages', accent);
        html += `<div>${r.languages.map(l => `${Utils.escapeHtml(l.name)} (${Utils.escapeHtml(l.level || '')})`).join(', ')}</div>`;
      }
      if (key === 'awards' && enabled.awards && (r.awards||[]).length) {
        html += this.genericList('Awards', r.awards, true, accent, a => Utils.escapeHtml(a.name || ''));
      }
      if (key === 'volunteer' && enabled.volunteer && (r.volunteer||[]).length) {
        html += this.genericList('Volunteer Experience', r.volunteer, true, accent, v => `${Utils.escapeHtml(v.role || '')} at ${Utils.escapeHtml(v.organization || '')}`);
      }
      if (key === 'publications' && enabled.publications && (r.publications||[]).length) {
        html += this.genericList('Publications', r.publications, true, accent, p => Utils.escapeHtml(p.title || p.name || ''));
      }
      if (key === 'interests' && enabled.interests && (r.interests||[]).length) {
        html += this.genericList('Interests', r.interests, true, accent, i => Utils.escapeHtml(i.name || i));
      }
      if (key === 'references' && enabled.references && (r.references||[]).length) {
        html += this.genericList('References', r.references, true, accent, ref => `${Utils.escapeHtml(ref.name || '')} — ${Utils.escapeHtml(ref.contact || '')}`);
      }
      if (key === 'achievements' && enabled.achievements && (r.achievements||[]).length) {
        html += this.genericList('Achievements', r.achievements, true, accent, a => Utils.escapeHtml(a.name || a.title || a));
      }
    });
    return html;
  }
};

window.Preview = Preview;
