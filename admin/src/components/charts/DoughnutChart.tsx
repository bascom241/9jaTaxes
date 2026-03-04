// components/charts/DoughnutChart.tsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data}) => {
  const colors = [
    '#000000',
    '#333333',
    '#666666',
    '#999999',
    '#cccccc',
    '#e5e5e5'
  ];

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: colors.slice(0, data.labels.length),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#000',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="w-full h-75">
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DoughnutChart;