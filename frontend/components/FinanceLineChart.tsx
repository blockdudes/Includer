"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  CategoryScale,
  TooltipItem,
} from "chart.js";
import React from "react";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FinanceLineChartProps {
  data: number[];
  labels: string[];
}

const FinanceLineChart: React.FC<FinanceLineChartProps> = ({
  data,
  labels,
}) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        borderColor: ["#03A9F5"],
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem: TooltipItem<"line">) => {
            return `Closing Balance: $${tooltipItem.formattedValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        display: true,
        title: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: "white",
          callback: (value: string | number) => {
            return `$${value}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full gap-2">
      <Line data={chartData} options={options} className="!w-full !h-full" />
    </div>
  );
};

export default FinanceLineChart;
