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

   
    const addPageHeaders = () => {
   
      const centerNameY = margin
      doc.setFont("helvetica", "bold")
      doc.setFontSize(25)

    
      doc.setFillColor(240, 240, 240)
      doc.rect(margin, centerNameY, tableWidth, 15, "F")
      doc.rect(margin, centerNameY, tableWidth, 15)
      doc.text(`Center Name: ${centerName}`, margin + tableWidth / 2, centerNameY + 10, { align: "center" })

      
      const headerY = centerNameY + 18
      const headerColWidth = tableWidth / 4

      
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

      
      const tableStartY = headerY + 15
      const labColWidth = tableWidth * 0.3 
      const rollColWidth = tableWidth * 0.7

     
      doc.setFillColor(200, 200, 200)
      doc.rect(margin, tableStartY, labColWidth, 25, "F")
      doc.rect(margin + labColWidth, tableStartY, rollColWidth, 12, "F")

     
      doc.rect(margin, tableStartY, labColWidth, 25)
      doc.rect(margin + labColWidth, tableStartY, rollColWidth, 12)

      doc.setFontSize(22)
      doc.setFont("helvetica", "bold")
      doc.text("LAB", margin + labColWidth / 2, tableStartY + 16, { align: "center" })
      doc.text("ROLL NUMBERS", margin + labColWidth + rollColWidth / 2, tableStartY + 8, { align: "center" })

    
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

    
    const addPageNumber = () => {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(12)
      doc.text(`Page ${currentPage}`, pageWidth - margin, pageHeight - 15, { align: "right" })
    }

    
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

    
    let currentY = addPageHeaders()
    const rowHeight = 15 
    const floorHeaderHeight = 20 

    
    const organizedData = organizeByFloor(labData)

    const labColWidth = tableWidth * 0.3
    const rollColWidth = tableWidth * 0.7

  
    Object.keys(organizedData).forEach((floor, floorIndex) => {
      
      checkNewPage(floorHeaderHeight + rowHeight)

      
      doc.setFont("helvetica", "bold")
      doc.setFontSize(28)

      
      doc.setFillColor(180, 180, 180)
      doc.rect(margin, currentY, tableWidth, floorHeaderHeight, "F")
      doc.rect(margin, currentY, tableWidth, floorHeaderHeight)

      doc.text(` ${floor}`, margin + tableWidth / 2, currentY + 13, { align: "center" })
      currentY += floorHeaderHeight

      doc.setFont("helvetica", "normal")
      doc.setFontSize(14)

     
      organizedData[floor].forEach((data, labIndex) => {
       
        if (checkNewPage(rowHeight)) {
        
        }

       
        if (labIndex % 2 === 0) {
          doc.setFillColor(248, 248, 248)
          doc.rect(margin, currentY, tableWidth, rowHeight, "F")
        }

        
        doc.rect(margin, currentY, labColWidth, rowHeight)
        doc.rect(margin + labColWidth, currentY, rollColWidth / 2, rowHeight)
        doc.rect(margin + labColWidth + rollColWidth / 2, currentY, rollColWidth / 2, rowHeight)

        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.text(data.lab, margin + labColWidth / 2, currentY + 10, { align: "center" })

       
        doc.setFont("helvetica", "bold")
        doc.setFontSize(20)
        doc.text(data.startRollNo, margin + labColWidth + rollColWidth / 4, currentY + 10, { align: "center" })
        doc.text(data.endRollNo, margin + labColWidth + rollColWidth * 0.75, currentY + 10, { align: "center" })

        currentY += rowHeight
      })

     
      currentY += 8
    })

   
    addPageNumber()

    return isPreview ? doc.output("bloburl") : doc
  }

  
  const normalizeFloorName = (floorName) => {
    return floorName.toString().trim().toLowerCase().replace(/\s+/g, " ")
  }

  
  const organizeByFloor = (data) => {
    
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

   
    Object.keys(floorGroups).forEach((floor) => {
      floorGroups[floor].sort((a, b) => {
        const labA = a.lab.toLowerCase()
        const labB = b.lab.toLowerCase()

       
        const numA = Number.parseInt(labA.replace(/\D/g, "")) || 0
        const numB = Number.parseInt(labB.replace(/\D/g, "")) || 0

        if (numA === numB) {
          return labA.localeCompare(labB)
        }
        return numA - numB
      })
    })

    
    const sortedFloors = Object.keys(floorGroups).sort((a, b) => {
      const floorA = Number.parseInt(a.replace(/\D/g, "")) || 0
      const floorB = Number.parseInt(b.replace(/\D/g, "")) || 0
      return floorA - floorB
    })

   
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
