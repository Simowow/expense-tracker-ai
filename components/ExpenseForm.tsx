"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, CATEGORIES, Expense, ExpenseFormData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Expense;
  submitLabel?: string;
}

const today = new Date().toISOString().slice(0, 10);

const emptyForm: ExpenseFormData = {
  date: today,
  amount: "",
  category: "Food",
  description: "",
};

interface Errors {
  date?: string;
  amount?: string;
  description?: string;
}

export default function ExpenseForm({ onSubmit, initialData, submitLabel = "Add Expense" }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<ExpenseFormData>(emptyForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date,
        amount: initialData.amount.toString(),
        category: initialData.category,
        description: initialData.description,
      });
    }
  }, [initialData]);

  function validate(): boolean {
    const e: Errors = {};
    if (!form.date) e.date = "Date is required";
    const amt = parseFloat(form.amount);
    if (!form.amount || isNaN(amt)) e.amount = "Enter a valid amount";
    else if (amt <= 0) e.amount = "Amount must be greater than 0";
    else if (amt > 1_000_000) e.amount = "Amount seems too large";
    if (!form.description.trim()) e.description = "Description is required";
    else if (form.description.trim().length < 2) e.description = "Description too short";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;
    onSubmit(form);
    setToast(initialData ? "Expense updated!" : "Expense added!");
    setTimeout(() => {
      setToast(null);
      if (!initialData) {
        setForm({ ...emptyForm, date: today });
        setSubmitted(false);
        setErrors({});
      } else {
        router.push("/expenses");
      }
    }, 1200);
  }

  function field(key: keyof ExpenseFormData) {
    return {
      value: form[key],
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }));
        if (submitted) setErrors((prev) => ({ ...prev, [key]: undefined }));
      },
    };
  }

  const inputBase =
    "w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white";
  const inputOk = "border-slate-200";
  const inputErr = "border-red-400 bg-red-50";

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-4 h-4" />
          {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
          <input
            type="date"
            className={`${inputBase} ${errors.date ? inputErr : inputOk}`}
            max={today}
            {...field("date")}
          />
          {errors.date && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.date}</p>}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">$</span>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`${inputBase} pl-8 ${errors.amount ? inputErr : inputOk}`}
              {...field("amount")}
            />
          </div>
          {errors.amount && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.amount}</p>}
          {form.amount && !errors.amount && !isNaN(parseFloat(form.amount)) && (
            <p className="mt-1 text-xs text-slate-400">{formatCurrency(parseFloat(form.amount))}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
          <select className={`${inputBase} ${inputOk} cursor-pointer`} {...field("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
          <textarea
            rows={3}
            placeholder="What was this expense for?"
            className={`${inputBase} resize-none ${errors.description ? inputErr : inputOk}`}
            value={form.description}
            onChange={(e) => {
              setForm((f) => ({ ...f, description: e.target.value }));
              if (submitted) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{errors.description}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400 text-right">{form.description.length}/200</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm shadow-indigo-200"
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
