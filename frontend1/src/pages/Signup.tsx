import { useNavigate } from 'react-router-dom';
import { AuthComponent } from '@/components/ui/sign-up';
import { Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmitSuccess = () => {
    // Navigate to onboarding or dashboard after successful signup
    navigate('/onboarding');
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[Signup] Attempting signup for:', email);
      await signup(email, password, fullName);
      console.log('[Signup] Signup successful');
    } catch (error: any) {
      console.error('[Signup] Signup error:', error);
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
    />
  );
};

export default Signup;
