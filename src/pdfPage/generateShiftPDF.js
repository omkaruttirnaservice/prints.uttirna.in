import { jsPDF } from 'jspdf';

export const generateShiftPDFPreview = (shiftList) => {
  if (!shiftList || shiftList.length === 0) {
    alert('No shifts to generate.');
    return;
  }

  const doc = new jsPDF('landscape', 'mm', 'a4');
  const centerX = 148.5; 
  
  doc.rect(10, 10, 277, 187);

 
  doc.setFontSize(60);
  doc.setTextColor(150); 
  doc.setFont('helvetica', 'bold');
  doc.text('Reporting Time:', centerX, 35, { align: 'center' });

  
  doc.setFontSize(50);
  const startY = 70;
  const lineGap = 30;

  shiftList.forEach((item, index) => {
    const y = startY + index * lineGap;
    const shiftName = item.shift;
    const shiftTime = item.shiftTime;
    const fullText = `${shiftName} :: ${shiftTime}`;

    const fullTextX = centerX - doc.getTextWidth(fullText) / 2;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(`${shiftName} ::`, fullTextX, y);

    doc.setFont('helvetica', 'bold');
    doc.text(shiftTime, fullTextX + doc.getTextWidth(`${shiftName} :: `), y);
  });

  
  return doc.output('blob');
};
