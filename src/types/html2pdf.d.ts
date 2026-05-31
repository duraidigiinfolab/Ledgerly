declare module "html2pdf.js" {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: {
      scale?: number;
      useCORS?: boolean;
      letterRendering?: boolean;
    };
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: string;
    };
  }

  interface Html2PdfInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(options: any): Html2PdfInstance;
    from(element: HTMLElement): Html2PdfInstance;
    save(): Promise<void>;
    toPdf(): Html2PdfInstance;
    output(type: string): Promise<unknown>;
  }

  function html2pdf(): Html2PdfInstance;

  export default html2pdf;
}
