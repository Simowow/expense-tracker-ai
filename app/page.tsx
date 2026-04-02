"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useExpenses } from "@/lib/hooks/useExpenses";
import { computeStats, getMonthlyData } from "@/lib/utils";
import SummaryCards from "@/components/SummaryCards";
import SpendingChart from "@/components/SpendingChart";
import CategoryChart from "@/components/CategoryChart";
import RecentExpenses from "@/components/RecentExpenses";
import { PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const { expenses, isLoaded } = useExpenses();

  const stats = useMemo(() => computeStats(expenses), [expenses]);
  const monthlyData = useMemo(() => getMonthlyData(expenses, 6), [expenses]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back — here's your spending overview.</p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <PlusCircle className="w-4 h-4" />
          Add Expense
        </Link>
      </div>

      {/* Summary cards */}
      <SummaryCards stats={stats} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendingChart data={monthlyData} />
        <CategoryChart categoryTotals={stats.categoryTotals} />
      </div>

      {/* Recent expenses */}
      <RecentExpenses expenses={expenses} />
    </div>
  );
}
