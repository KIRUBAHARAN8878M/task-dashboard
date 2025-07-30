import { Routes, Route, Navigate, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import PrivateRoute from "./routes/PrivateRoute";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAuth } from "./features/auth/useAuth";
import { useSessionTimer } from "./hooks/useSessionTimer";

export default function App() {
  const { logout } = useAuth();
  const onExpire = useCallback(() => {
    toast("Session expired. Please sign in again.");
    logout();
  }, [logout]);
  useSessionTimer(onExpire);
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>

      <Toaster position="top-right" />
      <div className="fixed bottom-2 left-2 text-xs opacity-70">
        <Link to="/auth/login" className="underline mr-2">
          Login
        </Link>
        <Link to="/auth/register" className="underline mr-2">
          Register
        </Link>
        <Link to="/dashboard" className="underline">
          Dashboard
        </Link>
      </div>
    </>
  );
}
