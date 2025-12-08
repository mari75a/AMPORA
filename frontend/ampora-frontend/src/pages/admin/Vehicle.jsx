import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicleApi,
} from "./api/vehicleService";

const emptyForm = {
  vehicleId: "",
  model: "",
  batteryCapacityKwh: "",
  efficiencyKmPerKwh: "",
  connectorType: "",
  userId: "",
};

export default function Vehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null); // vehicleId we’re editing
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchVehicles();
        setVehicles(data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to load vehicles");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const totalVehicles = vehicles.length;

  const avgBattery = useMemo(() => {
    if (vehicles.length === 0) return 0;
    const sum = vehicles.reduce(
      (acc, v) => acc + Number(v.batteryCapacityKwh || 0),
      0
    );
    return sum / vehicles.length;
  }, [vehicles]);

  const avgEfficiency = useMemo(() => {
    if (vehicles.length === 0) return 0;
    const sum = vehicles.reduce(
      (acc, v) => acc + Number(v.efficiencyKmPerKwh || 0),
      0
    );
    return sum / vehicles.length;
  }, [vehicles]);

  const uniqueUsers = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.userId));
    return set.size;
  }, [vehicles]);

  // 🔍 Search filter
  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return vehicles;

    return vehicles.filter((v) => {
      return (
        v.vehicleId?.toLowerCase().includes(term) ||
        v.model?.toLowerCase().includes(term) ||
        v.connectorType?.toLowerCase().includes(term) ||
        v.userId?.toLowerCase().includes(term)
      );
    });
  }, [vehicles, searchTerm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setForm({
      vehicleId: vehicle.vehicleId ?? "",
      model: vehicle.model ?? "",
      batteryCapacityKwh: vehicle.batteryCapacityKwh ?? "",
      efficiencyKmPerKwh: vehicle.efficiencyKmPerKwh ?? "",
      connectorType: vehicle.connectorType ?? "",
      userId: vehicle.userId ?? "",
    });
    setEditId(vehicle.vehicleId);
    setShowModal(true);
  };

  const saveVehicle = async () => {
    try {
      setSaving(true);
      setError(null);

      const payload = {
        ...form,
        batteryCapacityKwh: Number(form.batteryCapacityKwh),
        efficiencyKmPerKwh: Number(form.efficiencyKmPerKwh),
      };

      if (!editId) {
        const created = await createVehicle(payload);
        setVehicles((prev) => [...prev, created]);
      } else {
        const updated = await updateVehicle(editId, payload);
        setVehicles((prev) =>
          prev.map((v) => (v.vehicleId === editId ? { ...v, ...updated } : v))
        );
      }

      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save vehicle");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (vehicleId) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    try {
      await deleteVehicleApi(vehicleId);
      setVehicles((prev) => prev.filter((v) => v.vehicleId !== vehicleId));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete vehicle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-16 m-12">
      <div className="max-w-7xl mx-auto">
        {/* Error / Loading */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading && (
          <div className="mb-4 text-sm text-gray-500">Loading vehicles...</div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Vehicles
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalVehicles}
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
                <p className="text-xs text-gray-500 font-medium">Avg Battery</p>
                <p className="text-2xl font-bold text-gray-800">
                  {avgBattery.toFixed(0)} <span className="text-sm">kWh</span>
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
                  Avg Efficiency
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {avgEfficiency.toFixed(1)}{" "}
                  <span className="text-sm">km/kWh</span>
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
                  Active Users
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {uniqueUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Vehicle Registry
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
                className="px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
              >
                <Plus size={20} /> Add Vehicle
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Model
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Battery
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Efficiency
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Connector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    User
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVehicles.map((v) => (
                  <tr
                    key={v.vehicleId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {v.vehicleId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {v.model}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {v.batteryCapacityKwh} kWh
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {v.efficiencyKmPerKwh} km/kWh
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium">
                        {v.connectorType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {v.userId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(v.vehicleId)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filteredVehicles.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-gray-500"
                    >
                      No vehicles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {editId ? "Edit Vehicle" : "Add New Vehicle"}
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
                name="vehicleId"
                placeholder="Vehicle ID"
                value={form.vehicleId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={!!editId} // avoid changing ID on edit
              />
              <input
                name="model"
                placeholder="Model"
                value={form.model}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="batteryCapacityKwh"
                placeholder="Battery Capacity (kWh)"
                type="number"
                value={form.batteryCapacityKwh}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="efficiencyKmPerKwh"
                placeholder="Efficiency (km/kWh)"
                type="number"
                value={form.efficiencyKmPerKwh}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="connectorType"
                placeholder="Connector Type"
                value={form.connectorType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="userId"
                placeholder="User ID"
                value={form.userId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                onClick={saveVehicle}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm disabled:opacity-60"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editId
                  ? "Update Vehicle"
                  : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
