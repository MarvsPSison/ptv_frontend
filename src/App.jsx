import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./app/pages/Login";
import InternDash from "./app/pages/InternDash";
import AdminDash from "./app/pages/AdminDash";
import Dashboard from "./app/pages/Dashboard";
import "./App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/intern-dash" element={<InternDash />} />
        <Route path="/admin-log" element={<AdminDash />} />
        <Route path="/admin-dash" element={<AdminDash />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}