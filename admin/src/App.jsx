import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Import pages
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminModels from "./pages/AdminModels";
import AdminBookings from "./pages/AdminBookings";
import AdminUpload from "./pages/AdminUpload";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import AllUsersTable from "./pages/AllUsersTable";
import ModelApprovalList from "./pages/ModelApprovalList";
import SystemSettings from "./pages/SystemSettings";
import AdminLogs from "./pages/AdminLogs";

// Import layout
import AdminLayout from "./components/layout/AdminLayout";

// Import protected route
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login route (no layout, not protected) */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Admin routes (with layout and protection) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="models" element={<AdminModels />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="upload" element={<AdminUpload />} />
          {/* Superadmin routes */}
          <Route
            path="superadmin/dashboard"
            element={<SuperadminDashboard />}
          />
          <Route path="superadmin/users" element={<AllUsersTable />} />
          <Route
            path="superadmin/model-approvals"
            element={<ModelApprovalList />}
          />
          <Route path="superadmin/settings" element={<SystemSettings />} />
          <Route path="superadmin/logs" element={<AdminLogs />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
