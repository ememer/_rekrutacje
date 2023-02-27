import React, { useRef, useState } from 'react';

import jsPDF from 'jspdf';

interface Props {
  children: React.ReactNode;
}

const CreatePdf = ({ children }: Props) => {
  const [shouldGenerate, setShouldGenerate] = useState(false);
  const reportTemplateRef = useRef<HTMLDivElement>(null);

  const handleGeneratePdf = () => {
    setShouldGenerate(true);
    const doc = new jsPDF({
      orientation: 'p',
      format: 'a4',
      unit: 'px',
      putOnlyUsedFonts: false,
      floatPrecision: 'smart',
      precision: 2,
      hotfixes: ['px_scaling'],
      compress: true,
    });

    // Adding the fonts.
    doc.setLanguage('pl');
    doc.setFont('Times', 'Roman');

    doc.html(reportTemplateRef.current as HTMLElement, {
      async callback(doc) {
        await doc.save('Zapis_podróży');
      },
    });
    setTimeout(() => {
      setShouldGenerate(false);
    }, 1000);
  };

  return (
    <div
      className={
        shouldGenerate ? 'transition transform delay-200 container md:w-2/4' : 'container'
      }
    >
      <button
        className="button block mx-auto p-2 my-4 rounded-md bg-indigo-600 text-white"
        onClick={handleGeneratePdf}
      >
        Wygeneruj PDF
      </button>
      <div className="mx-auto" ref={reportTemplateRef}>
        {children}
      </div>
    </div>
  );
};

export default CreatePdf;
