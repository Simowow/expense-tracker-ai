"use client";

import Link from "next/link";
import { Expense } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import { ArrowRight } from "lucide-react";

interface Props {
  expenses: Expense[];
}

export default function RecentExpenses({ expenses }: Props) {
  const recent = expenses.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Recent Expenses</h3>
        <Link
          href="/expenses"
          className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      {recent.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No expenses yet.{" "}
          <Link href="/add" className="text-indigo-600 font-medium hover:underline">
            Add one
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((e) => (
            <div key={e.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{e.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <CategoryBadge category={e.category} />
                  <span className="text-xs text-slate-400">{formatDate(e.date)}</span>
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
  );
}
