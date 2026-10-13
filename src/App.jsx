import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Invitations from "./pages/Invitations.jsx";
import { Toaster } from "react-hot-toast";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
      <AuthProvider>
        <Toaster position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
            <Route path="/invitations" element={<ProtectedRoute><Invitations /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}