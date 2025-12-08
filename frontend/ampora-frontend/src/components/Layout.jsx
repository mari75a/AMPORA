import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />

      <div className="py-20 min-h-screen bg-black/0">
        <div className="flex">
          <main className="flex-1 px-4 md:px-8">
            <div className="mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
