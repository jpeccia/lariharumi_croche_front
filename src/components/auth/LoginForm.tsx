import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { showError } from '../../utils/toast';
import { loginSchema, LoginFormData } from '../../schemas/productSchemas';
import { useAnalytics } from '../../services/analytics';

interface JwtPayload {
  role: string;
  exp: number;
  sub: string;
  iss: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { trackConversion, trackError } = useAnalytics();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data.email, data.password);
  
      // Aqui, estamos assumindo que o token está diretamente na resposta
      const token = response.token; 

      if (!token || typeof token !== 'string') {
        throw new Error('Token inválido');
      }

      // Decodifique o token JWT
      const decodedToken = jwtDecode<JwtPayload>(token);
  
      // Verifique o papel do usuário
      const isAdmin = decodedToken.role === 'ADMIN';
  
      // Armazene os dados no Zustand
      setAuth(response.user, token, isAdmin);
  
      // Rastrear conversão de login bem-sucedido
      trackConversion('login_success', undefined, { isAdmin });
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      showError('Erro de login, verifique suas credenciais.');
      
      // Rastrear erro de login
      trackError(error as Error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
