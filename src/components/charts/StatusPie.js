import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusPie({ completed, ongoing, delayed }) {
  const data = {
    labels: ["Completed", "Ongoing", "Delayed"],
    datasets: [
      {
        data: [completed, ongoing, delayed],
        backgroundColor: ["#16a34a", "#2563eb", "#dc2626"],
      },
    ],
  };

  return <Pie data={data} />;
}
