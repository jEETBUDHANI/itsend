import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Suspense } from "react-router-dom";
import { lazy, Suspense as SuspenseComponent } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Critical pages - load directly for faster initial load
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for code splitting
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
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard-public" element={<SuspenseComponent fallback={<PageLoader />}><PublicDashboard /></SuspenseComponent>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Onboarding /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Dashboard /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/test" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><PersonalityTest /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/results/:id" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Results /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Profile /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/assessments" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><AssessmentCenter /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/assessments/aptitude" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><AptitudeTest /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/assessments/personality" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><PersonalityTest /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/assessments/values" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><WorkValuesTest /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/assessments/risk" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><RiskToleranceTest /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class10-assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class10Assessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class10-results" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class10Results /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class10-stream-details" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class10StreamDetails /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class10-roadmap" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class10Roadmap /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class10-careers" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class10Careers /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class12-preview" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class12Preview /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/class12-assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Class12Assessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college-skeleton" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CollegeSkeleton /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college-assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CollegeAssessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/foundation" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CollegeFoundation /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/foundation/assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><FoundationAssessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/internship" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CollegeInternship /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/internship/assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Year3InternshipAssessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/placement" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CollegePlacement /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/college/placement/assessment" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><FinalYearAssessment /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/holistic-profile" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><HolisticProfile /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/careers" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CareerExplorer /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/careers/:id" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CareerDetail /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/simulator" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Simulator /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/mentor" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><AIMentor /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/mock-interview" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><MockInterview /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><Roadmap /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ProgressDashboard /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/module-dashboard" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ModuleDashboard /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/module-assessments" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ModuleAssessments /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/module-recommendation" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ModuleRecommendation /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/module-roadmap" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ModuleRoadmap /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/careers/comparison" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CareerComparison /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/readiness" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><JobReadinessDashboard /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/action-plan" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><ActionPlanGenerator /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/career-switch" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><CareerSwitchSimulator /></SuspenseComponent></ProtectedRoute>} />
              <Route path="/placement-prep" element={<ProtectedRoute><SuspenseComponent fallback={<PageLoader />}><PlacementPrep /></SuspenseComponent></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
