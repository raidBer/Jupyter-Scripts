import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import Projects from "./pages/Projects/Projects";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <div className="min-h-screen min-w-max font-poppins bg-color3">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Projects />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}
