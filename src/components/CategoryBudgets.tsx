import { Expense } from "@/types/expense";

interface CategoryBudgetsProps {
  expenses: Expense[];
}

export default function CategoryBudgets({ expenses }: CategoryBudgetsProps) {
  // Calculate total spent per category
  const categoryTotals = expenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const formatISK = (amount: number) =>
    new Intl.NumberFormat("is-IS", {
      style: "currency",
      currency: "ISK",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-4">
      {Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)
        .map(([category, total]) => (
          <div key={category} className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-medium capitalize">{category}</h3>
              <div className="text-lg font-semibold text-white">
                {formatISK(total)}
              </div>
            </div>
            <div className="h-2 bg-gray-600/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{
                  width: `${Math.min(
                    (total / Math.max(...Object.values(categoryTotals))) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
    </div>
  );
} 