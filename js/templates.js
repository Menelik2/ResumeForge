/* ============================================
   Yeni Pro CV — Template Gallery Logic
   ============================================ */

const TEMPLATES = [
  { id: 'modern', name: 'Modern Professional', desc: 'Clean, contemporary layout with accent color highlights. Perfect for most industries.', tags: ['professional', 'all'], ats: false },
  { id: 'minimal', name: 'Minimal', desc: 'Elegant serif typography and generous whitespace. Ideal for creative professionals.', tags: ['minimal', 'creative', 'all'], ats: false },
  { id: 'corporate', name: 'Corporate', desc: 'Bold header with strong brand color. Designed for business and finance roles.', tags: ['professional', 'all'], ats: false },
  { id: 'creative', name: 'Creative', desc: 'Two-column design with colorful sidebar. Great for designers and marketers.', tags: ['creative', 'all'], ats: false },
  { id: 'elegant', name: 'Elegant', desc: 'Refined centered header with classic serif fonts. Timeless and sophisticated.', tags: ['minimal', 'professional', 'all'], ats: false },
  { id: 'executive', name: 'Executive', desc: 'Strong horizontal header and clear hierarchy. Built for senior leadership roles.', tags: ['professional', 'all'], ats: false },
  { id: 'tech', name: 'Tech Developer', desc: 'Monospace accents and code-inspired styling. Perfect for software engineers.', tags: ['developer', 'all'], ats: false },
  { id: 'student', name: 'Student', desc: 'Friendly and approachable layout optimized for internships and entry-level roles.', tags: ['student', 'all'], ats: false },
  { id: 'two-column', name: 'Two Column', desc: 'Classic sidebar + main content layout. Excellent information density.', tags: ['professional', 'all'], ats: false },
  { id: 'ats', name: 'ATS Friendly', desc: 'Single-column, plain formatting optimized for Applicant Tracking Systems.', tags: ['ats', 'professional', 'all'], ats: true },
  { id: 'hr', name: 'HR Management', desc: 'Burgundy header with photo, two-column contact & experience layout. Ideal for HR professionals.', tags: ['professional', 'all'], ats: false },
  { id: 'fullstack', name: 'Full-Stack Sidebar', desc: 'Warm brown sidebar with photo, contact pills, and timeline experience. Great for developers.', tags: ['developer', 'creative', 'all'], ats: false },
  { id: 'sales', name: 'Sales Executive', desc: 'Clean photo header, blue accents, ATS-friendly structure for sales and operations roles.', tags: ['professional', 'ats', 'all'], ats: true },
  { id: 'cinematic', name: 'Cinematic Dark', desc: 'Dark creative layout with skill bars and timeline. Perfect for video editors and media pros.', tags: ['creative', 'all'], ats: false },
  { id: 'marketing', name: 'Marketing Gold', desc: 'Yellow accent sidebar with summary, skills dots, and work experience. Built for marketers.', tags: ['creative', 'professional', 'all'], ats: false },
  { id: 'clinical', name: 'Clinical Care', desc: 'Soft green medical theme with photo panel and timeline. Designed for nurses and healthcare.', tags: ['professional', 'all'], ats: false },
  { id: 'classic', name: 'Classic Professional', desc: 'Clean blue-gray CV with contact sidebar, vertical timeline icons, profile & experience. Ideal for marketing and business.', tags: ['professional', 'all'], ats: false }
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
        if (resume.customization) sample.customization = Object.assign({}, sample.customization, resume.customization);
      }
      resume = sample;
      usedSample = true;
    }

    resume.template = templateId;
    Storage.saveResume(resume);

    Utils.toast(usedSample
      ? 'Template applied with sample data — edit anytime'
      : 'Template applied — your content is preserved', 'success');
    setTimeout(function () {
      window.location.href = 'builder.html?id=' + encodeURIComponent(resume.id);
    }, 400);
  },

  miniPreview(id) {
    // Mini previews restored from known-good commit - full gallery previews
    const previews = window.__TEMPLATE_PREVIEWS__ || {};
    if (previews[id]) return previews[id];
    // Fallback compact preview until full previews load
    return '<div style="padding:12px;height:100%;box-sizing:border-box;background:#fff;font-family:Inter,sans-serif"><div style="font-weight:700;font-size:11px;color:#0f172a">Alex Rivera</div><div style="color:#0d9488;font-size:8px;margin-top:2px">' + (id || 'modern') + '</div><div style="height:2px;background:#0d9488;margin:8px 0"></div><div style="height:4px;background:#e2e8f0;border-radius:2px;margin-bottom:4px"></div><div style="height:4px;background:#e2e8f0;border-radius:2px;width:70%;margin-bottom:8px"></div><div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase">Experience</div><div style="height:3px;background:#e2e8f0;border-radius:1px;margin:4px 0"></div><div style="height:3px;background:#e2e8f0;border-radius:1px;width:60%"></div></div>';
  }
};

document.addEventListener('DOMContentLoaded', () => TemplatesPage.init());
window.TemplatesPage = TemplatesPage;
