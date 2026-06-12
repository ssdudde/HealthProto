import React, { useState } from 'react';
import { Upload, FileText, Activity } from 'lucide-react';
import PipelineVisualizer from './PipelineVisualizer';
import Dashboard from './Dashboard';

function App() {
  const [phase, setPhase] = useState('upload'); // 'upload', 'processing', 'dashboard'
  const [dashboardData, setDashboardData] = useState(null);

  const handleStartProcessing = async () => {
    setPhase('processing');
    try {
      const res = await fetch('/api/analyze', { method: 'POST' });
      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProcessingComplete = () => {
    setPhase('dashboard');
  };

  return (
    <div className="min-h-screen bg-navy-900 text-slate-100 font-sans selection:bg-teal-500/30 flex justify-center">
      <div className="w-full max-w-md bg-slate-900 min-h-screen relative shadow-2xl overflow-x-hidden border-x border-navy-800">
      {/* Top Navigation Bar */}
      <nav className="bg-navy-800/50 backdrop-blur-md border-b border-navy-700 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPhase('upload')}>
            <div className="bg-teal-500 text-navy-900 p-1.5 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Medi<span className="text-teal-400">Agent</span></span>
          </div>
          {phase !== 'upload' && (
            <button
              onClick={() => setPhase('upload')}
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </nav>

      <main className="pt-6 pb-24">
        {phase === 'upload' && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-fade-in">
            <div className="text-center mb-8 max-w-md">
              <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Personal Health Navigator
              </h1>
              <p className="text-base text-slate-400">
                Upload your medical reports and let our multi-agent AI system break them down into simple, actionable insights.
              </p>
            </div>

            <div className="w-full max-w-md bg-navy-800/50 border-2 border-dashed border-navy-600 rounded-3xl p-6 text-center transition-all duration-300 hover:border-teal-500/50 hover:bg-navy-800">
              <div className="w-16 h-16 bg-navy-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-200 mb-2">Drag & Drop your Medical Report</h3>
              <p className="text-sm text-slate-400 mb-6">Supports PDF, JPG, PNG (Max 10MB)</p>

              <div className="relative flex items-center py-4 mb-6">
                <div className="flex-grow border-t border-navy-700"></div>
                <span className="flex-shrink-0 mx-4 text-slate-500 text-sm">OR</span>
                <div className="flex-grow border-t border-navy-700"></div>
              </div>

              <button
                onClick={handleStartProcessing}
                className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-400 text-navy-900 font-semibold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(45,212,191,0.2)] text-sm"
              >
                <FileText className="w-4 h-4" />
                Use Sample Blood Report (CBC)
              </button>
            </div>
          </div>
        )}

        {phase === 'processing' && (
          <PipelineVisualizer onComplete={handleProcessingComplete} />
        )}

        {phase === 'dashboard' && dashboardData && (
          <Dashboard data={dashboardData} />
        )}
      </main>
      </div>
    </div>
  );
}

export default App;
