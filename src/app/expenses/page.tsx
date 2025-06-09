"use client";
import { useState } from "react";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/lib/useExpenses";
import { Expense } from "@/types/expense";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function ExpensesPage() {
  const { expenses, deleteExpense, updateExpense, isLoading } = useExpenses();
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [month, setMonth] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  const filteredExpenses = expenses.filter((expense) => {
    const date = new Date(expense.date);
    const matchesMonth = month === "all" || date.getMonth() + 1 === parseInt(month);
    const matchesYear = year === "all" || date.getFullYear() === parseInt(year);
    return matchesMonth && matchesYear;
  });

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="all">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 p-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
            All Expenses
          </h2>
          <ExpenseList
            expenses={filteredExpenses}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
            selectedExpenseId={selectedExpenseId}
            setSelectedExpenseId={setSelectedExpenseId}
          />
        </div>
      </div>
    </main>
  );
} 