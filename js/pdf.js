/* ============================================
   Yeni Pro CV — PDF & Print Helpers
   ============================================ */

const PDF = {
  print() {
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
    setTimeout(cleanup, 2000);
    window.print();
  },

  download() {
    const paper = document.getElementById('resume-paper');
    if (!paper || !paper.innerHTML.trim()) {
      Utils.toast('Resume preview is empty — add some content first', 'error');
      return;
    }

    if (typeof Builder !== 'undefined' && Builder.resume && typeof Preview !== 'undefined') {
      try { Preview.render(Builder.resume, paper); } catch (e) { console.warn(e); }
    }

    const title =
      (typeof Builder !== 'undefined' && Builder.resume && (Builder.resume.personal?.fullName || Builder.resume.title)) ||
      'Resume';
    const safeTitle = String(title).replace(/[^\w\s\-]/g, '').trim() || 'Resume';

    const cs = window.getComputedStyle(paper);
    const fontFamily = cs.fontFamily || 'Inter, system-ui, sans-serif';
    const fontSize = cs.fontSize || '10.5pt';
    const lineHeight = cs.lineHeight || '1.45';
    const accent =
      paper.style.getPropertyValue('--resume-accent') ||
      (typeof Builder !== 'undefined' && Builder.resume?.customization?.accentColor) ||
      '#0d9488';

    const html = paper.innerHTML;
    const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=820,height=1100');

    if (!printWindow) {
      Utils.toast('Pop-up blocked — using print dialog instead', 'warning');
      this.print();
      return;
    }

    const doc = printWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${safeTitle} — PDF</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; background: #fff; color: #0f172a;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: ${fontFamily};
      font-size: ${fontSize};
      line-height: ${lineHeight};
    }
    .resume-paper {
      --resume-accent: ${accent};
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: #fff;
      color: #0f172a;
    }
    img { max-width: 100%; height: auto; }
    a { color: inherit; text-decoration: none; }
    .resume-section { page-break-inside: avoid; }
    h1, h2, h3 { page-break-after: avoid; }
    @media print {
      html, body { width: 210mm; background: #fff; }
      .resume-paper { width: 100%; min-height: auto; box-shadow: none; margin: 0; }
      .no-print { display: none !important; }
    }
    .print-hint {
      font-family: system-ui, sans-serif;
      font-size: 13px;
      color: #64748b;
      text-align: center;
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
    }
    @media print { .print-hint { display: none !important; } }
  </style>
</head>
<body>
  <div class="print-hint no-print">Choose <strong>Save as PDF</strong> as the destination, then Save.</div>
  <div class="resume-paper">${html}</div>
</body>
</html>`);
    doc.close();

    const triggerPrint = () => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (e) {
        console.warn(e);
        Utils.toast('Could not open print dialog', 'error');
      }
    };

    const waitAndPrint = () => {
      const imgs = Array.from(doc.images || []);
      const pending = imgs.filter((img) => !img.complete);
      if (pending.length === 0) {
        setTimeout(triggerPrint, 250);
        return;
      }
      let left = pending.length;
      const done = () => {
        left -= 1;
        if (left <= 0) setTimeout(triggerPrint, 250);
      };
      pending.forEach((img) => {
        img.addEventListener('load', done);
        img.addEventListener('error', done);
      });
      setTimeout(triggerPrint, 2000);
    };

    if (doc.readyState === 'complete') waitAndPrint();
    else {
      printWindow.addEventListener('load', waitAndPrint);
      setTimeout(waitAndPrint, 800);
    }

    Utils.toast('PDF dialog opened — choose “Save as PDF”', 'success');
  }
};

window.PDF = PDF;
