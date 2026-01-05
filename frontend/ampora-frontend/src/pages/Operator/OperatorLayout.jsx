import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function OperatorLayout() {
  return (
    <div className="flex min-h-screen w-screen bg-red-500 bg-gradient-to-br from-white via-emerald-50 to-teal-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex p-6 min-h-screen overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
