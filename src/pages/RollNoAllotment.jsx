import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

const RollNoAllotment = () => {
  const [centerName, setCenterName] = useState('');
  const [centerCode, setCenterCode] = useState('');
  const [date, setDate] = useState('');
  const [batch, setBatch] = useState('');
  const [time, setTime] = useState('');
  const [lab, setLab] = useState('');
  const [startRollNo, setStartRollNo] = useState('');
  const [endRollNo, setEndRollNo] = useState('');
  const [rollData, setRollData] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('rollData')) || [];
    setRollData(storedData);
  }, []);

  const saveData = () => {
    if (
      centerName &&
      centerCode &&
      date &&
      batch &&
      time &&
      lab &&
      startRollNo &&
      endRollNo
    ) {
      const newRollData = {
        centerName,
        centerCode,
        date,
        batch,
        time,
        lab,
        startRollNo,
        endRollNo,
      };

      const updatedRollData = [...rollData, newRollData];
      localStorage.setItem('rollData', JSON.stringify(updatedRollData));
      setRollData(updatedRollData);

      setCenterName('');
      setCenterCode('');
      setDate('');
      setBatch('');
      setTime('');
      setLab('');
      setStartRollNo('');
      setEndRollNo('');
      setErrorMsg('');
    } else {
      setErrorMsg('please fill in all fields');
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem('rollData');
    setRollData([]);
  };

 const generatePDF = (rollData, callback) => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });


  const columns = [
    { title: 'Sr', x: 10, width: 10 },
    { title: 'Center Name', x: 20, width: 60 },
    { title: 'Code', x: 80, width: 15 },
    { title: 'Date', x: 95, width: 25 },
    { title: 'Batch', x: 120, width: 20 },
    { title: 'Time', x: 140, width: 20 },
    { title: 'Lab', x: 160, width: 20 },
    { title: 'Start Roll No.', x: 180, width: 25 },
    { title: 'End Roll No.', x: 205, width: 25 }
  ];

  let y = 20;

  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(30);
  doc.text('Roll Number Allotment Report', 148.5, y, { align: 'center' });
  y += 15;

 
  doc.setFontSize(11);
  columns.forEach(col => {
    doc.text(col.title, col.x, y);
  });
  
  
  doc.setLineWidth(0.5);
  doc.line(10, y + 2, 287, y + 2);
  y += 10;

 
  doc.setFont('helvetica', 'normal');

  rollData.forEach((data, index) => {
    if (y > 190) {
      doc.addPage();
      y = 20;
     
      doc.setFont('helvetica', 'bold');
      doc.text('Roll Number Allotment Report', 148.5, y, { align: 'center' });
      y += 15;
      columns.forEach(col => doc.text(col.title, col.x, y));
      doc.line(10, y + 2, 287, y + 2);
      y += 10;
      doc.setFont('helvetica', 'normal');
    }

  
    doc.text(String(index + 1), columns[0].x, y);
    doc.text(data.centerName, columns[1].x, y);
    doc.text(data.centerCode, columns[2].x, y);
    doc.text(data.date, columns[3].x, y);
    doc.text(data.batch, columns[4].x, y);
    doc.text(data.time, columns[5].x, y);
    doc.text(data.lab, columns[6].x, y);
    doc.text(String(data.startRollNo), columns[7].x, y);
    doc.text(String(data.endRollNo), columns[8].x, y);

 
    doc.setDrawColor(0); 
    doc.line(10, y + 4, 287, y + 4);
    
    y += 8;
  });

  if (callback) {
    const pdfBlobUrl = doc.output('bloburl');
    callback(pdfBlobUrl, doc);
  }
};


  const handlePreviewPDF = () => {
    if (rollData.length > 0) {
      generatePDF(rollData, (url) => {
        setPdfUrl(url);
        setShowModal(true);
      });
    } else {
      alert('No data to preview');
    }
  };

  const handleDownloadPDF = () => {
    generatePDF(rollData, (url, doc) => {
      doc.save('roll-number-allotment.pdf');
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
        Roll Number Allotment
      </h2>

      {errorMsg && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-center font-medium">
          {errorMsg}
        </div>
      )}

      <form className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Center Name" value={centerName} onChange={(e) => setCenterName(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="text" placeholder="Center Code" value={centerCode} onChange={(e) => setCenterCode(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="text" placeholder="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="text" placeholder="Enter Time" value={time} onChange={(e) => setTime(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="text" placeholder="LAB" value={lab} onChange={(e) => setLab(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="number" placeholder="Start Roll No." value={startRollNo} onChange={(e) => setStartRollNo(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
        <input type="number" placeholder="End Roll No." value={endRollNo} onChange={(e) => setEndRollNo(e.target.value)} className="border border-gray-300 rounded-md px-4 py-2" />
      </form>

      <div className="flex justify-center mb-8">
        <button onClick={saveData} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md font-semibold">
          Save
        </button>
      </div>

      {rollData.length > 0 && (
        <div className="overflow-x-auto mt-8 max-w-4xl mx-auto">
          <table className="min-w-220 bg-white border border-gray-300 rounded-lg">
            <thead className="bg-green-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Center Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Center Code</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Batch</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Time</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">LAB</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Start Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">End Roll No</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rollData.map((data, index) => (
                <tr key={index} className="hover:bg-green-50 transition">
                  <td className="px-6 py-3 border-b">{index + 1}</td>
                  <td className="px-6 py-3 border-b">{data.centerName}</td>
                  <td className="px-6 py-3 border-b">{data.centerCode}</td>
                  <td className="px-6 py-3 border-b">{data.date}</td>
                  <td className="px-6 py-3 border-b">{data.batch}</td>
                  <td className="px-6 py-3 border-b">{data.time}</td>
                  <td className="px-6 py-3 border-b">{data.lab}</td>
                  <td className="px-6 py-3 border-b">{data.startRollNo}</td>
                  <td className="px-6 py-3 border-b">{data.endRollNo}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6 gap-4">
            <button onClick={handlePreviewPDF} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              Preview PDF
            </button>
            <button onClick={handleClearAll} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
              Clear All
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 h-[80vh] shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-red-500 text-xl font-bold hover:text-red-700"
            >
              ×
            </button>
            <h3 className="text-center text-xl font-semibold mb-4">PDF Preview</h3>
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-[60vh] border rounded-md"
            />
            <div className="text-center mt-6">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RollNoAllotment;
