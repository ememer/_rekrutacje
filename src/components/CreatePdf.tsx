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
      precision: 20,
      hotfixes: ['px_scaling'],
      compress: true,
    });

    // Adding the fonts.
    doc.setFont('Times', 'Roman');

    doc.html(reportTemplateRef.current as HTMLElement, {
      async callback(doc) {
        await doc.save('Zapis_podróży');
      },
    });
  };

  return (
    <div className="container">
      <button
        className="button block mx-auto p-2 my-4 rounded-md bg-indigo-600 text-white"
        onClick={handleGeneratePdf}
      >
        Wygeneruj PDF
      </button>
      <div className="mx-auto block" ref={reportTemplateRef}>
        {children}
      </div>
    </div>
  );
};

export default CreatePdf;
