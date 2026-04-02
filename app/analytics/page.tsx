"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/lib/hooks/useExpenses";
import { computeStats, getMonthlyData, getDailyData, formatCurrency } from "@/lib/utils";
import { CATEGORIES, CATEGORY_COLORS, Category } from "@/lib/types";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import DailyChart from "@/components/DailyChart";
import { format } from "date-fns";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function AnalyticsPage() {
  const { expenses, isLoaded } = useExpenses();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const stats = useMemo(() => computeStats(expenses), [expenses]);
  const monthlyData = useMemo(() => getMonthlyData(expenses, 6), [expenses]);
  const dailyData = useMemo(
    () => getDailyData(expenses, selectedYear, selectedMonth),
    [expenses, selectedYear, selectedMonth]
  );

  const radarData = useMemo(() =>
    CATEGORIES.map((cat) => ({
      category: cat,
      amount: parseFloat((stats.categoryTotals[cat] ?? 0).toFixed(2)),
    })), [stats]);

  const topExpenses = useMemo(
    () => [...expenses].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [expenses]
  );

  const monthName = format(new Date(selectedYear, selectedMonth, 1), "MMMM yyyy");

  // Month selector options (last 12 months)
  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      return {
        label: format(d, "MMMM yyyy"),
        month: d.getMonth(),
        year: d.getFullYear(),
      };
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">Deep dive into your spending patterns.</p>
      </div>

      {/* Monthly + Category charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingChart data={monthlyData} />
        <CategoryChart categoryTotals={stats.categoryTotals} />
      </div>

      {/* Daily breakdown */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-semibold text-slate-800">Daily Breakdown</h2>
          <select
            value={`${selectedYear}-${selectedMonth}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              setSelectedYear(y);
              setSelectedMonth(m);
            }}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          >
            {monthOptions.map((o) => (
              <option key={o.label} value={`${o.year}-${o.month}`}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <DailyChart data={dailyData} month={monthName} />
      </div>

      {/* Radar + Top expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Radar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Spending Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <Radar
                dataKey="amount"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(v) => [formatCurrency(Number(v ?? 0)), "Spending"]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "13px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Top expenses */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Top 5 Largest Expenses</h3>
          {topExpenses.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {topExpenses.map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{e.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: CATEGORY_COLORS[e.category] }}
                      />
                      <span className="text-xs text-slate-400">{e.category}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 flex-shrink-0">
                    {formatCurrency(e.amount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category breakdown table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Category Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="text-right py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider">% of Spending</th>
                <th className="text-left py-2 px-2 text-xs font-medium text-slate-500 uppercase tracking-wider w-40">Share</th>
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((cat) => {
                const amt = stats.categoryTotals[cat] ?? 0;
                const pct = stats.totalAll > 0 ? (amt / stats.totalAll) * 100 : 0;
                return (
                  <tr key={cat} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                        />
                        <span className="font-medium text-slate-800">{cat}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-800">
                      {formatCurrency(amt)}
                    </td>
                    <td className="py-3 px-2 text-right text-slate-500">
                      {pct.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2">
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CATEGORY_COLORS[cat],
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-slate-200">
                <td className="py-3 px-2 font-semibold text-slate-800">Total</td>
                <td className="py-3 px-2 text-right font-bold text-slate-900">{formatCurrency(stats.totalAll)}</td>
                <td className="py-3 px-2 text-right text-slate-500">100%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
