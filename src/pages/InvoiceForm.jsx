import { useState } from "react"

export default function InvoiceForm({ onSave }) {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    invoiceDate: "",
    departmentName: "",
    departmentAddress: "",
    bankName: "",
    branch: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
  })

  const [entry, setEntry] = useState({
    description: "",
    date: "",
    candidateSystem: "",
    rate: "",
    amount: "",
  })

  const [entries, setEntries] = useState([])
  const [error, setError] = useState("")

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleEntryChange = (e) => {
    const updated = { ...entry, [e.target.name]: e.target.value }

    if (e.target.name === "candidateSystem" || e.target.name === "rate") {
      const candidateSystem =
        e.target.name === "candidateSystem"
          ? Number.parseFloat(e.target.value || 0)
          : Number.parseFloat(entry.candidateSystem || 0)

      const rate =
        e.target.name === "rate" ? Number.parseFloat(e.target.value || 0) : Number.parseFloat(entry.rate || 0)

      updated.amount = (candidateSystem * rate).toFixed(2)
    }

    setEntry(updated)
  }

 const handleSave = () => {
 
  for (const key in formData) {
    if (!formData[key]) {
      setError("Please fill in all form fields.")
      return
    }
  }

 
  if (!entry.description || !entry.date || !entry.candidateSystem || !entry.rate) {
    setError("Please fill in all line item fields before saving.")
    return
  }

  
  const candidateSystem = Number.parseFloat(entry.candidateSystem || 0)
  const rate = Number.parseFloat(entry.rate || 0)
  const amount = (candidateSystem * rate).toFixed(2)

  const newEntry = {
    ...entry,
    amount
  }

  const updatedEntries = [...entries, newEntry]

  const invoice = {
    id: Date.now(),
    ...formData,
    items: updatedEntries,
    amount: updatedEntries.reduce((sum, item) => sum + Number.parseFloat(item.amount || 0), 0).toFixed(2),
  }

  onSave(invoice)

  // Reset everything
  setFormData({
    invoiceNo: "",
    invoiceDate: "",
    departmentName: "",
    departmentAddress: "",
    bankName: "",
    branch: "",
    accountNo: "",
    ifscCode: "",
    panNo: "",
  })

  setEntries([])
  setEntry({
    description: "",
    date: "",
    candidateSystem: "",
    rate: "",
    amount: "",
  })

  setError("")
}

  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
      {error && <div className="text-red-600 font-semibold mb-2">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          name="invoiceNo"
          placeholder="Invoice No"
          value={formData.invoiceNo}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Invoice Date"
          name="invoiceDate"
          value={formData.invoiceDate}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="departmentName"
          placeholder="Department Name"
          value={formData.departmentName}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="departmentAddress"
          placeholder="Department Address"
          value={formData.departmentAddress}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
      </div>

      <h3 className="font-semibold mt-4 mb-2">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          name="bankName"
          placeholder="Bank Name"
          value={formData.bankName}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="branch"
          placeholder="Branch"
          value={formData.branch}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="accountNo"
          placeholder="Account No"
          value={formData.accountNo}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="ifscCode"
          placeholder="IFSC Code"
          value={formData.ifscCode}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
        <input
          name="panNo"
          placeholder="PAN No"
          value={formData.panNo}
          onChange={handleFormChange}
          className="p-2 border rounded"
        />
      </div>

      <h3 className="font-semibold mt-4 mb-2">Line Items</h3>

      {entries.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Added Items:</h4>
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Count</th>
                <th className="p-2 border">Rate</th>
                <th className="p-2 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((item, index) => (
                <tr key={index}>
                  <td className="p-2 border">{item.description}</td>
                  <td className="p-2 border">{item.date}</td>
                  <td className="p-2 border">{item.candidateSystem}</td>
                  <td className="p-2 border">{item.rate}</td>
                  <td className="p-2 border">{item.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-2">
        <input
          name="description"
          placeholder="Description"
          value={entry.description}
          onChange={handleEntryChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Date"
          name="date"
          value={entry.date}
          onChange={handleEntryChange}
          className="p-2 border rounded"
        />
        <input
          name="candidateSystem"
          placeholder="Count No"
          type="number"
          value={entry.candidateSystem}
          onChange={handleEntryChange}
          className="p-2 border rounded"
        />
        <input
          name="rate"
          placeholder="Rate"
          type="number"
          value={entry.rate}
          onChange={handleEntryChange}
          className="p-2 border rounded"
        />
        <input
          name="amount"
          placeholder="Amount"
          value={entry.amount}
          readOnly
          className="p-2 border rounded bg-gray-100"
        />
      </div>
     
      <button
        onClick={handleSave}
        className="mt-2 w-full cursor-pointer   bg-green-600 text-white py-2 rounded hover:bg-green-700 text-lg"
      >
        Save Invoice
      </button>
    </div>
  )
}
