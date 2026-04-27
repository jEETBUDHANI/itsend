import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '@/components/ui/sign-up';
import { Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const handleSubmitSuccess = () => {
    // Navigation is handled in handleSignup after successful signup
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[Signup] Attempting signup for:', email);
      const user = await signup(email, password, fullName);
      console.log('[Signup] Signup successful');
      // After successful signup, navigate to onboarding or dashboard
      if (!user.education_module || !user.academic_stage) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('[Signup] Signup error:', error);
      throw error; // Re-throw so AuthComponent can display error
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password);
      if (!user.education_module || !user.academic_stage) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('[Signup page -> Login mode] Login error:', error?.response?.data?.error || error?.message || 'Unknown login error');
      throw error;
    }
  };

  const SignupLogo = () => (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md p-1.5">
      <Brain className="h-4 w-4" />
    </div>
  );

  return (
    <AuthComponent
      logo={<SignupLogo />}
      brandName="CareerPath Pro"
      onSubmitSuccess={handleSubmitSuccess}
      mode="signup"
      onSignup={handleSignup}
      onLogin={handleLogin}
    />
  );
};

export default Signup;
