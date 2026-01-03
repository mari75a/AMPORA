import { useEffect, useRef, useState } from "react";

export default function useChargingSocket() {
  const wsRef = useRef(null);

  const [data, setData] = useState({
    current: 0,
    power: 0,
    energy: 0,
    charging: false,
  });

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const WS_URL = "ws://192.168.33.79:8083/ws/charging";

    wsRef.current = new WebSocket(WS_URL);

    wsRef.current.onopen = () => {
      console.log("✅ WS CONNECTED");
      setConnected(true);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log("📡 LIVE DATA:", payload);
        setData(payload);
      } catch (err) {
        console.error("❌ JSON parse error", err);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("❌ WS ERROR", err);
    };

    wsRef.current.onclose = () => {
      console.warn("⚠️ WS DISCONNECTED");
      setConnected(false);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return { data, connected };
}
