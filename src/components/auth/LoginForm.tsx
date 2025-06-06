import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
  import {jwtDecode} from 'jwt-decode'; // Corrigido para usar default import

interface JwtPayload {
  role: string;
  exp: number;
  sub: string;
  iss: string;
}

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

interface LoginData {
  email: string;
  password: string;
}

export function LoginForm() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await authApi.login(data.email, data.password);
  
      // Imprima a resposta completa da API
      console.log('API Response:', response);
      
      // Aqui, estamos assumindo que o token está diretamente na resposta
      const token = response.token; 
  
      if (!token || typeof token !== 'string') {
        throw new Error('Token inválido');
      }
  
      console.log('Received token:', token);
  
      // Decodifique o token JWT
      const decodedToken = jwtDecode<JwtPayload>(token); // Tipagem do payload
      console.log('Decoded token:', decodedToken);
  
      // Verifique o papel do usuário
      const isAdmin = decodedToken.role === 'ADMIN';
  
      // Armazene os dados no Zustand
      setAuth(response.user, token, isAdmin);
  
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Erro de login, verifique suas credenciais.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Senha</label>
        <input
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
