"use client";
import { useState, useEffect } from "react";

interface SpendingGoalProps {
  currentMonthTotal: number;
  onGoalChange: (goal: number) => void;
}

export default function SpendingGoal({ currentMonthTotal, onGoalChange }: SpendingGoalProps) {
  const [goal, setGoal] = useState<number>(0);
  const [isEditing, setIsEditing] = useState(false);
  const [tempGoal, setTempGoal] = useState("");

  useEffect(() => {
    const savedGoal = localStorage.getItem("monthlySpendingGoal");
    if (savedGoal) {
      setGoal(parseFloat(savedGoal));
    }
  }, []);

  const handleSaveGoal = () => {
    const newGoal = parseFloat(tempGoal);
    if (!isNaN(newGoal) && newGoal >= 0) {
      setGoal(newGoal);
      localStorage.setItem("monthlySpendingGoal", newGoal.toString());
      onGoalChange(newGoal);
      setIsEditing(false);
    }
  };

  const progress = goal > 0 ? (currentMonthTotal / goal) * 100 : 0;
  const isOverBudget = currentMonthTotal > goal && goal > 0;

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Monthly Spending Goal</h3>
        {!isEditing ? (
          <button
            onClick={() => {
              setTempGoal(goal.toString());
              setIsEditing(true);
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Edit Goal
          </button>
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              value={tempGoal}
              onChange={(e) => setTempGoal(e.target.value)}
              className="w-32 p-1 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Enter goal"
            />
            <button
              onClick={handleSaveGoal}
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {goal > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className={`font-medium ${isOverBudget ? 'text-red-400' : 'text-green-400'}`}>
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverBudget ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Spent</span>
            <span className="text-white">
              {new Intl.NumberFormat("is-IS", {
                style: "currency",
                currency: "ISK",
                maximumFractionDigits: 0,
              }).format(currentMonthTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Goal</span>
            <span className="text-white">
              {new Intl.NumberFormat("is-IS", {
                style: "currency",
                currency: "ISK",
                maximumFractionDigits: 0,
              }).format(goal)}
            </span>
          </div>
          {isOverBudget && (
            <div className="text-red-400 text-sm mt-2">
              You are {(progress - 100).toFixed(1)}% over your monthly goal!
            </div>
          )}
        </div>
      )}
    </div>
  );
} 