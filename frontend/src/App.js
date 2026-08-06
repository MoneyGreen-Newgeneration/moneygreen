import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LoanAuto from "./pages/loans/LoanAuto";
import LoanImmobilier from "./pages/loans/LoanImmobilier";
import LoanScolaire from "./pages/loans/LoanScolaire";
import LoanPersonnel from "./pages/loans/LoanPersonnel";
import Admin from "./pages/admin/Admin";
import PaymentInfoPage from "./pages/payment/PaymentInfoPage";

function App() {
  return (
    <ThemeProvider>
      <LangProvider>
      <AuthProvider>
        <SocketProvider>
        <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/prets/auto" element={<ProtectedRoute><LoanAuto /></ProtectedRoute>} />
          <Route path="/prets/immobilier" element={<ProtectedRoute><LoanImmobilier /></ProtectedRoute>} />
          <Route path="/prets/scolaire" element={<ProtectedRoute><LoanScolaire /></ProtectedRoute>} />
          <Route path="/prets/personnel" element={<ProtectedRoute><LoanPersonnel /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          <Route path="/paiement-infos" element={<ProtectedRoute><PaymentInfoPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </LangProvider>
    </ThemeProvider>
  );
}

export default App;







