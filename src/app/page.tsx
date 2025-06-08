"use client";
import { useState, useEffect } from "react";
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
import ImportExpenses from "@/components/ImportExpenses";

export default function Home() {
  const { expenses, addExpense, deleteExpense, updateExpense, isLoading } = useExpenses();
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState<number>(0);

  // Calculate current month's total whenever expenses change
  useEffect(() => {
    const currentDate = new Date();
    const total = expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentDate.getMonth() &&
               expenseDate.getFullYear() === currentDate.getFullYear();
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
    setCurrentMonthTotal(total);
  }, [expenses]);

  console.log("Main page expenses:", expenses);

  const filteredExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    const matchesMonth = month === "all" || date.getMonth() + 1 === parseInt(month);
    const matchesYear = year === "all" || date.getFullYear() === parseInt(year);
    return matchesMonth && matchesYear;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const formatISK = (amount: number) =>
    new Intl.NumberFormat("is-IS", {
      style: "currency",
      currency: "ISK",
      maximumFractionDigits: 0,
    }).format(amount);

  const years = Array.from(new Set(expenses.map((e) => new Date(e.date).getFullYear())));

  const handleDelete = async (id: string) => {
    await deleteExpense(id);
    if (selectedExpenseId === id) {
      setSelectedExpenseId(null);
    }
  };

  const handleUpdate = async (expense: Omit<Expense, "id">) => {
    if (selectedExpenseId) {
      await updateExpense(selectedExpenseId, expense);
      setSelectedExpenseId(null);
    }
  };

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Add New Expense
              </h2>
              <ExpenseForm />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Import Expenses
              </h2>
              <ImportExpenses />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Expense List
              </h2>
              <ExpenseList
                expenses={expenses}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                selectedExpenseId={selectedExpenseId}
                setSelectedExpenseId={setSelectedExpenseId}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Expense Analytics
              </h2>
              <ExpenseCharts expenses={expenses} />
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
                Monthly Overview
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Current Month Total:</span>
                  <span className="text-xl font-semibold text-white">{formatISK(currentMonthTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Filtered Total:</span>
                  <span className="text-xl font-semibold text-white">{formatISK(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}