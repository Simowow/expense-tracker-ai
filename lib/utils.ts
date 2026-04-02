import { Expense, SummaryStats, Category, CATEGORIES } from "./types";
import { format, parseISO, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MMM d, yyyy");
  } catch {
    return dateStr;
  }
}

export function formatShortDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "MM/dd/yyyy");
  } catch {
    return dateStr;
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function computeStats(expenses: Expense[]): SummaryStats {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const totalAll = expenses.reduce((s, e) => s + e.amount, 0);

  const thisMonthExpenses = expenses.filter((e) => {
    try {
      return isWithinInterval(parseISO(e.date), {
        start: thisMonthStart,
        end: thisMonthEnd,
      });
    } catch {
      return false;
    }
  });

  const lastMonthExpenses = expenses.filter((e) => {
    try {
      return isWithinInterval(parseISO(e.date), {
        start: lastMonthStart,
        end: lastMonthEnd,
      });
    } catch {
      return false;
    }
  });

  const totalThisMonth = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalLastMonth = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);

  const daysInMonth = now.getDate();
  const averagePerDay = daysInMonth > 0 ? totalThisMonth / daysInMonth : 0;

  const categoryTotals = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = expenses
        .filter((e) => e.category === cat)
        .reduce((s, e) => s + e.amount, 0);
      return acc;
    },
    {} as Record<Category, number>
  );

  const topCategory =
    (Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0]?.[0] as Category) ?? null;

  return {
    totalAll,
    totalThisMonth,
    totalLastMonth,
    averagePerDay,
    expenseCount: expenses.length,
    topCategory,
    categoryTotals,
  };
}

export function getMonthlyData(expenses: Expense[], months = 6) {
  const now = new Date();
  return Array.from({ length: months }, (_, i) => {
    const date = subMonths(now, months - 1 - i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const total = expenses
      .filter((e) => {
        try {
          return isWithinInterval(parseISO(e.date), { start, end });
        } catch {
          return false;
        }
      })
      .reduce((s, e) => s + e.amount, 0);
    return {
      month: format(date, "MMM"),
      total: parseFloat(total.toFixed(2)),
    };
  });
}

export function exportExpensesCSV(expenses: Expense[]): void {
  const header = "Date,Category,Amount,Description";
  const rows = expenses.map((e) => {
    const description = `"${e.description.replace(/"/g, '""')}"`;
    return `${e.date},${e.category},${e.amount.toFixed(2)},${description}`;
  });
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `expenses-${format(new Date(), "yyyy-MM-dd")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function getDailyData(expenses: Expense[], year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dailyMap: Record<number, number> = {};
  expenses.forEach((e) => {
    try {
      const d = parseISO(e.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        dailyMap[day] = (dailyMap[day] ?? 0) + e.amount;
      }
    } catch {
      /* skip */
    }
  });
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    total: parseFloat((dailyMap[i + 1] ?? 0).toFixed(2)),
  }));
}
