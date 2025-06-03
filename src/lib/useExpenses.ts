import { useEffect, useState } from "react";
import { Expense } from "@/types/expense";
import { supabase } from "./supabase";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        console.log("Loading expenses from Supabase...");
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .order("date", { ascending: false });

        if (error) {
          console.error("Error loading expenses:", error);
          throw error;
        }
        console.log("Loaded expenses:", data);
        setExpenses(data || []);
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      console.log("Adding expense to Supabase:", expense);
      const { data, error } = await supabase
        .from("expenses")
        .insert([expense])
        .select()
        .single();

      if (error) {
        console.error("Error adding expense:", error);
        throw error;
      }
      console.log("Successfully added expense:", data);
      setExpenses((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      console.log("Deleting expense from Supabase:", id);
      const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting expense:", error);
        throw error;
      }
      console.log("Successfully deleted expense:", id);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  };

  return { expenses, addExpense, deleteExpense, isLoading };
} 