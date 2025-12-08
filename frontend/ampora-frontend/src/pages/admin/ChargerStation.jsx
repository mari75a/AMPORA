import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchStations,
  createStation,
  updateStation,
  deleteStation as deleteStationApi,
} from "./api/stationService";

export default function ChargerStationPage() {
  const [stations, setStations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStationId, setEditingStationId] = useState(null); // store stationId
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "",
  });

  // Load stations from backend on mount
  useEffect(() => {
    const load = async () => {
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
    load();
  }, []);

  const totalStations = stations.length;
  const activeStations = stations.filter((s) => s.status === "ACTIVE").length;
  const inactiveStations = stations.filter(
    (s) => s.status === "INACTIVE"
  ).length;
  const UNDER_MAINTENANCEStations = stations.filter(
    (s) => s.status === "UNDER_MAINTENANCE"
  ).length;

  const filteredStations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return stations;

    return stations.filter((s) => {
      const idStr = String(s.stationId || "").toLowerCase();
      return (
        s.name?.toLowerCase().includes(term) ||
        idStr.includes(term) ||
        s.address?.toLowerCase().includes(term)
      );
    });
  }, [searchTerm, stations]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const openAddModal = () => {
    setEditingStationId(null);
    setForm({
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      status: "",
    });
    setShowModal(true);
  };

  const openEditModal = (station) => {
    setEditingStationId(station.stationId);
    setForm({
      name: station.name || "",
      address: station.address || "",
      latitude: station.latitude ?? "",
      longitude: station.longitude ?? "",
      status: station.status || "",
    });
    setShowModal(true);
  };

  const saveStation = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: form.name,
        address: form.address,
        latitude: form.latitude === "" ? null : Number(form.latitude),
        longitude: form.longitude === "" ? null : Number(form.longitude),
        status: form.status,
      };

      if (editingStationId === null) {
        await createStation(payload);
      } else {
        await updateStation(editingStationId, payload);
      }

      const data = await fetchStations();
      setStations(data || []);

      setShowModal(false);
      setEditingStationId(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save station");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStation = async (stationId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this station?"
    );
    if (!confirmed) return;

    try {
      await deleteStationApi(stationId);
      setStations((prev) => prev.filter((s) => s.stationId !== stationId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete station");
    }
  };

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
                  Total Stations
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalStations}
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
                  Active Stations
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {activeStations}
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
                  Inactive Stations
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {inactiveStations}
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
                  Under Maintenance
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {UNDER_MAINTENANCEStations}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Charger Stations
            </h2>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                onClick={openAddModal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Plus size={20} /> Add Station
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-4 text-sm text-gray-500">Loading stations...</div>
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
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Latitude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Longitude
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStations.map((s) => (
                  <tr
                    key={s.stationId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.stationId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {s.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.latitude}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.longitude}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                          s.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {s.status}
                      </span>
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
                          onClick={() => handleDeleteStation(s.stationId)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredStations.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-6 text-center text-sm text-gray-500"
                    >
                      No stations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editingStationId !== null
                    ? "Edit Station"
                    : "Add New Station"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="address"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="latitude"
                  placeholder="Latitude"
                  type="number"
                  value={form.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="longitude"
                  placeholder="Longitude"
                  type="number"
                  value={form.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="status"
                  placeholder='Status (e.g. "Active" or "Inactive")'
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  onClick={saveStation}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm disabled:opacity-60"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingStationId !== null
                    ? "Update Station"
                    : "Add Station"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
