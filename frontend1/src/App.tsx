import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import PersonalityTest from "./pages/PersonalityTest";
import AptitudeTest from "./pages/AptitudeTest";
import WorkValuesTest from "./pages/WorkValuesTest";
import RiskToleranceTest from "./pages/RiskToleranceTest";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import AssessmentCenter from "./pages/AssessmentCenter";
import HolisticProfile from "./pages/HolisticProfile";
import CareerExplorer from "./pages/CareerExplorer";
import CareerDetail from "./pages/CareerDetail";
import Simulator from "./pages/Simulator";
import AIMentor from "./pages/AIMentor";
import Roadmap from "./pages/Roadmap";
import ProgressDashboard from "./pages/ProgressDashboard";
import PublicDashboard from "./pages/PublicDashboard";
import NotFound from "./pages/NotFound";
import CareerComparison from "./pages/CareerComparison";
import JobReadinessDashboard from "./pages/JobReadinessDashboard";
import ActionPlanGenerator from "./pages/ActionPlanGenerator";
import CareerSwitchSimulator from "./pages/CareerSwitchSimulator";
import PlacementPrep from "./pages/PlacementPrep";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard-public" element={<PublicDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/test" element={<ProtectedRoute><PersonalityTest /></ProtectedRoute>} />
              <Route path="/results/:id" element={<ProtectedRoute><Results /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/assessments" element={<ProtectedRoute><AssessmentCenter /></ProtectedRoute>} />
              <Route path="/assessments/aptitude" element={<ProtectedRoute><AptitudeTest /></ProtectedRoute>} />
              <Route path="/assessments/personality" element={<ProtectedRoute><PersonalityTest /></ProtectedRoute>} />
              <Route path="/assessments/values" element={<ProtectedRoute><WorkValuesTest /></ProtectedRoute>} />
              <Route path="/assessments/risk" element={<ProtectedRoute><RiskToleranceTest /></ProtectedRoute>} />
              <Route path="/holistic-profile" element={<ProtectedRoute><HolisticProfile /></ProtectedRoute>} />
              <Route path="/careers" element={<ProtectedRoute><CareerExplorer /></ProtectedRoute>} />
              <Route path="/careers/:id" element={<ProtectedRoute><CareerDetail /></ProtectedRoute>} />
              <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
              <Route path="/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
                    <Route path="/careers/comparison" element={<ProtectedRoute><CareerComparison /></ProtectedRoute>} />
                    <Route path="/readiness" element={<ProtectedRoute><JobReadinessDashboard /></ProtectedRoute>} />
                    <Route path="/action-plan" element={<ProtectedRoute><ActionPlanGenerator /></ProtectedRoute>} />
                    <Route path="/career-switch" element={<ProtectedRoute><CareerSwitchSimulator /></ProtectedRoute>} />
                    <Route path="/placement-prep" element={<ProtectedRoute><PlacementPrep /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
