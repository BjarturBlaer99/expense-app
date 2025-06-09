"use client";
import { useState, useEffect } from "react";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/lib/useExpenses";
import { Expense } from "@/types/expense";
import {
  WalletIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Home() {
  const { expenses, addExpense, deleteExpense, updateExpense, isLoading } = useExpenses();
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("all");
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [monthlyGoal, setMonthlyGoal] = useState<number>(0);
  const [currentMonthTotal, setCurrentMonthTotal] = useState<number>(0);

  // Load saved monthly goal
  useEffect(() => {
    const savedGoal = localStorage.getItem('monthlyGoal');
    if (savedGoal) {
      setMonthlyGoal(Number(savedGoal));
    }
  }, []);

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

  const handleGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyGoal(Number(e.target.value));
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto mt-28">
          <div className="text-center text-gray-400">
            Loading expenses...
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto mt-28">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 flex items-center justify-center gap-3">
            <WalletIcon className="w-10 h-10 animate-pulse" />
            Expense Tracker
          </h1>
          <p className="text-gray-400 text-lg animate-slide-up delay-100">
            Track and manage your expenses with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Expense Form and List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Expense Form */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-colors">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 flex items-center gap-2">
                <PlusCircleIcon className="w-6 h-6" />
                Add New Expense
              </h2>
              <ExpenseForm />
            </div>

            {/* View All Expenses Button */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-colors">
              <Link
                href="/expenses"
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CalendarIcon className="w-5 h-5" />
                View All Expenses
              </Link>
            </div>
          </div>

          {/* Right Column - Overview and Goals */}
          <div className="space-y-6">
            {/* Monthly Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 flex items-center gap-2">
                <CurrencyDollarIcon className="w-6 h-6" />
                Monthly Overview
              </h2>
              <div className="space-y-6">
                {/* Monthly Goal */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Monthly Goal</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={monthlyGoal}
                        onChange={handleGoalChange}
                        className="w-32 px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-right"
                        placeholder="Set goal..."
                      />
                      <button
                        onClick={() => localStorage.setItem('monthlyGoal', monthlyGoal.toString())}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((currentMonthTotal / (monthlyGoal || 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-400">
                    {monthlyGoal > 0 ? (
                      <span>
                        {formatISK(currentMonthTotal)} of {formatISK(monthlyGoal)} spent
                        ({Math.round((currentMonthTotal / monthlyGoal) * 100)}%)
                      </span>
                    ) : (
                      <span>Set a monthly goal to track your spending</span>
                    )}
                  </div>
                </div>

                {/* Current Month Total */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Current Month Total</span>
                    <span className="text-2xl font-bold text-white">{formatISK(currentMonthTotal)}</span>
                  </div>
                </div>

                {/* Filtered Total */}
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Filtered Total</span>
                    <span className="text-2xl font-bold text-white">{formatISK(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}