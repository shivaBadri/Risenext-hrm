import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Attendance from "./pages/Attendance";
import Leaves from "./pages/Leaves";
import SalarySlip from "./pages/SalarySlip";
import Departments from "./pages/Departments";
import ChangePassword from "./pages/ChangePassword";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("hrm_token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <PrivateRoute>
          <div>
            <Navbar />
            <div style={{ padding: "24px", background: "#f4f6fb", minHeight: "calc(100vh - 56px)" }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leaves />} />
                <Route path="/salary-slip" element={<SalarySlip />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/change-password" element={<ChangePassword />} />
              </Routes>
            </div>
          </div>
        </PrivateRoute>
      } />
    </Routes>
  );
}

export default App;
