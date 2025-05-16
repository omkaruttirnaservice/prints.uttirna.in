import { useState, useEffect } from "react"
import InvoiceForm from "./InvoiceForm"
import InvoiceTable from "./InvoiceTable"
import PdfPreview from "../pdfPage/generateInvoicePdf"

export default function InvoiceGenerator() {
  const [invoiceData, setInvoiceData] = useState([])
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("invoiceData")
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        if (Array.isArray(parsedData)) {
          setInvoiceData(parsedData)
        }
      }
    } catch (error) {
      console.error("Error loading invoice data:", error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

 
  useEffect(() => {
   
    if (isLoaded) {
      try {
        localStorage.setItem("invoiceData", JSON.stringify(invoiceData))
      } catch (error) {
        console.error("Error saving invoice data:", error)
      }
    }
  }, [invoiceData, isLoaded])

  const handleSaveInvoice = (data) => {
    const updatedInvoices = [...invoiceData, data]
    setInvoiceData(updatedInvoices)
  }

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all invoices?")) {
      setInvoiceData([])
      localStorage.removeItem("invoiceData")
    }
  }

  const handlePreviewPdf = (invoice) => {
    setSelectedInvoice(invoice)
    setShowPdfPreview(true)
  }

  const handlePreviewAllPdf = () => {
    if (invoiceData.length > 0) {
      setSelectedInvoice(invoiceData)
      setShowPdfPreview(true)
    }
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-600">Invoice Generator</h1>

      <div className="max-w-3xl mx-auto mb-8">
        <InvoiceForm onSave={handleSaveInvoice} />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md">
        <InvoiceTable invoices={invoiceData} onClearAll={handleClearAll} onPreviewPdf={handlePreviewPdf} />

        {invoiceData.length > 0 && (
          <div className="p-4 flex justify-center">
            <button
              onClick={handlePreviewAllPdf}
              className="bg-blue-600 cursor-pointer text-white py-2 px-6 rounded hover:bg-blue-700"
            >
              PDF Preview
            </button>
          </div>
        )}
      </div>

      {showPdfPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold">PDF Preview</h2>
              <button onClick={() => setShowPdfPreview(false)} className="text-gray-500 cursor-pointer hover:text-gray-700">
                Close
              </button>
            </div>
            <PdfPreview invoice={selectedInvoice} />
          </div>
        </div>
      )}
    </main>
  )
}
