"use client";
import { useState, Dispatch, SetStateAction } from "react";
import { Expense } from "@/types/expense";
import { formatISK } from "@/lib/utils";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void>;
  onUpdate: (expense: Omit<Expense, "id">) => Promise<void>;
  selectedExpenseId: string | null;
  setSelectedExpenseId: Dispatch<SetStateAction<string | null>>;
}

export default function ExpenseList({
  expenses,
  onDelete,
  onUpdate,
  selectedExpenseId,
  setSelectedExpenseId,
}: ExpenseListProps) {
  const [editingExpense, setEditingExpense] = useState<Omit<Expense, "id"> | null>(null);

  const handleEdit = (expense: Expense) => {
    setSelectedExpenseId(expense.id);
    setEditingExpense({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      user_id: expense.user_id,
    });
  };

  const handleSave = async () => {
    if (editingExpense) {
      await onUpdate(editingExpense);
      setEditingExpense(null);
      setSelectedExpenseId(null);
    }
  };

  const handleCancel = () => {
    setEditingExpense(null);
    setSelectedExpenseId(null);
  };

  const categoryTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors"
        >
          {selectedExpenseId === expense.id && editingExpense ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editingExpense.title}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, title: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                placeholder="Title"
              />
              <input
                type="number"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({
                    ...editingExpense,
                    amount: parseFloat(e.target.value),
                  })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                placeholder="Amount"
              />
              <input
                type="date"
                value={editingExpense.date}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, date: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              />
              <select
                value={editingExpense.category}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, category: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
              >
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Housing">Housing</option>
                <option value="Utilities">Utilities</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Shopping">Shopping</option>
                <option value="Education">Education</option>
                <option value="Travel">Travel</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">{expense.title}</h3>
                <p className="text-gray-300">
                  {new Date(expense.date).toLocaleDateString("is-IS")} • {expense.category}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-white">
                  {formatISK(expense.amount)}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Category totals */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-white">Totals by Category</h3>
        <ul className="mt-2 space-y-1">
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <li key={cat} className="text-sm text-gray-300 flex justify-between">
              <span>{cat}</span>
              <span>{formatISK(total)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}