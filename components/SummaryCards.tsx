"use client";

import { SummaryStats } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingBag, Hash } from "lucide-react";

interface Props {
  stats: SummaryStats;
}

export default function SummaryCards({ stats }: Props) {
  const monthChange =
    stats.totalLastMonth > 0
      ? ((stats.totalThisMonth - stats.totalLastMonth) / stats.totalLastMonth) * 100
      : null;

  const cards = [
    {
      title: "This Month",
      value: formatCurrency(stats.totalThisMonth),
      sub:
        monthChange !== null ? (
          <span className={`flex items-center gap-1 text-xs ${monthChange >= 0 ? "text-red-500" : "text-emerald-500"}`}>
            {monthChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(monthChange).toFixed(1)}% vs last month
          </span>
        ) : (
          <span className="text-xs text-slate-400">No prior month data</span>
        ),
      icon: Calendar,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "All Time Total",
      value: formatCurrency(stats.totalAll),
      sub: <span className="text-xs text-slate-400">{stats.expenseCount} expenses recorded</span>,
      icon: DollarSign,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Daily Average",
      value: formatCurrency(stats.averagePerDay),
      sub: <span className="text-xs text-slate-400">Based on this month</span>,
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Top Category",
      value: stats.topCategory ?? "—",
      sub: stats.topCategory ? (
        <span className="text-xs text-slate-400">
          {formatCurrency(stats.categoryTotals[stats.topCategory])} total
        </span>
      ) : (
        <span className="text-xs text-slate-400">No expenses yet</span>
      ),
      icon: ShoppingBag,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}>
              <card.icon className={`w-5 h-5 ${card.iconColor}`} />
            </div>
          </div>
          {card.sub}
        </div>
      ))}
    </div>
  );
}
