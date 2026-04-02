import { Expense } from "./types";

const STORAGE_KEY = "expense_tracker_expenses";

export function loadExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getSampleExpenses();
    return JSON.parse(raw) as Expense[];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ["Date", "Amount", "Category", "Description"];
  const rows = expenses.map((e) => [
    e.date,
    e.amount.toFixed(2),
    e.category,
    `"${e.description.replace(/"/g, '""')}"`,
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function getSampleExpenses(): Expense[] {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const sample: Omit<Expense, "id" | "createdAt" | "updatedAt">[] = [
    { date: fmt(year, month, 1), amount: 52.4, category: "Food", description: "Grocery run – Whole Foods" },
    { date: fmt(year, month, 2), amount: 35.0, category: "Transportation", description: "Monthly bus pass top-up" },
    { date: fmt(year, month, 3), amount: 14.99, category: "Entertainment", description: "Netflix subscription" },
    { date: fmt(year, month, 5), amount: 89.5, category: "Shopping", description: "New sneakers" },
    { date: fmt(year, month, 7), amount: 120.0, category: "Bills", description: "Electricity bill" },
    { date: fmt(year, month, 8), amount: 28.6, category: "Food", description: "Thai takeout with friends" },
    { date: fmt(year, month, 10), amount: 9.99, category: "Entertainment", description: "Spotify Premium" },
    { date: fmt(year, month, 12), amount: 45.0, category: "Transportation", description: "Uber rides" },
    { date: fmt(year, month, 14), amount: 63.2, category: "Food", description: "Weekly groceries" },
    { date: fmt(year, month, 15), amount: 200.0, category: "Bills", description: "Internet + phone bill" },
    { date: fmt(year, month, 17), amount: 32.0, category: "Entertainment", description: "Movie night (2 tickets)" },
    { date: fmt(year, month, 18), amount: 74.99, category: "Shopping", description: "Amazon – household items" },
    { date: fmt(year, month, 20), amount: 18.5, category: "Food", description: "Coffee shop – weekly work sessions" },
    { date: fmt(year, month, 22), amount: 55.0, category: "Transportation", description: "Gas refill" },
    { date: fmt(year, month, 24), amount: 41.3, category: "Food", description: "Farmers market" },
    { date: fmt(year, month - 1 < 0 ? 11 : month - 1, 5, month - 1 < 0 ? year - 1 : year), amount: 95.0, category: "Bills", description: "Electricity bill" },
    { date: fmt(year, month - 1 < 0 ? 11 : month - 1, 10, month - 1 < 0 ? year - 1 : year), amount: 130.0, category: "Shopping", description: "Clothing haul" },
    { date: fmt(year, month - 1 < 0 ? 11 : month - 1, 15, month - 1 < 0 ? year - 1 : year), amount: 67.4, category: "Food", description: "Groceries" },
    { date: fmt(year, month - 1 < 0 ? 11 : month - 1, 20, month - 1 < 0 ? year - 1 : year), amount: 22.0, category: "Entertainment", description: "Board game night supplies" },
    { date: fmt(year, month - 1 < 0 ? 11 : month - 1, 25, month - 1 < 0 ? year - 1 : year), amount: 48.0, category: "Transportation", description: "Train tickets" },
  ];

  const ts = new Date().toISOString();
  return sample.map((s, i) => ({
    ...s,
    id: `sample-${i + 1}`,
    createdAt: ts,
    updatedAt: ts,
  }));
}

function fmt(year: number, month: number, day: number, overrideYear?: number): string {
  const y = overrideYear ?? year;
  const m = String(month + 1).padStart(2, "0");
  const d = String(Math.min(day, 28)).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
