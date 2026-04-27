import { useEffect, useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModuleNavTabs from '@/components/ModuleNavTabs';
import { modulesApi } from '@/services/api';

export default function ModuleRecommendation() {
  const [recommendation, setRecommendation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/module-dashboard' },
    { id: 'assessments', label: 'Assessments', path: '/module-assessments' },
    { id: 'recommendation', label: 'Recommendations', path: '/module-recommendation' },
    { id: 'roadmap', label: 'Roadmap', path: '/module-roadmap' },
  ];

  const load = async () => {
    try {
      const response = await modulesApi.getRecommendation();
      setRecommendation(response.recommendation);
      setError(null);
    } catch (err: any) {
      setRecommendation(null);
      setError(err?.response?.data?.error || 'Recommendation not available yet.');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const forceGenerate = async () => {
    try {
      await modulesApi.generateOutputs();
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Generation failed.');
    }
  };

  const payload = recommendation?.recommendation_payload;
  const outputs = payload?.outputs || {};

  const listItems =
    outputs.career_clusters ||
    outputs.best_degree_recommendations ||
    outputs.best_job_role_recommendations ||
    [];

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <ModuleNavTabs tabs={tabs} />

        <Card className="p-6 bg-white/5 border-white/10">
          <h1 className="text-2xl font-semibold">Stage-Specific Recommendations</h1>
          <p className="text-sm text-slate-300 mt-2">
            Outputs are dynamic by module: Class 10 gets career clusters, Class 12 gets degree/college strategy, College gets job-role pathways.
          </p>
        </Card>

        {!recommendation ? (
          <Card className="p-6 bg-white/5 border-white/10">
            <p className="text-slate-300 mb-4">{error || 'No recommendation yet.'}</p>
            <Button onClick={forceGenerate} className="bg-blue-600 hover:bg-blue-700">Generate from Current Assessments</Button>
          </Card>
        ) : (
          <>
            <Card className="p-6 bg-white/5 border-white/10">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Module</p>
                  <p className="font-medium">{recommendation.module_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Output Type</p>
                  <p className="font-medium">{recommendation.output_type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Confidence</p>
                  <p className="font-medium">{Math.round(recommendation.confidence_score || 0)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-lg font-semibold mb-4">Primary Outputs</h2>
              {listItems.length === 0 ? (
                <p className="text-slate-400">No ranked outputs available yet.</p>
              ) : (
                <div className="space-y-3">
                  {listItems.map((item: any, idx: number) => {
                    const label = item.name || item.degree || item.role || item.exam || `Option ${idx + 1}`;
                    const fit = item.fit || item.match || item.score || 0;
                    return (
                      <div key={`${label}-${idx}`} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <span className="font-medium">{label}</span>
                        <span className="text-blue-300">{fit}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="p-6 bg-white/5 border-white/10">
              <h2 className="text-lg font-semibold mb-3">Detailed Strategy</h2>
              <pre className="text-xs text-slate-300 whitespace-pre-wrap break-words">
                {JSON.stringify(outputs, null, 2)}
              </pre>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
