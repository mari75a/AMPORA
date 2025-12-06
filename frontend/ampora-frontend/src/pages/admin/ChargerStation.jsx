import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function ChargerStationPage() {
  const [stations, setStations] = useState([
    {
      stationId: "S001",
      name: "Colombo Station",
      address: "123 Main St, Colombo",
      latitude: 6.9271,
      longitude: 79.8612,
      status: "Active",
    },
    {
      stationId: "S002",
      name: "Galle Station",
      address: "45 Beach Rd, Galle",
      latitude: 6.0535,
      longitude: 80.22,
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    stationId: "",
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "",
  });

  // Search filter
  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.stationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalStations = stations.length;
  const activeStations = stations.filter((s) => s.status === "Active").length;
  const inactiveStations = stations.filter(
    (s) => s.status === "Inactive"
  ).length;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setForm({
      stationId: "",
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      status: "",
    });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setForm(stations[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const saveStation = () => {
    if (editIndex !== null) {
      const updated = [...stations];
      updated[editIndex] = form;
      setStations(updated);
    } else {
      setStations([...stations, form]);
    }
    setShowModal(false);
  };

  const deleteStation = (index) => {
    setStations(stations.filter((_, i) => i !== index));
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
                <p className="text-xs text-gray-500 font-medium">Locations</p>
                <p className="text-2xl font-bold text-gray-800">
                  {stations.length}
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
                {filteredStations.map((s, index) => (
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
                          onClick={() => openEditModal(index)}
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteStation(index)}
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

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {editIndex !== null ? "Edit Station" : "Add New Station"}
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
                  name="stationId"
                  placeholder="Station ID"
                  value={form.stationId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
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
                  placeholder="Status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
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
                  onClick={saveStation}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm"
                >
                  {editIndex !== null ? "Update" : "Add"} Station
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
