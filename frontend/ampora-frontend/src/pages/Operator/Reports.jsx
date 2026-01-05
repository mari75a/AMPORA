import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

/* ---------------- SAMPLE DATA ---------------- */
const initialReports = [
  {
    id: "RPT-001",
    title: "Power fluctuation – Station 3",
    category: "Technical",
    date: "2025-01-18",
    status: "Open",
    description: "Voltage spikes during peak hours.",
    image: null,
  },
  {
    id: "RPT-002",
    title: "Connector damage – Slot 5",
    category: "Maintenance",
    date: "2025-01-17",
    status: "In Review",
    description: "Connector casing cracked.",
    image: null,
  },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);
  function deleteReport(id) {
  setReports(prev => prev.filter(r => r.id !== id));
}

function updateReport(updatedReport) {
  setReports(prev =>
    prev.map(r => (r.id === updatedReport.id ? updatedReport : r))
  );
}


  return (
     <div className="min-h-screen w-screen pt-20 px-8 pb-10 bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
          <DocumentTextIcon className="w-7 h-7 text-emerald-700" />
          Operator Reports
        </h1>

        {/* ADD BUTTON */}
        <button
          onClick={() => setShowForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#00C389",
            color: "#FFFFFF",
            padding: "10px 20px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 6px 16px rgba(0, 195, 137, 0.35)",
          }}
        >
          <PlusIcon style={{ width: "20px", height: "20px" }} />
          Add Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-w-5xl mx-auto">
        <StatCard
          label="Open"
          value={reports.filter(r => r.status === "Open").length}
          icon={ExclamationTriangleIcon}
          color="text-rose-600"
        />
        <StatCard
          label="In Review"
          value={reports.filter(r => r.status === "In Review").length}
          icon={ClockIcon}
          color="text-amber-600"
        />
        <StatCard
          label="Resolved"
          value={reports.filter(r => r.status === "Resolved").length}
          icon={CheckCircleIcon}
          color="text-emerald-600"
        />
      </div>

      {/* ADD FORM */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="bg-white p-6 rounded-xl border border-emerald-300 shadow-lg mb-6 max-w-2xl mx-auto"
          >
            <AddReportForm
              onCancel={() => setShowForm(false)}
              onAdd={report => {
                setReports([report, ...reports]);
                setShowForm(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPORT LIST */}
      <div className="bg-white rounded-xl border p-6 shadow-lg space-y-4 max-w-5xl mx-auto">
        {reports.map(report => (
  <ReportCard
    key={report.id}
    report={report}
    onDelete={deleteReport}
    onUpdate={updateReport}
  />
))}

        
        
      </div>
    </div>
  );
}

/* ---------------- ADD FORM ---------------- */
function AddReportForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical");
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const isDisabled = !title || !description;

  function submit(e) {
    e.preventDefault();
    if (isDisabled) return;

    onAdd({
      id: `RPT-${Math.floor(Math.random() * 9000)}`,
      title,
      category,
      date: new Date().toISOString().slice(0, 10),
      status: "Open",
      description,
      image: imagePreview || null,
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Report title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option>Technical</option>
        <option>Maintenance</option>
        <option>Billing</option>
        <option>Safety</option>
      </select>

      <textarea
        rows="4"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Describe the issue"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Upload Image (optional)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;
            setImagePreview(URL.createObjectURL(file));
          }}
          className="w-full border rounded-lg px-3 py-2"
        />

        {imagePreview && (
          <img src={imagePreview} className="w-40 mt-2 rounded-lg border" alt="preview" />
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: "#FEE2E2",
            color: "#B91C1C",
            padding: "10px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            border: "1px solid #FCA5A5",
          }}
        >
          Cancel
        </button>

        <button
          type="submit"
          style={{
            backgroundColor: "#00C389",
            color: "#FFFFFF",
            padding: "10px 24px",
            borderRadius: "12px",
            fontWeight: "600",
            border: "none",
          }}
        >
          Submit
        </button>
      </div>
    </form>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-300 p-4 shadow hover:border-emerald-400 transition">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className={`w-6 h-6 ${color}`} />
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2 text-slate-800">{value}</div>
    </div>
  );
}

/* ---------------- REPORT CARD ---------------- */
function ReportCard({ report, onDelete, onUpdate }) {

  const [open, setOpen] = useState(false);
const [isEditing, setIsEditing] = useState(false);
const [editTitle, setEditTitle] = useState(report.title);
const [editDescription, setEditDescription] = useState(report.description);

  const badge = {
    Open: "bg-rose-100 text-rose-700",
    "In Review": "bg-amber-100 text-amber-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="bg-white rounded-xl border border-emerald-300 p-6 shadow-lg space-y-3">

      <div className="flex justify-between items-start">
        <div>
         {isEditing ? (
  <input
    className="border rounded-lg px-2 py-1 w-full"
    value={editTitle}
    onChange={e => setEditTitle(e.target.value)}
  />
) : (
  <h4 className="font-medium text-lg text-slate-800">{report.title}</h4>
)}

         
         
          {isEditing ? (
  <textarea
    rows="3"
    className="border rounded-lg px-2 py-1 w-full"
    value={editDescription}
    onChange={e => setEditDescription(e.target.value)}
  />
) : (
  <p className="text-sm text-slate-600">{report.description}</p>
)}

        </div>

        <span className={`text-xs px-3 py-1 rounded-full ${badge[report.status]}`}>
          {report.status}
        </span>
      </div>

      <p className="text-sm text-slate-600">{report.description}</p>

      {/* FIXED BUTTON */}
     <div className="flex gap-3 mt-3">
  
  
  
{/* ACTION ICONS */}
{!isEditing && (
  <div className="flex gap-2 mt-3">
    <button
      title="Edit"
      onClick={() => setIsEditing(true)}
      className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
    >
      <PencilSquareIcon className="w-5 h-5" />
    </button>

    <button
      title="Delete"
      onClick={() => onDelete(report.id)}
      className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 transition"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  </div>
)}




  
  
</div>
{isEditing && (
  <div className="flex gap-3 mt-3">
    <button
      onClick={() => {
        onUpdate({
          ...report,
          title: editTitle,
          description: editDescription,
        });
        setIsEditing(false);
      }}
      className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
    >
      Save
    </button>

    <button
      onClick={() => setIsEditing(false)}
      className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-semibold"
    >
      Cancel
    </button>
  </div>
)}

     <button
  onClick={() => setOpen(!open)}
  className="mt-2 px-6 py-2 rounded-lg border border-emerald-600 text-emerald-700 font-semibold bg-white hover:bg-emerald-50 transition outline-none focus:outline-none focus:ring-0 focus-visible:outline-none"
>
  {open ? "Hide Details ▲" : "View Details ▼"}
</button>

     
     
     

      {open && (
        <div className="mt-2 p-3 rounded-xl border border-emerald-300 bg-emerald-50">
          <p className="text-sm text-slate-700 mb-2">{report.description}</p>

          {report.image && (
            <img
              src={report.image}
              alt="Report"
              className="w-52 rounded-lg border border-emerald-200 shadow-sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
