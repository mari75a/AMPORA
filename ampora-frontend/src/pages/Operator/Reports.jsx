import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  
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
  },
  {
    id: "RPT-002",
    title: "Connector damage – Slot 5",
    category: "Maintenance",
    date: "2025-01-17",
    status: "In Review",
    description: "Connector casing cracked.",
  },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen pt-24 px-6 pb-24 bg-gradient-to-br from-white via-emerald-50 to-teal-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 max-w-5xl mx-auto">
        <h1 className="flex items-center gap-2 text-2xl font-semibold text-slate-800">
          <DocumentTextIcon className="w-7 h-7 text-emerald-700" />
          Operator Reports
        </h1>

        {/* DESKTOP ADD BUTTON */}
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
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = "#00B27E";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 195, 137, 0.45)";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = "#00C389";
    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 195, 137, 0.35)";
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
            className="bg-white p-6 rounded-xl border border-emerald-300 shadow-lg
           mb-6 max-w-2xl mx-auto"

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
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* MOBILE FLOATING BUTTON */}
    </div>
  );
}

/* ---------------- ADD FORM ---------------- */
function AddReportForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technical");
  const [description, setDescription] = useState("");

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
    });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input
        className="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Report title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <select
        className="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
        className="w-full border rounded-lg px-3 py-2
                   focus:outline-none focus:ring-2 focus:ring-emerald-400"
        placeholder="Describe the issue"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
  type="button"
  onClick={onCancel}
  style={{
    backgroundColor: "#FEE2E2",   // light red base
    color: "#B91C1C",             // dark red text
    padding: "10px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    fontSize: "16px",
    border: "1px solid #FCA5A5",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(185, 28, 28, 0.25)",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = "#FECACA";
    e.currentTarget.style.borderColor = "#F87171";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = "#FEE2E2";
    e.currentTarget.style.borderColor = "#FCA5A5";
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
    fontSize: "16px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 16px rgba(0, 195, 137, 0.35)",
    transition: "background-color 0.3s ease",
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = "#00B27E";
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = "#00C389";
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
    <div className="bg-white rounded-xl border border-emerald-300 p-4 shadow
           hover:border-emerald-400 transition">
      <div className="flex items-center gap-2 text-slate-500">
        <Icon className={`w-6 h-6 ${color}`} />
        {label}
      </div>
      <div className="text-2xl font-semibold mt-2 text-slate-800">
        {value}
      </div>
    </div>
  );
}

/* ---------------- REPORT CARD ---------------- */
function ReportCard({ report }) {
  const badge = {
    Open: "bg-rose-100 text-rose-700",
    "In Review": "bg-amber-100 text-amber-700",
    Resolved: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="bg-white rounded-xl border border-emerald-300 p-6 shadow-lg
                space-y-4 max-w-5xl mx-auto">

      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-lg text-slate-800">
            {report.title}
          </h4>
          <p className="text-sm text-slate-500 mt-1">
            {report.category} • {report.date}
          </p>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full ${badge[report.status]}`}>
          {report.status}
        </span>
      </div>

      <p className="text-sm text-slate-600 mt-2">
        {report.description}
      </p>
    </div>
  );
}
