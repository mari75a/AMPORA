import React, { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

/* ---------------- MOCK DATA ---------------- */
const initialSlots = [
  { id: "S-101", name: "Slot 1", status: "Available", type: "Fast", power: 22 },
  { id: "S-102", name: "Slot 2", status: "Occupied", type: "Ultra-Fast", power: 50 },
  { id: "S-103", name: "Slot 3", status: "Available", type: "Slow", power: 11 },
];

export default function StationOperator() {
  const [slots, setSlots] = useState(initialSlots);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [editedSlot, setEditedSlot] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  /* ---------------- EDIT SLOT ---------------- */
  const openDialog = (slot) => {
    setSelectedSlot(slot);
    setEditedSlot({ ...slot });
  };

  const closeDialog = () => {
    setSelectedSlot(null);
    setEditedSlot(null);
  };

  const updateSlot = () => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot.id === editedSlot.id ? editedSlot : slot
      )
    );
    closeDialog();
  };

  const resetChanges = () => {
    setEditedSlot({ ...selectedSlot });
  };

  /* ---------------- DELETE SLOT ---------------- */
  const deleteSlot = (id) => {
    if (!window.confirm("Are you sure you want to delete this slot?")) return;
    setSlots((prev) => prev.filter((slot) => slot.id !== id));
  };

  /* ---------------- ADD SLOT ---------------- */
  const addSlot = (slot) => {
    setSlots((prev) => [...prev, slot]);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen pt-20 px-8 pb-10 bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-100">

      {/* ---------------- HEADER ---------------- */}
      <header className="mb-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-slate-800">
          Station Operator Panel
        </h1>
        <p className="mt-3 text-slate-600">
          Monitor and manage all charging slots in your station.
        </p>

        <div className="mt-4 flex gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <InformationCircleIcon className="w-6 h-6 text-emerald-600" />
          <ul className="text-sm text-emerald-900 list-disc pl-4 space-y-1">
            <li>Add new charging slots</li>
            <li>Edit or delete existing slots</li>
            <li>Monitor status and power capacity</li>
          </ul>
        </div>
      </header>

      {/* ADD SLOT BUTTON */}
      <div className="mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-black rounded-lg hover:bg-emerald-800"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Slot
        </button>
      </div>

      {/* ---------------- TABLE ---------------- */}
      <div className="bg-white rounded-2xl shadow p-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-slate-500 text-left">
              <th className="py-3">Slot</th>
              <th>Status</th>
              <th>Type</th>
              <th>Power</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-b last:border-none">
                <td className="py-4 font-medium">{slot.name}</td>

                <td>
                  <div className="flex items-center gap-2">
                    {slot.status === "Available" ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircleIcon className="w-5 h-5 text-rose-500" />
                    )}
                    {slot.status}
                  </div>
                </td>

                <td>{slot.type}</td>
                <td>{slot.power} kW</td>

                <td className="text-center space-x-2">
                  <button
                    onClick={() => openDialog(slot)}
                    className="p-2 bg-emerald-100 rounded hover:bg-emerald-200"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-emerald-600" />
                  </button>

                  <button
                    onClick={() => deleteSlot(slot.id)}
                    className="p-2 bg-rose-100 rounded hover:bg-rose-200"
                  >
                    <TrashIcon className="w-5 h-5 text-rose-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------------- EDIT DIALOG ---------------- */}
      {selectedSlot && (
        <Modal title="Update Slot" onClose={closeDialog}>
          <SlotForm
            slot={editedSlot}
            setSlot={setEditedSlot}
            onSave={updateSlot}
            onReset={resetChanges}
          />
        </Modal>
      )}

      {/* ---------------- ADD DIALOG ---------------- */}
      {showAddForm && (
        <Modal title="Add New Slot" onClose={() => setShowAddForm(false)}>
          <AddSlotForm onAdd={addSlot} />
        </Modal>
      )}
    </div>
  );
}

/* ---------------- MODAL ---------------- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-lg">
        <div className="flex justify-between mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button onClick={onClose}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ---------------- SLOT FORM (EDIT) ---------------- */
function SlotForm({ slot, setSlot, onSave, onReset }) {
  return (
    <>
      <Select label="Status" value={slot.status} onChange={(v) => setSlot({ ...slot, status: v })} options={["Available", "Occupied"]} />
      <Select label="Type" value={slot.type} onChange={(v) => setSlot({ ...slot, type: v })} options={["Fast", "Ultra-Fast", "Slow"]} />
      <Select label="Power" value={slot.power} onChange={(v) => setSlot({ ...slot, power: Number(v) })} options={[11, 22, 50]} suffix="kW" />

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onReset} className="px-4 py-2 bg-gray-100 rounded">Reset</button>
        <button onClick={onSave} className="px-4 py-2 bg-emerald-700 text-white rounded">Update</button>
      </div>
    </>
  );
}

/* ---------------- ADD SLOT FORM ---------------- */
function AddSlotForm({ onAdd }) {
  const [slot, setSlot] = useState({
    id: "",
    name: "",
    status: "Available",
    type: "Fast",
    power: 22,
  });

  const submit = () => {
    if (!slot.name) return;
    onAdd({ ...slot, id: `S-${Math.floor(100 + Math.random() * 900)}` });
  };

  return (
    <>
      <input
        placeholder="Slot Name"
        className="w-full mb-3 px-3 py-2 border rounded"
        onChange={(e) => setSlot({ ...slot, name: e.target.value })}
      />

      <SlotForm slot={slot} setSlot={setSlot} onSave={submit} onReset={() => {}} />
    </>
  );
}

/* ---------------- SELECT ---------------- */
function Select({ label, value, onChange, options, suffix }) {
  return (
    <div className="mb-3">
      <label className="text-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-3 py-2 border rounded"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o} {suffix || ""}
          </option>
        ))}
      </select>
    </div>
  );
}
