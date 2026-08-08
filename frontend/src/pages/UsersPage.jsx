import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import ErrorBanner from "../components/ui/ErrorBanner";
import EmptyState from "../components/ui/EmptyState";
import { createUser, deleteUser, listUsers } from "../api/firebase";

const EMPTY_FORM = { name: "", email: "", income: "", credit_score: "" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
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
      setForm(EMPTY_FORM);
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

  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <AppLayout>
      <PageHeader
        kicker="Firebase Realtime Database"
        title="Users"
        subtitle="Live sync with trustflow-5f98e-default-rtdb.firebaseio.com"
      />

      <div className="px-margin-desktop py-md pb-xl">
        <ErrorBanner message={error} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <Card className="lg:col-span-1 self-start">
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
                  onChange={setField("name")}
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
                  onChange={setField("email")}
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
                  onChange={setField("income")}
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
                  onChange={setField("credit_score")}
                />
              </div>
              <Button
                type="submit"
                loading={submitting}
                icon="cloud_upload"
                className="w-full"
              >
                {submitting ? "Saving..." : "Save to Firebase"}
              </Button>
            </form>
          </Card>

          <Card className="lg:col-span-2">
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
              <Button
                variant="ghost"
                size="sm"
                icon="refresh"
                onClick={refresh}
              >
                Refresh
              </Button>
            </div>

            {loading ? (
              <p className="font-body-md text-body-md text-on-surface-variant">
                Loading users...
              </p>
            ) : users.length === 0 ? (
              <EmptyState
                icon="group"
                title="No users in Firebase yet"
                message="Add one on the left to get started."
              />
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
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
