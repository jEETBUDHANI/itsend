import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '@/components/ui/sign-up';
import { Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmitSuccess = () => {
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const LoginLogo = () => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md p-1.5">
      <Brain className="h-4 w-4" />
    </div>
  );

  return (
    <AuthComponent
      logo={<LoginLogo />}
      brandName="CareerPath Pro"
      onSubmitSuccess={handleSubmitSuccess}
      mode="signin"
      onLogin={handleLogin}
    />
  );
};

export default Login;
