import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Github, Moon, Sun, BarChart3, Settings, ChevronUp, Check, BrainCircuit, X, StepForward, HelpCircle, Activity, Globe, Layout, Cpu } from 'lucide-react';
import { Process, AlgorithmType, SchedulerState, AnalysisReport, Language } from './types.ts';
import { INITIAL_PROCESSES, ALGORITHMS, ALGORITHM_EXAMPLES } from './constants.ts';
import { stepSimulation, resetSimulation } from './services/schedulerLogic.ts';
import { analyzeSimulation } from './services/geminiService.ts';
import { ProcessForm } from './components/ProcessForm.tsx';
import { Visualizer } from './components/Visualizer.tsx';
import { StatsTable } from './components/StatsTable.tsx';
import { AlgoHelpModal } from './components/AlgoHelpModal.tsx';
import { AppHelpModal } from './components/AppHelpModal.tsx';
import { Tooltip } from './components/Tooltip.tsx';
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
  const [isAlgoHelpOpen, setIsAlgoHelpOpen] = useState(false);
  const [isAppHelpOpen, setIsAppHelpOpen] = useState(false);

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
  const handleAddProcess = (p: { arrivalTime: number; burstTime: number; priority: number; color: string; name?: string }) => {
    const newProcess: Process = {
      id: `p${baseProcesses.length + 1}`,
      name: p.name || `P${baseProcesses.length + 1}`,
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
    // Only auto-reset if simulation hasn't started yet
    if (schedulerState.currentTime === 0) {
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

    // Only auto-reset if simulation hasn't started yet
    if (schedulerState.currentTime === 0) {
      setSchedulerState(resetSimulation(updatedProcesses, quantum));
    }
  };

  const handleDeleteProcess = (id: string) => {
    const updated = baseProcesses.filter(p => p.id !== id);
    setBaseProcesses(updated);
    // Only auto-reset if simulation hasn't started yet
    if (schedulerState.currentTime === 0) {
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

  const handleLoadExample = () => {
    const examples = ALGORITHM_EXAMPLES[algorithm as keyof typeof ALGORITHM_EXAMPLES];
    if (!examples) return;

    // Create full process objects from examples
    const newProcesses = examples.map((ex, idx) => ({
      id: `p${idx + 1}`,
      name: ex.name,
      arrivalTime: ex.arrivalTime,
      burstTime: ex.burstTime,
      priority: ex.priority,
      color: ex.color,
      remainingTime: ex.burstTime,
      startTime: null,
      completionTime: null,
      waitingTime: 0,
      turnaroundTime: 0,
      state: 'waiting' as const,
    }));

    setIsPlaying(false);
    setBaseProcesses(newProcesses);
    setSchedulerState(resetSimulation(newProcesses, quantum));
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
      // Update favicon for dark mode
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      if (favicon) favicon.href = '/logo-dark.png';
    } else {
      document.documentElement.classList.remove('dark');
      // Update favicon for light mode
      const favicon = document.getElementById('favicon') as HTMLLinkElement;
      if (favicon) favicon.href = '/logo-light.png';
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
      <div className="fixed inset-0 app-background pointer-events-none z-0"></div>

      {/* --- Floating Header --- */}
      <header className="fixed top-4 left-4 right-4 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 shadow-lg rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <img
            src={darkMode ? '/logo-dark.png' : '/logo-light.png'}
            alt="Logo"
            className="w-10 h-10 rounded-lg shadow-lg"
          />
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
            <Cpu size={18} />
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
                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden flex flex-col">
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

          {/* Help Button */}
          <button
            onClick={() => setIsAppHelpOpen(true)}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95"
            title="Help"
          >
            <HelpCircle size={18} />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95"
            title="Toggle Theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2.5 rounded-xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-600 active:scale-95 ${sidebarOpen ? 'text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/20' : 'text-slate-600 dark:text-slate-300'} xl:hidden`}
            title="Toggle Stats"
          >
            <Layout size={18} />
          </button>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="relative pt-28 pb-32 px-4 h-screen flex gap-6 overflow-hidden z-10">

        {/* Left: Input Panel (Desktop) */}
        <div className="w-96 flex-shrink-0 hidden lg:flex flex-col animate-fade-in-left">
          {/* Header to match Right Sidebar */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Cpu className="text-indigo-500" /> {t.processInput}
            </h2>
          </div>

          <div className="flex-grow overflow-hidden">
            <ProcessForm
              processes={baseProcesses}
              onAddProcess={handleAddProcess}
              onUpdateProcess={handleUpdateProcess}
              onDeleteProcess={handleDeleteProcess}
              onClear={handleClear}
              onLoadExample={handleLoadExample}
              algorithm={algorithm}
              disabled={isPlaying && !schedulerState.isFinished}
            />
          </div>
        </div>

        {/* Mobile Input Sidebar (Left) - Mirroring Right Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 w-full md:w-[450px] z-50 
          bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-r border-white/20 dark:border-slate-700/50 shadow-2xl 
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${mobileInputOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:hidden
        `}>
          <div className="h-full flex flex-col p-6 pt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Cpu className="text-indigo-500" /> {t.processes}
              </h2>
              <button
                onClick={() => setMobileInputOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto scrollbar-hide pb-20">
              <ProcessForm
                processes={baseProcesses}
                onAddProcess={(p) => { handleAddProcess(p); setMobileInputOpen(false); }}
                onUpdateProcess={handleUpdateProcess}
                onDeleteProcess={handleDeleteProcess}
                onClear={() => { handleClear(); setMobileInputOpen(false); }}
                onLoadExample={() => { handleLoadExample(); setMobileInputOpen(false); }}
                algorithm={algorithm}
                disabled={isPlaying && !schedulerState.isFinished}
              />
            </div>
          </div>
        </div>

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
        {/* Right: Sliding Sidebar for Stats */}
        <div className={`
          fixed inset-y-0 right-0 w-full md:w-[450px] z-50 
          bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border-l border-white/20 dark:border-slate-700/50 shadow-2xl 
          transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
          xl:static xl:transform-none xl:w-96 xl:bg-transparent xl:dark:bg-transparent xl:backdrop-blur-none xl:border-none xl:shadow-none xl:z-auto xl:translate-x-0 xl:flex flex-col
        `}>
          <div className="h-full flex flex-col p-6 pt-24 xl:p-0 xl:pt-0">
            <div className="flex items-center justify-between mb-8 xl:mb-4">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <BrainCircuit className="text-indigo-500" /> {t.analysisStats}
              </h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors xl:hidden">
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-8 scrollbar-hide pb-20 xl:pb-0">
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
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase">{t.algorithm}</span>
                <button
                  onClick={() => setIsAlgoHelpOpen(true)}
                  className="text-slate-400 hover:text-indigo-500 transition-colors"
                  title="Info Algoritmo"
                >
                  <HelpCircle size={12} />
                </button>
              </div>

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
            <Tooltip content={t.step}>
              <button
                onClick={handleStep}
                disabled={isPlaying || schedulerState.isFinished}
                className="p-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 active:scale-95 group relative"
              >
                <StepForward size={20} />
              </button>
            </Tooltip>

            <Tooltip content={isPlaying ? t.pause : t.start}>
              <button
                onClick={togglePlay}
                disabled={schedulerState.isFinished}
                className={`p-4 rounded-xl text-white shadow-lg transition-all transform active:scale-90 flex items-center justify-center
                      ${isPlaying ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/30' : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'}`}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
              </button>
            </Tooltip>
            {/* Reset Button */}
            <Tooltip content={t.reset}>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/40 dark:hover:text-red-400 transition-all active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-800"
              >
                <RotateCcw size={20} />
              </button>
            </Tooltip>
          </div>

          {/* Speed Control */}
          <div className="border-l border-slate-200 dark:border-slate-700 pl-4 ml-2 flex flex-col w-40 flex-shrink-0">
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

      {/* Algorithm Help Modal */}
      {isAlgoHelpOpen && (
        <AlgoHelpModal
          algorithm={algorithm}
          onClose={() => setIsAlgoHelpOpen(false)}
        />
      )}

      {/* App Help Modal */}
      {isAppHelpOpen && (
        <AppHelpModal onClose={() => setIsAppHelpOpen(false)} />
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
