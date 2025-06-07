export default function InvoiceTable({ invoices, onClearAll }) {
  if (invoices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No invoices saved yet.</p>
        <button
          onClick={onClearAll}
          className="mt-4 bg-red-600 cursor-pointer text-white py-2 px-4 rounded opacity-50 "
          disabled
        >
          Clear All
        </button>
      </div>
    )
  }
  const allItems = invoices.flatMap((invoice) => invoice.items)

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-4 border">Sr No</th>
              <th className="py-2 px-4 border">Discripation</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Candidates/System/Count</th>
              <th className="py-2 px-4 border">Rate</th>
              <th className="py-2 px-4 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {allItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{item.description}</td>
                <td className="py-2 px-4 border">{item.date}</td>
                <td className="py-2 px-4 border">{item.candidateSystem}</td>
                <td className="py-2 px-4 border">{item.rate}</td>
                <td className="py-2 px-4 border">₹ {item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between p-4">
        <button
          onClick={onClearAll}
          className="bg-red-600 cursor-pointer  text-white py-2 px-4 rounded hover:bg-red-700"
        >
          Clear All
        </button>
      </div>
    </div>
  )
}
