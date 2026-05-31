export async function exportToPdf(element: HTMLElement, filename: string) {
  const html2pdfModule = await import("html2pdf.js");
  // Handle both ES module default export and CommonJS module patterns
  const html2pdf = html2pdfModule.default ? (typeof html2pdfModule.default === 'function' ? html2pdfModule.default : html2pdfModule.default.default) : html2pdfModule;
  
  if (typeof html2pdf !== 'function') {
    throw new Error("html2pdf failed to load properly. Type is: " + typeof html2pdf);
  }

  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.75 },
    html2canvas: {
      scale: 1.5,
      useCORS: true,
      allowTaint: true, // Allow tainted images (like Google profile pics)
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait" as const,
    },
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return html2pdf().set(options as any).from(element).save();
}
