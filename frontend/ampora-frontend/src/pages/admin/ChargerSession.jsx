import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function Payment() {
  const [payments, setPayments] = useState([
    {
      paymentId: "P001",
      userId: "U101",
      invoiceId: "INV001",
      sessionId: "S001",
      amount: 1500.0,
      method: "CARD",
      status: "SUCCESS",
      timestamp: "2024-11-21 10:30",
      transactionId: "TXN-998877",
    },
    {
      paymentId: "P002",
      userId: "U102",
      invoiceId: null,
      sessionId: "S002",
      amount: 800.0,
      method: "CASH",
      status: "PENDING",
      timestamp: "2024-11-22 14:10",
      transactionId: "TXN-559922",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    paymentId: "",
    userId: "",
    invoiceId: "",
    sessionId: "",
    amount: "",
    method: "",
    status: "",
    timestamp: "",
    transactionId: "",
  });

  // Filter Payments
  const filteredPayments = payments.filter(
    (p) =>
      p.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const successfulPayments = payments.filter(
    (p) => p.status === "SUCCESS"
  ).length;
  const pendingPayments = payments.filter((p) => p.status === "PENDING").length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setForm({
      paymentId: "",
      userId: "",
      invoiceId: "",
      sessionId: "",
      amount: "",
      method: "",
      status: "",
      timestamp: "",
      transactionId: "",
    });
    setEditIndex(null);
    setShowModal(true);
  };

  const openEditModal = (index) => {
    setForm(payments[index]);
    setEditIndex(index);
    setShowModal(true);
  };

  const savePayment = () => {
    if (editIndex !== null) {
      const updated = [...payments];
      updated[editIndex] = form;
      setPayments(updated);
    } else {
      setPayments([...payments, form]);
    }
    setShowModal(false);
  };

  const deletePayment = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-16 m-12">
      <div className="max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-xs text-gray-500 font-medium">Total Payments</p>
            <p className="text-2xl font-bold text-gray-800">{totalPayments}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-xs text-gray-500 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">
              Rs. {totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-xs text-gray-500 font-medium">
              Successful Payments
            </p>
            <p className="text-2xl font-bold text-green-700">
              {successfulPayments}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="text-xs text-gray-500 font-medium">
              Pending Payments
            </p>
            <p className="text-2xl font-bold text-orange-600">
              {pendingPayments}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Payment Records
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
                <Plus size={20} /> Add Payment
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
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Session
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Method
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">
                    Transaction
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((p, index) => (
                  <tr
                    key={p.paymentId}
                    className="border-b border-gray-50 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.paymentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.invoiceId || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.sessionId || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      Rs. {p.amount}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-medium">
                        {p.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          p.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : p.status === "PENDING"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.transactionId}
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
                          onClick={() => deletePayment(index)}
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
                {editIndex !== null ? "Edit Payment" : "Add New Payment"}
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
                name="paymentId"
                placeholder="Payment ID"
                value={form.paymentId}
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
              <input
                name="invoiceId"
                placeholder="Invoice ID"
                value={form.invoiceId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="sessionId"
                placeholder="Session ID"
                value={form.sessionId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="transactionId"
                placeholder="Transaction ID"
                value={form.transactionId}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="">Select Method</option>
                <option>CARD</option>
                <option>ONLINE</option>
                <option>RFID</option>
                <option>CASH</option>
                <option>SUBSCRIPTION</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-xl"
              >
                <option value="">Select Status</option>
                <option>SUCCESS</option>
                <option>PENDING</option>
                <option>FAILED</option>
                <option>REFUNDED</option>
              </select>
              <input
                name="timestamp"
                type="datetime-local"
                value={form.timestamp}
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
                onClick={savePayment}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition font-medium shadow-sm"
              >
                {editIndex !== null ? "Update" : "Add"} Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
