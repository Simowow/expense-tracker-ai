"use client";

import Link from "next/link";
import { useExpenses } from "@/lib/hooks/useExpenses";
import ExpenseList from "@/components/ExpenseList";
import { PlusCircle } from "lucide-react";

export default function ExpensesPage() {
  const { expenses, isLoaded, deleteExpense } = useExpenses();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
          <p className="text-slate-500 text-sm mt-1">{expenses.length} total expenses recorded</p>
        </div>
        <Link
          href="/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
        >
          <PlusCircle className="w-4 h-4" />
          Add Expense
        </Link>
      </div>

      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  );
}
