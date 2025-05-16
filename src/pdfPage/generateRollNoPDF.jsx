import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const GenerateRollNoPDF = ({
  centerName,
  centerCode,
  date,
  batch,
  time,
  labData,
  onClose,
}) => {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    const url = generatePDF();
    setPdfUrl(url);
  }, []);

  const generatePDF = (isPreview = true) => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const tableWidth = pageWidth - margin * 2;

    
    const centerNameY = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    
    
    doc.rect(margin, centerNameY, tableWidth, 10);
    doc.text(`Center Name : ${centerName}`, 
      margin + tableWidth/2, 
      centerNameY + 6, 
      { align: "center" }
    );

    
    const headerY = centerNameY + 12;
    const headerColWidth = tableWidth / 4;
    
    [0, 1, 2, 3].forEach((i) => {
      doc.rect(margin + headerColWidth * i, headerY, headerColWidth, 10);
    });

    doc.setFontSize(12);
    doc.text(`Center Code : ${centerCode}`, margin + 5, headerY + 7);
    doc.text(`Date : ${date}`, margin + headerColWidth + 5, headerY + 7);
    doc.text(`Batch : ${batch}`, margin + headerColWidth * 2 + 5, headerY + 7);
    doc.text(`Time : ${time}`, margin + headerColWidth * 3 + 5, headerY + 7);


    const tableStartY = headerY + 12;
    const labColWidth = tableWidth * 0.25;
    const rollColWidth = tableWidth * 0.75;

    
    doc.rect(margin, tableStartY, labColWidth, 10);
    doc.rect(margin + labColWidth, tableStartY, rollColWidth, 10);
    
    doc.setFontSize(14);
    doc.text("LAB", margin + labColWidth/2, tableStartY + 7, { align: "center" });
    doc.text("ROLL NO.", margin + labColWidth + rollColWidth/2, tableStartY + 7, { align: "center" });

    const subHeaderY = tableStartY + 10;
    doc.rect(margin + labColWidth, subHeaderY, rollColWidth/2, 10);
    doc.rect(margin + labColWidth + rollColWidth/2, subHeaderY, rollColWidth/2, 10);
    
    doc.setFontSize(12);
    doc.text("Start Roll No.", margin + labColWidth + rollColWidth/4, subHeaderY + 7, { align: "center" });
    doc.text("End Roll No.", margin + labColWidth + rollColWidth*0.75, subHeaderY + 7, { align: "center" });

    let currentY = subHeaderY + 12;
    const rowHeight = 10;

    labData.forEach((data) => {
      doc.rect(margin, currentY, labColWidth, rowHeight);
      doc.text(data.lab, margin + labColWidth/2, currentY + 7, { align: "center" });
      
      doc.rect(margin + labColWidth, currentY, rollColWidth/2, rowHeight);
      doc.text(data.startRollNo, margin + labColWidth + rollColWidth/4, currentY + 7, { align: "center" });
      
      doc.rect(margin + labColWidth + rollColWidth/2, currentY, rollColWidth/2, rowHeight);
      doc.text(data.endRollNo, margin + labColWidth + rollColWidth*0.75, currentY + 7, { align: "center" });

      currentY += rowHeight;
    });

    return isPreview ? doc.output("bloburl") : doc;
  };

  const handleDownload = () => {
    const doc = generatePDF(false);
    doc.save("roll-number-allotment.pdf");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-11/12 h-[80vh] shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 cursor-pointer right-4 text-red-500 text-xl font-bold hover:text-red-700">
          ×
        </button>
        <h3 className="text-center text-xl font-semibold mb-4">PDF Preview</h3>
        <iframe src={pdfUrl} title="PDF Preview" className="w-full h-[60vh] border rounded-md" />
        <div className="text-center mt-6">
          <button onClick={handleDownload} className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-700">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateRollNoPDF;