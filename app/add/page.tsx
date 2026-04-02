"use client";

import { useRouter } from "next/navigation";
import { useExpenses } from "@/lib/hooks/useExpenses";
import ExpenseForm from "@/components/ExpenseForm";
import { ExpenseFormData } from "@/lib/types";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddExpensePage() {
  const { addExpense } = useExpenses();
  const router = useRouter();

  function handleSubmit(data: ExpenseFormData) {
    addExpense(data);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Add Expense</h1>
        <p className="text-slate-500 text-sm mt-1">Record a new expense to track your spending.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <ExpenseForm onSubmit={handleSubmit} submitLabel="Add Expense" />
      </div>
    </div>
  );
}
