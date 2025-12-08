import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripPlanner from "./components/TripPlanner/TripPlanner.jsx";
import StationFinder from "./pages/StationFinder.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import VehicleManager from "./pages/VehicleManager.jsx";
import StationDetails from "./pages/StationDetails.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings.jsx";
import HelpSupport from "./pages/HelpSupport.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import ChargingHistory from "./pages/ChargingHistory.jsx";
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import Forget from "./pages/Forget.jsx";
import LoaderProvider from "./components/LoaderProvider.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminChargerStationPage from "./pages/admin/ChargerStation.jsx";
import AdminDashboardpage from "./pages/admin/Dashboard.jsx";
import AdminChargerSessionpage from "./pages/admin/ChargerSession.jsx";
import AdminUserpage from "./pages/admin/UserPage.jsx";
import AdminVehicle from "./pages/admin/Vehicle.jsx";

import AdminLayout from "./components/Layout.jsx";

function AppLayout() {
  const location = useLocation();
  const path = location.pathname;

  const authPages = ["/login", "/register", "/forget"];
  const isAuthPage = authPages.includes(path);

  const isAdminPage = path.startsWith("/admin");

  return (
    <>

    
      {!isAuthPage && !isAdminPage && <Navbar />}

      <LoaderProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget" element={<Forget />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip" element={<TripPlanner />} />
          <Route path="/stations" element={<StationFinder />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/payments" element={<PaymentPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/vehicles" element={<VehicleManager />} />
          <Route path="/history" element={<ChargingHistory />} />
          <Route path="/plans" element={<SubscriptionPlans />} />
          <Route path="/station/:id" element={<StationDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpSupport />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardpage />} />
            <Route path="dashboard" element={<AdminDashboardpage />} />{" "}
            <Route path="vehicle" element={<AdminVehicle />} />{" "}
            <Route path="users" element={<AdminUserpage />} />{" "}
            <Route
              path="charger-session"
              element={<AdminChargerSessionpage />}
            />{" "}
            <Route
              path="charger-stations"
              element={<AdminChargerStationPage />}
            />{" "}
          </Route>
        </Routes>

      </LoaderProvider>
      {!isAuthPage && !isAdminPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
