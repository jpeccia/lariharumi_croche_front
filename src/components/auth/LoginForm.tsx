import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { showError } from '../../utils/toast';
import { loginSchema, LoginFormData } from '../../schemas/validationSchemas';
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
  
      const token = response.token;

      if (!token || typeof token !== 'string') {
        throw new Error('Token inválido');
      }

      const decodedToken = jwtDecode<JwtPayload>(token);
  
      const isAdmin = decodedToken.role === 'ADMIN';
      
      const user = {
        ID: parseInt(decodedToken.sub),
        email: data.email,
        name: data.email.split('@')[0],
        isAdmin: isAdmin
      };
  
      setAuth(user, token);
  
      trackConversion('login_success', undefined, { isAdmin });
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch {
      showError('Erro de login, verifique suas credenciais.');
      trackError(new Error('Login failed'));
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
