import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function Vehicle() {
  const [vehicles, setVehicles] = useState([
    {
      vehicleId: "V001",
      model: "Tesla Model 3",
      batteryCapacityKwh: 60,
      efficiencyKmPerKwh: 6,
      connectorType: "Type 2",
      userId: "U101",
    },
    {
      vehicleId: "V002",
      model: "Nissan Leaf",
      batteryCapacityKwh: 40,
      efficiencyKmPerKwh: 5,
      connectorType: "CHAdeMO",
      userId: "U103",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    vehicleId: "",
    model: "",
    batteryCapacityKwh: "",
    efficiencyKmPerKwh: "",
    connectorType: "",
    userId: "",
  });

  // Filter Vehicles (Search)
  const filteredVehicles = vehicles.filter(
    (v) =>
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.userId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalVehicles = vehicles.length;
  const avgBattery =
    vehicles.reduce((sum, v) => sum + Number(v.batteryCapacityKwh), 0) /
      totalVehicles || 0;
  const avgEfficiency =
    vehicles.reduce((sum, v) => sum + Number(v.efficiencyKmPerKwh), 0) /
      totalVehicles || 0;
  const uniqueUsers = new Set(vehicles.map((v) => v.userId)).size;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({
      vehicleId: "",
      model: "",
      batteryCapacityKwh: "",
      efficiencyKmPerKwh: "",
      connectorType: "",
      userId: "",
    });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setForm(vehicles[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const saveVehicle = () => {
    if (editIndex !== null) {
      const updated = [...vehicles];
      updated[editIndex] = form;
      setVehicles(updated);
    } else {
      setVehicles([...vehicles, form]);
    }
    setShowModal(false);
  };

  const deleteVehicle = (index) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

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

        {/* Table Section */}
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
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition shadow-sm"
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
                {filteredVehicles.map((v, index) => (
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
                          onClick={() => openEditModal(index)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteVehicle(index)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                {editIndex !== null ? "Edit Vehicle" : "Add New Vehicle"}
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
              >
                Cancel
              </button>
              <button
                onClick={saveVehicle}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm"
              >
                {editIndex !== null ? "Update" : "Add"} Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
