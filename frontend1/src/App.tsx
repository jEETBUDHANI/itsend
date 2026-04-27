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
import ModuleDashboard from "./pages/ModuleDashboard";
import ModuleAssessments from "./pages/ModuleAssessments";
import ModuleRecommendation from "./pages/ModuleRecommendation";
import ModuleRoadmap from "./pages/ModuleRoadmap";
import Class10Assessment from "./pages/Class10Assessment";
import Class10Results from "./pages/Class10Results";
import Class10StreamDetails from "./pages/Class10StreamDetails";
import Class10Roadmap from "./pages/Class10Roadmap";
import Class10Careers from "./pages/Class10Careers";
import Class12Preview from "./pages/Class12Preview";
import Class12Assessment from "./pages/Class12Assessment";
import CollegeAssessment from "./pages/CollegeAssessment";
import CollegeSkeleton from "./pages/CollegeSkeleton";
import CollegeFoundation from "./pages/CollegeFoundation";
import CollegeInternship from "./pages/CollegeInternship";
import CollegePlacement from "./pages/CollegePlacement";
import FinalYearAssessment from "./pages/FinalYearAssessment";
import Year3InternshipAssessment from "./pages/Year3InternshipAssessment";
import FoundationAssessment from "./pages/FoundationAssessment";
import MockInterview from "./pages/MockInterview";

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
              <Route path="/class10-assessment" element={<ProtectedRoute><Class10Assessment /></ProtectedRoute>} />
              <Route path="/class10-results" element={<ProtectedRoute><Class10Results /></ProtectedRoute>} />
              <Route path="/class10-stream-details" element={<ProtectedRoute><Class10StreamDetails /></ProtectedRoute>} />
              <Route path="/class10-roadmap" element={<ProtectedRoute><Class10Roadmap /></ProtectedRoute>} />
              <Route path="/class10-careers" element={<ProtectedRoute><Class10Careers /></ProtectedRoute>} />
              <Route path="/class12-preview" element={<ProtectedRoute><Class12Preview /></ProtectedRoute>} />
              <Route path="/class12-assessment" element={<ProtectedRoute><Class12Assessment /></ProtectedRoute>} />
              <Route path="/college-skeleton" element={<ProtectedRoute><CollegeSkeleton /></ProtectedRoute>} />
              <Route path="/college-assessment" element={<ProtectedRoute><CollegeAssessment /></ProtectedRoute>} />
              <Route path="/college/foundation" element={<ProtectedRoute><CollegeFoundation /></ProtectedRoute>} />
              <Route path="/college/foundation/assessment" element={<ProtectedRoute><FoundationAssessment /></ProtectedRoute>} />
              <Route path="/college/internship" element={<ProtectedRoute><CollegeInternship /></ProtectedRoute>} />
              <Route path="/college/internship/assessment" element={<ProtectedRoute><Year3InternshipAssessment /></ProtectedRoute>} />
              <Route path="/college/placement" element={<ProtectedRoute><CollegePlacement /></ProtectedRoute>} />
              <Route path="/college/placement/assessment" element={<ProtectedRoute><FinalYearAssessment /></ProtectedRoute>} />
              <Route path="/holistic-profile" element={<ProtectedRoute><HolisticProfile /></ProtectedRoute>} />
              <Route path="/careers" element={<ProtectedRoute><CareerExplorer /></ProtectedRoute>} />
              <Route path="/careers/:id" element={<ProtectedRoute><CareerDetail /></ProtectedRoute>} />
              <Route path="/simulator" element={<ProtectedRoute><Simulator /></ProtectedRoute>} />
              <Route path="/mentor" element={<ProtectedRoute><AIMentor /></ProtectedRoute>} />
              <Route path="/mock-interview" element={<ProtectedRoute><MockInterview /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><ProgressDashboard /></ProtectedRoute>} />
                <Route path="/module-dashboard" element={<ProtectedRoute><ModuleDashboard /></ProtectedRoute>} />
                <Route path="/module-assessments" element={<ProtectedRoute><ModuleAssessments /></ProtectedRoute>} />
                <Route path="/module-recommendation" element={<ProtectedRoute><ModuleRecommendation /></ProtectedRoute>} />
                <Route path="/module-roadmap" element={<ProtectedRoute><ModuleRoadmap /></ProtectedRoute>} />
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
