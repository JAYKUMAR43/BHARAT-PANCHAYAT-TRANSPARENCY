import React from "react";

export default function OfficerDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#00796B]">
        Dashboard / डैशबोर्ड
      </h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-[#004D40]">Total Projects</h3>
          <p className="text-3xl font-bold text-[#00796B]">21</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-[#004D40]">Complaints</h3>
          <p className="text-3xl font-bold text-[#E53935]">5</p>
        </div>

        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-xl font-bold text-[#004D40]">Completed</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
      </div>
    </div>
  );
}
