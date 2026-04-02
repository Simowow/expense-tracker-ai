"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Expense, FilterState } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import FilterBar from "./FilterBar";
import { Pencil, Trash2, Download, ChevronDown, ChevronUp } from "lucide-react";
import { exportToCSV } from "@/lib/storage";
import { parseISO, isAfter, isBefore, isEqual } from "date-fns";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const defaultFilter: FilterState = {
  search: "",
  category: "All",
  dateFrom: "",
  dateTo: "",
  sortBy: "date",
  sortOrder: "desc",
};

export default function ExpenseList({ expenses, onDelete }: Props) {
  const [filter, setFilter] = useState<FilterState>(defaultFilter);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = [...expenses];

    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.amount.toString().includes(q)
      );
    }

    if (filter.category !== "All") {
      list = list.filter((e) => e.category === filter.category);
    }

    if (filter.dateFrom) {
      const from = parseISO(filter.dateFrom);
      list = list.filter((e) => {
        try {
          const d = parseISO(e.date);
          return isAfter(d, from) || isEqual(d, from);
        } catch { return true; }
      });
    }

    if (filter.dateTo) {
      const to = parseISO(filter.dateTo);
      list = list.filter((e) => {
        try {
          const d = parseISO(e.date);
          return isBefore(d, to) || isEqual(d, to);
        } catch { return true; }
      });
    }

    list.sort((a, b) => {
      let diff = 0;
      if (filter.sortBy === "date") diff = a.date.localeCompare(b.date);
      else if (filter.sortBy === "amount") diff = a.amount - b.amount;
      else diff = a.category.localeCompare(b.category);
      return filter.sortOrder === "asc" ? diff : -diff;
    });

    return list;
  }, [expenses, filter]);

  const filteredTotal = filtered.reduce((s, e) => s + e.amount, 0);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-slate-900">All Expenses</h2>
        <button
          onClick={() => exportToCSV(filtered)}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      <FilterBar
        filter={filter}
        onChange={setFilter}
        total={expenses.length}
        filtered={filtered.length}
      />

      {/* Filtered total */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-slate-500">Filtered total</span>
          <span className="text-sm font-semibold text-slate-700">{formatCurrency(filteredTotal)}</span>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <p className="text-slate-400 text-sm">No expenses match your filters.</p>
          <Link href="/add" className="mt-3 inline-block text-sm text-indigo-600 font-medium hover:underline">
            Add your first expense →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((expense) => {
            const isOpen = expanded.has(expense.id);
            return (
              <div
                key={expense.id}
                className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                <div
                  className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleExpand(expense.id)}
                >
                  {/* Date */}
                  <div className="hidden sm:block w-24 flex-shrink-0">
                    <p className="text-xs text-slate-400">{formatDate(expense.date)}</p>
                  </div>

                  {/* Category */}
                  <div className="w-28 flex-shrink-0 hidden md:block">
                    <CategoryBadge category={expense.category} />
                  </div>

                  {/* Description */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{expense.description}</p>
                    <p className="text-xs text-slate-400 sm:hidden">{formatDate(expense.date)}</p>
                  </div>

                  {/* Amount */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-900">{formatCurrency(expense.amount)}</p>
                  </div>

                  {/* Toggle */}
                  <div className="flex-shrink-0 text-slate-300">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-slate-100 px-4 py-3 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="md:hidden">
                        <CategoryBadge category={expense.category} />
                      </div>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium">Description:</span> {expense.description}
                      </p>
                      <p className="text-xs text-slate-400">Added {new Date(expense.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <Link
                        href={`/expenses/${expense.id}/edit`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      {deleteTarget === expense.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-red-500 font-medium">Confirm?</span>
                          <button
                            onClick={() => { onDelete(expense.id); setDeleteTarget(null); }}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteTarget(null)}
                            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteTarget(expense.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-red-200 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
