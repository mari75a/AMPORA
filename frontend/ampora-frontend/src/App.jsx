import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Zap,
  Send,
  Bot,
  User,
  PlusCircle,
  Sparkles,
  Menu,
  X,
  MapPin,
  Battery,
  Route as RouteIcon,
  Loader2,
  CheckCircle2,
} from "lucide-react";

/* ---------------- CONFIG ---------------- */
const API_BASE = "http://127.0.0.1:8001";
const libraries = ["places"];
const mapContainerStyle = { width: "100%", height: "100%", borderRadius: "28px" };
const defaultCenter = { lat: 7.8731, lng: 80.7718 };

/* ---------------- HELPERS ---------------- */
function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function safePlaceAddress(place) {
  if (!place) return "";
  return place.formatted_address || place.name || "";
}

/* ---------------- APP ---------------- */
export default function App() {
  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsKey,
    libraries,
  });

  /* ---- Sidebar / trips ---- */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      title: "Journey 1",
      messages: [
        {
          role: "ai",
          text: "Hi! I’m AMPORA ⚡ Tell me your route and I’ll pick the best charging station to book — with a smart break plan while you wait.",
        },
      ],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState(1);

  /* ---- Inputs ---- */
  const [formData, setFormData] = useState({
    startCity: "",
    endCity: "",
    soc: 50,
    avoidHighways: false,
  });

  /* ---- Chat ---- */
  const [chatInput, setChatInput] = useState("");
  const [sending, setSending] = useState(false);

  /* ---- Map / routes ---- */
  const [showMap, setShowMap] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [routeIndex, setRouteIndex] = useState(0);
  const [mapInstance, setMapInstance] = useState(null);

  /* ---- Stations ---- */
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);

  /* ---- Auto-analysis guard ---- */
  const [autoKey, setAutoKey] = useState(null);

  /* ---- refs ---- */
  const startAutocomplete = useRef(null);
  const endAutocomplete = useRef(null);
  const chatEndRef = useRef(null);

  const currentChat = useMemo(
    () => chatHistory.find((c) => c.id === currentChatId) || chatHistory[0],
    [chatHistory, currentChatId]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  /* ---------------- Stations fetch ---------------- */
  const fetchStationsFromDB = async (overviewPath) => {
    if (!overviewPath?.length) return;

    const samplingRate = Math.ceil(overviewPath.length / 25);
    const pathPoints = overviewPath
      .filter((_, idx) => idx % samplingRate === 0)
      .map((p) => ({ lat: p.lat(), lng: p.lng() }));

    try {
      const res = await axios.post(`${API_BASE}/get-nearby-stations`, {
        path_points: pathPoints,
        buffer_km: 3.0,
      });
      setStations(res.data?.stations || []);
    } catch (e) {
      console.error("DB fetch error:", e);
      setStations([]);
    }
  };

  /* When route changes AND map is loaded, fetch stations */
  useEffect(() => {
    if (mapInstance && routes[routeIndex]) {
      setSelectedStation(null);
      fetchStationsFromDB(routes[routeIndex].overview_path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeIndex, mapInstance, routes]);

  /* ---------------- Auto analysis (one-time per route+stations) ---------------- */
  useEffect(() => {
    if (!showMap) return;
    if (!directionsResponse) return;
    if (!routes?.[routeIndex]) return;
    if (!stations?.length) return;

    const key = `${currentChatId}:${routeIndex}:${stations.length}`;
    if (autoKey === key) return;

    const timer = setTimeout(() => {
      sendChat("Which charging station should I book for this route?", { auto: true });
      setAutoKey(key);
    }, 900);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stations, showMap, directionsResponse, routeIndex, currentChatId]);

  /* ---------------- Plan route ---------------- */
  const handlePlanRoute = async () => {
    if (!formData.startCity || !formData.endCity) {
      alert("Please enter both start and destination.");
      return;
    }

    setLoadingRoute(true);
    setDirectionsResponse(null);
    setRoutes([]);
    setStations([]);
    setSelectedStation(null);
    setAutoKey(null);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const result = await directionsService.route({
        origin: formData.startCity,
        destination: formData.endCity,
        travelMode: window.google.maps.TravelMode.DRIVING,
        avoidHighways: formData.avoidHighways,
        provideRouteAlternatives: true,
      });

      setDirectionsResponse(result);
      setRoutes(result.routes || []);
      setRouteIndex(0);
      setShowMap(true);

      // add friendly user message in chat
      setChatHistory((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    role: "user",
                    text: `🛣️ Plan route: ${formData.startCity} → ${formData.endCity}`,
                  },
                ],
              }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("No routes found. Try different locations.");
    } finally {
      setLoadingRoute(false);
    }
  };

  /* ---------------- Send chat ---------------- */
  const sendChat = async (text, opts = {}) => {
    const userText = (text || "").trim();
    if (!userText) return;

    const isAuto = Boolean(opts.auto);

    // Push user message
    setChatHistory((prev) =>
      prev.map((c) =>
        c.id === currentChatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  role: "user",
                  text: isAuto
                    ? `🧠 Analyzing Route ${routeIndex + 1} (${stations.length} stations detected)…`
                    : userText,
                },
              ],
            }
          : c
      )
    );

    setSending(true);
    try {
      const startLoc = directionsResponse?.routes?.[routeIndex]?.legs?.[0]?.start_location;

      const payload = {
        conversation_id: String(currentChatId),
        start_city: formData.startCity,
        end_city: formData.endCity,
        start_lat: startLoc ? startLoc.lat() : null,
        start_lng: startLoc ? startLoc.lng() : null,
        soc_level: Number(formData.soc),
        user_text: userText,
        stations: (stations || []).map((s) => ({
          name: s.name,
          address: s.address ?? null,
          lat: Number(s.lat),
          lng: Number(s.lng),
          status: s.status ?? null,
        })),
      };

      const res = await axios.post(`${API_BASE}/chat`, payload);

      const aiText = res.data?.assistant_text || "Done.";
      const best = res.data?.best_station || null;

      setChatHistory((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    role: "ai",
                    text: aiText,
                    best_station: best,
                  },
                ],
              }
            : c
        )
      );
    } catch (e) {
      console.error(e);
      setChatHistory((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { role: "ai", text: "⚠️ Backend connection failed. Check server and CORS." },
                ],
              }
            : c
        )
      );
    } finally {
      setSending(false);
    }
  };

  /* ---------------- New trip ---------------- */
  const startNewTrip = () => {
    const newId = Date.now();
    setChatHistory((prev) => [
      {
        id: newId,
        title: `Trip ${prev.length + 1}`,
        messages: [{ role: "ai", text: "New journey started! 🌍 Where are we going today?" }],
      },
      ...prev,
    ]);
    setCurrentChatId(newId);
    setFormData({ startCity: "", endCity: "", soc: 50, avoidHighways: false });
    setChatInput("");
    setDirectionsResponse(null);
    setRoutes([]);
    setStations([]);
    setSelectedStation(null);
    setShowMap(false);
    setAutoKey(null);
  };

  /* ---------------- Autocomplete handlers (CONTROLLED) ---------------- */
  const onStartPlaceChanged = () => {
    const place = startAutocomplete.current?.getPlace();
    const addr = safePlaceAddress(place);
    if (addr) setFormData((p) => ({ ...p, startCity: addr }));
  };

  const onEndPlaceChanged = () => {
    const place = endAutocomplete.current?.getPlace();
    const addr = safePlaceAddress(place);
    if (addr) setFormData((p) => ({ ...p, endCity: addr }));
  };

  /* ---------------- Render guards ---------------- */
  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600 font-semibold">
          <Loader2 className="animate-spin" />
          Loading AMPORA…
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 overflow-hidden">
      <div className="flex h-full">
        {/* ---------- Sidebar ---------- */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="w-80 bg-slate-950 text-slate-200 flex flex-col shadow-2xl z-50"
            >
              <div className="px-6 py-6 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <Zap className="text-blue-400" size={18} />
                  </div>
                  <div className="leading-tight">
                    <div className="text-white font-extrabold tracking-wide">AMPORA</div>
                    <div className="text-[11px] text-slate-400">EV Booking Assistant</div>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-900 transition"
                  aria-label="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5">
                <button
                  onClick={startNewTrip}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 transition shadow-lg font-bold text-white flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  New Trip
                </button>
              </div>

              <div className="px-5 pb-5 flex-1 overflow-y-auto space-y-2">
                <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-2">
                  Trips
                </div>

                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setCurrentChatId(chat.id)}
                    className={cx(
                      "w-full text-left px-4 py-3 rounded-2xl transition border",
                      currentChatId === chat.id
                        ? "bg-slate-900 border-slate-700 text-blue-300"
                        : "bg-transparent border-transparent hover:bg-slate-900/60 hover:border-slate-800"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{chat.title}</span>
                      {currentChatId === chat.id && (
                        <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-1">
                      {chat.messages?.slice(-1)?.[0]?.text || ""}
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-5 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  Tip: After route analysis, ask:
                  <span className="text-slate-200 font-semibold">
                    {" "}
                    “I’m hungry, need restroom, fastest stop?”
                  </span>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ---------- Trip Engine Panel ---------- */}
        <aside className="w-[420px] max-w-[420px] bg-white/70 backdrop-blur-xl border-r border-slate-200 shadow-sm relative">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="absolute top-6 -right-4 p-2 bg-white border border-slate-200 shadow-md rounded-full hover:bg-slate-50 z-40"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
          )}

          <div className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center">
                    <Sparkles className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <div className="text-slate-900 font-extrabold text-xl tracking-tight">
                      Trip Engine
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">
                      Route → Stations → Best booking + break plan
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowMap(true)}
                className={cx(
                  "px-3 py-2 rounded-2xl border text-xs font-bold transition flex items-center gap-2",
                  showMap
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                )}
                disabled={!directionsResponse}
                title={!directionsResponse ? "Analyze a route first" : "Open map"}
              >
                <RouteIcon size={16} />
                Map
              </button>
            </div>

            <div className="mt-8 space-y-6">
              {/* Start */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                  Starting Point
                </div>

                <Autocomplete
                  onLoad={(a) => (startAutocomplete.current = a)}
                  onPlaceChanged={onStartPlaceChanged}
                >
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={formData.startCity}
                      onChange={(e) => setFormData((p) => ({ ...p, startCity: e.target.value }))}
                      placeholder="Enter start location…"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition"
                    />
                  </div>
                </Autocomplete>
              </div>

              {/* End */}
              <div className="space-y-2">
                <div className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest ml-1">
                  Destination
                </div>

                <Autocomplete onLoad={(a) => (endAutocomplete.current = a)} onPlaceChanged={onEndPlaceChanged}>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={formData.endCity}
                      onChange={(e) => setFormData((p) => ({ ...p, endCity: e.target.value }))}
                      placeholder="Where to…"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition"
                    />
                  </div>
                </Autocomplete>
              </div>

              {/* SOC */}
              <div className="p-5 rounded-[26px] bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center">
                      <Battery className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-blue-900 uppercase tracking-widest">
                        Battery Level (SOC)
                      </div>
                      <div className="text-xs text-slate-600">Helps estimate breaks + urgency</div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-extrabold">
                    {formData.soc}%
                  </div>
                </div>

                <input
                  type="range"
                  className="w-full accent-blue-600"
                  value={formData.soc}
                  onChange={(e) => setFormData((p) => ({ ...p, soc: e.target.value }))}
                />
              </div>

              {/* Avoid highways */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs font-extrabold text-slate-700">Avoid Highways</div>
                  <div className="text-[11px] text-slate-500">Try scenic / local roads</div>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-blue-600 rounded"
                  checked={formData.avoidHighways}
                  onChange={(e) => setFormData((p) => ({ ...p, avoidHighways: e.target.checked }))}
                />
              </div>

              {/* Analyze button */}
              <button
                onClick={handlePlanRoute}
                disabled={loadingRoute}
                className={cx(
                  "w-full py-4 rounded-2xl font-extrabold text-white shadow-xl transition active:scale-[0.99] flex items-center justify-center gap-2",
                  loadingRoute ? "bg-slate-400" : "bg-slate-900 hover:bg-black"
                )}
              >
                {loadingRoute ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Analyzing Route…
                  </>
                ) : (
                  <>
                    <Zap size={18} className="text-blue-400" />
                    Analyze Route
                  </>
                )}
              </button>

              {/* Small stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
                    Stations Found
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">{stations.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">From your database</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200">
                  <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
                    Route Options
                  </div>
                  <div className="mt-1 text-2xl font-extrabold text-slate-900">{routes.length}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Google alternatives</div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ---------- Chat Area ---------- */}
        <main className="flex-1 flex flex-col">
          {/* header */}
          <div className="px-10 py-6 border-b border-slate-200 bg-white/60 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center">
                <Bot className="text-blue-600" size={20} />
              </div>
              <div>
                <div className="text-slate-900 font-extrabold text-lg tracking-tight">
                  Travel Assistant
                </div>
                <div className="text-xs text-slate-500">LLM + Google Maps + ML recommendations</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-full uppercase">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              AI Online
            </div>
          </div>

          {/* messages */}
          <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8">
            <AnimatePresence initial={false}>
              {currentChat?.messages?.map((m, i) => {
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={cx("flex items-end gap-3", isUser ? "justify-end" : "justify-start")}
                  >
                    {!isUser && (
                      <div className="w-9 h-9 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600 mb-1">
                        <Bot size={18} />
                      </div>
                    )}

                    <div
                      className={cx(
                        "max-w-[78%] rounded-[26px] px-6 py-5 text-[15px] leading-relaxed whitespace-pre-wrap shadow-sm",
                        isUser
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-md"
                      )}
                    >
                      {m.text}

                      {/* Premium Best station card */}
                      {!isUser && m.best_station && (
                        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
                                Recommended Station
                              </div>
                              <div className="mt-1 text-slate-900 font-extrabold text-lg">
                                {m.best_station.name}
                              </div>
                              <div className="text-sm text-slate-600 mt-1">
                                {m.best_station.address || "Address: N/A"}
                              </div>
                            </div>
                            <div className="px-3 py-2 rounded-xl bg-blue-600 text-white font-extrabold text-sm">
                              Wait {m.best_station.wait}h
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-3 rounded-xl bg-white border border-slate-200">
                              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
                                Drive Time
                              </div>
                              <div className="mt-1 text-slate-900 font-extrabold">
                                {m.best_station.travel_time || "N/A"}
                              </div>
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-slate-200">
                              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-extrabold">
                                Distance
                              </div>
                              <div className="mt-1 text-slate-900 font-extrabold">
                                {m.best_station.distance || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-9 h-9 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 mb-1">
                        <User size={18} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {sending && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Bot size={18} />
                </div>
                <div className="px-5 py-4 rounded-[26px] bg-white border border-slate-200 text-slate-600 shadow-sm">
                  <span className="inline-flex items-center gap-2 font-semibold">
                    <Loader2 className="animate-spin" size={16} />
                    Thinking…
                  </span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* input */}
          <div className="px-10 py-8 border-t border-slate-200 bg-white/70 backdrop-blur-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 p-2 rounded-[30px] bg-white border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-blue-500/10 transition">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const t = chatInput.trim();
                      if (!t || sending) return;
                      sendChat(t);
                      setChatInput("");
                    }
                  }}
                  placeholder="Ask about wait time, amenities, fastest station, coffee break…"
                  className="flex-1 px-5 py-4 bg-transparent outline-none text-slate-700"
                />
                <button
                  onClick={() => {
                    const t = chatInput.trim();
                    if (!t || sending) return;
                    sendChat(t);
                    setChatInput("");
                  }}
                  className={cx(
                    "px-5 py-4 rounded-[26px] font-extrabold text-white shadow-lg transition flex items-center gap-2",
                    sending ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700"
                  )}
                >
                  <Send size={18} />
                  Send
                </button>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-2">
                <Zap size={14} className="text-blue-600" />
                Tip: “I have 30 minutes, what can I do near the station?” (uses your ML model)
              </div>
            </div>
          </div>
        </main>

        {/* ---------- MAP OVERLAY ---------- */}
        <AnimatePresence>
          {showMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-md p-6"
            >
              <div className="w-full h-full bg-white rounded-[34px] shadow-2xl overflow-hidden flex flex-col border border-slate-200">
                <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-200 flex items-center justify-center">
                      <RouteIcon className="text-blue-600" size={18} />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-900">Route & Stations</div>
                      <div className="text-xs text-slate-500">
                        Click a route to compare stations on that path.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-full">
                      <MapPin size={14} />
                      {stations.length} stations
                    </div>
                    <button
                      onClick={() => setShowMap(false)}
                      className="p-3 rounded-2xl bg-slate-100 hover:bg-red-50 hover:text-red-600 transition"
                      aria-label="Close map"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="px-8 py-4 border-b border-slate-200 bg-white">
                  <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                    {routes.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => setRouteIndex(i)}
                        className={cx(
                          "px-5 py-2.5 rounded-full text-xs font-extrabold transition",
                          routeIndex === i
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        )}
                      >
                        Route {i + 1} ({r.legs?.[0]?.distance?.text || "—"})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-6 bg-slate-50">
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={10}
                    onLoad={(map) => setMapInstance(map)}
                  >
                    {directionsResponse && (
                      <DirectionsRenderer
                        directions={directionsResponse}
                        routeIndex={routeIndex}
                        options={{
                          polylineOptions: { strokeColor: "#2563eb", strokeWeight: 6 },
                          suppressMarkers: false,
                        }}
                      />
                    )}

                    {(stations || []).map((st, idx) => (
                      <Marker
                        key={`st-${idx}`}
                        position={{ lat: Number(st.lat), lng: Number(st.lng) }}
                        onClick={() => setSelectedStation(st)}
                      />
                    ))}

                    {selectedStation && (
                      <InfoWindow
                        position={{
                          lat: Number(selectedStation.lat),
                          lng: Number(selectedStation.lng),
                        }}
                        onCloseClick={() => setSelectedStation(null)}
                      >
                        <div className="p-3 min-w-[220px]">
                          <div className="text-sm font-extrabold text-blue-700">
                            {selectedStation.name}
                          </div>
                          <div className="text-[11px] text-slate-600 mt-1">
                            {selectedStation.address || "Address: N/A"}
                          </div>
                          <div className="text-[11px] font-bold text-slate-700 mt-2">
                            Status: {selectedStation.status ?? "N/A"}
                          </div>

                          <button
                            className="mt-3 w-full px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-extrabold hover:bg-black transition"
                            onClick={() => {
                              const msg = `Tell me about ${selectedStation.name}. Is it the best choice?`;
                              setShowMap(false);
                              sendChat(msg);
                            }}
                          >
                            Ask AMPORA about this station
                          </button>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
