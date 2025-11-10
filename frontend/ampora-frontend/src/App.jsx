import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
// import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TripPlanner from "./pages/TripPlanner";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trip-planner" element={<TripPlanner />} />
      </Routes>
    </Router>
  );
}

export default App;
