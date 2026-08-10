/* ============================================
   ResumeForge — Main Builder Logic
   ============================================ */

const Builder = {
  resume: null,
  saveTimer: null,

  init() {
    Utils.initTheme();
    const params = new URLSearchParams(window.location.search);
    let id = params.get('id') || Storage.getCurrentId();

    if (id) {
      this.resume = Storage.getResume(id);
    }
    if (!this.resume) {
      // First-time / empty resume → load sample so users immediately see how it works
      this.resume = Storage.getSampleResume();
      Storage.saveResume(this.resume);
      setTimeout(() => Utils.toast('Sample resume loaded — edit anything to make it yours!', 'info', 4000), 600);
    } else if (!this.resume.personal?.fullName && !this.resume.experience?.length) {
      // Empty existing resume → also load sample for better first experience
      const sample = Storage.getSampleResume();
      sample.id = this.resume.id;
      sample.title = this.resume.title || 'Software Developer Resume';
      this.resume = sample;
      Storage.saveResume(this.resume);
      setTimeout(() => Utils.toast('Sample resume loaded — edit anything to make it yours!', 'info', 4000), 600);
    }

    this.bindUI();
    this.populateForm();
    this.renderPreview();
    this.updateScore();
    Utils.initAccordions();
    this.initMobileNav();
    this.initKeyboard();

    document.querySelectorAll('.editor-section').forEach((s, i) => {
      if (i < 2) s.classList.add('open');
    });
  },

  bindUI() {
    const titleInput = document.getElementById('resume-title');
    if (titleInput) {
      titleInput.value = this.resume.title || '';
      titleInput.addEventListener('input', Utils.debounce(e => {
        this.resume.title = e.target.value;
        this.scheduleSave();
      }, 400));
    }

    const personalMap = {
      'full-name': 'fullName', 'job-title': 'title', 'email': 'email', 'phone': 'phone',
      'location': 'location', 'website': 'website', 'linkedin': 'linkedin', 'github': 'github', 'summary': 'summary'
    };
    Object.entries(personalMap).forEach(([domId, key]) => {
      const el = document.getElementById(domId);
      if (!el) return;
      el.addEventListener('input', Utils.debounce(() => {
        this.resume.personal[key] = el.value;
        this.renderPreview();
        this.updateScore();
        this.scheduleSave();
        if (domId === 'summary') {
          const counter = document.getElementById('summary-count');
          if (counter) counter.textContent = el.value.length;
        }
      }, 200));
    });

    const photoInput = document.getElementById('photo-input');
    if (photoInput) {
      photoInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) { Utils.toast('Image too large (max 2MB)', 'warning'); return; }
        const dataUrl = await Utils.readFile(file, true);
        this.resume.personal.photo = dataUrl;
        this.updatePhotoUI();
        this.renderPreview();
        this.scheduleSave();
        Utils.toast('Photo uploaded', 'success');
      });
    }
    document.getElementById('remove-photo')?.addEventListener('click', () => {
      this.resume.personal.photo = null;
      this.updatePhotoUI();
      this.renderPreview();
      this.scheduleSave();
    });
    document.querySelectorAll('[data-photo-shape]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resume.personal.photoShape = btn.dataset.photoShape;
        document.querySelectorAll('[data-photo-shape]').forEach(b => b.classList.toggle('active', b === btn));
        this.updatePhotoUI();
        this.renderPreview();
        this.scheduleSave();
      });
    });

    document.getElementById('add-experience')?.addEventListener('click', () => this.addEntry('experience'));
    document.getElementById('add-education')?.addEventListener('click', () => this.addEntry('education'));
    document.getElementById('add-skill')?.addEventListener('click', () => this.addEntry('skills'));
    document.getElementById('add-project')?.addEventListener('click', () => this.addEntry('projects'));
    document.getElementById('add-certification')?.addEventListener('click', () => this.addEntry('certifications'));
    document.getElementById('add-language')?.addEventListener('click', () => this.addEntry('languages'));

    document.querySelectorAll('[data-skills-display]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resume.customization.skillsDisplay = btn.dataset.skillsDisplay;
        document.querySelectorAll('[data-skills-display]').forEach(b => b.classList.toggle('active', b === btn));
        this.renderPreview();
        this.scheduleSave();
      });
    });

    document.querySelectorAll('[data-accent]').forEach(swatch => {
      swatch.addEventListener('click', () => {
        this.resume.customization.accentColor = swatch.dataset.accent;
        document.querySelectorAll('[data-accent]').forEach(s => s.classList.toggle('active', s === swatch));
        this.renderPreview();
        this.scheduleSave();
      });
    });
    document.querySelectorAll('[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resume.customization.font = btn.dataset.font;
        document.querySelectorAll('[data-font]').forEach(b => b.classList.toggle('active', b === btn));
        this.renderPreview();
        this.scheduleSave();
      });
    });
    document.querySelectorAll('[data-fontsize]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resume.customization.fontSize = btn.dataset.fontsize;
        document.querySelectorAll('[data-fontsize]').forEach(b => b.classList.toggle('active', b === btn));
        this.renderPreview();
        this.scheduleSave();
      });
    });
    document.querySelectorAll('[data-spacing]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resume.customization.spacing = btn.dataset.spacing;
        document.querySelectorAll('[data-spacing]').forEach(b => b.classList.toggle('active', b === btn));
        this.renderPreview();
        this.scheduleSave();
      });
    });

    document.getElementById('change-template')?.addEventListener('click', () => {
      window.location.href = 'templates.html?from=builder&id=' + this.resume.id;
    });

    document.getElementById('btn-save')?.addEventListener('click', () => this.save(true));
    document.getElementById('btn-download-pdf')?.addEventListener('click', () => PDF.download());
    document.getElementById('btn-print')?.addEventListener('click', () => PDF.print());
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      Storage.exportJSON(this.resume);
      Utils.toast('Resume exported as JSON', 'success');
    });
    document.getElementById('btn-import-json')?.addEventListener('click', () => document.getElementById('import-file')?.click());
    document.getElementById('import-file')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = await Storage.importJSON(file);
        this.resume = data;
        this.populateForm();
        this.renderPreview();
        this.updateScore();
        Utils.toast('Resume imported successfully', 'success');
      } catch { Utils.toast('Invalid JSON file', 'error'); }
      e.target.value = '';
    });
    document.getElementById('btn-load-sample')?.addEventListener('click', () => {
      if (confirm('Replace current content with sample data?')) {
        const sample = Storage.getSampleResume();
        sample.id = this.resume.id;
        sample.title = this.resume.title;
        this.resume = sample;
        Storage.saveResume(this.resume);
        this.populateForm();
        this.renderPreview();
        this.updateScore();
        Utils.toast('Sample data loaded', 'success');
      }
    });
    document.getElementById('btn-clear')?.addEventListener('click', () => {
      if (confirm('Clear all resume data? This cannot be undone.')) {
        const id = this.resume.id;
        const title = this.resume.title;
        this.resume = Storage.createEmptyResume(title);
        this.resume.id = id;
        Storage.saveResume(this.resume);
        this.populateForm();
        this.renderPreview();
        this.updateScore();
        Utils.toast('Resume cleared', 'info');
      }
    });

    document.getElementById('theme-toggle')?.addEventListener('click', () => Utils.toggleTheme());

    document.querySelectorAll('[data-toggle-section]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.resume.enabledSections[cb.dataset.toggleSection] = cb.checked;
        this.renderPreview();
        this.scheduleSave();
      });
    });
  },

  populateForm() {
    const p = this.resume.personal;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('full-name', p.fullName); set('job-title', p.title); set('email', p.email); set('phone', p.phone);
    set('location', p.location); set('website', p.website); set('linkedin', p.linkedin); set('github', p.github); set('summary', p.summary);
    const counter = document.getElementById('summary-count');
    if (counter) counter.textContent = (p.summary || '').length;
    this.updatePhotoUI();
    const c = this.resume.customization;
    document.querySelectorAll('[data-accent]').forEach(s => s.classList.toggle('active', s.dataset.accent === c.accentColor));
    document.querySelectorAll('[data-font]').forEach(b => b.classList.toggle('active', b.dataset.font === c.font));
    document.querySelectorAll('[data-fontsize]').forEach(b => b.classList.toggle('active', b.dataset.fontsize === c.fontSize));
    document.querySelectorAll('[data-spacing]').forEach(b => b.classList.toggle('active', b.dataset.spacing === c.spacing));
    document.querySelectorAll('[data-skills-display]').forEach(b => b.classList.toggle('active', b.dataset.skillsDisplay === c.skillsDisplay));
    document.querySelectorAll('[data-photo-shape]').forEach(b => b.classList.toggle('active', b.dataset.photoShape === p.photoShape));
    this.renderEntryList('experience');
    this.renderEntryList('education');
    this.renderEntryList('skills');
    this.renderEntryList('projects');
    this.renderEntryList('certifications');
    this.renderEntryList('languages');
    Object.entries(this.resume.enabledSections || {}).forEach(([key, val]) => {
      const cb = document.querySelector(`[data-toggle-section="${key}"]`);
      if (cb) cb.checked = val;
    });
  },

  updatePhotoUI() {
    const preview = document.getElementById('photo-preview');
    const placeholder = document.getElementById('photo-placeholder');
    const removeBtn = document.getElementById('remove-photo');
    if (this.resume.personal.photo) {
      if (preview) { preview.src = this.resume.personal.photo; preview.classList.toggle('square', this.resume.personal.photoShape === 'square'); preview.classList.remove('hidden'); }
      if (placeholder) placeholder.classList.add('hidden');
      if (removeBtn) removeBtn.classList.remove('hidden');
    } else {
      if (preview) preview.classList.add('hidden');
      if (placeholder) placeholder.classList.remove('hidden');
      if (removeBtn) removeBtn.classList.add('hidden');
    }
  },

  renderEntryList(type) {
    const container = document.getElementById(`${type}-list`);
    if (!container) return;
    const items = this.resume[type] || [];
    container.innerHTML = '';
    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'entry-card';
      card.dataset.id = item.id;
      card.draggable = true;
      if (type === 'experience') card.innerHTML = this.experienceCardHTML(item);
      else if (type === 'education') card.innerHTML = this.educationCardHTML(item);
      else if (type === 'skills') card.innerHTML = this.skillCardHTML(item);
      else if (type === 'projects') card.innerHTML = this.projectCardHTML(item);
      else if (type === 'certifications') card.innerHTML = this.certCardHTML(item);
      else if (type === 'languages') card.innerHTML = this.langCardHTML(item);
      container.appendChild(card);
    });
    container.querySelectorAll('[data-field]').forEach(input => {
      input.addEventListener('input', Utils.debounce(() => {
        const id = input.closest('.entry-card').dataset.id;
        const field = input.dataset.field;
        const item = this.resume[type].find(i => i.id === id);
        if (!item) return;
        if (input.type === 'checkbox') item[field] = input.checked;
        else item[field] = input.value;
        this.renderPreview();
        this.updateScore();
        this.scheduleSave();
      }, 200));
    });
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.closest('.entry-card').dataset.id;
        const action = btn.dataset.action;
        if (action === 'delete') {
          this.resume[type] = this.resume[type].filter(i => i.id !== id);
          this.renderEntryList(type);
          this.renderPreview();
          this.updateScore();
          this.scheduleSave();
        } else if (action === 'up' || action === 'down') {
          const arr = this.resume[type];
          const idx = arr.findIndex(i => i.id === id);
          if (action === 'up' && idx > 0) [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
          else if (action === 'down' && idx < arr.length - 1) [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
          this.renderEntryList(type);
          this.renderPreview();
          this.scheduleSave();
        }
      });
    });
    Utils.enableDragSort(container, '.entry-card', (ids) => {
      this.resume[type] = ids.map(id => this.resume[type].find(i => i.id === id)).filter(Boolean);
      this.renderPreview();
      this.scheduleSave();
    });
  },

  experienceCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;"><div class="entry-title">${Utils.escapeHtml(item.jobTitle) || 'New Position'}</div><div class="entry-subtitle">${Utils.escapeHtml(item.company) || ''}</div></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="up">↑</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="down">↓</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>
      <div class="form-row"><div class="form-group"><label>Job Title</label><input data-field="jobTitle" value="${Utils.escapeHtml(item.jobTitle || '')}" /></div><div class="form-group"><label>Company</label><input data-field="company" value="${Utils.escapeHtml(item.company || '')}" /></div></div>
      <div class="form-row"><div class="form-group"><label>Location</label><input data-field="location" value="${Utils.escapeHtml(item.location || '')}" /></div><div class="form-group"><label>Start Date</label><input type="month" data-field="startDate" value="${item.startDate || ''}" /></div></div>
      <div class="form-row"><div class="form-group"><label>End Date</label><input type="month" data-field="endDate" value="${item.endDate || ''}" ${item.current ? 'disabled' : ''} /></div><div class="form-group" style="display:flex;align-items:flex-end;padding-bottom:0.5rem;"><label class="checkbox-label"><input type="checkbox" data-field="current" ${item.current ? 'checked' : ''} /> Current Job</label></div></div>
      <div class="form-group"><label>Description</label><textarea data-field="description" rows="3">${Utils.escapeHtml(item.description || '')}</textarea></div>`;
  },

  educationCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;"><div class="entry-title">${Utils.escapeHtml(item.degree) || 'New Education'}</div><div class="entry-subtitle">${Utils.escapeHtml(item.institution) || ''}</div></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="up">↑</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="down">↓</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>
      <div class="form-row"><div class="form-group"><label>Degree</label><input data-field="degree" value="${Utils.escapeHtml(item.degree || '')}" /></div><div class="form-group"><label>Institution</label><input data-field="institution" value="${Utils.escapeHtml(item.institution || '')}" /></div></div>
      <div class="form-row"><div class="form-group"><label>Location</label><input data-field="location" value="${Utils.escapeHtml(item.location || '')}" /></div><div class="form-group"><label>Start</label><input type="month" data-field="startDate" value="${item.startDate || ''}" /></div></div>
      <div class="form-group"><label>End</label><input type="month" data-field="endDate" value="${item.endDate || ''}" /></div>
      <div class="form-group"><label>Description</label><textarea data-field="description" rows="2">${Utils.escapeHtml(item.description || '')}</textarea></div>`;
  },

  skillCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;display:flex;gap:0.75rem;align-items:center;"><input data-field="name" value="${Utils.escapeHtml(item.name || '')}" placeholder="Skill name" style="flex:1;" /><select data-field="level" class="skill-level-select">${['Beginner','Intermediate','Advanced','Expert'].map(l => `<option value="${l}" ${item.level===l?'selected':''}>${l}</option>`).join('')}</select></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>`;
  },

  projectCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;"><div class="entry-title">${Utils.escapeHtml(item.name) || 'New Project'}</div></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="up">↑</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="down">↓</button><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>
      <div class="form-group"><label>Project Name</label><input data-field="name" value="${Utils.escapeHtml(item.name || '')}" /></div>
      <div class="form-group"><label>Description</label><textarea data-field="description" rows="2">${Utils.escapeHtml(item.description || '')}</textarea></div>
      <div class="form-group"><label>Technologies</label><input data-field="technologies" value="${Utils.escapeHtml(item.technologies || '')}" placeholder="HTML, CSS, JavaScript" /></div>
      <div class="form-row"><div class="form-group"><label>Project URL</label><input data-field="url" value="${Utils.escapeHtml(item.url || '')}" /></div><div class="form-group"><label>GitHub URL</label><input data-field="github" value="${Utils.escapeHtml(item.github || '')}" /></div></div>`;
  },

  certCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;"><div class="entry-title">${Utils.escapeHtml(item.name) || 'New Certificate'}</div></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>
      <div class="form-row"><div class="form-group"><label>Certificate Name</label><input data-field="name" value="${Utils.escapeHtml(item.name || '')}" /></div><div class="form-group"><label>Organization</label><input data-field="organization" value="${Utils.escapeHtml(item.organization || '')}" /></div></div>
      <div class="form-row"><div class="form-group"><label>Issue Date</label><input type="month" data-field="issueDate" value="${item.issueDate || ''}" /></div><div class="form-group"><label>Credential ID</label><input data-field="credentialId" value="${Utils.escapeHtml(item.credentialId || '')}" /></div></div>
      <div class="form-group"><label>Credential URL</label><input data-field="url" value="${Utils.escapeHtml(item.url || '')}" /></div>`;
  },

  langCardHTML(item) {
    return `<div class="entry-header"><div class="drag-handle">⠿</div><div style="flex:1;display:flex;gap:0.75rem;"><input data-field="name" value="${Utils.escapeHtml(item.name || '')}" placeholder="Language" style="flex:1;" /><select data-field="level">${['Native','Fluent','Advanced','Intermediate','Basic'].map(l => `<option value="${l}" ${item.level===l?'selected':''}>${l}</option>`).join('')}</select></div><div class="entry-actions"><button type="button" class="btn btn-ghost btn-icon btn-sm" data-action="delete">✕</button></div></div>`;
  },

  addEntry(type) {
    const defaults = {
      experience: { id: Utils.uid(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' },
      education: { id: Utils.uid(), degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' },
      skills: { id: Utils.uid(), name: '', level: 'Intermediate' },
      projects: { id: Utils.uid(), name: '', description: '', technologies: '', url: '', github: '' },
      certifications: { id: Utils.uid(), name: '', organization: '', issueDate: '', credentialId: '', url: '' },
      languages: { id: Utils.uid(), name: '', level: 'Intermediate' }
    };
    this.resume[type].push(defaults[type]);
    this.renderEntryList(type);
    this.renderPreview();
    this.updateScore();
    this.scheduleSave();
    document.querySelector(`#section-${type}`)?.classList.add('open');
  },

  renderPreview() {
    const paper = document.getElementById('resume-paper');
    if (paper) Preview.render(this.resume, paper);
  },

  updateScore() {
    const p = this.resume.personal;
    const checks = [
      { ok: !!p.fullName, label: 'Name added' },
      { ok: !!p.title, label: 'Professional title added' },
      { ok: !!p.email, label: 'Email added' },
      { ok: !!p.phone, label: 'Phone added' },
      { ok: !!p.summary, label: 'Summary added' },
      { ok: this.resume.experience.length > 0, label: 'Experience added' },
      { ok: this.resume.education.length > 0, label: 'Education added' },
      { ok: this.resume.skills.length > 0, label: 'Skills added' },
      { ok: this.resume.projects.length > 0, label: 'Projects added' }
    ];
    const score = Math.round((checks.filter(c => c.ok).length / checks.length) * 100);
    const el = document.getElementById('score-value');
    if (el) el.textContent = score + '/100';
    const list = document.getElementById('score-list');
    if (list) list.innerHTML = checks.map(c => `<li class="${c.ok ? 'pass' : 'warn'}">${c.ok ? '✓' : '⚠'} ${c.label}</li>`).join('');
  },

  scheduleSave() {
    const indicator = document.getElementById('auto-save');
    if (indicator) { indicator.textContent = 'Saving…'; indicator.className = 'auto-save-indicator saving'; }
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.save(false), 600);
  },

  save(showToast = false) {
    Storage.saveResume(this.resume);
    const indicator = document.getElementById('auto-save');
    if (indicator) { indicator.textContent = 'Saved'; indicator.className = 'auto-save-indicator saved'; }
    if (showToast) Utils.toast('Resume saved successfully', 'success');
  },

  initMobileNav() {
    const buttons = document.querySelectorAll('.mobile-nav-btn');
    const editor = document.querySelector('.editor-panel');
    const preview = document.querySelector('.preview-panel');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const view = btn.dataset.view;
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (view === 'edit') { editor?.classList.add('mobile-active'); preview?.classList.remove('mobile-active'); }
        else if (view === 'preview') { preview?.classList.add('mobile-active'); editor?.classList.remove('mobile-active'); }
        else if (view === 'templates') window.location.href = 'templates.html?from=builder&id=' + this.resume.id;
        else if (view === 'settings') {
          editor?.classList.add('mobile-active');
          preview?.classList.remove('mobile-active');
          document.getElementById('section-customization')?.classList.add('open');
          document.getElementById('section-customization')?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    if (window.innerWidth <= 900) {
      editor?.classList.add('mobile-active');
      document.querySelector('.mobile-nav-btn[data-view="edit"]')?.classList.add('active');
    }
  },

  initKeyboard() {
    Utils.onKey('ctrl+s', () => this.save(true));
    Utils.onKey('ctrl+p', () => PDF.print());
  }
};

document.addEventListener('DOMContentLoaded', () => Builder.init());
window.Builder = Builder;
