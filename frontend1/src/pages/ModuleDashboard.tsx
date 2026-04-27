import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, Sparkles, Target, ArrowRight } from 'lucide-react';

import { useAuth } from '@/contexts/AuthContext';
import { modulesApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ModuleNavTabs from '@/components/ModuleNavTabs';

const MODULE_THEME: Record<string, { title: string; accent: string; flowLabel: string }> = {
  class10: {
    title: 'Discovery Module',
    accent: 'from-cyan-500 to-blue-600',
    flowLabel: 'Discover strengths, stream fit, and career clusters',
  },
  class12: {
    title: 'Decision Module',
    accent: 'from-violet-500 to-fuchsia-600',
    flowLabel: 'Decide degree, exam strategy, and college path',
  },
  college: {
    title: 'Execution Module',
    accent: 'from-emerald-500 to-teal-600',
    flowLabel: 'Execute placement strategy and job readiness',
  },
};

export default function ModuleDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await modulesApi.getDashboard();
        setDashboard(response);
      } catch (err: any) {
        setError(err?.response?.data?.error || 'Unable to load module dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Overview', path: '/module-dashboard' },
      { id: 'assessments', label: 'Assessments', path: '/module-assessments' },
      { id: 'recommendation', label: 'Recommendations', path: '/module-recommendation' },
      { id: 'roadmap', label: 'Roadmap', path: '/module-roadmap' },
    ],
    []
  );

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading module dashboard...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <Card className="max-w-xl w-full p-8 bg-white/5 border-white/10">
          <h2 className="text-xl font-semibold mb-3">Module Dashboard Unavailable</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <Button onClick={() => navigate('/onboarding')} className="bg-blue-600 hover:bg-blue-700">
            Reconfigure Module
          </Button>
        </Card>
      </div>
    );
  }

  const moduleKey = dashboard?.module?.id || dashboard?.profile?.education_module || 'class10';
  const theme = MODULE_THEME[moduleKey] || MODULE_THEME.class10;
  const progress = dashboard?.progress?.progress_percent || 0;

  const outputType = dashboard?.recommendation?.output_type || dashboard?.module?.output_type;
  const outputTitle =
    outputType === 'career_clusters'
      ? 'Career Cluster Recommendations'
      : outputType === 'degrees_courses_colleges'
      ? 'Degree/Course/College Recommendations'
      : 'Job Role Recommendations';

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto h-16 px-4 flex items-center justify-between">
          <Link to="/module-dashboard" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold">CareerPath Pro</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="text-slate-300 hover:text-white">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        <ModuleNavTabs tabs={tabs} />

        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Current Workspace</p>
              <h1 className="text-3xl font-bold mt-1">
                <span className={`bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent`}>
                  {theme.title}
                </span>
              </h1>
              <p className="text-slate-300 mt-2">{theme.flowLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Module Progress</p>
              <p className="text-3xl font-semibold">{progress}%</p>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="p-5 bg-white/5 border-white/10 lg:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Assessment Pipeline</h2>
              <Button variant="outline" className="border-white/20" onClick={() => navigate('/module-assessments')}>
                Continue Assessments
              </Button>
            </div>
            <div className="space-y-2">
              {(dashboard?.module?.assessment_order || []).map((key: string, idx: number) => {
                const completed = (dashboard?.assessments || []).some((a: any) => a.assessment_key === key);
                return (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div>
                      <p className="font-medium">{idx + 1}. {dashboard?.module?.assessments?.[key]?.title || key}</p>
                      <p className="text-xs text-slate-400">{dashboard?.module?.assessments?.[key]?.description || 'Assessment module'}</p>
                    </div>
                    <span className={completed ? 'text-emerald-400 text-sm' : 'text-amber-400 text-sm'}>
                      {completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5 bg-white/5 border-white/10">
            <h2 className="text-lg font-semibold mb-2">Recommendation Engine</h2>
            <p className="text-sm text-slate-300 mb-4">{outputTitle}</p>
            {dashboard?.recommendation ? (
              <>
                <p className="text-3xl font-bold mb-1">{Math.round(dashboard.recommendation.confidence_score || 0)}%</p>
                <p className="text-xs text-slate-400 mb-4">Model confidence score</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/module-recommendation')}>
                  View Recommendations
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-400 mb-4">Complete all module assessments to unlock stage-specific outputs.</p>
                <Button className="w-full bg-slate-700 hover:bg-slate-600" onClick={() => navigate('/module-assessments')}>
                  Start Module Flow
                </Button>
              </>
            )}
          </Card>
        </div>

        <Card className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Final Goal
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                Three specialized products in one platform: Discovery (Class 10), Decision (Class 12), and Execution (College).
              </p>
            </div>
            <Button onClick={() => navigate('/module-roadmap')} className="bg-indigo-600 hover:bg-indigo-700">
              Open Module Roadmap
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
