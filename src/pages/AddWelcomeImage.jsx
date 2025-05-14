import React, { useState } from 'react';
import WelcomePage from '../pdfPage/WelcomePage';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';

const AddWelcomeImage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      window.location.reload(); 
    }, 300);
  };

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6">
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
       Wel Come To Exam
      </h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold text-center mb-4">Upload Image for PDF</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className=" cursor-pointer block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {selectedImage && (
          <div className="mt-4">
            <p className="font-semibold text-gray-700 mb-2">Image Preview:</p>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full max-h-64 object-contain border rounded-md shadow"
            />
          </div>
        )}

        <button
          onClick={() => setShowModal(true)}
          className="mt-6 w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={!selectedImage}
        >
          Generate PDF
        </button>
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white w-[90%] h-[90%] p-6 rounded-xl shadow-lg overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">PDF Preview</h2>
              <button
                onClick={handleCloseModal}
                className="text-red-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-grow overflow-auto border rounded mb-4">
              <PDFViewer width="100%" height="100%">
                <WelcomePage imageSrc={selectedImage} />
              </PDFViewer>
            </div>

            <PDFDownloadLink
              document={<WelcomePage imageSrc={selectedImage} />}
              fileName="welcome.pdf"
              className="inline-block text-center cursor-pointer w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              {({ loading }) =>
                loading ? (
                  'Preparing PDF...'
                ) : (
                  <span
                    onClick={() => {
                      setTimeout(() => {
                        window.location.reload();
                      }, 500); 
                    }}
                  >
                    Download PDF
                  </span>
                )
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddWelcomeImage;
