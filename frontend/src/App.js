import React, { useContext } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthContext } from './auth/AuthContext';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile'
import './App.css';

function App() {
  const { token, role } = useContext(AuthContext);
  return (
    <Routes>
    {token === null ? (
      <>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </>
    ) : role === "admin" ? (
      <>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" />} />
      </>
    ) : role === "user" ? (
      <>
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="*" element={<Navigate to="/user/profile" />} />
      </>
    )  : (
      <Navigate to="/" />
    )}
  </Routes>  
  );
}

export default App;
