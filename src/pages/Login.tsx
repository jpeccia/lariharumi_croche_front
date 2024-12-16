// src/pages/Login.tsx
import { LoginForm } from '../components/auth/LoginForm';

function LoginPage() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-800 mb-4">Login</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
