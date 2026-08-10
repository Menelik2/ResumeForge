/* ============================================
   Yeni Pro CV — PDF generation
   Client: html2canvas + jsPDF (real .pdf file)
   Fallback: browser print dialog
   ============================================ */

const PDF = {
  _libsPromise: null,

  loadLibs() {
    if (this._libsPromise) return this._libsPromise;
    this._libsPromise = new Promise((resolve, reject) => {
      if (window.html2canvas && (window.jspdf || window.jsPDF)) {
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
        .then(() => resolve())
        .catch(reject);
    });
    return this._libsPromise;
  },

  getJsPDF() {
    if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;
    return null;
  },

  fileName() {
    const name =
      (typeof Builder !== 'undefined' &&
        Builder.resume &&
        ((Builder.resume.personal && Builder.resume.personal.fullName) || Builder.resume.title)) ||
      'Resume';
    return (
      String(name)
        .replace(/[^\w\s\-]+/g, '')
        .trim()
        .replace(/\s+/g, '-') || 'Resume'
    ) + '.pdf';
  },

  async download() {
    const paper = document.getElementById('resume-paper');
    if (!paper || !paper.innerHTML.trim()) {
      Utils.toast('Resume preview is empty — add content first', 'error');
      return;
    }

    if (typeof Builder !== 'undefined' && Builder.resume && typeof Preview !== 'undefined') {
      try { Preview.render(Builder.resume, paper); } catch (e) { console.warn(e); }
    }

    Utils.toast('Generating PDF…', 'info');

    try {
      await this.loadLibs();
      const JsPDF = this.getJsPDF();
      if (!window.html2canvas || !JsPDF) throw new Error('PDF libraries unavailable');

      const prevTransform = paper.style.transform;
      const prevOrigin = paper.style.transformOrigin;
      const prevMargin = paper.style.marginBottom;
      const prevBg = paper.style.background;
      paper.style.transform = 'none';
      paper.style.transformOrigin = 'top left';
      paper.style.marginBottom = '0';
      paper.style.background = '#ffffff';

      const canvas = await window.html2canvas(paper, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: paper.scrollWidth,
        windowHeight: paper.scrollHeight
      });

      paper.style.transform = prevTransform;
      paper.style.transformOrigin = prevOrigin;
      paper.style.marginBottom = prevMargin;
      paper.style.background = prevBg;

      const pdf = new JsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 0;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 1) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(this.fileName());
      Utils.toast('PDF downloaded', 'success');
    } catch (err) {
      console.error(err);
      Utils.toast('PDF engine failed — opening print dialog', 'warning');
      this.printFallback();
    }
  },

  print() {
    this.printFallback();
  },

  printFallback() {
    const paper = document.getElementById('resume-paper');
    if (!paper || !paper.innerHTML.trim()) {
      Utils.toast('Resume preview is empty', 'error');
      return;
    }
    document.body.classList.add('pdf-mode');
    const cleanup = () => {
      document.body.classList.remove('pdf-mode');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 2500);
    window.print();
  }
};

window.PDF = PDF;
