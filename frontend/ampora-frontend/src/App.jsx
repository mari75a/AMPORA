import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import LoaderProvider from "./components/LoaderProvider.jsx";

/* ---------- USER PAGES ---------- */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register.jsx";
import Forget from "./pages/Forget.jsx";
import Dashboard from "./pages/Dashboard";
import TripPlanner from "./components/TripPlanner/TripPlanner.jsx";
import StationFinder from "./pages/StationFinder.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import UserProfile from "./pages/user/UserProfile.jsx";
import VehicleManager from "./pages/VehicleManager.jsx";
import StationDetails from "./pages/StationDetails.jsx";
import Notifications from "./pages/Notifications.jsx";
import Settings from "./pages/Settings.jsx";
import HelpSupport from "./pages/HelpSupport.jsx";
import SubscriptionPlans from "./pages/SubscriptionPlans.jsx";
import ChargingHistory from "./pages/ChargingHistory.jsx";

/* ---------- OPERATOR ---------- */
import OperatorLayout from "./pages/Operator/OperatorLayout";
import Operator from "./pages/Operator/Operator.jsx";
import StationOp from "./pages/Operator/StationOp.jsx";
import Reports from "./pages/Operator/Reports.jsx";
import Booking from "./pages/Operator/Booking.jsx";
import Settingsop from "./pages/Operator/Settingsop.jsx";
import Maintenance from "./pages/Operator/Settingsop.jsx";

/* ---------- ADMIN ---------- */

import AdminDashboardpage from "./pages/admin/Dashboard.jsx";
import AdminVehicle from "./pages/admin/Vehicle.jsx";

import AdminUserpage from "./pages/admin/UserPage.jsx";
import AdminChargerSessionpage from "./pages/admin/ChargerSession.jsx";
import AdminChargerStationPage from "./pages/admin/ChargerStation.jsx";


import AdminLayout from "./components/Layout.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import ChargerPage from "./pages/admin/Charger.jsx";
// import Subscription from "./pages/admin/subscriptionService.jsx";
import BookingStation from "./pages/admin/BookingStation.jsx";
import PackageSelector from "./pages/PackageSelector.jsx";


function AppLayout() {
  const { pathname } = useLocation();

  const authPages = ["/login", "/register", "/forget"];
  const isAuthPage = authPages.includes(pathname);
  const isOperatorPage = pathname.startsWith("/operator");
  const isAdminPage = pathname.startsWith("/admin");

  const hideNavbarFooter = isAuthPage || isOperatorPage || isAdminPage;

  return (
    <>

      {!hideNavbarFooter && <Navbar />}

      {!isAuthPage && !isAdminPage && <Navbar />}


      <LoaderProvider>
        <Routes>
          {/* ---------- PUBLIC / USER ---------- */}
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
          <Route path="/payment-success" element={<PaymentSuccess />} />
           <Route path="/package" element={<PackageSelector />} />

          {/* ---------- OPERATOR ---------- */}
          <Route element={<OperatorLayout />}>
            <Route path="/operator" element={<Operator />} />
            <Route path="/operator/stations" element={<StationOp />} />
            <Route path="/operator/reports" element={<Reports />} />
            <Route path="/operator/bookings" element={<Booking />} />
            <Route path="/operator/settings" element={<Settingsop />} />
            <Route path="/operator/maintenance" element={<Maintenance />} />
          </Route>

          {/* ---------- ADMIN ---------- */}
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
            <Route path="charger" element={<ChargerPage />} />
            {/* <Route path="subscriptions" element={<Subscription />} /> */}
            <Route path="BookingStation" element={<BookingStation />} />

          </Route>
        </Routes>
      </LoaderProvider>

      {!hideNavbarFooter && <Footer />}
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
