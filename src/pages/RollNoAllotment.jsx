import { useState, useEffect } from "react"
import { MdDelete } from "react-icons/md";
import GenerateRollNoPDF from "../pdfPage/generateRollNoPDF"

const RollNoAllotment = () => {
  const [centerName, setCenterName] = useState(() => localStorage.getItem("centerName") || "")
  const [centerCode, setCenterCode] = useState(() => localStorage.getItem("centerCode") || "")
  const [date, setDate] = useState(() => localStorage.getItem("date") || "")
  const [batch, setBatch] = useState(() => localStorage.getItem("batch") || "")
  const [time, setTime] = useState(() => localStorage.getItem("time") || "")

  
  const [lab, setLab] = useState("")
  const [startRollNo, setStartRollNo] = useState("")
  const [endRollNo, setEndRollNo] = useState("")

  const [labData, setLabData] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [showPdfPreview, setShowPdfPreview] = useState(false)

  useEffect(() => {
    const storedLabData = JSON.parse(localStorage.getItem("labData")) || []
    setLabData(storedLabData)
  }, [])

  useEffect(() => {
    localStorage.setItem("centerName", centerName)
    localStorage.setItem("centerCode", centerCode)
    localStorage.setItem("date", date)
    localStorage.setItem("batch", batch)
    localStorage.setItem("time", time)
  }, [centerName, centerCode, date, batch, time])

  const saveData = () => {
    if (lab && startRollNo && endRollNo) {
      const newLabData = {
        lab,
        startRollNo,
        endRollNo,
      }

      const updatedLabData = [...labData, newLabData]
      localStorage.setItem("labData", JSON.stringify(updatedLabData))
      setLabData(updatedLabData)

      setLab("")
      setStartRollNo("")
      setEndRollNo("")
      setErrorMsg("")
    } else {
      setErrorMsg("Please fill in LAB, Start Roll No. and End Roll No.")
    }
  }

  const handleClearAll = () => {

    localStorage.removeItem("labData")
    setLabData([])
  }

  const handleDeleteRow = (index) => {
    const updatedLabData = [...labData]
    updatedLabData.splice(index, 1)
    localStorage.setItem("labData", JSON.stringify(updatedLabData))
    setLabData(updatedLabData)
  }

  const handlePreviewPDF = () => {
    if (labData.length > 0) {
      setShowPdfPreview(true)
    } else {
      alert("No data to preview")
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Roll Number Allotment</h2>

      {errorMsg && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-center font-medium">{errorMsg}</div>
      )}

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-green-50 p-4 rounded-lg">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Center Name</label>
          <input
            type="text"
            value={centerName}
            onChange={(e) => setCenterName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Center Code</label>
          <input
            type="text"
            value={centerCode}
            onChange={(e) => setCenterCode(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
          <input
            type="text"
            value={batch}
            onChange={(e) => setBatch(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">LAB</label>
          <input
            type="text"
            value={lab}
            onChange={(e) => setLab(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Roll No.</label>
          <input
            type="text"
            value={startRollNo}
            onChange={(e) => setStartRollNo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">End Roll No.</label>
          <input
            type="text"
            value={endRollNo}
            onChange={(e) => setEndRollNo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          />
        </div>
        <button
          onClick={saveData}
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md font-semibold"
        >
          Save
        </button>
      </div>

      {labData.length > 0 && (
        <div className="overflow-x-auto mt-8 max-w-4xl mx-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-green-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">LAB</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">Start Roll No</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">End Roll No</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {labData.map((data, index) => (
                <tr key={index} className="hover:bg-green-50 transition">
                  <td className="px-6 py-3 border-b">{index + 1}</td>
                  <td className="px-6 py-3 border-b">{data.lab}</td>
                  <td className="px-6 py-3 border-b">{data.startRollNo}</td>
                  <td className="px-6 py-3 border-b">{data.endRollNo}</td>
                  <td className="px-6 py-3 border-b text-center">
                    <button
                      onClick={() => handleDeleteRow(index)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      title="Delete"
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => handlePreviewPDF()}
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

      {showPdfPreview && (
        <GenerateRollNoPDF
          centerName={centerName}
          centerCode={centerCode}
          date={date}
          batch={batch}
          time={time}
          labData={labData}
          onClose={() => setShowPdfPreview(false)}
        />
      )}
    </div>
  )
}

export default RollNoAllotment
