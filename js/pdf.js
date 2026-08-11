/* ============================================
   Yeni Pro CV — PDF generation
   Download PDF  → real .pdf file (html2canvas + jsPDF)
   Print         → browser print dialog only
   ============================================ */

const PDF = {
  _libsPromise: null,

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

  buildCaptureNode(sourcePaper) {
    const host = document.createElement('div');
    host.id = 'pdf-capture-host';
    host.setAttribute('aria-hidden', 'true');
    Object.assign(host.style, {
      position: 'fixed',
      left: '-10000px',
      top: '0',
      width: '210mm',
      minHeight: '297mm',
      background: '#ffffff',
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
      width: '210mm',
      minHeight: '297mm',
      margin: '0',
      padding: '0',
      transform: 'none',
      transformOrigin: 'top left',
      boxShadow: 'none',
      background: '#ffffff',
      position: 'relative',
      left: 'auto',
      top: 'auto'
    });

    host.appendChild(clone);
    document.body.appendChild(host);
    return { host, clone };
  },

  async download() {
    const paper = document.getElementById('resume-paper');
    if (!paper) {
      Utils.toast('Resume preview not found', 'error');
      return;
    }

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

    Utils.toast('Generating PDF file…', 'info');

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

      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

      const canvas = await window.html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: clone.scrollWidth,
        height: Math.max(clone.scrollHeight, clone.offsetHeight),
        windowWidth: clone.scrollWidth,
        windowHeight: Math.max(clone.scrollHeight, clone.offsetHeight)
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
      const imgData = canvas.toDataURL('image/jpeg', 0.93);

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 2) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(this.fileName());
      Utils.toast('PDF downloaded', 'success');
    } catch (err) {
      console.error('PDF download error:', err);
      if (host && host.parentNode) {
        try {
          host.parentNode.removeChild(host);
        } catch (_) {}
      }
      Utils.toast(
        'Could not generate PDF file. Check internet (CDN) and try again.',
        'error'
      );
    }
  },

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

if (typeof document !== 'undefined') {
  if (document.readyState === 'complete') {
    setTimeout(() => PDF.loadLibs().catch(() => {}), 1500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => PDF.loadLibs().catch(() => {}), 1500);
    });
  }
}
