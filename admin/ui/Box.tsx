// components/ui/Box.tsx
import React from 'react';

interface BoxProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgColor?: string;
}

const Box: React.FC<BoxProps> = ({ title, value, icon, trend, bgColor = "bg-white" }) => {
  return (
    <div className={`${bgColor} rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-black/5 rounded-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

export default Box;