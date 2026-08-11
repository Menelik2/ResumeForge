/* ============================================
   Yeni Pro CV — Utility Functions
   ============================================ */

const Utils = {
  uid() {
    return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  },

  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    if (dateStr.toLowerCase() === 'present' || dateStr === 'Current') return 'Present';
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  },

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  toast(message, type = 'info', duration = 3000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<span>${Utils.escapeHtml(message)}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('hiding');
      setTimeout(() => toast.remove(), 250);
    }, duration);
  },

  clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  downloadFile(content, filename, type = 'application/json') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  readFile(file, asDataURL = false) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      if (asDataURL) reader.readAsDataURL(file);
      else reader.readAsText(file);
    });
  },

  initTheme() {
    const saved = localStorage.getItem('rf_theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    return saved;
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rf_theme', next);
    return next;
  },

  enableDragSort(container, itemSelector, onReorder) {
    // Avoid stacking listeners when lists re-render
    if (container.dataset.dragSortBound === '1') return;
    container.dataset.dragSortBound = '1';

    container.addEventListener('dragstart', (e) => {
      // Don't start drag from form controls (breaks typing on mobile)
      if (e.target.closest('input, textarea, select, button, a, label')) {
        e.preventDefault();
        return;
      }
      const item = e.target.closest(itemSelector);
      if (!item) return;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      try { e.dataTransfer.setData('text/plain', item.dataset.id || ''); } catch (_) {}
    });

    container.addEventListener('dragend', (e) => {
      const item = e.target.closest(itemSelector);
      if (item) item.classList.remove('dragging');
      container.querySelectorAll(itemSelector).forEach(el => el.classList.remove('drag-over'));
    });

    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      const after = Utils.getDragAfterElement(container, e.clientY, itemSelector);
      const dragging = container.querySelector('.dragging');
      if (!dragging) return;
      if (after == null) container.appendChild(dragging);
      else container.insertBefore(dragging, after);
    });

    container.addEventListener('drop', (e) => {
      e.preventDefault();
      if (onReorder) {
        const items = [...container.querySelectorAll(itemSelector)];
        const ids = items.map(el => el.dataset.id).filter(Boolean);
        onReorder(ids);
      }
    });
  },

  getDragAfterElement(container, y, selector) {
    const elements = [...container.querySelectorAll(`${selector}:not(.dragging)`)];
    return elements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  },

  onKey(combo, handler) {
    document.addEventListener('keydown', (e) => {
      const parts = combo.toLowerCase().split('+');
      const key = parts.pop();
      const needCtrl = parts.includes('ctrl') || parts.includes('cmd');
      const needShift = parts.includes('shift');
      const needAlt = parts.includes('alt');
      if (
        e.key.toLowerCase() === key &&
        (!!needCtrl === (e.ctrlKey || e.metaKey)) &&
        (!!needShift === e.shiftKey) &&
        (!!needAlt === e.altKey)
      ) {
        if (['s', 'p', 'o'].includes(key)) e.preventDefault();
        handler(e);
      }
    });
  },

  initAccordions(root = document) {
    root.querySelectorAll('.editor-section-header').forEach(header => {
      header.addEventListener('click', () => {
        const section = header.closest('.editor-section');
        section.classList.toggle('open');
      });
    });
  }
};

window.Utils = Utils;
