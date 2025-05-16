import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Welcome Box */}
        <div
          onClick={() => navigate('/add-welcome-image')}
          className="bg-blue-200 border border-blue-400 rounded-2xl shadow-xl p-6 w-60 h-48 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-blue-300 transition duration-300 hover:scale-105"
        >
          <h2 className="text-xl font-bold text-blue-900">Welcome</h2>
        </div>

        {/* Reporting Time Box */}
        <div
          onClick={() => navigate('/reporting-time')}
          className="bg-green-200 border border-green-400 rounded-2xl shadow-xl p-6 w-60 h-48 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-green-300 transition duration-300 hover:scale-105"
        >
          <h2 className="text-xl font-bold text-green-900">Reporting Time</h2>
        </div>

        {/* Roll No Allotment Box */}
        <div
          onClick={() => navigate('/roll-no-allotment')}
          className="bg-yellow-200 border border-yellow-400 rounded-2xl shadow-xl p-6 w-60 h-48 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-yellow-300 transition duration-300 hover:scale-105"
        >
          <h2 className="text-xl font-bold text-yellow-900">Roll No Allotment</h2>
        </div>

          <div
          onClick={() => navigate('/invoice-format')}
          className="bg-red-200 border border-red-400 rounded-2xl shadow-xl p-6 w-60 h-48 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-red-300 transition duration-300 hover:scale-105"
        >
          <h2 className="text-xl font-bold text-red-900">Invoice Format</h2>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
