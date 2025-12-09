import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ProgressLine({ timeline }) {
  const labels = timeline.map((p) => p.name);
  const progress = timeline.map((p) => p.progress_percent);

  const data = {
    labels,
    datasets: [
      {
        label: "Progress %",
        data: progress,
        borderColor: "#ea580c",
        tension: 0.3,
      },
    ],
  };

  return <Line data={data} />;
}
