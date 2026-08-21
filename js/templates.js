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

  miniPreview(id) {
    const A = '#0d9488';
    const previews = {
      modern: `<div class="mini-resume"><div class="mini-hdr-row"><div><div class="mini-name">Alex Rivera</div><div class="mini-title" style="color:${A}">Product Designer</div></div><div class="mini-contact-r">email · phone</div></div><div class="mini-bar" style="background:${A}"></div><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div></div>`,
      minimal: `<div class="mini-resume" style="text-align:center;"><div class="mini-name">ALEX RIVERA</div><div class="mini-title">Designer</div><hr class="mini-hr"/><div class="mini-line" style="margin:0 auto;"></div></div>`,
      corporate: `<div class="mini-resume" style="padding:0;"><div class="mini-corp-head" style="background:${A}"><div class="mini-name" style="color:#fff;">Alex Rivera</div></div><div style="padding:8px;"><div class="mini-line"></div></div></div>`,
      creative: `<div class="mini-two-col"><div class="mini-sidebar" style="background:${A}"><div class="mini-avatar"></div></div><div class="mini-main"><div class="mini-line"></div></div></div>`,
      elegant: `<div class="mini-resume" style="text-align:center;"><div class="mini-avatar mini-avatar-c"></div><div class="mini-name">Alex Rivera</div></div>`,
      executive: `<div class="mini-resume"><div class="mini-hdr-row" style="border-bottom:2px solid ${A};"><div class="mini-name">Alex Rivera</div></div><div class="mini-line"></div></div>`,
      tech: `<div class="mini-resume" style="font-family:monospace;"><div style="border-left:3px solid ${A};padding-left:6px;"><div class="mini-name">alex_dev</div></div></div>`,
      student: `<div class="mini-resume"><div class="mini-name" style="color:${A}">Alex Rivera</div><div class="mini-box"><div class="mini-job"><b>B.Sc. CS</b></div></div></div>`,
      'two-column': `<div class="mini-two-col"><div class="mini-sidebar mini-sidebar-light"><div class="mini-avatar"></div></div><div class="mini-main"><div class="mini-line"></div></div></div>`,
      ats: `<div class="mini-resume" style="font-family:Arial,sans-serif;"><div class="mini-name">ALEX RIVERA</div><div class="mini-section-title">EXPERIENCE</div><div class="mini-line"></div></div>`,
      hr: `<div class="mini-resume" style="padding:0;"><div style="background:#4a1515;color:#fff;padding:8px;"><div class="mini-name" style="color:#fff;">HR Style</div></div><div style="padding:6px;"><div class="mini-line"></div></div></div>`,
      fullstack: `<div class="mini-two-col"><div class="mini-sidebar" style="background:#5c3d2e;"><div class="mini-name" style="color:#fff;font-size:8px;">Dev</div></div><div class="mini-main"><div class="mini-line"></div></div></div>`,
      sales: `<div class="mini-resume"><div class="mini-name" style="color:#1e5a8a;">Sales</div><div class="mini-section-title" style="color:#1e5a8a;">Experience</div><div class="mini-line"></div></div>`,
      cinematic: `<div class="mini-resume" style="background:#0f0f14;color:#e2e8f0;padding:8px;"><div class="mini-name" style="color:#fff;">Editor</div><div class="mini-line" style="background:#334155;"></div></div>`,
      marketing: `<div class="mini-two-col"><div class="mini-sidebar" style="background:#fffbeb;border-right:2px solid #eab308;"><div class="mini-name" style="font-size:8px;">Marketing</div></div><div class="mini-main"><div class="mini-line"></div></div></div>`,
      clinical: `<div class="mini-two-col"><div class="mini-sidebar" style="background:#166534;"><div class="mini-name" style="color:#fff;font-size:8px;">Nurse</div></div><div class="mini-main" style="background:#fefce8;"><div class="mini-line"></div></div></div>`,
      classic: `<div class="mini-resume" style="padding:8px;"><div class="mini-name" style="color:#1e293b;font-size:11px;">AHMDD SAAH</div><div class="mini-title" style="color:#64748b;">MARKETING MANAGER</div><div style="height:1px;background:#1e3a5f;margin:4px 0 6px;"></div><div style="display:grid;grid-template-columns:32% 68%;gap:6px;"><div><div class="mini-section-title" style="color:#1e3a5f;font-size:6px;">CONTACT</div><div class="mini-line short"></div><div class="mini-section-title" style="color:#1e3a5f;font-size:6px;">SKILLS</div><div class="mini-line"></div></div><div><div class="mini-section-title" style="color:#1e3a5f;font-size:6px;">PROFILE</div><div class="mini-line"></div><div class="mini-section-title" style="color:#1e3a5f;font-size:6px;">WORK EXPERIENCE</div><div class="mini-line"></div><div class="mini-line medium"></div></div></div></div>`
    };
    return previews[id] || previews.modern;
  },

  applyTemplate(templateId) {
    let resume;
    if (this.resumeId) resume = Storage.getResume(this.resumeId);
    if (!resume) resume = Storage.createEmptyResume();
    resume.template = templateId;
    Storage.saveResume(resume);
    Utils.toast('Template applied: ' + (TEMPLATES.find(t => t.id === templateId)?.name || templateId), 'success');
    setTimeout(() => { window.location.href = 'builder.html?id=' + resume.id; }, 400);
  }
};

document.addEventListener('DOMContentLoaded', () => TemplatesPage.init());
window.TemplatesPage = TemplatesPage;
