"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, List, PlusCircle, TrendingUp } from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses", label: "Expenses", icon: List },
  { href: "/add", label: "Add Expense", icon: PlusCircle },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-slate-900 text-white fixed left-0 top-0 z-40">
        <div className="px-6 py-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white leading-tight">ExpenseAI</p>
              <p className="text-xs text-slate-400">Track smarter</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">Data stored locally</p>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                active ? "text-indigo-600" : "text-slate-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="hidden sm:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-30 px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900">ExpenseAI</span>
      </header>
    </>
  );
}
