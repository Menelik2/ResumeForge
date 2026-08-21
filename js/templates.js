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
  { id: 'clinical', name: 'Clinical Care', desc: 'Soft green medical theme with photo panel and timeline. Designed for nurses and healthcare.', tags: ['professional', 'all'], ats: false }
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
      modern: `<div class="mini-resume"><div class="mini-hdr-row"><div><div class="mini-name">Alex Rivera</div><div class="mini-title" style="color:${A}">Product Designer</div></div><div class="mini-contact-r">email · phone</div></div><div class="mini-bar" style="background:${A}"></div><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div></div>`,
      minimal: `<div class="mini-resume" style="text-align:center;"><div class="mini-name" style="letter-spacing:0.1em;">ALEX RIVERA</div><div class="mini-title">Designer</div><hr class="mini-hr"/><div class="mini-line" style="margin:0 auto;"></div></div>`,
      corporate: `<div class="mini-resume" style="padding:0;"><div class="mini-corp-head" style="background:${A}"><div class="mini-name" style="color:#fff;">Alex Rivera</div><div class="mini-title" style="color:#fff;">Manager</div></div><div style="padding:8px;"><div class="mini-line"></div></div></div>`,
      creative: `<div class="mini-two-col"><div class="mini-sidebar" style="background:${A}"><div class="mini-avatar"></div><div class="mini-name" style="color:#fff;font-size:9px;">Alex</div></div><div class="mini-main"><div class="mini-section-title" style="color:${A}">About</div><div class="mini-line"></div></div></div>`,
      elegant: `<div class="mini-resume" style="text-align:center;font-family:Georgia,serif;"><div class="mini-avatar mini-avatar-c"></div><div class="mini-name">Alex Rivera</div><div class="mini-title" style="color:${A};font-style:italic;">Director</div></div>`,
      executive: `<div class="mini-resume"><div class="mini-hdr-row" style="border-bottom:2px solid ${A};"><div class="mini-name">Alex Rivera</div><div class="mini-contact-r">email</div></div><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div></div>`,
      tech: `<div class="mini-resume" style="font-family:monospace;"><div style="border-left:3px solid ${A};padding-left:6px;"><div class="mini-name">alex_dev</div><div class="mini-title" style="color:${A}">// developer</div></div><div class="mini-line"></div></div>`,
      student: `<div class="mini-resume"><div class="mini-name" style="color:${A}">Alex Rivera</div><div class="mini-title">Student</div><div class="mini-box"><div class="mini-job"><b>B.Sc. CS</b> · GPA 3.8</div></div></div>`,
      'two-column': `<div class="mini-two-col"><div class="mini-sidebar mini-sidebar-light"><div class="mini-avatar"></div><div class="mini-name" style="font-size:9px;">Alex</div></div><div class="mini-main"><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div></div></div>`,
      ats: `<div class="mini-resume" style="font-family:Arial,sans-serif;"><div class="mini-name">ALEX RIVERA</div><div class="mini-title">Engineer</div><div class="mini-section-title">EXPERIENCE</div><div class="mini-line"></div></div>`,
      /* NEW: HR Management — burgundy header */
      hr: `<div class="mini-resume" style="padding:0;"><div style="background:#4a1515;color:#fff;padding:8px;display:flex;gap:6px;align-items:center;"><div class="mini-avatar" style="margin:0;border-color:rgba(255,255,255,0.4);"></div><div><div class="mini-name" style="color:#fff;">Lidiya A.</div><div class="mini-title" style="color:#f5d0d0;">HR & Management</div></div></div><div style="display:grid;grid-template-columns:38% 62%;padding:6px;gap:4px;"><div><div class="mini-section-title" style="color:#4a1515;">Contact</div><div class="mini-line short"></div><div class="mini-section-title" style="color:#4a1515;">Skills</div><div class="mini-line"></div></div><div><div class="mini-section-title" style="color:#4a1515;">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div></div></div></div>`,
      /* NEW: Full-Stack Sidebar — brown left */
      fullstack: `<div class="mini-two-col"><div class="mini-sidebar" style="background:#5c3d2e;"><div class="mini-avatar"></div><div class="mini-name" style="color:#fff;font-size:8px;">Tsedneya K.</div><div class="mini-title" style="color:#e8c4a8;">Full-Stack Dev</div><div class="mini-side-label">Contact</div><div class="mini-line" style="background:rgba(255,255,255,0.3)"></div><div class="mini-side-label">Skills</div><div class="mini-tags"><span style="background:#8b5e3c;color:#fff;">React</span></div></div><div class="mini-main"><div class="mini-section-title" style="color:#5c3d2e;">Education</div><div class="mini-line short"></div><div class="mini-section-title" style="color:#5c3d2e;">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div></div></div>`,
      /* NEW: Sales Executive — clean blue */
      sales: `<div class="mini-resume"><div style="display:flex;gap:6px;align-items:center;border-bottom:2px solid #1e5a8a;padding-bottom:4px;"><div class="mini-avatar" style="margin:0;border-radius:4px;"></div><div><div class="mini-name" style="color:#1e5a8a;">Rebeka T.</div><div class="mini-title">Sales</div></div></div><div class="mini-section-title" style="color:#1e5a8a;">About Me</div><div class="mini-line"></div><div class="mini-section-title" style="color:#1e5a8a;">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:#1e5a8a;">Education</div><div class="mini-job">MBA · GPA 3.5</div></div>`,
      /* NEW: Cinematic Dark */
      cinematic: `<div class="mini-resume" style="background:#0f0f14;color:#e2e8f0;padding:8px;"><div style="display:flex;gap:6px;align-items:center;"><div class="mini-avatar" style="margin:0;box-shadow:0 0 8px #7c3aed;"></div><div><div class="mini-name" style="color:#fff;">Daniel A.</div><div class="mini-title" style="color:#a78bfa;">Video Editor</div></div></div><div style="margin:6px 0;height:12px;background:linear-gradient(90deg,#1e1b4b,#4c1d95,#1e1b4b);border-radius:2px;"></div><div class="mini-section-title" style="color:#a78bfa;">Experience</div><div class="mini-line" style="background:#334155;"></div><div class="mini-line medium" style="background:#334155;"></div></div>`,
      /* NEW: Marketing Gold */
      marketing: `<div class="mini-two-col"><div class="mini-sidebar" style="background:#fffbeb;color:#0f172a;border-right:2px solid #eab308;"><div class="mini-avatar" style="border-radius:4px;background:linear-gradient(135deg,#fde047,#eab308);"></div><div class="mini-name" style="font-size:8px;">Hiwot A.</div><div class="mini-title" style="color:#ca8a04;">Marketing</div><div class="mini-side-label" style="color:#ca8a04;">Skills</div><div class="mini-line short" style="background:#fde047;"></div></div><div class="mini-main"><div class="mini-section-title" style="color:#ca8a04;background:#fef9c3;padding:1px 3px;border-radius:2px;display:inline-block;">Work Experience</div><div class="mini-line"></div><div class="mini-line medium"></div></div></div>`,
      /* NEW: Clinical Care — green medical */
      clinical: `<div class="mini-two-col"><div class="mini-sidebar" style="background:linear-gradient(180deg,#14532d,#166534);"><div class="mini-avatar" style="border-radius:50%;"></div><div class="mini-name" style="color:#fff;font-size:8px;">Abigail M.</div><div class="mini-title" style="color:#bbf7d0;">Registered Nurse</div><div class="mini-side-label" style="color:#86efac;">Contact</div><div class="mini-line" style="background:rgba(255,255,255,0.3)"></div></div><div class="mini-main" style="background:#fefce8;"><div class="mini-section-title" style="color:#166534;">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:#166534;">Education</div><div class="mini-line short"></div></div></div>`
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
