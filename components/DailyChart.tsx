"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

interface Props {
  data: { day: number; total: number }[];
  month: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-sm">
        <p className="font-medium">Day {label}</p>
        <p className="text-indigo-300">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function DailyChart({ data, month }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Daily Spending — {month}</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#e2e8f0" }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#areaGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#6366f1" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
