import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <>
      <AdminNavbar />

      <div className=" min-h-screen bg-black/0">
        <div className="flex">
          <main className="flex-1  ">
            <div >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
