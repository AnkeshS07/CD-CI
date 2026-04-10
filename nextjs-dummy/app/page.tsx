"use client";

import { FormEvent, useMemo, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const initialUsers: User[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Rahul Kumar", email: "rahul@example.com", role: "Editor" },
  { id: 3, name: "Sara Lee", email: "sara@example.com", role: "Viewer" },
];

export default function Home() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [editingId, setEditingId] = useState<number | null>(null);

  const isEditing = editingId !== null;
  const nextId = useMemo(() => (users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1), [users]);

  function resetForm() {
    setName("");
    setEmail("");
    setRole("Viewer");
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim()) return;

    if (isEditing && editingId !== null) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId ? { ...user, name: name.trim(), email: email.trim(), role } : user,
        ),
      );
      resetForm();
      return;
    }

    setUsers((prev) => [...prev, { id: nextId, name: name.trim(), email: email.trim(), role }]);
    resetForm();
  }

  function handleEdit(user: User) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  }

  function handleDelete(id: number) {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <main className="min-h-screen bg-zinc-100 p-6 dark:bg-zinc-950">
      <section className="mx-auto w-full max-w-4xl rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">User CRUD Dashboard</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-300">
            Static user CRUD page (frontend only) built with Next.js.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8 grid gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {isEditing ? "Update User" : "Create User"}
          </h2>

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            required
          />

          <select
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-400 focus:ring dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              {isEditing ? "Save Changes" : "Add User"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Role</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-700 dark:text-zinc-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300">{user.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(user)}
                        className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
