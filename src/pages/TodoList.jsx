// components/TodoList.js
import { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const BASE_URL = "https://expense-tracker-api-80j5.onrender.com/api";
const COLORS = ["#4f46e5", "#22c55e", "#f87171", "#facc15", "#8b5cf6"];
const CATEGORY_OPTIONS = ["General", "Work", "Personal", "Study", "Other"];
const PRIORITY_OPTIONS = ["low", "medium", "high"];

export default function TodoList({ darkMode }) {
  const token = localStorage.getItem("token");
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    title: "",
    dueDate: "",
    estimatedTime: 0,
    category: "General",
    priority: "medium"
  });
  const [editingId, setEditingId] = useState(null);
  const [editTodo, setEditTodo] = useState({});
  const [subtaskInputs, setSubtaskInputs] = useState({});

  useEffect(() => {
    if (!token) return;
    fetchTodos();
  }, [token]);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${BASE_URL}/todo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Todo Handlers ----------

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.title) return;
    try {
      const res = await fetch(`${BASE_URL}/todo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newTodo),
      });
      const data = await res.json();
      setTodos(prev => [data, ...prev]);
      setNewTodo({ title: "", dueDate: "", estimatedTime: 0, category: "General", priority: "medium" });
    } catch (err) { console.error(err); }
  };

  const handleToggle = async (id, completed) => {
    try {
      const res = await fetch(`${BASE_URL}/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: !completed }),
      });
      const updated = await res.json();
      setTodos(prev => prev.map(t => t._id === id ? updated : t));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/todo/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(prev => prev.filter(t => t._id !== id));
    } catch (err) { console.error(err); }
  };

  const handleSaveEdit = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/todo/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editTodo),
      });
      const updated = await res.json();
      setTodos(prev => prev.map(t => t._id === id ? updated : t));
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  // ---------- Subtask Handlers (Safe Version) ----------

  const addSubtask = async (todoId) => {
    const title = subtaskInputs[todoId];
    if (!title) return;

    try {
      const res = await fetch(`${BASE_URL}/todo/${todoId}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title }),
      });
      const newSubtask = await res.json(); // backend returns created subtask

      setTodos(prev => prev.map(t =>
        t._id === todoId
          ? { ...t, subtasks: [...(t.subtasks || []), newSubtask] }
          : t
      ));

      setSubtaskInputs(prev => ({ ...prev, [todoId]: "" }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSubtask = async (todoId, subtask) => {
    try {
      await fetch(`${BASE_URL}/todo/${todoId}/subtasks/${subtask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ completed: !subtask.completed }),
      });

      setTodos(prev => prev.map(t =>
        t._id === todoId
          ? {
              ...t,
              subtasks: t.subtasks.map(s =>
                s._id === subtask._id ? { ...s, completed: !s.completed } : s
              )
            }
          : t
      ));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubtask = async (todoId, subId) => {
    try {
      await fetch(`${BASE_URL}/todo/${todoId}/subtasks/${subId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setTodos(prev => prev.map(t =>
        t._id === todoId
          ? { ...t, subtasks: t.subtasks.filter(s => s._id !== subId) }
          : t
      ));
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Pie Chart Data ----------

  const pieData = useMemo(() => {
    const grouped = todos.reduce((acc, todo) => {
      const totalTime = Number(todo.estimatedTime) + todo.subtasks?.reduce((sum, s) => sum + Number(s.estimatedTime), 0);
      acc[todo.category] = acc[todo.category] || { name: todo.category, value: 0 };
      acc[todo.category].value += totalTime;
      return acc;
    }, {});
    return Object.values(grouped);
  }, [todos]);

  // ---------- Render ----------

  return (
    <div className={`p-4 md:p-6 max-w-3xl mx-auto space-y-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-xl shadow`}>
      <h2 className="text-xl font-semibold mb-4">To-Do List</h2>

      {/* Add Todo Form */}
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 flex-wrap">
        <input placeholder="Task Title..." value={newTodo.title} onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })} className="p-3 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input type="date" value={newTodo.dueDate} onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })} className="p-3 border rounded-lg w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <input type="number" min="0" placeholder="Estimated hours" value={newTodo.estimatedTime} onChange={(e) => setNewTodo({ ...newTodo, estimatedTime: e.target.value })} className="p-3 border rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
        <select value={newTodo.category} onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })} className="p-3 border rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={newTodo.priority} onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })} className="p-3 border rounded-lg w-full sm:w-36 focus:outline-none focus:ring-2 focus:ring-indigo-400">
          {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
        </select>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Add</button>
      </form>

      {/* Pie Chart */}
      <div className="p-4 rounded-xl shadow-md bg-gray-100 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-2">Estimated Time by Category</h3>
        <PieChart width={400} height={250}>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Todo List */}
      <ul className="space-y-4">
        {todos.map(todo => (
          <li key={todo._id} className="flex flex-col p-3 border rounded-lg gap-2">

            {/* Todo Info */}
            <div className="flex flex-wrap items-center gap-2">
              <input type="checkbox" checked={todo.completed} onChange={() => handleToggle(todo._id, todo.completed)} />
              <span className={`${todo.completed ? "line-through text-gray-400" : ""} font-medium`}>{todo.title}</span>
              {todo.dueDate && <span className="text-sm text-gray-500">Due: {new Date(todo.dueDate).toLocaleDateString()}</span>}
              <span className="text-sm text-gray-500">⏱ {todo.estimatedTime}h</span>
              <span className="text-sm text-gray-500">📂 {todo.category}</span>
              <span className="text-sm font-semibold text-yellow-600">{todo.priority}</span>
            </div>

            {/* Todo Actions */}
            <div className="flex gap-2">
              <button onClick={() => setEditingId(todo._id)} className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(todo._id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Delete</button>
            </div>

            {/* Subtasks */}
            {todo.subtasks?.length > 0 && (
              <ul className="pl-6 mt-2 space-y-1">
                {todo.subtasks.map(sub => (
                  <li key={sub._id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={sub.completed} onChange={() => toggleSubtask(todo._id, sub)} />
                      <span className={sub.completed ? "line-through text-gray-400" : ""}>{sub.title} ({sub.estimatedTime}h)</span>
                    </div>
                    <button onClick={() => deleteSubtask(todo._id, sub._id)} className="text-red-500 hover:text-red-700 text-sm">✖</button>
                  </li>
                ))}
              </ul>
            )}

            {/* Add Subtask Input */}
            <div className="flex gap-2 mt-2 w-full">
              <input
                type="text"
                placeholder="Add subtask..."
                value={subtaskInputs[todo._id] || ""}
                onChange={(e) => setSubtaskInputs(prev => ({ ...prev, [todo._id]: e.target.value }))}
                className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              />
              <button
                onClick={() => addSubtask(todo._id)}
                className="bg-indigo-500 text-white px-2 py-1 rounded hover:bg-indigo-600 text-sm"
              >
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
