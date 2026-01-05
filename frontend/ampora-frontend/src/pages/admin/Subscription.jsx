import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { fetchUser } from "./api/userService";
import {
  fetchSubscription,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "./api/subscriptionService";

const initialForm = {
  subscriptionId: "",
  userId: "",
  planName: "",
  monthlyFree: "",
  active: true,
};

export default function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState([]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState("create");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSubscription();
        setSubscriptions(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isModalOpen]);

  const openCreateModal = () => {
    setMode("create");
    setForm(initialForm);
    setSelectedId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (sub) => {
    setMode("edit");
    setForm({
      userId: sub.userId,
      planName: sub.planName,
      monthlyFree: sub.monthlyFree,
      active: sub.active,
    });
    setSelectedId(sub.subscriptionId);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.userId || !form.planName || !form.monthlyFree) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      subscriptionId:
        mode === "edit" ? selectedId : form.subscriptionId || null,
      userId: form.userId,
      planName: form.planName,
      monthlyFree: Number(form.monthlyFree),
      active: !!form.active,
    };

    try {
      setLoading(true);
      setError(null);

      if (mode === "create") {
        const created = await createSubscription(payload);

        setSubscriptions((prev) =>
          created ? [created, ...prev] : [payload, ...prev]
        );
      } else if (mode === "edit" && selectedId) {
        const updated = await updateSubscription(selectedId, payload);
        const newData = updated || payload;
        setSubscriptions((prev) =>
          prev.map((sub) => (sub.subscriptionId === selectedId ? newData : sub))
        );
      }

      setIsModalOpen(false);
      setForm(initialForm);
      setSelectedId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save subscription");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscription?"))
      return;

    try {
      setLoading(true);
      setError(null);
      await deleteSubscription(id);
      setSubscriptions((prev) =>
        prev.filter((sub) => sub.subscriptionId !== id)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete subscription");
    } finally {
      setLoading(false);
    }
  };

  const filtered = subscriptions.filter((sub) => {
    const text = (
      (sub.subscriptionId || "") +
      (sub.userId || "") +
      (sub.planName || "") +
      (sub.monthlyFree || "")
    )
      .toLowerCase()
      .replace(/\s+/g, "");
    const q = search.toLowerCase().replace(/\s+/g, "");
    return text.includes(q);
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUser();
        setUsers(response || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    if (isModalOpen) {
      loadUsers();
    }
  }, [isModalOpen]);

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center px-4 py-10">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Subscription Management
            </h1>
            <p className="text-sm text-slate-500">
              Create, view, update, and delete user subscriptions.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="addBtn inline-flex items-center gap-2 rounded-full bg-blue-600 text-white px-5 py-2.5 text-sm font-medium shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            New Subscription
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, plan, id..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-full border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-3 h-3" />
              Active
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-600">
              <XCircle className="w-3 h-3" />
              Inactive
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loading ? (
                "Loading subscriptions..."
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-slate-900">
                    {filtered.length}
                  </span>{" "}
                  subscriptions
                </>
              )}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    Subscription ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    User ID
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">
                    Plan Name
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    Monthly Fee
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      No subscriptions found. Try adjusting your search or
                      create a new one.
                    </td>
                  </tr>
                )}

                {filtered.map((sub) => (
                  <tr
                    key={sub.subscriptionId}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {sub.subscriptionId}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{sub.userId}</td>
                    <td className="px-4 py-3 text-slate-800">{sub.planName}</td>
                    <td className="px-4 py-3 text-right text-slate-800">
                      ${Number(sub.monthlyFree ?? 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {sub.active ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-600 px-2 py-1 text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-600 px-2 py-1 text-xs font-medium">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(sub)}
                          className="sbd p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(sub.subscriptionId)}
                          className="sbe p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {loading && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>

              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                {mode === "create"
                  ? "Create Subscription"
                  : "Edit Subscription"}
              </h2>
              <p className="text-xs text-slate-500 mb-4">
                Fill in the details below and click{" "}
                {mode === "create" ? "Create" : "Save"}.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-600 mb-1">
                    User ID <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="userId"
                    value={form.userId}
                    onChange={handleChange}
                    placeholder="USR-123"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select User</option>
                    {users
                      .filter((user) => user.role === "USER")
                      .map((user) => (
                        <option key={user.userId} value={user.userId}>
                          {user.fullName} ({user.userId})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    Plan Name <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="planName"
                    value={form.planName}
                    onChange={handleChange}
                    placeholder="Basic / Premium / Enterprise"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="">Select Plan</option>
                    <option value="Basic">Basic</option>
                    <option value="Premium">Premium</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">
                    Monthly Fee (USD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthlyFree"
                    value={form.monthlyFree}
                    onChange={handleChange}
                    placeholder="19.99"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-slate-600">
                    <input
                      type="checkbox"
                      name="active"
                      checked={form.active}
                      onChange={handleChange}
                      className="rounded border-slate-300"
                    />
                    <span>Active subscription</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-full text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 text-xs font-medium shadow-md"
                  >
                    {mode === "create" ? "Create" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
