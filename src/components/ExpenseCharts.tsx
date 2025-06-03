"use client";
import { Expense } from "@/types/expense";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface ExpenseChartsProps {
  expenses: Expense[];
  monthlyGoal?: number;
}

export default function ExpenseCharts({ expenses, monthlyGoal }: ExpenseChartsProps) {
  // Calculate category totals for pie chart
  const categoryTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});

  // Calculate monthly totals for bar chart
  const monthlyTotals = expenses.reduce<Record<string, number>>((totals, expense) => {
    const date = new Date(expense.date);
    const monthYear = date.toLocaleString('is-IS', { month: 'long', year: 'numeric' });
    totals[monthYear] = (totals[monthYear] || 0) + expense.amount;
    return totals;
  }, {});

  // Sort months chronologically
  const sortedMonths = Object.keys(monthlyTotals).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA.getTime() - dateB.getTime();
  });

  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#8AC249',
          '#EA526F',
          '#23B5D3',
          '#279AF1',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Monthly Spending',
        data: sortedMonths.map(month => monthlyTotals[month]),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
      ...(monthlyGoal ? [{
        label: 'Monthly Goal',
        data: sortedMonths.map(() => monthlyGoal),
        type: 'line' as const,
        borderColor: '#FF6384',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
      }] : []),
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Spending by Category',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Monthly Spending',
        color: 'white',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="mt-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>
    </div>
  );
} 