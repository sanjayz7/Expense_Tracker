import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* No Protected Route */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
