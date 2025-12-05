
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Activity, BrainCircuit, StepForward, Sun, Moon, Layout, X, Plus, Globe, Github, ChevronUp, Check } from 'lucide-react';
import { Process, AlgorithmType, SchedulerState, AnalysisReport, Language } from './types.ts';
import { INITIAL_PROCESSES, ALGORITHMS } from './constants.ts';
import { stepSimulation, resetSimulation } from './services/schedulerLogic.ts';
import { analyzeSimulation } from './services/geminiService.ts';
import { ProcessForm } from './components/ProcessForm.tsx';
import { Visualizer } from './components/Visualizer.tsx';
import { StatsTable } from './components/StatsTable.tsx';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext.tsx';

const MainApp: React.FC = () => {
  // --- Theme & Language State ---
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileInputOpen, setMobileInputOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const { language, setLanguage, t } = useLanguage();

  // --- Config State ---
  const [baseProcesses, setBaseProcesses] = useState<Process[]>(INITIAL_PROCESSES);
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('FCFS');
  const [quantum, setQuantum] = useState(2);
  const [simulationSpeed, setSimulationSpeed] = useState(1000);
  const [isAlgoDropdownOpen, setIsAlgoDropdownOpen] = useState(false);

  // Ref for positioning the fixed dropdown
  const algoBtnRef = useRef<HTMLButtonElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ bottom: 0, left: 0 });

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
    if (schedulerState.currentTime === 0 || schedulerState.isFinished) {
      setSchedulerState(resetSimulation(updated, quantum));
    }
  };

  const handleUpdateProcess = (id: string, updates: Partial<Process>) => {
    const updatedProcesses = baseProcesses.map(p => {
      if (p.id === id) {
        // If burst time is updated, we must update remaining time if simulation hasn't really started/is reset
        const newProcess = { ...p, ...updates };
        if ('burstTime' in updates) {
          newProcess.remainingTime = updates.burstTime as number;
        }
        return newProcess;
      }
      return p;
    });

    setBaseProcesses(updatedProcesses);

    // Auto-update visualizer if we are at the start or finished
    if (schedulerState.currentTime === 0 || schedulerState.isFinished) {
      setSchedulerState(resetSimulation(updatedProcesses, quantum));
    }
  };

  const handleDeleteProcess = (id: string) => {
    const updated = baseProcesses.filter(p => p.id !== id);
    setBaseProcesses(updated);
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

  const toggleAlgoDropdown = () => {
    if (isPlaying && !schedulerState.isFinished) return;

    if (isAlgoDropdownOpen) {
      setIsAlgoDropdownOpen(false);
    } else {
      if (algoBtnRef.current) {
        const rect = algoBtnRef.current.getBoundingClientRect();
        setDropdownPos({
          bottom: window.innerHeight - rect.top + 12, // slightly above the bar
          left: rect.left
        });
        setIsAlgoDropdownOpen(true);
      }
    }
  };

  // --- Effects ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && !schedulerState.isFinished) {
      interval = setInterval(handleStep, simulationSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, schedulerState.isFinished, handleStep, simulationSpeed]);

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, quantum]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Open sidebar automatically on large screens
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    }
  }, []);

  const handleAnalyze = async () => {
    if (!schedulerState.isFinished) return;
    setAnalysis({ markdown: '', loading: true });
    const report = await analyzeSimulation(algorithm, schedulerState.processes, schedulerState.currentTime, language);
    setAnalysis({ markdown: report, loading: false });
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-inter ${darkMode ? 'dark bg-dark-bg' : 'bg-slate-50'}`}>
      <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0"></div>

      {/* --- Floating Header --- */}
      <header className="fixed top-4 left-4 right-4 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-600/30 text-white animate-pulse-slow">
            <Activity size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight hidden sm:block">{t.title}</h1>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white leading-tight sm:hidden">CPU Sim</h1>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Add Process Button */}
          <button
            onClick={() => setMobileInputOpen(true)}
            className="lg:hidden p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800"
          >
            <Plus size={18} />
          </button>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

          {/* GitHub Link */}
          <a
            href="https://github.com/your-username/cpu-scheduler" // Replace with actual repo URL
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95 hidden sm:flex items-center justify-center"
            title="GitHub Repo"
          >
            <Github size={18} />
          </a>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95 flex items-center gap-2"
            >
              <Globe size={18} />
              <span className="text-xs font-bold">{language}</span>
            </button>

            {langMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setLangMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-32 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-xl shadow-xl z-20 overflow-hidden flex flex-col">
                  <button
                    onClick={() => { setLanguage('IT'); setLangMenuOpen(false); }}
                    className={`px-4 py-2 text-left text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${language === 'IT' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    Italiano
                  </button>
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800"></div>
                  <button
                    onClick={() => { setLanguage('EN'); setLangMenuOpen(false); }}
                    className={`px-4 py-2 text-left text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors ${language === 'EN' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    English
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95 ${sidebarOpen ? 'text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20' : 'text-slate-600 dark:text-slate-300'}`}
            title="Toggle Stats"
          >
            <Layout size={18} />
          </button>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="relative pt-28 pb-32 px-4 h-screen flex gap-6 overflow-hidden z-10">

        {/* Left: Input Panel (Desktop) */}
        <div className="w-80 flex-shrink-0 hidden lg:flex flex-col gap-4 animate-fade-in-left">
          <ProcessForm
            processes={baseProcesses}
            onAddProcess={handleAddProcess}
            onUpdateProcess={handleUpdateProcess}
            onDeleteProcess={handleDeleteProcess}
            onClear={handleClear}
            disabled={isPlaying && !schedulerState.isFinished}
          />
        </div>

        {/* Mobile Input Drawer */}
        {mobileInputOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in-up lg:hidden">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-2 shadow-2xl relative">
              <button
                onClick={() => setMobileInputOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={20} />
              </button>
              <ProcessForm
                processes={baseProcesses}
                onAddProcess={(p) => { handleAddProcess(p); setMobileInputOpen(false); }}
                onUpdateProcess={handleUpdateProcess}
                onDeleteProcess={handleDeleteProcess}
                onClear={() => { handleClear(); setMobileInputOpen(false); }}
                disabled={isPlaying && !schedulerState.isFinished}
              />
            </div>
          </div>
        )}

        {/* Center: Visualization Canvas */}
        <div className="flex-grow overflow-y-auto scrollbar-hide pb-20 rounded-2xl">
          <Visualizer
            ganttChart={schedulerState.ganttChart}
            currentTime={schedulerState.currentTime}
            currentProcessId={schedulerState.currentProcessId}
            processes={schedulerState.processes}
            readyQueue={schedulerState.readyQueue}
          />
        </div>

        {/* Right: Sliding Sidebar for Stats */}
        <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl z-50 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col p-6 pt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BrainCircuit className="text-indigo-500" /> {t.analysisStats}
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-8 scrollbar-hide pb-20">
              <StatsTable processes={schedulerState.processes} />

              {/* AI Analysis Card */}
              <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm uppercase">{t.aiInsight}</h3>
                  {schedulerState.isFinished && !analysis && (
                    <button onClick={handleAnalyze} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95">
                      {t.generate}
                    </button>
                  )}
                </div>

                {!schedulerState.isFinished ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed text-center italic">{t.runToUnlock}</p>
                  </div>
                ) : analysis?.loading ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-indigo-500 font-medium animate-pulse">{t.consulting}</span>
                  </div>
                ) : analysis?.markdown ? (
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-line">{analysis.markdown}</div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500 text-center">{t.readyToAnalyze}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- Bottom Toolbar Dock --- */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/20 dark:border-slate-700/50 shadow-2xl rounded-2xl p-2.5 flex items-center gap-4 transition-all hover:scale-[1.02] duration-300 max-w-full overflow-x-auto scrollbar-hide">

          {/* Algorithm Select - Custom Dropdown */}
          <div className="flex items-center gap-4 border-r border-slate-200 dark:border-slate-700 pr-4 mr-2 flex-shrink-0">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-slate-400 uppercase mb-0.5">{t.algorithm}</span>

              <button
                ref={algoBtnRef}
                onClick={toggleAlgoDropdown}
                disabled={isPlaying && !schedulerState.isFinished}
                className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-white outline-none min-w-[140px] justify-between disabled:opacity-50"
              >
                <span className="truncate">{t.algoNames[algorithm]}</span>
                <ChevronUp size={14} className={`transition-transform duration-300 ${isAlgoDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Quantum Input - Inline */}
            {algorithm === 'RR' && (
              <div className="flex flex-col w-16 animate-fade-in-left border-l border-slate-200 dark:border-slate-700 pl-4">
                <label className="text-[9px] text-slate-400 font-bold mb-0.5 whitespace-nowrap">{t.timeQuantum}</label>
                <input
                  type="number" min="1" value={quantum}
                  onChange={(e) => setQuantum(Number(e.target.value))}
                  className="w-full bg-slate-100 dark:bg-slate-900 rounded p-1 text-xs text-slate-700 dark:text-white outline-none border border-transparent focus:border-indigo-500 font-mono text-center"
                />
              </div>
            )}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleStep}
              disabled={isPlaying || schedulerState.isFinished}
              className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 active:scale-95 group relative"
            >
              <StepForward size={20} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{t.step}</span>
            </button>

            <button
              onClick={togglePlay}
              disabled={schedulerState.isFinished}
              className={`p-4 rounded-xl text-white shadow-lg transition-all transform active:scale-90 flex items-center justify-center
                    ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'}`}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            <button
              onClick={handleReset}
              className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 group relative"
            >
              <RotateCcw size={20} />
              <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{t.reset}</span>
            </button>
          </div>

          {/* Speed Control */}
          <div className="border-l border-slate-200 dark:border-slate-700 pl-4 ml-2 flex flex-col w-24 flex-shrink-0">
            <span className="text-[9px] font-bold text-slate-400 uppercase mb-1">{t.speed}: {simulationSpeed}ms</span>
            <input
              type="range" min="100" max="2000" step="100"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* --- Fixed Overlays --- */}

      {/* Algorithm Dropdown - Portaled out of the clipped toolbar */}
      {isAlgoDropdownOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-black/5 backdrop-blur-[1px]" onClick={() => setIsAlgoDropdownOpen(false)}></div>
          <div
            className="fixed z-50 w-80 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-fade-in-up origin-bottom-left"
            style={{
              left: dropdownPos.left,
              bottom: dropdownPos.bottom
            }}
          >
            <div className="p-2 space-y-1">
              <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-bold text-slate-500 select-none">
                {t.algorithm}
              </div>
              {ALGORITHMS.map(a => {
                const isSelected = algorithm === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAlgorithm(a.id as AlgorithmType);
                      setIsAlgoDropdownOpen(false);
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 text-xs font-medium
                            ${isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }
                          `}
                  >
                    <span>{t.algoNames[a.id as keyof typeof t.algoNames]}</span>
                    {isSelected && <Check size={16} className="text-white animate-fade-in-left" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

export default App;
