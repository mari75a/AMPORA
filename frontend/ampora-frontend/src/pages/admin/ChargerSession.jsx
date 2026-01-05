import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { fetchChargers } from "./api/chargerService.jsx";
import { fetchUser } from "./api/userService.jsx";
import {
  fetchSessions,
  createSession,
  updateSession,
  deleteSession,
} from "./api/chargerSession.jsx";
import Modal from "./component/Modal.jsx";

export default function Payment() {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    userId: "",
    chargerId: "",
    energyUsedKwh: "",
    cost: "",
    startTime: "",
    endTime: "",
    sessionStatus: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSessions();
        setSessions(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load charging sessions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Stats
  const totalSessions = sessions.length;
  const totalEnergy = sessions.reduce(
    (sum, s) => sum + Number(s.energyUsedKwh || 0),
    0
  );
  const totalRevenue = sessions.reduce(
    (sum, s) => sum + Number(s.cost || 0),
    0
  );
  const ongoingSessions = sessions.filter(
    (s) => s.sessionStatus === "ONGOING"
  ).length;
  const completedSessions = sessions.filter(
    (s) => s.sessionStatus === "COMPLETED"
  ).length;

  // Filter
  const filteredSessions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return sessions;

    return sessions.filter((s) => {
      const idStr = String(s.sessionId || s.id || "").toLowerCase();
      return (
        idStr.includes(term) ||
        s.userId?.toLowerCase().includes(term) ||
        s.chargerId?.toLowerCase().includes(term)
      );
    });
  }, [sessions, searchTerm]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAddModal = () => {
    setEditingSessionId(null);
    setForm({
      userId: "",
      chargerId: "",
      energyUsedKwh: "",
      cost: "",
      startTime: "",
      endTime: "",
      sessionStatus: "",
    });
    setShowModal(true);
  };

  const openEditModal = (session) => {
    setEditingSessionId(session.sessionId || session.id);
    setForm({
      userId: session.userId || "",
      chargerId: session.chargerId || "",
      energyUsedKwh: session.energyUsedKwh ?? "",
      cost: session.cost ?? "",
      startTime: session.startTime ? session.startTime.slice(0, 16) : "",
      endTime: session.endTime ? session.endTime.slice(0, 16) : "",
      sessionStatus: session.sessionStatus || "",
    });
    setShowModal(true);
  };

  const saveSession = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        userId: form.userId,
        chargerId: form.chargerId,
        energyUsedKwh:
          form.energyUsedKwh === "" ? 0 : Number(form.energyUsedKwh),
        cost: form.cost === "" ? 0 : Number(form.cost),
        startTime: form.startTime
          ? form.startTime.length === 16
            ? form.startTime + ":00"
            : form.startTime
          : null,
        endTime: form.endTime
          ? form.endTime.length === 16
            ? form.endTime + ":00"
            : form.endTime
          : null,
        sessionStatus: form.sessionStatus,
      };

      if (editingSessionId === null) {
        await createSession(payload);
      } else {
        await updateSession(editingSessionId, payload);
      }

      const data = await fetchSessions();
      setSessions(data || []);

      setShowModal(false);
      setEditingSessionId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save charging session");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sessionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this charging session?"
    );
    if (!confirmed) return;

    try {
      await deleteSession(sessionId);
      setSessions((prev) =>
        prev.filter((s) => (s.sessionId || s.id) !== sessionId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete charging session");
    }
  };
  useEffect(() => {
    const loadChargers = async () => {
      try {
        const data = await fetchChargers();
        setChargers(data || []);
      } catch (err) {
        console.error("Failed to load chargers:", err);
      }
    };
    loadChargers();
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUser();
        setUsers(data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };
    loadUsers();
  }, []);
  const uniqueStations = useMemo(() => {
    const seen = new Set();

    return chargers.filter((c) => {
      if (seen.has(c.stationName)) return false;
      seen.add(c.stationName);
      return true;
    });
  }, [chargers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-16 m-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Sessions
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Energy Used
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalEnergy.toFixed(2)} <span className="text-sm">kWh</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-purple-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  Rs. {totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-orange-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Ongoing / Completed
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {ongoingSessions} / {completedSessions}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Charging Sessions
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by session, user, charger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                onClick={openAddModal}
                className="addBtn px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Plus size={20} /> Add Session
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">Loading sessions...</div>
          )}
          {error && <div className="p-4 text-sm text-red-500">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Session ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Charger
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Energy (kWh)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Start Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    End Time
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((s) => {
                  const id = s.sessionId || s.id;
                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{id}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.userId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.chargerId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.energyUsedKwh}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        Rs. {s.cost}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            s.sessionStatus === "ONGOING"
                              ? "bg-blue-100 text-blue-700"
                              : s.sessionStatus === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : s.sessionStatus === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {s.sessionStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.startTime}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {s.endTime}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(s)}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {!loading && filteredSessions.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No charging sessions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={
          editingSessionId ? "Edit Charging Session" : "Add Charging Session"
        }
        footer={
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={saveSession}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      >
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <select
                name="userId"
                value={form.userId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select User</option>
                {users
                  .filter((user) => user.role === "USER")
                  .map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.fullName}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Charger ID
              </label>
              <select
                name="chargerId"
                value={form.chargerId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select Charger</option>

                {chargers.map((c) => (
                  <option key={c.chargerID} value={c.chargerID}>
                    {c.stationName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Energy Used (kWh)
              </label>
              <input
                type="number"
                name="energyUsedKwh"
                value={form.energyUsedKwh}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost
              </label>
              <input
                type="number"
                name="cost"
                value={form.cost}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Status
              </label>
              <select
                name="sessionStatus"
                value={form.sessionStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="">Select Status</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
