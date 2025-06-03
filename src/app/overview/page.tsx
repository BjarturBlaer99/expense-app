"use client";
import { useLocalExpenses } from "@/lib/useLocalExpenses";
import { useState } from "react";
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export default function Overview() {
  const { expenses, isLoading } = useLocalExpenses();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("is-IS", { month: "long" })
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto mt-28">
          <div className="text-center text-gray-400">
            Loading expenses...
          </div>
        </div>
      </main>
    );
  }

  // Group expenses by date
  const dailyExpenses = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString("is-IS");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(expense);
    return acc;
  }, {} as Record<string, typeof expenses>);

  // Calculate daily totals
  const dailyTotals = Object.entries(dailyExpenses).map(([date, expenses]) => ({
    date,
    total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: expenses.length,
  }));

  // Sort by date
  dailyTotals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatISK = (amount: number) =>
    new Intl.NumberFormat("is-IS", {
      style: "currency",
      currency: "ISK",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto mt-28">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 flex items-center justify-center gap-2">
            <CalendarIcon className="w-8 h-8" />
            Daily Spending Overview
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Track your daily expenses and spending patterns
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ChartBarIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Daily Spending</h2>
            </div>
            <div className="space-y-4">
              {dailyTotals.map(({ date, total, count }) => (
                <div
                  key={date}
                  className="bg-gray-700/30 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-white font-medium">{date}</h3>
                      <p className="text-sm text-gray-400">
                        {count} {count === 1 ? "expense" : "expenses"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-white">
                        {formatISK(total)}
                      </div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-600/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${Math.min(
                          (total / Math.max(...dailyTotals.map((d) => d.total))) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Summary</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-1">Total Days</h3>
                <p className="text-2xl font-bold text-white">
                  {dailyTotals.length}
                </p>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <h3 className="text-gray-400 text-sm mb-1">Average Daily Spend</h3>
                <p className="text-2xl font-bold text-white">
                  {formatISK(
                    dailyTotals.reduce((sum, day) => sum + day.total, 0) /
                      dailyTotals.length || 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 