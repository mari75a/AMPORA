import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "./component/Modal";
import {
  fetchBokking,
  createBooking,
  updateBooking,
  deleteCharger as deleteBooking,
} from "./api/bookingService";
import { fetchUser } from "./api/userService";
import { fetchChargers } from "./api/chargerService.jsx";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUsers] = useState([]);
  const [charger, setChargers] = useState([]);

  const [form, setForm] = useState({
    userId: "",
    chargerId: "",
    date: "",
    startTime: "",
    endTime: "",
    amount: "",
    status: "",
  });

  const normalizeTime = (t) => (t && t.length === 5 ? `${t}:00` : t);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchUser();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchChargers();
        setChargers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    const data = await fetchBokking();
    setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  // === Cards data ===
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const completed = bookings.filter((b) => b.status === "COMPLETED").length;
  const cancelled = bookings.filter((b) => b.status === "CANCELLED").length;

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return bookings.filter(
      (b) =>
        b.bookingId?.toLowerCase().includes(t) ||
        b.userId?.toLowerCase().includes(t) ||
        b.chargerId?.toLowerCase().includes(t) ||
        b.status?.toLowerCase().includes(t)
    );
  }, [searchTerm, bookings]);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      userId: "",
      chargerId: "",
      date: "",
      startTime: "",
      endTime: "",
      amount: "",
      status: "",
    });
    setShowModal(true);
  };

  const openEdit = (b) => {
    setEditingId(b.bookingId);
    setForm(b);
    setShowModal(true);
  };

  const save = async () => {
    if (
      !form.userId ||
      !form.chargerId ||
      !form.date ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Fill all fields!");
      return;
    }

    const payload = {
      userId: form.userId,
      chargerId: form.chargerId,
      date: form.date,
      startTime: normalizeTime(form.startTime),
      endTime: normalizeTime(form.endTime),
      status: form.status || "PENDING",
      amount: Number(form.amount),
    };

    try {
      if (editingId) {
        await updateBooking(editingId, payload);
        alert("Booking Updated ✔");
      } else {
        await createBooking(payload);
        alert("Booking Created ✔");
      }

      setShowModal(false);
      loadBookings();
    } catch (e) {
      alert("Backend error: " + e.message);
    }
  };

  const statusColor = (s) =>
    s === "PENDING"
      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
      : s === "COMPLETED"
      ? "bg-green-50 text-green-700 border-green-200"
      : s === "CANCELLED"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-16 m-12">
      <div className="max-w-7xl mx-auto">
        {/* ===== CARDS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">
                  Total Booking
                </p>
                <p className="text-2xl font-bold text-gray-800">{total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-purple-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-orange-500 rounded-lg"></div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Cancelled</p>
                <p className="text-2xl font-bold text-gray-800">{cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between">
            <h2 className="text-xl font-semibold">Booking Registry</h2>
            <div className="flex gap-3">
              <input
                placeholder="Search..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border rounded-xl"
              />
              <button
                onClick={openAdd}
                className="addBtn px-4 py-2 rounded-xl flex gap-2"
              >
                <Plus size={18} /> Add Booking
              </button>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500">
                <th className="p-4">ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Charger</th>
                <th className="p-4">Date</th>
                <th className="p-4">Start</th>
                <th className="p-4">End</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr
                  key={b.bookingId}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 text-xs">{b.bookingId}</td>
                  <td className="p-4">{b.userId}</td>
                  <td className="p-4">{b.chargerId}</td>
                  <td className="p-4">{b.date}</td>
                  <td className="p-4">{b.startTime}</td>
                  <td className="p-4">{b.endTime}</td>
                  <td className="p-4">Rs.{b.amount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border ${statusColor(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => openEdit(b)}
                      className="bg-blue-50 p-2 rounded-lg"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => remove(b.bookingId)}
                      className="bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== MODAL ===== */}
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title="Booking"
        >
          <div className="space-y-3">
            <select
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select User</option>

              {user.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.fullName} ({user.email})
                </option>
              ))}
            </select>

            <select
              value={form.chargerId}
              onChange={(e) => setForm({ ...form, chargerId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Charger</option>

              {charger.map((chargers) => (
                <option key={chargers.chargerID} value={chargers.chargerID}>
                  {chargers.type}-{chargers.powerKw} kw
                </option>
              ))}
            </select>

            {["date", "startTime", "endTime"].map((f) => (
              <input
                key={f}
                type={
                  f === "date" ? "date" : f.includes("Time") ? "time" : "text"
                }
                value={form[f] || ""}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                placeholder={f}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            ))}
            <input
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: Number(e.target.value) })
              }
            />

            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Status</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <button
              onClick={save}
              className="w-full bg-blue-600 text-white py-2 rounded-xl"
            >
              Save
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
