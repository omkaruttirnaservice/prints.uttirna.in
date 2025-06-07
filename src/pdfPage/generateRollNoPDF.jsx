import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"

const GenerateRollNoPDF = ({ centerName, centerCode, date, batch, time, labData, onClose }) => {
  const [pdfUrl, setPdfUrl] = useState("")

  useEffect(() => {
    const url = generatePDF()
    setPdfUrl(url)
  }, [])

  const generatePDF = (isPreview = true) => {
    // Use A3 size for larger PDF
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a3" })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const tableWidth = pageWidth - margin * 2
    const bottomMargin = 25

    let currentPage = 1

    // Function to add headers to each page
    const addPageHeaders = () => {
      // Center Name Header - Larger and more prominent
      const centerNameY = margin
      doc.setFont("helvetica", "bold")
      doc.setFontSize(25)

      // Background for center name
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, centerNameY, tableWidth, 15, "F")
      doc.rect(margin, centerNameY, tableWidth, 15)
      doc.text(`Center Name: ${centerName}`, margin + tableWidth / 2, centerNameY + 10, { align: "center" })

      // Center Details Header - Larger spacing
      const headerY = centerNameY + 18
      const headerColWidth = tableWidth / 4

      // Background for details
      doc.setFillColor(250, 250, 250)
      ;[0, 1, 2, 3].forEach((i) => {
        doc.rect(margin + headerColWidth * i, headerY, headerColWidth, 12, "F")
        doc.rect(margin + headerColWidth * i, headerY, headerColWidth, 12)
      })

      doc.setFontSize(18)
      doc.text(`Center Code: ${centerCode}`, margin + 8, headerY + 8)
      doc.text(`Date: ${date}`, margin + headerColWidth + 8, headerY + 8)
      doc.text(`Batch: ${batch}`, margin + headerColWidth * 2 + 8, headerY + 8)
      doc.text(`Time: ${time}`, margin + headerColWidth * 3 + 8, headerY + 8)

      // Table Headers - Much larger and clearer
      const tableStartY = headerY + 15
      const labColWidth = tableWidth * 0.3 // Increased lab column width
      const rollColWidth = tableWidth * 0.7

      // Main headers background
      doc.setFillColor(200, 200, 200)
      doc.rect(margin, tableStartY, labColWidth, 25, "F")
      doc.rect(margin + labColWidth, tableStartY, rollColWidth, 12, "F")

      // Draw borders
      doc.rect(margin, tableStartY, labColWidth, 25)
      doc.rect(margin + labColWidth, tableStartY, rollColWidth, 12)

      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("LAB", margin + labColWidth / 2, tableStartY + 16, { align: "center" })
      doc.text("ROLL NUMBERS", margin + labColWidth + rollColWidth / 2, tableStartY + 8, { align: "center" })

      // Sub headers
      const subHeaderY = tableStartY + 12
      doc.setFillColor(220, 220, 220)
      doc.rect(margin + labColWidth, subHeaderY, rollColWidth / 2, 13, "F")
      doc.rect(margin + labColWidth + rollColWidth / 2, subHeaderY, rollColWidth / 2, 13, "F")

      doc.rect(margin + labColWidth, subHeaderY, rollColWidth / 2, 13)
      doc.rect(margin + labColWidth + rollColWidth / 2, subHeaderY, rollColWidth / 2, 13)

      doc.setFontSize(22)
      doc.text("Start Roll No.", margin + labColWidth + rollColWidth / 4, subHeaderY + 9, { align: "center" })
      doc.text("End Roll No.", margin + labColWidth + rollColWidth * 0.75, subHeaderY + 9, { align: "center" })

      return subHeaderY + 14
    }

    // Function to add page number
    const addPageNumber = () => {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 15, { align: "right" })
    }

    // Function to check if we need a new page
    const checkNewPage = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight - bottomMargin) {
        addPageNumber()
        doc.addPage()
        currentPage++
        currentY = addPageHeaders()
        return true
      }
      return false
    }

    // Start with first page headers
    let currentY = addPageHeaders()
    const rowHeight = 15 // Increased row height for better spacing
    const floorHeaderHeight = 20 // Increased floor header height

    // Organize data by floor
    const organizedData = organizeByFloor(labData)

    const labColWidth = tableWidth * 0.3
    const rollColWidth = tableWidth * 0.7

    // Render data by floor
    Object.keys(organizedData).forEach((floor, floorIndex) => {
      // Check if we need a new page for floor header
      checkNewPage(floorHeaderHeight + rowHeight)

      // Add floor header with much larger size and better styling
      doc.setFont("helvetica", "bold")
      doc.setFontSize(28)

      // Create a prominent floor header background
      doc.setFillColor(180, 180, 180)
      doc.rect(margin, currentY, tableWidth, floorHeaderHeight, "F")
      doc.rect(margin, currentY, tableWidth, floorHeaderHeight)

      doc.text(` ${floor}`, margin + tableWidth / 2, currentY + 13, { align: "center" })
      currentY += floorHeaderHeight

      doc.setFont("helvetica", "normal")
      doc.setFontSize(14)

      // Add labs for this floor
      organizedData[floor].forEach((data, labIndex) => {
        // Check if we need a new page for this row
        if (checkNewPage(rowHeight)) {
          // Headers already added by checkNewPage function
        }

        // Alternate row colors for better readability
        if (labIndex % 2 === 0) {
          doc.setFillColor(248, 248, 248)
          doc.rect(margin, currentY, tableWidth, rowHeight, "F")
        }

        // Draw borders
        doc.rect(margin, currentY, labColWidth, rowHeight)
        doc.rect(margin + labColWidth, currentY, rollColWidth / 2, rowHeight)
        doc.rect(margin + labColWidth + rollColWidth / 2, currentY, rollColWidth / 2, rowHeight)

        // Lab name - larger and bold
        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.text(data.lab, margin + labColWidth / 2, currentY + 10, { align: "center" })

        // Roll numbers - clear and readable
        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.text(data.startRollNo, margin + labColWidth + rollColWidth / 4, currentY + 10, { align: "center" })
        doc.text(data.endRollNo, margin + labColWidth + rollColWidth * 0.75, currentY + 10, { align: "center" })

        currentY += rowHeight
      })

      // Add more space between floors
      currentY += 8
    })

    // Add page number to the last page
    addPageNumber()

    return isPreview ? doc.output("bloburl") : doc
  }

  // Function to normalize floor names for proper grouping
  const normalizeFloorName = (floorName) => {
    return floorName.toString().trim().toLowerCase().replace(/\s+/g, " ")
  }

  // Function to organize lab data by floor and lab sequence
  const organizeByFloor = (data) => {
    // Group by normalized floor name
    const floorGroups = {}
    const floorDisplayNames = {}

    data.forEach((item) => {
      const normalizedFloor = normalizeFloorName(item.floor)
      const originalFloor = item.floor.toString().trim()

      if (!floorGroups[normalizedFloor]) {
        floorGroups[normalizedFloor] = []
        floorDisplayNames[normalizedFloor] = originalFloor
      }
      floorGroups[normalizedFloor].push(item)
    })

    // Sort each floor's labs by lab name/number
    Object.keys(floorGroups).forEach((floor) => {
      floorGroups[floor].sort((a, b) => {
        const labA = a.lab.toLowerCase()
        const labB = b.lab.toLowerCase()

        // Extract numbers for proper numeric sorting
        const numA = Number.parseInt(labA.replace(/\D/g, "")) || 0
        const numB = Number.parseInt(labB.replace(/\D/g, "")) || 0

        if (numA === numB) {
          return labA.localeCompare(labB)
        }
        return numA - numB
      })
    })

    // Sort floors numerically
    const sortedFloors = Object.keys(floorGroups).sort((a, b) => {
      const floorA = Number.parseInt(a.replace(/\D/g, "")) || 0
      const floorB = Number.parseInt(b.replace(/\D/g, "")) || 0
      return floorA - floorB
    })

    // Create sorted object with display names
    const sortedData = {}
    sortedFloors.forEach((normalizedFloor) => {
      const displayName = floorDisplayNames[normalizedFloor]
      sortedData[displayName] = floorGroups[normalizedFloor]
    })

    return sortedData
  }

  const handleDownload = () => {
    const doc = generatePDF(false)
    doc.save(`Roll-Number-Allotment-${centerName}-Batch-${batch}.pdf`)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-[95%] h-[90vh] shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-6 text-red-500 text-2xl font-bold hover:text-red-700 cursor-pointer z-10"
        >
          ×
        </button>

        <div className="text-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">PDF Preview</h3>
          <p className="text-gray-600 mt-2">
            {centerName} - Batch {batch} | Roll Number Allotment
          </p>
        </div>

        <div className="border-2 border-gray-300 rounded-lg overflow-hidden h-[70vh]">
          <iframe src={pdfUrl} title="PDF Preview" className="w-full h-full" style={{ border: "none" }} />
        </div>

        <div className="text-center mt-6 space-x-4">
          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            📥 Download PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold cursor-pointer transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenerateRollNoPDF
