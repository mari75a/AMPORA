import { useState } from "react";
import { Users, Search, UserPlus, X, Pencil, Trash2 } from "lucide-react";

export default function UserPage() {
  const [users, setUsers] = useState([
    {
      userId: "U01",
      fullName: "Adam Silva",
      email: "adam@gmail.com",
      phone: "0771234567",
      role: "Admin",
    },
    {
      userId: "U02",
      fullName: "Nishan Perera",
      email: "nishan@gmail.com",
      phone: "0779876543",
      role: "User",
    },
    {
      userId: "U03",
      fullName: "Kavindu Jay",
      email: "kavi@gmail.com",
      phone: "0714567890",
      role: "Manager",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    userId: "",
    fullName: "",
    email: "",
    phone: "",
    role: "",
  });

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const uniqueRoles = new Set(users.map((u) => u.role)).size;

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "Manager":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "User":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setForm({ userId: "", fullName: "", email: "", phone: "", role: "" });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setForm(users[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const saveUser = () => {
    if (editIndex !== null) {
      const updated = [...users];
      updated[editIndex] = form;
      setUsers(updated);
    } else {
      setUsers([...users, form]);
    }
    setShowModal(false);
  };

  const deleteUser = (index) => setUsers(users.filter((_, i) => i !== index));

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
                <p className="text-xs text-gray-500 font-medium">Total Users</p>
                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
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
                  Unique Roles
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {uniqueRoles}
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
                <p className="text-xs text-gray-500 font-medium">Admins</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.role === "Admin").length}
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
                <p className="text-xs text-gray-500 font-medium">Users</p>
                <p className="text-2xl font-bold text-gray-800">
                  {users.filter((u) => u.role === "User").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              User Registry
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
                <UserPlus size={20} /> Add User
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
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, index) => (
                  <tr
                    key={u.userId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.userId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {u.fullName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(
                          u.role
                        )}`}
                      >
                        {u.role}
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
                          onClick={() => deleteUser(index)}
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
                  {editIndex !== null ? "Edit User" : "Add New User"}
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
                  name="userId"
                  placeholder="User ID"
                  value={form.userId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="fullName"
                  placeholder="Full Name"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
                <input
                  name="role"
                  placeholder="Role"
                  value={form.role}
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
                  onClick={saveUser}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm"
                >
                  {editIndex !== null ? "Update" : "Add"} User
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
