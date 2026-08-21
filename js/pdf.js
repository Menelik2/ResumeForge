/* ============================================
   Yeni Pro CV — PDF export
   Download PDF → real .pdf file (html2canvas + jsPDF)
   Print        → browser print dialog only
   ============================================ */

const PDF = {
  _libsPromise: null,
  _busy: false,

  loadLibs() {
    if (this._libsPromise) return this._libsPromise;
    this._libsPromise = new Promise((resolve, reject) => {
      if (window.html2canvas && this.getJsPDF()) {
        resolve();
        return;
      }
      const load = (src) =>
        new Promise((res, rej) => {
          const s = document.createElement('script');
          s.src = src;
          s.async = true;
          s.onload = () => res();
          s.onerror = () => rej(new Error('Failed to load ' + src));
          document.head.appendChild(s);
        });

      load('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js')
        .then(() => load('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'))
        .then(() => {
          if (!window.html2canvas || !this.getJsPDF()) {
            reject(new Error('PDF libraries did not initialize'));
            return;
          }
          resolve();
        })
        .catch(reject);
    });
    return this._libsPromise;
  },

  getJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (typeof window.jsPDF === 'function') return window.jsPDF;
    return null;
  },

  fileName() {
    let name = 'Resume';
    try {
      if (typeof Builder !== 'undefined' && Builder.resume) {
        name =
          (Builder.resume.personal && Builder.resume.personal.fullName) ||
          Builder.resume.title ||
          'Resume';
      }
    } catch (_) {}
    return (
      String(name)
        .replace(/[^\w\s\-]+/g, '')
        .trim()
        .replace(/\s+/g, '-') || 'Resume'
    ) + '.pdf';
  },

  /** Dark templates need dark capture background */
  isDarkTemplate() {
    try {
      const t =
        (typeof Builder !== 'undefined' && Builder.resume && Builder.resume.template) ||
        document.getElementById('resume-paper')?.dataset?.template ||
        '';
      return t === 'cinematic';
    } catch (_) {
      return false;
    }
  },

  setBusy(busy) {
    this._busy = busy;
    document.querySelectorAll('#btn-download-pdf, .preview-toolbar [onclick*="PDF.download"]').forEach((btn) => {
      if (!btn) return;
      btn.disabled = !!busy;
      if (busy) {
        btn.dataset._pdfLabel = btn.textContent;
        btn.textContent = 'Generating…';
      } else if (btn.dataset._pdfLabel) {
        btn.textContent = btn.dataset._pdfLabel;
        delete btn.dataset._pdfLabel;
      }
    });
  },

  buildCaptureNode(sourcePaper) {
    const dark = this.isDarkTemplate();
    const bg = dark ? '#0a0a10' : '#ffffff';

    const host = document.createElement('div');
    host.id = 'pdf-capture-host';
    host.setAttribute('aria-hidden', 'true');
    Object.assign(host.style, {
      position: 'fixed',
      left: '-12000px',
      top: '0',
      width: '794px', /* ~210mm at 96dpi */
      minHeight: '1123px',
      background: bg,
      zIndex: '-1',
      overflow: 'visible',
      pointerEvents: 'none',
      margin: '0',
      padding: '0',
      transform: 'none',
      boxShadow: 'none'
    });

    const clone = sourcePaper.cloneNode(true);
    clone.id = 'pdf-capture-paper';
    clone.classList.add('resume-paper');
    Object.assign(clone.style, {
      width: '794px',
      minHeight: '1123px',
      margin: '0',
      padding: '0',
      transform: 'none',
      transformOrigin: 'top left',
      boxShadow: 'none',
      background: bg,
      position: 'relative',
      left: 'auto',
      top: 'auto',
      maxWidth: 'none'
    });

    host.appendChild(clone);
    document.body.appendChild(host);
    return { host, clone, bg };
  },

  /**
   * DOWNLOAD a real PDF file — does not open print dialog
   */
  async download() {
    if (this._busy) return;

    const paper = document.getElementById('resume-paper');
    if (!paper) {
      Utils.toast('Resume preview not found', 'error');
      return;
    }

    // Fresh render before capture
    if (typeof Builder !== 'undefined' && Builder.resume && typeof Preview !== 'undefined') {
      try {
        Preview.render(Builder.resume, paper);
      } catch (e) {
        console.warn(e);
      }
    }

    if (!paper.innerHTML.trim()) {
      Utils.toast('Resume is empty — add content first', 'error');
      return;
    }

    this.setBusy(true);
    Utils.toast('Generating PDF…', 'info');

    let host = null;
    try {
      await this.loadLibs();
      const JsPDF = this.getJsPDF();
      if (!window.html2canvas || !JsPDF) {
        throw new Error('PDF libraries unavailable');
      }

      const built = this.buildCaptureNode(paper);
      host = built.host;
      const clone = built.clone;
      const bg = built.bg;

      // Let layout settle (images, fonts)
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 120));

      const w = Math.max(clone.scrollWidth, clone.offsetWidth, 794);
      const h = Math.max(clone.scrollHeight, clone.offsetHeight, 1123);

      const canvas = await window.html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: bg,
        logging: false,
        width: w,
        height: h,
        windowWidth: w,
        windowHeight: h,
        imageTimeout: 8000,
        onclone: (doc) => {
          const el = doc.getElementById('pdf-capture-paper');
          if (el) {
            el.style.transform = 'none';
            el.style.width = w + 'px';
          }
        }
      });

      if (host && host.parentNode) host.parentNode.removeChild(host);
      host = null;

      if (!canvas || canvas.width < 10 || canvas.height < 10) {
        throw new Error('Canvas capture failed');
      }

      const pdf = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // PNG for dark templates (better colors), JPEG for light (smaller file)
      const dark = this.isDarkTemplate();
      const fmt = dark ? 'PNG' : 'JPEG';
      const imgData = dark
        ? canvas.toDataURL('image/png')
        : canvas.toDataURL('image/jpeg', 0.94);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, fmt, 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 3) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, fmt, 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(this.fileName());
      Utils.toast('PDF downloaded successfully', 'success');
    } catch (err) {
      console.error('PDF download error:', err);
      if (host && host.parentNode) {
        try {
          host.parentNode.removeChild(host);
        } catch (_) {}
      }
      Utils.toast(
        'Could not generate PDF. Check your internet connection and try again.',
        'error'
      );
    } finally {
      this.setBusy(false);
    }
  },

  /**
   * PRINT — browser print / print-preview only
   */
  print() {
    const paper = document.getElementById('resume-paper');
    if (!paper || !paper.innerHTML.trim()) {
      Utils.toast('Resume is empty — add content first', 'error');
      return;
    }

    if (typeof Builder !== 'undefined' && Builder.resume && typeof Preview !== 'undefined') {
      try {
        Preview.render(Builder.resume, paper);
      } catch (e) {
        console.warn(e);
      }
    }

    document.body.classList.add('pdf-mode');
    const cleanup = () => {
      document.body.classList.remove('pdf-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 3000);
    window.print();
  }
};

window.PDF = PDF;

// Preload libraries after page load for faster first download
if (typeof document !== 'undefined') {
  const preload = () => setTimeout(() => PDF.loadLibs().catch(() => {}), 1200);
  if (document.readyState === 'complete') preload();
  else window.addEventListener('load', preload);
}
