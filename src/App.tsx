import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Care from './pages/Care';
import Contact from './pages/Contact';
import LoginPage from './pages/Login';
import { DonationPage } from './pages/DonationPage';

// Lazy loading para páginas administrativas
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

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
        <Route 
          path="/admin" 
          element={
            <Suspense fallback={
              <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
              </div>
            }>
              <AdminDashboard />
            </Suspense>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;