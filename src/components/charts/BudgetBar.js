import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BudgetBar({ projects }) {
  const labels = projects.map((p) => p.name);
  const budget = projects.map((p) => p.budget);
  const spent = projects.map((p) => p.spent);

  const data = {
    labels,
    datasets: [
      {
        label: "Budget",
        data: budget,
        backgroundColor: "#2563eb",
      },
      {
        label: "Spent",
        data: spent,
        backgroundColor: "#16a34a",
      },
    ],
  };

  return <Bar data={data} />;
}
