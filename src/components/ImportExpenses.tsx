"use client";
import { useState } from "react";
import { useExpenses } from "@/lib/useExpenses";
import { Expense } from "@/types/expense";

export default function ImportExpenses() {
  const [file, setFile] = useState<File | null>(null);
  const { addExpense } = useExpenses();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    try {
      const text = await file.text();
      const rows = text.split("\n").slice(1); // Skip header row
      
      for (const row of rows) {
        if (!row.trim()) continue;
        
        const [date, title, amount, category] = row.split(",").map(field => field.trim());
        if (!date || !title || !amount || !category) continue;

        const expense: Omit<Expense, "id"> = {
          title,
          amount: parseFloat(amount),
          date,
          category,
          user_id: "default", // TODO: Replace with actual user ID from authentication
        };

        await addExpense(expense);
      }

      setFile(null);
      alert("Expenses imported successfully!");
    } catch (error) {
      console.error("Error importing expenses:", error);
      alert("Error importing expenses. Please check the file format.");
    }
  };

  return (
    <form onSubmit={handleImport} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-gray-300">
          CSV File
        </label>
        <input
          type="file"
          id="file"
          accept=".csv"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
          required
        />
        <p className="mt-1 text-sm text-gray-400">
          Upload a CSV file with columns: date, title, amount, category
        </p>
      </div>

      <button
        type="submit"
        disabled={!file}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Import Expenses
      </button>
    </form>
  );
} 