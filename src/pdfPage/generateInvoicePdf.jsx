import { useRef, useState } from "react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function PdfPreview({ invoice }) {
  const pdfRef = useRef(null)
  const [isDownloading, setIsDownloading] = useState(false)

  const numberToWords = (num) => {
    const ones = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ]
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"]

    if (num === 0) return "Zero"

    const convertIndianSystem = (n) => {
      if (n < 20) return ones[n]
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "")
      if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertIndianSystem(n % 100) : "")

      const parts = []
      const units = ["", "Thousand", "Lakh", "Crore"]
      let unitIndex = 0

      while (n > 0 && unitIndex < units.length) {
        let divider = unitIndex === 1 ? 1000 : 100
        let part = n % divider
        if (part > 0) {
          parts.unshift(`${convertIndianSystem(part)} ${units[unitIndex]}`.trim())
        }
        n = Math.floor(n / divider)
        unitIndex++
      }

      return parts.join(" ")
    }

    return convertIndianSystem(Math.floor(num)) + " Only"
  }

  const handleDownload = async () => {
    if (!pdfRef.current || isDownloading) return
    setIsDownloading(true)

    try {
      const clone = pdfRef.current.cloneNode(true)
      const container = document.createElement("div")
      container.style.position = "absolute"
      container.style.left = "-9999px"
      container.style.top = "-9999px"
      container.appendChild(clone)
      document.body.appendChild(container)

      const canvas = await html2canvas(clone, {
        scale: 1.5, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      })

      document.body.removeChild(container)

      const imgData = canvas.toDataURL("image/jpeg", 0.8) 
      const pdf = new jsPDF("p", "mm", "a4")

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height)

      const imgX = (pdfWidth - canvas.width * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, "JPEG", imgX, imgY, canvas.width * ratio, canvas.height * ratio)

      if (Array.isArray(invoice)) {
        pdf.save(`Invoices-${new Date().toISOString().slice(0, 10)}.pdf`)
      } else {
        pdf.save(`Invoice-${invoice.invoiceNo}.pdf`)
      }
    } catch (err) {
      console.error("Error generating PDF:", err)
      alert("Error generating PDF: " + err.message)
    } finally {
      setIsDownloading(false)
    }
  }

  if (!invoice) return <div>No invoice selected</div>

  const invoices = Array.isArray(invoice) ? invoice : [invoice]
  const firstInvoice = invoices[0]
  const allItems = invoices.flatMap((inv) => inv.items)
  const totalAmount = allItems.reduce((sum, item) => sum + Number(item.amount || 0), 0).toFixed(2)
  const amountInWords = numberToWords(parseFloat(totalAmount))

  return (
    <div className="space-y-4">
      <div
        ref={pdfRef}
        className="pdf-container bg-white"
        style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "1rem", color: "#000", fontFamily: "Arial, sans-serif" }}
      >
        <div className="text-center font-bold text-xl border-b-2 border-black pb-2 mb-4">INVOICE</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", border: "1px solid black" }}>
          <div style={{ borderRight: "1px solid black", padding: "0.5rem" }}>
            <div><strong>Department Information</strong></div>
            <div>{firstInvoice.departmentName}</div>
            <div>{firstInvoice.departmentAddress}</div>
          </div>
          <div style={{ padding: "0.5rem" }}>
            <div>Invoice No - {firstInvoice.invoiceNo}</div>
            <div>Date: {firstInvoice.invoiceDate}</div>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              {["Sr. No", "Description", "Date", "Candidate/System", "Rate", "Amount"].map((heading, idx) => (
                <th key={idx} style={{ border: "1px solid black", padding: "8px", textAlign: "left" }}>{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allItems.map((item, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.description}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.date}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.candidateSystem}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{item.rate}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>₹ {item.amount}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ border: "1px solid black", padding: "8px", fontWeight: "bold", textAlign: "right" }}>Total Amount</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>₹ {totalAmount}</td>
            </tr>
            <tr>
              <td colSpan="5" style={{ border: "1px solid black", padding: "8px", fontWeight: "bold", textAlign: "right" }}>Net Amount</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>₹ {totalAmount}</td>
            </tr>
          </tfoot>
        </table>

        <div style={{ marginTop: "1rem" }}>
          <div>Amount Chargeable (in words): {amountInWords}</div>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <div>1. Cheque / NEFT must be drawn done in favor of: FOR {firstInvoice.departmentName}</div>
          <div>2. Bank Details are as follows:</div>
          <div style={{ marginLeft: "1rem" }}>
            <div>Bank name: {firstInvoice.bankName || "**********"}</div>
            <div>Branch: {firstInvoice.branch || "**********"}</div>
            <div>A/C No: {firstInvoice.accountNo || "**********"}</div>
            <div>IFSC Code: {firstInvoice.ifscCode || "**********"}</div>
            <div>PAN No: {firstInvoice.panNo || "**********"}</div>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "4rem" }}>
          <div>(Authorized Signatory)</div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            backgroundColor: isDownloading ? "#6b7280" : "#2563eb",
            color: "white",
            padding: "0.5rem 1.5rem",
            borderRadius: "0.25rem",
            opacity: isDownloading ? 0.7 : 1,
            cursor: isDownloading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center"
          }}
        >
          {isDownloading ? "Downloading..." : "Download PDF"}
        </button>
      </div>
    </div>
  )
}
