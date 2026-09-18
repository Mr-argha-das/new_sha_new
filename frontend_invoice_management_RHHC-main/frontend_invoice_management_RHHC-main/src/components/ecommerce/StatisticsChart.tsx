"use client";
import React from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

// Dynamically import ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface StatisticsChartProps {
  chartData: Record<string, number>;
  title?: string;
  subtitle?: string;
  seriesName?: string;
}

export default function StatisticsChart({
  chartData,
  title,
  subtitle,
  seriesName,
}: StatisticsChartProps) {
  let categories: string[] = [];
  let values: number[] = [];
  if (chartData) {
    categories = Object.keys(chartData);
    values = Object.values(chartData);

  }

  const options: ApexOptions = {
    legend: { show: false },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },   // disable zooming
      selection: { enabled: false },
    },
    stroke: {
      curve: "straight",
      width: [2],
    },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "yyyy-MM" },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
      title: { text: "" },
    },
  };

  const series = [
    {
      name: seriesName ?? "Invoices",
      data: values,
    },
  ];

  const chartTitle = title ?? "Monthly Invoices";
  const chartSubtitle = subtitle ?? "(default 6 month)";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            {chartTitle}
          </h3>
          {chartSubtitle ? (
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {chartSubtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}

          />
        </div>
      </div>
    </div>
  );
}
