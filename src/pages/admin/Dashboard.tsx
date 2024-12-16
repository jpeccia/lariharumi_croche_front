import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore'; // Assumindo que você tem um hook de autenticação
import { ProductManagement } from '../../components/admin/ProductManagement';
import { ReviewManagement } from '../../components/admin/ReviewManagement';
import { SiteSettings } from '../../components/admin/SiteSettings';
import { CategoryManagement } from '../../components/admin/CategoryManagement';

function AdminDashboard() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin); // Agora, é um booleano

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null; // Não renderiza nada se não for admin

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-purple-800 mb-8">Painel Administrativo</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductManagement />
        </div>
        <CategoryManagement />
        <div>
          <div className="space-y-6">
            <SiteSettings />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
