"use client";
import { useState } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseCharts from "@/components/ExpenseCharts";
import SpendingGoal from "@/components/SpendingGoal";
import CategoryBudgets from "@/components/CategoryBudgets";
import { useExpenses } from "@/lib/useExpenses";
import { Expense } from "@/types/expense";
import {
  ChartBarIcon,
  WalletIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { expenses, addExpense, deleteExpense, isLoading } = useExpenses();
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);

  console.log("Main page expenses:", expenses);

  const filteredExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    const matchesMonth = month === "all" || date.getMonth() + 1 === parseInt(month);
    const matchesYear = year === "all" || date.getFullYear() === parseInt(year);
    return matchesMonth && matchesYear;
  });

  // Calculate current month's total
  const currentDate = new Date();
  const currentMonthTotal = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentDate.getMonth() &&
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, expense) => sum + expense.amount, 0);

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formatISK = (amount: number) =>
    new Intl.NumberFormat("is-IS", {
      style: "currency",
      currency: "ISK",
      maximumFractionDigits: 0,
    }).format(amount);

  const years = Array.from(new Set(expenses.map((e) => new Date(e.date).getFullYear())));

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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto mt-28">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2 flex items-center justify-center gap-2">
            <WalletIcon className="w-8 h-8 animate-pulse" />
            Our Expense Tracker
          </h1>
          <p className="text-gray-400 text-sm sm:text-base animate-slide-up delay-100">
            Track, analyze, and manage your expenses with ease
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-200">
              <div className="flex items-center gap-2 mb-4">
                <CurrencyDollarIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Add New Expense</h2>
              </div>
              <ExpenseForm 
                onAdd={addExpense} 
                selectedExpenseId={selectedExpenseId}
                setSelectedExpenseId={setSelectedExpenseId}
              />
              <div className="text-right text-lg sm:text-xl font-bold text-white mt-4 pt-4 border-t border-gray-700/50 animate-fade-in">
                Total: {formatISK(total)}
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-300">
              <div className="flex items-center gap-2 mb-4">
                <AdjustmentsHorizontalIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Filter Expenses</h2>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <select
                  className="w-full sm:w-auto p-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-blue-500/50"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="all">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {new Date(0, i).toLocaleString("is-IS", { month: "long" })}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full sm:w-auto p-2 border border-gray-600 rounded-lg bg-gray-700/50 text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-blue-500/50"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                >
                  <option value="all">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-400">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Expense List</h2>
              </div>
              <ExpenseList 
                expenses={filteredExpenses} 
                selectedExpenseId={selectedExpenseId}
                setSelectedExpenseId={setSelectedExpenseId}
                onDelete={deleteExpense}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-200">
              <div className="flex items-center gap-2 mb-4">
                <ArrowTrendingUpIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Monthly Goal</h2>
              </div>
              <SpendingGoal 
                currentMonthTotal={currentMonthTotal}
                onGoalChange={setMonthlyGoal}
              />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-300">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Category Budgets</h2>
              </div>
              <CategoryBudgets expenses={expenses} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl animate-slide-in delay-400">
              <div className="flex items-center gap-2 mb-4">
                <ChartBarIcon className="w-5 h-5 text-blue-400 animate-pulse" />
                <h2 className="text-lg font-semibold text-white">Expense Analytics</h2>
              </div>
              <ExpenseCharts 
                expenses={expenses} 
                monthlyGoal={monthlyGoal}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}