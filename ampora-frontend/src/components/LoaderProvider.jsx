import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

export default function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    // Simulate loading time or API fetch
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 800); // Adjust as needed

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loading />}
      {!loading && children}
    </>
  );
}
