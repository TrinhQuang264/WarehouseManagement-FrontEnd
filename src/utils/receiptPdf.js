import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function cloneReceiptElement(element) {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'fixed';
  wrapper.style.left = '-100000px';
  wrapper.style.top = '0';
  wrapper.style.width = `${element.offsetWidth}px`;
  wrapper.style.padding = '24px';
  wrapper.style.background = '#f5f5f5';
  wrapper.style.zIndex = '-1';

  const clone = element.cloneNode(true);
  clone.querySelectorAll('.imports-paper-stamp, .imports-paper-badge').forEach((node) => {
    node.remove();
  });
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  return {
    wrapper,
    clone,
    cleanup: () => {
      wrapper.remove();
    },
  };
}

function buildReceiptPdf(canvas, filename) {
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 8;
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  const imageWidth = canvas.width;
  const imageHeight = canvas.height;
  const fitScale = Math.min(printableWidth / imageWidth, printableHeight / imageHeight);
  const renderWidth = imageWidth * fitScale;
  const renderHeight = imageHeight * fitScale;
  const x = (pageWidth - renderWidth) / 2;
  const y = margin;

  pdf.addImage(canvas.toDataURL('image/png'), 'PNG', x, y, renderWidth, renderHeight, filename, 'FAST');

  return pdf;
}

function openReceiptPrintWindow(canvas, title) {
  const printWindow = window.open('', '_blank', 'width=1100,height=900');

  if (!printWindow) {
    throw new Error('Print window could not be opened.');
  }

  const imageData = canvas.toDataURL('image/png');

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html lang="vi">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 8mm;
          }
          html, body {
            margin: 0;
            padding: 0;
            background: #ffffff;
          }
          body {
            display: flex;
            justify-content: center;
          }
          .print-sheet {
            width: 100%;
            max-width: 210mm;
          }
          .print-sheet img {
            display: block;
            width: 100%;
            height: auto;
          }
        </style>
      </head>
      <body>
        <div class="print-sheet">
          <img src="${imageData}" alt="${title}" />
        </div>
        <script>
          window.addEventListener('load', function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 150);
          });
          window.addEventListener('afterprint', function () {
            window.close();
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
}

export async function openReceiptPdf({ element, filename, mode = 'view' }) {
  if (!element) {
    throw new Error('Receipt element not found.');
  }

  const { clone, cleanup } = cloneReceiptElement(element);

  try {
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });
    if (mode === 'print') {
      openReceiptPrintWindow(canvas, `${filename}.pdf`);
    } else {
      const pdf = buildReceiptPdf(canvas, filename);
      const blob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      const openedWindow = window.open(blobUrl, '_blank');

      if (!openedWindow) {
        pdf.save(`${filename}.pdf`);
        URL.revokeObjectURL(blobUrl);
        return;
      }

      openedWindow.focus();

      window.setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    }
  } finally {
    cleanup();
  }
}
