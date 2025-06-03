import { useEffect, useState } from "react";
import { Expense } from "@/types/expense";

export function useLocalExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch expenses from the API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('/api/expenses');
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const addExpense = async (expense: Expense) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense),
      });
      const newExpense = await response.json();
      setExpenses((prev) => [...prev, newExpense]);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await fetch(`/api/expenses?id=${id}`, {
        method: 'DELETE',
      });
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  return { expenses, addExpense, deleteExpense, isLoading };
}
