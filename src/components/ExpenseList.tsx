import { Expense } from "@/types/expense";
import { Dispatch, SetStateAction } from "react";

const formatISK = (amount: number) =>
  new Intl.NumberFormat("is-IS", {
    style: "currency",
    currency: "ISK",
    maximumFractionDigits: 0,
  }).format(amount);

interface ExpenseListProps {
  expenses: Expense[];
  selectedExpenseId: string | null;
  setSelectedExpenseId: Dispatch<SetStateAction<string | null>>;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, selectedExpenseId, setSelectedExpenseId, onDelete }: ExpenseListProps) {
  const categoryTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2 text-white">Filtered Expenses</h2>
      <ul className="space-y-2">
        {expenses.map((expense) => (
          <li 
            key={expense.id} 
            className={`bg-gray-800 p-3 shadow-lg rounded-lg border ${
              selectedExpenseId === expense.id ? 'border-blue-500' : 'border-gray-700'
            } cursor-pointer transition-colors`}
            onClick={() => setSelectedExpenseId(expense.id)}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-medium text-white">{expense.title}</p>
                <p className="text-sm text-gray-400">{expense.category}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-green-400 font-semibold">
                    {formatISK(expense.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(expense.date).toLocaleDateString("is-IS")}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(expense.id);
                  }}
                  className="text-red-500 hover:text-red-400 transition-colors p-1"
                  title="Delete expense"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
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