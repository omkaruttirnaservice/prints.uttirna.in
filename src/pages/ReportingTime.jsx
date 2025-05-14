import React, { useState, useEffect } from 'react';
import { generateShiftPDFPreview } from '../pdfPage/generateShiftPDF';

const ReportingTime = () => {
  const [shift, setShift] = useState('');
  const [shiftTime, setShiftTime] = useState('');
  const [shiftList, setShiftList] = useState([]);
  const [pdfBlob, setPdfBlob] = useState(null); 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
    const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const storedShifts = localStorage.getItem('shiftList');
    if (storedShifts) {
      setShiftList(JSON.parse(storedShifts));
    }
  }, []);

  useEffect(() => {
    if (shiftList.length > 0) {
      localStorage.setItem('shiftList', JSON.stringify(shiftList));
    }
  }, [shiftList]);

  const handleSave = () => {
    if (shift && shiftTime) {
      const newShift = {
        id: Date.now(),
        shift,
        shiftTime,
      };
      setShiftList([...shiftList, newShift]);
      setShift('');
      setShiftTime('');
      setErrorMsg('');
    } else {
      setErrorMsg('please fill in all fields'); // You can replace this with a more user-friendly alert
    }
    
  };

  const handlePreview = () => {
    const blob = generateShiftPDFPreview(shiftList);
    setPdfBlob(blob);
    setIsPreviewOpen(true); 
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporting-time.pdf';
      a.click();
      setIsPreviewOpen(false); 
    }
  };

  const handleClearAll = () => {
    setShiftList([]); 
    localStorage.removeItem('shiftList'); 
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
        Reporting Time
      </h2>
       {errorMsg && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-center font-medium">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64"
        />
        <input
          type="text"
          placeholder="Enter Shift Time"
          value={shiftTime}
          onChange={(e) => setShiftTime(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64"
        />
        <button
          onClick={handleSave}
          className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Save
        </button>
      </div>

      {shiftList.length > 0 && (
        <div className="overflow-x-auto mt-8 max-w-4xl mx-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-green-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Shift</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Shift Time</th>
              </tr>
            </thead>
            <tbody>
              {shiftList.map((item, index) => (
                <tr key={item.id} className="hover:bg-green-50 transition">
                  <td className="px-6 py-3 border-b">{index + 1}</td>
                  <td className="px-6 py-3 border-b">{item.shift}</td>
                  <td className="px-6 py-3 border-b">{item.shiftTime}</td>
                </tr>
              ))}
            </tbody>
          </table>

          
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handlePreview}
              className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Preview PDF
            </button>

          
            <button
              onClick={handleClearAll}
              className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Clear All
            </button>
          </div>
        </div>
      )}

    
      {isPreviewOpen && pdfBlob && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h3 className="text-xl font-bold text-center mb-4">PDF Preview</h3>
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="400"
              title="PDF Preview"
            />
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleDownload}
                className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Download PDF
              </button>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="bg-red-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportingTime;
