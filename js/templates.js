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
      modern: `<div class="mini-resume mini-modern"><div class="mini-hdr-row"><div><div class="mini-name">Alex Rivera</div><div class="mini-title" style="color:${A}">Product Designer</div></div><div class="mini-contact-r">📧 alex@mail.com<br>📱 +1 555 0100<br>📍 New York</div></div><div class="mini-bar" style="background:${A}"></div><div class="mini-section"><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-job"><b>Senior Designer</b> · Acme · 2021–Now</div><div class="mini-line"></div><div class="mini-line medium"></div></div><div class="mini-section"><div class="mini-section-title" style="color:${A}">Education</div><div class="mini-job"><b>B.A. Design</b> · GPA 3.8</div></div><div class="mini-section"><div class="mini-section-title" style="color:${A}">Skills</div><div class="mini-tags"><span>Figma</span><span>UI/UX</span><span>CSS</span></div></div></div>`,
      minimal: `<div class="mini-resume mini-minimal"><div class="mini-name" style="text-align:center;letter-spacing:0.12em;">ALEX RIVERA</div><div class="mini-title" style="text-align:center;">Designer</div><div class="mini-contact-c">alex@mail.com · New York</div><hr class="mini-hr"/><div class="mini-section-title">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="margin-top:6px;">Education</div><div class="mini-line short"></div></div>`,
      corporate: `<div class="mini-resume mini-corporate" style="padding:0;"><div class="mini-corp-head" style="background:${A}"><div class="mini-name" style="color:#fff;">Alex Rivera</div><div class="mini-title" style="color:#fff;opacity:0.9;">Business Manager</div><div class="mini-contact-c" style="color:#fff;opacity:0.85;margin-top:4px;">alex@mail.com · +1 555 0100</div></div><div style="padding:8px;"><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:${A};margin-top:6px;">Skills</div><div class="mini-line short"></div></div></div>`,
      creative: `<div class="mini-two-col mini-creative"><div class="mini-sidebar" style="background:${A}"><div class="mini-avatar"></div><div class="mini-name" style="color:#fff;font-size:9px;">Alex Rivera</div><div class="mini-title" style="color:#fff;opacity:0.9;">Designer</div><div class="mini-side-label">Contact</div><div class="mini-line" style="background:rgba(255,255,255,0.35)"></div><div class="mini-side-label">Skills</div><div class="mini-line short" style="background:rgba(255,255,255,0.35)"></div></div><div class="mini-main"><div class="mini-section-title" style="color:${A}">About</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:${A};margin-top:6px;">Work</div><div class="mini-line"></div><div class="mini-line short"></div></div></div>`,
      elegant: `<div class="mini-resume mini-elegant"><div class="mini-avatar mini-avatar-c"></div><div class="mini-name" style="text-align:center;letter-spacing:0.15em;font-family:Georgia,serif;">Alex Rivera</div><div class="mini-title" style="text-align:center;font-style:italic;color:${A}">Creative Director</div><div class="mini-contact-c">alex@mail.com · Portfolio</div><hr class="mini-hr" style="border-color:${A};width:40%;margin-left:auto;margin-right:auto;"/><div class="mini-section-title" style="text-align:center;color:${A}">Experience</div><div class="mini-line" style="margin:0 auto;"></div><div class="mini-line medium" style="margin:3px auto;"></div></div>`,
      executive: `<div class="mini-resume mini-executive"><div class="mini-hdr-row" style="border-bottom:2.5px solid ${A};padding-bottom:5px;"><div><div class="mini-name">Alex Rivera</div><div class="mini-title" style="color:${A}">VP of Product</div></div><div class="mini-contact-r">alex@mail.com<br>+1 555 0100<br>New York, NY</div></div><div class="mini-section"><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-job"><b>VP Product</b> · Global Co</div><div class="mini-line"></div><div class="mini-line medium"></div></div><div class="mini-section"><div class="mini-section-title" style="color:${A}">Education</div><div class="mini-line short"></div></div></div>`,
      tech: `<div class="mini-resume mini-tech" style="font-family:ui-monospace,monospace;"><div style="border-left:3px solid ${A};padding-left:8px;"><div class="mini-name">alex_rivera</div><div class="mini-title" style="color:${A}">// Full Stack Developer</div></div><div class="mini-contact-c" style="text-align:left;margin:6px 0;">github.com/alex · alex.dev</div><div class="mini-section-title" style="color:${A}">$ experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:${A};margin-top:6px;">$ skills</div><div class="mini-tags"><span>JS</span><span>React</span><span>Node</span></div></div>`,
      student: `<div class="mini-resume mini-student"><div class="mini-name" style="color:${A}">Alex Rivera</div><div class="mini-title">Computer Science Student</div><div class="mini-contact-c" style="text-align:left;">alex@univ.edu · Campus</div><div class="mini-box"><div class="mini-section-title" style="color:${A}">Education</div><div class="mini-job"><b>B.Sc. CS</b> · GPA 3.8</div></div><div class="mini-section-title" style="color:${A}">Projects</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:${A}">Skills</div><div class="mini-tags"><span>Python</span><span>Java</span></div></div>`,
      'two-column': `<div class="mini-two-col mini-twocol"><div class="mini-sidebar mini-sidebar-light"><div class="mini-avatar"></div><div class="mini-name" style="font-size:9px;">Alex Rivera</div><div class="mini-title" style="color:${A}">Engineer</div><div class="mini-side-label" style="color:${A}">Contact</div><div class="mini-line short"></div><div class="mini-side-label" style="color:${A}">Skills</div><div class="mini-tags"><span>JS</span><span>CSS</span></div></div><div class="mini-main"><div class="mini-section-title" style="color:${A}">Experience</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title" style="color:${A};margin-top:6px;">Education</div><div class="mini-line short"></div></div></div>`,
      ats: `<div class="mini-resume mini-ats" style="font-family:Arial,Helvetica,sans-serif;"><div class="mini-hdr-row" style="border-bottom:1px solid #333;padding-bottom:4px;"><div><div class="mini-name">ALEX RIVERA</div><div class="mini-title">Software Engineer</div></div><div class="mini-contact-r">email@example.com<br>phone · city</div></div><div class="mini-section-title">PROFESSIONAL SUMMARY</div><div class="mini-line"></div><div class="mini-line medium"></div><div class="mini-section-title">EXPERIENCE</div><div class="mini-job"><b>Engineer</b> | Company | 2020–Present</div><div class="mini-line"></div><div class="mini-section-title">EDUCATION</div><div class="mini-job">B.Sc. CS — University · GPA 3.8</div><div class="mini-section-title">SKILLS</div><div class="mini-line medium"></div></div>`
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
