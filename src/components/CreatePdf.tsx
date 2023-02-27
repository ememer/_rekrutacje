import React, { useRef } from 'react';

import jsPDF from 'jspdf';

interface Props {
  children: React.ReactNode;
}

const CreatePdf = ({ children }: Props) => {
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'px',
      putOnlyUsedFonts: true,
      floatPrecision: 'smart',
    });

    // Adding the fonts.
    doc.setFont('Inter-Regular', 'normal');

    doc.html(reportTemplateRef.current as HTMLElement, {
      async callback(doc) {
        await doc.save('Zapis_podróży');
      },
    });
  };

  return (
    <div className="container">
      <button className="button" onClick={handleGeneratePdf}>
        Generate PDF
      </button>
      <div className="mx-auto block" ref={reportTemplateRef}>
        {children}
      </div>
    </div>
  );
};

export default CreatePdf;
