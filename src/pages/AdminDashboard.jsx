// AdminDashboard.jsx
import { useState, useEffect } from "react";

const BASE_URL = "https://expense-tracker-api-80j5.onrender.com/api/admin";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [editUser, setEditUser] = useState({ username: "", password: "" });

  const token = localStorage.getItem("adminToken"); // assume you stored the JWT after login

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Create new user
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error("Failed to create user");
      const created = await res.json();
      setUsers(prev => [...prev, created]);
      setNewUser({ username: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  // Update user
  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editUser)
      });
      if (!res.ok) throw new Error("Failed to update user");
      const updated = await res.json();
      setUsers(prev => prev.map(u => (u._id === id ? updated : u)));
      setEditingId(null);
      setEditUser({ username: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`${BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* Create new user */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Create New User</h2>
        <form onSubmit={handleCreate} className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
        </form>
      </section>

      {/* User list */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="space-y-2">
            {users.map(user => (
              <li key={user._id} className="flex items-center justify-between border-b py-2">
                {editingId === user._id ? (
                  <div className="flex gap-2 flex-wrap items-center">
                    <input
                      type="text"
                      placeholder="Username"
                      value={editUser.username}
                      onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                      className="p-1 border rounded"
                    />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={editUser.password}
                      onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                      className="p-1 border rounded"
                    />
                    <button
                      onClick={() => handleUpdate(user._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-300 px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{user.username}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(user._id);
                          setEditUser({ username: user.username, password: "" });
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
