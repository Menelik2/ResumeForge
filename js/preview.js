/* ============================================
   ResumeForge — Live Preview Renderer
   ============================================ */

const Preview = {
  render(resume, container) {
    if (!container) return;
    const t = resume.template || 'modern';
    const c = resume.customization || {};
    const accent = c.accentColor || '#2563eb';
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
      default: html = this.tplModern(resume, accent);
    }
    container.innerHTML = html;
  },

  photoHtml(p, size = 90) {
    if (!p.photo) return '';
    const shape = p.photoShape === 'square' ? 'border-radius:8px' : 'border-radius:50%';
    return `<img src="${p.photo}" alt="Photo" style="width:${size}px;height:${size}px;object-fit:cover;${shape};border:2px solid #e2e8f0;" />`;
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

  sectionTitle(title, accent) {
    return `<h2 class="resume-section-title" style="color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin:16px 0 8px;font-size:1.05em;text-transform:uppercase;letter-spacing:0.06em;">${title}</h2>`;
  },

  skillsHtml(skills, display, accent) {
    if (!skills || !skills.length) return '';
    if (display === 'badges') {
      return `<div style="display:flex;flex-wrap:wrap;gap:6px;">${skills.map(s =>
        `<span style="background:${accent}18;color:${accent};padding:3px 10px;border-radius:999px;font-size:0.9em;font-weight:500;">${Utils.escapeHtml(s.name)}${s.level ? ' · ' + s.level : ''}</span>`
      ).join('')}</div>`;
    }
    const levelMap = { Beginner: 30, Intermediate: 55, Advanced: 80, Expert: 100, Native: 100, Fluent: 90 };
    return skills.map(s => {
      const pct = levelMap[s.level] || 70;
      return `<div style="margin-bottom:6px;">
        <div style="display:flex;justify-content:space-between;font-size:0.9em;"><span>${Utils.escapeHtml(s.name)}</span><span style="color:#64748b;">${Utils.escapeHtml(s.level || '')}</span></div>
        <div style="height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;"><div style="width:${pct}%;height:100%;background:${accent};"></div></div>
      </div>`;
    }).join('');
  },

  tplModern(r, accent) {
    const p = r.personal;
    const enabled = r.enabledSections || {};
    let body = '';
    if (p.summary) body += this.sectionTitle('Professional Summary', accent) + `<p style="margin:0 0 8px;">${Utils.escapeHtml(p.summary).replace(/\n/g, '<br>')}</p>`;
    if (enabled.experience && r.experience.length) {
      body += this.sectionTitle('Experience', accent);
      r.experience.forEach(e => {
        body += `<div class="resume-section" style="margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;">
            <strong>${Utils.escapeHtml(e.jobTitle)}</strong>
            <span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span>
          </div>
          <div style="color:#475569;font-size:0.95em;">${Utils.escapeHtml(e.company)}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
          <div style="margin-top:4px;white-space:pre-line;">${Utils.escapeHtml(e.description || '')}</div>
        </div>`;
      });
    }
    if (enabled.education && r.education.length) {
      body += this.sectionTitle('Education', accent);
      r.education.forEach(e => {
        body += `<div class="resume-section" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;">
            <strong>${Utils.escapeHtml(e.degree)}</strong>
            <span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${Utils.formatDate(e.endDate)}</span>
          </div>
          <div style="color:#475569;">${Utils.escapeHtml(e.institution)}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
          ${e.description ? `<div style="margin-top:2px;font-size:0.95em;">${Utils.escapeHtml(e.description)}</div>` : ''}
        </div>`;
      });
    }
    if (enabled.skills && r.skills.length) body += this.sectionTitle('Skills', accent) + this.skillsHtml(r.skills, r.customization?.skillsDisplay || 'bars', accent);
    if (enabled.projects && r.projects.length) {
      body += this.sectionTitle('Projects', accent);
      r.projects.forEach(pr => {
        body += `<div class="resume-section" style="margin-bottom:10px;">
          <strong>${Utils.escapeHtml(pr.name)}</strong>
          ${pr.technologies ? `<span style="color:#64748b;font-size:0.9em;"> · ${Utils.escapeHtml(pr.technologies)}</span>` : ''}
          <div style="margin-top:2px;">${Utils.escapeHtml(pr.description || '')}</div>
        </div>`;
      });
    }
    if (enabled.certifications && r.certifications.length) {
      body += this.sectionTitle('Certifications', accent);
      r.certifications.forEach(c => {
        body += `<div style="margin-bottom:6px;"><strong>${Utils.escapeHtml(c.name)}</strong> — ${Utils.escapeHtml(c.organization)} <span style="color:#64748b;font-size:0.9em;">(${Utils.formatDate(c.issueDate)})</span></div>`;
      });
    }
    if (enabled.languages && r.languages.length) {
      body += this.sectionTitle('Languages', accent) + `<div>${r.languages.map(l => `${Utils.escapeHtml(l.name)} (${Utils.escapeHtml(l.level || '')})`).join(' · ')}</div>`;
    }
    return `<div style="padding:18mm 16mm;">
      <div style="display:flex;align-items:center;gap:18px;margin-bottom:12px;">
        ${this.photoHtml(p, 85)}
        <div>
          <h1 style="margin:0;font-size:1.8em;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:${accent};font-size:1.15em;font-weight:500;margin-top:2px;">${Utils.escapeHtml(p.title) || 'Professional Title'}</div>
          <div style="font-size:0.85em;color:#64748b;margin-top:6px;">${this.contactLine(p)}</div>
        </div>
      </div>
      ${body}
    </div>`;
  },

  tplMinimal(r, accent) {
    const p = r.personal;
    return `<div style="padding:20mm 18mm;font-family:Georgia,serif;">
      <h1 style="margin:0;font-size:1.9em;font-weight:400;letter-spacing:0.04em;text-align:center;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div style="text-align:center;color:#64748b;margin:6px 0 4px;font-size:0.95em;">${Utils.escapeHtml(p.title)}</div>
      <div style="text-align:center;font-size:0.8em;color:#94a3b8;margin-bottom:18px;">${this.contactLine(p)}</div>
      <hr style="border:none;border-top:1px solid #e2e8f0;margin:12px 0;" />
      ${p.summary ? `<p style="text-align:center;font-style:italic;margin-bottom:16px;">${Utils.escapeHtml(p.summary)}</p>` : ''}
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplCorporate(r, accent) {
    const p = r.personal;
    return `<div style="padding:0;">
      <div style="background:${accent};color:#fff;padding:16mm 16mm 12mm;">
        <h1 style="margin:0;font-size:1.7em;font-weight:700;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
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
        <div style="opacity:0.9;font-size:0.95em;">${Utils.escapeHtml(p.title)}</div>
        <div style="margin-top:16px;font-size:0.8em;line-height:1.7;">
          ${p.email ? `<div>📧 ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>📱 ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div>🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          ${p.github ? `<div>🐙 ${Utils.escapeHtml(p.github)}</div>` : ''}
        </div>
        ${r.skills.length ? `<div style="margin-top:20px;"><strong style="font-size:0.85em;">SKILLS</strong><div style="margin-top:8px;">${this.skillsHtml(r.skills, 'badges', '#fff')}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplElegant(r, accent) {
    const p = r.personal;
    return `<div style="padding:18mm 20mm;font-family:'Merriweather',Georgia,serif;">
      <div style="text-align:center;border-bottom:1px solid ${accent};padding-bottom:12px;margin-bottom:16px;">
        ${this.photoHtml(p, 80)}
        <h1 style="margin:10px 0 2px;font-size:1.85em;font-weight:400;letter-spacing:0.08em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};font-style:italic;">${Utils.escapeHtml(p.title)}</div>
        <div style="font-size:0.8em;color:#64748b;margin-top:8px;">${this.contactLine(p)}</div>
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplExecutive(r, accent) {
    const p = r.personal;
    return `<div style="padding:16mm;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid ${accent};padding-bottom:10px;margin-bottom:14px;">
        <div>
          <h1 style="margin:0;font-size:1.75em;font-weight:700;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
          <div style="color:${accent};font-size:1.1em;margin-top:2px;">${Utils.escapeHtml(p.title)}</div>
        </div>
        <div style="text-align:right;font-size:0.8em;color:#64748b;line-height:1.6;">
          ${p.email ? `<div>📧 ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>📱 ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
        </div>
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
      <div style="font-size:1.05em;margin:2px 0 6px;">${Utils.escapeHtml(p.title) || 'Student'}</div>
      <div style="font-size:0.85em;color:#64748b;margin-bottom:14px;">${this.contactLine(p)}</div>
      ${p.summary ? `<p style="background:#f8fafc;padding:10px;border-radius:6px;margin-bottom:14px;">${Utils.escapeHtml(p.summary)}</p>` : ''}
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplTwoColumn(r, accent) {
    const p = r.personal;
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;">
      <div style="background:#f1f5f9;padding:14mm 10mm;">
        ${this.photoHtml(p, 90)}
        <h1 style="margin:12px 0 2px;font-size:1.3em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};font-size:0.95em;">${Utils.escapeHtml(p.title)}</div>
        <div style="font-size:0.8em;color:#64748b;margin:10px 0 16px;line-height:1.7;">
          ${p.email ? `<div>📧 ${Utils.escapeHtml(p.email)}</div>` : ''}
          ${p.phone ? `<div>📱 ${Utils.escapeHtml(p.phone)}</div>` : ''}
          ${p.location ? `<div>📍 ${Utils.escapeHtml(p.location)}</div>` : ''}
          ${p.linkedin ? `<div>🔗 ${Utils.escapeHtml(p.linkedin)}</div>` : ''}
          ${p.github ? `<div>🐙 ${Utils.escapeHtml(p.github)}</div>` : ''}
        </div>
        ${r.skills.length ? `<div style="margin-bottom:14px;"><strong style="color:${accent};font-size:0.85em;">SKILLS</strong><div style="margin-top:6px;">${this.skillsHtml(r.skills, 'badges', accent)}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplATS(r, accent) {
    const p = r.personal;
    return `<div style="padding:15mm 18mm;font-family:Arial,Helvetica,sans-serif;font-size:11pt;">
      <h1 style="margin:0;font-size:16pt;font-weight:700;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div style="margin:2px 0 4px;">${Utils.escapeHtml(p.title)}</div>
      <div style="font-size:10pt;margin-bottom:12px;">${this.contactLine(p)}</div>
      ${p.summary ? `<div style="margin-bottom:10px;"><strong>PROFESSIONAL SUMMARY</strong><br>${Utils.escapeHtml(p.summary)}</div>` : ''}
      ${r.experience.length ? `<div style="margin-bottom:10px;"><strong>EXPERIENCE</strong>${r.experience.map(e => `
        <div style="margin:6px 0;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong> | ${Utils.escapeHtml(e.company)} | ${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}<br>
        ${Utils.escapeHtml(e.description || '').replace(/\n/g, '<br>')}</div>`).join('')}</div>` : ''}
      ${r.education.length ? `<div style="margin-bottom:10px;"><strong>EDUCATION</strong>${r.education.map(e => `
        <div style="margin:4px 0;">${Utils.escapeHtml(e.degree)} — ${Utils.escapeHtml(e.institution)} (${Utils.formatDate(e.startDate)} – ${Utils.formatDate(e.endDate)})</div>`).join('')}</div>` : ''}
      ${r.skills.length ? `<div style="margin-bottom:10px;"><strong>SKILLS</strong><br>${r.skills.map(s => Utils.escapeHtml(s.name)).join(', ')}</div>` : ''}
      ${r.projects.length ? `<div style="margin-bottom:10px;"><strong>PROJECTS</strong>${r.projects.map(pr => `
        <div style="margin:4px 0;"><strong>${Utils.escapeHtml(pr.name)}</strong>: ${Utils.escapeHtml(pr.description || '')}</div>`).join('')}</div>` : ''}
    </div>`;
  },

  _simpleSections(r, accent, minimal = false, skip = []) {
    const enabled = r.enabledSections || {};
    let html = '';
    if (enabled.experience && r.experience.length && !skip.includes('experience')) {
      html += this.sectionTitle('Experience', accent);
      r.experience.forEach(e => {
        html += `<div class="resume-section" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong><span style="font-size:0.9em;color:#64748b;">${Utils.formatDate(e.startDate)} – ${e.current ? 'Present' : Utils.formatDate(e.endDate)}</span></div>
          <div style="color:#475569;">${Utils.escapeHtml(e.company)}${e.location ? ' · ' + Utils.escapeHtml(e.location) : ''}</div>
          <div style="white-space:pre-line;margin-top:3px;">${Utils.escapeHtml(e.description || '')}</div>
        </div>`;
      });
    }
    if (enabled.education && r.education.length && !skip.includes('education')) {
      html += this.sectionTitle('Education', accent);
      r.education.forEach(e => {
        html += `<div style="margin-bottom:8px;"><strong>${Utils.escapeHtml(e.degree)}</strong> — ${Utils.escapeHtml(e.institution)} <span style="color:#64748b;font-size:0.9em;">(${Utils.formatDate(e.startDate)} – ${Utils.formatDate(e.endDate)})</span></div>`;
      });
    }
    if (enabled.skills && r.skills.length && !skip.includes('skills')) {
      html += this.sectionTitle('Skills', accent) + this.skillsHtml(r.skills, r.customization?.skillsDisplay || 'bars', accent);
    }
    if (enabled.projects && r.projects.length && !skip.includes('projects')) {
      html += this.sectionTitle('Projects', accent);
      r.projects.forEach(pr => {
        html += `<div style="margin-bottom:8px;"><strong>${Utils.escapeHtml(pr.name)}</strong>${pr.technologies ? ` <span style="color:#64748b;">(${Utils.escapeHtml(pr.technologies)})</span>` : ''}<div>${Utils.escapeHtml(pr.description || '')}</div></div>`;
      });
    }
    if (enabled.certifications && r.certifications.length && !skip.includes('certifications')) {
      html += this.sectionTitle('Certifications', accent);
      r.certifications.forEach(c => {
        html += `<div style="margin-bottom:4px;">${Utils.escapeHtml(c.name)} — ${Utils.escapeHtml(c.organization)} (${Utils.formatDate(c.issueDate)})</div>`;
      });
    }
    if (enabled.languages && r.languages.length && !skip.includes('languages')) {
      html += this.sectionTitle('Languages', accent) + `<div>${r.languages.map(l => `${Utils.escapeHtml(l.name)} (${Utils.escapeHtml(l.level || '')})`).join(' · ')}</div>`;
    }
    return html;
  }
};

window.Preview = Preview;
