import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '@/components/ui/sign-up';
import { Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmitSuccess = () => {
    // Navigation is handled in handleLogin after successful login
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password);
      // After successful login, handle navigation based on user state
      if (!user.education_module || !user.academic_stage) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error?.response?.data?.error || error?.message || 'Unknown login error');
      throw error; // Re-throw so AuthComponent can display error
    }
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    try {
      const user = await signup(email, password, fullName);
      if (!user.education_module || !user.academic_stage) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Signup error:', error?.response?.data?.error || error?.message || 'Unknown signup error');
      throw error;
    }
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
      onSignup={handleSignup}
    />
  );
};

export default Login;
