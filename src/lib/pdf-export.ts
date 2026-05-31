export async function exportToPdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default;
  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait" as const,
    },
  };
  return html2pdf().set(options as any).from(element).save();
}
