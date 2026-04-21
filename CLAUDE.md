# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16 App Router** project (TypeScript + Tailwind CSS v4). All data is stored client-side in `localStorage` — there is no backend or database.

### Data flow

- `lib/types.ts` — central type definitions (`Expense`, `Category`, `FilterState`, `SummaryStats`, and constants like `CATEGORIES`, `CATEGORY_COLORS`)
- `lib/storage.ts` — raw `localStorage` read/write; seeds sample data on first load
- `lib/hooks/useExpenses.ts` — the single state source: loads from storage on mount, auto-saves on change, exposes `addExpense`, `updateExpense`, `deleteExpense`, `deleteMany`
- `lib/utils.ts` — pure computation helpers (`computeStats`, `getMonthlyData`, `getDailyData`, `exportExpensesCSV`, formatters)

### Pages (App Router)

| Route | File | Purpose |
|---|---|---|
| `/` | `app/page.tsx` | Dashboard — summary cards, monthly bar chart, category pie chart, recent expenses |
| `/add` | `app/add/page.tsx` | Add new expense form |
| `/expenses` | `app/expenses/page.tsx` | Full expense list with filtering/sorting/bulk delete |
| `/expenses/[id]` | `app/expenses/[id]/page.tsx` | Edit a single expense |
| `/analytics` | `app/analytics/page.tsx` | Deeper charts (daily breakdown, category analysis) |

All pages are `"use client"` and consume `useExpenses` directly — state is not shared via context, so each page loads from localStorage independently.

### Components

All components are in `components/`. Key ones:
- `Navigation.tsx` — sidebar on desktop, top + bottom bar on mobile
- `ExpenseForm.tsx` — shared form used by both `/add` and `/expenses/[id]`
- `FilterBar.tsx` — search/filter/sort controls used by the expenses list
- Chart components (`SpendingChart`, `CategoryChart`, `DailyChart`) use **Recharts**

### Styling

Tailwind CSS v4 (PostCSS plugin). The design uses a slate/indigo palette. Category colors are defined in `lib/types.ts` (`CATEGORY_COLORS`, `CATEGORY_BG`) and should stay in sync when adding new categories.
