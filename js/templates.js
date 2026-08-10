/* ============================================
   ResumeForge — Template Gallery Logic
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
  { id: 'ats', name: 'ATS Friendly', desc: 'Single-column, plain formatting optimized for Applicant Tracking Systems.', tags: ['ats', 'professional', 'all'], ats: true }
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
    const filtered = TEMPLATES.filter(t => this.currentFilter === 'all' || t.tags.includes(this.currentFilter));
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
            ${t.tags.filter(tag => tag !== 'all').slice(0, 2).map(tag => `<span class="badge ${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`).join('')}
          </div>
        </div>
        <div class="template-actions">
          <button class="btn btn-primary use-template" data-id="${t.id}">Use Template</button>
        </div>
      </article>
    `).join('');
    grid.querySelectorAll('.use-template').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); this.applyTemplate(btn.dataset.id); });
    });
    grid.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => this.applyTemplate(card.dataset.id));
    });
  },

  miniPreview(id) {
    const previews = {
      modern: '<div class="mini-resume"><div class="mini-header"><div class="mini-name">Alex Rivera</div><div class="mini-title">Product Designer</div></div><div class="mini-section"><div class="mini-section-title">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div></div></div>',
      minimal: '<div class="mini-resume" style="text-align:center;"><div class="mini-name" style="letter-spacing:1px;">ALEX RIVERA</div><div class="mini-title">Designer</div><hr style="margin:6px 0;border:none;border-top:1px solid #e2e8f0;"><div class="mini-line" style="margin:0 auto;"></div></div>',
      corporate: '<div class="mini-resume" style="padding:0;"><div style="background:#2563eb;color:#fff;padding:8px;"><div class="mini-name">Alex Rivera</div><div class="mini-title" style="opacity:0.8;">Manager</div></div><div style="padding:6px;"><div class="mini-line"></div></div></div>',
      creative: '<div class="mini-two-col"><div class="mini-sidebar"><div class="mini-name" style="font-size:9px;">Alex</div><div class="mini-line" style="margin-top:8px;"></div></div><div class="mini-main"><div class="mini-section-title">About</div><div class="mini-line"></div></div></div>',
      elegant: '<div class="mini-resume" style="text-align:center;font-family:serif;"><div class="mini-name" style="letter-spacing:2px;">Alex Rivera</div><div class="mini-title" style="font-style:italic;">Creative Director</div></div>',
      executive: '<div class="mini-resume"><div style="display:flex;justify-content:space-between;border-bottom:2px solid #2563eb;padding-bottom:4px;"><div class="mini-name">Alex Rivera</div></div><div class="mini-section" style="margin-top:6px;"><div class="mini-section-title">Experience</div><div class="mini-line"></div></div></div>',
      tech: '<div class="mini-resume" style="font-family:monospace;"><div style="border-left:3px solid #2563eb;padding-left:6px;"><div class="mini-name">alex_rivera</div><div class="mini-title">// developer</div></div></div>',
      student: '<div class="mini-resume"><div class="mini-name" style="color:#2563eb;">Alex Rivera</div><div class="mini-title">Computer Science Student</div></div>',
      'two-column': '<div class="mini-two-col"><div style="background:#f1f5f9;padding:4px;"><div class="mini-name" style="font-size:8px;">Alex</div></div><div class="mini-main"><div class="mini-section-title">Experience</div><div class="mini-line"></div></div></div>',
      ats: '<div class="mini-resume" style="font-family:Arial,sans-serif;"><div class="mini-name">ALEX RIVERA</div><div class="mini-title">Software Engineer</div><div class="mini-section-title">EXPERIENCE</div><div class="mini-line"></div></div>'
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
