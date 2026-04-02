"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Category, CATEGORY_COLORS, CATEGORIES } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface Props {
  categoryTotals: Record<Category, number>;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900 text-white px-3 py-2 rounded-xl shadow-lg text-sm">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-indigo-300">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function CategoryChart({ categoryTotals }: Props) {
  const data = CATEGORIES.filter((c) => categoryTotals[c] > 0).map((c) => ({
    name: c,
    value: parseFloat(categoryTotals[c].toFixed(2)),
    color: CATEGORY_COLORS[c],
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center justify-center h-64">
        <p className="text-slate-400 text-sm">No spending data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Spending by Category</h3>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="text-xs text-slate-600">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
