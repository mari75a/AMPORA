import React, { useState } from "react";

/* ===================== TIERS ===================== */
const TIERS = {
  BASIC: "Basic",
  STANDARD: "Standard",
  PREMIUM: "Premium",
};

/* ===================== MOCK DATA ===================== */
const initialOperator = {
  tier: TIERS.PREMIUM,

  personal: {
    name: "Operator One",
    email: "operator@ampora.com",
    phone: "+94 77 123 4567",
    profileImage: null,
    profilePreview: null,
  },

  station: {
    stationName: "Ampora EV Station – Colombo",
    location: "Colombo 07",
    contactNumber: "+94 11 234 5678",
    workingHours: "06:00 AM – 10:00 PM",
  },

  preferences: {
    emailNotifications: true,
    smsNotifications: false,
  },

  assistants: [{ id: 1, name: "Assistant A", role: "Technician" }],
};

export default function Settingsop() {
  const [operator, setOperator] = useState(initialOperator);
  const [editPersonal, setEditPersonal] = useState(false);

  /* ===================== HANDLERS ===================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOperator({
      ...operator,
      personal: {
        ...operator.personal,
        profileImage: file,
        profilePreview: URL.createObjectURL(file),
      },
    });
  };

  const updatePersonal = (field, value) => {
    setOperator({
      ...operator,
      personal: { ...operator.personal, [field]: value },
    });
  };

  const updateStation = (field, value) => {
    setOperator({
      ...operator,
      station: { ...operator.station, [field]: value },
    });
  };

  const togglePreference = (field) => {
    setOperator({
      ...operator,
      preferences: {
        ...operator.preferences,
        [field]: !operator.preferences[field],
      },
    });
  };

  const savePersonalChanges = () => {
    setEditPersonal(false);
    alert("Personal details saved successfully");
  };

  /* ===================== UI ===================== */
  return (
    <div style={styles.mainContent}>
      <div style={styles.page}>
        <h1 style={styles.title}>Operator Settings</h1>

        {/* ================= PROFILE ================= */}
        <div style={styles.cardPremiumGlow(operator.tier)}>
          <div style={styles.cardHeader}>
            <h3>Personal Profile</h3>
            {!editPersonal ? (
              <button
                style={styles.secondaryBtn}
                onClick={() => setEditPersonal(true)}
              >
                Change Personal Settings
              </button>
            ) : (
              <button
                style={styles.primaryBtn}
                onClick={savePersonalChanges}
              >
                Save Personal Changes
              </button>
            )}
          </div>

          <div style={styles.profileRow}>
            <div style={styles.avatarWrapper}>
              <img
                src={
                  operator.personal.profilePreview ||
                  "https://ui-avatars.com/api/?name=Operator&background=00C389&color=fff"
                }
                alt="Profile"
                style={styles.avatar}
              />
              {editPersonal && (
                <label style={styles.uploadBtn}>
                  Change
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>

            <div style={{ flex: 1 }}>
              <Input
                label="Full Name"
                value={operator.personal.name}
                disabled={!editPersonal}
                onChange={(e) =>
                  updatePersonal("name", e.target.value)
                }
              />
              <Input
                label="Email"
                value={operator.personal.email}
                disabled={!editPersonal}
                onChange={(e) =>
                  updatePersonal("email", e.target.value)
                }
              />
              <Input
                label="Contact Number"
                value={operator.personal.phone}
                disabled={!editPersonal}
                onChange={(e) =>
                  updatePersonal("phone", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* ================= STATION ================= */}
        <div style={styles.card}>
          <h3>Station Information</h3>
          <div style={styles.grid}>
            <Input
              label="Station Name"
              value={operator.station.stationName}
              onChange={(e) =>
                updateStation("stationName", e.target.value)
              }
            />
            <Input
              label="Location"
              value={operator.station.location}
              onChange={(e) =>
                updateStation("location", e.target.value)
              }
            />
            <Input
              label="Station Contact"
              value={operator.station.contactNumber}
              onChange={(e) =>
                updateStation("contactNumber", e.target.value)
              }
            />
            <Input
              label="Working Hours"
              value={operator.station.workingHours}
              onChange={(e) =>
                updateStation("workingHours", e.target.value)
              }
            />
          </div>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div style={styles.card}>
          <h3>Notifications</h3>
          <Toggle
            label="Email Notifications"
            active={operator.preferences.emailNotifications}
            onClick={() =>
              togglePreference("emailNotifications")
            }
          />
          <Toggle
            label="SMS Notifications"
            active={operator.preferences.smsNotifications}
            onClick={() =>
              togglePreference("smsNotifications")
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ===================== REUSABLE ===================== */
const Input = ({ label, value, onChange, disabled }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={styles.label}>{label}</label>
    <input
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        ...styles.input,
        background: disabled ? "#F3F4F6" : "#FFF",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  </div>
);

const Toggle = ({ label, active, onClick }) => (
  <div style={styles.toggleRow} onClick={onClick}>
    <span>{label}</span>
    <div style={styles.toggle(active)} />
  </div>
);

/* ===================== STYLES ===================== */
const styles = {
  mainContent: {
    paddingTop: 70,
    width: 1000
  },

  page: {
    
    margin: "0 auto",
    padding: 30,
    background: "#F4F7FA",
    minHeight: "100vh",
  },

  title: {
    marginBottom: 30,
  },

  card: {
    background: "#FFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  },

  cardPremiumGlow: (tier) => ({
    background: "#FFF",
    borderRadius: 18,
    padding: 26,
    marginBottom: 24,
    position: "relative",
    boxShadow:
      tier === TIERS.PREMIUM
        ? "0 0 0 2px #00C389, 0 20px 50px rgba(0,195,137,0.25)"
        : "0 12px 30px rgba(0,0,0,0.08)",
    transition: "all 0.4s ease",
  }),

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  profileRow: {
    display: "flex",
    gap: 30,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: "50%",
    border: "4px solid #00C389",
    objectFit: "cover",
  },

  uploadBtn: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    background: "#00C389",
    color: "#FFF",
    padding: "5px 14px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
  },

  label: {
    fontWeight: 600,
    fontSize: 14,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #DDD",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },

  toggleRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    cursor: "pointer",
  },

  toggle: (active) => ({
    width: 46,
    height: 24,
    borderRadius: 20,
    background: active ? "#00C389" : "#CCC",
  }),

  primaryBtn: {
    background: "#00C389",
    color: "#FFF",
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    transition: "transform 0.2s ease",
  },

  secondaryBtn: {
    background: "#E5F9F2",
    color: "#00A876",
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
  },
};
