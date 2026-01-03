// src/pages/VehicleManager.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiSearch,
  FiTag,
  FiSettings,
  FiChevronRight,
  FiMapPin,
  FiCpu,
  FiBattery,
  FiStar,
} from "react-icons/fi";

const API_BASE = "http://localhost:8083";
const glass =
  "backdrop-blur-xl bg-white/70 border border-emerald-200/60 shadow-[0_8px_35px_rgba(16,185,129,0.12)]";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const emptyForm = {
  brandId: "",
  modelId: "",
  brand: "",  // display text only
  model: "",  // display text only
  variant: "",
  plate: "",
  connector: "",
  rangeKm: "",
};

function decodeJWT(token) {
  try {
    const [, payload] = token.split(".");
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return json || {};
  } catch {
    return {};
  }
}

const VehicleManager = () => {
  // API data
  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]); // all or filtered by brand for dropdown
  const [loading, setLoading] = useState(true);

  // UI state
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(null); // vehicle object or null
  const [showDelete, setShowDelete] = useState(null); // vehicle object or null
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // Logged-in user (from token)
  const token = localStorage.getItem("token") || "";
  const loggedUserId=localStorage.getItem("userId");
  const claims = decodeJWT(token);
  

  // ---------- Load Brands + Vehicles on mount ----------
  useEffect(() => {
    let isMounted = true;

    async function fetchBrands() {
      try {
        const res = await fetch(`${API_BASE}/api/brands`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        // Expecting [{brand_id, brand_name}] or similar
        const mapped = (Array.isArray(data) ? data : data?.brands || []).map((b) => ({
          id: b.id ?? b.brand_id ?? b.brandId,
          name: b.name ?? b.brand_name ?? b.brandName,
        }));
        if (isMounted) setBrands(mapped);
      } catch (e) {
        console.error("Failed to load brands:", e);
      }
    }

    async function fetchVehicles() {
      try {
        const res = await fetch(`${API_BASE}/api/vehicles/user/${loggedUserId}`, {
          headers: {
            "Content-Type": "application/json",
            
          },
        });
        const data = await res.json();
        // Backend VehicleDTO mapping
        const list = Array.isArray(data) ? data : data?.vehicles || [];
        const mapped = list.map((v) => ({
          id: v.vehicleId || v.id,
          brandId: v.brand_id ?? v.brandId ?? v.brand?.id ?? null,
          brand: v.brand_name ?? v.brand?.name ?? "", // may be empty, we resolve later
          modelId: v.model_id ?? v.modelId ?? v.model?.id ?? null,
          model: v.model_name ?? v.model?.name ?? "",
          variant: v.variant ?? v.batteryCapacityKwh ?? "",
          plate: v.plate ?? "",
          connector: v.connectorType ?? v.connector ?? "",
          rangeKm: v.rangeKm ?? v.range ?? 0,
          isDefault: v.isDefault ?? false,
          userId: v.userId ?? v.user?.userId ?? null,
        }));

        // If the API returns all vehicles, filter to the logged user (when we can)
        const filtered = loggedUserId ? mapped.filter((x) => x.userId === loggedUserId) : mapped;
        if (isMounted) setVehicles(filtered);
      } catch (e) {
        console.error("Failed to load vehicles:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBrands();
    fetchVehicles();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- When brand changes in form, load models for that brand ----------
  useEffect(() => {
    async function fetchModelsForBrand(brandId) {
      if (!brandId) {
        setModels([]);
        return;
      }
      try {
        // Try server-side filter first
        const resTry = await fetch(`${API_BASE}/api/model?brandId=${encodeURIComponent(brandId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (resTry.ok) {
          const data = await resTry.json();
          const list = Array.isArray(data) ? data : data?.models || [];
          const mapped = list.map((m) => ({
            id: m.id ?? m.model_id ?? m.modelId,
            name: m.name ?? m.model_name ?? m.modelName,
            brandId: m.brand_id ?? m.brandId ?? m.brand?.id,
          }));
          setModels(mapped);
          return;
        }

        // Fallback: fetch all models and filter client-side
        const resAll = await fetch(`${API_BASE}/api/model`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const allData = await resAll.json();
        const allList = Array.isArray(allData) ? allData : allData?.models || [];
        const mappedAll = allList.map((m) => ({
          id: m.id ?? m.model_id ?? m.modelId,
          name: m.name ?? m.model_name ?? m.modelName,
          brandId: m.brand_id ?? m.brandId ?? m.brand?.id,
        }));
        setModels(mappedAll.filter((m) => String(m.brandId) === String(brandId)));
      } catch (e) {
        console.error("Failed to load models:", e);
        setModels([]);
      }
    }

    if (form.brandId) {
      fetchModelsForBrand(form.brandId);
    } else {
      setModels([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.brandId]);

  // ---------- Derived ----------
  const filtered = useMemo(() => {
    if (!query.trim()) return vehicles;
    const q = query.toLowerCase();
    return vehicles.filter(
      (v) =>
        (v.brand || "").toLowerCase().includes(q) ||
        (v.model || "").toLowerCase().includes(q) ||
        (v.variant || "").toLowerCase().includes(q) ||
        (v.plate || "").toLowerCase().includes(q) ||
        String(v.rangeKm || "").includes(q) ||
        (v.connector || "").toLowerCase().includes(q)
    );
  }, [vehicles, query]);

  const defaultVehicle = vehicles.find((v) => v.isDefault);

  // ---------- Handlers ----------
  const openAdd = () => {
    setForm(emptyForm);
    setErrors({});
    setShowAdd(true);
  };

  const openEdit = (v) => {
    setForm({
      brandId: v.brandId || "",
      modelId: v.modelId || "",
      brand: v.brand || "",
      model: v.model || "",
      variant: v.variant || "",
      plate: v.plate || "",
      connector: v.connector || "",
      rangeKm: String(v.rangeKm ?? ""),
    });
    setErrors({});
    setShowEdit(v);
  };

  const validate = () => {
    const e = {};
    if (!form.brandId) e.brandId = "Brand is required";
    if (!form.modelId) e.modelId = "Model is required";
    if (!form.variant.trim()) e.variant = "Battery/Variant is required";
    if (!form.plate.trim()) e.plate = "Plate is required";
    if (!form.connector.trim()) e.connector = "Connector is required";
    if (!form.rangeKm || isNaN(Number(form.rangeKm))) e.rangeKm = "Range (km) must be a number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  async function addVehicle() {
    if (!validate()) return;

    if (!token) {
      alert("You must be logged in.");
      return;
    }
    if (!loggedUserId) {
      // We still try to add; backend may infer user from token
      console.warn("No userId decoded from token; proceeding with POST anyway.");
    }

    try {
      const payload = {
        userId: loggedUserId,               // if backend infers from token, it can ignore this
        brand_id: form.brandId,
        model_id: form.modelId,
        plate: form.plate.trim(),
        rangeKm: Number(form.rangeKm),
        connectorType: form.connector.trim(),
        variant: form.variant.trim(),
      };

      const res = await fetch(`${API_BASE}/api/vehicles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to add vehicle");
      }

      // Reload vehicles after success
      await reloadVehicles();
      setShowAdd(false);
    } catch (e) {
      console.error(e);
      alert("Failed to add vehicle. Check console for details.");
    }
  }

  async function reloadVehicles() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/vehicles`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.vehicles || [];
      const mapped = list.map((v) => ({
        id: v.vehicleId || v.id,
        brandId: v.brand_id ?? v.brandId ?? v.brand?.id ?? null,
        brand: v.brand_name ?? v.brand?.name ?? "",
        modelId: v.model_id ?? v.modelId ?? v.model?.id ?? null,
        model: v.model_name ?? v.model?.name ?? "",
        variant: v.variant ?? v.batteryCapacityKwh ?? "",
        plate: v.plate ?? "",
        connector: v.connectorType ?? v.connector ?? "",
        rangeKm: v.rangeKm ?? v.range ?? 0,
        isDefault: v.isDefault ?? false,
        userId: v.userId ?? v.user?.userId ?? null,
      }));
      const filtered = loggedUserId ? mapped.filter((x) => x.userId === loggedUserId) : mapped;
      setVehicles(filtered);
    } catch (e) {
      console.error("Failed to reload vehicles:", e);
    } finally {
      setLoading(false);
    }
  }

  // For now, keep edit/delete local if you don't have PUT/DELETE
  async function saveEdit() {
  if (!validate() || !showEdit) return;

  try {
    const payload = {
      userId: loggedUserId,
      brand_id: form.brandId,
      model_id: form.modelId,
      plate: form.plate.trim(),
      rangeKm: Number(form.rangeKm),
      connectorType: form.connector.trim(),
      variant: form.variant.trim(),
    };

    const res = await fetch(`${API_BASE}/api/vehicles/${showEdit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to update vehicle");
    }

    // Reload list
    await reloadVehicles();
    setShowEdit(null);
  } catch (e) {
    console.error(e);
    alert("Error updating vehicle. Check console.");
  }
}

  async function confirmDelete() {
  if (!showDelete) return;

  try {
    const res = await fetch(`${API_BASE}/api/vehicles/${showDelete.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || "Failed to delete vehicle");
    }

    await reloadVehicles();
    setShowDelete(null);
  } catch (e) {
    console.error(e);
    alert("Failed to delete. See console.");
  }
}


  function makeDefault(id) {
    setVehicles((s) => s.map((v) => ({ ...v, isDefault: v.id === id })));
  }

  // ---------- UI ----------
  return (
    <div className="w-screen min-h-screen mt-20 bg-gradient-to-b from-emerald-50 via-teal-50 to-white text-gray-900">
      {/* Header */}
      <div className="mx-auto w-11/12 max-w-7xl pt-10 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-700">
              My Vehicles
            </h1>
            <p className="text-emerald-900/70">
              Add, edit, set default, and manage your EVs for smarter trip planning.
            </p>
          </div>

          <div className="flex gap-3">
            <div className={`${glass} rounded-2xl px-4 py-2 flex items-center gap-2`}>
              <FiSearch className="text-emerald-600" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brand, model, plate…"
                className="bg-transparent outline-none text-sm text-emerald-900 placeholder-emerald-900/60"
              />
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow hover:shadow-lg"
            >
              <FiPlus /> Add Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Default vehicle pill */}
      {vehicles.length > 0 && !loading && (
        <div className="mx-auto w-11/12 max-w-7xl">
          <div className={`${glass} rounded-2xl p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600">
                <FiStar />
              </span>
              <div>
                <p className="text-sm text-emerald-900/70">Default vehicle</p>
                <p className="font-semibold text-emerald-800">
                  {(
                    vehicles.find((v) => v.isDefault) ||
                    vehicles[0] || { brand: "-", model: "-", variant: "-", plate: "-" }
                  ).brand}{" "}
                  {(
                    vehicles.find((v) => v.isDefault) ||
                    vehicles[0] || { brand: "-", model: "-", variant: "-", plate: "-" }
                  ).model}{" "}
                  • {(
                    vehicles.find((v) => v.isDefault) ||
                    vehicles[0] || { brand: "-", model: "-", variant: "-", plate: "-" }
                  ).variant}{" "}
                  · {(
                    vehicles.find((v) => v.isDefault) ||
                    vehicles[0] || { brand: "-", model: "-", variant: "-", plate: "-" }
                  ).plate}
                </p>
              </div>
            </div>
            <a
              href="/trip"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Plan with default <FiChevronRight />
            </a>
          </div>
        </div>
      )}

      {/* Grid list */}
      <div className="mx-auto w-11/12 max-w-7xl py-8">
        {loading ? (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className={`${glass} rounded-2xl p-10 text-center`}
          >
            <p className="text-emerald-900/70">Loading your vehicles…</p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className={`${glass} rounded-2xl p-10 text-center`}
          >
            <p className="text-emerald-900/70">
              No vehicles found. Try a different search or add a new vehicle.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filtered.map((v) => (
              <div key={v.id} className={`${glass} rounded-2xl p-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 text-lg">
                      <FiCpu />
                    </span>
                    <div>
                      <p className="font-semibold text-emerald-900">
                        {v.brand || "—"} {v.model || ""}
                      </p>
                      <p className="text-xs text-emerald-900/70">{v.variant || "—"}Kwh</p>
                    </div>
                  </div>

                  {v.isDefault ? (
                    <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                      <FiStar className="shrink-0" /> Default
                    </span>
                  ) : (
                    <button
                      onClick={() => makeDefault(v.id)}
                      className="text-xs px-2 py-1 rounded-full border border-emerald-300 text-emerald-500 hover:bg-emerald-50"
                    >
                      Set default
                    </button>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <InfoRow icon={<FiTag />} label="Plate" value={v.plate || "—"} />
                  <InfoRow icon={<FiBattery />} label="Range" value={`${v.rangeKm ?? 0} km`} />
                  <InfoRow icon={<FiSettings />} label="Connector" value={v.connector || "—"} />
                  <InfoRow icon={<FiMapPin />} label="Used in Trip Planner" value={v.isDefault ? "Yes" : "No"} />
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    onClick={() => openEdit(v)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <div
                    onClick={() => setShowDelete(v)}
                    className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg border bg-red-700 border-emerald-300 text-white hover:bg-red-800"
                  >
                    <FiTrash2 /> Delete
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* ---------- Add Modal ---------- */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Vehicle">
        <VehicleForm
          form={form}
          setForm={setForm}
          errors={errors}
          brands={brands}
          models={models}
          onSubmit={addVehicle}
          submitText="Add Vehicle"
          onBrandChange={(id) => setForm((f) => ({ ...f, brandId: id, modelId: "", brand: "", model: "" }))}
          onModelChange={(id) => setForm((f) => ({ ...f, modelId: id }))}
        />
      </Modal>

      {/* ---------- Edit Modal ---------- */}
      <Modal open={!!showEdit} onClose={() => setShowEdit(null)} title="Edit Vehicle">
        <VehicleForm
          form={form}
          setForm={setForm}
          errors={errors}
          brands={brands}
          models={models}
          onSubmit={saveEdit}
          submitText="Save Changes"
          onBrandChange={(id) => setForm((f) => ({ ...f, brandId: id, modelId: "", brand: "", model: "" }))}
          onModelChange={(id) => setForm((f) => ({ ...f, modelId: id }))}
        />
      </Modal>

      {/* ---------- Delete Confirm ---------- */}
      <ConfirmDialog
        open={!!showDelete}
        title="Delete vehicle?"
        message={
          showDelete
            ? `Are you sure you want to delete ${showDelete.brand || ""} ${showDelete.model || ""} (${showDelete.plate || ""})?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => setShowDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 rounded-xl bg-white/60 border border-emerald-200/60 px-3 py-2">
    <span className="text-emerald-600">{icon}</span>
    <div className="text-emerald-900/80">
      <span className="text-xs">{label}</span>
      <div className="font-semibold text-emerald-900 leading-tight">{value}</div>
    </div>
  </div>
);

/* ----------------- Reusable Modal ----------------- */
const Modal = ({ open, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div onClick={onClose} className="absolute inset-0 bg-black/40" aria-hidden />
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`${glass} w-[95%] max-w-xl rounded-2xl p-5 relative`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xl font-bold text-emerald-800">{title}</h3>
              <button
                onClick={onClose}
                className="grid place-items-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              >
                <FiX />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ------------- Vehicle Form (Add / Edit) ------------- */
const VehicleForm = ({
  form,
  setForm,
  errors,
  brands,
  models,
  onSubmit,
  submitText,
  onBrandChange,
  onModelChange,
}) => {
  const field = (name, label, placeholder, type = "text") => (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-emerald-800 mb-1">{label}</label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        placeholder={placeholder}
        className={`rounded-xl border px-3 py-2 outline-none bg-white/80 text-black 
          ${errors[name] ? "border-red-300 focus:ring-2 focus:ring-red-400" : "border-emerald-300 focus:ring-2 focus:ring-emerald-400"}`}
      />
      {errors[name] && <span className="text-xs text-red-600 mt-1">{errors[name]}</span>}
    </div>
  );

  const selectBrand = (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-emerald-800 mb-1">Brand</label>
      <select
        value={form.brandId}
        onChange={(e) => onBrandChange?.(e.target.value)}
        className={`rounded-xl border px-3 py-2 outline-none bg-white/80 text-black 
          ${errors.brandId ? "border-red-300 focus:ring-2 focus:ring-red-400" : "border-emerald-300 focus:ring-2 focus:ring-emerald-400"}`}
      >
        <option value="">Select brand…</option>
        {brands.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      {errors.brandId && <span className="text-xs text-red-600 mt-1">{errors.brandId}</span>}
    </div>
  );

  const selectModel = (
    <div className="flex flex-col">
      <label className="text-xs font-semibold text-emerald-800 mb-1">Model</label>
      <select
        value={form.modelId}
        onChange={(e) => onModelChange?.(e.target.value)}
        disabled={!form.brandId}
        className={`rounded-xl border px-3 py-2 outline-none bg-white/80 text-black 
          ${errors.modelId ? "border-red-300 focus:ring-2 focus:ring-red-400" : "border-emerald-300 focus:ring-2 focus:ring-emerald-400"}`}
      >
        <option value="">{form.brandId ? "Select model…" : "Choose brand first"}</option>
        {models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      {errors.modelId && <span className="text-xs text-red-600 mt-1">{errors.modelId}</span>}
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {selectBrand}
        {selectModel}
        {field("variant", "Battery / Variant", "40 kWh / 60 kWh")}
        {field("plate", "Plate Number", "WP-CAD-4123")}
        {field("connector", "Connector", "CHAdeMO / CCS2 / Type 2")}
        {field("rangeKm", "Range (km)", "400", "number")}
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

/* ------------- Confirm Dialog ------------- */
const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div onClick={onCancel} className="absolute inset-0 bg-black/40" aria-hidden />
          <motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className={`${glass} w-[92%] max-w-md rounded-2xl p-5`}
          >
            <h3 className="text-lg font-bold text-emerald-800">{title}</h3>
            <p className="mt-2 text-emerald-900/80">{message}</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VehicleManager;
