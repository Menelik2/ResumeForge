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

  /** True if resume has almost no content — safe to fill with sample */
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
    let resume;
    if (this.resumeId) resume = Storage.getResume(this.resumeId);

    // Empty resume → fill with full sample so user sees complete template style
    if (!resume || this.isResumeEmpty(resume)) {
      const sample = Storage.getSampleResume();
      if (resume && resume.id) {
        sample.id = resume.id;
        sample.title = resume.title || sample.title;
      }
      resume = sample;
    }

    resume.template = templateId;
    Storage.saveResume(resume);
    Utils.toast('Template applied with sample data — edit anytime', 'success');
    setTimeout(() => { window.location.href = 'builder.html?id=' + resume.id; }, 400);
  },

  miniPreview(id) {
    const previews = {
      modern: `
        <div style="padding:10px;height:100%;box-sizing:border-box;background:#fff">
          <div style="display:flex;justify-content:space-between;align-items:flex-start">
            <div><div style="font-weight:700;font-size:11px">Alex Rivera</div>
            <div style="color:#0d9488;font-size:7.5px;margin-top:1px">Product Designer</div></div>
            <div style="font-size:5.5px;color:#64748b;text-align:right;line-height:1.4">alex@mail.com<br>+1 555 0100<br>New York</div>
          </div>
          <div style="height:2.5px;background:#0d9488;margin:6px 0 8px;border-radius:1px"></div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:3px">Experience</div>
          <div style="font-size:6.5px;margin-bottom:2px"><b>Senior Designer</b> · Acme · 2021–Now</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:78%;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Education</div>
          <div style="font-size:6.5px"><b>B.A. Design</b> · GPA 3.8</div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin:6px 0 3px">Skills</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap">
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:99px;font-weight:600">Figma</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:99px;font-weight:600">UI/UX</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:99px;font-weight:600">CSS</span>
          </div>
        </div>`,

      minimal: `
        <div style="padding:12px;height:100%;box-sizing:border-box;background:#fff;font-family:Georgia,serif;text-align:center">
          <div style="font-size:12px;letter-spacing:0.12em;font-weight:400">ALEX RIVERA</div>
          <div style="font-size:7.5px;color:#64748b;margin:3px 0;font-style:italic">Designer</div>
          <div style="font-size:5.5px;color:#94a3b8">alex@mail.com · New York</div>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 20%"/>
          <div style="font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Experience</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin:0 auto 2px;width:80%"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin:0 auto 8px;width:60%"></div>
          <div style="font-size:7px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px">Education</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin:0 auto;width:50%"></div>
        </div>`,

      corporate: `
        <div style="height:100%;box-sizing:border-box;background:#fff;padding:0">
          <div style="background:#0d9488;color:#fff;padding:12px 10px">
            <div style="font-weight:700;font-size:12px">Alex Rivera</div>
            <div style="font-size:7.5px;opacity:0.9;margin-top:2px">Business Manager</div>
            <div style="font-size:5.5px;opacity:0.8;margin-top:4px">alex@mail.com · +1 555 0100</div>
          </div>
          <div style="padding:10px">
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Experience</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:6px"></div>
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Skills</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:50%"></div>
          </div>
        </div>`,

      creative: `
        <div style="display:grid;grid-template-columns:36% 64%;height:100%;background:#fff">
          <div style="background:#0d9488;padding:10px 7px;color:#fff">
            <div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.3);margin-bottom:6px"></div>
            <div style="font-weight:700;font-size:9px">Alex Rivera</div>
            <div style="font-size:6.5px;opacity:0.9;margin-top:1px">Designer</div>
            <div style="font-size:6px;font-weight:700;margin:10px 0 3px;opacity:0.9">CONTACT</div>
            <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:1px;margin-bottom:2px"></div>
            <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:1px;width:70%;margin-bottom:6px"></div>
            <div style="font-size:6px;font-weight:700;margin:8px 0 3px;opacity:0.9">SKILLS</div>
            <div style="height:2.5px;background:rgba(255,255,255,0.35);border-radius:1px;width:80%"></div>
          </div>
          <div style="padding:10px 8px">
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">About</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:75%;margin-bottom:8px"></div>
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Work</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:60%"></div>
          </div>
        </div>`,

      elegant: `
        <div style="padding:12px;height:100%;box-sizing:border-box;background:#fff;font-family:Georgia,serif;text-align:center">
          <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#99f6e4,#0d9488);margin:0 auto 6px"></div>
          <div style="font-size:11px;letter-spacing:0.1em">Alex Rivera</div>
          <div style="font-size:7.5px;color:#0d9488;font-style:italic;margin:2px 0">Creative Director</div>
          <div style="font-size:5.5px;color:#94a3b8">alex@mail.com · Portfolio</div>
          <hr style="border:none;border-top:1px solid #0d9488;width:40%;margin:8px auto"/>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:4px">Experience</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin:0 auto 2px;width:70%"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin:0 auto;width:50%"></div>
        </div>`,

      executive: `
        <div style="padding:10px;height:100%;box-sizing:border-box;background:#fff">
          <div style="display:flex;justify-content:space-between;border-bottom:2.5px solid #0d9488;padding-bottom:6px;margin-bottom:8px">
            <div><div style="font-weight:700;font-size:11px">Alex Rivera</div>
            <div style="color:#0d9488;font-size:7.5px">VP of Product</div></div>
            <div style="font-size:5.5px;color:#64748b;text-align:right;line-height:1.4">alex@mail.com<br>+1 555 0100<br>New York, NY</div>
          </div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Experience</div>
          <div style="font-size:6.5px;margin-bottom:2px"><b>VP Product</b> · Global Co</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:75%;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Education</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:55%"></div>
        </div>`,

      tech: `
        <div style="padding:10px;height:100%;box-sizing:border-box;background:#fff;font-family:ui-monospace,monospace">
          <div style="border-left:3px solid #0d9488;padding-left:8px;margin-bottom:8px">
            <div style="font-weight:700;font-size:11px">alex_rivera</div>
            <div style="color:#0d9488;font-size:7.5px">// Full Stack Developer</div>
          </div>
          <div style="font-size:5.5px;color:#64748b;margin-bottom:6px">github.com/alex · alex.dev</div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;margin-bottom:3px">$ experience</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;margin-bottom:3px">$ skills</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap">
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:3px;font-weight:600">JS</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:3px;font-weight:600">React</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:3px;font-weight:600">Node</span>
          </div>
        </div>`,

      student: `
        <div style="padding:10px;height:100%;box-sizing:border-box;background:#fff">
          <div style="font-weight:700;font-size:12px;color:#0d9488">Alex Rivera</div>
          <div style="font-size:7.5px;margin:2px 0">Computer Science Student</div>
          <div style="font-size:5.5px;color:#64748b;margin-bottom:6px">alex@univ.edu · Campus</div>
          <div style="background:#f1f5f9;padding:6px 7px;border-radius:4px;margin-bottom:6px">
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:2px">Education</div>
            <div style="font-size:6.5px"><b>B.Sc. CS</b> · GPA 3.8</div>
          </div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Projects</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Skills</div>
          <div style="display:flex;gap:3px">
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:99px;font-weight:600">Python</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:5.5px;padding:1.5px 5px;border-radius:99px;font-weight:600">Java</span>
          </div>
        </div>`,

      'two-column': `
        <div style="display:grid;grid-template-columns:34% 66%;height:100%;background:#fff">
          <div style="background:#f1f5f9;padding:10px 7px">
            <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,#99f6e4,#5eead4);margin-bottom:5px"></div>
            <div style="font-weight:700;font-size:9px">Alex Rivera</div>
            <div style="color:#0d9488;font-size:6.5px">Engineer</div>
            <div style="font-size:6px;font-weight:700;color:#0d9488;margin:8px 0 3px">CONTACT</div>
            <div style="height:2.5px;background:#cbd5e1;border-radius:1px;width:70%;margin-bottom:2px"></div>
            <div style="font-size:6px;font-weight:700;color:#0d9488;margin:8px 0 3px">SKILLS</div>
            <div style="display:flex;gap:2px;flex-wrap:wrap">
              <span style="background:#ccfbf1;color:#0f766e;font-size:5px;padding:1px 4px;border-radius:99px">JS</span>
              <span style="background:#ccfbf1;color:#0f766e;font-size:5px;padding:1px 4px;border-radius:99px">CSS</span>
            </div>
          </div>
          <div style="padding:10px 8px">
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Experience</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:8px"></div>
            <div style="font-size:7px;font-weight:700;color:#0d9488;text-transform:uppercase;margin-bottom:3px">Education</div>
            <div style="height:3px;background:#e2e8f0;border-radius:1px;width:55%"></div>
          </div>
        </div>`,

      ats: `
        <div style="padding:10px;height:100%;box-sizing:border-box;background:#fff;font-family:Arial,Helvetica,sans-serif">
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #333;padding-bottom:5px;margin-bottom:6px">
            <div><div style="font-weight:700;font-size:11px">ALEX RIVERA</div>
            <div style="font-size:7px">Software Engineer</div></div>
            <div style="font-size:5.5px;color:#333;text-align:right;line-height:1.4">email@example.com<br>phone · city</div>
          </div>
          <div style="font-size:7px;font-weight:700;margin-bottom:2px">PROFESSIONAL SUMMARY</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:80%;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;margin-bottom:2px">EXPERIENCE</div>
          <div style="font-size:6.5px;margin-bottom:2px"><b>Engineer</b> | Company | 2020–Present</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;margin-bottom:6px"></div>
          <div style="font-size:7px;font-weight:700;margin-bottom:2px">EDUCATION</div>
          <div style="font-size:6.5px">B.Sc. CS — University · GPA 3.8</div>
          <div style="font-size:7px;font-weight:700;margin:6px 0 2px">SKILLS</div>
          <div style="height:3px;background:#e2e8f0;border-radius:1px;width:70%"></div>
        </div>`,

      hr: `
        <div style="height:100%;box-sizing:border-box;background:#f7f2ec;padding:6px;font-family:Georgia,serif">
          <div style="background:#3d1212;color:#fff;border-radius:10px;padding:8px 10px;display:flex;align-items:center;gap:8px;margin-bottom:8px">
            <div style="width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,0.25);flex-shrink:0"></div>
            <div><div style="font-weight:700;font-size:10px;letter-spacing:0.04em">ALEX RIVERA</div>
            <div style="font-size:6px;color:#e8b8b8;margin-top:1px;font-family:sans-serif">HR Manager</div></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1.3fr;gap:8px;font-family:sans-serif">
            <div>
              <div style="font-size:7px;font-weight:700;margin-bottom:3px">Contact</div>
              <div style="height:2.5px;background:#d4c4b0;border-radius:1px;margin-bottom:2px"></div>
              <div style="height:2.5px;background:#d4c4b0;border-radius:1px;width:70%;margin-bottom:5px"></div>
              <div style="font-size:7px;font-weight:700;margin-bottom:3px">Skills</div>
              <div style="height:3px;background:#e8ddd6;border-radius:99px;margin-bottom:2px"><div style="height:100%;width:75%;background:#3d1212;border-radius:99px"></div></div>
              <div style="height:3px;background:#e8ddd6;border-radius:99px;margin-bottom:2px"><div style="height:100%;width:55%;background:#3d1212;border-radius:99px"></div></div>
            </div>
            <div>
              <div style="font-size:7px;font-weight:700;margin-bottom:3px">About Me</div>
              <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
              <div style="height:2.5px;background:#e2e8f0;border-radius:1px;width:80%;margin-bottom:5px"></div>
              <div style="font-size:7px;font-weight:700;margin-bottom:3px">Experience</div>
              <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px"><span style="width:5px;height:5px;border-radius:50%;background:#3d1212"></span>
              <span style="font-size:6px;font-weight:600">HR Lead · 2020–Now</span></div>
              <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-left:9px"></div>
            </div>
          </div>
        </div>`,

      fullstack: `
        <div style="display:grid;grid-template-columns:38% 62%;height:100%;background:#fff">
          <div style="background:linear-gradient(170deg,#4a2f1a,#6b4423);color:#fff;padding:8px 6px">
            <div style="font-weight:800;font-size:9px;line-height:1.15">Alex Rivera</div>
            <div style="font-size:6px;color:#e8c9a8;margin-top:2px">Full-Stack Dev</div>
            <div style="text-align:center;margin:8px 0"><div style="width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.2);margin:0 auto;border:2px solid rgba(255,255,255,0.3)"></div></div>
            <div style="background:rgba(255,255,255,0.12);border-radius:99px;padding:3px 6px;font-size:5px;margin-bottom:3px">✉ alex@mail.com</div>
            <div style="background:rgba(255,255,255,0.12);border-radius:99px;padding:3px 6px;font-size:5px;margin-bottom:3px">☎ +1 555 0100</div>
            <div style="font-size:5.5px;margin-top:6px;opacity:0.9">SKILLS</div>
            <div style="display:flex;gap:2px;margin-top:3px"><span style="width:5px;height:5px;border-radius:50%;background:#fff"></span><span style="width:5px;height:5px;border-radius:50%;background:#fff"></span><span style="width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,0.3)"></span></div>
          </div>
          <div style="padding:8px 7px">
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:5px">
              <span style="background:#5c3a21;color:#fff;font-size:5px;padding:2px 5px;border-radius:3px;font-weight:700">EDUCATION</span>
              <span style="flex:1;height:1.5px;background:#e8ddd6"></span>
            </div>
            <div style="font-size:6px;margin-bottom:2px"><b>B.Sc. CS</b></div>
            <div style="height:2.5px;background:#e2e8f0;border-radius:1px;width:70%;margin-bottom:6px"></div>
            <div style="display:flex;align-items:center;gap:4px;margin-bottom:5px">
              <span style="background:#5c3a21;color:#fff;font-size:5px;padding:2px 5px;border-radius:3px;font-weight:700">EXPERIENCE</span>
              <span style="flex:1;height:1.5px;background:#e8ddd6"></span>
            </div>
            <div style="font-size:6px"><b>Senior Dev</b> · TechCo</div>
            <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-top:2px"></div>
          </div>
        </div>`,

      sales: `
        <div style="padding:8px;height:100%;box-sizing:border-box;background:#fff">
          <div style="display:flex;gap:8px;align-items:flex-start;margin-bottom:6px">
            <div style="width:28px;height:28px;border-radius:6px;background:#dbeafe;flex-shrink:0"></div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:11px;color:#0f2744">Alex Rivera</div>
              <div style="color:#1a6bb5;font-size:7px;margin-top:1px">Sales Executive</div>
              <div style="height:2px;background:linear-gradient(90deg,#1a6bb5,#93c5fd);margin:4px 0 3px"></div>
              <div style="font-size:5px;color:#64748b">✉ alex@mail.com · ☎ +1 555 · 📍 NYC</div>
            </div>
          </div>
          <div style="color:#1a6bb5;font-weight:700;font-size:6.5px;border-bottom:1.5px solid #1a6bb5;padding-bottom:2px;margin-bottom:4px">ABOUT ME</div>
          <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-bottom:2px"></div>
          <div style="height:2.5px;background:#e2e8f0;border-radius:1px;width:80%;margin-bottom:5px"></div>
          <div style="color:#1a6bb5;font-weight:700;font-size:6.5px;border-bottom:1.5px solid #1a6bb5;padding-bottom:2px;margin-bottom:4px">EXPERIENCE</div>
          <div style="font-size:6px;color:#1a6bb5;font-weight:600">Sales Manager · Global Co</div>
          <div style="font-size:5.5px;color:#94a3b8">2020 – Present</div>
          <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin:3px 0"></div>
          <div style="color:#1a6bb5;font-weight:700;font-size:6.5px;border-bottom:1.5px solid #1a6bb5;padding-bottom:2px;margin:5px 0 3px">SKILLS</div>
          <div style="font-size:5.5px;color:#334155">→ Negotiation · CRM · Closing</div>
        </div>`,

      cinematic: `
        <div style="height:100%;box-sizing:border-box;background:#0a0a10;color:#e2e8f0;padding:6px">
          <div style="display:grid;grid-template-columns:36% 64%;gap:6px;height:100%">
            <div>
              <div style="text-align:center;margin-bottom:5px"><div style="width:28px;height:28px;border-radius:50%;background:#2a2a38;border:2px solid #7c3aed;margin:0 auto;box-shadow:0 0 10px rgba(124,58,237,0.5)"></div></div>
              <div style="text-align:center;font-weight:800;font-size:8px;color:#fff">Alex Rivera</div>
              <div style="text-align:center;color:#a78bfa;font-size:5px;letter-spacing:0.12em;margin-top:2px">VIDEO EDITOR</div>
              <div style="background:#14141e;border-radius:6px;padding:5px;margin-top:6px;font-size:5px;color:#94a3b8">
                <div style="color:#a78bfa;font-weight:700;margin-bottom:2px">● CONTACT</div>
                <div>☎ +1 555 0100</div><div>✉ alex@mail.com</div>
              </div>
              <div style="background:#14141e;border-radius:6px;padding:5px;margin-top:4px">
                <div style="color:#a78bfa;font-size:5px;font-weight:700;margin-bottom:3px">SKILLS</div>
                <div style="height:3px;background:#2a2a38;border-radius:99px;margin-bottom:2px"><div style="height:100%;width:80%;background:#7c3aed;border-radius:99px"></div></div>
                <div style="height:3px;background:#2a2a38;border-radius:99px"><div style="height:100%;width:60%;background:#7c3aed;border-radius:99px"></div></div>
              </div>
            </div>
            <div>
              <div style="background:#14141e;border-radius:6px;padding:5px;margin-bottom:4px">
                <div style="color:#a78bfa;font-size:5.5px;font-weight:700">ABOUT ME</div>
                <div style="height:2.5px;background:#2a2a38;border-radius:1px;margin-top:3px"></div>
                <div style="height:2.5px;background:#2a2a38;border-radius:1px;width:70%;margin-top:2px"></div>
              </div>
              <div style="background:#14141e;border-radius:6px;padding:5px">
                <div style="color:#a78bfa;font-size:5.5px;font-weight:700;margin-bottom:3px">EXPERIENCE</div>
                <div style="border-left:2px solid #7c3aed;padding-left:5px;margin-bottom:3px">
                  <div style="font-size:5px;color:#94a3b8">2021 – Now</div>
                  <div style="font-size:6px;font-weight:700;color:#fff">Lead Editor</div>
                  <div style="font-size:5px;color:#a78bfa">Studio X</div>
                </div>
              </div>
            </div>
          </div>
        </div>`,

      marketing: `
        <div style="display:grid;grid-template-columns:36% 64%;height:100%;background:#fff">
          <div style="background:#fffdf7;padding:8px 6px;border-right:1px solid #fef08a">
            <div style="width:24px;height:24px;border-radius:5px;background:#fde047;margin-bottom:5px"></div>
            <div style="font-weight:800;font-size:9px;line-height:1.15;color:#0f172a">Alex<br><span style="color:#eab308">Rivera</span></div>
            <div style="color:#ca8a04;font-size:5px;font-weight:700;letter-spacing:0.1em;margin-top:2px">MARKETING</div>
            <div style="margin-top:6px"><span style="background:#eab308;color:#fff;font-size:5px;padding:1.5px 5px;border-radius:3px;font-weight:700">SUMMARY</span></div>
            <div style="height:2.5px;background:#fef08a;border-radius:1px;margin:4px 0 2px"></div>
            <div style="height:2.5px;background:#fef08a;border-radius:1px;width:70%;margin-bottom:5px"></div>
            <div style="margin-top:4px"><span style="background:#eab308;color:#fff;font-size:5px;padding:1.5px 5px;border-radius:3px;font-weight:700">SKILLS</span></div>
            <div style="display:flex;gap:2px;margin-top:3px"><span style="width:5px;height:5px;border-radius:50%;background:#eab308"></span><span style="width:5px;height:5px;border-radius:50%;background:#eab308"></span><span style="width:5px;height:5px;border-radius:50%;background:#fef08a"></span></div>
          </div>
          <div style="padding:8px 7px">
            <div style="margin-bottom:5px"><span style="background:#eab308;color:#fff;font-size:5px;padding:1.5px 5px;border-radius:3px;font-weight:700">WORK EXPERIENCE</span></div>
            <div style="display:grid;grid-template-columns:8px 1fr;gap:4px;margin-top:4px">
              <div style="padding-top:2px"><span style="display:block;width:6px;height:6px;border-radius:50%;background:#eab308"></span></div>
              <div><div style="font-size:6.5px;font-weight:700">Marketing Lead</div>
              <div style="font-size:5px;color:#ca8a04">Brand Co · 2021–Now</div>
              <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-top:2px"></div></div>
            </div>
            <div style="display:grid;grid-template-columns:8px 1fr;gap:4px;margin-top:5px">
              <div style="padding-top:2px"><span style="display:block;width:6px;height:6px;border-radius:50%;background:#eab308"></span></div>
              <div><div style="font-size:6.5px;font-weight:700">Content Manager</div>
              <div style="font-size:5px;color:#ca8a04">Agency · 2018–21</div></div>
            </div>
          </div>
        </div>`,

      clinical: `
        <div style="display:grid;grid-template-columns:34% 66%;height:100%;background:#fefce8">
          <div style="background:linear-gradient(180deg,#14532d,#166534);color:#fff;padding:8px 6px;border-radius:0 20px 0 0">
            <div style="text-align:center"><div style="width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,0.25);margin:0 auto;border:2px solid rgba(255,255,255,0.35)"></div></div>
            <div style="text-align:center;margin-top:5px">
              <div style="font-family:Georgia,cursive;font-size:9px;font-style:italic;color:#bbf7d0">Alex</div>
              <div style="font-size:7px;font-weight:700;letter-spacing:0.08em">RIVERA</div>
              <div style="color:#86efac;font-size:5px;letter-spacing:0.1em;margin-top:2px">REGISTERED NURSE</div>
            </div>
            <div style="margin-top:8px;font-size:5px;color:#bbf7d0">
              <div style="color:#fff;font-weight:700;margin-bottom:2px">CONTACT</div>
              <div>☎ +1 555 0100</div><div>✉ alex@mail.com</div>
            </div>
            <div style="margin-top:6px;font-size:5px;color:#dcfce7">
              <div style="color:#fff;font-weight:700;margin-bottom:2px">CORE STRENGTHS</div>
              <div>• Patient Care</div><div>• Teamwork</div>
            </div>
          </div>
          <div style="padding:8px 7px;position:relative">
            <div style="position:absolute;top:4px;right:6px;background:#166534;color:#fff;border-radius:6px;padding:3px 5px;font-size:4px;text-align:center;line-height:1.2">♥ CARE</div>
            <div style="background:#fff;border:1px solid #d9f99d;border-radius:6px;padding:5px;margin-bottom:5px;margin-top:4px">
              <div style="color:#166534;font-weight:700;font-size:5.5px">♡ PROFESSIONAL SUMMARY</div>
              <div style="height:2.5px;background:#e2e8f0;border-radius:1px;margin-top:3px"></div>
            </div>
            <div style="color:#166534;font-weight:700;font-size:6px;margin-bottom:3px">EXPERIENCE</div>
            <div style="border-left:2px solid #86efac;padding-left:6px;position:relative;margin-bottom:4px">
              <span style="position:absolute;left:-5px;top:2px;width:7px;height:7px;border-radius:50%;background:#166534;border:1.5px solid #fefce8"></span>
              <div style="font-size:6px;font-weight:700">Staff Nurse</div>
              <div style="font-size:5px;color:#166534">City Hospital · 2020–Now</div>
            </div>
          </div>
        </div>`,

      classic: `
        <div style="padding:8px;height:100%;box-sizing:border-box;background:#fff">
          <div style="font-weight:800;font-size:11px;color:#1e293b;text-transform:uppercase;letter-spacing:0.02em">Alex Rivera</div>
          <div style="color:#64748b;font-size:6.5px;letter-spacing:0.06em;text-transform:uppercase;margin-top:1px">Marketing Manager</div>
          <div style="height:1.5px;background:#1e3a5f;margin:5px 0 6px"></div>
          <div style="display:grid;grid-template-columns:30% 70%;gap:8px">
            <div>
              <div style="font-size:6px;font-weight:700;letter-spacing:0.08em;color:#1e3a5f;text-transform:uppercase">CONTACT</div>
              <div style="height:1px;background:#1e3a5f;margin:2px 0 4px"></div>
              <div style="font-size:5px;color:#334155;line-height:1.6">☎ +1 555<br>✉ alex@mail<br>📍 New York</div>
              <div style="font-size:6px;font-weight:700;letter-spacing:0.08em;color:#1e3a5f;text-transform:uppercase;margin-top:6px">SKILLS</div>
              <div style="height:1px;background:#1e3a5f;margin:2px 0 3px"></div>
              <div style="font-size:5px;color:#334155;line-height:1.5">• Strategy<br>• Analytics<br>• Branding</div>
            </div>
            <div>
              <div style="display:grid;grid-template-columns:14px 1fr;gap:5px;margin-bottom:5px">
                <div style="display:flex;flex-direction:column;align-items:center">
                  <div style="width:12px;height:12px;border-radius:50%;background:#1e293b;color:#fff;font-size:6px;display:flex;align-items:center;justify-content:center">👤</div>
                  <div style="width:1.5px;flex:1;background:#cbd5e1;min-height:8px;margin-top:2px"></div>
                </div>
                <div>
                  <div style="font-size:6px;font-weight:700;letter-spacing:0.06em;color:#1e3a5f;text-transform:uppercase">PROFILE</div>
                  <div style="height:1px;background:#1e3a5f;margin:2px 0 3px"></div>
                  <div style="height:2.5px;background:#e2e8f0;border-radius:1px"></div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:14px 1fr;gap:5px;margin-bottom:5px">
                <div style="display:flex;flex-direction:column;align-items:center">
                  <div style="width:12px;height:12px;border-radius:50%;background:#1e293b;color:#fff;font-size:6px;display:flex;align-items:center;justify-content:center">💼</div>
                  <div style="width:1.5px;flex:1;background:#cbd5e1;min-height:8px;margin-top:2px"></div>
                </div>
                <div>
                  <div style="font-size:6px;font-weight:700;letter-spacing:0.06em;color:#1e3a5f;text-transform:uppercase">WORK EXPERIENCE</div>
                  <div style="height:1px;background:#1e3a5f;margin:2px 0 3px"></div>
                  <div style="font-size:5.5px;font-weight:700">Brand Co</div>
                  <div style="height:2px;background:#e2e8f0;border-radius:1px;margin-top:2px"></div>
                </div>
              </div>
              <div style="display:grid;grid-template-columns:14px 1fr;gap:5px">
                <div><div style="width:12px;height:12px;border-radius:50%;background:#1e293b;color:#fff;font-size:6px;display:flex;align-items:center;justify-content:center">🎓</div></div>
                <div>
                  <div style="font-size:6px;font-weight:700;letter-spacing:0.06em;color:#1e3a5f;text-transform:uppercase">EDUCATION</div>
                  <div style="height:1px;background:#1e3a5f;margin:2px 0 3px"></div>
                  <div style="font-size:5.5px">B.A. Marketing</div>
                </div>
              </div>
            </div>
          </div>
        </div>`
    };
    return previews[id] || previews.modern;
  }
};

document.addEventListener('DOMContentLoaded', () => TemplatesPage.init());
window.TemplatesPage = TemplatesPage;
