import React, { useEffect, useState } from "react";
import { fetchVillageDashboard } from "../api";
import StatusPie from "./charts/StatusPie";
import BudgetBar from "./charts/BudgetBar";
import ProgressLine from "./charts/ProgressLine";
import { motion } from "framer-motion";
import { FaChartPie } from "react-icons/fa";

export default function Dashboard({ villageId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDash = async () => {
      if (!villageId) return;

      setLoading(true);
      try {
        const res = await fetchVillageDashboard(villageId);
        setData(res);
      } catch (err) {
        console.error("📌 Dashboard fetch error:", err);
      }
      setLoading(false);
    };

    loadDash();
  }, [villageId]);

  if (!villageId) return <p className="text-gray-600">📍 Please select a village</p>;
  if (loading || !data) return <p>Loading dashboard...</p>;

  const list = data?.project_list || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 space-y-6"
    >
      <div className="flex items-center gap-3">
        <FaChartPie className="text-blue-600 text-2xl" />
        <h2 className="text-xl font-bold text-blue-600">Village Dashboard</h2>
      </div>

      {/* Summary Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="Total" value={data.total_projects} />
        <Card title="Completed" value={data.completed_projects} />
        <Card title="Ongoing" value={data.ongoing_projects} />
        <Card title="Delayed" value={data.delayed_projects} />
        <Card title="Avg Progress" value={`${data.avg_progress}%`} />
        <Card title="Total Budget" value={`₹${data.total_budget}`} />
        <Card title="Total Spent" value={`₹${data.total_spent}`} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-4 bg-white rounded-xl shadow-card border h-[350px]">
          <StatusPie
            completed={data.completed_projects}
            ongoing={data.ongoing_projects}
            delayed={data.delayed_projects}
          />
        </div>

        <div className="md:col-span-2 p-4 bg-white rounded-xl shadow-card border h-[350px]">
          <BudgetBar projects={list} />
        </div>

        <div className="md:col-span-3 p-4 bg-white rounded-xl shadow-card border h-[350px]">
          <ProgressLine timeline={list} />
        </div>
      </div>

      {/* PROJECT DETAILS */}
      <h3 className="text-2xl font-bold mt-6">Project Details</h3>
      <div className="space-y-3">
        {list.map((p) => (
          <div key={p.id} className="p-4 bg-white rounded-xl shadow border">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p>Status: {p.status}</p>
            <p>Start Year: {p.start_year || "N/A"}</p>
            <p>Duration: {p.duration_months ? `${p.duration_months} months` : "N/A"}</p>
            <p>Risk Level: {p.risk_level || "Unknown"}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function Card({ title, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="p-4 bg-white rounded-xl shadow border"
    >
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-xl font-semibold">{value}</div>
    </motion.div>
  );
}
