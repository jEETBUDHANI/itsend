import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModuleNavTabs from '@/components/ModuleNavTabs';
import { modulesApi } from '@/services/api';

export default function ModuleRoadmap() {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/module-dashboard' },
    { id: 'assessments', label: 'Assessments', path: '/module-assessments' },
    { id: 'recommendation', label: 'Recommendations', path: '/module-recommendation' },
    { id: 'roadmap', label: 'Roadmap', path: '/module-roadmap' },
  ];

  const load = async () => {
    try {
      const response = await modulesApi.getRoadmap();
      setRoadmap(response.roadmap);
      setError(null);
    } catch (err: any) {
      setRoadmap(null);
      setError(err?.response?.data?.error || 'Roadmap not available yet.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const payload = roadmap?.roadmap_payload || {};
  const steps = payload.steps || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <ModuleNavTabs tabs={tabs} />

        <Card className="p-6 bg-white/5 border-white/10">
          <h1 className="text-2xl font-semibold">Module Roadmap</h1>
          <p className="text-sm text-slate-300 mt-2">
            Roadmap templates are separated by module and generated from module-specific recommendations.
          </p>
        </Card>

        {!roadmap ? (
          <Card className="p-6 bg-white/5 border-white/10">
            <p className="text-slate-300 mb-4">{error || 'No roadmap generated yet.'}</p>
            <Button onClick={load} className="bg-blue-600 hover:bg-blue-700">Refresh</Button>
          </Card>
        ) : (
          <>
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Module</p>
                  <p className="font-medium">{roadmap.module_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Roadmap Title</p>
                  <p className="font-medium">{payload.title || 'Generated roadmap'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Path</p>
                  <p className="font-medium">{payload.recommended_path || 'Adaptive path'}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-lg font-semibold mb-4">Roadmap Steps</h2>
              <div className="space-y-3">
                {steps.map((step: any, idx: number) => (
                  <div key={`${step.phase}-${idx}`} className="p-3 rounded-lg bg-white/5">
                    <p className="font-medium">{step.phase || `Step ${idx + 1}`}</p>
                    <p className="text-sm text-slate-300 mt-1">{step.focus || 'Execution milestone'}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-lg font-semibold mb-3">Milestones</h2>
              <ul className="space-y-2 text-sm text-slate-300">
                {(payload.milestones || []).map((item: string, idx: number) => (
                  <li key={`${idx}-${item}`} className="p-2 rounded bg-white/5">{item}</li>
                ))}
              </ul>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
