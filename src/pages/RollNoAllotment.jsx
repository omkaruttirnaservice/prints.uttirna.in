import { useState, useEffect, useRef } from "react"
import { MdDelete, MdEdit, MdArrowUpward, MdArrowDownward, MdAdd, MdVisibility } from "react-icons/md"
import GenerateRollNoPDF from "../pdfPage/generateRollNoPDF"

const RollNoAllotment = () => {
  // Center Information
  const [centerName, setCenterName] = useState("")
  const [centerCode, setCenterCode] = useState("")
  const [date, setDate] = useState("")
  const [batch, setBatch] = useState("")
  const [time, setTime] = useState("")

  // Center Management
  const [centerFormOpen, setCenterFormOpen] = useState(false)
  const [viewCenterData, setViewCenterData] = useState(false)
  const [centerRecords, setCenterRecords] = useState([])
  const [editingCenterIndex, setEditingCenterIndex] = useState(null)
  const [selectedCenterKey, setSelectedCenterKey] = useState("")

  // Available options for dropdowns
  const [availableCenters, setAvailableCenters] = useState([])
  const [availableBatches, setAvailableBatches] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [availableTimes, setAvailableTimes] = useState([])

  // Exam Posts`
  const [records, setRecords] = useState([])
  const [formData, setFormData] = useState({
    post: "",
    totalCandidates: "",
    startRoll: "",
    endRoll: "",
  })
  const [editIndex, setEditIndex] = useState(null)
  const [showTable, setShowTable] = useState(false)

  // Lab Allocations
  const [post, setPost] = useState("")
  const [floor, setFloor] = useState("")
  const [lab, setLab] = useState("")
  const [allowed, setAllowed] = useState("")
  const [labData, setLabData] = useState([])
  const [errorMsg, setErrorMsg] = useState("")
  const [showPdfPreview, setShowPdfPreview] = useState(false)
  const [editingLabIndex, setEditingLabIndex] = useState(null)
  const [movingRow, setMovingRow] = useState(null)

  // Refs
  const tableRef = useRef(null)
  const formRef = useRef(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    loadCenterRecords()
    loadCurrentBatchData()
  }, [])

  // Load center records from localStorage
  const loadCenterRecords = () => {
    const storedCenters = JSON.parse(localStorage.getItem("centerRecords")) || []
    setCenterRecords(storedCenters)
    updateDropdownOptions(storedCenters)
  }

  // Update dropdown options based on center records
  const updateDropdownOptions = (centers) => {
    const centerNames = [...new Set(centers.map((c) => c.centerName))].filter(Boolean)
    const centerCodes = [...new Set(centers.map((c) => c.centerCode))].filter(Boolean)
    const dates = [...new Set(centers.map((c) => c.date))].filter(Boolean)
    const batches = [...new Set(centers.map((c) => c.batch))].filter(Boolean)
    const times = [...new Set(centers.map((c) => c.time))].filter(Boolean)

    setAvailableCenters(centerNames)
    setAvailableBatches(batches)
    setAvailableDates(dates)
    setAvailableTimes(times)
  }

  // Load current batch data
  const loadCurrentBatchData = () => {
    const currentKey = `${centerName}_${batch}`
    const storedExamData = JSON.parse(localStorage.getItem(`examData_${currentKey}`)) || []
    const storedLabData = JSON.parse(localStorage.getItem(`labData_${currentKey}`)) || []

    setRecords(storedExamData)
    setLabData(storedLabData)
  }

  // Handle center selection change
  const handleCenterChange = (selectedCenter) => {
    setCenterName(selectedCenter)

    // Find all batches for this center
    const centerBatches = centerRecords
      .filter((record) => record.centerName === selectedCenter)
      .map((record) => record.batch)
      .filter((batch, index, self) => self.indexOf(batch) === index)

    setAvailableBatches(centerBatches)

    // Auto-select first batch if available
    if (centerBatches.length > 0) {
      setBatch(centerBatches[0])

      // Load data for this center and batch
      const centerRecord = centerRecords.find((r) => r.centerName === selectedCenter && r.batch === centerBatches[0])

      if (centerRecord) {
        setCenterCode(centerRecord.centerCode)
        setDate(centerRecord.date)
        setTime(centerRecord.time)

        // Load batch-specific data
        const batchKey = `${selectedCenter}_${centerBatches[0]}`
        const storedExamData = JSON.parse(localStorage.getItem(`examData_${batchKey}`)) || []
        const storedLabData = JSON.parse(localStorage.getItem(`labData_${batchKey}`)) || []

        setRecords(storedExamData)
        setLabData(storedLabData)
      }
    }
  }

  // Handle batch change
  const handleBatchChange = (selectedBatch) => {
    setBatch(selectedBatch)

    // Find center record for this batch
    const centerRecord = centerRecords.find((r) => r.centerName === centerName && r.batch === selectedBatch)

    if (centerRecord) {
      setCenterCode(centerRecord.centerCode)
      setDate(centerRecord.date)
      setTime(centerRecord.time)
    }

    // Load batch-specific data
    const batchKey = `${centerName}_${selectedBatch}`
    const storedExamData = JSON.parse(localStorage.getItem(`examData_${batchKey}`)) || []
    const storedLabData = JSON.parse(localStorage.getItem(`labData_${batchKey}`)) || []

    setRecords(storedExamData)
    setLabData(storedLabData)
  }

  // Save center information
  const saveCenterInfo = () => {
    if (!centerName || !centerCode || !date || !batch || !time) {
      alert("Please fill all fields")
      return
    }

    const centerData = {
      centerName,
      centerCode,
      date,
      batch,
      time,
      id: Date.now(),
    }

    let updatedCenters
    if (editingCenterIndex !== null) {
      updatedCenters = [...centerRecords]
      updatedCenters[editingCenterIndex] = centerData
      setEditingCenterIndex(null)
    } else {
      updatedCenters = [...centerRecords, centerData]
    }

    setCenterRecords(updatedCenters)
    localStorage.setItem("centerRecords", JSON.stringify(updatedCenters))
    updateDropdownOptions(updatedCenters)

    setCenterFormOpen(false)

    // Set current selection
    setSelectedCenterKey(`${centerName}_${batch}`)
    loadCurrentBatchData()
  }

  // Edit center record
  const editCenterRecord = (index) => {
    const record = centerRecords[index]
    setCenterName(record.centerName)
    setCenterCode(record.centerCode)
    setDate(record.date)
    setBatch(record.batch)
    setTime(record.time)
    setEditingCenterIndex(index)
    setCenterFormOpen(true)
  }

  // Delete center record
  const deleteCenterRecord = (index) => {
    if (confirm("Are you sure you want to delete this center record?")) {
      const updatedCenters = centerRecords.filter((_, i) => i !== index)
      setCenterRecords(updatedCenters)
      localStorage.setItem("centerRecords", JSON.stringify(updatedCenters))
      updateDropdownOptions(updatedCenters)

      // Clear related data
      const record = centerRecords[index]
      const batchKey = `${record.centerName}_${record.batch}`
      localStorage.removeItem(`examData_${batchKey}`)
      localStorage.removeItem(`labData_${batchKey}`)
    }
  }

  // Handle clicks outside table and form to cancel editing
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingLabIndex !== null) {
        const isClickInsideTable = tableRef.current && tableRef.current.contains(event.target)
        const isClickInsideForm = formRef.current && formRef.current.contains(event.target)

        if (!isClickInsideTable && !isClickInsideForm) {
          handleCancelEdit()
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [editingLabIndex])

  // Handle form changes for exam posts
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Add or update exam post
  const handleAddOrUpdate = () => {
    if (!formData.post || !formData.totalCandidates || !formData.startRoll || !formData.endRoll) {
      alert("Please fill all fields")
      return
    }

    if (!centerName || !batch) {
      alert("Please select center and batch first")
      return
    }

    let updatedRecords
    if (editIndex !== null) {
      updatedRecords = [...records]
      updatedRecords[editIndex] = formData
      setEditIndex(null)
    } else {
      updatedRecords = [...records, formData]
    }

    setRecords(updatedRecords)
    const batchKey = `${centerName}_${batch}`
    localStorage.setItem(`examData_${batchKey}`, JSON.stringify(updatedRecords))

    setFormData({
      post: "",
      totalCandidates: "",
      startRoll: "",
      endRoll: "",
    })
  }

  // Delete exam post
  const handleDelete = (index) => {
    const updatedRecords = records.filter((_, i) => i !== index)
    setRecords(updatedRecords)
    const batchKey = `${centerName}_${batch}`
    localStorage.setItem(`examData_${batchKey}`, JSON.stringify(updatedRecords))
  }

  // Edit exam post
  const handleEdit = (index) => {
    setFormData(records[index])
    setEditIndex(index)
  }

  // Calculate next available roll numbers for a post with batch consideration
  const getNextRollNumbers = (postName, allowedCount) => {
    const selectedPost = records.find((p) => p.post === postName)
    if (!selectedPost) return { start: "", end: "" }

    // Check if this is an officer post (contains "755")
    const isOfficerPost = postName.includes("755")

    // Get existing allocations for this post in current batch
    const currentBatchKey = `${centerName}_${batch}`
    const existingAllocations = labData.filter((a) => a.post === postName)

    // Check previous batches for this center to get the highest roll number used
    let globalHighestRoll = 0

    // Get all batches for this center
    const centerBatches = centerRecords
      .filter((record) => record.centerName === centerName)
      .map((record) => record.batch)
      .filter((batch, index, self) => self.indexOf(batch) === index)
      .sort()

    // For officer posts, check ALL batches across ALL centers to get the global highest roll
    if (isOfficerPost) {
      // Check all centers and all batches for officer posts
      const allCenterBatches = centerRecords.map((record) => `${record.centerName}_${record.batch}`)

      allCenterBatches.forEach((batchKey) => {
        const batchLabData = JSON.parse(localStorage.getItem(`labData_${batchKey}`)) || []
        batchLabData.forEach((allocation) => {
          // Check if this allocation is for an officer post
          if (allocation.post && allocation.post.includes("755")) {
            const endRoll = Number.parseInt(allocation.endRollNo)
            if (endRoll > globalHighestRoll) {
              globalHighestRoll = endRoll
            }
          }
        })
      })
    } else {
      // For non-officer posts, use the existing logic (center-specific)
      const currentBatchIndex = centerBatches.indexOf(batch)

      // Check all previous batches for this center
      for (let i = 0; i < currentBatchIndex; i++) {
        const prevBatchKey = `${centerName}_${centerBatches[i]}`
        const prevLabData = JSON.parse(localStorage.getItem(`labData_${prevBatchKey}`)) || []

        prevLabData.forEach((allocation) => {
          if (allocation.post === postName) {
            const endRoll = Number.parseInt(allocation.endRollNo)
            if (endRoll > globalHighestRoll) {
              globalHighestRoll = endRoll
            }
          }
        })
      }
    }

    // Check current batch allocations
    existingAllocations.forEach((allocation) => {
      const endRoll = Number.parseInt(allocation.endRollNo)
      if (endRoll > globalHighestRoll) {
        globalHighestRoll = endRoll
      }
    })

    // Calculate next start and end roll numbers
    let nextStart
    if (globalHighestRoll === 0) {
      // No previous allocations, use the start roll from the post
      nextStart = Number.parseInt(selectedPost.startRoll)
    } else {
      // Continue from where previous allocation ended
      nextStart = globalHighestRoll + 1
    }

    const nextEnd = nextStart + Number.parseInt(allowedCount) - 1

    // Check if we exceed the total candidates for this post
    const maxEnd = Number.parseInt(selectedPost.endRoll)
    if (nextEnd > maxEnd) {
      return { start: "", end: "", error: "Exceeds available candidates" }
    }

    return {
      start: nextStart.toString(),
      end: nextEnd.toString(),
    }
  }

  // Add or update lab allocation
  const saveData = () => {
    if (!post || !floor || !lab || !allowed) {
      setErrorMsg("Please fill in all fields")
      return
    }

    if (!centerName || !batch) {
      setErrorMsg("Please select center and batch first")
      return
    }

    const allowedCount = Number.parseInt(allowed)

    // If editing an existing allocation
    if (editingLabIndex !== null) {
      const updatedLabData = [...labData]
      updatedLabData[editingLabIndex] = {
        ...updatedLabData[editingLabIndex],
        post,
        floor,
        lab,
        allowed: allowedCount,
      }

      const batchKey = `${centerName}_${batch}`
      localStorage.setItem(`labData_${batchKey}`, JSON.stringify(updatedLabData))
      setLabData(updatedLabData)
      setEditingLabIndex(null)
    }
    // Adding a new allocation
    else {
      const rollNumbers = getNextRollNumbers(post, allowedCount)

      if (rollNumbers.error) {
        setErrorMsg(rollNumbers.error)
        return
      }

      const newLabData = {
        post,
        floor,
        lab,
        allowed: allowedCount,
        startRollNo: rollNumbers.start,
        endRollNo: rollNumbers.end,
      }

      const updatedLabData = [...labData, newLabData]
      const batchKey = `${centerName}_${batch}`
      localStorage.setItem(`labData_${batchKey}`, JSON.stringify(updatedLabData))
      setLabData(updatedLabData)
    }

    // Reset form fields
    setPost("")
    setFloor("")
    setLab("")
    setAllowed("")
    setErrorMsg("")
  }

  // Edit lab allocation
  const handleEditLab = (index) => {
    const labToEdit = labData[index]

    setPost(labToEdit.post)
    setFloor(labToEdit.floor)
    setLab(labToEdit.lab)
    setAllowed(labToEdit.allowed.toString())

    setEditingLabIndex(index)
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingLabIndex(null)
    setPost("")
    setFloor("")
    setLab("")
    setAllowed("")
    setErrorMsg("")
  }

  // Clear all lab allocations for current batch
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all lab allocations for this batch?")) {
      const batchKey = `${centerName}_${batch}`
      localStorage.removeItem(`labData_${batchKey}`)
      setLabData([])
      handleCancelEdit()
    }
  }

  // Delete a lab allocation
  const handleDeleteRow = (index) => {
    if (confirm("Are you sure you want to delete this lab allocation?")) {
      const updatedLabData = [...labData]
      updatedLabData.splice(index, 1)
      const batchKey = `${centerName}_${batch}`
      localStorage.setItem(`labData_${batchKey}`, JSON.stringify(updatedLabData))
      setLabData(updatedLabData)

      if (editingLabIndex === index) {
        handleCancelEdit()
      } else if (editingLabIndex > index) {
        setEditingLabIndex(editingLabIndex - 1)
      }
    }
  }

  // Move a row up in the table
  const moveRowUp = (index) => {
    if (index === 0) return

    const updatedLabData = [...labData]
    const temp = updatedLabData[index]
    updatedLabData[index] = updatedLabData[index - 1]
    updatedLabData[index - 1] = temp

    setLabData(updatedLabData)
    const batchKey = `${centerName}_${batch}`
    localStorage.setItem(`labData_${batchKey}`, JSON.stringify(updatedLabData))

    if (editingLabIndex === index) {
      setEditingLabIndex(index - 1)
    } else if (editingLabIndex === index - 1) {
      setEditingLabIndex(index)
    }

    setMovingRow(index - 1)
    setTimeout(() => setMovingRow(null), 500)
  }

  // Move a row down in the table
  const moveRowDown = (index) => {
    if (index === labData.length - 1) return

    const updatedLabData = [...labData]
    const temp = updatedLabData[index]
    updatedLabData[index] = updatedLabData[index + 1]
    updatedLabData[index + 1] = temp

    setLabData(updatedLabData)
    const batchKey = `${centerName}_${batch}`
    localStorage.setItem(`labData_${batchKey}`, JSON.stringify(updatedLabData))

    if (editingLabIndex === index) {
      setEditingLabIndex(index + 1)
    } else if (editingLabIndex === index + 1) {
      setEditingLabIndex(index)
    }

    setMovingRow(index + 1)
    setTimeout(() => setMovingRow(null), 500)
  }

  // Show PDF preview
  const handlePreviewPDF = () => {
    if (labData.length > 0) {
      setShowPdfPreview(true)
    } else {
      alert("No data to preview")
    }
  }

  // Get remaining candidates for a post (batch-specific for non-officer posts)
  const getRemainingCandidates = (postName) => {
    const post = records.find((p) => p.post === postName)
    if (!post) return 0

    const totalCandidates = Number.parseInt(post.totalCandidates)

    // Check if this is an officer post
    const isOfficerPost = postName.includes("755")

    let totalAllocated = 0

    if (isOfficerPost) {
      // For officer posts, count allocations across ALL centers and batches
      const allCenterBatches = centerRecords.map((record) => `${record.centerName}_${record.batch}`)

      allCenterBatches.forEach((batchKey) => {
        const batchLabData = JSON.parse(localStorage.getItem(`labData_${batchKey}`)) || []
        batchLabData.forEach((allocation) => {
          if (allocation.post && allocation.post.includes("755")) {
            totalAllocated += Number.parseInt(allocation.allowed)
          }
        })
      })
    } else {
      // For non-officer posts, count allocations across all batches for this center
      const centerBatches = centerRecords
        .filter((record) => record.centerName === centerName)
        .map((record) => record.batch)

      centerBatches.forEach((batchName) => {
        const batchKey = `${centerName}_${batchName}`
        const batchLabData = JSON.parse(localStorage.getItem(`labData_${batchKey}`)) || []
        batchLabData.forEach((allocation) => {
          if (allocation.post === postName) {
            totalAllocated += Number.parseInt(allocation.allowed)
          }
        })
      })
    }

    return totalCandidates - totalAllocated
  }

  // Get remaining candidates for current batch only
  const getCurrentBatchRemaining = (postName) => {
    const post = records.find((p) => p.post === postName)
    if (!post) return 0

    const totalCandidates = Number.parseInt(post.totalCandidates)

    // Check if this is an officer post
    const isOfficerPost = postName.includes("755")

    if (isOfficerPost) {
      // For officer posts, show global remaining
      return getRemainingCandidates(postName)
    } else {
      // For non-officer posts, show only current batch allocations
      const currentBatchAllocated = labData
        .filter((a) => a.post === postName)
        .reduce((sum, a) => sum + Number.parseInt(a.allowed), 0)

      return totalCandidates - currentBatchAllocated
    }
  }

  // Get officer post allocation summary across all batches
  const getOfficerAllocationSummary = () => {
    const officerAllocations = []

    // Get all center-batch combinations
    const allCenterBatches = centerRecords.map((record) => ({
      key: `${record.centerName}_${record.batch}`,
      centerName: record.centerName,
      batch: record.batch,
    }))

    allCenterBatches.forEach(({ key, centerName, batch }) => {
      const batchLabData = JSON.parse(localStorage.getItem(`labData_${key}`)) || []
      batchLabData.forEach((allocation) => {
        if (allocation.post && allocation.post.includes("755")) {
          officerAllocations.push({
            centerName,
            batch,
            post: allocation.post,
            startRoll: allocation.startRollNo,
            endRoll: allocation.endRollNo,
            allocated: allocation.allowed,
          })
        }
      })
    })

    return officerAllocations.sort((a, b) => Number.parseInt(a.startRoll) - Number.parseInt(b.startRoll))
  }

  // Preview next roll numbers
  const previewNextRollNumbers = () => {
    if (!post || !allowed || editingLabIndex !== null) return null

    const preview = getNextRollNumbers(post, Number.parseInt(allowed) || 0)
    if (preview.error) {
      return <span className="text-red-600">{preview.error}</span>
    }

    return (
      <span>
        Start: <strong>{preview.start}</strong> to End: <strong>{preview.end}</strong>
      </span>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">Roll Number Allotment</h2>

      {errorMsg && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-md text-center font-medium">{errorMsg}</div>
      )}

      {/* Center Information Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setCenterFormOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md flex items-center gap-2 font-semibold"
        >
          <MdAdd size={20} /> ADD
        </button>
        <button
          onClick={() => setViewCenterData(!viewCenterData)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md flex items-center gap-2 font-semibold"
        >
          <MdVisibility size={20} /> VIEW
        </button>
      </div>

      {/* Center Selection Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Center</label>
          <select
            value={centerName}
            onChange={(e) => handleCenterChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Select Center</option>
            {availableCenters.map((center, index) => (
              <option key={index} value={center}>
                {center}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Batch</label>
          <select
            value={batch}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            disabled={!centerName}
          >
            <option value="">Select Batch</option>
            {availableBatches.map((batchOption, index) => (
              <option key={index} value={batchOption}>
                {batchOption}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Center Code</label>
          <div className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white">
            {centerCode || "Not selected"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <div className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white">{date || "Not selected"}</div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <div className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white">{time || "Not selected"}</div>
        </div>
      </div>

      {/* Officer Post Summary */}
      {centerName && getOfficerAllocationSummary().length > 0 && (
        <div className="mb-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">Officer Post (755) Global Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="py-2 px-3 text-left">Center</th>
                  <th className="py-2 px-3 text-left">Batch</th>
                  <th className="py-2 px-3 text-left">Post</th>
                  <th className="py-2 px-3 text-left">Start Roll</th>
                  <th className="py-2 px-3 text-left">End Roll</th>
                  <th className="py-2 px-3 text-left">Allocated</th>
                </tr>
              </thead>
              <tbody>
                {getOfficerAllocationSummary().map((allocation, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-yellow-50"}>
                    <td className="py-2 px-3">{allocation.centerName}</td>
                    <td className="py-2 px-3">{allocation.batch}</td>
                    <td className="py-2 px-3">{allocation.post}</td>
                    <td className="py-2 px-3 font-semibold text-green-600">{allocation.startRoll}</td>
                    <td className="py-2 px-3 font-semibold text-green-600">{allocation.endRoll}</td>
                    <td className="py-2 px-3">{allocation.allocated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Center Information Display */}
      {viewCenterData && (
        <div className="overflow-x-auto mb-6 bg-white rounded-md shadow">
          <table className="min-w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700 font-semibold">
              <tr>
                <th className="py-2 px-4 border-b">Center Name</th>
                <th className="py-2 px-4 border-b">Center Code</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Batch</th>
                <th className="py-2 px-4 border-b">Time</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {centerRecords.map((record, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-4">{record.centerName}</td>
                  <td className="py-2 px-4">{record.centerCode}</td>
                  <td className="py-2 px-4">{record.date}</td>
                  <td className="py-2 px-4">{record.batch}</td>
                  <td className="py-2 px-4">{record.time}</td>
                  <td className="py-2 px-4 flex gap-2 justify-center">
                    <button
                      onClick={() => editCenterRecord(idx)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCenterRecord(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {centerRecords.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-400">
                    No center records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Center Information Modal */}
      {centerFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCenterIndex !== null ? "Edit Center Information" : "Add Center Information"}
            </h3>
            <div className="grid gap-4">
              <div>
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
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setCenterFormOpen(false)
                  setEditingCenterIndex(null)
                  setCenterName("")
                  setCenterCode("")
                  setDate("")
                  setBatch("")
                  setTime("")
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={saveCenterInfo}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editingCenterIndex !== null ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exam Posts Management */}
      {centerName && batch && (
        <div className="mb-8">
          <div className="bg-white p-6 rounded-md shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Exam Posts for {centerName} - Batch {batch}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
                <input
                  type="text"
                  name="post"
                  value={formData.post}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Candidates</label>
                <input
                  type="number"
                  name="totalCandidates"
                  value={formData.totalCandidates}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Roll No.</label>
                <input
                  type="text"
                  name="startRoll"
                  value={formData.startRoll}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Roll No.</label>
                <input
                  type="text"
                  name="endRoll"
                  value={formData.endRoll}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
              <button
                onClick={handleAddOrUpdate}
                className={`w-full md:w-auto px-6 py-2 text-white rounded-md shadow-md text-lg font-semibold
                  ${editIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"}`}
              >
                {editIndex !== null ? "✓ Update" : "+ Add"}
              </button>

              <button
                onClick={() => setShowTable(!showTable)}
                className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-md font-medium"
              >
                {showTable ? "Hide Post" : "View Post"}
              </button>
            </div>
          </div>

          {/* Exam Posts Table */}
          {showTable && (
            <div className="overflow-x-auto mb-8 bg-white rounded-md shadow">
              <table className="min-w-full text-sm text-center">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="py-2 px-4 border-b">Post</th>
                    <th className="py-2 px-4 border-b">Total</th>
                    <th className="py-2 px-4 border-b">Start Roll</th>
                    <th className="py-2 px-4 border-b">End Roll</th>
                    <th className="py-2 px-4 border-b">Remaining</th>
                    <th className="py-2 px-4 border-b">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2 px-4">{rec.post}</td>
                      <td className="py-2 px-4">{rec.totalCandidates}</td>
                      <td className="py-2 px-4">{rec.startRoll}</td>
                      <td className="py-2 px-4">{rec.endRoll}</td>
                      <td className="py-2 px-4">
                        <div className="text-center">
                          <div className="font-semibold text-blue-600">Global: {getRemainingCandidates(rec.post)}</div>
                          {!rec.post.includes("755") && (
                            <div className="text-sm text-gray-500">
                              Batch {batch}: {getCurrentBatchRemaining(rec.post)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4 flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(idx)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-4 text-gray-400">
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Lab Allocation Form */}
      {centerName && batch && (
        <div ref={formRef} className="bg-white p-6 rounded-md shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Lab Allocation for {centerName} - Batch {batch}
          </h3>

          <div className="flex flex-col md:flex-row gap-4 mb-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Post</label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2"
                value={post}
                onChange={(e) => setPost(e.target.value)}
              >
                <option value="">Select Post</option>
                {records.map((record, index) => (
                  <option key={index} value={record.post}>
                    {record.post} (Remaining: {getRemainingCandidates(record.post)})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>

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
              <label className="block text-sm font-medium text-gray-700 mb-1">Allot</label>
              <input
                type="text"
                value={allowed}
                onChange={(e) => setAllowed(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {editingLabIndex !== null && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md shadow-md font-semibold"
              >
                Cancel
              </button>
            )}

            <button
              onClick={saveData}
              className={`text-white px-6 py-2 rounded-md shadow-md font-semibold ${
                editingLabIndex !== null ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {editingLabIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Roll Number Preview */}
      {post && allowed && editingLabIndex === null && centerName && batch && (
        <div className="p-3 bg-blue-50 rounded-lg mb-6">
          <p className="text-sm text-blue-700">
            <strong>Preview:</strong> Roll numbers: {previewNextRollNumbers()}
          </p>
        </div>
      )}

      {/* Lab Allocations Table */}
      {labData.length > 0 && (
        <div className="overflow-x-auto mt-8 max-w-4xl mx-auto">
          <div ref={tableRef}>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
              <thead className="bg-green-200">
                <tr>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Move</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Sr No</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Post</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Floor</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">LAB</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Allot</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">Start Roll</th>
                  <th className="px-3 py-3 text-left text-sm font-semibold text-gray-700 border-b">End Roll</th>
                  <th className="px-3 py-3 text-center text-sm font-semibold text-gray-700 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {labData.map((data, index) => (
                  <tr
                    key={index}
                    className={`transition ${
                      editingLabIndex === index
                        ? "bg-yellow-100 border-yellow-300 shadow-md"
                        : movingRow === index
                          ? "bg-blue-100 border-blue-300"
                          : "hover:bg-green-50"
                    }`}
                  >
                    <td className="px-3 py-3 border-b">
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveRowUp(index)
                          }}
                          disabled={index === 0}
                          className={`p-1 rounded-full ${
                            index === 0 ? "text-gray-300 cursor-not-allowed" : "text-blue-600 hover:bg-blue-100"
                          }`}
                          title="Move Up"
                        >
                          <MdArrowUpward size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveRowDown(index)
                          }}
                          disabled={index === labData.length - 1}
                          className={`p-1 rounded-full ${
                            index === labData.length - 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-blue-600 hover:bg-blue-100"
                          }`}
                          title="Move Down"
                        >
                          <MdArrowDownward size={18} />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-3 border-b">{index + 1}</td>
                    <td className="px-3 py-3 border-b" onClick={() => handleEditLab(index)}>
                      {data.post}
                    </td>
                    <td className="px-3 py-3 border-b" onClick={() => handleEditLab(index)}>
                      {data.floor}
                    </td>
                    <td className="px-3 py-3 border-b" onClick={() => handleEditLab(index)}>
                      {data.lab}
                    </td>
                    <td className="px-3 py-3 border-b" onClick={() => handleEditLab(index)}>
                      {data.allowed}
                    </td>
                    <td
                      className="px-3 py-3 border-b font-semibold text-green-600"
                      onClick={() => handleEditLab(index)}
                    >
                      {data.startRollNo}
                    </td>
                    <td
                      className="px-3 py-3 border-b font-semibold text-green-600"
                      onClick={() => handleEditLab(index)}
                    >
                      {data.endRollNo}
                    </td>
                    <td className="px-3 py-3 border-b text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditLab(index)
                          }}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                          title="Edit"
                        >
                          <MdEdit size={18} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteRow(index)
                          }}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                          title="Delete"
                        >
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={handlePreviewPDF}
              className="bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Preview PDF for Batch {batch}
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
