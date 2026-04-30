import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Loading component - Premium Aesthetic
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-black relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
    <div className="relative z-10 flex flex-col items-center">
      <div className="relative h-20 w-20 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-10 w-10 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg shadow-primary/20 animate-bounce flex items-center justify-center">
            <span className="text-white text-xs font-bold">CP</span>
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
        CareerPath Pro
      </h2>
      <p className="text-gray-500 text-sm mt-2 tracking-widest uppercase">Optimizing Your Future...</p>
    </div>
  </div>
);

// Lazy load ALL pages for code splitting and better performance
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PersonalityTest = lazy(() => import("./pages/PersonalityTest"));
const AptitudeTest = lazy(() => import("./pages/AptitudeTest"));
const WorkValuesTest = lazy(() => import("./pages/WorkValuesTest"));
const RiskToleranceTest = lazy(() => import("./pages/RiskToleranceTest"));
const Results = lazy(() => import("./pages/Results"));
const Profile = lazy(() => import("./pages/Profile"));
const AssessmentCenter = lazy(() => import("./pages/AssessmentCenter"));
const HolisticProfile = lazy(() => import("./pages/HolisticProfile"));
const CareerExplorer = lazy(() => import("./pages/CareerExplorer"));
const CareerDetail = lazy(() => import("./pages/CareerDetail"));
const Simulator = lazy(() => import("./pages/Simulator"));
const AIMentor = lazy(() => import("./pages/AIMentor"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const ProgressDashboard = lazy(() => import("./pages/ProgressDashboard"));
const PublicDashboard = lazy(() => import("./pages/PublicDashboard"));
const CareerComparison = lazy(() => import("./pages/CareerComparison"));
const JobReadinessDashboard = lazy(() => import("./pages/JobReadinessDashboard"));
const ActionPlanGenerator = lazy(() => import("./pages/ActionPlanGenerator"));
const CareerSwitchSimulator = lazy(() => import("./pages/CareerSwitchSimulator"));
const PlacementPrep = lazy(() => import("./pages/PlacementPrep"));
const ModuleDashboard = lazy(() => import("./pages/ModuleDashboard"));
const ModuleAssessments = lazy(() => import("./pages/ModuleAssessments"));
const ModuleRecommendation = lazy(() => import("./pages/ModuleRecommendation"));
const ModuleRoadmap = lazy(() => import("./pages/ModuleRoadmap"));
const Class10Assessment = lazy(() => import("./pages/Class10Assessment"));
const Class10Results = lazy(() => import("./pages/Class10Results"));
const Class10StreamDetails = lazy(() => import("./pages/Class10StreamDetails"));
const Class10Roadmap = lazy(() => import("./pages/Class10Roadmap"));
const Class10Careers = lazy(() => import("./pages/Class10Careers"));
const Class12Preview = lazy(() => import("./pages/Class12Preview"));
const Class12Assessment = lazy(() => import("./pages/Class12Assessment"));
const CollegeAssessment = lazy(() => import("./pages/CollegeAssessment"));
const CollegeSkeleton = lazy(() => import("./pages/CollegeSkeleton"));
const CollegeFoundation = lazy(() => import("./pages/CollegeFoundation"));
const CollegeInternship = lazy(() => import("./pages/CollegeInternship"));
const CollegePlacement = lazy(() => import("./pages/CollegePlacement"));
const FinalYearAssessment = lazy(() => import("./pages/FinalYearAssessment"));
const Year3InternshipAssessment = lazy(() => import("./pages/Year3InternshipAssessment"));
const FoundationAssessment = lazy(() => import("./pages/FoundationAssessment"));
const MockInterview = lazy(() => import("./pages/MockInterview"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,        // 5 minutes
      gcTime: 1000 * 60 * 10,          // 10 minutes (formerly cacheTime)
      retry: 1,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
