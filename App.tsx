import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Activity, BrainCircuit, Timer, Trash2 } from 'lucide-react';
import { Process, AlgorithmType, SchedulerState, AnalysisReport } from './types';
import { INITIAL_PROCESSES, ALGORITHMS } from './constants';
import { stepSimulation, resetSimulation } from './services/schedulerLogic';
import { analyzeSimulation } from './services/geminiService';
import { ProcessForm } from './components/ProcessForm';
import { Visualizer } from './components/Visualizer';
import { StatsTable } from './components/StatsTable';

const App: React.FC = () => {
  // --- Config State ---
  const [baseProcesses, setBaseProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms per step

  // --- Simulation State ---
  const [schedulerState, setSchedulerState] = useState<SchedulerState>(
    resetSimulation(INITIAL_PROCESSES, 2)
  );
  const [isPlaying, setIsPlaying] = useState(false);

  // --- Analysis State ---
  const [analysis, setAnalysis] = useState<AnalysisReport | null>(null);

  // --- Handlers ---
  const handleAddProcess = (p: { arrivalTime: number; burstTime: number; priority: number; color: string }) => {
    const newProcess: Process = {
      id: `p${baseProcesses.length + 1}`,
      name: `P${baseProcesses.length + 1}`,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      priority: p.priority,
      color: p.color,
      remainingTime: p.burstTime,
      startTime: null,
      completionTime: null,
      waitingTime: 0,
      turnaroundTime: 0,
      state: 'waiting',
    };
    
    const updated = [...baseProcesses, newProcess];
    setBaseProcesses(updated);
    // Only reset if simulation hasn't started or is finished to avoid jarring UX
    if (schedulerState.currentTime === 0 || schedulerState.isFinished) {
        setSchedulerState(resetSimulation(updated, quantum));
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSchedulerState(resetSimulation(baseProcesses, quantum));
    setAnalysis(null);
  };

  const handleClear = () => {
      setIsPlaying(false);
      setBaseProcesses([]);
      setSchedulerState(resetSimulation([], quantum));
      setAnalysis(null);
  };

  const togglePlay = () => {
    if (schedulerState.isFinished) return;
    setIsPlaying(!isPlaying);
  };

  const handleStep = useCallback(() => {
    if (schedulerState.isFinished) {
      setIsPlaying(false);
      return;
    }
    setSchedulerState(prev => stepSimulation(prev, algorithm));
  }, [algorithm, schedulerState.isFinished]);

  // --- Effects ---
  
  // Auto-play timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !schedulerState.isFinished) {
      interval = setInterval(handleStep, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, schedulerState.isFinished, handleStep, simulationSpeed]);

  // Reset simulation when algo/quantum changes
  useEffect(() => {
     handleReset();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, quantum]);


  // --- AI Analysis Handler ---
  const handleAnalyze = async () => {
    if (!schedulerState.isFinished) return;
    setAnalysis({ markdown: '', loading: true });
    
    // We pass the completed processes from scheduler state as they have the calculated times
    const report = await analyzeSimulation(algorithm, schedulerState.processes, schedulerState.currentTime);
    setAnalysis({ markdown: report, loading: false });
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">CPU Scheduler</h1>
              <p className="text-xs text-slate-500">Interactive Algorithm Visualizer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://github.com/google-gemini/cookbook" target="_blank" rel="noreferrer" className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
               Educational Tool
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        
        {/* Controls Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Configuration Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-sm font-bold text-slate-800 uppercase mb-4 flex items-center gap-2">
                <Timer size={16} /> Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Algorithm</label>
                  <select 
                    value={algorithm} 
                    onChange={(e) => setAlgorithm(e.target.value as AlgorithmType)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                    disabled={isPlaying && !schedulerState.isFinished}
                  >
                    {ALGORITHMS.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                {algorithm === 'RR' && (
                  <div className="animate-fade-in">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Time Quantum</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={quantum} 
                      onChange={(e) => setQuantum(parseInt(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                      disabled={isPlaying}
                    />
                  </div>
                )}

                 <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Simulation Speed (ms)</label>
                    <input 
                      type="range" 
                      min="100" 
                      max="2000" 
                      step="100"
                      value={simulationSpeed}
                      onChange={(e) => setSimulationSpeed(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>Fast (100ms)</span>
                      <span>Slow (2s)</span>
                    </div>
                 </div>
              </div>
            </div>

            <ProcessForm onAddProcess={handleAddProcess} disabled={isPlaying && !schedulerState.isFinished} />
            
             <button 
                onClick={handleClear}
                disabled={isPlaying}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 p-3 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-red-100"
              >
                <Trash2 size={16} /> Clear All Processes
              </button>
          </div>

          {/* Visualization & Playback */}
          <div className="lg:col-span-8 space-y-6">
             <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200 sticky top-20 z-20">
                <div className="flex items-center gap-2">
                    <button 
                      onClick={togglePlay}
                      disabled={schedulerState.isFinished}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 shadow-md
                        ${schedulerState.isFinished ? 'bg-slate-400 cursor-not-allowed' : 
                          isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                      {isPlaying ? <><Pause size={18} /> Pause</> : <><Play size={18} /> {schedulerState.currentTime > 0 ? 'Resume' : 'Start'}</>}
                    </button>

                    <button 
                      onClick={handleStep}
                      disabled={isPlaying || schedulerState.isFinished}
                      className="px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
                    >
                      Step
                    </button>

                    <button 
                      onClick={handleReset}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Reset Simulation"
                    >
                      <RotateCcw size={20} />
                    </button>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Time Elapsed</div>
                  <div className="text-2xl font-mono font-bold text-slate-800">{schedulerState.currentTime} <span className="text-sm font-normal text-slate-500">units</span></div>
                </div>
             </div>

             <Visualizer 
                ganttChart={schedulerState.ganttChart}
                currentTime={schedulerState.currentTime}
                currentProcessId={schedulerState.currentProcessId}
                processes={schedulerState.processes}
                readyQueue={schedulerState.readyQueue}
             />
          </div>
        </section>

        {/* Stats & Analysis */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <StatsTable processes={schedulerState.processes} />
           
           <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
                 <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-white">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <BrainCircuit className="text-indigo-600" /> AI Analysis
                    </h3>
                    {schedulerState.isFinished && !analysis && (
                      <button 
                        onClick={handleAnalyze}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-full font-medium transition-colors shadow-sm"
                      >
                        Generate Report
                      </button>
                    )}
                 </div>
                 
                 <div className="p-6 flex-grow">
                    {!schedulerState.isFinished ? (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                          <Activity size={48} className="mb-4 opacity-20" />
                          <p>Complete the simulation to unlock AI analysis of the scheduling performance.</p>
                       </div>
                    ) : analysis?.loading ? (
                       <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
                          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                          <p className="text-slate-500 animate-pulse">Consulting Gemini...</p>
                       </div>
                    ) : analysis?.markdown ? (
                       <div className="prose prose-sm prose-slate max-w-none">
                          <div className="whitespace-pre-line leading-relaxed text-slate-700">
                            {analysis.markdown}
                          </div>
                       </div>
                    ) : (
                       <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8">
                          <p>Click "Generate Report" to get insights on wait times and efficiency.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </section>

      </main>
    </div>
  );
};

export default App;