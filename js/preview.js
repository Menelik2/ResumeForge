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
      case 'classic': html = this.tplClassic(resume, accent); break;
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

  /* Classic Professional — placeholder; real design in preview-templates-extra.js */
  tplClassic(r, accent) {
    return this.tplModern(r, accent);
  },

  tplModern(r, accent) {
    const p = r.personal;
    return `<div style="padding:18mm 16mm;">
      <div style="border-bottom:2px solid ${accent};padding-bottom:12px;margin-bottom:14px;">
        <h1 style="margin:0;font-size:1.75em;font-weight:700;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};margin-top:3px;">${Utils.escapeHtml(p.title) || 'Professional Title'}</div>
        <div style="font-size:0.85em;color:#64748b;margin-top:6px;">${this.contactLine(p)}</div>
      </div>
      ${this._simpleSections(r, accent)}
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
        ${(r.skills||[]).length ? `<div style="margin-top:20px;"><strong style="font-size:0.85em;">SKILLS</strong><div style="margin-top:8px;">${this.skillsHtml(r.skills, 'badges', '#fff')}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplElegant(r, accent) {
    const p = r.personal;
    return `<div style="padding:18mm 20mm;font-family:Merriweather,Georgia,serif;">
      <div style="text-align:center;border-bottom:1px solid ${accent};padding-bottom:12px;margin-bottom:16px;">
        <h1 style="margin:10px 0 2px;font-size:1.85em;font-weight:400;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};font-style:italic;">${Utils.escapeHtml(p.title)}</div>
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplExecutive(r, accent) {
    const p = r.personal;
    return `<div style="padding:16mm;">
      <div style="border-bottom:3px solid ${accent};padding-bottom:12px;margin-bottom:14px;">
        <h1 style="margin:0;font-size:1.75em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};margin-top:2px;">${Utils.escapeHtml(p.title)}</div>
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
      </div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplStudent(r, accent) {
    const p = r.personal;
    return `<div style="padding:16mm;">
      <h1 style="margin:0;font-size:1.7em;color:${accent};">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div style="margin:2px 0 6px;">${Utils.escapeHtml(p.title) || 'Student'}</div>
      ${this._simpleSections(r, accent)}
    </div>`;
  },

  tplTwoColumn(r, accent) {
    const p = r.personal;
    return `<div style="display:grid;grid-template-columns:34% 66%;min-height:297mm;">
      <div style="background:#f1f5f9;padding:14mm 10mm;">
        <h1 style="margin:12px 0 2px;font-size:1.3em;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
        <div style="color:${accent};">${Utils.escapeHtml(p.title)}</div>
        ${(r.skills||[]).length ? `<div style="margin-top:14px;"><strong style="color:${accent};font-size:0.85em;">SKILLS</strong><div style="margin-top:6px;">${this.skillsHtml(r.skills, 'badges', accent)}</div></div>` : ''}
      </div>
      <div style="padding:14mm 12mm;">${this._simpleSections(r, accent, false, ['skills'])}</div>
    </div>`;
  },

  tplATS(r, accent) {
    const p = r.personal;
    return `<div style="padding:15mm 18mm;font-family:Arial,Helvetica,sans-serif;font-size:11pt;">
      <h1 style="margin:0;font-size:16pt;">${Utils.escapeHtml(p.fullName) || 'Your Name'}</h1>
      <div>${Utils.escapeHtml(p.title)}</div>
      ${p.summary ? `<div style="margin:10px 0;"><strong>PROFESSIONAL SUMMARY</strong><br>${Utils.escapeHtml(p.summary)}</div>` : ''}
      ${(r.experience||[]).length ? `<div style="margin-bottom:10px;"><strong>EXPERIENCE</strong>${r.experience.map(e => `
        <div style="margin:6px 0;"><strong>${Utils.escapeHtml(e.jobTitle)}</strong> | ${Utils.escapeHtml(e.company)}</div>`).join('')}</div>` : ''}
      ${(r.skills||[]).length ? `<div><strong>SKILLS</strong><br>${r.skills.map(s => Utils.escapeHtml(s.name)).join(', ')}</div>` : ''}
    </div>`;
  },

  tplHR(r, accent) { return this.tplModern(r, accent); },
  tplFullstack(r, accent) { return this.tplTwoColumn(r, accent); },
  tplSales(r, accent) { return this.tplModern(r, accent); },
  tplCinematic(r, accent) { return this.tplModern(r, accent); },
  tplMarketing(r, accent) { return this.tplTwoColumn(r, accent); },
  tplClinical(r, accent) { return this.tplTwoColumn(r, accent); },

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
      if (key === 'references' && enabled.references && (r.references||[]).length) {
        html += this.genericList('References', r.references, true, accent, ref => `${Utils.escapeHtml(ref.name || '')} — ${Utils.escapeHtml(ref.contact || '')}`);
      }
    });
    if (r.personal && r.personal.summary && !skip.includes('summary')) {
      html = this.sectionTitle('Summary', accent) + `<p style="margin:0 0 10px;">${Utils.escapeHtml(r.personal.summary)}</p>` + html;
    }
    return html;
  }
};

window.Preview = Preview;
