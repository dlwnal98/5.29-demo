"use client";

import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  time: number;
  value: number;
};

type UsageGraphProps = {
  title: string;
  color: {
    stroke: string;
    fill: string;
  };
  generator: () => number;
};

function UsageGraph({ title, color, generator }: UsageGraphProps) {
  const MAX_POINTS = 60;
  const [data, setData] = useState<DataPoint[]>(
    Array.from({ length: MAX_POINTS }, (_, i) => ({
      time: i - MAX_POINTS + 1,
      value: generator(),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const nextTime = prev[prev.length - 1].time + 1;
        return [...prev.slice(1), { time: nextTime, value: generator() }];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [generator]);

  return (
    <div className="mb-6">
      <h3 className="text-[12px] font-medium text-gray-700 mb-1">{title}</h3>
      <div className="h-60 w-full bg-white rounded-lg shadow">
        <ResponsiveContainer width="100%" height="100%" className="pr-5 pt-4">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tickFormatter={(v) => `${v % 60}s`}
              stroke="#9ca3af"
              className="text-[12px]"
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              stroke="#9ca3af"
              className="text-[12px]"
            />
            <Tooltip formatter={(v: number) => `${v.toFixed(1)}%`} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color.stroke}
              fill={color.fill}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function SystemUsageGraphs() {
  return (
    <div className="w-full p-4 bg-blue-50 rounded-lg">
      <UsageGraph
        title="CPU"
        color={{ stroke: "#3b82f6", fill: "#bfdbfe" }} // blue
        generator={() => Math.random() * 50 + 10}
      />
      <UsageGraph
        title="Memory"
        color={{ stroke: "#16a34a", fill: "#bbf7d0" }} // green
        generator={() => Math.random() * 60 + 20}
      />
      <UsageGraph
        title="Disk"
        color={{ stroke: "#f97316", fill: "#fed7aa" }} // orange
        generator={() => Math.random() * 10 + 1}
      />
    </div>
  );
}
