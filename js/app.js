/* ============================================
   Yeni Pro CV — Dashboard Logic
   ============================================ */

const App = {
  init() {
    Utils.initTheme();
    this.initSplash();
    this.renderResumeList();
    this.bindEvents();
  },

  initSplash() {
    const splash = document.getElementById('splash');
    if (!splash) return;

    // Always show on every page open
    splash.classList.remove('is-hidden', 'splash-out');
    splash.setAttribute('aria-hidden', 'false');
    document.body.classList.add('splash-active');

    const content = splash.querySelector('.splash-content');
    if (content) {
      content.style.animation = 'none';
      void content.offsetWidth;
      content.style.animation = '';
    }
    const bar = splash.querySelector('.splash-progress-bar');
    if (bar) {
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
    }

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      splash.classList.add('splash-out');
      setTimeout(() => {
        splash.classList.add('is-hidden');
        splash.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('splash-active');
      }, 650);
      window.removeEventListener('keydown', onKey);
    };

    document.getElementById('splash-enter')?.addEventListener('click', dismiss);

    // Auto-enter after 5 seconds
    setTimeout(() => {
      if (!dismissed) dismiss();
    }, 5000);

    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
  },

  bindEvents() {
    document.getElementById('theme-toggle')?.addEventListener('click', () => Utils.toggleTheme());

    document.getElementById('btn-create')?.addEventListener('click', () => {
      const resume = Storage.createEmptyResume();
      Storage.saveResume(resume);
      window.location.href = 'builder.html?id=' + resume.id;
    });

    document.getElementById('btn-create-sample')?.addEventListener('click', () => {
      const resume = Storage.getSampleResume();
      Storage.saveResume(resume);
      window.location.href = 'builder.html?id=' + resume.id;
    });

    document.getElementById('btn-import')?.addEventListener('click', () => {
      document.getElementById('import-input')?.click();
    });

    document.getElementById('import-input')?.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = await Storage.importJSON(file);
        Utils.toast('Resume imported successfully', 'success');
        this.renderResumeList();
      } catch {
        Utils.toast('Invalid JSON file', 'error');
      }
      e.target.value = '';
    });
  },

  renderResumeList() {
    const grid = document.getElementById('resume-list');
    const empty = document.getElementById('empty-state');
    if (!grid) return;

    const resumes = Storage.getAllResumes().sort((a, b) =>
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    if (resumes.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');

    grid.innerHTML = resumes.map(r => {
      const date = new Date(r.updatedAt);
      const today = new Date();
      let dateStr;
      if (date.toDateString() === today.toDateString()) dateStr = 'Today';
      else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) dateStr = 'Yesterday';
        else dateStr = date.toLocaleDateString();
      }
      return `
        <div class="card resume-card" data-id="${r.id}">
          <div class="resume-card-title">${Utils.escapeHtml(r.title || 'Untitled Resume')}</div>
          <div class="resume-card-meta">Last edited: ${dateStr} · Template: ${(r.template || 'modern')}</div>
          <div class="resume-card-actions">
            <button class="btn btn-primary btn-sm" data-action="edit">Edit</button>
            <button class="btn btn-secondary btn-sm" data-action="duplicate">Duplicate</button>
            <button class="btn btn-ghost btn-sm" data-action="export">Export</button>
            <button class="btn btn-danger btn-sm" data-action="delete">Delete</button>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.resume-card').forEach(card => {
      const id = card.dataset.id;
      card.querySelector('[data-action="edit"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        window.location.href = 'builder.html?id=' + id;
      });
      card.querySelector('[data-action="duplicate"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        Storage.duplicateResume(id);
        Utils.toast('Resume duplicated', 'success');
        this.renderResumeList();
      });
      card.querySelector('[data-action="export"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = Storage.getResume(id);
        if (r) {
          Storage.exportJSON(r);
          Utils.toast('Exported as JSON', 'success');
        }
      });
      card.querySelector('[data-action="delete"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this resume permanently?')) {
          Storage.deleteResume(id);
          Utils.toast('Resume deleted', 'info');
          this.renderResumeList();
        }
      });
      card.addEventListener('click', () => {
        window.location.href = 'builder.html?id=' + id;
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
