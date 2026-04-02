"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useExpenses } from "@/lib/hooks/useExpenses";
import ExpenseForm from "@/components/ExpenseForm";
import { ExpenseFormData } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { expenses, isLoaded, updateExpense } = useExpenses();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const expense = expenses.find((e) => e.id === id);
  if (!expense) return notFound();

  function handleSubmit(data: ExpenseFormData) {
    updateExpense(id, data);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to expenses
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Expense</h1>
        <p className="text-slate-500 text-sm mt-1">Update the details below.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <ExpenseForm
          onSubmit={handleSubmit}
          initialData={expense}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
