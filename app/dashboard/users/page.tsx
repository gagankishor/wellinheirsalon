"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserRow {
  _id: string;
  email: string;
  role: string;
  staffId?: { name: string };
  createdAt: string;
}

export default function UsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((d) => setUsers(Array.isArray(d) ? d : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Remove user "${email}"? They will no longer be able to sign in.`)) return;
    const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
    const data = await res.json();
    if (res.ok) fetchUsers();
    else alert(data.error || "Failed to delete.");
  };

  if (session?.user?.role !== "super_admin") {
    return (
      <div className="p-8">
        <p className="text-[var(--muted)]">Only super admin can manage users.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-[var(--foreground)] mb-6">Users</h1>
      <p className="text-sm text-[var(--muted)] mb-6">
        Staff and admin logins. Deleting a user removes their sign-in access.
      </p>
      {loading ? (
        <p className="text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--card-hover)]">
                <th className="p-3 font-medium">Email</th>
                <th className="p-3 font-medium">Role</th>
                <th className="p-3 font-medium">Staff</th>
                <th className="p-3 font-medium">Created</th>
                <th className="p-3 font-medium w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-[var(--border)] hover:bg-[var(--card-hover)]">
                  <td className="p-3 font-medium">{u.email}</td>
                  <td className="p-3">
                    <span className={u.role === "super_admin" ? "text-[var(--accent)]" : ""}>{u.role}</span>
                  </td>
                  <td className="p-3 text-[var(--muted)]">{u.staffId?.name ?? "—"}</td>
                  <td className="p-3 text-[var(--muted)]">{format(new Date(u.createdAt), "d MMM yyyy")}</td>
                  <td className="p-3">
                    {u._id !== session?.user?.id ? (
                      <button
                        type="button"
                        onClick={() => deleteUser(u._id, u.email)}
                        className="rounded border border-red-500/50 p-1.5 text-red-500 hover:bg-red-500/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <span className="text-xs text-[var(--muted)]">(you)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-8 text-center text-[var(--muted)]">No users.</p>
          )}
        </div>
      )}
    </div>
  );
}
