// src/pages/Login.tsx
import { LoginForm } from '../components/auth/LoginForm';
import { SEOHead } from '../components/shared/SEOHead';

function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <SEOHead title="Entrar" noIndex={true} />
      <h1 className="text-3xl font-bold text-purple-800 mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
