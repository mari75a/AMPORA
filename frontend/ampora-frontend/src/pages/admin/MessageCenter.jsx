// src/components/MessageCenter.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiSend,
  FiUser,
  FiHeadphones,
  FiClock,
  FiUsers,
  FiSearch,
  FiCheck,
} from "react-icons/fi";

// Dummy messages preview
const initialMessages = [
  {
    id: 1,
    from: "ADMIN",
    to: "USER",
    name: "User – John Doe",
    subject: "Account verification",
    content: "Hi John, your account has been verified successfully ✅",
    time: "2 min ago",
  },
];

// 🔹 Dummy user/operator data (replace with API later)
const allReceivers = [
  { id: "u1", name: "John Doe", email: "john@example.com", role: "USER" },
  { id: "u2", name: "Jane Smith", email: "jane@example.com", role: "USER" },
  { id: "o1", name: "Operator A", email: "op-a@example.com", role: "OPERATOR" },
  { id: "o2", name: "Operator B", email: "op-b@example.com", role: "OPERATOR" },
];

export default function MessageCenter({ isOpen, onClose }) {
  const [messages, setMessages] = useState(initialMessages);

  const [mode, setMode] = useState("DIRECT"); // DIRECT | BROADCAST
  const [receiverType, setReceiverType] = useState("USER"); // USER | OPERATOR
  const [broadcastTarget, setBroadcastTarget] = useState("USERS"); // USERS | OPERATORS | ALL

  const [subject, setSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");

  // 🔹 selection for direct mode
  const [searchText, setSearchText] = useState("");
  const [selectedReceiver, setSelectedReceiver] = useState(null); // {id, name, email, role}

  const filteredReceivers = useMemo(() => {
    return allReceivers.filter((r) => {
      if (r.role !== receiverType) return false;
      if (!searchText.trim()) return true;
      const q = searchText.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      );
    });
  }, [searchText, receiverType]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // ✅ Validate selected receiver in DIRECT mode
    if (mode === "DIRECT" && !selectedReceiver) {
      alert("Please select a user/operator to send direct message.");
      return;
    }

    let previewName;
    let toTag;

    if (mode === "DIRECT") {
      previewName = `${
        selectedReceiver.role === "USER" ? "User" : "Operator"
      } – ${selectedReceiver.name}`;
      toTag = selectedReceiver.role;
    } else {
      if (broadcastTarget === "USERS") {
        previewName = "All Users";
        toTag = "BROADCAST_USERS";
      } else if (broadcastTarget === "OPERATORS") {
        previewName = "All Operators";
        toTag = "BROADCAST_OPERATORS";
      } else {
        previewName = "Users & Operators";
        toTag = "BROADCAST_ALL";
      }
    }

    const msg = {
      id: Date.now(),
      from: "ADMIN",
      to: toTag,
      name: previewName,
      subject:
        subject ||
        (mode === "BROADCAST" ? "Broadcast message" : "No subject provided"),
      content: newMessage.trim(),
      time: "Now",
    };

    setMessages((prev) => [...prev, msg]);
    setNewMessage("");

    // 🔗 Here is where you will call backend:

    // if (mode === "DIRECT") {
    //   await axios.post("/api/messages/direct", {
    //     senderId: currentAdminId,      // from auth
    //     receiverId: selectedReceiver.id,
    //     subject,
    //     content: newMessage.trim(),
    //   });
    // } else {
    //   await axios.post("/api/messages/broadcast", {
    //     senderId: currentAdminId,
    //     target: broadcastTarget,       // "USERS" | "OPERATORS" | "ALL"
    //     subject,
    //     content: newMessage.trim(),
    //   });
    // }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex justify-end bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // 👇 click outside to close
          onClick={onClose}
        >
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="h-full w-full max-w-md bg-[#f3fef9] shadow-2xl flex flex-col"
            // prevent closing when clicking inside
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-emerald-50 bg-white/70 backdrop-blur-xl">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">
                  Admin Messaging
                </p>
                <h2 className="text-lg font-semibold text-slate-900">
                  Messages to Users & Operators
                </h2>
              </div>

              {/* ❌ close button */}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-emerald-50 text-slate-700"
              >
                <FiX />
              </button>
            </div>

            {/* Mode toggle */}
            <div className="px-4 pt-3 pb-2 bg-white/70 border-b border-emerald-50">
              <p className="text-xs font-medium text-slate-600 mb-1">
                Message mode
              </p>
              <div className="flex gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setMode("DIRECT")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    mode === "DIRECT"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                  }`}
                >
                  <FiUser className="text-sm" />
                  Direct
                </button>
                <button
                  type="button"
                  onClick={() => setMode("BROADCAST")}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    mode === "BROADCAST"
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                      : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                  }`}
                >
                  <FiUsers className="text-sm" />
                  Broadcast
                </button>
              </div>

              {/* DIRECT: choose role + specific receiver */}
              {mode === "DIRECT" && (
                <div className="mt-3 space-y-2">
                  <p className="text-[11px] text-slate-500">
                    Send to a single user or operator.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setReceiverType("USER");
                        setSelectedReceiver(null);
                      }}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                        receiverType === "USER"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                      }`}
                    >
                      <FiUser className="text-sm" />
                      User
                    </button>
                    <button
                      onClick={() => {
                        setReceiverType("OPERATOR");
                        setSelectedReceiver(null);
                      }}
                      type="button"
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border ${
                        receiverType === "OPERATOR"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                      }`}
                    >
                      <FiHeadphones className="text-sm" />
                      Operator
                    </button>
                  </div>

                  {/* Search + list */}
                  <div className="mt-2">
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Choose {receiverType === "USER" ? "User" : "Operator"}
                    </label>
                    <div className="relative mb-1.5">
                      <FiSearch className="absolute left-3 top-2.5 text-xs text-slate-400" />
                      <input
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full rounded-xl border border-emerald-100 bg-white pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-300"
                      />
                    </div>

                    <div className="max-h-32 overflow-y-auto rounded-xl border border-emerald-100 bg-white/70 text-xs">
                      {filteredReceivers.length === 0 && (
                        <div className="px-3 py-2 text-[11px] text-slate-400">
                          No results. Try another name.
                        </div>
                      )}

                      {filteredReceivers.map((r) => {
                        const isSelected =
                          selectedReceiver && selectedReceiver.id === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setSelectedReceiver(r)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 text-left border-b last:border-b-0 border-emerald-50 ${
                              isSelected
                                ? "bg-emerald-50/80"
                                : "hover:bg-emerald-50/60"
                            }`}
                          >
                            <div>
                              <p className="font-semibold text-[11px] text-slate-800">
                                {r.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {r.email}
                              </p>
                            </div>
                            {isSelected && (
                              <FiCheck className="text-emerald-500 text-sm" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {selectedReceiver && (
                      <p className="mt-1 text-[10px] text-emerald-600">
                        Selected:{" "}
                        <strong>
                          {selectedReceiver.name} ({selectedReceiver.email})
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* BROADCAST: choose audience (unchanged idea) */}
              {mode === "BROADCAST" && (
                <div className="mt-3">
                  <p className="text-[11px] text-slate-500 mb-1">
                    Send to everyone:
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setBroadcastTarget("USERS")}
                      className={`px-3 py-1.5 rounded-full border ${
                        broadcastTarget === "USERS"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                      }`}
                    >
                      All Users
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastTarget("OPERATORS")}
                      className={`px-3 py-1.5 rounded-full border ${
                        broadcastTarget === "OPERATORS"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                      }`}
                    >
                      All Operators
                    </button>
                    <button
                      type="button"
                      onClick={() => setBroadcastTarget("ALL")}
                      className={`px-3 py-1.5 rounded-full border ${
                        broadcastTarget === "ALL"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : "bg-white text-slate-700 border-emerald-100 hover:bg-emerald-50"
                      }`}
                    >
                      Users & Operators
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Subject + messages + composer (shortened) */}
            <div className="flex-1 flex flex-col px-4 py-3 gap-3 overflow-hidden">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of the message..."
                  className="w-full rounded-xl border border-emerald-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-300"
                />
              </div>

              <div className="flex-1 rounded-2xl border border-emerald-100 bg-white/70 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-3 py-2 border-b border-emerald-50 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live thread preview
                  </div>
                  <div className="flex items-center gap-1">
                    <FiClock />
                    <span>Recent</span>
                  </div>
                </div>

                <div className="flex-1 p-3 space-y-3 overflow-y-auto">
                  {messages.map((msg) => {
                    const isAdmin = msg.from === "ADMIN";
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isAdmin ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs shadow-sm ${
                            isAdmin
                              ? "bg-emerald-500 text-white rounded-br-sm"
                              : "bg-white text-slate-800 border border-emerald-50 rounded-bl-sm"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <span className="font-semibold">
                              {isAdmin ? "Admin" : msg.name}
                            </span>
                            <span
                              className={`text-[10px] ${
                                isAdmin
                                  ? "text-emerald-50/80"
                                  : "text-slate-400"
                              }`}
                            >
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold opacity-80">
                            {msg.subject}
                          </p>
                          <p className="text-[11px] mt-0.5 leading-snug">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSend} className="mt-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Message
                </label>
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 resize-none rounded-2xl border border-emerald-100 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 placeholder:text-slate-300"
                  />
                  <button
                    type="submit"
                    className="shrink-0 inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-emerald-500 text-white text-sm font-semibold shadow-md hover:bg-emerald-600 active:scale-[0.97] transition"
                  >
                    <FiSend className="mr-1" />
                    Send
                  </button>
                </div>
              </form>

              <button
                type="button"
                onClick={onClose}
                className="mt-1 text-[11px] text-slate-400 underline self-center hover:text-slate-600"
              >
                Close message panel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
