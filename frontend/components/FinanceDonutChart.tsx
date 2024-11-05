"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import React from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface FinanceDonutChartProps {
  data: number[];
  labels: string[];
  colors: string[];
  children: React.ReactNode;
}

const FinanceDonutChart: React.FC<FinanceDonutChartProps> = ({
  data,
  labels,
  colors,
  children,
}) => {
  const chartData = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: colors,
        hoverBackgroundColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: "70%",
  };

  return (
    <div className="w-full h-full flex justify-start items-center gap-2">
      <div className="h-full w-1/2">
        <Doughnut data={chartData} options={options} className="!w-full !h-full" />
      </div>
      {children}
    </div>
  );
};

export default FinanceDonutChart;
