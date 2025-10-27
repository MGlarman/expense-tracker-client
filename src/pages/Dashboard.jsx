import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title as ChartTitle
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  ChartTooltip,
  ChartLegend,
  ChartTitle
);

const BASE_URL = "https://expense-tracker-api-80j5.onrender.com/api";
const COLORS = ["#4f46e5", "#22c55e", "#f87171", "#facc15", "#8b5cf6"];
const CATEGORY_OPTIONS = ["All", "Food", "Transport", "Entertainment", "Bills", "Other"];

export default function Dashboard({ darkMode }) {
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [monthForm, setMonthForm] = useState({ month: "", income: "", savingsGoal: "" });

  const [form, setForm] = useState({ title: "", amount: "", category: "Other", date: "" });
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateRange, setDateRange] = useState("30");

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "", category: "Other", date: "" });

  const token = localStorage.getItem("token");
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  /* ---------- Fetch expenses & monthly incomes ---------- */
  useEffect(() => {
    if (!token) return;

    const fetchExpenses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/expenses`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch expenses");
        const data = await res.json();
        const validData = Array.isArray(data)
          ? data.map(exp => ({ ...exp, date: exp.date ? new Date(exp.date) : new Date() }))
          : [];
        setExpenses(validData);
      } catch (err) {
        console.error(err);
        setExpenses([]);
      }
    };

    const fetchMonthlyIncomes = async () => {
      try {
        const res = await fetch(`${BASE_URL}/income/all`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to fetch income");
        const data = await res.json();
        if (Array.isArray(data)) {
          const normalized = data.map(d => ({
            _id: d._id,
            month: Number(d.month),
            year: Number(d.year),
            income: Number(d.amount ?? d.income ?? 0),
            savingsGoal: Number(d.savingsGoal ?? 0),
          }));
          setMonthlyData(normalized);
        } else {
          setMonthlyData([]);
        }
      } catch (err) {
        console.error(err);
        setMonthlyData([]);
      }
    };

    fetchExpenses();
    fetchMonthlyIncomes();
  }, [token]);

  /* ---------- Expense CRUD ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, date: form.date || new Date().toISOString() };
      const res = await fetch(`${BASE_URL}/expenses`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to add expense");
      const data = await res.json();
      data.date = data.date ? new Date(data.date) : new Date();
      setExpenses(prev => [data, ...prev]);
      setForm({ title: "", amount: "", category: "Other", date: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to add expense");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete expense");
      setExpenses(prev => prev.filter(exp => exp._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (id) => {
    try {
      const payload = { ...editForm, date: editForm.date || new Date().toISOString() };
      const res = await fetch(`${BASE_URL}/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to edit expense");
      const data = await res.json();
      data.date = data.date ? new Date(data.date) : new Date();
      setExpenses(prev => prev.map(exp => (exp._id === id ? data : exp)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to edit expense");
    }
  };

  /* ---------- Monthly income CRUD ---------- */
  const handleSaveMonthlyData = async () => {
    if (!monthForm.month || !monthForm.income) return alert("Select a month and enter income.");

    try {
      const [yearStr, monthStr] = monthForm.month.split("-");
      const year = Number(yearStr);
      const month = Number(monthStr) - 1;

      const payload = {
        month,
        year,
        amount: Number(monthForm.income),
        savingsGoal: Number(monthForm.savingsGoal || 0)
      };

      const existing = monthlyData.find(m => m.month === month && m.year === year);

      let res;
      if (existing) {
        res = await fetch(`${BASE_URL}/income/${existing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${BASE_URL}/income`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Failed to save monthly data");
      const data = await res.json();

      setMonthlyData(prev => {
        const filtered = prev.filter(m => !(m.month === month && m.year === year));
        return [...filtered, { ...payload, _id: data._id }];
      });

      setMonthForm({ month: "", income: "", savingsGoal: "" });
      alert("Monthly income & goal saved!");
    } catch (err) {
      console.error(err);
      alert(`Failed to save monthly data: ${err.message}`);
    }
  };

  const handleDeleteMonth = async (id) => {
    if (!confirm(`Delete this monthly record?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/income/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete month");
      setMonthlyData(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete month");
    }
  };

  /* ---------- Filtered Expenses ---------- */
  const filteredExpenses = useMemo(() => {
    const now = new Date();
    let startDate = null;
    if (dateRange !== "All") {
      startDate = new Date();
      startDate.setDate(now.getDate() - Number(dateRange) + 1);
    }

    return expenses.filter(exp => {
      const expDate = exp.date instanceof Date && !isNaN(exp.date) ? exp.date : new Date(exp.date);
      const inDateRange = !startDate || expDate >= startDate;
      const inCategory = categoryFilter === "All" || exp.category === categoryFilter;
      return inDateRange && inCategory;
    });
  }, [expenses, categoryFilter, dateRange]);

  /* ---------- Derived Data for Charts ---------- */
  const barData = useMemo(() => {
    const grouped = filteredExpenses.reduce((acc, exp) => {
      const dateStr = exp.date instanceof Date && !isNaN(exp.date)
        ? exp.date.toLocaleDateString()
        : new Date().toLocaleDateString();
      acc[dateStr] = acc[dateStr] || { date: dateStr, total: 0 };
      acc[dateStr].total += Number(exp.amount);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [filteredExpenses]);

  const pieData = useMemo(() => {
    const grouped = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || { name: exp.category, value: 0 };
      acc[exp.category].value += Number(exp.amount);
      return acc;
    }, {});
    return Object.values(grouped);
  }, [filteredExpenses]);

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  /* ---------- Chart Data ---------- */
  const monthlyLabels = barData.map(d => d.date);
  const monthlyTotals = barData.map(d => d.total);

  const expensesChartData = {
    labels: monthlyLabels,
    datasets: [{
      label: "Expenses ($)",
      data: monthlyTotals,
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79,70,229,0.15)",
      tension: 0.35,
      pointRadius: 4,
      pointBackgroundColor: "#4f46e5",
      fill: true
    }]
  };

  const expensesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Expenses Over Time", color: darkMode ? "#fff" : "#111", font: { size: 16, weight: "600" } }
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: darkMode ? "#fff" : "#111" }, grid: { color: darkMode ? "#444" : "#eee" } },
      x: { ticks: { color: darkMode ? "#fff" : "#111" }, grid: { color: darkMode ? "#444" : "#eee" } }
    }
  };

  /* ---------- Projected Daily Savings vs Expenses ---------- */
  const monthlyExpenses = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    return filteredExpenses.filter(exp => {
      const expDate = exp.date instanceof Date ? exp.date : new Date(exp.date);
      return expDate.getMonth() === month - 1 && expDate.getFullYear() === year;
    });
  }, [filteredExpenses, selectedMonth]);

  const selectedMonthData = monthlyData.find(m => `${m.year}-${String(m.month+1).padStart(2,'0')}` === selectedMonth) || { income: 0, savingsGoal: 0 };
  const daysInSelectedMonth = new Date(Number(selectedMonth.split("-")[0]), Number(selectedMonth.split("-")[1]), 0).getDate();
  const projectedSavingsDaily = (selectedMonthData.income - selectedMonthData.savingsGoal) / daysInSelectedMonth;

  const projectedBarData = useMemo(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    const allDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month - 1, i + 1));

    const now = new Date();
    let startDate;
    if (dateRange !== "All") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - Number(dateRange) + 1);
    }

    let cumulativeExpenses = 0;
    const filteredDays = allDates.filter(date => !startDate || date >= startDate);

    return filteredDays.map((date, idx) => {
      const dailyExpense = filteredExpenses
        .filter(exp => {
          const expDate = exp.date instanceof Date ? exp.date : new Date(exp.date);
          return (
            expDate.getFullYear() === date.getFullYear() &&
            expDate.getMonth() === date.getMonth() &&
            expDate.getDate() === date.getDate()
          );
        })
        .reduce((sum, exp) => sum + Number(exp.amount), 0);

      cumulativeExpenses += dailyExpense;

      const remainingSavings = selectedMonthData.income - selectedMonthData.savingsGoal - cumulativeExpenses;
      const daysLeft = filteredDays.length - idx;
      const projectedSavingsToday = remainingSavings > 0 ? remainingSavings / daysLeft : 0;

      return {
        date: date.toLocaleDateString(),
        expenses: dailyExpense,
        savings: projectedSavingsToday,
      };
    });
  }, [filteredExpenses, selectedMonth, selectedMonthData, dateRange]);

  /* ---------- Render ---------- */
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* OVERVIEW SECTION */}
      {/* Overview + monthly form */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <h2 className="text-xl font-semibold">Overview</h2>
          <div className="text-sm text-gray-500 mt-1 md:mt-0">Month: <strong>{currentMonth}</strong></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-wrap gap-3 items-end">
              <input
                type="month"
                value={monthForm.month}
                onChange={(e) => setMonthForm({ ...monthForm, month: e.target.value })}
                className="p-3 text-base border rounded w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Income (per month)"
                value={monthForm.income}
                onChange={(e) => setMonthForm({ ...monthForm, income: e.target.value })}
                className="p-3 text-base border rounded w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <input
                type="number"
                placeholder="Savings Goal (per month)"
                value={monthForm.savingsGoal}
                onChange={(e) => setMonthForm({ ...monthForm, savingsGoal: e.target.value })}
                className="p-3 text-base border rounded w-full sm:w-44 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={handleSaveMonthlyData}
                className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium text-base hover:bg-indigo-700 transition-colors"
              >
                Save Month
              </button>
              <div className="text-sm text-gray-500 mt-1 sm:mt-0">Saved months: {monthlyData.length}</div>
            </div>

{/* Monthly table */}
{monthlyData.length > 0 && (
  <div className="mt-3 overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-gray-500">
          <th className="py-3">Month</th>
          <th className="py-3">Income</th>
          <th className="py-3">Savings Goal</th>
          <th className="py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {monthlyData
          .slice()
          .sort((a, b) => b.year * 12 + b.month - (a.year * 12 + a.month))
          .map((m) => (
            <tr key={m._id} className="border-t">
              <td className="py-4">{m.year && m.month >= 0
                ? new Date(m.year, m.month).toLocaleString('default', { month: 'long', year: 'numeric' })
                : "Invalid Date"}</td>
              <td className="py-4">${m.income}</td>
              <td className="py-4">${m.savingsGoal}</td>
              <td className="py-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setMonthForm({ month: `${m.year}-${String(m.month + 1).padStart(2, '0')}`, income: m.income, savingsGoal: m.savingsGoal })}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteMonth(m._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)}
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            <div className="p-5 rounded-xl bg-indigo-50 dark:bg-gray-700 flex flex-col items-start">
              <div className="text-xs text-gray-600">Monthly Income</div>
              <div className="text-lg font-semibold text-indigo-600">${selectedMonthData.income}</div>
            </div>
            <div className="p-5 rounded-xl bg-indigo-50 dark:bg-gray-700 flex flex-col items-start">
              <div className="text-xs text-gray-600">Monthly Expenses</div>
              <div className="text-lg font-semibold text-indigo-600">${monthlyExpenses.reduce((sum,e)=>sum+Number(e.amount),0)}</div>
            </div>
            <div className="p-5 rounded-xl bg-green-50 dark:bg-gray-700 flex flex-col items-start">
              <div className="text-xs text-gray-600">Projected Savings</div>
              <div className="text-lg font-semibold text-green-600">${(selectedMonthData.income - monthlyExpenses.reduce((sum,e)=>sum+Number(e.amount),0)).toFixed(0)}</div>
            </div>
            <div className="p-5 rounded-xl bg-yellow-50 dark:bg-gray-700 flex flex-col items-start">
              <div className="text-xs text-gray-600">Savings Goal</div>
              <div className="text-lg font-semibold text-yellow-500">${selectedMonthData.savingsGoal}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Add expense & filters */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-3">Add Expense</h3>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3">
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="p-3 border rounded-lg flex-1 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="p-3 border rounded-lg w-full sm:w-36 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="p-3 border rounded-lg w-full sm:w-44 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="p-3 border rounded-lg w-full sm:w-44 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {CATEGORY_OPTIONS.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
            <button
              className="bg-blue-500 text-white px-5 py-3 rounded-lg font-medium text-base w-full sm:w-auto hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="p-3 border rounded-lg flex-1 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="p-3 border rounded-lg flex-1 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="All">All time</option>
            </select>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-6 md:space-y-0 md:grid md:grid-cols-1 gap-6">
        <div className={`p-5 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} w-full`} style={{ minHeight: 300 }}>
          <h4 className="text-lg font-semibold mb-2">Expenses Over Time</h4>
          <div className="w-full h-80">
            <Line data={expensesChartData} options={expensesChartOptions} />
          </div>
        </div>

        <div className="space-y-6">
          <div className={`p-5 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} w-full`} style={{ minHeight: 300 }}>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
              <h4 className="text-lg font-semibold">Projected Daily Savings vs Expenses</h4>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {monthlyData.slice().sort((a,b)=>b.year*12+b.month - (a.year*12+a.month)).map(m => (
                  <option key={`${m.year}-${m.month}`} value={`${m.year}-${String(m.month+1).padStart(2,'0')}`}>
                    {new Date(m.year, m.month).toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
            </div>
            <div className="overflow-x-auto">
              <BarChart width={500} height={280} data={projectedBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#eee"} />
                <XAxis dataKey="date" stroke={darkMode ? "#fff" : "#000"} />
                <YAxis stroke={darkMode ? "#fff" : "#000"} />
                <Tooltip />
                <Legend />
                <Bar dataKey="expenses" name="Expenses" fill="#f87171" />
                <Bar dataKey="savings" name="Projected Savings (daily)" fill="#22c55e" />
              </BarChart>
            </div>
          </div>

          <div className={`p-5 rounded-2xl shadow-md ${darkMode ? "bg-gray-800" : "bg-white"} w-full`} style={{ minHeight: 300 }}>
            <h4 className="text-lg font-semibold mb-2">Expenses by Category</h4>
            <PieChart width={400} height={220}>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </section>

      {/* Expense list */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-3">Your Expenses</h3>
        {filteredExpenses.length === 0 ? <p>No expenses found.</p> : (
          <ul className="space-y-2">
            {filteredExpenses.map(exp => (
              <li key={exp._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-3 gap-2">
                {editingId === exp._id ? (
                  <div className="flex flex-wrap gap-2 w-full">
                    <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="p-3 border rounded-lg w-full sm:w-28 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" />
                    <input type="number" value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} className="p-3 border rounded-lg w-full sm:w-24 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" />
                    <input type="date" value={editForm.date?.toISOString ? editForm.date.toISOString().split("T")[0] : editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="p-3 border rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base" />
                    <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="p-3 border rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base">
                      {CATEGORY_OPTIONS.slice(1).map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                ) : (
                  <span className="text-base">{exp.title} ({exp.category}) - ${exp.amount}</span>
                )}

                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {editingId === exp._id ? (
                    <button onClick={() => handleSaveEdit(exp._id)} className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-base">Save</button>
                  ) : (
                    <button onClick={() => { setEditingId(exp._id); setEditForm({ ...exp }); }} className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-base">Edit</button>
                  )}
                  <button onClick={() => handleDelete(exp._id)} className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-base">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
