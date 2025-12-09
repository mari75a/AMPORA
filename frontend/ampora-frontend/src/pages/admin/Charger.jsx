import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  fetchChargers,
  createCharger,
  updateCharger,
  deleteCharger,
} from "./api/chargerService";
import Modal from "./component/Modal";
import { fetchStations } from "./api/stationService";

export default function ChargerPage() {
  const location = useLocation();
  const [chargers, setChargers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingChargerId, setEditingChargerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [stations, setStations] = useState([]);

  const [form, setForm] = useState({
    type: "",
    powerKw: "",
    status: "",
    stationId: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchChargers();
        setChargers(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load chargers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalChargers = chargers.length;
  const totalPower = chargers.reduce(
    (sum, c) => sum + Number(c.powerKw || 0),
    0
  );
  const availableChargers = chargers.filter(
    (c) => c.status === "AVAILABLE"
  ).length;
  const inUseChargers = chargers.filter(
    (c) => c.status === "UNAVAILABLE"
  ).length;

  const filteredChargers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return chargers;

    return chargers.filter((c) => {
      const id = String(c.chargerID || c.chargerId || "").toLowerCase();
      return (
        id.includes(term) ||
        c.type?.toLowerCase().includes(term) ||
        c.status?.toLowerCase().includes(term) ||
        c.stationName?.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, chargers]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAddModal = () => {
    setEditingChargerId(null);
    setForm({
      type: "",
      powerKw: "",
      status: "",
      stationId: "",
    });
    setShowModal(true);
  };

  const openEditModal = (charger) => {
    const id = charger.chargerID || charger.chargerId;
    setEditingChargerId(id);
    setForm({
      type: charger.type || "",
      powerKw: charger.powerKw ?? "",
      status: charger.status || "",
      stationId: charger.stationId || "",
    });
    setShowModal(true);
  };

  const saveCharger = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        type: form.type,
        powerKw: form.powerKw === "" ? 0 : Number(form.powerKw),
        status: form.status,
        stationId: form.stationId,
      };

      if (editingChargerId === null) {
        // CREATE
        await createCharger(payload);
      } else {
        // UPDATE
        await updateCharger(editingChargerId, payload);
      }

      const data = await fetchChargers();
      setChargers(data || []);

      setShowModal(false);
      setEditingChargerId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save charger");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (chargerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this charger?"
    );
    if (!confirmed) return;

    try {
      await deleteCharger(chargerId);
      setChargers((prev) =>
        prev.filter((c) => (c.chargerID || c.chargerId) !== chargerId)
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete charger");
    }
  };

  useEffect(() => {
    const loads = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStations();
        setStations(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load stations");
      } finally {
        setLoading(false);
      }
    };
    loads();
  }, []);

  useEffect(() => {
    if (location.state?.openAddModal) {
      openAddModal();
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-16 m-12">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Chargers
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalChargers}
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
                <p className="text-xs text-gray-500 font-medium">Total Power</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalPower.toFixed(1)} kW
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
                  Available Chargers
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {availableChargers}
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
                <p className="text-xs text-gray-500 font-medium">Unavailable</p>
                <p className="text-2xl font-bold text-gray-800">
                  {inUseChargers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Chargers</h2>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search by charger, type, station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                onClick={openAddModal}
                className="addBtn px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Plus size={20} /> Add Charger
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">Loading chargers...</div>
          )}
          {error && <div className="p-4 text-sm text-red-500">{error}</div>}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Power (kW)
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Station
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredChargers.map((c) => {
                  const id = c.chargerID || c.chargerId;
                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">{id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {c.type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {c.powerKw}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            c.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : c.status === "MAINTENANCE"
                              ? "bg-blue-100 text-blue-700"
                              : c.status === "UNAVAILABLE"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {c.stationName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(c)}
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

                {!loading && filteredChargers.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No chargers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingChargerId ? "Edit Charger" : "Add Charger"}
        footer={
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveCharger}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select type</option>
              <option value="Slow">Slow</option>
              <option value="Fast">Fast</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Power (kW)
            </label>
            <input
              type="number"
              name="powerKw"
              value={form.powerKw}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select status</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="UNAVAILABLE">UNAVAILABLE</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Station ID
            </label>
            <select
              name="stationId"
              value={form.stationId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select station</option>
              {stations.map((station) => (
                <option key={station.stationId} value={station.stationId}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
