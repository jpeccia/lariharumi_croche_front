import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Care from './pages/Care';
import Contact from './pages/Contact';
import LoginPage from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import { DonationPage } from './pages/DonationPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/care" element={<Care />} />
        <Route path="/donation" element={<DonationPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<AdminDashboard />} />  {/* Página de admin */}
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;