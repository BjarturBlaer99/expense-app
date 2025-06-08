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
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

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

  const barChartData: ChartData<"bar"> = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData: ChartData<"line"> = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Monthly Expenses",
        data: sortedMonths.map(month => monthlyTotals[month]),
        type: "line",
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 2,
        fill: false,
        pointRadius: 4,
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

  const barChartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)",
        },
      },
      title: {
        display: true,
        text: "Expense Analysis",
        color: "rgb(156, 163, 175)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "rgb(156, 163, 175)",
        },
      },
      title: {
        display: true,
        text: "Monthly Trend",
        color: "rgb(156, 163, 175)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
      x: {
        grid: {
          color: "rgba(75, 85, 99, 0.2)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Expenses by Category</h3>
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Monthly Trend</h3>
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
} 