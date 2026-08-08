import { useEffect, useState } from "react";
import SideNav from "../components/layout/SideNav";
import { createUser, deleteUser, listUsers } from "../api/firebase";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    income: "",
    credit_score: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      setUsers(await listUsers());
      setError(null);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Couldn't load users from Firebase. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createUser({
        name: form.name.trim(),
        email: form.email.trim(),
        income: form.income ? Number(form.income) : undefined,
        credit_score: form.credit_score
          ? Number(form.credit_score)
          : undefined,
      });
      setForm({ name: "", email: "", income: "", credit_score: "" });
      await refresh();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Couldn't save the user to Firebase. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user from Firebase?")) return;
    try {
      await deleteUser(id);
      await refresh();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Couldn't delete the user. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-on-surface">
      <SideNav />
      <main className="flex-1 flex flex-col md:ml-64 relative">
        <div className="px-margin-desktop py-lg border-b border-surface-container-high bg-surface sticky top-0 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="font-label-sm text-label-sm text-primary tracking-widest uppercase">
              Firebase Realtime Database
            </span>
          </div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Users
          </h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            Live sync with trustflow-5f98e-default-rtdb.firebaseio.com
          </p>
        </div>

        <div className="px-margin-desktop py-md pb-xl">
          {error && (
            <div className="bg-surface-container border border-error/30 rounded-2xl p-md mb-md">
              <p className="font-body-md text-body-md text-error">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-1 bg-surface-container rounded-2xl p-md border border-outline-variant/30 self-start">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-fixed">
                  person_add
                </span>
                Add User
              </h3>
              <form onSubmit={handleCreate} className="space-y-sm">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Name
                  </label>
                  <input
                    className="input-base"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Email
                  </label>
                  <input
                    className="input-base"
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Annual Income
                  </label>
                  <input
                    className="input-base"
                    type="number"
                    min="0"
                    value={form.income}
                    onChange={(e) =>
                      setForm({ ...form, income: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                    Credit Score
                  </label>
                  <input
                    className="input-base"
                    type="number"
                    min="300"
                    max="900"
                    value={form.credit_score}
                    onChange={(e) =>
                      setForm({ ...form, credit_score: e.target.value })
                    }
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full font-label-md text-label-md bg-primary text-on-primary-container px-lg py-sm rounded-lg font-semibold hover:bg-primary-fixed transition-colors flex items-center justify-center gap-xs shadow-[0_4px_14px_rgba(107,216,203,0.3)] disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">
                    cloud_upload
                  </span>
                  {submitting ? "Saving..." : "Save to Firebase"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 bg-surface-container rounded-2xl p-md border border-outline-variant/30">
              <div className="flex items-center justify-between mb-md">
                <h3 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed">
                    group
                  </span>
                  Firebase Users
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    ({users.length})
                  </span>
                </h3>
                <button
                  onClick={refresh}
                  className="flex items-center gap-xs font-label-sm text-label-sm text-primary hover:text-primary-fixed transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Loading users...
                </p>
              ) : users.length === 0 ? (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  No users in Firebase yet. Add one on the left.
                </p>
              ) : (
                <div className="space-y-sm">
                  {users.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-start justify-between gap-sm p-md bg-surface-container-low rounded-xl border border-outline-variant/20"
                    >
                      <div className="flex items-start gap-sm min-w-0">
                        <div className="p-xs bg-surface-container-highest rounded-lg text-primary shrink-0">
                          <span className="material-symbols-outlined">
                            account_circle
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-body-md text-body-md font-semibold text-on-surface truncate">
                            {u.name || "Unnamed"}
                          </h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                            {u.email}
                          </p>
                          <div className="flex flex-wrap gap-xs mt-sm">
                            {u.income != null && (
                              <span className="font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded">
                                ${Number(u.income).toLocaleString()}
                              </span>
                            )}
                            {u.credit_score != null && (
                              <span className="font-label-sm text-label-sm bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded">
                                Score {u.credit_score}
                              </span>
                            )}
                            <span className="font-label-sm text-label-sm bg-primary/10 text-primary px-2 py-0.5 rounded font-mono">
                              {u.id.slice(0, 12)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-on-surface-variant hover:text-error transition-colors shrink-0"
                        aria-label={`Delete ${u.name}`}
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
