/* ============================================
   ResumeForge — PDF & Print Helpers
   ============================================ */

const PDF = {
  /**
   * Print the resume using browser print dialog
   * (User can choose "Save as PDF")
   */
  print() {
    // Ensure preview is visible and clean
    const paper = document.getElementById('resume-paper');
    if (!paper) {
      Utils.toast('Resume preview not found', 'error');
      return;
    }
    // Temporarily ensure it's rendered
    window.print();
  },

  /**
   * Download as PDF via print dialog (most reliable pure frontend method)
   * Opens a clean window with only the resume and triggers print.
   */
  download() {
    const paper = document.getElementById('resume-paper');
    if (!paper) {
      Utils.toast('Resume preview not found', 'error');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=800,height=1000');
    if (!printWindow) {
      Utils.toast('Please allow pop-ups to download PDF', 'warning');
      // Fallback to regular print
      this.print();
      return;
    }

    const styles = `
      <style>
        @page { size: A4; margin: 12mm; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          background: #fff;
          color: #0f172a;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .resume-paper {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: #fff;
        }
        @media print {
          body { margin: 0; }
          .resume-paper { box-shadow: none; }
        }
      </style>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume — PDF</title>
        ${styles}
      </head>
      <body>
        <div class="resume-paper">${paper.innerHTML}</div>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // window.close(); // optional – some browsers block
            }, 300);
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
    Utils.toast('PDF dialog opened — choose "Save as PDF"', 'success');
  }
};

window.PDF = PDF;
