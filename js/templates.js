/* ============================================
   Yeni Pro CV — Template Gallery Logic
   ============================================ */

const TEMPLATES = [
  { id: 'modern', name: 'Modern Professional', desc: 'Clean layout with clear hierarchy. Works for most industries.', tags: ['professional', 'all'], ats: false },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant serif typography and whitespace. Ideal for creative roles.', tags: ['minimal', 'creative', 'all'], ats: false },
  { id: 'corporate', name: 'Corporate', desc: 'Bold header block. Built for business and finance.', tags: ['professional', 'all'], ats: false },
  { id: 'creative', name: 'Creative', desc: 'Two-column layout with colorful sidebar.', tags: ['creative', 'all'], ats: false },
  { id: 'elegant', name: 'Elegant', desc: 'Centered header with classic serif fonts.', tags: ['minimal', 'professional', 'all'], ats: false },
  { id: 'executive', name: 'Executive', desc: 'Strong horizontal header for senior roles.', tags: ['professional', 'all'], ats: false },
  { id: 'tech', name: 'Tech Developer', desc: 'Monospace accents for engineers.', tags: ['developer', 'all'], ats: false },
  { id: 'student', name: 'Student', desc: 'Optimized for internships and entry-level.', tags: ['student', 'all'], ats: false },
  { id: 'two-column', name: 'Two Column', desc: 'Classic sidebar + main content layout.', tags: ['professional', 'all'], ats: false },
  { id: 'ats', name: 'ATS Friendly', desc: 'Single-column plain formatting for ATS systems.', tags: ['ats', 'professional', 'all'], ats: true },
  { id: 'hr', name: 'HR Management', desc: 'Burgundy header with photo. Ideal for HR roles.', tags: ['professional', 'all'], ats: false },
  { id: 'fullstack', name: 'Full-Stack Sidebar', desc: 'Warm sidebar with photo and timeline.', tags: ['developer', 'creative', 'all'], ats: false },
  { id: 'sales', name: 'Sales Executive', desc: 'Clean photo header with blue accents.', tags: ['professional', 'ats', 'all'], ats: true },
  { id: 'cinematic', name: 'Cinematic Dark', desc: 'Dark layout with skill bars for media pros.', tags: ['creative', 'all'], ats: false },
  { id: 'marketing', name: 'Marketing Gold', desc: 'Gold accent sidebar for marketers.', tags: ['creative', 'professional', 'all'], ats: false },
  { id: 'clinical', name: 'Clinical Care', desc: 'Medical-themed panel for healthcare.', tags: ['professional', 'all'], ats: false },
  { id: 'classic', name: 'Classic Professional', desc: 'Navy CV with contact sidebar and timeline.', tags: ['professional', 'all'], ats: false }
];

const TemplatesPage = {
  currentFilter: 'all',
  resumeId: null,

  init() {
    Utils.initTheme();
    const params = new URLSearchParams(window.location.search);
    this.resumeId = params.get('id') || Storage.getCurrentId();
    this.renderGrid();
    this.bindFilters();
    document.getElementById('theme-toggle')?.addEventListener('click', () => Utils.toggleTheme());
  },

  bindFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        this.renderGrid();
      });
    });
  },

  renderGrid() {
    const grid = document.getElementById('template-grid');
    if (!grid) return;
    const filtered = TEMPLATES.filter(t =>
      this.currentFilter === 'all' || t.tags.includes(this.currentFilter)
    );
    grid.innerHTML = filtered.map(t => `
      <article class="template-card" data-id="${t.id}">
        <div class="template-preview">
          <div class="template-preview-inner">${this.miniPreview(t.id)}</div>
        </div>
        <div class="template-info">
          <div class="template-name">${t.name}</div>
          <div class="template-desc">${t.desc}</div>
          <div class="template-badges">
            ${t.ats ? '<span class="badge ats">ATS Optimized</span>' : ''}
            ${t.tags.filter(tag => tag !== 'all').slice(0, 2).map(tag =>
              `<span class="badge ${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`
            ).join('')}
          </div>
        </div>
        <div class="template-actions">
          <button class="btn btn-primary use-template" data-id="${t.id}">Use Template</button>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.use-template').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.applyTemplate(btn.dataset.id);
      });
    });
    grid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => this.applyTemplate(card.dataset.id));
    });
  },

  isResumeEmpty(resume) {
    if (!resume || !resume.personal) return true;
    const p = resume.personal;
    const hasName = !!(p.fullName && p.fullName.trim());
    const hasExp = (resume.experience || []).length > 0;
    const hasEdu = (resume.education || []).length > 0;
    const hasSkills = (resume.skills || []).length > 0;
    return !hasName && !hasExp && !hasEdu && !hasSkills;
  },

  applyTemplate(templateId) {
    let resume = this.resumeId ? Storage.getResume(this.resumeId) : null;
    let usedSample = false;

    if (!resume || this.isResumeEmpty(resume)) {
      const sample = Storage.getSampleResume();
      if (resume && resume.id) {
        sample.id = resume.id;
        sample.title = resume.title || sample.title;
        if (resume.customization) {
          sample.customization = Object.assign({}, sample.customization, resume.customization);
        }
      }
      resume = sample;
      usedSample = true;
    }

    resume.template = templateId;
    Storage.saveResume(resume);

    Utils.toast(
      usedSample
        ? 'Template applied with sample data — edit anytime'
        : 'Template applied — your content is preserved',
      'success'
    );
    setTimeout(function () {
      window.location.href = 'builder.html?id=' + encodeURIComponent(resume.id);
    }, 400);
  },

  miniPreview(id) {
    const previews = window.__TEMPLATE_PREVIEWS__ || {};
    if (previews[id]) return previews[id];
    // Inline fallback samples so structure is always visible
    const samples = {
      modern: { accent: '#2563eb', layout: 'single' },
      minimal: { accent: '#64748b', layout: 'center' },
      corporate: { accent: '#1e3a5f', layout: 'header' },
      creative: { accent: '#4f46e5', layout: 'side' },
      elegant: { accent: '#6366f1', layout: 'center' },
      executive: { accent: '#1e3a5f', layout: 'single' },
      tech: { accent: '#334155', layout: 'mono' },
      student: { accent: '#1e40af', layout: 'single' },
      'two-column': { accent: '#2563eb', layout: 'side-light' },
      ats: { accent: '#111', layout: 'ats' },
      hr: { accent: '#3d1212', layout: 'header' },
      fullstack: { accent: '#5c3a21', layout: 'side' },
      sales: { accent: '#1a6bb5', layout: 'single' },
      cinematic: { accent: '#a78bfa', layout: 'dark' },
      marketing: { accent: '#ca8a04', layout: 'side-gold' },
      clinical: { accent: '#1e3a5f', layout: 'side' },
      classic: { accent: '#1e3a5f', layout: 'classic' }
    };
    const s = samples[id] || samples.modern;
    const a = s.accent;
    if (s.layout === 'side' || s.layout === 'side-light' || s.layout === 'side-gold') {
      const bg = s.layout === 'side-gold' ? '#fef9c3' : (s.layout === 'side-light' ? '#f1f5f9' : a);
      const fg = s.layout === 'side-light' || s.layout === 'side-gold' ? '#0f172a' : '#fff';
      return '<div style="display:grid;grid-template-columns:36% 64%;height:100%;background:#fff;font-family:Inter,sans-serif"><div style="background:' + bg + ';padding:10px 7px;color:' + fg + '"><div style="width:26px;height:26px;border-radius:50%;background:rgba(128,128,128,0.25);margin-bottom:5px"></div><div style="font-weight:700;font-size:9px">Alex Rivera</div><div style="font-size:6.5px;margin-top:1px;opacity:0.9">Product Designer</div><div style="font-size:6px;font-weight:700;margin:8px 0 3px">CONTACT</div><div style="font-size:5.5px;line-height:1.45;opacity:0.85">alex@mail.com<br>+1 555 0100</div><div style="font-size:6px;font-weight:700;margin:8px 0 3px">SKILLS</div><div style="font-size:5.5px">Figma · UI/UX · CSS</div></div><div style="padding:10px 8px"><div style="font-size:7px;font-weight:700;color:' + a + ';text-transform:uppercase;margin-bottom:3px">Experience</div><div style="font-size:6.5px;margin-bottom:2px"><b>Senior Designer</b> · Acme</div><div style="font-size:5.5px;color:#64748b;margin-bottom:3px">2021 – Present</div><div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div><div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:6px"></div><div style="font-size:7px;font-weight:700;color:' + a + ';text-transform:uppercase;margin-bottom:3px">Education</div><div style="font-size:6.5px"><b>B.A. Design</b></div></div></div>';
    }
    if (s.layout === 'header') {
      return '<div style="height:100%;background:#fff;font-family:Inter,sans-serif"><div style="background:' + a + ';color:#fff;padding:12px 10px"><div style="font-weight:700;font-size:12px">Alex Rivera</div><div style="font-size:7.5px;opacity:0.9;margin-top:2px">Business Manager</div><div style="font-size:5.5px;opacity:0.8;margin-top:4px">alex@mail.com · +1 555 0100</div></div><div style="padding:10px"><div style="font-size:7px;font-weight:700;color:' + a + ';text-transform:uppercase;margin-bottom:3px">Experience</div><div style="font-size:6.5px"><b>Operations Lead</b> · Global Co</div><div style="height:3px;background:#e2e8f0;border-radius:1px;margin:4px 0 2px"></div><div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%"></div></div></div>';
    }
    if (s.layout === 'dark') {
      return '<div style="background:#0a0a10;color:#e2e8f0;padding:10px;height:100%;font-family:Inter,sans-serif"><div style="text-align:center"><div style="width:36px;height:36px;border-radius:50%;background:#7c3aed;margin:0 auto 6px"></div><div style="font-weight:800;font-size:10px;color:#fff">Alex Rivera</div><div style="color:' + a + ';font-size:6px;letter-spacing:0.12em;text-transform:uppercase;margin-top:2px">Video Editor</div></div><div style="margin-top:10px;background:#14141e;border-radius:8px;padding:8px"><div style="color:' + a + ';font-size:6.5px;font-weight:700;margin-bottom:4px">SKILLS</div><div style="font-size:5.5px;color:#94a3b8;margin-bottom:2px">Premiere Pro</div><div style="height:4px;background:#2a2a38;border-radius:99px;overflow:hidden"><div style="height:100%;width:80%;background:#7c3aed"></div></div></div></div>';
    }
    if (s.layout === 'ats') {
      return '<div style="padding:10px;height:100%;background:#fff;font-family:Arial,sans-serif"><div style="font-weight:700;font-size:11px">ALEX RIVERA</div><div style="font-size:7px">Software Engineer</div><div style="font-size:5.5px;margin:3px 0 6px;border-bottom:1px solid #333;padding-bottom:4px">email@example.com · phone · city</div><div style="font-size:7px;font-weight:700">EXPERIENCE</div><div style="font-size:6.5px;margin:3px 0"><b>Senior Engineer</b> | Tech Co</div><div style="font-size:7px;font-weight:700;margin-top:6px">SKILLS</div><div style="font-size:6px">Python, Java, SQL, AWS</div></div>';
    }
    if (s.layout === 'center') {
      return '<div style="padding:12px;height:100%;background:#fff;font-family:Georgia,serif;text-align:center"><div style="font-size:12px;letter-spacing:0.1em">ALEX RIVERA</div><div style="font-size:7.5px;color:' + a + ';font-style:italic;margin:3px 0">Designer</div><div style="font-size:5.5px;color:#94a3b8">alex@mail.com · New York</div><hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 18%"/><div style="font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px">Experience</div><div style="font-size:6.5px;color:#475569">Senior Designer · Acme</div><div style="height:3px;background:#e2e8f0;margin:6px auto;width:70%"></div></div>';
    }
    if (s.layout === 'classic') {
      return '<div style="padding:10px;height:100%;background:#fff;font-family:Inter,sans-serif"><div style="font-weight:800;font-size:11px;text-transform:uppercase">Alex Rivera</div><div style="color:#64748b;font-size:6.5px;letter-spacing:0.06em;text-transform:uppercase">Marketing Manager</div><div style="height:1.5px;background:' + a + ';margin:6px 0"></div><div style="display:grid;grid-template-columns:30% 70%;gap:8px"><div><div style="font-size:6px;font-weight:700;color:' + a + '">CONTACT</div><div style="font-size:5px;color:#334155;margin-top:3px">alex@mail.com</div></div><div><div style="font-size:6px;font-weight:700;color:' + a + '">EXPERIENCE</div><div style="font-size:6px;font-weight:700;margin-top:3px">Brand Co</div></div></div></div>';
    }
    // single / mono default
    const mono = s.layout === 'mono' ? 'font-family:ui-monospace,monospace' : 'font-family:Inter,sans-serif';
    return '<div style="padding:10px;height:100%;background:#fff;' + mono + '"><div style="display:flex;justify-content:space-between;gap:6px"><div><div style="font-weight:700;font-size:11px">Alex Rivera</div><div style="color:' + a + ';font-size:7.5px;margin-top:1px">Product Designer</div></div><div style="font-size:5.5px;color:#64748b;text-align:right;line-height:1.4">alex@mail.com<br>+1 555 0100</div></div><div style="height:2.5px;background:' + a + ';margin:7px 0 8px"></div><div style="font-size:7px;font-weight:700;color:' + a + ';text-transform:uppercase;margin-bottom:3px">Experience</div><div style="font-size:6.5px;margin-bottom:2px"><b>Senior Designer</b> · Acme · 2021–Now</div><div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div><div style="height:3px;background:#e2e8f0;border-radius:1px;width:75%;margin-bottom:6px"></div><div style="font-size:7px;font-weight:700;color:' + a + ';text-transform:uppercase;margin-bottom:3px">Skills</div><div style="font-size:6px;color:#334155">Figma · UI/UX · CSS · Research</div></div>';
  }
};

document.addEventListener('DOMContentLoaded', () => TemplatesPage.init());
window.TemplatesPage = TemplatesPage;
