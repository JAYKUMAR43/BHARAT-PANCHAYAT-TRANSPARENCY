import React from "react";
import { MdDashboard, MdWork, MdReport, MdLogout } from "react-icons/md";

export default function Sidebar({ current, setCurrent, setRole }) {
  const menu = [
    { key: "dashboard", label: "Dashboard / डैशबोर्ड", icon: <MdDashboard /> },
    { key: "projects", label: "Projects / परियोजनाएं", icon: <MdWork /> },
    { key: "complaints", label: "Complaints / शिकायतें", icon: <MdReport /> },
  ];

  return (
    <div className="w-60 min-h-screen bg-[#00796B] text-white p-4 shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">Officer</h2>

      {menu.map((m) => (
        <button
          key={m.key}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left 
            ${current === m.key ? "bg-[#004D40] shadow-md" : "hover:bg-[#00695C]"}`}
          onClick={() => setCurrent(m.key)}
        >
          {m.icon}
          {m.label}
        </button>
      ))}

      <div className="border-t border-white/40 my-4"></div>

      <button
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-[#E53935] hover:bg-red-700 text-white"
        onClick={() => setRole(null)}
      >
        <MdLogout /> Logout / लॉगआउट
      </button>
    </div>
  );
}
