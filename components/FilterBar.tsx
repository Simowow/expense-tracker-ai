"use client";

import { FilterState, CATEGORIES } from "@/lib/types";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface Props {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  total: number;
  filtered: number;
}

export default function FilterBar({ filter, onChange, total, filtered }: Props) {
  const [open, setOpen] = useState(false);

  function set<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filter, [key]: value });
  }

  const hasActive =
    filter.search || filter.category !== "All" || filter.dateFrom || filter.dateTo;

  function reset() {
    onChange({
      search: "",
      category: "All",
      dateFrom: "",
      dateTo: "",
      sortBy: "date",
      sortOrder: "desc",
    });
  }

  const inputCls =
    "rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-full";

  return (
    <div className="space-y-3">
      {/* Search + toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search expenses…"
            value={filter.search}
            onChange={(e) => set("search", e.target.value)}
            className={`${inputCls} pl-9`}
          />
          {filter.search && (
            <button
              onClick={() => set("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            hasActive
              ? "border-indigo-400 bg-indigo-50 text-indigo-700"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActive && (
            <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
          )}
        </button>
        {hasActive && (
          <button
            onClick={reset}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Expanded filters */}
      {open && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
            <select
              value={filter.category}
              onChange={(e) => set("category", e.target.value as FilterState["category"])}
              className={inputCls}
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => set("dateFrom", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => set("dateTo", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Sort by</label>
            <div className="flex gap-2">
              <select
                value={filter.sortBy}
                onChange={(e) => set("sortBy", e.target.value as FilterState["sortBy"])}
                className={`${inputCls} flex-1`}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
                <option value="category">Category</option>
              </select>
              <button
                onClick={() => set("sortOrder", filter.sortOrder === "asc" ? "desc" : "asc")}
                className="px-2 py-2 border border-slate-200 rounded-lg text-xs text-slate-600 hover:bg-slate-50"
                title="Toggle sort order"
              >
                {filter.sortOrder === "desc" ? "↓" : "↑"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-xs text-slate-400">
        Showing {filtered} of {total} expenses
      </p>
    </div>
  );
}
