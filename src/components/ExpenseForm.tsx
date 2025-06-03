"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Expense } from "@/types/expense";
import { v4 as uuidv4 } from "uuid";

const FIXED_CATEGORIES = [
  "Groceries",
  "Utilities",
  "Rent/Mortgage",
  "Transportation",
  "Health",
  "Education",
  "Entertainment",
  "Clothing",
  "Savings",
  "Other",
];

interface ExpenseFormProps {
  onAdd: (expense: Expense) => void;
  selectedExpenseId: string | null;
  setSelectedExpenseId: Dispatch<SetStateAction<string | null>>;
}

export default function ExpenseForm({ onAdd, selectedExpenseId, setSelectedExpenseId }: ExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(FIXED_CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date || !category) return;

    const newExpense: Expense = {
      id: uuidv4(),
      title,
      amount: parseFloat(amount),
      date,
      category,
    };

    onAdd(newExpense);
    setTitle(""); setAmount(""); setDate(""); setCategory(FIXED_CATEGORIES[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-white">Add Expense</h2>
      <input
        className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:border-gray-500 focus:outline-none"
        placeholder="Amount (kr.)"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:border-gray-500 focus:outline-none"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <select
        className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:border-gray-500 focus:outline-none"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {FIXED_CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
        Add Expense
      </button>
    </form>
  );
}














