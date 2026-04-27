import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ModuleNavTabs from '@/components/ModuleNavTabs';
import { modulesApi } from '@/services/api';

function defaultInputs(keys: string[]) {
  const obj: Record<string, number> = {};
  keys.forEach((key) => {
    obj[key] = 60;
  });
  return obj;
}

export default function ModuleAssessments() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [inputs, setInputs] = useState<Record<string, Record<string, number>>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', path: '/module-dashboard' },
    { id: 'assessments', label: 'Assessments', path: '/module-assessments' },
    { id: 'recommendation', label: 'Recommendations', path: '/module-recommendation' },
    { id: 'roadmap', label: 'Roadmap', path: '/module-roadmap' },
  ];

  const loadDashboard = async () => {
    const response = await modulesApi.getDashboard();
    setDashboard(response);

    const nextInputs: Record<string, Record<string, number>> = {};
    const order = response?.module?.assessment_order || [];
    order.forEach((assessmentKey: string) => {
      const schema = response?.module?.assessments?.[assessmentKey]?.input_schema || [];
      nextInputs[assessmentKey] = defaultInputs(schema);
    });
    setInputs(nextInputs);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const setInput = (assessmentKey: string, inputKey: string, value: number) => {
    setInputs((prev) => ({
      ...prev,
      [assessmentKey]: {
        ...(prev[assessmentKey] || {}),
        [inputKey]: value,
      },
    }));
  };

  const submitAssessment = async (assessmentKey: string) => {
    setSavingKey(assessmentKey);
    setStatus(null);

    try {
      const payload = {
        inputs: inputs[assessmentKey] || {},
      };
      await modulesApi.submitAssessment(assessmentKey, payload);
      await loadDashboard();
      setStatus('Assessment saved successfully.');
    } catch (error: any) {
      setStatus(error?.response?.data?.error || 'Failed to submit assessment.');
    } finally {
      setSavingKey(null);
    }
  };

  const completed = dashboard?.assessments || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8 space-y-6">
        <ModuleNavTabs tabs={tabs} />

        <Card className="p-6 bg-white/5 border-white/10">
          <h1 className="text-2xl font-semibold">Module-Specific Assessments</h1>
          <p className="text-sm text-slate-300 mt-2">
            These assessments are unique to your selected education stage and are not shared across other modules.
          </p>
          {status && <p className="text-sm text-emerald-400 mt-3">{status}</p>}
        </Card>

        {(dashboard?.module?.assessment_order || []).map((assessmentKey: string, idx: number) => {
          const meta = dashboard?.module?.assessments?.[assessmentKey] || {};
          const schema = meta.input_schema || [];
          const isDone = completed.some((item: any) => item.assessment_key === assessmentKey);

          return (
            <Card key={assessmentKey} className="p-6 bg-white/5 border-white/10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{idx + 1}. {meta.title || assessmentKey}</h2>
                  <p className="text-sm text-slate-300">{meta.description || 'Assessment module'}</p>
                </div>
                <span className={isDone ? 'text-emerald-400 text-sm' : 'text-amber-400 text-sm'}>{isDone ? 'Completed' : 'Pending'}</span>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {schema.map((inputKey: string) => {
                  const value = inputs?.[assessmentKey]?.[inputKey] ?? 60;
                  return (
                    <label key={inputKey} className="block p-3 rounded-lg bg-white/5">
                      <span className="text-sm capitalize">{inputKey.replace(/_/g, ' ')}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={value}
                        onChange={(e) => setInput(assessmentKey, inputKey, Number(e.target.value))}
                        className="w-full mt-2"
                      />
                      <div className="text-xs text-slate-400 mt-1">{value}/100</div>
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 flex gap-3">
                <Button
                  onClick={() => submitAssessment(assessmentKey)}
                  disabled={savingKey === assessmentKey}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {savingKey === assessmentKey ? 'Submitting...' : isDone ? 'Update Assessment' : 'Submit Assessment'}
                </Button>
              </div>
            </Card>
          );
        })}

        <Card className="p-6 bg-white/5 border-white/10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="font-semibold">Ready for Recommendations?</h3>
              <p className="text-sm text-slate-300">
                Once all required module assessments are submitted, outputs are generated automatically.
              </p>
            </div>
            <Button onClick={() => navigate('/module-recommendation')} className="bg-indigo-600 hover:bg-indigo-700">
              View Module Recommendations
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
